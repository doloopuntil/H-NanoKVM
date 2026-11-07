const et = {
  translation: {
    common: {
      confirm: 'Kinnita',
      cancel: 'Tühista',
      save: 'Salvesta',
      discard: 'Loobu',
      delete: 'Kustuta',
      actionFailed: 'Toiming ebaõnnestus',
      loading: 'Seadete laadimine seadmest...',
      loadFailed: 'Seadmest ei õnnestunud seadeid laadida',
      retry: 'Proovi uuesti'
    },
    head: {
      desktop: 'Kaugtöölaud',
      login: 'Sisselogimine',
      firstSetup: 'Esmane seadistus',
      changePassword: 'Muuda parooli',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Sisselogimine',
      placeholderUsername: 'Kasutajanimi',
      placeholderPassword: 'Parool',
      placeholderPassword2: 'Sisesta parool uuesti',
      noEmptyUsername: 'Kasutajanimi on nõutav',
      noEmptyPassword: 'Parool on nõutav',
      invalidUser: 'Vale kasutajanimi või parool',
      locked: 'Liiga palju sisselogimiskatseid, proovi hiljem uuesti',
      globalLocked: 'Süsteem on kaitstud, proovi hiljem uuesti',
      error: 'Ootamatu viga',
      changePassword: 'Muuda parooli',
      changePasswordDesc: 'Seadme turvalisuse huvides muuda parool ära',
      differentPassword: 'Paroolid ei ühti',
      illegalUsername: 'Kasutajanimi sisaldab lubamatuid märke',
      illegalPassword:
        'Parool peab olema vähemalt 8 märki ja ei tohi sisaldada jutumärke ega kaldkriipse',
      forgetPassword: 'Unustasid parooli',
      ok: 'OK',
      cancel: 'Tühista',
      loginButtonText: 'Logi sisse',
      setupTitle: 'Loo administraatori konto',
      setupDescription:
        'Selles seadmes pole veel veebikontot. Jätkamiseks loo esimene administraatori konto.',
      setupRecovery: 'Kui see parool kaob, nõuab taastamine SD-kaardi uuesti kirjutamist',
      setupButtonText: 'Loo konto',
      tips: {
        hardenedRecovery:
          'See Hardened image ei toeta parooli lähtestamist BOOT-nupuga. Kui parool kaob, kirjuta SD-kaart uuesti ja loo uus konto.',
        change1: 'Pane tähele, et see toiming muudab järgmisi paroole:',
        change2: 'Veebi sisselogimise parool',
        change3: 'Süsteemi root-parool SSH-sisselogimiseks'
      },
      placeholderCurrentPassword: 'Praegune parool',
      placeholderNewPassword: 'Uus parool',
      wrongCurrentPassword: 'Praegune parool on vale',
      totp: {
        title: 'Kaheastmeline autentimine',
        prompt: 'Sisesta autentimisrakenduse 6-kohaline kood',
        backupPrompt: 'Sisesta üks oma varukoodidest',
        noEmptyCode: 'Sisesta kood',
        placeholderCode: '6-kohaline kood',
        placeholderBackup: 'Varukood',
        verifyButtonText: 'Kinnita',
        useBackupCode: 'Kasuta varukoodi',
        useAuthenticator: 'Kasuta autentimisrakenduse koodi',
        cancel: 'Tagasi',
        invalidCode: 'See kood ei kehti. Proovi uuesti.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'NanoKVM-i Wi-Fi seadistamine',
      success: 'Mine seadme juurde ja kontrolli NanoKVM-i võrgu olekut',
      failed: 'Toiming nurjus, proovi uuesti',
      invalidMode:
        'Praegune režiim ei toeta võrgu seadistamist. Mine seadme juurde ja luba Wi-Fi seadistusrežiim.',
      confirmBtn: 'OK',
      finishBtn: 'Valmis',
      ap: {
        authTitle: 'Autentimine on nõutav',
        authDescription: 'Jätkamiseks sisesta AP parool',
        authFailed: 'Vale AP parool',
        passPlaceholder: 'AP parool',
        verifyBtn: 'Kontrolli'
      }
    },
    screen: {
      scale: 'Skaala',
      title: 'Ekraan',
      video: 'Videorežiim',
      videoDirectTips: 'Selle režiimi kasutamiseks luba HTTPS menüüs "Seaded > Võrk > Teenused"',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC on tulemüürirežiimides Piiratud ja Paranoiline keelatud',
      transferRunningTitle: "Image'i edastus käib",
      transferRunningDesc:
        "Videorežiimi muutmine laadib lehe uuesti, mis katkestab käimasoleva image'i üles- või allalaadimise.",
      transferRunningOk: 'Muuda režiimi',
      resolution: 'Eraldusvõime',
      auto: 'Automaatne',
      autoTips:
        'Teatud eraldusvõimetel võib esineda pildi rebenemist või hiire nihkumist, seega muuda kaugmasina eraldusvõimet või keela automaatrežiim',
      fps: 'FPS',
      customizeFps: 'Kohanda',
      quality: 'Kvaliteet',
      qualityLossless: 'Kadudeta',
      qualityHigh: 'Kõrge',
      qualityMedium: 'Keskmine',
      qualityLow: 'Madal',
      frameDetect: 'Kaadrimuutuse tuvastus',
      frameDetectTip: 'Võrdleb kaadreid ja peatab video saatmise, kuni kaugmasina ekraan ei muutu',
      resetHdmi: 'Lähtesta HDMI',
      webrtcConnectionFailed: {
        title: 'WebRTC-ühendus nurjus',
        description: 'Kontrolli võrguühendust või vaheta videorežiimi'
      },
      captureStatus: {
        hdmiError: 'HDMI ekraani viga',
        unsupportedResolution: 'Praegune eraldusvõime pole toetatud',
        retrieving: 'Ekraani hankimine...',
        changingResolution: 'Eraldusvõime vahetamine...',
        updateFailed: 'Ekraani ei saa praegu uuendada',
        videoError: 'Video kuvamise viga',
        noHdmi: 'HDMI signaali ei tuvastatud',
        unavailable: 'Ekraani ei saa praegu kuvada'
      }
    },
    keyboard: {
      title: 'Klaviatuur',
      paste: 'Kleebi',
      tips: 'Toetatud on ainult standardsed klaviatuuri tähed ja sümbolid',
      placeholder: 'Kleebitav tekst',
      local: 'Mobiiliklaviatuur',
      virtual: 'Ekraaniklaviatuur',
      readClipboard: 'Loe lõikepuhvrist',
      clipboardPermissionDenied: 'Lõikepuhvri luba keelati, luba brauseris lõikepuhvri kasutamine',
      clipboardReadError: 'Lõikepuhvri lugemine nurjus',
      dropdownEnglish: 'Inglise keel',
      dropdownGerman: 'Saksa keel',
      dropdownFrench: 'Prantsuse keel',
      dropdownRussian: 'Vene keel',
      dropdownKorean: 'Korea keel',
      dropdownJapanese: 'Jaapani keel',
      localInput: 'Mobiilse klaviatuuri sisend',
      shortcut: {
        title: 'Kiirklahvid',
        custom: 'Kohandatud',
        capture: 'Klõpsa siia kiirklahvi salvestamiseks',
        clear: 'Tühjenda',
        save: 'Salvesta',
        captureTips:
          'Süsteemitaseme klahvide, näiteks Windowsi klahvi, salvestamiseks on vaja täisekraani luba',
        enterFullScreen: 'Lülita täisekraanirežiim'
      },
      leaderKey: {
        title: 'Juhtklahv',
        desc: 'Möödu brauseri piirangutest ja saada süsteemi kiirklahvid otse kaugmasinale',
        howToUse: 'Kasutamine',
        simultaneous: {
          title: 'Samaaegne režiim',
          desc1: 'Hoia juhtklahvi all ja vajuta seejärel kiirklahvi.',
          desc2: 'Intuitiivne, kuid võib süsteemi kiirklahvidega konflikti minna.'
        },
        sequential: {
          title: 'Järjestikune režiim',
          desc1: 'Vajuta juhtklahvi → vajuta kiirklahvi järjest → vajuta juhtklahvi uuesti.',
          desc2: 'Nõuab rohkem samme, kuid väldib täielikult süsteemikonflikte.'
        },
        enable: 'Luba juhtklahv',
        tip: 'Juhtklahvina määratud klahv toimib ainult kiirklahvi päästikuna ja kaotab tavapärase käitumise.',
        placeholder: 'Vajuta juhtklahvi',
        shiftRight: 'Parem Shift',
        ctrlRight: 'Parem Ctrl',
        metaRight: 'Parem Win',
        recorder: {
          rec: 'REC',
          activate: 'Aktiveeri klahvid',
          input: 'Vajuta kiirklahvi'
        }
      }
    },
    mouse: {
      title: 'Hiir',
      cursor: 'Kursori stiil',
      default: 'Vaikekursor',
      cell: 'Lahtri kursor',
      text: 'Tekstikursor',
      grab: 'Haaramise kursor',
      hide: 'Peida kursor',
      mode: 'Hiire režiim',
      absolute: 'Absoluutne režiim',
      relative: 'Suhteline režiim',
      direction: 'Kerimise suund',
      scrollUp: 'Keri üles',
      scrollDown: 'Keri alla',
      speed: 'Kerimise kiirus',
      sensitivity: 'Kursori kiirus',
      sensitivityDesc:
        'Desktopi relatiivse režiimi jaoks: väiksemad väärtused vähendavad hosti hiirekiirendusest tekkivat nihet',
      fast: 'Kiire',
      slow: 'Aeglane',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Liiguta sõrme KVM-alal ükskõik kus; kaugkursor hoiab puudutuste vahel oma asukohta ja püsib absoluutse HID-iga sünkroonis'
      },
      requestPointer: 'Kasutusel on suhteline režiim, hiirekursori saamiseks klõpsa töölaual',
      resetHid: 'Lähtesta HID',
      hidOnly: {
        title: 'HID-Only režiim',
        desc: 'Kui hiir või klaviatuur lakkab reageerimast ning HID lähtestamine ei aita, võib tegu olla NanoKVM-i ja hosti ühilduvusprobleemiga.',
        tip1: 'HID-Only režiimi lubamine haagib lahti virtuaalse ketta ja virtuaalvõrgu',
        tip2: 'HID-Only režiimis on kujutiste haakimine keelatud',
        tip3: 'NanoKVM taaskäivitub pärast režiimi vahetust automaatselt',
        enable: 'Luba HID-Only režiim',
        disable: 'Keela HID-Only režiim'
      }
    },
    image: {
      title: 'Image failid',
      loading: 'Laadimine...',
      empty: 'Midagi ei leitud',
      mountMode: 'Ühenda kui',
      massStorage: 'Massmälu',
      cdRom: 'CD-ROM',
      mountFailed: 'Ühendamine nurjus',
      mountDesc:
        'Mõnes süsteemis tuleb enne image ühendamist kaugmasinas virtuaalne ketas eemaldada',
      diskOnWarn:
        "Image'i ühendamine lülitab virtuaalse ketta välja, nii et arvuti ei pääse enam ligi kataloogile /data. Kas jätkata?",
      diskOffWarn:
        "Virtuaalne ketas on välja lülitatud ja see tuleb image'i ühendamiseks lubada. Arvuti USB-seadmed loendatakse uuesti. Kas jätkata?",
      unmountFailed: 'Eemaldamine nurjus',
      unmountDesc: 'Mõnes süsteemis tuleb enne image eemaldamist see kaugmasinas käsitsi väljutada',
      forceEject: 'Sunni väljutamine',
      forceEjectConfirm:
        'Kaugmasin on optilise draivi lukustanud. Sunnitud väljutamine katkestab virtuaalse USB-seadme ühenduse korraks, mistõttu klaviatuur ja hiir võivad ajutiselt lahti ühenduda. Kas jätkata?',
      usbReconnect: 'Ühenda USB uuesti',
      usbReconnectConfirm:
        'Ühenda USB-gadget uuesti ainult siis, kui kaughost ei märganud meedia muutust. Klaviatuur ja hiir võivad hetkeks katkeda.',
      usbReconnectSuccess: 'USB ühendati uuesti',
      usbReconnectFailed: 'USB taasühendamine nurjus',
      addImage: 'Lisa image-fail',
      fromUrl: 'URL-ist',
      fromFile: 'Failist',
      turnOff: 'Lülita välja',
      eject: 'Väljuta',
      download: 'Laadi alla',
      upload: 'Laadi üles',
      mountTitle: 'Ühenda image-fail',
      deleteTitle: 'Kustuta image-fail',
      deleteConfirm: 'Kas oled kindel, et soovid selle image kustutada?',
      tips: {
        title: 'Kuidas üles laadida',
        usb1: 'Ühenda NanoKVM arvutiga USB kaudu.',
        usb2: 'Veendu, et virtuaalne ketas on ühendatud kohas Seaded > Seade > Virtuaalne ketas.',
        usb3: 'Ava arvutis virtuaalne ketas ja kopeeri image fail virtuaalse ketta juurkausta.',
        scp1: 'Veendu, et NanoKVM ja arvuti on samas kohalikus võrgus.',
        scp2: 'Ava arvutis terminal ja kasuta SCP käsku image faili üleslaadimiseks NanoKVM-i /data kausta.',
        scp3: 'Näide: scp sinu-image-tee root@nanoKVM-ip:/data',
        tfCard: 'SD-kaart',
        tf1: 'See meetod on toetatud Linuxi süsteemis',
        tf2: 'Võta SD-kaart NanoKVM-ist välja. FULL versiooni puhul võta enne korpus lahti.',
        tf3: 'Sisesta SD-kaart kaardilugejasse ja ühenda see arvutiga.',
        tf4: 'Kopeeri image fail SD-kaardi /data kausta.',
        tf5: 'Sisesta SD-kaart NanoKVM-i.'
      }
    },
    script: {
      title: 'Skriptid',
      upload: 'Laadi üles',
      run: 'Käivita',
      runBackground: 'Käivita taustal',
      runFailed: 'Käivitamine nurjus',
      delDesc: 'Kas oled kindel, et soovid selle faili kustutada?',
      delete: 'Kustuta',
      close: 'Sulge',
      unlockDesc:
        'Skriptid töötavad NanoKVM-is root-õigustes. Skripti üleslaadimiseks või käivitamiseks sisestage veebikonto parool.',
      terminalRequired:
        'Skriptid vajavad juurdepääsu veebiterminalile. Lubage esmalt terminal seadetes.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'NanoKVM terminal',
      serial: 'Jadapordi terminal',
      unlockTitle: 'Ava terminal',
      unlockDesc: 'Terminaliseansi alustamiseks sisesta veebikonto parool',
      unlock: 'Ava',
      unlockFailed: 'Terminali avamine nurjus',
      invalidCredentials: 'Vale kasutajanimi või parool',
      locked: 'Liiga palju katseid, proovi hiljem uuesti',
      sessionClosed: 'Terminaliseanss suleti. Ühendumiseks ava uuesti.',
      sessionError: 'Terminaliühendus nurjus. Proovi uuesti avada.',
      serialPort: 'Jadaport',
      serialPortPlaceholder: 'Näiteks /dev/ttyS1',
      baudrate: 'Boodikiirus',
      parity: 'Paarsus',
      parityNone: 'Puudub',
      parityEven: 'Paaris',
      parityOdd: 'Paaritu',
      flowControl: 'Vookontroll',
      flowControlNone: 'Puudub',
      flowControlSoft: 'Tarkvaraline',
      flowControlHard: 'Riistvaraline',
      dataBits: 'Andmebitid',
      stopBits: 'Stopbitid',
      open: 'Ava terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Käsu saatmine...',
      sent: 'Käsk saadetud',
      input: 'MAC-aadress',
      ok: 'OK'
    },
    download: {
      input: 'Kaug-image URL',
      ok: 'OK',
      disabled:
        "Image'e ei saa praegu alla laadida ega üles laadida, sest salvestusruum pole kirjutatav. Kui image on ühendatud, ühenda see lahti ja lülita seejärel virtuaalne ketas välja, et salvestusruum oleks taas kirjutatav.",
      diskShared: "Lülita virtuaalne ketas välja, et kasutada image'i allalaadimist",
      mountedImage: 'See image on ühendatud, enne sama nimega faili üleslaadimist eemalda see',
      diskOff: 'Lülita virtuaalne ketas välja',
      uploadbox: 'Lohista fail siia või klõpsa valimiseks',
      inputfile: 'Image-fail',
      NoISO: 'Image puudub',
      complete: 'Allalaadimine lõpetatud',
      uploadComplete: 'Üleslaadimine lõpetatud',
      downloading: 'Allalaadimine',
      uploading: 'Üleslaadimine',
      failed: 'Edastus nurjus',
      uploadFailed: 'Üleslaadimine nurjus',
      stalled: 'Edastus jäi seisma, kontrolli ühendust ja proovi uuesti',
      canceled: 'Üleslaadimine tühistati',
      downloadCanceled: 'Allalaadimine tühistati',
      cancel: 'Tühista',
      remoteDisabled: 'ISO kaugallalaadimine on keelatud menüüs Seaded > Kasutaja > Eelistused',
      remoteFailed: 'ISO kaugallalaadimine nurjus',
      sha256: 'Valikuline SHA-256 kontrollsumma',
      sha256Placeholder: 'Sisesta 64-märgiline SHA-256 kontrollsumma',
      invalidSHA256: 'SHA-256 peab olema 64-märgiline kuueteistkümnendsüsteemi sõne',
      checksumFailed: 'Allalaadimine nurjus: SHA-256 kontroll ebaõnnestus'
    },
    power: {
      title: 'Toide',
      showConfirm: 'Kinnitus',
      showConfirmTip: 'Toimingud toitega nõuavad lisakinnitust',
      reset: 'Lähtesta',
      powerShort: 'Toitenupp: lühike vajutus',
      powerLong: 'Toitenupp: pikk vajutus',
      resetConfirm: 'Kas teha lähtestus?',
      powerConfirm: 'Kas teha toitetoiming?',
      okBtn: 'Jah',
      cancelBtn: 'Ei'
    },
    settings: {
      title: 'Seaded',
      about: {
        title: 'Teave',
        information: 'Teave',
        ip: 'IP-aadress',
        mdns: 'Kohalik aadress',
        application: 'Rakenduse versioon',
        uptime: 'Tööaeg',
        community: 'Kogukond',
        credit: 'Põhineb Sipeedi <a1>NanoKVM-il</a1> ja woffko <a2>Hardened NanoKVM-il</a2>',
        hostname: 'Seadme nimi',
        changeIn: 'Muuda seda asukohas {{path}}',
        updateIn: 'Uuenda seda asukohas {{path}}',
        toggleIn: 'Lülita sisse või välja asukohas {{path}}'
      },
      appearance: {
        title: 'Eelistused',
        display: 'Kuva',
        language: 'Keel',
        languageDesc: 'Vali kasutajaliidese keel',
        webTitle: 'Veebi pealkiri',
        webTitleDesc: 'Kohanda veebilehe pealkirja',
        layoutMode: 'Liidese paigutus',
        layoutModeDesc: 'Kasuta selles brauseris telefoni-/puutepaigutust',
        layoutAuto: 'Automaatne',
        layoutMobile: 'Telefon',
        menuBar: {
          title: 'Menüüriba',
          mode: 'Kuvarežiim',
          modeDesc: 'Kuva menüüriba ekraanil',
          modeOff: 'Väljas',
          modeAuto: 'Automaatne peitmine',
          modeAlways: 'Alati nähtav',
          keyboardLedStatus: 'Klaviatuuri lukustusnäidikud',
          keyboardLedStatusDesc: 'Kuva kaugarvuti Num Locki, Caps Locki ja Scroll Locki olek',
          icons: 'Alammenüü ikoonid',
          iconsDesc: 'Kuva menüüribal alammenüü ikoone',
          terminalWarningTitle: 'Kas lubada veebiterminal?',
          terminalWarningDesc:
            'Terminal avab brauseris root-shelli. Luba see ainult usaldusväärses võrgus ja keela pärast kasutamist.',
          terminalWarningConfirm: 'Luba',
          remoteDownload: 'Laadi kaug-ISO alla',
          remoteDownloadWarningTitle: 'Kas lubada ISO kaugallalaadimine?',
          remoteDownloadWarningDesc:
            'NanoKVM laadib ISO URL-ilt alla ja kirjutab selle asukohta /data. Luba ainult usaldusväärsete URL-ide jaoks ja keela pärast kasutamist.',
          remoteDownloadWarningConfirm: 'Luba'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Kaugklaviatuuri lukustuste olek',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Sees',
        off: 'Väljas',
        unknown: 'Teadmata'
      },
      device: {
        title: 'Seade',
        minutes: 'min',
        sections: {
          general: 'Üldine',
          connectivity: 'Ühenduvus',
          hostConnection: 'Hostiühendus',
          inputOutput: 'Sisend ja väljund'
        },
        oled: {
          title: 'OLED-i ajalõpp',
          description: 'Lülita OLED-ekraan välja pärast',
          keepOn: 'Hoia OLED sisselülitatuna',
          keepOnDescription: 'Ära lülita OLED-ekraani kunagi välja'
        },
        ssh: {
          description: 'Luba SSH kaugjuurdepääs',
          tip: 'Määra enne selle valiku lubamist kohas Konto > Parool tugev parool'
        },
        swap: {
          title: 'Swap',
          description: 'Kasuta swap-faili, kui mälu hakkab otsa saama',
          size: 'Swapi suurus',
          sizeDescription: 'Määra swap-faili suurus',
          tip: 'Selle funktsiooni lubamine võib lühendada SD-kaardi kasutusiga'
        },
        mouseJiggler: {
          title: 'Hiire liigutaja',
          description: 'Takista kaugmasinal unerežiimi minna',
          disable: 'Keela',
          absolute: 'Absoluutne režiim',
          relative: 'Suhteline režiim'
        },
        sessionLock: {
          title: 'Lukusta seanss, kui ei kasutata',
          description: 'Nõua pärast seda aega uuesti sisselogimist'
        },
        mdns: {
          description: 'Luba mDNS avastusteenus',
          tip: 'Võimaldab seadmega ühenduda selle .local-nime kaudu. Pole vaja, kui ühendud IP-aadressi kaudu või su DNS lahendab hostinime juba.'
        },
        hdmi: {
          description: 'Luba HDMI/monitori väljund',
          idleTimeoutTitle: 'Salvestuse jõudeaja piirang',
          idleTimeoutDescription: 'Peata HDMI salvestus, kui aktiivseid vaatajaid pole'
        },
        hidOnly: 'HID-Only režiim',
        hidOnlyDesc: 'Parandab ühilduvust hostiga, kui hiir või klaviatuur lakkab reageerimast',
        hidOnlyTip:
          'HID-Only režiim lõpetab virtuaalseadmete emuleerimise ja säilitab ainult põhilise HID juhtimise',
        disk: 'Virtuaalne ketas',
        diskDesc: 'Ühenda SD-kaart kaugmasinasse',
        diskLocked: 'Väljas, kui image on ühendatud, ja lubamine tühistab ühenduse',
        diskEnable: 'Luba virtuaalne ketas',
        networkChange: 'Muuda virtuaalset võrku',
        diskCancelMount: "Virtuaalse ketta lubamine tühistab ühendatud image'i. Kas jätkata?",
        networkCancelMount:
          "Virtuaalse võrgu muutmine taaskäivitab USB-ühenduse. See tühistab ühendatud image'i ja lubab virtuaalse ketta. Kas jätkata?",
        diskTransferRunning:
          "Käimas on image'i edastus. Oota selle lõppu, enne kui lubad virtuaalse ketta.",
        network: 'Virtuaalne võrk',
        networkDesc: 'Ühenda virtuaalne võrgukaart kaugmasinas',
        usbWakeup: 'USB äratus',
        usbWakeupDesc: 'Luba klaviatuuri või hiire sündmustel kaughost äratada',
        usbWakeupTip: 'Lülita välja, kui host logib korduvaid USB wakeup teateid',
        hostname: {
          description: 'Selle seadme nimi võrgus',
          reachable: 'Ligipääsetav kohtvõrgus aadressil {{address}}'
        },
        rebootRequired: 'Vajalik taaskäivitus',
        rebootPending: 'Taaskäivitus vajalik: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Süsteemiuuendus'
        },
        reboot: 'Taaskäivita',
        rebootDesc: 'Kas oled kindel, et soovid NanoKVM-i taaskäivitada?',
        poweroff: 'Lülita välja',
        poweroffDesc:
          'Kas oled kindel, et soovid NanoKVM-i välja lülitada? See pole kättesaadav enne, kui see uuesti sisse lülitatakse.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Ühendus',
        configuration: 'Seadistus',
        wifi: {
          title: 'Wi-Fi',
          description: 'Seadista Wi-Fi',
          apMode: 'AP režiim on lubatud, ühenda Wi-Fi-ga QR-koodi skannides',
          connect: 'Liitu Wi-Fi-ga',
          connectDesc1: 'Sisesta võrgu SSID ja parool',
          disconnect: 'Kas oled kindel, et soovid võrguühenduse katkestada?',
          disconnectBtn: 'Katkesta ühendus',
          connected: 'Ühendatud',
          ssid: 'Nimi',
          password: 'Parool',
          joinBtn: 'Liitu',
          cancelBtn: 'Tühista'
        },
        tls: {
          description: 'Luba HTTPS protokoll',
          tip: 'Pane tähele: HTTPS kasutamine võib suurendada latentsust, eriti MJPEG videorežiimis',
          restartTitle: 'Server taaskäivitub',
          restartDesc:
            'Protokolli muutmine taaskäivitab serveri. Brauser liigub uuele aadressile {{seconds}} sekundi pärast:',
          restartOk: 'Rakenda ja taaskäivita',
          confirmTitle: 'Kas jätta uus protokoll?',
          confirmDesc:
            'Server kasutab nüüd protokolli {{protocol}}. Kui sa seda ei jäta, naaseb see {{seconds}} sekundi pärast eelmise protokolli juurde.',
          confirmKeep: 'Jäta',
          confirmRevert: 'Mine tagasi',
          reverting:
            'Naaseb eelmise protokolli juurde. Brauser liigub sellele aadressile {{seconds}} sekundi pärast.',
          certTitle: 'Kas säilitada uus sertifikaat?',
          certDesc:
            'Server kasutab nüüd uut sertifikaati. Kui te seda ei säilita, naaseb see {{seconds}} sekundi pärast eelmise juurde.',
          certReverted: 'Eelmine sertifikaat on tagasi'
        },
        trustedProxies: {
          section: 'Pöördpuhverserver',
          title: 'Usaldusväärsed puhverserverid',
          description:
            'Pöördpuhverserverid, mida seade usaldab kliendi aadressi ja protokolli teatamisel',
          tip: 'Loendis olev aadress valib kliendi aadressi, mille sisselogimispiirang ja logi salvestavad, seega lisa ainult enda hallatavaid puhverservereid',
          none: 'Puudub',
          edit: 'Muuda',
          editRow: 'Muuda loendit',
          editTitle: 'Muuda usaldusväärseid puhverservereid',
          editDescription: 'Loendi muutmiseks on vaja sinu parooli',
          dialogDescription:
            'Sisesta iga pöördpuhverserveri aadress sellisena, nagu see seade seda näeb, või vahemik, näiteks 10.0.0.0/24. Loendis olev puhverserver ütleb seadmele, millist kliendi aadressi ja protokolli kasutada. Kõike, mida see edastab, usutakse, seega lisa ainult enda hallatavaid puhverservereid.'
        },
        certificate: {
          title: 'Sertifikaat',
          desc: 'Kust HTTPS-sertifikaat pärineb',
          requesting: 'Sertifikaati taotletakse',
          selfSigned: 'Iseallkirjastatud',
          domain: 'Domeen',
          domainDesc:
            'Peab osutama sellele seadmele ja port 443 peab olema internetist ligipääsetav',
          domainTailscale: 'Määranud Tailscale sellele seadmele',
          domainInvalid: 'Kasutage täielikku domeeninime, näiteks kvm.example.org',
          email: 'E-post',
          emailDesc: "Valikuline, Let's Encrypti teadete jaoks",
          emailInvalid: 'Kasutage aadressi kujul nimi@example.org',
          validUntil: 'Kehtib kuni',
          valid: 'Kehtiv',
          expiresSoon: 'Aegub peagi',
          expired: 'Aegunud',
          lastRenewal: 'Viimane uuendamine',
          renewed: 'Uuendatud',
          failed: 'Ebaõnnestus',
          renewNow: 'Uuenda kohe',
          renewNowDesc: 'Taotle uus sertifikaat ootamata',
          renewBtn: 'Uuenda',
          applyTitle: 'Muuda sertifikaati',
          applyOk: 'Rakenda',
          applyAcme:
            "Seade taotleb Let's Encryptilt sertifikaati. Let's Encrypt ühendub kontrollimiseks internetist pordiga 443, mis võib võtta kuni minuti. Kui taotlus ebaõnnestub, jääb praegune sertifikaat kasutusse.",
          applyTailscale:
            "Seade hangib sertifikaadi Tailscale'ilt, mis võib võtta kuni minuti. Kui taotlus ebaõnnestub, jääb praegune sertifikaat kasutusse.",
          applySelfSigned:
            'Seade naaseb oma iseallkirjastatud sertifikaadi juurde. Brauserid hoiatavad selle eest.',
          openTitle: 'Ava uus aadress',
          openDesc:
            'Sertifikaat on valmis. Avage allolev aadress ja logige sisse, et see säilitada. Ilma teie kinnituseta 3 minuti jooksul naaseb eelmine sertifikaat.',
          openOk: 'Ava',
          blockedClock: 'Sertifikaate ei saa taotleda enne, kui seadme kell on sünkroonitud',
          blockedParanoid: 'Tulemüüri režiim Paranoiline blokeerib sertifikaaditaotlused',
          tailscaleUnavailable:
            'Tailscale ei tööta või HTTPS-sertifikaadid pole tailneti jaoks lubatud'
        },
        dns: {
          title: 'DNS',
          description: 'NanoKVM-i DNS-serverite seadistamine',
          ipv4Title: 'IPv4',
          ipv4Description: 'Juhtmega liidese IPv4-aadressi seadistamine',
          servers: 'Serverid',
          dhcp: 'DHCP',
          manual: 'Käsitsi',
          apply: 'Rakenda',
          invalid: 'Sisesta kehtiv IPv4- või IPv6-aadress',
          invalidNetwork: 'Sisesta kehtiv IPv4-aadress, alamvõrgu mask ja ruuter',
          saved: 'DNS-i seaded salvestatud',
          redirecting: 'Võrguseaded salvestatud. Avan uut aadressi...',
          saveFailed: 'DNS-i seadete salvestamine nurjus',
          unsaved: 'Salvestamata muudatused',
          maxServers: 'Lubatud on kuni {{count}} DNS-serverit',
          dhcpServersDescription: 'DNS-serverid saadakse automaatselt DHCP kaudu',
          manualServersDescription: 'IPv4 ja IPv6 serverid on toetatud',
          interface: 'Liides',
          ipAddress: 'IP-aadress',
          subnetMask: 'Alamvõrgu mask',
          router: 'Ruuter'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Juhtmega liidese IPv6-aadressi seadistamine',
          disabled: 'Keelatud',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Käsitsi',
          interface: 'Liides',
          state: 'Olek',
          router: 'Ruuter',
          addresses: 'Aadressid',
          dhcpv6Client: 'DHCPv6 klient',
          notInstalled: 'Pole paigaldatud',
          ipAddress: 'IPv6-aadress',
          prefix: 'Prefiks',
          invalidManual: 'Sisesta kehtiv IPv6-aadress, prefiks ja ruuter',
          clientMissing:
            'DHCPv6 klient pole paigaldatud. Paigalda kõigepealt vastav raw süsteemiuuendus.',
          saved: 'IPv6 seaded salvestatud',
          saveFailed: 'IPv6 seadete salvestamine nurjus',
          unsaved: 'Salvestamata muudatused'
        }
      },
      system: {
        title: 'Süsteem',
        performance: {
          processor: 'Protsessor',
          overdrive: {
            title: 'Ülekiirendus',
            description: 'Käivita tootja määratud kõrgemate protsessori ja video taktsagedustega',
            tip: 'Kui seade ülekiirendusega ei käivitu, tuleb SD-kaart uuesti kirjutada',
            unavailable: 'Pole selles süsteemipildis',
            keepTitle: 'Säilita overdrive pärast värskendusi',
            keepDescription:
              'Süsteemivärskendus viib seadme tagasi standardsagedustele, kui see pole sisse lülitatud',
            confirmTitle: 'Kas lülitada ülekiirendus sisse?',
            confirmText:
              'Kui seade ülekiirendusega ei käivitu, peate selle taastamiseks SD-kaardi uuesti kirjutama. Muudatus rakendub pärast järgmist taaskäivitust.',
            confirmOk: 'Luba'
          },
          watchdog: {
            title: 'Riistvaraline valvekoer',
            description: 'Taaskäivita seade automaatselt, kui see lõpetab vastamise',
            unavailable: 'Pole selles süsteemitõmmises',
            notRunning: 'Praegu ei tööta',
            lastRestart: 'Viimane taaskäivitus',
            lastRestartCaption: 'Viimane põhjus, miks süsteem taaskäivitus',
            reasonPowerOn: 'Toite sisselülitus',
            reasonRestart: 'Taaskäivitus soovitud',
            reasonWatchdog: 'Valvekoera lähtestus',
            reasonOverheat: 'Ülekuumenemiskaitse',
            reasonUnknown: 'Teadmata'
          },
          recovery: 'Taaste',
          memory: 'Mälu'
        },
        monitor: {
          processorClock: 'CPU alamsüsteem',
          videoClock: 'Video alamsüsteem',
          videoClockCaption: 'Video taktsagedus',
          cpuClockCaption: 'CPU taktsagedus',
          overdrive: 'Ülekiirendus',
          temperature: 'Temperatuur',
          lastMinutes: 'Viimased 5 minutit',
          ram: 'RAM',
          off: 'Väljas',
          ramHistory: 'RAM-i kasutus',
          cpuLoad: 'Protsessori koormus',
          cpuLoadCaption: 'Kasutaja {{user}} protsenti, süsteem {{system}} protsenti',
          cpuUtilization: 'Protsessori kasutus',
          swapUtilization: 'Saalimisruumi kasutus',
          swapSizeLastMinutes: '{{size}}, viimased 5 minutit',
          percent: '{{percent}} protsenti',
          percentUsed: '{{percent}} protsenti kasutusel',
          sizeOf: '{{used}} / {{total}}',
          systemPartition: 'Süsteemipartitsioon',
          dataPartition: 'Andmepartitsioon',
          unavailable: 'Pole saadaval',
          noReadings: 'Seade ei anna mõõtmistulemusi',
          refresh: 'Uueneb iga sekund, kui see leht on avatud'
        },
        sections: {
          time: 'Aeg',
          firewall: 'Tulemüür',
          systemLog: 'Logimine',
          performance: 'Jõudlus',
          monitor: 'Seire',
          services: 'Teenused',
          webInterface: 'Turvaline veebipääs'
        },
        time: {
          saveFailed: 'Ajaseadete salvestamine nurjus',
          saved: 'Ajaseaded salvestatud',
          syncFailed: 'Aja sünkroonimine nurjus',
          synced: 'Aeg sünkroonitud',
          invalidServers: 'Sisesta vähemalt üks NTP-server',
          maxServers: 'Lubatud on kuni {{count}} NTP-serverit',
          refresh: 'Värskenda',
          syncNow: 'Sünkroniseeri',
          syncNowDesc: 'Sea kell NTP-serveritest kohe',
          save: 'Salvesta',
          ntp: {
            title: 'NTP',
            description: 'Sünkrooni seadme aeg seadistatud NTP-serveritest'
          },
          networkTime: 'Võrguaeg',
          clock: {
            title: 'Kell',
            description: 'Määra logides ja UI-s kasutatav kohalik ajavöönd',
            current: 'Praegune aeg',
            timezone: 'Ajavöönd'
          },
          servers: {
            title: 'NTP-serverid',
            description:
              'Kasuta avalikke vaikeservereid, kohalikku ruuterit või enda NTP-servereid',
            useRouter: 'Kasuta ruuterit',
            useDefaults: 'Kasuta vaikeväärtusi',
            presets: 'Serverite eelseaded',
            presetsDesc: 'Asenda serverite loend eelseadega'
          }
        },
        firewall: {
          saveFailed: 'Tulemüüri seadete rakendamine nurjus',
          saved: 'Tulemüüri seaded rakendatud',
          cancel: 'Tühista',
          refresh: 'Värskenda',
          backends: 'Backendid',
          enableHttpsFirst: 'Luba HTTPS enne tulemüüri režiimi Piiratud või Paranoiline lubamist',
          httpsRequired:
            'Režiimid Piiratud ja Paranoiline on keelatud, kuni HTTPS on lubatud menüüs Seaded > Võrk > Teenused',
          mode: {
            title: 'Tulemüüri režiim',
            baseline: 'Baas',
            baselineDesc:
              'Avatud ühilduvusprofiil. Tulemüür töötab, kuid sissetulevaid allikaid ei piirata. Kasuta ainult usaldusväärsetes võrkudes.',
            moderate: 'Mõõdukas',
            moderateDesc:
              'Vaikeprofiil. Säilitab režiimi Baas teenused, kuid võtab uusi sissetulevaid ühendusi vastu ainult privaatsetest, link-local või loopback vahemikest. Väljaminev juurdepääs jääb avatuks.',
            restricted: 'Piiratud',
            restrictedDesc:
              'Ainult kohalik HTTPS ja SSH ning väljaminev DNS, NTP, syslog ja veebipõhised uuendused. DHCP ja oluline IPv6 liiklus jäävad kättesaadavaks. WebRTC on blokeeritud.',
            paranoid: 'Paranoiline',
            paranoidDesc:
              'Ainult kohalik HTTPS-juurdepääs. Blokeerib SSH, HTTP, veebipõhised uuendused ja muud väljuvad võrgufunktsioonid. Võrguühenduseta uuenduste üleslaadimine ja juba ettevalmistatud paigaldused jäävad kättesaadavaks.',
            current: 'Praegune',
            default: 'Vaikimisi',
            localOnly: 'Ainult kohalik',
            openTag: 'Sisenev avatud',
            httpsRequiredTag: 'HTTPS nõutav',
            outboundOpen: 'Väljuv avatud',
            outboundLimited: 'Väljuv piiratud',
            httpsOnly: 'Ainult HTTPS'
          },
          moderate: {
            apply: 'Lülitu režiimile Mõõdukas'
          },
          restricted: {
            enable: 'Luba Piiratud',
            confirmTitle: 'Kas lubada tulemüüri režiim Piiratud?',
            confirmDesc:
              'Sissetulev haldusligipääs piiratakse HTTPS-i ja SSH jaoks private IPv4, IPv4 link-local/loopback, IPv6 link-local või IPv6 loopback lähtevahemikega. Avalikud lähtevahemikud pole lubatud. Väljaminev DNS, NTP, kaug-syslog, online-uuendused, DHCP, olemasolevad ühendused ja hädavajalik IPv6 juhtliiklus jäävad kättesaadavaks. WebRTC/ICE UDP ja muu sisse-/väljaminev liiklus blokeeritakse.'
          },
          paranoid: {
            enable: 'Luba Paranoiline',
            confirmTitle: 'Kas lubada tulemüüri režiim Paranoiline?',
            confirmDesc:
              'Alles jääb ainult HTTPS ligipääs private IPv4, IPv4 link-local/loopback, IPv6 link-local või IPv6 loopback lähtevahemikest. SSH, HTTP, mDNS, NTP, GitHubi allalaadimised ja muu liiklus blokeeritakse, välja arvatud minimaalne DHCP/IPv6 juhtliiklus.'
          },
          baseline: {
            apply: 'Lülitu režiimile Baas',
            confirmTitle: 'Lülituda avatud režiimile Baas?',
            confirmDesc:
              'Tulemüüri teenus jääb aktiivseks, kuid kohalike lähtevahemike piirang eemaldatakse. Avalikud lähtevahemikud võivad jõuda NanoKVM-i avatud teenusteni, kui võrk neid marsruudib.'
          },
          rules: {
            title: 'Praegused reeglid',
            empty: 'Reegleid pole'
          }
        },
        saveChanges: 'Salvesta muudatused',
        unsaved: 'Salvestamata muudatused'
      },
      systemLog: {
        saveFailed: 'Logiseadete salvestamine nurjus',
        saved: 'Logiseaded salvestatud',
        invalidHost: 'Sisesta syslog-serveri host',
        logLoadFailed: 'Logide laadimine nurjus',
        save: 'Salvesta',
        test: 'Saada testlogi',
        testSent: 'Testlogi saadetud',
        testFailed: 'Testlogi saatmine nurjus',
        remote: {
          title: 'Kaugloogimine',
          forward: 'Edasta süsteemilogi',
          description: 'Edasta süsteemiteated kaugserverisse',
          host: 'Server',
          hostDesc: 'Syslog-serveri hostinimi või IPv4-aadress',
          port: 'Port',
          protocol: 'Syslog-serveri UDP-port'
        },
        local: {
          title: 'Süsteemilogi puhver',
          description:
            'Praeguseid logisid hoitakse RAM-is asukohas {{path}}, et vältida SD-kaardi kirjutusi',
          priority: 'Miinimumprioriteet',
          priorityDesc: 'Minimaalne kiireloomulisus, et teade logitaks',
          buffer: 'Puhvri suurus',
          bufferDesc: 'Logi suurus, mille juures fail pööratakse',
          rotations: 'Rotatsioonid',
          rotationsDesc: 'Säilitatavate pööratud logifailide arv',
          compact: 'Kompaktne väljund',
          compactDesc: 'Jäta igalt realt välja hostinimi ja facility',
          stripTimestamps: 'Eemalda ajatemplid',
          stripTimestampsDesc: 'Eemalda saatja lisatud ajatemplid; syslog lisab omad'
        },
        kernel: {
          title: 'Kerneli logimine',
          enabled: 'Edasta kerneli logi',
          enabledDesc: 'Salvesta kerneli teated süsteemilogisse',
          consoleLevel: 'Konsooli tase',
          consoleLevelDesc: 'Minimaalne kiireloomulisus, et kerneli teade konsooli trükitaks'
        },
        viewer: {
          title: 'Süsteemilogi',
          refresh: 'Värskenda',
          empty: 'Logikirjeid pole',
          truncated: 'Kuvatakse ainult uusimad logiandmed',
          linesUnit: 'rida'
        },
        level: {
          '1': '1 - Häire',
          '2': '2 - Kriitiline',
          '3': '3 - Viga',
          '4': '4 - Hoiatus',
          '5': '5 - Märkus',
          '6': '6 - Info',
          '7': '7 - Silumine',
          '8': '8 - Kõik'
        }
      },
      user: {
        title: 'Kasutaja'
      },
      networking: {
        title: 'Võrk'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Krüpteeritud tunnel',
        device: 'See seade',
        description: 'Pääse sellele KVM-ile ligi WireGuardi tunneli kaudu',
        unavailable: 'WireGuard ei ole sellesse seadmesse installitud',
        blocked: 'Tulemüüri režiim Paranoiline blokeerib WireGuardi',
        needsKey: 'Määra privaatvõti enne WireGuardi sisselülitamist',
        saved: 'WireGuardi seaded salvestatud',
        save: 'Salvesta muudatused',
        unsaved: 'Salvestamata muudatused',
        invalid: 'Esiletõstetud väljad vajavad kontrolli',
        invalidAddress: 'Sisesta aadress koos maskiga, näiteks 10.0.0.1/24',
        invalidKey: 'Sisesta 44-märgiline WireGuardi võti',
        invalidEndpoint: 'Sisesta hostinimi või IP-aadress',
        invalidPort: 'Sisesta port vahemikus 1 kuni 65535',
        invalidRanges: 'Kasuta IPv4 vahemikke nagu 10.0.0.0/24, mitte 0.0.0.0/0',
        status: {
          connected: 'Ühendatud',
          waiting: 'Ootan peeri',
          stopped: 'Peatatud',
          handshake: 'Viimane handshake {{time}}'
        },
        privateKey: {
          title: 'Privaatvõti',
          description: 'Jääb sellesse seadmesse ja seda ei näidata enam kunagi',
          set: 'Määratud',
          notSet: 'Määramata',
          setBtn: 'Määra',
          generate: 'Loo',
          remove: 'Eemalda',
          modalTitle: 'Määra privaatvõti',
          modalDescription: 'Võti salvestatakse sellesse seadmesse ja seda ei näidata enam kunagi',
          placeholder: 'Kleebi privaatvõti',
          generateConfirmTitle: 'Kas luua uus privaatvõti?',
          generateConfirmDesc:
            'Praegune võti lakkab töötamast. Lisa pärast uus avalik võti peerile.',
          removeConfirmTitle: 'Kas eemaldada privaatvõti?',
          removeConfirmDesc: 'WireGuard lülitatakse välja ja jääb välja, kuni määratakse uus võti.'
        },
        publicKey: {
          title: 'Avalik võti',
          description: 'Lisa see peeri seadistusse'
        },
        address: {
          title: 'Aadress',
          description: 'KVM-i aadress tunnelis ja selle mask'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Avalik võti',
          publicKeyDescription: 'Peeri avalik võti, millega ühendud',
          server: 'Server',
          serverDescription: 'Peeri hostinimi või IP-aadress',
          port: 'Port',
          portDescription: 'Peeri UDP-port, tavaliselt 51820',
          allowedIps: 'Lubatud IP-d',
          allowedIpsDescription: 'Peeri aadress või vahemik tunnelis, näiteks 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Sekundid keepalive-pakettide vahel, vajalik ruuteri taga'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: "Pääse sellele KVM-ile ligi oma Tailscale'i võrgu kaudu",
        service: 'Teenus',
        performance: 'Jõudlus',
        memory: {
          title: 'Mälu optimeerimine',
          tip: "Hoiab Tailscale'i mälukasutuse väikesena, mis aitab vähese RAM-iga seadmes. Muudatuse jõustumiseks taaskäivita Tailscale."
        },
        swap: {
          title: 'Swap-fail',
          tip: 'Kui probleemid jätkuvad pärast mälu optimeerimise lubamist, proovi lubada swap-fail',
          sizeTip:
            'See määrab faili suuruseks 128 MB; seda saab muuta menüüs Seaded > Süsteem > Jõudlus'
        },
        restartTitle: 'Taaskäivita Tailscale',
        restartDesc: 'Taaskäivitab teenuse',
        restartBtn: 'Taaskäivita',
        restart: 'Kas taaskäivitada Tailscale?',
        stopTitle: 'Peata Tailscale',
        stopBtn: 'Peata',
        stop: 'Kas peatada Tailscale?',
        stopDesc: 'Peatab teenuse ja takistab selle käivitumist süsteemi käivitamisel',
        loading: 'Laadimine...',
        notInstall: 'Tailscale puudub, palun paigalda',
        install: 'Paigalda',
        installing: 'Paigaldamine',
        failed: 'Paigaldamine nurjus',
        retry: 'Värskenda ja proovi uuesti või paigalda käsitsi.',
        download: 'Laadi alla',
        package: 'paigalduspakett',
        unzip: 'ja paki see lahti',
        upTailscale: 'Laadi tailscale NanoKVM-i kausta /usr/bin/',
        upTailscaled: 'Laadi tailscaled NanoKVM-i kausta /usr/sbin/',
        refresh: 'Värskenda praegust lehte',
        notRunning: 'Tailscale ei tööta. Jätkamiseks käivita see.',
        run: 'Käivita',
        notLogin: 'Seade pole veel seotud. Logi sisse ja seo see seade oma kontoga.',
        urlPeriod: 'See URL kehtib 10 minutit',
        login: 'Logi sisse',
        loginSuccess: 'Sisselogimine õnnestus',
        deviceName: 'Seadme nimi',
        deviceIP: 'Seadme IP',
        account: 'Konto',
        logout: 'Logi välja',
        logoutDesc: 'Kas oled kindel, et soovid välja logida?',
        uninstall: 'Eemalda Tailscale',
        uninstallDesc: 'Kas oled kindel, et soovid Tailscale-i eemaldada?',
        okBtn: 'Jah',
        cancelBtn: 'Ei'
      },
      update: {
        title: 'Uuendused',
        currentVersion: 'Praegune versioon',
        latestVersion: 'Uusim versioon',
        queryFailed: 'Versiooni hankimine nurjus',
        updateFailed: 'Uuendamine nurjus',
        paranoidBlocked: 'Tulemüüri režiim Paranoiline blokeerib online-uuendused',
        paranoidBlockedDesc:
          'GitHubi kontrollid ja allalaadimised vajavad väljaminevat võrguühendust. Offline-üleslaadimine ja juba ettevalmistatud paigaldused jäävad kättesaadavaks.',
        available: 'Uuendus on saadaval. Kas soovid nüüd uuendada?',
        updating: 'Uuendamine algas',
        confirm: 'Kinnita',
        cancel: 'Tühista',
        badge: {
          checking: 'Kontrollimine',
          latest: 'Ajakohane',
          available: 'Uuendus saadaval',
          failed: 'Kontroll ebaõnnestus',
          local: 'Kohalik'
        },
        application: {
          title: 'Rakendus'
        },
        system: {
          queryFailed: 'Süsteemi versiooni hankimine nurjus',
          appUpdateRequired:
            'Enne selle süsteemiuuenduse paigaldamist uuenda rakendus versioonile {{version}}',
          requiredAppVersion: 'Nõutav rakenduse versioon',
          downloadFailed: 'Allalaadimine või verifitseerimine nurjus',
          available: 'Baassüsteemi uuendus on saadaval.',
          downloading: 'Süsteemiuuenduse allalaadimine ja verifitseerimine...',
          downloadVerify: 'Laadi alla ja verifitseeri',
          installing: 'Ettevalmistatud süsteemiuuenduse paigaldamine...',
          install: 'Paigalda',
          installFailed: 'Paigaldamine nurjus',
          installConfirmTitle: 'Kas paigaldada süsteemiuuendus?',
          installConfirmDesc:
            'See asendab baassüsteemi failid verifitseeritud paketist. Vajalik on taaskäivitus.',
          rawInstallConfirmDesc:
            'See verifitseeritud pakett kirjutab raw boot/rootfs image failid SD-kaardi partitsioonidele ja taaskäivitab automaatselt. Kirjutamine võib võtta mitu minutit; hoia toide ühendatud.',
          rawInstallWarning:
            'Raw partitsiooniuuendustel pole automaatset rollbacki. Kui boot ebaõnnestub, taasta SD-kaart käsitsi.',
          rawWaitTitle: 'Süsteemivärskenduse paigaldamine',
          rawWaitWriting: 'Uut süsteemi kirjutatakse SD-kaardile',
          rawWaitRestarting: 'Seade taaskäivitub. See leht laaditakse uuesti, kui seade on tagasi.',
          rawWaitDesc:
            'See võtab umbes kolm minutit. Hoia toide ühendatud ja ära sulge seda lehte.',
          rawWaitSlow:
            'See võtab oodatust kauem aega. Oota veel mõni minut, enne kui toite katkestad.',
          rebootRequired: 'Selle süsteemiseisundi aktiveerimiseks on vaja taaskäivitust.',
          rollingBack: 'Süsteemiuuenduse tagasipööramine...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback ettevalmistatud',
          rollbackFailed: 'Rollback nurjus',
          rollbackConfirmTitle: 'Kas pöörata süsteemiuuendus tagasi?',
          rollbackConfirmDesc:
            'See taastab failid viimatisest süsteemiuuenduse varukoopiast. Vajalik on taaskäivitus.',
          stagedDesc:
            'Süsteemiuuendus on alla laaditud ja kontrollitud, nüüd saab selle paigaldada',
          refresh: 'Värskenda',
          releaseNotes: 'Väljalaskemärkmed',
          systemVersion: 'Süsteemi versioon',
          kernel: 'Kernel',
          stagedVersion: 'Ettevalmistatud versioon',
          archive: 'Arhiiv',
          requiredFree: 'Vajalik vaba ruum',
          fileCount: 'Failid',
          rawImages: 'Raw image failid',
          progress: 'Edenemine',
          progressMessage: 'Edenemisteade',
          pendingVersion: 'Ootel versioon',
          bootHealth: 'Booti tervis',
          healthy: 'Korras',
          unhealthy: 'Vajab tähelepanu',
          rollbackBackup: 'Rollback varukoopia'
        },
        offline: {
          title: 'Laadi rakenduse pakett üles',
          desc: 'Paigalda rakenduse pakett sellest arvutist. Seejärel server taaskäivitub.',
          installTitle: 'Kas paigaldada rakenduse uuendus?',
          installDesc: 'Rakendus asendatakse ja server taaskäivitub. Pead uuesti sisse logima.'
        },
        local: {
          title: 'Laadi süsteemipakett üles',
          desc: 'Paigalda süsteemipakett sellest arvutist. Üks fail sisaldab arhiivi ja selle allkirjastatud metaandmeid.',
          choose: 'Vali fail',
          invalidFile: 'Vali pakett, mille laiend on .tar või .tar.gz.',
          diskTitle: 'Kas lülitada virtuaalne ketas välja?',
          diskWarn:
            'Pakett salvestatakse kataloogi /data, mis on kirjutuskaitstud, kui virtuaalne ketas on sees. Väljalülitamisel ei pääse arvuti enam kataloogile /data ligi. Kas jätkata?',
          uploading: 'Üleslaadimine',
          verifying: 'Paketi kontrollimine ja ettevalmistamine',
          keyTitle: 'Kohalik värskendusvõti',
          keyDesc: 'PEM-vormingus avalik võti, millega tohib allkirjastada ise ehitatud pakette',
          keyNone: 'Võtit pole määratud',
          keySet: 'Määra võti',
          keyRemove: 'Eemalda',
          signer: 'Allkirjastaja',
          section: 'Kohalikud uuendused',
          keyRequired: 'Vajalik kohalik võti'
        }
      },
      account: {
        title: 'Konto',
        webAccount: 'Veebikonto nimi',
        password: 'Parool',
        passwordDesc: 'Muuda parooli, millega veebiliidesesse sisse logitakse',
        updateBtn: 'Muuda',
        logoutBtn: 'Logi välja',
        logoutDesc: 'Kas oled kindel, et soovid välja logida?',
        okBtn: 'Jah',
        cancelBtn: 'Ei',
        session: {
          title: 'Seanss'
        },
        logoutOnClose: {
          title: 'Logi välja, kui brauser suletakse',
          description: 'Lõpeta seanss brauseri sulgemisel, selle asemel et seda avatuna hoida'
        },
        totp: {
          title: 'Kaheastmeline autentimine',
          authenticator: 'Autentimisrakendus',
          description: 'Nõua lisaks paroolile autentimisrakenduse ajapõhist koodi',
          required: 'Nõutud eeskirjaga',
          disable: 'Lülita välja',
          enableTitle: 'Seadista kaheastmeline autentimine',
          enableDescription:
            'Jätkamiseks kinnita oma parool. Seda nõutakse teise astme iga muutmise puhul.',
          continue: 'Jätka',
          disableTitle: 'Kas lülitada kaheastmeline autentimine välja?',
          disableDescription:
            'Sinu kontot kaitseb edaspidi ainult parool. Jätkamiseks kinnita oma parooliga.',
          disableFailed: 'Kaheastmelist autentimist ei õnnestunud välja lülitada',
          passwordPlaceholder: 'Praegune parool',
          enrollFailed: 'Seadistamist ei õnnestunud alustada',
          invalidCode: 'See kood ei sobi. Proovi järgmist.',
          scan: 'Skaneeri see oma autentimisrakendusega.',
          manualEntry: 'Või sisesta see võti käsitsi:',
          codePlaceholder: 'Kinnitamiseks sisesta 6-kohaline kood',
          confirm: 'Kinnita',
          cancel: 'Tühista',
          backupTitle: 'Salvesta oma varukoodid kohe',
          backupDescription:
            'Iga kood töötab ainult ühe korra ja seda ei kuvata uuesti. Need on ainus võimalus sisse pääseda, kui kaotad oma autentimisrakenduse, ja need töötavad ka siis, kui seadme kell pole sünkroonitud.',
          copy: 'Kopeeri',
          copied: 'Varukoodid kopeeritud',
          savedThem: 'Olen need salvestanud',
          remaining: 'Varukoode on alles: {{remaining}}',
          clockUnsynced:
            'Seadme kell pole veel sünkroonitud. Enne seadistamist sünkrooni aeg menüüs Seaded > Süsteem > Aeg.',
          noBackupCodes: 'Varukoode ei ole alles. Uue komplekti väljastamiseks vali Loo.',
          regenerate: 'Uued varukoodid',
          generate: 'Loo',
          regenerateTitle: 'Kas väljastada uued varukoodid?',
          regenerateDescription:
            'Sinu praegused varukoodid lakkavad töötamast. Jätkamiseks kinnita oma parooliga.',
          regenerateFailed: 'Uusi varukoode ei õnnestunud väljastada',
          download: 'Laadi alla',
          copyFailed: 'Kopeerimine ebaõnnestus. Vali koodid ja kopeeri need käsitsi.',
          requireTitle: 'Nõua kaheastmelist autentimist',
          requireDescription:
            'Takistab kaheastmelise autentimise väljalülitamist ning konto, millel seda pole, peab selle enne seadme kasutamist seadistama',
          requireFailed: 'Nõuet ei õnnestunud muuta',
          requiredTitle: 'Kaheastmeline autentimine on nõutav',
          requiredDescription:
            'See seade nõuab teist autentimisastet, aga sinu kontol see veel puudub. Seadista see nüüd, et jätkata.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw assistent',
      empty: 'Alustamiseks kirjelda ülesannet',
      inputPlaceholder: 'Kirjelda, mida PicoClaw peaks tegema',
      newConversation: 'Uus vestlus',
      processing: 'Töötlemine...',
      agent: {
        defaultTitle: 'Üldassistent',
        defaultDescription: 'Üldvestlus, otsing ja tööruumi abi',
        kvmTitle: 'Kaugjuhtimine',
        kvmDescription: 'Juhi kaugmasinat NanoKVM-i kaudu',
        switched: 'Agendi roll vahetatud',
        switchFailed: 'Agendi rolli vahetamine nurjus'
      },
      send: 'Saada',
      cancel: 'Tühista',
      status: {
        connecting: 'Ühendamine gatewayga...',
        connected: 'PicoClaw seanss ühendatud',
        disconnected: 'PicoClaw seanss suletud',
        stopped: 'Peatamistaotlus saadetud',
        runtimeStarted: 'PicoClaw runtime käivitatud',
        runtimeStartFailed: 'PicoClaw runtime käivitamine nurjus',
        runtimeStopped: 'PicoClaw runtime peatatud',
        runtimeStopFailed: 'PicoClaw runtime peatamine nurjus'
      },
      connection: {
        runtime: {
          checking: 'Kontrollimine',
          ready: 'Runtime valmis',
          stopped: 'Runtime peatatud',
          unavailable: 'Runtime pole saadaval',
          configError: 'Konfiguratsiooni viga'
        },
        transport: {
          connecting: 'Ühendamine',
          connected: 'Ühendatud'
        },
        run: {
          idle: 'Jõude',
          busy: 'Hõivatud'
        }
      },
      error: {
        lockHeld: 'PicoClaw on kasutusel teises aknas',
        takenOver: "Teine aken võttis PicoClaw'i üle",
        authFailed: 'PicoClaw keeldus ühendusest',
        upstreamClosed: "Ühendus PicoClaw'iga katkes"
      },
      tool: {
        screenshot: 'Teen ekraanipildi',
        loadImage: 'Vaatan ekraanipilti',
        actions: 'Juhin hosti',
        generic: 'Kasutan: {{name}}',
        type: 'Kirjutan {{text}}',
        hotkey: 'Vajutan {{keys}}',
        click: 'Klõpsan',
        doubleClick: 'Topeltklõpsan',
        move: 'Liigutan hiirt',
        drag: 'Lohistan',
        scroll: 'Kerin',
        wait: 'Ootan'
      },
      message: {
        toolAction: 'Toiming',
        observation: 'Vaatlus',
        screenshot: 'Kuvatõmmis'
      },
      overlay: {
        locked: 'PicoClaw juhib seadet. Käsitsi sisend on pausil.'
      },
      install: {
        install: 'Paigalda PicoClaw',
        installing: 'PicoClaw paigaldamine',
        success: 'PicoClaw paigaldatud edukalt',
        failed: 'PicoClaw paigaldamine nurjus',
        uninstalled: 'PicoClaw edukalt eemaldatud',
        uninstallFailed: 'Eemaldamine nurjus',
        requiredTitle: 'PicoClaw pole paigaldatud',
        requiredDescription: 'Paigalda PicoClaw enne PicoClaw runtime käivitamist.',
        progressDescription: 'PicoClaw laaditakse alla ja paigaldatakse.',
        stages: {
          preparing: 'Ettevalmistamine',
          downloading: 'Allalaadimine',
          extracting: 'Lahtipakkimine',
          verifying: 'Verifitseerimine',
          installing: 'Paigaldamine',
          installed: 'Paigaldatud',
          install_timeout: 'Aegus',
          install_failed: 'Nurjus'
        }
      },
      model: {
        requiredTitle: 'Mudeli konfiguratsioon on nõutav',
        requiredDescription: 'Seadista PicoClaw mudel enne PicoClaw vestluse kasutamist.',
        docsTitle: 'Konfiguratsiooni juhend',
        docsDesc: 'Toetatud mudelid ja protokollid',
        menuLabel: 'Seadista mudel',
        modelIdentifier: 'Mudeli identifikaator',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API baas-URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API võti',
        apiKeyPlaceholder: 'Sisesta mudeli API võti',
        apiKeyKeepPlaceholder: 'Jäta tühjaks, et praegune võti säiliks',
        save: 'Salvesta',
        saving: 'Salvestamine',
        saved: 'Mudeli konfiguratsioon salvestatud',
        saveFailed: 'Mudeli konfiguratsiooni salvestamine nurjus',
        invalid: 'Mudeli identifikaator, API baas-URL ja API võti on nõutavad'
      },
      uninstall: {
        confirmTitle: 'Eemalda PicoClaw',
        confirmContent:
          'Kas oled kindel, et soovid PicoClaw eemaldada? See kustutab käivitatava faili ja kõik konfiguratsioonifailid.',
        confirmOk: 'Eemalda'
      },
      history: {
        title: 'Ajalugu',
        loading: 'Seansside laadimine...',
        emptyTitle: 'Ajalugu veel puudub',
        emptyDescription: 'Varasemad PicoClaw seansid ilmuvad siia.',
        loadFailed: 'Seansiajaloo laadimine nurjus',
        deleteFailed: 'Seansi kustutamine nurjus',
        deleteConfirmTitle: 'Kustuta seanss',
        deleteConfirmContent: 'Kas oled kindel, et soovid kustutada "{{title}}"?',
        deleteConfirmOk: 'Kustuta',
        messageCount_one: '{{count}} sõnum',
        messageCount_other: '{{count}} sõnumit'
      },
      config: {
        startRuntime: 'Käivita PicoClaw',
        stopRuntime: 'Peata PicoClaw',
        stopConfirm: 'Kas peatada PicoClaw?'
      },
      start: {
        title: 'Käivita PicoClaw',
        description: 'PicoClaw assistendi kasutamiseks käivita runtime.'
      }
    },
    error: {
      title: 'Tekkis probleem',
      refresh: 'Värskenda'
    },
    fullscreen: {
      toggle: 'Lülita täisekraan'
    },
    menu: {
      collapse: 'Ahenda menüü'
    }
  }
};

export default et;
