---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-07
---

# PicoClaw assistant

[PicoClaw](https://github.com/sipeed/picoclaw) is an AI agent that runs on the
NanoKVM. In the **Remote control** role it looks at the host's screen and types
and clicks on it, so you can ask it to carry out a task on the host. The
**General assistant** role is a plain chat.

> [!WARNING]
> In the Remote control role the agent operates the host's keyboard and mouse,
> and screenshots of the host's screen are sent to the model provider you
> configure. Text on that screen reaches the model too, and a page or document
> written to mislead the model could make the agent do something you did not ask
> for. Use it on hosts and screens you are willing to expose this way, and watch
> what it does.

## Install and start

1. Open the PicoClaw sidebar and press **Install**. The device downloads
   PicoClaw v0.3.1 from its GitHub release and installs it only if the archive
   matches the SHA-256 pinned in the server.
2. Configure a model (below), then **Start PicoClaw**. The page waits until the
   agent's gateway is listening; if it stops, the reason from its log is shown.

The gateway listens on `127.0.0.1` only and needs a token; the agent reaches the
NanoKVM through internal routes that only accept requests from the device itself.

## Model

In the sidebar's settings, give the provider and model (for example
`anthropic/<model>` or `openai/<model>`), the API base URL and the API key.

- The key is stored in `/root/.picoclaw/.security.yml` and never shown again.
- Saving the form with the key field empty keeps the stored key, as long as the
  API base stays on the same scheme, host and port. Pointing the API base at
  another server asks for the key again, so a stored key is never sent somewhere
  new.
- For `anthropic/` models the server leaves `temperature` out of requests, which
  recent Anthropic models reject.

## Using it

- Screenshots need the **MJPEG** video mode. If no recent frame is cached, the
  agent takes one itself.
- The chat shows what the agent is doing with each tool call ("Taking a
  screenshot", "Typing …").
- If the host does not read the mouse, the agent is told so at once and switches
  to the keyboard.
- **History** lists earlier conversations, read from PicoClaw's own session
  files; you can reopen or delete them.

PicoClaw runs as root on the NanoKVM, so it has no shell on the NanoKVM itself:
the backend turns off its `exec`, serial, SPI and I2C tools, cron commands and local
MCP servers, and keeps its file tools inside `~/.picoclaw/workspace`. Controlling
the host (screen, keyboard, mouse) is unaffected. A configuration whose workspace
lies outside that folder is refused, and PicoClaw does not start until it is fixed.

**Uninstall** removes PicoClaw and its configuration, including the stored key.
