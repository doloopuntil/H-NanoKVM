const it = {
  translation: {
    common: {
      confirm: 'Conferma',
      cancel: 'Annulla',
      save: 'Salva',
      discard: 'Scarta',
      delete: 'Elimina',
      actionFailed: 'Operazione non riuscita',
      loading: 'Caricamento delle impostazioni dal dispositivo...',
      loadFailed: 'Impossibile caricare le impostazioni dal dispositivo',
      retry: 'Riprova'
    },
    head: {
      desktop: 'Desktop remoto',
      login: 'Accesso',
      firstSetup: 'Prima configurazione',
      changePassword: 'Cambia password',
      terminal: 'Terminale',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Accesso',
      placeholderUsername: 'Inserisci il nome utente',
      placeholderPassword: 'Inserisci la password',
      placeholderPassword2: 'Inserisci nuovamente la password',
      noEmptyUsername: 'Il nome utente non può essere vuoto',
      noEmptyPassword: 'La password non può essere vuota',
      invalidUser: 'Nome utente o password non validi',
      locked: 'Troppi accessi, riprova più tardi',
      globalLocked: 'Sistema sotto protezione, riprova più tardi',
      error: 'Errore imprevisto',
      changePassword: 'Cambia password',
      changePasswordDesc:
        'Per la sicurezza del tuo dispositivo, modifica la password di accesso web',
      differentPassword: 'Le password non corrispondono',
      illegalUsername: 'Il nome utente contiene caratteri non validi',
      illegalPassword:
        'La password deve contenere almeno 8 caratteri e non può contenere virgolette o barre',
      forgetPassword: 'Hai dimenticato la password',
      ok: 'Ok',
      cancel: 'Annulla',
      loginButtonText: 'Accedi',
      setupTitle: 'Crea account amministratore',
      setupDescription:
        'Su questo dispositivo non esiste ancora un account web. Crea il primo account amministratore per continuare.',
      setupRecovery:
        'Se questa password viene persa, il recupero richiede la riscrittura della scheda SD',
      setupButtonText: 'Crea account',
      tips: {
        hardenedRecovery:
          'Questa immagine Hardened non supporta il reset della password dal pulsante BOOT. Se la password viene persa, riscrivi la scheda SD e crea un nuovo account.',
        change1: 'Tieni presente che questa azione modificherà le seguenti password:',
        change2: 'Password di accesso web',
        change3: "Password root di sistema per l'accesso SSH"
      },
      placeholderCurrentPassword: 'Password attuale',
      placeholderNewPassword: 'Nuova password',
      wrongCurrentPassword: 'La password attuale non è corretta',
      totp: {
        title: 'Autenticazione a due fattori',
        prompt: 'Inserisci il codice a 6 cifre della tua app di autenticazione',
        backupPrompt: 'Inserisci uno dei tuoi codici di backup',
        noEmptyCode: 'Inserisci un codice',
        placeholderCode: 'Codice a 6 cifre',
        placeholderBackup: 'Codice di backup',
        verifyButtonText: 'Verifica',
        useBackupCode: 'Usa un codice di backup',
        useAuthenticator: "Usa il codice dell'app di autenticazione",
        cancel: 'Indietro',
        invalidCode: 'Questo codice non è valido. Riprova.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Configura il Wi-Fi per NanoKVM',
      success: 'Vai al dispositivo per controllare lo stato della rete di NanoKVM',
      failed: 'Operazione non riuscita, riprova',
      invalidMode:
        'La modalità corrente non supporta la configurazione di rete. Vai al tuo dispositivo e abilita la modalità di configurazione Wi-Fi.',
      confirmBtn: 'Ok',
      finishBtn: 'Completato',
      ap: {
        authTitle: 'Autenticazione richiesta',
        authDescription: 'Inserisci la password AP per continuare',
        authFailed: 'Password AP non valida',
        passPlaceholder: 'Password AP',
        verifyBtn: 'Verifica'
      }
    },
    screen: {
      scale: 'Scala',
      title: 'Schermo',
      video: 'Modalità video',
      videoDirectTips:
        'Abilita HTTPS in "Impostazioni > Rete > Servizi" per utilizzare questa modalità',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC è disattivato nelle modalità firewall Ristretta e Paranoica',
      transferRunningTitle: 'Trasferimento immagine in corso',
      transferRunningDesc:
        "Cambiare la modalità video ricarica la pagina e annulla il caricamento o il download dell'immagine in corso.",
      transferRunningOk: 'Cambia modalità',
      resolution: 'Risoluzione',
      auto: 'Automatico',
      autoTips:
        'A risoluzioni specifiche possono verificarsi tearing dello schermo o spostamento del mouse, quindi regola la risoluzione del dispositivo remoto o disabilita la modalità automatica',
      fps: 'FPS',
      customizeFps: 'Personalizza',
      quality: 'Qualità',
      qualityLossless: 'Senza perdita',
      qualityHigh: 'Alto',
      qualityMedium: 'Medio',
      qualityLow: 'Basso',
      frameDetect: 'Rilevamento frame',
      frameDetectTip:
        "Confronta i frame e interrompe l'invio del video finché lo schermo del dispositivo remoto non cambia",
      resetHdmi: 'Reimposta HDMI',
      webrtcConnectionFailed: {
        title: 'Connessione WebRTC non riuscita',
        description: 'Controlla la connessione di rete o cambia la modalità video'
      },
      captureStatus: {
        hdmiError: 'Errore schermata HDMI',
        unsupportedResolution: 'La risoluzione attuale non è supportata',
        retrieving: 'Acquisizione schermata...',
        changingResolution: 'Cambio risoluzione...',
        updateFailed: 'Lo schermo non può aggiornarsi al momento',
        videoError: 'Errore di visualizzazione video',
        noHdmi: 'Nessun segnale HDMI rilevato',
        unavailable: 'Lo schermo non può essere visualizzato al momento'
      }
    },
    keyboard: {
      title: 'Tastiera',
      paste: 'Incolla',
      tips: 'Sono supportati solo lettere e simboli standard della tastiera',
      placeholder: 'Testo da incollare',
      local: 'Tastiera mobile',
      virtual: 'Tastiera su schermo',
      readClipboard: 'Leggi dagli appunti',
      clipboardPermissionDenied:
        "Autorizzazione per gli appunti negata, consenti l'accesso agli appunti nel browser",
      clipboardReadError: 'Impossibile leggere gli appunti',
      dropdownEnglish: 'Inglese',
      dropdownGerman: 'Tedesco',
      dropdownFrench: 'Francese',
      dropdownRussian: 'Russo',
      dropdownKorean: 'Coreano',
      dropdownJapanese: 'Giapponese',
      localInput: 'Input da tastiera mobile',
      shortcut: {
        title: 'Scorciatoie',
        custom: 'Personalizzato',
        capture: 'Fai clic qui per acquisire la scorciatoia',
        clear: 'Cancella',
        save: 'Salva',
        captureTips:
          "La cattura dei tasti di sistema, come il tasto Windows, richiede l'autorizzazione a schermo intero",
        enterFullScreen: 'Attiva/disattiva la modalità a schermo intero'
      },
      leaderKey: {
        title: 'Tasto Leader',
        desc: "Ignora le restrizioni del browser e invia le scorciatoie di sistema direttamente all'host remoto",
        howToUse: 'Come usare',
        simultaneous: {
          title: 'Modalità simultanea',
          desc1: 'Tieni premuto il tasto Leader, quindi premi la scorciatoia.',
          desc2: 'Intuitivo, ma potrebbe entrare in conflitto con le scorciatoie di sistema.'
        },
        sequential: {
          title: 'Modalità sequenziale',
          desc1:
            'Premi il tasto Leader → premi la scorciatoia in sequenza → premi di nuovo il tasto Leader.',
          desc2: 'Richiede più passaggi, ma evita completamente i conflitti di sistema.'
        },
        enable: 'Abilita tasto Leader',
        tip: 'Quando assegnato come tasto Leader, questo tasto funziona solo come attivatore di scorciatoie e perde il comportamento predefinito.',
        placeholder: 'Premi il tasto Leader',
        shiftRight: 'Shift destro',
        ctrlRight: 'Ctrl destro',
        metaRight: 'Win destro',
        recorder: {
          rec: 'REC',
          activate: 'Attiva i tasti',
          input: 'Premi la scorciatoia'
        }
      }
    },
    mouse: {
      title: 'Mouse',
      cursor: 'Stile cursore',
      default: 'Cursore predefinito',
      cell: 'Cursore a cella',
      text: 'Cursore testo',
      grab: 'Cursore di presa',
      hide: 'Nascondi cursore',
      mode: 'Modalità mouse',
      absolute: 'Modalità assoluta',
      relative: 'Modalità relativa',
      direction: 'Direzione della rotellina',
      scrollUp: "Scorri verso l'alto",
      scrollDown: 'Scorri verso il basso',
      speed: 'Velocità della rotellina',
      sensitivity: 'Velocità puntatore',
      sensitivityDesc:
        "Per la modalità relativa desktop: valori più bassi riducono la deriva causata dall'accelerazione del mouse dell'host",
      fast: 'Veloce',
      slow: 'Lento',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          "Muoviti ovunque nell'area KVM; il cursore remoto mantiene la posizione tra i tocchi e resta sincronizzato con HID assoluto"
      },
      requestPointer:
        'Usando la modalità relativa, clicca sul desktop per ottenere il puntatore del mouse',
      resetHid: 'Reimposta HID',
      hidOnly: {
        title: 'Modalità HID-Only',
        desc: "Se mouse o tastiera smettono di rispondere e il ripristino dell'HID non aiuta, potrebbe trattarsi di un problema di compatibilità tra il NanoKVM e l'host.",
        tip1: 'Abilitare la modalità HID-Only smonterà il disco virtuale e la rete virtuale',
        tip2: 'Nella modalità HID-Only il montaggio delle immagini è disabilitato',
        tip3: 'NanoKVM si riavvierà automaticamente dopo aver cambiato modalità',
        enable: 'Abilita la modalità HID-Only',
        disable: 'Disabilita la modalità HID-Only'
      }
    },
    image: {
      title: 'Immagini',
      loading: 'Caricamento...',
      empty: 'Nessun risultato',
      mountMode: 'Monta come',
      massStorage: 'Archiviazione di massa',
      cdRom: 'CD-ROM',
      mountFailed: 'Montaggio immagine non riuscito',
      mountDesc:
        "In alcuni sistemi, è necessario espellere il disco virtuale sull'host remoto prima di montare l'immagine",
      diskOnWarn:
        "Montare l'immagine disattiva il disco virtuale, quindi il computer non potrà più accedere a /data. Continuare?",
      diskOffWarn:
        "Il disco virtuale è disattivato e deve essere abilitato per montare l'immagine. I dispositivi USB sul computer vengono enumerati di nuovo. Continuare?",
      unmountFailed: 'Smontaggio non riuscito',
      unmountDesc:
        "Su alcuni sistemi è necessario espellere manualmente il disco dall'host remoto prima di smontare l'immagine",
      forceEject: "Forza l'espulsione",
      forceEjectConfirm:
        "L'host ha bloccato l'unità ottica. Forzare l'espulsione disconnette per un momento il dispositivo USB virtuale, quindi tastiera e mouse potrebbero disconnettersi brevemente. Continuare?",
      usbReconnect: 'Ricollega USB',
      usbReconnectConfirm:
        "Ricollega il gadget USB solo se l'host remoto non ha rilevato il cambio del supporto. Tastiera e mouse potrebbero disconnettersi brevemente.",
      usbReconnectSuccess: 'USB ricollegato',
      usbReconnectFailed: 'Ricollegamento USB non riuscito',
      addImage: 'Aggiungi immagine',
      fromUrl: 'Da URL',
      fromFile: 'Da file',
      turnOff: 'Disattiva',
      eject: 'Espelli',
      download: 'Scarica',
      upload: 'Carica',
      mountTitle: 'Monta immagine',
      deleteTitle: 'Elimina immagine',
      deleteConfirm: 'Sei sicuro di voler eliminare questa immagine?',
      tips: {
        title: 'Come caricare',
        usb1: 'Collega il NanoKVM al tuo computer tramite USB.',
        usb2: 'Assicurati che il disco virtuale sia montato in Impostazioni > Dispositivo > Disco virtuale.',
        usb3: 'Apri il disco virtuale sul tuo computer e copia il file immagine nella directory principale del disco.',
        scp1: 'Assicurati che il NanoKVM e il tuo computer siano sulla stessa rete locale.',
        scp2: 'Apri un terminale sul tuo computer e usa il comando SCP per caricare il file immagine nella directory /data del NanoKVM.',
        scp3: 'Esempio: scp il-tuo-percorso-immagine root@il-tuo-ip-nanokvm:/data',
        tfCard: 'Scheda SD',
        tf1: 'Questo metodo è supportato su sistemi Linux',
        tf2: 'Recupera la scheda SD dal NanoKVM. Sulla versione FULL, smonta prima il case.',
        tf3: 'Inserisci la scheda SD in un lettore di schede e collegala al tuo computer.',
        tf4: 'Copia il file immagine nella directory /data sulla scheda SD.',
        tf5: 'Inserisci la scheda SD nel NanoKVM.'
      }
    },
    script: {
      title: 'Script',
      upload: 'Carica',
      run: 'Esegui',
      runBackground: 'Esegui in background',
      runFailed: 'Esecuzione non riuscita',
      delDesc: 'Sei sicuro di voler eliminare questo file?',
      delete: 'Elimina',
      close: 'Chiudi'
    },
    terminal: {
      title: 'Terminale',
      nanokvm: 'Terminale NanoKVM',
      serial: 'Terminale porta seriale',
      unlockTitle: 'Sblocca terminale',
      unlockDesc: "Inserisci la password dell'account web per avviare una sessione terminale",
      unlock: 'Sblocca',
      unlockFailed: 'Impossibile sbloccare il terminale',
      invalidCredentials: 'Nome utente o password non validi',
      locked: 'Troppi tentativi, riprova più tardi',
      sessionClosed: 'Sessione terminale chiusa. Sblocca di nuovo per riconnettere.',
      sessionError: 'Connessione terminale non riuscita. Sblocca di nuovo per riprovare.',
      serialPort: 'Porta seriale',
      serialPortPlaceholder: 'Ad esempio /dev/ttyS1',
      baudrate: 'Baud rate',
      parity: 'Parità',
      parityNone: 'Nessuno',
      parityEven: 'Pari',
      parityOdd: 'Dispari',
      flowControl: 'Controllo del flusso',
      flowControlNone: 'Nessuno',
      flowControlSoft: 'Software',
      flowControlHard: 'Hardware',
      dataBits: 'Bit di dati',
      stopBits: 'Bit di stop',
      open: 'Apri terminale'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Invio comando...',
      sent: 'Comando inviato',
      input: 'Indirizzo MAC',
      ok: 'OK'
    },
    download: {
      input: "URL dell'immagine remota",
      ok: 'OK',
      disabled:
        "Al momento non è possibile scaricare né caricare immagini perché l'archiviazione non è scrivibile. Se un'immagine è montata, smontala e poi disattiva il disco virtuale per rendere di nuovo scrivibile l'archiviazione.",
      diskShared: 'Disattiva il disco virtuale per usare il download delle immagini',
      mountedImage:
        'Questa immagine è montata, smontala prima di caricare un file con lo stesso nome',
      diskOff: 'Disattiva il disco virtuale',
      uploadbox: 'Rilascia il file qui o fai clic per selezionarlo',
      inputfile: 'File immagine',
      NoISO: 'Nessuna immagine',
      complete: 'Download completato',
      uploadComplete: 'Caricamento completato',
      downloading: 'Download in corso',
      uploading: 'Caricamento in corso',
      failed: 'Trasferimento non riuscito',
      uploadFailed: 'Caricamento non riuscito',
      stalled: 'Il trasferimento si è bloccato, controlla la connessione e riprova',
      canceled: 'Caricamento annullato',
      downloadCanceled: 'Download annullato',
      cancel: 'Annulla',
      remoteDisabled: 'Il download ISO remoto è disattivato in Impostazioni > Utente > Preferenze',
      remoteFailed: 'Download ISO remoto non riuscito',
      sha256: 'Checksum SHA-256 facoltativo',
      sha256Placeholder: 'Inserisci un checksum SHA-256 di 64 caratteri',
      invalidSHA256: 'SHA-256 deve essere una stringa esadecimale di 64 caratteri',
      checksumFailed: 'Download non riuscito: verifica SHA-256 non riuscita'
    },
    power: {
      title: 'Accensione',
      showConfirm: 'Conferma',
      showConfirmTip: 'Le operazioni di alimentazione richiedono una conferma aggiuntiva',
      reset: 'Reimposta',
      powerShort: 'Pulsante di accensione: clic breve',
      powerLong: 'Pulsante di accensione: clic lungo',
      resetConfirm: "Eseguire l'operazione di reimpostazione?",
      powerConfirm: "Eseguire l'operazione di accensione?",
      okBtn: 'Sì',
      cancelBtn: 'No'
    },
    settings: {
      title: 'Impostazioni',
      about: {
        title: 'Info',
        information: 'Informazioni',
        ip: 'Indirizzo IP',
        mdns: 'Indirizzo locale',
        application: 'Versione applicazione',
        uptime: 'Tempo di attività',
        community: 'Comunità',
        credit: 'Basato su <a1>NanoKVM</a1> di Sipeed e <a2>Hardened NanoKVM</a2> di woffko',
        hostname: 'Nome dispositivo',
        changeIn: 'Modificabile in {{path}}',
        updateIn: 'Aggiornabile in {{path}}',
        toggleIn: 'Attivabile o disattivabile in {{path}}'
      },
      appearance: {
        title: 'Preferenze',
        display: 'Schermo',
        language: 'Lingua',
        languageDesc: "Seleziona la lingua per l'interfaccia",
        webTitle: 'Titolo web',
        webTitleDesc: 'Personalizza il titolo della pagina web',
        layoutMode: "Layout dell'interfaccia",
        layoutModeDesc: 'Usa il layout per telefono/touch in questo browser',
        layoutAuto: 'Automatico',
        layoutMobile: 'Telefono',
        menuBar: {
          title: 'Barra dei menu',
          mode: 'Modalità di visualizzazione',
          modeDesc: 'Visualizza la barra dei menu sullo schermo',
          modeOff: 'Spento',
          modeAuto: 'Nascondi automaticamente',
          modeAlways: 'Sempre visibile',
          keyboardLedStatus: 'Indicatori di blocco della tastiera',
          keyboardLedStatusDesc:
            'Mostra lo stato di Bloc Num, Bloc Maiusc e Bloc Scorr del computer remoto',
          icons: 'Icone dei sottomenu',
          iconsDesc: 'Visualizza le icone dei sottomenu nella barra dei menu',
          terminalWarningTitle: 'Abilitare il terminale web?',
          terminalWarningDesc:
            'Il terminale apre una shell root nel browser. Abilitalo solo su una rete affidabile e disattivalo al termine.',
          terminalWarningConfirm: 'Abilita',
          remoteDownload: 'Scarica ISO remota',
          remoteDownloadWarningTitle: 'Abilitare il download ISO remoto?',
          remoteDownloadWarningDesc:
            'NanoKVM scaricherà una ISO da un URL e la scriverà in /data. Abilita solo URL affidabili e disattiva al termine.',
          remoteDownloadWarningConfirm: 'Abilita'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Stato dei blocchi della tastiera remota',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Bloc Num',
        numLockShort: 'Num',
        capsLock: 'Bloc Maiusc',
        capsLockShort: 'Mai',
        scrollLock: 'Bloc Scorr',
        scrollLockShort: 'Scorr',
        on: 'Attivo',
        off: 'Disattivo',
        unknown: 'Sconosciuto'
      },
      device: {
        title: 'Dispositivo',
        minutes: 'min',
        sections: {
          general: 'Generale',
          connectivity: 'Connettività',
          hostConnection: "Connessione all'host",
          inputOutput: 'Input e output'
        },
        oled: {
          title: 'Timeout OLED',
          description: 'Spegni lo schermo OLED dopo',
          keepOn: "Mantieni l'OLED acceso",
          keepOnDescription: 'Non spegnere mai lo schermo OLED'
        },
        ssh: {
          description: "Abilita l'accesso remoto SSH",
          tip: 'Imposta una password complessa in Account > Password prima di abilitare questa opzione'
        },
        swap: {
          title: 'Swap',
          description: 'Usa un file di scambio quando la memoria sta per esaurirsi',
          size: 'Dimensione dello swap',
          sizeDescription: 'Imposta la dimensione del file di scambio',
          tip: 'Abilitare questa funzione potrebbe ridurre la durata utile della tua scheda SD'
        },
        mouseJiggler: {
          title: 'Muovi il mouse',
          description: "Impedisce la sospensione dell'host remoto",
          disable: 'Disabilita',
          absolute: 'Modalità assoluta',
          relative: 'Modalità relativa'
        },
        sessionLock: {
          title: 'Blocca sessione quando inattiva',
          description: 'Richiedi di nuovo il login dopo questo tempo'
        },
        mdns: {
          description: 'Abilita il servizio di rilevamento mDNS',
          tip: 'Consente di raggiungere questo dispositivo tramite il nome .local. Non serve se ti connetti tramite indirizzo IP o se il tuo DNS risolve già il nome host.'
        },
        hdmi: {
          description: "Abilita l'uscita HDMI/monitor",
          idleTimeoutTitle: 'Timeout cattura inattiva',
          idleTimeoutDescription:
            'Interrompi la cattura HDMI dopo che non ci sono visualizzatori attivi per'
        },
        hidOnly: 'Modalità HID-Only',
        hidOnlyDesc:
          "Migliora la compatibilità con l'host se mouse o tastiera smettono di rispondere",
        hidOnlyTip:
          'La modalità HID-Only smette di emulare i dispositivi virtuali, mantenendo solo il controllo di base HID',
        disk: 'Disco virtuale',
        diskDesc: "Monta la scheda SD sull'host remoto",
        diskLocked: "Disattivato mentre un'immagine è montata, e attivarlo annulla il montaggio",
        diskEnable: 'Abilita il disco virtuale',
        networkChange: 'Cambia la rete virtuale',
        diskCancelMount: "Abilitare il disco virtuale annulla l'immagine montata. Continuare?",
        networkCancelMount:
          "Modificare la rete virtuale riavvia la connessione USB. Questo annulla l'immagine montata e abilita il disco virtuale. Continuare?",
        diskTransferRunning:
          'Un trasferimento di immagine è in corso. Attendi che termini prima di abilitare il disco virtuale.',
        network: 'Rete virtuale',
        networkDesc: "Monta la scheda di rete virtuale sull'host remoto",
        usbWakeup: 'Risveglio USB',
        usbWakeupDesc: "Consente a tastiera o mouse di riattivare l'host remoto",
        usbWakeupTip: "Disattiva se l'host registra messaggi USB wakeup ripetuti",
        hostname: {
          description: 'Nome di questo dispositivo nella rete',
          reachable: 'Raggiungibile nella rete locale come {{address}}'
        },
        rebootRequired: 'Riavvio necessario',
        rebootPending: 'Riavvio necessario per: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Aggiornamento di sistema'
        },
        reboot: 'Riavvia',
        rebootDesc: 'Sei sicuro di voler riavviare NanoKVM?',
        poweroff: 'Spegni',
        poweroffDesc: 'Spegnere NanoKVM? Non sarà raggiungibile finché non verrà riacceso.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Connessione',
        configuration: 'Configurazione',
        wifi: {
          title: 'Wi-Fi',
          description: 'Configura Wi-Fi',
          apMode: 'La modalità AP è attiva, connettiti al Wi-Fi scansionando il codice QR',
          connect: 'Connetti Wi-Fi',
          connectDesc1: 'Inserisci SSID e password della rete',
          disconnect: 'Vuoi davvero disconnettere la rete?',
          disconnectBtn: 'Disconnetti',
          connected: 'Connesso',
          ssid: 'Nome',
          password: 'Password',
          joinBtn: 'Connetti',
          cancelBtn: 'Annulla'
        },
        tls: {
          description: 'Abilita protocollo HTTPS',
          tip: "Attenzione: l'uso di HTTPS può aumentare la latenza, soprattutto in modalità video MJPEG",
          restartTitle: 'Il server verrà riavviato',
          restartDesc:
            'La modifica del protocollo riavvia il server. Il browser passerà al nuovo indirizzo dopo {{seconds}} secondi:',
          restartOk: 'Applica e riavvia',
          confirmTitle: 'Mantenere il nuovo protocollo?',
          confirmDesc:
            'Il server ora usa {{protocol}}. Tornerà al protocollo precedente tra {{seconds}} secondi se non lo mantieni.',
          confirmKeep: 'Mantieni',
          confirmRevert: 'Torna indietro',
          reverting:
            "Ritorno al protocollo precedente. Il browser passerà a quell'indirizzo dopo {{seconds}} secondi.",
          certTitle: 'Mantenere il nuovo certificato?',
          certDesc:
            'Il server ora usa il nuovo certificato. Torna al precedente tra {{seconds}} secondi se non lo mantieni.',
          certReverted: 'Il certificato precedente è tornato'
        },
        trustedProxies: {
          section: 'Proxy inverso',
          title: 'Proxy attendibili',
          description:
            "Proxy inversi di cui il dispositivo si fida per l'indirizzo e il protocollo del client",
          tip: "Un indirizzo in elenco sceglie l'indirizzo del client registrato dal limite di accesso e dal registro, quindi inserisci solo proxy che controlli",
          none: 'Nessuno',
          edit: 'Modifica',
          editRow: 'Modifica elenco',
          editTitle: 'Modifica proxy attendibili',
          editDescription: "Per modificare l'elenco serve la tua password",
          dialogDescription:
            "Inserisci l'indirizzo di ogni proxy inverso come lo vede questo dispositivo, oppure un intervallo come 10.0.0.0/24. Un proxy in elenco dice al dispositivo quale indirizzo e quale protocollo del client usare. Tutto ciò che inoltra viene creduto, quindi inserisci solo proxy che controlli."
        },
        certificate: {
          title: 'Certificato',
          desc: 'Da dove proviene il certificato HTTPS',
          requesting: 'Richiesta del certificato in corso',
          selfSigned: 'Autofirmato',
          domain: 'Dominio',
          domainDesc:
            'Deve puntare a questo dispositivo, con la porta 443 raggiungibile da Internet',
          domainTailscale: 'Impostato da Tailscale per questo dispositivo',
          domainInvalid: 'Usa un nome di dominio completo, ad esempio kvm.example.org',
          email: 'Email',
          emailDesc: "Facoltativa, per gli avvisi di Let's Encrypt",
          emailInvalid: 'Usa un indirizzo come nome@example.org',
          validUntil: 'Valido fino al',
          valid: 'Valido',
          expiresSoon: 'In scadenza',
          expired: 'Scaduto',
          lastRenewal: 'Ultimo rinnovo',
          renewed: 'Rinnovato',
          failed: 'Non riuscito',
          renewNow: 'Rinnova ora',
          renewNowDesc: 'Richiedi un nuovo certificato senza attendere',
          renewBtn: 'Rinnova',
          applyTitle: 'Cambia certificato',
          applyOk: 'Applica',
          applyAcme:
            "Il dispositivo chiede un certificato a Let's Encrypt. Let's Encrypt si connette alla porta 443 da Internet per verificarlo, e questo può richiedere fino a un minuto. Se la richiesta fallisce, resta in uso il certificato attuale.",
          applyTailscale:
            'Il dispositivo ottiene un certificato da Tailscale, e questo può richiedere fino a un minuto. Se la richiesta fallisce, resta in uso il certificato attuale.',
          applySelfSigned:
            'Il dispositivo torna al proprio certificato autofirmato. I browser mostrano un avviso.',
          openTitle: 'Apri il nuovo indirizzo',
          openDesc:
            "Il certificato è pronto. Apri l'indirizzo qui sotto e accedi per mantenerlo. Senza la tua conferma entro 3 minuti, torna il certificato precedente.",
          openOk: 'Apri',
          blockedClock:
            "I certificati non possono essere richiesti finché l'orologio del dispositivo non è sincronizzato",
          blockedParanoid: 'La modalità firewall Paranoica blocca le richieste di certificato',
          tailscaleUnavailable:
            'Tailscale non è in esecuzione, oppure i certificati HTTPS non sono abilitati per la tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'Configura i server DNS per NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: "Configura l'indirizzamento IPv4 per l'interfaccia cablata",
          servers: 'Server',
          dhcp: 'DHCP',
          manual: 'Manuale',
          apply: 'Applica',
          invalid: 'Inserisci un indirizzo IPv4 o IPv6 valido',
          invalidNetwork:
            'Inserisci un indirizzo IPv4, una maschera di sottorete e un router validi',
          saved: 'Impostazioni DNS salvate',
          redirecting: 'Impostazioni di rete salvate. Apertura del nuovo indirizzo...',
          saveFailed: 'Impossibile salvare le impostazioni DNS',
          unsaved: 'Modifiche non salvate',
          maxServers: 'Sono consentiti al massimo {{count}} server DNS',
          dhcpServersDescription: 'I server DNS vengono ottenuti automaticamente da DHCP',
          manualServersDescription: 'Sono supportati server IPv4 e IPv6',
          interface: 'Interfaccia',
          ipAddress: 'Indirizzo IP',
          subnetMask: 'Subnet mask',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: "Configura l'indirizzamento IPv6 per l'interfaccia cablata",
          disabled: 'Disabilitato',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manuale',
          interface: 'Interfaccia',
          state: 'Stato',
          router: 'Router',
          addresses: 'Indirizzi',
          dhcpv6Client: 'Client DHCPv6',
          notInstalled: 'Non installato',
          ipAddress: 'Indirizzo IPv6',
          prefix: 'Prefisso',
          invalidManual: 'Inserisci un indirizzo IPv6, un prefisso e un router validi',
          clientMissing:
            "Il client DHCPv6 non è installato. Installa prima l'aggiornamento raw di sistema corrispondente.",
          saved: 'Impostazioni IPv6 salvate',
          saveFailed: 'Impossibile salvare le impostazioni IPv6',
          unsaved: 'Modifiche non salvate'
        }
      },
      system: {
        title: 'Sistema',
        performance: {
          processor: 'Processore',
          overdrive: {
            title: 'Overdrive del clock',
            description:
              'Avvia con le frequenze di processore e video più alte specificate dal produttore',
            tip: "Se il dispositivo non si avvia con l'overdrive, la scheda SD va riscritta",
            unavailable: 'Non incluso in questa immagine di sistema',
            keepTitle: "Mantieni l'overdrive dopo gli aggiornamenti",
            keepDescription:
              'Un aggiornamento di sistema riporta il dispositivo ai clock standard se questa opzione non è attiva',
            confirmTitle: "Attivare l'overdrive del clock?",
            confirmText:
              "Se il dispositivo non si avvia con l'overdrive, dovrai riscrivere la scheda SD per ripristinarlo. La modifica si applica dopo il prossimo riavvio.",
            confirmOk: 'Abilita'
          },
          watchdog: {
            title: 'Watchdog hardware',
            description: 'Riavvia automaticamente il dispositivo quando smette di rispondere',
            unavailable: 'Non incluso in questa immagine di sistema',
            notRunning: 'Non in esecuzione al momento',
            lastRestart: 'Ultimo riavvio',
            lastRestartCaption: 'Motivo più recente per cui il sistema si è riavviato',
            reasonPowerOn: 'Accensione',
            reasonRestart: 'Riavvio richiesto',
            reasonWatchdog: 'Reset del watchdog',
            reasonOverheat: 'Protezione da surriscaldamento',
            reasonUnknown: 'Sconosciuto'
          },
          recovery: 'Ripristino',
          memory: 'Memoria'
        },
        monitor: {
          processorClock: 'Sottosistema CPU',
          videoClock: 'Sottosistema video',
          videoClockCaption: 'Frequenza di clock video',
          cpuClockCaption: 'Frequenza di clock della CPU',
          overdrive: 'Overdrive',
          temperature: 'Temperatura',
          lastMinutes: 'Ultimi 5 minuti',
          ram: 'RAM',
          off: 'Disattivato',
          ramHistory: 'Utilizzo della RAM',
          cpuLoad: 'Carico della CPU',
          cpuLoadCaption: 'Utente {{user}} per cento, sistema {{system}} per cento',
          cpuUtilization: 'Utilizzo della CPU',
          swapUtilization: 'Utilizzo dello swap',
          swapSizeLastMinutes: '{{size}}, ultimi 5 minuti',
          percent: '{{percent}} per cento',
          percentUsed: '{{percent}} per cento usato',
          sizeOf: '{{used}} di {{total}}',
          systemPartition: 'Partizione di sistema',
          dataPartition: 'Partizione dati',
          unavailable: 'Non disponibile',
          noReadings: 'Il dispositivo non restituisce letture',
          refresh: 'Si aggiorna ogni secondo mentre questa pagina è aperta'
        },
        sections: {
          time: 'Ora',
          firewall: 'Firewall',
          systemLog: 'Logging',
          performance: 'Prestazioni',
          monitor: 'Monitor',
          services: 'Servizi',
          webInterface: 'Accesso web sicuro'
        },
        time: {
          saveFailed: "Impossibile salvare le impostazioni dell'ora",
          saved: "Impostazioni dell'ora salvate",
          syncFailed: "Impossibile sincronizzare l'ora",
          synced: 'Ora sincronizzata',
          invalidServers: 'Inserisci almeno un server NTP',
          maxServers: 'Massimo {{count}} server NTP consentiti',
          refresh: 'Aggiorna',
          syncNow: 'Sincronizza',
          syncNowDesc: "Imposta l'orologio dai server NTP ora",
          save: 'Salva',
          ntp: {
            title: 'NTP',
            description: "Sincronizza l'ora del dispositivo dai server NTP configurati"
          },
          networkTime: 'Ora di rete',
          clock: {
            title: 'Orologio',
            description: 'Imposta il fuso orario locale usato da log e interfaccia',
            current: 'Ora corrente',
            timezone: 'Fuso orario'
          },
          servers: {
            title: 'Server NTP',
            description:
              'Usa i server pubblici predefiniti, il router locale o server NTP personalizzati',
            useRouter: 'Usa router',
            useDefaults: 'Usa predefiniti',
            presets: 'Server predefiniti',
            presetsDesc: "Sostituisce l'elenco dei server con un valore predefinito"
          }
        },
        firewall: {
          saveFailed: 'Impossibile applicare le impostazioni del firewall',
          saved: 'Impostazioni del firewall applicate',
          cancel: 'Annulla',
          refresh: 'Aggiorna',
          backends: 'Backend',
          enableHttpsFirst:
            'Abilita HTTPS prima di abilitare la modalità firewall Ristretta o Paranoica',
          httpsRequired:
            'Le modalità Ristretta e Paranoica sono disattivate finché HTTPS non viene abilitato in Impostazioni > Rete > Servizi',
          mode: {
            title: 'Modalità firewall',
            baseline: 'Base',
            baselineDesc:
              'Profilo aperto di compatibilità. Il firewall è attivo, ma le origini in ingresso non sono limitate. Da usare solo su reti attendibili.',
            moderate: 'Moderata',
            moderateDesc:
              "Profilo predefinito. Mantiene i servizi di Base, ma accetta nuove connessioni in ingresso solo da intervalli privati, link-local o loopback. L'accesso in uscita resta aperto.",
            restricted: 'Ristretta',
            restrictedDesc:
              'Solo HTTPS e SSH locali, più DNS, NTP, syslog e aggiornamenti online in uscita. DHCP e il traffico IPv6 essenziale restano disponibili. WebRTC è bloccato.',
            paranoid: 'Paranoica',
            paranoidDesc:
              'Accesso HTTPS solo locale. Blocca SSH, HTTP, gli aggiornamenti online e le altre funzioni di rete in uscita. Il caricamento di aggiornamenti offline e le installazioni già preparate restano disponibili.',
            current: 'Corrente',
            default: 'Predefinito',
            localOnly: 'Solo locale',
            openTag: 'Ingresso aperto',
            httpsRequiredTag: 'Richiede HTTPS',
            outboundOpen: 'Uscita aperta',
            outboundLimited: 'Uscita limitata',
            httpsOnly: 'Solo HTTPS'
          },
          moderate: {
            apply: 'Passa a Moderata'
          },
          restricted: {
            enable: 'Abilita Ristretta',
            confirmTitle: 'Abilitare la modalità Ristretta?',
            confirmDesc:
              "L'accesso amministrativo in ingresso sarà limitato agli intervalli private IPv4, IPv4 link-local/loopback, IPv6 link-local o IPv6 loopback per HTTPS e SSH. Gli intervalli pubblici non sono consentiti. DNS, NTP, syslog remoto, aggiornamenti online, DHCP, connessioni stabilite e traffico essenziale IPv6 in uscita resteranno disponibili. WebRTC/ICE UDP e altro traffico in ingresso/uscita saranno bloccati."
          },
          paranoid: {
            enable: 'Abilita Paranoica',
            confirmTitle: 'Abilitare la modalità Paranoica?',
            confirmDesc:
              "Resterà disponibile solo l'accesso HTTPS da intervalli private IPv4, IPv4 link-local/loopback, IPv6 link-local o IPv6 loopback. SSH, HTTP, mDNS, NTP, download da GitHub e altro traffico saranno bloccati salvo il minimo DHCP/controllo IPv6."
          },
          baseline: {
            apply: 'Passa a Base',
            confirmTitle: 'Passare alla modalità Base aperta?',
            confirmDesc:
              'Il servizio firewall resta attivo, ma viene rimossa la restrizione ai soli intervalli di origine locali. Gli intervalli di origine pubblici possono raggiungere i servizi esposti di NanoKVM se la rete li instrada.'
          },
          rules: {
            title: 'Regole correnti',
            empty: 'Nessuna regola'
          }
        },
        saveChanges: 'Salva modifiche',
        unsaved: 'Modifiche non salvate'
      },
      systemLog: {
        saveFailed: 'Impossibile salvare le impostazioni dei log',
        saved: 'Impostazioni dei log salvate',
        invalidHost: "Inserisci l'host del server syslog",
        logLoadFailed: 'Impossibile caricare i log',
        save: 'Salva',
        test: 'Invia log di prova',
        testSent: 'Log di prova inviato',
        testFailed: 'Impossibile inviare il log di prova',
        remote: {
          title: 'Logging remoto',
          forward: 'Inoltra il log di sistema',
          description: 'Inoltra i messaggi di sistema a un server remoto',
          host: 'Server',
          hostDesc: 'Nome host o indirizzo IPv4 del server syslog',
          port: 'Porta',
          protocol: 'Porta UDP del server syslog'
        },
        local: {
          title: 'Buffer del log di sistema',
          description:
            'I log correnti sono mantenuti in RAM in {{path}} per evitare scritture sulla scheda SD',
          priority: 'Priorità minima',
          priorityDesc: 'Urgenza minima perché un messaggio venga registrato',
          buffer: 'Dimensione buffer',
          bufferDesc: 'Dimensione del log alla quale il file viene ruotato',
          rotations: 'Rotazioni',
          rotationsDesc: 'Numero di file di log ruotati da conservare',
          compact: 'Output compatto',
          compactDesc: 'Ometti nome host e facility da ogni riga',
          stripTimestamps: 'Rimuovi timestamp',
          stripTimestampsDesc: 'Rimuovi i timestamp aggiunti dal mittente; syslog aggiunge i propri'
        },
        kernel: {
          title: 'Logging del kernel',
          enabled: 'Inoltra il log del kernel',
          enabledDesc: 'Acquisisci i messaggi del kernel nel log di sistema',
          consoleLevel: 'Livello console',
          consoleLevelDesc:
            'Urgenza minima perché un messaggio del kernel venga stampato sulla console'
        },
        viewer: {
          title: 'Log di sistema',
          refresh: 'Aggiorna',
          empty: 'Nessuna voce di log',
          truncated: 'Sono mostrati solo i dati di log più recenti',
          linesUnit: 'righe'
        },
        level: {
          '1': '1 - Allarme',
          '2': '2 - Critico',
          '3': '3 - Errore',
          '4': '4 - Avviso',
          '5': '5 - Notifica',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Tutto'
        }
      },
      user: {
        title: 'Utente'
      },
      networking: {
        title: 'Rete'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Tunnel cifrato',
        device: 'Questo dispositivo',
        description: 'Raggiungi questo KVM tramite un tunnel WireGuard',
        unavailable: 'WireGuard non è installato su questo dispositivo',
        blocked: 'La modalità firewall Paranoica blocca WireGuard',
        needsKey: 'Imposta una chiave privata prima di attivare WireGuard',
        saved: 'Impostazioni di WireGuard salvate',
        save: 'Salva modifiche',
        unsaved: 'Modifiche non salvate',
        invalid: 'Controlla i campi evidenziati',
        invalidAddress: 'Inserisci un indirizzo con la sua maschera, come 10.0.0.1/24',
        invalidKey: 'Inserisci una chiave WireGuard di 44 caratteri',
        invalidEndpoint: 'Inserisci un nome host o un indirizzo IP',
        invalidPort: 'Inserisci una porta da 1 a 65535',
        invalidRanges: 'Usa intervalli IPv4 come 10.0.0.0/24, non 0.0.0.0/0',
        status: {
          connected: 'Connesso',
          waiting: 'In attesa del peer',
          stopped: 'Arrestato',
          handshake: 'Ultimo handshake {{time}}'
        },
        privateKey: {
          title: 'Chiave privata',
          description: 'Resta su questo dispositivo e non viene più mostrata',
          set: 'Impostata',
          notSet: 'Non impostata',
          setBtn: 'Imposta',
          generate: 'Genera',
          remove: 'Rimuovi',
          modalTitle: 'Imposta la chiave privata',
          modalDescription:
            'La chiave viene salvata su questo dispositivo e non viene più mostrata',
          placeholder: 'Incolla la chiave privata',
          generateConfirmTitle: 'Generare una nuova chiave privata?',
          generateConfirmDesc:
            'La chiave attuale smette di funzionare. Poi aggiungi la nuova chiave pubblica al peer.',
          removeConfirmTitle: 'Rimuovere la chiave privata?',
          removeConfirmDesc:
            'WireGuard viene disattivato e resta disattivato finché non viene impostata una nuova chiave.'
        },
        publicKey: {
          title: 'Chiave pubblica',
          description: 'Aggiungila alla configurazione del peer'
        },
        address: {
          title: 'Indirizzo',
          description: 'Indirizzo del KVM nel tunnel e la sua maschera'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Chiave pubblica',
          publicKeyDescription: 'Chiave pubblica del peer a cui ti connetti',
          server: 'Server',
          serverDescription: 'Nome host o indirizzo IP del peer',
          port: 'Porta',
          portDescription: 'Porta UDP del peer, di solito 51820',
          allowedIps: 'IP consentiti',
          allowedIpsDescription: 'Indirizzo o intervallo del peer nel tunnel, come 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Secondi tra i pacchetti keepalive, necessari dietro un router'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Raggiungi questo KVM tramite la tua rete Tailscale',
        service: 'Servizio',
        performance: 'Prestazioni',
        memory: {
          title: 'Ottimizzazione memoria',
          tip: "Mantiene basso l'uso di memoria di Tailscale, il che aiuta su un dispositivo con poca RAM. Riavvia Tailscale per applicare la modifica."
        },
        swap: {
          title: 'File di scambio',
          tip: "Se i problemi persistono dopo aver abilitato l'ottimizzazione della memoria, prova ad abilitare il file di scambio",
          sizeTip:
            'Questo imposta la dimensione del file su 128MB; regolala in Impostazioni > Sistema > Prestazioni'
        },
        restartTitle: 'Riavvia Tailscale',
        restartDesc: 'Riavvia il servizio',
        restartBtn: 'Riavvia',
        restart: 'Riavviare Tailscale?',
        stopTitle: 'Arresta Tailscale',
        stopBtn: 'Arresta',
        stop: 'Arrestare Tailscale?',
        stopDesc: "Arresta il servizio e ne impedisce l'avvio all'accensione",
        loading: 'Caricamento...',
        notInstall: 'Tailscale non trovato, per favore, installalo',
        install: 'Installa',
        installing: 'Installazione in corso',
        failed: 'Installazione non riuscita',
        retry: 'Riprova aggiornando la pagina o installa manualmente.',
        download: 'Scarica il',
        package: 'pacchetto di installazione',
        unzip: 'e decomprimilo',
        upTailscale: 'Carica tailscale nella directory /usr/bin/ del NanoKVM',
        upTailscaled: 'Carica tailscaled nella directory /usr/sbin/ del NanoKVM',
        refresh: 'Aggiorna la pagina corrente',
        notRunning: 'Tailscale non è in esecuzione. Per favore avvialo per continuare.',
        run: 'Avvia',
        notLogin:
          'Il dispositivo non è ancora stato associato. Effettua il login e associa questo dispositivo al tuo account.',
        urlPeriod: 'Questo URL è valido per 10 minuti',
        login: 'Accedi',
        loginSuccess: 'Accesso riuscito',
        deviceName: 'Nome dispositivo',
        deviceIP: 'IP dispositivo',
        account: 'Account',
        logout: 'Disconnetti',
        logoutDesc: 'Sei sicuro di voler uscire?',
        uninstall: 'Disinstalla Tailscale',
        uninstallDesc: 'Sei sicuro di voler disinstallare Tailscale?',
        okBtn: 'Sì',
        cancelBtn: 'No'
      },
      update: {
        title: 'Aggiornamenti',
        currentVersion: 'Versione attuale',
        latestVersion: 'Ultima versione',
        queryFailed: 'Impossibile ottenere la versione',
        updateFailed: 'Aggiornamento fallito',
        paranoidBlocked: 'Gli aggiornamenti online sono bloccati dalla modalità firewall Paranoica',
        paranoidBlockedDesc:
          'Controlli e download da GitHub richiedono accesso di rete in uscita. Upload offline e installazioni già preparate restano disponibili.',
        available: 'Un aggiornamento è disponibile. Sei sicuro di voler aggiornare?',
        updating: 'Aggiornamento avviato',
        confirm: 'Conferma',
        cancel: 'Annulla',
        badge: {
          checking: 'Controllo',
          latest: 'Aggiornato',
          available: 'Aggiornamento disponibile',
          failed: 'Controllo non riuscito',
          local: 'Locale'
        },
        application: {
          title: 'Applicazione'
        },
        system: {
          queryFailed: 'Impossibile ottenere la versione del sistema',
          appUpdateRequired:
            "Aggiorna l'applicazione alla versione {{version}} prima di installare questo aggiornamento di sistema",
          requiredAppVersion: 'Versione applicazione richiesta',
          downloadFailed: 'Download o verifica non riusciti',
          available: 'È disponibile un aggiornamento del sistema base.',
          downloading: "Download e verifica dell'aggiornamento di sistema...",
          downloadVerify: 'Scarica e verifica',
          installing: "Installazione dell'aggiornamento di sistema preparato...",
          install: 'Installa',
          installFailed: 'Installazione non riuscita',
          installConfirmTitle: "Installare l'aggiornamento di sistema?",
          installConfirmDesc:
            'Questo sostituirà i file del sistema base dal pacchetto verificato. Sarà necessario riavviare.',
          rawInstallConfirmDesc:
            "Questo pacchetto verificato scriverà immagini raw boot/rootfs sulle partizioni della scheda SD e riavvierà automaticamente. La scrittura può richiedere diversi minuti; mantenere l'alimentazione collegata.",
          rawInstallWarning:
            "Non esiste rollback automatico per aggiornamenti di partizioni raw. Se l'avvio fallisce, recuperare manualmente la scheda SD.",
          rawWaitTitle: "Installazione dell'aggiornamento di sistema",
          rawWaitWriting: 'Scrittura del nuovo sistema sulla scheda SD',
          rawWaitRestarting:
            'Il dispositivo si sta riavviando. Questa pagina si ricarica quando torna online.',
          rawWaitDesc:
            "Servono circa tre minuti. Lascia collegata l'alimentazione e non chiudere questa pagina.",
          rawWaitSlow:
            "Sta richiedendo più tempo del previsto. Attendi ancora qualche minuto prima di staccare l'alimentazione.",
          rebootRequired: 'È necessario riavviare per attivare questo stato del sistema.',
          rollingBack: "Rollback dell'aggiornamento di sistema...",
          rollback: 'Rollback',
          rollbackDone: 'Rollback preparato',
          rollbackFailed: 'Rollback non riuscito',
          rollbackConfirmTitle: "Eseguire rollback dell'aggiornamento di sistema?",
          rollbackConfirmDesc:
            "Questo ripristinerà i file dall'ultimo backup dell'aggiornamento di sistema. Sarà necessario riavviare.",
          stagedDesc:
            "L'aggiornamento di sistema è stato scaricato e verificato, ora puoi installarlo",
          refresh: 'Aggiorna',
          releaseNotes: 'Note di rilascio',
          systemVersion: 'Versione sistema',
          kernel: 'Kernel',
          stagedVersion: 'Versione preparata',
          archive: 'Archivio',
          requiredFree: 'Spazio libero richiesto',
          fileCount: 'File',
          rawImages: 'Immagini raw',
          progress: 'Avanzamento',
          progressMessage: 'Messaggio di avanzamento',
          pendingVersion: 'Versione in sospeso',
          bootHealth: 'Stato avvio',
          healthy: 'In buono stato',
          unhealthy: 'Richiede attenzione',
          rollbackBackup: 'Backup rollback'
        },
        offline: {
          title: "Carica pacchetto dell'applicazione",
          desc: "Installa un pacchetto dell'applicazione da questo computer. Il server si riavvia al termine.",
          installTitle: "Installare l'aggiornamento dell'applicazione?",
          installDesc:
            "L'applicazione viene sostituita e il server si riavvia. Dovrai accedere di nuovo."
        },
        local: {
          title: 'Carica pacchetto di sistema',
          desc: "Installa un pacchetto di sistema da questo computer. Un solo file contiene l'archivio e i suoi metadati firmati.",
          choose: 'Scegli il file',
          invalidFile: 'Seleziona un pacchetto che termina con .tar o .tar.gz.',
          diskTitle: 'Disattivare il disco virtuale?',
          diskWarn:
            'Il pacchetto viene salvato in /data, che è di sola lettura mentre il disco virtuale è attivo. Disattivandolo, il computer non potrà più accedere a /data. Continuare?',
          uploading: 'Caricamento',
          verifying: 'Verifica e preparazione del pacchetto',
          keyTitle: 'Chiave di aggiornamento locale',
          keyDesc: 'Chiave pubblica in formato PEM che può firmare i pacchetti creati da te',
          keyNone: 'Nessuna chiave impostata',
          keySet: 'Imposta chiave',
          keyRemove: 'Rimuovi',
          signer: 'Firmato da',
          section: 'Aggiornamenti locali',
          keyRequired: 'Chiave locale necessaria'
        }
      },
      account: {
        title: 'Account',
        webAccount: 'Nome account web',
        password: 'Password',
        passwordDesc: "Cambia la password usata per accedere all'interfaccia web",
        updateBtn: 'Cambia',
        logoutBtn: 'Esci',
        logoutDesc: 'Sei sicuro di voler uscire?',
        okBtn: 'Sì',
        cancelBtn: 'No',
        session: {
          title: 'Sessione'
        },
        logoutOnClose: {
          title: 'Disconnetti alla chiusura del browser',
          description:
            'Termina la sessione quando il browser viene chiuso invece di mantenerla aperta'
        },
        totp: {
          title: 'Autenticazione a due fattori',
          authenticator: 'App di autenticazione',
          description:
            "Richiedi un codice temporaneo da un'app di autenticazione, oltre alla password",
          required: 'Richiesta dai criteri',
          disable: 'Disattiva',
          enableTitle: "Configura l'autenticazione a due fattori",
          enableDescription:
            'Conferma la tua password per continuare. È richiesta per qualsiasi modifica del secondo fattore.',
          continue: 'Continua',
          disableTitle: "Disattivare l'autenticazione a due fattori?",
          disableDescription:
            'Il tuo account sarà protetto solo dalla password. Conferma con la tua password per continuare.',
          disableFailed: "Impossibile disattivare l'autenticazione a due fattori",
          passwordPlaceholder: 'Password attuale',
          enrollFailed: 'Impossibile avviare la configurazione',
          invalidCode: 'Questo codice non corrisponde. Prova con il successivo.',
          scan: 'Scansiona questo codice con la tua app di autenticazione.',
          manualEntry: 'Oppure inserisci questa chiave manualmente:',
          codePlaceholder: 'Inserisci il codice a 6 cifre per confermare',
          confirm: 'Conferma',
          cancel: 'Annulla',
          backupTitle: 'Salva ora i tuoi codici di backup',
          backupDescription:
            "Ogni codice funziona una sola volta e non verrà mostrato di nuovo. Sono l'unico modo per rientrare se perdi la tua app di autenticazione e continuano a funzionare anche quando l'orologio del dispositivo non è sincronizzato.",
          copy: 'Copia',
          copied: 'Codici di backup copiati',
          savedThem: 'Li ho salvati',
          remaining: '{{remaining}} codici di backup rimasti',
          clockUnsynced:
            "L'orologio del dispositivo non è ancora sincronizzato. Sincronizza l'ora in Impostazioni > Sistema > Ora prima di configurare.",
          noBackupCodes:
            'Non è rimasto alcun codice di backup. Seleziona Genera per creare un nuovo set.',
          regenerate: 'Nuovi codici di backup',
          generate: 'Genera',
          regenerateTitle: 'Generare nuovi codici di backup?',
          regenerateDescription:
            'I tuoi codici di backup attuali smetteranno di funzionare. Conferma con la tua password per continuare.',
          regenerateFailed: 'Impossibile generare nuovi codici di backup',
          download: 'Scarica',
          copyFailed: 'Impossibile copiare. Seleziona i codici e copiali manualmente.',
          requireTitle: "Richiedi l'autenticazione a due fattori",
          requireDescription:
            "Impedisce di disattivare l'autenticazione a due fattori e un account che non la ha deve configurarla prima di usare il dispositivo",
          requireFailed: 'Impossibile modificare il requisito',
          requiredTitle: "L'autenticazione a due fattori è obbligatoria",
          requiredDescription:
            'Questo dispositivo è configurato per richiedere un secondo fattore, ma il tuo account non ne ha ancora configurato uno. Configuralo ora per continuare.'
        }
      }
    },
    picoclaw: {
      title: 'Assistente PicoClaw',
      empty: "Descrivi un'attività per iniziare",
      inputPlaceholder: 'Descrivi cosa vuoi che PicoClaw faccia',
      newConversation: 'Nuova conversazione',
      processing: 'In elaborazione...',
      agent: {
        defaultTitle: 'Assistente generale',
        defaultDescription: "Chat generale, ricerca e aiuto nell'area di lavoro",
        kvmTitle: 'Controllo remoto',
        kvmDescription: "Gestisci l'host remoto tramite NanoKVM",
        switched: "Ruolo dell'agente cambiato",
        switchFailed: "Impossibile cambiare il ruolo dell'agente"
      },
      send: 'Invia',
      cancel: 'Annulla',
      status: {
        connecting: 'Connessione al gateway...',
        connected: 'Sessione PicoClaw connessa',
        disconnected: 'Sessione PicoClaw chiusa',
        stopped: 'Richiesta di interruzione inviata',
        runtimeStarted: 'Runtime PicoClaw avviato',
        runtimeStartFailed: 'Impossibile avviare il runtime PicoClaw',
        runtimeStopped: 'Runtime PicoClaw interrotto',
        runtimeStopFailed: 'Impossibile arrestare il runtime di PicoClaw'
      },
      connection: {
        runtime: {
          checking: 'Controllo',
          ready: 'Runtime pronto',
          stopped: 'Runtime interrotto',
          unavailable: 'Runtime non disponibile',
          configError: 'Errore di configurazione'
        },
        transport: {
          connecting: 'Connessione',
          connected: 'Connesso'
        },
        run: {
          idle: 'Inattivo',
          busy: 'Occupato'
        }
      },
      error: {
        lockHeld: "PicoClaw è in uso in un'altra finestra",
        takenOver: "Un'altra finestra ha preso il controllo di PicoClaw",
        authFailed: 'PicoClaw ha rifiutato la connessione',
        upstreamClosed: 'La connessione a PicoClaw è andata persa'
      },
      tool: {
        screenshot: 'Acquisizione dello schermo',
        loadImage: 'Osservo lo schermo',
        actions: "Controllo dell'host",
        generic: 'Uso di {{name}}',
        type: 'Digitazione di {{text}}',
        hotkey: 'Pressione di {{keys}}',
        click: 'Clic',
        doubleClick: 'Doppio clic',
        move: 'Spostamento del mouse',
        drag: 'Trascinamento',
        scroll: 'Scorrimento',
        wait: 'Attesa'
      },
      message: {
        toolAction: 'Azione',
        observation: 'Osservazione',
        screenshot: 'Schermata'
      },
      overlay: {
        locked: "PicoClaw sta controllando il dispositivo. L'immissione manuale è in pausa."
      },
      install: {
        install: 'Installa PicoClaw',
        installing: 'Installazione PicoClaw',
        success: 'PicoClaw installato correttamente',
        failed: 'Impossibile installare PicoClaw',
        uninstalled: 'PicoClaw disinstallato correttamente',
        uninstallFailed: 'Disinstallazione non riuscita',
        requiredTitle: 'PicoClaw non è installato',
        requiredDescription: 'Installa PicoClaw prima di avviare il runtime PicoClaw.',
        progressDescription: 'PicoClaw è in fase di download e installazione.',
        stages: {
          preparing: 'Preparazione',
          downloading: 'Download in corso',
          extracting: 'Estrazione',
          verifying: 'Verifica in corso',
          installing: 'Installazione in corso',
          installed: 'Installato',
          install_timeout: 'Timeout',
          install_failed: 'Non riuscito'
        }
      },
      model: {
        requiredTitle: 'È richiesta la configurazione del modello',
        requiredDescription:
          'Configura il modello PicoClaw prima di utilizzare la chat di PicoClaw.',
        docsTitle: 'Guida alla configurazione',
        docsDesc: 'Modelli e protocolli supportati',
        menuLabel: 'Configura modello',
        modelIdentifier: 'Identificatore del modello',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: "URL di base dell'API",
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Chiave API',
        apiKeyPlaceholder: 'Inserisci la chiave API del modello',
        apiKeyKeepPlaceholder: 'Lascia vuoto per mantenere la chiave attuale',
        save: 'Salva',
        saving: 'Salvataggio',
        saved: 'Configurazione del modello salvata',
        saveFailed: 'Impossibile salvare la configurazione del modello',
        invalid: "Identificatore del modello, URL di base dell'API e chiave API sono obbligatori"
      },
      uninstall: {
        confirmTitle: 'Disinstalla PicoClaw',
        confirmContent:
          "Sei sicuro di voler disinstallare PicoClaw? Ciò eliminerà l'eseguibile e tutti i file di configurazione.",
        confirmOk: 'Disinstalla'
      },
      history: {
        title: 'Cronologia',
        loading: 'Caricamento sessioni...',
        emptyTitle: 'Nessuna cronologia ancora',
        emptyDescription: 'Le sessioni PicoClaw precedenti verranno visualizzate qui.',
        loadFailed: 'Impossibile caricare la cronologia della sessione',
        deleteFailed: 'Impossibile eliminare la sessione',
        deleteConfirmTitle: 'Elimina sessione',
        deleteConfirmContent: 'Sei sicuro di voler eliminare "{{title}}"?',
        deleteConfirmOk: 'Elimina',
        messageCount_one: '{{count}} messaggio',
        messageCount_many: '{{count}} di messaggi',
        messageCount_other: '{{count}} messaggi'
      },
      config: {
        startRuntime: 'Avvia PicoClaw',
        stopRuntime: 'Arresta PicoClaw',
        stopConfirm: 'Arrestare PicoClaw?'
      },
      start: {
        title: 'Avvia PicoClaw',
        description: "Avvia il runtime per iniziare a utilizzare l'assistente PicoClaw."
      }
    },
    error: {
      title: 'Si è verificato un problema',
      refresh: 'Aggiorna'
    },
    fullscreen: {
      toggle: 'Attiva/disattiva schermo intero'
    },
    menu: {
      collapse: 'Comprimi menu'
    }
  }
};

export default it;
