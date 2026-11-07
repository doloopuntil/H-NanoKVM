const en = {
  translation: {
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      discard: 'Discard',
      delete: 'Delete',
      actionFailed: 'Operation failed',
      loading: 'Loading settings from the device...',
      loadFailed: "Couldn't load settings from the device",
      retry: 'Retry'
    },
    head: {
      desktop: 'Remote desktop',
      login: 'Login',
      firstSetup: 'First setup',
      changePassword: 'Change password',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Login',
      placeholderUsername: 'Username',
      placeholderPassword: 'Password',
      placeholderPassword2: 'Please enter password again',
      noEmptyUsername: 'Username required',
      noEmptyPassword: 'Password required',
      invalidUser: 'Invalid username or password',
      locked: 'Too many logins, please try again later',
      globalLocked: 'System under protection, please try again later',
      error: 'Unexpected error',
      changePassword: 'Change password',
      changePasswordDesc: 'For the security of your device, please change the password',
      differentPassword: 'Passwords do not match',
      illegalUsername: 'Username contains illegal characters',
      illegalPassword:
        'Password must be at least 8 characters and cannot contain quotes or slashes',
      forgetPassword: 'Forgot password',
      ok: 'Ok',
      cancel: 'Cancel',
      loginButtonText: 'Login',
      setupTitle: 'Create administrator account',
      setupDescription:
        'No web account exists on this device yet. Create the first administrator account to continue.',
      setupRecovery: 'If this password is lost, recovery requires reflashing the SD card',
      setupButtonText: 'Create account',
      tips: {
        hardenedRecovery:
          'This Hardened image does not support password reset from the BOOT button. If the password is lost, reflash the SD card and create a new account.',
        change1: 'Please note that this action will change the following passwords:',
        change2: 'Web login password',
        change3: 'System root password for SSH login'
      },
      placeholderCurrentPassword: 'Current password',
      placeholderNewPassword: 'New password',
      wrongCurrentPassword: 'Current password is incorrect',
      totp: {
        title: 'Two-factor authentication',
        prompt: 'Enter the 6-digit code from your authenticator app',
        backupPrompt: 'Enter one of your backup codes',
        noEmptyCode: 'Enter a code',
        placeholderCode: '6-digit code',
        placeholderBackup: 'Backup code',
        verifyButtonText: 'Verify',
        useBackupCode: 'Use a backup code',
        useAuthenticator: 'Use authenticator code',
        cancel: 'Back',
        invalidCode: 'That code is not valid. Try again.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Configure Wi-Fi for NanoKVM',
      success: 'Please go to the device to check the network status of NanoKVM',
      failed: 'Operation failed, please try again',
      invalidMode:
        'The current mode does not support network setup. Please go to your device and enable Wi-Fi configuration mode.',
      confirmBtn: 'Ok',
      finishBtn: 'Finished',
      ap: {
        authTitle: 'Authentication required',
        authDescription: 'Please enter the AP password to continue',
        authFailed: 'Invalid AP password',
        passPlaceholder: 'AP password',
        verifyBtn: 'Verify'
      }
    },
    screen: {
      scale: 'Scale',
      size: 'Size',
      sizeFill: 'Fill window',
      sizeNative: 'Native size',
      title: 'Screen',
      video: 'Video mode',
      videoDirectTips: 'Enable HTTPS in "Settings > Network > Services" to use this mode',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC is disabled in the Restricted and Paranoid firewall modes',
      transferRunningTitle: 'Image transfer in progress',
      transferRunningDesc:
        'Changing the video mode reloads the page, which cancels the running image upload or download.',
      transferRunningOk: 'Change mode',
      resolution: 'Resolution',
      auto: 'Automatic',
      autoTips:
        "Screen tearing or mouse offset may occur at specific resolutions, so adjust the remote host's resolution or turn off automatic mode",
      fps: 'FPS',
      customizeFps: 'Customize',
      quality: 'Quality',
      qualityLossless: 'Lossless',
      qualityHigh: 'High',
      qualityMedium: 'Medium',
      qualityLow: 'Low',
      frameDetect: 'Frame detect',
      frameDetectTip:
        "Compares frames and stops sending video while the remote host's screen does not change",
      resetHdmi: 'Reset HDMI',
      webrtcConnectionFailed: {
        title: 'WebRTC connection failed',
        description: 'Check the network connection or switch the video mode'
      },
      captureStatus: {
        hdmiError: 'HDMI screen error',
        unsupportedResolution: 'Current resolution is not supported',
        retrieving: 'Getting screen...',
        changingResolution: 'Switching resolution...',
        updateFailed: 'Screen cannot update right now',
        videoError: 'Video display error',
        noHdmi: 'No HDMI signal detected',
        unavailable: 'Screen cannot be displayed right now'
      }
    },
    keyboard: {
      title: 'Keyboard',
      paste: 'Paste',
      tips: 'Only standard keyboard letters and symbols are supported',
      placeholder: 'Text to paste',
      local: 'Mobile keyboard',
      virtual: 'On-screen keyboard',
      readClipboard: 'Read from clipboard',
      clipboardPermissionDenied:
        'Clipboard permission denied, allow clipboard access in your browser',
      clipboardReadError: 'Failed to read clipboard',
      dropdownEnglish: 'English',
      dropdownGerman: 'German',
      dropdownFrench: 'French',
      dropdownRussian: 'Russian',
      dropdownKorean: 'Korean',
      dropdownJapanese: 'Japanese',
      localInput: 'Mobile keyboard input',
      shortcut: {
        title: 'Shortcuts',
        custom: 'Custom',
        capture: 'Click here to capture shortcut',
        clear: 'Clear',
        save: 'Save',
        captureTips:
          'Capturing system-level keys, such as the Windows key, requires full-screen permission',
        enterFullScreen: 'Toggle full-screen mode'
      },
      leaderKey: {
        title: 'Leader key',
        desc: 'Bypass browser restrictions and send system shortcuts directly to the remote host',
        howToUse: 'How to use',
        simultaneous: {
          title: 'Simultaneous mode',
          desc1: 'Press and hold the leader key, then press the shortcut.',
          desc2: 'Intuitive, but may conflict with system shortcuts.'
        },
        sequential: {
          title: 'Sequential mode',
          desc1:
            'Press the leader key → press the shortcut in sequence → press the leader key again.',
          desc2: 'Requires more steps, but completely avoids system conflicts.'
        },
        enable: 'Enable leader key',
        tip: 'When assigned as a leader key, this key functions exclusively as a shortcut trigger and loses its default behavior.',
        placeholder: 'Press the leader key',
        shiftRight: 'Right Shift',
        ctrlRight: 'Right Ctrl',
        metaRight: 'Right Win',
        recorder: {
          rec: 'REC',
          activate: 'Activate keys',
          input: 'Press the shortcut'
        }
      }
    },
    mouse: {
      title: 'Mouse',
      cursor: 'Cursor style',
      default: 'Default cursor',
      cell: 'Cell cursor',
      text: 'Text cursor',
      grab: 'Grab cursor',
      hide: 'Hide cursor',
      mode: 'Mouse mode',
      absolute: 'Absolute mode',
      relative: 'Relative mode',
      direction: 'Wheel direction',
      scrollUp: 'Scroll up',
      scrollDown: 'Scroll down',
      speed: 'Wheel speed',
      sensitivity: 'Pointer speed',
      sensitivityDesc:
        "For desktop relative mode: lower values reduce drift from the host's mouse acceleration",
      fast: 'Fast',
      slow: 'Slow',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Move anywhere on the KVM area; the remote cursor keeps its position between touches and stays synchronized with absolute HID'
      },
      requestPointer: 'Using relative mode, click the desktop to get the mouse pointer',
      resetHid: 'Reset HID',
      hidOnly: {
        title: 'HID-Only mode',
        desc: "If your mouse or keyboard stop responding and resetting HID doesn't help, it could be a compatibility issue between the NanoKVM and the host.",
        tip1: 'Enabling HID-Only mode will unmount the virtual disk and virtual network',
        tip2: 'In HID-Only mode, image mounting is disabled',
        tip3: 'NanoKVM will automatically reboot after switching modes',
        enable: 'Enable HID-Only mode',
        disable: 'Disable HID-Only mode'
      }
    },
    image: {
      title: 'Images',
      loading: 'Loading...',
      empty: 'Nothing found',
      mountMode: 'Mount as',
      mount: 'Mount',
      orDownload: 'Or download from a link',
      keepRunning:
        'You can close this window. The transfer keeps running and its progress shows in the image list.',
      massStorage: 'Mass storage',
      cdRom: 'CD-ROM',
      mountFailed: 'Mount failed',
      mountDesc:
        'On some systems, you need to eject the virtual disk from the remote host before mounting the image',
      diskOnWarn:
        'Mounting the image turns the virtual disk off, so the computer can no longer access /data. Continue?',
      diskOffWarn:
        'The virtual disk is off and has to be enabled to mount the image. The USB devices on the computer are enumerated again. Continue?',
      unmountFailed: 'Unmount failed',
      unmountDesc:
        'On some systems, you need to manually eject from the remote host before unmounting the image',
      forceEject: 'Force eject',
      forceEjectConfirm:
        'The host has locked the optical drive. Forcing an eject disconnects the virtual USB device for a moment, so the keyboard and mouse may briefly disconnect. Continue?',
      usbReconnect: 'USB reconnect',
      usbReconnectConfirm:
        'Reconnect the USB gadget only if the remote host did not notice the media change. Keyboard and mouse may briefly disconnect.',
      usbReconnectSuccess: 'USB reconnected',
      usbReconnectFailed: 'USB reconnect failed',
      addImage: 'Add image',
      fromUrl: 'From URL',
      fromFile: 'From file',
      turnOff: 'Turn off',
      deleteDiskShared: "Images can't be deleted while the virtual disk is on.",
      eject: 'Eject',
      download: 'Download',
      upload: 'Upload',
      mountTitle: 'Mount image',
      deleteTitle: 'Delete image',
      deleteConfirm: 'Are you sure you want to delete this image?',
      tips: {
        title: 'How to upload',
        usb1: 'Connect the NanoKVM to your computer via USB.',
        usb2: 'Ensure that the virtual disk is mounted in Settings > Device > Virtual disk.',
        usb3: 'Open the virtual disk on your computer and copy the image file to the root directory of the virtual disk.',
        scp1: 'Make sure the NanoKVM and your computer are on the same local network.',
        scp2: 'Open a terminal on your computer and use the SCP command to upload the image file to the /data directory on the NanoKVM.',
        scp3: 'Example: scp your-image-path root@your-nanokvm-ip:/data',
        tfCard: 'SD card',
        tf1: 'This method is supported on Linux system',
        tf2: 'Get the SD card from the NanoKVM. On the FULL version, disassemble the case first.',
        tf3: 'Insert the SD card into a card reader and connect it to your computer.',
        tf4: 'Copy the image file to the /data directory on the SD card.',
        tf5: 'Insert the SD card into the NanoKVM.'
      }
    },
    script: {
      title: 'Scripts',
      upload: 'Upload',
      run: 'Run',
      runBackground: 'Run in background',
      runFailed: 'Run failed',
      delDesc: 'Are you sure you want to delete this file?',
      delete: 'Delete',
      close: 'Close',
      unlockDesc:
        'Scripts run as root on NanoKVM. Enter your web account password to replace or run one.',
      unreviewedTitle: 'Unreviewed script',
      unreviewedDesc:
        'This script is new or was replaced since you last ran it. Anyone with your session could have uploaded it, so look at it in the terminal before you run it as root.',
      terminalRequired: 'Scripts need web terminal access. Enable the terminal in settings first.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'NanoKVM terminal',
      serial: 'Serial port terminal',
      unlockTitle: 'Unlock terminal',
      unlockDesc: 'Enter your web account password to start a terminal session',
      unlock: 'Unlock',
      unlockFailed: 'Failed to unlock terminal',
      invalidCredentials: 'Invalid username or password',
      locked: 'Too many attempts, try again later',
      sessionClosed: 'Terminal session closed. Unlock again to reconnect.',
      sessionError: 'Terminal connection failed. Unlock again to retry.',
      serialPort: 'Serial port',
      serialPortPlaceholder: 'For example /dev/ttyS1',
      baudrate: 'Baud rate',
      parity: 'Parity',
      parityNone: 'None',
      parityEven: 'Even',
      parityOdd: 'Odd',
      flowControl: 'Flow control',
      flowControlNone: 'None',
      flowControlSoft: 'Soft',
      flowControlHard: 'Hard',
      dataBits: 'Data bits',
      stopBits: 'Stop bits',
      open: 'Open terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Sending command...',
      sent: 'Command sent',
      input: 'MAC address',
      ok: 'OK'
    },
    download: {
      input: 'Remote image URL',
      ok: 'OK',
      disabled:
        "Images can't be downloaded or uploaded right now because the storage isn't writable. If an image is mounted, unmount it, then turn off the virtual disk to make the storage writable again.",
      diskShared: 'Turn off the virtual disk to use the image downloader',
      mountedImage: 'This image is mounted, unmount it before uploading a file with the same name',
      diskOff: 'Turn off the virtual disk',
      uploadbox: 'Drop file here or click to select',
      inputfile: 'Image file',
      NoISO: 'No image',
      complete: 'Download complete',
      uploadComplete: 'Upload complete',
      downloading: 'Downloading',
      uploading: 'Uploading',
      failed: 'Transfer failed',
      uploadFailed: 'Upload failed',
      stalled: 'Transfer stalled, check the connection and retry',
      canceled: 'Upload canceled',
      downloadCanceled: 'Download canceled',
      cancel: 'Cancel',
      remoteDisabled: 'Remote ISO download is disabled in Settings > User > Preferences',
      remoteFailed: 'Remote ISO download failed',
      sha256: 'Optional SHA-256 checksum',
      sha256Placeholder: 'Enter a 64-character SHA-256 checksum',
      invalidSHA256: 'SHA-256 must be a 64-character hexadecimal string',
      checksumFailed: 'Download failed: SHA-256 verification failed'
    },
    power: {
      title: 'Power',
      showConfirm: 'Confirmation',
      showConfirmTip: 'Power operations require an extra confirmation',
      reset: 'Reset',
      powerShort: 'Power button: short click',
      powerLong: 'Power button: long click',
      resetConfirm: 'Execute reset operation?',
      powerConfirm: 'Execute power operation?',
      okBtn: 'Yes',
      cancelBtn: 'No'
    },
    settings: {
      title: 'Settings',
      about: {
        title: 'About',
        information: 'Information',
        ip: 'IP address',
        mdns: 'Local address',
        application: 'Application version',
        uptime: 'Uptime',
        community: 'Community',
        credit: 'Built on <a1>NanoKVM</a1> by Sipeed and <a2>Hardened NanoKVM</a2> by woffko',
        hostname: 'Device name',
        changeIn: 'Change it in {{path}}',
        updateIn: 'Update it in {{path}}',
        toggleIn: 'Turn it on or off in {{path}}'
      },
      appearance: {
        title: 'Preferences',
        display: 'Display',
        language: 'Language',
        languageDesc: 'Select the language for the interface',
        webTitle: 'Web title',
        webTitleDesc: 'Customize the web page title',
        layoutMode: 'Interface layout',
        layoutModeDesc: 'Use the phone/touch layout in this browser',
        layoutAuto: 'Auto',
        layoutMobile: 'Phone',
        menuBar: {
          title: 'Menu bar',
          mode: 'Display mode',
          modeDesc: 'Display menu bar on the screen',
          modeOff: 'Off',
          modeAuto: 'Auto hide',
          modeAlways: 'Always visible',
          keyboardLedStatus: 'Keyboard lock indicators',
          keyboardLedStatusDesc: 'Display remote Num Lock, Caps Lock, and Scroll Lock status',
          icons: 'Submenu icons',
          iconsDesc: 'Display submenu icons in the menu bar',
          terminalWarningTitle: 'Enable web terminal?',
          terminalWarningDesc:
            'The terminal opens a root shell through the browser. Enable it only on a trusted network and turn it off when you are done.',
          terminalWarningConfirm: 'Enable',
          remoteDownload: 'Remote ISO download',
          remoteDownloadWarningTitle: 'Enable remote ISO download?',
          remoteDownloadWarningDesc:
            'NanoKVM will fetch an ISO from a URL and write it to /data. Enable it only for trusted URLs and turn it off when you are done.',
          remoteDownloadWarningConfirm: 'Enable'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Remote keyboard lock status',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'On',
        off: 'Off',
        unknown: 'Unknown'
      },
      device: {
        title: 'Device',
        minutes: 'min',
        sections: {
          general: 'General',
          connectivity: 'Connectivity',
          hostConnection: 'Host connection',
          inputOutput: 'Input and output'
        },
        oled: {
          title: 'OLED timeout',
          description: 'Turn off OLED screen after',
          keepOn: 'Keep OLED on',
          keepOnDescription: 'Never turn off the OLED screen'
        },
        ssh: {
          description: 'Enable SSH remote access',
          tip: 'Set a strong password in Account > Password before enabling this option'
        },
        swap: {
          title: 'Swap',
          description: 'Use a swap file when memory runs low',
          size: 'Swap size',
          sizeDescription: 'Set the swap file size',
          tip: 'Enabling this feature could shorten the usable life of your SD card'
        },
        mouseJiggler: {
          title: 'Mouse jiggler',
          description: 'Prevent the remote host from sleeping',
          disable: 'Disable',
          absolute: 'Absolute mode',
          relative: 'Relative mode'
        },
        sessionLock: {
          title: 'Lock session when inactive',
          description: 'Require login again after this long without activity'
        },
        mdns: {
          description: 'Enable mDNS discovery service',
          tip: 'Lets you reach this device by its .local name. Not needed if you connect by IP address or your DNS already resolves its hostname.'
        },
        hdmi: {
          description: 'Enable HDMI/monitor output',
          idleTimeoutTitle: 'Capture idle timeout',
          idleTimeoutDescription: 'Stop HDMI capture after there are no active viewers for'
        },
        hidOnly: 'HID-Only mode',
        hidOnlyDesc: 'Improve compatibility with the host if mouse or keyboard stop responding',
        hidOnlyTip:
          'HID-Only mode stops emulating virtual devices, retaining only basic HID control',
        disk: 'Virtual disk',
        diskDesc: 'Mount SD card on the remote host',
        diskLocked: 'Off while an image is mounted, and turning it on cancels the mount',
        diskEnable: 'Enable virtual disk',
        networkChange: 'Change virtual network',
        diskCancelMount: 'Enabling the virtual disk cancels the mounted image. Continue?',
        networkCancelMount:
          'Changing the virtual network restarts the USB connection. This cancels the mounted image and turns the virtual disk on. Continue?',
        diskTransferRunning:
          'An image transfer is running. Wait for it to finish before enabling the virtual disk.',
        network: 'Virtual network',
        networkDesc: 'Mount virtual network card on the remote host',
        usbWakeup: 'USB wakeup',
        usbWakeupDesc: 'Allow keyboard or mouse events to wake the remote host',
        usbWakeupTip: 'Turn off if the host logs repeated USB wakeup messages',
        hostname: {
          description: 'Name of this device on the network',
          reachable: 'Reachable on the local network as {{address}}'
        },
        rebootRequired: 'Reboot required',
        rebootPending: 'Reboot required for: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'System update'
        },
        reboot: 'Reboot',
        rebootDesc: 'Are you sure you want to reboot NanoKVM?',
        poweroff: 'Power off',
        poweroffDesc: 'Are you sure you want to power off NanoKVM?'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Connection',
        configuration: 'Configuration',
        wifi: {
          title: 'Wi-Fi',
          description: 'Configure Wi-Fi',
          apMode: 'AP mode is enabled, connect to Wi-Fi by scanning QR code',
          connect: 'Join Wi-Fi',
          connectDesc1: 'Please enter the network ssid and password',
          disconnect: 'Are you sure to disconnect the network?',
          disconnectBtn: 'Disconnect',
          connected: 'Connected',
          ssid: 'Name',
          password: 'Password',
          joinBtn: 'Join',
          cancelBtn: 'Cancel'
        },
        tls: {
          description: 'Enable HTTPS protocol',
          tip: 'Be aware: Using HTTPS can increase latency, especially with MJPEG video mode',
          restartTitle: 'The server will restart',
          restartDesc:
            'The protocol change restarts the server. The browser will switch to the new address after {{seconds}} seconds:',
          restartOk: 'Apply and restart',
          confirmTitle: 'Keep the new protocol?',
          confirmDesc:
            'The server now runs on {{protocol}}. It goes back to the previous protocol in {{seconds}} seconds unless you keep it.',
          confirmKeep: 'Keep',
          confirmRevert: 'Go back',
          reverting:
            'Going back to the previous protocol. The browser switches to that address after {{seconds}} seconds.',
          certTitle: 'Keep the new certificate?',
          certDesc:
            'The server now uses the new certificate. It goes back to the previous one in {{seconds}} seconds unless you keep it.',
          certReverted: 'The previous certificate is back'
        },
        trustedProxies: {
          section: 'Reverse proxy',
          title: 'Trusted proxies',
          description:
            'Reverse proxies that the device trusts to report the client address and protocol',
          tip: 'A listed address chooses the client address that the login limit and the log record, so list only proxies you control',
          none: 'None',
          edit: 'Edit',
          editRow: 'Edit list',
          editTitle: 'Edit trusted proxies',
          editDescription: 'Changing the list needs your password',
          dialogDescription:
            'Enter the address of each reverse proxy as this device sees it, or a range such as 10.0.0.0/24. A listed proxy tells the device which client address and protocol to use. Everything it forwards is believed, so list only proxies you control.'
        },
        certificate: {
          title: 'Certificate',
          desc: 'Where the HTTPS certificate comes from',
          requesting: 'Requesting the certificate',
          selfSigned: 'Self-signed',
          domain: 'Domain',
          domainDesc: 'Must point to this device, with port 443 reachable from the internet',
          domainTailscale: 'Set by Tailscale for this device',
          domainInvalid: 'Use a full domain name such as kvm.example.org',
          email: 'Email',
          emailDesc: "Optional, for notices from Let's Encrypt",
          emailInvalid: 'Use an address such as name@example.org',
          validUntil: 'Valid until',
          valid: 'Valid',
          expiresSoon: 'Expires soon',
          expired: 'Expired',
          lastRenewal: 'Last renewal',
          renewed: 'Renewed',
          failed: 'Failed',
          renewNow: 'Renew now',
          renewNowDesc: 'Request a new certificate without waiting',
          renewBtn: 'Renew',
          applyTitle: 'Change certificate',
          applyOk: 'Apply',
          applyAcme:
            "The device asks Let's Encrypt for a certificate. Let's Encrypt connects to port 443 from the internet to check it, which can take up to a minute. If the request fails, the current certificate stays in use.",
          applyTailscale:
            'The device gets a certificate from Tailscale, which can take up to a minute. If the request fails, the current certificate stays in use.',
          applySelfSigned:
            'The device goes back to its own self-signed certificate. Browsers warn about it.',
          openTitle: 'Open the new address',
          openDesc:
            'The certificate is ready. Open the address below and sign in to keep it. Without your confirmation within 3 minutes, the previous certificate comes back.',
          openOk: 'Open',
          blockedClock: 'Certificates cannot be requested until the device clock is synchronized',
          blockedParanoid: 'Paranoid firewall mode blocks certificate requests',
          tailscaleUnavailable:
            'Tailscale is not running, or HTTPS certificates are not enabled for the tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'Configure DNS servers for NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Configure IPv4 addressing for the wired interface',
          servers: 'Servers',
          dhcp: 'DHCP',
          manual: 'Manual',
          apply: 'Apply',
          invalid: 'Please enter a valid IPv4 or IPv6 address',
          invalidNetwork: 'Please enter a valid IPv4 address, subnet mask, and router',
          saved: 'DNS settings saved',
          redirecting: 'Network settings saved. Opening the new address...',
          saveFailed: 'Failed to save DNS settings',
          unsaved: 'Unsaved changes',
          maxServers: 'Maximum {{count}} DNS servers allowed',
          dhcpServersDescription: 'DNS servers are automatically obtained from DHCP',
          manualServersDescription: 'IPv4 and IPv6 servers are supported',
          interface: 'Interface',
          ipAddress: 'IP address',
          subnetMask: 'Subnet mask',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Configure IPv6 addressing for the wired interface',
          disabled: 'Disabled',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manual',
          interface: 'Interface',
          state: 'State',
          router: 'Router',
          addresses: 'Addresses',
          dhcpv6Client: 'DHCPv6 client',
          notInstalled: 'Not installed',
          ipAddress: 'IPv6 address',
          prefix: 'Prefix',
          invalidManual: 'Please enter a valid IPv6 address, prefix, and router',
          clientMissing:
            'DHCPv6 client is not installed. Install the matching raw system update first.',
          saved: 'IPv6 settings saved',
          saveFailed: 'Failed to save IPv6 settings',
          unsaved: 'Unsaved changes'
        }
      },
      system: {
        title: 'System',
        performance: {
          processor: 'Processor',
          overdrive: {
            title: 'Clock overdrive',
            description:
              'Boot with higher processor and video clock speeds specified by the manufacturer',
            tip: 'If the device does not start with overdrive, the SD card must be reflashed',
            unavailable: 'Not included in this system image',
            keepTitle: 'Keep overdrive after updates',
            keepDescription:
              'A system update returns the device to the standard clocks unless this is on',
            confirmTitle: 'Enable clock overdrive?',
            confirmText:
              'If the device does not start with overdrive, you must reflash the SD card to recover it. The change applies after the next reboot.',
            confirmOk: 'Enable'
          },
          watchdog: {
            title: 'Hardware watchdog',
            description: 'Restart the device automatically when it stops responding',
            unavailable: 'Not included in this system image',
            notRunning: 'Not running at the moment',
            lastRestart: 'Last restart',
            lastRestartCaption: 'Most recent reason why the system restarted',
            reasonPowerOn: 'Power on',
            reasonRestart: 'Restart requested',
            reasonWatchdog: 'Watchdog reset',
            reasonOverheat: 'Overheat protection',
            reasonUnknown: 'Unknown'
          },
          recovery: 'Recovery',
          memory: 'Memory'
        },
        monitor: {
          processorClock: 'CPU subsystem',
          videoClock: 'Video subsystem',
          videoClockCaption: 'Video clock frequency',
          cpuClockCaption: 'CPU clock frequency',
          overdrive: 'Overdrive',
          temperature: 'Temperature',
          lastMinutes: 'Last 5 minutes',
          ram: 'RAM',
          off: 'Off',
          ramHistory: 'RAM utilization',
          cpuLoad: 'CPU load',
          cpuLoadCaption: 'User {{user}} percent, system {{system}} percent',
          cpuUtilization: 'CPU utilization',
          swapUtilization: 'Swap utilization',
          swapSizeLastMinutes: '{{size}}, last 5 minutes',
          percent: '{{percent}} percent',
          percentUsed: '{{percent}} percent used',
          sizeOf: '{{used}} of {{total}}',
          systemPartition: 'System partition',
          dataPartition: 'Data partition',
          unavailable: 'Not available',
          noReadings: 'The device is not returning readings',
          refresh: 'Updates every second while this page is open'
        },
        sections: {
          time: 'Time',
          firewall: 'Firewall',
          systemLog: 'Logging',
          performance: 'Performance',
          monitor: 'Monitor',
          services: 'Services',
          webInterface: 'Secure web access'
        },
        time: {
          saveFailed: 'Failed to save time settings',
          saved: 'Time settings saved',
          syncFailed: 'Failed to synchronize time',
          synced: 'Time synchronized',
          invalidServers: 'Enter at least one NTP server',
          maxServers: 'Maximum {{count}} NTP servers allowed',
          refresh: 'Refresh',
          syncNow: 'Synchronize',
          syncNowDesc: 'Set the clock from the NTP servers now',
          save: 'Save',
          ntp: {
            title: 'NTP',
            description: 'Synchronize device time from configured NTP servers'
          },
          networkTime: 'Network time',
          clock: {
            title: 'Clock',
            description: 'Set the local timezone used by logs and the UI',
            current: 'Current time',
            timezone: 'Timezone'
          },
          servers: {
            title: 'NTP servers',
            description: 'Use default public servers, your local router, or custom NTP servers',
            useRouter: 'Use router',
            useDefaults: 'Use defaults',
            presets: 'Server presets',
            presetsDesc: 'Replace the server list with a preset'
          }
        },
        firewall: {
          saveFailed: 'Failed to apply firewall settings',
          saved: 'Firewall settings applied',
          cancel: 'Cancel',
          refresh: 'Refresh',
          backends: 'Backends',
          enableHttpsFirst: 'Enable HTTPS before enabling Restricted or Paranoid Firewall mode',
          httpsRequired:
            'Restricted and Paranoid modes are disabled until HTTPS is enabled in Settings > Network > Services',
          mode: {
            title: 'Firewall mode',
            baseline: 'Baseline',
            baselineDesc:
              'Open compatibility profile. The firewall runs, but inbound sources are not restricted. Use only in trusted networks.',
            moderate: 'Moderate',
            moderateDesc:
              'Default profile. Keeps baseline services, but accepts new inbound connections only from private, link-local, or loopback ranges. Outbound access stays open.',
            restricted: 'Restricted',
            restrictedDesc:
              'Local-only HTTPS and SSH, plus outbound DNS, NTP, syslog, and online updates. DHCP and essential IPv6 traffic stay available. WebRTC is blocked.',
            paranoid: 'Paranoid',
            paranoidDesc:
              'Local-only HTTPS. Blocks SSH, HTTP, online updates, and other outbound network features. Offline update upload and already staged installs remain available.',
            current: 'Current',
            default: 'Default',
            localOnly: 'Local-only',
            openTag: 'Inbound open',
            httpsRequiredTag: 'HTTPS required',
            outboundOpen: 'Outbound open',
            outboundLimited: 'Outbound limited',
            httpsOnly: 'HTTPS only'
          },
          moderate: {
            apply: 'Switch to Moderate'
          },
          restricted: {
            enable: 'Enable Restricted',
            confirmTitle: 'Enable Restricted Firewall mode?',
            confirmDesc:
              'Inbound admin access will be limited to private IPv4, IPv4 link-local/loopback, IPv6 link-local, or IPv6 loopback source ranges for HTTPS and SSH. Public source ranges are not allowed. Outbound DNS, NTP, remote syslog, online updates, DHCP, established connections, and essential IPv6 control traffic remain available. WebRTC/ICE UDP and other inbound/outbound traffic will be blocked.'
          },
          paranoid: {
            enable: 'Enable Paranoid',
            confirmTitle: 'Enable Paranoid Firewall mode?',
            confirmDesc:
              'Only HTTPS access from private IPv4, IPv4 link-local/loopback, IPv6 link-local, or IPv6 loopback source ranges will remain available. SSH, HTTP, mDNS, NTP, GitHub downloads, and other inbound/outbound traffic will be blocked except for minimal DHCP/IPv6 control traffic.'
          },
          baseline: {
            apply: 'Switch to Baseline',
            confirmTitle: 'Switch to open Baseline mode?',
            confirmDesc:
              'This keeps the firewall service active but removes the local-only source-range restriction. Public source ranges may reach exposed NanoKVM services if the network routes them.'
          },
          rules: {
            title: 'Current rules',
            empty: 'No rules'
          }
        },
        saveChanges: 'Save changes',
        unsaved: 'Unsaved changes'
      },
      systemLog: {
        saveFailed: 'Failed to save log settings',
        saved: 'Log settings saved',
        invalidHost: 'Enter a syslog server host',
        logLoadFailed: 'Failed to load logs',
        save: 'Save',
        test: 'Send test log',
        testSent: 'Test log sent',
        testFailed: 'Failed to send test log',
        remote: {
          title: 'Remote logging',
          forward: 'Forward system log',
          description: 'Forward system messages to a remote server',
          host: 'Server',
          hostDesc: 'Hostname or IPv4 address of the syslog server',
          port: 'Port',
          protocol: 'UDP port of the syslog server'
        },
        local: {
          title: 'System log buffer',
          description: 'Current logs are kept in RAM at {{path}} to avoid SD-card writes',
          priority: 'Minimum priority',
          priorityDesc: 'Minimum urgency for a message to be logged',
          buffer: 'Buffer size',
          bufferDesc: 'Log size at which the file is rotated',
          rotations: 'Rotations',
          rotationsDesc: 'Number of rotated log files to keep',
          compact: 'Compact output',
          compactDesc: 'Omit host name and facility from each line',
          stripTimestamps: 'Strip timestamps',
          stripTimestampsDesc: 'Remove timestamps added by the sender; syslog adds its own'
        },
        kernel: {
          title: 'Kernel logging',
          enabled: 'Forward kernel log',
          enabledDesc: 'Capture kernel messages in the system log',
          consoleLevel: 'Console level',
          consoleLevelDesc: 'Minimum urgency for a kernel message to be printed to the console'
        },
        viewer: {
          title: 'System log',
          refresh: 'Refresh',
          empty: 'No log entries',
          truncated: 'Only the latest log data is shown',
          linesUnit: 'lines'
        },
        level: {
          '1': '1 - Alert',
          '2': '2 - Critical',
          '3': '3 - Error',
          '4': '4 - Warning',
          '5': '5 - Notice',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - All'
        }
      },
      user: {
        title: 'User'
      },
      networking: {
        title: 'Network'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Encrypted tunnel',
        device: 'This device',
        description: 'Reach this KVM through a WireGuard tunnel',
        unavailable: 'WireGuard is not installed on this device',
        blocked: 'Paranoid firewall mode blocks WireGuard',
        needsKey: 'Set a private key before turning WireGuard on',
        saved: 'WireGuard settings saved',
        save: 'Save changes',
        unsaved: 'Unsaved changes',
        invalid: 'Check the highlighted fields',
        invalidAddress: 'Enter an address with its mask, like 10.0.0.1/24',
        invalidKey: 'Enter a 44-character WireGuard key',
        invalidEndpoint: 'Enter a host name or IP address',
        invalidPort: 'Enter a port from 1 to 65535',
        invalidRanges: 'Use IPv4 ranges like 10.0.0.0/24, not 0.0.0.0/0',
        status: {
          connected: 'Connected',
          waiting: 'Waiting for the peer',
          stopped: 'Stopped',
          handshake: 'Last handshake {{time}}'
        },
        privateKey: {
          title: 'Private key',
          description: 'Stays on this device and is never shown again',
          set: 'Set',
          notSet: 'Not set',
          setBtn: 'Set',
          generate: 'Generate',
          remove: 'Remove',
          modalTitle: 'Set the private key',
          modalDescription: 'The key is stored on this device and is never shown again',
          placeholder: 'Paste the private key',
          generateConfirmTitle: 'Generate a new private key?',
          generateConfirmDesc:
            'The current key stops working. Add the new public key to the peer afterwards.',
          removeConfirmTitle: 'Remove the private key?',
          removeConfirmDesc: 'WireGuard is turned off and stays off until a new key is set.'
        },
        publicKey: {
          title: 'Public key',
          description: "Add it to the peer's configuration"
        },
        address: {
          title: 'Address',
          description: 'KVM address in the tunnel and its mask'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Public key',
          publicKeyDescription: 'Public key of the peer you connect to',
          server: 'Server',
          serverDescription: 'Host name or IP address of the peer',
          port: 'Port',
          portDescription: 'UDP port of the peer, usually 51820',
          allowedIps: 'Allowed IPs',
          allowedIpsDescription: 'Peer address or range in the tunnel, such as 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Seconds between keepalive packets, needed behind a router'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Reach this KVM through your Tailscale network',
        service: 'Service',
        performance: 'Performance',
        memory: {
          title: 'Memory optimization',
          tip: "Keeps Tailscale's memory use low, which helps on a device with little RAM. Restart Tailscale for the change to take effect."
        },
        swap: {
          title: 'Swap file',
          tip: 'If issues persist after enabling memory optimization, try enabling the swap file',
          sizeTip: 'This sets the file size to 128MB, adjust it in Settings > System > Performance'
        },
        restartTitle: 'Restart Tailscale',
        restartDesc: 'Restart the service',
        restartBtn: 'Restart',
        restart: 'Restart Tailscale?',
        stopTitle: 'Stop Tailscale',
        stopBtn: 'Stop',
        stop: 'Stop Tailscale?',
        stopDesc: 'Stop the service and keep it from starting at boot',
        loading: 'Loading...',
        notInstall: 'Tailscale not found, please install it',
        install: 'Install',
        installing: 'Installing',
        failed: 'Install failed',
        retry: 'Please refresh and try again, or install manually.',
        download: 'Download the',
        package: 'installation package',
        unzip: 'and unzip it',
        upTailscale: 'Upload tailscale to NanoKVM directory /usr/bin/',
        upTailscaled: 'Upload tailscaled to NanoKVM directory /usr/sbin/',
        refresh: 'Refresh current page',
        notRunning: 'Tailscale is not running. Please start it to continue.',
        run: 'Start',
        notLogin:
          'The device has not been bound yet. Please login and bind this device to your account.',
        urlPeriod: 'This url is valid for 10 minutes',
        login: 'Login',
        loginSuccess: 'Login success',
        deviceName: 'Device name',
        deviceIP: 'Device IP',
        account: 'Account',
        logout: 'Logout',
        logoutDesc: 'Are you sure you want to logout?',
        uninstall: 'Uninstall Tailscale',
        uninstallDesc: 'Are you sure you want to uninstall Tailscale?',
        okBtn: 'Yes',
        cancelBtn: 'No'
      },
      update: {
        title: 'Updates',
        currentVersion: 'Current version',
        latestVersion: 'Latest version',
        queryFailed: "Couldn't get the version",
        updateFailed: 'Update failed',
        paranoidBlocked: 'Online updates are blocked by Paranoid Firewall mode',
        paranoidBlockedDesc:
          'GitHub checks and downloads require outbound network access. Offline upload and already staged installs remain available.',
        available: 'An update is available. Are you sure you want to update now?',
        updating: 'Update started',
        confirm: 'Confirm',
        cancel: 'Cancel',
        badge: {
          checking: 'Checking',
          latest: 'Up to date',
          available: 'Update available',
          failed: 'Check failed',
          local: 'Local'
        },
        application: {
          title: 'Application'
        },
        system: {
          queryFailed: 'Get system version failed',
          appUpdateRequired:
            'Update the application to {{version}} before installing this system update',
          requiredAppVersion: 'Required application version',
          downloadFailed: 'Download or verification failed',
          available: 'A base-system update is available.',
          downloading: 'Downloading and verifying system update...',
          downloadVerify: 'Download and verify',
          installing: 'Installing staged system update...',
          install: 'Install',
          installFailed: 'Install failed',
          installConfirmTitle: 'Install system update?',
          installConfirmDesc:
            'This will replace base-system files from the verified bundle. Reboot will be required.',
          rawInstallConfirmDesc:
            'This verified bundle will write raw boot/rootfs images to the SD-card partitions and reboot automatically. Writing can take several minutes; keep power connected.',
          rawInstallWarning:
            'There is no automatic rollback for raw partition updates. If boot fails, recover the SD card manually.',
          rawWaitTitle: 'Installing system update',
          rawWaitWriting: 'Writing the new system to the SD card',
          rawWaitRestarting: 'Restarting the device. This page reloads when it is back.',
          rawWaitDesc:
            'This takes about three minutes. Keep power connected and do not close this page.',
          rawWaitSlow:
            'This is taking longer than expected. Wait a few more minutes before cutting power.',
          rebootRequired: 'Reboot is required to activate this system state.',
          rollingBack: 'Rolling back system update...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback prepared',
          rollbackFailed: 'Rollback failed',
          rollbackConfirmTitle: 'Rollback system update?',
          rollbackConfirmDesc:
            'This will restore files from the latest system-update backup. Reboot will be required.',
          stagedDesc: 'The system update was downloaded and verified, you can install it now',
          refresh: 'Refresh',
          releaseNotes: 'Release notes',
          systemVersion: 'System version',
          kernel: 'Kernel',
          stagedVersion: 'Staged version',
          archive: 'Archive',
          requiredFree: 'Required free space',
          fileCount: 'Files',
          rawImages: 'Raw images',
          progress: 'Progress',
          progressMessage: 'Progress message',
          pendingVersion: 'Pending version',
          bootHealth: 'Boot health',
          healthy: 'Healthy',
          unhealthy: 'Needs attention',
          rollbackBackup: 'Rollback backup'
        },
        offline: {
          title: 'Upload application bundle',
          desc: 'Install an application bundle from this computer. The server restarts afterwards.',
          installTitle: 'Install application update?',
          installDesc:
            'The application is replaced and the server restarts. You will have to sign in again.'
        },
        local: {
          title: 'Upload system bundle',
          desc: 'Install a system bundle from this computer. One file holds the archive and its signed metadata.',
          choose: 'Choose file',
          invalidFile: 'Select a bundle ending in .tar or .tar.gz.',
          diskTitle: 'Turn off the virtual disk?',
          diskWarn:
            'The bundle is stored on /data, which is read-only while the virtual disk is on. Turning the virtual disk off means the computer can no longer access /data. Continue?',
          uploading: 'Uploading',
          verifying: 'Verifying and staging the bundle',
          keyTitle: 'Local update key',
          keyDesc: 'Public key in PEM format that may sign the bundles you build yourself',
          keyNone: 'No key set',
          keySet: 'Set key',
          keyRemove: 'Remove',
          signer: 'Signed by',
          section: 'Local updates',
          keyRequired: 'Local key required'
        }
      },
      account: {
        title: 'Account',
        webAccount: 'Web account name',
        password: 'Password',
        passwordDesc: 'Change the password used to log in to the web interface',
        updateBtn: 'Change',
        logoutBtn: 'Logout',
        logoutDesc: 'Are you sure you want to logout?',
        okBtn: 'Yes',
        cancelBtn: 'No',
        session: {
          title: 'Session'
        },
        logoutOnClose: {
          title: 'Log out when the browser closes',
          description: 'End the session when the browser is closed instead of keeping it open'
        },
        totp: {
          title: 'Two-factor authentication',
          authenticator: 'Authenticator app',
          description:
            'Require a time-based code from an authenticator app in addition to your password',
          required: 'Required by policy',
          disable: 'Disable',
          enableTitle: 'Set up two-factor authentication',
          enableDescription:
            'Confirm your password to continue. It is required for any change to the second factor.',
          continue: 'Continue',
          disableTitle: 'Disable two-factor authentication?',
          disableDescription:
            'Your account will be protected by its password alone. Confirm with your password to continue.',
          disableFailed: 'Could not disable two-factor authentication',
          passwordPlaceholder: 'Current password',
          enrollFailed: 'Could not start enrolment',
          invalidCode: 'That code does not match. Try the next one.',
          scan: 'Scan this with your authenticator app.',
          manualEntry: 'Or enter this key manually:',
          codePlaceholder: 'Enter the 6-digit code to confirm',
          confirm: 'Confirm',
          cancel: 'Cancel',
          backupTitle: 'Save your backup codes now',
          backupDescription:
            'Each code works once and will not be shown again. They are the only way back in if you lose your authenticator, and they keep working when the device clock is not synchronized.',
          copy: 'Copy',
          copied: 'Backup codes copied',
          savedThem: "I've saved them",
          remaining: '{{remaining}} backup codes remaining',
          clockUnsynced:
            'The device clock is not synchronized yet. Synchronize time in Settings > System > Time before enrolling.',
          noBackupCodes: 'No backup codes remain. Select Generate to issue a new set.',
          regenerate: 'New backup codes',
          generate: 'Generate',
          regenerateTitle: 'Issue new backup codes?',
          regenerateDescription:
            'Your current backup codes will stop working. Confirm with your password to continue.',
          regenerateFailed: 'Could not issue new backup codes',
          download: 'Download',
          copyFailed: 'Could not copy. Select the codes and copy them manually.',
          requireTitle: 'Require two-factor authentication',
          requireDescription:
            'Prevent disabling two-factor authentication, and an account without it must set it up before using the device',
          requireFailed: 'Could not change the requirement',
          requiredTitle: 'Two-factor authentication is required',
          requiredDescription:
            'This device is configured to require a second factor, but your account has not enrolled one yet. Set it up now to continue.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw assistant',
      empty: 'Describe a task to get started',
      inputPlaceholder: 'Describe what you want PicoClaw to do',
      newConversation: 'New conversation',
      processing: 'Processing...',
      agent: {
        defaultTitle: 'General assistant',
        defaultDescription: 'General chat, search, and workspace help',
        kvmTitle: 'Remote control',
        kvmDescription: 'Operate the remote host through NanoKVM',
        switched: 'Agent role switched',
        switchFailed: 'Failed to switch agent role'
      },
      send: 'Send',
      cancel: 'Cancel',
      status: {
        connecting: 'Connecting to gateway...',
        connected: 'PicoClaw session connected',
        disconnected: 'PicoClaw session closed',
        stopped: 'Stop request sent',
        runtimeStarted: 'PicoClaw runtime started',
        runtimeStartFailed: 'Failed to start PicoClaw runtime',
        runtimeStopped: 'PicoClaw runtime stopped',
        runtimeStopFailed: 'Failed to stop PicoClaw runtime'
      },
      connection: {
        runtime: {
          checking: 'Checking',
          ready: 'Runtime ready',
          stopped: 'Runtime stopped',
          unavailable: 'Runtime unavailable',
          configError: 'Configuration error'
        },
        transport: {
          connecting: 'Connecting',
          connected: 'Connected'
        },
        run: {
          idle: 'Idle',
          busy: 'Busy'
        }
      },
      error: {
        lockHeld: 'PicoClaw is in use in another window',
        takenOver: 'Another window took over PicoClaw',
        authFailed: 'PicoClaw refused the connection',
        upstreamClosed: 'The connection to PicoClaw was lost'
      },
      tool: {
        screenshot: 'Taking a screenshot',
        loadImage: 'Looking at the screenshot',
        actions: 'Controlling the host',
        generic: 'Using {{name}}',
        type: 'Typing {{text}}',
        hotkey: 'Pressing {{keys}}',
        click: 'Clicking',
        doubleClick: 'Double-clicking',
        move: 'Moving the mouse',
        drag: 'Dragging',
        scroll: 'Scrolling',
        wait: 'Waiting'
      },
      message: {
        toolAction: 'Action',
        observation: 'Observation',
        screenshot: 'Screenshot'
      },
      overlay: {
        locked: 'PicoClaw is controlling the device. Manual input is paused.'
      },
      install: {
        install: 'Install PicoClaw',
        installing: 'Installing PicoClaw',
        success: 'PicoClaw installed successfully',
        failed: 'Failed to install PicoClaw',
        uninstalled: 'PicoClaw uninstalled successfully',
        uninstallFailed: 'Uninstall failed',
        requiredTitle: 'PicoClaw is not installed',
        requiredDescription: 'Install PicoClaw before starting the PicoClaw runtime.',
        progressDescription: 'PicoClaw is being downloaded and installed.',
        stages: {
          preparing: 'Preparing',
          downloading: 'Downloading',
          extracting: 'Extracting',
          verifying: 'Verifying',
          installing: 'Installing',
          installed: 'Installed',
          install_timeout: 'Timed out',
          install_failed: 'Failed'
        }
      },
      model: {
        requiredTitle: 'Model configuration is required',
        requiredDescription: 'Configure the PicoClaw model before using PicoClaw chat.',
        docsTitle: 'Configuration guide',
        docsDesc: 'Supported models and protocols',
        menuLabel: 'Configure model',
        modelIdentifier: 'Model identifier',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API base URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API key',
        apiKeyPlaceholder: 'Enter the model API key',
        apiKeyKeepPlaceholder: 'Leave empty to keep the current key',
        save: 'Save',
        saving: 'Saving',
        saved: 'Model configuration saved',
        saveFailed: 'Failed to save model configuration',
        invalid: 'Model identifier, API base URL, and API key are required'
      },
      uninstall: {
        confirmTitle: 'Uninstall PicoClaw',
        confirmContent:
          'Are you sure you want to uninstall PicoClaw? This will delete the executable and all configuration files.',
        confirmOk: 'Uninstall'
      },
      history: {
        title: 'History',
        loading: 'Loading sessions...',
        emptyTitle: 'No history yet',
        emptyDescription: 'Previous PicoClaw sessions will appear here.',
        loadFailed: 'Failed to load session history',
        deleteFailed: 'Failed to delete session',
        deleteConfirmTitle: 'Delete session',
        deleteConfirmContent: 'Are you sure you want to delete "{{title}}"?',
        deleteConfirmOk: 'Delete',
        messageCount_one: '{{count}} message',
        messageCount_other: '{{count}} messages'
      },
      config: {
        startRuntime: 'Start PicoClaw',
        stopRuntime: 'Stop PicoClaw',
        stopConfirm: 'Stop PicoClaw?'
      },
      start: {
        title: 'Start PicoClaw',
        description: 'Start the runtime to begin using the PicoClaw assistant.'
      }
    },
    error: {
      title: "We've ran into an issue",
      refresh: 'Refresh'
    },
    fullscreen: {
      toggle: 'Toggle full screen'
    },
    menu: {
      collapse: 'Collapse menu'
    }
  }
};

export default en;
