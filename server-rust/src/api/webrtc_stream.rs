use axum::{
    extract::{
        State,
        ws::{Message as WsMessage, WebSocket, WebSocketUpgrade},
    },
    http::HeaderMap,
    response::IntoResponse,
};
use bytes::Bytes;
use rtc::{
    ice::{mdns::MulticastDnsMode, network_type::NetworkType},
    interceptor::{Attribute, Interceptor, Packet, Slot, StreamInfo, TaggedPacket},
    peer_connection::configuration::media_engine::MIME_TYPE_H264,
    rtcp,
    rtcp::payload_feedbacks::{
        full_intra_request::FullIntraRequest, picture_loss_indication::PictureLossIndication,
    },
    rtp::{
        packetizer::{Packetizer, new_packetizer},
        sequence::new_random_sequencer,
    },
    rtp_transceiver::{
        PayloadType,
        rtp_sender::{
            RTCRtpCodec, RTCRtpCodingParameters, RTCRtpEncodingParameters,
            RTCRtpHeaderExtensionCapability, RtpCodecKind,
        },
    },
    sansio::Protocol,
};
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, VecDeque},
    fmt,
    sync::{
        Arc, LazyLock, OnceLock,
        atomic::{AtomicBool, AtomicU64, Ordering},
    },
    time::{Duration, Instant},
};
use tokio::{
    sync::{Mutex, mpsc},
    time,
};
use tracing::{debug, info, warn};
use webrtc::{
    media_stream::{
        MediaStreamTrack,
        track_local::{TrackLocal, TrackLocalEvent, static_rtp::TrackLocalStaticRTP},
    },
    peer_connection::{
        MediaEngine, PeerConnection, PeerConnectionBuilder, PeerConnectionEventHandler,
        RTCConfigurationBuilder, RTCIceCandidateInit, RTCIceServer, RTCPeerConnectionIceEvent,
        RTCPeerConnectionState, RTCSessionDescription, Registry, SettingEngineBuilder,
        SrtpProtectionProfile, register_default_interceptors,
    },
    rtp_transceiver::{RTCRtpTransceiverDirection, RtpSender},
};

use crate::{
    AppError, Result,
    api::{
        stream::{
            CAPTURE_MODE_H264, H264ConsumerKind, current_h264_screen, h264_frame_duration,
            is_h264_capture_active, request_h264_keyframe, subscribe_h264, update_capture_status,
        },
        system_firewall,
    },
    auth::token::fill_random,
    config::Config,
    hdmi_idle,
    http::proxy::ClientInfo,
    state::AppState,
    ws::origin::validate_ws_origin,
};

const SIGNAL_BUFFER: usize = 64;
const VIDEO_IDLE_CHECK: Duration = Duration::from_secs(1);
const PLAYOUT_DELAY_URI: &str = "http://www.webrtc.org/experiments/rtp-hdrext/playout-delay";
// Minimum and maximum delay 0: render frames as they arrive.
const PLAYOUT_DELAY_ZERO: [u8; 3] = [0; 3];
const H264_CLOCK_RATE: u32 = 90_000;
// The MTU TrackLocalStaticSample uses.
const RTP_MTU: usize = 1200;
// After the default interceptors, which all sit below 14000.
const KEYFRAME_REQUEST_SLOT: usize = 14_000;

static WEBRTC_MANAGER: LazyLock<WebRtcManager> = LazyLock::new(WebRtcManager::new);
static H264_WEBRTC_FIRST_SUCCESS_LOGGED: AtomicBool = AtomicBool::new(false);

pub async fn h264_webrtc_stream(
    State(state): State<AppState>,
    client: ClientInfo,
    headers: HeaderMap,
    ws: WebSocketUpgrade,
) -> Result<impl IntoResponse> {
    if system_firewall::webrtc_blocked_by_firewall() {
        return Err(AppError::Forbidden(
            system_firewall::webrtc_blocked_message().to_string(),
        ));
    }

    if !validate_ws_origin(&headers, &state.config, &client) {
        return Err(AppError::Forbidden("invalid websocket origin".to_string()));
    }

    Ok(ws.on_upgrade(move |socket| handle_h264_webrtc_socket(socket, Arc::clone(&state.config))))
}

