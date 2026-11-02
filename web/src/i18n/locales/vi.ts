const vi = {
  translation: {
    common: {
      confirm: 'Xác nhận',
      cancel: 'Hủy',
      save: 'Lưu',
      discard: 'Hủy bỏ',
      delete: 'Xóa',
      actionFailed: 'Thao tác thất bại',
      loading: 'Đang tải cài đặt từ thiết bị...',
      loadFailed: 'Không thể tải cài đặt từ thiết bị',
      retry: 'Thử lại'
    },
    head: {
      desktop: 'Màn hình từ xa',
      login: 'Đăng nhập',
      firstSetup: 'Thiết lập lần đầu',
      changePassword: 'Đổi mật khẩu',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Đăng nhập',
      placeholderUsername: 'Vui lòng nhập tên người dùng',
      placeholderPassword: 'Vui lòng nhập mật khẩu',
      placeholderPassword2: 'Vui lòng nhập lại mật khẩu',
      noEmptyUsername: 'Tên người dùng không được để trống',
      noEmptyPassword: 'Mật khẩu không được để trống',
      invalidUser: 'Tên người dùng hoặc mật khẩu không hợp lệ',
      locked: 'Đăng nhập quá nhiều, vui lòng thử lại sau',
      globalLocked: 'Hệ thống đang được bảo vệ, vui lòng thử lại sau',
      error: 'Lỗi không mong đợi',
      changePassword: 'Đổi mật khẩu',
      changePasswordDesc: 'Để bảo mật thiết bị của bạn, vui lòng thay đổi mật khẩu đăng nhập web',
      differentPassword: 'Mật khẩu không khớp',
      illegalUsername: 'Tên người dùng chứa ký tự không hợp lệ',
      illegalPassword:
        'Mật khẩu phải có ít nhất 8 ký tự và không được chứa dấu nháy hoặc dấu gạch chéo',
      forgetPassword: 'Quên mật khẩu',
      ok: 'OK',
      cancel: 'Hủy',
      loginButtonText: 'Đăng nhập',
      setupTitle: 'Tạo tài khoản quản trị',
      setupDescription:
        'Thiết bị này chưa có tài khoản web. Tạo tài khoản quản trị đầu tiên để tiếp tục.',
      setupRecovery: 'Nếu mất mật khẩu này, việc khôi phục cần ghi lại thẻ SD',
      setupButtonText: 'Tạo tài khoản',
      tips: {
        hardenedRecovery:
          'Image Hardened này không hỗ trợ đặt lại mật khẩu bằng nút BOOT. Nếu mất mật khẩu, hãy ghi lại thẻ SD và tạo tài khoản mới.',
        change1: 'Lưu ý rằng thao tác này sẽ thay đổi các mật khẩu sau:',
        change2: 'Mật khẩu đăng nhập web',
        change3: 'Mật khẩu root hệ thống để đăng nhập SSH'
      },
      placeholderCurrentPassword: 'Mật khẩu hiện tại',
      placeholderNewPassword: 'Mật khẩu mới',
      wrongCurrentPassword: 'Mật khẩu hiện tại không đúng',
      totp: {
        title: 'Xác thực hai yếu tố',
        prompt: 'Nhập mã gồm 6 chữ số từ ứng dụng xác thực của bạn',
        backupPrompt: 'Nhập một trong các mã dự phòng của bạn',
        noEmptyCode: 'Nhập mã',
        placeholderCode: 'Mã 6 chữ số',
        placeholderBackup: 'Mã dự phòng',
        verifyButtonText: 'Xác minh',
        useBackupCode: 'Dùng mã dự phòng',
        useAuthenticator: 'Dùng mã từ ứng dụng xác thực',
        cancel: 'Quay lại',
        invalidCode: 'Mã này không hợp lệ. Hãy thử lại.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Cấu hình Wi-Fi cho NanoKVM',
      success: 'Hãy đến thiết bị để kiểm tra trạng thái mạng của NanoKVM',
      failed: 'Thao tác thất bại, vui lòng thử lại',
      invalidMode:
        'Chế độ hiện tại không hỗ trợ thiết lập mạng. Vui lòng truy cập thiết bị của bạn và bật chế độ cấu hình Wi-Fi.',
      confirmBtn: 'Ok',
      finishBtn: 'Hoàn tất',
      ap: {
        authTitle: 'Yêu cầu xác thực',
        authDescription: 'Vui lòng nhập mật khẩu AP để tiếp tục',
        authFailed: 'Mật khẩu AP không hợp lệ',
        passPlaceholder: 'Mật khẩu AP',
        verifyBtn: 'Xác minh'
      }
    },
    screen: {
      scale: 'Tỷ lệ',
      title: 'Màn hình',
      video: 'Chế độ video',
      videoDirectTips: 'Bật HTTPS trong "Cài đặt > Mạng > Dịch vụ" để sử dụng chế độ này',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC bị tắt trong các chế độ tường lửa Hạn chế và Hoang tưởng',
      transferRunningTitle: 'Đang truyền image',
      transferRunningDesc:
        'Đổi chế độ video sẽ tải lại trang và hủy việc tải lên hoặc tải xuống image đang chạy.',
      transferRunningOk: 'Đổi chế độ',
      resolution: 'Độ phân giải',
      auto: 'Tự động',
      autoTips:
        'Màn hình bị xé hoặc lệch chuột có thể xảy ra ở các độ phân giải nhất định, vì vậy hãy điều chỉnh độ phân giải của máy remote hoặc tắt chế độ tự động',
      fps: 'FPS',
      customizeFps: 'Tùy chỉnh',
      quality: 'Chất lượng',
      qualityLossless: 'Không mất dữ liệu',
      qualityHigh: 'Cao',
      qualityMedium: 'Trung bình',
      qualityLow: 'Thấp',
      frameDetect: 'Phát hiện khung hình',
      frameDetectTip:
        'So sánh các khung hình và dừng gửi video khi màn hình máy chủ từ xa không thay đổi',
      resetHdmi: 'Đặt lại HDMI',
      webrtcConnectionFailed: {
        title: 'Kết nối WebRTC thất bại',
        description: 'Kiểm tra kết nối mạng hoặc chuyển đổi chế độ video'
      },
      captureStatus: {
        hdmiError: 'Lỗi màn hình HDMI',
        unsupportedResolution: 'Độ phân giải hiện tại không được hỗ trợ',
        retrieving: 'Đang lấy màn hình...',
        changingResolution: 'Đang chuyển độ phân giải...',
        updateFailed: 'Hiện không thể cập nhật màn hình',
        videoError: 'Lỗi hiển thị video',
        noHdmi: 'Không phát hiện tín hiệu HDMI',
        unavailable: 'Hiện không thể hiển thị màn hình'
      }
    },
    keyboard: {
      title: 'Bàn phím',
      paste: 'Dán',
      tips: 'Chỉ hỗ trợ các chữ cái và ký hiệu bàn phím tiêu chuẩn',
      placeholder: 'Văn bản cần dán',
      local: 'Bàn phím di động',
      virtual: 'Bàn phím trên màn hình',
      readClipboard: 'Đọc từ clipboard',
      clipboardPermissionDenied:
        'Quyền bảng nhớ tạm bị từ chối, hãy cho phép truy cập clipboard trong trình duyệt của bạn',
      clipboardReadError: 'Không đọc được bảng nhớ tạm',
      dropdownEnglish: 'Tiếng Anh',
      dropdownGerman: 'Tiếng Đức',
      dropdownFrench: 'Tiếng Pháp',
      dropdownRussian: 'Tiếng Nga',
      dropdownKorean: 'Tiếng Hàn',
      dropdownJapanese: 'Tiếng Nhật',
      localInput: 'Nhập liệu từ bàn phím di động',
      shortcut: {
        title: 'Phím tắt',
        custom: 'Tùy chỉnh',
        capture: 'Bấm vào đây để chụp phím tắt',
        clear: 'Xóa',
        save: 'Lưu',
        captureTips:
          'Việc ghi nhận các phím cấp hệ thống, như phím Windows, yêu cầu quyền toàn màn hình',
        enterFullScreen: 'Chuyển sang chế độ toàn màn hình'
      },
      leaderKey: {
        title: 'Phím Leader',
        desc: 'Bỏ qua các hạn chế của trình duyệt và gửi các phím tắt hệ thống trực tiếp đến máy chủ từ xa',
        howToUse: 'Cách sử dụng',
        simultaneous: {
          title: 'Chế độ đồng thời',
          desc1: 'Nhấn giữ phím Leader, rồi nhấn phím tắt.',
          desc2: 'Trực quan nhưng có thể xung đột với các phím tắt hệ thống.'
        },
        sequential: {
          title: 'Chế độ tuần tự',
          desc1: 'Nhấn phím Leader → nhấn phím tắt theo thứ tự → nhấn lại phím Leader.',
          desc2: 'Yêu cầu nhiều bước hơn nhưng hoàn toàn tránh được xung đột hệ thống.'
        },
        enable: 'Bật phím Leader',
        tip: 'Khi được gán làm phím Leader, phím này chỉ hoạt động như bộ kích hoạt phím tắt và mất hành vi mặc định.',
        placeholder: 'Nhấn phím Leader',
        shiftRight: 'Shift phải',
        ctrlRight: 'Ctrl phải',
        metaRight: 'Win phải',
        recorder: {
          rec: 'REC',
          activate: 'Kích hoạt phím',
          input: 'Nhấn phím tắt'
        }
      }
    },
    mouse: {
      title: 'Chuột',
      cursor: 'Kiểu con trỏ',
      default: 'Con trỏ mặc định',
      cell: 'Con trỏ ô',
      text: 'Con trỏ văn bản',
      grab: 'Con trỏ nắm',
      hide: 'Ẩn con trỏ',
      mode: 'Chế độ chuột',
      absolute: 'Chế độ tuyệt đối',
      relative: 'Chế độ tương đối',
      direction: 'Hướng bánh xe cuộn',
      scrollUp: 'Cuộn lên',
      scrollDown: 'Cuộn xuống',
      speed: 'Tốc độ bánh xe cuộn',
      sensitivity: 'Tốc độ con trỏ',
      sensitivityDesc:
        'Cho chế độ relative trên desktop: giá trị thấp hơn giảm lệch do tăng tốc chuột của host',
      fast: 'Nhanh',
      slow: 'Chậm',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Di chuyển ở bất kỳ đâu trong vùng KVM; con trỏ từ xa giữ vị trí giữa các lần chạm và đồng bộ với HID tuyệt đối'
      },
      requestPointer: 'Đang sử dụng chế độ tương đối, nhấp vào màn hình để lấy con trỏ chuột',
      resetHid: 'Đặt lại HID',
      hidOnly: {
        title: 'Chế độ HID-Only',
        desc: 'Nếu chuột hoặc bàn phím ngừng phản hồi và việc đặt lại HID không có tác dụng, có thể là sự cố tương thích giữa NanoKVM và máy chủ.',
        tip1: 'Bật chế độ HID-Only sẽ gỡ đĩa ảo và mạng ảo',
        tip2: 'Trong chế độ HID-Only, tính năng gắn image bị tắt',
        tip3: 'NanoKVM sẽ tự động khởi động lại sau khi chuyển chế độ',
        enable: 'Bật chế độ HID-Only',
        disable: 'Tắt chế độ HID-Only'
      }
    },
    image: {
      title: 'Hình ảnh',
      loading: 'Đang tải...',
      empty: 'Không tìm thấy',
      mountMode: 'Mount dưới dạng',
      massStorage: 'Lưu trữ dung lượng lớn',
      cdRom: 'CD-ROM',
      mountFailed: 'Mount thất bại',
      mountDesc: 'Trong một số hệ thống, cần phải eject đĩa ảo trên máy remote trước khi mount',
      diskOnWarn: 'Gắn image sẽ tắt đĩa ảo, nên máy tính không còn truy cập được /data. Tiếp tục?',
      diskOffWarn:
        'Đĩa ảo đang tắt và cần được bật để gắn image. Các thiết bị USB trên máy tính sẽ được nhận diện lại. Tiếp tục?',
      unmountFailed: 'Gỡ gắn không thành công',
      unmountDesc:
        'Trên một số hệ thống, bạn cần đẩy hình ảnh ra khỏi máy chủ từ xa theo cách thủ công trước khi ngắt kết nối hình ảnh',
      forceEject: 'Buộc đẩy ra',
      forceEjectConfirm:
        'Máy chủ đã khóa ổ đĩa quang. Buộc đẩy ra sẽ ngắt kết nối thiết bị USB ảo trong giây lát, vì vậy bàn phím và chuột có thể bị ngắt kết nối ngắn. Tiếp tục?',
      usbReconnect: 'Kết nối lại USB',
      usbReconnectConfirm:
        'Chỉ kết nối lại USB gadget nếu máy từ xa không nhận thấy thay đổi media. Bàn phím và chuột có thể ngắt kết nối trong chốc lát.',
      usbReconnectSuccess: 'Đã kết nối lại USB',
      usbReconnectFailed: 'Kết nối lại USB thất bại',
      addImage: 'Thêm hình ảnh',
      fromUrl: 'Từ URL',
      fromFile: 'Từ tệp',
      turnOff: 'Tắt',
      eject: 'Đẩy ra',
      download: 'Tải xuống',
      upload: 'Tải lên',
      mountTitle: 'Mount hình ảnh',
      deleteTitle: 'Xóa hình ảnh',
      deleteConfirm: 'Bạn có chắc chắn muốn xóa hình ảnh này không?',
      tips: {
        title: 'Cách tải lên',
        usb1: 'Kết nối NanoKVM với máy tính của bạn qua USB.',
        usb2: 'Đảm bảo rằng đĩa ảo đã được gắn kết trong Cài đặt > Thiết bị > Đĩa ảo.',
        usb3: 'Mở đĩa ảo trên máy tính của bạn và sao chép vào thư mục gốc của đĩa ảo.',
        scp1: 'Đảm bảo NanoKVM và máy tính của bạn đang trên cùng một mạng nội bộ.',
        scp2: 'Mở terminal trên máy tính và sử dụng lệnh SCP để tải đĩa ảo lên thư mục /data trên NanoKVM.',
        scp3: 'Ví dụ: scp đường-dẫn-image root@ip-của-nanokvm:/data',
        tfCard: 'Thẻ SD',
        tf1: 'Phương pháp này được hỗ trợ trên hệ thống Linux',
        tf2: 'Lấy thẻ SD ra khỏi NanoKVM. Với phiên bản FULL, hãy tháo vỏ trước.',
        tf3: 'Chèn thẻ SD vào đầu đọc thẻ và kết nối với máy tính của bạn.',
        tf4: 'Sao chép tệp hình ảnh vào thư mục /data trên thẻ SD.',
        tf5: 'Chèn thẻ SD vào NanoKVM.'
      }
    },
    script: {
      title: 'Script',
      upload: 'Tải lên',
      run: 'Chạy',
      runBackground: 'Chạy nền',
      runFailed: 'Chạy thất bại',
      delDesc: 'Bạn có chắc chắn muốn xóa tệp này không?',
      delete: 'Xóa',
      close: 'Đóng'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'Terminal NanoKVM',
      serial: 'Terminal cổng nối tiếp',
      unlockTitle: 'Mở khóa terminal',
      unlockDesc: 'Nhập mật khẩu tài khoản web để bắt đầu phiên terminal',
      unlock: 'Mở khóa',
      unlockFailed: 'Không mở khóa được terminal',
      invalidCredentials: 'Tên người dùng hoặc mật khẩu không hợp lệ',
      locked: 'Quá nhiều lần thử, thử lại sau',
      sessionClosed: 'Phiên terminal đã đóng. Mở khóa lại để kết nối.',
      sessionError: 'Kết nối terminal thất bại. Mở khóa lại để thử lại.',
      serialPort: 'Cổng nối tiếp',
      serialPortPlaceholder: 'Ví dụ /dev/ttyS1',
      baudrate: 'Tốc độ baud',
      parity: 'Tính chẵn lẻ',
      parityNone: 'Không có',
      parityEven: 'Chẵn',
      parityOdd: 'Lẻ',
      flowControl: 'Kiểm soát luồng',
      flowControlNone: 'Không có',
      flowControlSoft: 'Phần mềm',
      flowControlHard: 'Phần cứng',
      dataBits: 'Bit dữ liệu',
      stopBits: 'Bit dừng',
      open: 'Mở terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Đang gửi lệnh...',
      sent: 'Đã gửi lệnh',
      input: 'Địa chỉ MAC',
      ok: 'OK'
    },
    download: {
      input: 'URL của image từ xa',
      ok: 'OK',
      disabled:
        'Hiện không thể tải xuống hoặc tải lên image vì bộ nhớ không ghi được. Nếu có image đang được gắn, hãy gỡ gắn, rồi tắt đĩa ảo để bộ nhớ ghi được trở lại.',
      diskShared: 'Tắt đĩa ảo để dùng tính năng tải image',
      mountedImage: 'Ảnh đĩa này đang được gắn, hãy gỡ gắn trước khi tải lên tệp cùng tên',
      diskOff: 'Tắt đĩa ảo',
      uploadbox: 'Thả file vào đây hoặc bấm vào để chọn',
      inputfile: 'File hình ảnh',
      NoISO: 'Không có image',
      complete: 'Tải xuống hoàn tất',
      uploadComplete: 'Tải lên hoàn tất',
      downloading: 'Đang tải xuống',
      uploading: 'Đang tải lên',
      failed: 'Truyền dữ liệu thất bại',
      uploadFailed: 'Tải lên thất bại',
      stalled: 'Truyền dữ liệu bị dừng, kiểm tra kết nối rồi thử lại',
      canceled: 'Đã hủy tải lên',
      downloadCanceled: 'Đã hủy tải xuống',
      cancel: 'Hủy',
      remoteDisabled: 'Tải ISO từ xa bị tắt trong Cài đặt > Người dùng > Tùy chọn',
      remoteFailed: 'Tải ISO từ xa thất bại',
      sha256: 'Checksum SHA-256 tùy chọn',
      sha256Placeholder: 'Nhập mã kiểm tra SHA-256 gồm 64 ký tự',
      invalidSHA256: 'SHA-256 phải là chuỗi thập lục phân gồm 64 ký tự',
      checksumFailed: 'Tải xuống thất bại: xác minh SHA-256 không thành công'
    },
    power: {
      title: 'Nguồn',
      showConfirm: 'Xác nhận',
      showConfirmTip: 'Hoạt động cấp nguồn yêu cầu xác nhận bổ sung',
      reset: 'Đặt lại',
      powerShort: 'Nút nguồn: nhấp ngắn',
      powerLong: 'Nút nguồn: nhấp dài',
      resetConfirm: 'Thực hiện thao tác đặt lại?',
      powerConfirm: 'Thực hiện thao tác nguồn điện?',
      okBtn: 'Có',
      cancelBtn: 'Không'
    },
    settings: {
      title: 'Cài đặt',
      about: {
        title: 'Giới thiệu',
        information: 'Thông tin',
        ip: 'Địa chỉ IP',
        mdns: 'Địa chỉ cục bộ',
        application: 'Phiên bản ứng dụng',
        uptime: 'Thời gian hoạt động',
        community: 'Cộng đồng',
        credit: 'Xây dựng trên <a1>NanoKVM</a1> của Sipeed và <a2>Hardened NanoKVM</a2> của woffko',
        hostname: 'Tên thiết bị',
        changeIn: 'Thay đổi tại {{path}}',
        updateIn: 'Cập nhật tại {{path}}',
        toggleIn: 'Bật hoặc tắt tại {{path}}'
      },
      appearance: {
        title: 'Tùy chọn',
        display: 'Hiển thị',
        language: 'Ngôn ngữ',
        languageDesc: 'Chọn ngôn ngữ cho giao diện',
        webTitle: 'Tiêu đề trang web',
        webTitleDesc: 'Tùy chỉnh tiêu đề trang web',
        layoutMode: 'Bố cục giao diện',
        layoutModeDesc: 'Dùng bố cục điện thoại/cảm ứng trong trình duyệt này',
        layoutAuto: 'Tự động',
        layoutMobile: 'Điện thoại',
        menuBar: {
          title: 'Thanh menu',
          mode: 'Chế độ hiển thị',
          modeDesc: 'Hiển thị thanh menu trên màn hình',
          modeOff: 'Tắt',
          modeAuto: 'Tự động ẩn',
          modeAlways: 'Luôn hiển thị',
          keyboardLedStatus: 'Chỉ báo khóa bàn phím',
          keyboardLedStatusDesc:
            'Hiển thị trạng thái Num Lock, Caps Lock và Scroll Lock của máy tính từ xa',
          icons: 'Biểu tượng menu con',
          iconsDesc: 'Hiển thị biểu tượng menu con trên thanh menu',
          terminalWarningTitle: 'Bật terminal web?',
          terminalWarningDesc:
            'Terminal mở root shell trong trình duyệt. Chỉ bật trên mạng tin cậy và tắt khi hoàn tất.',
          terminalWarningConfirm: 'Bật',
          remoteDownload: 'Tải ISO từ xa',
          remoteDownloadWarningTitle: 'Bật tải ISO từ xa?',
          remoteDownloadWarningDesc:
            'NanoKVM sẽ tải ISO từ URL và ghi vào /data. Chỉ bật cho URL tin cậy và tắt khi hoàn tất.',
          remoteDownloadWarningConfirm: 'Bật'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Trạng thái khóa bàn phím từ xa',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Bật',
        off: 'Tắt',
        unknown: 'Không rõ'
      },
      device: {
        title: 'Thiết bị',
        minutes: 'phút',
        sections: {
          general: 'Chung',
          connectivity: 'Kết nối',
          hostConnection: 'Kết nối với máy chủ',
          inputOutput: 'Đầu vào và đầu ra'
        },
        oled: {
          title: 'Thời gian chờ OLED',
          description: 'Tắt màn hình OLED sau',
          keepOn: 'Giữ OLED luôn bật',
          keepOnDescription: 'Không bao giờ tắt màn hình OLED'
        },
        ssh: {
          description: 'Kích hoạt SSH truy cập từ xa',
          tip: 'Đặt mật khẩu mạnh trong Tài khoản > Mật khẩu trước khi bật tùy chọn này'
        },
        swap: {
          title: 'Swap',
          description: 'Dùng tệp hoán đổi khi bộ nhớ sắp hết',
          size: 'Kích thước Swap',
          sizeDescription: 'Đặt kích thước tệp hoán đổi',
          tip: 'Kích hoạt tính năng này có thể rút ngắn thời gian sử dụng thẻ SD của bạn'
        },
        mouseJiggler: {
          title: 'Máy lắc lư chuột',
          description: 'Ngăn máy chủ từ xa ngủ',
          disable: 'Tắt',
          absolute: 'Chế độ tuyệt đối',
          relative: 'Chế độ tương đối'
        },
        sessionLock: {
          title: 'Khóa phiên khi không hoạt động',
          description: 'Yêu cầu đăng nhập lại sau thời gian này'
        },
        mdns: {
          description: 'Kích hoạt dịch vụ khám phá mDNS',
          tip: 'Cho phép truy cập thiết bị này bằng tên .local. Không cần nếu bạn kết nối bằng địa chỉ IP hoặc DNS của bạn đã phân giải được tên máy.'
        },
        hdmi: {
          description: 'Kích hoạt HDMI/đầu ra màn hình',
          idleTimeoutTitle: 'Thời gian chờ khi không hoạt động',
          idleTimeoutDescription:
            'Dừng việc ghi hình HDMI sau khi không có người xem hoạt động trong'
        },
        hidOnly: 'Chế độ HID-Only',
        hidOnlyDesc:
          'Cải thiện khả năng tương thích với máy chủ nếu chuột hoặc bàn phím ngừng phản hồi',
        hidOnlyTip:
          'Chế độ HID-Only ngừng mô phỏng các thiết bị ảo và chỉ giữ lại điều khiển HID cơ bản',
        disk: 'Đĩa ảo',
        diskDesc: 'Gắn thẻ SD vào máy chủ từ xa',
        diskLocked: 'Tắt khi đang gắn image, và bật sẽ hủy việc gắn',
        diskEnable: 'Bật đĩa ảo',
        networkChange: 'Thay đổi mạng ảo',
        diskCancelMount: 'Bật đĩa ảo sẽ hủy image đang gắn. Tiếp tục?',
        networkCancelMount:
          'Thay đổi mạng ảo sẽ khởi động lại kết nối USB. Việc này hủy image đang gắn và bật đĩa ảo. Tiếp tục?',
        diskTransferRunning:
          'Đang có một lượt truyền image. Hãy chờ hoàn tất trước khi bật đĩa ảo.',
        network: 'Mạng ảo',
        networkDesc: 'Gắn card mạng ảo trên máy chủ từ xa',
        usbWakeup: 'Đánh thức qua USB',
        usbWakeupDesc: 'Cho phép sự kiện bàn phím hoặc chuột đánh thức máy từ xa',
        usbWakeupTip: 'Tắt nếu máy ghi lặp lại thông báo USB wakeup',
        hostname: {
          description: 'Tên của thiết bị này trên mạng',
          reachable: 'Truy cập được trong mạng cục bộ qua {{address}}'
        },
        rebootRequired: 'Cần khởi động lại',
        rebootPending: 'Cần khởi động lại cho: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Cập nhật hệ thống'
        },
        reboot: 'Khởi động lại',
        rebootDesc: 'Bạn có chắc chắn muốn khởi động lại NanoKVM không?',
        poweroff: 'Tắt nguồn',
        poweroffDesc:
          'Bạn có chắc muốn tắt NanoKVM? Thiết bị sẽ không truy cập được cho đến khi được bật lại.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Kết nối',
        configuration: 'Cấu hình',
        wifi: {
          title: 'Wi-Fi',
          description: 'Cấu hình Wi-Fi',
          apMode: 'Chế độ AP đang bật, hãy kết nối Wi-Fi bằng cách quét mã QR',
          connect: 'Kết nối Wi-Fi',
          connectDesc1: 'Vui lòng nhập SSID mạng và mật khẩu',
          disconnect: 'Bạn có chắc muốn ngắt kết nối mạng không?',
          disconnectBtn: 'Ngắt kết nối',
          connected: 'Đã kết nối',
          ssid: 'Tên',
          password: 'Mật khẩu',
          joinBtn: 'Tham gia',
          cancelBtn: 'Hủy'
        },
        tls: {
          description: 'Bật giao thức HTTPS',
          tip: 'Lưu ý: Sử dụng HTTPS có thể tăng độ trễ, đặc biệt trong chế độ video MJPEG',
          restartTitle: 'Máy chủ sẽ khởi động lại',
          restartDesc:
            'Việc thay đổi giao thức sẽ khởi động lại máy chủ. Trình duyệt sẽ chuyển sang địa chỉ mới sau {{seconds}} giây:',
          restartOk: 'Áp dụng và khởi động lại',
          confirmTitle: 'Giữ giao thức mới?',
          confirmDesc:
            'Máy chủ hiện chạy bằng {{protocol}}. Nếu bạn không giữ, nó sẽ quay lại giao thức trước sau {{seconds}} giây.',
          confirmKeep: 'Giữ',
          confirmRevert: 'Quay lại',
          reverting:
            'Đang quay lại giao thức trước. Trình duyệt sẽ chuyển sang địa chỉ đó sau {{seconds}} giây.',
          certTitle: 'Giữ chứng chỉ mới?',
          certDesc:
            'Máy chủ hiện dùng chứng chỉ mới. Nếu bạn không giữ, nó sẽ quay lại chứng chỉ trước sau {{seconds}} giây.',
          certReverted: 'Chứng chỉ trước đã được khôi phục'
        },
        certificate: {
          title: 'Chứng chỉ',
          desc: 'Nguồn gốc của chứng chỉ HTTPS',
          requesting: 'Đang yêu cầu chứng chỉ',
          selfSigned: 'Tự ký',
          domain: 'Tên miền',
          domainDesc: 'Phải trỏ đến thiết bị này, với cổng 443 truy cập được từ internet',
          domainTailscale: 'Do Tailscale đặt cho thiết bị này',
          domainInvalid: 'Dùng tên miền đầy đủ, ví dụ kvm.example.org',
          email: 'Email',
          emailDesc: "Tùy chọn, để nhận thông báo từ Let's Encrypt",
          emailInvalid: 'Dùng địa chỉ dạng name@example.org',
          validUntil: 'Có hiệu lực đến',
          valid: 'Hợp lệ',
          expiresSoon: 'Sắp hết hạn',
          expired: 'Đã hết hạn',
          lastRenewal: 'Lần gia hạn gần nhất',
          renewed: 'Đã gia hạn',
          failed: 'Thất bại',
          renewNow: 'Gia hạn ngay',
          renewNowDesc: 'Yêu cầu chứng chỉ mới mà không cần chờ',
          renewBtn: 'Gia hạn',
          applyTitle: 'Đổi chứng chỉ',
          applyOk: 'Áp dụng',
          applyAcme:
            "Thiết bị yêu cầu chứng chỉ từ Let's Encrypt. Let's Encrypt kết nối đến cổng 443 từ internet để kiểm tra, việc này có thể mất tới một phút. Nếu yêu cầu thất bại, chứng chỉ hiện tại vẫn được dùng.",
          applyTailscale:
            'Thiết bị lấy chứng chỉ từ Tailscale, việc này có thể mất tới một phút. Nếu yêu cầu thất bại, chứng chỉ hiện tại vẫn được dùng.',
          applySelfSigned:
            'Thiết bị quay lại chứng chỉ tự ký của chính nó. Trình duyệt sẽ cảnh báo về chứng chỉ này.',
          openTitle: 'Mở địa chỉ mới',
          openDesc:
            'Chứng chỉ đã sẵn sàng. Hãy mở địa chỉ bên dưới và đăng nhập để giữ nó. Nếu bạn không xác nhận trong 3 phút, chứng chỉ trước sẽ quay lại.',
          openOk: 'Mở',
          blockedClock: 'Không thể yêu cầu chứng chỉ cho đến khi đồng hồ thiết bị được đồng bộ',
          blockedParanoid: 'Chế độ tường lửa Hoang tưởng chặn các yêu cầu chứng chỉ',
          tailscaleUnavailable:
            'Tailscale không chạy, hoặc chứng chỉ HTTPS chưa được bật cho tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'Cấu hình máy chủ DNS cho NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Cấu hình địa chỉ IPv4 cho giao diện có dây',
          servers: 'Máy chủ',
          dhcp: 'DHCP',
          manual: 'Thủ công',
          apply: 'Áp dụng',
          invalid: 'Nhập địa chỉ IPv4 hoặc IPv6 hợp lệ',
          invalidNetwork: 'Nhập địa chỉ IPv4, mặt nạ mạng con và bộ định tuyến hợp lệ',
          saved: 'Đã lưu cài đặt DNS',
          redirecting: 'Đã lưu cài đặt mạng. Đang mở địa chỉ mới...',
          saveFailed: 'Không thể lưu cài đặt DNS',
          unsaved: 'Thay đổi chưa lưu',
          maxServers: 'Cho phép tối đa {{count}} máy chủ DNS',
          dhcpServersDescription: 'Máy chủ DNS được tự động lấy từ DHCP',
          manualServersDescription: 'Hỗ trợ máy chủ IPv4 và IPv6',
          interface: 'Giao diện',
          ipAddress: 'Địa chỉ IP',
          subnetMask: 'Mặt nạ mạng con',
          router: 'Bộ định tuyến'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Cấu hình địa chỉ IPv6 cho giao diện có dây',
          disabled: 'Đã tắt',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Thủ công',
          interface: 'Giao diện',
          state: 'Trạng thái',
          router: 'Bộ định tuyến',
          addresses: 'Địa chỉ',
          dhcpv6Client: 'Máy khách DHCPv6',
          notInstalled: 'Chưa cài đặt',
          ipAddress: 'Địa chỉ IPv6',
          prefix: 'Tiền tố',
          invalidManual: 'Nhập địa chỉ IPv6, tiền tố và bộ định tuyến hợp lệ',
          clientMissing:
            'Máy khách DHCPv6 chưa được cài đặt. Hãy cài đặt bản cập nhật hệ thống raw phù hợp trước.',
          saved: 'Đã lưu cài đặt IPv6',
          saveFailed: 'Không thể lưu cài đặt IPv6',
          unsaved: 'Thay đổi chưa lưu'
        }
      },
      system: {
        title: 'Hệ thống',
        performance: {
          processor: 'Bộ xử lý',
          overdrive: {
            title: 'Overdrive xung nhịp',
            description:
              'Khởi động với xung nhịp bộ xử lý và video cao hơn do nhà sản xuất quy định',
            tip: 'Nếu thiết bị không khởi động được với overdrive, thẻ SD phải được ghi lại',
            unavailable: 'Không có trong bản hệ thống này',
            keepTitle: 'Giữ overdrive sau khi cập nhật',
            keepDescription:
              'Bản cập nhật hệ thống đưa thiết bị về xung nhịp tiêu chuẩn nếu tùy chọn này không được bật',
            confirmTitle: 'Bật overdrive xung nhịp?',
            confirmText:
              'Nếu thiết bị không khởi động được với overdrive, bạn phải ghi lại thẻ SD để khôi phục. Thay đổi có hiệu lực sau lần khởi động lại tiếp theo.',
            confirmOk: 'Bật'
          },
          watchdog: {
            title: 'Watchdog phần cứng',
            description: 'Tự động khởi động lại thiết bị khi nó ngừng phản hồi',
            unavailable: 'Không có trong ảnh hệ thống này',
            notRunning: 'Hiện không chạy',
            lastRestart: 'Lần khởi động lại gần nhất',
            lastRestartCaption: 'Lý do gần nhất khiến hệ thống khởi động lại',
            reasonPowerOn: 'Bật nguồn',
            reasonRestart: 'Yêu cầu khởi động lại',
            reasonWatchdog: 'Watchdog đặt lại',
            reasonOverheat: 'Bảo vệ quá nhiệt',
            reasonUnknown: 'Không rõ'
          },
          recovery: 'Khôi phục',
          memory: 'Bộ nhớ'
        },
        monitor: {
          processorClock: 'Hệ thống con CPU',
          videoClock: 'Hệ thống con video',
          videoClockCaption: 'Tần số xung nhịp video',
          cpuClockCaption: 'Tần số xung nhịp CPU',
          overdrive: 'Overdrive',
          temperature: 'Nhiệt độ',
          lastMinutes: '5 phút gần nhất',
          ram: 'RAM',
          off: 'Tắt',
          ramHistory: 'Mức sử dụng RAM',
          cpuLoad: 'Tải CPU',
          cpuLoadCaption: 'Người dùng {{user}} phần trăm, hệ thống {{system}} phần trăm',
          cpuUtilization: 'Mức sử dụng CPU',
          swapUtilization: 'Mức sử dụng swap',
          swapSizeLastMinutes: '{{size}}, 5 phút gần nhất',
          percent: '{{percent}} phần trăm',
          percentUsed: 'Đã dùng {{percent}} phần trăm',
          sizeOf: '{{used}} trên {{total}}',
          systemPartition: 'Phân vùng hệ thống',
          dataPartition: 'Phân vùng dữ liệu',
          unavailable: 'Không có sẵn',
          noReadings: 'Thiết bị không trả về số liệu',
          refresh: 'Cập nhật mỗi giây khi trang này đang mở'
        },
        sections: {
          time: 'Thời gian',
          firewall: 'Tường lửa',
          systemLog: 'Ghi nhật ký',
          performance: 'Hiệu năng',
          monitor: 'Giám sát',
          services: 'Dịch vụ',
          webInterface: 'Truy cập web an toàn'
        },
        time: {
          saveFailed: 'Không thể lưu cài đặt thời gian',
          saved: 'Đã lưu cài đặt thời gian',
          syncFailed: 'Không thể đồng bộ thời gian',
          synced: 'Đã đồng bộ thời gian',
          invalidServers: 'Nhập ít nhất một máy chủ NTP',
          maxServers: 'Cho phép tối đa {{count}} máy chủ NTP',
          refresh: 'Làm mới',
          syncNow: 'Đồng bộ',
          syncNowDesc: 'Đặt đồng hồ theo máy chủ NTP ngay',
          save: 'Lưu',
          ntp: {
            title: 'NTP',
            description: 'Đồng bộ thời gian thiết bị từ các máy chủ NTP đã cấu hình'
          },
          networkTime: 'Giờ mạng',
          clock: {
            title: 'Đồng hồ',
            description: 'Đặt múi giờ cục bộ dùng cho nhật ký và giao diện',
            current: 'Thời gian hiện tại',
            timezone: 'Múi giờ'
          },
          servers: {
            title: 'Máy chủ NTP',
            description:
              'Dùng máy chủ công cộng mặc định, bộ định tuyến cục bộ hoặc máy chủ NTP tùy chỉnh',
            useRouter: 'Dùng bộ định tuyến',
            useDefaults: 'Dùng mặc định',
            presets: 'Máy chủ đặt trước',
            presetsDesc: 'Thay danh sách máy chủ bằng một cấu hình đặt trước'
          }
        },
        firewall: {
          saveFailed: 'Không thể áp dụng cài đặt tường lửa',
          saved: 'Đã áp dụng cài đặt tường lửa',
          cancel: 'Hủy',
          refresh: 'Làm mới',
          backends: 'Backend',
          enableHttpsFirst: 'Hãy bật HTTPS trước khi bật chế độ tường lửa Hạn chế hoặc Hoang tưởng',
          httpsRequired:
            'Các chế độ Hạn chế và Hoang tưởng bị tắt cho đến khi HTTPS được bật trong Cài đặt > Mạng > Dịch vụ',
          mode: {
            title: 'Chế độ tường lửa',
            baseline: 'Cơ bản',
            baselineDesc:
              'Hồ sơ mở để tương thích. Tường lửa vẫn chạy nhưng không giới hạn nguồn đến. Chỉ dùng trong mạng đáng tin cậy.',
            moderate: 'Vừa phải',
            moderateDesc:
              'Hồ sơ mặc định. Giữ các dịch vụ của Cơ bản, nhưng chỉ chấp nhận kết nối đến mới từ các dải riêng tư, link-local hoặc loopback. Truy cập đi ra vẫn được mở.',
            restricted: 'Hạn chế',
            restrictedDesc:
              'Chỉ HTTPS và SSH cục bộ, cùng DNS, NTP, syslog và cập nhật trực tuyến đi ra. DHCP và lưu lượng IPv6 thiết yếu vẫn khả dụng. WebRTC bị chặn.',
            paranoid: 'Hoang tưởng',
            paranoidDesc:
              'Chỉ truy cập HTTPS cục bộ. Chặn SSH, HTTP, cập nhật trực tuyến và các tính năng mạng đi ra khác. Việc tải lên bản cập nhật ngoại tuyến và các bản cài đặt đã chuẩn bị vẫn khả dụng.',
            current: 'Hiện tại',
            default: 'Mặc định',
            localOnly: 'Chỉ cục bộ',
            openTag: 'Đi vào: mở',
            httpsRequiredTag: 'Cần HTTPS',
            outboundOpen: 'Đi ra: mở',
            outboundLimited: 'Đi ra: hạn chế',
            httpsOnly: 'Chỉ HTTPS'
          },
          moderate: {
            apply: 'Chuyển sang Vừa phải'
          },
          restricted: {
            enable: 'Bật Hạn chế',
            confirmTitle: 'Bật chế độ Hạn chế?',
            confirmDesc:
              'Truy cập quản trị đi vào sẽ bị giới hạn cho HTTPS và SSH ở các dải nguồn private IPv4, IPv4 link-local/loopback, IPv6 link-local hoặc IPv6 loopback. Không cho phép dải nguồn công khai. DNS, NTP, syslog từ xa, cập nhật online, DHCP, kết nối đã thiết lập và lưu lượng điều khiển IPv6 thiết yếu đi ra vẫn khả dụng. WebRTC/ICE UDP và lưu lượng đi vào/đi ra khác sẽ bị chặn.'
          },
          paranoid: {
            enable: 'Bật Hoang tưởng',
            confirmTitle: 'Bật chế độ Hoang tưởng?',
            confirmDesc:
              'Chỉ truy cập HTTPS từ các dải nguồn private IPv4, IPv4 link-local/loopback, IPv6 link-local hoặc IPv6 loopback còn khả dụng. SSH, HTTP, mDNS, NTP, tải xuống GitHub và lưu lượng khác sẽ bị chặn ngoại trừ DHCP/điều khiển IPv6 tối thiểu.'
          },
          baseline: {
            apply: 'Chuyển sang Cơ bản',
            confirmTitle: 'Chuyển sang chế độ Cơ bản mở?',
            confirmDesc:
              'Dịch vụ tường lửa vẫn hoạt động nhưng bỏ hạn chế chỉ cho dải nguồn cục bộ. Các dải nguồn công khai có thể truy cập các dịch vụ NanoKVM đang mở nếu mạng định tuyến cho chúng.'
          },
          rules: {
            title: 'Quy tắc hiện tại',
            empty: 'Không có quy tắc'
          }
        },
        saveChanges: 'Lưu thay đổi',
        unsaved: 'Thay đổi chưa lưu'
      },
      systemLog: {
        saveFailed: 'Không thể lưu cài đặt nhật ký',
        saved: 'Đã lưu cài đặt nhật ký',
        invalidHost: 'Nhập host máy chủ syslog',
        logLoadFailed: 'Không thể tải nhật ký',
        save: 'Lưu',
        test: 'Gửi nhật ký thử',
        testSent: 'Đã gửi nhật ký thử',
        testFailed: 'Không thể gửi nhật ký thử',
        remote: {
          title: 'Ghi nhật ký từ xa',
          forward: 'Chuyển tiếp nhật ký hệ thống',
          description: 'Chuyển tiếp thông báo hệ thống tới máy chủ từ xa',
          host: 'Máy chủ',
          hostDesc: 'Tên máy chủ hoặc địa chỉ IPv4 của máy chủ syslog',
          port: 'Cổng',
          protocol: 'Cổng UDP của máy chủ syslog'
        },
        local: {
          title: 'Bộ đệm nhật ký hệ thống',
          description: 'Nhật ký hiện tại được giữ trong RAM tại {{path}} để tránh ghi vào thẻ SD',
          priority: 'Mức ưu tiên tối thiểu',
          priorityDesc: 'Mức khẩn cấp tối thiểu để thông báo được ghi',
          buffer: 'Kích thước bộ đệm',
          bufferDesc: 'Kích thước nhật ký mà tại đó tệp được xoay vòng',
          rotations: 'Luân phiên',
          rotationsDesc: 'Số tệp nhật ký đã xoay vòng được giữ lại',
          compact: 'Đầu ra gọn',
          compactDesc: 'Bỏ tên máy chủ và facility khỏi mỗi dòng',
          stripTimestamps: 'Loại bỏ timestamp',
          stripTimestampsDesc:
            'Xóa dấu thời gian do bên gửi thêm; syslog tự thêm dấu thời gian của nó'
        },
        kernel: {
          title: 'Ghi nhật ký kernel',
          enabled: 'Chuyển tiếp nhật ký kernel',
          enabledDesc: 'Ghi các thông báo kernel vào nhật ký hệ thống',
          consoleLevel: 'Mức console',
          consoleLevelDesc: 'Mức khẩn cấp tối thiểu để thông báo kernel được in ra bảng điều khiển'
        },
        viewer: {
          title: 'Nhật ký hệ thống',
          refresh: 'Làm mới',
          empty: 'Không có mục nhật ký',
          truncated: 'Chỉ hiển thị dữ liệu nhật ký mới nhất',
          linesUnit: 'dòng'
        },
        level: {
          '1': '1 - Cảnh báo',
          '2': '2 - Nghiêm trọng',
          '3': '3 - Lỗi',
          '4': '4 - Cảnh báo',
          '5': '5 - Thông báo',
          '6': '6 - Thông tin',
          '7': '7 - Debug',
          '8': '8 - Tất cả'
        }
      },
      user: {
        title: 'Người dùng'
      },
      networking: {
        title: 'Mạng'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Đường hầm mã hóa',
        device: 'Thiết bị này',
        description: 'Truy cập KVM này qua đường hầm WireGuard',
        unavailable: 'WireGuard chưa được cài đặt trên thiết bị này',
        blocked: 'Chế độ tường lửa Hoang tưởng chặn WireGuard',
        needsKey: 'Hãy đặt khóa riêng trước khi bật WireGuard',
        saved: 'Đã lưu cài đặt WireGuard',
        save: 'Lưu thay đổi',
        unsaved: 'Thay đổi chưa lưu',
        invalid: 'Hãy kiểm tra các trường được đánh dấu',
        invalidAddress: 'Nhập địa chỉ kèm mặt nạ, ví dụ 10.0.0.1/24',
        invalidKey: 'Nhập khóa WireGuard gồm 44 ký tự',
        invalidEndpoint: 'Nhập tên máy chủ hoặc địa chỉ IP',
        invalidPort: 'Nhập cổng từ 1 đến 65535',
        invalidRanges: 'Hãy dùng dải IPv4 như 10.0.0.0/24, không dùng 0.0.0.0/0',
        status: {
          connected: 'Đã kết nối',
          waiting: 'Đang chờ peer',
          stopped: 'Đã dừng',
          handshake: 'Handshake gần nhất {{time}}'
        },
        privateKey: {
          title: 'Khóa riêng',
          description: 'Chỉ nằm trên thiết bị này và không bao giờ hiển thị lại',
          set: 'Đã đặt',
          notSet: 'Chưa đặt',
          setBtn: 'Đặt',
          generate: 'Tạo',
          remove: 'Xóa',
          modalTitle: 'Đặt khóa riêng',
          modalDescription: 'Khóa được lưu trên thiết bị này và sẽ không bao giờ hiển thị lại',
          placeholder: 'Dán khóa riêng',
          generateConfirmTitle: 'Tạo khóa riêng mới?',
          generateConfirmDesc:
            'Khóa hiện tại sẽ ngừng hoạt động. Sau đó hãy thêm khóa công khai mới vào peer.',
          removeConfirmTitle: 'Xóa khóa riêng?',
          removeConfirmDesc:
            'WireGuard sẽ bị tắt và giữ nguyên trạng thái tắt cho đến khi đặt khóa mới.'
        },
        publicKey: {
          title: 'Khóa công khai',
          description: 'Thêm khóa này vào cấu hình của peer'
        },
        address: {
          title: 'Địa chỉ',
          description: 'Địa chỉ KVM trong đường hầm và mặt nạ của nó'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Khóa công khai',
          publicKeyDescription: 'Khóa công khai của peer mà bạn kết nối tới',
          server: 'Máy chủ',
          serverDescription: 'Tên máy chủ hoặc địa chỉ IP của peer',
          port: 'Cổng',
          portDescription: 'Cổng UDP của peer, thường là 51820',
          allowedIps: 'IP được phép',
          allowedIpsDescription: 'Địa chỉ hoặc dải của peer trong đường hầm, ví dụ 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Số giây giữa các gói keepalive, cần thiết khi ở sau bộ định tuyến'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Truy cập KVM này qua mạng Tailscale của bạn',
        service: 'Dịch vụ',
        performance: 'Hiệu năng',
        memory: {
          title: 'Tối ưu bộ nhớ',
          tip: 'Giữ mức dùng bộ nhớ của Tailscale ở mức thấp, giúp ích trên thiết bị có ít RAM. Hãy khởi động lại Tailscale để thay đổi có hiệu lực.'
        },
        swap: {
          title: 'Tệp hoán đổi',
          tip: 'Nếu sự cố vẫn tiếp diễn sau khi bật tối ưu hóa bộ nhớ, hãy thử bật tệp hoán đổi',
          sizeTip:
            'Việc này đặt kích thước tệp thành 128MB; có thể điều chỉnh trong Cài đặt > Hệ thống > Hiệu năng'
        },
        restartTitle: 'Khởi động lại Tailscale',
        restartDesc: 'Khởi động lại dịch vụ',
        restartBtn: 'Khởi động lại',
        restart: 'Khởi động lại Tailscale?',
        stopTitle: 'Dừng Tailscale',
        stopBtn: 'Dừng',
        stop: 'Dừng Tailscale?',
        stopDesc: 'Dừng dịch vụ và ngăn nó tự khởi động khi bật máy',
        loading: 'Đang tải...',
        notInstall: 'Không tìm thấy Tailscale, vui lòng cài đặt',
        install: 'Cài đặt',
        installing: 'Đang cài đặt',
        failed: 'Cài đặt thất bại',
        retry: 'Vui lòng làm mới và thử lại, hoặc cài đặt thủ công.',
        download: 'Tải xuống',
        package: 'gói cài đặt',
        unzip: 'và giải nén nó',
        upTailscale: 'Tải tailscale lên thư mục /usr/bin/ của NanoKVM',
        upTailscaled: 'Tải tailscaled lên thư mục /usr/sbin/ của NanoKVM',
        refresh: 'Làm mới trang hiện tại',
        notRunning: 'Tailscale không chạy. Hãy bắt đầu nó để tiếp tục.',
        run: 'Bắt đầu',
        notLogin:
          'Thiết bị chưa được liên kết. Vui lòng đăng nhập và liên kết thiết bị này với tài khoản của bạn.',
        urlPeriod: 'URL này có hiệu lực trong 10 phút',
        login: 'Đăng nhập',
        loginSuccess: 'Đăng nhập thành công',
        deviceName: 'Tên thiết bị',
        deviceIP: 'IP thiết bị',
        account: 'Tài khoản',
        logout: 'Đăng xuất',
        logoutDesc: 'Bạn có chắc chắn muốn đăng xuất không?',
        uninstall: 'Gỡ cài đặt Tailscale',
        uninstallDesc: 'Bạn có chắc chắn muốn gỡ cài đặt Tailscale không?',
        okBtn: 'Có',
        cancelBtn: 'Không'
      },
      update: {
        title: 'Cập nhật',
        currentVersion: 'Phiên bản hiện tại',
        latestVersion: 'Phiên bản mới nhất',
        queryFailed: 'Lấy phiên bản thất bại',
        updateFailed: 'Cập nhật thất bại',
        paranoidBlocked: 'Cập nhật online bị chặn bởi chế độ tường lửa Hoang tưởng',
        paranoidBlockedDesc:
          'Kiểm tra và tải xuống từ GitHub cần truy cập mạng đi ra. Tải lên offline và các bản cài đã chuẩn bị vẫn khả dụng.',
        available: 'Có bản cập nhật mới. Bạn có chắc chắn muốn cập nhật không?',
        updating: 'Bắt đầu cập nhật',
        confirm: 'Xác nhận',
        cancel: 'Hủy',
        badge: {
          checking: 'Đang kiểm tra',
          latest: 'Mới nhất',
          available: 'Có bản cập nhật',
          failed: 'Kiểm tra thất bại',
          local: 'Cục bộ'
        },
        application: {
          title: 'Ứng dụng'
        },
        system: {
          queryFailed: 'Không lấy được phiên bản hệ thống',
          appUpdateRequired:
            'Hãy cập nhật ứng dụng lên {{version}} trước khi cài đặt bản cập nhật hệ thống này',
          requiredAppVersion: 'Phiên bản ứng dụng bắt buộc',
          downloadFailed: 'Tải xuống hoặc xác minh thất bại',
          available: 'Có bản cập nhật hệ thống nền.',
          downloading: 'Đang tải xuống và xác minh cập nhật hệ thống...',
          downloadVerify: 'Tải xuống và xác minh',
          installing: 'Đang cài đặt cập nhật hệ thống đã chuẩn bị...',
          install: 'Cài đặt',
          installFailed: 'Cài đặt thất bại',
          installConfirmTitle: 'Cài đặt cập nhật hệ thống?',
          installConfirmDesc:
            'Việc này sẽ thay thế tệp hệ thống nền từ gói đã xác minh. Sẽ cần khởi động lại.',
          rawInstallConfirmDesc:
            'Gói đã xác minh này sẽ ghi image raw boot/rootfs vào các phân vùng thẻ SD và tự động khởi động lại. Việc ghi có thể mất vài phút; giữ nguồn điện kết nối.',
          rawInstallWarning:
            'Không có rollback tự động cho cập nhật phân vùng raw. Nếu boot thất bại, hãy khôi phục thẻ SD thủ công.',
          rawWaitTitle: 'Đang cài đặt bản cập nhật hệ thống',
          rawWaitWriting: 'Đang ghi hệ thống mới vào thẻ SD',
          rawWaitRestarting:
            'Thiết bị đang khởi động lại. Trang này sẽ tải lại khi thiết bị hoạt động trở lại.',
          rawWaitDesc:
            'Quá trình này mất khoảng ba phút. Hãy giữ nguồn điện được kết nối và không đóng trang này.',
          rawWaitSlow: 'Quá trình này lâu hơn dự kiến. Hãy chờ thêm vài phút trước khi ngắt nguồn.',
          rebootRequired: 'Cần khởi động lại để kích hoạt trạng thái hệ thống này.',
          rollingBack: 'Đang rollback cập nhật hệ thống...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback đã chuẩn bị',
          rollbackFailed: 'Rollback thất bại',
          rollbackConfirmTitle: 'Rollback cập nhật hệ thống?',
          rollbackConfirmDesc:
            'Việc này sẽ khôi phục tệp từ bản sao lưu cập nhật hệ thống mới nhất. Sẽ cần khởi động lại.',
          stagedDesc:
            'Bản cập nhật hệ thống đã được tải xuống và xác minh, bạn có thể cài đặt ngay',
          refresh: 'Làm mới',
          releaseNotes: 'Ghi chú phát hành',
          systemVersion: 'Phiên bản hệ thống',
          kernel: 'Kernel',
          stagedVersion: 'Phiên bản đã chuẩn bị',
          archive: 'Lưu trữ',
          requiredFree: 'Dung lượng trống cần thiết',
          fileCount: 'Tệp',
          rawImages: 'Image raw',
          progress: 'Tiến trình',
          progressMessage: 'Thông báo tiến trình',
          pendingVersion: 'Phiên bản đang chờ',
          bootHealth: 'Tình trạng boot',
          healthy: 'Ổn',
          unhealthy: 'Cần chú ý',
          rollbackBackup: 'Bản sao lưu rollback'
        },
        offline: {
          title: 'Tải lên gói ứng dụng',
          desc: 'Cài đặt gói ứng dụng từ máy tính này. Sau đó máy chủ sẽ khởi động lại.',
          installTitle: 'Cài đặt bản cập nhật ứng dụng?',
          installDesc: 'Ứng dụng sẽ được thay thế và máy chủ khởi động lại. Bạn cần đăng nhập lại.'
        },
        local: {
          title: 'Tải lên gói hệ thống',
          desc: 'Cài đặt gói hệ thống từ máy tính này. Một tệp chứa tệp lưu trữ và siêu dữ liệu đã ký của nó.',
          choose: 'Chọn tệp',
          invalidFile: 'Chọn một gói có đuôi .tar hoặc .tar.gz.',
          diskTitle: 'Tắt đĩa ảo?',
          diskWarn:
            'Gói được lưu vào /data, vốn chỉ đọc khi đĩa ảo đang bật. Sau khi tắt, máy tính không còn truy cập được /data. Tiếp tục?',
          uploading: 'Đang tải lên',
          verifying: 'Đang xác minh và chuẩn bị gói',
          keyTitle: 'Khóa cập nhật cục bộ',
          keyDesc: 'Khóa công khai định dạng PEM được phép ký các gói do bạn tự xây dựng',
          keyNone: 'Chưa đặt khóa',
          keySet: 'Đặt khóa',
          keyRemove: 'Xóa',
          signer: 'Được ký bởi',
          section: 'Cập nhật cục bộ',
          keyRequired: 'Cần khóa cục bộ'
        }
      },
      account: {
        title: 'Tài khoản',
        webAccount: 'Tên tài khoản web',
        password: 'Mật khẩu',
        passwordDesc: 'Đổi mật khẩu dùng để đăng nhập vào giao diện web',
        updateBtn: 'Đổi',
        logoutBtn: 'Đăng xuất',
        logoutDesc: 'Bạn có chắc chắn muốn đăng xuất không?',
        okBtn: 'Có',
        cancelBtn: 'Không',
        session: {
          title: 'Phiên'
        },
        logoutOnClose: {
          title: 'Đăng xuất khi đóng trình duyệt',
          description: 'Kết thúc phiên khi đóng trình duyệt thay vì giữ phiên mở'
        },
        totp: {
          title: 'Xác thực hai yếu tố',
          authenticator: 'Ứng dụng xác thực',
          description: 'Yêu cầu mã theo thời gian từ ứng dụng xác thực ngoài mật khẩu',
          required: 'Bắt buộc theo chính sách',
          disable: 'Tắt',
          enableTitle: 'Thiết lập xác thực hai yếu tố',
          enableDescription:
            'Xác nhận mật khẩu của bạn để tiếp tục. Cần mật khẩu cho mọi thay đổi của yếu tố thứ hai.',
          continue: 'Tiếp tục',
          disableTitle: 'Tắt xác thực hai yếu tố?',
          disableDescription:
            'Tài khoản của bạn sẽ chỉ được bảo vệ bằng mật khẩu. Xác nhận bằng mật khẩu để tiếp tục.',
          disableFailed: 'Không thể tắt xác thực hai yếu tố',
          passwordPlaceholder: 'Mật khẩu hiện tại',
          enrollFailed: 'Không thể bắt đầu thiết lập',
          invalidCode: 'Mã này không khớp. Hãy thử mã tiếp theo.',
          scan: 'Quét mã này bằng ứng dụng xác thực của bạn.',
          manualEntry: 'Hoặc nhập khóa này thủ công:',
          codePlaceholder: 'Nhập mã 6 chữ số để xác nhận',
          confirm: 'Xác nhận',
          cancel: 'Hủy',
          backupTitle: 'Hãy lưu mã dự phòng của bạn ngay bây giờ',
          backupDescription:
            'Mỗi mã chỉ dùng được một lần và sẽ không hiển thị lại. Đây là cách duy nhất để vào lại nếu bạn mất ứng dụng xác thực, và chúng vẫn hoạt động khi đồng hồ thiết bị chưa được đồng bộ.',
          copy: 'Sao chép',
          copied: 'Đã sao chép mã dự phòng',
          savedThem: 'Tôi đã lưu',
          remaining: 'Còn {{remaining}} mã dự phòng',
          clockUnsynced:
            'Đồng hồ thiết bị chưa được đồng bộ. Hãy đồng bộ thời gian tại Cài đặt > Hệ thống > Thời gian trước khi thiết lập.',
          noBackupCodes: 'Không còn mã dự phòng nào. Chọn Tạo để cấp một bộ mới.',
          regenerate: 'Mã dự phòng mới',
          generate: 'Tạo',
          regenerateTitle: 'Cấp mã dự phòng mới?',
          regenerateDescription:
            'Các mã dự phòng hiện tại sẽ ngừng hoạt động. Xác nhận bằng mật khẩu để tiếp tục.',
          regenerateFailed: 'Không thể cấp mã dự phòng mới',
          download: 'Tải xuống',
          copyFailed: 'Không thể sao chép. Hãy chọn các mã và sao chép thủ công.',
          requireTitle: 'Bắt buộc xác thực hai yếu tố',
          requireDescription:
            'Ngăn tắt xác thực hai yếu tố, và tài khoản chưa có phải thiết lập trước khi dùng thiết bị',
          requireFailed: 'Không thể thay đổi yêu cầu',
          requiredTitle: 'Cần xác thực hai yếu tố',
          requiredDescription:
            'Thiết bị này được cấu hình để yêu cầu yếu tố thứ hai, nhưng tài khoản của bạn chưa thiết lập. Hãy thiết lập ngay để tiếp tục.'
        }
      }
    },
    picoclaw: {
      title: 'Trợ lý PicoClaw',
      empty: 'Mô tả một nhiệm vụ để bắt đầu',
      inputPlaceholder: 'Mô tả những gì bạn muốn PicoClaw làm',
      newConversation: 'Cuộc trò chuyện mới',
      processing: 'Đang xử lý...',
      agent: {
        defaultTitle: 'Trợ lý chung',
        defaultDescription: 'Trợ giúp chung về trò chuyện, tìm kiếm và không gian làm việc',
        kvmTitle: 'Điều khiển từ xa',
        kvmDescription: 'Vận hành máy chủ từ xa thông qua NanoKVM',
        switched: 'Vai trò đại lý đã chuyển đổi',
        switchFailed: 'Chuyển đổi vai trò đại lý không thành công'
      },
      send: 'Gửi',
      cancel: 'Hủy',
      status: {
        connecting: 'Đang kết nối với cổng...',
        connected: 'Phiên PicoClaw đã kết nối',
        disconnected: 'Phiên PicoClaw đã ngắt kết nối',
        stopped: 'Đã gửi yêu cầu dừng',
        runtimeStarted: 'Runtime PicoClaw đã bắt đầu',
        runtimeStartFailed: 'Không khởi động được runtime PicoClaw',
        runtimeStopped: 'Runtime PicoClaw đã dừng',
        runtimeStopFailed: 'Không dừng được runtime PicoClaw'
      },
      connection: {
        runtime: {
          checking: 'Đang kiểm tra',
          ready: 'Runtime đã sẵn sàng',
          stopped: 'Đã dừng runtime',
          unavailable: 'Runtime không khả dụng',
          configError: 'Lỗi cấu hình'
        },
        transport: {
          connecting: 'Đang kết nối',
          connected: 'Đã kết nối'
        },
        run: {
          idle: 'Nhàn rỗi',
          busy: 'Bận'
        }
      },
      error: {
        lockHeld: 'PicoClaw đang được dùng ở cửa sổ khác',
        takenOver: 'Cửa sổ khác đã tiếp quản PicoClaw',
        authFailed: 'PicoClaw đã từ chối kết nối',
        upstreamClosed: 'Đã mất kết nối với PicoClaw'
      },
      tool: {
        screenshot: 'Đang chụp ảnh màn hình',
        loadImage: 'Đang xem ảnh màn hình',
        actions: 'Đang điều khiển máy chủ',
        generic: 'Đang dùng {{name}}',
        type: 'Đang nhập {{text}}',
        hotkey: 'Đang nhấn {{keys}}',
        click: 'Đang nhấp',
        doubleClick: 'Đang nhấp đúp',
        move: 'Đang di chuyển chuột',
        drag: 'Đang kéo',
        scroll: 'Đang cuộn',
        wait: 'Đang chờ'
      },
      message: {
        toolAction: 'Hành động',
        observation: 'Quan sát',
        screenshot: 'Ảnh chụp màn hình'
      },
      overlay: {
        locked: 'PicoClaw đang điều khiển thiết bị. Việc nhập thủ công bị tạm dừng.'
      },
      install: {
        install: 'Cài đặt PicoClaw',
        installing: 'Đang cài đặt PicoClaw',
        success: 'PicoClaw cài đặt thành công',
        failed: 'Không cài đặt được PicoClaw',
        uninstalled: 'Đã gỡ cài đặt thành công PicoClaw',
        uninstallFailed: 'Gỡ cài đặt không thành công',
        requiredTitle: 'PicoClaw chưa được cài đặt',
        requiredDescription: 'Cài đặt PicoClaw trước khi bắt đầu runtime PicoClaw.',
        progressDescription: 'PicoClaw đang được tải xuống và cài đặt.',
        stages: {
          preparing: 'Đang chuẩn bị',
          downloading: 'Đang tải xuống',
          extracting: 'Đang giải nén',
          verifying: 'Đang xác minh',
          installing: 'Đang cài đặt',
          installed: 'Đã cài đặt',
          install_timeout: 'Đã hết thời gian',
          install_failed: 'Không thành công'
        }
      },
      model: {
        requiredTitle: 'Cần có cấu hình mô hình',
        requiredDescription:
          'Định cấu hình mô hình PicoClaw trước khi sử dụng trò chuyện PicoClaw.',
        docsTitle: 'Hướng dẫn cấu hình',
        docsDesc: 'Các mô hình và giao thức được hỗ trợ',
        menuLabel: 'Cấu hình mô hình',
        modelIdentifier: 'Định danh mô hình',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'URL cơ sở của API',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Khóa API',
        apiKeyPlaceholder: 'Nhập khóa API của mô hình',
        apiKeyKeepPlaceholder: 'Để trống để giữ khóa hiện tại',
        save: 'Lưu',
        saving: 'Đang lưu',
        saved: 'Đã lưu cấu hình mô hình',
        saveFailed: 'Không lưu được cấu hình mô hình',
        invalid: 'Bắt buộc nhập mã định danh mô hình, URL cơ sở của API và khóa API'
      },
      uninstall: {
        confirmTitle: 'Gỡ cài đặt PicoClaw',
        confirmContent:
          'Bạn có chắc chắn muốn gỡ cài đặt PicoClaw không? Thao tác này sẽ xóa tệp thực thi và tất cả các tệp cấu hình.',
        confirmOk: 'Gỡ cài đặt'
      },
      history: {
        title: 'Lịch sử',
        loading: 'Đang tải phiên...',
        emptyTitle: 'Chưa có lịch sử',
        emptyDescription: 'Các phiên PicoClaw trước đó sẽ xuất hiện ở đây.',
        loadFailed: 'Không tải được lịch sử phiên',
        deleteFailed: 'Không xóa được phiên',
        deleteConfirmTitle: 'Xóa phiên',
        deleteConfirmContent: 'Bạn có chắc chắn muốn xóa "{{title}}" không?',
        deleteConfirmOk: 'Xóa',
        messageCount_other: '{{count}} tin nhắn'
      },
      config: {
        startRuntime: 'Bắt đầu PicoClaw',
        stopRuntime: 'Dừng PicoClaw',
        stopConfirm: 'Dừng PicoClaw?'
      },
      start: {
        title: 'Bắt đầu PicoClaw',
        description: 'Bắt đầu runtime để sử dụng trợ lý PicoClaw.'
      }
    },
    error: {
      title: 'Chúng tôi đã gặp sự cố',
      refresh: 'Làm mới'
    },
    fullscreen: {
      toggle: 'Chuyển đổi toàn màn hình'
    },
    menu: {
      collapse: 'Thu gọn menu'
    }
  }
};

export default vi;
