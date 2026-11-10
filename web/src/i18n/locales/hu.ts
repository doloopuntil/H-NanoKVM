const hu = {
  translation: {
    common: {
      confirm: 'Megerősítés',
      cancel: 'Mégse',
      close: 'Bezárás',
      save: 'Mentés',
      discard: 'Elvetés',
      delete: 'Törlés',
      actionFailed: 'A művelet sikertelen',
      loading: 'Beállítások betöltése az eszközről...',
      loadFailed: 'A beállításokat nem sikerült betölteni az eszközről',
      retry: 'Újra'
    },
    head: {
      desktop: 'Távoli asztal',
      login: 'Bejelentkezés',
      firstSetup: 'Első beállítás',
      changePassword: 'Jelszó megváltoztatása',
      terminal: 'Terminál',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Bejelentkezés',
      placeholderUsername: 'Adja meg a felhasználónevet',
      placeholderPassword: 'Adja meg a jelszót',
      placeholderPassword2: 'Adja meg újra a jelszót',
      noEmptyUsername: 'A felhasználónév nem lehet üres',
      noEmptyPassword: 'A jelszó nem lehet üres',
      invalidUser: 'Érvénytelen felhasználónév vagy jelszó',
      locked: 'Túl sok bejelentkezés, kérjük, próbálja újra később',
      globalLocked: 'A rendszer védelem alatt áll, próbálkozzon újra később',
      error: 'Váratlan hiba',
      changePassword: 'Jelszó megváltoztatása',
      changePasswordDesc: 'Az eszköz biztonsága érdekében módosítsa a webes bejelentkezési jelszót',
      differentPassword: 'A jelszavak nem egyeznek',
      illegalUsername: 'A felhasználónév illegális karaktereket tartalmaz',
      illegalPassword:
        'A jelszónak legalább 8 karakter hosszúnak kell lennie, és nem tartalmazhat idézőjelet vagy törtvonalat',
      forgetPassword: 'Jelszó-emlékeztető',
      ok: 'Ok',
      cancel: 'Mégse',
      loginButtonText: 'Bejelentkezés',
      setupTitle: 'Adminisztrátori fiók létrehozása',
      setupDescription:
        'Ezen az eszközön még nincs webes fiók. A folytatáshoz hozza létre az első adminisztrátori fiókot.',
      setupRecovery: 'Ha ez a jelszó elveszik, a helyreállításhoz újra kell írni az SD-kártyát',
      setupButtonText: 'Fiók létrehozása',
      tips: {
        hardenedRecovery:
          'Ez a Hardened image nem támogatja a jelszó visszaállítását a BOOT gombbal. Ha a jelszó elveszik, írja újra az SD-kártyát és hozzon létre új fiókot.',
        change1: 'Vegye figyelembe, hogy ez a művelet a következő jelszavakat módosítja:',
        change2: 'Webes bejelentkezési jelszó',
        change3: 'Rendszer root jelszava az SSH-bejelentkezéshez'
      },
      placeholderCurrentPassword: 'Jelenlegi jelszó',
      placeholderNewPassword: 'Új jelszó',
      wrongCurrentPassword: 'A jelenlegi jelszó helytelen',
      totp: {
        title: 'Kétfaktoros hitelesítés',
        prompt: 'Adja meg a hitelesítő alkalmazás 6 számjegyű kódját',
        backupPrompt: 'Adja meg az egyik tartalék kódját',
        noEmptyCode: 'Adjon meg egy kódot',
        placeholderCode: '6 számjegyű kód',
        placeholderBackup: 'Tartalék kód',
        verifyButtonText: 'Ellenőrzés',
        useBackupCode: 'Tartalék kód használata',
        useAuthenticator: 'A hitelesítő alkalmazás kódjának használata',
        cancel: 'Vissza',
        invalidCode: 'Ez a kód érvénytelen. Próbálja újra.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Wi-Fi beállítása a NanoKVM-hez',
      success: 'Menjen az eszközhöz, és ellenőrizze a NanoKVM hálózati állapotát',
      failed: 'A művelet sikertelen, próbálja újra',
      invalidMode:
        'Az aktuális mód nem támogatja a hálózat beállítását. Kérjük, lépjen az eszközére, és engedélyezze a Wi-Fi konfigurációs módot.',
      confirmBtn: 'Ok',
      finishBtn: 'Kész',
      ap: {
        authTitle: 'Hitelesítés szükséges',
        authDescription: 'A folytatáshoz adja meg az AP jelszót',
        authFailed: 'Érvénytelen AP jelszó',
        passPlaceholder: 'AP-jelszó',
        verifyBtn: 'Ellenőrizze'
      }
    },
    screen: {
      scale: 'Skála',
      title: 'Képernyő',
      video: 'Videó mód',
      videoDirectTips:
        'Ennek a módnak a használatához engedélyezze a HTTPS-t a „Beállítások > Hálózat > Szolgáltatások” menüpontban',
      videoWebrtcBlockedByFirewall:
        'A H.264 WebRTC le van tiltva Korlátozott és Paranoid tűzfal módban',
      transferRunningTitle: 'Képfájl-átvitel folyamatban',
      transferRunningDesc:
        'A videómód módosítása újratölti az oldalt, ami megszakítja a folyamatban lévő képfájl-feltöltést vagy -letöltést.',
      transferRunningOk: 'Mód módosítása',
      resolution: 'Felbontás',
      auto: 'Automatikus',
      autoTips:
        'Bizonyos felbontások esetén képernyőszakadás vagy egéreltolódás léphet fel, ezért módosítsa a távoli gép felbontását vagy kapcsolja ki az automatikus módot',
      fps: 'FPS',
      customizeFps: 'Testreszabás',
      quality: 'Minőség',
      qualityLossless: 'Veszteségmentes',
      qualityHigh: 'Magas',
      qualityMedium: 'Közepes',
      qualityLow: 'Alacsony',
      frameDetect: 'Képkocka-figyelés',
      frameDetectTip:
        'Összehasonlítja a képkockákat, és leállítja a videó küldését, amíg a távoli gép képernyője nem változik',
      resetHdmi: 'HDMI visszaállítása',
      webrtcConnectionFailed: {
        title: 'A WebRTC-kapcsolat sikertelen',
        description: 'Ellenőrizze a hálózati kapcsolatot, vagy váltson videómódot'
      },
      captureStatus: {
        hdmiError: 'HDMI-képernyőhiba',
        unsupportedResolution: 'A jelenlegi felbontás nem támogatott',
        retrieving: 'Kép lekérése...',
        changingResolution: 'Felbontás váltása...',
        updateFailed: 'A kép jelenleg nem frissíthető',
        videoError: 'Videómegjelenítési hiba',
        noHdmi: 'Nem észlelhető HDMI-jel',
        unavailable: 'A kép jelenleg nem jeleníthető meg'
      }
    },
    keyboard: {
      title: 'Billentyűzet',
      paste: 'Beillesztés',
      tips: 'Csak a szabványos billentyűzet betűi és szimbólumai támogatottak',
      placeholder: 'Beillesztendő szöveg',
      local: 'Mobil billentyűzet',
      virtual: 'Képernyő-billentyűzet',
      readClipboard: 'Olvasás a vágólapról',
      clipboardPermissionDenied:
        'A vágólap engedélye megtagadva, engedélyezze a vágólaphoz való hozzáférést a böngészőjében',
      clipboardReadError: 'Nem sikerült beolvasni a vágólapot',
      dropdownEnglish: 'Angol',
      dropdownGerman: 'Német',
      dropdownFrench: 'Francia',
      dropdownRussian: 'Orosz',
      dropdownKorean: 'Koreai',
      dropdownJapanese: 'Japán',
      localInput: 'Mobil billentyűzet bemenete',
      shortcut: {
        title: 'Billentyűparancsok',
        custom: 'Egyedi',
        capture: 'Kattintson ide a parancsikon rögzítéséhez',
        clear: 'Törlés',
        save: 'Mentés',
        captureTips:
          'A rendszerszintű billentyűk, például a Windows billentyű rögzítéséhez teljes képernyős engedély szükséges',
        enterFullScreen: 'Teljes képernyős mód váltása'
      },
      leaderKey: {
        title: 'Leader billentyű',
        desc: 'Kerülje ki a böngésző korlátozásait, és küldje el a rendszer parancsikonjait közvetlenül a távoli gazdagépnek',
        howToUse: 'Használat',
        simultaneous: {
          title: 'Egyidejű üzemmód',
          desc1: 'Tartsa lenyomva a Leader billentyűt, majd nyomja meg a gyorsbillentyűt.',
          desc2: 'Intuitív, de ütközhet a rendszer parancsikonjaival.'
        },
        sequential: {
          title: 'Szekvenciális mód',
          desc1:
            'Nyomja meg a Leader billentyűt → nyomja meg sorban a gyorsbillentyűt → nyomja meg újra a Leader billentyűt.',
          desc2: 'Több lépést igényel, de teljesen elkerülhető a rendszerütközések.'
        },
        enable: 'Leader billentyű engedélyezése',
        tip: 'Leader billentyűként beállítva ez a billentyű kizárólag gyorsbillentyű-indítóként működik, és elveszíti alapértelmezett viselkedését.',
        placeholder: 'Nyomja meg a Leader billentyűt',
        shiftRight: 'Jobb Shift',
        ctrlRight: 'Jobb Ctrl',
        metaRight: 'Jobb Win',
        recorder: {
          rec: 'REC',
          activate: 'Billentyűk aktiválása',
          input: 'Nyomja meg a parancsikont'
        }
      }
    },
    mouse: {
      title: 'Egér',
      cursor: 'Kurzorstílus',
      default: 'Alapértelmezett kurzor',
      cell: 'Cella kurzor',
      text: 'Szöveg kurzor',
      grab: 'Markoló kurzor',
      hide: 'Kurzor elrejtése',
      mode: 'Egér mód',
      absolute: 'Abszolút mód',
      relative: 'Relatív mód',
      direction: 'Görgő iránya',
      scrollUp: 'Görgessen felfelé',
      scrollDown: 'Görgessen le',
      speed: 'Görgő sebessége',
      sensitivity: 'Mutató sebessége',
      sensitivityDesc:
        'Asztali relatív módhoz: az alacsonyabb értékek csökkentik a host egérgyorsításából eredő sodródást',
      fast: 'Gyors',
      slow: 'Lassú',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Mozgassa bárhol a KVM területén; a távoli kurzor megőrzi helyzetét az érintések között, és szinkronban marad az abszolút HID-del'
      },
      requestPointer:
        'Relatív mód használata, kattintson az asztalra, hogy megjelenjen az egérmutató',
      resetHid: 'HID alaphelyzetbe állítása',
      hidOnly: {
        title: 'HID-Only mód',
        desc: 'Ha az egér vagy a billentyűzet nem válaszol, és a HID alaphelyzetbe állítása nem segít, a NanoKVM és a gazdagép közötti kompatibilitási probléma állhat fenn.',
        tip1: 'A HID-Only mód engedélyezése leválasztja a virtuális lemezt és a virtuális hálózatot',
        tip2: 'HID-Only módban a képfájlok csatolása le van tiltva',
        tip3: 'A NanoKVM automatikusan újraindul az üzemmódváltás után',
        enable: 'HID-Only mód engedélyezése',
        disable: 'HID-Only mód letiltása'
      }
    },
    image: {
      title: 'Képek',
      loading: 'Betöltés...',
      empty: 'Nem található semmi',
      mountMode: 'Csatolás mint',
      mount: 'Csatlakoztatás',
      orDownload: 'Vagy letöltés hivatkozásról',
      keepRunning:
        'Bezárhatja ezt az ablakot. Az átvitel folytatódik, és az előrehaladása a képek listájában látható.',
      massStorage: 'Háttértár',
      cdRom: 'CD-ROM',
      mountFailed: 'Csatlakoztatás sikertelen',
      mountDesc:
        'Egyes rendszerekben szükséges lehet a virtuális lemez eltávolítása a távoli gépen, mielőtt a képet csatlakoztatja',
      diskOnWarn:
        'A képfájl csatlakoztatása kikapcsolja a virtuális lemezt, így a számítógép többé nem fér hozzá a /data könyvtárhoz. Folytatja?',
      diskOffWarn:
        'A virtuális lemez ki van kapcsolva, és a képfájl csatlakoztatásához engedélyezni kell. A számítógép USB-eszközei újra felismerésre kerülnek. Folytatja?',
      unmountFailed: 'A leválasztás nem sikerült',
      unmountDesc:
        'Egyes rendszereken manuálisan kell kiadnia a távoli gazdagépről a kép leválasztása előtt',
      forceEject: 'Kényszerített kiadás',
      forceEjectConfirm:
        'A gazdagép zárolta az optikai meghajtót. A kényszerített kiadás rövid időre leválasztja a virtuális USB-eszközt, ezért a billentyűzet és az egér is átmenetileg lecsatlakozhat. Folytatja?',
      usbReconnect: 'USB újracsatlakoztatás',
      usbReconnectConfirm:
        'Csak akkor csatlakoztassa újra az USB gadgetet, ha a távoli gép nem észlelte a médiaváltást. A billentyűzet és az egér röviden megszakadhat.',
      usbReconnectSuccess: 'USB újracsatlakoztatva',
      usbReconnectFailed: 'Az USB újracsatlakoztatás sikertelen',
      addImage: 'Kép hozzáadása',
      fromUrl: 'URL-ről',
      fromFile: 'Fájlból',
      turnOff: 'Kikapcsolás',
      deleteDiskShared: 'A képek nem törölhetők, amíg a virtuális lemez be van kapcsolva.',
      eject: 'Kiadás',
      download: 'Letöltés',
      upload: 'Feltöltés',
      mountTitle: 'Kép csatlakoztatása',
      deleteTitle: 'Kép törlése',
      deleteConfirm: 'Biztosan törli ezt a képet?',
      tips: {
        title: 'Hogyan tölts fel képeket',
        usb1: 'Csatlakoztassa a NanoKVM-t a számítógépéhez USB-n keresztül.',
        usb2: 'Győződjön meg róla, hogy a virtuális lemez csatlakoztatva van itt: Beállítások > Eszköz > Virtuális lemez.',
        usb3: 'Nyissa meg a virtuális lemezt a számítógépén, és másolja a kép fájlt a virtuális lemez gyökérkönyvtárába.',
        scp1: 'Győződjön meg róla, hogy a NanoKVM és a számítógépe ugyanazon a helyi hálózaton van.',
        scp2: 'Nyisson meg egy terminált a számítógépén, és használja az SCP parancsot a kép fájl feltöltésére a /data könyvtárba a NanoKVM-en.',
        scp3: 'Példa: scp your-image-path root@your-nanokvm-ip:/data',
        tfCard: 'SD kártya',
        tf1: 'Ez a módszer támogatott Linux rendszeren',
        tf2: 'Vegye ki a SD kártyát a NanoKVM-ből. A FULL verziónál először szedje szét a házat.',
        tf3: 'Helyezze a SD kártyát egy kártyaolvasóba, és csatlakoztassa a számítógépéhez.',
        tf4: 'Másolja a képfájlt a SD kártya /data könyvtárába.',
        tf5: 'Helyezze vissza a SD kártyát a NanoKVM-be.'
      }
    },
    script: {
      title: 'Szkriptek',
      upload: 'Feltöltés',
      run: 'Futtatás',
      runBackground: 'Háttérben futtatás',
      runFailed: 'Futtatás sikertelen',
      delDesc: 'Biztosan törli ezt a fájlt?',
      delete: 'Törlés',
      close: 'Bezárás',
      unlockDesc:
        'A szkriptek rootként futnak a NanoKVM-en. Szkript feltöltéséhez vagy futtatásához adja meg a webes fiók jelszavát.',
      terminalRequired:
        'A szkriptekhez webes terminálhozzáférés szükséges. Először engedélyezze a terminált a beállításokban.'
    },
    terminal: {
      title: 'Terminál',
      nanokvm: 'NanoKVM terminál',
      serial: 'Soros port terminál',
      unlockTitle: 'Terminál feloldása',
      unlockDesc: 'Terminálmunkamenet indításához adja meg a webes fiók jelszavát',
      unlock: 'Feloldás',
      unlockFailed: 'A terminál feloldása sikertelen',
      invalidCredentials: 'Érvénytelen felhasználónév vagy jelszó',
      locked: 'Túl sok próbálkozás, próbálja újra később',
      sessionClosed: 'A terminálmunkamenet bezárult. Kapcsolódáshoz oldja fel újra.',
      sessionError: 'A terminálkapcsolat sikertelen. Próbálja újra a feloldást.',
      serialPort: 'Soros port',
      serialPortPlaceholder: 'Például /dev/ttyS1',
      baudrate: 'Baudráta',
      parity: 'Paritás',
      parityNone: 'Nincs',
      parityEven: 'Páros',
      parityOdd: 'Páratlan',
      flowControl: 'Áramlásszabályozás',
      flowControlNone: 'Nincs',
      flowControlSoft: 'Szoftveres',
      flowControlHard: 'Hardveres',
      dataBits: 'Adatbitek',
      stopBits: 'Stop bitek',
      open: 'Terminál megnyitása'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Parancs küldése...',
      sent: 'Parancs elküldve',
      input: 'MAC-cím',
      ok: 'OK'
    },
    download: {
      input: 'Távoli képfájl URL-je',
      ok: 'OK',
      disabled:
        'A képfájlok jelenleg nem tölthetők le és nem tölthetők fel, mert a tároló nem írható. Ha egy képfájl csatlakoztatva van, válassza le, majd kapcsolja ki a virtuális lemezt, hogy a tároló újra írható legyen.',
      diskShared: 'Kapcsolja ki a virtuális lemezt a képfájl-letöltés használatához',
      mountedImage:
        'Ez a lemezkép fel van csatolva, csatolja le, mielőtt azonos nevű fájlt tölt fel',
      diskOff: 'Virtuális lemez kikapcsolása',
      uploadbox: 'Dobja ide a fájlt, vagy kattintson a kiválasztáshoz',
      inputfile: 'Képfájl',
      NoISO: 'Nincs képfájl',
      complete: 'Letöltés kész',
      uploadComplete: 'Feltöltés kész',
      downloading: 'Letöltés',
      uploading: 'Feltöltés',
      failed: 'Az átvitel sikertelen',
      uploadFailed: 'A feltöltés sikertelen',
      stalled: 'Az átvitel megakadt, ellenőrizze a kapcsolatot, majd próbálja újra',
      canceled: 'Feltöltés megszakítva',
      downloadCanceled: 'Letöltés megszakítva',
      cancel: 'Mégse',
      remoteDisabled:
        'A távoli ISO-letöltés le van tiltva a Beállítások > Felhasználó > Preferenciák alatt',
      remoteFailed: 'A távoli ISO-letöltés sikertelen',
      sha256: 'Opcionális SHA-256 ellenőrzőösszeg',
      sha256Placeholder: 'Adjon meg egy 64 karakteres SHA-256 ellenőrzőösszeget',
      invalidSHA256: 'A SHA-256 értékének 64 karakteres hexadecimális karakterláncnak kell lennie',
      checksumFailed: 'Sikertelen letöltés: a SHA-256 ellenőrzése sikertelen'
    },
    power: {
      title: 'Bekapcsolás',
      showConfirm: 'Megerősítés',
      showConfirmTip: 'Az áramellátási műveletekhez külön megerősítés szükséges',
      reset: 'Újraindítás',
      powerShort: 'Bekapcsológomb: rövid kattintás',
      powerLong: 'Bekapcsológomb: hosszú kattintás',
      resetConfirm: 'Végrehajtja a visszaállítási műveletet?',
      powerConfirm: 'Végrehajtja a tápellátási műveletet?',
      okBtn: 'Igen',
      cancelBtn: 'Nem'
    },
    settings: {
      title: 'Beállítások',
      about: {
        title: 'Névjegy',
        information: 'Információ',
        ip: 'IP-cím',
        mdns: 'Helyi cím',
        application: 'Alkalmazás verzió',
        uptime: 'Üzemidő',
        community: 'Közösség',
        credit: 'A Sipeed <a1>NanoKVM</a1>-jére és woffko <a2>Hardened NanoKVM</a2>-jére épül',
        hostname: 'Eszköznév',
        changeIn: 'Itt módosítható: {{path}}',
        updateIn: 'Itt frissíthető: {{path}}',
        toggleIn: 'Itt kapcsolható be vagy ki: {{path}}'
      },
      appearance: {
        title: 'Preferenciák',
        display: 'Kijelző',
        language: 'Nyelv',
        languageDesc: 'Válassza ki a felület nyelvét',
        webTitle: 'Webcím',
        webTitleDesc: 'A weboldal címének testreszabása',
        layoutMode: 'Felület elrendezése',
        layoutModeDesc: 'Telefonos/érintéses elrendezés használata ebben a böngészőben',
        layoutAuto: 'Automatikus',
        layoutMobile: 'Telefon',
        menuBar: {
          title: 'Menüsor',
          mode: 'Megjelenítési mód',
          modeDesc: 'Menüsor megjelenítése a képernyőn',
          modeOff: 'Ki',
          modeAuto: 'Automatikus elrejtés',
          modeAlways: 'Mindig látható',
          keyboardLedStatus: 'Billentyűzár-jelzők',
          keyboardLedStatusDesc:
            'A távoli számítógép Num Lock, Caps Lock és Scroll Lock állapotának megjelenítése',
          icons: 'Almenü ikonok',
          iconsDesc: 'Almenüikonok megjelenítése a menüsorban',
          terminalWarningTitle: 'Engedélyezi a webes terminált?',
          terminalWarningDesc:
            'A terminál root shellt nyit a böngészőben. Csak megbízható hálózaton engedélyezze, és használat után kapcsolja ki.',
          terminalWarningConfirm: 'Engedélyezés',
          remoteDownload: 'Távoli ISO letöltése',
          remoteDownloadWarningTitle: 'Engedélyezi a távoli ISO-letöltést?',
          remoteDownloadWarningDesc:
            'A NanoKVM ISO-t tölt le egy URL-ről és a /data alá írja. Csak megbízható URL-ekhez engedélyezze, majd kapcsolja ki.',
          remoteDownloadWarningConfirm: 'Engedélyezés'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Távoli billentyűzárak állapota',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Be',
        off: 'Ki',
        unknown: 'Ismeretlen'
      },
      device: {
        title: 'Eszköz',
        minutes: 'perc',
        sections: {
          general: 'Általános',
          connectivity: 'Kapcsolatok',
          hostConnection: 'Gazdagép-kapcsolat',
          inputOutput: 'Bemenet és kimenet'
        },
        oled: {
          title: 'OLED időkorlátja',
          description: 'OLED kijelző kikapcsolása ennyi idő után',
          keepOn: 'OLED bekapcsolva tartása',
          keepOnDescription: 'Az OLED képernyő sosem kapcsol ki'
        },
        ssh: {
          description: 'Engedélyezze a SSH távoli hozzáférést',
          tip: 'Az opció engedélyezése előtt állítson be erős jelszót itt: Fiók > Jelszó'
        },
        swap: {
          title: 'Swap',
          description: 'Swap fájl használata, ha fogy a memória',
          size: 'Swap mérete',
          sizeDescription: 'Állítsa be a swap fájl méretét',
          tip: 'Ennek a funkciónak az engedélyezése lerövidítheti az SD-kártya élettartamát'
        },
        mouseJiggler: {
          title: 'Mouse jiggler',
          description: 'A távoli gazdagép alvó állapotának megakadályozása',
          disable: 'Letiltás',
          absolute: 'Abszolút mód',
          relative: 'Relatív mód'
        },
        sessionLock: {
          title: 'Munkamenet zárolása inaktivitáskor',
          description: 'Ennyi idő után új bejelentkezést kér'
        },
        mdns: {
          description: 'Engedélyezze az mDNS felderítési szolgáltatást',
          tip: 'Lehetővé teszi az eszköz elérését a .local nevén. Nem szükséges, ha IP-címmel csatlakozik, vagy a DNS már feloldja a gépnevet.'
        },
        hdmi: {
          description: 'HDMI/monitor kimenet engedélyezése',
          idleTimeoutTitle: 'Inaktív rögzítés időkorlátja',
          idleTimeoutDescription: 'A HDMI-rögzítés leállítása, ha nincs aktív néző ennyi ideig:'
        },
        hidOnly: 'HID-Only mód',
        hidOnlyDesc:
          'Javítja a gazdagéppel való kompatibilitást, ha az egér vagy a billentyűzet nem válaszol',
        hidOnlyTip:
          'A HID-Only mód leállítja a virtuális eszközök emulálását, és csak az alapvető HID vezérlést tartja meg',
        disk: 'Virtuális lemez',
        diskDesc: 'SD-kártya csatlakoztatása a távoli gazdagéphez',
        diskLocked:
          'Kikapcsolva, amíg egy képfájl csatlakoztatva van, és a bekapcsolása megszakítja a csatlakoztatást',
        diskEnable: 'Virtuális lemez engedélyezése',
        networkChange: 'Virtuális hálózat módosítása',
        diskCancelMount:
          'A virtuális lemez engedélyezése megszakítja a csatlakoztatott képfájlt. Folytatja?',
        networkCancelMount:
          'A virtuális hálózat módosítása újraindítja az USB-kapcsolatot. Ez megszakítja a csatlakoztatott képfájlt, és engedélyezi a virtuális lemezt. Folytatja?',
        diskTransferRunning:
          'Képfájl-átvitel van folyamatban. Várja meg, amíg befejeződik, mielőtt engedélyezi a virtuális lemezt.',
        network: 'Virtuális hálózat',
        networkDesc: 'Virtuális hálózati kártya csatlakoztatása a távoli gazdagépen',
        usbWakeup: 'USB-ébresztés',
        usbWakeupDesc:
          'Engedje, hogy a billentyűzet vagy egér eseményei felébresszék a távoli gépet',
        usbWakeupTip: 'Kapcsolja ki, ha a gép ismétlődő USB wakeup üzeneteket naplóz',
        hostname: {
          description: 'Az eszköz neve a hálózaton',
          reachable: 'Elérhető a helyi hálózaton ezen a néven: {{address}}'
        },
        rebootRequired: 'Újraindítás szükséges',
        rebootPending: 'Újraindítás szükséges: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Rendszerfrissítés'
        },
        reboot: 'Újraindítás',
        rebootDesc: 'Biztos, hogy újra akarja indítani a NanoKVM-t?',
        poweroff: 'Kikapcsolás',
        poweroffDesc:
          'Biztosan kikapcsolja a NanoKVM-et? Nem lesz elérhető, amíg újra be nem kapcsolják.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Kapcsolat',
        configuration: 'Konfiguráció',
        wifi: {
          title: 'Wi-Fi',
          description: 'Wi-Fi beállítása',
          apMode: 'Az AP mód engedélyezve van, csatlakozzon a Wi-Fihez a QR-kód beolvasásával',
          connect: 'Wi-Fi csatlakoztatása',
          connectDesc1: 'Adja meg a hálózat SSID-jét és jelszavát',
          disconnect: 'Biztosan bontja a hálózati kapcsolatot?',
          disconnectBtn: 'Leválasztás',
          connected: 'Csatlakoztatva',
          ssid: 'Név',
          password: 'Jelszó',
          joinBtn: 'Csatlakozás',
          cancelBtn: 'Mégse'
        },
        tls: {
          description: 'HTTPS protokoll engedélyezése',
          tip: 'Figyelem: A HTTPS használata növelheti a késleltetést, különösen MJPEG videó módban',
          restartTitle: 'A szerver újraindul',
          restartDesc:
            'A protokoll módosítása újraindítja a szervert. A böngésző {{seconds}} másodperc után az új címre vált:',
          restartOk: 'Alkalmazás és újraindítás',
          confirmTitle: 'Megtartja az új protokollt?',
          confirmDesc:
            'A szerver most {{protocol}} protokollon fut. {{seconds}} másodperc múlva visszatér az előző protokollra, ha nem tartja meg.',
          confirmKeep: 'Megtartás',
          confirmRevert: 'Vissza',
          reverting:
            'Visszatérés az előző protokollra. A böngésző {{seconds}} másodperc után arra a címre vált.',
          certTitle: 'Megtartja az új tanúsítványt?',
          certDesc:
            'A szerver most az új tanúsítványt használja. {{seconds}} másodperc múlva visszaáll az előzőre, ha nem tartja meg.',
          certReverted: 'Az előző tanúsítvány visszatért'
        },
        trustedProxies: {
          section: 'Fordított proxy',
          title: 'Megbízható proxyk',
          description:
            'Fordított proxyk, amelyeknek az eszköz hisz az ügyfél címének és protokolljának megadásában',
          tip: 'A listán szereplő cím választja ki azt az ügyfélcímet, amelyet a bejelentkezési korlát és a napló rögzít, ezért csak saját proxykat adjon meg',
          none: 'Nincs',
          edit: 'Szerkesztés',
          editRow: 'Lista szerkesztése',
          editTitle: 'Megbízható proxyk szerkesztése',
          editDescription: 'A lista módosításához szükség van a jelszavára',
          dialogDescription:
            'Adja meg minden fordított proxy címét úgy, ahogy ez az eszköz látja, vagy egy tartományt, például 10.0.0.0/24. A listán szereplő proxy megmondja az eszköznek, melyik ügyfélcímet és protokollt használja. Mindent elhisz, amit továbbít, ezért csak saját proxykat adjon meg.'
        },
        certificate: {
          title: 'Tanúsítvány',
          desc: 'Honnan származik a HTTPS-tanúsítvány',
          requesting: 'Tanúsítvány igénylése folyamatban',
          selfSigned: 'Önaláírt',
          domain: 'Tartomány',
          domainDesc:
            'Erre az eszközre kell mutatnia, és a 443-as portnak elérhetőnek kell lennie az internetről',
          domainTailscale: 'A Tailscale állítja be ehhez az eszközhöz',
          domainInvalid: 'Teljes tartománynevet használjon, például kvm.example.org',
          email: 'E-mail',
          emailDesc: "Nem kötelező, a Let's Encrypt értesítéseihez",
          emailInvalid: 'Olyan címet használjon, mint nev@example.org',
          validUntil: 'Érvényes eddig',
          valid: 'Érvényes',
          expiresSoon: 'Hamarosan lejár',
          expired: 'Lejárt',
          lastRenewal: 'Utolsó megújítás',
          renewed: 'Megújítva',
          failed: 'Sikertelen',
          renewNow: 'Megújítás most',
          renewNowDesc: 'Új tanúsítvány kérése várakozás nélkül',
          renewBtn: 'Megújítás',
          applyTitle: 'Tanúsítvány módosítása',
          applyOk: 'Alkalmaz',
          applyAcme:
            "Az eszköz tanúsítványt kér a Let's Encrypttől. A Let's Encrypt az ellenőrzéshez az internet felől csatlakozik a 443-as porthoz, ami akár egy percet is igénybe vehet. Ha a kérés sikertelen, a jelenlegi tanúsítvány marad használatban.",
          applyTailscale:
            'Az eszköz tanúsítványt kap a Tailscale-től, ami akár egy percet is igénybe vehet. Ha a kérés sikertelen, a jelenlegi tanúsítvány marad használatban.',
          applySelfSigned:
            'Az eszköz visszatér a saját önaláírt tanúsítványához. A böngészők figyelmeztetnek rá.',
          openTitle: 'Az új cím megnyitása',
          openDesc:
            'A tanúsítvány kész. Nyissa meg az alábbi címet, és jelentkezzen be a megtartásához. Megerősítése nélkül 3 percen belül visszatér az előző tanúsítvány.',
          openOk: 'Megnyitás',
          blockedClock: 'Tanúsítvány csak az eszköz órájának szinkronizálása után igényelhető',
          blockedParanoid: 'A Paranoid tűzfal mód blokkolja a tanúsítványkéréseket',
          tailscaleUnavailable:
            'A Tailscale nem fut, vagy a HTTPS-tanúsítványok nincsenek engedélyezve a tailnethez'
        },
        dns: {
          title: 'DNS',
          description: 'DNS-kiszolgálók beállítása a NanoKVM számára',
          ipv4Title: 'IPv4',
          ipv4Description: 'IPv4-címzés beállítása a vezetékes interfészhez',
          servers: 'Kiszolgálók',
          dhcp: 'DHCP',
          manual: 'Kézi',
          apply: 'Alkalmaz',
          invalid: 'Adjon meg érvényes IPv4- vagy IPv6-címet',
          invalidNetwork: 'Adjon meg érvényes IPv4-címet, alhálózati maszkot és útválasztót',
          saved: 'DNS-beállítások mentve',
          redirecting: 'A hálózati beállítások mentve. Az új cím megnyitása...',
          saveFailed: 'Nem sikerült menteni a DNS-beállításokat',
          unsaved: 'Nem mentett módosítások',
          maxServers: 'Legfeljebb {{count}} DNS-kiszolgáló engedélyezett',
          dhcpServersDescription: 'A DNS-kiszolgálók automatikusan DHCP-n keresztül érkeznek',
          manualServersDescription: 'Az IPv4- és IPv6-kiszolgálók is támogatottak',
          interface: 'Interfész',
          ipAddress: 'IP-cím',
          subnetMask: 'Alhálózati maszk',
          router: 'Útválasztó'
        },
        ipv6: {
          title: 'IPv6',
          description: 'IPv6-címzés beállítása a vezetékes interfészen',
          disabled: 'Letiltva',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Kézi',
          interface: 'Interfész',
          state: 'Állapot',
          router: 'Útválasztó',
          addresses: 'Címek',
          dhcpv6Client: 'DHCPv6 kliens',
          notInstalled: 'Nincs telepítve',
          ipAddress: 'IPv6-cím',
          prefix: 'Előtag',
          invalidManual: 'Adjon meg érvényes IPv6-címet, előtagot és útválasztót',
          clientMissing:
            'A DHCPv6 kliens nincs telepítve. Először telepítsd a megfelelő raw rendszerfrissítést.',
          saved: 'IPv6-beállítások mentve',
          saveFailed: 'Nem sikerült menteni az IPv6-beállításokat',
          unsaved: 'Nem mentett módosítások'
        }
      },
      system: {
        title: 'Rendszer',
        performance: {
          processor: 'Processzor',
          overdrive: {
            title: 'Órajel-túlhajtás',
            description: 'Indítás a gyártó által megadott magasabb processzor- és videóórajelekkel',
            tip: 'Ha az eszköz túlhajtással nem indul el, az SD-kártyát újra kell írni',
            unavailable: 'Nem része ennek a rendszerképnek',
            keepTitle: 'Overdrive megtartása frissítések után',
            keepDescription:
              'A rendszerfrissítés visszaállítja az eszközt a szabványos órajelekre, ha ez nincs bekapcsolva',
            confirmTitle: 'Bekapcsolja az órajel-túlhajtást?',
            confirmText:
              'Ha az eszköz túlhajtással nem indul el, az SD-kártyát újra kell írnia a helyreállításhoz. A módosítás a következő újraindítás után lép életbe.',
            confirmOk: 'Engedélyezés'
          },
          watchdog: {
            title: 'Hardveres watchdog',
            description: 'Az eszköz automatikus újraindítása, ha nem válaszol',
            unavailable: 'Nem része ennek a rendszerképnek',
            notRunning: 'Jelenleg nem fut',
            lastRestart: 'Utolsó újraindítás',
            lastRestartCaption: 'A rendszer legutóbbi újraindulásának oka',
            reasonPowerOn: 'Bekapcsolás',
            reasonRestart: 'Kért újraindítás',
            reasonWatchdog: 'Watchdog-alaphelyzet',
            reasonOverheat: 'Túlmelegedés elleni védelem',
            reasonUnknown: 'Ismeretlen'
          },
          recovery: 'Helyreállítás',
          memory: 'Memória'
        },
        monitor: {
          processorClock: 'CPU alrendszer',
          videoClock: 'Videó alrendszer',
          videoClockCaption: 'Videó órajel-frekvenciája',
          cpuClockCaption: 'CPU órajel-frekvenciája',
          overdrive: 'Túlhajtás',
          temperature: 'Hőmérséklet',
          lastMinutes: 'Utolsó 5 perc',
          ram: 'RAM',
          off: 'Ki',
          ramHistory: 'RAM-használat',
          cpuLoad: 'CPU-terhelés',
          cpuLoadCaption: 'Felhasználó {{user}} százalék, rendszer {{system}} százalék',
          cpuUtilization: 'CPU-kihasználtság',
          swapUtilization: 'Swap-kihasználtság',
          swapSizeLastMinutes: '{{size}}, utolsó 5 perc',
          percent: '{{percent}} százalék',
          percentUsed: '{{percent}} százalék használatban',
          sizeOf: '{{used}} / {{total}}',
          systemPartition: 'Rendszerpartíció',
          dataPartition: 'Adatpartíció',
          unavailable: 'Nem érhető el',
          noReadings: 'Az eszköz nem ad vissza mérési adatokat',
          refresh: 'Másodpercenként frissül, amíg az oldal nyitva van'
        },
        sections: {
          time: 'Idő',
          firewall: 'Tűzfal',
          systemLog: 'Naplózás',
          performance: 'Teljesítmény',
          monitor: 'Monitor',
          services: 'Szolgáltatások',
          webInterface: 'Biztonságos webes elérés'
        },
        time: {
          saveFailed: 'Nem sikerült menteni az időbeállításokat',
          saved: 'Időbeállítások mentve',
          syncFailed: 'Nem sikerült szinkronizálni az időt',
          synced: 'Idő szinkronizálva',
          invalidServers: 'Adjon meg legalább egy NTP-szervert',
          maxServers: 'Legfeljebb {{count}} NTP-szerver engedélyezett',
          refresh: 'Frissítés',
          syncNow: 'Szinkronizálás',
          syncNowDesc: 'Az óra beállítása az NTP-kiszolgálókról most',
          save: 'Mentés',
          ntp: {
            title: 'NTP',
            description: 'Eszközidő szinkronizálása a beállított NTP-szerverekről'
          },
          networkTime: 'Hálózati idő',
          clock: {
            title: 'Óra',
            description: 'A naplók és a felület által használt helyi időzóna beállítása',
            current: 'Aktuális idő',
            timezone: 'Időzóna'
          },
          servers: {
            title: 'NTP-szerverek',
            description:
              'Használja az alapértelmezett nyilvános szervereket, a helyi routert vagy egyéni NTP-szervereket',
            useRouter: 'Router használata',
            useDefaults: 'Alapértékek használata',
            presets: 'Kiszolgáló-előbeállítások',
            presetsDesc: 'A kiszolgálólista cseréje egy előbeállításra'
          }
        },
        firewall: {
          saveFailed: 'Nem sikerült alkalmazni a tűzfalbeállításokat',
          saved: 'Tűzfalbeállítások alkalmazva',
          cancel: 'Mégse',
          refresh: 'Frissítés',
          backends: 'Backendek',
          enableHttpsFirst:
            'A Korlátozott vagy Paranoid tűzfalmód engedélyezése előtt engedélyezze a HTTPS-t',
          httpsRequired:
            'A Korlátozott és Paranoid mód le van tiltva, amíg a HTTPS nincs engedélyezve a Beállítások > Hálózat > Szolgáltatások alatt',
          mode: {
            title: 'Tűzfal mód',
            baseline: 'Alap',
            baselineDesc:
              'Nyitott kompatibilitási profil. A tűzfal fut, de a bejövő forrásokat nem korlátozza. Csak megbízható hálózatokon használja.',
            moderate: 'Mérsékelt',
            moderateDesc:
              'Alapértelmezett profil. Megtartja az Alap szolgáltatásait, de új bejövő kapcsolatokat csak privát, link-local vagy loopback tartományokból fogad el. A kimenő hozzáférés nyitva marad.',
            restricted: 'Korlátozott',
            restrictedDesc:
              'Csak helyi HTTPS és SSH, valamint kimenő DNS, NTP, syslog és online frissítések. A DHCP és a lényeges IPv6-forgalom elérhető marad. A WebRTC le van tiltva.',
            paranoid: 'Paranoid',
            paranoidDesc:
              'Csak helyi HTTPS-hozzáférés. Blokkolja az SSH-t, a HTTP-t, az online frissítéseket és a többi kimenő hálózati funkciót. Az offline frissítések feltöltése és az már előkészített telepítések elérhetők maradnak.',
            current: 'Jelenlegi',
            default: 'Alapértelmezett',
            localOnly: 'Csak helyi',
            openTag: 'Bejövő nyitott',
            httpsRequiredTag: 'HTTPS szükséges',
            outboundOpen: 'Kimenő nyitott',
            outboundLimited: 'Kimenő korlátozott',
            httpsOnly: 'Csak HTTPS'
          },
          moderate: {
            apply: 'Váltás Mérsékelt módra'
          },
          restricted: {
            enable: 'Korlátozott engedélyezése',
            confirmTitle: 'Engedélyezi a Korlátozott módot?',
            confirmDesc:
              'A bejövő adminisztrációs hozzáférés HTTPS és SSH esetén private IPv4, IPv4 link-local/loopback, IPv6 link-local vagy IPv6 loopback forrástartományokra korlátozódik. Nyilvános forrástartományok nem engedélyezettek. A kimenő DNS, NTP, távoli syslog, online frissítések, DHCP, meglévő kapcsolatok és alapvető IPv6 vezérlőforgalom elérhető marad. A WebRTC/ICE UDP és minden más bejövő/kimenő forgalom blokkolva lesz.'
          },
          paranoid: {
            enable: 'Paranoid engedélyezése',
            confirmTitle: 'Engedélyezi a Paranoid módot?',
            confirmDesc:
              'Csak a HTTPS-hozzáférés marad elérhető private IPv4, IPv4 link-local/loopback, IPv6 link-local vagy IPv6 loopback forrástartományokból. Az SSH, HTTP, mDNS, NTP, GitHub-letöltések és más forgalom blokkolva lesz, kivéve a minimális DHCP/IPv6 vezérlést.'
          },
          baseline: {
            apply: 'Váltás Alap módra',
            confirmTitle: 'Átvált a nyitott Alap módra?',
            confirmDesc:
              'A tűzfalszolgáltatás aktív marad, de megszűnik a csak helyi forrástartományokra vonatkozó korlátozás. A nyilvános forrástartományok elérhetik a NanoKVM nyilvános szolgáltatásait, ha a hálózat továbbítja őket.'
          },
          rules: {
            title: 'Aktuális szabályok',
            empty: 'Nincsenek szabályok'
          }
        },
        saveChanges: 'Módosítások mentése',
        unsaved: 'Nem mentett módosítások'
      },
      systemLog: {
        saveFailed: 'Nem sikerült menteni a naplóbeállításokat',
        saved: 'Naplóbeállítások mentve',
        invalidHost: 'Adjon meg egy syslog-szerver hostot',
        logLoadFailed: 'Nem sikerült betölteni a naplókat',
        save: 'Mentés',
        test: 'Teszt napló küldése',
        testSent: 'Teszt napló elküldve',
        testFailed: 'Nem sikerült elküldeni a teszt naplót',
        remote: {
          title: 'Távoli naplózás',
          forward: 'Rendszernapló továbbítása',
          description: 'A rendszerüzenetek továbbítása távoli szerverre',
          host: 'Szerver',
          hostDesc: 'A syslog szerver állomásneve vagy IPv4-címe',
          port: 'Port',
          protocol: 'A syslog-szerver UDP-portja'
        },
        local: {
          title: 'Rendszernapló-puffer',
          description:
            'Az aktuális naplók RAM-ban, a {{path}} útvonalon maradnak, hogy elkerülje az SD-kártya írását',
          priority: 'Minimális prioritás',
          priorityDesc: 'Az üzenet naplózásához szükséges minimális sürgősség',
          buffer: 'Pufferméret',
          bufferDesc: 'A naplófájl mérete, amelynél a fájl rotálásra kerül',
          rotations: 'Rotációk',
          rotationsDesc: 'A megőrzött rotált naplófájlok száma',
          compact: 'Kompakt kimenet',
          compactDesc: 'Az állomásnév és a facility elhagyása minden sorból',
          stripTimestamps: 'Időbélyegek eltávolítása',
          stripTimestampsDesc:
            'A küldő által hozzáadott időbélyegek eltávolítása; a syslog sajátot ad hozzá'
        },
        kernel: {
          title: 'Kernel-naplózás',
          enabled: 'Kernelnapló továbbítása',
          enabledDesc: 'A kernelüzenetek rögzítése a rendszernaplóban',
          consoleLevel: 'Konzolszint',
          consoleLevelDesc: 'A kernelüzenet konzolra írásához szükséges minimális sürgősség'
        },
        viewer: {
          title: 'Rendszernapló',
          refresh: 'Frissítés',
          empty: 'Nincsenek naplóbejegyzések',
          truncated: 'Csak a legfrissebb naplóadatok láthatók',
          linesUnit: 'sor'
        },
        level: {
          '1': '1 - Riasztás',
          '2': '2 - Kritikus',
          '3': '3 - Hiba',
          '4': '4 - Figyelmeztetés',
          '5': '5 - Értesítés',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Mind'
        }
      },
      user: {
        title: 'Felhasználó'
      },
      networking: {
        title: 'Hálózat'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Titkosított alagút',
        device: 'Ez az eszköz',
        description: 'Érje el ezt a KVM-et WireGuard-alagúton keresztül',
        unavailable: 'A WireGuard nincs telepítve ezen az eszközön',
        blocked: 'A Paranoid tűzfal mód blokkolja a WireGuardot',
        needsKey: 'Állítson be privát kulcsot a WireGuard bekapcsolása előtt',
        saved: 'A WireGuard beállításai mentve',
        save: 'Módosítások mentése',
        unsaved: 'Nem mentett módosítások',
        invalid: 'Ellenőrizze a kiemelt mezőket',
        invalidAddress: 'Adjon meg egy címet maszkkal, például 10.0.0.1/24',
        invalidKey: 'Adjon meg egy 44 karakteres WireGuard-kulcsot',
        invalidEndpoint: 'Adjon meg egy állomásnevet vagy IP-címet',
        invalidPort: 'Adjon meg egy portot 1 és 65535 között',
        invalidRanges: 'Használjon IPv4-tartományokat, például 10.0.0.0/24, ne 0.0.0.0/0-t',
        status: {
          connected: 'Csatlakozva',
          waiting: 'Várakozás a partnerre',
          stopped: 'Leállítva',
          handshake: 'Utolsó kézfogás {{time}}'
        },
        privateKey: {
          title: 'Privát kulcs',
          description: 'Ezen az eszközön marad, és soha többé nem jelenik meg',
          set: 'Beállítva',
          notSet: 'Nincs beállítva',
          setBtn: 'Beállítás',
          generate: 'Generálás',
          remove: 'Eltávolítás',
          modalTitle: 'Privát kulcs beállítása',
          modalDescription: 'A kulcs ezen az eszközön tárolódik, és soha többé nem jelenik meg',
          placeholder: 'Illessze be a privát kulcsot',
          generateConfirmTitle: 'Új privát kulcs generálása?',
          generateConfirmDesc:
            'A jelenlegi kulcs nem fog működni. Utána adja hozzá az új nyilvános kulcsot a partnerhez.',
          removeConfirmTitle: 'Eltávolítja a privát kulcsot?',
          removeConfirmDesc:
            'A WireGuard kikapcsol, és kikapcsolva marad, amíg új kulcsot nem állít be.'
        },
        publicKey: {
          title: 'Nyilvános kulcs',
          description: 'Adja hozzá a partner konfigurációjához'
        },
        address: {
          title: 'Cím',
          description: 'A KVM címe az alagútban és annak maszkja'
        },
        peer: {
          title: 'Partner',
          publicKey: 'Nyilvános kulcs',
          publicKeyDescription: 'Annak a partnernek a nyilvános kulcsa, amelyhez csatlakozik',
          server: 'Szerver',
          serverDescription: 'A partner állomásneve vagy IP-címe',
          port: 'Port',
          portDescription: 'A partner UDP-portja, általában 51820',
          allowedIps: 'Engedélyezett IP-k',
          allowedIpsDescription: 'A partner címe vagy tartománya az alagútban, például 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription:
            'Másodpercek a keepalive csomagok között, útválasztó mögött szükséges'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Érje el ezt a KVM-et a Tailscale-hálózatán keresztül',
        service: 'Szolgáltatás',
        performance: 'Teljesítmény',
        memory: {
          title: 'Memóriaoptimalizálás',
          tip: 'Alacsonyan tartja a Tailscale memóriahasználatát, ami segít kevés RAM-mal rendelkező eszközön. A módosítás érvénybe lépéséhez indítsa újra a Tailscale-t.'
        },
        swap: {
          title: 'Swap fájl',
          tip: 'Ha a memóriaoptimalizálás engedélyezése után is fennállnak a problémák, próbálja meg engedélyezni a swap fájlt',
          sizeTip:
            'Ez a fájl méretét 128MB értékre állítja; a Beállítások > Rendszer > Teljesítmény menüpontban módosíthatja'
        },
        restartTitle: 'Tailscale újraindítása',
        restartDesc: 'Újraindítja a szolgáltatást',
        restartBtn: 'Újraindítás',
        restart: 'Újraindítja a Tailscale-t?',
        stopTitle: 'Tailscale leállítása',
        stopBtn: 'Leállítás',
        stop: 'Leállítja a Tailscale-t?',
        stopDesc:
          'Leállítja a szolgáltatást, és megakadályozza az automatikus indítását rendszerindításkor',
        loading: 'Betöltés...',
        notInstall: 'Tailscale nem található, kérem, telepítse',
        install: 'Telepítés',
        installing: 'Telepítés folyamatban',
        failed: 'Telepítés sikertelen',
        retry: 'Frissítse az oldalt, majd próbálja újra, vagy telepítse manuálisan.',
        download: 'Letöltés a',
        package: 'telepítési csomag',
        unzip: 'és kicsomagolás',
        upTailscale: 'Töltsön fel tailscale-t a NanoKVM /usr/bin/ könyvtárába',
        upTailscaled: 'Töltsön fel tailscaled-t a NanoKVM /usr/sbin/ könyvtárába',
        refresh: 'Frissítse az aktuális oldalt',
        notRunning: 'Tailscale nem fut. Kérjük, indítsa el a folytatáshoz.',
        run: 'Indítás',
        notLogin:
          'Az eszköz még nincs kötve. Kérem, jelentkezzen be és kösse az eszközt a fiókjához.',
        urlPeriod: 'Ez az url 10 percig érvényes',
        login: 'Bejelentkezés',
        loginSuccess: 'Sikeres bejelentkezés',
        deviceName: 'Eszköz neve',
        deviceIP: 'Eszköz IP',
        account: 'Fiók',
        logout: 'Kijelentkezés',
        logoutDesc: 'Biztos, hogy ki szeretne jelentkezni?',
        uninstall: 'Tailscale eltávolítása',
        uninstallDesc: 'Biztosan eltávolítja a Tailscale alkalmazást?',
        okBtn: 'Igen',
        cancelBtn: 'Nem'
      },
      update: {
        title: 'Frissítések',
        currentVersion: 'Jelenlegi verzió',
        latestVersion: 'Legújabb verzió',
        queryFailed: 'Verzió lekérdezése sikertelen',
        updateFailed: 'Frissítés sikertelen',
        paranoidBlocked: 'Az online frissítéseket a Paranoid tűzfalmód blokkolja',
        paranoidBlockedDesc:
          'A GitHub-ellenőrzésekhez és letöltésekhez kimenő hálózati hozzáférés szükséges. Az offline feltöltés és a már előkészített telepítések továbbra is elérhetők.',
        available: 'Frissítés elérhető. Biztos, hogy frissít?',
        updating: 'Frissítés elkezdődött',
        confirm: 'Megerősítés',
        cancel: 'Mégse',
        badge: {
          checking: 'Ellenőrzés',
          latest: 'Naprakész',
          available: 'Frissítés érhető el',
          failed: 'Az ellenőrzés sikertelen',
          local: 'Helyi'
        },
        application: {
          title: 'Alkalmazás'
        },
        system: {
          queryFailed: 'A rendszerverzió lekérése sikertelen',
          appUpdateRequired:
            'Az alkalmazást frissítse {{version}} verzióra a rendszerfrissítés telepítése előtt',
          requiredAppVersion: 'Szükséges alkalmazásverzió',
          downloadFailed: 'A letöltés vagy ellenőrzés sikertelen',
          available: 'Elérhető egy alaprendszer-frissítés.',
          downloading: 'Rendszerfrissítés letöltése és ellenőrzése...',
          downloadVerify: 'Letöltés és ellenőrzés',
          installing: 'Előkészített rendszerfrissítés telepítése...',
          install: 'Telepítés',
          installFailed: 'Telepítés sikertelen',
          installConfirmTitle: 'Telepíti a rendszerfrissítést?',
          installConfirmDesc:
            'Ez lecseréli az alaprendszer fájljait az ellenőrzött csomagból. Újraindítás szükséges.',
          rawInstallConfirmDesc:
            'Ez az ellenőrzött csomag raw boot/rootfs image-eket ír az SD-kártya partícióira, majd automatikusan újraindít. Az írás több percig tarthat; tartsa csatlakoztatva a tápot.',
          rawInstallWarning:
            'Raw partíciófrissítéseknél nincs automatikus rollback. Ha a boot sikertelen, állítsa helyre kézzel az SD-kártyát.',
          rawWaitTitle: 'Rendszerfrissítés telepítése',
          rawWaitWriting: 'Az új rendszer írása az SD-kártyára',
          rawWaitRestarting:
            'Az eszköz újraindul. Ez az oldal újratöltődik, amint az eszköz újra elérhető.',
          rawWaitDesc:
            'Ez körülbelül három percig tart. Hagyja csatlakoztatva a tápellátást, és ne zárja be ezt az oldalt.',
          rawWaitSlow:
            'Ez a vártnál tovább tart. Várjon még néhány percet, mielőtt megszakítja a tápellátást.',
          rebootRequired: 'Újraindítás szükséges ennek a rendszerállapotnak az aktiválásához.',
          rollingBack: 'Rendszerfrissítés visszaállítása...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback előkészítve',
          rollbackFailed: 'Rollback sikertelen',
          rollbackConfirmTitle: 'Visszaállítja a rendszerfrissítést?',
          rollbackConfirmDesc:
            'Ez visszaállítja a fájlokat a legutóbbi rendszerfrissítési mentésből. Újraindítás szükséges.',
          stagedDesc: 'A rendszerfrissítés letöltve és ellenőrizve, most telepíthető',
          refresh: 'Frissítés',
          releaseNotes: 'Kiadási megjegyzések',
          systemVersion: 'Rendszerverzió',
          kernel: 'Kernel',
          stagedVersion: 'Előkészített verzió',
          archive: 'Archívum',
          requiredFree: 'Szükséges szabad hely',
          fileCount: 'Fájlok',
          rawImages: 'Raw image-ek',
          progress: 'Folyamat',
          progressMessage: 'Folyamatüzenet',
          pendingVersion: 'Függőben lévő verzió',
          bootHealth: 'Boot állapot',
          healthy: 'Rendben',
          unhealthy: 'Figyelmet igényel',
          rollbackBackup: 'Rollback mentés'
        },
        offline: {
          title: 'Alkalmazáscsomag feltöltése',
          desc: 'Alkalmazáscsomag telepítése erről a számítógépről. Ezután a szerver újraindul.',
          installTitle: 'Telepíti az alkalmazásfrissítést?',
          installDesc:
            'Az alkalmazás cserélődik, és a szerver újraindul. Újra be kell jelentkeznie.'
        },
        local: {
          title: 'Rendszercsomag feltöltése',
          desc: 'Rendszercsomag telepítése erről a számítógépről. Egy fájl tartalmazza az archívumot és az aláírt metaadatokat.',
          choose: 'Fájl kiválasztása',
          invalidFile: 'Válasszon .tar vagy .tar.gz végződésű csomagot.',
          diskTitle: 'Kikapcsolja a virtuális lemezt?',
          diskWarn:
            'A csomag a /data könyvtárba kerül, amely csak olvasható, amíg a virtuális lemez be van kapcsolva. A kikapcsolás után a számítógép többé nem fér hozzá a /data könyvtárhoz. Folytatja?',
          uploading: 'Feltöltés',
          verifying: 'A csomag ellenőrzése és előkészítése',
          keyTitle: 'Helyi frissítési kulcs',
          keyDesc:
            'PEM formátumú nyilvános kulcs, amely aláírhatja az Ön által készített csomagokat',
          keyNone: 'Nincs kulcs beállítva',
          keySet: 'Kulcs beállítása',
          keyRemove: 'Eltávolítás',
          signer: 'Aláíró',
          section: 'Helyi frissítések',
          keyRequired: 'Helyi kulcs szükséges'
        }
      },
      account: {
        title: 'Fiók',
        webAccount: 'Webes fiók neve',
        password: 'Jelszó',
        passwordDesc: 'A webes felületre való bejelentkezéshez használt jelszó módosítása',
        updateBtn: 'Módosítás',
        logoutBtn: 'Kijelentkezés',
        logoutDesc: 'Biztos, hogy ki szeretne jelentkezni?',
        okBtn: 'Igen',
        cancelBtn: 'Nem',
        session: {
          title: 'Munkamenet'
        },
        logoutOnClose: {
          title: 'Kijelentkezés a böngésző bezárásakor',
          description: 'A munkamenet befejezése a böngésző bezárásakor, nyitva tartás helyett'
        },
        totp: {
          title: 'Kétfaktoros hitelesítés',
          authenticator: 'Hitelesítő alkalmazás',
          description: 'A jelszó mellett időalapú kód megkövetelése egy hitelesítő alkalmazásból',
          required: 'Szabályzat írja elő',
          disable: 'Kikapcsolás',
          enableTitle: 'Kétfaktoros hitelesítés beállítása',
          enableDescription:
            'A folytatáshoz erősítse meg a jelszavát. A második faktor bármilyen módosításához szükséges.',
          continue: 'Tovább',
          disableTitle: 'Kikapcsolja a kétfaktoros hitelesítést?',
          disableDescription:
            'A fiókját ezután csak a jelszó védi. A folytatáshoz erősítse meg a jelszavával.',
          disableFailed: 'A kétfaktoros hitelesítést nem sikerült kikapcsolni',
          passwordPlaceholder: 'Jelenlegi jelszó',
          enrollFailed: 'A beállítást nem sikerült elindítani',
          invalidCode: 'Ez a kód nem egyezik. Próbálja a következőt.',
          scan: 'Olvassa be ezt a hitelesítő alkalmazással.',
          manualEntry: 'Vagy adja meg ezt a kulcsot kézzel:',
          codePlaceholder: 'A megerősítéshez adja meg a 6 számjegyű kódot',
          confirm: 'Megerősítés',
          cancel: 'Mégse',
          backupTitle: 'Mentse el most a tartalék kódjait',
          backupDescription:
            'Minden kód csak egyszer működik, és többé nem jelenik meg. Ezek az egyetlen visszaút, ha elveszíti a hitelesítő alkalmazást, és akkor is működnek, ha az eszköz órája nincs szinkronizálva.',
          copy: 'Másolás',
          copied: 'A tartalék kódok kimásolva',
          savedThem: 'Elmentettem őket',
          remaining: '{{remaining}} tartalék kód maradt',
          clockUnsynced:
            'Az eszköz órája még nincs szinkronizálva. A beállítás előtt szinkronizálja az időt a Beállítások > Rendszer > Idő menüben.',
          noBackupCodes:
            'Nem maradt tartalék kód. Új készlet kiadásához válassza a Generálás gombot.',
          regenerate: 'Új tartalék kódok',
          generate: 'Generálás',
          regenerateTitle: 'Kiad új tartalék kódokat?',
          regenerateDescription:
            'A jelenlegi tartalék kódjai megszűnnek működni. A folytatáshoz erősítse meg a jelszavával.',
          regenerateFailed: 'Az új tartalék kódokat nem sikerült kiadni',
          download: 'Letöltés',
          copyFailed: 'A másolás nem sikerült. Jelölje ki a kódokat, és másolja ki kézzel.',
          requireTitle: 'Kétfaktoros hitelesítés megkövetelése',
          requireDescription:
            'Megakadályozza a kétfaktoros hitelesítés kikapcsolását, és az a fiók, amelynek nincs, az eszköz használata előtt köteles beállítani',
          requireFailed: 'A követelményt nem sikerült módosítani',
          requiredTitle: 'Kétfaktoros hitelesítés szükséges',
          requiredDescription:
            'Ez az eszköz második faktort követel meg, de a fiókjához még nincs beállítva. A folytatáshoz állítsa be most.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw asszisztens',
      empty: 'Írjon le egy feladatot a kezdéshez',
      inputPlaceholder: 'Írja le, mit szeretne, hogy PicoClaw tegyen',
      newConversation: 'Új beszélgetés',
      processing: 'Feldolgozás...',
      agent: {
        defaultTitle: 'Általános asszisztens',
        defaultDescription: 'Általános csevegési, keresési és munkaterületi súgó',
        kvmTitle: 'Távoli vezérlés',
        kvmDescription: 'Működtesse a távoli gazdagépet az NanoKVM segítségével',
        switched: 'Ügynöki szerepkör megváltozott',
        switchFailed: 'Nem sikerült váltani az ügynöki szerepkört'
      },
      send: 'Küldés',
      cancel: 'Mégse',
      status: {
        connecting: 'Csatlakozás az átjáróhoz...',
        connected: 'PicoClaw munkamenet csatlakoztatva',
        disconnected: 'PicoClaw munkamenet lezárva',
        stopped: 'Leállítási kérés elküldve',
        runtimeStarted: 'PicoClaw Runtime elindult',
        runtimeStartFailed: 'Nem sikerült elindítani a PicoClaw Runtime-ot',
        runtimeStopped: 'PicoClaw Runtime leállt',
        runtimeStopFailed: 'Nem sikerült leállítani a PicoClaw Runtime-ot'
      },
      connection: {
        runtime: {
          checking: 'Ellenőrzés',
          ready: 'Runtime kész',
          stopped: 'Runtime leállt',
          unavailable: 'Runtime nem érhető el',
          configError: 'Konfigurációs hiba'
        },
        transport: {
          connecting: 'Csatlakozás',
          connected: 'Csatlakoztatva'
        },
        run: {
          idle: 'Üresjárat',
          busy: 'Elfoglalt'
        }
      },
      error: {
        lockHeld: 'A PicoClaw egy másik ablakban van használatban',
        takenOver: 'Egy másik ablak átvette a PicoClaw irányítását',
        authFailed: 'A PicoClaw elutasította a kapcsolatot',
        upstreamClosed: 'A PicoClaw kapcsolata megszakadt'
      },
      tool: {
        screenshot: 'Képernyőkép készítése',
        loadImage: 'A képernyőkép megtekintése',
        actions: 'A gazdagép vezérlése',
        generic: '{{name}} használata',
        type: 'Beírás: {{text}}',
        hotkey: 'Lenyomás: {{keys}}',
        click: 'Kattintás',
        doubleClick: 'Dupla kattintás',
        move: 'Az egér mozgatása',
        drag: 'Húzás',
        scroll: 'Görgetés',
        wait: 'Várakozás'
      },
      message: {
        toolAction: 'Akció',
        observation: 'Megfigyelés',
        screenshot: 'Képernyőkép'
      },
      overlay: {
        locked: 'PicoClaw vezérli az eszközt. A kézi bevitel szünetel.'
      },
      install: {
        install: 'PicoClaw telepítése',
        installing: 'PicoClaw telepítése folyamatban',
        success: 'PicoClaw sikeresen telepítve',
        failed: 'Nem sikerült telepíteni PicoClaw',
        uninstalled: 'A PicoClaw sikeresen eltávolítva',
        uninstallFailed: 'Az eltávolítás nem sikerült',
        requiredTitle: 'PicoClaw nincs telepítve',
        requiredDescription:
          'Telepítse a PicoClaw alkalmazást a PicoClaw Runtime elindítása előtt.',
        progressDescription: 'PicoClaw letöltése és telepítése folyamatban van.',
        stages: {
          preparing: 'Felkészülés',
          downloading: 'Letöltés',
          extracting: 'Kibontás',
          verifying: 'Ellenőrzés',
          installing: 'Telepítés folyamatban',
          installed: 'Telepítve',
          install_timeout: 'Időtúllépés',
          install_failed: 'Sikertelen'
        }
      },
      model: {
        requiredTitle: 'Modellkonfiguráció szükséges',
        requiredDescription: 'A PicoClaw chat használata előtt konfigurálja az PicoClaw modellt.',
        docsTitle: 'Konfigurációs útmutató',
        docsDesc: 'Támogatott modellek és protokollok',
        menuLabel: 'Modell konfigurálása',
        modelIdentifier: 'Modellazonosító',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API alap-URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API-kulcs',
        apiKeyPlaceholder: 'Adja meg a modell API-kulcsát',
        apiKeyKeepPlaceholder: 'Hagyja üresen a jelenlegi kulcs megtartásához',
        save: 'Mentés',
        saving: 'Mentés',
        saved: 'A modell konfigurációja mentve',
        saveFailed: 'Nem sikerült menteni a modellkonfigurációt',
        invalid: 'A modellazonosító, az API alap-URL és az API-kulcs megadása kötelező'
      },
      uninstall: {
        confirmTitle: 'PicoClaw eltávolítása',
        confirmContent:
          'Biztosan eltávolítja a következőt: PicoClaw? Ezzel törli a végrehajtható fájlt és az összes konfigurációs fájlt.',
        confirmOk: 'Eltávolítás'
      },
      history: {
        title: 'Előzmények',
        loading: 'Munkamenetek betöltése...',
        emptyTitle: 'Még nincs előzmény',
        emptyDescription: 'A korábbi PicoClaw munkamenetek itt jelennek meg.',
        loadFailed: 'Nem sikerült betölteni a munkamenet-előzményeket',
        deleteFailed: 'Nem sikerült törölni a munkamenetet',
        deleteConfirmTitle: 'Munkamenet törlése',
        deleteConfirmContent: 'Biztos, hogy törölni szeretné a következőt: "{{title}}"?',
        deleteConfirmOk: 'Törlés',
        messageCount_one: '{{count}} üzenet',
        messageCount_other: '{{count}} üzenet'
      },
      config: {
        startRuntime: 'PicoClaw indítása',
        stopRuntime: 'PicoClaw leállítása',
        stopConfirm: 'Leállítja a PicoClaw-t?'
      },
      start: {
        title: 'PicoClaw indítása',
        description: 'Indítsa el a Runtime-ot a PicoClaw segéd használatának megkezdéséhez.'
      }
    },
    error: {
      title: 'Problémába ütköztünk',
      refresh: 'Frissítés'
    },
    fullscreen: {
      toggle: 'Teljes képernyő váltás'
    },
    menu: {
      collapse: 'Menü összecsukása'
    }
  }
};

export default hu;