async fn handle_h264_webrtc_socket(mut socket: WebSocket, config: Arc<Config>) {
    let (signal_tx, mut signal_rx) = mpsc::channel(SIGNAL_BUFFER);
    let client = match WebRtcClient::new(&config, signal_tx.clone()).await {
        Ok(client) => client,
        Err(err) => {
            warn!(error = ?err, "failed to create h264 webrtc client");
            return;
        }
    };

    manager().add_client(Arc::clone(&client)).await;
    debug!(client_id = client.id, "h264 webrtc websocket connected");

    if let Err(err) = send_ice_servers(&signal_tx, &config).await {
        warn!(error = ?err, "failed to send h264 webrtc ICE servers");
        manager().remove_client(client.id).await;
        client.close().await;
        return;
    }

    loop {
        tokio::select! {
            Some(signal) = signal_rx.recv() => {
                let payload = match serde_json::to_string(&signal) {
                    Ok(payload) => payload,
                    Err(err) => {
                        warn!(error = ?err, "failed to serialize h264 webrtc signal");
                        continue;
                    }
                };
                if socket.send(WsMessage::Text(payload.into())).await.is_err() {
                    break;
                }
            }
            message = socket.recv() => {
                let message = match message {
                    Some(Ok(message)) => message,
                    Some(Err(err)) => {
                        debug!(error = ?err, "h264 webrtc websocket read failed");
                        break;
                    }
                    None => break,
                };

                match message {
                    WsMessage::Text(text) => {
                        if let Err(err) = handle_signal_message(&client, &signal_tx, text.as_str()).await {
                            warn!(error = ?err, "failed to handle h264 webrtc signal");
                        }
                    }
                    WsMessage::Binary(data) => {
                        if let Ok(text) = std::str::from_utf8(&data)
                            && let Err(err) = handle_signal_message(&client, &signal_tx, text).await {
                                warn!(error = ?err, "failed to handle h264 webrtc binary signal");
                            }
                    }
                    WsMessage::Ping(data) => {
                        if socket.send(WsMessage::Pong(data)).await.is_err() {
                            break;
                        }
                    }
                    WsMessage::Close(_) => break,
                    WsMessage::Pong(_) => {}
                }
            }
        }
    }

    manager().remove_client(client.id).await;
    client.close().await;
    debug!(client_id = client.id, "h264 webrtc websocket disconnected");
}

async fn handle_signal_message(
    client: &Arc<WebRtcClient>,
    signal_tx: &mpsc::Sender<SignalMessage>,
    raw: &str,
) -> Result<()> {
    let message: SignalMessage =
        serde_json::from_str(raw).map_err(|err| AppError::BadRequest(err.to_string()))?;

    match message.event.as_str() {
        "video-offer" => handle_video_offer(client, signal_tx, &message.data).await,
        "video-candidate" => handle_video_candidate(client, &message.data).await,
        "heartbeat" => send_signal(signal_tx, "heartbeat", "").await,
        event => {
            debug!(event, "unhandled h264 webrtc signal");
            Ok(())
        }
    }
}

