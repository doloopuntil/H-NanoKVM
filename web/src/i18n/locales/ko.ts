const ko = {
  translation: {
    common: {
      confirm: '확인',
      cancel: '취소',
      save: '저장',
      discard: '변경 취소',
      delete: '삭제',
      actionFailed: '작업에 실패했습니다',
      loading: '기기에서 설정을 불러오는 중...',
      loadFailed: '기기에서 설정을 불러오지 못했습니다',
      retry: '다시 시도'
    },
    head: {
      desktop: '원격 데스크톱',
      login: '로그인',
      firstSetup: '첫 설정',
      changePassword: '비밀번호 변경',
      terminal: '터미널',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: '로그인',
      placeholderUsername: '사용자 이름을 입력하세요',
      placeholderPassword: '비밀번호를 입력하세요',
      placeholderPassword2: '비밀번호를 다시 입력하세요',
      noEmptyUsername: '사용자 이름은 비어있을 수 없습니다',
      noEmptyPassword: '비밀번호는 비어있을 수 없습니다',
      invalidUser: '사용자 이름이나 비밀번호가 틀렸습니다',
      locked: '로그인 횟수가 너무 많습니다. 나중에 다시 시도해 주세요',
      globalLocked: '시스템이 보호 중입니다. 나중에 다시 시도해 주세요',
      error: '알 수 없는 오류',
      changePassword: '비밀번호 변경',
      changePasswordDesc: '보안을 위해 웹 로그인 비밀번호를 변경하세요',
      differentPassword: '비밀번호가 서로 일치하지 않습니다',
      illegalUsername: '사용자 이름에 사용할 수 없는 문자가 있습니다',
      illegalPassword: '비밀번호는 8자 이상이어야 하며 따옴표나 슬래시를 포함할 수 없습니다',
      forgetPassword: '비밀번호 분실',
      ok: '확인',
      cancel: '취소',
      loginButtonText: '로그인',
      setupTitle: '관리자 계정 만들기',
      setupDescription:
        '이 장치에는 아직 웹 계정이 없습니다. 계속하려면 첫 관리자 계정을 만드세요.',
      setupRecovery: '이 비밀번호를 잃어버리면 복구를 위해 SD 카드를 다시 기록해야 합니다',
      setupButtonText: '계정 만들기',
      tips: {
        hardenedRecovery:
          '이 Hardened 이미지는 BOOT 버튼을 통한 암호 재설정을 지원하지 않습니다. 암호를 잃어버리면 SD 카드를 다시 기록하고 새 계정을 만드세요.',
        change1: '이 작업을 수행하면 다음 비밀번호가 변경됩니다:',
        change2: '웹 로그인 비밀번호',
        change3: 'SSH 로그인용 시스템 루트 비밀번호'
      },
      placeholderCurrentPassword: '현재 비밀번호',
      placeholderNewPassword: '새 비밀번호',
      wrongCurrentPassword: '현재 비밀번호가 올바르지 않습니다',
      totp: {
        title: '2단계 인증',
        prompt: '인증 앱의 6자리 코드를 입력하세요',
        backupPrompt: '백업 코드 중 하나를 입력하세요',
        noEmptyCode: '코드를 입력하세요',
        placeholderCode: '6자리 코드',
        placeholderBackup: '백업 코드',
        verifyButtonText: '확인',
        useBackupCode: '백업 코드 사용',
        useAuthenticator: '인증 앱 코드 사용',
        cancel: '뒤로',
        invalidCode: '유효하지 않은 코드입니다. 다시 시도하세요.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'NanoKVM Wi-Fi 설정',
      success: 'NanoKVM의 네트워크 상태를 확인하고 새 IP 주소로 접속하세요',
      failed: '작업에 실패했으니 다시 시도하세요',
      invalidMode:
        '현재 모드는 네트워크 설정을 지원하지 않습니다. 장치로 이동하여 Wi-Fi 구성 모드를 활성화하십시오.',
      confirmBtn: '확인',
      finishBtn: '완료',
      ap: {
        authTitle: '인증 필요',
        authDescription: '계속하려면 AP 비밀번호를 입력하세요',
        authFailed: '잘못된 AP 비밀번호',
        passPlaceholder: 'AP 비밀번호',
        verifyBtn: '확인'
      }
    },
    screen: {
      scale: '배율',
      title: '화면',
      video: '비디오 모드',
      videoDirectTips: '이 모드를 사용하려면 "설정 > 네트워크 > 서비스"에서 HTTPS를 활성화하세요',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC는 제한 및 파라노이드 방화벽 모드에서 비활성화됩니다',
      transferRunningTitle: '이미지 전송 중',
      transferRunningDesc:
        '비디오 모드를 변경하면 페이지가 다시 로드되어 진행 중인 이미지 업로드 또는 다운로드가 취소됩니다.',
      transferRunningOk: '모드 변경',
      resolution: '해상도',
      auto: '자동 설정',
      autoTips:
        '일부 해상도에서는 화면이 왜곡되거나 마우스 동작이 비정상적으로 나타날 수 있으니 원격 컴퓨터의 해상도를 변경하거나 자동 모드를 끄세요',
      fps: 'FPS',
      customizeFps: '사용자 지정',
      quality: '품질',
      qualityLossless: '무손실',
      qualityHigh: '높음',
      qualityMedium: '중간',
      qualityLow: '낮음',
      frameDetect: '프레임 탐지',
      frameDetectTip:
        '프레임을 비교하여 원격 호스트 화면이 변하지 않는 동안 비디오 전송을 중지합니다',
      resetHdmi: 'HDMI 초기화',
      webrtcConnectionFailed: {
        title: 'WebRTC 연결에 실패했습니다',
        description: '네트워크 연결을 확인하거나 비디오 모드를 전환하세요'
      },
      captureStatus: {
        hdmiError: 'HDMI 화면 오류',
        unsupportedResolution: '현재 해상도는 지원되지 않습니다',
        retrieving: '화면을 가져오는 중...',
        changingResolution: '해상도를 전환하는 중...',
        updateFailed: '지금은 화면을 업데이트할 수 없습니다',
        videoError: '비디오 표시 오류',
        noHdmi: 'HDMI 신호가 감지되지 않았습니다',
        unavailable: '지금은 화면을 표시할 수 없습니다'
      }
    },
    keyboard: {
      title: '키보드',
      paste: '붙여넣기',
      tips: '표준 키보드 문자 및 기호만 지원됩니다',
      placeholder: '붙여넣을 텍스트',
      local: '모바일 키보드',
      virtual: '화면 키보드',
      readClipboard: '클립보드에서 읽기',
      clipboardPermissionDenied:
        '클립보드 권한이 거부되었으니 브라우저에서 클립보드 액세스를 허용해 주세요',
      clipboardReadError: '클립보드를 읽지 못했습니다',
      dropdownEnglish: '영어',
      dropdownGerman: '독일어',
      dropdownFrench: '프랑스어',
      dropdownRussian: '러시아어',
      dropdownKorean: '한국어',
      dropdownJapanese: '일본어',
      localInput: '모바일 키보드 입력',
      shortcut: {
        title: '바로가기',
        custom: '사용자 지정',
        capture: '바로가기를 캡처하려면 여기를 클릭하세요',
        clear: '지우기',
        save: '저장',
        captureTips: 'Windows 키와 같은 시스템 수준 키를 캡처하려면 전체 화면 권한이 필요합니다',
        enterFullScreen: '전체 화면 모드를 전환합니다'
      },
      leaderKey: {
        title: '리더 키',
        desc: '브라우저 제한을 우회하고 시스템 바로가기를 원격 호스트에 직접 보냅니다',
        howToUse: '사용방법',
        simultaneous: {
          title: '동시 모드',
          desc1: '리더 키를 누른 상태에서 단축키를 누르세요.',
          desc2: '직관적이지만 시스템 단축키와 충돌할 수 있습니다.'
        },
        sequential: {
          title: '순차 모드',
          desc1: '리더 키를 누름 → 단축키를 순서대로 누름 → 리더 키를 다시 누름.',
          desc2: '더 많은 단계가 필요하지만 시스템 충돌을 완전히 방지합니다.'
        },
        enable: '리더 키 활성화',
        tip: '리더 키로 지정하면 이 키는 단축키 트리거로만 동작하며 기본 동작을 잃습니다.',
        placeholder: '리더 키를 누르세요',
        shiftRight: '오른쪽 Shift',
        ctrlRight: '오른쪽 Ctrl',
        metaRight: '오른쪽 Win',
        recorder: {
          rec: 'REC',
          activate: '키 활성화',
          input: '단축키를 누르세요'
        }
      }
    },
    mouse: {
      title: '마우스',
      cursor: '커서 스타일',
      default: '기본 커서',
      cell: '셀 커서',
      text: '텍스트 커서',
      grab: '잡기 커서',
      hide: '커서 숨기기',
      mode: '마우스 모드',
      absolute: '절대값 모드',
      relative: '상대값 모드',
      direction: '스크롤 휠 방향',
      scrollUp: '위로 스크롤',
      scrollDown: '아래로 스크롤',
      speed: '스크롤 휠 속도',
      sensitivity: '포인터 속도',
      sensitivityDesc:
        '데스크톱 상대 모드용: 낮은 값은 호스트 마우스 가속으로 인한 드리프트를 줄입니다',
      fast: '빠름',
      slow: '느림',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'KVM 영역 어디에서나 움직일 수 있으며, 원격 커서는 터치 사이의 위치를 유지하고 절대 HID와 동기화됩니다'
      },
      requestPointer: '상대값 모드를 사용 중이므로 커서를 찾으려면 데스크톱을 클릭하세요',
      resetHid: 'HID 초기화',
      hidOnly: {
        title: 'HID-Only 모드',
        desc: '마우스나 키보드가 응답하지 않고 HID를 재설정해도 해결되지 않으면 NanoKVM과 호스트 간의 호환성 문제일 수 있습니다.',
        tip1: 'HID-Only 모드를 활성화하면 가상 디스크와 가상 네트워크가 마운트 해제됩니다',
        tip2: 'HID-Only 모드에서는 이미지 마운트가 비활성화됩니다',
        tip3: '모드 전환 후 NanoKVM이 자동으로 재부팅됩니다',
        enable: 'HID-Only 모드 활성화',
        disable: 'HID-Only 모드 비활성화'
      }
    },
    image: {
      title: '이미지',
      loading: '불러오는 중...',
      empty: '아무것도 없습니다',
      mountMode: '마운트 방식',
      massStorage: '대용량 저장소',
      cdRom: 'CD-ROM',
      mountFailed: '마운트 실패',
      mountDesc:
        '일부 시스템에서는 이미지를 마운트하기 전에 원격 호스트에서 가상 디스크를 제거해야 합니다',
      diskOnWarn:
        '이미지를 마운트하면 가상 디스크가 꺼지고 컴퓨터에서 /data에 접근할 수 없게 됩니다. 계속하시겠습니까?',
      diskOffWarn:
        '가상 디스크가 꺼져 있어 이미지를 마운트하려면 먼저 켜야 합니다. 컴퓨터의 USB 장치가 다시 연결됩니다. 계속하시겠습니까?',
      unmountFailed: '언마운트 실패',
      unmountDesc:
        '일부 시스템에서는 이미지를 언마운트하기 전에 원격 호스트에서 수동으로 제거하여야 합니다',
      forceEject: '강제 제거',
      forceEjectConfirm:
        '호스트가 광학 드라이브를 잠갔습니다. 강제로 제거하면 가상 USB 장치가 잠시 연결 해제되므로 키보드와 마우스도 잠시 연결이 끊길 수 있습니다. 계속하시겠습니까?',
      usbReconnect: 'USB 다시 연결',
      usbReconnectConfirm:
        '원격 호스트가 미디어 변경을 인식하지 못했을 때만 USB gadget을 다시 연결하세요. 키보드와 마우스가 잠시 끊길 수 있습니다.',
      usbReconnectSuccess: 'USB가 다시 연결됨',
      usbReconnectFailed: 'USB 다시 연결 실패',
      addImage: '이미지 추가',
      fromUrl: 'URL에서',
      fromFile: '파일에서',
      turnOff: '끄기',
      eject: '제거',
      download: '다운로드',
      upload: '업로드',
      mountTitle: '이미지 마운트',
      deleteTitle: '이미지 삭제',
      deleteConfirm: '이 이미지를 제거하시겠습니까?',
      tips: {
        title: '업로드 방법',
        usb1: 'USB를 통해 NanoKVM을 컴퓨터에 연결하세요.',
        usb2: '설정 > 장치 > 가상 디스크에서 가상 디스크가 마운트되었는지 확인하세요.',
        usb3: '컴퓨터에서 가상 디스크를 열고 이미지 파일을 가상 디스크의 루트 디렉토리로 복사하세요.',
        scp1: 'NanoKVM과 컴퓨터가 동일한 로컬 네트워크에 있는지 확인하세요.',
        scp2: '컴퓨터에서 터미널을 열고 SCP 명령을 사용하여 이미지 파일을 NanoKVM의 /data 디렉터리에 업로드하세요.',
        scp3: '예시: scp [이미지 파일 경로] root@[NanoKVM IP 주소]:/data',
        tfCard: 'SD 카드',
        tf1: '이 방법은 Linux 시스템에서 지원됩니다',
        tf2: 'NanoKVM에서 SD 카드를 꺼냅니다. FULL 버전은 먼저 케이스를 분해하세요.',
        tf3: 'SD 카드를 카드 리더기에 삽입하고 컴퓨터에 연결하세요.',
        tf4: '이미지 파일을 SD 카드의 /data 디렉터리에 복사하세요.',
        tf5: 'SD 카드를 NanoKVM에 삽입하세요.'
      }
    },
    script: {
      title: '스크립트',
      upload: '업로드',
      run: '실행',
      runBackground: '백그라운드에서 실행',
      runFailed: '실행 실패',
      delDesc: '이 파일을 정말로 삭제합니까?',
      delete: '삭제',
      close: '닫기',
      unlockDesc:
        '스크립트는 NanoKVM에서 root로 실행됩니다. 스크립트를 업로드하거나 실행하려면 웹 계정 비밀번호를 입력하세요.',
      terminalRequired:
        '스크립트에는 웹 터미널 접근이 필요합니다. 먼저 설정에서 터미널을 활성화하세요.'
    },
    terminal: {
      title: '터미널',
      nanokvm: 'NanoKVM 터미널',
      serial: '시리얼 포트 터미널',
      unlockTitle: '터미널 잠금 해제',
      unlockDesc: '터미널 세션을 시작하려면 웹 계정 암호를 입력하세요',
      unlock: '잠금 해제',
      unlockFailed: '터미널 잠금 해제 실패',
      invalidCredentials: '잘못된 사용자 이름 또는 암호',
      locked: '시도가 너무 많으니 나중에 다시 시도하세요',
      sessionClosed: '터미널 세션이 닫혔습니다. 다시 연결하려면 잠금을 해제하세요.',
      sessionError: '터미널 연결 실패. 다시 시도하려면 잠금을 해제하세요.',
      serialPort: '시리얼 포트',
      serialPortPlaceholder: '예: /dev/ttyS1',
      baudrate: '전송 속도',
      parity: '패리티',
      parityNone: '없음',
      parityEven: '짝수',
      parityOdd: '홀수',
      flowControl: '흐름 제어',
      flowControlNone: '없음',
      flowControlSoft: '소프트웨어',
      flowControlHard: '하드웨어',
      dataBits: '데이터 비트',
      stopBits: '정지 비트',
      open: '터미널 열기'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: '패킷 전송 중...',
      sent: '패킷 전송 완료',
      input: 'MAC 주소',
      ok: '확인'
    },
    download: {
      input: '원격 이미지 URL',
      ok: 'OK',
      disabled:
        '저장소에 쓸 수 없어 지금은 이미지를 다운로드하거나 업로드할 수 없습니다. 이미지가 마운트되어 있으면 마운트를 해제한 다음 가상 디스크를 꺼서 저장소를 다시 쓸 수 있게 하세요.',
      diskShared: '이미지 다운로드를 사용하려면 가상 디스크를 끄세요',
      mountedImage:
        '이 이미지는 마운트되어 있으니 같은 이름의 파일을 업로드하기 전에 마운트를 해제하세요',
      diskOff: '가상 디스크 끄기',
      uploadbox: '여기에 파일을 놓거나 클릭하여 선택하세요',
      inputfile: '이미지 파일',
      NoISO: '이미지 없음',
      complete: '다운로드 완료',
      uploadComplete: '업로드 완료',
      downloading: '다운로드 중',
      uploading: '업로드 중',
      failed: '전송 실패',
      uploadFailed: '업로드 실패',
      stalled: '전송이 멈췄으니 연결을 확인하고 다시 시도하세요',
      canceled: '업로드 취소됨',
      downloadCanceled: '다운로드가 취소되었습니다',
      cancel: '취소',
      remoteDisabled: '원격 ISO 다운로드가 설정 > 사용자 > 환경설정에서 비활성화되어 있습니다',
      remoteFailed: '원격 ISO 다운로드 실패',
      sha256: '선택 사항 SHA-256 체크섬',
      sha256Placeholder: '64자 SHA-256 체크섬을 입력하세요',
      invalidSHA256: 'SHA-256은 64자의 16진수 문자열이어야 합니다',
      checksumFailed: '다운로드 실패: SHA-256 검증 실패'
    },
    power: {
      title: '전원',
      showConfirm: '확인',
      showConfirmTip: '전원 작업에는 추가 확인이 필요합니다',
      reset: '리셋',
      powerShort: '전원 버튼: 짧게 누르기',
      powerLong: '전원 버튼: 길게 누르기',
      resetConfirm: '리셋 작업을 실행하시겠습니까?',
      powerConfirm: '전원 작업을 실행하시겠습니까?',
      okBtn: '네',
      cancelBtn: '아니오'
    },
    settings: {
      title: '설정',
      about: {
        title: '정보',
        information: '정보',
        ip: 'IP 주소',
        mdns: '로컬 주소',
        application: '애플리케이션 버전',
        uptime: '가동 시간',
        community: '커뮤니티',
        credit: 'Sipeed의 <a1>NanoKVM</a1>과 woffko의 <a2>Hardened NanoKVM</a2>을 기반으로 합니다',
        hostname: '장치 이름',
        changeIn: '{{path}}에서 변경할 수 있습니다',
        updateIn: '{{path}}에서 업데이트할 수 있습니다',
        toggleIn: '{{path}}에서 켜거나 끌 수 있습니다'
      },
      appearance: {
        title: '환경설정',
        display: '표시',
        language: '언어',
        languageDesc: '인터페이스 언어를 선택하세요',
        webTitle: '웹 제목',
        webTitleDesc: '웹 페이지 제목 사용자 지정',
        layoutMode: '인터페이스 레이아웃',
        layoutModeDesc: '이 브라우저에서 휴대폰/터치 레이아웃 사용',
        layoutAuto: '자동',
        layoutMobile: '휴대폰',
        menuBar: {
          title: '메뉴 바',
          mode: '표시 모드',
          modeDesc: '메뉴 바를 화면에 표시합니다',
          modeOff: '꺼짐',
          modeAuto: '자동 숨기기',
          modeAlways: '항상 보이기',
          keyboardLedStatus: '키보드 잠금 표시기',
          keyboardLedStatusDesc: '원격 컴퓨터의 Num Lock, Caps Lock, Scroll Lock 상태 표시',
          icons: '하위 메뉴 아이콘',
          iconsDesc: '메뉴 바에 하위 메뉴 아이콘을 표시합니다',
          terminalWarningTitle: '웹 터미널을 활성화할까요?',
          terminalWarningDesc:
            '터미널은 브라우저에서 root shell을 엽니다. 신뢰할 수 있는 네트워크에서만 활성화하고 사용 후 끄세요.',
          terminalWarningConfirm: '활성화',
          remoteDownload: '원격 ISO 다운로드',
          remoteDownloadWarningTitle: '원격 ISO 다운로드를 활성화할까요?',
          remoteDownloadWarningDesc:
            'NanoKVM은 URL에서 ISO를 가져와 /data에 기록합니다. 신뢰할 수 있는 URL에만 활성화하고 완료 후 끄세요.',
          remoteDownloadWarningConfirm: '활성화'
        }
      },
      keyboardLedStatus: {
        groupLabel: '원격 키보드 잠금 상태',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: '켜짐',
        off: '꺼짐',
        unknown: '알 수 없음'
      },
      device: {
        title: '장치',
        minutes: '분',
        sections: {
          general: '일반',
          connectivity: '연결',
          hostConnection: '호스트 연결',
          inputOutput: '입력 및 출력'
        },
        oled: {
          title: 'OLED 시간 제한',
          description: 'OLED 화면 자동 절전',
          keepOn: 'OLED 계속 켜두기',
          keepOnDescription: 'OLED 화면을 끄지 않습니다'
        },
        ssh: {
          description: 'SSH 원격 접속 활성화',
          tip: '이 옵션을 활성화하기 전에 계정 > 비밀번호에서 강력한 비밀번호를 설정하세요'
        },
        swap: {
          title: '스왑',
          description: '메모리가 부족할 때 스왑 파일을 사용합니다',
          size: '스왑 크기',
          sizeDescription: '스왑 파일 크기 설정',
          tip: '이 기능을 활성화하면 SD 카드의 수명이 단축될 수 있습니다'
        },
        mouseJiggler: {
          title: '마우스 흔들기',
          description: '원격 호스트가 절전 모드로 진입하는 것을 방지',
          disable: '비활성화',
          absolute: '절대값 모드',
          relative: '상대값 모드'
        },
        sessionLock: {
          title: '비활성 시 세션 잠금',
          description: '이 시간이 지나면 다시 로그인을 요구합니다'
        },
        mdns: {
          description: 'mDNS 검색 서비스 활성화',
          tip: '.local 이름으로 이 장치에 접속할 수 있게 합니다. IP 주소로 접속하거나 DNS가 이미 호스트 이름을 확인해 주면 필요하지 않습니다.'
        },
        hdmi: {
          description: 'HDMI/모니터 출력 활성화',
          idleTimeoutTitle: '캡처 유휴 시간 제한',
          idleTimeoutDescription: '활성 시청자가 없는 상태가 다음 시간 동안 지속되면 HDMI 캡처 중지'
        },
        hidOnly: 'HID-Only 모드',
        hidOnlyDesc: '마우스나 키보드가 응답하지 않을 때 호스트와의 호환성을 높입니다',
        hidOnlyTip: 'HID-Only 모드는 가상 장치 에뮬레이션을 중지하고 기본 HID 제어만 유지합니다',
        disk: '가상 디스크',
        diskDesc: '원격 호스트에 SD 카드를 마운트합니다',
        diskLocked: '이미지가 마운트된 동안 꺼짐이며, 켜면 마운트가 해제됩니다',
        diskEnable: '가상 디스크 활성화',
        networkChange: '가상 네트워크 변경',
        diskCancelMount: '가상 디스크를 활성화하면 마운트된 이미지가 해제됩니다. 계속하시겠습니까?',
        networkCancelMount:
          '가상 네트워크를 변경하면 USB 연결이 다시 시작됩니다. 마운트된 이미지가 해제되고 가상 디스크가 활성화됩니다. 계속하시겠습니까?',
        diskTransferRunning:
          '이미지 전송이 진행 중입니다. 완료될 때까지 기다린 후 가상 디스크를 활성화하세요.',
        network: '가상 네트워크',
        networkDesc: '원격 호스트에서 가상 네트워크 카드를 마운트합니다',
        usbWakeup: 'USB 깨우기',
        usbWakeupDesc: '키보드 또는 마우스 이벤트가 원격 호스트를 깨우도록 허용합니다',
        usbWakeupTip: '호스트가 USB wakeup 메시지를 반복해서 기록하면 끄세요',
        hostname: {
          description: '네트워크에서 이 장치의 이름',
          reachable: '로컬 네트워크에서 {{address}} 주소로 접속할 수 있습니다'
        },
        rebootRequired: '재부팅 필요',
        rebootPending: '재부팅 필요: {{reasons}}',
        rebootReasons: {
          systemUpdate: '시스템 업데이트'
        },
        reboot: '재부팅',
        rebootDesc: 'NanoKVM을 재부팅하시겠습니까?',
        poweroff: '전원 끄기',
        poweroffDesc: 'NanoKVM의 전원을 끄시겠습니까? 다시 켜기 전까지는 접속할 수 없습니다.'
      },
      network: {
        title: 'IP & DNS',
        connection: '연결',
        configuration: '구성',
        wifi: {
          title: 'Wi-Fi',
          description: 'Wi-Fi 설정',
          apMode: 'AP 모드가 활성화되었습니다. QR 코드를 스캔하여 Wi-Fi에 연결하세요',
          connect: 'Wi-Fi 연결',
          connectDesc1: '네트워크 SSID와 비밀번호를 입력하세요',
          disconnect: '네트워크 연결을 끊으시겠습니까?',
          disconnectBtn: '연결 해제',
          connected: '연결됨',
          ssid: '이름',
          password: '비밀번호',
          joinBtn: '연결',
          cancelBtn: '취소'
        },
        tls: {
          description: 'HTTPS 프로토콜 활성화',
          tip: '주의: HTTPS 사용 시 특히 MJPEG 비디오 모드에서 지연 시간이 증가할 수 있습니다',
          restartTitle: '서버가 다시 시작됩니다',
          restartDesc:
            '프로토콜을 변경하면 서버가 다시 시작됩니다. 브라우저는 {{seconds}}초 후 새 주소로 전환됩니다:',
          restartOk: '적용 후 다시 시작',
          confirmTitle: '새 프로토콜을 유지할까요?',
          confirmDesc:
            '서버가 이제 {{protocol}}로 실행됩니다. 유지하지 않으면 {{seconds}}초 후 이전 프로토콜로 돌아갑니다.',
          confirmKeep: '유지',
          confirmRevert: '되돌리기',
          reverting:
            '이전 프로토콜로 되돌리는 중입니다. 브라우저는 {{seconds}}초 후 해당 주소로 전환됩니다.',
          certTitle: '새 인증서를 유지할까요?',
          certDesc:
            '서버가 이제 새 인증서를 사용합니다. 유지하지 않으면 {{seconds}}초 후 이전 인증서로 돌아갑니다.',
          certReverted: '이전 인증서가 복원되었습니다'
        },
        trustedProxies: {
          section: '리버스 프록시',
          title: '신뢰하는 프록시',
          description: '클라이언트 주소와 프로토콜을 알려 주는 것을 장치가 신뢰하는 리버스 프록시',
          tip: '목록에 있는 주소가 로그인 제한과 로그에 기록되는 클라이언트 주소를 정하므로 직접 관리하는 프록시만 추가하세요',
          none: '없음',
          edit: '편집',
          editRow: '목록 편집',
          editTitle: '신뢰하는 프록시 편집',
          editDescription: '목록을 바꾸려면 비밀번호가 필요합니다',
          dialogDescription:
            '각 리버스 프록시의 주소를 이 장치에서 보이는 대로 입력하거나 10.0.0.0/24 같은 범위를 입력하세요. 목록에 있는 프록시는 사용할 클라이언트 주소와 프로토콜을 장치에 알려 줍니다. 프록시가 전달하는 내용은 그대로 믿으므로 직접 관리하는 프록시만 추가하세요.'
        },
        certificate: {
          title: '인증서',
          desc: 'HTTPS 인증서의 출처',
          requesting: '인증서를 요청하는 중',
          selfSigned: '자체 서명',
          domain: '도메인',
          domainDesc: '이 장치를 가리켜야 하며 포트 443에 인터넷에서 접근할 수 있어야 합니다',
          domainTailscale: '이 장치에 대해 Tailscale이 설정함',
          domainInvalid: '전체 도메인 이름을 사용하세요, 예: kvm.example.org',
          email: '이메일',
          emailDesc: "선택 사항, Let's Encrypt 알림용",
          emailInvalid: '이메일 주소를 name@example.org 형식으로 입력하세요',
          validUntil: '유효 기간',
          valid: '유효',
          expiresSoon: '곧 만료',
          expired: '만료됨',
          lastRenewal: '마지막 갱신',
          renewed: '갱신됨',
          failed: '실패',
          renewNow: '지금 갱신',
          renewNowDesc: '기다리지 않고 새 인증서 요청',
          renewBtn: '갱신',
          applyTitle: '인증서 변경',
          applyOk: '적용',
          applyAcme:
            "장치가 Let's Encrypt에 인증서를 요청합니다. Let's Encrypt는 확인을 위해 인터넷에서 포트 443에 연결하며 최대 1분이 걸릴 수 있습니다. 요청이 실패하면 현재 인증서를 계속 사용합니다.",
          applyTailscale:
            '장치가 Tailscale에서 인증서를 받아 옵니다. 최대 1분이 걸릴 수 있습니다. 요청이 실패하면 현재 인증서를 계속 사용합니다.',
          applySelfSigned: '장치가 자체 서명 인증서로 돌아갑니다. 브라우저에 경고가 표시됩니다.',
          openTitle: '새 주소 열기',
          openDesc:
            '인증서가 준비되었습니다. 아래 주소를 열고 로그인하여 유지하세요. 3분 안에 확인하지 않으면 이전 인증서로 돌아갑니다.',
          openOk: '열기',
          blockedClock: '장치 시계가 동기화될 때까지 인증서를 요청할 수 없습니다',
          blockedParanoid: '방화벽 파라노이드 모드에서는 인증서 요청이 차단됩니다',
          tailscaleUnavailable:
            'Tailscale이 실행 중이 아니거나 tailnet에서 HTTPS 인증서가 사용 설정되지 않았습니다'
        },
        dns: {
          title: 'DNS',
          description: 'NanoKVM의 DNS 서버 설정',
          ipv4Title: 'IPv4',
          ipv4Description: '유선 인터페이스의 IPv4 주소를 설정합니다',
          servers: '서버',
          dhcp: 'DHCP',
          manual: '수동',
          apply: '적용',
          invalid: '유효한 IPv4 또는 IPv6 주소를 입력하세요',
          invalidNetwork: '유효한 IPv4 주소, 서브넷 마스크, 라우터를 입력하세요',
          saved: 'DNS 설정이 저장되었습니다',
          redirecting: '네트워크 설정이 저장되었습니다. 새 주소를 여는 중...',
          saveFailed: 'DNS 설정 저장 실패',
          unsaved: '저장되지 않은 변경사항',
          maxServers: '최대 {{count}}개의 DNS 서버가 허용됩니다',
          dhcpServersDescription: 'DNS 서버는 DHCP에서 자동으로 가져옵니다',
          manualServersDescription: 'IPv4 및 IPv6 서버를 지원합니다',
          interface: '인터페이스',
          ipAddress: 'IP 주소',
          subnetMask: '서브넷 마스크',
          router: '라우터'
        },
        ipv6: {
          title: 'IPv6',
          description: '유선 인터페이스의 IPv6 주소 설정',
          disabled: '비활성화됨',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: '수동',
          interface: '인터페이스',
          state: '상태',
          router: '라우터',
          addresses: '주소',
          dhcpv6Client: 'DHCPv6 클라이언트',
          notInstalled: '설치되지 않음',
          ipAddress: 'IPv6 주소',
          prefix: '프리픽스',
          invalidManual: '유효한 IPv6 주소, 프리픽스 및 라우터를 입력하세요',
          clientMissing:
            'DHCPv6 클라이언트가 설치되어 있지 않습니다. 먼저 일치하는 raw 시스템 업데이트를 설치하세요.',
          saved: 'IPv6 설정이 저장되었습니다',
          saveFailed: 'IPv6 설정 저장 실패',
          unsaved: '저장되지 않은 변경 사항'
        }
      },
      system: {
        title: '시스템',
        performance: {
          processor: '프로세서',
          overdrive: {
            title: '클럭 오버드라이브',
            description: '제조업체가 지정한 더 높은 프로세서 및 비디오 클럭으로 부팅합니다',
            tip: '오버드라이브로 장치가 시작되지 않으면 SD 카드를 다시 기록해야 합니다',
            unavailable: '이 시스템 이미지에는 포함되어 있지 않습니다',
            keepTitle: '업데이트 후에도 오버드라이브 유지',
            keepDescription:
              '이 옵션을 켜지 않으면 시스템 업데이트 후 장치가 표준 클럭으로 돌아갑니다',
            confirmTitle: '클럭 오버드라이브를 사용하시겠습니까?',
            confirmText:
              '오버드라이브로 장치가 시작되지 않으면 복구를 위해 SD 카드를 다시 기록해야 합니다. 변경 사항은 다음 재부팅 후 적용됩니다.',
            confirmOk: '활성화'
          },
          watchdog: {
            title: '하드웨어 워치독',
            description: '응답하지 않을 때 장치를 자동으로 다시 시작합니다',
            unavailable: '이 시스템 이미지에 포함되어 있지 않습니다',
            notRunning: '현재 실행 중이 아닙니다',
            lastRestart: '마지막 재시작',
            lastRestartCaption: '시스템이 가장 최근에 다시 시작된 이유',
            reasonPowerOn: '전원 켜짐',
            reasonRestart: '재시작 요청',
            reasonWatchdog: '워치독 리셋',
            reasonOverheat: '과열 보호',
            reasonUnknown: '알 수 없음'
          },
          recovery: '복구',
          memory: '메모리'
        },
        monitor: {
          processorClock: 'CPU 서브시스템',
          videoClock: '비디오 서브시스템',
          videoClockCaption: '비디오 클럭 주파수',
          cpuClockCaption: 'CPU 클럭 주파수',
          overdrive: '오버드라이브',
          temperature: '온도',
          lastMinutes: '최근 5분',
          ram: 'RAM',
          off: '꺼짐',
          ramHistory: 'RAM 사용률',
          cpuLoad: 'CPU 부하',
          cpuLoadCaption: '사용자 {{user}} 퍼센트, 시스템 {{system}} 퍼센트',
          cpuUtilization: 'CPU 사용률',
          swapUtilization: '스왑 사용률',
          swapSizeLastMinutes: '{{size}}, 최근 5분',
          percent: '{{percent}} 퍼센트',
          percentUsed: '{{percent}} 퍼센트 사용',
          sizeOf: '{{used}} / {{total}}',
          systemPartition: '시스템 파티션',
          dataPartition: '데이터 파티션',
          unavailable: '사용할 수 없음',
          noReadings: '장치가 측정값을 반환하지 않습니다',
          refresh: '이 페이지가 열려 있는 동안 1초마다 업데이트됩니다'
        },
        sections: {
          time: '시간',
          firewall: '방화벽',
          systemLog: '로깅',
          performance: '성능',
          monitor: '모니터',
          services: '서비스',
          webInterface: '보안 웹 접속'
        },
        time: {
          saveFailed: '시간 설정을 저장하지 못했습니다',
          saved: '시간 설정이 저장되었습니다',
          syncFailed: '시간 동기화에 실패했습니다',
          synced: '시간이 동기화되었습니다',
          invalidServers: 'NTP 서버를 하나 이상 입력하세요',
          maxServers: '최대 {{count}}개의 NTP 서버가 허용됩니다',
          refresh: '새로 고침',
          syncNow: '동기화',
          syncNowDesc: '지금 NTP 서버로 시계를 설정합니다',
          save: '저장',
          ntp: {
            title: 'NTP',
            description: '구성된 NTP 서버에서 장치 시간을 동기화합니다'
          },
          networkTime: '네트워크 시간',
          clock: {
            title: '시계',
            description: '로그와 UI에 사용할 로컬 시간대를 설정합니다',
            current: '현재 시간',
            timezone: '시간대'
          },
          servers: {
            title: 'NTP 서버',
            description: '기본 공용 서버, 로컬 라우터 또는 사용자 지정 NTP 서버를 사용합니다',
            useRouter: '라우터 사용',
            useDefaults: '기본값 사용',
            presets: '서버 프리셋',
            presetsDesc: '서버 목록을 프리셋으로 바꿉니다'
          }
        },
        firewall: {
          saveFailed: '방화벽 설정을 적용하지 못했습니다',
          saved: '방화벽 설정이 적용되었습니다',
          cancel: '취소',
          refresh: '새로 고침',
          backends: '백엔드',
          enableHttpsFirst:
            '제한 또는 파라노이드 방화벽 모드를 활성화하기 전에 HTTPS를 활성화하세요',
          httpsRequired:
            '설정 > 네트워크 > 서비스에서 HTTPS를 활성화하기 전까지 제한 및 파라노이드 모드는 비활성화됩니다',
          mode: {
            title: '방화벽 모드',
            baseline: '베이스라인',
            baselineDesc:
              '개방형 호환성 프로필입니다. 방화벽은 작동하지만 인바운드 소스를 제한하지 않습니다. 신뢰할 수 있는 네트워크에서만 사용하세요.',
            moderate: '보통',
            moderateDesc:
              '기본 프로필입니다. 베이스라인 서비스를 유지하되, 새 인바운드 연결은 사설, 링크 로컬 또는 루프백 범위에서만 허용합니다. 아웃바운드 접근은 열린 상태로 유지됩니다.',
            restricted: '제한',
            restrictedDesc:
              '로컬 전용 HTTPS와 SSH, 그리고 송신 DNS, NTP, syslog 및 온라인 업데이트를 허용합니다. DHCP와 필수 IPv6 트래픽은 계속 사용할 수 있습니다. WebRTC는 차단됩니다.',
            paranoid: '파라노이드',
            paranoidDesc:
              '로컬 전용 HTTPS 접근입니다. SSH, HTTP, 온라인 업데이트 및 기타 아웃바운드 네트워크 기능을 차단합니다. 오프라인 업데이트 업로드와 이미 준비된 설치는 계속 사용할 수 있습니다.',
            current: '현재',
            default: '기본',
            localOnly: '로컬 전용',
            openTag: '인바운드 개방',
            httpsRequiredTag: 'HTTPS 필요',
            outboundOpen: '아웃바운드 개방',
            outboundLimited: '아웃바운드 제한',
            httpsOnly: 'HTTPS만'
          },
          moderate: {
            apply: '보통으로 전환'
          },
          restricted: {
            enable: '제한 활성화',
            confirmTitle: '제한 모드를 활성화할까요?',
            confirmDesc:
              'HTTPS와 SSH의 수신 관리자 접근은 private IPv4, IPv4 link-local/loopback, IPv6 link-local 또는 IPv6 loopback 원본 범위로 제한됩니다. 공용 원본 범위는 허용되지 않습니다. 송신 DNS, NTP, 원격 syslog, 온라인 업데이트, DHCP, 기존 연결, 필수 IPv6 제어 트래픽은 계속 사용할 수 있습니다. WebRTC/ICE UDP 및 기타 수신/송신 트래픽은 차단됩니다.'
          },
          paranoid: {
            enable: '파라노이드 활성화',
            confirmTitle: '파라노이드 모드를 활성화할까요?',
            confirmDesc:
              'Private IPv4, IPv4 link-local/loopback, IPv6 link-local 또는 IPv6 loopback 원본 범위의 HTTPS 접근만 남습니다. SSH, HTTP, mDNS, NTP, GitHub 다운로드 및 기타 트래픽은 최소 DHCP/IPv6 제어 트래픽을 제외하고 차단됩니다.'
          },
          baseline: {
            apply: '베이스라인으로 전환',
            confirmTitle: '개방형 베이스라인 모드로 전환할까요?',
            confirmDesc:
              '방화벽 서비스는 계속 활성화되지만 로컬 전용 소스 범위 제한이 해제됩니다. 네트워크가 라우팅하는 경우 공용 소스 범위에서 노출된 NanoKVM 서비스에 접근할 수 있습니다.'
          },
          rules: {
            title: '현재 규칙',
            empty: '규칙 없음'
          }
        },
        saveChanges: '변경사항 저장',
        unsaved: '저장되지 않은 변경사항'
      },
      systemLog: {
        saveFailed: '로그 설정을 저장하지 못했습니다',
        saved: '로그 설정이 저장되었습니다',
        invalidHost: 'Syslog 서버 호스트를 입력하세요',
        logLoadFailed: '로그를 불러오지 못했습니다',
        save: '저장',
        test: '테스트 로그 보내기',
        testSent: '테스트 로그가 전송되었습니다',
        testFailed: '테스트 로그 전송에 실패했습니다',
        remote: {
          title: '원격 로깅',
          forward: '시스템 로그 전달',
          description: '시스템 메시지를 원격 서버로 전달합니다',
          host: '서버',
          hostDesc: 'Syslog 서버의 호스트 이름 또는 IPv4 주소',
          port: '포트',
          protocol: 'Syslog 서버의 UDP 포트'
        },
        local: {
          title: '시스템 로그 버퍼',
          description: 'SD 카드 쓰기를 피하기 위해 현재 로그는 {{path}}의 RAM에 보관됩니다',
          priority: '최소 우선순위',
          priorityDesc: '메시지를 기록하기 위한 최소 긴급도',
          buffer: '버퍼 크기',
          bufferDesc: '파일이 순환되는 로그 크기',
          rotations: '회전',
          rotationsDesc: '보관할 순환된 로그 파일 수',
          compact: '간결한 출력',
          compactDesc: '각 줄에서 호스트 이름과 facility를 생략합니다',
          stripTimestamps: '타임스탬프 제거',
          stripTimestampsDesc:
            '발신자가 추가한 타임스탬프를 제거합니다. syslog가 자체 타임스탬프를 추가합니다'
        },
        kernel: {
          title: '커널 로깅',
          enabled: '커널 로그 전달',
          enabledDesc: '커널 메시지를 시스템 로그에 기록합니다',
          consoleLevel: '콘솔 레벨',
          consoleLevelDesc: '커널 메시지를 콘솔에 출력하기 위한 최소 긴급도'
        },
        viewer: {
          title: '시스템 로그',
          refresh: '새로 고침',
          empty: '로그 항목 없음',
          truncated: '최신 로그 데이터만 표시됩니다',
          linesUnit: '줄'
        },
        level: {
          '1': '1 - 경보',
          '2': '2 - 치명적',
          '3': '3 - 오류',
          '4': '4 - 경고',
          '5': '5 - 알림',
          '6': '6 - 정보',
          '7': '7 - 디버그',
          '8': '8 - 모두'
        }
      },
      user: {
        title: '사용자'
      },
      networking: {
        title: '네트워크'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: '암호화 터널',
        device: '이 장치',
        description: 'WireGuard 터널을 통해 이 KVM에 접속합니다',
        unavailable: '이 장치에 WireGuard가 설치되어 있지 않습니다',
        blocked: '방화벽 파라노이드 모드에서는 WireGuard가 차단됩니다',
        needsKey: 'WireGuard를 켜기 전에 개인 키를 설정하세요',
        saved: 'WireGuard 설정이 저장되었습니다',
        save: '변경사항 저장',
        unsaved: '저장되지 않은 변경사항',
        invalid: '강조 표시된 항목을 확인하세요',
        invalidAddress: '10.0.0.1/24 처럼 마스크가 포함된 주소를 입력하세요',
        invalidKey: '44자의 WireGuard 키를 입력하세요',
        invalidEndpoint: '호스트 이름 또는 IP 주소를 입력하세요',
        invalidPort: '1에서 65535 사이의 포트를 입력하세요',
        invalidRanges: '0.0.0.0/0이 아닌 10.0.0.0/24 같은 IPv4 범위를 사용하세요',
        status: {
          connected: '연결됨',
          waiting: '피어를 기다리는 중',
          stopped: '중지됨',
          handshake: '마지막 핸드셰이크 {{time}}'
        },
        privateKey: {
          title: '개인 키',
          description: '이 장치에만 보관되며 다시 표시되지 않습니다',
          set: '설정됨',
          notSet: '설정 안 됨',
          setBtn: '설정',
          generate: '생성',
          remove: '제거',
          modalTitle: '개인 키 설정',
          modalDescription: '키는 이 장치에 저장되며 다시 표시되지 않습니다',
          placeholder: '개인 키 붙여넣기',
          generateConfirmTitle: '새 개인 키를 생성할까요?',
          generateConfirmDesc:
            '현재 키는 더 이상 작동하지 않습니다. 이후 새 공개 키를 피어에 추가하세요.',
          removeConfirmTitle: '개인 키를 제거할까요?',
          removeConfirmDesc: 'WireGuard가 꺼지며, 새 키를 설정할 때까지 꺼진 상태로 유지됩니다.'
        },
        publicKey: {
          title: '공개 키',
          description: '피어 설정에 추가하세요'
        },
        address: {
          title: '주소',
          description: '터널 내 KVM 주소와 마스크'
        },
        peer: {
          title: '피어',
          publicKey: '공개 키',
          publicKeyDescription: '연결할 피어의 공개 키',
          server: '서버',
          serverDescription: '피어의 호스트 이름 또는 IP 주소',
          port: '포트',
          portDescription: '피어의 UDP 포트, 보통 51820',
          allowedIps: '허용 IP',
          allowedIpsDescription: '10.0.0.0/24 같은 터널 내 피어의 주소 또는 범위',
          keepalive: '킵얼라이브',
          keepaliveDescription: '라우터 뒤에서 필요한 킵얼라이브 패킷 간격을 초 단위로 지정합니다'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Tailscale 네트워크를 통해 이 KVM에 접속합니다',
        service: '서비스',
        performance: '성능',
        memory: {
          title: '메모리 최적화',
          tip: 'Tailscale의 메모리 사용량을 낮게 유지하며, RAM이 적은 장치에서 도움이 됩니다. 변경 사항을 적용하려면 Tailscale을 다시 시작하세요.'
        },
        swap: {
          title: '스왑 파일',
          tip: '메모리 최적화를 활성화한 후에도 문제가 지속되면 스왑 파일을 활성화해 보세요',
          sizeTip: '파일 크기가 128MB로 설정되며, 설정 > 시스템 > 성능에서 조정할 수 있습니다'
        },
        restartTitle: 'Tailscale 다시 시작',
        restartDesc: '서비스를 다시 시작합니다',
        restartBtn: '다시 시작',
        restart: '정말로 Tailscale을 다시 시작하시겠습니까?',
        stopTitle: 'Tailscale 중지',
        stopBtn: '중지',
        stop: '정말로 Tailscale을 중지하시겠습니까?',
        stopDesc: '서비스를 중지하고 부팅 시 자동으로 시작되지 않게 합니다',
        loading: '불러오는 중...',
        notInstall: 'Tailscale이 없습니다, 설치해 주세요',
        install: '설치',
        installing: '설치중',
        failed: '설치 실패',
        retry: '새로고침하고 다시 시도하거나, 수동으로 설치하세요.',
        download: '다운로드 중 :',
        package: '패키지 설치',
        unzip: '압축 해제',
        upTailscale: 'tailscale을 NanoKVM의 /usr/bin/ 경로에 업로드하세요',
        upTailscaled: 'tailscaled를 NanoKVM의 /usr/sbin/ 경로에 업로드하세요',
        refresh: '현재 페이지 새로고침',
        notRunning: 'Tailscale이 실행되고 있지 않습니다. 계속하려면 시작해 주세요.',
        run: '시작',
        notLogin: '이 기기는 현재 연동 되지 않았습니다. 로그인해서 계정에 이 장치를 연동하세요.',
        urlPeriod: '이 주소는 10분간 유효합니다',
        login: '로그인',
        loginSuccess: '로그인 성공',
        deviceName: '장치 이름',
        deviceIP: '장치 IP',
        account: '계정',
        logout: '로그아웃',
        logoutDesc: '정말로 로그아웃 하시겠습니까?',
        uninstall: 'Tailscale 제거',
        uninstallDesc: '정말로 Tailscale을 제거할까요?',
        okBtn: '네',
        cancelBtn: '아니오'
      },
      update: {
        title: '업데이트',
        currentVersion: '현재 버전',
        latestVersion: '최신 버전',
        queryFailed: '버전 확인 실패',
        updateFailed: '업데이트 실패',
        paranoidBlocked: '온라인 업데이트는 파라노이드 방화벽 모드에서 차단됩니다',
        paranoidBlockedDesc:
          'GitHub 확인과 다운로드에는 송신 네트워크 접근이 필요합니다. 오프라인 업로드와 이미 준비된 설치는 계속 사용할 수 있습니다.',
        available: '업데이트가 가능합니다. 정말로 업데이트 할까요?',
        updating: '업데이트 시작',
        confirm: '확인',
        cancel: '취소',
        badge: {
          checking: '확인 중',
          latest: '최신',
          available: '업데이트 가능',
          failed: '확인 실패',
          local: '로컬'
        },
        application: {
          title: '애플리케이션'
        },
        system: {
          queryFailed: '시스템 버전을 가져오지 못했습니다',
          appUpdateRequired:
            '이 시스템 업데이트를 설치하기 전에 애플리케이션을 {{version}} 버전으로 업데이트하세요',
          requiredAppVersion: '필요한 애플리케이션 버전',
          downloadFailed: '다운로드 또는 검증 실패',
          available: '기본 시스템 업데이트가 있습니다.',
          downloading: '시스템 업데이트 다운로드 및 검증 중...',
          downloadVerify: '다운로드 및 검증',
          installing: '준비된 시스템 업데이트 설치 중...',
          install: '설치',
          installFailed: '설치 실패',
          installConfirmTitle: '시스템 업데이트를 설치할까요?',
          installConfirmDesc: '검증된 번들의 기본 시스템 파일로 교체합니다. 재부팅이 필요합니다.',
          rawInstallConfirmDesc:
            '이 검증된 번들은 raw boot/rootfs 이미지를 SD 카드 파티션에 쓰고 자동으로 재부팅합니다. 쓰기에는 몇 분이 걸릴 수 있으니 전원을 유지하세요.',
          rawInstallWarning:
            'Raw 파티션 업데이트에는 자동 rollback이 없습니다. 부팅이 실패하면 SD 카드를 수동으로 복구하세요.',
          rawWaitTitle: '시스템 업데이트 설치 중',
          rawWaitWriting: '새 시스템을 SD 카드에 쓰는 중',
          rawWaitRestarting:
            '장치를 다시 시작하는 중입니다. 장치가 돌아오면 이 페이지가 다시 로드됩니다.',
          rawWaitDesc: '약 3분 정도 걸립니다. 전원을 연결한 상태로 두고 이 페이지를 닫지 마세요.',
          rawWaitSlow: '예상보다 오래 걸리고 있습니다. 전원을 끄기 전에 몇 분 더 기다리세요.',
          rebootRequired: '이 시스템 상태를 활성화하려면 재부팅이 필요합니다.',
          rollingBack: '시스템 업데이트 rollback 중...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback 준비됨',
          rollbackFailed: 'Rollback 실패',
          rollbackConfirmTitle: '시스템 업데이트를 rollback할까요?',
          rollbackConfirmDesc:
            '최신 시스템 업데이트 백업에서 파일을 복원합니다. 재부팅이 필요합니다.',
          stagedDesc: '시스템 업데이트를 다운로드하고 검증했습니다, 지금 설치할 수 있습니다',
          refresh: '새로 고침',
          releaseNotes: '릴리스 노트',
          systemVersion: '시스템 버전',
          kernel: 'Kernel',
          stagedVersion: '준비된 버전',
          archive: '아카이브',
          requiredFree: '필요한 여유 공간',
          fileCount: '파일',
          rawImages: 'Raw 이미지',
          progress: '진행률',
          progressMessage: '진행 메시지',
          pendingVersion: '대기 중인 버전',
          bootHealth: '부팅 상태',
          healthy: '정상',
          unhealthy: '주의 필요',
          rollbackBackup: 'Rollback 백업'
        },
        offline: {
          title: '애플리케이션 번들 업로드',
          desc: '이 컴퓨터에서 애플리케이션 번들을 설치합니다. 이후 서버가 다시 시작됩니다.',
          installTitle: '애플리케이션 업데이트를 설치할까요?',
          installDesc: '애플리케이션이 교체되고 서버가 다시 시작됩니다. 다시 로그인해야 합니다.'
        },
        local: {
          title: '시스템 번들 업로드',
          desc: '이 컴퓨터에서 시스템 번들을 설치합니다. 파일 하나에 아카이브와 서명된 메타데이터가 들어 있습니다.',
          choose: '파일 선택',
          invalidFile: '.tar 또는 .tar.gz로 끝나는 번들을 선택하세요.',
          diskTitle: '가상 디스크를 끄시겠습니까?',
          diskWarn:
            '번들은 /data에 저장되며, 가상 디스크가 켜져 있는 동안에는 읽기 전용입니다. 가상 디스크를 끄면 컴퓨터에서 /data에 접근할 수 없게 됩니다. 계속하시겠습니까?',
          uploading: '업로드 중',
          verifying: '번들을 확인하고 준비하는 중',
          keyTitle: '로컬 업데이트 키',
          keyDesc: '직접 빌드한 번들에 서명할 수 있는 PEM 형식의 공개 키',
          keyNone: '설정된 키 없음',
          keySet: '키 설정',
          keyRemove: '제거',
          signer: '서명자',
          section: '로컬 업데이트',
          keyRequired: '로컬 키 필요'
        }
      },
      account: {
        title: '계정',
        webAccount: '웹 계정',
        password: '비밀번호',
        passwordDesc: '웹 인터페이스에 로그인할 때 사용하는 비밀번호를 변경합니다',
        updateBtn: '변경',
        logoutBtn: '로그아웃',
        logoutDesc: '정말로 로그아웃 하시겠습니까?',
        okBtn: '네',
        cancelBtn: '아니오',
        session: {
          title: '세션'
        },
        logoutOnClose: {
          title: '브라우저를 닫으면 로그아웃',
          description: '세션을 유지하지 않고 브라우저를 닫을 때 종료합니다'
        },
        totp: {
          title: '2단계 인증',
          authenticator: '인증 앱',
          description: '비밀번호 외에 인증 앱의 시간 기반 코드를 요구합니다',
          required: '정책상 필수',
          disable: '끄기',
          enableTitle: '2단계 인증 설정',
          enableDescription:
            '계속하려면 비밀번호를 확인하세요. 두 번째 인증 요소를 변경할 때마다 필요합니다.',
          continue: '계속',
          disableTitle: '2단계 인증을 끌까요?',
          disableDescription: '계정이 비밀번호만으로 보호됩니다. 계속하려면 비밀번호로 확인하세요.',
          disableFailed: '2단계 인증을 끌 수 없습니다',
          passwordPlaceholder: '현재 비밀번호',
          enrollFailed: '설정을 시작할 수 없습니다',
          invalidCode: '코드가 일치하지 않습니다. 다음 코드를 시도하세요.',
          scan: '인증 앱으로 이 코드를 스캔하세요.',
          manualEntry: '또는 이 키를 직접 입력하세요:',
          codePlaceholder: '확인을 위해 6자리 코드를 입력하세요',
          confirm: '확인',
          cancel: '취소',
          backupTitle: '백업 코드를 지금 저장하세요',
          backupDescription:
            '각 코드는 한 번만 사용할 수 있으며 다시 표시되지 않습니다. 인증 앱을 잃어버렸을 때 다시 로그인할 수 있는 유일한 방법이며, 장치 시계가 동기화되지 않아도 사용할 수 있습니다.',
          copy: '복사',
          copied: '백업 코드를 복사했습니다',
          savedThem: '저장했습니다',
          remaining: '남은 백업 코드: {{remaining}}개',
          clockUnsynced:
            '장치 시계가 아직 동기화되지 않았습니다. 설정하기 전에 설정 > 시스템 > 시간에서 시간을 동기화하세요.',
          noBackupCodes: '남은 백업 코드가 없습니다. 생성을 선택해 새로 발급하세요.',
          regenerate: '새 백업 코드',
          generate: '생성',
          regenerateTitle: '새 백업 코드를 발급할까요?',
          regenerateDescription:
            '현재 백업 코드는 더 이상 작동하지 않습니다. 계속하려면 비밀번호로 확인하세요.',
          regenerateFailed: '새 백업 코드를 발급할 수 없습니다',
          download: '다운로드',
          copyFailed: '복사할 수 없습니다. 코드를 선택하여 직접 복사하세요.',
          requireTitle: '2단계 인증 필수',
          requireDescription:
            '2단계 인증을 끌 수 없게 하며, 2단계 인증이 없는 계정은 장치를 사용하기 전에 설정해야 합니다',
          requireFailed: '요구 사항을 변경할 수 없습니다',
          requiredTitle: '2단계 인증이 필요합니다',
          requiredDescription:
            '이 장치는 두 번째 인증 요소를 요구하도록 설정되어 있지만, 계정에 아직 설정되어 있지 않습니다. 계속하려면 지금 설정하세요.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw 어시스턴트',
      empty: '작업을 설명하여 시작하세요',
      inputPlaceholder: 'PicoClaw가 무엇을 하기를 원하는지 설명하세요',
      newConversation: '새 대화',
      processing: '처리 중...',
      agent: {
        defaultTitle: '일반 어시스턴트',
        defaultDescription: '일반 대화, 검색, 작업 공간 지원',
        kvmTitle: '원격 제어',
        kvmDescription: 'NanoKVM을 통한 원격 호스트 제어',
        switched: '에이전트 역할 변경됨',
        switchFailed: '에이전트 역할 변경에 실패했습니다'
      },
      send: '전송',
      cancel: '취소',
      status: {
        connecting: '게이트웨이 연결 중...',
        connected: 'PicoClaw 세션이 연결되었습니다',
        disconnected: 'PicoClaw 세션이 종료되었습니다',
        stopped: '중지 요청이 전송되었습니다',
        runtimeStarted: 'PicoClaw 런타임이 시작되었습니다',
        runtimeStartFailed: 'PicoClaw 런타임 시작에 실패했습니다',
        runtimeStopped: 'PicoClaw 런타임이 중지되었습니다',
        runtimeStopFailed: 'PicoClaw 런타임 중지에 실패했습니다'
      },
      connection: {
        runtime: {
          checking: '확인 중',
          ready: '런타임 준비됨',
          stopped: '런타임 중지됨',
          unavailable: '런타임 사용 불가',
          configError: '구성 에러'
        },
        transport: {
          connecting: '연결 중',
          connected: '연결됨'
        },
        run: {
          idle: '대기',
          busy: '작업 중'
        }
      },
      error: {
        lockHeld: 'PicoClaw가 다른 창에서 사용 중입니다',
        takenOver: '다른 창이 PicoClaw를 인계받았습니다',
        authFailed: 'PicoClaw가 연결을 거부했습니다',
        upstreamClosed: 'PicoClaw와의 연결이 끊어졌습니다'
      },
      tool: {
        screenshot: '스크린샷을 찍는 중',
        loadImage: '스크린샷을 확인하는 중',
        actions: '호스트를 제어하는 중',
        generic: '{{name}} 사용 중',
        type: '{{text}} 입력 중',
        hotkey: '{{keys}} 누르는 중',
        click: '클릭하는 중',
        doubleClick: '더블 클릭하는 중',
        move: '마우스를 이동하는 중',
        drag: '드래그하는 중',
        scroll: '스크롤하는 중',
        wait: '대기 중'
      },
      message: {
        toolAction: '동작',
        observation: '관찰',
        screenshot: '스크린샷'
      },
      overlay: {
        locked: 'PicoClaw가 기기를 제어하고 있습니다. 수동 입력이 일시 중지됩니다.'
      },
      install: {
        install: 'PicoClaw 설치',
        installing: 'PicoClaw 설치 중',
        success: 'PicoClaw가 성공적으로 설치되었습니다',
        failed: 'PicoClaw 설치에 실패했습니다',
        uninstalled: 'PicoClaw를 성공적으로 제거했습니다',
        uninstallFailed: '삭제에 실패했습니다',
        requiredTitle: 'PicoClaw가 설치되지 않았습니다',
        requiredDescription: 'PicoClaw 런타임을 시작하기 전에 PicoClaw를 설치하세요.',
        progressDescription: 'PicoClaw가 다운로드되고 설치되고 있습니다.',
        stages: {
          preparing: '준비 중',
          downloading: '다운로드 중',
          extracting: '압축 해제 중',
          verifying: '검증 중',
          installing: '설치 중',
          installed: '설치 완료',
          install_timeout: '시간 초과',
          install_failed: '실패'
        }
      },
      model: {
        requiredTitle: '모델 구성이 필요합니다',
        requiredDescription: 'PicoClaw 채팅을 사용하기 전에 PicoClaw 모델을 구성하세요.',
        docsTitle: '구성 가이드',
        docsDesc: '지원하는 모델과 프로트콜',
        menuLabel: '모델 구성',
        modelIdentifier: '모델 식별자',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API 기본 URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API 키',
        apiKeyPlaceholder: '모델 API 키를 입력하세요',
        apiKeyKeepPlaceholder: '비워 두면 현재 키가 유지됩니다',
        save: '저장',
        saving: '저장 중',
        saved: '모델 구성이 저장되었습니다',
        saveFailed: '모델 구성 저장에 실패했습니다',
        invalid: '모델 식별자, API 기본 URL, API 키가 필요합니다'
      },
      uninstall: {
        confirmTitle: 'PicoClaw 제거',
        confirmContent: 'PicoClaw를 정말로 제거할까요? 실행 파일과 모든 구성 파일이 삭제됩니다.',
        confirmOk: '제거'
      },
      history: {
        title: '기록',
        loading: '기록 불러오는 중...',
        emptyTitle: '기록 없음',
        emptyDescription: '이전 PicoClaw 세션은 여기에 표시됩니다.',
        loadFailed: '세션 기록을 불러오지 못했습니다',
        deleteFailed: '세션 삭제에 실패했습니다',
        deleteConfirmTitle: '세션 삭제',
        deleteConfirmContent: '정말로 "{{title}}"를 삭제할까요?',
        deleteConfirmOk: '삭제',
        messageCount_other: '{{count}}개의 메시지'
      },
      config: {
        startRuntime: 'PicoClaw 시작',
        stopRuntime: 'PicoClaw 중지',
        stopConfirm: '정말로 PicoClaw를 중지하시겠습니까?'
      },
      start: {
        title: 'PicoClaw 시작',
        description: '런타임을 시작하여 PicoClaw 어시스턴트 사용을 시작하세요.'
      }
    },
    error: {
      title: '문제가 발생했습니다',
      refresh: '새로고침'
    },
    fullscreen: {
      toggle: '전체 화면 전환'
    },
    menu: {
      collapse: '메뉴 접기'
    }
  }
};

export default ko;
