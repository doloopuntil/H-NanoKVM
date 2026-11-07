const nb = {
  translation: {
    common: {
      confirm: 'Bekreft',
      cancel: 'Avbryt',
      save: 'Lagre',
      discard: 'Forkast',
      delete: 'Slett',
      actionFailed: 'Handlingen mislyktes',
      loading: 'Laster innstillinger fra enheten...',
      loadFailed: 'Kunne ikke laste innstillinger fra enheten',
      retry: 'Prøv igjen'
    },
    head: {
      desktop: 'Eksternt skrivebord',
      login: 'Logg inn',
      firstSetup: 'Første oppsett',
      changePassword: 'Endre passord',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Logg inn',
      placeholderUsername: 'Brukernavn',
      placeholderPassword: 'Passord',
      placeholderPassword2: 'Oppgi passord igjen',
      noEmptyUsername: 'Brukernavn påkrevd',
      noEmptyPassword: 'Passord påkrevd',
      invalidUser: 'Ugyldig brukernavn eller passord',
      locked: 'For mange pålogginger, vennligst prøv igjen senere',
      globalLocked: 'System under beskyttelse, prøv igjen senere',
      error: 'Uventet feil',
      changePassword: 'Endre passord',
      changePasswordDesc:
        'For sikkerheten til enheten, vennligst endre passordet ditt for web-innlogging',
      differentPassword: 'Passordene er ikke like',
      illegalUsername: 'Brukernavn inneholder tegn som ikke er tillat',
      illegalPassword:
        'Passordet må være minst 8 tegn og kan ikke inneholde anførselstegn eller skråstreker',
      forgetPassword: 'Glemt passord',
      ok: 'Ok',
      cancel: 'Avbryt',
      loginButtonText: 'Logg inn',
      setupTitle: 'Opprett administratorkonto',
      setupDescription:
        'Det finnes ingen webkonto på denne enheten ennå. Opprett den første administratorkontoen for å fortsette.',
      setupRecovery:
        'Hvis dette passordet mistes, krever gjenoppretting at SD-kortet skrives på nytt',
      setupButtonText: 'Opprett konto',
      tips: {
        hardenedRecovery:
          'Dette Hardened-imaget støtter ikke passordtilbakestilling med BOOT-knappen. Hvis passordet mistes, skriv SD-kortet på nytt og opprett en ny konto.',
        change1: 'Merk at denne handlingen endrer følgende passord:',
        change2: 'Passord for webinnlogging',
        change3: 'Systemets root-passord for SSH-innlogging'
      },
      placeholderCurrentPassword: 'Nåværende passord',
      placeholderNewPassword: 'Nytt passord',
      wrongCurrentPassword: 'Det nåværende passordet er feil',
      totp: {
        title: 'Tofaktorautentisering',
        prompt: 'Skriv inn den 6-sifrede koden fra autentiseringsappen din',
        backupPrompt: 'Skriv inn en av reservekodene dine',
        noEmptyCode: 'Skriv inn en kode',
        placeholderCode: '6-sifret kode',
        placeholderBackup: 'Reservekode',
        verifyButtonText: 'Bekreft',
        useBackupCode: 'Bruk en reservekode',
        useAuthenticator: 'Bruk kode fra autentiseringsappen',
        cancel: 'Tilbake',
        invalidCode: 'Koden er ugyldig. Prøv igjen.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Konfigurer Wi-Fi for NanoKVM',
      success: 'Gå til enheten og kontroller nettverksstatusen til NanoKVM',
      failed: 'Operasjonen mislyktes, prøv igjen',
      invalidMode:
        'Gjeldende modus støtter ikke nettverksoppsett. Gå til enheten din og aktiver Wi-Fi konfigurasjonsmodus.',
      confirmBtn: 'Ok',
      finishBtn: 'Ferdig',
      ap: {
        authTitle: 'Autentisering kreves',
        authDescription: 'Vennligst skriv inn AP-passordet for å fortsette',
        authFailed: 'Ugyldig AP passord',
        passPlaceholder: 'AP-passord',
        verifyBtn: 'Bekreft'
      }
    },
    screen: {
      scale: 'Skala',
      title: 'Skjerm',
      video: 'Videomodus',
      videoDirectTips:
        'Aktiver HTTPS under "Innstillinger > Nettverk > Tjenester" for å bruke denne modusen',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC er deaktivert i brannmurmodusene Begrenset og Paranoid',
      transferRunningTitle: 'Bildeoverføring pågår',
      transferRunningDesc:
        'Hvis du bytter videomodus, lastes siden på nytt, og pågående opplasting eller nedlasting av bildet avbrytes.',
      transferRunningOk: 'Bytt modus',
      resolution: 'Oppløsning',
      auto: 'Automatisk',
      autoTips:
        'Skjermriving eller peker-forskyvning kan oppstå ved enkelte oppløsninger, så juster den eksterne vertens oppløsning eller skru av automatisk modus',
      fps: 'FPS',
      customizeFps: 'Tilpass',
      quality: 'Kvalitet',
      qualityLossless: 'Tapsfri',
      qualityHigh: 'Høy',
      qualityMedium: 'Middels',
      qualityLow: 'Lav',
      frameDetect: 'Bildefrekvensoppdagelse',
      frameDetectTip:
        'Sammenligner bilder og stopper videooverføringen så lenge den eksterne vertens skjerm ikke endres',
      resetHdmi: 'Tilbakestill HDMI',
      webrtcConnectionFailed: {
        title: 'WebRTC-tilkobling mislyktes',
        description: 'Kontroller nettverkstilkoblingen eller bytt videomodus'
      },
      captureStatus: {
        hdmiError: 'HDMI-skjermfeil',
        unsupportedResolution: 'Gjeldende oppløsning støttes ikke',
        retrieving: 'Henter skjermbilde...',
        changingResolution: 'Bytter oppløsning...',
        updateFailed: 'Skjermen kan ikke oppdateres akkurat nå',
        videoError: 'Feil ved videovisning',
        noHdmi: 'Ingen HDMI-signal oppdaget',
        unavailable: 'Skjermen kan ikke vises akkurat nå'
      }
    },
    keyboard: {
      title: 'Tastatur',
      paste: 'Lim inn',
      tips: 'Kun vanlige tegn på tastatur er støttet',
      placeholder: 'Tekst som skal limes inn',
      local: 'Mobilt tastatur',
      virtual: 'Skjermtastatur',
      readClipboard: 'Les fra utklippstavlen',
      clipboardPermissionDenied:
        'Tillatelse til utklippstavlen nektet, tillat tilgang i nettleseren din',
      clipboardReadError: 'Kunne ikke lese utklippstavlen',
      dropdownEnglish: 'Engelsk',
      dropdownGerman: 'Tysk',
      dropdownFrench: 'Fransk',
      dropdownRussian: 'Russisk',
      dropdownKorean: 'Koreansk',
      dropdownJapanese: 'Japansk',
      localInput: 'Inndata fra mobiltastatur',
      shortcut: {
        title: 'Snarveier',
        custom: 'Egendefinert',
        capture: 'Klikk her for å ta en snarvei',
        clear: 'Tøm',
        save: 'Lagre',
        captureTips:
          'Registrering av systemtaster, som Windows-tasten, krever fullskjermtillatelse',
        enterFullScreen: 'Veksle fullskjermmodus'
      },
      leaderKey: {
        title: 'Leader-tast',
        desc: 'Omgå nettleserrestriksjoner og send systemsnarveier direkte til den eksterne verten',
        howToUse: 'Hvordan bruke',
        simultaneous: {
          title: 'Samtidig modus',
          desc1: 'Hold Leader-tasten inne, og trykk deretter på snarveien.',
          desc2: 'Intuitivt, men kan komme i konflikt med systemsnarveier.'
        },
        sequential: {
          title: 'Sekvensiell modus',
          desc1:
            'Trykk på Leader-tasten → trykk på snarveien i rekkefølge → trykk på Leader-tasten igjen.',
          desc2: 'Krever flere trinn, men unngår fullstendig systemkonflikter.'
        },
        enable: 'Aktiver Leader-tast',
        tip: 'Når denne tasten er tilordnet som Leader-tast, fungerer den bare som snarveisutløser og mister standardoppførselen.',
        placeholder: 'Trykk på Leader-tasten',
        shiftRight: 'Høyre Shift',
        ctrlRight: 'Høyre Ctrl',
        metaRight: 'Høyre Win',
        recorder: {
          rec: 'REC',
          activate: 'Aktiver taster',
          input: 'Trykk på snarveien'
        }
      }
    },
    mouse: {
      title: 'Mus',
      cursor: 'Markørstil',
      default: 'Vanlig',
      cell: 'Celle',
      text: 'Tekst',
      grab: 'Grip',
      hide: 'Skjul',
      mode: 'Modus',
      absolute: 'Absolutt',
      relative: 'Relativ',
      direction: 'Rullehjulretning',
      scrollUp: 'Rull opp',
      scrollDown: 'Rull ned',
      speed: 'Rullehjulhastighet',
      sensitivity: 'Pekerhastighet',
      sensitivityDesc:
        'For relativ desktopmodus: lavere verdier reduserer drift fra museakselerasjon på verten',
      fast: 'Rask',
      slow: 'Sakte',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Beveg hvor som helst i KVM-området; fjernpekeren beholder posisjonen mellom berøringer og holdes synkronisert med absolutt HID'
      },
      requestPointer: 'Bruker relativ modus, klikk på skrivebordet for å vise musepekeren',
      resetHid: 'Gjenopprett HID',
      hidOnly: {
        title: 'HID-Only-modus',
        desc: 'Hvis musen eller tastaturet slutter å svare og det ikke hjelper å tilbakestille HID, kan det være et kompatibilitetsproblem mellom NanoKVM og verten.',
        tip1: 'Når HID-Only-modus aktiveres, avmonteres den virtuelle disken og det virtuelle nettverket',
        tip2: 'I HID-Only-modus er montering av bilder deaktivert',
        tip3: 'NanoKVM vil automatisk starte på nytt etter bytte av modus',
        enable: 'Aktiver HID-Only-modus',
        disable: 'Deaktiver HID-Only-modus'
      }
    },
    image: {
      title: 'Bilder',
      loading: 'Laster...',
      empty: 'Ingen funnet',
      mountMode: 'Monter som',
      massStorage: 'Masselagring',
      cdRom: 'CD-ROM',
      mountFailed: 'Montering feilet',
      mountDesc:
        'På noen systemer er det nødvendig å koble fra den virtuelle disken på den eksterne verten før man kan montere arkivfilen',
      diskOnWarn:
        'Når bildet monteres, slås den virtuelle disken av, slik at datamaskinen ikke lenger får tilgang til /data. Fortsette?',
      diskOffWarn:
        'Den virtuelle disken er av og må aktiveres for å montere bildet. USB-enhetene på datamaskinen registreres på nytt. Fortsette?',
      unmountFailed: 'Avmontering mislyktes',
      unmountDesc:
        'På noen systemer må du manuelt løse ut fra den eksterne verten før du demonterer bildet',
      forceEject: 'Løs ut med tvang',
      forceEjectConfirm:
        'Verten har låst den optiske stasjonen. Tvungen utløsing kobler den virtuelle USB-enheten fra et øyeblikk, så tastaturet og musen kan bli koblet fra en kort stund. Vil du fortsette?',
      usbReconnect: 'Koble til USB på nytt',
      usbReconnectConfirm:
        'Koble USB-gadgeten til på nytt bare hvis den eksterne verten ikke oppdaget medieendringen. Tastatur og mus kan kobles fra kort.',
      usbReconnectSuccess: 'USB koblet til på nytt',
      usbReconnectFailed: 'USB-tilkobling mislyktes',
      addImage: 'Legg til bilde',
      fromUrl: 'Fra URL',
      fromFile: 'Fra fil',
      turnOff: 'Slå av',
      eject: 'Løs ut',
      download: 'Last ned',
      upload: 'Last opp',
      mountTitle: 'Monter bilde',
      deleteTitle: 'Slett bilde',
      deleteConfirm: 'Er du sikker på at du vil slette dette bildet?',
      tips: {
        title: 'Hvordan laste opp',
        usb1: 'Koble til NanoKVM-enheten til din datamaskin med USB.',
        usb2: 'Sørg for at den virtuelle disken er montert under Innstillinger > Enhet > Virtuell disk.',
        usb3: 'Åpne den virtuelle disken på datamaskinen din og kopier arkivfilen til rot-mappen på den virtuelle disken.',
        scp1: 'Sikre at NanoKVM-enheten og datamaskinen din er tilkoblet det samme lokale nettverket.',
        scp2: 'Åpne en terminal på datamaskinen din og bruk SCP-kommandoen til å laste opp arkivfilen til mappen /data på NanoKVM-enheten.',
        scp3: 'Eksempel: scp sti-til-din-arkivfil root@din-nanokvm-ip:/data',
        tfCard: 'SD-kort',
        tf1: 'Denne metoden er støttet på datamskiner med Linux',
        tf2: 'Ta SD-kortet ut av NanoKVM-enheten. På FULL-versjonen må du demontere kabinettet først.',
        tf3: 'Sett inn SD-kortet i en kortleser og koble den til datamaskinen din.',
        tf4: 'Kopiér arkivfilen til mappen /data på SD-kortet.',
        tf5: 'Sett inn SD-kortet i NanoKVM-enheten.'
      }
    },
    script: {
      title: 'Skript',
      upload: 'Last opp',
      run: 'Kjør',
      runBackground: 'Kjør i bakgrunnen',
      runFailed: 'Kjøring feilet',
      delDesc: 'Er du sikker på at du vil slette denne filen?',
      delete: 'Slett',
      close: 'Lukk',
      unlockDesc:
        'Skript kjøres som root på NanoKVM. Skriv inn passordet til nettkontoen for å laste opp eller kjøre et skript.',
      terminalRequired:
        'Skript krever tilgang til nettterminalen. Aktiver terminalen i innstillingene først.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'NanoKVM-terminal',
      serial: 'Terminal for seriell port',
      unlockTitle: 'Lås opp terminal',
      unlockDesc: 'Skriv inn passordet til webkontoen for å starte en terminaløkt',
      unlock: 'Lås opp',
      unlockFailed: 'Klarte ikke å låse opp terminalen',
      invalidCredentials: 'Ugyldig brukernavn eller passord',
      locked: 'For mange forsøk, prøv igjen senere',
      sessionClosed: 'Terminaløkten ble lukket. Lås opp igjen for å koble til.',
      sessionError: 'Terminaltilkobling mislyktes. Lås opp igjen for å prøve.',
      serialPort: 'Seriell port',
      serialPortPlaceholder: 'For eksempel /dev/ttyS1',
      baudrate: 'Baud-rate',
      parity: 'Paritet',
      parityNone: 'Ingen',
      parityEven: 'Lik',
      parityOdd: 'Ulik',
      flowControl: 'Strømningskontroll',
      flowControlNone: 'Ingen',
      flowControlSoft: 'Programvare',
      flowControlHard: 'Maskinvare',
      dataBits: 'Databiter',
      stopBits: 'Stoppbiter',
      open: 'Åpne terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Sender kommando...',
      sent: 'Kommando sendt',
      input: 'MAC-adresse',
      ok: 'OK'
    },
    download: {
      input: 'URL til eksternt bilde',
      ok: 'OK',
      disabled:
        'Bilder kan ikke lastes ned eller lastes opp akkurat nå fordi lagringen ikke er skrivbar. Hvis et bilde er montert, må du avmontere det og deretter slå av den virtuelle disken slik at lagringen blir skrivbar igjen.',
      diskShared: 'Slå av den virtuelle disken for å bruke bildenedlastingen',
      mountedImage:
        'Dette diskavbildet er montert, avmonter det før du laster opp en fil med samme navn',
      diskOff: 'Slå av den virtuelle disken',
      uploadbox: 'Slipp filen her eller klikk for å velge',
      inputfile: 'Bildefil',
      NoISO: 'Ingen image',
      complete: 'Nedlasting fullført',
      uploadComplete: 'Opplasting fullført',
      downloading: 'Laster ned',
      uploading: 'Laster opp',
      failed: 'Overføring mislyktes',
      uploadFailed: 'Opplasting mislyktes',
      stalled: 'Overføringen stoppet, kontroller tilkoblingen og prøv igjen',
      canceled: 'Opplasting avbrutt',
      downloadCanceled: 'Nedlasting avbrutt',
      cancel: 'Avbryt',
      remoteDisabled: 'Ekstern ISO-nedlasting er deaktivert i Innstillinger > Bruker > Preferanser',
      remoteFailed: 'Ekstern ISO-nedlasting mislyktes',
      sha256: 'Valgfri SHA-256-sjekksum',
      sha256Placeholder: 'Skriv inn en SHA-256-kontrollsum på 64 tegn',
      invalidSHA256: 'SHA-256 må være en heksadesimal streng på 64 tegn',
      checksumFailed: 'Nedlasting mislyktes: SHA-256-verifisering mislyktes'
    },
    power: {
      title: 'På-knapp',
      showConfirm: 'Bekreftelse',
      showConfirmTip: 'Strømdrift krever en ekstra bekreftelse',
      reset: 'Reset-knapp',
      powerShort: 'På-knapp: kort trykk',
      powerLong: 'På-knapp: langt trykk',
      resetConfirm: 'Utføre tilbakestilling?',
      powerConfirm: 'Utføre strømoperasjonen?',
      okBtn: 'Ja',
      cancelBtn: 'Nei'
    },
    settings: {
      title: 'Innstillinger',
      about: {
        title: 'Om',
        information: 'Informasjon',
        ip: 'IP-adresse',
        mdns: 'Lokal adresse',
        application: 'Applikasjonsversjon',
        uptime: 'Oppetid',
        community: 'Fellesskap',
        credit: 'Bygget på <a1>NanoKVM</a1> fra Sipeed og <a2>Hardened NanoKVM</a2> av woffko',
        hostname: 'Enhetsnavn',
        changeIn: 'Endres i {{path}}',
        updateIn: 'Oppdateres i {{path}}',
        toggleIn: 'Slås på eller av i {{path}}'
      },
      appearance: {
        title: 'Preferanser',
        display: 'Skjerm',
        language: 'Språk',
        languageDesc: 'Velg språket for grensesnittet',
        webTitle: 'Netttittel',
        webTitleDesc: 'Tilpass nettsidetittelen',
        layoutMode: 'Grensesnittoppsett',
        layoutModeDesc: 'Bruk telefon-/berøringsoppsett i denne nettleseren',
        layoutAuto: 'Automatisk',
        layoutMobile: 'Telefon',
        menuBar: {
          title: 'Menylinje',
          mode: 'Visningsmodus',
          modeDesc: 'Vis menylinje på skjermen',
          modeOff: 'Av',
          modeAuto: 'Skjul automatisk',
          modeAlways: 'Alltid synlig',
          keyboardLedStatus: 'Indikatorer for tastaturlås',
          keyboardLedStatusDesc:
            'Vis Num Lock-, Caps Lock- og Scroll Lock-status for den eksterne datamaskinen',
          icons: 'Undermenyikoner',
          iconsDesc: 'Vis undermenyikoner i menylinjen',
          terminalWarningTitle: 'Aktivere webterminal?',
          terminalWarningDesc:
            'Terminalen åpner et root-shell i nettleseren. Aktiver bare på et klarert nettverk og slå av når du er ferdig.',
          terminalWarningConfirm: 'Aktiver',
          remoteDownload: 'Last ned ekstern ISO',
          remoteDownloadWarningTitle: 'Aktivere ekstern ISO-nedlasting?',
          remoteDownloadWarningDesc:
            'NanoKVM henter en ISO fra en URL og skriver den til /data. Aktiver bare for klarerte URL-er og slå av når du er ferdig.',
          remoteDownloadWarningConfirm: 'Aktiver'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Status for låser på eksternt tastatur',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'På',
        off: 'Av',
        unknown: 'Ukjent'
      },
      device: {
        title: 'Enhet',
        minutes: 'min',
        sections: {
          general: 'Generelt',
          connectivity: 'Tilkobling',
          hostConnection: 'Vertstilkobling',
          inputOutput: 'Inndata og utdata'
        },
        oled: {
          title: 'OLED-tidsavbrudd',
          description: 'Slå av OLED-skjermen etter',
          keepOn: 'Hold OLED på',
          keepOnDescription: 'Slå aldri av OLED-skjermen'
        },
        ssh: {
          description: 'Aktiver SSH ekstern tilgang',
          tip: 'Angi et sterkt passord under Konto > Passord før du aktiverer dette alternativet'
        },
        swap: {
          title: 'Swap',
          description: 'Bruk en byttefil når minnet begynner å ta slutt',
          size: 'Swap-størrelse',
          sizeDescription: 'Angi størrelsen på byttefilen',
          tip: 'Aktivering av denne funksjonen kan forkorte SD-kortets brukbare levetid'
        },
        mouseJiggler: {
          title: 'Mus-jiggler',
          description: 'Hindre den eksterne verten fra å sove',
          disable: 'Deaktiver',
          absolute: 'Absolutt modus',
          relative: 'Relativ modus'
        },
        sessionLock: {
          title: 'Lås økt ved inaktivitet',
          description: 'Krev innlogging igjen etter denne tiden'
        },
        mdns: {
          description: 'Aktiver mDNS oppdagelsestjeneste',
          tip: 'Gjør at enheten kan nås med .local-navnet. Ikke nødvendig hvis du kobler til med IP-adresse eller DNS-en din allerede løser vertsnavnet.'
        },
        hdmi: {
          description: 'Aktiver HDMI/skjermutgang',
          idleTimeoutTitle: 'Tidsavbrudd for inaktivt opptak',
          idleTimeoutDescription: 'Stopp HDMI-opptak etter at det ikke har vært aktive seere i'
        },
        hidOnly: 'HID-Only-modus',
        hidOnlyDesc:
          'Forbedrer kompatibiliteten med verten hvis musen eller tastaturet slutter å svare',
        hidOnlyTip:
          'HID-Only-modus slutter å emulere virtuelle enheter og beholder bare grunnleggende HID-kontroll',
        disk: 'Virtuell disk',
        diskDesc: 'Monter SD-kortet på den eksterne verten',
        diskLocked: 'Av mens et bilde er montert, og aktivering avbryter monteringen',
        diskEnable: 'Aktiver virtuell disk',
        networkChange: 'Endre virtuelt nettverk',
        diskCancelMount:
          'Hvis du aktiverer den virtuelle disken, avbrytes det monterte bildet. Fortsette?',
        networkCancelMount:
          'Hvis du endrer det virtuelle nettverket, startes USB-tilkoblingen på nytt. Dette avbryter det monterte bildet og aktiverer den virtuelle disken. Fortsette?',
        diskTransferRunning:
          'En bildeoverføring pågår. Vent til den er ferdig før du aktiverer den virtuelle disken.',
        network: 'Virtuelt nettverk',
        networkDesc: 'Monter virtuelt nettverkskort på den eksterne verten',
        usbWakeup: 'USB-vekking',
        usbWakeupDesc: 'Tillat tastatur- eller musehendelser å vekke den eksterne verten',
        usbWakeupTip: 'Slå av hvis verten logger gjentatte USB wakeup-meldinger',
        hostname: {
          description: 'Enhetens navn på nettverket',
          reachable: 'Kan nås på det lokale nettverket som {{address}}'
        },
        rebootRequired: 'Omstart kreves',
        rebootPending: 'Omstart kreves for: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Systemoppdatering'
        },
        reboot: 'Start på nytt',
        rebootDesc: 'Er du sikker på at du vil starte NanoKVM på nytt?',
        poweroff: 'Slå av',
        poweroffDesc:
          'Er du sikker på at du vil slå av NanoKVM? Den kan ikke nås før den slås på igjen.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Tilkobling',
        configuration: 'Konfigurasjon',
        wifi: {
          title: 'Wi-Fi',
          description: 'Konfigurer Wi-Fi',
          apMode: 'AP-modus er aktivert, koble til Wi-Fi ved å skanne QR-koden',
          connect: 'Koble til Wi-Fi',
          connectDesc1: 'Skriv inn nettverkets SSID og passord',
          disconnect: 'Er du sikker på at du vil koble fra nettverket?',
          disconnectBtn: 'Koble fra',
          connected: 'Tilkoblet',
          ssid: 'Navn',
          password: 'Passord',
          joinBtn: 'Koble til',
          cancelBtn: 'Avbryt'
        },
        tls: {
          description: 'Aktiver HTTPS-protokoll',
          tip: 'Merk: Bruk av HTTPS kan øke forsinkelsen, spesielt i MJPEG-videomodus',
          restartTitle: 'Serveren starter på nytt',
          restartDesc:
            'Protokollendringen starter serveren på nytt. Nettleseren bytter til den nye adressen etter {{seconds}} sekunder:',
          restartOk: 'Bruk og start på nytt',
          confirmTitle: 'Beholde den nye protokollen?',
          confirmDesc:
            'Serveren kjører nå på {{protocol}}. Den går tilbake til forrige protokoll om {{seconds}} sekunder med mindre du beholder den.',
          confirmKeep: 'Behold',
          confirmRevert: 'Gå tilbake',
          reverting:
            'Går tilbake til forrige protokoll. Nettleseren bytter til den adressen etter {{seconds}} sekunder.',
          certTitle: 'Beholde det nye sertifikatet?',
          certDesc:
            'Serveren bruker nå det nye sertifikatet. Den går tilbake til det forrige om {{seconds}} sekunder med mindre du beholder det.',
          certReverted: 'Det forrige sertifikatet er tilbake'
        },
        trustedProxies: {
          section: 'Omvendt proxy',
          title: 'Klarerte proxyer',
          description: 'Omvendte proxyer som enheten stoler på for klientens adresse og protokoll',
          tip: 'En adresse i listen velger klientadressen som innloggingsgrensen og loggen registrerer, så ta bare med proxyer du selv styrer',
          none: 'Ingen',
          edit: 'Rediger',
          editRow: 'Rediger listen',
          editTitle: 'Rediger klarerte proxyer',
          editDescription: 'Å endre listen krever passordet ditt',
          dialogDescription:
            'Skriv inn adressen til hver omvendte proxy slik denne enheten ser den, eller et område som 10.0.0.0/24. En proxy i listen forteller enheten hvilken klientadresse og hvilken protokoll som skal brukes. Alt den videresender blir trodd, så ta bare med proxyer du selv styrer.'
        },
        certificate: {
          title: 'Sertifikat',
          desc: 'Hvor HTTPS-sertifikatet kommer fra',
          requesting: 'Ber om sertifikatet',
          selfSigned: 'Selvsignert',
          domain: 'Domene',
          domainDesc: 'Må peke til denne enheten, og port 443 må kunne nås fra internett',
          domainTailscale: 'Satt av Tailscale for denne enheten',
          domainInvalid: 'Bruk et fullt domenenavn, for eksempel kvm.example.org',
          email: 'E-post',
          emailDesc: "Valgfritt, for varsler fra Let's Encrypt",
          emailInvalid: 'Bruk en adresse som navn@example.org',
          validUntil: 'Gyldig til',
          valid: 'Gyldig',
          expiresSoon: 'Utløper snart',
          expired: 'Utløpt',
          lastRenewal: 'Siste fornyelse',
          renewed: 'Fornyet',
          failed: 'Mislyktes',
          renewNow: 'Forny nå',
          renewNowDesc: 'Be om et nytt sertifikat uten å vente',
          renewBtn: 'Forny',
          applyTitle: 'Endre sertifikat',
          applyOk: 'Bruk',
          applyAcme:
            "Enheten ber Let's Encrypt om et sertifikat. Let's Encrypt kobler til port 443 fra internett for å kontrollere det, noe som kan ta opptil ett minutt. Hvis forespørselen mislykkes, brukes det nåværende sertifikatet fortsatt.",
          applyTailscale:
            'Enheten henter et sertifikat fra Tailscale, noe som kan ta opptil ett minutt. Hvis forespørselen mislykkes, brukes det nåværende sertifikatet fortsatt.',
          applySelfSigned:
            'Enheten går tilbake til sitt eget selvsignerte sertifikat. Nettlesere advarer om det.',
          openTitle: 'Åpne den nye adressen',
          openDesc:
            'Sertifikatet er klart. Åpne adressen nedenfor og logg inn for å beholde det. Uten bekreftelse fra deg innen 3 minutter kommer det forrige sertifikatet tilbake.',
          openOk: 'Åpne',
          blockedClock: 'Sertifikater kan ikke ber om før enhetens klokke er synkronisert',
          blockedParanoid: 'Brannmurmodusen Paranoid blokkerer sertifikatforespørsler',
          tailscaleUnavailable:
            'Tailscale kjører ikke, eller HTTPS-sertifikater er ikke aktivert for tailnettet'
        },
        dns: {
          title: 'DNS',
          description: 'Konfigurer DNS-servere for NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Konfigurer IPv4-adressering for det kablede grensesnittet',
          servers: 'Servere',
          dhcp: 'DHCP',
          manual: 'Manuell',
          apply: 'Bruk',
          invalid: 'Skriv inn en gyldig IPv4- eller IPv6-adresse',
          invalidNetwork: 'Skriv inn en gyldig IPv4-adresse, subnettmaske og ruter',
          saved: 'DNS-innstillinger lagret',
          redirecting: 'Nettverksinnstillinger lagret. Åpner den nye adressen...',
          saveFailed: 'Kunne ikke lagre DNS-innstillinger',
          unsaved: 'Ulagrede endringer',
          maxServers: 'Maksimalt {{count}} DNS-servere er tillatt',
          dhcpServersDescription: 'DNS-servere hentes automatisk fra DHCP',
          manualServersDescription: 'IPv4- og IPv6-servere støttes',
          interface: 'Grensesnitt',
          ipAddress: 'IP-adresse',
          subnetMask: 'Subnettmaske',
          router: 'Ruter'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Konfigurer IPv6-adressering for kablet grensesnitt',
          disabled: 'Deaktivert',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manuelt',
          interface: 'Grensesnitt',
          state: 'Tilstand',
          router: 'Ruter',
          addresses: 'Adresser',
          dhcpv6Client: 'DHCPv6-klient',
          notInstalled: 'Ikke installert',
          ipAddress: 'IPv6-adresse',
          prefix: 'Prefiks',
          invalidManual: 'Angi en gyldig IPv6-adresse, prefiks og ruter',
          clientMissing:
            'DHCPv6-klienten er ikke installert. Installer først den matchende raw-systemoppdateringen.',
          saved: 'IPv6-innstillinger lagret',
          saveFailed: 'Kunne ikke lagre IPv6-innstillinger',
          unsaved: 'Ulagrede endringer'
        }
      },
      system: {
        title: 'System',
        performance: {
          processor: 'Prosessor',
          overdrive: {
            title: 'Overklokking',
            description:
              'Start med den høyere klokkehastigheten for prosessor og video som produsenten har spesifisert',
            tip: 'Hvis enheten ikke starter med overklokking, må SD-kortet flashes på nytt',
            unavailable: 'Ikke med i dette systembildet',
            keepTitle: 'Behold overdrive etter oppdateringer',
            keepDescription:
              'En systemoppdatering setter enheten tilbake til standardklokkene med mindre dette er slått på',
            confirmTitle: 'Slå på overklokking?',
            confirmText:
              'Hvis enheten ikke starter med overklokking, må du flashe SD-kortet på nytt for å gjenopprette den. Endringen gjelder etter neste omstart.',
            confirmOk: 'Aktiver'
          },
          watchdog: {
            title: 'Maskinvare-watchdog',
            description: 'Start enheten på nytt automatisk når den slutter å svare',
            unavailable: 'Ikke inkludert i dette systembildet',
            notRunning: 'Kjører ikke for øyeblikket',
            lastRestart: 'Siste omstart',
            lastRestartCaption: 'Siste årsak til at systemet startet på nytt',
            reasonPowerOn: 'Strøm på',
            reasonRestart: 'Omstart forespurt',
            reasonWatchdog: 'Watchdog-tilbakestilling',
            reasonOverheat: 'Overopphetingsvern',
            reasonUnknown: 'Ukjent'
          },
          recovery: 'Gjenoppretting',
          memory: 'Minne'
        },
        monitor: {
          processorClock: 'CPU-delsystem',
          videoClock: 'Videodelsystem',
          videoClockCaption: 'Videoklokkefrekvens',
          cpuClockCaption: 'CPU-klokkefrekvens',
          overdrive: 'Overklokking',
          temperature: 'Temperatur',
          lastMinutes: 'Siste 5 minutter',
          ram: 'RAM',
          off: 'Av',
          ramHistory: 'RAM-bruk',
          cpuLoad: 'CPU-belastning',
          cpuLoadCaption: 'Bruker {{user}} prosent, system {{system}} prosent',
          cpuUtilization: 'CPU-utnyttelse',
          swapUtilization: 'Swap-utnyttelse',
          swapSizeLastMinutes: '{{size}}, siste 5 minutter',
          percent: '{{percent}} prosent',
          percentUsed: '{{percent}} prosent brukt',
          sizeOf: '{{used}} av {{total}}',
          systemPartition: 'Systempartisjon',
          dataPartition: 'Datapartisjon',
          unavailable: 'Ikke tilgjengelig',
          noReadings: 'Enheten returnerer ingen målinger',
          refresh: 'Oppdateres hvert sekund mens denne siden er åpen'
        },
        sections: {
          time: 'Tid',
          firewall: 'Brannmur',
          systemLog: 'Logging',
          performance: 'Ytelse',
          monitor: 'Overvåking',
          services: 'Tjenester',
          webInterface: 'Sikker nettilgang'
        },
        time: {
          saveFailed: 'Kunne ikke lagre tidsinnstillinger',
          saved: 'Tidsinnstillinger lagret',
          syncFailed: 'Kunne ikke synkronisere tid',
          synced: 'Tid synkronisert',
          invalidServers: 'Angi minst én NTP-server',
          maxServers: 'Maksimalt {{count}} NTP-servere tillatt',
          refresh: 'Oppdater',
          syncNow: 'Synkroniser',
          syncNowDesc: 'Still klokken fra NTP-tjenerne nå',
          save: 'Lagre',
          ntp: {
            title: 'NTP',
            description: 'Synkroniser enhetens tid fra konfigurerte NTP-servere'
          },
          networkTime: 'Nettverkstid',
          clock: {
            title: 'Klokke',
            description: 'Angi lokal tidssone som brukes av logger og UI',
            current: 'Gjeldende tid',
            timezone: 'Tidssone'
          },
          servers: {
            title: 'NTP-servere',
            description:
              'Bruk standard offentlige servere, din lokale ruter eller egne NTP-servere',
            useRouter: 'Bruk ruter',
            useDefaults: 'Bruk standarder',
            presets: 'Serverforvalg',
            presetsDesc: 'Erstatt serverlisten med et forvalg'
          }
        },
        firewall: {
          saveFailed: 'Kunne ikke bruke brannmurinnstillinger',
          saved: 'Brannmurinnstillinger brukt',
          cancel: 'Avbryt',
          refresh: 'Oppdater',
          backends: 'Backends',
          enableHttpsFirst:
            'Aktiver HTTPS før du aktiverer brannmurmodusen Begrenset eller Paranoid',
          httpsRequired:
            'Modusene Begrenset og Paranoid er deaktivert til HTTPS er aktivert under Innstillinger > Nettverk > Tjenester',
          mode: {
            title: 'Brannmurmodus',
            baseline: 'Basis',
            baselineDesc:
              'Åpen kompatibilitetsprofil. Brannmuren kjører, men innkommende kilder er ikke begrenset. Bruk bare på pålitelige nettverk.',
            moderate: 'Moderat',
            moderateDesc:
              'Standardprofil. Beholder Basis-tjenestene, men godtar bare nye innkommende tilkoblinger fra private, link-local- eller loopback-områder. Utgående tilgang forblir åpen.',
            restricted: 'Begrenset',
            restrictedDesc:
              'Kun lokal HTTPS og SSH, pluss utgående DNS, NTP, syslog og nettbaserte oppdateringer. DHCP og nødvendig IPv6-trafikk forblir tilgjengelig. WebRTC er blokkert.',
            paranoid: 'Paranoid',
            paranoidDesc:
              'Kun lokal HTTPS-tilgang. Blokkerer SSH, HTTP, nettbaserte oppdateringer og andre utgående nettverksfunksjoner. Opplasting av frakoblede oppdateringer og allerede klargjorte installasjoner er fortsatt tilgjengelig.',
            current: 'Gjeldende',
            default: 'Standard',
            localOnly: 'Kun lokalt',
            openTag: 'Innkommende åpen',
            httpsRequiredTag: 'HTTPS kreves',
            outboundOpen: 'Utgående åpen',
            outboundLimited: 'Utgående begrenset',
            httpsOnly: 'Kun HTTPS'
          },
          moderate: {
            apply: 'Bytt til Moderat'
          },
          restricted: {
            enable: 'Aktiver Begrenset',
            confirmTitle: 'Aktivere brannmurmodusen Begrenset?',
            confirmDesc:
              'Innkommende administratortilgang begrenses til private IPv4-, IPv4 link-local/loopback-, IPv6 link-local- eller IPv6 loopback-kilder for HTTPS og SSH. Offentlige kildeområder er ikke tillatt. Utgående DNS, NTP, ekstern syslog, onlineoppdateringer, DHCP, etablerte forbindelser og nødvendig IPv6-kontrolltrafikk forblir tilgjengelig. WebRTC/ICE UDP og annen inn-/utgående trafikk blokkeres.'
          },
          paranoid: {
            enable: 'Aktiver Paranoid',
            confirmTitle: 'Aktivere brannmurmodusen Paranoid?',
            confirmDesc:
              'Bare HTTPS-tilgang fra private IPv4, IPv4 link-local/loopback, IPv6 link-local eller IPv6 loopback forblir tilgjengelig. SSH, HTTP, mDNS, NTP, GitHub-nedlastinger og annen trafikk blokkeres bortsett fra minimal DHCP/IPv6-kontroll.'
          },
          baseline: {
            apply: 'Bytt til Basis',
            confirmTitle: 'Bytte til åpen Basis-modus?',
            confirmDesc:
              'Brannmurtjenesten forblir aktiv, men begrensningen til lokale kildeområder fjernes. Offentlige kildeområder kan nå eksponerte NanoKVM-tjenester hvis nettverket ruter dem.'
          },
          rules: {
            title: 'Gjeldende regler',
            empty: 'Ingen regler'
          }
        },
        saveChanges: 'Lagre endringer',
        unsaved: 'Ulagrede endringer'
      },
      systemLog: {
        saveFailed: 'Kunne ikke lagre logginnstillinger',
        saved: 'Logginnstillinger lagret',
        invalidHost: 'Angi en syslog-serverhost',
        logLoadFailed: 'Kunne ikke laste logger',
        save: 'Lagre',
        test: 'Send testlogg',
        testSent: 'Testlogg sendt',
        testFailed: 'Kunne ikke sende testlogg',
        remote: {
          title: 'Ekstern logging',
          forward: 'Videresend systemlogg',
          description: 'Videresend systemmeldinger til en ekstern server',
          host: 'Server',
          hostDesc: 'Vertsnavn eller IPv4-adresse til syslog-serveren',
          port: 'Port',
          protocol: 'UDP-port på syslog-serveren'
        },
        local: {
          title: 'Systemloggbuffer',
          description:
            'Gjeldende logger holdes i RAM på {{path}} for å unngå skriving til SD-kortet',
          priority: 'Minimumsprioritet',
          priorityDesc: 'Minste hastegrad for at en melding logges',
          buffer: 'Bufferstørrelse',
          bufferDesc: 'Loggstørrelse der filen roteres',
          rotations: 'Rotasjoner',
          rotationsDesc: 'Antall roterte loggfiler som beholdes',
          compact: 'Kompakt utdata',
          compactDesc: 'Utelat vertsnavn og facility fra hver linje',
          stripTimestamps: 'Fjern tidsstempler',
          stripTimestampsDesc:
            'Fjern tidsstempler lagt til av avsenderen; syslog legger til sine egne'
        },
        kernel: {
          title: 'Kjernelogging',
          enabled: 'Videresend kjernelogg',
          enabledDesc: 'Fang opp kjernemeldinger i systemloggen',
          consoleLevel: 'Konsollnivå',
          consoleLevelDesc: 'Minste hastegrad for at en kjernemelding skrives ut på konsollen'
        },
        viewer: {
          title: 'Systemlogg',
          refresh: 'Oppdater',
          empty: 'Ingen loggoppføringer',
          truncated: 'Bare de nyeste loggdataene vises',
          linesUnit: 'linjer'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Kritisk',
          '3': '3 - Feil',
          '4': '4 - Advarsel',
          '5': '5 - Merknad',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Alle'
        }
      },
      user: {
        title: 'Bruker'
      },
      networking: {
        title: 'Nettverk'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Kryptert tunnel',
        device: 'Denne enheten',
        description: 'Nå denne KVM-en gjennom en WireGuard-tunnel',
        unavailable: 'WireGuard er ikke installert på denne enheten',
        blocked: 'Brannmurmodusen Paranoid blokkerer WireGuard',
        needsKey: 'Angi en privat nøkkel før du slår på WireGuard',
        saved: 'WireGuard-innstillingene er lagret',
        save: 'Lagre endringer',
        unsaved: 'Ulagrede endringer',
        invalid: 'Kontroller de utheva feltene',
        invalidAddress: 'Skriv inn en adresse med maske, for eksempel 10.0.0.1/24',
        invalidKey: 'Skriv inn en WireGuard-nøkkel på 44 tegn',
        invalidEndpoint: 'Skriv inn et vertsnavn eller en IP-adresse',
        invalidPort: 'Skriv inn en port fra 1 til 65535',
        invalidRanges: 'Bruk IPv4-områder som 10.0.0.0/24, ikke 0.0.0.0/0',
        status: {
          connected: 'Tilkoblet',
          waiting: 'Venter på peer',
          stopped: 'Stoppet',
          handshake: 'Siste handshake {{time}}'
        },
        privateKey: {
          title: 'Privat nøkkel',
          description: 'Blir på denne enheten og vises aldri igjen',
          set: 'Angitt',
          notSet: 'Ikke angitt',
          setBtn: 'Angi',
          generate: 'Generer',
          remove: 'Fjern',
          modalTitle: 'Angi den private nøkkelen',
          modalDescription: 'Nøkkelen lagres på denne enheten og vises aldri igjen',
          placeholder: 'Lim inn den private nøkkelen',
          generateConfirmTitle: 'Generere en ny privat nøkkel?',
          generateConfirmDesc:
            'Den gjeldende nøkkelen slutter å fungere. Legg deretter den nye offentlige nøkkelen til peeren.',
          removeConfirmTitle: 'Fjerne den private nøkkelen?',
          removeConfirmDesc: 'WireGuard slås av og forblir av til en ny nøkkel er angitt.'
        },
        publicKey: {
          title: 'Offentlig nøkkel',
          description: 'Legg den til i peerens konfigurasjon'
        },
        address: {
          title: 'Adresse',
          description: 'KVM-adresse i tunnelen og dens maske'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Offentlig nøkkel',
          publicKeyDescription: 'Offentlig nøkkel til peeren du kobler til',
          server: 'Server',
          serverDescription: 'Peerens vertsnavn eller IP-adresse',
          port: 'Port',
          portDescription: 'Peerens UDP-port, vanligvis 51820',
          allowedIps: 'Tillatte IP-er',
          allowedIpsDescription:
            'Peerens adresse eller område i tunnelen, for eksempel 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Sekunder mellom keepalive-pakker, nødvendig bak en ruter'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Nå denne KVM-en gjennom ditt Tailscale-nettverk',
        service: 'Tjeneste',
        performance: 'Ytelse',
        memory: {
          title: 'Minneoptimalisering',
          tip: 'Holder minnebruken til Tailscale lav, noe som hjelper på en enhet med lite RAM. Start Tailscale på nytt for at endringen skal tre i kraft.'
        },
        swap: {
          title: 'Byttefil',
          tip: 'Hvis problemene vedvarer etter at du har aktivert minneoptimalisering, prøv å aktivere byttefilen',
          sizeTip:
            'Dette setter filstørrelsen til 128MB; juster den i Innstillinger > System > Ytelse'
        },
        restartTitle: 'Start Tailscale på nytt',
        restartDesc: 'Starter tjenesten på nytt',
        restartBtn: 'Start på nytt',
        restart: 'Starte Tailscale på nytt?',
        stopTitle: 'Stopp Tailscale',
        stopBtn: 'Stopp',
        stop: 'Stoppe Tailscale?',
        stopDesc: 'Stopper tjenesten og hindrer at den starter ved oppstart',
        loading: 'Laster...',
        notInstall: 'Tailscale er ikke funnet, vennligst installer',
        install: 'Installér',
        installing: 'Installerer',
        failed: 'Installering feilet',
        retry: 'Vennligst last inn siden på nytt og forsøk igjen, eller installer manuelt.',
        download: 'Last ned',
        package: 'installasjonspakken',
        unzip: 'og pakk den ut',
        upTailscale: 'Last opp Tailscale til NanoKVM-enhetens mappe /usr/bin/',
        upTailscaled: 'Last opp tailscaled til NanoKVM-enhetens mappe /usr/sbin/',
        refresh: 'Last inn denne siden på nytt',
        notRunning: 'Tailscale kjører ikke. Start den for å fortsette.',
        run: 'Start',
        notLogin:
          'Denne enheten er ikke knyttet til din konto enda. Vennligst logg inn og knytt den til kontoen din..',
        urlPeriod: 'Denne lenken er gyldig i 10 minutter',
        login: 'Logg inn',
        loginSuccess: 'Logget inn',
        deviceName: 'Enhetens navn',
        deviceIP: 'Enhetens IP',
        account: 'Konto',
        logout: 'Logg ut',
        logoutDesc: 'Er du sikker på at du vil logge ut?',
        uninstall: 'Avinstaller Tailscale',
        uninstallDesc: 'Er du sikker på at du vil avinstallere Tailscale?',
        okBtn: 'Ja',
        cancelBtn: 'Nei'
      },
      update: {
        title: 'Oppdateringer',
        currentVersion: 'Gjeldende versjon',
        latestVersion: 'Nyeste versjon',
        queryFailed: 'Kunne ikke hente versjon',
        updateFailed: 'En feil oppstod under oppdatering',
        paranoidBlocked: 'Onlineoppdateringer blokkeres av brannmurmodusen Paranoid',
        paranoidBlockedDesc:
          'GitHub-kontroller og nedlastinger krever utgående nettverkstilgang. Offline-opplasting og allerede klargjorte installasjoner er fortsatt tilgjengelige.',
        available: 'En oppdatering er tilgjengelig. Er du sikker på at du ønsker å oppdatere?',
        updating: 'Oppdatering har startet',
        confirm: 'Bekreft',
        cancel: 'Avbryt',
        badge: {
          checking: 'Sjekker',
          latest: 'Oppdatert',
          available: 'Oppdatering tilgjengelig',
          failed: 'Sjekk mislyktes',
          local: 'Lokal'
        },
        application: {
          title: 'Applikasjon'
        },
        system: {
          queryFailed: 'Kunne ikke hente systemversjon',
          appUpdateRequired:
            'Oppdater applikasjonen til {{version}} før du installerer denne systemoppdateringen',
          requiredAppVersion: 'Påkrevd applikasjonsversjon',
          downloadFailed: 'Nedlasting eller verifisering mislyktes',
          available: 'En oppdatering av basissystemet er tilgjengelig.',
          downloading: 'Laster ned og verifiserer systemoppdatering...',
          downloadVerify: 'Last ned og verifiser',
          installing: 'Installerer klargjort systemoppdatering...',
          install: 'Installer',
          installFailed: 'Installasjon mislyktes',
          installConfirmTitle: 'Installere systemoppdatering?',
          installConfirmDesc:
            'Dette erstatter basissystemfiler fra den verifiserte pakken. Omstart kreves.',
          rawInstallConfirmDesc:
            'Denne verifiserte pakken skriver raw boot/rootfs-images til SD-kortpartisjonene og starter automatisk på nytt. Skriving kan ta flere minutter; hold strømmen tilkoblet.',
          rawInstallWarning:
            'Det finnes ingen automatisk rollback for raw partisjonsoppdateringer. Hvis boot feiler, gjenopprett SD-kortet manuelt.',
          rawWaitTitle: 'Installerer systemoppdatering',
          rawWaitWriting: 'Skriver det nye systemet til SD-kortet',
          rawWaitRestarting:
            'Enheten starter på nytt. Denne siden lastes inn på nytt når den er tilbake.',
          rawWaitDesc:
            'Dette tar omtrent tre minutter. La strømmen være tilkoblet og ikke lukk denne siden.',
          rawWaitSlow:
            'Dette tar lengre tid enn forventet. Vent noen minutter til før du kobler fra strømmen.',
          rebootRequired: 'Omstart kreves for å aktivere denne systemtilstanden.',
          rollingBack: 'Ruller tilbake systemoppdatering...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback klargjort',
          rollbackFailed: 'Rollback mislyktes',
          rollbackConfirmTitle: 'Rollback systemoppdatering?',
          rollbackConfirmDesc:
            'Dette gjenoppretter filer fra den siste systemoppdateringskopien. Omstart kreves.',
          stagedDesc: 'Systemoppdateringen er lastet ned og verifisert, du kan installere den nå',
          refresh: 'Oppdater',
          releaseNotes: 'Versjonsnotater',
          systemVersion: 'Systemversjon',
          kernel: 'Kernel',
          stagedVersion: 'Klargjort versjon',
          archive: 'Arkiv',
          requiredFree: 'Påkrevd ledig plass',
          fileCount: 'Filer',
          rawImages: 'Raw images',
          progress: 'Fremdrift',
          progressMessage: 'Fremdriftsmelding',
          pendingVersion: 'Ventende versjon',
          bootHealth: 'Boothelse',
          healthy: 'Frisk',
          unhealthy: 'Trenger oppmerksomhet',
          rollbackBackup: 'Rollback-sikkerhetskopi'
        },
        offline: {
          title: 'Last opp programpakke',
          desc: 'Installer en programpakke fra denne datamaskinen. Serveren starter på nytt etterpå.',
          installTitle: 'Installere programoppdatering?',
          installDesc: 'Programmet erstattes, og serveren starter på nytt. Du må logge inn igjen.'
        },
        local: {
          title: 'Last opp systempakke',
          desc: 'Installer en systempakke fra denne datamaskinen. Én fil inneholder arkivet og de signerte metadataene.',
          choose: 'Velg fil',
          invalidFile: 'Velg en pakke som slutter på .tar eller .tar.gz.',
          diskTitle: 'Slå av den virtuelle disken?',
          diskWarn:
            'Pakken lagres på /data, som er skrivebeskyttet mens den virtuelle disken er på. Når den slås av, får ikke datamaskinen lenger tilgang til /data. Fortsette?',
          uploading: 'Laster opp',
          verifying: 'Verifiserer og klargjør pakken',
          keyTitle: 'Lokal oppdateringsnøkkel',
          keyDesc: 'Offentlig nøkkel i PEM-format som kan signere pakker du bygger selv',
          keyNone: 'Ingen nøkkel angitt',
          keySet: 'Angi nøkkel',
          keyRemove: 'Fjern',
          signer: 'Signert av',
          section: 'Lokale oppdateringer',
          keyRequired: 'Lokal nøkkel kreves'
        }
      },
      account: {
        title: 'Konto',
        webAccount: 'Navn på webkonto',
        password: 'Passord',
        passwordDesc: 'Endre passordet som brukes til å logge inn på webgrensesnittet',
        updateBtn: 'Endre',
        logoutBtn: 'Logg ut',
        logoutDesc: 'Er du sikker på at du vil logge ut?',
        okBtn: 'Ja',
        cancelBtn: 'Nei',
        session: {
          title: 'Økt'
        },
        logoutOnClose: {
          title: 'Logg ut når nettleseren lukkes',
          description: 'Avslutt økten når nettleseren lukkes, i stedet for å holde den åpen'
        },
        totp: {
          title: 'Tofaktorautentisering',
          authenticator: 'Autentiseringsapp',
          description: 'Krev en tidsbasert kode fra en autentiseringsapp i tillegg til passordet',
          required: 'Påkrevd av policy',
          disable: 'Deaktiver',
          enableTitle: 'Sett opp tofaktorautentisering',
          enableDescription:
            'Bekreft passordet ditt for å fortsette. Det kreves for enhver endring av den andre faktoren.',
          continue: 'Fortsett',
          disableTitle: 'Deaktivere tofaktorautentisering?',
          disableDescription:
            'Kontoen din blir bare beskyttet av passordet. Bekreft med passordet ditt for å fortsette.',
          disableFailed: 'Kunne ikke deaktivere tofaktorautentisering',
          passwordPlaceholder: 'Nåværende passord',
          enrollFailed: 'Kunne ikke starte oppsettet',
          invalidCode: 'Koden stemmer ikke. Prøv den neste.',
          scan: 'Skann dette med autentiseringsappen din.',
          manualEntry: 'Eller skriv inn denne nøkkelen manuelt:',
          codePlaceholder: 'Skriv inn den 6-sifrede koden for å bekrefte',
          confirm: 'Bekreft',
          cancel: 'Avbryt',
          backupTitle: 'Lagre reservekodene dine nå',
          backupDescription:
            'Hver kode fungerer bare én gang og vises ikke igjen. De er den eneste veien inn hvis du mister autentiseringsappen, og de fungerer også når enhetens klokke ikke er synkronisert.',
          copy: 'Kopier',
          copied: 'Reservekoder kopiert',
          savedThem: 'Jeg har lagret dem',
          remaining: '{{remaining}} reservekoder igjen',
          clockUnsynced:
            'Enhetens klokke er ikke synkronisert ennå. Synkroniser tiden i Innstillinger > System > Tid før du setter opp.',
          noBackupCodes:
            'Det er ingen reservekoder igjen. Velg Generer for å utstede et nytt sett.',
          regenerate: 'Nye reservekoder',
          generate: 'Generer',
          regenerateTitle: 'Utstede nye reservekoder?',
          regenerateDescription:
            'De nåværende reservekodene dine slutter å fungere. Bekreft med passordet ditt for å fortsette.',
          regenerateFailed: 'Kunne ikke utstede nye reservekoder',
          download: 'Last ned',
          copyFailed: 'Kunne ikke kopiere. Marker kodene og kopier dem manuelt.',
          requireTitle: 'Krev tofaktorautentisering',
          requireDescription:
            'Hindrer at tofaktorautentisering deaktiveres, og en konto uten den må sette den opp før enheten kan brukes',
          requireFailed: 'Kunne ikke endre kravet',
          requiredTitle: 'Tofaktorautentisering er påkrevd',
          requiredDescription:
            'Denne enheten er satt opp til å kreve en andre faktor, men kontoen din har ikke satt opp noen ennå. Sett den opp nå for å fortsette.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw-assistent',
      empty: 'Beskriv en oppgave for å begynne',
      inputPlaceholder: 'Beskriv hva du vil at PicoClaw skal gjøre',
      newConversation: 'Ny samtale',
      processing: 'Behandler...',
      agent: {
        defaultTitle: 'Generell assistent',
        defaultDescription: 'Generell chat-, søk- og arbeidsområdehjelp',
        kvmTitle: 'Fjernstyring',
        kvmDescription: 'Betjen den eksterne verten gjennom NanoKVM',
        switched: 'Agentrolle byttet',
        switchFailed: 'Kunne ikke bytte agentrolle'
      },
      send: 'Send',
      cancel: 'Avbryt',
      status: {
        connecting: 'Kobler til gateway...',
        connected: 'PicoClaw-økt tilkoblet',
        disconnected: 'PicoClaw-økt frakoblet',
        stopped: 'Stoppforespørsel sendt',
        runtimeStarted: 'PicoClaw runtime startet',
        runtimeStartFailed: 'Kunne ikke starte PicoClaw runtime',
        runtimeStopped: 'PicoClaw runtime stoppet',
        runtimeStopFailed: 'Kunne ikke stoppe PicoClaw runtime'
      },
      connection: {
        runtime: {
          checking: 'Kontrollerer',
          ready: 'Runtime klar',
          stopped: 'Runtime stoppet',
          unavailable: 'Runtime utilgjengelig',
          configError: 'Konfigurasjonsfeil'
        },
        transport: {
          connecting: 'Kobler til',
          connected: 'Tilkoblet'
        },
        run: {
          idle: 'Inaktiv',
          busy: 'Opptatt'
        }
      },
      error: {
        lockHeld: 'PicoClaw er i bruk i et annet vindu',
        takenOver: 'Et annet vindu overtok PicoClaw',
        authFailed: 'PicoClaw avviste tilkoblingen',
        upstreamClosed: 'Tilkoblingen til PicoClaw ble brutt'
      },
      tool: {
        screenshot: 'Tar et skjermbilde',
        loadImage: 'Ser på skjermbildet',
        actions: 'Styrer verten',
        generic: 'Bruker {{name}}',
        type: 'Skriver {{text}}',
        hotkey: 'Trykker {{keys}}',
        click: 'Klikker',
        doubleClick: 'Dobbeltklikker',
        move: 'Flytter musen',
        drag: 'Drar',
        scroll: 'Ruller',
        wait: 'Venter'
      },
      message: {
        toolAction: 'Handling',
        observation: 'Observasjon',
        screenshot: 'Skjermbilde'
      },
      overlay: {
        locked: 'PicoClaw kontrollerer enheten. Manuell inntasting er satt på pause.'
      },
      install: {
        install: 'Installer PicoClaw',
        installing: 'Installerer PicoClaw',
        success: 'PicoClaw installert vellykket',
        failed: 'Kunne ikke installere PicoClaw',
        uninstalled: 'PicoClaw ble avinstallert',
        uninstallFailed: 'Avinstallering mislyktes',
        requiredTitle: 'PicoClaw er ikke installert',
        requiredDescription: 'Installer PicoClaw før du starter PicoClaw runtime.',
        progressDescription: 'PicoClaw blir lastet ned og installert.',
        stages: {
          preparing: 'Forbereder',
          downloading: 'Laster ned',
          extracting: 'Pakker ut',
          verifying: 'Verifiserer',
          installing: 'Installerer',
          installed: 'Installert',
          install_timeout: 'Tidsavbrudd',
          install_failed: 'Mislyktes'
        }
      },
      model: {
        requiredTitle: 'Modellkonfigurasjon er nødvendig',
        requiredDescription: 'Konfigurer PicoClaw-modellen før du bruker PicoClaw chat.',
        docsTitle: 'Konfigurasjonsveiledning',
        docsDesc: 'Støttede modeller og protokoller',
        menuLabel: 'Konfigurer modell',
        modelIdentifier: 'Modellidentifikator',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API-basis-URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API-nøkkel',
        apiKeyPlaceholder: 'Skriv inn modellens API-nøkkel',
        apiKeyKeepPlaceholder: 'La stå tom for å beholde nåværende nøkkel',
        save: 'Lagre',
        saving: 'Lagrer',
        saved: 'Modellkonfigurasjon lagret',
        saveFailed: 'Kunne ikke lagre modellkonfigurasjonen',
        invalid: 'Modellidentifikator, API-basis-URL og API-nøkkel kreves'
      },
      uninstall: {
        confirmTitle: 'Avinstaller PicoClaw',
        confirmContent:
          'Er du sikker på at du vil avinstallere PicoClaw? Dette vil slette den kjørbare filen og alle konfigurasjonsfilene.',
        confirmOk: 'Avinstaller'
      },
      history: {
        title: 'Historikk',
        loading: 'Laster inn økter...',
        emptyTitle: 'Ingen historikk ennå',
        emptyDescription: 'Tidligere PicoClaw økter vil vises her.',
        loadFailed: 'Kunne ikke laste inn økthistorikk',
        deleteFailed: 'Kunne ikke slette økten',
        deleteConfirmTitle: 'Slett økt',
        deleteConfirmContent: 'Er du sikker på at du vil slette "{{title}}"?',
        deleteConfirmOk: 'Slett',
        messageCount_one: '{{count}} melding',
        messageCount_other: '{{count}} meldinger'
      },
      config: {
        startRuntime: 'Start PicoClaw',
        stopRuntime: 'Stopp PicoClaw',
        stopConfirm: 'Stoppe PicoClaw?'
      },
      start: {
        title: 'Start PicoClaw',
        description: 'Start runtime for å begynne å bruke PicoClaw-assistenten.'
      }
    },
    error: {
      title: 'Vi har hatt et problem',
      refresh: 'Oppdater'
    },
    fullscreen: {
      toggle: 'Veksle fullskjerm'
    },
    menu: {
      collapse: 'Skjul meny'
    }
  }
};

export default nb;