async fn handle_video_offer(
    client: &Arc<WebRtcClient>,
    signal_tx: &mpsc::Sender<SignalMessage>,
    data: &str,
) -> Result<()> {
    // 0.21 has no signaling_state(); a pending description means not stable.
    if client.peer.pending_remote_description().await.is_some()
        || client.peer.pending_local_description().await.is_some()
    {
        return Err(AppError::Conflict(
            "video signaling is not stable".to_string(),
        ));
    }

    let offer: RTCSessionDescription =
        serde_json::from_str(data).map_err(|err| AppError::BadRequest(err.to_string()))?;
    client
        .peer
        .set_remote_description(offer)
        .await
        .map_err(|err| webrtc_error("set remote video offer", err))?;

    let answer = client
        .peer
        .create_answer(None)
        .await
        .map_err(|err| webrtc_error("create video answer", err))?;
    client
        .peer
        .set_local_description(answer.clone())
        .await
        .map_err(|err| webrtc_error("set local video answer", err))?;

    let data = serde_json::to_string(&answer)
        .map_err(|err| AppError::Internal(format!("serialize video answer: {err}")))?;
    send_signal(signal_tx, "video-answer", data).await
}

async fn handle_video_candidate(client: &Arc<WebRtcClient>, data: &str) -> Result<()> {
    let candidate: RTCIceCandidateInit =
        serde_json::from_str(data).map_err(|err| AppError::BadRequest(err.to_string()))?;
    client
        .peer
        .add_ice_candidate(candidate)
        .await
        .map_err(|err| webrtc_error("add video ICE candidate", err))
}

async fn send_ice_servers(signal_tx: &mpsc::Sender<SignalMessage>, config: &Config) -> Result<()> {
    let data = serde_json::to_string(&client_ice_servers(config))
        .map_err(|err| AppError::Internal(format!("serialize ICE servers: {err}")))?;
    send_signal(signal_tx, "ice-servers", data).await
}

async fn send_signal(
    signal_tx: &mpsc::Sender<SignalMessage>,
    event: impl Into<String>,
    data: impl Into<String>,
) -> Result<()> {
    signal_tx
        .send(SignalMessage {
            event: event.into(),
            data: data.into(),
        })
        .await
        .map_err(|_| AppError::Internal("h264 webrtc signal channel closed".to_string()))
}

struct WebRtcManager {
    clients: Mutex<HashMap<u64, Arc<WebRtcClient>>>,
    next_client_id: AtomicU64,
    video_sending: AtomicBool,
}

impl WebRtcManager {
    fn new() -> Self {
        Self {
            clients: Mutex::new(HashMap::new()),
            next_client_id: AtomicU64::new(1),
            video_sending: AtomicBool::new(false),
        }
    }

    fn next_client_id(&self) -> u64 {
        self.next_client_id.fetch_add(1, Ordering::Relaxed)
    }

    async fn add_client(&self, client: Arc<WebRtcClient>) {
        let mut clients = self.clients.lock().await;
        clients.insert(client.id, client);
        hdmi_idle::report_viewers("webrtc", clients.len());
    }

    async fn remove_client(&self, client_id: u64) {
        let mut clients = self.clients.lock().await;
        clients.remove(&client_id);
        hdmi_idle::report_viewers("webrtc", clients.len());
    }

    async fn clients(&self) -> Vec<Arc<WebRtcClient>> {
        let clients = self.clients.lock().await;
        clients.values().cloned().collect()
    }

    fn start_video_stream(&'static self) {
        if self
            .video_sending
            .compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
            .is_ok()
        {
            tokio::spawn(async move {
                self.send_video_stream().await;
            });
            debug!("start sending h264 webrtc stream");
        }
    }

