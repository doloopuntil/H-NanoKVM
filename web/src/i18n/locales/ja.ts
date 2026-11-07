const ja = {
  translation: {
    common: {
      confirm: '確認',
      cancel: 'キャンセル',
      save: '保存',
      discard: '破棄',
      delete: '削除',
      actionFailed: '操作に失敗しました',
      loading: 'デバイスから設定を読み込んでいます...',
      loadFailed: 'デバイスから設定を読み込めませんでした',
      retry: '再試行'
    },
    head: {
      desktop: 'リモートデスクトップ',
      login: 'ログイン',
      firstSetup: '初回設定',
      changePassword: 'パスワード変更',
      terminal: 'ターミナル',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'ログイン',
      placeholderUsername: 'ユーザー名を入力してください',
      placeholderPassword: 'パスワードを入力してください',
      placeholderPassword2: 'パスワードをもう一度入力してください',
      noEmptyUsername: 'ユーザー名は空にできません',
      noEmptyPassword: 'パスワードは空にできません',
      invalidUser: 'ユーザー名またはパスワードが正しくありません',
      locked: 'ログインが多すぎます。後でもう一度お試しください',
      globalLocked: 'システムは保護されています。後でもう一度試してください',
      error: '不明なエラー',
      changePassword: 'パスワード変更',
      changePasswordDesc: 'デバイスのセキュリティのために、パスワードを変更してください',
      differentPassword: 'パスワードが一致しません',
      illegalUsername: 'ユーザー名に不正な文字が含まれています',
      illegalPassword: 'パスワードは 8 文字以上で、引用符やスラッシュを含めることはできません',
      forgetPassword: 'パスワードを忘れた',
      ok: 'OK',
      cancel: 'キャンセル',
      loginButtonText: 'ログイン',
      setupTitle: '管理者アカウントを作成',
      setupDescription:
        'このデバイスにはまだ Web アカウントがありません。続行するには最初の管理者アカウントを作成してください。',
      setupRecovery: 'このパスワードを失った場合、復旧には SD カードの再書き込みが必要です',
      setupButtonText: 'アカウントを作成',
      tips: {
        hardenedRecovery:
          'この Hardened イメージは BOOT ボタンによるパスワードリセットに対応していません。パスワードを失った場合は SD カードを書き直して新しいアカウントを作成してください。',
        change1: 'この操作により、以下のパスワードも更新されることに注意してください：',
        change2: 'ウェブログインパスワード',
        change3: 'SSH ログイン用のシステム root パスワード'
      },
      placeholderCurrentPassword: '現在のパスワード',
      placeholderNewPassword: '新しいパスワード',
      wrongCurrentPassword: '現在のパスワードが正しくありません',
      totp: {
        title: '二要素認証',
        prompt: '認証アプリに表示された 6 桁のコードを入力してください',
        backupPrompt: 'バックアップコードのいずれかを入力してください',
        noEmptyCode: 'コードを入力してください',
        placeholderCode: '6 桁のコード',
        placeholderBackup: 'バックアップコード',
        verifyButtonText: '確認',
        useBackupCode: 'バックアップコードを使う',
        useAuthenticator: '認証アプリのコードを使う',
        cancel: '戻る',
        invalidCode: 'このコードは無効です。もう一度お試しください。'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'NanoKVM の Wi-Fi を設定する',
      success: 'NanoKVM のネットワークステータスを確認するにはデバイスにアクセスしてください',
      failed: '操作に失敗したため、もう一度お試しください',
      invalidMode:
        '現在のモードではネットワーク設定はサポートされていません。デバイスで Wi-Fi 設定モードを有効にしてください。',
      confirmBtn: 'OK',
      finishBtn: '完了',
      ap: {
        authTitle: '認証が必要です',
        authDescription: '続行するには、AP パスワードを入力してください',
        authFailed: '無効な AP パスワード',
        passPlaceholder: 'AP パスワード',
        verifyBtn: '確認する'
      }
    },
    screen: {
      scale: '倍率',
      title: '画面',
      video: 'ビデオモード',
      videoDirectTips:
        'このモードを使用するには「設定 > ネットワーク > サービス」で HTTPS を有効にしてください',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC は制限付き/パラノイドファイアウォールモードでは無効です',
      transferRunningTitle: 'イメージ転送中',
      transferRunningDesc:
        'ビデオモードを変更するとページが再読み込みされ、実行中のイメージのアップロードまたはダウンロードがキャンセルされます。',
      transferRunningOk: 'モードを変更',
      resolution: '解像度',
      auto: '自動',
      autoTips:
        '特定の解像度で画面のちらつきやマウスカーソルのずれが発生する場合があるため、リモートホストの解像度を調整するか、自動モードを無効にしてください',
      fps: 'フレームレート',
      customizeFps: 'カスタマイズ',
      quality: '画質',
      qualityLossless: 'ロスレス',
      qualityHigh: '高',
      qualityMedium: '中',
      qualityLow: '低',
      frameDetect: 'フレーム差分検出',
      frameDetectTip:
        'フレームを比較し、リモートホストの画面が変わらない間はビデオの送信を停止します',
      resetHdmi: 'HDMI をリセット',
      webrtcConnectionFailed: {
        title: 'WebRTC 接続に失敗しました',
        description: 'ネットワーク接続を確認するか、ビデオモードを切り替えてください'
      },
      captureStatus: {
        hdmiError: 'HDMI 画面エラー',
        unsupportedResolution: '現在の解像度はサポートされていません',
        retrieving: '画面を取得中...',
        changingResolution: '解像度を切り替え中...',
        updateFailed: '現在、画面を更新できません',
        videoError: '映像表示エラー',
        noHdmi: 'HDMI 信号が検出されません',
        unavailable: '現在、画面を表示できません'
      }
    },
    keyboard: {
      title: 'キーボード',
      paste: '貼り付け',
      tips: '標準的なキーボードの文字と記号のみをサポートしています',
      placeholder: '貼り付けるテキスト',
      local: 'モバイルキーボード',
      virtual: 'スクリーンキーボード',
      readClipboard: 'クリップボードから読み取る',
      clipboardPermissionDenied:
        'クリップボードのアクセス許可が拒否されたため、ブラウザでアクセスを許可してください',
      clipboardReadError: 'クリップボードの読み取りに失敗しました',
      dropdownEnglish: '英語',
      dropdownGerman: 'ドイツ語',
      dropdownFrench: 'フランス語',
      dropdownRussian: 'ロシア語',
      dropdownKorean: '韓国語',
      dropdownJapanese: '日本語',
      localInput: 'モバイルキーボード入力',
      shortcut: {
        title: 'ショートカット',
        custom: 'カスタム',
        capture: 'ショートカットをキャプチャするにはここをクリックしてください',
        clear: 'クリア',
        save: '保存',
        captureTips:
          'Windows キーなどのシステムレベルのキーを取得するには、全画面表示の許可が必要です',
        enterFullScreen: '全画面モードに切り替えます'
      },
      leaderKey: {
        title: 'リーダーキー',
        desc: 'ブラウザの制限を回避して、システムによってブロックされているショートカットキーをリモートホストに送信します',
        howToUse: '使用方法',
        simultaneous: {
          title: '同時モード',
          desc1: 'リーダーキーを押したまま、ショートカットを押します。',
          desc2:
            '操作は直感的ですが、システムの使用状況により一部のショートカットキーが機能しない場合があります。'
        },
        sequential: {
          title: 'シーケンシャルモード',
          desc1: 'リーダーキーを押す → ショートカットを順番に押す → リーダーキーをもう一度押す。',
          desc2: 'いくつかの手順が必要ですが、システムキーの競合を完全に回避します。'
        },
        enable: 'リーダーキーを有効化',
        tip: 'リーダーキーに設定すると、このキーはショートカットのトリガー専用になり、通常の動作は失われます。',
        placeholder: 'リーダーキーを押してください',
        shiftRight: '右 Shift',
        ctrlRight: '右 Ctrl',
        metaRight: '右 Win',
        recorder: {
          rec: 'REC',
          activate: 'キーを有効化',
          input: 'ショートカットキーを押してください'
        }
      }
    },
    mouse: {
      title: 'マウス',
      cursor: 'ポインター形状',
      default: 'デフォルトポインター',
      cell: 'セルポインター',
      text: 'テキストカーソル',
      grab: 'つかむポインター',
      hide: 'ポインターを非表示',
      mode: 'マウスモード',
      absolute: '絶対モード',
      relative: '相対モード',
      direction: 'ホイール方向',
      scrollUp: '上',
      scrollDown: '下',
      speed: 'ホイール速度',
      sensitivity: 'ポインター速度',
      sensitivityDesc:
        'デスクトップの相対モード用：値を下げるとホスト側のマウス加速によるずれを抑えます',
      fast: '速い',
      slow: '遅い',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'KVM 領域のどこでも動かせ、リモートカーソルはタッチの間も位置を保持して絶対 HID と同期します'
      },
      requestPointer:
        '相対モードを使用中のため、マウスポインターを取得するにはデスクトップをクリックしてください',
      resetHid: 'HID をリセット',
      hidOnly: {
        title: 'HID-Only モード',
        desc: 'マウスやキーボードが反応しなくなり、HID のリセットでも改善しない場合は、NanoKVM とホストの互換性の問題かもしれません。',
        tip1: 'HID-Only モードを有効にすると、仮想ディスクと仮想ネットワークがアンマウントされます',
        tip2: 'HID-Only モードでは、イメージのマウントは無効です',
        tip3: 'モードを切り替えると、NanoKVM は自動的に再起動します',
        enable: 'HID-Only モードを有効化',
        disable: 'HID-Only モードを無効化'
      }
    },
    image: {
      title: 'イメージ',
      loading: '読み込み中...',
      empty: 'イメージファイルがありません',
      mountMode: 'マウント形式',
      massStorage: 'マスストレージ',
      cdRom: 'CD-ROM',
      mountFailed: 'マウントに失敗しました',
      mountDesc:
        '一部のシステムでは、イメージをマウントする前にリモートホストで仮想ディスクをアンマウントする必要があります',
      diskOnWarn:
        'イメージをマウントすると仮想ディスクがオフになり、コンピュータから /data にアクセスできなくなります。続行しますか？',
      diskOffWarn:
        '仮想ディスクがオフになっているため、イメージのマウントには有効化が必要です。コンピュータの USB デバイスが再接続されます。続行しますか？',
      unmountFailed: 'アンマウントに失敗しました',
      unmountDesc:
        '一部のシステムでは、イメージをアンマウントする前にリモートホストから手動で取り出す必要があります',
      forceEject: '強制的に取り出す',
      forceEjectConfirm:
        'ホストが光学ドライブをロックしています。強制的に取り出すと、仮想 USB デバイスが一時的に切断されるため、キーボードとマウスも一時的に切断される場合があります。続行しますか？',
      usbReconnect: 'USB 再接続',
      usbReconnectConfirm:
        'リモートホストがメディア変更を認識しなかった場合のみ USB ガジェットを再接続してください。キーボードとマウスが一時的に切断されることがあります。',
      usbReconnectSuccess: 'USB を再接続しました',
      usbReconnectFailed: 'USB 再接続に失敗しました',
      addImage: 'イメージを追加',
      fromUrl: 'URLから',
      fromFile: 'ファイルから',
      turnOff: 'オフにする',
      eject: '取り出す',
      download: 'ダウンロード',
      upload: 'アップロード',
      mountTitle: 'イメージをマウント',
      deleteTitle: 'イメージを削除',
      deleteConfirm: 'このイメージを削除してもよろしいですか？',
      tips: {
        title: 'アップロード方法',
        usb1: 'NanoKVM を USB 経由でコンピュータに接続します。',
        usb2: '設定 > デバイス > 仮想ディスク で仮想ディスクがマウントされていることを確認してください。',
        usb3: 'コンピュータ上で仮想ディスクを開き、イメージファイルを仮想ディスクのルートディレクトリにコピーします。',
        scp1: 'NanoKVM とコンピュータが同じローカルエリアネットワークに接続されていることを確認します。',
        scp2: 'コンピュータでターミナルを開き、SCP コマンドを使用してイメージファイルを NanoKVM の /data ディレクトリにアップロードします。',
        scp3: '例：scp your-image-path root@your-nanokvm-ip:/data',
        tfCard: 'SD カード',
        tf1: 'この方法は Linux システムでサポートされています',
        tf2: 'NanoKVM から SD カードを取り出します。FULL バージョンでは、先にケースを分解してください。',
        tf3: 'SD カードをカードリーダーに挿入してコンピュータに接続します。',
        tf4: 'コンピューターから SD カードの /data ディレクトリにイメージファイルをコピーします。',
        tf5: 'SD カードを NanoKVM に挿入します。'
      }
    },
    script: {
      title: 'スクリプト',
      upload: 'アップロード',
      run: '実行',
      runBackground: 'バックグラウンドで実行',
      runFailed: '実行に失敗しました',
      delDesc: 'このファイルを削除してもよろしいですか？',
      delete: '削除',
      close: '閉じる',
      unlockDesc:
        'スクリプトは NanoKVM 上で root として実行されます。スクリプトをアップロードまたは実行するには、Web アカウントのパスワードを入力してください。',
      terminalRequired:
        'スクリプトには Web ターミナルへのアクセスが必要です。先に設定でターミナルを有効にしてください。'
    },
    terminal: {
      title: 'ターミナル',
      nanokvm: 'NanoKVM ターミナル',
      serial: 'シリアルポートターミナル',
      unlockTitle: 'ターミナルを解除',
      unlockDesc: 'ターミナルセッションを開始するには Web アカウントのパスワードを入力してください',
      unlock: '解除',
      unlockFailed: 'ターミナルの解除に失敗しました',
      invalidCredentials: 'ユーザー名またはパスワードが無効です',
      locked: '試行回数が多すぎるため、後でもう一度お試しください',
      sessionClosed:
        'ターミナルセッションが閉じられました。再接続するにはもう一度解除してください。',
      sessionError: 'ターミナル接続に失敗しました。再試行するにはもう一度解除してください。',
      serialPort: 'シリアルポート',
      serialPortPlaceholder: '例: /dev/ttyS1',
      baudrate: 'ボーレート',
      parity: 'パリティ',
      parityNone: 'なし',
      parityEven: '偶数',
      parityOdd: '奇数',
      flowControl: 'フロー制御',
      flowControlNone: 'なし',
      flowControlSoft: 'ソフトウェア',
      flowControlHard: 'ハードウェア',
      dataBits: 'データビット',
      stopBits: 'ストップビット',
      open: 'ターミナルを開く'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'コマンドを送信中...',
      sent: 'コマンドを送信しました',
      input: 'MAC アドレス',
      ok: 'OK'
    },
    download: {
      input: 'リモートイメージの URL',
      ok: 'OK',
      disabled:
        'ストレージが書き込み不可のため、現在イメージをダウンロードまたはアップロードできません。イメージがマウントされている場合はアンマウントし、仮想ディスクをオフにしてストレージを再び書き込み可能にしてください。',
      diskShared: 'イメージのダウンロードを使用するには、仮想ディスクをオフにしてください',
      mountedImage:
        'このイメージはマウントされているため、同じ名前のファイルをアップロードする前にマウントを解除してください',
      diskOff: '仮想ディスクをオフにする',
      uploadbox: 'ここにファイルをドロップするか、クリックして選択してください',
      inputfile: 'イメージファイル',
      NoISO: 'イメージなし',
      complete: 'ダウンロードが完了しました',
      uploadComplete: 'アップロード完了',
      downloading: 'ダウンロード中',
      uploading: 'アップロード中',
      failed: '転送に失敗しました',
      uploadFailed: 'アップロードに失敗しました',
      stalled: '転送が停止したため、接続を確認して再試行してください',
      canceled: 'アップロードをキャンセルしました',
      downloadCanceled: 'ダウンロードをキャンセルしました',
      cancel: 'キャンセル',
      remoteDisabled:
        'リモート ISO ダウンロードは「設定 > ユーザー > 環境設定」で無効になっています',
      remoteFailed: 'リモート ISO ダウンロードに失敗しました',
      sha256: '任意の SHA-256 チェックサム',
      sha256Placeholder: '64 文字の SHA-256 チェックサムを入力してください',
      invalidSHA256: 'SHA-256 は 64 文字の 16 進数文字列である必要があります',
      checksumFailed: 'ダウンロードに失敗しました：SHA-256 検証に失敗しました'
    },
    power: {
      title: '電源',
      showConfirm: '確認メッセージ',
      showConfirmTip: '電源操作の確認メッセージを表示する',
      reset: 'リセット',
      powerShort: '電源ボタン：短押し',
      powerLong: '電源ボタン：長押し',
      resetConfirm: '再起動を実行しますか？',
      powerConfirm: '電源操作を実行しますか？',
      okBtn: 'はい',
      cancelBtn: 'いいえ'
    },
    settings: {
      title: '設定',
      about: {
        title: 'バージョン',
        information: '情報',
        ip: 'IP アドレス',
        mdns: 'ローカルアドレス',
        application: 'アプリケーションバージョン',
        uptime: '稼働時間',
        community: 'コミュニティ',
        credit:
          'Sipeed の <a1>NanoKVM</a1> と woffko の <a2>Hardened NanoKVM</a2> をベースにしています',
        hostname: 'デバイス名',
        changeIn: '{{path}} で変更できます',
        updateIn: '{{path}} で更新できます',
        toggleIn: '{{path}} でオンまたはオフにできます'
      },
      appearance: {
        title: '環境設定',
        display: '表示',
        language: '言語',
        languageDesc: 'インターフェース言語の選択',
        webTitle: 'ウェブページタイトル',
        webTitleDesc: 'ウェブページタイトルのカスタマイズ',
        layoutMode: 'インターフェースのレイアウト',
        layoutModeDesc: 'このブラウザーでスマートフォン/タッチ用レイアウトを使用します',
        layoutAuto: '自動',
        layoutMobile: 'スマートフォン',
        menuBar: {
          title: 'メニューバー',
          mode: '表示モード',
          modeDesc: 'メニューバーの画面表示方法',
          modeOff: 'オフ',
          modeAuto: '自動非表示',
          modeAlways: '常に表示',
          keyboardLedStatus: 'キーボードロックの表示',
          keyboardLedStatusDesc:
            'リモートコンピューターの Num Lock、Caps Lock、Scroll Lock の状態を表示',
          icons: 'メニューアイコン',
          iconsDesc: 'メニューバーでのサブメニューアイコンの表示',
          terminalWarningTitle: 'Web ターミナルを有効にしますか?',
          terminalWarningDesc:
            'ターミナルはブラウザで root shell を開きます。信頼できるネットワークでのみ有効にし、終了後は無効にしてください。',
          terminalWarningConfirm: '有効にする',
          remoteDownload: 'リモート ISO をダウンロード',
          remoteDownloadWarningTitle: 'リモート ISO ダウンロードを有効にしますか?',
          remoteDownloadWarningDesc:
            'NanoKVM は URL から ISO を取得して /data に書き込みます。信頼できる URL のみに有効化し、終了後は無効にしてください。',
          remoteDownloadWarningConfirm: '有効にする'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'リモートキーボードのロック状態',
        indicatorLabel: '{{label}}：{{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'オン',
        off: 'オフ',
        unknown: '不明'
      },
      device: {
        title: 'デバイス',
        minutes: '分',
        sections: {
          general: '一般',
          connectivity: '接続',
          hostConnection: 'ホスト接続',
          inputOutput: '入力と出力'
        },
        oled: {
          title: 'OLED のタイムアウト',
          description: 'OLED 画面の自動スリープ時間',
          keepOn: 'OLED を常にオンにする',
          keepOnDescription: 'OLED 画面を消灯しません'
        },
        ssh: {
          description: 'SSH リモートアクセスを有効にする',
          tip: 'このオプションを有効にする前に、アカウント > パスワード で強力なパスワードを設定してください'
        },
        swap: {
          title: 'スワップ',
          description: 'メモリが不足したときにスワップファイルを使用します',
          size: 'スワップのサイズ',
          sizeDescription: 'スワップファイルのサイズを設定する',
          tip: 'この機能を有効にすると、SD カードの寿命が短くなる可能性があります'
        },
        mouseJiggler: {
          title: 'マウスジグラー',
          description: 'リモートホストの休止を防ぐ',
          disable: '無効',
          absolute: '絶対モード',
          relative: '相対モード'
        },
        sessionLock: {
          title: '非アクティブ時にセッションをロック',
          description: 'この時間後に再ログインを要求します'
        },
        mdns: {
          description: 'mDNS 検出サービスを有効にする',
          tip: '.local 名でこのデバイスにアクセスできるようにします。IP アドレスで接続する場合や、DNS がすでにホスト名を解決できる場合は不要です。'
        },
        hdmi: {
          description: 'HDMI/モニター 出力機能を有効にする',
          idleTimeoutTitle: 'キャプチャのアイドルタイムアウト',
          idleTimeoutDescription:
            'アクティブな閲覧者がいない状態が次の時間続いたら HDMI キャプチャを停止'
        },
        hidOnly: 'HID-Only モード',
        hidOnlyDesc: 'マウスやキーボードが反応しなくなった場合に、ホストとの互換性を高めます',
        hidOnlyTip:
          'HID-Only モードでは仮想デバイスのエミュレーションを停止し、基本的な HID 制御のみを維持します',
        disk: '仮想ディスク',
        diskDesc: 'リモートホストに SD カードをマウントします',
        diskLocked: 'イメージのマウント中はオフで、オンにするとマウントが解除されます',
        diskEnable: '仮想ディスクを有効化',
        networkChange: '仮想ネットワークを変更',
        diskCancelMount:
          '仮想ディスクを有効にすると、マウント中のイメージは解除されます。続行しますか？',
        networkCancelMount:
          '仮想ネットワークを変更すると、USB 接続が再起動します。マウント中のイメージは解除され、仮想ディスクが有効になります。続行しますか？',
        diskTransferRunning:
          'イメージ転送が実行中です。完了するまで待ってから仮想ディスクを有効にしてください。',
        network: '仮想ネットワークカード',
        networkDesc: 'リモートホストに仮想ネットワークカードをマウントする',
        usbWakeup: 'USB ウェイクアップ',
        usbWakeupDesc: 'キーボードまたはマウスのイベントでリモートホストを復帰できるようにします',
        usbWakeupTip: 'ホストが USB wakeup メッセージを繰り返し記録する場合はオフにしてください',
        hostname: {
          description: 'ネットワーク上のこのデバイスの名前',
          reachable: 'ローカルネットワークでは {{address}} で接続できます'
        },
        rebootRequired: '再起動が必要',
        rebootPending: '再起動が必要: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'システム更新'
        },
        reboot: '再起動',
        rebootDesc: 'NanoKVM を再起動してもよろしいですか?',
        poweroff: '電源オフ',
        poweroffDesc: 'NanoKVM の電源を切りますか？再び電源を入れるまで接続できません。'
      },
      network: {
        title: 'IP & DNS',
        connection: '接続',
        configuration: '設定',
        wifi: {
          title: 'Wi-Fi',
          description: 'Wi-Fi 設定',
          apMode: 'AP モードが有効になりました。QR コードをスキャンして Wi-Fi に接続してください',
          connect: 'Wi-Fi に接続',
          connectDesc1: 'SSID とパスワードを入力してください',
          disconnect: 'このネットワーク接続を切断しますか？',
          disconnectBtn: '切断',
          connected: '接続済み',
          ssid: 'SSID',
          password: 'パスワード',
          joinBtn: '接続',
          cancelBtn: 'キャンセル'
        },
        tls: {
          description: 'HTTPS プロトコルを有効にする',
          tip: '注意：HTTPS を使用すると、特に MJPEG ビデオモードで遅延が増加する可能性があります',
          restartTitle: 'サーバーを再起動します',
          restartDesc:
            'プロトコルの変更によりサーバーが再起動します。{{seconds}} 秒後にブラウザーは新しいアドレスへ切り替わります:',
          restartOk: '適用して再起動',
          confirmTitle: '新しいプロトコルを維持しますか?',
          confirmDesc:
            'サーバーは現在 {{protocol}} で動作しています。維持しない場合、{{seconds}} 秒後に以前のプロトコルへ戻ります。',
          confirmKeep: '維持',
          confirmRevert: '元に戻す',
          reverting:
            '以前のプロトコルへ戻しています。{{seconds}} 秒後にブラウザーはそのアドレスへ切り替わります。',
          certTitle: '新しい証明書を保持しますか？',
          certDesc:
            'サーバーは新しい証明書を使用しています。保持しない場合、{{seconds}}秒後に前の証明書に戻ります。',
          certReverted: '前の証明書に戻りました'
        },
        trustedProxies: {
          section: 'リバースプロキシ',
          title: '信頼するプロキシ',
          description: 'クライアントのアドレスとプロトコルの報告を信頼するリバースプロキシ',
          tip: 'リストにあるアドレスは、ログイン制限とログに記録されるクライアントのアドレスを決めるため、自分で管理しているプロキシだけを登録してください',
          none: 'なし',
          edit: '編集',
          editRow: 'リストを編集',
          editTitle: '信頼するプロキシを編集',
          editDescription: 'リストの変更にはパスワードが必要です',
          dialogDescription:
            '各リバースプロキシのアドレスを、このデバイスから見えるとおりに入力するか、10.0.0.0/24 のような範囲で入力してください。リストにあるプロキシは、使用するクライアントのアドレスとプロトコルをデバイスに伝えます。転送された内容はそのまま信じられるため、自分で管理しているプロキシだけを登録してください。'
        },
        certificate: {
          title: '証明書',
          desc: 'HTTPS証明書の入手元',
          requesting: '証明書を要求しています',
          selfSigned: '自己署名',
          domain: 'ドメイン',
          domainDesc: 'このデバイスを指し、ポート443にインターネットから到達できる必要があります',
          domainTailscale: 'このデバイス用にTailscaleが設定',
          domainInvalid: 'ドメイン名は kvm.example.org のように完全な形で入力してください',
          email: 'メール',
          emailDesc: "任意。Let's Encryptからの通知用",
          emailInvalid: 'メールアドレスは name@example.org の形式で入力してください',
          validUntil: '有効期限',
          valid: '有効',
          expiresSoon: 'まもなく期限切れ',
          expired: '期限切れ',
          lastRenewal: '前回の更新',
          renewed: '更新済み',
          failed: '失敗',
          renewNow: '今すぐ更新',
          renewNowDesc: '待たずに新しい証明書を要求',
          renewBtn: '更新',
          applyTitle: '証明書を変更',
          applyOk: '適用',
          applyAcme:
            "デバイスはLet's Encryptに証明書を要求します。Let's Encryptは確認のためインターネットからポート443に接続し、最大1分かかることがあります。要求が失敗した場合は、現在の証明書がそのまま使用されます。",
          applyTailscale:
            'デバイスはTailscaleから証明書を取得します。最大1分かかることがあります。要求が失敗した場合は、現在の証明書がそのまま使用されます。',
          applySelfSigned:
            'デバイスは自身の自己署名証明書に戻ります。ブラウザーは警告を表示します。',
          openTitle: '新しいアドレスを開く',
          openDesc:
            '証明書の準備ができました。下のアドレスを開いてサインインし、保持してください。3分以内に確認しない場合は、前の証明書に戻ります。',
          openOk: '開く',
          blockedClock: 'デバイスの時計が同期されるまで証明書は要求できません',
          blockedParanoid: 'ファイアウォールのパラノイドモードでは証明書の要求がブロックされます',
          tailscaleUnavailable:
            'Tailscale が実行されていないか、tailnet で HTTPS 証明書が有効になっていません'
        },
        dns: {
          title: 'DNS',
          description: 'NanoKVM の DNS サーバーを設定',
          ipv4Title: 'IPv4',
          ipv4Description: '有線インターフェースの IPv4 アドレスを設定します',
          servers: 'サーバー',
          dhcp: 'DHCP',
          manual: '手動',
          apply: '適用',
          invalid: '有効な IPv4 または IPv6 アドレスを入力してください',
          invalidNetwork: '有効な IPv4 アドレス、サブネットマスク、ルーターを入力してください',
          saved: 'DNS 設定を保存しました',
          redirecting: 'ネットワーク設定を保存しました。新しいアドレスを開いています...',
          saveFailed: 'DNS 設定の保存に失敗しました',
          unsaved: '未保存の変更',
          maxServers: 'DNS サーバーは最大 {{count}} 個までです',
          dhcpServersDescription: 'DNS サーバーは DHCP から自動取得されます',
          manualServersDescription: 'IPv4 と IPv6 のサーバーに対応しています',
          interface: 'インターフェイス',
          ipAddress: 'IP アドレス',
          subnetMask: 'サブネットマスク',
          router: 'ルーター'
        },
        ipv6: {
          title: 'IPv6',
          description: '有線インターフェースの IPv6 アドレス設定',
          disabled: '無効',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: '手動',
          interface: 'インターフェース',
          state: '状態',
          router: 'ルーター',
          addresses: 'アドレス',
          dhcpv6Client: 'DHCPv6 クライアント',
          notInstalled: '未インストール',
          ipAddress: 'IPv6 アドレス',
          prefix: 'プレフィックス',
          invalidManual: '有効な IPv6 アドレス、プレフィックス、ルーターを入力してください',
          clientMissing:
            'DHCPv6 クライアントがインストールされていません。先に対応する raw システムアップデートをインストールしてください。',
          saved: 'IPv6 設定を保存しました',
          saveFailed: 'IPv6 設定の保存に失敗しました',
          unsaved: '未保存の変更'
        }
      },
      system: {
        title: 'システム',
        performance: {
          processor: 'プロセッサ',
          overdrive: {
            title: 'クロックのオーバードライブ',
            description: 'メーカー指定の高いプロセッサとビデオのクロックで起動します',
            tip: 'オーバードライブで起動しない場合は、SD カードの書き直しが必要です',
            unavailable: 'このシステムイメージには含まれていません',
            keepTitle: '更新後もオーバードライブを維持',
            keepDescription:
              'これをオンにしない限り、システム更新後はデバイスが標準クロックに戻ります',
            confirmTitle: 'クロックのオーバードライブを有効にしますか？',
            confirmText:
              'オーバードライブで起動しない場合は、復旧のために SD カードを書き直す必要があります。変更は次回の再起動後に反映されます。',
            confirmOk: '有効にする'
          },
          watchdog: {
            title: 'ハードウェアウォッチドッグ',
            description: '応答しなくなったときにデバイスを自動的に再起動します',
            unavailable: 'このシステムイメージには含まれていません',
            notRunning: '現在は動作していません',
            lastRestart: '前回の再起動',
            lastRestartCaption: 'システムが最後に再起動した理由',
            reasonPowerOn: '電源投入',
            reasonRestart: '再起動の要求',
            reasonWatchdog: 'ウォッチドッグによるリセット',
            reasonOverheat: '過熱保護',
            reasonUnknown: '不明'
          },
          recovery: '復旧',
          memory: 'メモリ'
        },
        monitor: {
          processorClock: 'CPU サブシステム',
          videoClock: 'ビデオサブシステム',
          videoClockCaption: 'ビデオクロック周波数',
          cpuClockCaption: 'CPU クロック周波数',
          overdrive: 'オーバードライブ',
          temperature: '温度',
          lastMinutes: '直近 5 分',
          ram: 'RAM',
          off: 'オフ',
          ramHistory: 'RAM 使用率',
          cpuLoad: 'CPU 負荷',
          cpuLoadCaption: 'ユーザー {{user}} パーセント、システム {{system}} パーセント',
          cpuUtilization: 'CPU 使用率',
          swapUtilization: 'スワップ使用率',
          swapSizeLastMinutes: '{{size}}、過去 5 分間',
          percent: '{{percent}} パーセント',
          percentUsed: '{{percent}} パーセント使用',
          sizeOf: '{{used}} / {{total}}',
          systemPartition: 'システムパーティション',
          dataPartition: 'データパーティション',
          unavailable: '利用できません',
          noReadings: 'デバイスから値が返されません',
          refresh: 'このページを開いている間、1 秒ごとに更新されます'
        },
        sections: {
          time: '時刻',
          firewall: 'ファイアウォール',
          systemLog: 'ログ記録',
          performance: 'パフォーマンス',
          monitor: 'モニター',
          services: 'サービス',
          webInterface: '安全なWebアクセス'
        },
        time: {
          saveFailed: '時刻設定の保存に失敗しました',
          saved: '時刻設定を保存しました',
          syncFailed: '時刻の同期に失敗しました',
          synced: '時刻を同期しました',
          invalidServers: '少なくとも 1 つの NTP サーバーを入力してください',
          maxServers: '最大 {{count}} 個の NTP サーバーを指定できます',
          refresh: '更新',
          syncNow: '同期',
          syncNowDesc: 'NTP サーバーから今すぐ時刻を設定します',
          save: '保存',
          ntp: {
            title: 'NTP',
            description: '設定済みの NTP サーバーからデバイス時刻を同期します'
          },
          networkTime: 'ネットワーク時刻',
          clock: {
            title: '時計',
            description: 'ログと UI で使用するローカルタイムゾーンを設定します',
            current: '現在時刻',
            timezone: 'タイムゾーン'
          },
          servers: {
            title: 'NTP サーバー',
            description:
              '既定の公開サーバー、ローカルルーター、またはカスタム NTP サーバーを使用します',
            useRouter: 'ルーターを使用',
            useDefaults: '既定値を使用',
            presets: 'サーバーのプリセット',
            presetsDesc: 'サーバー一覧をプリセットに置き換えます'
          }
        },
        firewall: {
          saveFailed: 'ファイアウォール設定の適用に失敗しました',
          saved: 'ファイアウォール設定を適用しました',
          cancel: 'キャンセル',
          refresh: '更新',
          backends: 'バックエンド',
          enableHttpsFirst:
            '制限付きまたはパラノイドファイアウォールモードを有効にする前に HTTPS を有効にしてください',
          httpsRequired:
            'HTTPS が「設定 > ネットワーク > サービス」で有効になるまで、制限付きモードとパラノイドモードは無効です',
          mode: {
            title: 'ファイアウォールモード',
            baseline: 'ベースライン',
            baselineDesc:
              'オープンな互換性プロファイル。ファイアウォールは動作しますが、着信元は制限されません。信頼できるネットワークでのみ使用してください。',
            moderate: '標準',
            moderateDesc:
              '既定のプロファイル。ベースラインのサービスを維持しつつ、新しい着信接続はプライベート、リンクローカル、ループバックの範囲からのみ受け付けます。外向きのアクセスは開放されたままです。',
            restricted: '制限付き',
            restrictedDesc:
              'ローカルのみの HTTPS と SSH に加え、外向きの DNS、NTP、syslog、オンライン更新を許可します。DHCP と必須の IPv6 トラフィックは引き続き利用できます。WebRTC はブロックされます。',
            paranoid: 'パラノイド',
            paranoidDesc:
              'ローカル専用の HTTPS アクセス。SSH、HTTP、オンライン更新、その他の送信方向のネットワーク機能をブロックします。オフライン更新のアップロードと準備済みのインストールは引き続き利用できます。',
            current: '現在',
            default: '既定',
            localOnly: 'ローカル専用',
            openTag: '着信は開放',
            httpsRequiredTag: 'HTTPS が必要',
            outboundOpen: '送信は開放',
            outboundLimited: '送信は制限',
            httpsOnly: 'HTTPS のみ'
          },
          moderate: {
            apply: '標準に切り替え'
          },
          restricted: {
            enable: '制限付きを有効化',
            confirmTitle: '制限付きモードを有効にしますか?',
            confirmDesc:
              'HTTPS と SSH の受信管理アクセスは private IPv4、IPv4 link-local/loopback、IPv6 link-local、IPv6 loopback の送信元範囲に制限されます。公開送信元範囲は許可されません。外向き DNS、NTP、リモート syslog、オンライン更新、DHCP、確立済み接続、必須 IPv6 制御通信は利用可能なままです。WebRTC/ICE UDP とその他の受信/送信通信はブロックされます。'
          },
          paranoid: {
            enable: 'パラノイドを有効化',
            confirmTitle: 'パラノイドモードを有効にしますか?',
            confirmDesc:
              'Private IPv4、IPv4 link-local/loopback、IPv6 link-local、IPv6 loopback の送信元範囲からの HTTPS アクセスのみが残ります。SSH、HTTP、mDNS、NTP、GitHub ダウンロード、その他の通信は最小限の DHCP/IPv6 制御通信を除きブロックされます。'
          },
          baseline: {
            apply: 'ベースラインに切り替え',
            confirmTitle: 'オープンなベースラインモードに切り替えますか?',
            confirmDesc:
              'ファイアウォールサービスは有効のままですが、ローカル専用の送信元範囲の制限が解除されます。ネットワークが経路を提供している場合、公開側の送信元範囲から NanoKVM の公開サービスに到達できる可能性があります。'
          },
          rules: {
            title: '現在のルール',
            empty: 'ルールなし'
          }
        },
        saveChanges: '変更を保存',
        unsaved: '未保存の変更'
      },
      systemLog: {
        saveFailed: 'ログ設定の保存に失敗しました',
        saved: 'ログ設定を保存しました',
        invalidHost: 'Syslog サーバーのホストを入力してください',
        logLoadFailed: 'ログの読み込みに失敗しました',
        save: '保存',
        test: 'テストログを送信',
        testSent: 'テストログを送信しました',
        testFailed: 'テストログの送信に失敗しました',
        remote: {
          title: 'リモートログ記録',
          forward: 'システムログを転送',
          description: 'システムメッセージをリモートサーバーへ転送します',
          host: 'サーバー',
          hostDesc: 'Syslog サーバーのホスト名または IPv4 アドレス',
          port: 'ポート',
          protocol: 'Syslog サーバーの UDP ポート'
        },
        local: {
          title: 'システムログバッファ',
          description:
            'SD カードへの書き込みを避けるため、現在のログは {{path}} の RAM に保持されます',
          priority: '最小優先度',
          priorityDesc: 'メッセージを記録する最小の緊急度',
          buffer: 'バッファサイズ',
          bufferDesc: 'ファイルをローテーションするログサイズ',
          rotations: 'ローテーション',
          rotationsDesc: '保持するローテーション済みログファイルの数',
          compact: 'コンパクト出力',
          compactDesc: '各行からホスト名とファシリティを省略します',
          stripTimestamps: 'タイムスタンプを削除',
          stripTimestampsDesc:
            '送信側が付けたタイムスタンプを削除します。syslog が独自のものを付けます'
        },
        kernel: {
          title: 'カーネルログ記録',
          enabled: 'カーネルログを転送',
          enabledDesc: 'カーネルメッセージをシステムログに記録します',
          consoleLevel: 'コンソールレベル',
          consoleLevelDesc: 'カーネルメッセージをコンソールに出力する最小の緊急度'
        },
        viewer: {
          title: 'システムログ',
          refresh: '更新',
          empty: 'ログエントリはありません',
          truncated: '最新のログデータのみ表示されます',
          linesUnit: '行'
        },
        level: {
          '1': '1 - アラート',
          '2': '2 - 重大',
          '3': '3 - エラー',
          '4': '4 - 警告',
          '5': '5 - 通知',
          '6': '6 - 情報',
          '7': '7 - デバッグ',
          '8': '8 - すべて'
        }
      },
      user: {
        title: 'ユーザー'
      },
      networking: {
        title: 'ネット'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: '暗号化トンネル',
        device: 'このデバイス',
        description: 'WireGuard トンネル経由でこの KVM にアクセスします',
        unavailable: 'このデバイスには WireGuard がインストールされていません',
        blocked: 'ファイアウォールのパラノイドモードでは WireGuard がブロックされます',
        needsKey: 'WireGuard をオンにする前に秘密鍵を設定してください',
        saved: 'WireGuard の設定を保存しました',
        save: '変更を保存',
        unsaved: '未保存の変更',
        invalid: '強調表示された項目を確認してください',
        invalidAddress: '10.0.0.1/24 のように、マスク付きのアドレスを入力してください',
        invalidKey: '44 文字の WireGuard キーを入力してください',
        invalidEndpoint: 'ホスト名または IP アドレスを入力してください',
        invalidPort: '1 から 65535 までのポートを入力してください',
        invalidRanges: '0.0.0.0/0 ではなく、10.0.0.0/24 のような IPv4 の範囲を指定してください',
        status: {
          connected: '接続済み',
          waiting: 'ピアを待っています',
          stopped: '停止中',
          handshake: '最終ハンドシェイク {{time}}'
        },
        privateKey: {
          title: '秘密鍵',
          description: 'このデバイスに保管され、再表示されることはありません',
          set: '設定済み',
          notSet: '未設定',
          setBtn: '設定',
          generate: '生成',
          remove: '削除',
          modalTitle: '秘密鍵を設定',
          modalDescription: 'キーはこのデバイスに保存され、再表示されることはありません',
          placeholder: '秘密鍵を貼り付け',
          generateConfirmTitle: '新しい秘密鍵を生成しますか？',
          generateConfirmDesc:
            '現在の鍵は使えなくなります。その後、新しい公開鍵をピアに追加してください。',
          removeConfirmTitle: '秘密鍵を削除しますか？',
          removeConfirmDesc: 'WireGuard はオフになり、新しい鍵を設定するまでオフのままです。'
        },
        publicKey: {
          title: '公開鍵',
          description: 'ピアの設定に追加してください'
        },
        address: {
          title: 'アドレス',
          description: 'トンネル内の KVM のアドレスとそのマスク'
        },
        peer: {
          title: 'ピア',
          publicKey: '公開鍵',
          publicKeyDescription: '接続先のピアの公開鍵',
          server: 'サーバー',
          serverDescription: 'ピアのホスト名または IP アドレス',
          port: 'ポート',
          portDescription: 'ピアの UDP ポート。通常は 51820',
          allowedIps: '許可する IP',
          allowedIpsDescription: '10.0.0.0/24 のような、トンネル内でのピアのアドレスまたは範囲',
          keepalive: 'キープアライブ',
          keepaliveDescription:
            'ルーターの内側で必要な、キープアライブパケットの送信間隔を秒数で指定します'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Tailscale ネットワーク経由でこの KVM にアクセスします',
        service: 'サービス',
        performance: 'パフォーマンス',
        memory: {
          title: 'メモリ最適化',
          tip: 'Tailscale のメモリ使用量を低く抑えます。RAM が少ないデバイスで効果的です。変更を反映するには Tailscale を再起動してください。'
        },
        swap: {
          title: 'スワップファイル',
          tip: 'メモリ最適化を有効にしても問題が解決しない場合は、スワップファイルを有効にしてみてください',
          sizeTip:
            'ファイルサイズは 128MB に設定されます。サイズは「設定 > システム > パフォーマンス」で変更できます'
        },
        restartTitle: 'Tailscale を再起動',
        restartDesc: 'サービスを再起動します',
        restartBtn: '再起動',
        restart: 'Tailscale を再起動しますか？',
        stopTitle: 'Tailscale を停止',
        stopBtn: '停止',
        stop: 'Tailscale を停止しますか？',
        stopDesc: 'サービスを停止し、起動時に自動で開始しないようにします',
        loading: '読み込み中...',
        notInstall: 'Tailscale が見つかりません、インストールしてください',
        install: 'インストール',
        installing: 'インストール中',
        failed: 'インストールに失敗しました',
        retry: 'ページを更新してもう一度お試しいただくか、手動でインストールしてください。',
        download: 'ダウンロードして',
        package: 'インストールパッケージを',
        unzip: '解凍してください',
        upTailscale: 'tailscale ファイルを NanoKVM の /usr/bin ディレクトリにアップロードします',
        upTailscaled: 'tailscaled ファイルを NanoKVM の /usr/sbin ディレクトリにアップロードします',
        refresh: 'ページを更新します',
        notRunning: 'Tailscale はまだ実行されていません。起動操作を実行してください。',
        run: '起動',
        notLogin:
          'このデバイスはまだバインドされていません。ログインしてデバイスをアカウントにバインドしてください。',
        urlPeriod: 'この URL は 10 分間有効です',
        login: 'ログイン',
        loginSuccess: 'ログイン成功',
        deviceName: 'デバイス名',
        deviceIP: 'デバイスアドレス',
        account: 'アカウント',
        logout: 'ログアウト',
        logoutDesc: 'ログアウトしてもよろしいですか？',
        uninstall: 'Tailscale をアンインストール',
        uninstallDesc: 'Tailscale をアンインストールしてもよろしいですか？',
        okBtn: 'はい',
        cancelBtn: 'いいえ'
      },
      update: {
        title: 'アップデート',
        currentVersion: '現在のバージョン',
        latestVersion: '最新バージョン',
        queryFailed: 'バージョン番号の取得に失敗しました',
        updateFailed: 'アップデートに失敗しました',
        paranoidBlocked: 'オンライン更新はパラノイドファイアウォールモードでブロックされています',
        paranoidBlockedDesc:
          'GitHub の確認とダウンロードには外向きネットワークアクセスが必要です。オフラインアップロードと準備済みインストールは引き続き利用できます。',
        available: '新しいバージョンが利用可能です。アップデートしてもよろしいですか？',
        updating: 'アップデート中',
        confirm: 'はい',
        cancel: 'いいえ',
        badge: {
          checking: '確認中',
          latest: '最新',
          available: 'アップデートあり',
          failed: '確認に失敗',
          local: 'ローカル'
        },
        application: {
          title: 'アプリケーション'
        },
        system: {
          queryFailed: 'システムバージョンの取得に失敗しました',
          appUpdateRequired:
            'このシステム更新をインストールする前に、アプリケーションを {{version}} に更新してください',
          requiredAppVersion: '必要なアプリケーションバージョン',
          downloadFailed: 'ダウンロードまたは検証に失敗しました',
          available: 'ベースシステム更新があります。',
          downloading: 'システム更新をダウンロードして検証しています...',
          downloadVerify: 'ダウンロードして検証',
          installing: '準備済みシステム更新をインストールしています...',
          install: 'インストール',
          installFailed: 'インストールに失敗しました',
          installConfirmTitle: 'システム更新をインストールしますか?',
          installConfirmDesc:
            '検証済みバンドルからベースシステムファイルを置き換えます。再起動が必要です。',
          rawInstallConfirmDesc:
            'この検証済みバンドルは raw boot/rootfs イメージを SD カードパーティションに書き込み、自動的に再起動します。書き込みには数分かかる場合があります。電源を接続したままにしてください。',
          rawInstallWarning:
            'Raw パーティション更新には自動 rollback がありません。起動に失敗した場合は SD カードを手動で復旧してください。',
          rawWaitTitle: 'システム更新をインストール中',
          rawWaitWriting: '新しいシステムを SD カードに書き込んでいます',
          rawWaitRestarting:
            'デバイスを再起動しています。デバイスが戻ると、このページは自動的に再読み込みされます。',
          rawWaitDesc:
            'これには約 3 分かかります。電源を接続したままにし、このページを閉じないでください。',
          rawWaitSlow: '予想より時間がかかっています。電源を切る前に、あと数分お待ちください。',
          rebootRequired: 'このシステム状態を有効にするには再起動が必要です。',
          rollingBack: 'システム更新を rollback しています...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback 準備済み',
          rollbackFailed: 'Rollback に失敗しました',
          rollbackConfirmTitle: 'システム更新を rollback しますか?',
          rollbackConfirmDesc:
            '最新のシステム更新バックアップからファイルを復元します。再起動が必要です。',
          stagedDesc:
            'システムアップデートはダウンロードされ検証されました、今すぐインストールできます',
          refresh: '更新',
          releaseNotes: 'リリースノート',
          systemVersion: 'システムバージョン',
          kernel: 'Kernel',
          stagedVersion: '準備済みバージョン',
          archive: 'アーカイブ',
          requiredFree: '必要な空き容量',
          fileCount: 'ファイル',
          rawImages: 'Raw イメージ',
          progress: '進行状況',
          progressMessage: '進行メッセージ',
          pendingVersion: '保留中のバージョン',
          bootHealth: '起動状態',
          healthy: '正常',
          unhealthy: '注意が必要',
          rollbackBackup: 'Rollback バックアップ'
        },
        offline: {
          title: 'アプリケーションバンドルをアップロード',
          desc: 'このコンピューターからアプリケーションバンドルをインストールします。その後、サーバーが再起動します。',
          installTitle: 'アプリケーション更新をインストールしますか?',
          installDesc:
            'アプリケーションが置き換えられ、サーバーが再起動します。再度サインインが必要です。'
        },
        local: {
          title: 'システムバンドルをアップロード',
          desc: 'このコンピューターからシステムバンドルをインストールします。1 つのファイルにアーカイブと署名付きメタデータが含まれます。',
          choose: 'ファイルを選択',
          invalidFile: '.tar または .tar.gz で終わるバンドルを選択してください。',
          diskTitle: '仮想ディスクをオフにしますか？',
          diskWarn:
            'バンドルは /data に保存されますが、仮想ディスクがオンの間は読み取り専用です。オフにすると、コンピュータから /data にアクセスできなくなります。続行しますか？',
          uploading: 'アップロード中',
          verifying: 'バンドルを検証して準備しています',
          keyTitle: 'ローカル更新キー',
          keyDesc: '自作のバンドルへの署名を許可する PEM 形式の公開鍵',
          keyNone: 'キーが未設定です',
          keySet: 'キーを設定',
          keyRemove: '削除',
          signer: '署名者',
          section: 'ローカル更新',
          keyRequired: 'ローカルキーが必要'
        }
      },
      account: {
        title: 'アカウント',
        webAccount: 'ウェブアカウント名',
        password: 'パスワード',
        passwordDesc: 'ウェブインターフェースへのログインに使うパスワードを変更します',
        updateBtn: '変更',
        logoutBtn: 'ログアウト',
        logoutDesc: 'ログアウトしてもよろしいですか？',
        okBtn: 'はい',
        cancelBtn: 'いいえ',
        session: {
          title: 'セッション'
        },
        logoutOnClose: {
          title: 'ブラウザを閉じたらログアウト',
          description: 'セッションを開いたままにせず、ブラウザを閉じたときに終了します'
        },
        totp: {
          title: '二要素認証',
          authenticator: '認証アプリ',
          description: 'パスワードに加えて、認証アプリの時間ベースのコードを要求します',
          required: 'ポリシーで必須',
          disable: '無効にする',
          enableTitle: '二要素認証を設定',
          enableDescription:
            '続行するにはパスワードを確認してください。第 2 要素を変更するたびに必要です。',
          continue: '続行',
          disableTitle: '二要素認証を無効にしますか?',
          disableDescription:
            'アカウントはパスワードのみで保護されます。続行するにはパスワードで確認してください。',
          disableFailed: '二要素認証を無効にできませんでした',
          passwordPlaceholder: '現在のパスワード',
          enrollFailed: '設定を開始できませんでした',
          invalidCode: 'コードが一致しません。次のコードをお試しください。',
          scan: '認証アプリでこれをスキャンしてください。',
          manualEntry: 'または、このキーを手動で入力してください:',
          codePlaceholder: '確認のため 6 桁のコードを入力',
          confirm: '確認',
          cancel: 'キャンセル',
          backupTitle: 'バックアップコードを今すぐ保存してください',
          backupDescription:
            '各コードは 1 回だけ使用でき、再表示されません。認証アプリを紛失した場合に再びログインできる唯一の手段で、デバイスの時計が同期されていなくても使用できます。',
          copy: 'コピー',
          copied: 'バックアップコードをコピーしました',
          savedThem: '保存しました',
          remaining: 'バックアップコードの残り: {{remaining}} 個',
          clockUnsynced:
            'デバイスの時計がまだ同期されていません。設定する前に、設定 > システム > 時刻 で時刻を同期してください。',
          noBackupCodes:
            'バックアップコードが残っていません。「生成」を選択して新しいセットを発行してください。',
          regenerate: '新しいバックアップコード',
          generate: '生成',
          regenerateTitle: '新しいバックアップコードを発行しますか?',
          regenerateDescription:
            '現在のバックアップコードは使えなくなります。続行するにはパスワードで確認してください。',
          regenerateFailed: '新しいバックアップコードを発行できませんでした',
          download: 'ダウンロード',
          copyFailed: 'コピーできませんでした。コードを選択して手動でコピーしてください。',
          requireTitle: '二要素認証を必須にする',
          requireDescription:
            '二要素認証を無効にできないようにし、設定していないアカウントはデバイスを使用する前に設定する必要があります',
          requireFailed: '要件を変更できませんでした',
          requiredTitle: '二要素認証が必要です',
          requiredDescription:
            'このデバイスは第 2 要素を必須としていますが、お使いのアカウントはまだ設定していません。続行するには今すぐ設定してください。'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw アシスタント',
      empty: 'タスクを入力して開始してください',
      inputPlaceholder: 'PicoClaw に実行してほしいことを説明してください',
      newConversation: '新しい会話',
      processing: '処理中...',
      agent: {
        defaultTitle: '一般アシスタント',
        defaultDescription: '一般的なチャット、検索、およびワークスペースのヘルプ',
        kvmTitle: 'リモート操作',
        kvmDescription: 'NanoKVM を通じてリモート ホストを操作します',
        switched: 'エージェントの役割が切り替わりました',
        switchFailed: 'エージェントの役割を切り替えることができませんでした'
      },
      send: '送信',
      cancel: 'キャンセル',
      status: {
        connecting: 'ゲートウェイに接続しています...',
        connected: 'PicoClaw セッションが接続されました',
        disconnected: 'PicoClaw セッションが終了しました',
        stopped: '停止要求が送信されました',
        runtimeStarted: 'PicoClaw ランタイムが開始されました',
        runtimeStartFailed: 'PicoClaw ランタイムの開始に失敗しました',
        runtimeStopped: 'PicoClaw ランタイムが停止しました',
        runtimeStopFailed: 'PicoClaw ランタイムの停止に失敗しました'
      },
      connection: {
        runtime: {
          checking: 'チェック中',
          ready: 'ランタイムの準備が完了しました',
          stopped: 'ランタイムが停止しました',
          unavailable: 'ランタイムが使用できません',
          configError: '構成エラー'
        },
        transport: {
          connecting: '接続中',
          connected: '接続されました'
        },
        run: {
          idle: 'アイドル状態',
          busy: 'ビジー'
        }
      },
      error: {
        lockHeld: 'PicoClaw は別のウィンドウで使用中です',
        takenOver: '別のウィンドウが PicoClaw を引き継ぎました',
        authFailed: 'PicoClaw が接続を拒否しました',
        upstreamClosed: 'PicoClaw との接続が失われました'
      },
      tool: {
        screenshot: 'スクリーンショットを撮影中',
        loadImage: 'スクリーンショットを確認中',
        actions: 'ホストを操作中',
        generic: '{{name}} を使用中',
        type: '{{text}} を入力中',
        hotkey: '{{keys}} を押しています',
        click: 'クリック中',
        doubleClick: 'ダブルクリック中',
        move: 'マウスを移動中',
        drag: 'ドラッグ中',
        scroll: 'スクロール中',
        wait: '待機中'
      },
      message: {
        toolAction: 'アクション',
        observation: '観察',
        screenshot: 'スクリーンショット'
      },
      overlay: {
        locked: 'PicoClaw がデバイスを制御しています。手動入力が一時停止されます。'
      },
      install: {
        install: 'PicoClaw をインストールする',
        installing: 'PicoClaw をインストールしています',
        success: 'PicoClaw は正常にインストールされました',
        failed: 'PicoClaw のインストールに失敗しました',
        uninstalled: 'PicoClaw は正常にアンインストールされました',
        uninstallFailed: 'アンインストールに失敗しました',
        requiredTitle: 'PicoClaw がインストールされていません',
        requiredDescription:
          'PicoClaw ランタイムを開始する前に PicoClaw をインストールしてください。',
        progressDescription: 'PicoClaw をダウンロードしてインストールしています。',
        stages: {
          preparing: '準備中',
          downloading: 'ダウンロード中',
          extracting: '展開中',
          verifying: '検証中',
          installing: 'インストール中',
          installed: 'インストール完了',
          install_timeout: 'タイムアウト',
          install_failed: '失敗'
        }
      },
      model: {
        requiredTitle: 'モデル構成が必要です',
        requiredDescription: 'PicoClaw チャットを使用する前に、PicoClaw モデルを構成します。',
        docsTitle: '構成ガイド',
        docsDesc: 'サポートされているモデルとプロトコル',
        menuLabel: 'モデルの構成',
        modelIdentifier: 'モデル識別子',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API ベース URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API キー',
        apiKeyPlaceholder: 'モデルの API キーを入力してください',
        apiKeyKeepPlaceholder: '空のままにすると現在のキーが保持されます',
        save: '保存',
        saving: '保存中',
        saved: 'モデル構成が保存されました',
        saveFailed: 'モデル構成の保存に失敗しました',
        invalid: 'モデル識別子、API ベース URL、API キーは必須です'
      },
      uninstall: {
        confirmTitle: 'PicoClaw のアンインストール',
        confirmContent:
          'PicoClaw をアンインストールしてもよろしいですか?これにより、実行可能ファイルとすべての構成ファイルが削除されます。',
        confirmOk: 'アンインストール'
      },
      history: {
        title: '履歴',
        loading: 'セッションを読み込み中...',
        emptyTitle: '履歴はまだありません',
        emptyDescription: '以前の PicoClaw セッションがここに表示されます。',
        loadFailed: 'セッション履歴のロードに失敗しました',
        deleteFailed: 'セッションの削除に失敗しました',
        deleteConfirmTitle: 'セッションを削除します',
        deleteConfirmContent: '「{{title}}」を削除してもよろしいですか?',
        deleteConfirmOk: '削除',
        messageCount_other: '{{count}} メッセージ'
      },
      config: {
        startRuntime: 'PicoClaw を開始',
        stopRuntime: 'PicoClaw を停止',
        stopConfirm: 'PicoClaw を停止しますか？'
      },
      start: {
        title: 'PicoClaw を開始',
        description: 'ランタイムを起動して、PicoClaw アシスタントの使用を開始します。'
      }
    },
    error: {
      title: 'エラーが発生しました',
      refresh: '更新'
    },
    fullscreen: {
      toggle: '全画面表示切り替え'
    },
    menu: {
      collapse: 'メニューを折りたたむ'
    }
  }
};

export default ja;
