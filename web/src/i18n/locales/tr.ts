const tr = {
  translation: {
    common: {
      confirm: 'Onayla',
      cancel: 'İptal',
      close: 'Kapat',
      save: 'Kaydet',
      discard: 'Vazgeç',
      delete: 'Sil',
      actionFailed: 'İşlem başarısız oldu',
      loading: 'Ayarlar cihazdan yükleniyor...',
      loadFailed: 'Ayarlar cihazdan yüklenemedi',
      retry: 'Yeniden dene'
    },
    head: {
      desktop: 'Uzak masaüstü',
      login: 'Giriş',
      firstSetup: 'İlk kurulum',
      changePassword: 'Şifreyi değiştir',
      terminal: 'Uçbirim',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Giriş',
      placeholderUsername: 'Kullanıcı adı',
      placeholderPassword: 'Şifre',
      placeholderPassword2: 'Şifrenizi tekrar girin',
      noEmptyUsername: 'Kullanıcı adı gereklidir',
      noEmptyPassword: 'Şifre gereklidir',
      invalidUser: 'Yanlış kullanıcı adı ya da şifre',
      locked: 'Çok fazla giriş yapıldı, lütfen daha sonra tekrar deneyin',
      globalLocked: 'Sistem koruma altında, lütfen daha sonra tekrar deneyin',
      error: 'Beklenmedik bir hata',
      changePassword: 'Şifrenizi değiştiriniz',
      changePasswordDesc: 'Güvenlik sebebiyle lütfen şifrenizi değiştiriniz',
      differentPassword: 'Şifreler eşleşmemektedir',
      illegalUsername: 'Kullanıcı adı istenmeyen karakterler içermektedir',
      illegalPassword:
        'Şifre en az 8 karakter olmalı ve tırnak işareti veya eğik çizgi içermemelidir',
      forgetPassword: 'Şifremi unuttum',
      ok: 'Tamam',
      cancel: 'İptal',
      loginButtonText: 'Giriş',
      setupTitle: 'Yönetici hesabı oluştur',
      setupDescription:
        'Bu cihazda henüz web hesabı yok. Devam etmek için ilk yönetici hesabını oluşturun.',
      setupRecovery: 'Bu parola kaybolursa kurtarma için SD kartın yeniden yazılması gerekir',
      setupButtonText: 'Hesap oluştur',
      tips: {
        hardenedRecovery:
          'Bu Hardened imajı BOOT düğmesinden parola sıfırlamayı desteklemez. Parola kaybolursa SD kartı yeniden yazın ve yeni hesap oluşturun.',
        change1: 'Bu işlem şu şifreleri değiştiricektir:',
        change2: 'Arayüz giriş şifresi',
        change3: 'SSH girişi için root sistem şifresi'
      },
      placeholderCurrentPassword: 'Mevcut şifre',
      placeholderNewPassword: 'Yeni şifre',
      wrongCurrentPassword: 'Mevcut şifre yanlış',
      totp: {
        title: 'İki adımlı doğrulama',
        prompt: 'Kimlik doğrulama uygulamanızdaki 6 haneli kodu girin',
        backupPrompt: 'Yedek kodlarınızdan birini girin',
        noEmptyCode: 'Bir kod girin',
        placeholderCode: '6 haneli kod',
        placeholderBackup: 'Yedek kod',
        verifyButtonText: 'Doğrula',
        useBackupCode: 'Yedek kod kullan',
        useAuthenticator: 'Kimlik doğrulama uygulaması kodunu kullan',
        cancel: 'Geri',
        invalidCode: 'Bu kod geçerli değil. Tekrar deneyin.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'NanoKVM için Wi-Fi ayarlarını ayarlayın',
      success: "NanoKVM'in ağ durumunu kontrol etmek için cihazın başına gidin",
      failed: 'İşlem başarısız oldu, lütfen tekrar deneyiniz',
      invalidMode:
        'Geçerli mod ağ kurulumunu desteklemiyor. Lütfen cihazınıza gidin ve Wi-Fi yapılandırma modunu etkinleştirin.',
      confirmBtn: 'Tamam',
      finishBtn: 'Bitti',
      ap: {
        authTitle: 'Kimlik doğrulaması gerekli',
        authDescription: 'Devam etmek için lütfen AP şifresini girin',
        authFailed: 'Geçersiz AP şifresi',
        passPlaceholder: 'AP şifresi',
        verifyBtn: 'Doğrula'
      }
    },
    screen: {
      scale: 'Ölçek',
      title: 'Ekran',
      video: 'Görüntü modu',
      videoDirectTips:
        'Bu modu kullanmak için "Ayarlar > Ağ > Hizmetler" bölümünde HTTPS\'i etkinleştirin',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC, Kısıtlı ve Paranoyak güvenlik duvarı modlarında devre dışıdır',
      transferRunningTitle: 'İmaj aktarımı sürüyor',
      transferRunningDesc:
        'Video modunu değiştirmek sayfayı yeniden yükler ve devam eden imaj yükleme veya indirme işlemini iptal eder.',
      transferRunningOk: 'Modu değiştir',
      resolution: 'Çözünürlük',
      auto: 'Otomatik',
      autoTips:
        'Belirli çözünürlüklerde ekran yırtılması veya fare kayması olabilir, bu yüzden uzak ana bilgisayarın çözünürlüğünü ayarlayın veya otomatik modu devre dışı bırakın',
      fps: 'Saniyedeki kare sayısı',
      customizeFps: 'Kişiselleştir',
      quality: 'Kalite',
      qualityLossless: 'Kayıpsız',
      qualityHigh: 'Yüksek',
      qualityMedium: 'Orta',
      qualityLow: 'Düşük',
      frameDetect: 'Kareleri algıla',
      frameDetectTip:
        'Kareleri karşılaştırır ve uzak ana bilgisayarın ekranı değişmediği sürece video göndermeyi durdurur',
      resetHdmi: 'HDMI sıfırla',
      webrtcConnectionFailed: {
        title: 'WebRTC bağlantısı başarısız',
        description: 'Ağ bağlantısını kontrol edin veya video modunu değiştirin'
      },
      captureStatus: {
        hdmiError: 'HDMI ekran hatası',
        unsupportedResolution: 'Geçerli çözünürlük desteklenmiyor',
        retrieving: 'Ekran alınıyor...',
        changingResolution: 'Çözünürlük değiştiriliyor...',
        updateFailed: 'Ekran şu anda güncellenemiyor',
        videoError: 'Video görüntüleme hatası',
        noHdmi: 'HDMI sinyali algılanmadı',
        unavailable: 'Ekran şu anda gösterilemiyor'
      }
    },
    keyboard: {
      title: 'Klavye',
      paste: 'Yapıştır',
      tips: 'Sadece standart klavye harfleri ve sembolleri desteklenmektedir',
      placeholder: 'Yapıştırılacak metin',
      local: 'Mobil klavye',
      virtual: 'Ekran klavyesi',
      readClipboard: 'Panodan oku',
      clipboardPermissionDenied: 'Pano izni reddedildi, tarayıcınızda pano erişimine izin verin',
      clipboardReadError: 'Pano okunamadı',
      dropdownEnglish: 'İngilizce',
      dropdownGerman: 'Almanca',
      dropdownFrench: 'Fransızca',
      dropdownRussian: 'Rusça',
      dropdownKorean: 'Korece',
      dropdownJapanese: 'Japonca',
      localInput: 'Mobil klavye girişi',
      shortcut: {
        title: 'Kısayollar',
        custom: 'Özel',
        capture: 'Kısayolu yakalamak için burayı tıklayın',
        clear: 'Temizle',
        save: 'Kaydet',
        captureTips:
          'Windows tuşu gibi sistem düzeyi tuşları yakalamak için tam ekran izni gerekir',
        enterFullScreen: 'Tam ekran moduna geçiş yapın'
      },
      leaderKey: {
        title: 'Leader tuşu',
        desc: 'Tarayıcı kısıtlamalarını atlayın ve sistem kısayollarını doğrudan uzak ana bilgisayara gönderin',
        howToUse: 'Nasıl kullanılır',
        simultaneous: {
          title: 'Eşzamanlı mod',
          desc1: 'Leader tuşunu basılı tutun, ardından kısayola basın.',
          desc2: 'Sezgisel, ancak sistem kısayollarıyla çakışabilir.'
        },
        sequential: {
          title: 'Sıralı mod',
          desc1: 'Leader tuşuna basın → kısayola sırayla basın → Leader tuşuna tekrar basın.',
          desc2: 'Daha fazla adım gerektirir ancak sistem çakışmalarını tamamen önler.'
        },
        enable: 'Leader tuşunu etkinleştir',
        tip: 'Leader tuşu olarak atandığında bu tuş yalnızca kısayol tetikleyici olarak çalışır ve varsayılan davranışını kaybeder.',
        placeholder: 'Leader tuşuna basın',
        shiftRight: 'Sağ Shift',
        ctrlRight: 'Sağ Ctrl',
        metaRight: 'Sağ Win',
        recorder: {
          rec: 'KAYIT',
          activate: 'Tuşları etkinleştir',
          input: 'Kısayola basın'
        }
      }
    },
    mouse: {
      title: 'Fare',
      cursor: 'İmleç sitili',
      default: 'Varsayılan imleç',
      cell: 'Artı imleç',
      text: 'Yazı imleç',
      grab: 'El imleç',
      hide: 'İmleci gizle',
      mode: 'Fare modu',
      absolute: 'Mutlak fare modu',
      relative: 'Bağıl fare modu',
      direction: 'Kaydırma tekerleği yönü',
      scrollUp: 'Yukarı kaydır',
      scrollDown: 'Aşağı kaydır',
      speed: 'Kaydırma tekerleği hızı',
      sensitivity: 'İşaretçi hızı',
      sensitivityDesc:
        'Masaüstü göreli modu için: daha düşük değerler host fare ivmesinden kaynaklanan kaymayı azaltır',
      fast: 'Hızlı',
      slow: 'Yavaş',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'KVM alanının herhangi bir yerinde hareket edin; uzak imleç dokunuşlar arasında konumunu korur ve mutlak HID ile senkron kalır'
      },
      requestPointer: 'Bağıl fare modu kullanılıyor, imleci almak için masaüstüne tıklayın',
      resetHid: "HID'yi sıfırla",
      hidOnly: {
        title: 'HID-Only modu',
        desc: "Fare veya klavye yanıt vermeyi bırakır ve HID'i sıfırlamak yardımcı olmazsa, NanoKVM ile ana bilgisayar arasında bir uyumluluk sorunu olabilir.",
        tip1: 'HID-Only modunu etkinleştirmek sanal diski ve sanal ağı bağlantıdan çıkarır',
        tip2: 'HID-Only modunda imaj bağlama devre dışıdır',
        tip3: 'NanoKVM mod değişiminden sonra kendiliğinden yeniden başlatılacaktır',
        enable: 'HID-Only modunu etkinleştir',
        disable: 'HID-Only modunu devre dışı bırak'
      }
    },
    image: {
      title: 'Disk imajları',
      loading: 'Yükleniyor...',
      empty: 'Hiçbir şey bulunamadı',
      mountMode: 'Şu olarak bağla',
      mount: 'Bağla',
      orDownload: 'Veya bir bağlantıdan indir',
      keepRunning:
        'Bu pencereyi kapatabilirsiniz. Aktarım devam eder ve ilerlemesi imaj listesinde görünür.',
      massStorage: 'Yığın depolama',
      cdRom: 'CD-ROM',
      mountFailed: 'Bağlama başarısız oldu',
      mountDesc:
        'Bazı sistemlerde, disk imajını bağlamadan önce uzak ana bilgisayardaki sanal diski çıkarmak gerekir',
      diskOnWarn:
        'İmajı bağlamak sanal diski kapatır, böylece bilgisayar /data dizinine erişemez. Devam edilsin mi?',
      diskOffWarn:
        'Sanal disk kapalı ve imajı bağlamak için açılması gerekiyor. Bilgisayardaki USB aygıtları yeniden tanımlanır. Devam edilsin mi?',
      unmountFailed: 'Bağlantıyı kaldırma başarısız oldu',
      unmountDesc:
        'Bazı sistemlerde, görüntünün bağlantısını kesmeden önce uzak ana bilgisayardan manuel olarak çıkarmanız gerekir',
      forceEject: 'Çıkarmayı zorla',
      forceEjectConfirm:
        'Ana bilgisayar optik sürücüyü kilitledi. Çıkarmayı zorlamak, sanal USB aygıtının bağlantısını kısa süreliğine keser; bu nedenle klavye ve fare kısa süreliğine bağlantıyı kaybedebilir. Devam edilsin mi?',
      usbReconnect: "USB'yi yeniden bağla",
      usbReconnectConfirm:
        "USB gadget'ı yalnızca uzak makine medya değişikliğini fark etmediyse yeniden bağlayın. Klavye ve fare kısa süreli kesilebilir.",
      usbReconnectSuccess: 'USB yeniden bağlandı',
      usbReconnectFailed: 'USB yeniden bağlanamadı',
      addImage: 'İmaj ekle',
      fromUrl: "URL'den",
      fromFile: 'Dosyadan',
      turnOff: 'Kapat',
      deleteDiskShared: 'Sanal disk açıkken imajlar silinemez.',
      eject: 'Çıkar',
      download: 'İndir',
      upload: 'Yükle',
      mountTitle: 'İmajı bağla',
      deleteTitle: 'İmajı sil',
      deleteConfirm: 'Bu resmi silmek istediğinizden emin misiniz?',
      tips: {
        title: 'Nasıl yüklenir',
        usb1: "NanoKVM'i bilgisayarınıza USB ile bağlayın.",
        usb2: 'Sanal diskin Ayarlar > Cihaz > Sanal Disk bölümünde bağlı olduğundan emin olun.',
        usb3: 'Sanal diski bilgisayarınızda açın ve disk imajı dosyanızı sanal diskin kök dizinine kopyalayın.',
        scp1: 'NanoKVM ve bilgisayarınızın aynı yerel ağda bulunduğundan emin olun.',
        scp2: "Bilgisayarınızda uçbirimi açın ve disk imajı dosyanızı SCP komutunu kullanarak NanoKVM'in /data dizinine yükleyin.",
        scp3: 'Örnek: scp disk-imajı-yolu root@nanokvm-ip:/data',
        tfCard: 'micro SD kart',
        tf1: 'Bu yöntem Linux sistemlerde desteklenmektedir',
        tf2: "NanoKVM'den SD kartı çıkarın. FULL sürümde önce kutuyu sökün.",
        tf3: 'micro SD kartı kart okuyucusuna takın ve bilgisayarınıza bağlayın.',
        tf4: 'Disk imajı dosyanızı micro SD kartın /data dizinine kopyalayın.',
        tf5: "micro SD kartı NanoKVM'e geri yerleştirin."
      }
    },
    script: {
      title: 'Betikler',
      upload: 'Yükle',
      run: 'Çalıştır',
      runBackground: 'Arka planda çalıştır',
      runFailed: 'Çalıştırma başarısız oldu',
      delDesc: 'Bu dosyayı silmek istediğinizden emin misiniz?',
      delete: 'Sil',
      close: 'Kapat',
      unlockDesc:
        'Betikler NanoKVM üzerinde root olarak çalışır. Bir betik yüklemek veya çalıştırmak için web hesabı parolasını girin.',
      terminalRequired:
        'Betikler web terminali erişimi gerektirir. Önce ayarlardan terminali etkinleştirin.'
    },
    terminal: {
      title: 'Uçbirim',
      nanokvm: 'NanoKVM uçbirimi',
      serial: 'Seri port uçbirimi',
      unlockTitle: 'Terminal kilidini aç',
      unlockDesc: 'Terminal oturumu başlatmak için web hesabı parolanızı girin',
      unlock: 'Kilidi aç',
      unlockFailed: 'Terminal kilidi açılamadı',
      invalidCredentials: 'Geçersiz kullanıcı adı veya parola',
      locked: 'Çok fazla deneme, daha sonra tekrar deneyin',
      sessionClosed: 'Terminal oturumu kapandı. Yeniden bağlanmak için tekrar kilidi açın.',
      sessionError: 'Terminal bağlantısı başarısız. Tekrar denemek için kilidi açın.',
      serialPort: 'Seri port',
      serialPortPlaceholder: 'Örneğin /dev/ttyS1',
      baudrate: 'Baud hızı',
      parity: 'Eşlik kontrolü',
      parityNone: 'Yok',
      parityEven: 'Çift',
      parityOdd: 'Tek',
      flowControl: 'Akış kontrolü',
      flowControlNone: 'Yok',
      flowControlSoft: 'Yazılımsal',
      flowControlHard: 'Donanımsal',
      dataBits: 'Veri bitleri',
      stopBits: 'Dur bitleri',
      open: 'Uçbirimi aç'
    },
    wol: {
      title: 'Ağ üzerinden uyandırma',
      sending: 'Komut gönderiliyor...',
      sent: 'Komut gönderildi',
      input: 'MAC adresi',
      ok: 'Tamam'
    },
    download: {
      input: "Uzak imaj URL'si",
      ok: 'OK',
      disabled:
        'Depolama yazılabilir olmadığı için şu anda imaj indirilemiyor veya yüklenemiyor. Bir imaj bağlıysa bağlantısını kaldırın, ardından depolamayı yeniden yazılabilir yapmak için sanal diski kapatın.',
      diskShared: 'İmaj indirmeyi kullanmak için sanal diski kapatın',
      mountedImage: 'Bu imaj bağlı, aynı adlı bir dosyayı yüklemeden önce bağlantısını kesin',
      diskOff: 'Sanal diski kapat',
      uploadbox: 'Dosyayı buraya bırakın veya seçmek için tıklayın',
      inputfile: 'İmaj dosyası',
      NoISO: 'İmaj yok',
      complete: 'İndirme tamamlandı',
      uploadComplete: 'Yükleme tamamlandı',
      downloading: 'İndiriliyor',
      uploading: 'Yükleniyor',
      failed: 'Aktarım başarısız',
      uploadFailed: 'Yükleme başarısız',
      stalled: 'Aktarım durdu, bağlantıyı kontrol edip tekrar deneyin',
      canceled: 'Yükleme iptal edildi',
      downloadCanceled: 'İndirme iptal edildi',
      cancel: 'İptal',
      remoteDisabled: 'Uzak ISO indirme Ayarlar > Kullanıcı > Tercihler içinde devre dışı',
      remoteFailed: 'Uzak ISO indirme başarısız',
      sha256: 'İsteğe bağlı SHA-256 sağlama toplamı',
      sha256Placeholder: '64 karakterlik SHA-256 sağlama toplamını girin',
      invalidSHA256: 'SHA-256, 64 karakterlik bir onaltılık dize olmalıdır',
      checksumFailed: 'İndirme başarısız: SHA-256 doğrulaması başarısız'
    },
    power: {
      title: 'Güç',
      showConfirm: 'Doğrulama',
      showConfirmTip: 'Güç ile ilgili işlemler fazladan doğrulama gerektirir',
      reset: 'Sıfırla',
      powerShort: 'Güç düğmesi: bas-çek',
      powerLong: 'Güç düğmesi: uzun bas',
      resetConfirm: 'Sıfırlama işlemini yürütmek istiyor musunuz?',
      powerConfirm: 'Güç işlemini yürütmek istiyor musunuz?',
      okBtn: 'Evet',
      cancelBtn: 'Hayır'
    },
    settings: {
      title: 'Ayarlar',
      about: {
        title: 'Hakkında',
        information: 'Bilgi',
        ip: 'IP adresi',
        mdns: 'Yerel adres',
        application: 'Uygulama sürümü',
        uptime: 'Çalışma süresi',
        community: 'Topluluk',
        credit:
          "Sipeed'in <a1>NanoKVM</a1> ve woffko'nun <a2>Hardened NanoKVM</a2> projeleri üzerine kurulmuştur",
        hostname: 'Cihaz adı',
        changeIn: '{{path}} içinden değiştirilebilir',
        updateIn: '{{path}} içinden güncellenebilir',
        toggleIn: '{{path}} içinden açılıp kapatılabilir'
      },
      appearance: {
        title: 'Tercihler',
        display: 'Ekran',
        language: 'Dil',
        languageDesc: 'Arayüz için dili seçin',
        webTitle: 'Site başlığı',
        webTitleDesc: 'Görünen site başlığını güncelleyin',
        layoutMode: 'Arayüz yerleşimi',
        layoutModeDesc: 'Bu tarayıcıda telefon/dokunmatik yerleşimi kullan',
        layoutAuto: 'Otomatik',
        layoutMobile: 'Telefon',
        menuBar: {
          title: 'Menü çubuğu',
          mode: 'Görüntüleme modu',
          modeDesc: 'Ekranda menü çubuğunu görüntüle',
          modeOff: 'Kapalı',
          modeAuto: 'Otomatik gizle',
          modeAlways: 'Her zaman görünür',
          keyboardLedStatus: 'Klavye kilidi göstergeleri',
          keyboardLedStatusDesc:
            'Uzak bilgisayarın Num Lock, Caps Lock ve Scroll Lock durumunu göster',
          icons: 'Alt menü simgeleri',
          iconsDesc: 'Menü çubuğunda alt menü simgelerini görüntüle',
          terminalWarningTitle: 'Web terminali etkinleştirilsin mi?',
          terminalWarningDesc:
            'Terminal tarayıcıda root shell açar. Yalnızca güvenilir ağda etkinleştirin ve işiniz bitince kapatın.',
          terminalWarningConfirm: 'Etkinleştir',
          remoteDownload: 'Uzak ISO indir',
          remoteDownloadWarningTitle: 'Uzak ISO indirme etkinleştirilsin mi?',
          remoteDownloadWarningDesc:
            "NanoKVM bir URL'den ISO alıp /data içine yazar. Yalnızca güvenilir URL'ler için etkinleştirin ve işiniz bitince kapatın.",
          remoteDownloadWarningConfirm: 'Etkinleştir'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Uzak klavye kilidi durumu',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Açık',
        off: 'Kapalı',
        unknown: 'Bilinmiyor'
      },
      device: {
        title: 'Cihaz',
        minutes: 'dk',
        sections: {
          general: 'Genel',
          connectivity: 'Bağlantı',
          hostConnection: 'Ana makine bağlantısı',
          inputOutput: 'Giriş ve çıkış'
        },
        oled: {
          title: 'OLED zaman aşımı',
          description: 'OLED ekranı şu süreden sonra kapat',
          keepOn: "OLED'i açık tut",
          keepOnDescription: 'OLED ekranı hiç kapatma'
        },
        ssh: {
          description: 'SSH uzaktan erişimini etkinleştir',
          tip: 'Bu seçeneği etkinleştirmeden önce Hesap > Şifre bölümünde güçlü bir şifre belirleyin'
        },
        swap: {
          title: 'Swap',
          description: 'Bellek azaldığında bir swap dosyası kullan',
          size: 'Swap boyutu',
          sizeDescription: 'Swap dosyasının boyutunu belirle',
          tip: 'Bu özelliği aktifleştirmek micro SD kartınızın ömrünü kısaltabilir'
        },
        mouseJiggler: {
          title: 'Fare oynatıcı',
          description: 'Uzak ana bilgisayarın uykuya geçmesini engeller',
          disable: 'Devre dışı bırak',
          absolute: 'Mutlak mod',
          relative: 'Bağıl mod'
        },
        sessionLock: {
          title: 'Etkin değilken oturumu kilitle',
          description: 'Bu süreden sonra yeniden giriş iste'
        },
        mdns: {
          description: 'mDNS keşif hizmetini etkinleştir',
          tip: "Bu cihaza .local adıyla erişmenizi sağlar. IP adresiyle bağlanıyorsanız veya DNS'iniz ana makine adını zaten çözüyorsa gerekmez."
        },
        hdmi: {
          description: 'HDMI/Monitör çıktısını aktifleştir',
          idleTimeoutTitle: 'Etkin olmayan yakalama zaman aşımı',
          idleTimeoutDescription:
            'Etkin görüntüleyici olmadığında HDMI yakalamayı şu süre sonunda durdur:'
        },
        hidOnly: 'HID-Only modu',
        hidOnlyDesc: 'Fare veya klavye yanıt vermeyi bırakırsa ana bilgisayarla uyumluluğu artırır',
        hidOnlyTip:
          'HID-Only modu sanal aygıtları taklit etmeyi durdurur ve yalnızca temel HID kontrolünü korur',
        disk: 'Sanal disk',
        diskDesc: 'SD kartı uzak ana bilgisayara bağla',
        diskLocked: 'Bir imaj bağlıyken kapalı, açmak ise bağlamayı iptal eder',
        diskEnable: 'Sanal diski etkinleştir',
        networkChange: 'Sanal ağı değiştir',
        diskCancelMount: 'Sanal diski etkinleştirmek bağlı imajı iptal eder. Devam edilsin mi?',
        networkCancelMount:
          'Sanal ağı değiştirmek USB bağlantısını yeniden başlatır. Bu, bağlı imajı iptal eder ve sanal diski etkinleştirir. Devam edilsin mi?',
        diskTransferRunning:
          'Bir imaj aktarımı sürüyor. Sanal diski etkinleştirmeden önce bitmesini bekleyin.',
        network: 'Sanal ağ',
        networkDesc: 'Sanal ağ kartını uzak ana bilgisayara bağla',
        usbWakeup: 'USB ile uyandırma',
        usbWakeupDesc: 'Klavye veya fare olaylarının uzak makineyi uyandırmasına izin verir',
        usbWakeupTip: 'Makine tekrarlayan USB wakeup iletileri kaydediyorsa kapatın',
        hostname: {
          description: 'Bu cihazın ağdaki adı',
          reachable: 'Yerel ağda {{address}} olarak erişilebilir'
        },
        rebootRequired: 'Yeniden başlatma gerekli',
        rebootPending: 'Yeniden başlatma gerekli: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Sistem güncellemesi'
        },
        reboot: 'Yeniden başlat',
        rebootDesc: "NanoKVM'i yeniden başlatmak istediğinizden emin misiniz?",
        poweroff: 'Kapat',
        poweroffDesc:
          "NanoKVM'i kapatmak istediğinize emin misiniz? Yeniden açılana kadar erişilemez."
      },
      network: {
        title: 'IP & DNS',
        connection: 'Bağlantı',
        configuration: 'Yapılandırma',
        wifi: {
          title: 'Wi-Fi',
          description: 'Wi-Fi ayarlayın',
          apMode: "AP modu etkin, QR kodu tarayarak Wi-Fi'ye bağlanın",
          connect: "Wi-Fi'ye bağlan",
          connectDesc1: "Lütfen ağ SSID'sini ve parolayı girin",
          disconnect: 'Ağ bağlantısını kesmek istediğinizden emin misiniz?',
          disconnectBtn: 'Bağlantıyı kes',
          connected: 'Bağlandı',
          ssid: 'Ad',
          password: 'Parola',
          joinBtn: 'Katıl',
          cancelBtn: 'İptal'
        },
        tls: {
          description: 'HTTPS protokolünü etkinleştir',
          tip: 'HTTPS protokolü bağlantıda gecikmeye sebep olabilir, özellikle MJPEG görüntü modu ile',
          restartTitle: 'Sunucu yeniden başlatılacak',
          restartDesc:
            'Protokol değişikliği sunucuyu yeniden başlatır. Tarayıcı {{seconds}} saniye sonra yeni adrese geçecek:',
          restartOk: 'Uygula ve yeniden başlat',
          confirmTitle: 'Yeni protokol korunsun mu?',
          confirmDesc:
            'Sunucu şimdi {{protocol}} ile çalışıyor. Korumazsanız {{seconds}} saniye içinde önceki protokole döner.',
          confirmKeep: 'Koru',
          confirmRevert: 'Geri dön',
          reverting:
            'Önceki protokole dönülüyor. Tarayıcı {{seconds}} saniye sonra o adrese geçecek.',
          certTitle: 'Yeni sertifika korunsun mu?',
          certDesc:
            'Sunucu artık yeni sertifikayı kullanıyor. Siz korumazsanız {{seconds}} saniye sonra öncekine döner.',
          certReverted: 'Önceki sertifika geri geldi'
        },
        trustedProxies: {
          section: 'Ters proxy',
          title: "Güvenilen proxy'ler",
          description:
            "Cihazın istemci adresini ve protokolünü bildirme konusunda güvendiği ters proxy'ler",
          tip: "Listedeki bir adres, oturum açma sınırının ve günlüğün kaydettiği istemci adresini belirler, bu yüzden yalnızca kendi yönettiğiniz proxy'leri ekleyin",
          none: 'Yok',
          edit: 'Düzenle',
          editRow: 'Listeyi düzenle',
          editTitle: "Güvenilen proxy'leri düzenle",
          editDescription: 'Listeyi değiştirmek için parolanız gerekir',
          dialogDescription:
            "Her ters proxy'nin adresini bu cihazın gördüğü şekilde veya 10.0.0.0/24 gibi bir aralık olarak girin. Listedeki bir proxy cihaza hangi istemci adresinin ve protokolünün kullanılacağını söyler. İlettiği her şeye inanılır, bu yüzden yalnızca kendi yönettiğiniz proxy'leri ekleyin."
        },
        certificate: {
          title: 'Sertifika',
          desc: 'HTTPS sertifikasının kaynağı',
          requesting: 'Sertifika isteniyor',
          selfSigned: 'Kendinden imzalı',
          domain: 'Alan adı',
          domainDesc:
            'Bu cihazı göstermeli ve 443 numaralı bağlantı noktasına internetten erişilebilmeli',
          domainTailscale: 'Bu cihaz için Tailscale tarafından belirlendi',
          domainInvalid: 'Tam bir alan adı kullanın, örneğin kvm.example.org',
          email: 'E-posta',
          emailDesc: "İsteğe bağlı, Let's Encrypt bildirimleri için",
          emailInvalid: 'E-posta olarak ad@example.org gibi bir adres kullanın',
          validUntil: 'Geçerlilik sonu',
          valid: 'Geçerli',
          expiresSoon: 'Yakında dolacak',
          expired: 'Süresi doldu',
          lastRenewal: 'Son yenileme',
          renewed: 'Yenilendi',
          failed: 'Başarısız',
          renewNow: 'Şimdi yenile',
          renewNowDesc: 'Beklemeden yeni sertifika iste',
          renewBtn: 'Yenile',
          applyTitle: 'Sertifikayı değiştir',
          applyOk: 'Uygula',
          applyAcme:
            "Cihaz Let's Encrypt'ten sertifika ister. Let's Encrypt doğrulamak için internetten 443 numaralı bağlantı noktasına bağlanır; bu bir dakikaya kadar sürebilir. İstek başarısız olursa mevcut sertifika kullanılmaya devam eder.",
          applyTailscale:
            "Cihaz Tailscale'den sertifika alır; bu bir dakikaya kadar sürebilir. İstek başarısız olursa mevcut sertifika kullanılmaya devam eder.",
          applySelfSigned:
            'Cihaz kendi kendinden imzalı sertifikasına döner. Tarayıcılar uyarı gösterir.',
          openTitle: 'Yeni adresi aç',
          openDesc:
            'Sertifika hazır. Aşağıdaki adresi açın ve korumak için oturum açın. 3 dakika içinde onaylamazsanız önceki sertifika geri gelir.',
          openOk: 'Aç',
          blockedClock: 'Cihazın saati eşitlenene kadar sertifika istenemez',
          blockedParanoid: 'Güvenlik duvarının Paranoyak modu sertifika isteklerini engeller',
          tailscaleUnavailable:
            'Tailscale çalışmıyor veya tailnet için HTTPS sertifikaları etkin değil'
        },
        dns: {
          title: 'DNS',
          description: 'NanoKVM için DNS sunucularını yapılandır',
          ipv4Title: 'IPv4',
          ipv4Description: 'Kablolu arayüz için IPv4 adreslemeyi yapılandır',
          servers: 'Sunucular',
          dhcp: 'DHCP',
          manual: 'Manuel',
          apply: 'Uygula',
          invalid: 'Geçerli bir IPv4 veya IPv6 adresi girin',
          invalidNetwork: 'Geçerli bir IPv4 adresi, alt ağ maskesi ve yönlendirici girin',
          saved: 'DNS ayarları kaydedildi',
          redirecting: 'Ağ ayarları kaydedildi. Yeni adres açılıyor...',
          saveFailed: 'DNS ayarları kaydedilemedi',
          unsaved: 'Kaydedilmemiş değişiklikler',
          maxServers: 'En fazla {{count}} DNS sunucusuna izin verilir',
          dhcpServersDescription: "DNS sunucuları DHCP'den otomatik olarak alınır",
          manualServersDescription: 'IPv4 ve IPv6 sunucuları desteklenir',
          interface: 'Arayüz',
          ipAddress: 'IP adresi',
          subnetMask: 'Alt ağ maskesi',
          router: 'Yönlendirici'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Kablolu arayüz için IPv6 adreslemesini yapılandır',
          disabled: 'Devre dışı',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manuel',
          interface: 'Arayüz',
          state: 'Durum',
          router: 'Yönlendirici',
          addresses: 'Adresler',
          dhcpv6Client: 'DHCPv6 istemcisi',
          notInstalled: 'Kurulu değil',
          ipAddress: 'IPv6 adresi',
          prefix: 'Ön ek',
          invalidManual: 'Geçerli bir IPv6 adresi, ön ek ve yönlendirici girin',
          clientMissing:
            'DHCPv6 istemcisi kurulu değil. Önce eşleşen raw sistem güncellemesini kurun.',
          saved: 'IPv6 ayarları kaydedildi',
          saveFailed: 'IPv6 ayarları kaydedilemedi',
          unsaved: 'Kaydedilmemiş değişiklikler'
        }
      },
      system: {
        title: 'Sistem',
        performance: {
          processor: 'İşlemci',
          overdrive: {
            title: 'Saat hız aşırtma',
            description:
              'Üreticinin belirlediği daha yüksek işlemci ve video saat hızlarıyla başlat',
            tip: 'Cihaz hız aşırtmayla başlamazsa SD kartın yeniden yazılması gerekir',
            unavailable: 'Bu sistem imajına dahil değil',
            keepTitle: 'Güncellemelerden sonra overdrive korunsun',
            keepDescription:
              'Bu seçenek açık değilse sistem güncellemesi cihazı standart saat hızlarına döndürür',
            confirmTitle: 'Saat hız aşırtma etkinleştirilsin mi?',
            confirmText:
              'Cihaz hız aşırtmayla başlamazsa kurtarmak için SD kartı yeniden yazmanız gerekir. Değişiklik sonraki yeniden başlatmadan sonra uygulanır.',
            confirmOk: 'Etkinleştir'
          },
          watchdog: {
            title: 'Donanım watchdog',
            description: 'Cihaz yanıt vermeyi bıraktığında otomatik olarak yeniden başlat',
            unavailable: 'Bu sistem imajına dahil değil',
            notRunning: 'Şu anda çalışmıyor',
            lastRestart: 'Son yeniden başlatma',
            lastRestartCaption: 'Sistemin yeniden başlatılmasının en son nedeni',
            reasonPowerOn: 'Güç açıldı',
            reasonRestart: 'Yeniden başlatma istendi',
            reasonWatchdog: 'Watchdog sıfırlaması',
            reasonOverheat: 'Aşırı ısınma koruması',
            reasonUnknown: 'Bilinmiyor'
          },
          recovery: 'Kurtarma',
          memory: 'Bellek'
        },
        monitor: {
          processorClock: 'CPU alt sistemi',
          videoClock: 'Video alt sistemi',
          videoClockCaption: 'Video saat frekansı',
          cpuClockCaption: 'CPU saat frekansı',
          overdrive: 'Hız aşırtma',
          temperature: 'Sıcaklık',
          lastMinutes: 'Son 5 dakika',
          ram: 'RAM',
          off: 'Kapalı',
          ramHistory: 'RAM kullanımı',
          cpuLoad: 'CPU yükü',
          cpuLoadCaption: 'Kullanıcı yüzde {{user}}, sistem yüzde {{system}}',
          cpuUtilization: 'CPU kullanımı',
          swapUtilization: 'Takas alanı kullanımı',
          swapSizeLastMinutes: '{{size}}, son 5 dakika',
          percent: 'Yüzde {{percent}}',
          percentUsed: 'Yüzde {{percent}} kullanılıyor',
          sizeOf: '{{used}} / {{total}}',
          systemPartition: 'Sistem bölümü',
          dataPartition: 'Veri bölümü',
          unavailable: 'Kullanılamıyor',
          noReadings: 'Cihaz okuma değeri döndürmüyor',
          refresh: 'Bu sayfa açıkken her saniye güncellenir'
        },
        sections: {
          time: 'Saat',
          firewall: 'Güvenlik duvarı',
          systemLog: 'Günlük kaydı',
          performance: 'Performans',
          monitor: 'İzleme',
          services: 'Hizmetler',
          webInterface: 'Güvenli web erişimi'
        },
        time: {
          saveFailed: 'Saat ayarları kaydedilemedi',
          saved: 'Saat ayarları kaydedildi',
          syncFailed: 'Saat eşitlenemedi',
          synced: 'Saat eşitlendi',
          invalidServers: 'En az bir NTP sunucusu girin',
          maxServers: 'En fazla {{count}} NTP sunucusuna izin verilir',
          refresh: 'Yenile',
          syncNow: 'Eşitle',
          syncNowDesc: 'Saati şimdi NTP sunucularından ayarla',
          save: 'Kaydet',
          ntp: {
            title: 'NTP',
            description: 'Cihaz saatini yapılandırılmış NTP sunucularından eşitle'
          },
          networkTime: 'Ağ saati',
          clock: {
            title: 'Saat',
            description: 'Günlükler ve arayüz için kullanılan yerel saat dilimini ayarla',
            current: 'Geçerli saat',
            timezone: 'Saat dilimi'
          },
          servers: {
            title: 'NTP sunucuları',
            description:
              'Varsayılan genel sunucuları, yerel yönlendiricinizi veya özel NTP sunucularını kullanın',
            useRouter: 'Yönlendiriciyi kullan',
            useDefaults: 'Varsayılanları kullan',
            presets: 'Sunucu ön ayarları',
            presetsDesc: 'Sunucu listesini bir ön ayarla değiştir'
          }
        },
        firewall: {
          saveFailed: 'Güvenlik duvarı ayarları uygulanamadı',
          saved: 'Güvenlik duvarı ayarları uygulandı',
          cancel: 'İptal',
          refresh: 'Yenile',
          backends: "Backend'ler",
          enableHttpsFirst:
            "Kısıtlı veya Paranoyak güvenlik duvarı modunu etkinleştirmeden önce HTTPS'i etkinleştirin",
          httpsRequired:
            'Kısıtlı ve Paranoyak modları, HTTPS Ayarlar > Ağ > Hizmetler bölümünde etkinleştirilene kadar devre dışıdır',
          mode: {
            title: 'Güvenlik duvarı modu',
            baseline: 'Temel',
            baselineDesc:
              'Açık uyumluluk profili. Güvenlik duvarı çalışır, ancak gelen kaynaklar kısıtlanmaz. Yalnızca güvenilir ağlarda kullanın.',
            moderate: 'Orta',
            moderateDesc:
              'Varsayılan profil. Temel mod hizmetlerini korur, ancak yeni gelen bağlantıları yalnızca özel, link-local veya loopback aralıklarından kabul eder. Giden erişim açık kalır.',
            restricted: 'Kısıtlı',
            restrictedDesc:
              'Yalnızca yerel HTTPS ve SSH ile giden DNS, NTP, syslog ve çevrimiçi güncellemeler. DHCP ve temel IPv6 trafiği kullanılabilir kalır. WebRTC engellenir.',
            paranoid: 'Paranoyak',
            paranoidDesc:
              'Yalnızca yerel HTTPS erişimi. SSH, HTTP, çevrimiçi güncellemeleri ve diğer giden ağ özelliklerini engeller. Çevrimdışı güncelleme yükleme ve önceden hazırlanmış kurulumlar kullanılabilir kalır.',
            current: 'Geçerli',
            default: 'Varsayılan',
            localOnly: 'Yalnızca yerel',
            openTag: 'Gelen açık',
            httpsRequiredTag: 'HTTPS gerekli',
            outboundOpen: 'Giden açık',
            outboundLimited: 'Giden sınırlı',
            httpsOnly: 'Yalnızca HTTPS'
          },
          moderate: {
            apply: 'Orta moda geç'
          },
          restricted: {
            enable: 'Kısıtlı modu etkinleştir',
            confirmTitle: 'Kısıtlı modu etkinleştirilsin mi?',
            confirmDesc:
              'Gelen yönetim erişimi HTTPS ve SSH için private IPv4, IPv4 link-local/loopback, IPv6 link-local veya IPv6 loopback kaynak aralıklarıyla sınırlanır. Genel kaynak aralıklarına izin verilmez. Giden DNS, NTP, uzak syslog, çevrimiçi güncellemeler, DHCP, kurulmuş bağlantılar ve gerekli IPv6 kontrol trafiği kullanılabilir kalır. WebRTC/ICE UDP ve diğer gelen/giden trafik engellenir.'
          },
          paranoid: {
            enable: 'Paranoyak modu etkinleştir',
            confirmTitle: 'Paranoyak modu etkinleştirilsin mi?',
            confirmDesc:
              'Yalnızca private IPv4, IPv4 link-local/loopback, IPv6 link-local veya IPv6 loopback kaynak aralıklarından HTTPS erişimi kullanılabilir kalır. SSH, HTTP, mDNS, NTP, GitHub indirmeleri ve diğer trafik minimal DHCP/IPv6 kontrolü dışında engellenir.'
          },
          baseline: {
            apply: 'Temel moda geç',
            confirmTitle: 'Açık Temel moduna geçilsin mi?',
            confirmDesc:
              "Güvenlik duvarı hizmeti etkin kalır, ancak yalnızca yerel kaynak aralığı kısıtlaması kaldırılır. Ağ yönlendiriyorsa genel kaynak aralıkları NanoKVM'in açıkta kalan hizmetlerine ulaşabilir."
          },
          rules: {
            title: 'Geçerli kurallar',
            empty: 'Kural yok'
          }
        },
        saveChanges: 'Değişiklikleri kaydet',
        unsaved: 'Kaydedilmemiş değişiklikler'
      },
      systemLog: {
        saveFailed: 'Günlük ayarları kaydedilemedi',
        saved: 'Günlük ayarları kaydedildi',
        invalidHost: 'Bir syslog sunucusu hostu girin',
        logLoadFailed: 'Günlükler yüklenemedi',
        save: 'Kaydet',
        test: 'Test günlüğü gönder',
        testSent: 'Test günlüğü gönderildi',
        testFailed: 'Test günlüğü gönderilemedi',
        remote: {
          title: 'Uzak günlük kaydı',
          forward: 'Sistem günlüğünü ilet',
          description: 'Sistem iletilerini uzak bir sunucuya ilet',
          host: 'Sunucu',
          hostDesc: 'Syslog sunucusunun ana bilgisayar adı veya IPv4 adresi',
          port: 'Port',
          protocol: 'Syslog sunucusunun UDP bağlantı noktası'
        },
        local: {
          title: 'Sistem günlüğü tamponu',
          description:
            "SD karta yazmayı önlemek için geçerli günlükler RAM'de {{path}} konumunda tutulur",
          priority: 'En düşük öncelik',
          priorityDesc: 'Bir iletinin günlüğe kaydedilmesi için en düşük aciliyet',
          buffer: 'Tampon boyutu',
          bufferDesc: 'Dosyanın döndürüldüğü günlük boyutu',
          rotations: 'Döndürmeler',
          rotationsDesc: 'Saklanan döndürülmüş günlük dosyalarının sayısı',
          compact: 'Kompakt çıktı',
          compactDesc: 'Her satırdan ana bilgisayar adını ve facility değerini çıkar',
          stripTimestamps: 'Zaman damgalarını kaldır',
          stripTimestampsDesc:
            'Gönderenin eklediği zaman damgalarını kaldır; syslog kendisininkini ekler'
        },
        kernel: {
          title: 'Kernel günlük kaydı',
          enabled: 'Kernel günlüğünü ilet',
          enabledDesc: 'Kernel iletilerini sistem günlüğüne kaydet',
          consoleLevel: 'Konsol seviyesi',
          consoleLevelDesc: 'Bir kernel iletisinin konsola yazdırılması için en düşük aciliyet'
        },
        viewer: {
          title: 'Sistem günlüğü',
          refresh: 'Yenile',
          empty: 'Günlük kaydı yok',
          truncated: 'Yalnızca en son günlük verileri gösterilir',
          linesUnit: 'satır'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Kritik',
          '3': '3 - Hata',
          '4': '4 - Uyarı',
          '5': '5 - Bildirim',
          '6': '6 - Bilgi',
          '7': '7 - Debug',
          '8': '8 - Tümü'
        }
      },
      user: {
        title: 'Kullanıcı'
      },
      networking: {
        title: 'Ağ'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Şifreli tünel',
        device: 'Bu cihaz',
        description: "Bu KVM'ye bir WireGuard tüneli üzerinden erişin",
        unavailable: 'WireGuard bu cihazda yüklü değil',
        blocked: "Güvenlik duvarının Paranoyak modu WireGuard'ı engeller",
        needsKey: "WireGuard'ı açmadan önce bir özel anahtar ayarlayın",
        saved: 'WireGuard ayarları kaydedildi',
        save: 'Değişiklikleri kaydet',
        unsaved: 'Kaydedilmemiş değişiklikler',
        invalid: 'Vurgulanan alanları kontrol edin',
        invalidAddress: 'Maskesiyle birlikte bir adres girin, örneğin 10.0.0.1/24',
        invalidKey: '44 karakterlik bir WireGuard anahtarı girin',
        invalidEndpoint: 'Bir ana bilgisayar adı veya IP adresi girin',
        invalidPort: '1 ile 65535 arasında bir bağlantı noktası girin',
        invalidRanges: '0.0.0.0/0 yerine 10.0.0.0/24 gibi IPv4 aralıkları kullanın',
        status: {
          connected: 'Bağlandı',
          waiting: 'Eş bekleniyor',
          stopped: 'Durduruldu',
          handshake: 'Son el sıkışma {{time}}'
        },
        privateKey: {
          title: 'Özel anahtar',
          description: 'Bu cihazda kalır ve bir daha gösterilmez',
          set: 'Ayarlandı',
          notSet: 'Ayarlanmadı',
          setBtn: 'Ayarla',
          generate: 'Oluştur',
          remove: 'Kaldır',
          modalTitle: 'Özel anahtarı ayarla',
          modalDescription: 'Anahtar bu cihazda saklanır ve bir daha gösterilmez',
          placeholder: 'Özel anahtarı yapıştırın',
          generateConfirmTitle: 'Yeni bir özel anahtar oluşturulsun mu?',
          generateConfirmDesc:
            'Mevcut anahtar çalışmayı durdurur. Ardından yeni genel anahtarı eşe ekleyin.',
          removeConfirmTitle: 'Özel anahtar kaldırılsın mı?',
          removeConfirmDesc:
            'WireGuard kapatılır ve yeni bir anahtar ayarlanana kadar kapalı kalır.'
        },
        publicKey: {
          title: 'Genel anahtar',
          description: 'Eşin yapılandırmasına ekleyin'
        },
        address: {
          title: 'Adres',
          description: "KVM'nin tünel içindeki adresi ve maskesi"
        },
        peer: {
          title: 'Eş',
          publicKey: 'Genel anahtar',
          publicKeyDescription: 'Bağlandığınız eşin genel anahtarı',
          server: 'Sunucu',
          serverDescription: 'Eşin ana bilgisayar adı veya IP adresi',
          port: 'Port',
          portDescription: 'Eşin UDP bağlantı noktası, genellikle 51820',
          allowedIps: "İzin verilen IP'ler",
          allowedIpsDescription: 'Eşin tünel içindeki adresi veya aralığı, örneğin 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription:
            'Keepalive paketleri arasındaki saniye, bir yönlendiricinin arkasında gereklidir'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: "Bu KVM'ye Tailscale ağınız üzerinden erişin",
        service: 'Hizmet',
        performance: 'Performans',
        memory: {
          title: 'Bellek optimizasyonu',
          tip: "Tailscale'in bellek kullanımını düşük tutar; bu, RAM'i az olan cihazlarda yardımcı olur. Değişikliğin etkili olması için Tailscale'i yeniden başlatın."
        },
        swap: {
          title: 'Swap dosyası',
          tip: 'Bellek optimizasyonunu etkinleştirdikten sonra sorunlar devam ederse, swap dosyasını etkinleştirmeyi deneyin',
          sizeTip:
            'Bu, dosya boyutunu 128MB olarak ayarlar; Ayarlar > Sistem > Performans bölümünden değiştirebilirsiniz'
        },
        restartTitle: "Tailscale'i yeniden başlat",
        restartDesc: 'Hizmeti yeniden başlatır',
        restartBtn: 'Yeniden başlat',
        restart: "Tailscale'i yeniden başlat?",
        stopTitle: "Tailscale'i durdur",
        stopBtn: 'Durdur',
        stop: "Tailscale'i durdur?",
        stopDesc: 'Hizmeti durdurur ve açılışta başlamasını engeller',
        loading: 'Yükleniyor...',
        notInstall: 'Tailscale bulunamadı, lütfen yükleyin',
        install: 'Yükle',
        installing: 'Yükleniyor',
        failed: 'Yükleme başarısız oldu',
        retry: 'Lütfen sayfayı yenileyin ve tekrar deneyin ya da manuel olarak yükleyin.',
        download: 'İndir',
        package: 'yükleme paketi',
        unzip: 'sıkışmış dosyayı açın',
        upTailscale: "tailscale dosyasını NanoKVM'in /usr/bin dizinine yükleyin",
        upTailscaled: "tailscaled dosyasını NanoKVM'in /usr/sbin dizinine yükleyin",
        refresh: 'İçinde bulunduğunuz sayfayı yenileyin',
        notRunning: 'Tailscale çalışmıyor. Devam etmek için lütfen başlatın.',
        run: 'Başlat',
        notLogin: 'Cihaz bağlı değil. Lütfen giriş yapıp cihazınızı hesabınıza bağlayın.',
        urlPeriod: 'Adres sadece 10 dakika boyunca geçerlidir',
        login: 'Giriş yap',
        loginSuccess: 'Giriş yapıldı',
        deviceName: 'Cihaz adı',
        deviceIP: 'Cihaz IP adresi',
        account: 'Hesap',
        logout: 'Çıkış yap',
        logoutDesc: 'Çıkış yapmak istediğinizden emin misiniz?',
        uninstall: "Tailscale'i kaldır",
        uninstallDesc: "Tailscale'i kaldırmak istediğinizden emin misiniz?",
        okBtn: 'Evet',
        cancelBtn: 'Hayır'
      },
      update: {
        title: 'Güncellemeler',
        currentVersion: 'Geçerli sürüm',
        latestVersion: 'En son sürüm',
        queryFailed: 'Sürüm bilgisi alınamadı',
        updateFailed: 'Güncelleme başarısız oldu',
        paranoidBlocked:
          'Çevrimiçi güncellemeler Paranoyak güvenlik duvarı modu tarafından engellenir',
        paranoidBlockedDesc:
          'GitHub kontrolleri ve indirmeler giden ağ erişimi gerektirir. Offline yükleme ve zaten hazırlanmış kurulumlar kullanılabilir kalır.',
        available: 'Bir güncelleme indirilebilir. Şimdi güncellemek istediğinizden emin misiniz?',
        updating: 'Güncelleme başlatıldı',
        confirm: 'Onayla',
        cancel: 'İptal',
        badge: {
          checking: 'Denetleniyor',
          latest: 'Güncel',
          available: 'Güncelleme var',
          failed: 'Denetim başarısız',
          local: 'Yerel'
        },
        application: {
          title: 'Uygulama'
        },
        system: {
          queryFailed: 'Sistem sürümü alınamadı',
          appUpdateRequired:
            'Bu sistem güncellemesini yüklemeden önce uygulamayı {{version}} sürümüne güncelleyin',
          requiredAppVersion: 'Gerekli uygulama sürümü',
          downloadFailed: 'İndirme veya doğrulama başarısız',
          available: 'Bir temel sistem güncellemesi mevcut.',
          downloading: 'Sistem güncellemesi indiriliyor ve doğrulanıyor...',
          downloadVerify: 'İndir ve doğrula',
          installing: 'Hazırlanmış sistem güncellemesi yükleniyor...',
          install: 'Yükle',
          installFailed: 'Yükleme başarısız',
          installConfirmTitle: 'Sistem güncellemesi yüklensin mi?',
          installConfirmDesc:
            'Bu, doğrulanmış paketteki temel sistem dosyalarını değiştirecek. Yeniden başlatma gerekecek.',
          rawInstallConfirmDesc:
            'Bu doğrulanmış paket raw boot/rootfs imajlarını SD kart bölümlerine yazacak ve otomatik yeniden başlatacak. Yazma birkaç dakika sürebilir; güç bağlı kalsın.',
          rawInstallWarning:
            'Raw bölüm güncellemeleri için otomatik rollback yoktur. Boot başarısız olursa SD kartı elle kurtarın.',
          rawWaitTitle: 'Sistem güncellemesi yükleniyor',
          rawWaitWriting: 'Yeni sistem SD karta yazılıyor',
          rawWaitRestarting:
            'Cihaz yeniden başlatılıyor. Cihaz geri geldiğinde bu sayfa yeniden yüklenir.',
          rawWaitDesc: 'Bu yaklaşık üç dakika sürer. Gücü bağlı tutun ve bu sayfayı kapatmayın.',
          rawWaitSlow: 'Beklenenden uzun sürüyor. Gücü kesmeden önce birkaç dakika daha bekleyin.',
          rebootRequired: 'Bu sistem durumunu etkinleştirmek için yeniden başlatma gerekir.',
          rollingBack: 'Sistem güncellemesi rollback ediliyor...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback hazırlandı',
          rollbackFailed: 'Rollback başarısız',
          rollbackConfirmTitle: 'Sistem güncellemesi rollback edilsin mi?',
          rollbackConfirmDesc:
            'Bu, dosyaları en son sistem güncellemesi yedeğinden geri yükler. Yeniden başlatma gerekecek.',
          stagedDesc: 'Sistem güncellemesi indirildi ve doğrulandı, şimdi yükleyebilirsiniz',
          refresh: 'Yenile',
          releaseNotes: 'Sürüm notları',
          systemVersion: 'Sistem sürümü',
          kernel: 'Kernel',
          stagedVersion: 'Hazırlanmış sürüm',
          archive: 'Arşiv',
          requiredFree: 'Gerekli boş alan',
          fileCount: 'Dosyalar',
          rawImages: 'Raw imajlar',
          progress: 'İlerleme',
          progressMessage: 'İlerleme iletisi',
          pendingVersion: 'Bekleyen sürüm',
          bootHealth: 'Boot sağlığı',
          healthy: 'Sağlıklı',
          unhealthy: 'Dikkat gerekiyor',
          rollbackBackup: 'Rollback yedeği'
        },
        offline: {
          title: 'Uygulama paketini yükle',
          desc: 'Bu bilgisayardan bir uygulama paketi kur. Ardından sunucu yeniden başlar.',
          installTitle: 'Uygulama güncellemesi yüklensin mi?',
          installDesc:
            'Uygulama değiştirilir ve sunucu yeniden başlar. Yeniden oturum açmanız gerekir.'
        },
        local: {
          title: 'Sistem paketini yükle',
          desc: 'Bu bilgisayardan bir sistem paketi kur. Tek bir dosya arşivi ve imzalı üst verilerini içerir.',
          choose: 'Dosya seç',
          invalidFile: 'Uzantısı .tar veya .tar.gz olan bir paket seçin.',
          diskTitle: 'Sanal disk kapatılsın mı?',
          diskWarn:
            'Paket /data dizinine kaydedilir; sanal disk açıkken bu dizin salt okunurdur. Kapatıldığında bilgisayar /data dizinine erişemez. Devam edilsin mi?',
          uploading: 'Yükleniyor',
          verifying: 'Paket doğrulanıyor ve hazırlanıyor',
          keyTitle: 'Yerel güncelleme anahtarı',
          keyDesc: 'Kendi oluşturduğunuz paketlerini imzalayabilen PEM biçiminde genel anahtar',
          keyNone: 'Anahtar ayarlanmadı',
          keySet: 'Anahtarı ayarla',
          keyRemove: 'Kaldır',
          signer: 'İmzalayan',
          section: 'Yerel güncellemeler',
          keyRequired: 'Yerel anahtar gerekli'
        }
      },
      account: {
        title: 'Hesap',
        webAccount: 'Web hesap adı',
        password: 'Şifre',
        passwordDesc: 'Web arayüzüne giriş yaparken kullanılan şifreyi değiştir',
        updateBtn: 'Değiştir',
        logoutBtn: 'Çıkış yap',
        logoutDesc: 'Çıkış yapmak istediğinizden emin misiniz?',
        okBtn: 'Evet',
        cancelBtn: 'Hayır',
        session: {
          title: 'Oturum'
        },
        logoutOnClose: {
          title: 'Tarayıcı kapanınca oturumu kapat',
          description: 'Oturumu açık tutmak yerine tarayıcı kapatıldığında sonlandır'
        },
        totp: {
          title: 'İki adımlı doğrulama',
          authenticator: 'Kimlik doğrulama uygulaması',
          description:
            'Şifrenize ek olarak bir kimlik doğrulama uygulamasından zamana dayalı kod iste',
          required: 'İlke gereği zorunlu',
          disable: 'Devre dışı bırak',
          enableTitle: 'İki adımlı doğrulamayı kur',
          enableDescription:
            'Devam etmek için şifrenizi doğrulayın. İkinci adımda yapılan her değişiklik için gereklidir.',
          continue: 'Devam',
          disableTitle: 'İki adımlı doğrulama devre dışı bırakılsın mı?',
          disableDescription:
            'Hesabınız yalnızca şifreyle korunacak. Devam etmek için şifrenizle doğrulayın.',
          disableFailed: 'İki adımlı doğrulama devre dışı bırakılamadı',
          passwordPlaceholder: 'Mevcut şifre',
          enrollFailed: 'Kurulum başlatılamadı',
          invalidCode: 'Bu kod eşleşmiyor. Bir sonrakini deneyin.',
          scan: 'Bunu kimlik doğrulama uygulamanızla tarayın.',
          manualEntry: 'Veya bu anahtarı elle girin:',
          codePlaceholder: 'Onaylamak için 6 haneli kodu girin',
          confirm: 'Onayla',
          cancel: 'İptal',
          backupTitle: 'Yedek kodlarınızı şimdi kaydedin',
          backupDescription:
            'Her kod yalnızca bir kez çalışır ve bir daha gösterilmez. Kimlik doğrulama uygulamanızı kaybederseniz geri girmenin tek yoludur ve cihaz saati senkronize olmadığında da çalışmaya devam eder.',
          copy: 'Kopyala',
          copied: 'Yedek kodlar kopyalandı',
          savedThem: 'Kaydettim',
          remaining: '{{remaining}} yedek kod kaldı',
          clockUnsynced:
            'Cihaz saati henüz senkronize edilmedi. Kurulumdan önce Ayarlar > Sistem > Saat bölümünde saati senkronize edin.',
          noBackupCodes: "Hiç yedek kod kalmadı. Yeni bir set oluşturmak için Oluştur'u seçin.",
          regenerate: 'Yeni yedek kodlar',
          generate: 'Oluştur',
          regenerateTitle: 'Yeni yedek kodlar oluşturulsun mu?',
          regenerateDescription:
            'Mevcut yedek kodlarınız çalışmayı bırakacak. Devam etmek için şifrenizle doğrulayın.',
          regenerateFailed: 'Yeni yedek kodlar oluşturulamadı',
          download: 'İndir',
          copyFailed: 'Kopyalanamadı. Kodları seçip elle kopyalayın.',
          requireTitle: 'İki adımlı doğrulamayı zorunlu kıl',
          requireDescription:
            'İki adımlı doğrulamanın devre dışı bırakılmasını engeller ve bu özelliği olmayan bir hesabın cihazı kullanmadan önce kurması gerekir',
          requireFailed: 'Gereksinim değiştirilemedi',
          requiredTitle: 'İki adımlı doğrulama gerekli',
          requiredDescription:
            'Bu cihaz ikinci bir adım gerektirecek şekilde yapılandırılmış, ancak hesabınızda henüz kurulu değil. Devam etmek için şimdi kurun.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw asistanı',
      empty: 'Başlamak için bir görevi açıklayın',
      inputPlaceholder: "PicoClaw'un ne yapmasını istediğinizi açıklayın",
      newConversation: 'Yeni görüşme',
      processing: 'İşleniyor...',
      agent: {
        defaultTitle: 'Genel asistan',
        defaultDescription: 'Genel sohbet, arama ve çalışma alanı yardımı',
        kvmTitle: 'Uzaktan kontrol',
        kvmDescription: 'Uzak ana bilgisayarı NanoKVM aracılığıyla çalıştırın',
        switched: 'Temsilci rolü değiştirildi',
        switchFailed: 'Temsilci rolü değiştirilemedi'
      },
      send: 'Gönder',
      cancel: 'İptal',
      status: {
        connecting: 'Ağ geçidine bağlanılıyor...',
        connected: 'PicoClaw oturumu bağlandı',
        disconnected: 'PicoClaw oturumu bağlantısı kesildi',
        stopped: 'Durdurma isteği gönderildi',
        runtimeStarted: 'PicoClaw runtime başlatıldı',
        runtimeStartFailed: 'PicoClaw runtime başlatılamadı',
        runtimeStopped: 'PicoClaw runtime durduruldu',
        runtimeStopFailed: 'PicoClaw runtime durdurulamadı'
      },
      connection: {
        runtime: {
          checking: 'Kontrol ediliyor',
          ready: 'Runtime hazır',
          stopped: 'Runtime durduruldu',
          unavailable: 'Runtime mevcut değil',
          configError: 'Yapılandırma hatası'
        },
        transport: {
          connecting: 'Bağlanıyor',
          connected: 'Bağlandı'
        },
        run: {
          idle: 'Boşta',
          busy: 'Meşgul'
        }
      },
      error: {
        lockHeld: 'PicoClaw başka bir pencerede kullanılıyor',
        takenOver: "Başka bir pencere PicoClaw'ın denetimini devraldı",
        authFailed: 'PicoClaw bağlantıyı reddetti',
        upstreamClosed: 'PicoClaw ile bağlantı kesildi'
      },
      tool: {
        screenshot: 'Ekran görüntüsü alınıyor',
        loadImage: 'Ekran görüntüsüne bakılıyor',
        actions: 'Ana bilgisayar kontrol ediliyor',
        generic: '{{name}} kullanılıyor',
        type: '{{text}} yazılıyor',
        hotkey: '{{keys}} basılıyor',
        click: 'Tıklanıyor',
        doubleClick: 'Çift tıklanıyor',
        move: 'Fare hareket ettiriliyor',
        drag: 'Sürükleniyor',
        scroll: 'Kaydırılıyor',
        wait: 'Bekleniyor'
      },
      message: {
        toolAction: 'Eylem',
        observation: 'Gözlem',
        screenshot: 'Ekran görüntüsü'
      },
      overlay: {
        locked: 'PicoClaw cihazı kontrol ediyor. Manuel giriş duraklatıldı.'
      },
      install: {
        install: "PicoClaw'ı yükle",
        installing: 'PicoClaw yükleniyor',
        success: 'PicoClaw başarıyla yüklendi',
        failed: 'PicoClaw yüklenemedi',
        uninstalled: 'PicoClaw başarıyla kaldırıldı',
        uninstallFailed: 'Kaldırma başarısız oldu',
        requiredTitle: 'PicoClaw kurulu değil',
        requiredDescription: "PicoClaw runtime'ı başlatmadan önce PicoClaw'ı yükleyin.",
        progressDescription: 'PicoClaw indiriliyor ve kuruluyor.',
        stages: {
          preparing: 'Hazırlanıyor',
          downloading: 'İndiriliyor',
          extracting: 'Çıkarılıyor',
          verifying: 'Doğrulanıyor',
          installing: 'Yükleniyor',
          installed: 'Yüklendi',
          install_timeout: 'Zaman aşımı',
          install_failed: 'Başarısız'
        }
      },
      model: {
        requiredTitle: 'Model yapılandırması gerekli',
        requiredDescription: 'PicoClaw sohbetini kullanmadan önce PicoClaw modelini yapılandırın.',
        docsTitle: 'Yapılandırma kılavuzu',
        docsDesc: 'Desteklenen modeller ve protokoller',
        menuLabel: 'Modeli yapılandır',
        modelIdentifier: 'Model tanımlayıcı',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: "API temel URL'si",
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API anahtarı',
        apiKeyPlaceholder: 'Model API anahtarını girin',
        apiKeyKeepPlaceholder: 'Mevcut anahtarı korumak için boş bırakın',
        save: 'Kaydet',
        saving: 'Kaydediliyor',
        saved: 'Model yapılandırması kaydedildi',
        saveFailed: 'Model yapılandırması kaydedilemedi',
        invalid: "Model tanımlayıcı, API temel URL'si ve API anahtarı gereklidir"
      },
      uninstall: {
        confirmTitle: "PicoClaw'ı kaldır",
        confirmContent:
          "PicoClaw'yi kaldırmak istediğinizden emin misiniz? Bu, yürütülebilir dosyayı ve tüm yapılandırma dosyalarını siler.",
        confirmOk: 'Kaldırma'
      },
      history: {
        title: 'Geçmiş',
        loading: 'Oturumlar yükleniyor...',
        emptyTitle: 'Henüz geçmiş yok',
        emptyDescription: 'Önceki PicoClaw oturumlar burada görünecek.',
        loadFailed: 'Oturum geçmişi yüklenemedi',
        deleteFailed: 'Oturum silinemedi',
        deleteConfirmTitle: 'Oturumu sil',
        deleteConfirmContent: '"{{title}}" silmek istediğinizden emin misiniz?',
        deleteConfirmOk: 'Sil',
        messageCount_one: '{{count}} mesaj',
        messageCount_other: '{{count}} mesaj'
      },
      config: {
        startRuntime: "PicoClaw'ı başlat",
        stopRuntime: "PicoClaw'ı durdur",
        stopConfirm: "PicoClaw'ı durdur?"
      },
      start: {
        title: "PicoClaw'ı başlat",
        description: "PicoClaw yardımcısını kullanmaya başlamak için runtime'ı başlatın."
      }
    },
    error: {
      title: 'Bir hata oluştu',
      refresh: 'Yenile'
    },
    fullscreen: {
      toggle: 'Tam ekrana geç'
    },
    menu: {
      collapse: 'Menüyü küçült'
    }
  }
};

export default tr;