    async fn send_video_stream(&'static self) {
        struct SendingGuard(&'static AtomicBool);
        impl Drop for SendingGuard {
            fn drop(&mut self) {
                self.0.store(false, Ordering::Release);
            }
        }
        let _guard = SendingGuard(&self.video_sending);

        // The capture is shared with the direct stream; frames arrive paced by it.
        let mut frames = subscribe_h264(H264ConsumerKind::WebRtc);

        loop {
            // Wake up regularly so a source that stopped delivering does not keep
            // this task alive after the last client left.
            let frame = match time::timeout(VIDEO_IDLE_CHECK, frames.next()).await {
                Ok(Some(frame)) => Some(frame),
                Ok(None) => return,
                Err(_) => None,
            };

            let clients = self.clients().await;
            if clients.is_empty() {
                debug!("stop sending h264 webrtc stream");
                return;
            }

            if !is_h264_capture_active() {
                update_capture_status(CAPTURE_MODE_H264, -8);
                debug!("stop sending h264 webrtc stream because h264 capture is disabled");
                return;
            }

            let Some(frame) = frame else {
                continue;
            };

            if !H264_WEBRTC_FIRST_SUCCESS_LOGGED.swap(true, Ordering::Relaxed) {
                info!(bytes = frame.data.len(), "sending first h264 webrtc frame");
            }

            let samples = (h264_frame_duration(current_h264_screen().fps).as_secs_f64()
                * f64::from(H264_CLOCK_RATE)) as u32;
            let now = Instant::now();

            for client in clients {
                // Not connected yet: the payload type is known only after negotiation.
                let Some(sending) = client.media.sending.get() else {
                    continue;
                };
                if let Err(err) = client
                    .media
                    .write_frame(sending, now, &frame.data, samples)
                    .await
                {
                    warn!(
                        client_id = client.id,
                        error = ?err,
                        "failed to write h264 webrtc sample"
                    );
                    self.remove_client(client.id).await;
                    client.close().await;
                }
            }
        }
    }
}

struct WebRtcClient {
    id: u64,
    peer: Arc<dyn PeerConnection>,
    media: Arc<ClientMedia>,
}

/// The sending side of one client, shared with its event handler.
struct ClientMedia {
    track: Arc<TrackLocalStaticRTP>,
    ssrc: u32,
    sender: OnceLock<Arc<dyn RtpSender>>,
    sending: OnceLock<RtpSending>,
}

/// Built once the peer connects, from what the browser negotiated. The track keeps the
/// pre-negotiation extension ids, so packets are made and tagged here instead.
struct RtpSending {
    packetizer: std::sync::Mutex<Box<dyn Packetizer>>,
    playout_delay_id: Option<u8>,
}

impl ClientMedia {
    async fn write_frame(
        &self,
        sending: &RtpSending,
        now: Instant,
        data: &Bytes,
        samples: u32,
    ) -> rtc::shared::error::Result<()> {
        let packets = sending
            .packetizer
            .lock()
            .unwrap_or_else(|err| err.into_inner())
            .packetize(now, data, samples)?;
        for mut packet in packets {
            if let Some(id) = sending.playout_delay_id {
                packet
                    .header
                    .set_extension(id, Bytes::from_static(&PLAYOUT_DELAY_ZERO))?;
            }
            self.track.write_rtp(packet).await?;
        }
        Ok(())
    }
}

impl WebRtcClient {
    async fn new(config: &Config, signal_tx: mpsc::Sender<SignalMessage>) -> Result<Arc<Self>> {
        let mut media_engine = MediaEngine::default();
        media_engine
            .register_default_codecs()
            .map_err(|err| webrtc_error("register default codecs", err))?;
        media_engine
            .register_header_extension(
                RTCRtpHeaderExtensionCapability {
                    uri: PLAYOUT_DELAY_URI.to_string(),
                },
                RtpCodecKind::Video,
                Some(RTCRtpTransceiverDirection::Sendonly),
            )
            .map_err(|err| webrtc_error("register playout delay extension", err))?;

        let registry = register_default_interceptors(Registry::new(), &mut media_engine)
            .map_err(|err| webrtc_error("register default interceptors", err))?
            .with(
                Slot::from(KEYFRAME_REQUEST_SLOT),
                KeyframeRequestForwarder::default(),
            );

        let setting_engine = SettingEngineBuilder::new()
            .with_network_types(vec![NetworkType::Udp4])
            .with_multicast_dns_mode(MulticastDnsMode::Disabled)
            .with_srtp_protection_profiles(vec![
                SrtpProtectionProfile::Srtp_Aead_Aes_128_Gcm,
                SrtpProtectionProfile::Srtp_Aes128_Cm_Hmac_Sha1_80,
            ])
            .build();

        let ssrc = random_ssrc();
        let track = Arc::new(TrackLocalStaticRTP::new(MediaStreamTrack::new(
            "pion-video".to_string(),
            "video".to_string(),
            "video".to_string(),
            RtpCodecKind::Video,
            vec![RTCRtpEncodingParameters {
                rtp_coding_parameters: RTCRtpCodingParameters {
                    ssrc: Some(ssrc),
                    ..Default::default()
                },
                codec: h264_codec(),
                ..Default::default()
            }],
        )));
        let media = Arc::new(ClientMedia {
            track,
            ssrc,
            sender: OnceLock::new(),
            sending: OnceLock::new(),
        });

        let peer: Arc<dyn PeerConnection> = Arc::new(
            PeerConnectionBuilder::new()
                .with_configuration(
                    RTCConfigurationBuilder::new()
                        .with_ice_servers(rtc_ice_servers(config))
                        .build(),
                )
                .with_media_engine(media_engine)
                .with_setting_engine(setting_engine)
                .with_interceptor_registry(registry)
                .with_handler(Arc::new(PeerHandler {
                    signal_tx,
                    media: Arc::clone(&media),
                }))
                .with_udp_addrs(vec!["0.0.0.0:0"])
                .build()
                .await
                .map_err(|err| webrtc_error("create h264 peer connection", err))?,
        );

        let sender = peer
            .add_track(Arc::clone(&media.track) as Arc<dyn TrackLocal>)
            .await
            .map_err(|err| webrtc_error("add h264 track", err))?;
        let _ = media.sender.set(sender);

        Ok(Arc::new(Self {
            id: manager().next_client_id(),
            peer,
            media,
        }))
    }

