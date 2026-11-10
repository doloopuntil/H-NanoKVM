const nl = {
  translation: {
    common: {
      confirm: 'Bevestigen',
      cancel: 'Annuleren',
      close: 'Sluiten',
      save: 'Opslaan',
      discard: 'Negeren',
      delete: 'Verwijderen',
      actionFailed: 'Bewerking mislukt',
      loading: 'Instellingen van het apparaat laden...',
      loadFailed: 'Kan de instellingen niet van het apparaat laden',
      retry: 'Opnieuw proberen'
    },
    head: {
      desktop: 'Extern bureaublad',
      login: 'Inloggen',
      firstSetup: 'Eerste installatie',
      changePassword: 'Wachtwoord wijzigen',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Inloggen',
      placeholderUsername: 'Voer gebruikersnaam in',
      placeholderPassword: 'Voer wachtwoord in',
      placeholderPassword2: 'Voer wachtwoord nogmaals in',
      noEmptyUsername: 'Gebruikersnaam mag niet leeg zijn',
      noEmptyPassword: 'Wachtwoord mag niet leeg zijn',
      invalidUser: 'Ongeldige gebruikersnaam of wachtwoord',
      locked: 'Te veel aanmeldingen, probeer het later opnieuw',
      globalLocked: 'Systeem wordt beveiligd, probeer het later opnieuw',
      error: 'Onverwachte fout',
      changePassword: 'Wachtwoord wijzigen',
      changePasswordDesc:
        'Voor de veiligheid van uw apparaat, wijzig alstublieft het webaanmeldingswachtwoord',
      differentPassword: 'Wachtwoorden komen niet overeen',
      illegalUsername: 'Gebruikersnaam bevat ongeldige tekens',
      illegalPassword:
        'Het wachtwoord moet minstens 8 tekens bevatten en mag geen aanhalingstekens of schuine strepen bevatten',
      forgetPassword: 'Wachtwoord vergeten',
      ok: 'Ok',
      cancel: 'Annuleren',
      loginButtonText: 'Inloggen',
      setupTitle: 'Beheerdersaccount maken',
      setupDescription:
        'Er bestaat nog geen webaccount op dit apparaat. Maak het eerste beheerdersaccount om door te gaan.',
      setupRecovery:
        'Als dit wachtwoord verloren gaat, moet de SD-kaart opnieuw worden geschreven voor herstel',
      setupButtonText: 'Account maken',
      tips: {
        hardenedRecovery:
          'Deze Hardened-image ondersteunt geen wachtwoordreset via de BOOT-knop. Als het wachtwoord verloren gaat, schrijf de SD-kaart opnieuw en maak een nieuw account.',
        change1: 'Houd er rekening mee dat deze actie de volgende wachtwoorden zal wijzigen:',
        change2: 'Web login wachtwoord',
        change3: 'Systeem root-wachtwoord voor SSH-inlog'
      },
      placeholderCurrentPassword: 'Huidig wachtwoord',
      placeholderNewPassword: 'Nieuw wachtwoord',
      wrongCurrentPassword: 'Het huidige wachtwoord is onjuist',
      totp: {
        title: 'Tweefactorauthenticatie',
        prompt: 'Voer de 6-cijferige code uit uw authenticator-app in',
        backupPrompt: 'Voer een van uw back-upcodes in',
        noEmptyCode: 'Voer een code in',
        placeholderCode: '6-cijferige code',
        placeholderBackup: 'Back-upcode',
        verifyButtonText: 'Verifiëren',
        useBackupCode: 'Een back-upcode gebruiken',
        useAuthenticator: 'Code van authenticator-app gebruiken',
        cancel: 'Terug',
        invalidCode: 'Die code is ongeldig. Probeer het opnieuw.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Wi-Fi configureren voor NanoKVM',
      success: 'Controleer de netwerkstatus van NanoKVM en bezoek het nieuwe IP-adres',
      failed: 'De bewerking is mislukt, probeer het opnieuw',
      invalidMode:
        'De huidige modus ondersteunt geen netwerkconfiguratie. Ga naar uw apparaat en schakel de configuratiemodus Wi-Fi in.',
      confirmBtn: 'Ok',
      finishBtn: 'Gereed',
      ap: {
        authTitle: 'Authenticatie vereist',
        authDescription: 'Voer het AP-wachtwoord in om door te gaan',
        authFailed: 'Ongeldig AP wachtwoord',
        passPlaceholder: 'AP-wachtwoord',
        verifyBtn: 'Verifieer'
      }
    },
    screen: {
      scale: 'Schaal',
      title: 'Scherm',
      video: 'Videomodus',
      videoDirectTips:
        'Schakel HTTPS in bij "Instellingen > Netwerk > Diensten" om deze modus te gebruiken',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC is uitgeschakeld in de firewallmodi Beperkt en Paranoïde',
      transferRunningTitle: 'Image-overdracht bezig',
      transferRunningDesc:
        'Het wijzigen van de videomodus laadt de pagina opnieuw, waardoor de lopende image-upload of -download wordt geannuleerd.',
      transferRunningOk: 'Modus wijzigen',
      resolution: 'Resolutie',
      auto: 'Automatisch',
      autoTips:
        'Bij bepaalde resoluties kunnen schermverscheuringen of muisverplaatsingen optreden, dus pas de resolutie van de externe host aan of schakel de automatische modus uit',
      fps: 'FPS',
      customizeFps: 'Aanpassen',
      quality: 'Kwaliteit',
      qualityLossless: 'Verliesvrij',
      qualityHigh: 'Hoog',
      qualityMedium: 'Gemiddeld',
      qualityLow: 'Laag',
      frameDetect: 'Framedetectie',
      frameDetectTip:
        'Vergelijkt frames en stopt met het verzenden van video zolang het scherm van de externe host niet verandert',
      resetHdmi: 'HDMI resetten',
      webrtcConnectionFailed: {
        title: 'WebRTC-verbinding mislukt',
        description: 'Controleer de netwerkverbinding of wijzig de videomodus'
      },
      captureStatus: {
        hdmiError: 'HDMI-schermfout',
        unsupportedResolution: 'De huidige resolutie wordt niet ondersteund',
        retrieving: 'Scherm ophalen...',
        changingResolution: 'Resolutie wisselen...',
        updateFailed: 'Het scherm kan nu niet worden bijgewerkt',
        videoError: 'Fout bij videoweergave',
        noHdmi: 'Geen HDMI-signaal gedetecteerd',
        unavailable: 'Het scherm kan nu niet worden weergegeven'
      }
    },
    keyboard: {
      title: 'Toetsenbord',
      paste: 'Plakken',
      tips: 'Alleen standaard toetsenbordletters en symbolen worden ondersteund',
      placeholder: 'Tekst om te plakken',
      local: 'Mobiel toetsenbord',
      virtual: 'Schermtoetsenbord',
      readClipboard: 'Lezen vanaf het klembord',
      clipboardPermissionDenied:
        'Klembordtoestemming geweigerd, sta klembordtoegang toe in uw browser',
      clipboardReadError: 'Kan het klembord niet lezen',
      dropdownEnglish: 'Engels',
      dropdownGerman: 'Duits',
      dropdownFrench: 'Frans',
      dropdownRussian: 'Russisch',
      dropdownKorean: 'Koreaans',
      dropdownJapanese: 'Japans',
      localInput: 'Invoer via mobiel toetsenbord',
      shortcut: {
        title: 'Sneltoetsen',
        custom: 'Aangepast',
        capture: 'Klik hier om de snelkoppeling vast te leggen',
        clear: 'Wissen',
        save: 'Opslaan',
        captureTips:
          'Voor het vastleggen van systeemtoetsen, zoals de Windows-toets, is toestemming voor volledig scherm vereist',
        enterFullScreen: 'Schakelen naar volledig scherm'
      },
      leaderKey: {
        title: 'Leader-toets',
        desc: 'Omzeil browserbeperkingen en stuur systeemsnelkoppelingen rechtstreeks naar de externe host',
        howToUse: 'Hoe te gebruiken',
        simultaneous: {
          title: 'Gelijktijdige modus',
          desc1: 'Houd de Leader-toets ingedrukt en druk daarna op de sneltoets.',
          desc2: 'Intuïtief, maar kan conflicteren met systeemsnelkoppelingen.'
        },
        sequential: {
          title: 'Sequentiële modus',
          desc1:
            'Druk op de Leader-toets → druk de sneltoets in volgorde in → druk opnieuw op de Leader-toets.',
          desc2: 'Vereist meer stappen, maar vermijdt systeemconflicten volledig.'
        },
        enable: 'Leader-toets inschakelen',
        tip: 'Wanneer deze toets als Leader-toets is toegewezen, werkt hij uitsluitend als sneltoetstrigger en verliest hij zijn standaardgedrag.',
        placeholder: 'Druk op de Leader-toets',
        shiftRight: 'Rechter Shift',
        ctrlRight: 'Rechter Ctrl',
        metaRight: 'Rechter Win',
        recorder: {
          rec: 'OPN',
          activate: 'Toetsen activeren',
          input: 'Druk op de snelkoppeling'
        }
      }
    },
    mouse: {
      title: 'Muis',
      cursor: 'Cursorstijl',
      default: 'Standaard cursor',
      cell: 'Cel cursor',
      text: 'Tekst cursor',
      grab: 'Grijp cursor',
      hide: 'Cursor verbergen',
      mode: 'Muismodus',
      absolute: 'Absolute modus',
      relative: 'Relatieve modus',
      direction: 'Scrollwielrichting',
      scrollUp: 'Scroll naar boven',
      scrollDown: 'Scroll naar beneden',
      speed: 'Scrollwielsnelheid',
      sensitivity: 'Aanwijzersnelheid',
      sensitivityDesc:
        'Voor desktop relatieve modus: lagere waarden verminderen drift door muisversnelling van de host',
      fast: 'Snel',
      slow: 'Langzaam',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Beweeg overal in het KVM-gebied; de externe cursor behoudt zijn positie tussen aanrakingen en blijft gesynchroniseerd met absolute HID'
      },
      requestPointer:
        'Relatieve modus wordt gebruikt, klik op het bureaublad om de muisaanwijzer te krijgen',
      resetHid: 'HID resetten',
      hidOnly: {
        title: 'HID-Only-modus',
        desc: 'Als muis of toetsenbord niet meer reageren en het resetten van HID niet helpt, kan het gaan om een compatibiliteitsprobleem tussen de NanoKVM en de host.',
        tip1: 'Als u de HID-Only-modus inschakelt, worden de virtuele schijf en het virtuele netwerk ontkoppeld',
        tip2: 'In de HID-Only-modus is het koppelen van images uitgeschakeld',
        tip3: 'NanoKVM wordt automatisch opnieuw opgestart na het wisselen van modus',
        enable: 'HID-Only-modus inschakelen',
        disable: 'HID-Only-modus uitschakelen'
      }
    },
    image: {
      title: 'Afbeeldingen',
      loading: 'Laden...',
      empty: 'Niets gevonden',
      mountMode: 'Koppelen als',
      mount: 'Koppelen',
      orDownload: 'Of download via een link',
      keepRunning:
        'U kunt dit venster sluiten. De overdracht gaat door en de voortgang staat in de lijst met afbeeldingen.',
      massStorage: 'Massaopslag',
      cdRom: 'CD-ROM',
      mountFailed: 'Koppelen mislukt',
      mountDesc:
        'In sommige systemen is het noodzakelijk om de virtuele schijf op de externe host uit te werpen voordat het image wordt gekoppeld',
      diskOnWarn:
        'Het koppelen van de image schakelt de virtuele schijf uit, zodat de computer geen toegang meer heeft tot /data. Doorgaan?',
      diskOffWarn:
        'De virtuele schijf staat uit en moet aan staan om de image te koppelen. De USB-apparaten op de computer worden opnieuw herkend. Doorgaan?',
      unmountFailed: 'Ontkoppelen mislukt',
      unmountDesc:
        'Op sommige systemen moet u de image handmatig uitwerpen van de externe host voordat u de image ontkoppelt',
      forceEject: 'Uitwerpen forceren',
      forceEjectConfirm:
        'De host heeft het optische station vergrendeld. Bij geforceerd uitwerpen wordt het virtuele USB-apparaat even losgekoppeld, waardoor het toetsenbord en de muis kort kunnen worden losgekoppeld. Doorgaan?',
      usbReconnect: 'USB opnieuw verbinden',
      usbReconnectConfirm:
        'Verbind het USB-gadget alleen opnieuw als de externe host de mediawijziging niet heeft opgemerkt. Toetsenbord en muis kunnen kort worden losgekoppeld.',
      usbReconnectSuccess: 'USB opnieuw verbonden',
      usbReconnectFailed: 'USB opnieuw verbinden mislukt',
      addImage: 'Afbeelding toevoegen',
      fromUrl: 'Via URL',
      fromFile: 'Uit bestand',
      turnOff: 'Uitschakelen',
      deleteDiskShared:
        'Afbeeldingen kunnen niet worden verwijderd zolang de virtuele schijf aan staat.',
      eject: 'Uitwerpen',
      download: 'Downloaden',
      upload: 'Uploaden',
      mountTitle: 'Afbeelding koppelen',
      deleteTitle: 'Afbeelding verwijderen',
      deleteConfirm: 'Weet u zeker dat u deze afbeelding wilt verwijderen?',
      tips: {
        title: 'Hoe te uploaden',
        usb1: 'Verbind de NanoKVM met uw computer via USB.',
        usb2: 'Zorg ervoor dat de virtuele schijf is gekoppeld in Instellingen > Apparaat > Virtuele schijf.',
        usb3: 'Open de virtuele schijf op uw computer en kopieer het imagebestand naar de hoofdmap van de virtuele schijf.',
        scp1: 'Zorg ervoor dat de NanoKVM en uw computer zich in hetzelfde lokale netwerk bevinden.',
        scp2: 'Open een terminal op uw computer en gebruik het SCP-commando om het imagebestand te uploaden naar de /data directory op de NanoKVM.',
        scp3: 'Voorbeeld: scp uw-image-pad root@uw-nanokvm-ip:/data',
        tfCard: 'SD-kaart',
        tf1: 'Deze methode wordt ondersteund op Linux-systemen',
        tf2: 'Haal de SD-kaart uit de NanoKVM. Demonteer bij de FULL-versie eerst de behuizing.',
        tf3: 'Plaats de SD-kaart in een kaartlezer en verbind deze met uw computer.',
        tf4: 'Kopieer het imagebestand naar de /data directory op de SD-kaart.',
        tf5: 'Plaats de SD-kaart terug in de NanoKVM.'
      }
    },
    script: {
      title: 'Script',
      upload: 'Uploaden',
      run: 'Uitvoeren',
      runBackground: 'Op achtergrond uitvoeren',
      runFailed: 'Uitvoeren mislukt',
      delDesc: 'Weet u zeker dat u dit bestand wilt verwijderen?',
      delete: 'Verwijderen',
      close: 'Sluiten',
      unlockDesc:
        'Scripts draaien als root op de NanoKVM. Voer het wachtwoord van het webaccount in om een script te uploaden of uit te voeren.',
      terminalRequired:
        'Scripts hebben toegang tot de webterminal nodig. Schakel eerst de terminal in bij de instellingen.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'NanoKVM-terminal',
      serial: 'Seriële poort terminal',
      unlockTitle: 'Terminal ontgrendelen',
      unlockDesc: 'Voer het wachtwoord van uw webaccount in om een terminalsessie te starten',
      unlock: 'Ontgrendelen',
      unlockFailed: 'Terminal ontgrendelen mislukt',
      invalidCredentials: 'Ongeldige gebruikersnaam of wachtwoord',
      locked: 'Te veel pogingen, probeer later opnieuw',
      sessionClosed: 'Terminalsessie gesloten. Ontgrendel opnieuw om te verbinden.',
      sessionError: 'Terminalverbinding mislukt. Ontgrendel opnieuw om te proberen.',
      serialPort: 'Seriële poort',
      serialPortPlaceholder: 'Bijvoorbeeld /dev/ttyS1',
      baudrate: 'Baudrate',
      parity: 'Pariteit',
      parityNone: 'Geen',
      parityEven: 'Even',
      parityOdd: 'Oneven',
      flowControl: 'Debietregeling',
      flowControlNone: 'Geen',
      flowControlSoft: 'Software',
      flowControlHard: 'Hardware',
      dataBits: 'Databits',
      stopBits: 'Stopbits',
      open: 'Terminal openen'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Commando wordt verzonden...',
      sent: 'Commando verzonden',
      input: 'MAC-adres',
      ok: 'OK'
    },
    download: {
      input: 'URL van externe image',
      ok: 'OK',
      disabled:
        'Images kunnen nu niet worden gedownload of geüpload omdat de opslag niet beschrijfbaar is. Als er een image is gekoppeld, ontkoppel die dan en schakel daarna de virtuele schijf uit zodat de opslag weer beschrijfbaar wordt.',
      diskShared: 'Schakel de virtuele schijf uit om de image-download te gebruiken',
      mountedImage:
        'Dit image is gekoppeld, ontkoppel het voordat u een bestand met dezelfde naam uploadt',
      diskOff: 'Virtuele schijf uitschakelen',
      uploadbox: 'Zet het bestand hier neer of klik om te selecteren',
      inputfile: 'Afbeeldingsbestand',
      NoISO: 'Geen image',
      complete: 'Download voltooid',
      uploadComplete: 'Upload voltooid',
      downloading: 'Downloaden',
      uploading: 'Uploaden',
      failed: 'Overdracht mislukt',
      uploadFailed: 'Upload mislukt',
      stalled: 'Overdracht is vastgelopen, controleer de verbinding en probeer opnieuw',
      canceled: 'Upload geannuleerd',
      downloadCanceled: 'Download geannuleerd',
      cancel: 'Annuleren',
      remoteDisabled:
        'ISO-download op afstand is uitgeschakeld in Instellingen > Gebruiker > Voorkeuren',
      remoteFailed: 'ISO-download op afstand mislukt',
      sha256: 'Optionele SHA-256-controlesom',
      sha256Placeholder: 'Voer een SHA-256-controlesom van 64 tekens in',
      invalidSHA256: 'SHA-256 moet een hexadecimale tekenreeks van 64 tekens zijn',
      checksumFailed: 'Download mislukt: SHA-256-verificatie mislukt'
    },
    power: {
      title: 'Aan/uit',
      showConfirm: 'Bevestiging',
      showConfirmTip: 'Stroombedieningen vereisen een extra bevestiging',
      reset: 'Resetten',
      powerShort: 'Aan/uit-knop: kort indrukken',
      powerLong: 'Aan/uit-knop: lang indrukken',
      resetConfirm: 'Reset uitvoeren?',
      powerConfirm: 'Stroomactie uitvoeren?',
      okBtn: 'Ja',
      cancelBtn: 'Nee'
    },
    settings: {
      title: 'Instellingen',
      about: {
        title: 'Over',
        information: 'Informatie',
        ip: 'IP-adres',
        mdns: 'Lokaal adres',
        application: 'Applicatieversie',
        uptime: 'Uptime',
        community: 'Community',
        credit: 'Gebouwd op <a1>NanoKVM</a1> van Sipeed en <a2>Hardened NanoKVM</a2> van woffko',
        hostname: 'Apparaatnaam',
        changeIn: 'Te wijzigen in {{path}}',
        updateIn: 'Te updaten in {{path}}',
        toggleIn: 'In of uit te schakelen in {{path}}'
      },
      appearance: {
        title: 'Voorkeuren',
        display: 'Beeldscherm',
        language: 'Taal',
        languageDesc: 'Selecteer de taal voor de interface',
        webTitle: 'Webtitel',
        webTitleDesc: 'Pas de titel van de webpagina aan',
        layoutMode: 'Interface-indeling',
        layoutModeDesc: 'Gebruik de telefoon-/touch-indeling in deze browser',
        layoutAuto: 'Automatisch',
        layoutMobile: 'Telefoon',
        menuBar: {
          title: 'Menubalk',
          mode: 'Weergavemodus',
          modeDesc: 'Geef de menubalk weer op het scherm',
          modeOff: 'Uit',
          modeAuto: 'Automatisch verbergen',
          modeAlways: 'Altijd zichtbaar',
          keyboardLedStatus: 'Toetsvergrendelingsindicatoren',
          keyboardLedStatusDesc:
            'Toon de Num Lock-, Caps Lock- en Scroll Lock-status van de externe computer',
          icons: 'Submenupictogrammen',
          iconsDesc: 'Submenupictogrammen weergeven in de menubalk',
          terminalWarningTitle: 'Webterminal inschakelen?',
          terminalWarningDesc:
            'De terminal opent een root-shell in de browser. Schakel alleen in op een vertrouwd netwerk en schakel daarna weer uit.',
          terminalWarningConfirm: 'Inschakelen',
          remoteDownload: 'ISO op afstand downloaden',
          remoteDownloadWarningTitle: 'ISO-download op afstand inschakelen?',
          remoteDownloadWarningDesc:
            "NanoKVM haalt een ISO op van een URL en schrijft die naar /data. Schakel alleen in voor vertrouwde URL's en schakel daarna weer uit.",
          remoteDownloadWarningConfirm: 'Inschakelen'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Toetsvergrendelingsstatus van extern toetsenbord',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Aan',
        off: 'Uit',
        unknown: 'Onbekend'
      },
      device: {
        title: 'Apparaat',
        minutes: 'min',
        sections: {
          general: 'Algemeen',
          connectivity: 'Connectiviteit',
          hostConnection: 'Hostverbinding',
          inputOutput: 'Invoer en uitvoer'
        },
        oled: {
          title: 'OLED-timeout',
          description: 'OLED-scherm uitschakelen na',
          keepOn: 'OLED aanhouden',
          keepOnDescription: 'Het OLED-scherm nooit uitschakelen'
        },
        ssh: {
          description: 'Schakel SSH externe toegang in',
          tip: 'Stel een sterk wachtwoord in via Account > Wachtwoord voordat u deze optie inschakelt'
        },
        swap: {
          title: 'Swap',
          description: 'Een wisselbestand gebruiken als het geheugen opraakt',
          size: 'Swap-grootte',
          sizeDescription: 'Stel de grootte van het wisselbestand in',
          tip: 'Het inschakelen van deze functie kan de bruikbare levensduur van uw SD-kaart verkorten'
        },
        mouseJiggler: {
          title: 'Muisschommel',
          description: 'Voorkom dat de externe host in slaap valt',
          disable: 'Uitschakelen',
          absolute: 'Absolute modus',
          relative: 'Relatieve modus'
        },
        sessionLock: {
          title: 'Sessie vergrendelen bij inactiviteit',
          description: 'Na deze tijd opnieuw aanmelden vereisen'
        },
        mdns: {
          description: 'Schakel de mDNS detectieservice in',
          tip: 'Maakt het apparaat bereikbaar via zijn .local-naam. Niet nodig als u verbinding maakt via IP-adres of uw DNS de hostnaam al omzet.'
        },
        hdmi: {
          description: 'Schakel HDMI/monitoruitgang in',
          idleTimeoutTitle: 'Time-out voor inactieve opname',
          idleTimeoutDescription:
            'HDMI-opname stoppen nadat er gedurende deze tijd geen actieve kijkers zijn:'
        },
        hidOnly: 'HID-Only-modus',
        hidOnlyDesc:
          'Verbetert de compatibiliteit met de host als muis of toetsenbord niet meer reageren',
        hidOnlyTip:
          'De HID-Only-modus stopt met het emuleren van virtuele apparaten en behoudt alleen de basisbesturing van HID',
        disk: 'Virtuele schijf',
        diskDesc: 'SD-kaart koppelen aan de externe host',
        diskLocked: 'Uit zolang een image is gekoppeld, en aanzetten breekt het koppelen af',
        diskEnable: 'Virtuele schijf inschakelen',
        networkChange: 'Virtueel netwerk wijzigen',
        diskCancelMount:
          'Het inschakelen van de virtuele schijf annuleert de gekoppelde image. Doorgaan?',
        networkCancelMount:
          'Het wijzigen van het virtuele netwerk start de USB-verbinding opnieuw. Hierdoor wordt de gekoppelde image geannuleerd en de virtuele schijf ingeschakeld. Doorgaan?',
        diskTransferRunning:
          'Er loopt een image-overdracht. Wacht tot die klaar is voordat u de virtuele schijf inschakelt.',
        network: 'Virtueel netwerk',
        networkDesc: 'Koppel virtueel netwerk kaart aan de externe host',
        usbWakeup: 'USB-wekken',
        usbWakeupDesc: 'Sta toetsenbord- of muisgebeurtenissen toe om de externe host te wekken',
        usbWakeupTip: 'Schakel uit als de host herhaald USB wakeup-berichten logt',
        hostname: {
          description: 'Naam van dit apparaat op het netwerk',
          reachable: 'Bereikbaar op het lokale netwerk als {{address}}'
        },
        rebootRequired: 'Herstart vereist',
        rebootPending: 'Herstart vereist voor: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Systeemupdate'
        },
        reboot: 'Opnieuw opstarten',
        rebootDesc: 'Weet u zeker dat u NanoKVM opnieuw wilt opstarten?',
        poweroff: 'Uitschakelen',
        poweroffDesc:
          'Weet je zeker dat je NanoKVM wilt uitschakelen? Het is niet bereikbaar totdat het weer wordt ingeschakeld.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Verbinding',
        configuration: 'Configuratie',
        wifi: {
          title: 'Wi-Fi',
          description: 'Wi-Fi configureren',
          apMode: 'AP-modus is ingeschakeld, maak verbinding met Wi-Fi door de QR-code te scannen',
          connect: 'Wi-Fi verbinden',
          connectDesc1: 'Voer de netwerk-SSID en het wachtwoord in',
          disconnect: 'Weet u zeker dat u de netwerkverbinding wilt verbreken?',
          disconnectBtn: 'Verbinding verbreken',
          connected: 'Verbonden',
          ssid: 'Naam',
          password: 'Wachtwoord',
          joinBtn: 'Verbinden',
          cancelBtn: 'Annuleren'
        },
        tls: {
          description: 'HTTPS-protocol inschakelen',
          tip: 'Let op: HTTPS gebruiken kan de latentie verhogen, vooral in MJPEG-videomodus',
          restartTitle: 'De server wordt opnieuw opgestart',
          restartDesc:
            'De protocolwijziging start de server opnieuw op. De browser schakelt na {{seconds}} seconden over naar het nieuwe adres:',
          restartOk: 'Toepassen en opnieuw opstarten',
          confirmTitle: 'Nieuw protocol behouden?',
          confirmDesc:
            'De server draait nu op {{protocol}}. Hij keert over {{seconds}} seconden terug naar het vorige protocol als je het niet behoudt.',
          confirmKeep: 'Behouden',
          confirmRevert: 'Terug',
          reverting:
            'Terug naar het vorige protocol. De browser schakelt na {{seconds}} seconden over naar dat adres.',
          certTitle: 'Nieuw certificaat behouden?',
          certDesc:
            'De server gebruikt nu het nieuwe certificaat. Hij keert over {{seconds}} seconden terug naar het vorige als u het niet behoudt.',
          certReverted: 'Het vorige certificaat is terug'
        },
        trustedProxies: {
          section: 'Reverse proxy',
          title: "Vertrouwde proxy's",
          description:
            "Reverse proxy's die het apparaat vertrouwt voor het adres en protocol van de client",
          tip: "Een adres in de lijst bepaalt het clientadres dat de inlogbeperking en het logboek vastleggen, dus neem alleen proxy's op die u zelf beheert",
          none: 'Geen',
          edit: 'Bewerken',
          editRow: 'Lijst bewerken',
          editTitle: "Vertrouwde proxy's bewerken",
          editDescription: 'Voor het wijzigen van de lijst is uw wachtwoord nodig',
          dialogDescription:
            "Voer het adres van elke reverse proxy in zoals dit apparaat het ziet, of een bereik zoals 10.0.0.0/24. Een proxy in de lijst vertelt het apparaat welk clientadres en welk protocol moet worden gebruikt. Alles wat hij doorstuurt wordt geloofd, dus neem alleen proxy's op die u zelf beheert."
        },
        certificate: {
          title: 'Certificaat',
          desc: 'Waar het HTTPS-certificaat vandaan komt',
          requesting: 'Certificaat wordt aangevraagd',
          selfSigned: 'Zelfondertekend',
          domain: 'Domein',
          domainDesc: 'Moet naar dit apparaat wijzen, met poort 443 bereikbaar vanaf internet',
          domainTailscale: 'Ingesteld door Tailscale voor dit apparaat',
          domainInvalid: 'Gebruik een volledige domeinnaam, zoals kvm.example.org',
          email: 'E-mail',
          emailDesc: "Optioneel, voor berichten van Let's Encrypt",
          emailInvalid: 'Gebruik een adres zoals naam@example.org',
          validUntil: 'Geldig tot',
          valid: 'Geldig',
          expiresSoon: 'Verloopt binnenkort',
          expired: 'Verlopen',
          lastRenewal: 'Laatste verlenging',
          renewed: 'Verlengd',
          failed: 'Mislukt',
          renewNow: 'Nu verlengen',
          renewNowDesc: 'Een nieuw certificaat aanvragen zonder te wachten',
          renewBtn: 'Verlengen',
          applyTitle: 'Certificaat wijzigen',
          applyOk: 'Toepassen',
          applyAcme:
            "Het apparaat vraagt een certificaat aan bij Let's Encrypt. Let's Encrypt maakt vanaf internet verbinding met poort 443 om het te controleren, wat tot een minuut kan duren. Als de aanvraag mislukt, blijft het huidige certificaat in gebruik.",
          applyTailscale:
            'Het apparaat haalt een certificaat op bij Tailscale, wat tot een minuut kan duren. Als de aanvraag mislukt, blijft het huidige certificaat in gebruik.',
          applySelfSigned:
            'Het apparaat keert terug naar zijn eigen zelfondertekende certificaat. Browsers waarschuwen daarvoor.',
          openTitle: 'Nieuw adres openen',
          openDesc:
            'Het certificaat is klaar. Open het adres hieronder en meld u aan om het te behouden. Zonder uw bevestiging binnen 3 minuten komt het vorige certificaat terug.',
          openOk: 'Openen',
          blockedClock:
            'Certificaten kunnen pas worden aangevraagd wanneer de klok van het apparaat is gesynchroniseerd',
          blockedParanoid: 'De firewallmodus Paranoïde blokkeert certificaataanvragen',
          tailscaleUnavailable:
            'Tailscale draait niet, of HTTPS-certificaten zijn niet ingeschakeld voor het tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'Configureer DNS-servers voor NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Configureer IPv4-adressering voor de bekabelde interface',
          servers: 'Servers',
          dhcp: 'DHCP',
          manual: 'Handmatig',
          apply: 'Toepassen',
          invalid: 'Voer een geldig IPv4- of IPv6-adres in',
          invalidNetwork: 'Voer een geldig IPv4-adres, subnetmasker en router in',
          saved: 'DNS-instellingen opgeslagen',
          redirecting: 'Netwerkinstellingen opgeslagen. Nieuw adres wordt geopend...',
          saveFailed: 'DNS-instellingen opslaan mislukt',
          unsaved: 'Niet-opgeslagen wijzigingen',
          maxServers: 'Maximaal {{count}} DNS-servers toegestaan',
          dhcpServersDescription: 'DNS-servers worden automatisch via DHCP verkregen',
          manualServersDescription: 'IPv4- en IPv6-servers worden ondersteund',
          interface: 'Interface',
          ipAddress: 'IP-adres',
          subnetMask: 'Subnetmasker',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'IPv6-adressering configureren voor de bekabelde interface',
          disabled: 'Uitgeschakeld',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Handmatig',
          interface: 'Interface',
          state: 'Status',
          router: 'Router',
          addresses: 'Adressen',
          dhcpv6Client: 'DHCPv6-client',
          notInstalled: 'Niet geïnstalleerd',
          ipAddress: 'IPv6-adres',
          prefix: 'Prefix',
          invalidManual: 'Voer een geldig IPv6-adres, prefix en router in',
          clientMissing:
            'De DHCPv6-client is niet geïnstalleerd. Installeer eerst de bijbehorende raw-systeemupdate.',
          saved: 'IPv6-instellingen opgeslagen',
          saveFailed: 'Opslaan van IPv6-instellingen mislukt',
          unsaved: 'Niet-opgeslagen wijzigingen'
        }
      },
      system: {
        title: 'Systeem',
        performance: {
          processor: 'Processor',
          overdrive: {
            title: 'Overklokken',
            description:
              'Opstarten met de hogere klokfrequenties voor processor en video die de fabrikant specificeert',
            tip: 'Als het apparaat met overklokken niet start, moet de SD-kaart opnieuw worden beschreven',
            unavailable: 'Niet opgenomen in dit systeemimage',
            keepTitle: 'Overdrive behouden na updates',
            keepDescription:
              'Een systeemupdate zet het apparaat terug op de standaardklokken, tenzij dit is ingeschakeld',
            confirmTitle: 'Overklokken inschakelen?',
            confirmText:
              'Als het apparaat met overklokken niet start, moet u de SD-kaart opnieuw beschrijven om het te herstellen. De wijziging gaat in na de volgende herstart.',
            confirmOk: 'Inschakelen'
          },
          watchdog: {
            title: 'Hardware-watchdog',
            description: 'Start het apparaat automatisch opnieuw op wanneer het niet meer reageert',
            unavailable: 'Niet opgenomen in dit systeemimage',
            notRunning: 'Draait momenteel niet',
            lastRestart: 'Laatste herstart',
            lastRestartCaption: 'Meest recente reden waarom het systeem opnieuw is opgestart',
            reasonPowerOn: 'Ingeschakeld',
            reasonRestart: 'Herstart aangevraagd',
            reasonWatchdog: 'Watchdog-reset',
            reasonOverheat: 'Oververhittingsbeveiliging',
            reasonUnknown: 'Onbekend'
          },
          recovery: 'Herstel',
          memory: 'Geheugen'
        },
        monitor: {
          processorClock: 'CPU-subsysteem',
          videoClock: 'Videosubsysteem',
          videoClockCaption: 'Videoklokfrequentie',
          cpuClockCaption: 'CPU-klokfrequentie',
          overdrive: 'Overklokken',
          temperature: 'Temperatuur',
          lastMinutes: 'Laatste 5 minuten',
          ram: 'RAM',
          off: 'Uit',
          ramHistory: 'RAM-gebruik',
          cpuLoad: 'CPU-belasting',
          cpuLoadCaption: 'Gebruiker {{user}} procent, systeem {{system}} procent',
          cpuUtilization: 'CPU-gebruik',
          swapUtilization: 'Swapgebruik',
          swapSizeLastMinutes: '{{size}}, laatste 5 minuten',
          percent: '{{percent}} procent',
          percentUsed: '{{percent}} procent gebruikt',
          sizeOf: '{{used}} van {{total}}',
          systemPartition: 'Systeempartitie',
          dataPartition: 'Datapartitie',
          unavailable: 'Niet beschikbaar',
          noReadings: 'Het apparaat geeft geen metingen terug',
          refresh: 'Wordt elke seconde bijgewerkt zolang deze pagina open is'
        },
        sections: {
          time: 'Tijd',
          firewall: 'Firewall',
          systemLog: 'Logging',
          performance: 'Prestaties',
          monitor: 'Monitor',
          services: 'Diensten',
          webInterface: 'Beveiligde webtoegang'
        },
        time: {
          saveFailed: 'Kan tijdinstellingen niet opslaan',
          saved: 'Tijdinstellingen opgeslagen',
          syncFailed: 'Kan tijd niet synchroniseren',
          synced: 'Tijd gesynchroniseerd',
          invalidServers: 'Voer ten minste één NTP-server in',
          maxServers: 'Maximaal {{count}} NTP-servers toegestaan',
          refresh: 'Vernieuwen',
          syncNow: 'Synchroniseren',
          syncNowDesc: 'Stel de klok nu in via de NTP-servers',
          save: 'Opslaan',
          ntp: {
            title: 'NTP',
            description: 'Synchroniseer apparaattijd vanaf geconfigureerde NTP-servers'
          },
          networkTime: 'Netwerktijd',
          clock: {
            title: 'Klok',
            description: 'Stel de lokale tijdzone in die logs en UI gebruiken',
            current: 'Huidige tijd',
            timezone: 'Tijdzone'
          },
          servers: {
            title: 'NTP-servers',
            description:
              'Gebruik de standaard openbare servers, uw lokale router of eigen NTP-servers',
            useRouter: 'Router gebruiken',
            useDefaults: 'Standaarden gebruiken',
            presets: 'Servervoorinstellingen',
            presetsDesc: 'Vervang de serverlijst door een voorinstelling'
          }
        },
        firewall: {
          saveFailed: 'Kan firewallinstellingen niet toepassen',
          saved: 'Firewallinstellingen toegepast',
          cancel: 'Annuleren',
          refresh: 'Vernieuwen',
          backends: 'Backends',
          enableHttpsFirst:
            'Schakel HTTPS in voordat u de firewallmodus Beperkt of Paranoïde inschakelt',
          httpsRequired:
            'De modi Beperkt en Paranoïde zijn uitgeschakeld totdat HTTPS is ingeschakeld bij Instellingen > Netwerk > Diensten',
          mode: {
            title: 'Firewallmodus',
            baseline: 'Basis',
            baselineDesc:
              'Open compatibiliteitsprofiel. De firewall draait, maar inkomende bronnen worden niet beperkt. Alleen gebruiken op vertrouwde netwerken.',
            moderate: 'Gematigd',
            moderateDesc:
              'Standaardprofiel. Behoudt de Basis-diensten, maar accepteert nieuwe inkomende verbindingen alleen vanuit privé-, link-local- of loopbackbereiken. Uitgaande toegang blijft open.',
            restricted: 'Beperkt',
            restrictedDesc:
              'Alleen lokale HTTPS en SSH, plus uitgaande DNS, NTP, syslog en online updates. DHCP en essentieel IPv6-verkeer blijven beschikbaar. WebRTC is geblokkeerd.',
            paranoid: 'Paranoïde',
            paranoidDesc:
              'Alleen lokale HTTPS-toegang. Blokkeert SSH, HTTP, online updates en andere uitgaande netwerkfuncties. Het uploaden van offline updates en al klaargezette installaties blijven beschikbaar.',
            current: 'Huidig',
            default: 'Standaard',
            localOnly: 'Alleen lokaal',
            openTag: 'Inkomend open',
            httpsRequiredTag: 'HTTPS vereist',
            outboundOpen: 'Uitgaand open',
            outboundLimited: 'Uitgaand beperkt',
            httpsOnly: 'Alleen HTTPS'
          },
          moderate: {
            apply: 'Overschakelen naar Gematigd'
          },
          restricted: {
            enable: 'Beperkt inschakelen',
            confirmTitle: 'Firewallmodus Beperkt inschakelen?',
            confirmDesc:
              'Inkomende beheerstoegang wordt voor HTTPS en SSH beperkt tot private IPv4-, IPv4 link-local/loopback-, IPv6 link-local- of IPv6 loopback-bronbereiken. Openbare bronbereiken zijn niet toegestaan. Uitgaande DNS, NTP, externe syslog, online-updates, DHCP, bestaande verbindingen en essentieel IPv6-besturingsverkeer blijven beschikbaar. WebRTC/ICE UDP en ander inkomend/uitgaand verkeer worden geblokkeerd.'
          },
          paranoid: {
            enable: 'Paranoïde inschakelen',
            confirmTitle: 'Firewallmodus Paranoïde inschakelen?',
            confirmDesc:
              'Alleen HTTPS-toegang vanuit private IPv4, IPv4 link-local/loopback, IPv6 link-local of IPv6 loopback-bronbereiken blijft beschikbaar. SSH, HTTP, mDNS, NTP, GitHub-downloads en ander verkeer worden geblokkeerd behalve minimaal DHCP/IPv6-controleverkeer.'
          },
          baseline: {
            apply: 'Overschakelen naar Basis',
            confirmTitle: 'Overschakelen naar de open modus Basis?',
            confirmDesc:
              'De firewalldienst blijft actief, maar de beperking tot lokale bronbereiken vervalt. Openbare bronbereiken kunnen blootgestelde NanoKVM-diensten bereiken als het netwerk ze routeert.'
          },
          rules: {
            title: 'Huidige regels',
            empty: 'Geen regels'
          }
        },
        saveChanges: 'Wijzigingen opslaan',
        unsaved: 'Niet-opgeslagen wijzigingen'
      },
      systemLog: {
        saveFailed: 'Kan loginstellingen niet opslaan',
        saved: 'Loginstellingen opgeslagen',
        invalidHost: 'Voer een syslog-serverhost in',
        logLoadFailed: 'Kan logs niet laden',
        save: 'Opslaan',
        test: 'Testlog verzenden',
        testSent: 'Testlog verzonden',
        testFailed: 'Kan testlog niet verzenden',
        remote: {
          title: 'Remote logging',
          forward: 'Systeemlog doorsturen',
          description: 'Systeemberichten doorsturen naar een externe server',
          host: 'Server',
          hostDesc: 'Hostnaam of IPv4-adres van de syslog-server',
          port: 'Poort',
          protocol: 'UDP-poort van de syslog-server'
        },
        local: {
          title: 'Systeemlogbuffer',
          description:
            'Huidige logs worden in RAM bewaard op {{path}} om schrijven naar de SD-kaart te vermijden',
          priority: 'Minimale prioriteit',
          priorityDesc: 'Minimale urgentie om een bericht te loggen',
          buffer: 'Buffergrootte',
          bufferDesc: 'Loggrootte waarbij het bestand wordt geroteerd',
          rotations: 'Rotaties',
          rotationsDesc: 'Aantal geroteerde logbestanden dat wordt bewaard',
          compact: 'Compacte uitvoer',
          compactDesc: 'Hostnaam en facility weglaten uit elke regel',
          stripTimestamps: 'Tijdstempels verwijderen',
          stripTimestampsDesc:
            'Door de afzender toegevoegde tijdstempels verwijderen; syslog voegt zijn eigen toe'
        },
        kernel: {
          title: 'Kernel-logging',
          enabled: 'Kernellog doorsturen',
          enabledDesc: 'Kernelberichten vastleggen in de systeemlog',
          consoleLevel: 'Consoleniveau',
          consoleLevelDesc: 'Minimale urgentie om een kernelbericht op de console af te drukken'
        },
        viewer: {
          title: 'Systeemlog',
          refresh: 'Vernieuwen',
          empty: 'Geen logregels',
          truncated: 'Alleen de nieuwste loggegevens worden getoond',
          linesUnit: 'regels'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Kritiek',
          '3': '3 - Fout',
          '4': '4 - Waarschuwing',
          '5': '5 - Melding',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Alles'
        }
      },
      user: {
        title: 'Gebruiker'
      },
      networking: {
        title: 'Netwerk'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Versleutelde tunnel',
        device: 'Dit apparaat',
        description: 'Open deze KVM via een WireGuard-tunnel',
        unavailable: 'WireGuard is niet geïnstalleerd op dit apparaat',
        blocked: 'De firewallmodus Paranoïde blokkeert WireGuard',
        needsKey: 'Stel een privésleutel in voordat u WireGuard inschakelt',
        saved: 'WireGuard-instellingen opgeslagen',
        save: 'Wijzigingen opslaan',
        unsaved: 'Niet-opgeslagen wijzigingen',
        invalid: 'Controleer de gemarkeerde velden',
        invalidAddress: 'Voer een adres met masker in, zoals 10.0.0.1/24',
        invalidKey: 'Voer een WireGuard-sleutel van 44 tekens in',
        invalidEndpoint: 'Voer een hostnaam of IP-adres in',
        invalidPort: 'Voer een poort van 1 tot 65535 in',
        invalidRanges: 'Gebruik IPv4-bereiken zoals 10.0.0.0/24, niet 0.0.0.0/0',
        status: {
          connected: 'Verbonden',
          waiting: 'Wachten op de peer',
          stopped: 'Gestopt',
          handshake: 'Laatste handshake {{time}}'
        },
        privateKey: {
          title: 'Privésleutel',
          description: 'Blijft op dit apparaat en wordt nooit meer getoond',
          set: 'Ingesteld',
          notSet: 'Niet ingesteld',
          setBtn: 'Instellen',
          generate: 'Genereren',
          remove: 'Verwijderen',
          modalTitle: 'Privésleutel instellen',
          modalDescription: 'De sleutel wordt op dit apparaat opgeslagen en nooit meer getoond',
          placeholder: 'Plak de privésleutel',
          generateConfirmTitle: 'Een nieuwe privésleutel genereren?',
          generateConfirmDesc:
            'De huidige sleutel werkt dan niet meer. Voeg daarna de nieuwe openbare sleutel toe aan de peer.',
          removeConfirmTitle: 'De privésleutel verwijderen?',
          removeConfirmDesc:
            'WireGuard wordt uitgeschakeld en blijft uit tot er een nieuwe sleutel is ingesteld.'
        },
        publicKey: {
          title: 'Openbare sleutel',
          description: 'Voeg deze toe aan de configuratie van de peer'
        },
        address: {
          title: 'Adres',
          description: 'KVM-adres in de tunnel en het bijbehorende masker'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Openbare sleutel',
          publicKeyDescription: 'Openbare sleutel van de peer waarmee u verbinding maakt',
          server: 'Server',
          serverDescription: 'Hostnaam of IP-adres van de peer',
          port: 'Poort',
          portDescription: 'UDP-poort van de peer, meestal 51820',
          allowedIps: "Toegestane IP's",
          allowedIpsDescription: 'Adres of bereik van de peer in de tunnel, zoals 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Seconden tussen keepalive-pakketten, nodig achter een router'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Open deze KVM via uw Tailscale-netwerk',
        service: 'Service',
        performance: 'Prestaties',
        memory: {
          title: 'Geheugenoptimalisatie',
          tip: 'Houdt het geheugengebruik van Tailscale laag, wat helpt op een apparaat met weinig RAM. Start Tailscale opnieuw op om de wijziging door te voeren.'
        },
        swap: {
          title: 'Wisselbestand',
          tip: 'Als de problemen aanhouden nadat u geheugenoptimalisatie hebt ingeschakeld, probeer dan het wisselbestand in te schakelen',
          sizeTip:
            'Hiermee wordt de bestandsgrootte ingesteld op 128MB; pas deze aan via Instellingen > Systeem > Prestaties'
        },
        restartTitle: 'Tailscale opnieuw opstarten',
        restartDesc: 'Start de service opnieuw op',
        restartBtn: 'Opnieuw opstarten',
        restart: 'Weet u zeker dat u Tailscale opnieuw wilt opstarten?',
        stopTitle: 'Tailscale stoppen',
        stopBtn: 'Stoppen',
        stop: 'Weet u zeker dat u Tailscale wilt stoppen?',
        stopDesc: 'Stopt de service en voorkomt dat die bij het opstarten start',
        loading: 'Laden...',
        notInstall: 'Tailscale niet gevonden, installeer het',
        install: 'Installeren',
        installing: 'Installeren bezig',
        failed: 'Installatie mislukt',
        retry: 'Vernieuw en probeer opnieuw, of installeer handmatig.',
        download: 'Download het',
        package: 'installatiepakket',
        unzip: 'en pak het uit',
        upTailscale: 'Upload tailscale naar NanoKVM directory /usr/bin/',
        upTailscaled: 'Upload tailscaled naar NanoKVM directory /usr/sbin/',
        refresh: 'Vernieuw huidige pagina',
        notRunning: 'Tailscale is niet actief. Start het programma om door te gaan.',
        run: 'Start',
        notLogin:
          'Het apparaat is nog niet gekoppeld. Log in en koppel dit apparaat aan uw account.',
        urlPeriod: 'Deze url is 10 minuten geldig',
        login: 'Inloggen',
        loginSuccess: 'Inloggen gelukt',
        deviceName: 'Apparaatnaam',
        deviceIP: 'Apparaat IP',
        account: 'Account',
        logout: 'Uitloggen',
        logoutDesc: 'Weet u zeker dat u wilt uitloggen?',
        uninstall: 'Tailscale verwijderen',
        uninstallDesc: 'Weet u zeker dat u Tailscale wilt verwijderen?',
        okBtn: 'Ja',
        cancelBtn: 'Nee'
      },
      update: {
        title: 'Updates',
        currentVersion: 'Huidige versie',
        latestVersion: 'Nieuwste versie',
        queryFailed: 'Ophalen versie mislukt',
        updateFailed: 'Update mislukt',
        paranoidBlocked: 'Online-updates worden geblokkeerd door firewallmodus Paranoïde',
        paranoidBlockedDesc:
          'GitHub-controles en downloads vereisen uitgaande netwerktoegang. Offline upload en al voorbereide installaties blijven beschikbaar.',
        available: 'Er is een update beschikbaar. Weet u zeker dat u wilt updaten?',
        updating: 'Update gestart',
        confirm: 'Bevestigen',
        cancel: 'Annuleren',
        badge: {
          checking: 'Controleren',
          latest: 'Up-to-date',
          available: 'Update beschikbaar',
          failed: 'Controle mislukt',
          local: 'Lokaal'
        },
        application: {
          title: 'Applicatie'
        },
        system: {
          queryFailed: 'Systeemversie ophalen mislukt',
          appUpdateRequired:
            'Werk de applicatie bij naar {{version}} voordat u deze systeemupdate installeert',
          requiredAppVersion: 'Vereiste applicatieversie',
          downloadFailed: 'Download of verificatie mislukt',
          available: 'Er is een update voor het basissysteem beschikbaar.',
          downloading: 'Systeemupdate downloaden en verifiëren...',
          downloadVerify: 'Downloaden en verifiëren',
          installing: 'Voorbereide systeemupdate installeren...',
          install: 'Installeren',
          installFailed: 'Installatie mislukt',
          installConfirmTitle: 'Systeemupdate installeren?',
          installConfirmDesc:
            'Dit vervangt basissysteembestanden uit de geverifieerde bundel. Herstart is vereist.',
          rawInstallConfirmDesc:
            'Deze geverifieerde bundel schrijft raw boot/rootfs-images naar de SD-kaartpartities en herstart automatisch. Schrijven kan enkele minuten duren; houd de voeding aangesloten.',
          rawInstallWarning:
            'Er is geen automatische rollback voor raw partitie-updates. Als booten mislukt, herstel de SD-kaart handmatig.',
          rawWaitTitle: 'Systeemupdate installeren',
          rawWaitWriting: 'Het nieuwe systeem wordt naar de SD-kaart geschreven',
          rawWaitRestarting:
            'Het apparaat start opnieuw op. Deze pagina wordt opnieuw geladen zodra het apparaat weer bereikbaar is.',
          rawWaitDesc:
            'Dit duurt ongeveer drie minuten. Laat de voeding aangesloten en sluit deze pagina niet.',
          rawWaitSlow:
            'Dit duurt langer dan verwacht. Wacht nog een paar minuten voordat u de stroom uitschakelt.',
          rebootRequired: 'Herstart is vereist om deze systeemstatus te activeren.',
          rollingBack: 'Systeemupdate terugrollen...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback voorbereid',
          rollbackFailed: 'Rollback mislukt',
          rollbackConfirmTitle: 'Systeemupdate terugrollen?',
          rollbackConfirmDesc:
            'Dit herstelt bestanden uit de laatste systeemupdate-backup. Herstart is vereist.',
          stagedDesc: 'De systeemupdate is gedownload en geverifieerd, u kunt hem nu installeren',
          refresh: 'Vernieuwen',
          releaseNotes: 'Release-opmerkingen',
          systemVersion: 'Systeemversie',
          kernel: 'Kernel',
          stagedVersion: 'Voorbereide versie',
          archive: 'Archief',
          requiredFree: 'Vereiste vrije ruimte',
          fileCount: 'Bestanden',
          rawImages: 'Raw images',
          progress: 'Voortgang',
          progressMessage: 'Voortgangsbericht',
          pendingVersion: 'Wachtende versie',
          bootHealth: 'Bootstatus',
          healthy: 'Gezond',
          unhealthy: 'Aandacht vereist',
          rollbackBackup: 'Rollback-backup'
        },
        offline: {
          title: 'Applicatiepakket uploaden',
          desc: 'Een applicatiepakket vanaf deze computer installeren. Daarna start de server opnieuw op.',
          installTitle: 'Applicatie-update installeren?',
          installDesc:
            'De applicatie wordt vervangen en de server start opnieuw op. Je moet daarna opnieuw inloggen.'
        },
        local: {
          title: 'Systeempakket uploaden',
          desc: 'Een systeempakket vanaf deze computer installeren. Eén bestand bevat het archief en de ondertekende metagegevens.',
          choose: 'Bestand kiezen',
          invalidFile: 'Selecteer een pakket dat eindigt op .tar of .tar.gz.',
          diskTitle: 'Virtuele schijf uitschakelen?',
          diskWarn:
            'Het pakket wordt opgeslagen op /data, dat alleen-lezen is zolang de virtuele schijf aanstaat. Na het uitschakelen heeft de computer geen toegang meer tot /data. Doorgaan?',
          uploading: 'Uploaden',
          verifying: 'Pakket controleren en klaarzetten',
          keyTitle: 'Lokale updatesleutel',
          keyDesc: 'Openbare sleutel in PEM-indeling die zelfgebouwde pakketten mag ondertekenen',
          keyNone: 'Geen sleutel ingesteld',
          keySet: 'Sleutel instellen',
          keyRemove: 'Verwijderen',
          signer: 'Ondertekend door',
          section: 'Lokale updates',
          keyRequired: 'Lokale sleutel vereist'
        }
      },
      account: {
        title: 'Account',
        webAccount: 'Webaccountnaam',
        password: 'Wachtwoord',
        passwordDesc: 'Wijzig het wachtwoord waarmee u zich aanmeldt bij de webinterface',
        updateBtn: 'Wijzigen',
        logoutBtn: 'Afmelden',
        logoutDesc: 'Weet u zeker dat u wilt uitloggen?',
        okBtn: 'Ja',
        cancelBtn: 'Nee',
        session: {
          title: 'Sessie'
        },
        logoutOnClose: {
          title: 'Uitloggen als de browser wordt gesloten',
          description:
            'Beëindig de sessie wanneer de browser wordt gesloten in plaats van haar open te houden'
        },
        totp: {
          title: 'Tweefactorauthenticatie',
          authenticator: 'Authenticator-app',
          description: 'Vereis naast uw wachtwoord een tijdgebonden code uit een authenticator-app',
          required: 'Vereist door beleid',
          disable: 'Uitschakelen',
          enableTitle: 'Tweefactorauthenticatie instellen',
          enableDescription:
            'Bevestig uw wachtwoord om door te gaan. Het is nodig bij elke wijziging van de tweede factor.',
          continue: 'Doorgaan',
          disableTitle: 'Tweefactorauthenticatie uitschakelen?',
          disableDescription:
            'Uw account wordt dan alleen nog door het wachtwoord beschermd. Bevestig met uw wachtwoord om door te gaan.',
          disableFailed: 'Tweefactorauthenticatie kon niet worden uitgeschakeld',
          passwordPlaceholder: 'Huidig wachtwoord',
          enrollFailed: 'Instellen kon niet worden gestart',
          invalidCode: 'Die code komt niet overeen. Probeer de volgende.',
          scan: 'Scan dit met uw authenticator-app.',
          manualEntry: 'Of voer deze sleutel handmatig in:',
          codePlaceholder: 'Voer de 6-cijferige code in om te bevestigen',
          confirm: 'Bevestigen',
          cancel: 'Annuleren',
          backupTitle: 'Bewaar nu uw back-upcodes',
          backupDescription:
            'Elke code werkt maar één keer en wordt niet opnieuw getoond. Ze zijn de enige weg terug als u uw authenticator-app kwijtraakt, en ze blijven werken als de klok van het apparaat niet is gesynchroniseerd.',
          copy: 'Kopiëren',
          copied: 'Back-upcodes gekopieerd',
          savedThem: 'Ik heb ze bewaard',
          remaining: 'Nog {{remaining}} back-upcodes over',
          clockUnsynced:
            'De klok van het apparaat is nog niet gesynchroniseerd. Synchroniseer de tijd via Instellingen > Systeem > Tijd voordat u begint met instellen.',
          noBackupCodes:
            'Er zijn geen back-upcodes meer. Kies Genereren om een nieuwe set uit te geven.',
          regenerate: 'Nieuwe back-upcodes',
          generate: 'Genereren',
          regenerateTitle: 'Nieuwe back-upcodes uitgeven?',
          regenerateDescription:
            'Uw huidige back-upcodes werken dan niet meer. Bevestig met uw wachtwoord om door te gaan.',
          regenerateFailed: 'Nieuwe back-upcodes konden niet worden uitgegeven',
          download: 'Downloaden',
          copyFailed: 'Kopiëren is mislukt. Selecteer de codes en kopieer ze handmatig.',
          requireTitle: 'Tweefactorauthenticatie verplicht stellen',
          requireDescription:
            'Voorkomt dat tweefactorauthenticatie wordt uitgeschakeld, en een account zonder tweefactorauthenticatie moet die instellen voordat het apparaat wordt gebruikt',
          requireFailed: 'De vereiste kon niet worden gewijzigd',
          requiredTitle: 'Tweefactorauthenticatie is vereist',
          requiredDescription:
            'Dit apparaat is ingesteld om een tweede factor te vereisen, maar uw account heeft er nog geen ingesteld. Stel die nu in om door te gaan.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw-assistent',
      empty: 'Beschrijf een taak om te beginnen',
      inputPlaceholder: 'Beschrijf wat u wilt dat PicoClaw doet',
      newConversation: 'Nieuw gesprek',
      processing: 'Verwerken...',
      agent: {
        defaultTitle: 'Algemene assistent',
        defaultDescription: 'Algemene hulp bij chatten, zoeken en werkruimte',
        kvmTitle: 'Bediening op afstand',
        kvmDescription: 'Bedien de externe host via NanoKVM',
        switched: 'Agentrol gewijzigd',
        switchFailed: 'Kan agentrol niet wisselen'
      },
      send: 'Verzenden',
      cancel: 'Annuleren',
      status: {
        connecting: 'Verbinden met gateway...',
        connected: 'PicoClaw-sessie verbonden',
        disconnected: 'PicoClaw-sessie gesloten',
        stopped: 'Stopverzoek verzonden',
        runtimeStarted: 'PicoClaw runtime gestart',
        runtimeStartFailed: 'Kan PicoClaw runtime niet starten',
        runtimeStopped: 'PicoClaw runtime gestopt',
        runtimeStopFailed: 'Kan PicoClaw runtime niet stoppen'
      },
      connection: {
        runtime: {
          checking: 'Controleren',
          ready: 'Runtime gereed',
          stopped: 'Runtime gestopt',
          unavailable: 'Runtime niet beschikbaar',
          configError: 'Configuratiefout'
        },
        transport: {
          connecting: 'Verbinden',
          connected: 'Verbonden'
        },
        run: {
          idle: 'Inactief',
          busy: 'Bezet'
        }
      },
      error: {
        lockHeld: 'PicoClaw wordt in een ander venster gebruikt',
        takenOver: 'Een ander venster heeft PicoClaw overgenomen',
        authFailed: 'PicoClaw heeft de verbinding geweigerd',
        upstreamClosed: 'De verbinding met PicoClaw is verbroken'
      },
      tool: {
        screenshot: 'Een schermafbeelding maken',
        loadImage: 'De schermafbeelding bekijken',
        actions: 'De host bedienen',
        generic: '{{name}} gebruiken',
        type: '{{text}} typen',
        hotkey: '{{keys}} indrukken',
        click: 'Klikken',
        doubleClick: 'Dubbelklikken',
        move: 'De muis bewegen',
        drag: 'Slepen',
        scroll: 'Scrollen',
        wait: 'Wachten'
      },
      message: {
        toolAction: 'Actie',
        observation: 'Observatie',
        screenshot: 'Schermafbeelding'
      },
      overlay: {
        locked: 'PicoClaw bestuurt het apparaat. Handmatige invoer is gepauzeerd.'
      },
      install: {
        install: 'PicoClaw installeren',
        installing: 'PicoClaw installeren',
        success: 'PicoClaw is succesvol geïnstalleerd',
        failed: 'Kan PicoClaw niet installeren',
        uninstalled: 'PicoClaw is succesvol verwijderd',
        uninstallFailed: 'Verwijderen mislukt',
        requiredTitle: 'PicoClaw is niet geïnstalleerd',
        requiredDescription: 'Installeer PicoClaw voordat u de runtime van PicoClaw start.',
        progressDescription: 'PicoClaw wordt gedownload en geïnstalleerd.',
        stages: {
          preparing: 'Voorbereiden',
          downloading: 'Downloaden',
          extracting: 'Uitpakken',
          verifying: 'Verifiëren',
          installing: 'Installeren',
          installed: 'Geïnstalleerd',
          install_timeout: 'Time-out',
          install_failed: 'Mislukt'
        }
      },
      model: {
        requiredTitle: 'Modelconfiguratie is vereist',
        requiredDescription: 'Configureer het PicoClaw-model voordat u PicoClaw chat gebruikt.',
        docsTitle: 'Configuratiehandleiding',
        docsDesc: 'Ondersteunde modellen en protocollen',
        menuLabel: 'Model configureren',
        modelIdentifier: 'Modelidentificatie',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API-basis-URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API-sleutel',
        apiKeyPlaceholder: 'Voer de API-sleutel van het model in',
        apiKeyKeepPlaceholder: 'Laat leeg om de huidige sleutel te behouden',
        save: 'Opslaan',
        saving: 'Opslaan',
        saved: 'Modelconfiguratie opgeslagen',
        saveFailed: 'Kan de modelconfiguratie niet opslaan',
        invalid: 'Model-ID, API-basis-URL en API-sleutel zijn vereist'
      },
      uninstall: {
        confirmTitle: 'PicoClaw verwijderen',
        confirmContent:
          'Weet u zeker dat u PicoClaw wilt verwijderen? Hiermee worden het uitvoerbare bestand en alle configuratiebestanden verwijderd.',
        confirmOk: 'Verwijderen'
      },
      history: {
        title: 'Geschiedenis',
        loading: 'Sessies laden...',
        emptyTitle: 'Nog geen geschiedenis',
        emptyDescription: 'Eerdere PicoClaw sessies verschijnen hier.',
        loadFailed: 'Kan de sessiegeschiedenis niet laden',
        deleteFailed: 'Kan sessie niet verwijderen',
        deleteConfirmTitle: 'Sessie verwijderen',
        deleteConfirmContent: 'Weet u zeker dat u "{{title}}" wilt verwijderen?',
        deleteConfirmOk: 'Verwijderen',
        messageCount_one: '{{count}} bericht',
        messageCount_other: '{{count}} berichten'
      },
      config: {
        startRuntime: 'Start PicoClaw',
        stopRuntime: 'Stop PicoClaw',
        stopConfirm: 'Weet u zeker dat u PicoClaw wilt stoppen?'
      },
      start: {
        title: 'Start PicoClaw',
        description: 'Start de runtime om de PicoClaw assistent te gaan gebruiken.'
      }
    },
    error: {
      title: 'Er is een probleem opgetreden',
      refresh: 'Vernieuwen'
    },
    fullscreen: {
      toggle: 'Volledig scherm schakelen'
    },
    menu: {
      collapse: 'Menu samenvouwen'
    }
  }
};

export default nl;
