const da = {
  translation: {
    common: {
      confirm: 'Bekræft',
      cancel: 'Annuller',
      save: 'Gem',
      discard: 'Kassér',
      delete: 'Slet',
      actionFailed: 'Handlingen mislykkedes',
      loading: 'Indlæser indstillinger fra enheden...',
      loadFailed: 'Indstillingerne kunne ikke indlæses fra enheden',
      retry: 'Prøv igen'
    },
    head: {
      desktop: 'Fjernskrivebord',
      login: 'Log ind',
      firstSetup: 'Første opsætning',
      changePassword: 'Skift adgangskode',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Log ind',
      placeholderUsername: 'Indtast brugernavn',
      placeholderPassword: 'Indtast adgangskode',
      placeholderPassword2: 'Indtast adgangskode igen',
      noEmptyUsername: 'Brugernavn må ikke være tomt',
      noEmptyPassword: 'Adgangskode må ikke være tom',
      invalidUser: 'Ugyldigt brugernavn eller adgangskode',
      locked: 'For mange logins, prøv venligst igen senere',
      globalLocked: 'System under beskyttelse, prøv venligst igen senere',
      error: 'Uventet fejl',
      changePassword: 'Skift adgangskode',
      changePasswordDesc: 'For sikkerheden af din enhed, bedes du ændre web-login adgangskoden',
      differentPassword: 'Adgangskoder er ikke ens',
      illegalUsername: 'Brugernavn indeholder ugyldige tegn',
      illegalPassword:
        'Adgangskoden skal være på mindst 8 tegn og må ikke indeholde anførselstegn eller skråstreger',
      forgetPassword: 'Glem adgangskode',
      ok: 'OK',
      cancel: 'Annuller',
      loginButtonText: 'Log ind',
      setupTitle: 'Opret administratorkonto',
      setupDescription:
        'Der findes endnu ingen webkonto på denne enhed. Opret den første administratorkonto for at fortsætte.',
      setupRecovery: 'Hvis adgangskoden mistes, kræver gendannelse at SD-kortet skrives igen',
      setupButtonText: 'Opret konto',
      tips: {
        hardenedRecovery:
          'Dette Hardened image understøtter ikke nulstilling af adgangskode med BOOT-knappen. Hvis adgangskoden mistes, skriv SD-kortet igen og opret en ny konto.',
        change1: 'Bemærk, at denne handling ændrer følgende adgangskoder:',
        change2: 'Adgangskode til weblogin',
        change3: 'Systemets root-adgangskode til SSH-login'
      },
      placeholderCurrentPassword: 'Nuværende adgangskode',
      placeholderNewPassword: 'Ny adgangskode',
      wrongCurrentPassword: 'Den nuværende adgangskode er forkert',
      totp: {
        title: 'Totrinsgodkendelse',
        prompt: 'Indtast den 6-cifrede kode fra din godkendelsesapp',
        backupPrompt: 'Indtast en af dine backupkoder',
        noEmptyCode: 'Indtast en kode',
        placeholderCode: '6-cifret kode',
        placeholderBackup: 'Backupkode',
        verifyButtonText: 'Bekræft',
        useBackupCode: 'Brug en backupkode',
        useAuthenticator: 'Brug kode fra godkendelsesappen',
        cancel: 'Tilbage',
        invalidCode: 'Koden er ikke gyldig. Prøv igen.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Konfigurer Wi-Fi for NanoKVM',
      success: "Gå hen til enheden og kontrollér NanoKVM's netværksstatus",
      failed: 'Handlingen mislykkedes, prøv igen',
      invalidMode:
        'Den aktuelle tilstand understøtter ikke netværksopsætning. Gå til din enhed og aktiver Wi-Fi konfigurationstilstand.',
      confirmBtn: 'Ok',
      finishBtn: 'Færdig',
      ap: {
        authTitle: 'Godkendelse påkrævet',
        authDescription: 'Indtast venligst AP-adgangskoden for at fortsætte',
        authFailed: 'Ugyldig AP adgangskode',
        passPlaceholder: 'AP-adgangskode',
        verifyBtn: 'Bekræft'
      }
    },
    screen: {
      scale: 'Skala',
      title: 'Skærm',
      video: 'Videotilstand',
      videoDirectTips:
        'Aktivér HTTPS under "Indstillinger > Netværk > Tjenester" for at bruge denne tilstand',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC er deaktiveret i firewalltilstandene Begrænset og Paranoid',
      transferRunningTitle: 'Billedoverførsel i gang',
      transferRunningDesc:
        'Hvis du skifter videotilstand, genindlæses siden, og den igangværende upload eller download af billedet annulleres.',
      transferRunningOk: 'Skift tilstand',
      resolution: 'Opløsning',
      auto: 'Automatisk',
      autoTips:
        'Screen-tearing eller mouse-offset kan opstå ved enkelte opløsninger, så justér fjerncomputerens skærmopløsning eller deaktiver automatisk tilstand',
      fps: 'FPS',
      customizeFps: 'Tilpas',
      quality: 'Kvalitet',
      qualityLossless: 'Tabsfri',
      qualityHigh: 'Høj',
      qualityMedium: 'Mellem',
      qualityLow: 'Lav',
      frameDetect: 'Billeddetektering',
      frameDetectTip:
        'Sammenligner frames og stopper med at sende video, så længe fjerncomputerens skærm ikke ændrer sig',
      resetHdmi: 'Nulstil HDMI',
      webrtcConnectionFailed: {
        title: 'WebRTC-forbindelse mislykkedes',
        description: 'Kontrollér netværksforbindelsen, eller skift videotilstand'
      },
      captureStatus: {
        hdmiError: 'Fejl i HDMI-billedet',
        unsupportedResolution: 'Den aktuelle opløsning understøttes ikke',
        retrieving: 'Henter skærmbillede...',
        changingResolution: 'Skifter opløsning...',
        updateFailed: 'Skærmbilledet kan ikke opdateres lige nu',
        videoError: 'Fejl i videovisning',
        noHdmi: 'Intet HDMI-signal registreret',
        unavailable: 'Skærmbilledet kan ikke vises lige nu'
      }
    },
    keyboard: {
      title: 'Tastatur',
      paste: 'Indsæt',
      tips: 'Kun standard bogstaver og symboler er understøttet',
      placeholder: 'Tekst der skal indsættes',
      local: 'Mobilt tastatur',
      virtual: 'Skærmtastatur',
      readClipboard: 'Læs fra udklipsholder',
      clipboardPermissionDenied:
        'Udklipsholdertilladelse nægtet, tillad udklipsholderadgang i din browser',
      clipboardReadError: 'Kunne ikke læse udklipsholderen',
      dropdownEnglish: 'Engelsk',
      dropdownGerman: 'Tysk',
      dropdownFrench: 'Fransk',
      dropdownRussian: 'Russisk',
      dropdownKorean: 'Koreansk',
      dropdownJapanese: 'Japansk',
      localInput: 'Input fra mobiltastatur',
      shortcut: {
        title: 'Genveje',
        custom: 'Brugerdefineret',
        capture: 'Klik her for at fange genvej',
        clear: 'Ryd',
        save: 'Gem',
        captureTips: 'Optagelse af systemtaster, såsom Windows-tasten, kræver fuldskærmstilladelse',
        enterFullScreen: 'Skift fuldskærmstilstand'
      },
      leaderKey: {
        title: 'Leader-tast',
        desc: 'Omgå browserbegrænsninger og send systemgenveje direkte til fjernværten',
        howToUse: 'Sådan bruges',
        simultaneous: {
          title: 'Samtidig tilstand',
          desc1: 'Hold Leader-tasten nede, og tryk derefter på genvejen.',
          desc2: 'Intuitivt, men kan være i konflikt med systemgenveje.'
        },
        sequential: {
          title: 'Sekventiel tilstand',
          desc1:
            'Tryk på Leader-tasten → tryk på genvejen i rækkefølge → tryk på Leader-tasten igen.',
          desc2: 'Kræver flere trin, men undgår fuldstændig systemkonflikter.'
        },
        enable: 'Aktiver Leader-tast',
        tip: 'Når denne tast tildeles som Leader-tast, fungerer den kun som genvejsudløser og mister sin standardfunktion.',
        placeholder: 'Tryk på Leader-tasten',
        shiftRight: 'Højre Shift',
        ctrlRight: 'Højre Ctrl',
        metaRight: 'Højre Win',
        recorder: {
          rec: 'REC',
          activate: 'Aktiver taster',
          input: 'Tryk på genvejen'
        }
      }
    },
    mouse: {
      title: 'Mus',
      cursor: 'Markørstil',
      default: 'Standard-markør',
      cell: 'Celle-markør',
      text: 'Tekst-markør',
      grab: 'Grib-markør',
      hide: 'Skjul mus',
      mode: 'Tilstand for mus',
      absolute: 'Absolut tilstand',
      relative: 'Relativ tilstand',
      direction: 'Rullehjulsretning',
      scrollUp: 'Rul op',
      scrollDown: 'Rul ned',
      speed: 'Rullehjulshastighed',
      sensitivity: 'Markørhastighed',
      sensitivityDesc:
        'Til relativ desktoptilstand: lavere værdier reducerer drift fra værtsmaskinens museacceleration',
      fast: 'Hurtigt',
      slow: 'Langsomt',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Bevæg fingeren hvor som helst i KVM-området; fjernmarkøren bevarer sin position mellem berøringer og holdes synkroniseret med absolut HID'
      },
      requestPointer: 'Bruger relativ tilstand, klik på skrivebordet for at få musemarkøren',
      resetHid: 'Nulstil HID',
      hidOnly: {
        title: 'HID-Only-tilstand',
        desc: 'Hvis mus eller tastatur holder op med at reagere, og nulstilling af HID ikke hjælper, kan det være et kompatibilitetsproblem mellem NanoKVM og værten.',
        tip1: 'Aktivering af HID-Only-tilstand afmonterer den virtuelle disk og det virtuelle netværk',
        tip2: 'I HID-Only-tilstand er montering af billeder deaktiveret',
        tip3: 'NanoKVM genstarter automatisk efter at have skiftet tilstand',
        enable: 'Aktivér HID-Only-tilstand',
        disable: 'Deaktivér HID-Only-tilstand'
      }
    },
    image: {
      title: 'Diskbilleder',
      loading: 'Indlæser...',
      empty: 'Ingen fundet',
      mountMode: 'Monter som',
      massStorage: 'Masselager',
      cdRom: 'CD-ROM',
      mountFailed: 'Montering af diskbillede mislykkedes',
      mountDesc:
        'På nogle systemer kan det være nødvendigt at skubbe den virtuelle disk ud på fjerncomputeren før du kan montere diskbilledet',
      diskOnWarn:
        'Når billedet monteres, slukkes den virtuelle disk, så computeren ikke længere har adgang til /data. Fortsæt?',
      diskOffWarn:
        'Den virtuelle disk er slukket og skal aktiveres for at montere billedet. USB-enhederne på computeren genopregistreres. Fortsæt?',
      unmountFailed: 'Afmontering mislykkedes',
      unmountDesc:
        'På nogle systemer skal du manuelt skubbe ud fra fjernværten, før du afmonterer billedet',
      forceEject: 'Skub ud med tvang',
      forceEjectConfirm:
        'Værten har låst det optiske drev. Når du skubber ud med tvang, afbrydes den virtuelle USB-enhed et øjeblik, så tastaturet og musen kortvarigt kan miste forbindelsen. Vil du fortsætte?',
      usbReconnect: 'Tilslut USB igen',
      usbReconnectConfirm:
        'Genopret kun USB-gadgeten, hvis fjernværten ikke opdagede medieskiftet. Tastatur og mus kan kortvarigt afbrydes.',
      usbReconnectSuccess: 'USB tilsluttet igen',
      usbReconnectFailed: 'Kunne ikke tilslutte USB igen',
      addImage: 'Tilføj diskbillede',
      fromUrl: 'Fra URL',
      fromFile: 'Fra fil',
      turnOff: 'Sluk',
      eject: 'Skub ud',
      download: 'Download',
      upload: 'Upload',
      mountTitle: 'Monter diskbillede',
      deleteTitle: 'Slet diskbillede',
      deleteConfirm: 'Er du sikker på, at du vil slette dette billede?',
      tips: {
        title: 'Sådan uploader du',
        usb1: 'Forbind din NanoKVM til din computer via USB.',
        usb2: 'Sørg for, at den virtuelle disk er monteret under Indstillinger > Enhed > Virtuel disk.',
        usb3: 'Åben den virtuelle disk på din computer og kopier diskbilledet til roden af den virtuelle disk.',
        scp1: 'Kontroller at din NanoKVM og din computer er på samme lokale netværk.',
        scp2: 'Åben en terminal på din computer og brug SCP-kommandoen for at uploade diskbilledet til /data mappen på din NanoKVM.',
        scp3: 'Eksempel: scp sti-til-dit-diskbillede root@din-nanokvm-ip:/data',
        tfCard: 'microSD-kort',
        tf1: 'Denne metode er understøttet af Linux systemer',
        tf2: 'Tag SD-kortet ud af din NanoKVM. På FULL-versionen skal du først åbne enheden.',
        tf3: 'Indsæt microSD-kortet i en kortlæser og tilslut den til en computer.',
        tf4: 'Kopier diskbilledet til /data mappen på microSD-kortet.',
        tf5: 'Skub microSD-kortet ud og indsæt microSD-kortet i din NanoKVM.'
      }
    },
    script: {
      title: 'Script',
      upload: 'Upload',
      run: 'Kør',
      runBackground: 'Kør i baggrunden',
      runFailed: 'Kørsel mislykkedes',
      delDesc: 'Er du sikker på at du vil slette denne fil?',
      delete: 'Slet',
      close: 'Luk',
      unlockDesc:
        'Scripts kører som root på NanoKVM. Indtast adgangskoden til webkontoen for at uploade eller køre et script.',
      terminalRequired:
        'Scripts kræver adgang til webterminalen. Aktivér først terminalen i indstillingerne.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'Terminal til NanoKVM',
      serial: 'Terminal til seriel port',
      unlockTitle: 'Lås terminal op',
      unlockDesc: 'Indtast adgangskoden til webkontoen for at starte en terminalsession',
      unlock: 'Lås op',
      unlockFailed: 'Kunne ikke låse terminalen op',
      invalidCredentials: 'Ugyldigt brugernavn eller adgangskode',
      locked: 'For mange forsøg, prøv igen senere',
      sessionClosed: 'Terminalsessionen blev lukket. Lås op igen for at genoprette.',
      sessionError: 'Terminalforbindelsen mislykkedes. Lås op igen for at prøve.',
      serialPort: 'Seriel port',
      serialPortPlaceholder: 'For eksempel /dev/ttyS1',
      baudrate: 'Baud-hastighed',
      parity: 'Paritet',
      parityNone: 'Ingen',
      parityEven: 'Lige',
      parityOdd: 'Ulige',
      flowControl: 'Flowkontrol',
      flowControlNone: 'Ingen',
      flowControlSoft: 'Software',
      flowControlHard: 'Hardware',
      dataBits: 'Databits',
      stopBits: 'Stopbit',
      open: 'Åbn terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Sender Wake-on-LAN magic packet...',
      sent: 'Wake-on-LAN magic packet sendt',
      input: 'MAC-adresse',
      ok: 'OK'
    },
    download: {
      input: 'URL til fjernbillede',
      ok: 'OK',
      disabled:
        'Billeder kan ikke downloades eller uploades lige nu, fordi lageret ikke kan skrives til. Hvis et billede er monteret, skal du afmontere det og derefter slukke den virtuelle disk, så lageret igen kan skrives til.',
      diskShared: 'Sluk den virtuelle disk for at bruge billeddownloaden',
      mountedImage: 'Dette image er monteret, afmontér det, før du uploader en fil med samme navn',
      diskOff: 'Sluk den virtuelle disk',
      uploadbox: 'Slip filen her, eller klik for at vælge',
      inputfile: 'Billedfil',
      NoISO: 'Intet image',
      complete: 'Download fuldført',
      uploadComplete: 'Upload fuldført',
      downloading: 'Downloader',
      uploading: 'Uploader',
      failed: 'Overførsel mislykkedes',
      uploadFailed: 'Upload mislykkedes',
      stalled: 'Overførslen er gået i stå, kontroller forbindelsen og prøv igen',
      canceled: 'Upload annulleret',
      downloadCanceled: 'Download annulleret',
      cancel: 'Annuller',
      remoteDisabled:
        'Ekstern ISO-download er deaktiveret under Indstillinger > Bruger > Præferencer',
      remoteFailed: 'Ekstern ISO-download mislykkedes',
      sha256: 'Valgfri SHA-256-kontrolsum',
      sha256Placeholder: 'Indtast en SHA-256-kontrolsum på 64 tegn',
      invalidSHA256: 'SHA-256 skal være en hexadecimal streng på 64 tegn',
      checksumFailed: 'Download mislykkedes: SHA-256-verifikation mislykkedes'
    },
    power: {
      title: 'Tænd/sluk-knap',
      showConfirm: 'Bekræftelse',
      showConfirmTip: 'Strømdrift kræver en ekstra bekræftelse',
      reset: 'Nulstillingsknap',
      powerShort: 'Tænd/sluk-knap: kort tryk',
      powerLong: 'Tænd/sluk-knap: langt tryk',
      resetConfirm: 'Udføre nulstilling?',
      powerConfirm: 'Udføre strømhandlingen?',
      okBtn: 'Ja',
      cancelBtn: 'Nej'
    },
    settings: {
      title: 'Indstillinger',
      about: {
        title: 'Om',
        information: 'Information',
        ip: 'IP-adresse',
        mdns: 'Lokal adresse',
        application: 'Program version',
        uptime: 'Oppetid',
        community: 'Fællesskab',
        credit: 'Bygget på <a1>NanoKVM</a1> fra Sipeed og <a2>Hardened NanoKVM</a2> af woffko',
        hostname: 'Enhedsnavn',
        changeIn: 'Ændr det i {{path}}',
        updateIn: 'Opdater det i {{path}}',
        toggleIn: 'Slå det til eller fra i {{path}}'
      },
      appearance: {
        title: 'Præferencer',
        display: 'Visning',
        language: 'Sprog',
        languageDesc: 'Vælg sproget til grænsefladen',
        webTitle: 'Webtitel',
        webTitleDesc: 'Tilpas websidens titel',
        layoutMode: 'Grænsefladelayout',
        layoutModeDesc: 'Brug telefon-/touchlayout i denne browser',
        layoutAuto: 'Automatisk',
        layoutMobile: 'Telefon',
        menuBar: {
          title: 'Menulinje',
          mode: 'Visningstilstand',
          modeDesc: 'Vis menulinje på skærmen',
          modeOff: 'Fra',
          modeAuto: 'Skjul automatisk',
          modeAlways: 'Altid synlig',
          keyboardLedStatus: 'Tastaturlåseindikatorer',
          keyboardLedStatusDesc:
            'Vis Num Lock-, Caps Lock- og Scroll Lock-status for fjerncomputeren',
          icons: 'Undermenuikoner',
          iconsDesc: 'Vis undermenuikoner i menulinjen',
          terminalWarningTitle: 'Aktivér webterminal?',
          terminalWarningDesc:
            'Terminalen åbner en root-shell i browseren. Aktivér kun på et betroet netværk og slå den fra, når du er færdig.',
          terminalWarningConfirm: 'Aktivér',
          remoteDownload: 'Hent ekstern ISO',
          remoteDownloadWarningTitle: 'Aktivér ekstern ISO-download?',
          remoteDownloadWarningDesc:
            "NanoKVM henter en ISO fra en URL og skriver den til /data. Aktivér kun for betroede URL'er og slå fra, når du er færdig.",
          remoteDownloadWarningConfirm: 'Aktivér'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Status for låse på fjernkeyboard',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Til',
        off: 'Fra',
        unknown: 'Ukendt'
      },
      device: {
        title: 'Enhed',
        minutes: 'min',
        sections: {
          general: 'Generelt',
          connectivity: 'Forbindelser',
          hostConnection: 'Værtsforbindelse',
          inputOutput: 'Input og output'
        },
        oled: {
          title: 'OLED-timeout',
          description: 'Sluk OLED-skærmen efter',
          keepOn: 'Hold OLED tændt',
          keepOnDescription: 'Sluk aldrig OLED-skærmen'
        },
        ssh: {
          description: 'Aktiver SSH fjernadgang',
          tip: 'Indstil en stærk adgangskode under Konto > Adgangskode, før du aktiverer denne indstilling'
        },
        swap: {
          title: 'Swap',
          description: 'Brug en swap-fil, når hukommelsen er ved at slippe op',
          size: 'Swap-størrelse',
          sizeDescription: 'Indstil swap-filstørrelsen',
          tip: 'Aktivering af denne funktion kan forkorte dit SD-korts brugbare levetid'
        },
        mouseJiggler: {
          title: 'Mus-jiggler',
          description: 'Forhindrer fjernværten i at sove',
          disable: 'Deaktiver',
          absolute: 'Absolut tilstand',
          relative: 'Relativ tilstand'
        },
        sessionLock: {
          title: 'Lås session ved inaktivitet',
          description: 'Kræv login igen efter denne tid'
        },
        mdns: {
          description: 'Aktiver mDNS opdagelsestjeneste',
          tip: 'Gør det muligt at nå enheden via dens .local-navn. Ikke nødvendigt, hvis du forbinder via IP-adresse, eller din DNS allerede kan slå værtsnavnet op.'
        },
        hdmi: {
          description: 'Aktiver HDMI/monitor output',
          idleTimeoutTitle: 'Timeout for inaktiv optagelse',
          idleTimeoutDescription: 'Stop HDMI-optagelse efter en periode uden aktive seere på'
        },
        hidOnly: 'HID-Only-tilstand',
        hidOnlyDesc:
          'Forbedrer kompatibiliteten med værten, hvis mus eller tastatur holder op med at reagere',
        hidOnlyTip:
          'HID-Only-tilstand stopper emuleringen af virtuelle enheder og beholder kun grundlæggende HID-kontrol',
        disk: 'Virtuel disk',
        diskDesc: 'Monter SD-kortet på den eksterne vært',
        diskLocked: 'Slukket, mens et billede er monteret, og aktivering annullerer monteringen',
        diskEnable: 'Aktivér virtuel disk',
        networkChange: 'Skift virtuelt netværk',
        diskCancelMount:
          'Hvis du aktiverer den virtuelle disk, annulleres det monterede billede. Fortsæt?',
        networkCancelMount:
          'Hvis du ændrer det virtuelle netværk, genstartes USB-forbindelsen. Det annullerer det monterede billede og aktiverer den virtuelle disk. Fortsæt?',
        diskTransferRunning:
          'Der er en billedoverførsel i gang. Vent, til den er færdig, før du aktiverer den virtuelle disk.',
        network: 'Virtuelt netværk',
        networkDesc: 'Monter det virtuelle netværkskort på den eksterne vært',
        usbWakeup: 'USB-vækning',
        usbWakeupDesc: 'Tillad tastatur- eller musehændelser at vække fjernværten',
        usbWakeupTip: 'Slå fra, hvis værten logger gentagne USB wakeup-meddelelser',
        hostname: {
          description: 'Enhedens navn på netværket',
          reachable: 'Kan nås på det lokale netværk som {{address}}'
        },
        rebootRequired: 'Genstart påkrævet',
        rebootPending: 'Genstart påkrævet for: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Systemopdatering'
        },
        reboot: 'Genstart',
        rebootDesc: 'Er du sikker på, at du vil genstarte NanoKVM?',
        poweroff: 'Sluk',
        poweroffDesc:
          'Er du sikker på, at du vil slukke NanoKVM? Den kan ikke nås, før den tændes igen.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Forbindelse',
        configuration: 'Konfiguration',
        wifi: {
          title: 'Wi-Fi',
          description: 'Konfigurer Wi-Fi',
          apMode: 'AP-tilstand er aktiveret, opret forbindelse til Wi-Fi ved at scanne QR-koden',
          connect: 'Tilslut Wi-Fi',
          connectDesc1: 'Indtast netværkets SSID og adgangskode',
          disconnect: 'Er du sikker på, at du vil afbryde netværket?',
          disconnectBtn: 'Afbryd',
          connected: 'Forbundet',
          ssid: 'Navn',
          password: 'Adgangskode',
          joinBtn: 'Tilslut',
          cancelBtn: 'Annuller'
        },
        tls: {
          description: 'Aktiver HTTPS-protokol',
          tip: 'Bemærk: Brug af HTTPS kan øge forsinkelsen, især med MJPEG-videotilstand',
          restartTitle: 'Serveren genstarter',
          restartDesc:
            'Protokolændringen genstarter serveren. Browseren skifter til den nye adresse efter {{seconds}} sekunder:',
          restartOk: 'Anvend og genstart',
          confirmTitle: 'Behold den nye protokol?',
          confirmDesc:
            'Serveren kører nu på {{protocol}}. Den vender tilbage til den tidligere protokol om {{seconds}} sekunder, medmindre du beholder den.',
          confirmKeep: 'Behold',
          confirmRevert: 'Gå tilbage',
          reverting:
            'Går tilbage til den tidligere protokol. Browseren skifter til den adresse efter {{seconds}} sekunder.',
          certTitle: 'Behold det nye certifikat?',
          certDesc:
            'Serveren bruger nu det nye certifikat. Den vender tilbage til det forrige om {{seconds}} sekunder, medmindre du beholder det.',
          certReverted: 'Det forrige certifikat er tilbage'
        },
        trustedProxies: {
          section: 'Omvendt proxy',
          title: 'Betroede proxyer',
          description:
            'Omvendte proxyer, som enheden stoler på til at oplyse klientens adresse og protokol',
          tip: 'En adresse på listen vælger den klientadresse, som loginbegrænsningen og loggen registrerer, så angiv kun proxyer, du selv styrer',
          none: 'Ingen',
          edit: 'Rediger',
          editRow: 'Rediger listen',
          editTitle: 'Rediger betroede proxyer',
          editDescription: 'Ændring af listen kræver din adgangskode',
          dialogDescription:
            'Angiv adressen på hver omvendt proxy, som denne enhed ser den, eller et område som 10.0.0.0/24. En proxy på listen fortæller enheden, hvilken klientadresse og hvilken protokol der skal bruges. Alt, den videresender, tros på, så angiv kun proxyer, du selv styrer.'
        },
        certificate: {
          title: 'Certifikat',
          desc: 'Hvor HTTPS-certifikatet kommer fra',
          requesting: 'Anmoder om certifikatet',
          selfSigned: 'Selvsigneret',
          domain: 'Domæne',
          domainDesc: 'Skal pege på denne enhed, og port 443 skal kunne nås fra internettet',
          domainTailscale: 'Angivet af Tailscale til denne enhed',
          domainInvalid: 'Brug et fuldt domænenavn, for eksempel kvm.example.org',
          email: 'E-mail',
          emailDesc: "Valgfri, til meddelelser fra Let's Encrypt",
          emailInvalid: 'Brug en adresse som navn@example.org',
          validUntil: 'Gyldigt til',
          valid: 'Gyldigt',
          expiresSoon: 'Udløber snart',
          expired: 'Udløbet',
          lastRenewal: 'Seneste fornyelse',
          renewed: 'Fornyet',
          failed: 'Mislykkedes',
          renewNow: 'Forny nu',
          renewNowDesc: 'Anmod om et nyt certifikat uden at vente',
          renewBtn: 'Forny',
          applyTitle: 'Skift certifikat',
          applyOk: 'Anvend',
          applyAcme:
            "Enheden anmoder Let's Encrypt om et certifikat. Let's Encrypt forbinder til port 443 fra internettet for at kontrollere det, hvilket kan tage op til et minut. Hvis anmodningen mislykkes, bruges det nuværende certifikat fortsat.",
          applyTailscale:
            'Enheden henter et certifikat fra Tailscale, hvilket kan tage op til et minut. Hvis anmodningen mislykkes, bruges det nuværende certifikat fortsat.',
          applySelfSigned:
            'Enheden vender tilbage til sit eget selvsignerede certifikat. Browsere advarer om det.',
          openTitle: 'Åbn den nye adresse',
          openDesc:
            'Certifikatet er klart. Åbn adressen nedenfor og log ind for at beholde det. Uden din bekræftelse inden for 3 minutter vender det forrige certifikat tilbage.',
          openOk: 'Åbn',
          blockedClock: 'Certifikater kan ikke anmodes, før enhedens ur er synkroniseret',
          blockedParanoid: 'Firewalltilstanden Paranoid blokerer anmodninger om certifikater',
          tailscaleUnavailable:
            'Tailscale kører ikke, eller HTTPS-certifikater er ikke aktiveret for tailnettet'
        },
        dns: {
          title: 'DNS',
          description: 'Konfigurer DNS-servere til NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Konfigurer IPv4-adressering for det kablede interface',
          servers: 'Servere',
          dhcp: 'DHCP',
          manual: 'Manuel',
          apply: 'Anvend',
          invalid: 'Indtast en gyldig IPv4- eller IPv6-adresse',
          invalidNetwork: 'Indtast en gyldig IPv4-adresse, undernetmaske og router',
          saved: 'DNS-indstillinger gemt',
          redirecting: 'Netværksindstillinger gemt. Åbner den nye adresse...',
          saveFailed: 'DNS-indstillinger kunne ikke gemmes',
          unsaved: 'Ikke-gemte ændringer',
          maxServers: 'Maksimalt {{count}} DNS-servere er tilladt',
          dhcpServersDescription: 'DNS-servere hentes automatisk fra DHCP',
          manualServersDescription: 'IPv4- og IPv6-servere understøttes',
          interface: 'Grænseflade',
          ipAddress: 'IP-adresse',
          subnetMask: 'Undernetmaske',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Konfigurer IPv6-adressering for den kablede grænseflade',
          disabled: 'Deaktiveret',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manuel',
          interface: 'Grænseflade',
          state: 'Tilstand',
          router: 'Router',
          addresses: 'Adresser',
          dhcpv6Client: 'DHCPv6-klient',
          notInstalled: 'Ikke installeret',
          ipAddress: 'IPv6-adresse',
          prefix: 'Præfiks',
          invalidManual: 'Angiv en gyldig IPv6-adresse, præfiks og router',
          clientMissing:
            'DHCPv6-klienten er ikke installeret. Installer først den matchende raw-systemopdatering.',
          saved: 'IPv6-indstillinger gemt',
          saveFailed: 'Kunne ikke gemme IPv6-indstillinger',
          unsaved: 'Ikke-gemte ændringer'
        }
      },
      system: {
        title: 'System',
        performance: {
          processor: 'Processor',
          overdrive: {
            title: 'Overclocking',
            description:
              'Start med de højere processor- og videofrekvenser, som producenten har specificeret',
            tip: 'Hvis enheden ikke starter med overclocking, skal SD-kortet flashes igen',
            unavailable: 'Ikke med i dette systemaftryk',
            keepTitle: 'Behold overdrive efter opdateringer',
            keepDescription:
              'En systemopdatering sætter enheden tilbage til standardhastighederne, medmindre dette er slået til',
            confirmTitle: 'Aktivér overclocking?',
            confirmText:
              'Hvis enheden ikke starter med overclocking, skal du flashe SD-kortet igen for at gendanne den. Ændringen træder i kraft efter næste genstart.',
            confirmOk: 'Aktivér'
          },
          watchdog: {
            title: 'Hardware-watchdog',
            description: 'Genstart enheden automatisk, når den holder op med at svare',
            unavailable: 'Ikke inkluderet i dette systemaftryk',
            notRunning: 'Kører ikke i øjeblikket',
            lastRestart: 'Seneste genstart',
            lastRestartCaption: 'Seneste årsag til, at systemet blev genstartet',
            reasonPowerOn: 'Tændt',
            reasonRestart: 'Genstart anmodet',
            reasonWatchdog: 'Watchdog-nulstilling',
            reasonOverheat: 'Overophedningsbeskyttelse',
            reasonUnknown: 'Ukendt'
          },
          recovery: 'Genopretning',
          memory: 'Hukommelse'
        },
        monitor: {
          processorClock: 'CPU-delsystem',
          videoClock: 'Videodelsystem',
          videoClockCaption: 'Videoclockfrekvens',
          cpuClockCaption: 'CPU-clockfrekvens',
          overdrive: 'Overclocking',
          temperature: 'Temperatur',
          lastMinutes: 'Seneste 5 minutter',
          ram: 'RAM',
          off: 'Fra',
          ramHistory: 'RAM-forbrug',
          cpuLoad: 'CPU-belastning',
          cpuLoadCaption: 'Bruger {{user}} procent, system {{system}} procent',
          cpuUtilization: 'CPU-udnyttelse',
          swapUtilization: 'Swap-udnyttelse',
          swapSizeLastMinutes: '{{size}}, seneste 5 minutter',
          percent: '{{percent}} procent',
          percentUsed: '{{percent}} procent brugt',
          sizeOf: '{{used}} af {{total}}',
          systemPartition: 'Systempartition',
          dataPartition: 'Datapartition',
          unavailable: 'Ikke tilgængelig',
          noReadings: 'Enheden leverer ingen målinger',
          refresh: 'Opdateres hvert sekund, mens siden er åben'
        },
        sections: {
          time: 'Tid',
          firewall: 'Firewall',
          systemLog: 'Logning',
          performance: 'Ydelse',
          monitor: 'Overvågning',
          services: 'Tjenester',
          webInterface: 'Sikker webadgang'
        },
        time: {
          saveFailed: 'Kunne ikke gemme tidsindstillinger',
          saved: 'Tidsindstillinger gemt',
          syncFailed: 'Kunne ikke synkronisere tid',
          synced: 'Tid synkroniseret',
          invalidServers: 'Angiv mindst én NTP-server',
          maxServers: 'Maksimalt {{count}} NTP-servere tilladt',
          refresh: 'Opdater',
          syncNow: 'Synkroniser',
          syncNowDesc: 'Indstil uret fra NTP-serverne nu',
          save: 'Gem',
          ntp: {
            title: 'NTP',
            description: 'Synkroniser enhedens tid fra konfigurerede NTP-servere'
          },
          networkTime: 'Netværkstid',
          clock: {
            title: 'Ur',
            description: 'Angiv den lokale tidszone, som logs og UI bruger',
            current: 'Aktuel tid',
            timezone: 'Tidszone'
          },
          servers: {
            title: 'NTP-servere',
            description:
              'Brug standardens offentlige servere, din lokale router eller egne NTP-servere',
            useRouter: 'Brug router',
            useDefaults: 'Brug standarder',
            presets: 'Serverforvalg',
            presetsDesc: 'Erstat serverlisten med et forvalg'
          }
        },
        firewall: {
          saveFailed: 'Kunne ikke anvende firewallindstillinger',
          saved: 'Firewallindstillinger anvendt',
          cancel: 'Annuller',
          refresh: 'Opdater',
          backends: 'Backends',
          enableHttpsFirst:
            'Aktivér HTTPS, før du aktiverer firewalltilstanden Begrænset eller Paranoid',
          httpsRequired:
            'Tilstandene Begrænset og Paranoid er deaktiveret, indtil HTTPS er aktiveret under Indstillinger > Netværk > Tjenester',
          mode: {
            title: 'Firewalltilstand',
            baseline: 'Basis',
            baselineDesc:
              'Åben kompatibilitetsprofil. Firewallen kører, men indgående kilder er ikke begrænset. Brug kun på betroede netværk.',
            moderate: 'Moderat',
            moderateDesc:
              'Standardprofil. Bevarer Basis-tjenesterne, men accepterer kun nye indgående forbindelser fra private, link-local- eller loopback-intervaller. Udgående adgang forbliver åben.',
            restricted: 'Begrænset',
            restrictedDesc:
              'Kun lokal HTTPS og SSH samt udgående DNS, NTP, syslog og onlineopdateringer. DHCP og nødvendig IPv6-trafik forbliver tilgængelig. WebRTC er blokeret.',
            paranoid: 'Paranoid',
            paranoidDesc:
              'Kun lokal HTTPS-adgang. Blokerer SSH, HTTP, onlineopdateringer og andre udgående netværksfunktioner. Upload af offlineopdateringer og allerede klargjorte installationer er stadig tilgængelige.',
            current: 'Nuværende',
            default: 'Standard',
            localOnly: 'Kun lokalt',
            openTag: 'Indgående åben',
            httpsRequiredTag: 'HTTPS påkrævet',
            outboundOpen: 'Udgående åben',
            outboundLimited: 'Udgående begrænset',
            httpsOnly: 'Kun HTTPS'
          },
          moderate: {
            apply: 'Skift til Moderat'
          },
          restricted: {
            enable: 'Aktivér Begrænset',
            confirmTitle: 'Aktivér firewalltilstanden Begrænset?',
            confirmDesc:
              'Indgående administrativ adgang begrænses til private IPv4-, IPv4 link-local/loopback-, IPv6 link-local- eller IPv6 loopback-kilder for HTTPS og SSH. Offentlige kildeområder tillades ikke. Udgående DNS, NTP, fjern-syslog, onlineopdateringer, DHCP, etablerede forbindelser og nødvendig IPv6-kontroltrafik forbliver tilgængelige. WebRTC/ICE UDP og anden ind-/udgående trafik blokeres.'
          },
          paranoid: {
            enable: 'Aktivér Paranoid',
            confirmTitle: 'Aktivér firewalltilstanden Paranoid?',
            confirmDesc:
              'Kun HTTPS-adgang fra private IPv4, IPv4 link-local/loopback, IPv6 link-local eller IPv6 loopback forbliver tilgængelig. SSH, HTTP, mDNS, NTP, GitHub-downloads og anden trafik blokeres bortset fra minimal DHCP/IPv6-kontroltrafik.'
          },
          baseline: {
            apply: 'Skift til Basis',
            confirmTitle: 'Skifte til den åbne tilstand Basis?',
            confirmDesc:
              'Firewalltjenesten forbliver aktiv, men begrænsningen til lokale kildeintervaller fjernes. Offentlige kildeintervaller kan nå eksponerede NanoKVM-tjenester, hvis netværket router dem.'
          },
          rules: {
            title: 'Aktuelle regler',
            empty: 'Ingen regler'
          }
        },
        saveChanges: 'Gem ændringer',
        unsaved: 'Ikke-gemte ændringer'
      },
      systemLog: {
        saveFailed: 'Kunne ikke gemme logindstillinger',
        saved: 'Logindstillinger gemt',
        invalidHost: 'Angiv en syslog-serverhost',
        logLoadFailed: 'Kunne ikke indlæse logs',
        save: 'Gem',
        test: 'Send testlog',
        testSent: 'Testlog sendt',
        testFailed: 'Kunne ikke sende testlog',
        remote: {
          title: 'Fjernlogning',
          forward: 'Videresend systemlog',
          description: 'Videresend systemmeddelelser til en fjernserver',
          host: 'Server',
          hostDesc: 'Værtsnavn eller IPv4-adresse på syslog-serveren',
          port: 'Port',
          protocol: 'UDP-port på syslog-serveren'
        },
        local: {
          title: 'Systemlogbuffer',
          description:
            'Aktuelle logs opbevares i RAM på {{path}} for at undgå skrivninger til SD-kortet',
          priority: 'Minimumsprioritet',
          priorityDesc: 'Mindste hastegrad for at en meddelelse logges',
          buffer: 'Bufferstørrelse',
          bufferDesc: 'Logstørrelse, hvor filen roteres',
          rotations: 'Rotationer',
          rotationsDesc: 'Antal roterede logfiler, der gemmes',
          compact: 'Kompakt output',
          compactDesc: 'Udelad værtsnavn og facility fra hver linje',
          stripTimestamps: 'Fjern tidsstempler',
          stripTimestampsDesc:
            'Fjern tidsstempler tilføjet af afsenderen; syslog tilføjer sine egne'
        },
        kernel: {
          title: 'Kernellogning',
          enabled: 'Videresend kernellog',
          enabledDesc: 'Opfang kernelmeddelelser i systemloggen',
          consoleLevel: 'Konsolniveau',
          consoleLevelDesc: 'Mindste hastegrad for at en kernelmeddelelse udskrives på konsollen'
        },
        viewer: {
          title: 'Systemlog',
          refresh: 'Opdater',
          empty: 'Ingen logposter',
          truncated: 'Kun de seneste logdata vises',
          linesUnit: 'linjer'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Kritisk',
          '3': '3 - Fejl',
          '4': '4 - Advarsel',
          '5': '5 - Bemærkning',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Alle'
        }
      },
      user: {
        title: 'Bruger'
      },
      networking: {
        title: 'Netværk'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Krypteret tunnel',
        device: 'Denne enhed',
        description: 'Få adgang til denne KVM gennem en WireGuard-tunnel',
        unavailable: 'WireGuard er ikke installeret på denne enhed',
        blocked: 'Firewalltilstanden Paranoid blokerer WireGuard',
        needsKey: 'Angiv en privat nøgle, før du slår WireGuard til',
        saved: 'WireGuard-indstillingerne er gemt',
        save: 'Gem ændringer',
        unsaved: 'Ikke-gemte ændringer',
        invalid: 'Kontroller de markerede felter',
        invalidAddress: 'Angiv en adresse med dens maske, f.eks. 10.0.0.1/24',
        invalidKey: 'Angiv en WireGuard-nøgle på 44 tegn',
        invalidEndpoint: 'Angiv et værtsnavn eller en IP-adresse',
        invalidPort: 'Angiv en port fra 1 til 65535',
        invalidRanges: 'Brug IPv4-intervaller som 10.0.0.0/24, ikke 0.0.0.0/0',
        status: {
          connected: 'Forbundet',
          waiting: 'Venter på peer',
          stopped: 'Stoppet',
          handshake: 'Seneste handshake {{time}}'
        },
        privateKey: {
          title: 'Privat nøgle',
          description: 'Bliver på denne enhed og vises aldrig igen',
          set: 'Angivet',
          notSet: 'Ikke angivet',
          setBtn: 'Angiv',
          generate: 'Generer',
          remove: 'Fjern',
          modalTitle: 'Angiv den private nøgle',
          modalDescription: 'Nøglen gemmes på denne enhed og vises aldrig igen',
          placeholder: 'Indsæt den private nøgle',
          generateConfirmTitle: 'Generere en ny privat nøgle?',
          generateConfirmDesc:
            'Den nuværende nøgle holder op med at virke. Tilføj bagefter den nye offentlige nøgle til peeren.',
          removeConfirmTitle: 'Fjerne den private nøgle?',
          removeConfirmDesc:
            'WireGuard slås fra og forbliver slukket, indtil der angives en ny nøgle.'
        },
        publicKey: {
          title: 'Offentlig nøgle',
          description: 'Tilføj den til peerens konfiguration'
        },
        address: {
          title: 'Adresse',
          description: 'KVM-adresse i tunnelen og dens maske'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Offentlig nøgle',
          publicKeyDescription: 'Offentlig nøgle til den peer, du forbinder til',
          server: 'Server',
          serverDescription: 'Peerens værtsnavn eller IP-adresse',
          port: 'Port',
          portDescription: 'Peerens UDP-port, normalt 51820',
          allowedIps: "Tilladte IP'er",
          allowedIpsDescription: 'Peerens adresse eller interval i tunnelen, f.eks. 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Sekunder mellem keepalive-pakker, nødvendigt bag en router'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Få adgang til denne KVM gennem dit Tailscale-netværk',
        service: 'Tjeneste',
        performance: 'Ydeevne',
        memory: {
          title: 'Hukommelsesoptimering',
          tip: 'Holder Tailscales hukommelsesforbrug lavt, hvilket hjælper på en enhed med lidt RAM. Genstart Tailscale, for at ændringen træder i kraft.'
        },
        swap: {
          title: 'Swap-fil',
          tip: 'Hvis problemerne fortsætter efter aktivering af hukommelsesoptimering, prøv at aktivere swap-filen',
          sizeTip:
            'Det sætter filstørrelsen til 128MB; juster den under Indstillinger > System > Ydelse'
        },
        restartTitle: 'Genstart Tailscale',
        restartDesc: 'Genstarter tjenesten',
        restartBtn: 'Genstart',
        restart: 'Genstart Tailscale?',
        stopTitle: 'Stop Tailscale',
        stopBtn: 'Stop',
        stop: 'Stop Tailscale?',
        stopDesc: 'Stopper tjenesten og forhindrer, at den starter ved opstart',
        loading: 'Indlæser...',
        notInstall: 'Tailscale ikke fundet, installer det for at fuldføre opsætningen',
        install: 'Installer',
        installing: 'Installerer',
        failed: 'Installation mislykkedes',
        retry: 'Opdater siden og prøv igen, eller installer manuelt.',
        download: 'Download',
        package: 'installationspakken',
        unzip: 'og udpak den',
        upTailscale: 'Upload tailscale til NanoKVM-mappen /usr/bin/',
        upTailscaled: 'Upload tailscaled til NanoKVM-mappen /usr/sbin/',
        refresh: 'Opdater siden',
        notRunning: 'Tailscale kører ikke. Start det for at fortsætte.',
        run: 'Start',
        notLogin:
          'Enheden er ikke tilknyttet en Tailscale-konto endnu. Log ind for at fuldføre tilknytningen til din konto.',
        urlPeriod: 'Denne URL er gyldig i 10 minutter',
        login: 'Log ind',
        loginSuccess: 'Log ind lykkedes',
        deviceName: 'Enhedens navn',
        deviceIP: 'Enhedens IP',
        account: 'Konto',
        logout: 'Log ud',
        logoutDesc: 'Er du sikker på, at du vil logge ud?',
        uninstall: 'Afinstaller Tailscale',
        uninstallDesc: 'Er du sikker på, at du vil afinstallere Tailscale?',
        okBtn: 'Ja',
        cancelBtn: 'Nej'
      },
      update: {
        title: 'Opdateringer',
        currentVersion: 'Nuværende version',
        latestVersion: 'Seneste version',
        queryFailed: 'Opdateringskontrol mislykkedes',
        updateFailed: 'Opdatering fejlede',
        paranoidBlocked: 'Onlineopdateringer blokeres af firewalltilstanden Paranoid',
        paranoidBlockedDesc:
          'GitHub-kontroller og downloads kræver udgående netværksadgang. Offline upload og allerede klargjorte installationer er stadig tilgængelige.',
        available: 'En opdatering er tilgængelig. Vil du installere den?',
        updating: 'Opdatering i gang',
        confirm: 'Bekræft',
        cancel: 'Annuller',
        badge: {
          checking: 'Kontrollerer',
          latest: 'Opdateret',
          available: 'Opdatering tilgængelig',
          failed: 'Kontrol mislykkedes',
          local: 'Lokal'
        },
        application: {
          title: 'Applikation'
        },
        system: {
          queryFailed: 'Kunne ikke hente systemversion',
          appUpdateRequired:
            'Opdater programmet til {{version}}, før du installerer denne systemopdatering',
          requiredAppVersion: 'Påkrævet programversion',
          downloadFailed: 'Download eller verifikation mislykkedes',
          available: 'Der er en opdatering til basissystemet.',
          downloading: 'Downloader og verificerer systemopdatering...',
          downloadVerify: 'Download og verificer',
          installing: 'Installerer klargjort systemopdatering...',
          install: 'Installer',
          installFailed: 'Installation mislykkedes',
          installConfirmTitle: 'Installer systemopdatering?',
          installConfirmDesc:
            'Dette erstatter basissystemfiler fra den verificerede pakke. Genstart kræves.',
          rawInstallConfirmDesc:
            'Denne verificerede pakke skriver raw boot/rootfs-images til SD-kortets partitioner og genstarter automatisk. Skrivning kan tage flere minutter; hold strømmen tilsluttet.',
          rawInstallWarning:
            'Der er ingen automatisk rollback for raw partitionsopdateringer. Hvis boot fejler, gendan SD-kortet manuelt.',
          rawWaitTitle: 'Installerer systemopdatering',
          rawWaitWriting: 'Det nye system skrives til SD-kortet',
          rawWaitRestarting: 'Enheden genstarter. Denne side genindlæses, når den er tilbage.',
          rawWaitDesc:
            'Det tager omkring tre minutter. Lad strømmen være tilsluttet, og luk ikke denne side.',
          rawWaitSlow:
            'Det tager længere tid end forventet. Vent nogle minutter mere, før du afbryder strømmen.',
          rebootRequired: 'Genstart kræves for at aktivere denne systemtilstand.',
          rollingBack: 'Ruller systemopdatering tilbage...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback klargjort',
          rollbackFailed: 'Rollback mislykkedes',
          rollbackConfirmTitle: 'Rollback systemopdatering?',
          rollbackConfirmDesc:
            'Dette gendanner filer fra den seneste systemopdateringsbackup. Genstart kræves.',
          stagedDesc: 'Systemopdateringen er downloadet og verificeret, du kan installere den nu',
          refresh: 'Opdater',
          releaseNotes: 'Udgivelsesnoter',
          systemVersion: 'Systemversion',
          kernel: 'Kernel',
          stagedVersion: 'Klargjort version',
          archive: 'Arkiv',
          requiredFree: 'Påkrævet ledig plads',
          fileCount: 'Filer',
          rawImages: 'Raw images',
          progress: 'Fremdrift',
          progressMessage: 'Fremdriftsmeddelelse',
          pendingVersion: 'Afventende version',
          bootHealth: 'Bootstatus',
          healthy: 'Sund',
          unhealthy: 'Kræver opmærksomhed',
          rollbackBackup: 'Rollback-backup'
        },
        offline: {
          title: 'Upload applikationspakke',
          desc: 'Installer en applikationspakke fra denne computer. Serveren genstarter bagefter.',
          installTitle: 'Installer applikationsopdatering?',
          installDesc: 'Applikationen erstattes, og serveren genstarter. Du skal logge ind igen.'
        },
        local: {
          title: 'Upload systempakke',
          desc: 'Installer en systempakke fra denne computer. Én fil indeholder arkivet og de signerede metadata.',
          choose: 'Vælg fil',
          invalidFile: 'Vælg en pakke, der ender på .tar eller .tar.gz.',
          diskTitle: 'Slukke den virtuelle disk?',
          diskWarn:
            'Pakken gemmes på /data, som er skrivebeskyttet, mens den virtuelle disk er tændt. Når den virtuelle disk slukkes, har computeren ikke længere adgang til /data. Fortsæt?',
          uploading: 'Uploader',
          verifying: 'Verificerer og klargør pakken',
          keyTitle: 'Lokal opdateringsnøgle',
          keyDesc: 'Offentlig nøgle i PEM-format, der må signere pakker, du selv bygger',
          keyNone: 'Ingen nøgle angivet',
          keySet: 'Angiv nøgle',
          keyRemove: 'Fjern',
          signer: 'Signeret af',
          section: 'Lokale opdateringer',
          keyRequired: 'Lokal nøgle påkrævet'
        }
      },
      account: {
        title: 'Konto',
        webAccount: 'Navn på webkonto',
        password: 'Adgangskode',
        passwordDesc: 'Skift den adgangskode, der bruges til at logge ind på webgrænsefladen',
        updateBtn: 'Skift',
        logoutBtn: 'Log ud',
        logoutDesc: 'Er du sikker på, at du vil logge ud?',
        okBtn: 'Ja',
        cancelBtn: 'Nej',
        session: {
          title: 'Session'
        },
        logoutOnClose: {
          title: 'Log ud, når browseren lukkes',
          description: 'Afslut sessionen, når browseren lukkes, i stedet for at holde den åben'
        },
        totp: {
          title: 'Totrinsgodkendelse',
          authenticator: 'Godkendelsesapp',
          description: 'Kræv en tidsbaseret kode fra en godkendelsesapp ud over din adgangskode',
          required: 'Påkrævet af politik',
          disable: 'Deaktiver',
          enableTitle: 'Opsæt totrinsgodkendelse',
          enableDescription:
            'Bekræft din adgangskode for at fortsætte. Den kræves ved enhver ændring af den anden faktor.',
          continue: 'Fortsæt',
          disableTitle: 'Deaktiver totrinsgodkendelse?',
          disableDescription:
            'Din konto vil kun være beskyttet af adgangskoden. Bekræft med din adgangskode for at fortsætte.',
          disableFailed: 'Totrinsgodkendelse kunne ikke deaktiveres',
          passwordPlaceholder: 'Nuværende adgangskode',
          enrollFailed: 'Opsætningen kunne ikke startes',
          invalidCode: 'Koden passer ikke. Prøv den næste.',
          scan: 'Scan dette med din godkendelsesapp.',
          manualEntry: 'Eller indtast denne nøgle manuelt:',
          codePlaceholder: 'Indtast den 6-cifrede kode for at bekræfte',
          confirm: 'Bekræft',
          cancel: 'Annuller',
          backupTitle: 'Gem dine backupkoder nu',
          backupDescription:
            'Hver kode virker kun én gang og vises ikke igen. De er den eneste vej ind, hvis du mister din godkendelsesapp, og de virker også, når enhedens ur ikke er synkroniseret.',
          copy: 'Kopiér',
          copied: 'Backupkoder kopieret',
          savedThem: 'Jeg har gemt dem',
          remaining: '{{remaining}} backupkoder tilbage',
          clockUnsynced:
            'Enhedens ur er endnu ikke synkroniseret. Synkroniser tiden under Indstillinger > System > Tid, før du opsætter.',
          noBackupCodes:
            'Der er ingen backupkoder tilbage. Vælg Generér for at udstede et nyt sæt.',
          regenerate: 'Nye backupkoder',
          generate: 'Generér',
          regenerateTitle: 'Udsted nye backupkoder?',
          regenerateDescription:
            'Dine nuværende backupkoder holder op med at virke. Bekræft med din adgangskode for at fortsætte.',
          regenerateFailed: 'Nye backupkoder kunne ikke udstedes',
          download: 'Download',
          copyFailed: 'Kunne ikke kopiere. Markér koderne og kopiér dem manuelt.',
          requireTitle: 'Kræv totrinsgodkendelse',
          requireDescription:
            'Forhindrer, at totrinsgodkendelse deaktiveres, og en konto uden skal opsætte den, før enheden kan bruges',
          requireFailed: 'Kravet kunne ikke ændres',
          requiredTitle: 'Totrinsgodkendelse er påkrævet',
          requiredDescription:
            'Denne enhed er sat til at kræve en anden faktor, men din konto har endnu ikke opsat en. Opsæt den nu for at fortsætte.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw-assistent',
      empty: 'Beskriv en opgave for at begynde',
      inputPlaceholder: 'Beskriv, hvad du vil have PicoClaw til at gøre',
      newConversation: 'Ny samtale',
      processing: 'Behandler...',
      agent: {
        defaultTitle: 'Generel assistent',
        defaultDescription: 'Generel hjælp til chat, søgning og arbejdsområde',
        kvmTitle: 'Fjernstyring',
        kvmDescription: 'Betjen fjernværten gennem NanoKVM',
        switched: 'Agentrolle skiftet',
        switchFailed: 'Kunne ikke skifte agentrolle'
      },
      send: 'Send',
      cancel: 'Annuller',
      status: {
        connecting: 'Opretter forbindelse til gateway...',
        connected: 'PicoClaw-session tilsluttet',
        disconnected: 'PicoClaw-session lukket',
        stopped: 'Stopanmodning sendt',
        runtimeStarted: 'PicoClaw runtime startet',
        runtimeStartFailed: 'Kunne ikke starte PicoClaw runtime',
        runtimeStopped: 'PicoClaw runtime stoppet',
        runtimeStopFailed: 'Kunne ikke stoppe PicoClaw runtime'
      },
      connection: {
        runtime: {
          checking: 'Kontrol',
          ready: 'Runtime klar',
          stopped: 'Runtime stoppet',
          unavailable: 'Runtime utilgængelig',
          configError: 'Konfigurationsfejl'
        },
        transport: {
          connecting: 'Tilslutning',
          connected: 'Tilsluttet'
        },
        run: {
          idle: 'Tomgang',
          busy: 'Optaget'
        }
      },
      error: {
        lockHeld: 'PicoClaw er i brug i et andet vindue',
        takenOver: 'Et andet vindue har overtaget PicoClaw',
        authFailed: 'PicoClaw afviste forbindelsen',
        upstreamClosed: 'Forbindelsen til PicoClaw blev afbrudt'
      },
      tool: {
        screenshot: 'Tager et skærmbillede',
        loadImage: 'Ser på skærmbilledet',
        actions: 'Styrer værten',
        generic: 'Bruger {{name}}',
        type: 'Skriver {{text}}',
        hotkey: 'Trykker på {{keys}}',
        click: 'Klikker',
        doubleClick: 'Dobbeltklikker',
        move: 'Flytter musen',
        drag: 'Trækker',
        scroll: 'Ruller',
        wait: 'Venter'
      },
      message: {
        toolAction: 'Handling',
        observation: 'Observation',
        screenshot: 'Skærmbillede'
      },
      overlay: {
        locked: 'PicoClaw styrer enheden. Manuel indtastning er sat på pause.'
      },
      install: {
        install: 'Installer PicoClaw',
        installing: 'Installation af PicoClaw',
        success: 'PicoClaw installeret korrekt',
        failed: 'Kunne ikke installere PicoClaw',
        uninstalled: 'PicoClaw blev afinstalleret',
        uninstallFailed: 'Afinstallation mislykkedes',
        requiredTitle: 'PicoClaw er ikke installeret',
        requiredDescription: 'Installer PicoClaw før start af PicoClaw runtime.',
        progressDescription: 'PicoClaw bliver downloadet og installeret.',
        stages: {
          preparing: 'Forberedelse',
          downloading: 'Downloader',
          extracting: 'Udpakning',
          verifying: 'Bekræfter',
          installing: 'Installerer',
          installed: 'Installeret',
          install_timeout: 'Timeout',
          install_failed: 'Mislykkedes'
        }
      },
      model: {
        requiredTitle: 'Modelkonfiguration er påkrævet',
        requiredDescription: 'Konfigurer PicoClaw-modellen, før du bruger PicoClaw chat.',
        docsTitle: 'Konfigurationsvejledning',
        docsDesc: 'Understøttede modeller og protokoller',
        menuLabel: 'Konfigurer model',
        modelIdentifier: 'Modelidentifikator',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API-basis-URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API-nøgle',
        apiKeyPlaceholder: 'Indtast modellens API-nøgle',
        apiKeyKeepPlaceholder: 'Lad feltet stå tomt for at beholde den nuværende nøgle',
        save: 'Gem',
        saving: 'Gemmer',
        saved: 'Modelkonfiguration gemt',
        saveFailed: 'Kunne ikke gemme modelkonfigurationen',
        invalid: 'Model-id, API-basis-URL og API-nøgle er påkrævet'
      },
      uninstall: {
        confirmTitle: 'Afinstaller PicoClaw',
        confirmContent:
          'Er du sikker på, at du vil afinstallere PicoClaw? Dette vil slette den eksekverbare fil og alle konfigurationsfiler.',
        confirmOk: 'Afinstaller'
      },
      history: {
        title: 'Historik',
        loading: 'Indlæser sessioner...',
        emptyTitle: 'Ingen historik endnu',
        emptyDescription: 'Tidligere PicoClaw sessioner vil blive vist her.',
        loadFailed: 'Kunne ikke indlæse sessionshistorikken',
        deleteFailed: 'Kunne ikke slette session',
        deleteConfirmTitle: 'Slet session',
        deleteConfirmContent: 'Er du sikker på, at du vil slette "{{title}}"?',
        deleteConfirmOk: 'Slet',
        messageCount_one: '{{count}} besked',
        messageCount_other: '{{count}} beskeder'
      },
      config: {
        startRuntime: 'Start PicoClaw',
        stopRuntime: 'Stop PicoClaw',
        stopConfirm: 'Stop PicoClaw?'
      },
      start: {
        title: 'Start PicoClaw',
        description: 'Start runtime for at begynde at bruge PicoClaw-assistenten.'
      }
    },
    error: {
      title: 'Vi er stødt på et problem',
      refresh: 'Opdater'
    },
    fullscreen: {
      toggle: 'Skift fuldskærm'
    },
    menu: {
      collapse: 'Skjul menu'
    }
  }
};

export default da;
