const se = {
  translation: {
    common: {
      confirm: 'Bekräfta',
      cancel: 'Avbryt',
      close: 'Stäng',
      save: 'Spara',
      discard: 'Förkasta',
      delete: 'Ta bort',
      actionFailed: 'Åtgärden misslyckades',
      loading: 'Läser in inställningar från enheten...',
      loadFailed: 'Det gick inte att läsa in inställningarna från enheten',
      retry: 'Försök igen'
    },
    head: {
      desktop: 'Fjärrskrivbord',
      login: 'Logga in',
      firstSetup: 'Första konfiguration',
      changePassword: 'Byt lösenord',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Logga in',
      placeholderUsername: 'Användarnamn',
      placeholderPassword: 'Lösenord',
      placeholderPassword2: 'Vänligen ange lösenordet igen',
      noEmptyUsername: 'Användarnamn krävs',
      noEmptyPassword: 'Lösenord krävs',
      invalidUser: 'Ogiltigt användarnamn eller lösenord',
      locked: 'För många inloggningar, försök igen senare',
      globalLocked: 'System under skydd, försök igen senare',
      error: 'Oväntat fel',
      changePassword: 'Byt lösenord',
      changePasswordDesc: 'För din enhets säkerhet, byt lösenord',
      differentPassword: 'Lösenorden matchar inte',
      illegalUsername: 'Användarnamnet innehåller ogiltiga tecken',
      illegalPassword:
        'Lösenordet måste vara minst 8 tecken och får inte innehålla citattecken eller snedstreck',
      forgetPassword: 'Glömt lösenord',
      ok: 'Ok',
      cancel: 'Avbryt',
      loginButtonText: 'Logga in',
      setupTitle: 'Skapa administratörskonto',
      setupDescription:
        'Det finns inget webbkonto på den här enheten ännu. Skapa det första administratörskontot för att fortsätta.',
      setupRecovery: 'Om lösenordet förloras kräver återställning att SD-kortet skrivs om',
      setupButtonText: 'Skapa konto',
      tips: {
        hardenedRecovery:
          'Denna Hardened-image stöder inte lösenordsåterställning via BOOT-knappen. Om lösenordet förloras, skriv om SD-kortet och skapa ett nytt konto.',
        change1: 'Observera att denna åtgärd ändrar följande lösenord:',
        change2: 'Webbinloggningslösenord',
        change3: 'Systemets root-lösenord för SSH-inloggning'
      },
      placeholderCurrentPassword: 'Nuvarande lösenord',
      placeholderNewPassword: 'Nytt lösenord',
      wrongCurrentPassword: 'Det nuvarande lösenordet är fel',
      totp: {
        title: 'Tvåfaktorsautentisering',
        prompt: 'Ange den sexsiffriga koden från din autentiseringsapp',
        backupPrompt: 'Ange en av dina reservkoder',
        noEmptyCode: 'Ange en kod',
        placeholderCode: 'Sexsiffrig kod',
        placeholderBackup: 'Reservkod',
        verifyButtonText: 'Verifiera',
        useBackupCode: 'Använd en reservkod',
        useAuthenticator: 'Använd kod från autentiseringsappen',
        cancel: 'Tillbaka',
        invalidCode: 'Koden är ogiltig. Försök igen.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Konfigurera Wi-Fi för NanoKVM',
      success: 'Kontrollera nätverksstatusen för NanoKVM och besök den nya IP-adressen',
      failed: 'Åtgärden misslyckades, försök igen',
      invalidMode:
        'Det aktuella läget stöder inte nätverksinstallation. Gå till din enhet och aktivera Wi-Fi konfigurationsläge.',
      confirmBtn: 'Ok',
      finishBtn: 'Färdig',
      ap: {
        authTitle: 'Autentisering krävs',
        authDescription: 'Ange AP-lösenordet för att fortsätta',
        authFailed: 'Ogiltigt AP lösenord',
        passPlaceholder: 'AP-lösenord',
        verifyBtn: 'Verifiera'
      }
    },
    screen: {
      scale: 'Skala',
      title: 'Skärm',
      video: 'Videoläge',
      videoDirectTips:
        'Aktivera HTTPS under "Inställningar > Nätverk > Tjänster" för att använda detta läge',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC är inaktiverat i brandväggslägena Begränsad och Paranoid',
      transferRunningTitle: 'Avbildningsöverföring pågår',
      transferRunningDesc:
        'Om du byter videoläge laddas sidan om, och den pågående uppladdningen eller nedladdningen av avbildningen avbryts.',
      transferRunningOk: 'Byt läge',
      resolution: 'Upplösning',
      auto: 'Automatisk',
      autoTips:
        'Skärmtear eller musförskjutning kan förekomma vid vissa upplösningar, så justera fjärrvärdens upplösning eller inaktivera automatiskt läge',
      fps: 'FPS',
      customizeFps: 'Anpassa',
      quality: 'Kvalitet',
      qualityLossless: 'Förlustfri',
      qualityHigh: 'Hög',
      qualityMedium: 'Medel',
      qualityLow: 'Låg',
      frameDetect: 'Ramdetection',
      frameDetectTip:
        'Jämför ramar och slutar skicka video så länge fjärrvärdens skärm inte ändras',
      resetHdmi: 'Återställ HDMI',
      webrtcConnectionFailed: {
        title: 'WebRTC-anslutningen misslyckades',
        description: 'Kontrollera nätverksanslutningen eller byt videoläge'
      },
      captureStatus: {
        hdmiError: 'HDMI-skärmfel',
        unsupportedResolution: 'Den aktuella upplösningen stöds inte',
        retrieving: 'Hämtar skärmen...',
        changingResolution: 'Byter upplösning...',
        updateFailed: 'Skärmen kan inte uppdateras just nu',
        videoError: 'Videovisningsfel',
        noHdmi: 'Ingen HDMI-signal upptäcktes',
        unavailable: 'Skärmen kan inte visas just nu'
      }
    },
    keyboard: {
      title: 'Tangentbord',
      paste: 'Klistra in',
      tips: 'Endast standardbokstäver och symboler på tangentbordet stöds',
      placeholder: 'Text att klistra in',
      local: 'Mobilt tangentbord',
      virtual: 'Skärmtangentbord',
      readClipboard: 'Läs från urklipp',
      clipboardPermissionDenied:
        'Behörighet till Urklipp nekad, tillåt åtkomst till Urklipp i din webbläsare',
      clipboardReadError: 'Misslyckades med att läsa urklipp',
      dropdownEnglish: 'Engelska',
      dropdownGerman: 'Tyska',
      dropdownFrench: 'Franska',
      dropdownRussian: 'Ryska',
      dropdownKorean: 'Koreanska',
      dropdownJapanese: 'Japanska',
      localInput: 'Inmatning från mobiltangentbord',
      shortcut: {
        title: 'Genvägar',
        custom: 'Anpassad',
        capture: 'Klicka här för att fånga genväg',
        clear: 'Rensa',
        save: 'Spara',
        captureTips: 'Att fånga systemtangenter, som Windows-tangenten, kräver helskärmsbehörighet',
        enterFullScreen: 'Växla helskärmsläge'
      },
      leaderKey: {
        title: 'Leader-tangent',
        desc: 'Gå förbi webbläsarbegränsningar och skicka systemgenvägar direkt till fjärrvärden',
        howToUse: 'Hur man använder',
        simultaneous: {
          title: 'Samtidigt läge',
          desc1: 'Håll ned Leader-tangenten och tryck sedan på genvägen.',
          desc2: 'Intuitivt, men kan komma i konflikt med systemgenvägar.'
        },
        sequential: {
          title: 'Sekventiellt läge',
          desc1:
            'Tryck på Leader-tangenten → tryck på genvägen i följd → tryck på Leader-tangenten igen.',
          desc2: 'Kräver fler steg, men undviker helt systemkonflikter.'
        },
        enable: 'Aktivera Leader-tangent',
        tip: 'När den tilldelas som Leader-tangent fungerar denna tangent endast som genvägsutlösare och förlorar sitt standardbeteende.',
        placeholder: 'Tryck på Leader-tangenten',
        shiftRight: 'Höger Shift',
        ctrlRight: 'Höger Ctrl',
        metaRight: 'Höger Win',
        recorder: {
          rec: 'REC',
          activate: 'Aktivera tangenter',
          input: 'Tryck på genvägen'
        }
      }
    },
    mouse: {
      title: 'Mus',
      cursor: 'Markörstil',
      default: 'Standardmarkör',
      cell: 'Cellmarkör',
      text: 'Textmarkör',
      grab: 'Greppmarkör',
      hide: 'Dölj markör',
      mode: 'Musläge',
      absolute: 'Absolut läge',
      relative: 'Relativt läge',
      direction: 'Rullhjulsriktning',
      scrollUp: 'Scrolla uppåt',
      scrollDown: 'Scrolla ner',
      speed: 'Rullhjulshastighet',
      sensitivity: 'Pekarhastighet',
      sensitivityDesc:
        'För relativt skrivbordsläge: lägre värden minskar drift från värdens musacceleration',
      fast: 'Snabb',
      slow: 'Långsam',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Rör dig var som helst i KVM-området; fjärrpekaren behåller sin position mellan beröringar och hålls synkroniserad med absolut HID'
      },
      requestPointer: 'Använder relativt läge, klicka på skrivbordet för att få muspekaren',
      resetHid: 'Återställ HID',
      hidOnly: {
        title: 'HID-Only-läge',
        desc: 'Om musen eller tangentbordet slutar svara och det inte hjälper att återställa HID kan det vara ett kompatibilitetsproblem mellan NanoKVM och värden.',
        tip1: 'När HID-Only-läge aktiveras avmonteras den virtuella disken och det virtuella nätverket',
        tip2: 'I HID-Only-läge är montering av avbildningar inaktiverad',
        tip3: 'NanoKVM kommer automatiskt att starta om efter lägesbyte',
        enable: 'Aktivera HID-Only-läge',
        disable: 'Inaktivera HID-Only-läge'
      }
    },
    image: {
      title: 'Avbildningar',
      loading: 'Laddar...',
      empty: 'Inget hittades',
      mountMode: 'Montera som',
      mount: 'Montera',
      orDownload: 'Eller ladda ned från en länk',
      keepRunning:
        'Du kan stänga det här fönstret. Överföringen fortsätter och förloppet visas i listan över avbildningar.',
      massStorage: 'Masslagring',
      cdRom: 'CD-ROM',
      mountFailed: 'Montering misslyckades',
      mountDesc:
        'I vissa system måste den virtuella disken avmonteras på fjärrvärden innan avbildningen monteras',
      diskOnWarn:
        'Montering av avbildningen stänger av den virtuella disken, så datorn kommer inte åt /data. Fortsätta?',
      diskOffWarn:
        'Den virtuella disken är avstängd och måste aktiveras för att montera avbildningen. Datorns USB-enheter ansluts på nytt. Fortsätta?',
      unmountFailed: 'Avmontering misslyckades',
      unmountDesc:
        'I vissa system måste du manuellt mata ut från fjärrvärden innan du avmonterar avbildningen',
      forceEject: 'Tvinga utmatning',
      forceEjectConfirm:
        'Värden har låst den optiska enheten. Tvingad utmatning kopplar bort den virtuella USB-enheten ett ögonblick, så tangentbordet och musen kan kopplas bort en kort stund. Vill du fortsätta?',
      usbReconnect: 'Återanslut USB',
      usbReconnectConfirm:
        'Återanslut USB-gadgeten endast om fjärrvärden inte upptäckte mediebytet. Tangentbord och mus kan kopplas från kortvarigt.',
      usbReconnectSuccess: 'USB återansluten',
      usbReconnectFailed: 'USB-återanslutning misslyckades',
      addImage: 'Lägg till avbildning',
      fromUrl: 'Från URL',
      fromFile: 'Från fil',
      turnOff: 'Stäng av',
      deleteDiskShared: 'Avbildningar kan inte tas bort medan den virtuella disken är på.',
      eject: 'Mata ut',
      download: 'Ladda ned',
      upload: 'Ladda upp',
      mountTitle: 'Montera avbildning',
      deleteTitle: 'Ta bort avbildning',
      deleteConfirm: 'Är du säker på att du vill ta bort denna avbildning?',
      tips: {
        title: 'Hur man laddar upp',
        usb1: 'Anslut NanoKVM till din dator via USB.',
        usb2: 'Säkerställ att den virtuella disken är monterad under Inställningar > Enhet > Virtuell disk.',
        usb3: 'Öppna den virtuella disken på din dator och kopiera avbildningsfilen till rotkatalogen.',
        scp1: 'Säkerställ att NanoKVM och din dator är på samma lokala nätverk.',
        scp2: 'Öppna en terminal på din dator och använd SCP-kommandot för att ladda upp avbildningen till /data på NanoKVM.',
        scp3: 'Exempel: scp din-avbildningssökväg root@din-nanokvm-ip:/data',
        tfCard: 'SD-kort',
        tf1: 'Denna metod stöds på Linux-system',
        tf2: 'Ta ut SD-kortet från NanoKVM. På FULL-versionen öppnar du chassit först.',
        tf3: 'Sätt in SD-kortet i en kortläsare och anslut till din dator.',
        tf4: 'Kopiera avbildningsfilen till /data på SD-kortet.',
        tf5: 'Sätt in SD-kortet i NanoKVM.'
      }
    },
    script: {
      title: 'Skript',
      upload: 'Ladda upp',
      run: 'Kör',
      runBackground: 'Kör i bakgrunden',
      runFailed: 'Körning misslyckades',
      delDesc: 'Är du säker på att du vill ta bort denna fil?',
      delete: 'Ta bort',
      close: 'Stäng',
      unlockDesc:
        'Skript körs som root på NanoKVM. Ange webbkontots lösenord för att ersätta eller köra ett skript.',
      unreviewedTitle: 'Ogranskat skript',
      unreviewedDesc:
        'Det här skriptet är nytt eller byttes ut sedan du senast körde det. Vem som helst med din session kan ha laddat upp det, så titta på det i terminalen innan du kör det som root.',
      terminalRequired:
        'Skript kräver åtkomst till webbterminalen. Aktivera först terminalen i inställningarna.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'NanoKVM-terminal',
      serial: 'Serieport-terminal',
      unlockTitle: 'Lås upp terminal',
      unlockDesc: 'Ange lösenordet för webbkonto för att starta en terminalsession',
      unlock: 'Lås upp',
      unlockFailed: 'Kunde inte låsa upp terminalen',
      invalidCredentials: 'Ogiltigt användarnamn eller lösenord',
      locked: 'För många försök, försök igen senare',
      sessionClosed: 'Terminalsessionen stängdes. Lås upp igen för att ansluta.',
      sessionError: 'Terminalanslutningen misslyckades. Lås upp igen för att försöka.',
      serialPort: 'Serieport',
      serialPortPlaceholder: 'Till exempel /dev/ttyS1',
      baudrate: 'Baudhastighet',
      parity: 'Paritet',
      parityNone: 'Ingen',
      parityEven: 'Jämn',
      parityOdd: 'Udda',
      flowControl: 'Flödeskontroll',
      flowControlNone: 'Ingen',
      flowControlSoft: 'Programvara',
      flowControlHard: 'Hårdvara',
      dataBits: 'Databitar',
      stopBits: 'Stoppbitar',
      open: 'Öppna terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Skickar kommando...',
      sent: 'Kommando skickat',
      input: 'MAC-adress',
      ok: 'OK'
    },
    download: {
      input: 'URL till fjärravbildning',
      ok: 'OK',
      disabled:
        'Avbildningar kan inte laddas ned eller laddas upp just nu eftersom lagringen inte är skrivbar. Om en avbildning är monterad, avmontera den och stäng sedan av den virtuella disken så att lagringen blir skrivbar igen.',
      diskShared: 'Stäng av den virtuella disken för att använda nedladdningen',
      mountedImage:
        'Den här diskavbilden är monterad, avmontera den innan du laddar upp en fil med samma namn',
      diskOff: 'Stäng av den virtuella disken',
      uploadbox: 'Släpp filen här eller klicka för att välja',
      inputfile: 'Bildfil',
      NoISO: 'Ingen image',
      complete: 'Nedladdningen är klar',
      uploadComplete: 'Uppladdningen är klar',
      downloading: 'Laddar ned',
      uploading: 'Laddar upp',
      failed: 'Överföringen misslyckades',
      uploadFailed: 'Uppladdningen misslyckades',
      stalled: 'Överföringen har fastnat, kontrollera anslutningen och försök igen',
      canceled: 'Uppladdningen avbröts',
      downloadCanceled: 'Nedladdning avbruten',
      cancel: 'Avbryt',
      remoteDisabled:
        'Fjärrnedladdning av ISO är inaktiverad i Inställningar > Användare > Preferenser',
      remoteFailed: 'Fjärrnedladdning av ISO misslyckades',
      sha256: 'Valfri SHA-256-kontrollsumma',
      sha256Placeholder: 'Ange en SHA-256-kontrollsumma på 64 tecken',
      invalidSHA256: 'SHA-256 måste vara en hexadecimal sträng på 64 tecken',
      checksumFailed: 'Nedladdningen misslyckades: SHA-256-verifieringen misslyckades'
    },
    power: {
      title: 'Ström',
      showConfirm: 'Bekräftelse',
      showConfirmTip: 'Strömätgärder kräver extra bekräftelse',
      reset: 'Starta om',
      powerShort: 'Strömknapp: kort tryck',
      powerLong: 'Strömknapp: långt tryck',
      resetConfirm: 'Utföra omstart?',
      powerConfirm: 'Utföra strömåtgärd?',
      okBtn: 'Ja',
      cancelBtn: 'Nej'
    },
    settings: {
      title: 'Inställningar',
      about: {
        title: 'Om',
        information: 'Information',
        ip: 'IP-adress',
        mdns: 'Lokal adress',
        application: 'Applikationsversion',
        uptime: 'Drifttid',
        community: 'Community',
        credit: 'Byggt på <a1>NanoKVM</a1> från Sipeed och <a2>Hardened NanoKVM</a2> av woffko',
        hostname: 'Enhetsnamn',
        changeIn: 'Ändras i {{path}}',
        updateIn: 'Uppdateras i {{path}}',
        toggleIn: 'Slås på eller av i {{path}}'
      },
      appearance: {
        title: 'Preferenser',
        display: 'Visning',
        language: 'Språk',
        languageDesc: 'Välj språk för gränssnittet',
        webTitle: 'Webbtitel',
        webTitleDesc: 'Anpassa webbsidans titel',
        layoutMode: 'Gränssnittslayout',
        layoutModeDesc: 'Använd telefon-/touchlayout i den här webbläsaren',
        layoutAuto: 'Automatiskt',
        layoutMobile: 'Telefon',
        menuBar: {
          title: 'Menyrad',
          mode: 'Visningsläge',
          modeDesc: 'Visa menyraden på skärmen',
          modeOff: 'Av',
          modeAuto: 'Dölj automatiskt',
          modeAlways: 'Alltid synlig',
          keyboardLedStatus: 'Indikatorer för tangentbordslås',
          keyboardLedStatusDesc:
            'Visa Num Lock-, Caps Lock- och Scroll Lock-status för fjärrdatorn',
          icons: 'Undermenyikoner',
          iconsDesc: 'Visa undermenyikoner i menyraden',
          terminalWarningTitle: 'Aktivera webbterminal?',
          terminalWarningDesc:
            'Terminalen öppnar ett root-shell i webbläsaren. Aktivera endast på ett betrott nätverk och stäng av när du är klar.',
          terminalWarningConfirm: 'Aktivera',
          remoteDownload: 'Hämta ISO på distans',
          remoteDownloadWarningTitle: 'Aktivera fjärrnedladdning av ISO?',
          remoteDownloadWarningDesc:
            'NanoKVM hämtar en ISO från en URL och skriver den till /data. Aktivera endast för betrodda URL:er och stäng av när du är klar.',
          remoteDownloadWarningConfirm: 'Aktivera'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Status för lås på fjärrtangentbord',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'På',
        off: 'Av',
        unknown: 'Okänd'
      },
      device: {
        title: 'Enhet',
        minutes: 'min',
        sections: {
          general: 'Allmänt',
          connectivity: 'Anslutning',
          hostConnection: 'Värdanslutning',
          inputOutput: 'Indata och utdata'
        },
        oled: {
          title: 'OLED-timeout',
          description: 'Stäng av OLED-skärmen efter',
          keepOn: 'Håll OLED på',
          keepOnDescription: 'Stäng aldrig av OLED-skärmen'
        },
        ssh: {
          description: 'Aktivera SSH-fjärråtkomst',
          tip: 'Ställ in ett starkt lösenord under Konto > Lösenord innan du aktiverar det här alternativet'
        },
        swap: {
          title: 'Swap',
          description: 'Använd en swap-fil när minnet börjar ta slut',
          size: 'Swap-storlek',
          sizeDescription: 'Ange swap-filens storlek',
          tip: 'Aktivering av denna funktion kan förkorta livslängden på ditt SD-kort'
        },
        mouseJiggler: {
          title: 'Musvickare',
          description: 'Förhindra att fjärrvärden går i viloläge',
          disable: 'Inaktivera',
          absolute: 'Absolut läge',
          relative: 'Relativt läge'
        },
        sessionLock: {
          title: 'Lås session vid inaktivitet',
          description: 'Kräv inloggning igen efter denna tid'
        },
        mdns: {
          description: 'Aktivera mDNS-upptäckningstjänst',
          tip: 'Gör att enheten kan nås via sitt .local-namn. Behövs inte om du ansluter via IP-adress eller din DNS redan löser värdnamnet.'
        },
        hdmi: {
          description: 'Aktivera HDMI/monitorutgång',
          idleTimeoutTitle: 'Tidsgräns för inaktiv inspelning',
          idleTimeoutDescription:
            'Stoppa HDMI-inspelning efter att det inte har funnits aktiva tittare i'
        },
        hidOnly: 'HID-Only-läge',
        hidOnlyDesc:
          'Förbättrar kompatibiliteten med värden om musen eller tangentbordet slutar svara',
        hidOnlyTip:
          'HID-Only-läge slutar emulera virtuella enheter och behåller bara grundläggande HID-kontroll',
        disk: 'Virtuell disk',
        diskDesc: 'Montera SD-kortet på fjärrvärden',
        diskLocked: 'Avstängd medan en avbildning är monterad, och aktivering avbryter monteringen',
        diskEnable: 'Aktivera virtuell disk',
        networkChange: 'Ändra virtuellt nätverk',
        diskCancelMount:
          'Om du aktiverar den virtuella disken avbryts den monterade avbildningen. Fortsätta?',
        networkCancelMount:
          'Om du ändrar det virtuella nätverket startas USB-anslutningen om. Det avbryter den monterade avbildningen och aktiverar den virtuella disken. Fortsätta?',
        diskTransferRunning:
          'En avbildningsöverföring pågår. Vänta tills den är klar innan du aktiverar den virtuella disken.',
        network: 'Virtuellt nätverk',
        networkDesc: 'Montera virtuell nätverkskort på fjärrvärden',
        usbWakeup: 'USB-väckning',
        usbWakeupDesc: 'Tillåt tangentbords- eller mushändelser att väcka fjärrvärden',
        usbWakeupTip: 'Stäng av om värden loggar upprepade USB wakeup-meddelanden',
        hostname: {
          description: 'Enhetens namn i nätverket',
          reachable: 'Nåbar i det lokala nätverket som {{address}}'
        },
        rebootRequired: 'Omstart krävs',
        rebootPending: 'Omstart krävs för: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Systemuppdatering'
        },
        reboot: 'Starta om',
        rebootDesc: 'Är du säker på att du vill starta om NanoKVM?',
        poweroff: 'Stäng av',
        poweroffDesc: 'Vill du verkligen stänga av NanoKVM?'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Anslutning',
        configuration: 'Konfiguration',
        wifi: {
          title: 'Wi-Fi',
          description: 'Konfigurera Wi-Fi',
          apMode: 'AP-läge är aktiverat, anslut till Wi-Fi genom att skanna QR-koden',
          connect: 'Anslut Wi-Fi',
          connectDesc1: 'Ange nätverkets SSID och lösenord',
          disconnect: 'Är du säker på att du vill koppla från nätverket?',
          disconnectBtn: 'Koppla från',
          connected: 'Ansluten',
          ssid: 'Namn',
          password: 'Lösenord',
          joinBtn: 'Anslut',
          cancelBtn: 'Avbryt'
        },
        tls: {
          description: 'Aktivera HTTPS-protokoll',
          tip: 'Observera: Användning av HTTPS kan öka fördröjningen, särskilt med MJPEG-läge',
          restartTitle: 'Servern startar om',
          restartDesc:
            'Protokolländringen startar om servern. Webbläsaren byter till den nya adressen efter {{seconds}} sekunder:',
          restartOk: 'Verkställ och starta om',
          confirmTitle: 'Behålla det nya protokollet?',
          confirmDesc:
            'Servern kör nu på {{protocol}}. Den går tillbaka till det tidigare protokollet om {{seconds}} sekunder om du inte behåller det.',
          confirmKeep: 'Behåll',
          confirmRevert: 'Gå tillbaka',
          reverting:
            'Går tillbaka till det tidigare protokollet. Webbläsaren byter till den adressen efter {{seconds}} sekunder.',
          certTitle: 'Behålla det nya certifikatet?',
          certDesc:
            'Servern använder nu det nya certifikatet. Den går tillbaka till det förra om {{seconds}} sekunder om du inte behåller det.',
          certReverted: 'Det förra certifikatet är tillbaka'
        },
        trustedProxies: {
          section: 'Omvänd proxyserver',
          title: 'Betrodda proxyservrar',
          description:
            'Omvända proxyservrar som enheten litar på för klientens adress och protokoll',
          tip: 'En adress i listan väljer den klientadress som inloggningsspärren och loggen registrerar, så ange bara proxyservrar som du själv styr',
          none: 'Ingen',
          edit: 'Redigera',
          editRow: 'Redigera listan',
          editTitle: 'Redigera betrodda proxyservrar',
          editDescription: 'Att ändra listan kräver ditt lösenord',
          dialogDescription:
            'Ange adressen till varje omvänd proxyserver så som den här enheten ser den, eller ett intervall som 10.0.0.0/24. En proxyserver i listan talar om för enheten vilken klientadress och vilket protokoll som ska användas. Allt den vidarebefordrar tros på, så ange bara proxyservrar som du själv styr.'
        },
        certificate: {
          title: 'Certifikat',
          desc: 'Varifrån HTTPS-certifikatet kommer',
          requesting: 'Begär certifikatet',
          selfSigned: 'Självsignerat',
          domain: 'Domän',
          domainDesc: 'Måste peka på den här enheten, och port 443 måste vara nåbar från internet',
          domainTailscale: 'Anges av Tailscale för den här enheten',
          domainInvalid: 'Använd ett fullständigt domännamn, till exempel kvm.example.org',
          email: 'E-post',
          emailDesc: "Valfritt, för meddelanden från Let's Encrypt",
          emailInvalid: 'Använd en adress som namn@example.org',
          validUntil: 'Giltigt till',
          valid: 'Giltigt',
          expiresSoon: 'Går snart ut',
          expired: 'Utgånget',
          lastRenewal: 'Senaste förnyelse',
          renewed: 'Förnyat',
          failed: 'Misslyckades',
          renewNow: 'Förnya nu',
          renewNowDesc: 'Begär ett nytt certifikat utan att vänta',
          renewBtn: 'Förnya',
          applyTitle: 'Ändra certifikat',
          applyOk: 'Tillämpa',
          applyAcme:
            "Enheten begär ett certifikat från Let's Encrypt. Let's Encrypt ansluter till port 443 från internet för att kontrollera det, vilket kan ta upp till en minut. Om begäran misslyckas används det nuvarande certifikatet fortfarande.",
          applyTailscale:
            'Enheten hämtar ett certifikat från Tailscale, vilket kan ta upp till en minut. Om begäran misslyckas används det nuvarande certifikatet fortfarande.',
          applySelfSigned:
            'Enheten går tillbaka till sitt eget självsignerade certifikat. Webbläsare varnar för det.',
          openTitle: 'Öppna den nya adressen',
          openDesc:
            'Certifikatet är klart. Öppna adressen nedan och logga in för att behålla det. Utan din bekräftelse inom 3 minuter kommer det förra certifikatet tillbaka.',
          openOk: 'Öppna',
          blockedClock: 'Certifikat kan inte begäras förrän enhetens klocka är synkroniserad',
          blockedParanoid: 'Brandväggsläget Paranoid blockerar certifikatbegäranden',
          tailscaleUnavailable:
            'Tailscale körs inte, eller så är HTTPS-certifikat inte aktiverade för tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'Konfigurera DNS-servrar för NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Konfigurera IPv4-adressering för det trådbundna gränssnittet',
          servers: 'Servrar',
          dhcp: 'DHCP',
          manual: 'Manuell',
          apply: 'Tillämpa',
          invalid: 'Ange en giltig IPv4- eller IPv6-adress',
          invalidNetwork: 'Ange en giltig IPv4-adress, nätmask och router',
          saved: 'DNS-inställningar sparade',
          redirecting: 'Nätverksinställningarna har sparats. Öppnar den nya adressen...',
          saveFailed: 'Det gick inte att spara DNS-inställningar',
          unsaved: 'Osparade ändringar',
          maxServers: 'Maximalt {{count}} DNS-servrar tillåtna',
          dhcpServersDescription: 'DNS-servrar hämtas automatiskt från DHCP',
          manualServersDescription: 'IPv4- och IPv6-servrar stöds',
          interface: 'Gränssnitt',
          ipAddress: 'IP-adress',
          subnetMask: 'Subnätmask',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Konfigurera IPv6-adressering för det trådbundna gränssnittet',
          disabled: 'Inaktiverad',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manuell',
          interface: 'Gränssnitt',
          state: 'Tillstånd',
          router: 'Router',
          addresses: 'Adresser',
          dhcpv6Client: 'DHCPv6-klient',
          notInstalled: 'Inte installerad',
          ipAddress: 'IPv6-adress',
          prefix: 'Prefix',
          invalidManual: 'Ange en giltig IPv6-adress, prefix och router',
          clientMissing:
            'DHCPv6-klienten är inte installerad. Installera först den matchande raw-systemuppdateringen.',
          saved: 'IPv6-inställningar sparade',
          saveFailed: 'Det gick inte att spara IPv6-inställningar',
          unsaved: 'Osparade ändringar'
        }
      },
      system: {
        title: 'System',
        performance: {
          processor: 'Processor',
          overdrive: {
            title: 'Överklockning',
            description:
              'Starta med de högre klockfrekvenser för processor och video som tillverkaren har specificerat',
            tip: 'Om enheten inte startar med överklockning måste SD-kortet skrivas om',
            unavailable: 'Ingår inte i den här systemavbilden',
            keepTitle: 'Behåll overdrive efter uppdateringar',
            keepDescription:
              'En systemuppdatering återställer enheten till standardklockorna om detta inte är påslaget',
            confirmTitle: 'Aktivera överklockning?',
            confirmText:
              'Om enheten inte startar med överklockning måste du skriva om SD-kortet för att återställa den. Ändringen gäller efter nästa omstart.',
            confirmOk: 'Aktivera'
          },
          watchdog: {
            title: 'Hårdvaru-watchdog',
            description: 'Starta om enheten automatiskt när den slutar svara',
            unavailable: 'Ingår inte i den här systemavbilden',
            notRunning: 'Körs inte just nu',
            lastRestart: 'Senaste omstart',
            lastRestartCaption: 'Senaste orsaken till att systemet startade om',
            reasonPowerOn: 'Påslagning',
            reasonRestart: 'Omstart begärd',
            reasonWatchdog: 'Watchdog-återställning',
            reasonOverheat: 'Överhettningsskydd',
            reasonUnknown: 'Okänd'
          },
          recovery: 'Återställning',
          memory: 'Minne'
        },
        monitor: {
          processorClock: 'CPU-delsystem',
          videoClock: 'Videodelsystem',
          videoClockCaption: 'Videoklockfrekvens',
          cpuClockCaption: 'CPU-klockfrekvens',
          overdrive: 'Överklockning',
          temperature: 'Temperatur',
          lastMinutes: 'Senaste 5 minuterna',
          ram: 'RAM',
          off: 'Av',
          ramHistory: 'RAM-användning',
          cpuLoad: 'CPU-belastning',
          cpuLoadCaption: 'Användare {{user}} procent, system {{system}} procent',
          cpuUtilization: 'CPU-utnyttjande',
          swapUtilization: 'Swap-utnyttjande',
          swapSizeLastMinutes: '{{size}}, senaste 5 minuterna',
          percent: '{{percent}} procent',
          percentUsed: '{{percent}} procent använt',
          sizeOf: '{{used}} av {{total}}',
          systemPartition: 'Systempartition',
          dataPartition: 'Datapartition',
          unavailable: 'Inte tillgänglig',
          noReadings: 'Enheten returnerar inga mätvärden',
          refresh: 'Uppdateras varje sekund medan den här sidan är öppen'
        },
        sections: {
          time: 'Tid',
          firewall: 'Brandvägg',
          systemLog: 'Loggning',
          performance: 'Prestanda',
          monitor: 'Övervakning',
          services: 'Tjänster',
          webInterface: 'Säker webbåtkomst'
        },
        time: {
          saveFailed: 'Kunde inte spara tidsinställningar',
          saved: 'Tidsinställningar sparade',
          syncFailed: 'Kunde inte synkronisera tid',
          synced: 'Tid synkroniserad',
          invalidServers: 'Ange minst en NTP-server',
          maxServers: 'Högst {{count}} NTP-servrar tillåtna',
          refresh: 'Uppdatera',
          syncNow: 'Synkronisera',
          syncNowDesc: 'Ställ klockan från NTP-servrarna nu',
          save: 'Spara',
          ntp: {
            title: 'NTP',
            description: 'Synkronisera enhetens tid från konfigurerade NTP-servrar'
          },
          networkTime: 'Nätverkstid',
          clock: {
            title: 'Klocka',
            description: 'Ange lokal tidszon som används av loggar och gränssnittet',
            current: 'Aktuell tid',
            timezone: 'Tidszon'
          },
          servers: {
            title: 'NTP-servrar',
            description: 'Använd standardservrarna, din lokala router eller egna NTP-servrar',
            useRouter: 'Använd router',
            useDefaults: 'Använd standardvärden',
            presets: 'Serverförval',
            presetsDesc: 'Ersätt serverlistan med ett förval'
          }
        },
        firewall: {
          saveFailed: 'Kunde inte tillämpa brandväggsinställningar',
          saved: 'Brandväggsinställningar tillämpade',
          cancel: 'Avbryt',
          refresh: 'Uppdatera',
          backends: 'Backends',
          enableHttpsFirst:
            'Aktivera HTTPS innan du aktiverar brandväggsläget Begränsad eller Paranoid',
          httpsRequired:
            'Lägena Begränsad och Paranoid är inaktiverade tills HTTPS har aktiverats under Inställningar > Nätverk > Tjänster',
          mode: {
            title: 'Brandväggsläge',
            baseline: 'Bas',
            baselineDesc:
              'Öppen kompatibilitetsprofil. Brandväggen körs, men inkommande källor begränsas inte. Använd bara i betrodda nätverk.',
            moderate: 'Måttlig',
            moderateDesc:
              'Standardprofil. Behåller Bas-tjänsterna men tar bara emot nya inkommande anslutningar från privata, link-local- eller loopback-intervall. Utgående åtkomst förblir öppen.',
            restricted: 'Begränsad',
            restrictedDesc:
              'Endast lokal HTTPS och SSH, plus utgående DNS, NTP, syslog och onlineuppdateringar. DHCP och nödvändig IPv6-trafik förblir tillgänglig. WebRTC är blockerat.',
            paranoid: 'Paranoid',
            paranoidDesc:
              'Endast lokal HTTPS-åtkomst. Blockerar SSH, HTTP, onlineuppdateringar och andra utgående nätverksfunktioner. Uppladdning av offlineuppdateringar och redan förberedda installationer är fortfarande tillgängliga.',
            current: 'Aktuell',
            default: 'Standard',
            localOnly: 'Endast lokalt',
            openTag: 'Inkommande öppen',
            httpsRequiredTag: 'HTTPS krävs',
            outboundOpen: 'Utgående öppen',
            outboundLimited: 'Utgående begränsad',
            httpsOnly: 'Endast HTTPS'
          },
          moderate: {
            apply: 'Byt till Måttlig'
          },
          restricted: {
            enable: 'Aktivera Begränsad',
            confirmTitle: 'Aktivera brandväggsläget Begränsad?',
            confirmDesc:
              'Inkommande administratörsåtkomst begränsas till private IPv4-, IPv4 link-local/loopback-, IPv6 link-local- eller IPv6 loopback-källor för HTTPS och SSH. Offentliga källintervall tillåts inte. Utgående DNS, NTP, fjärr-syslog, onlineuppdateringar, DHCP, etablerade anslutningar och nödvändig IPv6-kontrolltrafik förblir tillgängliga. WebRTC/ICE UDP och annan in-/utgående trafik blockeras.'
          },
          paranoid: {
            enable: 'Aktivera Paranoid',
            confirmTitle: 'Aktivera brandväggsläget Paranoid?',
            confirmDesc:
              'Endast HTTPS-åtkomst från private IPv4, IPv4 link-local/loopback, IPv6 link-local eller IPv6 loopback är tillgänglig. SSH, HTTP, mDNS, NTP, GitHub-nedladdningar och annan trafik blockeras utom minimal DHCP/IPv6-kontroll.'
          },
          baseline: {
            apply: 'Byt till Bas',
            confirmTitle: 'Byta till öppet läge Bas?',
            confirmDesc:
              'Brandväggstjänsten förblir aktiv, men begränsningen till lokala källintervall tas bort. Offentliga källintervall kan nå exponerade NanoKVM-tjänster om nätverket routar dem.'
          },
          rules: {
            title: 'Aktuella regler',
            empty: 'Inga regler'
          }
        },
        saveChanges: 'Spara ändringar',
        unsaved: 'Osparade ändringar'
      },
      systemLog: {
        saveFailed: 'Kunde inte spara logginställningar',
        saved: 'Logginställningar sparade',
        invalidHost: 'Ange en syslog-serverhost',
        logLoadFailed: 'Kunde inte läsa in loggar',
        save: 'Spara',
        test: 'Skicka testlogg',
        testSent: 'Testlogg skickad',
        testFailed: 'Kunde inte skicka testlogg',
        remote: {
          title: 'Fjärrloggning',
          forward: 'Vidarebefordra systemlogg',
          description: 'Vidarebefordra systemmeddelanden till en fjärrserver',
          host: 'Server',
          hostDesc: 'Värdnamn eller IPv4-adress till syslog-servern',
          port: 'Port',
          protocol: 'UDP-port på syslog-servern'
        },
        local: {
          title: 'Systemloggbuffert',
          description:
            'Aktuella loggar hålls i RAM på {{path}} för att undvika skrivningar till SD-kortet',
          priority: 'Minsta prioritet',
          priorityDesc: 'Lägsta brådskandegrad för att ett meddelande ska loggas',
          buffer: 'Buffertstorlek',
          bufferDesc: 'Loggstorlek där filen roteras',
          rotations: 'Rotationer',
          rotationsDesc: 'Antal roterade loggfiler som sparas',
          compact: 'Kompakt utdata',
          compactDesc: 'Utelämna värdnamn och facility från varje rad',
          stripTimestamps: 'Ta bort tidsstämplar',
          stripTimestampsDesc:
            'Ta bort tidsstämplar som lagts till av avsändaren; syslog lägger till sina egna'
        },
        kernel: {
          title: 'Kärnloggning',
          enabled: 'Vidarebefordra kärnlogg',
          enabledDesc: 'Fånga kärnmeddelanden i systemloggen',
          consoleLevel: 'Konsolnivå',
          consoleLevelDesc:
            'Lägsta brådskandegrad för att ett kärnmeddelande ska skrivas ut på konsolen'
        },
        viewer: {
          title: 'Systemlogg',
          refresh: 'Uppdatera',
          empty: 'Inga loggposter',
          truncated: 'Endast de senaste loggdata visas',
          linesUnit: 'rader'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Kritisk',
          '3': '3 - Fel',
          '4': '4 - Varning',
          '5': '5 - Notis',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Alla'
        }
      },
      user: {
        title: 'Användare'
      },
      networking: {
        title: 'Nätverk'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Krypterad tunnel',
        device: 'Den här enheten',
        description: 'Nå den här KVM:en genom en WireGuard-tunnel',
        unavailable: 'WireGuard är inte installerat på den här enheten',
        blocked: 'Brandväggsläget Paranoid blockerar WireGuard',
        needsKey: 'Ange en privat nyckel innan du slår på WireGuard',
        saved: 'WireGuard-inställningarna sparades',
        save: 'Spara ändringar',
        unsaved: 'Osparade ändringar',
        invalid: 'Kontrollera de markerade fälten',
        invalidAddress: 'Ange en adress med mask, till exempel 10.0.0.1/24',
        invalidKey: 'Ange en WireGuard-nyckel på 44 tecken',
        invalidEndpoint: 'Ange ett värdnamn eller en IP-adress',
        invalidPort: 'Ange en port från 1 till 65535',
        invalidRanges: 'Använd IPv4-intervall som 10.0.0.0/24, inte 0.0.0.0/0',
        status: {
          connected: 'Ansluten',
          waiting: 'Väntar på peer',
          stopped: 'Stoppad',
          handshake: 'Senaste handshake {{time}}'
        },
        privateKey: {
          title: 'Privat nyckel',
          description: 'Stannar på den här enheten och visas aldrig igen',
          set: 'Angiven',
          notSet: 'Inte angiven',
          setBtn: 'Ange',
          generate: 'Generera',
          remove: 'Ta bort',
          modalTitle: 'Ange den privata nyckeln',
          modalDescription: 'Nyckeln sparas på den här enheten och visas aldrig igen',
          placeholder: 'Klistra in den privata nyckeln',
          generateConfirmTitle: 'Generera en ny privat nyckel?',
          generateConfirmDesc:
            'Den nuvarande nyckeln slutar fungera. Lägg sedan till den nya publika nyckeln hos peeren.',
          removeConfirmTitle: 'Ta bort den privata nyckeln?',
          removeConfirmDesc: 'WireGuard stängs av och förblir av tills en ny nyckel har angetts.'
        },
        publicKey: {
          title: 'Publik nyckel',
          description: 'Lägg till den i peerens konfiguration'
        },
        address: {
          title: 'Adress',
          description: 'KVM-adress i tunneln och dess mask'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Publik nyckel',
          publicKeyDescription: 'Publik nyckel för peeren du ansluter till',
          server: 'Server',
          serverDescription: 'Peerens värdnamn eller IP-adress',
          port: 'Port',
          portDescription: 'Peerens UDP-port, vanligtvis 51820',
          allowedIps: 'Tillåtna IP-adresser',
          allowedIpsDescription:
            'Peerens adress eller intervall i tunneln, till exempel 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Sekunder mellan keepalive-paket, behövs bakom en router'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Nå den här KVM:en genom ditt Tailscale-nätverk',
        service: 'Tjänst',
        performance: 'Prestanda',
        memory: {
          title: 'Minnesoptimering',
          tip: 'Håller Tailscales minnesanvändning låg, vilket hjälper på en enhet med lite RAM. Starta om Tailscale för att ändringen ska gälla.'
        },
        swap: {
          title: 'Swap-fil',
          tip: 'Om problemen kvarstår efter att du har aktiverat minnesoptimering, försök att aktivera swap-filen',
          sizeTip:
            'Detta ställer in filstorleken till 128MB; justera den i Inställningar > System > Prestanda'
        },
        restartTitle: 'Starta om Tailscale',
        restartDesc: 'Startar om tjänsten',
        restartBtn: 'Starta om',
        restart: 'Starta om Tailscale?',
        stopTitle: 'Stoppa Tailscale',
        stopBtn: 'Stoppa',
        stop: 'Stoppa Tailscale?',
        stopDesc: 'Stoppar tjänsten och hindrar den från att starta vid uppstart',
        loading: 'Laddar...',
        notInstall: 'Tailscale hittades inte, installera först',
        install: 'Installera',
        installing: 'Installerar',
        failed: 'Installationen misslyckades',
        retry: 'Uppdatera sidan och försök igen, eller installera manuellt.',
        download: 'Ladda ner',
        package: 'installationspaketet',
        unzip: 'och packa upp det',
        upTailscale: 'Ladda upp tailscale till NanoKVM-katalogen /usr/bin/',
        upTailscaled: 'Ladda upp tailscaled till NanoKVM-katalogen /usr/sbin/',
        refresh: 'Uppdatera sidan',
        notRunning: 'Tailscale körs inte. Starta den för att fortsätta.',
        run: 'Start',
        notLogin: 'Enheten är ännu inte bunden. Logga in och bind enheten till ditt konto.',
        urlPeriod: 'Denna URL är giltig i 10 minuter',
        login: 'Logga in',
        loginSuccess: 'Inloggning lyckades',
        deviceName: 'Enhetsnamn',
        deviceIP: 'Enhets-IP',
        account: 'Konto',
        logout: 'Logga ut',
        logoutDesc: 'Är du säker på att du vill logga ut?',
        uninstall: 'Avinstallera Tailscale',
        uninstallDesc: 'Är du säker på att du vill avinstallera Tailscale?',
        okBtn: 'Ja',
        cancelBtn: 'Nej'
      },
      update: {
        title: 'Uppdateringar',
        currentVersion: 'Nuvarande version',
        latestVersion: 'Senaste version',
        queryFailed: 'Kunde inte hämta version',
        updateFailed: 'Uppdatering misslyckades',
        paranoidBlocked: 'Onlineuppdateringar blockeras av brandväggsläget Paranoid',
        paranoidBlockedDesc:
          'GitHub-kontroller och nedladdningar kräver utgående nätverksåtkomst. Offlineuppladdning och redan förberedda installationer är fortsatt tillgängliga.',
        available: 'En uppdatering finns tillgänglig. Vill du uppdatera nu?',
        updating: 'Uppdatering påbörjad',
        confirm: 'Bekräfta',
        cancel: 'Avbryt',
        badge: {
          checking: 'Kontrollerar',
          latest: 'Uppdaterad',
          available: 'Uppdatering tillgänglig',
          failed: 'Kontrollen misslyckades',
          local: 'Lokal'
        },
        application: {
          title: 'Program'
        },
        system: {
          queryFailed: 'Kunde inte hämta systemversion',
          appUpdateRequired:
            'Uppdatera programmet till {{version}} innan du installerar den här systemuppdateringen',
          requiredAppVersion: 'Programversion som krävs',
          downloadFailed: 'Nedladdning eller verifiering misslyckades',
          available: 'En uppdatering av bassystemet är tillgänglig.',
          downloading: 'Laddar ned och verifierar systemuppdatering...',
          downloadVerify: 'Ladda ned och verifiera',
          installing: 'Installerar förberedd systemuppdatering...',
          install: 'Installera',
          installFailed: 'Installation misslyckades',
          installConfirmTitle: 'Installera systemuppdatering?',
          installConfirmDesc:
            'Detta ersätter bassystemfiler från det verifierade paketet. Omstart krävs.',
          rawInstallConfirmDesc:
            'Detta verifierade paket skriver raw boot/rootfs-images till SD-kortets partitioner och startar om automatiskt. Skrivning kan ta flera minuter; håll strömmen ansluten.',
          rawInstallWarning:
            'Det finns ingen automatisk rollback för raw partitionsuppdateringar. Om boot misslyckas, återställ SD-kortet manuellt.',
          rawWaitTitle: 'Installerar systemuppdatering',
          rawWaitWriting: 'Det nya systemet skrivs till SD-kortet',
          rawWaitRestarting: 'Enheten startar om. Den här sidan läses in igen när den är tillbaka.',
          rawWaitDesc:
            'Det här tar ungefär tre minuter. Låt strömmen vara ansluten och stäng inte den här sidan.',
          rawWaitSlow:
            'Det tar längre tid än väntat. Vänta några minuter till innan du kopplar från strömmen.',
          rebootRequired: 'Omstart krävs för att aktivera detta systemtillstånd.',
          rollingBack: 'Rullar tillbaka systemuppdatering...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback förberedd',
          rollbackFailed: 'Rollback misslyckades',
          rollbackConfirmTitle: 'Rollback systemuppdatering?',
          rollbackConfirmDesc:
            'Detta återställer filer från den senaste systemuppdateringskopian. Omstart krävs.',
          stagedDesc:
            'Systemuppdateringen har laddats ned och verifierats, du kan installera den nu',
          refresh: 'Uppdatera',
          releaseNotes: 'Versionsnoteringar',
          systemVersion: 'Systemversion',
          kernel: 'Kernel',
          stagedVersion: 'Förberedd version',
          archive: 'Arkiv',
          requiredFree: 'Krävt ledigt utrymme',
          fileCount: 'Filer',
          rawImages: 'Raw images',
          progress: 'Förlopp',
          progressMessage: 'Förloppsmeddelande',
          pendingVersion: 'Väntande version',
          bootHealth: 'Bootstatus',
          healthy: 'Frisk',
          unhealthy: 'Kräver uppmärksamhet',
          rollbackBackup: 'Rollback-säkerhetskopia'
        },
        offline: {
          title: 'Ladda upp programpaket',
          desc: 'Installera ett programpaket från den här datorn. Servern startar om efteråt.',
          installTitle: 'Installera programuppdatering?',
          installDesc: 'Programmet ersätts och servern startar om. Du måste logga in igen.'
        },
        local: {
          title: 'Ladda upp systempaket',
          desc: 'Installera ett systempaket från den här datorn. En fil innehåller arkivet och dess signerade metadata.',
          choose: 'Välj fil',
          invalidFile: 'Välj ett paket som slutar på .tar eller .tar.gz.',
          diskTitle: 'Stänga av den virtuella disken?',
          diskWarn:
            'Paketet sparas på /data, som är skrivskyddat medan den virtuella disken är på. När den stängs av kommer datorn inte åt /data. Fortsätta?',
          uploading: 'Laddar upp',
          verifying: 'Verifierar och förbereder paketet',
          keyTitle: 'Lokal uppdateringsnyckel',
          keyDesc: 'Publik nyckel i PEM-format som får signera paket du bygger själv',
          keyNone: 'Ingen nyckel angiven',
          keySet: 'Ange nyckel',
          keyRemove: 'Ta bort',
          signer: 'Signerad av',
          section: 'Lokala uppdateringar',
          keyRequired: 'Lokal nyckel krävs'
        }
      },
      account: {
        title: 'Konto',
        webAccount: 'Webbkontonamn',
        password: 'Lösenord',
        passwordDesc: 'Ändra lösenordet som används för att logga in i webbgränssnittet',
        updateBtn: 'Byt',
        logoutBtn: 'Logga ut',
        logoutDesc: 'Är du säker på att du vill logga ut?',
        okBtn: 'Ja',
        cancelBtn: 'Nej',
        session: {
          title: 'Session'
        },
        logoutOnClose: {
          title: 'Logga ut när webbläsaren stängs',
          description: 'Avsluta sessionen när webbläsaren stängs i stället för att hålla den öppen'
        },
        totp: {
          title: 'Tvåfaktorsautentisering',
          authenticator: 'Autentiseringsapp',
          description: 'Kräv en tidsbaserad kod från en autentiseringsapp utöver lösenordet',
          required: 'Krävs av policy',
          disable: 'Inaktivera',
          enableTitle: 'Konfigurera tvåfaktorsautentisering',
          enableDescription:
            'Bekräfta ditt lösenord för att fortsätta. Det krävs vid varje ändring av den andra faktorn.',
          continue: 'Fortsätt',
          disableTitle: 'Inaktivera tvåfaktorsautentisering?',
          disableDescription:
            'Ditt konto skyddas då bara av lösenordet. Bekräfta med ditt lösenord för att fortsätta.',
          disableFailed: 'Det gick inte att inaktivera tvåfaktorsautentisering',
          passwordPlaceholder: 'Nuvarande lösenord',
          enrollFailed: 'Det gick inte att starta konfigurationen',
          invalidCode: 'Koden stämmer inte. Försök med nästa.',
          scan: 'Skanna detta med din autentiseringsapp.',
          manualEntry: 'Eller ange den här nyckeln manuellt:',
          codePlaceholder: 'Ange den sexsiffriga koden för att bekräfta',
          confirm: 'Bekräfta',
          cancel: 'Avbryt',
          backupTitle: 'Spara dina reservkoder nu',
          backupDescription:
            'Varje kod fungerar bara en gång och visas inte igen. De är den enda vägen in om du förlorar din autentiseringsapp, och de fungerar även när enhetens klocka inte är synkroniserad.',
          copy: 'Kopiera',
          copied: 'Reservkoder kopierade',
          savedThem: 'Jag har sparat dem',
          remaining: '{{remaining}} reservkoder kvar',
          clockUnsynced:
            'Enhetens klocka är inte synkroniserad än. Synkronisera tiden i Inställningar > System > Tid innan du konfigurerar.',
          noBackupCodes:
            'Det finns inga reservkoder kvar. Välj Skapa för att utfärda en ny uppsättning.',
          regenerate: 'Nya reservkoder',
          generate: 'Skapa',
          regenerateTitle: 'Utfärda nya reservkoder?',
          regenerateDescription:
            'Dina nuvarande reservkoder slutar fungera. Bekräfta med ditt lösenord för att fortsätta.',
          regenerateFailed: 'Det gick inte att utfärda nya reservkoder',
          download: 'Ladda ned',
          copyFailed: 'Det gick inte att kopiera. Markera koderna och kopiera dem manuellt.',
          requireTitle: 'Kräv tvåfaktorsautentisering',
          requireDescription:
            'Förhindrar att tvåfaktorsautentisering inaktiveras, och ett konto utan den måste konfigurera den innan enheten kan användas',
          requireFailed: 'Det gick inte att ändra kravet',
          requiredTitle: 'Tvåfaktorsautentisering krävs',
          requiredDescription:
            'Den här enheten är inställd på att kräva en andra faktor, men ditt konto har inte konfigurerat någon än. Konfigurera den nu för att fortsätta.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw-assistent',
      empty: 'Beskriv en uppgift för att börja',
      inputPlaceholder: 'Beskriv vad du vill att PicoClaw ska göra',
      newConversation: 'Ny konversation',
      processing: 'Bearbetar...',
      agent: {
        defaultTitle: 'Allmän assistent',
        defaultDescription: 'Allmän hjälp för chatt, sökning och arbetsyta',
        kvmTitle: 'Fjärrstyrning',
        kvmDescription: 'Manövrera fjärrvärden genom NanoKVM',
        switched: 'Agentroll bytte',
        switchFailed: 'Det gick inte att byta agentroll'
      },
      send: 'Skicka',
      cancel: 'Avbryt',
      status: {
        connecting: 'Ansluter till gateway...',
        connected: 'PicoClaw-session ansluten',
        disconnected: 'PicoClaw-session frånkopplad',
        stopped: 'Stoppbegäran har skickats',
        runtimeStarted: 'PicoClaw runtime startad',
        runtimeStartFailed: 'Det gick inte att starta PicoClaw runtime',
        runtimeStopped: 'PicoClaw runtime stoppad',
        runtimeStopFailed: 'Det gick inte att stoppa PicoClaw runtime'
      },
      connection: {
        runtime: {
          checking: 'Kontrollerar',
          ready: 'Runtime klar',
          stopped: 'Runtime stoppad',
          unavailable: 'Runtime inte tillgänglig',
          configError: 'Konfigurationsfel'
        },
        transport: {
          connecting: 'Ansluter',
          connected: 'Ansluten'
        },
        run: {
          idle: 'Inaktiv',
          busy: 'Upptagen'
        }
      },
      error: {
        lockHeld: 'PicoClaw används i ett annat fönster',
        takenOver: 'Ett annat fönster tog över PicoClaw',
        authFailed: 'PicoClaw avvisade anslutningen',
        upstreamClosed: 'Anslutningen till PicoClaw bröts'
      },
      tool: {
        screenshot: 'Tar en skärmdump',
        loadImage: 'Tittar på skärmdumpen',
        actions: 'Styr värden',
        generic: 'Använder {{name}}',
        type: 'Skriver {{text}}',
        hotkey: 'Trycker på {{keys}}',
        click: 'Klickar',
        doubleClick: 'Dubbelklickar',
        move: 'Flyttar musen',
        drag: 'Drar',
        scroll: 'Rullar',
        wait: 'Väntar'
      },
      message: {
        toolAction: 'Åtgärd',
        observation: 'Observation',
        screenshot: 'Skärmdump'
      },
      overlay: {
        locked: 'PicoClaw styr enheten. Manuell inmatning är pausad.'
      },
      install: {
        install: 'Installera PicoClaw',
        installing: 'Installerar PicoClaw',
        success: 'PicoClaw har installerats framgångsrikt',
        failed: 'Det gick inte att installera PicoClaw',
        uninstalled: 'PicoClaw har avinstallerats',
        uninstallFailed: 'Avinstallationen misslyckades',
        requiredTitle: 'PicoClaw är inte installerad',
        requiredDescription: 'Installera PicoClaw innan du startar PicoClaw runtime.',
        progressDescription: 'PicoClaw laddas ner och installeras.',
        stages: {
          preparing: 'Förbereder',
          downloading: 'Laddar ner',
          extracting: 'Packar upp',
          verifying: 'Verifierar',
          installing: 'Installerar',
          installed: 'Installerad',
          install_timeout: 'Timeout',
          install_failed: 'Misslyckades'
        }
      },
      model: {
        requiredTitle: 'Modellkonfiguration krävs',
        requiredDescription: 'Konfigurera PicoClaw-modellen innan du använder PicoClaw-chatten.',
        docsTitle: 'Konfigurationsguide',
        docsDesc: 'Modeller och protokoll som stöds',
        menuLabel: 'Konfigurera modell',
        modelIdentifier: 'Modellidentifierare',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API-bas-URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API-nyckel',
        apiKeyPlaceholder: 'Ange modellens API-nyckel',
        apiKeyKeepPlaceholder: 'Lämna tomt för att behålla nuvarande nyckel',
        save: 'Spara',
        saving: 'Sparar',
        saved: 'Modellkonfiguration sparad',
        saveFailed: 'Det gick inte att spara modellkonfigurationen',
        invalid: 'Modellidentifierare, API-bas-URL och API-nyckel krävs'
      },
      uninstall: {
        confirmTitle: 'Avinstallera PicoClaw',
        confirmContent:
          'Är du säker på att du vill avinstallera PicoClaw? Detta kommer att radera den körbara filen och alla konfigurationsfiler.',
        confirmOk: 'Avinstallera'
      },
      history: {
        title: 'Historik',
        loading: 'Laddar sessioner...',
        emptyTitle: 'Ingen historik än',
        emptyDescription: 'Tidigare PicoClaw-sessioner kommer att visas här.',
        loadFailed: 'Det gick inte att ladda sessionshistoriken',
        deleteFailed: 'Det gick inte att ta bort sessionen',
        deleteConfirmTitle: 'Ta bort session',
        deleteConfirmContent: 'Är du säker på att du vill ta bort "{{title}}"?',
        deleteConfirmOk: 'Ta bort',
        messageCount_one: '{{count}} meddelande',
        messageCount_other: '{{count}} meddelanden'
      },
      config: {
        startRuntime: 'Starta PicoClaw',
        stopRuntime: 'Stoppa PicoClaw',
        stopConfirm: 'Stoppa PicoClaw?'
      },
      start: {
        title: 'Starta PicoClaw',
        description: 'Starta runtime för att börja använda PicoClaw-assistenten.'
      }
    },
    error: {
      title: 'Vi stötte på ett problem',
      refresh: 'Uppdatera'
    },
    fullscreen: {
      toggle: 'Växla fullskärm'
    },
    menu: {
      collapse: 'Fäll ihop menyn'
    }
  }
};

export default se;
