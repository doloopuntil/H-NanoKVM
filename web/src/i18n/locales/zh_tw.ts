const zh_tw = {
  translation: {
    common: {
      confirm: '確認',
      cancel: '取消',
      close: '關閉',
      save: '儲存',
      discard: '捨棄',
      delete: '刪除',
      actionFailed: '操作失敗',
      loading: '正在從裝置載入設定...',
      loadFailed: '無法從裝置載入設定',
      retry: '重試'
    },
    head: {
      desktop: '遠端桌面',
      login: '登入',
      firstSetup: '首次設定',
      changePassword: '更改密碼',
      terminal: '終端機',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: '登入',
      placeholderUsername: '使用者名稱',
      placeholderPassword: '密碼',
      placeholderPassword2: '請再次輸入密碼',
      noEmptyUsername: '使用者名稱不能為空',
      noEmptyPassword: '密碼不能為空',
      invalidUser: '使用者名稱或密碼錯誤',
      locked: '登入次數過多，請稍後重試',
      globalLocked: '系統受保護，請稍後重試',
      error: '非預期性錯誤',
      changePassword: '更改密碼',
      changePasswordDesc: '為了您的裝置安全，請修改登入密碼',
      differentPassword: '密碼不一致',
      illegalUsername: '使用者名稱包含非法字元',
      illegalPassword: '密碼至少 8 個字元，且不能包含引號或斜線',
      forgetPassword: '忘記密碼',
      ok: '確定',
      cancel: '取消',
      loginButtonText: '登入',
      setupTitle: '建立管理員帳戶',
      setupDescription: '此裝置尚無網頁帳戶。請建立第一個管理員帳戶以繼續。',
      setupRecovery: '如果此密碼遺失，復原需要重新寫入 SD 卡',
      setupButtonText: '建立帳戶',
      tips: {
        hardenedRecovery:
          '此 Hardened 映像檔不支援透過 BOOT 按鈕重設密碼。如果密碼遺失，請重新寫入 SD 卡並建立新帳戶。',
        change1: '請注意，此操作將同時更新下列密碼：',
        change2: '網頁登入密碼',
        change3: '用於 SSH 登入的系統 root 密碼'
      },
      placeholderCurrentPassword: '目前密碼',
      placeholderNewPassword: '新密碼',
      wrongCurrentPassword: '目前密碼不正確',
      totp: {
        title: '兩步驟驗證',
        prompt: '請輸入驗證器 App 中的 6 位數驗證碼',
        backupPrompt: '請輸入其中一個備用碼',
        noEmptyCode: '請輸入驗證碼',
        placeholderCode: '6 位數驗證碼',
        placeholderBackup: '備用碼',
        verifyButtonText: '驗證',
        useBackupCode: '使用備用碼',
        useAuthenticator: '使用驗證器 App 的驗證碼',
        cancel: '返回',
        invalidCode: '此驗證碼無效，請再試一次。'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: '設定 NanoKVM Wi-Fi',
      success: '請檢查 NanoKVM 的網路狀態，並存取新的 IP 位址',
      failed: '操作失敗，請重試',
      invalidMode: '目前模式不支援設定網路。請先前往裝置啟用 Wi-Fi 配置模式。',
      confirmBtn: '確定',
      finishBtn: '完成',
      ap: {
        authTitle: '需要身份驗證',
        authDescription: '請輸入 AP 密碼繼續',
        authFailed: 'AP 密碼無效',
        passPlaceholder: 'AP 密碼',
        verifyBtn: '驗證'
      }
    },
    screen: {
      scale: '縮放',
      title: '螢幕',
      video: '影片模式',
      videoDirectTips: '本模式需先啟用 HTTPS，請前往「設定 > 網路 > 服務」中開啟',
      videoWebrtcBlockedByFirewall: 'H.264 WebRTC 在受限和偏執防火牆模式下已停用',
      transferRunningTitle: '映像檔傳輸進行中',
      transferRunningDesc: '切換影片模式會重新載入頁面，並取消正在進行的映像檔上傳或下載。',
      transferRunningOk: '切換模式',
      resolution: '解析度',
      auto: '自動',
      autoTips:
        '在某些特定解析度下可能會出現畫面撕裂或滑鼠偏移，請調整遠端主機的解析度或停用自動模式',
      fps: '更新頻率',
      customizeFps: '自定義',
      quality: '品質',
      qualityLossless: '無損',
      qualityHigh: '高',
      qualityMedium: '中',
      qualityLow: '低',
      frameDetect: '影格檢測',
      frameDetectTip: '比較影格，並在遠端主機畫面未變動時停止傳輸視訊',
      resetHdmi: '重置 HDMI',
      webrtcConnectionFailed: {
        title: 'WebRTC 連線失敗',
        description: '請檢查網路連線或切換影片模式'
      },
      captureStatus: {
        hdmiError: 'HDMI 畫面異常',
        unsupportedResolution: '目前解析度不支援',
        retrieving: '正在取得畫面...',
        changingResolution: '正在切換解析度...',
        updateFailed: '畫面暫時無法更新',
        videoError: '影片顯示異常',
        noHdmi: '未偵測到 HDMI 訊號',
        unavailable: '畫面暫時無法顯示'
      }
    },
    keyboard: {
      title: '鍵盤',
      paste: '貼上',
      tips: '僅支援標準鍵盤的字母和符號',
      placeholder: '要貼上的文字',
      local: '行動鍵盤',
      virtual: '螢幕鍵盤',
      readClipboard: '從剪貼簿讀取',
      clipboardPermissionDenied: '剪貼簿權限被拒絕，請允許您的瀏覽器存取剪貼簿',
      clipboardReadError: '無法讀取剪貼簿',
      dropdownEnglish: '英語',
      dropdownGerman: '德語',
      dropdownFrench: '法語',
      dropdownRussian: '俄語',
      dropdownKorean: '韓語',
      dropdownJapanese: '日語',
      localInput: '行動裝置鍵盤輸入',
      shortcut: {
        title: '快捷鍵',
        custom: '自定義',
        capture: '點選此處錄製快捷鍵',
        clear: '清空',
        save: '儲存',
        captureTips: '擷取系統級按鍵，如 Windows 鍵，需要全螢幕權限',
        enterFullScreen: '切換全螢幕模式'
      },
      leaderKey: {
        title: '引導鍵',
        desc: '繞過瀏覽器限制並將系統捷徑直接傳送到遠端主機',
        howToUse: '如何使用',
        simultaneous: {
          title: '同步模式',
          desc1: '按住引導鍵不放，同時按下目標快捷鍵。',
          desc2: '直觀，但可能與系統快速鍵衝突。'
        },
        sequential: {
          title: '順序模式',
          desc1: '點擊引導鍵開始 → 依序點擊快捷鍵 → 再次點擊引導鍵結束。',
          desc2: '需要更多步驟，但完全避免了系統衝突。'
        },
        enable: '啟用引導鍵',
        tip: '設為引導鍵後，該按鍵將僅用於觸發快捷鍵，不再作為普通按鍵使用。',
        placeholder: '按下引導鍵',
        shiftRight: '右 Shift',
        ctrlRight: '右 Ctrl',
        metaRight: '右 Win',
        recorder: {
          rec: '記錄',
          activate: '啟用按鍵',
          input: '按下快捷鍵'
        }
      }
    },
    mouse: {
      title: '滑鼠',
      cursor: '游標樣式',
      default: '預設游標',
      cell: '儲存格游標',
      text: '文字游標',
      grab: '抓取游標',
      hide: '隱藏游標',
      mode: '滑鼠模式',
      absolute: '絕對模式',
      relative: '相對模式',
      direction: '滾輪方向',
      scrollUp: '向上',
      scrollDown: '向下',
      speed: '滾輪速度',
      sensitivity: '指標速度',
      sensitivityDesc: '用於桌面相對模式：較低數值可減少主機滑鼠加速造成的漂移',
      fast: '快',
      slow: '慢',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          '可在 KVM 區域任意位置移動，遠端游標會在兩次觸控之間保持位置，並與絕對 HID 保持同步'
      },
      requestPointer: '正在使用滑鼠相對模式，請按一下桌面以取得滑鼠游標',
      resetHid: '重設 HID',
      hidOnly: {
        title: 'HID-Only 模式',
        desc: '如果滑鼠或鍵盤停止回應，且重設 HID 無效，可能是 NanoKVM 與主機之間存在相容性問題。',
        tip1: '啟用 HID-Only 模式將卸載虛擬磁碟和虛擬網路',
        tip2: '在 HID-Only 模式下，映像檔掛載會被停用',
        tip3: 'NanoKVM 將在切換模式後自動重新啟動',
        enable: '啟用 HID-Only 模式',
        disable: '停用 HID-Only 模式'
      }
    },
    image: {
      title: '映像檔',
      loading: '載入中...',
      empty: '未找到任何內容',
      mountMode: '掛載為',
      mount: '掛載',
      orDownload: '或從連結下載',
      keepRunning: '可以關閉此視窗。傳輸會繼續進行，進度會顯示在映像檔清單中。',
      massStorage: '大量儲存裝置',
      cdRom: 'CD-ROM',
      mountFailed: '掛載失敗',
      mountDesc: '在某些系統中，需要在遠端主機中彈出虛擬硬碟後再掛載映像檔',
      diskOnWarn: '掛載映像檔會關閉虛擬磁碟，電腦將無法再存取 /data 目錄。是否繼續？',
      diskOffWarn:
        '虛擬磁碟目前已關閉，需要先開啟才能掛載映像檔，電腦上的 USB 裝置會短暫斷開重連。是否繼續？',
      unmountFailed: '解除安裝失敗',
      unmountDesc: '在某些系統中，需要在遠端主機中手動彈出後再解除安裝映像',
      forceEject: '強制彈出',
      forceEjectConfirm:
        '主機已鎖定光碟機。強制彈出會使虛擬 USB 裝置短暫中斷連線，鍵盤和滑鼠可能會暫時中斷連線。是否繼續？',
      usbReconnect: '重新連接 USB',
      usbReconnectConfirm:
        '僅在遠端主機未偵測到媒體變更時才重新連接 USB gadget。鍵盤和滑鼠可能會短暫中斷。',
      usbReconnectSuccess: 'USB 已重新連接',
      usbReconnectFailed: 'USB 重新連接失敗',
      addImage: '新增映像檔',
      fromUrl: '從網址',
      fromFile: '從檔案',
      turnOff: '關閉',
      deleteDiskShared: '虛擬磁碟開啟時無法刪除映像檔。',
      eject: '彈出',
      download: '下載',
      upload: '上傳',
      mountTitle: '掛載映像檔',
      deleteTitle: '刪除映像檔',
      deleteConfirm: '確定要刪除該映像檔嗎？',
      tips: {
        title: '如何上傳',
        usb1: '透過 USB 將 NanoKVM 連接到您的電腦。',
        usb2: '確保已在 設定 > 設備 > 虛擬磁碟 中掛載虛擬磁碟。',
        usb3: '開啟電腦上的虛擬磁碟，將映象檔案複製到虛擬磁碟的根目錄下。',
        scp1: '確保 NanoKVM 和您的電腦位於同一區域網路。',
        scp2: '開啟電腦上的終端機，使用 SCP 指令將映像檔案上傳到 NanoKVM 的 /data 目錄下。',
        scp3: '範例：scp your-image-path root@your-nanokvm-ip:/data',
        tfCard: 'microSD 卡',
        tf1: '此方法適用於 Linux 系統',
        tf2: '從 NanoKVM 取出 SD 卡。FULL 版本請先拆開外殼。',
        tf3: '使用 USB 讀卡機將 microSD 卡連接至電腦。',
        tf4: '將映像檔複製到 microSD 卡的 /data 目錄下。',
        tf5: '將 microSD 卡重新插回 NanoKVM。'
      }
    },
    script: {
      title: '指令碼',
      upload: '上傳',
      run: '執行',
      runBackground: '背景執行',
      runFailed: '執行失敗',
      delDesc: '確定要刪除該檔案嗎？',
      delete: '刪除',
      close: '關閉',
      unlockDesc: '腳本在 NanoKVM 上以 root 身分執行。請輸入 Web 帳戶密碼以上傳或執行腳本。',
      terminalRequired: '腳本需要 Web 終端機存取權限。請先在設定中啟用終端機。'
    },
    terminal: {
      title: '終端機',
      nanokvm: 'NanoKVM 終端機',
      serial: 'Serial Port 終端機',
      unlockTitle: '解鎖終端機',
      unlockDesc: '輸入網頁帳戶密碼以啟動終端機工作階段',
      unlock: '解鎖',
      unlockFailed: '解鎖終端機失敗',
      invalidCredentials: '使用者名稱或密碼無效',
      locked: '嘗試次數過多，稍後再試',
      sessionClosed: '終端機工作階段已關閉。請重新解鎖以連線。',
      sessionError: '終端機連線失敗。請重新解鎖後重試。',
      serialPort: '序列埠',
      serialPortPlaceholder: '例如 /dev/ttyS1',
      baudrate: '鮑率',
      parity: '同位檢查',
      parityNone: 'None',
      parityEven: '偶同位',
      parityOdd: '奇同位',
      flowControl: '流量控制',
      flowControlNone: 'None',
      flowControlSoft: '軟體',
      flowControlHard: '硬體',
      dataBits: '資料位元',
      stopBits: '停止位元',
      open: '開啟終端機'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: '發送指令中...',
      sent: '指令已發送',
      input: 'MAC 位址',
      ok: '確定'
    },
    download: {
      input: '映像檔的下載 URL',
      ok: 'OK',
      disabled:
        '目前無法下載或上傳映像檔，因為儲存空間不可寫入。若映像檔已掛載，請先卸載，然後關閉虛擬磁碟，讓儲存空間恢復可寫入。',
      diskShared: '關閉虛擬磁碟功能以使用映像檔下載功能',
      mountedImage: '此映像檔已掛載，上傳同名檔案前請先卸載',
      diskOff: '關閉虛擬磁碟功能',
      uploadbox: '將檔案拖曳到此處或按一下選擇',
      inputfile: '映像檔',
      NoISO: '無映像檔',
      complete: '下載完成',
      uploadComplete: '上傳完成',
      downloading: '正在下載',
      uploading: '正在上傳',
      failed: '傳輸失敗',
      uploadFailed: '上傳失敗',
      stalled: '傳輸已停滯，請檢查連線後重試',
      canceled: '上傳已取消',
      downloadCanceled: '下載已取消',
      cancel: '取消',
      remoteDisabled: '遠端 ISO 下載已在 設定 > 使用者 > 偏好設定 中停用',
      remoteFailed: '遠端 ISO 下載失敗',
      sha256: '可選的 SHA-256 檢查碼',
      sha256Placeholder: '請輸入 64 位元 SHA-256 校驗和',
      invalidSHA256: 'SHA-256 必須是 64 位元十六進位字串',
      checksumFailed: '下載失敗：SHA-256 校驗失敗'
    },
    power: {
      title: '電源控制',
      showConfirm: '顯示確認框',
      showConfirmTip: '電源操作需要二次確認',
      reset: '重新啟動',
      powerShort: '電源按鈕：短按',
      powerLong: '電源按鈕：長按',
      resetConfirm: '確認執行重新啟動的按鍵操作嗎？',
      powerConfirm: '確認執行電源的按鍵操作嗎？',
      okBtn: '確認',
      cancelBtn: '取消'
    },
    settings: {
      title: '設定',
      about: {
        title: '關於',
        information: '資訊',
        ip: 'IP 位址',
        mdns: '本機位址',
        application: '應用程式版本',
        uptime: '執行時間',
        community: '社群',
        credit: '基於 Sipeed 的 <a1>NanoKVM</a1> 和 woffko 的 <a2>Hardened NanoKVM</a2> 建置',
        hostname: '裝置名稱',
        changeIn: '可在 {{path}} 中變更',
        updateIn: '可在 {{path}} 中更新',
        toggleIn: '可在 {{path}} 中開啟或關閉'
      },
      appearance: {
        title: '偏好設定',
        display: '顯示',
        language: '語言',
        languageDesc: '選擇介面語言',
        webTitle: '網頁標題',
        webTitleDesc: '自訂網頁標題',
        layoutMode: '介面佈局',
        layoutModeDesc: '在此瀏覽器中使用手機/觸控佈局',
        layoutAuto: '自動',
        layoutMobile: '手機',
        menuBar: {
          title: '選單列',
          mode: '顯示方式',
          modeDesc: '選單欄在螢幕上的顯示方式',
          modeOff: '關閉',
          modeAuto: '自動隱藏',
          modeAlways: '始終顯示',
          keyboardLedStatus: '鍵盤鎖定狀態指示燈',
          keyboardLedStatusDesc: '顯示遠端電腦的 Num Lock、Caps Lock 與 Scroll Lock 狀態',
          icons: '選單圖示',
          iconsDesc: '是否在選單欄中顯示子選單圖示',
          terminalWarningTitle: '啟用網頁終端機？',
          terminalWarningDesc:
            '終端機會在瀏覽器中開啟 root shell。僅在可信網路中啟用，完成後請關閉。',
          terminalWarningConfirm: '啟用',
          remoteDownload: '遠端 ISO 下載',
          remoteDownloadWarningTitle: '啟用遠端 ISO 下載？',
          remoteDownloadWarningDesc:
            'NanoKVM 將從 URL 取得 ISO 並寫入 /data。僅對可信 URL 啟用，完成後請關閉。',
          remoteDownloadWarningConfirm: '啟用'
        }
      },
      keyboardLedStatus: {
        groupLabel: '遠端鍵盤鎖定狀態',
        indicatorLabel: '{{label}}：{{state}}',
        numLock: '數字鎖定',
        numLockShort: '數',
        capsLock: '大寫鎖定',
        capsLockShort: '大',
        scrollLock: '捲動鎖定',
        scrollLockShort: '捲',
        on: '開啟',
        off: '關閉',
        unknown: '未知'
      },
      device: {
        title: '設備',
        minutes: '分鐘',
        sections: {
          general: '一般',
          connectivity: '連線',
          hostConnection: '主機連線',
          inputOutput: '輸入與輸出'
        },
        oled: {
          title: 'OLED 逾時',
          description: '設定 OLED 螢幕自動睡眠時間',
          keepOn: '保持 OLED 常亮',
          keepOnDescription: '從不關閉 OLED 螢幕'
        },
        ssh: {
          description: '啟用 SSH 伺服器',
          tip: '啟用此選項前，請在 帳號 > 密碼 中設定強密碼'
        },
        swap: {
          title: 'Swap',
          description: '記憶體不足時使用 Swap 檔',
          size: 'Swap 大小',
          sizeDescription: '設定 Swap 檔大小',
          tip: '啟用此功能可能會減少SD卡的使用壽命'
        },
        mouseJiggler: {
          title: '滑鼠抖動模式',
          description: '避免遠端主機進入休眠狀態',
          disable: '停用',
          absolute: '絕對模式',
          relative: '相對模式'
        },
        sessionLock: {
          title: '閒置時鎖定工作階段',
          description: '超過此時間後要求重新登入'
        },
        mdns: {
          description: '啟用 mDNS 發現服務',
          tip: '允許透過 .local 名稱存取此裝置。如果您透過 IP 位址連線，或 DNS 已能解析其主機名稱，則無需開啟。'
        },
        hdmi: {
          description: '啟用 HDMI/螢幕 輸出',
          idleTimeoutTitle: '擷取閒置逾時',
          idleTimeoutDescription: '沒有活躍觀看者時，在指定時間後停止 HDMI 擷取'
        },
        hidOnly: 'HID-Only 模式',
        hidOnlyDesc: '當滑鼠或鍵盤停止回應時，改善與主機的相容性',
        hidOnlyTip: 'HID-Only 模式會停止模擬虛擬設備，僅保留基礎 HID 控制',
        disk: '虛擬磁碟',
        diskDesc: '在遠端主機上掛載 SD 卡',
        diskLocked: '掛載映像檔期間已關閉，開啟會取消映像檔掛載',
        diskEnable: '啟用虛擬磁碟',
        networkChange: '變更虛擬網卡',
        diskCancelMount: '開啟虛擬磁碟會取消目前掛載的映像檔，是否繼續？',
        networkCancelMount:
          '更改虛擬網卡會重新啟動 USB 連線。這會取消目前掛載的映像檔並開啟虛擬磁碟。是否繼續？',
        diskTransferRunning: '映像檔傳輸正在進行。請等待其完成後再啟用虛擬磁碟。',
        network: '虛擬網卡',
        networkDesc: '在遠端主機上新增虛擬網卡',
        usbWakeup: 'USB 喚醒',
        usbWakeupDesc: '允許鍵盤或滑鼠事件喚醒遠端主機',
        usbWakeupTip: '如果主機反覆記錄 USB wakeup 訊息，請關閉',
        hostname: {
          description: '此裝置在網路中的名稱',
          reachable: '在本機網路中可透過 {{address}} 存取'
        },
        rebootRequired: '需要重新啟動',
        rebootPending: '需要重新啟動：{{reasons}}',
        rebootReasons: {
          systemUpdate: '系統更新'
        },
        reboot: '重新啟動',
        rebootDesc: '您確定要重新啟動 NanoKVM?',
        poweroff: '關機',
        poweroffDesc: '確定要關閉 NanoKVM 嗎？'
      },
      network: {
        title: 'IP & DNS',
        connection: '連線',
        configuration: '設定',
        wifi: {
          title: 'Wi-Fi',
          description: '設定 Wi-Fi',
          apMode: 'AP 模式已啟用，請掃描 QRCode 連接 Wi-Fi',
          connect: '連線 Wi-Fi',
          connectDesc1: '請輸入網路名稱和密碼',
          disconnect: '是否要中斷該網路連線？',
          disconnectBtn: '中斷連線',
          connected: '已連線',
          ssid: 'SSID 名稱',
          password: '密碼',
          joinBtn: '加入',
          cancelBtn: '取消'
        },
        tls: {
          description: '啟用 HTTPS 協議',
          tip: '啟用 HTTPS 可以提高安全性，但可能會增加傳輸延遲，特別是使用 MJPEG 格式傳輸時',
          restartTitle: '伺服器將重新啟動',
          restartDesc: '通訊協定變更會重新啟動伺服器。瀏覽器將在 {{seconds}} 秒後切換到新位址：',
          restartOk: '套用並重新啟動',
          confirmTitle: '保留新通訊協定？',
          confirmDesc:
            '伺服器現在使用 {{protocol}}。如果不保留，將在 {{seconds}} 秒後恢復為先前的通訊協定。',
          confirmKeep: '保留',
          confirmRevert: '返回',
          reverting: '正在恢復為先前的通訊協定。瀏覽器將在 {{seconds}} 秒後切換到該位址。',
          certTitle: '保留新憑證？',
          certDesc: '伺服器現在使用新憑證。如果不保留，將在 {{seconds}} 秒後恢復為先前的憑證。',
          certReverted: '已恢復先前的憑證'
        },
        trustedProxies: {
          section: '反向代理',
          title: '信任的代理',
          description: '裝置信任其回報用戶端位址與通訊協定的反向代理',
          tip: '清單中的位址會決定登入限制與記錄所記下的用戶端位址，因此只新增由你自己控制的代理',
          none: '無',
          edit: '編輯',
          editRow: '編輯清單',
          editTitle: '編輯信任的代理',
          editDescription: '變更清單需要你的密碼',
          dialogDescription:
            '輸入每個反向代理在此裝置上看到的位址，或像 10.0.0.0/24 這樣的範圍。清單中的代理會告訴裝置要使用哪個用戶端位址與通訊協定。它轉送的內容都會被採信，因此只新增由你自己控制的代理。'
        },
        certificate: {
          title: '憑證',
          desc: 'HTTPS 憑證的來源',
          requesting: '正在申請憑證',
          selfSigned: '自簽',
          domain: '網域',
          domainDesc: '必須指向此裝置，且連接埠 443 能從網際網路存取',
          domainTailscale: '由 Tailscale 為此裝置設定',
          domainInvalid: '請使用完整網域名稱，例如 kvm.example.org',
          email: '電子郵件',
          emailDesc: "選填，用於接收 Let's Encrypt 的通知",
          emailInvalid: '請使用類似 name@example.org 的位址',
          validUntil: '有效期限至',
          valid: '有效',
          expiresSoon: '即將到期',
          expired: '已到期',
          lastRenewal: '上次更新',
          renewed: '已更新',
          failed: '失敗',
          renewNow: '立即更新',
          renewNowDesc: '無需等待，申請新憑證',
          renewBtn: '更新',
          applyTitle: '變更憑證',
          applyOk: '套用',
          applyAcme:
            "裝置向 Let's Encrypt 申請憑證。Let's Encrypt 會從網際網路連線到連接埠 443 進行驗證，這最多可能需要一分鐘。如果申請失敗，將繼續使用目前的憑證。",
          applyTailscale:
            '裝置從 Tailscale 取得憑證，這最多可能需要一分鐘。如果申請失敗，將繼續使用目前的憑證。',
          applySelfSigned: '裝置將恢復使用自己的自簽憑證。瀏覽器會顯示警告。',
          openTitle: '開啟新位址',
          openDesc:
            '憑證已就緒。請開啟下方的位址並登入以保留它。如果 3 分鐘內未確認，將恢復為先前的憑證。',
          openOk: '開啟',
          blockedClock: '裝置時鐘同步後才能申請憑證',
          blockedParanoid: '防火牆偏執模式會封鎖憑證申請',
          tailscaleUnavailable: 'Tailscale 未執行，或 tailnet 未啟用 HTTPS 憑證'
        },
        dns: {
          title: 'DNS',
          description: '設定 NanoKVM 使用的 DNS 伺服器',
          ipv4Title: 'IPv4',
          ipv4Description: '設定有線介面的 IPv4 位址',
          servers: '伺服器',
          dhcp: 'DHCP',
          manual: '手動',
          apply: '套用',
          invalid: '請輸入有效的 IPv4 或 IPv6 位址',
          invalidNetwork: '請輸入有效的 IPv4 位址、子網路遮罩和路由器',
          saved: 'DNS 設定已儲存',
          redirecting: '網路設定已儲存。正在開啟新位址...',
          saveFailed: '儲存 DNS 設定失敗',
          unsaved: '有未儲存的變更',
          maxServers: '最多允許 {{count}} 個 DNS 伺服器',
          dhcpServersDescription: 'DNS 伺服器由 DHCP 自動取得',
          manualServersDescription: '支援 IPv4 與 IPv6 伺服器',
          interface: '介面',
          ipAddress: 'IP 位址',
          subnetMask: '子網路遮罩',
          router: '路由器'
        },
        ipv6: {
          title: 'IPv6',
          description: '為有線介面設定 IPv6 位址',
          disabled: '已停用',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: '手動',
          interface: '介面',
          state: '狀態',
          router: '路由器',
          addresses: '位址',
          dhcpv6Client: 'DHCPv6 客戶端',
          notInstalled: '未安裝',
          ipAddress: 'IPv6 位址',
          prefix: '前綴',
          invalidManual: '請輸入有效的 IPv6 位址、前綴和路由器',
          clientMissing: '尚未安裝 DHCPv6 客戶端。請先安裝相符的 raw 系統更新。',
          saved: 'IPv6 設定已儲存',
          saveFailed: '儲存 IPv6 設定失敗',
          unsaved: '未儲存的變更'
        }
      },
      system: {
        title: '系統',
        performance: {
          processor: '處理器',
          overdrive: {
            title: '時脈超頻',
            description: '以製造商指定的更高處理器與視訊時脈頻率啟動',
            tip: '如果裝置在超頻下無法啟動，必須重新燒錄 SD 卡',
            unavailable: '此系統映像不包含該選項',
            keepTitle: '更新後保持超頻',
            keepDescription: '除非開啟此項，否則系統更新後裝置將恢復為標準時脈',
            confirmTitle: '啟用時脈超頻？',
            confirmText:
              '如果裝置在超頻下無法啟動，必須重新燒錄 SD 卡才能復原。變更將在下次重新啟動後生效。',
            confirmOk: '啟用'
          },
          watchdog: {
            title: '硬體看門狗',
            description: '裝置停止回應時自動重新啟動',
            unavailable: '此系統映像檔未包含',
            notRunning: '目前未執行',
            lastRestart: '上次重新啟動',
            lastRestartCaption: '系統最近一次重新啟動的原因',
            reasonPowerOn: '上電',
            reasonRestart: '要求重新啟動',
            reasonWatchdog: '看門狗重設',
            reasonOverheat: '過熱保護',
            reasonUnknown: '未知'
          },
          recovery: '復原',
          memory: '記憶體'
        },
        monitor: {
          processorClock: 'CPU 子系統',
          videoClock: '視訊子系統',
          videoClockCaption: '視訊時脈頻率',
          cpuClockCaption: 'CPU 時脈頻率',
          overdrive: '超頻',
          temperature: '溫度',
          lastMinutes: '最近 5 分鐘',
          ram: 'RAM',
          off: '關閉',
          ramHistory: 'RAM 使用率',
          cpuLoad: 'CPU 負載',
          cpuLoadCaption: '使用者 {{user}} 百分比，系統 {{system}} 百分比',
          cpuUtilization: 'CPU 使用率',
          swapUtilization: '交換空間使用率',
          swapSizeLastMinutes: '{{size}}，最近 5 分鐘',
          percent: '{{percent}} %',
          percentUsed: '已用 {{percent}} %',
          sizeOf: '{{used}} / {{total}}',
          systemPartition: '系統分區',
          dataPartition: '資料分區',
          unavailable: '無法使用',
          noReadings: '裝置未回傳讀數',
          refresh: '此頁面開啟期間每秒更新一次'
        },
        sections: {
          time: '時間',
          firewall: '防火牆',
          systemLog: '記錄',
          performance: '效能',
          monitor: '監控',
          services: '服務',
          webInterface: '安全網頁存取'
        },
        time: {
          saveFailed: '儲存時間設定失敗',
          saved: '時間設定已儲存',
          syncFailed: '同步時間失敗',
          synced: '時間已同步',
          invalidServers: '請至少輸入一個 NTP 伺服器',
          maxServers: '最多允許 {{count}} 個 NTP 伺服器',
          refresh: '重新整理',
          syncNow: '同步',
          syncNowDesc: '立即以 NTP 伺服器設定時鐘',
          save: '儲存',
          ntp: {
            title: 'NTP',
            description: '從已設定的 NTP 伺服器同步裝置時間'
          },
          networkTime: '網路時間',
          clock: {
            title: '時鐘',
            description: '設定記錄和介面使用的本地時區',
            current: '目前時間',
            timezone: '時區'
          },
          servers: {
            title: 'NTP 伺服器',
            description: '使用預設公用伺服器、本機路由器或自訂 NTP 伺服器',
            useRouter: '使用路由器',
            useDefaults: '使用預設值',
            presets: '伺服器預設',
            presetsDesc: '以預設值取代伺服器清單'
          }
        },
        firewall: {
          saveFailed: '套用防火牆設定失敗',
          saved: '防火牆設定已套用',
          cancel: '取消',
          refresh: '重新整理',
          backends: '後端',
          enableHttpsFirst: '請先啟用 HTTPS，再啟用受限或偏執防火牆模式',
          httpsRequired: '在「設定 > 網路 > 服務」中啟用 HTTPS 之前，受限和偏執模式無法使用',
          mode: {
            title: '防火牆模式',
            baseline: '基準',
            baselineDesc:
              '開放的相容設定檔。防火牆正在執行，但不限制傳入來源。僅在可信任的網路中使用。',
            moderate: '適中',
            moderateDesc:
              '預設設定檔。保留基準的服務，但僅接受來自私有、連結本機或迴路範圍的新傳入連線。輸出存取保持開放。',
            restricted: '受限',
            restrictedDesc:
              '僅限本機的 HTTPS 和 SSH，以及輸出的 DNS、NTP、syslog 和線上更新。DHCP 和必要的 IPv6 流量仍然可用。WebRTC 已封鎖。',
            paranoid: '偏執',
            paranoidDesc:
              '僅限本機的 HTTPS 存取。封鎖 SSH、HTTP、線上更新和其他傳出網路功能。離線更新上傳和已暫存的安裝仍然可用。',
            current: '目前',
            default: '預設',
            localOnly: '僅限本機',
            openTag: '傳入開放',
            httpsRequiredTag: '需要 HTTPS',
            outboundOpen: '傳出開放',
            outboundLimited: '傳出受限',
            httpsOnly: '僅 HTTPS'
          },
          moderate: {
            apply: '切換到適中'
          },
          restricted: {
            enable: '啟用受限',
            confirmTitle: '啟用受限防火牆模式？',
            confirmDesc:
              '輸入管理存取會限制為 HTTPS 和 SSH 使用 private IPv4、IPv4 link-local/loopback、IPv6 link-local 或 IPv6 loopback 來源範圍。不允許公開來源範圍。輸出 DNS、NTP、遠端 syslog、線上更新、DHCP、已建立連線和必要的 IPv6 控制流量仍可使用。WebRTC/ICE UDP 以及其他輸入/輸出流量會被阻擋。'
          },
          paranoid: {
            enable: '啟用偏執',
            confirmTitle: '啟用偏執防火牆模式？',
            confirmDesc:
              '僅保留來自 private IPv4、IPv4 link-local/loopback、IPv6 link-local 或 IPv6 loopback 來源範圍的 HTTPS 存取。SSH、HTTP、mDNS、NTP、GitHub 下載和其他流量將被阻擋，只保留最小 DHCP/IPv6 控制流量。'
          },
          baseline: {
            apply: '切換到基準',
            confirmTitle: '切換到開放的基準模式？',
            confirmDesc:
              '防火牆服務維持啟用，但會取消僅限本機來源範圍的限制。若網路會路由，公開來源範圍可能存取暴露的 NanoKVM 服務。'
          },
          rules: {
            title: '目前規則',
            empty: '沒有規則'
          }
        },
        saveChanges: '儲存變更',
        unsaved: '未儲存的變更'
      },
      systemLog: {
        saveFailed: '儲存記錄設定失敗',
        saved: '記錄設定已儲存',
        invalidHost: '請輸入 syslog 伺服器主機',
        logLoadFailed: '載入記錄失敗',
        save: '儲存',
        test: '傳送測試記錄',
        testSent: '測試記錄已傳送',
        testFailed: '傳送測試記錄失敗',
        remote: {
          title: '遠端記錄',
          forward: '轉送系統記錄',
          description: '將系統訊息轉送到遠端伺服器',
          host: '伺服器',
          hostDesc: 'Syslog 伺服器的主機名稱或 IPv4 位址',
          port: '連接埠',
          protocol: 'Syslog 伺服器的 UDP 連接埠'
        },
        local: {
          title: '系統記錄緩衝區',
          description: '目前記錄保存在 RAM 的 {{path}}，以避免寫入 SD 卡',
          priority: '最低優先級',
          priorityDesc: '訊息被記錄所需的最低緊急程度',
          buffer: '緩衝區大小',
          bufferDesc: '記錄檔達到此大小時進行輪替',
          rotations: '輪替',
          rotationsDesc: '保留的已輪替記錄檔數量',
          compact: '精簡輸出',
          compactDesc: '在每一行省略主機名稱和 facility',
          stripTimestamps: '移除時間戳記',
          stripTimestampsDesc: '移除傳送端加入的時間戳記；syslog 會加入自己的時間戳記'
        },
        kernel: {
          title: '核心記錄',
          enabled: '轉送核心記錄',
          enabledDesc: '將核心訊息記錄到系統記錄',
          consoleLevel: '主控台層級',
          consoleLevelDesc: '核心訊息輸出到主控台所需的最低緊急程度'
        },
        viewer: {
          title: '系統記錄',
          refresh: '重新整理',
          empty: '沒有記錄項目',
          truncated: '僅顯示最新的記錄資料',
          linesUnit: '行'
        },
        level: {
          '1': '1 - 警報',
          '2': '2 - 嚴重',
          '3': '3 - 錯誤',
          '4': '4 - 警告',
          '5': '5 - 通知',
          '6': '6 - 資訊',
          '7': '7 - 偵錯',
          '8': '8 - 全部'
        }
      },
      user: {
        title: '使用者'
      },
      networking: {
        title: '網路'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: '加密通道',
        device: '本裝置',
        description: '透過 WireGuard 通道存取此 KVM',
        unavailable: '此裝置上未安裝 WireGuard',
        blocked: '防火牆偏執模式會封鎖 WireGuard',
        needsKey: '開啟 WireGuard 之前請先設定私鑰',
        saved: 'WireGuard 設定已儲存',
        save: '儲存變更',
        unsaved: '未儲存的變更',
        invalid: '請檢查標示的欄位',
        invalidAddress: '請輸入含遮罩的位址，例如 10.0.0.1/24',
        invalidKey: '請輸入 44 個字元的 WireGuard 金鑰',
        invalidEndpoint: '請輸入主機名稱或 IP 位址',
        invalidPort: '請輸入 1 到 65535 之間的連接埠',
        invalidRanges: '請使用 10.0.0.0/24 這樣的 IPv4 範圍，不能使用 0.0.0.0/0',
        status: {
          connected: '已連線',
          waiting: '正在等待對端',
          stopped: '已停止',
          handshake: '上次交握 {{time}}'
        },
        privateKey: {
          title: '私鑰',
          description: '僅儲存在此裝置上，不會再次顯示',
          set: '已設定',
          notSet: '未設定',
          setBtn: '設定',
          generate: '產生',
          remove: '移除',
          modalTitle: '設定私鑰',
          modalDescription: '金鑰會儲存在此裝置上，不會再次顯示',
          placeholder: '貼上私鑰',
          generateConfirmTitle: '產生新的私鑰？',
          generateConfirmDesc: '目前的金鑰將失效。之後請將新的公開金鑰加入對端。',
          removeConfirmTitle: '移除私鑰？',
          removeConfirmDesc: 'WireGuard 將被關閉，並保持關閉，直到設定新的金鑰。'
        },
        publicKey: {
          title: '公開金鑰',
          description: '請將其加入對端的設定中'
        },
        address: {
          title: '位址',
          description: 'KVM 在通道中的位址及其遮罩'
        },
        peer: {
          title: '對端',
          publicKey: '公開金鑰',
          publicKeyDescription: '您所連線的對端的公開金鑰',
          server: '伺服器',
          serverDescription: '對端的主機名稱或 IP 位址',
          port: '連接埠',
          portDescription: '對端的 UDP 連接埠，通常為 51820',
          allowedIps: '允許的 IP',
          allowedIpsDescription: '對端在通道中的位址或範圍，例如 10.0.0.0/24',
          keepalive: '保持連線',
          keepaliveDescription: '保持連線封包的傳送間隔秒數，位於路由器之後時需要'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: '透過你的 Tailscale 網路存取此 KVM',
        service: '服務',
        performance: '效能',
        memory: {
          title: '記憶體最佳化',
          tip: '讓 Tailscale 保持較低的記憶體用量，對 RAM 較少的裝置有幫助。重啟 Tailscale 後變更才會生效。'
        },
        swap: {
          title: 'Swap 檔',
          tip: '如果啟用記憶體最佳化後問題依然存在，可以嘗試啟用 Swap 檔',
          sizeTip: '這會將檔案大小設定為 128MB，可以在「設定 > 系統 > 效能」中修改'
        },
        restartTitle: '重啟 Tailscale',
        restartDesc: '重啟服務',
        restartBtn: '重啟',
        restart: '確定要重啟 Tailscale 嗎？',
        stopTitle: '停止 Tailscale',
        stopBtn: '停止',
        stop: '確定要停止 Tailscale 嗎？',
        stopDesc: '停止服務，並防止其在開機時自動啟動',
        loading: '載入中...',
        notInstall: '未找到 Tailscale，請先安裝',
        install: '安裝',
        installing: '安裝中',
        failed: '安裝失敗',
        retry: '請重新整理並重試，或嘗試手動安裝。',
        download: '下載',
        package: '安裝包',
        unzip: '並解壓縮它',
        upTailscale: '將 Tailscale 上傳到 NanoKVM 的 /usr/bin/ 資料夾',
        upTailscaled: '將 tailscaled 上傳到 NanoKVM 的 /usr/sbin/ 資料夾',
        refresh: '重新整理頁面',
        notRunning: 'Tailscale 尚未執行。請先啟動以繼續。',
        run: '啟動',
        notLogin: '設備尚未綁定。請登入並將該裝置綁定到您的帳戶。',
        urlPeriod: '此網址有效期限為 10 分鐘',
        login: '登入',
        loginSuccess: '登入成功',
        deviceName: '裝置名稱',
        deviceIP: '裝置 IP',
        account: '帳號',
        logout: '登出',
        logoutDesc: '確認要登出嗎？',
        uninstall: '移除 Tailscale',
        uninstallDesc: '確定要解除安裝 Tailscale 嗎？',
        okBtn: '確認',
        cancelBtn: '取消'
      },
      update: {
        title: '更新',
        currentVersion: '目前版本',
        latestVersion: '最新版本',
        queryFailed: '取得版本號失敗',
        updateFailed: '更新失敗',
        paranoidBlocked: '線上更新被偏執防火牆模式阻擋',
        paranoidBlockedDesc: 'GitHub 檢查與下載需要輸出網路存取。離線上傳和已暫存的安裝仍可使用。',
        available: '發現有可用更新。您確定要更新嗎？',
        updating: '更新中',
        confirm: '確定',
        cancel: '取消',
        badge: {
          checking: '檢查中',
          latest: '已是最新',
          available: '有可用更新',
          failed: '檢查失敗',
          local: '本機'
        },
        application: {
          title: '應用程式'
        },
        system: {
          queryFailed: '取得系統版本失敗',
          appUpdateRequired: '請先將應用程式更新到 {{version}}，再安裝此系統更新',
          requiredAppVersion: '所需應用程式版本',
          downloadFailed: '下載或驗證失敗',
          available: '有可用的基礎系統更新。',
          downloading: '正在下載並驗證系統更新...',
          downloadVerify: '下載並驗證',
          installing: '正在安裝已暫存的系統更新...',
          install: '安裝',
          installFailed: '安裝失敗',
          installConfirmTitle: '安裝系統更新？',
          installConfirmDesc: '這會用已驗證套件中的檔案取代基礎系統檔案。需要重新啟動。',
          rawInstallConfirmDesc:
            '此已驗證套件會將 raw boot/rootfs 映像檔寫入 SD 卡分割區並自動重新啟動。寫入可能需要數分鐘；請保持供電。',
          rawInstallWarning: 'Raw 分割區更新沒有自動 rollback。如果開機失敗，請手動復原 SD 卡。',
          rawWaitTitle: '正在安裝系統更新',
          rawWaitWriting: '正在將新系統寫入 SD 卡',
          rawWaitRestarting: '裝置正在重新啟動。裝置恢復後，此頁面將自動重新載入。',
          rawWaitDesc: '這大約需要三分鐘。請保持電源連接，且不要關閉此頁面。',
          rawWaitSlow: '耗時比預期更久。請再等待幾分鐘，然後再斷電。',
          rebootRequired: '需要重新啟動以啟用此系統狀態。',
          rollingBack: '正在 rollback 系統更新...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback 已準備',
          rollbackFailed: 'Rollback 失敗',
          rollbackConfirmTitle: 'Rollback 系統更新？',
          rollbackConfirmDesc: '這會從最新系統更新備份還原檔案。需要重新啟動。',
          stagedDesc: '系統更新已下載並驗證，現在可以安裝',
          refresh: '重新整理',
          releaseNotes: '版本資訊',
          systemVersion: '系統版本',
          kernel: 'Kernel',
          stagedVersion: '已暫存版本',
          archive: '封存',
          requiredFree: '所需可用空間',
          fileCount: '檔案',
          rawImages: 'Raw 映像檔',
          progress: '進度',
          progressMessage: '進度訊息',
          pendingVersion: '待處理版本',
          bootHealth: '開機狀態',
          healthy: '正常',
          unhealthy: '需要注意',
          rollbackBackup: 'Rollback 備份'
        },
        offline: {
          title: '上傳應用程式套件',
          desc: '從此電腦安裝應用程式套件。之後伺服器將重新啟動。',
          installTitle: '安裝應用程式更新？',
          installDesc: '應用程式將被取代，伺服器將重新啟動。需要重新登入。'
        },
        local: {
          title: '上傳系統套件',
          desc: '從此電腦安裝系統套件。一個檔案包含封存檔及其已簽署的中繼資料。',
          choose: '選擇檔案',
          invalidFile: '請選擇以 .tar 或 .tar.gz 結尾的套件。',
          diskTitle: '是否關閉虛擬磁碟功能？',
          diskWarn:
            '套件會儲存到 /data 目錄，而虛擬磁碟開啟時該目錄為唯讀。關閉虛擬磁碟後，電腦將無法再存取 /data 目錄。是否繼續？',
          uploading: '正在上傳',
          verifying: '正在驗證並準備系統套件',
          keyTitle: '本機更新金鑰',
          keyDesc: '可為您自行建置的套件簽署的 PEM 格式公開金鑰',
          keyNone: '未設定金鑰',
          keySet: '設定金鑰',
          keyRemove: '移除',
          signer: '簽署者',
          section: '本機更新',
          keyRequired: '需要本機金鑰'
        }
      },
      account: {
        title: '帳號',
        webAccount: '網頁帳號',
        password: '密碼',
        passwordDesc: '變更登入網頁介面所用的密碼',
        updateBtn: '修改',
        logoutBtn: '登出',
        logoutDesc: '您確定要登出嗎?',
        okBtn: '確定',
        cancelBtn: '取消',
        session: {
          title: '工作階段'
        },
        logoutOnClose: {
          title: '關閉瀏覽器時登出',
          description: '關閉瀏覽器時結束工作階段，而不是保持登入狀態'
        },
        totp: {
          title: '兩步驟驗證',
          authenticator: '驗證器 App',
          description: '除密碼外，還需要驗證器 App 產生的時間型驗證碼',
          required: '原則要求',
          disable: '停用',
          enableTitle: '設定兩步驟驗證',
          enableDescription: '請確認密碼以繼續。每次變更第二重驗證都需要密碼。',
          continue: '繼續',
          disableTitle: '停用兩步驟驗證？',
          disableDescription: '您的帳號將僅由密碼保護。請以密碼確認以繼續。',
          disableFailed: '無法停用兩步驟驗證',
          passwordPlaceholder: '目前密碼',
          enrollFailed: '無法開始設定',
          invalidCode: '驗證碼不相符，請試試下一個。',
          scan: '請用驗證器 App 掃描此 QR Code。',
          manualEntry: '或手動輸入此金鑰：',
          codePlaceholder: '輸入 6 位數驗證碼以確認',
          confirm: '確認',
          cancel: '取消',
          backupTitle: '請立即儲存您的備用碼',
          backupDescription:
            '每個備用碼只能使用一次，且不會再次顯示。如果您遺失驗證器 App，這是重新登入的唯一方式；即使裝置時鐘未同步，它們也能使用。',
          copy: '複製',
          copied: '已複製備用碼',
          savedThem: '我已儲存',
          remaining: '剩餘 {{remaining}} 個備用碼',
          clockUnsynced: '裝置時鐘尚未同步。設定前請先在 設定 > 系統 > 時間 中同步時間。',
          noBackupCodes: '已沒有備用碼。請選擇「產生」以重新產生一組。',
          regenerate: '新備用碼',
          generate: '產生',
          regenerateTitle: '產生新備用碼？',
          regenerateDescription: '目前的備用碼將失效。請以密碼確認以繼續。',
          regenerateFailed: '無法產生新備用碼',
          download: '下載',
          copyFailed: '無法複製。請選取備用碼後手動複製。',
          requireTitle: '強制兩步驟驗證',
          requireDescription: '禁止停用兩步驟驗證，尚未設定的帳號必須先設定才能使用裝置',
          requireFailed: '無法變更該要求',
          requiredTitle: '需要兩步驟驗證',
          requiredDescription: '此裝置要求第二重驗證，但您的帳號尚未設定。請立即設定以繼續。'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw 助理',
      empty: '描述一個任務即可開始',
      inputPlaceholder: '描述您希望 PicoClaw 執行的操作',
      newConversation: '新對話',
      processing: '正在處理...',
      agent: {
        defaultTitle: '通用助理',
        defaultDescription: '一般聊天、搜尋和工作區域幫助',
        kvmTitle: '遠端控制',
        kvmDescription: '透過 NanoKVM 操作遠端主機',
        switched: '代理角色已切換',
        switchFailed: '代理角色切換失敗'
      },
      send: '發送',
      cancel: '取消',
      status: {
        connecting: '正在連線 Gateway...',
        connected: 'PicoClaw 會話已連線',
        disconnected: 'PicoClaw 會話已關閉',
        stopped: '已發送停止請求',
        runtimeStarted: 'PicoClaw Runtime 已啟動',
        runtimeStartFailed: '啟動 PicoClaw Runtime 失敗',
        runtimeStopped: 'PicoClaw Runtime 已停止',
        runtimeStopFailed: '停止 PicoClaw Runtime 失敗'
      },
      connection: {
        runtime: {
          checking: '檢查中',
          ready: 'Runtime 已就緒',
          stopped: 'Runtime 未啟動',
          unavailable: 'Runtime 不可用',
          configError: '設定錯誤'
        },
        transport: {
          connecting: '連接中',
          connected: '已連接'
        },
        run: {
          idle: '空閒',
          busy: '忙'
        }
      },
      error: {
        lockHeld: 'PicoClaw 正在另一個視窗中使用',
        takenOver: '另一個視窗已接管 PicoClaw',
        authFailed: 'PicoClaw 拒絕了連線',
        upstreamClosed: '與 PicoClaw 的連線已中斷'
      },
      tool: {
        screenshot: '正在擷取螢幕',
        loadImage: '正在查看螢幕截圖',
        actions: '正在控制主機',
        generic: '正在使用 {{name}}',
        type: '正在輸入 {{text}}',
        hotkey: '正在按 {{keys}}',
        click: '正在點擊',
        doubleClick: '正在按兩下',
        move: '正在移動滑鼠',
        drag: '正在拖曳',
        scroll: '正在捲動',
        wait: '正在等待'
      },
      message: {
        toolAction: '行動',
        observation: '觀察',
        screenshot: '截圖'
      },
      overlay: {
        locked: 'PicoClaw 正在控制設備。手動輸入已暫停。'
      },
      install: {
        install: '安裝 PicoClaw',
        installing: '正在安裝 PicoClaw',
        success: 'PicoClaw 安裝成功',
        failed: 'PicoClaw 安裝失敗',
        uninstalled: 'PicoClaw 解除安裝成功',
        uninstallFailed: '解除安裝失敗',
        requiredTitle: 'PicoClaw 未安裝',
        requiredDescription: '在啟動 PicoClaw Runtime 之前，請先安裝 PicoClaw。',
        progressDescription: '正在下載並安裝 PicoClaw。',
        stages: {
          preparing: '準備中',
          downloading: '下載中',
          extracting: '解壓縮中',
          verifying: '驗證中',
          installing: '安裝中',
          installed: '已安裝',
          install_timeout: '超時',
          install_failed: '失敗'
        }
      },
      model: {
        requiredTitle: '需要設定模型',
        requiredDescription: '在使用 PicoClaw 聊天之前，請先設定 PicoClaw 模型。',
        docsTitle: '設定指南',
        docsDesc: '支援的模型與通訊協定',
        menuLabel: '設定模型',
        modelIdentifier: '模型標識符',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API 基礎 URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API Key',
        apiKeyPlaceholder: '請輸入模型 API Key',
        apiKeyKeepPlaceholder: '留空則保留目前的金鑰',
        save: '儲存',
        saving: '儲存中',
        saved: '模型設定已儲存',
        saveFailed: '儲存模型設定失敗',
        invalid: '模型標識、API 基礎 URL 和 API Key 不能為空'
      },
      uninstall: {
        confirmTitle: '解除安裝 PicoClaw',
        confirmContent: '您確定要解除安裝 PicoClaw 嗎？這將刪除可執行檔和所有設定檔。',
        confirmOk: '解除安裝'
      },
      history: {
        title: '歷史會話',
        loading: '正在載入會話...',
        emptyTitle: '還沒有歷史記錄',
        emptyDescription: '之前的 PicoClaw 會話將會出現在此。',
        loadFailed: '無法載入會話歷史記錄',
        deleteFailed: '刪除會話失敗',
        deleteConfirmTitle: '刪除會話',
        deleteConfirmContent: '您確定要刪除「{{title}}」嗎？',
        deleteConfirmOk: '刪除',
        messageCount_other: '{{count}} 則訊息'
      },
      config: {
        startRuntime: '啟動 PicoClaw',
        stopRuntime: '停止 PicoClaw',
        stopConfirm: '確定要停止 PicoClaw 嗎？'
      },
      start: {
        title: '啟動 PicoClaw',
        description: '啟動 Runtime 後即可開始使用 PicoClaw 助理。'
      }
    },
    error: {
      title: '我們遇到了一些問題',
      refresh: '重新整理'
    },
    fullscreen: {
      toggle: '進入全螢幕模式'
    },
    menu: {
      collapse: '收起選單'
    }
  }
};

export default zh_tw;
