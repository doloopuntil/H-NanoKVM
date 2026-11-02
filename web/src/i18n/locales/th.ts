const th = {
  translation: {
    common: {
      confirm: 'ยืนยัน',
      cancel: 'ยกเลิก',
      save: 'บันทึก',
      discard: 'ละทิ้ง',
      delete: 'ลบ',
      actionFailed: 'การดำเนินการล้มเหลว',
      loading: 'กำลังโหลดการตั้งค่าจากอุปกรณ์...',
      loadFailed: 'ไม่สามารถโหลดการตั้งค่าจากอุปกรณ์ได้',
      retry: 'ลองอีกครั้ง'
    },
    head: {
      desktop: 'เดสก์ท็อประยะไกล',
      login: 'เข้าสู่ระบบ',
      firstSetup: 'ตั้งค่าครั้งแรก',
      changePassword: 'เปลี่ยนรหัสผ่าน',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'เข้าสู่ระบบ',
      placeholderUsername: 'ชื่อผู้ใช้งาน',
      placeholderPassword: 'รหัสผ่าน',
      placeholderPassword2: 'ใส่รหัสผ่านอีกครั้ง',
      noEmptyUsername: 'ต้องใส่ชื่อผู้ใช้งาน',
      noEmptyPassword: 'ต้องใส่รหัสผ่าน',
      invalidUser: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง',
      locked: 'มีการเข้าสู่ระบบมากเกินไป โปรดลองอีกครั้งในภายหลัง',
      globalLocked: 'ระบบอยู่ระหว่างการป้องกัน โปรดลองอีกครั้งในภายหลัง',
      error: 'เกิดข้อผิดพลาด',
      changePassword: 'เปลี่ยนรหัสผ่าน',
      changePasswordDesc: 'เพื่อความปลอดภัย, โปรดเปลี่ยนรหัสผ่าน',
      differentPassword: 'รหัสผ่านไม่ตรงกัน',
      illegalUsername: 'ชื่อผู้ใช้ไม่สามารถมีอักขระที่ไม่ถูกต้อง',
      illegalPassword:
        'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และห้ามมีเครื่องหมายคำพูดหรือเครื่องหมายทับ',
      forgetPassword: 'ลืมรหัสผ่าน',
      ok: 'โอเค',
      cancel: 'ยกเลิก',
      loginButtonText: 'เข้าสู่ระบบ',
      setupTitle: 'สร้างบัญชีผู้ดูแล',
      setupDescription: 'ยังไม่มีบัญชีเว็บบนอุปกรณ์นี้ สร้างบัญชีผู้ดูแลบัญชีแรกเพื่อดำเนินการต่อ',
      setupRecovery: 'หากรหัสผ่านนี้หาย การกู้คืนต้องเขียนการ์ด SD ใหม่',
      setupButtonText: 'สร้างบัญชี',
      tips: {
        hardenedRecovery:
          'อิมเมจ Hardened นี้ไม่รองรับการรีเซ็ตรหัสผ่านด้วยปุ่ม BOOT หากรหัสผ่านหาย ให้เขียนการ์ด SD ใหม่และสร้างบัญชีใหม่',
        change1: 'โปรดทราบว่าการดำเนินการนี้จะเปลี่ยนรหัสผ่านต่อไปนี้:',
        change2: 'รหัสผ่านเว็บไซต์',
        change3: 'รหัสผ่าน root ของระบบสำหรับเข้าสู่ระบบ SSH'
      },
      placeholderCurrentPassword: 'รหัสผ่านปัจจุบัน',
      placeholderNewPassword: 'รหัสผ่านใหม่',
      wrongCurrentPassword: 'รหัสผ่านปัจจุบันไม่ถูกต้อง',
      totp: {
        title: 'การยืนยันตัวตนสองขั้นตอน',
        prompt: 'กรอกรหัส 6 หลักจากแอปยืนยันตัวตนของคุณ',
        backupPrompt: 'กรอกรหัสสำรองหนึ่งรหัส',
        noEmptyCode: 'กรอกรหัส',
        placeholderCode: 'รหัส 6 หลัก',
        placeholderBackup: 'รหัสสำรอง',
        verifyButtonText: 'ยืนยัน',
        useBackupCode: 'ใช้รหัสสำรอง',
        useAuthenticator: 'ใช้รหัสจากแอปยืนยันตัวตน',
        cancel: 'กลับ',
        invalidCode: 'รหัสนี้ไม่ถูกต้อง ลองอีกครั้ง'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'ตั้งค่า Wi-Fi สำหรับ NanoKVM',
      success: 'โปรดไปที่อุปกรณ์เพื่อตรวจสอบสถานะเครือข่ายของ NanoKVM',
      failed: 'เกิดข้อผิดพลาด กรุณาลองใหม่',
      invalidMode:
        'โหมดปัจจุบันไม่รองรับการตั้งค่าเครือข่าย โปรดไปที่อุปกรณ์ของคุณและเปิดใช้งานโหมดการกำหนดค่า Wi-Fi',
      confirmBtn: 'โอเค',
      finishBtn: 'เสร็จ',
      ap: {
        authTitle: 'จำเป็นต้องมีการรับรองความถูกต้อง',
        authDescription: 'โปรดป้อนรหัสผ่าน AP เพื่อดำเนินการต่อ',
        authFailed: 'รหัสผ่าน AP ไม่ถูกต้อง',
        passPlaceholder: 'รหัสผ่าน AP',
        verifyBtn: 'ตรวจสอบ'
      }
    },
    screen: {
      scale: 'สเกล',
      title: 'หน้าจอ',
      video: 'โหมดวีดีโอ',
      videoDirectTips: 'เปิดใช้งาน HTTPS ใน "การตั้งค่า > เครือข่าย > บริการ" เพื่อใช้โหมดนี้',
      videoWebrtcBlockedByFirewall: 'H.264 WebRTC ถูกปิดใช้งานในโหมดไฟร์วอลล์ จำกัด และ หวาดระแวง',
      transferRunningTitle: 'กำลังถ่ายโอนอิมเมจ',
      transferRunningDesc:
        'การเปลี่ยนโหมดวิดีโอจะโหลดหน้าใหม่ ซึ่งจะยกเลิกการอัปโหลดหรือดาวน์โหลดอิมเมจที่กำลังดำเนินอยู่',
      transferRunningOk: 'เปลี่ยนโหมด',
      resolution: 'ความละเอียด',
      auto: 'อัตโนมัติ',
      autoTips:
        'อาการภาพฉีกขาดหรือเมาส์ไม่ตรงตำแหน่งอาจเกิดขึ้นที่ความละเอียดบางระดับ แนะนำให้ปรับความละเอียดของคอมพิวเตอร์ต้นทางหรือปิดโหมดอัตโนมัติ',
      fps: 'FPS',
      customizeFps: 'กำหนดเอง',
      quality: 'คุณภาพ',
      qualityLossless: 'ไม่สูญเสียคุณภาพ',
      qualityHigh: 'สูง',
      qualityMedium: 'กลาง',
      qualityLow: 'ต่ำ',
      frameDetect: 'ตรวจจับเฟรม',
      frameDetectTip:
        'เปรียบเทียบเฟรมและหยุดส่งวิดีโอตราบใดที่หน้าจอของคอมพิวเตอร์ต้นทางไม่เปลี่ยนแปลง',
      resetHdmi: 'รีเช็ท HDMI',
      webrtcConnectionFailed: {
        title: 'การเชื่อมต่อ WebRTC ล้มเหลว',
        description: 'โปรดตรวจสอบการเชื่อมต่อเครือข่ายหรือสลับโหมดวิดีโอ'
      },
      captureStatus: {
        hdmiError: 'ข้อผิดพลาดหน้าจอ HDMI',
        unsupportedResolution: 'ไม่รองรับความละเอียดปัจจุบัน',
        retrieving: 'กำลังดึงหน้าจอ...',
        changingResolution: 'กำลังเปลี่ยนความละเอียด...',
        updateFailed: 'ไม่สามารถอัปเดตหน้าจอได้ในขณะนี้',
        videoError: 'ข้อผิดพลาดในการแสดงวิดีโอ',
        noHdmi: 'ไม่พบสัญญาณ HDMI',
        unavailable: 'ไม่สามารถแสดงหน้าจอได้ในขณะนี้'
      }
    },
    keyboard: {
      title: 'คีย์บอร์ด',
      paste: 'วาง',
      tips: 'รองรับเฉพาะตัวอักษรและสัญลักษณ์มาตรฐานของแป้นพิมพ์เท่านั้น',
      placeholder: 'ข้อความที่จะวาง',
      local: 'แป้นพิมพ์มือถือ',
      virtual: 'แป้นพิมพ์บนหน้าจอ',
      readClipboard: 'อ่านจากคลิปบอร์ด',
      clipboardPermissionDenied:
        'การอนุญาตคลิปบอร์ดถูกปฏิเสธ โปรดอนุญาตการเข้าถึงคลิปบอร์ดในเบราว์เซอร์ของคุณ',
      clipboardReadError: 'ไม่สามารถอ่านคลิปบอร์ดได้',
      dropdownEnglish: 'ภาษาอังกฤษ',
      dropdownGerman: 'ภาษาเยอรมัน',
      dropdownFrench: 'ภาษาฝรั่งเศส',
      dropdownRussian: 'ภาษารัสเซีย',
      dropdownKorean: 'ภาษาเกาหลี',
      dropdownJapanese: 'ภาษาญี่ปุ่น',
      localInput: 'การป้อนข้อมูลจากแป้นพิมพ์มือถือ',
      shortcut: {
        title: 'ทางลัด',
        custom: 'กำหนดเอง',
        capture: 'คลิกที่นี่เพื่อจับภาพทางลัด',
        clear: 'ล้าง',
        save: 'บันทึก',
        captureTips: 'การจับปุ่มระดับระบบ เช่น ปุ่ม Windows ต้องได้รับสิทธิ์โหมดเต็มหน้าจอ',
        enterFullScreen: 'สลับโหมดเต็มหน้าจอ'
      },
      leaderKey: {
        title: 'ปุ่ม Leader',
        desc: 'ข้ามข้อจำกัดของเบราว์เซอร์และส่งทางลัดของระบบไปยังโฮสต์ระยะไกลโดยตรง',
        howToUse: 'วิธีการใช้งาน',
        simultaneous: {
          title: 'โหมดพร้อมกัน',
          desc1: 'กดปุ่ม Leader ค้างไว้ แล้วกดปุ่มลัด',
          desc2: 'ใช้งานง่าย แต่อาจขัดแย้งกับทางลัดของระบบ'
        },
        sequential: {
          title: 'โหมดต่อเนื่อง',
          desc1: 'กดปุ่ม Leader → กดปุ่มลัดตามลำดับ → กดปุ่ม Leader อีกครั้ง',
          desc2: 'ต้องมีขั้นตอนเพิ่มเติม แต่หลีกเลี่ยงความขัดแย้งของระบบโดยสิ้นเชิง'
        },
        enable: 'เปิดใช้งานปุ่ม Leader',
        tip: 'เมื่อตั้งเป็นปุ่ม Leader ปุ่มนี้จะใช้เป็นตัวเรียกปุ่มลัดเท่านั้น และจะไม่ทำงานตามค่าเริ่มต้นอีกต่อไป',
        placeholder: 'กดปุ่ม Leader',
        shiftRight: 'Shift ขวา',
        ctrlRight: 'Ctrl ขวา',
        metaRight: 'Win ขวา',
        recorder: {
          rec: 'บันทึก',
          activate: 'เปิดใช้งานปุ่ม',
          input: 'กดทางลัด'
        }
      }
    },
    mouse: {
      title: 'เมาส์',
      cursor: 'รูปแบบเคอร์เซอร์',
      default: 'ตัวชี้เริ่มต้น',
      cell: 'ตัวชี้แบบเซลล์',
      text: 'ตัวชี้แบบข้อความ',
      grab: 'ตัวชี้แบบจับ',
      hide: 'ซ่อนตัวชี้',
      mode: 'โหมดเมาส์',
      absolute: 'โหมดสัมบูรณ์',
      relative: 'โหมดสัมพัทธ์',
      direction: 'ทิศทางล้อเลื่อน',
      scrollUp: 'เลื่อนขึ้น',
      scrollDown: 'เลื่อนลง',
      speed: 'ความเร็วล้อเลื่อน',
      sensitivity: 'ความเร็วตัวชี้',
      sensitivityDesc:
        'สำหรับโหมด relative บนเดสก์ท็อป: ค่าที่ต่ำลงช่วยลดการลอยจากการเร่งเมาส์ของโฮสต์',
      fast: 'รวดเร็ว',
      slow: 'ช้า',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'เลื่อนได้ทุกตำแหน่งในพื้นที่ KVM เคอร์เซอร์ระยะไกลจะคงตำแหน่งระหว่างการแตะและซิงค์กับ HID แบบ absolute'
      },
      requestPointer: 'กำลังใช้โหมดสัมพัทธ์ กรุณาคลิกที่เดสก์ท็อปเพื่อรับตัวชี้เมาส์',
      resetHid: 'รีเซ็ต HID',
      hidOnly: {
        title: 'โหมด HID-Only',
        desc: 'หากเมาส์หรือคีย์บอร์ดไม่ตอบสนองและการรีเซ็ต HID ไม่ช่วย อาจเป็นปัญหาความเข้ากันได้ระหว่าง NanoKVM กับโฮสต์',
        tip1: 'การเปิดโหมด HID-Only จะเลิกเมานต์ดิสก์จำลองและเครือข่ายจำลอง',
        tip2: 'ในโหมด HID-Only การเมานต์อิมเมจจะถูกปิดใช้งาน',
        tip3: 'NanoKVM จะรีบูตอัตโนมัติหลังจากเปลี่ยนโหมด',
        enable: 'เปิดใช้งานโหมด HID-Only',
        disable: 'ปิดใช้งานโหมด HID-Only'
      }
    },
    image: {
      title: 'ดิสก์จำลอง',
      loading: 'กำลังโหลด...',
      empty: 'ไม่พบดิสก์',
      mountMode: 'ติดตั้งเป็น',
      massStorage: 'อุปกรณ์จัดเก็บข้อมูล',
      cdRom: 'CD-ROM',
      mountFailed: 'การติดตั้งล้มเหลว',
      mountDesc: 'ในบางระบบ, จะต้อง eject ดิสก์จำลองก่อนที่จะใส่ดิสก์ใหม่',
      diskOnWarn:
        'การเมานต์อิมเมจจะปิดดิสก์เสมือน ทำให้คอมพิวเตอร์เข้าถึง /data ไม่ได้อีกต่อไป ดำเนินการต่อหรือไม่?',
      diskOffWarn:
        'ดิสก์เสมือนปิดอยู่ ต้องเปิดก่อนจึงจะเมานต์อิมเมจได้ อุปกรณ์ USB ของคอมพิวเตอร์จะเชื่อมต่อใหม่ ดำเนินการต่อหรือไม่?',
      unmountFailed: 'การถอนติดตั้งล้มเหลว',
      unmountDesc:
        'ในบางระบบ คุณต้องดีดออกจากโฮสต์ระยะไกลด้วยตนเองก่อนที่จะยกเลิกการต่อเชื่อมอิมเมจ',
      forceEject: 'บังคับดีดออก',
      forceEjectConfirm:
        'โฮสต์ได้ล็อกไดรฟ์ออปติคัล การบังคับดีดออกจะตัดการเชื่อมต่ออุปกรณ์ USB เสมือนชั่วขณะ ทำให้คีย์บอร์ดและเมาส์อาจหลุดการเชื่อมต่อชั่วครู่ ดำเนินการต่อหรือไม่?',
      usbReconnect: 'เชื่อมต่อ USB ใหม่',
      usbReconnectConfirm:
        'เชื่อมต่อ USB gadget ใหม่เฉพาะเมื่อโฮสต์ระยะไกลไม่เห็นการเปลี่ยนสื่อ แป้นพิมพ์และเมาส์อาจตัดการเชื่อมต่อชั่วครู่',
      usbReconnectSuccess: 'เชื่อมต่อ USB ใหม่แล้ว',
      usbReconnectFailed: 'เชื่อมต่อ USB ใหม่ล้มเหลว',
      addImage: 'เพิ่มอิมเมจ',
      fromUrl: 'จาก URL',
      fromFile: 'จากไฟล์',
      turnOff: 'ปิด',
      eject: 'ดีดออก',
      download: 'ดาวน์โหลด',
      upload: 'อัปโหลด',
      mountTitle: 'ติดตั้งอิมเมจ',
      deleteTitle: 'ลบอิมเมจ',
      deleteConfirm: 'คุณแน่ใจหรือไม่ว่าต้องการลบภาพนี้?',
      tips: {
        title: 'วิธีการอัปโหลด',
        usb1: 'เชื่อมต่อ NanoKVM กับคอมพิวเตอร์ของคุณผ่าน USB',
        usb2: 'ตรวจสอบให้แน่ใจว่าได้เปิดใช้งานดิสก์เสมือนแล้วใน การตั้งค่า > อุปกรณ์ > ดิสก์จำลอง',
        usb3: 'เปิดดิสก์บนคอมพิวเตอร์ของคุณและคัดลอกไฟล์อิมเมจไปยังไดเรกทอรีหลักของดิสก์',
        scp1: 'ตรวจสอบให้แน่ใจว่า NanoKVM และคอมพิวเตอร์ของคุณอยู่ในเครือข่ายเดียวกัน',
        scp2: 'เปิดเทอร์มินัลบนคอมพิวเตอร์ของคุณและใช้คำสั่ง SCP เพื่ออัปโหลดไฟล์อิมเมจไปยังไดเรกทอรี /data บน NanoKVM',
        scp3: 'ตัวอย่าง: scp <ที่อยู่ของไฟล์> root@<ip อุปกรณ์>:/data',
        tfCard: 'การ์ด SD',
        tf1: 'วิธีนี้รองรับแค่บนระบบปฏิบัติการ Linux',
        tf2: 'นำการ์ด SD ออกจาก NanoKVM สำหรับรุ่น FULL ให้แกะเคสออกก่อน',
        tf3: 'ใส่การ์ด SD ลงในเครื่องอ่านการ์ดและเชื่อมต่อกับคอมพิวเตอร์ของคุณ',
        tf4: 'คัดลอกไฟล์อิมเมจไปยังไดเรกทอรี /data บนการ์ด SD',
        tf5: 'ใส่การ์ด SD กลับเข้า NanoKVM'
      }
    },
    script: {
      title: 'สคริปต์',
      upload: 'อัปโหลด',
      run: 'เรียกใช้',
      runBackground: 'เรียกใช้ในพื้นหลัง',
      runFailed: 'การเรียกใช้ล้มเหลว',
      delDesc: 'คุณแน่ใจที่จะลบไฟล์นี้หรือไม่?',
      delete: 'ลบ',
      close: 'ปิด'
    },
    terminal: {
      title: 'เทอร์มินอล',
      nanokvm: 'เทอร์มินอลของ NanoKVM',
      serial: 'เทอร์มินอลของ Serial Port',
      unlockTitle: 'ปลดล็อกเทอร์มินัล',
      unlockDesc: 'ป้อนรหัสผ่านบัญชีเว็บเพื่อเริ่มเซสชันเทอร์มินัล',
      unlock: 'ปลดล็อก',
      unlockFailed: 'ปลดล็อกเทอร์มินัลไม่สำเร็จ',
      invalidCredentials: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      locked: 'พยายามมากเกินไป ลองอีกครั้งภายหลัง',
      sessionClosed: 'เซสชันเทอร์มินัลถูกปิด ปลดล็อกอีกครั้งเพื่อเชื่อมต่อใหม่',
      sessionError: 'การเชื่อมต่อเทอร์มินัลล้มเหลว ปลดล็อกอีกครั้งเพื่อลองใหม่',
      serialPort: 'พอร์ตอนุกรม',
      serialPortPlaceholder: 'ตัวอย่าง /dev/ttyS1',
      baudrate: 'อัตราบอด',
      parity: 'พาริตี',
      parityNone: 'ไม่มี',
      parityEven: 'คู่',
      parityOdd: 'คี่',
      flowControl: 'การควบคุมการไหล',
      flowControlNone: 'ไม่มี',
      flowControlSoft: 'ซอฟต์แวร์',
      flowControlHard: 'ฮาร์ดแวร์',
      dataBits: 'บิตข้อมูล',
      stopBits: 'บิตหยุด',
      open: 'เปิดเทอร์มินอล'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'กำลังส่งคำสั่ง...',
      sent: 'ส่งคำสั่งแล้ว',
      input: 'MAC Address',
      ok: 'ยืนยัน'
    },
    download: {
      input: 'URL ของอิมเมจระยะไกล',
      ok: 'OK',
      disabled:
        'ตอนนี้ไม่สามารถดาวน์โหลดหรืออัปโหลดอิมเมจได้เพราะที่เก็บข้อมูลเขียนไม่ได้ หากมีการเมานต์อิมเมจอยู่ ให้ยกเลิกการเมานต์ก่อน แล้วปิดดิสก์เสมือนเพื่อให้เขียนที่เก็บข้อมูลได้อีกครั้ง',
      diskShared: 'ปิดดิสก์เสมือนเพื่อใช้การดาวน์โหลดอิมเมจ',
      mountedImage: 'อิมเมจนี้ถูกเมานต์อยู่ โปรดยกเลิกการเมานต์ก่อนอัปโหลดไฟล์ที่มีชื่อเดียวกัน',
      diskOff: 'ปิดดิสก์เสมือน',
      uploadbox: 'วางไฟล์ที่นี่หรือคลิกเพื่อเลือก',
      inputfile: 'ไฟล์อิมเมจ',
      NoISO: 'ไม่มีอิมเมจ',
      complete: 'ดาวน์โหลดเสร็จสมบูรณ์',
      uploadComplete: 'อัปโหลดเสร็จสมบูรณ์',
      downloading: 'กำลังดาวน์โหลด',
      uploading: 'กำลังอัปโหลด',
      failed: 'การถ่ายโอนล้มเหลว',
      uploadFailed: 'อัปโหลดล้มเหลว',
      stalled: 'การถ่ายโอนหยุดค้าง ตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง',
      canceled: 'ยกเลิกการอัปโหลดแล้ว',
      downloadCanceled: 'ยกเลิกการดาวน์โหลดแล้ว',
      cancel: 'ยกเลิก',
      remoteDisabled: 'การดาวน์โหลด ISO ระยะไกลถูกปิดใน การตั้งค่า > ผู้ใช้ > ค่ากำหนด',
      remoteFailed: 'ดาวน์โหลด ISO ระยะไกลล้มเหลว',
      sha256: 'ค่าตรวจสอบ SHA-256 แบบไม่บังคับ',
      sha256Placeholder: 'ป้อน checksum SHA-256 64 ตัวอักษร',
      invalidSHA256: 'SHA-256 ต้องเป็นสตริงเลขฐานสิบหก 64 ตัวอักษร',
      checksumFailed: 'ดาวน์โหลดล้มเหลว: การตรวจสอบ SHA-256 ล้มเหลว'
    },
    power: {
      title: 'เปิด/ปิด',
      showConfirm: 'การยืนยัน',
      showConfirmTip: 'การทำงานของระบบไฟฟ้าต้องมีการยืนยันเพิ่มเติม',
      reset: 'รีเช็ท',
      powerShort: 'ปุ่มเปิด/ปิด: กดปล่อย',
      powerLong: 'ปุ่มเปิด/ปิด: กดค้าง',
      resetConfirm: 'ดำเนินการรีเซ็ตหรือไม่',
      powerConfirm: 'ดำเนินการจ่ายไฟหรือไม่',
      okBtn: 'ใช่',
      cancelBtn: 'ไม่ใช่'
    },
    settings: {
      title: 'การตั้งค่า',
      about: {
        title: 'เกี่ยวกับ',
        information: 'ข้อมูล',
        ip: 'ที่อยู่ IP',
        mdns: 'ที่อยู่ภายในเครือข่าย',
        application: 'เวอร์ชันแอปพลิเคชัน',
        uptime: 'เวลาทำงาน',
        community: 'ชุมชน',
        credit: 'สร้างบน <a1>NanoKVM</a1> โดย Sipeed และ <a2>Hardened NanoKVM</a2> โดย woffko',
        hostname: 'ชื่ออุปกรณ์',
        changeIn: 'เปลี่ยนได้ที่ {{path}}',
        updateIn: 'อัปเดตได้ที่ {{path}}',
        toggleIn: 'เปิดหรือปิดได้ที่ {{path}}'
      },
      appearance: {
        title: 'ค่ากำหนด',
        display: 'การแสดงผล',
        language: 'ภาษา',
        languageDesc: 'เลือกภาษาสำหรับอินเทอร์เฟซ',
        webTitle: 'ชื่อเว็บ',
        webTitleDesc: 'ปรับแต่งชื่อหน้าเว็บ',
        layoutMode: 'เลย์เอาต์อินเทอร์เฟซ',
        layoutModeDesc: 'ใช้เลย์เอาต์โทรศัพท์/สัมผัสในเบราว์เซอร์นี้',
        layoutAuto: 'อัตโนมัติ',
        layoutMobile: 'โทรศัพท์',
        menuBar: {
          title: 'แถบเมนู',
          mode: 'โหมดการแสดงผล',
          modeDesc: 'แสดงแถบเมนูบนหน้าจอ',
          modeOff: 'ปิด',
          modeAuto: 'ซ่อนอัตโนมัติ',
          modeAlways: 'มองเห็นได้เสมอ',
          keyboardLedStatus: 'ตัวบ่งชี้ปุ่มล็อกแป้นพิมพ์',
          keyboardLedStatusDesc:
            'แสดงสถานะ Num Lock, Caps Lock และ Scroll Lock ของคอมพิวเตอร์ระยะไกล',
          icons: 'ไอคอนเมนูย่อย',
          iconsDesc: 'แสดงไอคอนเมนูย่อยในแถบเมนู',
          terminalWarningTitle: 'เปิดใช้เทอร์มินัลเว็บ?',
          terminalWarningDesc:
            'เทอร์มินัลจะเปิด root shell ผ่านเบราว์เซอร์ เปิดใช้เฉพาะบนเครือข่ายที่เชื่อถือได้และปิดเมื่อใช้งานเสร็จ',
          terminalWarningConfirm: 'เปิดใช้',
          remoteDownload: 'ดาวน์โหลด ISO ระยะไกล',
          remoteDownloadWarningTitle: 'เปิดใช้การดาวน์โหลด ISO ระยะไกล?',
          remoteDownloadWarningDesc:
            'NanoKVM จะดึง ISO จาก URL และเขียนไปที่ /data เปิดใช้เฉพาะ URL ที่เชื่อถือได้และปิดเมื่อใช้งานเสร็จ',
          remoteDownloadWarningConfirm: 'เปิดใช้'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'สถานะปุ่มล็อกแป้นพิมพ์ระยะไกล',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'เปิด',
        off: 'ปิด',
        unknown: 'ไม่ทราบ'
      },
      device: {
        title: 'อุปกรณ์',
        minutes: 'นาที',
        sections: {
          general: 'ทั่วไป',
          connectivity: 'การเชื่อมต่อ',
          hostConnection: 'การเชื่อมต่อกับโฮสต์',
          inputOutput: 'อินพุตและเอาต์พุต'
        },
        oled: {
          title: 'หมดเวลา OLED',
          description: 'เวลาก่อนจอ OLED จะปิดอัตโนมัติ',
          keepOn: 'เปิด OLED ไว้ตลอด',
          keepOnDescription: 'ไม่ปิดหน้าจอ OLED เลย'
        },
        ssh: {
          description: 'เปิดใช้งาน SSH',
          tip: 'ตั้งรหัสผ่านที่ปลอดภัยใน บัญชี > รหัสผ่าน ก่อนเปิดใช้งานตัวเลือกนี้'
        },
        swap: {
          title: 'Swap',
          description: 'ใช้ไฟล์สลับเมื่อหน่วยความจำเหลือน้อย',
          size: 'ขนาด Swap',
          sizeDescription: 'กำหนดขนาดไฟล์สลับ',
          tip: 'การเปิดใช้งานคุณลักษณะนี้อาจทำให้อายุการใช้งานของการ์ด SD สั้นลง'
        },
        mouseJiggler: {
          title: 'เมาส์กระตุก',
          description: 'ป้องกันไม่ให้โฮสต์ระยะไกลเข้าสู่โหมดสลีป',
          disable: 'ปิดการใช้งาน',
          absolute: 'โหมดสัมบูรณ์',
          relative: 'โหมดสัมพัทธ์'
        },
        sessionLock: {
          title: 'ล็อกเซสชันเมื่อไม่มีการใช้งาน',
          description: 'ขอให้เข้าสู่ระบบอีกครั้งหลังเวลานี้'
        },
        mdns: {
          description: 'เปิดใช้งานบริการค้นหา mDNS',
          tip: 'ช่วยให้เข้าถึงอุปกรณ์นี้ด้วยชื่อ .local ไม่จำเป็นหากคุณเชื่อมต่อด้วยที่อยู่ IP หรือ DNS แปลงชื่อโฮสต์ได้อยู่แล้ว'
        },
        hdmi: {
          description: 'เปิดใช้งาน HDMI/เอาต์พุตมอนิเตอร์',
          idleTimeoutTitle: 'หมดเวลาการจับภาพเมื่อไม่มีการใช้งาน',
          idleTimeoutDescription: 'หยุดการจับภาพ HDMI เมื่อไม่มีผู้ชมที่ใช้งานอยู่เป็นเวลา'
        },
        hidOnly: 'โหมด HID-Only',
        hidOnlyDesc: 'ช่วยให้ทำงานร่วมกับโฮสต์ได้ดีขึ้น หากเมาส์หรือคีย์บอร์ดไม่ตอบสนอง',
        hidOnlyTip: 'โหมด HID-Only จะหยุดจำลองอุปกรณ์เสมือนและคงไว้เพียงการควบคุม HID พื้นฐาน',
        disk: 'ดิสก์จำลอง',
        diskDesc: 'เมานต์การ์ด SD บนโฮสต์ระยะไกล',
        diskLocked: 'ปิดอยู่ขณะเมานต์อิมเมจ และการเปิดจะยกเลิกการเมานต์',
        diskEnable: 'เปิดใช้งานดิสก์จำลอง',
        networkChange: 'เปลี่ยนเครือข่ายจำลอง',
        diskCancelMount: 'การเปิดดิสก์เสมือนจะยกเลิกการเมานต์อิมเมจ ดำเนินการต่อหรือไม่?',
        networkCancelMount:
          'การเปลี่ยนเครือข่ายจำลองจะรีสตาร์ตการเชื่อมต่อ USB ซึ่งจะยกเลิกการเมานต์อิมเมจและเปิดดิสก์เสมือน ดำเนินการต่อหรือไม่?',
        diskTransferRunning: 'กำลังถ่ายโอนอิมเมจอยู่ โปรดรอให้เสร็จก่อนเปิดใช้งานดิสก์เสมือน',
        network: 'เครือข่ายจำลอง',
        networkDesc: 'เปิดใช้งานอุปกรณ์เครือข่ายจำลอง',
        usbWakeup: 'ปลุกผ่าน USB',
        usbWakeupDesc: 'อนุญาตให้เหตุการณ์จากแป้นพิมพ์หรือเมาส์ปลุกโฮสต์ระยะไกล',
        usbWakeupTip: 'ปิดถ้าโฮสต์บันทึกข้อความ USB wakeup ซ้ำ ๆ',
        hostname: {
          description: 'ชื่อของอุปกรณ์นี้ในเครือข่าย',
          reachable: 'เข้าถึงได้ในเครือข่ายภายในที่ {{address}}'
        },
        rebootRequired: 'ต้องรีบูต',
        rebootPending: 'ต้องรีบูตสำหรับ: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'อัปเดตระบบ'
        },
        reboot: 'รีบูต',
        rebootDesc: 'คุณแน่ใจหรือไม่ว่าต้องการรีบูต NanoKVM',
        poweroff: 'ปิดเครื่อง',
        poweroffDesc: 'ต้องการปิด NanoKVM หรือไม่ จะไม่สามารถเข้าถึงได้จนกว่าจะเปิดเครื่องอีกครั้ง'
      },
      network: {
        title: 'IP & DNS',
        connection: 'การเชื่อมต่อ',
        configuration: 'การกำหนดค่า',
        wifi: {
          title: 'Wi-Fi',
          description: 'ตั้งค่า Wi-Fi',
          apMode: 'เปิดใช้งานโหมด AP แล้ว ให้เชื่อมต่อ Wi-Fi โดยสแกนรหัส QR',
          connect: 'เชื่อมต่อ Wi-Fi',
          connectDesc1: 'กรุณาใส่ SSID และรหัสผ่านของเครือข่าย',
          disconnect: 'คุณแน่ใจหรือไม่ว่าต้องการตัดการเชื่อมต่อเครือข่าย?',
          disconnectBtn: 'ตัดการเชื่อมต่อ',
          connected: 'เชื่อมต่อแล้ว',
          ssid: 'ชื่อ',
          password: 'รหัสผ่าน',
          joinBtn: 'เข้าร่วม',
          cancelBtn: 'ยกเลิก'
        },
        tls: {
          description: 'เปิดใช้งานโปรโตคอล HTTPS',
          tip: 'โปรดทราบ: การใช้ HTTPS อาจเพิ่มความหน่วง โดยเฉพาะในโหมดวิดีโอ MJPEG',
          restartTitle: 'เซิร์ฟเวอร์จะเริ่มต้นใหม่',
          restartDesc:
            'การเปลี่ยนโปรโตคอลจะเริ่มต้นเซิร์ฟเวอร์ใหม่ เบราว์เซอร์จะเปลี่ยนไปยังที่อยู่ใหม่หลังจาก {{seconds}} วินาที:',
          restartOk: 'ใช้และเริ่มต้นใหม่',
          confirmTitle: 'เก็บโปรโตคอลใหม่ไว้หรือไม่',
          confirmDesc:
            'เซิร์ฟเวอร์ทำงานด้วย {{protocol}} ตอนนี้ หากไม่เก็บไว้ จะกลับไปใช้โปรโตคอลเดิมใน {{seconds}} วินาที',
          confirmKeep: 'เก็บไว้',
          confirmRevert: 'ย้อนกลับ',
          reverting:
            'กำลังกลับไปใช้โปรโตคอลเดิม เบราว์เซอร์จะเปลี่ยนไปยังที่อยู่นั้นหลังจาก {{seconds}} วินาที',
          certTitle: 'เก็บใบรับรองใหม่ไว้หรือไม่?',
          certDesc:
            'ตอนนี้เซิร์ฟเวอร์ใช้ใบรับรองใหม่ หากไม่เก็บไว้ จะกลับไปใช้ใบรับรองเดิมใน {{seconds}} วินาที',
          certReverted: 'ใบรับรองเดิมกลับมาแล้ว'
        },
        certificate: {
          title: 'ใบรับรอง',
          desc: 'แหล่งที่มาของใบรับรอง HTTPS',
          requesting: 'กำลังขอใบรับรอง',
          selfSigned: 'ลงนามด้วยตนเอง',
          domain: 'โดเมน',
          domainDesc: 'ต้องชี้มาที่อุปกรณ์นี้ และต้องเข้าถึงพอร์ต 443 ได้จากอินเทอร์เน็ต',
          domainTailscale: 'กำหนดโดย Tailscale สำหรับอุปกรณ์นี้',
          domainInvalid: 'ใช้ชื่อโดเมนแบบเต็ม เช่น kvm.example.org',
          email: 'อีเมล',
          emailDesc: "ไม่บังคับ สำหรับการแจ้งเตือนจาก Let's Encrypt",
          emailInvalid: 'ใช้ที่อยู่ในรูปแบบ name@example.org',
          validUntil: 'ใช้ได้ถึง',
          valid: 'ใช้ได้',
          expiresSoon: 'ใกล้หมดอายุ',
          expired: 'หมดอายุแล้ว',
          lastRenewal: 'การต่ออายุล่าสุด',
          renewed: 'ต่ออายุแล้ว',
          failed: 'ล้มเหลว',
          renewNow: 'ต่ออายุเดี๋ยวนี้',
          renewNowDesc: 'ขอใบรับรองใหม่โดยไม่ต้องรอ',
          renewBtn: 'ต่ออายุ',
          applyTitle: 'เปลี่ยนใบรับรอง',
          applyOk: 'ใช้งาน',
          applyAcme:
            "อุปกรณ์ขอใบรับรองจาก Let's Encrypt โดย Let's Encrypt จะเชื่อมต่อพอร์ต 443 จากอินเทอร์เน็ตเพื่อตรวจสอบ ซึ่งอาจใช้เวลาถึงหนึ่งนาที หากคำขอล้มเหลว จะใช้ใบรับรองปัจจุบันต่อไป",
          applyTailscale:
            'อุปกรณ์รับใบรับรองจาก Tailscale ซึ่งอาจใช้เวลาถึงหนึ่งนาที หากคำขอล้มเหลว จะใช้ใบรับรองปัจจุบันต่อไป',
          applySelfSigned:
            'อุปกรณ์จะกลับไปใช้ใบรับรองที่ลงนามด้วยตนเองของตัวเอง เบราว์เซอร์จะแสดงคำเตือน',
          openTitle: 'เปิดที่อยู่ใหม่',
          openDesc:
            'ใบรับรองพร้อมแล้ว เปิดที่อยู่ด้านล่างและลงชื่อเข้าใช้เพื่อเก็บไว้ หากไม่ยืนยันภายใน 3 นาที ใบรับรองเดิมจะกลับมา',
          openOk: 'เปิด',
          blockedClock: 'ไม่สามารถขอใบรับรองได้จนกว่านาฬิกาของอุปกรณ์จะซิงโครไนซ์',
          blockedParanoid: 'โหมดไฟร์วอลล์หวาดระแวงจะบล็อกคำขอใบรับรอง',
          tailscaleUnavailable:
            'Tailscale ไม่ได้ทำงาน หรือยังไม่ได้เปิดใช้ใบรับรอง HTTPS สำหรับ tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'ตั้งค่าเซิร์ฟเวอร์ DNS สำหรับ NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'กำหนดค่าที่อยู่ IPv4 สำหรับอินเทอร์เฟซแบบมีสาย',
          servers: 'เซิร์ฟเวอร์',
          dhcp: 'DHCP',
          manual: 'กำหนดเอง',
          apply: 'นำไปใช้',
          invalid: 'ป้อนที่อยู่ IPv4 หรือ IPv6 ที่ถูกต้อง',
          invalidNetwork: 'ป้อนที่อยู่ IPv4 ซับเน็ตมาสก์ และเราเตอร์ที่ถูกต้อง',
          saved: 'บันทึกการตั้งค่า DNS แล้ว',
          redirecting: 'บันทึกการตั้งค่าเครือข่ายแล้ว กำลังเปิดที่อยู่ใหม่...',
          saveFailed: 'บันทึกการตั้งค่า DNS ไม่สำเร็จ',
          unsaved: 'มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก',
          maxServers: 'อนุญาตเซิร์ฟเวอร์ DNS ได้สูงสุด {{count}} รายการ',
          dhcpServersDescription: 'เซิร์ฟเวอร์ DNS จะได้รับจาก DHCP โดยอัตโนมัติ',
          manualServersDescription: 'รองรับเซิร์ฟเวอร์ทั้ง IPv4 และ IPv6',
          interface: 'อินเทอร์เฟซ',
          ipAddress: 'ที่อยู่ IP',
          subnetMask: 'ซับเน็ตมาสก์',
          router: 'เราเตอร์'
        },
        ipv6: {
          title: 'IPv6',
          description: 'กำหนดค่าการกำหนดที่อยู่ IPv6 สำหรับอินเทอร์เฟซแบบใช้สาย',
          disabled: 'ปิดใช้งาน',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'ด้วยตนเอง',
          interface: 'อินเทอร์เฟซ',
          state: 'สถานะ',
          router: 'เราเตอร์',
          addresses: 'ที่อยู่',
          dhcpv6Client: 'ไคลเอนต์ DHCPv6',
          notInstalled: 'ไม่ได้ติดตั้ง',
          ipAddress: 'ที่อยู่ IPv6',
          prefix: 'พรีฟิกซ์',
          invalidManual: 'โปรดป้อนที่อยู่ IPv6, พรีฟิกซ์ และเราเตอร์ที่ถูกต้อง',
          clientMissing:
            'ยังไม่ได้ติดตั้งไคลเอนต์ DHCPv6 โปรดติดตั้งการอัปเดตระบบ raw ที่ตรงกันก่อน',
          saved: 'บันทึกการตั้งค่า IPv6 แล้ว',
          saveFailed: 'บันทึกการตั้งค่า IPv6 ไม่สำเร็จ',
          unsaved: 'การเปลี่ยนแปลงที่ยังไม่ได้บันทึก'
        }
      },
      system: {
        title: 'ระบบ',
        performance: {
          processor: 'ตัวประมวลผล',
          overdrive: {
            title: 'โอเวอร์ไดรฟ์',
            description:
              'บูตด้วยความเร็วสัญญาณนาฬิกาของตัวประมวลผลและวิดีโอที่สูงขึ้นตามที่ผู้ผลิตกำหนด',
            tip: 'หากอุปกรณ์ไม่เริ่มทำงานด้วยโอเวอร์ไดรฟ์ ต้องเขียนการ์ด SD ใหม่',
            unavailable: 'ไม่รวมอยู่ในอิมเมจระบบนี้',
            keepTitle: 'คงโอเวอร์ไดรฟ์หลังอัปเดต',
            keepDescription:
              'การอัปเดตระบบจะคืนอุปกรณ์เป็นความเร็วสัญญาณนาฬิกามาตรฐาน หากไม่ได้เปิดตัวเลือกนี้',
            confirmTitle: 'เปิดใช้โอเวอร์ไดรฟ์หรือไม่',
            confirmText:
              'หากอุปกรณ์ไม่เริ่มทำงานด้วยโอเวอร์ไดรฟ์ คุณต้องเขียนการ์ด SD ใหม่เพื่อกู้คืน การเปลี่ยนแปลงจะมีผลหลังจากรีบูตครั้งถัดไป',
            confirmOk: 'เปิดใช้งาน'
          },
          watchdog: {
            title: 'วอตช์ด็อกฮาร์ดแวร์',
            description: 'รีสตาร์ทอุปกรณ์อัตโนมัติเมื่อไม่ตอบสนอง',
            unavailable: 'ไม่รวมอยู่ในอิมเมจระบบนี้',
            notRunning: 'ไม่ได้ทำงานอยู่ในขณะนี้',
            lastRestart: 'การรีสตาร์ทล่าสุด',
            lastRestartCaption: 'เหตุผลล่าสุดที่ระบบรีสตาร์ท',
            reasonPowerOn: 'เปิดเครื่อง',
            reasonRestart: 'มีการร้องขอรีสตาร์ท',
            reasonWatchdog: 'รีเซ็ตโดยวอตช์ด็อก',
            reasonOverheat: 'การป้องกันความร้อนสูงเกิน',
            reasonUnknown: 'ไม่ทราบ'
          },
          recovery: 'การกู้คืน',
          memory: 'หน่วยความจำ'
        },
        monitor: {
          processorClock: 'ระบบย่อย CPU',
          videoClock: 'ระบบย่อยวิดีโอ',
          videoClockCaption: 'ความถี่สัญญาณนาฬิกาวิดีโอ',
          cpuClockCaption: 'ความถี่สัญญาณนาฬิกา CPU',
          overdrive: 'โอเวอร์ไดรฟ์',
          temperature: 'อุณหภูมิ',
          lastMinutes: '5 นาทีล่าสุด',
          ram: 'RAM',
          off: 'ปิด',
          ramHistory: 'การใช้งาน RAM',
          cpuLoad: 'โหลด CPU',
          cpuLoadCaption: 'ผู้ใช้ {{user}} เปอร์เซ็นต์ ระบบ {{system}} เปอร์เซ็นต์',
          cpuUtilization: 'การใช้งาน CPU',
          swapUtilization: 'การใช้งาน swap',
          swapSizeLastMinutes: '{{size}} 5 นาทีล่าสุด',
          percent: '{{percent}} เปอร์เซ็นต์',
          percentUsed: 'ใช้ไปแล้ว {{percent}} เปอร์เซ็นต์',
          sizeOf: '{{used}} จาก {{total}}',
          systemPartition: 'พาร์ติชันระบบ',
          dataPartition: 'พาร์ติชันข้อมูล',
          unavailable: 'ไม่พร้อมใช้งาน',
          noReadings: 'อุปกรณ์ไม่ส่งค่าที่อ่านได้กลับมา',
          refresh: 'อัปเดตทุกวินาทีขณะที่หน้านี้เปิดอยู่'
        },
        sections: {
          time: 'เวลา',
          firewall: 'ไฟร์วอลล์',
          systemLog: 'การบันทึกล็อก',
          performance: 'ประสิทธิภาพ',
          monitor: 'ตัวตรวจสอบ',
          services: 'บริการ',
          webInterface: 'การเข้าถึงเว็บที่ปลอดภัย'
        },
        time: {
          saveFailed: 'บันทึกการตั้งค่าเวลาไม่สำเร็จ',
          saved: 'บันทึกการตั้งค่าเวลาแล้ว',
          syncFailed: 'ซิงโครไนซ์เวลาไม่สำเร็จ',
          synced: 'ซิงโครไนซ์เวลาแล้ว',
          invalidServers: 'ป้อนเซิร์ฟเวอร์ NTP อย่างน้อยหนึ่งรายการ',
          maxServers: 'อนุญาตเซิร์ฟเวอร์ NTP ได้สูงสุด {{count}} รายการ',
          refresh: 'รีเฟรช',
          syncNow: 'ซิงโครไนซ์',
          syncNowDesc: 'ตั้งเวลาจากเซิร์ฟเวอร์ NTP ทันที',
          save: 'บันทึก',
          ntp: {
            title: 'NTP',
            description: 'ซิงโครไนซ์เวลาอุปกรณ์จากเซิร์ฟเวอร์ NTP ที่กำหนดค่าไว้'
          },
          networkTime: 'เวลาเครือข่าย',
          clock: {
            title: 'นาฬิกา',
            description: 'ตั้งค่าเขตเวลาท้องถิ่นที่ใช้โดยบันทึกและ UI',
            current: 'เวลาปัจจุบัน',
            timezone: 'เขตเวลา'
          },
          servers: {
            title: 'เซิร์ฟเวอร์ NTP',
            description:
              'ใช้เซิร์ฟเวอร์สาธารณะเริ่มต้น เราเตอร์ในเครือข่ายของคุณ หรือเซิร์ฟเวอร์ NTP ที่กำหนดเอง',
            useRouter: 'ใช้เราเตอร์',
            useDefaults: 'ใช้ค่าเริ่มต้น',
            presets: 'ค่าเซิร์ฟเวอร์ที่ตั้งไว้ล่วงหน้า',
            presetsDesc: 'แทนที่รายการเซิร์ฟเวอร์ด้วยค่าที่ตั้งไว้ล่วงหน้า'
          }
        },
        firewall: {
          saveFailed: 'ใช้การตั้งค่าไฟร์วอลล์ไม่สำเร็จ',
          saved: 'ใช้การตั้งค่าไฟร์วอลล์แล้ว',
          cancel: 'ยกเลิก',
          refresh: 'รีเฟรช',
          backends: 'แบ็กเอนด์',
          enableHttpsFirst: 'เปิดใช้งาน HTTPS ก่อนเปิดโหมดไฟร์วอลล์ จำกัด หรือ หวาดระแวง',
          httpsRequired:
            'โหมด จำกัด และ หวาดระแวง จะถูกปิดใช้งานจนกว่าจะเปิด HTTPS ที่ การตั้งค่า > เครือข่าย > บริการ',
          mode: {
            title: 'โหมดไฟร์วอลล์',
            baseline: 'พื้นฐาน',
            baselineDesc:
              'โปรไฟล์แบบเปิดเพื่อความเข้ากันได้ ไฟร์วอลล์ทำงานอยู่ แต่ไม่จำกัดแหล่งที่มาขาเข้า ใช้เฉพาะในเครือข่ายที่เชื่อถือได้เท่านั้น',
            moderate: 'ปานกลาง',
            moderateDesc:
              'โปรไฟล์เริ่มต้น คงบริการของ พื้นฐาน ไว้ แต่รับการเชื่อมต่อขาเข้าใหม่จากช่วงส่วนตัว, link-local หรือ loopback เท่านั้น การเข้าถึงขาออกยังคงเปิดอยู่',
            restricted: 'จำกัด',
            restrictedDesc:
              'HTTPS และ SSH เฉพาะภายในเครื่อง รวมถึง DNS, NTP, syslog และการอัปเดตออนไลน์ขาออก DHCP และทราฟฟิก IPv6 ที่จำเป็นยังใช้งานได้ WebRTC ถูกบล็อก',
            paranoid: 'หวาดระแวง',
            paranoidDesc:
              'เข้าถึง HTTPS ได้เฉพาะภายในเครื่อง บล็อก SSH, HTTP, การอัปเดตออนไลน์ และฟีเจอร์เครือข่ายขาออกอื่น ๆ การอัปโหลดอัปเดตแบบออฟไลน์และการติดตั้งที่เตรียมไว้แล้วยังใช้งานได้',
            current: 'ปัจจุบัน',
            default: 'ค่าเริ่มต้น',
            localOnly: 'เฉพาะภายในเครื่อง',
            openTag: 'ขาเข้าเปิด',
            httpsRequiredTag: 'ต้องใช้ HTTPS',
            outboundOpen: 'ขาออกเปิด',
            outboundLimited: 'ขาออกจำกัด',
            httpsOnly: 'เฉพาะ HTTPS'
          },
          moderate: {
            apply: 'สลับไปใช้ ปานกลาง'
          },
          restricted: {
            enable: 'เปิด จำกัด',
            confirmTitle: 'เปิดโหมด จำกัด หรือไม่?',
            confirmDesc:
              'การเข้าถึงผู้ดูแลขาเข้าจะถูกจำกัดไว้ที่ช่วง private IPv4, IPv4 link-local/loopback, IPv6 link-local หรือ IPv6 loopback สำหรับ HTTPS และ SSH ไม่อนุญาตช่วงต้นทางสาธารณะ DNS, NTP, syslog ระยะไกล, อัปเดตออนไลน์, DHCP, การเชื่อมต่อที่สร้างแล้ว และทราฟฟิกควบคุม IPv6 ที่จำเป็นขาออกจะยังใช้งานได้ WebRTC/ICE UDP และทราฟฟิกขาเข้า/ขาออกอื่นจะถูกบล็อก'
          },
          paranoid: {
            enable: 'เปิด หวาดระแวง',
            confirmTitle: 'เปิดโหมด หวาดระแวง หรือไม่?',
            confirmDesc:
              'จะเหลือเฉพาะการเข้าถึง HTTPS จากช่วง private IPv4, IPv4 link-local/loopback, IPv6 link-local หรือ IPv6 loopback เท่านั้น SSH, HTTP, mDNS, NTP, การดาวน์โหลด GitHub และทราฟฟิกอื่นจะถูกบล็อก ยกเว้น DHCP/การควบคุม IPv6 ขั้นต่ำ'
          },
          baseline: {
            apply: 'สลับไปใช้ พื้นฐาน',
            confirmTitle: 'สลับไปใช้โหมด พื้นฐาน แบบเปิดหรือไม่?',
            confirmDesc:
              'บริการไฟร์วอลล์ยังคงทำงานอยู่ แต่จะยกเลิกข้อจำกัดเฉพาะช่วงต้นทางภายในเครื่อง ช่วงต้นทางสาธารณะอาจเข้าถึงบริการ NanoKVM ที่เปิดอยู่ได้หากเครือข่ายส่งต่อให้'
          },
          rules: {
            title: 'กฎปัจจุบัน',
            empty: 'ไม่มีกฎ'
          }
        },
        saveChanges: 'บันทึกการเปลี่ยนแปลง',
        unsaved: 'มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก'
      },
      systemLog: {
        saveFailed: 'บันทึกการตั้งค่าบันทึกไม่สำเร็จ',
        saved: 'บันทึกการตั้งค่าบันทึกแล้ว',
        invalidHost: 'ป้อนโฮสต์เซิร์ฟเวอร์ syslog',
        logLoadFailed: 'โหลดบันทึกไม่สำเร็จ',
        save: 'บันทึก',
        test: 'ส่งบันทึกทดสอบ',
        testSent: 'ส่งบันทึกทดสอบแล้ว',
        testFailed: 'ส่งบันทึกทดสอบไม่สำเร็จ',
        remote: {
          title: 'การบันทึกล็อกระยะไกล',
          forward: 'ส่งต่อบันทึกระบบ',
          description: 'ส่งต่อข้อความระบบไปยังเซิร์ฟเวอร์ระยะไกล',
          host: 'เซิร์ฟเวอร์',
          hostDesc: 'ชื่อโฮสต์หรือที่อยู่ IPv4 ของเซิร์ฟเวอร์ syslog',
          port: 'พอร์ต',
          protocol: 'พอร์ต UDP ของเซิร์ฟเวอร์ syslog'
        },
        local: {
          title: 'บัฟเฟอร์บันทึกระบบ',
          description:
            'บันทึกปัจจุบันถูกเก็บไว้ใน RAM ที่ {{path}} เพื่อหลีกเลี่ยงการเขียนลงการ์ด SD',
          priority: 'ลำดับความสำคัญต่ำสุด',
          priorityDesc: 'ระดับความเร่งด่วนขั้นต่ำของข้อความที่จะถูกบันทึก',
          buffer: 'ขนาดบัฟเฟอร์',
          bufferDesc: 'ขนาดบันทึกที่จะหมุนเวียนไฟล์',
          rotations: 'การหมุนเวียน',
          rotationsDesc: 'จำนวนไฟล์บันทึกที่หมุนเวียนแล้วซึ่งเก็บไว้',
          compact: 'เอาต์พุตแบบย่อ',
          compactDesc: 'ตัดชื่อโฮสต์และ facility ออกจากแต่ละบรรทัด',
          stripTimestamps: 'ลบ timestamp',
          stripTimestampsDesc: 'ลบการประทับเวลาที่ผู้ส่งเพิ่มเข้ามา โดย syslog จะเพิ่มของตัวเอง'
        },
        kernel: {
          title: 'การบันทึกล็อก Kernel',
          enabled: 'ส่งต่อบันทึก kernel',
          enabledDesc: 'เก็บข้อความ kernel ไว้ในบันทึกระบบ',
          consoleLevel: 'ระดับคอนโซล',
          consoleLevelDesc: 'ระดับความเร่งด่วนขั้นต่ำของข้อความ kernel ที่จะแสดงบนคอนโซล'
        },
        viewer: {
          title: 'บันทึกระบบ',
          refresh: 'รีเฟรช',
          empty: 'ไม่มีรายการบันทึก',
          truncated: 'แสดงเฉพาะข้อมูลบันทึกล่าสุด',
          linesUnit: 'บรรทัด'
        },
        level: {
          '1': '1 - แจ้งเตือน',
          '2': '2 - วิกฤต',
          '3': '3 - ข้อผิดพลาด',
          '4': '4 - คำเตือน',
          '5': '5 - หมายเหตุ',
          '6': '6 - ข้อมูล',
          '7': '7 - Debug',
          '8': '8 - ทั้งหมด'
        }
      },
      user: {
        title: 'ผู้ใช้'
      },
      networking: {
        title: 'เครือข่าย'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'อุโมงค์เข้ารหัส',
        device: 'อุปกรณ์นี้',
        description: 'เข้าถึง KVM นี้ผ่านอุโมงค์ WireGuard',
        unavailable: 'ยังไม่ได้ติดตั้ง WireGuard บนอุปกรณ์นี้',
        blocked: 'โหมดไฟร์วอลล์หวาดระแวงจะบล็อก WireGuard',
        needsKey: 'ตั้งค่าคีย์ส่วนตัวก่อนเปิด WireGuard',
        saved: 'บันทึกการตั้งค่า WireGuard แล้ว',
        save: 'บันทึกการเปลี่ยนแปลง',
        unsaved: 'มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก',
        invalid: 'ตรวจสอบช่องที่ไฮไลต์',
        invalidAddress: 'ป้อนที่อยู่พร้อมมาสก์ เช่น 10.0.0.1/24',
        invalidKey: 'ป้อนคีย์ WireGuard ความยาว 44 ตัวอักษร',
        invalidEndpoint: 'ป้อนชื่อโฮสต์หรือที่อยู่ IP',
        invalidPort: 'ป้อนพอร์ตตั้งแต่ 1 ถึง 65535',
        invalidRanges: 'ใช้ช่วง IPv4 เช่น 10.0.0.0/24 ไม่ใช่ 0.0.0.0/0',
        status: {
          connected: 'เชื่อมต่อแล้ว',
          waiting: 'กำลังรอเพียร์',
          stopped: 'หยุดแล้ว',
          handshake: 'แฮนด์เชคล่าสุด {{time}}'
        },
        privateKey: {
          title: 'คีย์ส่วนตัว',
          description: 'เก็บไว้บนอุปกรณ์นี้และจะไม่แสดงอีก',
          set: 'ตั้งค่าแล้ว',
          notSet: 'ยังไม่ได้ตั้งค่า',
          setBtn: 'ตั้งค่า',
          generate: 'สร้าง',
          remove: 'ลบ',
          modalTitle: 'ตั้งค่าคีย์ส่วนตัว',
          modalDescription: 'คีย์จะถูกเก็บไว้บนอุปกรณ์นี้และจะไม่แสดงอีก',
          placeholder: 'วางคีย์ส่วนตัว',
          generateConfirmTitle: 'สร้างคีย์ส่วนตัวใหม่หรือไม่',
          generateConfirmDesc: 'คีย์ปัจจุบันจะใช้งานไม่ได้ จากนั้นให้เพิ่มคีย์สาธารณะใหม่ในเพียร์',
          removeConfirmTitle: 'ลบคีย์ส่วนตัวหรือไม่',
          removeConfirmDesc: 'WireGuard จะถูกปิดและจะปิดอยู่จนกว่าจะตั้งค่าคีย์ใหม่'
        },
        publicKey: {
          title: 'คีย์สาธารณะ',
          description: 'เพิ่มลงในการตั้งค่าของเพียร์'
        },
        address: {
          title: 'ที่อยู่',
          description: 'ที่อยู่ของ KVM ในอุโมงค์และมาสก์'
        },
        peer: {
          title: 'เพียร์',
          publicKey: 'คีย์สาธารณะ',
          publicKeyDescription: 'คีย์สาธารณะของเพียร์ที่คุณเชื่อมต่อ',
          server: 'เซิร์ฟเวอร์',
          serverDescription: 'ชื่อโฮสต์หรือที่อยู่ IP ของเพียร์',
          port: 'พอร์ต',
          portDescription: 'พอร์ต UDP ของเพียร์ ปกติคือ 51820',
          allowedIps: 'IP ที่อนุญาต',
          allowedIpsDescription: 'ที่อยู่หรือช่วงของเพียร์ในอุโมงค์ เช่น 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription:
            'จำนวนวินาทีระหว่างแพ็กเก็ต keepalive ที่จำเป็นเมื่ออยู่หลังเราเตอร์'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'เข้าถึง KVM นี้ผ่านเครือข่าย Tailscale ของคุณ',
        service: 'บริการ',
        performance: 'ประสิทธิภาพ',
        memory: {
          title: 'การปรับแต่งหน่วยความจำ',
          tip: 'ช่วยคุมการใช้หน่วยความจำของ Tailscale ให้ต่ำ ซึ่งมีประโยชน์กับอุปกรณ์ที่มี RAM น้อย รีสตาร์ท Tailscale เพื่อให้การเปลี่ยนแปลงมีผล'
        },
        swap: {
          title: 'ไฟล์สลับ',
          tip: 'หากปัญหายังคงมีอยู่หลังจากเปิดใช้งานการเพิ่มประสิทธิภาพหน่วยความจำ ให้ลองเปิดใช้งานไฟล์สลับ',
          sizeTip: 'การตั้งค่านี้กำหนดขนาดไฟล์เป็น 128MB ปรับได้ที่ การตั้งค่า > ระบบ > ประสิทธิภาพ'
        },
        restartTitle: 'รีสตาร์ท Tailscale',
        restartDesc: 'รีสตาร์ทบริการ',
        restartBtn: 'รีสตาร์ท',
        restart: 'คุณแน่ใจที่จะรีสตาร์ท Tailscale หรือไม่?',
        stopTitle: 'หยุด Tailscale',
        stopBtn: 'หยุด',
        stop: 'คุณแน่ใจที่จะปิด Tailscale หรือไม่?',
        stopDesc: 'หยุดบริการและไม่ให้เริ่มทำงานเมื่อเปิดเครื่อง',
        loading: 'กำลังโหลด...',
        notInstall: 'ไม่พบ Tailscale กรุณาติดตั้ง',
        install: 'ติดตั้ง',
        installing: 'กำลังติดตั้ง',
        failed: 'การติดตั้งล้มเหลว',
        retry: 'กรุณารีเฟรชและลองใหม่ หรือติดตั้งด้วยตนเอง',
        download: 'ดาวน์โหลด',
        package: 'แพ็กเกจการติดตั้ง',
        unzip: 'และแตกไฟล์',
        upTailscale: 'อัปโหลด tailscale ไปยังไดเรกทอรี /usr/bin/ ของ NanoKVM',
        upTailscaled: 'อัปโหลด tailscaled ไปยังไดเรกทอรี /usr/sbin/ ของ NanoKVM',
        refresh: 'รีเฟรชหน้าปัจจุบัน',
        notRunning: 'Tailscale ไม่ทำงาน กรุณาเริ่มต้นเพื่อดำเนินการต่อ',
        run: 'เริ่ม',
        notLogin: 'อุปกรณ์ยังไม่ได้ผูกบัญชี กรุณาล็อกอินและผูกอุปกรณ์นี้กับบัญชีของคุณ',
        urlPeriod: 'ลิงก์นี้ใช้ได้ 10 นาที',
        login: 'ล็อกอิน',
        loginSuccess: 'ล็อกอินสำเร็จ',
        deviceName: 'ชื่ออุปกรณ์',
        deviceIP: 'IP อุปกรณ์',
        account: 'บัญชีผู้ใช้',
        logout: 'ออกจากระบบ',
        logoutDesc: 'คุณแน่ใจที่จะออกจากระบบหรือไม่?',
        uninstall: 'ถอนการติดตั้ง Tailscale',
        uninstallDesc: 'คุณแน่ใจหรือไม่ว่าต้องการถอนการติดตั้ง Tailscale',
        okBtn: 'ใช่',
        cancelBtn: 'ไม่ใช่'
      },
      update: {
        title: 'อัปเดต',
        currentVersion: 'เวอร์ชันปัจจุบัน',
        latestVersion: 'เวอร์ชันล่าสุด',
        queryFailed: 'ไม่สามารถรับข้อมูลเวอร์ชันได้',
        updateFailed: 'การอัปเดตล้มเหลว',
        paranoidBlocked: 'การอัปเดตออนไลน์ถูกบล็อกโดยโหมดไฟร์วอลล์ หวาดระแวง',
        paranoidBlockedDesc:
          'การตรวจสอบและดาวน์โหลดจาก GitHub ต้องใช้เครือข่ายขาออก การอัปโหลด offline และการติดตั้งที่เตรียมไว้แล้วยังใช้งานได้',
        available: 'มีการอัปเดตใหม่ คุณแน่ใจที่จะอัปเดตหรือไม่?',
        updating: 'กำลังเริ่มอัปเดต',
        confirm: 'ยืนยัน',
        cancel: 'ยกเลิก',
        badge: {
          checking: 'กำลังตรวจสอบ',
          latest: 'เป็นปัจจุบัน',
          available: 'มีอัปเดต',
          failed: 'ตรวจสอบไม่สำเร็จ',
          local: 'ในเครื่อง'
        },
        application: {
          title: 'แอปพลิเคชัน'
        },
        system: {
          queryFailed: 'รับเวอร์ชันระบบล้มเหลว',
          appUpdateRequired: 'อัปเดตแอปพลิเคชันเป็น {{version}} ก่อนติดตั้งการอัปเดตระบบนี้',
          requiredAppVersion: 'เวอร์ชันแอปพลิเคชันที่จำเป็น',
          downloadFailed: 'ดาวน์โหลดหรือตรวจสอบล้มเหลว',
          available: 'มีอัปเดตระบบพื้นฐานให้ใช้งาน',
          downloading: 'กำลังดาวน์โหลดและตรวจสอบอัปเดตระบบ...',
          downloadVerify: 'ดาวน์โหลดและตรวจสอบ',
          installing: 'กำลังติดตั้งอัปเดตระบบที่เตรียมไว้...',
          install: 'ติดตั้ง',
          installFailed: 'ติดตั้งล้มเหลว',
          installConfirmTitle: 'ติดตั้งอัปเดตระบบ?',
          installConfirmDesc: 'สิ่งนี้จะแทนที่ไฟล์ระบบพื้นฐานจากแพ็กเกจที่ตรวจสอบแล้ว ต้องรีบูต',
          rawInstallConfirmDesc:
            'แพ็กเกจที่ตรวจสอบแล้วนี้จะเขียนอิมเมจ raw boot/rootfs ลงพาร์ทิชัน SD card และรีบูตอัตโนมัติ การเขียนอาจใช้เวลาหลายนาที โปรดต่อไฟเลี้ยงไว้',
          rawInstallWarning:
            'ไม่มี rollback อัตโนมัติสำหรับอัปเดตพาร์ทิชัน raw หาก boot ไม่สำเร็จ ให้กู้คืน SD card ด้วยตนเอง',
          rawWaitTitle: 'กำลังติดตั้งอัปเดตระบบ',
          rawWaitWriting: 'กำลังเขียนระบบใหม่ลงใน SD card',
          rawWaitRestarting: 'กำลังรีสตาร์ทอุปกรณ์ หน้านี้จะโหลดใหม่เมื่ออุปกรณ์กลับมา',
          rawWaitDesc: 'ขั้นตอนนี้ใช้เวลาประมาณสามนาที เสียบไฟค้างไว้และอย่าปิดหน้านี้',
          rawWaitSlow: 'ใช้เวลานานกว่าที่คาดไว้ โปรดรออีกสองสามนาทีก่อนตัดไฟ',
          rebootRequired: 'ต้องรีบูตเพื่อเปิดใช้สถานะระบบนี้',
          rollingBack: 'กำลัง rollback อัปเดตระบบ...',
          rollback: 'Rollback',
          rollbackDone: 'เตรียม rollback แล้ว',
          rollbackFailed: 'Rollback ล้มเหลว',
          rollbackConfirmTitle: 'Rollback อัปเดตระบบ?',
          rollbackConfirmDesc: 'สิ่งนี้จะกู้คืนไฟล์จากสำรองอัปเดตระบบล่าสุด ต้องรีบูต',
          stagedDesc: 'ดาวน์โหลดและตรวจสอบไฟล์อัปเดตระบบแล้ว ตอนนี้ติดตั้งได้',
          refresh: 'รีเฟรช',
          releaseNotes: 'บันทึกรุ่น',
          systemVersion: 'เวอร์ชันระบบ',
          kernel: 'Kernel',
          stagedVersion: 'เวอร์ชันที่เตรียมไว้',
          archive: 'ไฟล์เก็บถาวร',
          requiredFree: 'พื้นที่ว่างที่ต้องใช้',
          fileCount: 'ไฟล์',
          rawImages: 'อิมเมจ raw',
          progress: 'ความคืบหน้า',
          progressMessage: 'ข้อความความคืบหน้า',
          pendingVersion: 'เวอร์ชันที่รออยู่',
          bootHealth: 'สถานะ boot',
          healthy: 'ปกติ',
          unhealthy: 'ต้องตรวจสอบ',
          rollbackBackup: 'สำรอง rollback'
        },
        offline: {
          title: 'อัปโหลดแพ็กเกจแอปพลิเคชัน',
          desc: 'ติดตั้งแพ็กเกจแอปพลิเคชันจากคอมพิวเตอร์เครื่องนี้ จากนั้นเซิร์ฟเวอร์จะเริ่มต้นใหม่',
          installTitle: 'ติดตั้งอัปเดตแอปพลิเคชัน?',
          installDesc:
            'แอปพลิเคชันจะถูกแทนที่และเซิร์ฟเวอร์จะเริ่มต้นใหม่ คุณต้องเข้าสู่ระบบอีกครั้ง'
        },
        local: {
          title: 'อัปโหลดแพ็กเกจระบบ',
          desc: 'ติดตั้งแพ็กเกจระบบจากคอมพิวเตอร์เครื่องนี้ ไฟล์เดียวมีทั้งไฟล์เก็บถาวรและเมทาดาทาที่ลงนามแล้ว',
          choose: 'เลือกไฟล์',
          invalidFile: 'เลือกแพ็กเกจที่ลงท้ายด้วย .tar หรือ .tar.gz',
          diskTitle: 'ปิดดิสก์เสมือนหรือไม่',
          diskWarn:
            'แพ็กเกจจะถูกบันทึกไว้ที่ /data ซึ่งอ่านได้อย่างเดียวขณะที่ดิสก์เสมือนเปิดอยู่ เมื่อปิดแล้วคอมพิวเตอร์จะเข้าถึง /data ไม่ได้อีกต่อไป ดำเนินการต่อหรือไม่',
          uploading: 'กำลังอัปโหลด',
          verifying: 'กำลังตรวจสอบและเตรียมแพ็กเกจ',
          keyTitle: 'คีย์อัปเดตในเครื่อง',
          keyDesc: 'คีย์สาธารณะรูปแบบ PEM ที่ลงนามแพ็กเกจที่คุณสร้างเองได้',
          keyNone: 'ยังไม่ได้ตั้งคีย์',
          keySet: 'ตั้งคีย์',
          keyRemove: 'ลบ',
          signer: 'ลงนามโดย',
          section: 'อัปเดตในเครื่อง',
          keyRequired: 'ต้องมีคีย์ภายในเครื่อง'
        }
      },
      account: {
        title: 'บัญชี',
        webAccount: 'ชื่อผู้ใช้',
        password: 'รหัสผ่าน',
        passwordDesc: 'เปลี่ยนรหัสผ่านที่ใช้เข้าสู่ระบบเว็บอินเทอร์เฟซ',
        updateBtn: 'เปลี่ยน',
        logoutBtn: 'ออกจากระบบ',
        logoutDesc: 'คุณแน่ใจที่จะออกจากระบบหรือไม่?',
        okBtn: 'ใช่',
        cancelBtn: 'ไม่ใช่',
        session: {
          title: 'เซสชัน'
        },
        logoutOnClose: {
          title: 'ออกจากระบบเมื่อปิดเบราว์เซอร์',
          description: 'สิ้นสุดเซสชันเมื่อปิดเบราว์เซอร์ แทนที่จะคงไว้'
        },
        totp: {
          title: 'การยืนยันตัวตนสองขั้นตอน',
          authenticator: 'แอปยืนยันตัวตน',
          description: 'ต้องใช้รหัสตามเวลาจากแอปยืนยันตัวตนนอกเหนือจากรหัสผ่าน',
          required: 'นโยบายบังคับใช้',
          disable: 'ปิด',
          enableTitle: 'ตั้งค่าการยืนยันตัวตนสองขั้นตอน',
          enableDescription:
            'ยืนยันรหัสผ่านของคุณเพื่อดำเนินการต่อ ต้องใช้ทุกครั้งที่เปลี่ยนปัจจัยที่สอง',
          continue: 'ดำเนินการต่อ',
          disableTitle: 'ปิดการยืนยันตัวตนสองขั้นตอนหรือไม่',
          disableDescription:
            'บัญชีของคุณจะได้รับการปกป้องด้วยรหัสผ่านเท่านั้น ยืนยันด้วยรหัสผ่านของคุณเพื่อดำเนินการต่อ',
          disableFailed: 'ไม่สามารถปิดการยืนยันตัวตนสองขั้นตอนได้',
          passwordPlaceholder: 'รหัสผ่านปัจจุบัน',
          enrollFailed: 'ไม่สามารถเริ่มการตั้งค่าได้',
          invalidCode: 'รหัสนี้ไม่ตรงกัน ลองรหัสถัดไป',
          scan: 'สแกนสิ่งนี้ด้วยแอปยืนยันตัวตนของคุณ',
          manualEntry: 'หรือกรอกคีย์นี้ด้วยตนเอง:',
          codePlaceholder: 'กรอกรหัส 6 หลักเพื่อยืนยัน',
          confirm: 'ยืนยัน',
          cancel: 'ยกเลิก',
          backupTitle: 'บันทึกรหัสสำรองของคุณตอนนี้',
          backupDescription:
            'แต่ละรหัสใช้ได้เพียงครั้งเดียวและจะไม่แสดงอีก เป็นทางเดียวที่จะกลับเข้ามาได้หากคุณทำแอปยืนยันตัวตนหาย และยังใช้ได้แม้นาฬิกาของอุปกรณ์ยังไม่ซิงค์',
          copy: 'คัดลอก',
          copied: 'คัดลอกรหัสสำรองแล้ว',
          savedThem: 'ฉันบันทึกแล้ว',
          remaining: 'เหลือรหัสสำรอง {{remaining}} รหัส',
          clockUnsynced:
            'นาฬิกาของอุปกรณ์ยังไม่ซิงค์ ซิงค์เวลาที่ การตั้งค่า > ระบบ > เวลา ก่อนตั้งค่า',
          noBackupCodes: 'ไม่เหลือรหัสสำรองแล้ว เลือก สร้าง เพื่อออกชุดใหม่',
          regenerate: 'รหัสสำรองใหม่',
          generate: 'สร้าง',
          regenerateTitle: 'ออกรหัสสำรองใหม่หรือไม่',
          regenerateDescription:
            'รหัสสำรองปัจจุบันของคุณจะใช้ไม่ได้อีก ยืนยันด้วยรหัสผ่านของคุณเพื่อดำเนินการต่อ',
          regenerateFailed: 'ไม่สามารถออกรหัสสำรองใหม่ได้',
          download: 'ดาวน์โหลด',
          copyFailed: 'คัดลอกไม่สำเร็จ เลือกรหัสแล้วคัดลอกด้วยตนเอง',
          requireTitle: 'บังคับใช้การยืนยันตัวตนสองขั้นตอน',
          requireDescription:
            'ป้องกันไม่ให้ปิดการยืนยันตัวตนสองขั้นตอน และบัญชีที่ยังไม่มีต้องตั้งค่าก่อนใช้งานอุปกรณ์',
          requireFailed: 'ไม่สามารถเปลี่ยนข้อกำหนดได้',
          requiredTitle: 'ต้องใช้การยืนยันตัวตนสองขั้นตอน',
          requiredDescription:
            'อุปกรณ์นี้ถูกตั้งค่าให้ต้องใช้ปัจจัยที่สอง แต่บัญชีของคุณยังไม่ได้ตั้งค่า ตั้งค่าตอนนี้เพื่อดำเนินการต่อ'
        }
      }
    },
    picoclaw: {
      title: 'ผู้ช่วย PicoClaw',
      empty: 'อธิบายงานเพื่อเริ่มต้น',
      inputPlaceholder: 'อธิบายสิ่งที่คุณต้องการให้ PicoClaw ทำ',
      newConversation: 'บทสนทนาใหม่',
      processing: 'กำลังประมวลผล...',
      agent: {
        defaultTitle: 'ผู้ช่วยทั่วไป',
        defaultDescription: 'แชททั่วไป การค้นหา และพื้นที่ช่วยเหลือ',
        kvmTitle: 'การควบคุมระยะไกล',
        kvmDescription: 'ใช้งานโฮสต์ระยะไกลผ่าน NanoKVM',
        switched: 'เปลี่ยนบทบาทตัวแทนแล้ว',
        switchFailed: 'ไม่สามารถเปลี่ยนบทบาทตัวแทนได้'
      },
      send: 'ส่ง',
      cancel: 'ยกเลิก',
      status: {
        connecting: 'กำลังเชื่อมต่อกับเกตเวย์...',
        connected: 'เชื่อมต่อเซสชัน PicoClaw แล้ว',
        disconnected: 'ตัดการเชื่อมต่อเซสชัน PicoClaw แล้ว',
        stopped: 'ส่งคำขอหยุดแล้ว',
        runtimeStarted: 'เริ่ม Runtime PicoClaw แล้ว',
        runtimeStartFailed: 'ไม่สามารถเริ่ม Runtime PicoClaw ได้',
        runtimeStopped: 'หยุด Runtime PicoClaw แล้ว',
        runtimeStopFailed: 'ไม่สามารถหยุด Runtime PicoClaw ได้'
      },
      connection: {
        runtime: {
          checking: 'กำลังตรวจสอบ',
          ready: 'Runtime พร้อมใช้งาน',
          stopped: 'หยุด Runtime แล้ว',
          unavailable: 'Runtime ไม่พร้อมใช้งาน',
          configError: 'ข้อผิดพลาดในการกำหนดค่า'
        },
        transport: {
          connecting: 'กำลังเชื่อมต่อ',
          connected: 'เชื่อมต่อแล้ว'
        },
        run: {
          idle: 'ไม่ได้ใช้งาน',
          busy: 'ไม่ว่าง'
        }
      },
      error: {
        lockHeld: 'PicoClaw กำลังถูกใช้งานในหน้าต่างอื่น',
        takenOver: 'หน้าต่างอื่นเข้าควบคุม PicoClaw แล้ว',
        authFailed: 'PicoClaw ปฏิเสธการเชื่อมต่อ',
        upstreamClosed: 'การเชื่อมต่อกับ PicoClaw ขาดหาย'
      },
      tool: {
        screenshot: 'กำลังจับภาพหน้าจอ',
        loadImage: 'กำลังดูภาพหน้าจอ',
        actions: 'กำลังควบคุมโฮสต์',
        generic: 'กำลังใช้ {{name}}',
        type: 'กำลังพิมพ์ {{text}}',
        hotkey: 'กำลังกด {{keys}}',
        click: 'กำลังคลิก',
        doubleClick: 'กำลังดับเบิลคลิก',
        move: 'กำลังเลื่อนเมาส์',
        drag: 'กำลังลาก',
        scroll: 'กำลังเลื่อน',
        wait: 'กำลังรอ'
      },
      message: {
        toolAction: 'การกระทำ',
        observation: 'การสังเกต',
        screenshot: 'ภาพหน้าจอ'
      },
      overlay: {
        locked: 'PicoClaw กำลังควบคุมอุปกรณ์ การป้อนข้อมูลด้วยตนเองถูกหยุดชั่วคราว'
      },
      install: {
        install: 'ติดตั้ง PicoClaw',
        installing: 'กำลังติดตั้ง PicoClaw',
        success: 'PicoClaw ติดตั้งสำเร็จแล้ว',
        failed: 'ไม่สามารถติดตั้ง PicoClaw',
        uninstalled: 'ถอนการติดตั้ง PicoClaw สำเร็จแล้ว',
        uninstallFailed: 'การถอนการติดตั้งล้มเหลว',
        requiredTitle: 'PicoClaw ไม่ได้ติดตั้ง',
        requiredDescription: 'ติดตั้ง PicoClaw ก่อนที่จะเริ่ม Runtime PicoClaw',
        progressDescription: 'PicoClaw กำลังดาวน์โหลดและติดตั้ง',
        stages: {
          preparing: 'กำลังเตรียมการ',
          downloading: 'กำลังดาวน์โหลด',
          extracting: 'กำลังแตกไฟล์',
          verifying: 'กำลังตรวจสอบ',
          installing: 'กำลังติดตั้ง',
          installed: 'ติดตั้งแล้ว',
          install_timeout: 'หมดเวลา',
          install_failed: 'ล้มเหลว'
        }
      },
      model: {
        requiredTitle: 'จำเป็นต้องมีการกำหนดค่าโมเดล',
        requiredDescription: 'กำหนดค่าโมเดล PicoClaw ก่อนใช้แชท PicoClaw',
        docsTitle: 'คู่มือการกำหนดค่า',
        docsDesc: 'รุ่นและโปรโตคอลที่รองรับ',
        menuLabel: 'กำหนดค่าโมเดล',
        modelIdentifier: 'ตัวระบุรุ่น',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'URL ฐานของ API',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'คีย์ API',
        apiKeyPlaceholder: 'ป้อนคีย์ API ของโมเดล',
        apiKeyKeepPlaceholder: 'เว้นว่างไว้เพื่อใช้คีย์ปัจจุบัน',
        save: 'บันทึก',
        saving: 'กำลังบันทึก',
        saved: 'บันทึกการกำหนดค่าโมเดลแล้ว',
        saveFailed: 'ไม่สามารถบันทึกการกำหนดค่าโมเดลได้',
        invalid: 'ต้องระบุรหัสโมเดล, URL ฐานของ API และคีย์ API'
      },
      uninstall: {
        confirmTitle: 'ถอนการติดตั้ง PicoClaw',
        confirmContent:
          'คุณแน่ใจหรือไม่ว่าต้องการถอนการติดตั้ง PicoClaw การดำเนินการนี้จะลบไฟล์ปฏิบัติการและไฟล์การกำหนดค่าทั้งหมด',
        confirmOk: 'ถอนการติดตั้ง'
      },
      history: {
        title: 'ประวัติ',
        loading: 'กำลังโหลดเซสชัน...',
        emptyTitle: 'ยังไม่มีประวัติ',
        emptyDescription: 'เซสชัน PicoClaw ก่อนหน้าจะปรากฏที่นี่',
        loadFailed: 'ไม่สามารถโหลดประวัติเซสชันได้',
        deleteFailed: 'ไม่สามารถลบเซสชันได้',
        deleteConfirmTitle: 'ลบเซสชัน',
        deleteConfirmContent: 'คุณแน่ใจหรือไม่ว่าต้องการลบ "{{title}}"',
        deleteConfirmOk: 'ลบ',
        messageCount_other: '{{count}} ข้อความ'
      },
      config: {
        startRuntime: 'เริ่ม PicoClaw',
        stopRuntime: 'หยุด PicoClaw',
        stopConfirm: 'คุณแน่ใจที่จะปิด PicoClaw หรือไม่?'
      },
      start: {
        title: 'เริ่ม PicoClaw',
        description: 'เริ่ม Runtime เพื่อเริ่มใช้ผู้ช่วย PicoClaw'
      }
    },
    error: {
      title: 'เราเจอปัญหา',
      refresh: 'รีเฟรช'
    },
    fullscreen: {
      toggle: 'โหมดเต็มหน้าจอ'
    },
    menu: {
      collapse: 'ย่อเมนู'
    }
  }
};

export default th;
