const zh = {
  translation: {
    common: {
      confirm: '确认',
      cancel: '取消',
      close: '关闭',
      save: '保存',
      discard: '放弃',
      delete: '删除',
      actionFailed: '操作失败',
      loading: '正在从设备加载设置...',
      loadFailed: '无法从设备加载设置',
      retry: '重试'
    },
    head: {
      desktop: '远程桌面',
      login: '登录',
      firstSetup: '首次设置',
      changePassword: '修改密码',
      terminal: '终端',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: '登录',
      placeholderUsername: '请输入用户名',
      placeholderPassword: '请输入密码',
      placeholderPassword2: '请再次输入密码',
      noEmptyUsername: '用户名不能为空',
      noEmptyPassword: '密码不能为空',
      invalidUser: '用户名或密码错误',
      locked: '登录太频繁，请稍后再试',
      globalLocked: '系统防爆破保护中，请稍后再试',
      error: '未知错误',
      changePassword: '修改密码',
      changePasswordDesc: '为了您的设备安全，请修改密码',
      differentPassword: '两次密码不一致',
      illegalUsername: '用户名中包含非法字符',
      illegalPassword: '密码至少 8 个字符，且不能包含引号或斜杠',
      forgetPassword: '忘记密码',
      ok: '确定',
      cancel: '取消',
      loginButtonText: '登录',
      setupTitle: '创建管理员账户',
      setupDescription: '此设备尚无网页账户。请创建第一个管理员账户以继续。',
      setupRecovery: '如果此密码丢失，恢复需要重新写入 SD 卡',
      setupButtonText: '创建账户',
      tips: {
        hardenedRecovery:
          '此 Hardened 镜像不支持通过 BOOT 按钮重置密码。如果密码丢失，请重新写入 SD 卡并创建新账户。',
        change1: '请注意，此操作将同时更新以下密码：',
        change2: '网页的登录密码',
        change3: '用于 SSH 登录的系统 root 用户密码'
      },
      placeholderCurrentPassword: '当前密码',
      placeholderNewPassword: '新密码',
      wrongCurrentPassword: '当前密码不正确',
      totp: {
        title: '两步验证',
        prompt: '请输入验证器应用中的 6 位数字验证码',
        backupPrompt: '请输入其中一个备份码',
        noEmptyCode: '请输入验证码',
        placeholderCode: '6 位验证码',
        placeholderBackup: '备份码',
        verifyButtonText: '验证',
        useBackupCode: '使用备份码',
        useAuthenticator: '使用验证器应用的验证码',
        cancel: '返回',
        invalidCode: '该验证码无效，请重试。'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: '配置 NanoKVM Wi-Fi 信息',
      success: '请前往设备检查 NanoKVM 的网络状态',
      failed: '操作失败，请重试',
      invalidMode: '当前模式不支持配置网络。请先前往设备启用 Wi-Fi 配置模式。',
      confirmBtn: '确定',
      finishBtn: '完成',
      ap: {
        authTitle: '身份验证',
        authDescription: '请输入 AP 密码以继续',
        authFailed: '密码错误',
        passPlaceholder: 'AP 密码',
        verifyBtn: '验证'
      }
    },
    screen: {
      scale: '缩放',
      title: '屏幕',
      video: '视频模式',
      videoDirectTips: '该模式需启用 HTTPS，请前往「设置 > 网络 > 服务」中开启',
      videoWebrtcBlockedByFirewall: 'H.264 WebRTC 在受限和偏执防火墙模式下已禁用',
      transferRunningTitle: '镜像传输进行中',
      transferRunningDesc: '切换视频模式会重新加载页面，并取消正在进行的镜像上传或下载。',
      transferRunningOk: '切换模式',
      resolution: '分辨率',
      auto: '自动',
      autoTips: '在某些分辨率下可能出现花屏或鼠标偏移，请调整远程主机分辨率或关闭自动模式',
      fps: '帧率',
      customizeFps: '自定义',
      quality: '图像质量',
      qualityLossless: '无损',
      qualityHigh: '高',
      qualityMedium: '中',
      qualityLow: '低',
      frameDetect: '帧差检测',
      frameDetectTip: '比较帧并在远程主机画面不变时停止传输视频',
      resetHdmi: '重置 HDMI',
      webrtcConnectionFailed: {
        title: 'WebRTC 连接失败',
        description: '请检查网络连接或切换视频模式'
      },
      captureStatus: {
        hdmiError: 'HDMI 画面异常',
        unsupportedResolution: '当前分辨率不支持',
        retrieving: '正在获取画面...',
        changingResolution: '正在切换分辨率...',
        updateFailed: '画面暂时无法更新',
        videoError: '视频显示异常',
        noHdmi: '未检测到 HDMI 信号',
        unavailable: '画面暂时无法显示'
      }
    },
    keyboard: {
      title: '键盘',
      paste: '粘贴',
      tips: '仅支持标准键盘的字母和符号',
      placeholder: '要粘贴的文本',
      local: '移动键盘',
      virtual: '屏幕键盘',
      readClipboard: '从剪贴板读取',
      clipboardPermissionDenied: '剪贴板权限被拒绝，请允许您的浏览器访问剪贴板',
      clipboardReadError: '无法读取剪贴板',
      dropdownEnglish: '英语',
      dropdownGerman: '德语',
      dropdownFrench: '法语',
      dropdownRussian: '俄语',
      dropdownKorean: '韩语',
      dropdownJapanese: '日语',
      localInput: '移动端键盘输入',
      shortcut: {
        title: '快捷键',
        custom: '自定义',
        capture: '点击此处捕获快捷键',
        clear: '清空',
        save: '保存',
        captureTips: '捕获系统级按键，如 Windows 键，需要全屏权限',
        enterFullScreen: '切换全屏模式'
      },
      leaderKey: {
        title: '引导键',
        desc: '绕过浏览器限制，向远程主机发送被系统拦截的快捷键',
        howToUse: '使用方法',
        simultaneous: {
          title: '组合按键模式',
          desc1: '按住引导键不放，同时按下目标快捷键。',
          desc2: '操作直观，但少数快捷键可能因系统占用而无法生效。'
        },
        sequential: {
          title: '序列输入模式',
          desc1: '点击引导键开始 → 依次点击快捷键 → 再次点击引导键结束。',
          desc2: '步骤较多，但能完美避开系统键位冲突。'
        },
        enable: '启用引导键',
        tip: '设为引导键后，该按键将仅用于触发快捷键，不再作为普通按键使用。',
        placeholder: '按下引导键',
        shiftRight: '右 Shift',
        ctrlRight: '右 Ctrl',
        metaRight: '右 Win',
        recorder: {
          rec: '录制中',
          activate: '激活按键',
          input: '按下快捷键'
        }
      }
    },
    mouse: {
      title: '鼠标',
      cursor: '光标样式',
      default: '默认光标',
      cell: '单元指针',
      text: '文本指针',
      grab: '抓取指针',
      hide: '隐藏指针',
      mode: '鼠标模式',
      absolute: '绝对模式',
      relative: '相对模式',
      direction: '滚轮方向',
      scrollUp: '向上',
      scrollDown: '向下',
      speed: '滚轮速度',
      sensitivity: '指针速度',
      sensitivityDesc: '用于桌面相对模式：较低数值可减少主机鼠标加速造成的漂移',
      fast: '快',
      slow: '慢',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          '可在 KVM 区域任意位置移动，远程光标会在两次触摸之间保持位置，并与绝对 HID 保持同步'
      },
      requestPointer: '正在使用鼠标相对模式，请点击桌面获取鼠标指针',
      resetHid: '重置 HID',
      hidOnly: {
        title: 'HID-Only 模式',
        desc: '如果鼠标或键盘停止响应，且重置 HID 无效，可能是 NanoKVM 与主机之间存在兼容性问题。',
        tip1: '启用 HID-Only 模式将卸载虚拟磁盘和虚拟网络',
        tip2: '在 HID-Only 模式下，镜像挂载被禁用',
        tip3: '切换模式后将自动重启 NanoKVM',
        enable: '启用 HID-Only 模式',
        disable: '停用 HID-Only 模式'
      }
    },
    image: {
      title: '镜像',
      loading: '加载中...',
      empty: '无镜像文件',
      mountMode: '挂载为',
      mount: '挂载',
      orDownload: '或从链接下载',
      keepRunning: '可以关闭此窗口。传输会继续进行，进度会显示在镜像列表中。',
      massStorage: '大容量存储',
      cdRom: 'CD-ROM',
      mountFailed: '挂载失败',
      mountDesc: '在某些系统中，需要在远程主机中弹出虚拟硬盘后再挂载镜像',
      diskOnWarn: '挂载镜像会关闭虚拟磁盘，电脑将无法再访问 /data 目录。是否继续？',
      diskOffWarn:
        '虚拟磁盘当前已关闭，需要先开启才能挂载镜像，电脑上的 USB 设备会短暂断开重连。是否继续？',
      unmountFailed: '卸载失败',
      unmountDesc: '在某些系统中，需要在远程主机中手动弹出后再卸载镜像',
      forceEject: '强制弹出',
      forceEjectConfirm:
        '主机已锁定光驱。强制弹出会使虚拟 USB 设备短暂断开，键盘和鼠标可能会暂时断开连接。是否继续？',
      usbReconnect: '重新连接 USB',
      usbReconnectConfirm:
        '仅当远程主机没有识别到介质变化时才重新连接 USB gadget。键盘和鼠标可能会短暂断开。',
      usbReconnectSuccess: 'USB 已重新连接',
      usbReconnectFailed: 'USB 重新连接失败',
      addImage: '添加镜像',
      fromUrl: '从链接',
      fromFile: '从文件',
      turnOff: '关闭',
      deleteDiskShared: '虚拟磁盘开启时无法删除镜像。',
      eject: '弹出',
      download: '下载',
      upload: '上传',
      mountTitle: '挂载镜像',
      deleteTitle: '删除镜像',
      deleteConfirm: '确定要删除该镜像吗？',
      tips: {
        title: '如何上传',
        usb1: '将 NanoKVM 通过 USB 连接到您的电脑。',
        usb2: '确保已在 设置 > 设备 > 虚拟磁盘 中挂载虚拟磁盘。',
        usb3: '在电脑上打开虚拟硬盘，将镜像文件拷贝到虚拟硬盘的根目录下。',
        scp1: '确保 NanoKVM 和您的电脑在同一个局域网内。',
        scp2: '在电脑上打开终端软件，使用 SCP 命令将镜像文件上传到 NanoKVM 的 /data 目录。',
        scp3: '示例：scp your-image-path root@your-nanokvm-ip:/data',
        tfCard: 'SD 卡',
        tf1: '该方式适用于 Linux 系统',
        tf2: '将 SD 卡从 NanoKVM 中取出。FULL 版本需要先拆开外壳。',
        tf3: '将 SD 卡插入读卡器并连接到您的电脑。',
        tf4: '从电脑上拷贝镜像文件到 SD 卡的 /data 目录下。',
        tf5: '将 SD 卡重新插入 NanoKVM。'
      }
    },
    script: {
      title: '脚本',
      upload: '上传',
      run: '运行',
      runBackground: '后台运行',
      runFailed: '运行失败',
      delDesc: '确定要删除该文件吗？',
      delete: '删除',
      close: '关闭',
      unlockDesc: '脚本在 NanoKVM 上以 root 身份运行。请输入 Web 账户密码以上传或运行脚本。',
      terminalRequired: '脚本需要 Web 终端访问权限。请先在设置中启用终端。'
    },
    terminal: {
      title: '终端',
      nanokvm: 'NanoKVM 终端',
      serial: '串口终端',
      unlockTitle: '解锁终端',
      unlockDesc: '输入网页账户密码以启动终端会话',
      unlock: '解锁',
      unlockFailed: '解锁终端失败',
      invalidCredentials: '用户名或密码无效',
      locked: '尝试次数过多，稍后再试',
      sessionClosed: '终端会话已关闭。请重新解锁以连接。',
      sessionError: '终端连接失败。请重新解锁后重试。',
      serialPort: '串口',
      serialPortPlaceholder: '例如 /dev/ttyS1',
      baudrate: '波特率',
      parity: '奇偶校验',
      parityNone: '无',
      parityEven: '偶校验',
      parityOdd: '奇校验',
      flowControl: '流量控制',
      flowControlNone: '无',
      flowControlSoft: '软件',
      flowControlHard: '硬件',
      dataBits: '数据位',
      stopBits: '停止位',
      open: '打开终端'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: '指令发送中...',
      sent: '指令已发送',
      input: 'MAC 地址',
      ok: '确定'
    },
    download: {
      input: '远程镜像 URL',
      ok: 'OK',
      disabled:
        '当前无法下载或上传镜像，因为存储不可写。如果镜像已挂载，请先卸载，然后关闭虚拟磁盘，使存储恢复可写。',
      diskShared: '关闭虚拟磁盘功能以使用镜像下载功能',
      mountedImage: '此镜像已挂载，上传同名文件前请先卸载',
      diskOff: '关闭虚拟磁盘功能',
      uploadbox: '将文件拖放到此处或单击选择',
      inputfile: '镜像文件',
      NoISO: '无镜像',
      complete: '下载完成',
      uploadComplete: '上传完成',
      downloading: '正在下载',
      uploading: '正在上传',
      failed: '传输失败',
      uploadFailed: '上传失败',
      stalled: '传输已停滞，请检查连接后重试',
      canceled: '上传已取消',
      downloadCanceled: '下载已取消',
      cancel: '取消',
      remoteDisabled: '远程 ISO 下载已在 设置 > 用户 > 偏好设置 中禁用',
      remoteFailed: '远程 ISO 下载失败',
      sha256: '可选的 SHA-256 校验值',
      sha256Placeholder: '请输入 64 位 SHA-256 校验和',
      invalidSHA256: 'SHA-256 必须是 64 位十六进制字符串',
      checksumFailed: '下载失败：SHA-256 校验失败'
    },
    power: {
      title: '电源',
      showConfirm: '显示确认框',
      showConfirmTip: '电源操作需要二次确认',
      reset: '重启',
      powerShort: '电源按钮：短按',
      powerLong: '电源按钮：长按',
      resetConfirm: '确认执行重启操作吗？',
      powerConfirm: '确认执行电源操作吗？',
      okBtn: '确认',
      cancelBtn: '取消'
    },
    settings: {
      title: '设置',
      about: {
        title: '关于',
        information: '信息',
        ip: 'IP 地址',
        mdns: '本地地址',
        application: '应用版本',
        uptime: '运行时间',
        community: '社区',
        credit: '基于 Sipeed 的 <a1>NanoKVM</a1> 和 woffko 的 <a2>Hardened NanoKVM</a2> 构建',
        hostname: '设备名称',
        changeIn: '可在 {{path}} 中更改',
        updateIn: '可在 {{path}} 中更新',
        toggleIn: '可在 {{path}} 中开启或关闭'
      },
      appearance: {
        title: '偏好设置',
        display: '显示',
        language: '语言',
        languageDesc: '选择界面语言',
        webTitle: '网页标题',
        webTitleDesc: '自定义网站页面标题',
        layoutMode: '界面布局',
        layoutModeDesc: '在此浏览器中使用手机/触控布局',
        layoutAuto: '自动',
        layoutMobile: '手机',
        menuBar: {
          title: '菜单栏',
          mode: '显示方式',
          modeDesc: '菜单栏在屏幕上的显示方式',
          modeOff: '关闭',
          modeAuto: '自动隐藏',
          modeAlways: '始终显示',
          keyboardLedStatus: '键盘锁定状态指示灯',
          keyboardLedStatusDesc: '显示远程主机的 Num Lock、Caps Lock 和 Scroll Lock 状态',
          icons: '菜单图标',
          iconsDesc: '是否在菜单栏中显示子菜单图标',
          terminalWarningTitle: '启用网页终端？',
          terminalWarningDesc:
            '终端会在浏览器中打开 root shell。仅在可信网络中启用，用完后请关闭。',
          terminalWarningConfirm: '启用',
          remoteDownload: '远程 ISO 下载',
          remoteDownloadWarningTitle: '启用远程 ISO 下载？',
          remoteDownloadWarningDesc:
            'NanoKVM 将从 URL 获取 ISO 并写入 /data。仅对可信 URL 启用，用完后请关闭。',
          remoteDownloadWarningConfirm: '启用'
        }
      },
      keyboardLedStatus: {
        groupLabel: '远程键盘锁定状态',
        indicatorLabel: '{{label}}：{{state}}',
        numLock: '数字锁定',
        numLockShort: '数',
        capsLock: '大写锁定',
        capsLockShort: '大',
        scrollLock: '滚动锁定',
        scrollLockShort: '滚',
        on: '开启',
        off: '关闭',
        unknown: '未知'
      },
      device: {
        title: '设备',
        minutes: '分钟',
        sections: {
          general: '常规',
          connectivity: '连接',
          hostConnection: '主机连接',
          inputOutput: '输入与输出'
        },
        oled: {
          title: 'OLED 超时',
          description: '设置 OLED 屏幕自动休眠时间',
          keepOn: '保持 OLED 常亮',
          keepOnDescription: '从不关闭 OLED 屏幕'
        },
        ssh: {
          description: '启用 SSH 远程访问',
          tip: '启用此选项前，请在 帐号 > 密码 中设置强密码'
        },
        swap: {
          title: 'Swap',
          description: '内存不足时使用交换文件',
          size: 'Swap 大小',
          sizeDescription: '设置交换文件大小',
          tip: '启用该功能可能会减少SD卡使用寿命'
        },
        mouseJiggler: {
          title: '鼠标抖动',
          description: '防止远程主机休眠',
          disable: '关闭',
          absolute: '绝对模式',
          relative: '相对模式'
        },
        sessionLock: {
          title: '闲置时锁定会话',
          description: '超过此时间后要求重新登录'
        },
        mdns: {
          description: '启用 mDNS 发现服务',
          tip: '允许通过 .local 名称访问此设备。如果您通过 IP 地址连接，或 DNS 已能解析其主机名，则无需开启。'
        },
        hdmi: {
          description: '启用 HDMI/显示器 输出功能',
          idleTimeoutTitle: '无观看者自动停止采集',
          idleTimeoutDescription: '没有活跃观看者后停止 HDMI 采集，0 表示永不停止'
        },
        hidOnly: 'HID-Only 模式',
        hidOnlyDesc: '当鼠标或键盘停止响应时，改善与主机的兼容性',
        hidOnlyTip: 'HID-Only 模式会停止模拟虚拟设备，仅保留基础的 HID 控制',
        disk: '虚拟磁盘',
        diskDesc: '在远程主机上挂载 SD 卡',
        diskLocked: '挂载镜像期间已关闭，开启会取消镜像挂载',
        diskEnable: '启用虚拟磁盘',
        networkChange: '更改虚拟网卡',
        diskCancelMount: '开启虚拟磁盘会取消当前挂载的镜像，是否继续？',
        networkCancelMount:
          '更改虚拟网卡会重启 USB 连接。这会取消当前挂载的镜像并开启虚拟磁盘。是否继续？',
        diskTransferRunning: '镜像传输正在进行。请等待其完成后再启用虚拟磁盘。',
        network: '虚拟网卡',
        networkDesc: '在远程主机中挂载虚拟网卡',
        usbWakeup: 'USB 唤醒',
        usbWakeupDesc: '允许键盘或鼠标事件唤醒远程主机',
        usbWakeupTip: '如果主机反复记录 USB wakeup 消息，请关闭',
        hostname: {
          description: '此设备在网络中的名称',
          reachable: '在本地网络中可通过 {{address}} 访问'
        },
        rebootRequired: '需要重启',
        rebootPending: '需要重启：{{reasons}}',
        rebootReasons: {
          systemUpdate: '系统更新'
        },
        reboot: '重新启动',
        rebootDesc: '您确定要重新启动 NanoKVM 吗？',
        poweroff: '关机',
        poweroffDesc: '确定要关闭 NanoKVM 吗？关闭后将无法访问，直到重新开机。'
      },
      network: {
        title: 'IP & DNS',
        connection: '连接',
        configuration: '配置',
        wifi: {
          title: 'Wi-Fi',
          description: '配置 Wi-Fi 信息',
          apMode: 'AP 模式已启用，请扫描二维码连接 Wi-Fi',
          connect: '连接 Wi-Fi',
          connectDesc1: '请输入网络名称和密码',
          disconnect: '是否要断开该网络连接？',
          disconnectBtn: '断开连接',
          connected: '已连接',
          ssid: '名称',
          password: '密码',
          joinBtn: '加入',
          cancelBtn: '取消'
        },
        tls: {
          description: '启用 HTTPS 协议',
          tip: '注意：使用 HTTPS 可能导致延迟增加，特别是在 MJPEG 视频模式下',
          restartTitle: '服务器将重启',
          restartDesc: '协议更改会重启服务器。浏览器将在 {{seconds}} 秒后切换到新地址：',
          restartOk: '应用并重启',
          confirmTitle: '保留新协议？',
          confirmDesc:
            '服务器现在使用 {{protocol}}。如果不保留，将在 {{seconds}} 秒后恢复为之前的协议。',
          confirmKeep: '保留',
          confirmRevert: '返回',
          reverting: '正在恢复为之前的协议。浏览器将在 {{seconds}} 秒后切换到该地址。',
          certTitle: '保留新证书？',
          certDesc: '服务器现在使用新证书。如果不保留，将在 {{seconds}} 秒后恢复为之前的证书。',
          certReverted: '已恢复之前的证书'
        },
        trustedProxies: {
          section: '反向代理',
          title: '受信任的代理',
          description: '设备信任其报告客户端地址和协议的反向代理',
          tip: '列表中的地址决定登录限制和日志记录的客户端地址，因此只添加由你自己控制的代理',
          none: '无',
          edit: '编辑',
          editRow: '编辑列表',
          editTitle: '编辑受信任的代理',
          editDescription: '更改列表需要你的密码',
          dialogDescription:
            '输入每个反向代理在此设备上看到的地址，或像 10.0.0.0/24 这样的范围。列表中的代理会告诉设备使用哪个客户端地址和协议。它转发的内容都会被采信，因此只添加由你自己控制的代理。'
        },
        certificate: {
          title: '证书',
          desc: 'HTTPS 证书的来源',
          requesting: '正在申请证书',
          selfSigned: '自签名',
          domain: '域名',
          domainDesc: '必须指向此设备，且端口 443 能从互联网访问',
          domainTailscale: '由 Tailscale 为此设备设置',
          domainInvalid: '请使用完整域名，例如 kvm.example.org',
          email: '电子邮件',
          emailDesc: "可选，用于接收 Let's Encrypt 的通知",
          emailInvalid: '请使用类似 name@example.org 的地址',
          validUntil: '有效期至',
          valid: '有效',
          expiresSoon: '即将过期',
          expired: '已过期',
          lastRenewal: '上次续期',
          renewed: '已续期',
          failed: '失败',
          renewNow: '立即续期',
          renewNowDesc: '无需等待，申请新证书',
          renewBtn: '续期',
          applyTitle: '更改证书',
          applyOk: '应用',
          applyAcme:
            "设备向 Let's Encrypt 申请证书。Let's Encrypt 会从互联网连接端口 443 进行验证，这最多可能需要一分钟。如果申请失败，将继续使用当前证书。",
          applyTailscale:
            '设备从 Tailscale 获取证书，这最多可能需要一分钟。如果申请失败，将继续使用当前证书。',
          applySelfSigned: '设备将恢复使用自己的自签名证书。浏览器会显示警告。',
          openTitle: '打开新地址',
          openDesc:
            '证书已就绪。请打开下面的地址并登录以保留它。如果 3 分钟内未确认，将恢复为之前的证书。',
          openOk: '打开',
          blockedClock: '设备时钟同步后才能申请证书',
          blockedParanoid: '防火墙偏执模式会阻止证书申请',
          tailscaleUnavailable: 'Tailscale 未运行，或 tailnet 未启用 HTTPS 证书'
        },
        dns: {
          title: 'DNS',
          description: '配置 NanoKVM 使用的 DNS 服务器',
          ipv4Title: 'IPv4',
          ipv4Description: '配置有线接口的 IPv4 地址',
          servers: '服务器',
          dhcp: 'DHCP',
          manual: '手动',
          apply: '应用',
          invalid: '请输入有效的 IPv4 或 IPv6 地址',
          invalidNetwork: '请输入有效的 IPv4 地址、子网掩码和路由器',
          saved: 'DNS 设置已保存',
          redirecting: '网络设置已保存。正在打开新地址...',
          saveFailed: '保存 DNS 设置失败',
          unsaved: '有未保存的更改',
          maxServers: '最多允许 {{count}} 个 DNS 服务器',
          dhcpServersDescription: 'DNS 服务器由 DHCP 自动获取',
          manualServersDescription: '支持 IPv4 和 IPv6 服务器',
          interface: '接口',
          ipAddress: 'IP 地址',
          subnetMask: '子网掩码',
          router: '路由器'
        },
        ipv6: {
          title: 'IPv6',
          description: '为有线接口配置 IPv6 地址',
          disabled: '已禁用',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: '手动',
          interface: '接口',
          state: '状态',
          router: '路由器',
          addresses: '地址',
          dhcpv6Client: 'DHCPv6 客户端',
          notInstalled: '未安装',
          ipAddress: 'IPv6 地址',
          prefix: '前缀',
          invalidManual: '请输入有效的 IPv6 地址、前缀和路由器',
          clientMissing: '未安装 DHCPv6 客户端。请先安装匹配的 raw 系统更新。',
          saved: 'IPv6 设置已保存',
          saveFailed: '保存 IPv6 设置失败',
          unsaved: '未保存的更改'
        }
      },
      system: {
        title: '系统',
        performance: {
          processor: '处理器',
          overdrive: {
            title: '时钟超频',
            description: '以制造商指定的更高处理器和视频时钟频率启动',
            tip: '如果设备在超频下无法启动，必须重新刷写 SD 卡',
            unavailable: '此系统镜像不包含该选项',
            keepTitle: '更新后保持超频',
            keepDescription: '除非开启此项，否则系统更新后设备将恢复为标准时钟',
            confirmTitle: '启用时钟超频？',
            confirmText:
              '如果设备在超频下无法启动，必须重新刷写 SD 卡才能恢复。更改将在下次重启后生效。',
            confirmOk: '启用'
          },
          watchdog: {
            title: '硬件看门狗',
            description: '设备停止响应时自动重启',
            unavailable: '此系统镜像未包含',
            notRunning: '当前未运行',
            lastRestart: '上次重启',
            lastRestartCaption: '系统最近一次重启的原因',
            reasonPowerOn: '上电',
            reasonRestart: '请求重启',
            reasonWatchdog: '看门狗复位',
            reasonOverheat: '过热保护',
            reasonUnknown: '未知'
          },
          recovery: '恢复',
          memory: '内存'
        },
        monitor: {
          processorClock: 'CPU 子系统',
          videoClock: '视频子系统',
          videoClockCaption: '视频时钟频率',
          cpuClockCaption: 'CPU 时钟频率',
          overdrive: '超频',
          temperature: '温度',
          lastMinutes: '最近 5 分钟',
          ram: 'RAM',
          off: '关闭',
          ramHistory: 'RAM 利用率',
          cpuLoad: 'CPU 负载',
          cpuLoadCaption: '用户 {{user}} 百分比，系统 {{system}} 百分比',
          cpuUtilization: 'CPU 使用率',
          swapUtilization: '交换空间使用率',
          swapSizeLastMinutes: '{{size}}，最近 5 分钟',
          percent: '{{percent}} %',
          percentUsed: '已用 {{percent}} %',
          sizeOf: '{{used}} / {{total}}',
          systemPartition: '系统分区',
          dataPartition: '数据分区',
          unavailable: '不可用',
          noReadings: '设备未返回读数',
          refresh: '此页面打开期间每秒更新一次'
        },
        sections: {
          time: '时间',
          firewall: '防火墙',
          systemLog: '日志',
          performance: '性能',
          monitor: '监控',
          services: '服务',
          webInterface: '安全网页访问'
        },
        time: {
          saveFailed: '保存时间设置失败',
          saved: '时间设置已保存',
          syncFailed: '同步时间失败',
          synced: '时间已同步',
          invalidServers: '请至少输入一个 NTP 服务器',
          maxServers: '最多允许 {{count}} 个 NTP 服务器',
          refresh: '刷新',
          syncNow: '同步',
          syncNowDesc: '立即用 NTP 服务器设置时钟',
          save: '保存',
          ntp: {
            title: 'NTP',
            description: '从已配置的 NTP 服务器同步设备时间'
          },
          networkTime: '网络时间',
          clock: {
            title: '时钟',
            description: '设置日志和界面使用的本地时区',
            current: '当前时间',
            timezone: '时区'
          },
          servers: {
            title: 'NTP 服务器',
            description: '使用默认公共服务器、本地路由器或自定义 NTP 服务器',
            useRouter: '使用路由器',
            useDefaults: '使用默认值',
            presets: '服务器预设',
            presetsDesc: '用预设替换服务器列表'
          }
        },
        firewall: {
          saveFailed: '应用防火墙设置失败',
          saved: '防火墙设置已应用',
          cancel: '取消',
          refresh: '刷新',
          backends: '后端',
          enableHttpsFirst: '请先启用 HTTPS，再启用受限或偏执防火墙模式',
          httpsRequired: '在“设置 > 网络 > 服务”中启用 HTTPS 之前，受限和偏执模式不可用',
          mode: {
            title: '防火墙模式',
            baseline: '基线',
            baselineDesc: '开放的兼容配置。防火墙正在运行，但不限制入站来源。仅在可信网络中使用。',
            moderate: '适中',
            moderateDesc:
              '默认配置。保留基线的服务，但仅接受来自私有、链路本地或环回范围的新入站连接。出站访问保持开放。',
            restricted: '受限',
            restrictedDesc:
              '仅限本地的 HTTPS 和 SSH，以及出站的 DNS、NTP、syslog 和在线更新。DHCP 和必要的 IPv6 流量仍然可用。WebRTC 被阻止。',
            paranoid: '偏执',
            paranoidDesc:
              '仅限本地的 HTTPS 访问。阻止 SSH、HTTP、在线更新和其他出站网络功能。离线更新上传和已暂存的安装仍然可用。',
            current: '当前',
            default: '默认',
            localOnly: '仅限本地',
            openTag: '入站开放',
            httpsRequiredTag: '需要 HTTPS',
            outboundOpen: '出站开放',
            outboundLimited: '出站受限',
            httpsOnly: '仅 HTTPS'
          },
          moderate: {
            apply: '切换到适中'
          },
          restricted: {
            enable: '启用受限',
            confirmTitle: '启用受限防火墙模式？',
            confirmDesc:
              '入站管理访问将仅限于来自 private IPv4、IPv4 link-local/loopback、IPv6 link-local 或 IPv6 loopback 源范围的 HTTPS 和 SSH。不允许公共源地址范围。出站 DNS、NTP、远程 syslog、在线更新、DHCP、已建立连接和必要的 IPv6 控制流量仍可用。WebRTC/ICE UDP 以及其他入站/出站流量将被阻止。'
          },
          paranoid: {
            enable: '启用偏执',
            confirmTitle: '启用偏执防火墙模式？',
            confirmDesc:
              '仅保留来自 private IPv4、IPv4 link-local/loopback、IPv6 link-local 或 IPv6 loopback 源范围的 HTTPS 访问。SSH、HTTP、mDNS、NTP、GitHub 下载和其他流量将被阻止，仅保留最小 DHCP/IPv6 控制流量。'
          },
          baseline: {
            apply: '切换到基线',
            confirmTitle: '切换到开放的基线模式？',
            confirmDesc:
              '防火墙服务保持启用，但会取消仅限本地来源范围的限制。如果网络会路由，公共来源范围可能访问暴露的 NanoKVM 服务。'
          },
          rules: {
            title: '当前规则',
            empty: '无规则'
          }
        },
        saveChanges: '保存更改',
        unsaved: '未保存的更改'
      },
      systemLog: {
        saveFailed: '保存日志设置失败',
        saved: '日志设置已保存',
        invalidHost: '请输入 syslog 服务器主机',
        logLoadFailed: '加载日志失败',
        save: '保存',
        test: '发送测试日志',
        testSent: '测试日志已发送',
        testFailed: '发送测试日志失败',
        remote: {
          title: '远程日志记录',
          forward: '转发系统日志',
          description: '将系统消息转发到远程服务器',
          host: '服务器',
          hostDesc: 'Syslog 服务器的主机名或 IPv4 地址',
          port: '端口',
          protocol: 'Syslog 服务器的 UDP 端口'
        },
        local: {
          title: '系统日志缓冲区',
          description: '当前日志保存在 RAM 的 {{path}}，以避免写入 SD 卡',
          priority: '最低优先级',
          priorityDesc: '消息被记录所需的最低紧急程度',
          buffer: '缓冲区大小',
          bufferDesc: '日志文件达到此大小时进行轮转',
          rotations: '轮转',
          rotationsDesc: '保留的已轮转日志文件数量',
          compact: '紧凑输出',
          compactDesc: '在每行中省略主机名和 facility',
          stripTimestamps: '去除时间戳',
          stripTimestampsDesc: '移除发送方添加的时间戳；syslog 会添加自己的时间戳'
        },
        kernel: {
          title: '内核日志记录',
          enabled: '转发内核日志',
          enabledDesc: '将内核消息记录到系统日志',
          consoleLevel: '控制台级别',
          consoleLevelDesc: '内核消息输出到控制台所需的最低紧急程度'
        },
        viewer: {
          title: '系统日志',
          refresh: '刷新',
          empty: '没有日志条目',
          truncated: '仅显示最新的日志数据',
          linesUnit: '行'
        },
        level: {
          '1': '1 - 警报',
          '2': '2 - 严重',
          '3': '3 - 错误',
          '4': '4 - 警告',
          '5': '5 - 通知',
          '6': '6 - 信息',
          '7': '7 - 调试',
          '8': '8 - 全部'
        }
      },
      user: {
        title: '用户'
      },
      networking: {
        title: '网络'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: '加密隧道',
        device: '本设备',
        description: '通过 WireGuard 隧道访问此 KVM',
        unavailable: '此设备上未安装 WireGuard',
        blocked: '防火墙偏执模式会阻止 WireGuard',
        needsKey: '开启 WireGuard 之前请先设置私钥',
        saved: 'WireGuard 设置已保存',
        save: '保存更改',
        unsaved: '未保存的更改',
        invalid: '请检查标出的字段',
        invalidAddress: '请输入带掩码的地址，例如 10.0.0.1/24',
        invalidKey: '请输入 44 个字符的 WireGuard 密钥',
        invalidEndpoint: '请输入主机名或 IP 地址',
        invalidPort: '请输入 1 到 65535 之间的端口',
        invalidRanges: '请使用 10.0.0.0/24 这样的 IPv4 范围，不能使用 0.0.0.0/0',
        status: {
          connected: '已连接',
          waiting: '正在等待对端',
          stopped: '已停止',
          handshake: '上次握手 {{time}}'
        },
        privateKey: {
          title: '私钥',
          description: '仅保存在此设备上，不会再次显示',
          set: '已设置',
          notSet: '未设置',
          setBtn: '设置',
          generate: '生成',
          remove: '移除',
          modalTitle: '设置私钥',
          modalDescription: '密钥保存在此设备上，不会再次显示',
          placeholder: '粘贴私钥',
          generateConfirmTitle: '生成新的私钥？',
          generateConfirmDesc: '当前密钥将失效。之后请将新的公钥添加到对端。',
          removeConfirmTitle: '移除私钥？',
          removeConfirmDesc: 'WireGuard 将被关闭，并保持关闭，直到设置新的密钥。'
        },
        publicKey: {
          title: '公钥',
          description: '请将其添加到对端的配置中'
        },
        address: {
          title: '地址',
          description: 'KVM 在隧道中的地址及其掩码'
        },
        peer: {
          title: '对端',
          publicKey: '公钥',
          publicKeyDescription: '您所连接的对端的公钥',
          server: '服务器',
          serverDescription: '对端的主机名或 IP 地址',
          port: '端口',
          portDescription: '对端的 UDP 端口，通常为 51820',
          allowedIps: '允许的 IP',
          allowedIpsDescription: '对端在隧道中的地址或范围，例如 10.0.0.0/24',
          keepalive: '保活',
          keepaliveDescription: '保活数据包的发送间隔秒数，位于路由器之后时需要'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: '通过你的 Tailscale 网络访问此 KVM',
        service: '服务',
        performance: '性能',
        memory: {
          title: '内存优化',
          tip: '让 Tailscale 保持较低的内存占用，对 RAM 较小的设备有帮助。重启 Tailscale 后更改才会生效。'
        },
        swap: {
          title: '交换文件',
          tip: '如果启用内存优化后问题依然存在，可以尝试启用交换文件',
          sizeTip: '这会将文件大小设置为 128MB，可以在「设置 > 系统 > 性能」中修改'
        },
        restartTitle: '重启 Tailscale',
        restartDesc: '重启服务',
        restartBtn: '重启',
        restart: '确定要重启 Tailscale 吗？',
        stopTitle: '停止 Tailscale',
        stopBtn: '停止',
        stop: '确定要停止 Tailscale 吗？',
        stopDesc: '停止服务，并阻止其在开机时自动启动',
        loading: '加载中...',
        notInstall: '未检测到 Tailscale，请先安装',
        install: '安装',
        installing: '安装中',
        failed: '安装失败',
        retry: '请刷新后重试，或尝试手动安装。',
        download: '下载',
        package: '安装包',
        unzip: '并解压',
        upTailscale: '将 tailscale 上传到 NanoKVM 的 /usr/bin/ 目录',
        upTailscaled: '将 tailscaled 上传到 NanoKVM 的 /usr/sbin/ 目录',
        refresh: '刷新页面',
        notRunning: 'Tailscale 尚未运行。请先执行启动操作。',
        run: '启动',
        notLogin: '该设备尚未绑定，请点击登录并将这台设备绑定到您的账号。',
        urlPeriod: '该链接10分钟内有效',
        login: '登录',
        loginSuccess: '登录完成',
        deviceName: '设备名称',
        deviceIP: '设备地址',
        account: '账号',
        logout: '退出',
        logoutDesc: '确定要退出吗？',
        uninstall: '卸载 Tailscale',
        uninstallDesc: '确定要卸载 Tailscale 吗？',
        okBtn: '确认',
        cancelBtn: '取消'
      },
      update: {
        title: '更新',
        currentVersion: '当前版本',
        latestVersion: '最新版本',
        queryFailed: '获取版本号失败',
        updateFailed: '更新失败',
        paranoidBlocked: '在线更新被偏执防火墙模式阻止',
        paranoidBlockedDesc: 'GitHub 检查和下载需要出站网络访问。离线上传和已暂存的安装仍可使用。',
        available: '有新的可用版本，确定要更新吗？',
        updating: '更新中',
        confirm: '确定',
        cancel: '取消',
        badge: {
          checking: '检查中',
          latest: '已是最新',
          available: '有可用更新',
          failed: '检查失败',
          local: '本地'
        },
        application: {
          title: '应用'
        },
        system: {
          queryFailed: '获取系统版本失败',
          appUpdateRequired: '请先将应用更新到 {{version}}，再安装此系统更新',
          requiredAppVersion: '所需应用版本',
          downloadFailed: '下载或验证失败',
          available: '有可用的基础系统更新。',
          downloading: '正在下载并验证系统更新...',
          downloadVerify: '下载并验证',
          installing: '正在安装已暂存的系统更新...',
          install: '安装',
          installFailed: '安装失败',
          installConfirmTitle: '安装系统更新？',
          installConfirmDesc: '这将用已验证包中的文件替换基础系统文件。需要重启。',
          rawInstallConfirmDesc:
            '此已验证包会将 raw boot/rootfs 镜像写入 SD 卡分区并自动重启。写入可能需要数分钟；请保持供电。',
          rawInstallWarning: 'Raw 分区更新没有自动 rollback。如果启动失败，请手动恢复 SD 卡。',
          rawWaitTitle: '正在安装系统更新',
          rawWaitWriting: '正在将新系统写入 SD 卡',
          rawWaitRestarting: '设备正在重启。设备恢复后，此页面将自动重新加载。',
          rawWaitDesc: '这大约需要三分钟。请保持电源连接，并且不要关闭此页面。',
          rawWaitSlow: '耗时比预期更长。请再等待几分钟，然后再断电。',
          rebootRequired: '需要重启以激活此系统状态。',
          rollingBack: '正在 rollback 系统更新...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback 已准备',
          rollbackFailed: 'Rollback 失败',
          rollbackConfirmTitle: 'Rollback 系统更新？',
          rollbackConfirmDesc: '这将从最新系统更新备份恢复文件。需要重启。',
          stagedDesc: '系统更新已下载并验证，现在可以安装',
          refresh: '刷新',
          releaseNotes: '发行说明',
          systemVersion: '系统版本',
          kernel: 'Kernel',
          stagedVersion: '已暂存版本',
          archive: '归档',
          requiredFree: '所需可用空间',
          fileCount: '文件',
          rawImages: 'Raw 镜像',
          progress: '进度',
          progressMessage: '进度消息',
          pendingVersion: '待处理版本',
          bootHealth: '启动状态',
          healthy: '正常',
          unhealthy: '需要注意',
          rollbackBackup: 'Rollback 备份'
        },
        offline: {
          title: '上传应用包',
          desc: '从此计算机安装应用包。之后服务器将重新启动。',
          installTitle: '安装应用更新？',
          installDesc: '应用将被替换，服务器将重新启动。需要重新登录。'
        },
        local: {
          title: '上传系统包',
          desc: '从此计算机安装系统包。一个文件包含归档文件及其已签名的元数据。',
          choose: '选择文件',
          invalidFile: '请选择以 .tar 或 .tar.gz 结尾的包。',
          diskTitle: '是否关闭虚拟磁盘功能？',
          diskWarn:
            '包会保存到 /data 目录，而虚拟磁盘开启时该目录为只读。关闭虚拟磁盘后，电脑将无法再访问 /data 目录。是否继续？',
          uploading: '正在上传',
          verifying: '正在验证并准备系统包',
          keyTitle: '本地更新密钥',
          keyDesc: '可为您自行构建的包签名的 PEM 格式公钥',
          keyNone: '未设置密钥',
          keySet: '设置密钥',
          keyRemove: '移除',
          signer: '签名者',
          section: '本地更新',
          keyRequired: '需要本地密钥'
        }
      },
      account: {
        title: '帐号',
        webAccount: '网页帐号',
        password: '密码',
        passwordDesc: '更改登录网页界面所用的密码',
        updateBtn: '修改',
        logoutBtn: '退出',
        logoutDesc: '确定要退出吗？',
        okBtn: '确定',
        cancelBtn: '取消',
        session: {
          title: '会话'
        },
        logoutOnClose: {
          title: '关闭浏览器时退出登录',
          description: '关闭浏览器时结束会话，而不是保持登录状态'
        },
        totp: {
          title: '两步验证',
          authenticator: '验证器应用',
          description: '除密码外，还需要验证器应用生成的基于时间的验证码',
          required: '策略要求',
          disable: '停用',
          enableTitle: '设置两步验证',
          enableDescription: '请确认密码以继续。每次更改第二重验证都需要密码。',
          continue: '继续',
          disableTitle: '停用两步验证？',
          disableDescription: '您的账号将仅由密码保护。请用密码确认以继续。',
          disableFailed: '无法停用两步验证',
          passwordPlaceholder: '当前密码',
          enrollFailed: '无法开始设置',
          invalidCode: '验证码不匹配，请尝试下一个。',
          scan: '请用验证器应用扫描此二维码。',
          manualEntry: '或手动输入此密钥：',
          codePlaceholder: '输入 6 位验证码以确认',
          confirm: '确认',
          cancel: '取消',
          backupTitle: '请立即保存您的备份码',
          backupDescription:
            '每个备份码只能使用一次，并且不会再次显示。如果您丢失了验证器应用，这是重新登录的唯一方式；即使设备时钟未同步，它们也能使用。',
          copy: '复制',
          copied: '已复制备份码',
          savedThem: '我已保存',
          remaining: '剩余 {{remaining}} 个备份码',
          clockUnsynced: '设备时钟尚未同步。设置前请先在 设置 > 系统 > 时间 中同步时间。',
          noBackupCodes: '已没有备份码。请选择“生成”以重新生成一组。',
          regenerate: '新备份码',
          generate: '生成',
          regenerateTitle: '生成新备份码？',
          regenerateDescription: '当前的备份码将失效。请用密码确认以继续。',
          regenerateFailed: '无法生成新备份码',
          download: '下载',
          copyFailed: '无法复制。请选中备份码后手动复制。',
          requireTitle: '强制两步验证',
          requireDescription: '禁止停用两步验证，未设置的账号必须先设置才能使用设备',
          requireFailed: '无法更改该要求',
          requiredTitle: '需要两步验证',
          requiredDescription: '此设备要求第二重验证，但您的账号尚未设置。请立即设置以继续。'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw 助手',
      empty: '描述一个任务即可开始',
      inputPlaceholder: '描述您希望 PicoClaw 执行的操作',
      newConversation: '新对话',
      processing: '正在处理中...',
      agent: {
        defaultTitle: '通用助手',
        defaultDescription: '适合普通问答、搜索和工作区辅助',
        kvmTitle: '远程控制',
        kvmDescription: '通过 NanoKVM 操作下游远程主机',
        switched: '角色已切换',
        switchFailed: '切换角色失败'
      },
      send: '发送',
      cancel: '取消',
      status: {
        connecting: '正在连接 Gateway...',
        connected: 'PicoClaw 会话已连接',
        disconnected: 'PicoClaw 会话已关闭',
        stopped: '已发送停止请求',
        runtimeStarted: 'PicoClaw 运行时已启动',
        runtimeStartFailed: '启动 PicoClaw 运行时失败',
        runtimeStopped: 'PicoClaw 运行时已停止',
        runtimeStopFailed: '停止 PicoClaw 运行时失败'
      },
      connection: {
        runtime: {
          checking: '检查中',
          ready: '运行时已就绪',
          stopped: '运行时未启动',
          unavailable: '运行时不可用',
          configError: '配置错误'
        },
        transport: {
          connecting: '连接中',
          connected: '已连接'
        },
        run: {
          idle: '空闲',
          busy: '执行中'
        }
      },
      error: {
        lockHeld: 'PicoClaw 正在另一个窗口中使用',
        takenOver: '另一个窗口已接管 PicoClaw',
        authFailed: 'PicoClaw 拒绝了连接',
        upstreamClosed: '与 PicoClaw 的连接已断开'
      },
      tool: {
        screenshot: '正在截取屏幕',
        loadImage: '正在查看屏幕截图',
        actions: '正在控制主机',
        generic: '正在使用 {{name}}',
        type: '正在输入 {{text}}',
        hotkey: '正在按 {{keys}}',
        click: '正在点击',
        doubleClick: '正在双击',
        move: '正在移动鼠标',
        drag: '正在拖动',
        scroll: '正在滚动',
        wait: '正在等待'
      },
      message: {
        toolAction: '动作',
        observation: '观察',
        screenshot: '截图'
      },
      overlay: {
        locked: 'PicoClaw 正在控制设备，手动输入已暂停。'
      },
      install: {
        install: '安装 PicoClaw',
        installing: '正在安装 PicoClaw',
        success: 'PicoClaw 安装成功',
        failed: 'PicoClaw 安装失败',
        uninstalled: 'PicoClaw 卸载成功',
        uninstallFailed: '卸载失败',
        requiredTitle: '未安装 PicoClaw',
        requiredDescription: '在启动 PicoClaw 运行时之前，需要先下载安装 PicoClaw。',
        progressDescription: '正在下载并安装 PicoClaw。',
        stages: {
          preparing: '准备中',
          downloading: '下载中',
          extracting: '解压中',
          verifying: '验证中',
          installing: '安装中',
          installed: '已安装',
          install_timeout: '已超时',
          install_failed: '失败'
        }
      },
      model: {
        requiredTitle: '需要配置模型',
        requiredDescription: '在使用 PicoClaw 聊天之前，请先配置 PicoClaw 模型。',
        docsTitle: '配置指南',
        docsDesc: '支持的模型与协议',
        menuLabel: '配置模型',
        modelIdentifier: '模型标识',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API 基础 URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API Key',
        apiKeyPlaceholder: '请输入模型 API Key',
        apiKeyKeepPlaceholder: '留空则保留当前密钥',
        save: '保存模型配置',
        saving: '正在保存模型配置',
        saved: '模型配置已保存',
        saveFailed: '保存模型配置失败',
        invalid: '模型标识、API 基础 URL 和 API Key 不能为空'
      },
      uninstall: {
        confirmTitle: '卸载 PicoClaw',
        confirmContent: '确定要卸载 PicoClaw 吗？这会删除可执行文件和所有配置文件。',
        confirmOk: '卸载'
      },
      history: {
        title: '历史会话',
        loading: '正在加载历史会话...',
        emptyTitle: '还没有历史会话',
        emptyDescription: '之前的 PicoClaw 会话会显示在这里。',
        loadFailed: '加载会话历史失败',
        deleteFailed: '删除会话失败',
        deleteConfirmTitle: '删除会话',
        deleteConfirmContent: '确定要删除“{{title}}”吗？',
        deleteConfirmOk: '删除',
        messageCount_other: '{{count}} 条消息'
      },
      config: {
        startRuntime: '启动 PicoClaw',
        stopRuntime: '停止 PicoClaw',
        stopConfirm: '确定要停止 PicoClaw 吗？'
      },
      start: {
        title: '启动 PicoClaw',
        description: '启动运行时后即可开始使用 PicoClaw 助手。'
      }
    },
    error: {
      title: '我们遇到了问题',
      refresh: '刷新'
    },
    fullscreen: {
      toggle: '切换全屏'
    },
    menu: {
      collapse: '收起'
    }
  }
};

export default zh;