    async fn close(&self) {
        if let Err(err) = self.peer.close().await {
            debug!(client_id = self.id, error = ?err, "failed to close h264 peer");
        }
    }
}

// The track's codec only selects H264; the browser's offer picks the profile.
fn h264_codec() -> RTCRtpCodec {
    RTCRtpCodec {
        mime_type: MIME_TYPE_H264.to_string(),
        clock_rate: H264_CLOCK_RATE,
        ..Default::default()
    }
}

fn random_ssrc() -> u32 {
    let mut bytes = [0_u8; 4];
    fill_random(&mut bytes);
    u32::from_ne_bytes(bytes)
}

struct PeerHandler {
    signal_tx: mpsc::Sender<SignalMessage>,
    media: Arc<ClientMedia>,
}

// The driver awaits these inline, so anything that calls back into the peer is spawned.
#[async_trait::async_trait]
impl PeerConnectionEventHandler for PeerHandler {
    async fn on_ice_candidate(&self, event: RTCPeerConnectionIceEvent) {
        let candidate = match event.candidate.to_json() {
            Ok(candidate) => candidate,
            Err(err) => {
                warn!(error = ?err, "failed to convert h264 ICE candidate");
                return;
            }
        };
        let data = match serde_json::to_string(&candidate) {
            Ok(data) => data,
            Err(err) => {
                warn!(error = ?err, "failed to serialize h264 ICE candidate");
                return;
            }
        };
        let signal_tx = self.signal_tx.clone();
        tokio::spawn(async move {
            let _ = send_signal(&signal_tx, "video-candidate", data).await;
        });
    }

    // Connected means DTLS is done too; SRTP has no keys before that.
    async fn on_connection_state_change(&self, state: RTCPeerConnectionState) {
        if state == RTCPeerConnectionState::Connected {
            tokio::spawn(start_client_media(Arc::clone(&self.media)));
        }
    }
}

async fn start_client_media(media: Arc<ClientMedia>) {
    if media.sending.get().is_none() {
        let Some(sender) = media.sender.get() else {
            return;
        };
        let sending = match negotiated_sending(sender.as_ref(), media.ssrc).await {
            Ok(sending) => sending,
            Err(err) => {
                warn!(error = ?err, "failed to set up h264 rtp sending");
                return;
            }
        };
        if media.sending.set(sending).is_ok() {
            tokio::spawn(read_rtcp(Arc::clone(&media.track)));
        }
    }
    manager().start_video_stream();
}

async fn negotiated_sending(sender: &dyn RtpSender, ssrc: u32) -> Result<RtpSending> {
    let parameters = sender
        .get_parameters()
        .await
        .map_err(|err| webrtc_error("read h264 sender parameters", err))?
        .rtp_parameters;
    let payload_type: PayloadType = parameters
        .codecs
        .iter()
        .find(|codec| {
            codec
                .rtp_codec
                .mime_type
                .eq_ignore_ascii_case(MIME_TYPE_H264)
        })
        .map(|codec| codec.payload_type)
        .ok_or_else(|| AppError::Internal("no negotiated h264 codec".to_string()))?;
    // Firefox does not offer playout delay; the packets then go without it.
    let playout_delay_id = parameters
        .header_extensions
        .iter()
        .find(|ext| ext.uri == PLAYOUT_DELAY_URI)
        .and_then(|ext| u8::try_from(ext.id).ok());
    let payloader = h264_codec()
        .payloader()
        .map_err(|err| webrtc_error("create h264 payloader", err))?;
    let packetizer = new_packetizer(
        Instant::now(),
        RTP_MTU,
        payload_type,
        ssrc,
        payloader,
        Box::new(new_random_sequencer()),
        H264_CLOCK_RATE,
    );
    Ok(RtpSending {
        packetizer: std::sync::Mutex::new(Box::new(packetizer)),
        playout_delay_id,
    })
}

async fn read_rtcp(track: Arc<TrackLocalStaticRTP>) {
    // Ends when the peer closes.
    while let Some(event) = track.poll().await {
        let TrackLocalEvent::OnRtcpPacket(packets) = event else {
            continue;
        };
        for packet in &packets {
            if let Some(reason) = h264_keyframe_request_reason(packet.as_ref()) {
                request_h264_keyframe(reason);
            }
        }
    }
    debug!("h264 rtcp reader stopped");
}

fn h264_keyframe_request_reason(packet: &dyn rtcp::Packet) -> Option<&'static str> {
    if packet.as_any().is::<PictureLossIndication>() {
        Some("rtcp picture loss indication")
    } else if packet.as_any().is::<FullIntraRequest>() {
        Some("rtcp full intra request")
    } else {
        None
    }
}

/// Last in the chain: marks PLI and FIR for the application and drops other RTCP,
/// which the earlier interceptors have already handled.
#[derive(Default)]
struct KeyframeRequestForwarder {
    read_queue: VecDeque<TaggedPacket>,
    write_queue: VecDeque<TaggedPacket>,
}

impl Protocol<TaggedPacket, TaggedPacket, ()> for KeyframeRequestForwarder {
    type Rout = TaggedPacket;
    type Wout = TaggedPacket;
    type Eout = ();
    type Error = rtc::shared::error::Error;
    type Time = Instant;

    fn handle_read(&mut self, mut msg: TaggedPacket) -> std::result::Result<(), Self::Error> {
        if let Packet::Rtcp(packets) = &msg.message.packet {
            let requests: Vec<Box<dyn rtcp::Packet>> = packets
                .iter()
                .filter(|packet| h264_keyframe_request_reason(packet.as_ref()).is_some())
                .cloned()
                .collect();
            if requests.is_empty() {
                return Ok(());
            }
            msg.message.packet = Packet::Rtcp(requests);
            msg.message.add(Attribute::DeliverToApplication);
        }
        self.read_queue.push_back(msg);
        Ok(())
    }

    fn poll_read(&mut self) -> Option<Self::Rout> {
        self.read_queue.pop_front()
    }

    fn handle_write(&mut self, msg: TaggedPacket) -> std::result::Result<(), Self::Error> {
        self.write_queue.push_back(msg);
        Ok(())
    }

    fn poll_write(&mut self) -> Option<Self::Wout> {
        self.write_queue.pop_front()
    }
}

impl Interceptor for KeyframeRequestForwarder {
    fn bind_local_stream(&mut self, _info: &StreamInfo) {}
    fn unbind_local_stream(&mut self, _info: &StreamInfo) {}
    fn bind_remote_stream(&mut self, _info: &StreamInfo) {}
    fn unbind_remote_stream(&mut self, _info: &StreamInfo) {}
}

fn rtc_ice_servers(config: &Config) -> Vec<RTCIceServer> {
    let mut servers = Vec::new();
    if !config.stun.is_empty() && config.stun != "disable" {
        servers.push(RTCIceServer {
            urls: vec![format!("stun:{}", config.stun)],
            ..Default::default()
        });
    }
    if !config.turn.turn_addr.is_empty()
        && !config.turn.turn_user.is_empty()
        && !config.turn.turn_cred.is_empty()
    {
        servers.push(RTCIceServer {
            urls: vec![format!("turn:{}", config.turn.turn_addr)],
            username: config.turn.turn_user.clone(),
            credential: config.turn.turn_cred.clone(),
        });
    }
    servers
}

fn client_ice_servers(config: &Config) -> Vec<ClientIceServer> {
    rtc_ice_servers(config)
        .into_iter()
        .map(|server| ClientIceServer {
            urls: server.urls,
            username: server.username,
            credential: if server.credential.is_empty() {
                None
            } else {
                Some(server.credential)
            },
        })
        .collect()
}

fn manager() -> &'static WebRtcManager {
    &WEBRTC_MANAGER
}

fn webrtc_error(context: &str, err: impl fmt::Display) -> AppError {
    AppError::Internal(format!("{context}: {err}"))
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SignalMessage {
    event: String,
    #[serde(default)]
    data: String,
}

#[derive(Debug, Serialize)]
struct ClientIceServer {
    urls: Vec<String>,
    #[serde(skip_serializing_if = "String::is_empty")]
    username: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    credential: Option<String>,
}

#[cfg(test)]
mod tests {
    use rtc::rtcp::{
        payload_feedbacks::{
            full_intra_request::FullIntraRequest, picture_loss_indication::PictureLossIndication,
        },
        receiver_report::ReceiverReport,
    };

    use super::{Config, client_ice_servers, h264_keyframe_request_reason};

    #[test]
    fn ice_servers_match_frontend_shape() {
        let config = Config::default();
        let data = serde_json::to_value(client_ice_servers(&config)).unwrap();

        assert_eq!(data[0]["urls"][0], "stun:stun.l.google.com:19302");
        assert!(data[0].get("username").is_none());
        assert!(data[0].get("credential").is_none());
    }

    #[test]
    fn playout_delay_constant_is_zero_delay() {
        use rtc::{
            rtp::extension::playout_delay_extension::PlayoutDelayExtension,
            shared::marshal::Marshal,
        };

        let encoded = PlayoutDelayExtension::new(0, 0).marshal().unwrap();
        assert_eq!(&encoded[..], &super::PLAYOUT_DELAY_ZERO);
    }

    #[test]
    fn detects_rtcp_keyframe_requests() {
        let pli = PictureLossIndication::default();
        let fir = FullIntraRequest::default();
        let receiver_report = ReceiverReport::default();

        assert_eq!(
            h264_keyframe_request_reason(&pli),
            Some("rtcp picture loss indication")
        );
        assert_eq!(
            h264_keyframe_request_reason(&fir),
            Some("rtcp full intra request")
        );
        assert_eq!(h264_keyframe_request_reason(&receiver_report), None);
    }
}
