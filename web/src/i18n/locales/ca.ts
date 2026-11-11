const ca = {
  translation: {
    common: {
      confirm: 'Confirma',
      cancel: 'Cancel·la',
      close: 'Tanca',
      save: 'Desa',
      discard: 'Descarta',
      delete: 'Esborra',
      actionFailed: "L'operació ha fallat",
      loading: 'Carregant la configuració del dispositiu...',
      loadFailed: "No s'ha pogut carregar la configuració del dispositiu",
      retry: 'Reintenta'
    },
    head: {
      desktop: 'Escriptori remot',
      login: 'Inici de sessió',
      firstSetup: 'Configuració inicial',
      changePassword: 'Canviar contrasenya',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Inici de sessió',
      placeholderUsername: "Nom d'usuari",
      placeholderPassword: 'Contrasenya',
      placeholderPassword2: 'Torna a introduir la contrasenya',
      noEmptyUsername: "Cal introduir el nom d'usuari",
      noEmptyPassword: 'Cal introduir la contrasenya',
      invalidUser: "Nom d'usuari o contrasenya invàlids",
      locked: 'Massa inicis de sessió, si us plau, torna-ho a provar més tard',
      globalLocked: 'Sistema sota protecció, torna-ho a provar més tard',
      error: 'Error inesperat',
      changePassword: 'Canviar la contrasenya',
      changePasswordDesc: 'Per a la seguretat del dispositiu, canvia la contrasenya',
      differentPassword: 'Les contrasenyes no coincideixen',
      illegalUsername: "El nom d'usuari conté caràcters no permesos",
      illegalPassword:
        'La contrasenya ha de tenir almenys 8 caràcters i no pot contenir cometes ni barres',
      forgetPassword: 'Has oblidat la contrasenya',
      ok: "D'acord",
      cancel: 'Cancel·la',
      loginButtonText: 'Inicia sessió',
      setupTitle: 'Crea un compte administrador',
      setupDescription:
        'Aquest dispositiu encara no té cap compte web. Crea el primer compte administrador per continuar.',
      setupRecovery:
        'Si es perd aquesta contrasenya, la recuperació requereix tornar a gravar la targeta SD',
      setupButtonText: 'Crea el compte',
      tips: {
        hardenedRecovery:
          'Aquesta imatge Hardened no admet restablir la contrasenya amb el botó BOOT. Si es perd la contrasenya, torna a gravar la targeta SD i crea un compte nou.',
        change1: 'Aquesta acció canviarà les següents contrasenyes:',
        change2: "Contrasenya d'inici de sessió web",
        change3: "Contrasenya root del sistema per a l'inici de sessió SSH"
      },
      placeholderCurrentPassword: 'Contrasenya actual',
      placeholderNewPassword: 'Contrasenya nova',
      wrongCurrentPassword: 'La contrasenya actual no és correcta',
      totp: {
        title: 'Autenticació de dos factors',
        prompt: "Introdueix el codi de 6 dígits de l'aplicació d'autenticació",
        backupPrompt: 'Introdueix un dels teus codis de còpia de seguretat',
        noEmptyCode: 'Introdueix un codi',
        placeholderCode: 'Codi de 6 dígits',
        placeholderBackup: 'Codi de còpia de seguretat',
        verifyButtonText: 'Verifica',
        useBackupCode: 'Utilitza un codi de còpia de seguretat',
        useAuthenticator: "Utilitza el codi de l'aplicació d'autenticació",
        cancel: 'Enrere',
        invalidCode: 'Aquest codi no és vàlid. Torna-ho a provar.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Configura Wi-Fi per al NanoKVM',
      success: "Comprova l'estat de la xarxa del NanoKVM i visita la nova adreça IP",
      failed: "L'operació ha fallat, torna-ho a intentar",
      invalidMode:
        'El mode actual no admet la configuració de xarxa. Ves al teu dispositiu i activa el mode de configuració Wi-Fi.',
      confirmBtn: "D'acord",
      finishBtn: 'Fet',
      ap: {
        authTitle: 'Es requereix autenticació',
        authDescription: 'Introdueix la contrasenya AP per continuar',
        authFailed: 'Contrasenya AP no vàlida',
        passPlaceholder: 'Contrasenya AP',
        verifyBtn: 'Verificar'
      }
    },
    screen: {
      scale: 'Escala',
      title: 'Pantalla',
      video: 'Mode de vídeo',
      videoDirectTips: 'Activa HTTPS a "Configuració > Xarxa > Serveis" per utilitzar aquest mode',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC està desactivat en els modes de tallafoc Restringit i Paranoic',
      transferRunningTitle: "Transferència d'imatge en curs",
      transferRunningDesc:
        "En canviar el mode de vídeo es recarrega la pàgina, cosa que cancel·la la pujada o descàrrega d'imatge en curs.",
      transferRunningOk: 'Canvia el mode',
      resolution: 'Resolució',
      auto: 'Automàtic',
      autoTips:
        "Poden aparèixer talls o desajustos del ratolí en certes resolucions, així que canvia la resolució de l'amfitrió remot o desactiva el mode automàtic",
      fps: 'FPS',
      customizeFps: 'Personalitzat',
      quality: 'Qualitat',
      qualityLossless: 'Sense pèrdua',
      qualityHigh: 'Alta',
      qualityMedium: 'Mitjana',
      qualityLow: 'Baixa',
      frameDetect: 'Detecció de fotogrames',
      frameDetectTip:
        "Compara els fotogrames i atura l'enviament de vídeo mentre la pantalla de l'amfitrió remot no canvia",
      resetHdmi: 'Restablir HDMI',
      webrtcConnectionFailed: {
        title: 'Error de connexió WebRTC',
        description: 'Comprova la connexió de xarxa o canvia el mode de vídeo'
      },
      captureStatus: {
        hdmiError: 'Error a la pantalla HDMI',
        unsupportedResolution: 'La resolució actual no és compatible',
        retrieving: "S'està obtenint la pantalla...",
        changingResolution: "S'està canviant la resolució...",
        updateFailed: 'La pantalla no es pot actualitzar ara',
        videoError: 'Error de visualització de vídeo',
        noHdmi: "No s'ha detectat cap senyal HDMI",
        unavailable: 'La pantalla no es pot mostrar ara'
      }
    },
    keyboard: {
      title: 'Teclat',
      paste: 'Enganxa',
      tips: 'Només es permeten lletres i símbols estàndard',
      placeholder: 'Text per enganxar',
      local: 'Teclat mòbil',
      virtual: 'Teclat en pantalla',
      readClipboard: 'Llegir des del porta-retalls',
      clipboardPermissionDenied:
        "S'ha denegat el permís del porta-retalls, permet-ne l'accés al navegador",
      clipboardReadError: "No s'ha pogut llegir el porta-retalls",
      dropdownEnglish: 'Anglès',
      dropdownGerman: 'Alemany',
      dropdownFrench: 'Francès',
      dropdownRussian: 'Rus',
      dropdownKorean: 'Coreà',
      dropdownJapanese: 'Japonès',
      localInput: 'Entrada del teclat mòbil',
      shortcut: {
        title: 'Dreceres',
        custom: 'Personalitzat',
        capture: 'Fes clic aquí per capturar la drecera',
        clear: 'Esborra',
        save: 'Desa',
        captureTips:
          'Capturar tecles del sistema, com la tecla Windows, requereix permís de pantalla completa',
        enterFullScreen: 'Canvia el mode de pantalla completa'
      },
      leaderKey: {
        title: 'Tecla líder',
        desc: "Evita les restriccions del navegador i envia dreceres del sistema directament a l'amfitrió remot",
        howToUse: "Com s'utilitza",
        simultaneous: {
          title: 'Mode simultani',
          desc1: 'Mantén premuda la tecla líder i prem la drecera.',
          desc2: 'Intuïtiu, però pot entrar en conflicte amb les dreceres del sistema.'
        },
        sequential: {
          title: 'Mode seqüencial',
          desc1:
            'Prem la tecla líder → prem la drecera en seqüència → torna a prémer la tecla líder.',
          desc2: 'Requereix més passos, però evita completament els conflictes del sistema.'
        },
        enable: 'Activa la tecla líder',
        tip: "Quan s'assigna com a tecla líder, aquesta tecla només funciona com a activador de dreceres i perd el seu comportament predeterminat.",
        placeholder: 'Prem la tecla líder',
        shiftRight: 'Maj dreta',
        ctrlRight: 'Ctrl dret',
        metaRight: 'Win dret',
        recorder: {
          rec: 'REC',
          activate: 'Activa les tecles',
          input: 'Prem la drecera'
        }
      }
    },
    mouse: {
      title: 'Ratolí',
      cursor: 'Estil del cursor',
      default: 'Cursor per defecte',
      cell: 'Cursor de cel·la',
      text: 'Cursor de text',
      grab: 'Cursor de mà',
      hide: 'Amaga el cursor',
      mode: 'Mode de ratolí',
      absolute: 'Mode absolut',
      relative: 'Mode relatiu',
      direction: 'Direcció de la roda de desplaçament',
      scrollUp: "Desplaça't cap amunt",
      scrollDown: "Desplaça't cap avall",
      speed: 'Velocitat de desplaçament',
      sensitivity: 'Velocitat del punter',
      sensitivityDesc:
        "Per al mode relatiu d'escriptori: valors més baixos redueixen la deriva causada per l'acceleració del ratolí del host",
      fast: 'Ràpida',
      slow: 'Lenta',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          "Mou-te per qualsevol punt de l'àrea KVM; el cursor remot conserva la posició entre tocs i es manté sincronitzat amb HID absolut"
      },
      requestPointer: "Estàs usant el mode relatiu, fes clic a l'escriptori per obtenir el punter",
      resetHid: 'Restablir HID',
      hidOnly: {
        title: 'Mode HID-Only',
        desc: "Si el ratolí o el teclat deixen de respondre i restablir el HID no ajuda, pot ser un problema de compatibilitat entre el NanoKVM i l'amfitrió.",
        tip1: 'En activar el mode HID-Only es desmuntaran el disc virtual i la xarxa virtual',
        tip2: "En el mode HID-Only, el muntatge d'imatges està desactivat",
        tip3: 'El NanoKVM es reiniciarà automàticament en canviar de mode',
        enable: 'Activa el mode HID-Only',
        disable: 'Desactiva el mode HID-Only'
      }
    },
    image: {
      title: 'Imatges',
      loading: 'Carregant...',
      empty: "No s'ha trobat res",
      mountMode: 'Munta com a',
      mount: 'Munta',
      orDownload: "O baixa des d'un enllaç",
      keepRunning:
        "Pots tancar aquesta finestra. La transferència continua i el progrés es mostra a la llista d'imatges.",
      massStorage: 'Emmagatzematge massiu',
      cdRom: 'CD-ROM',
      mountFailed: 'Error en muntar',
      mountDesc: 'En alguns sistemes cal expulsar el disc virtual abans de muntar la imatge',
      diskOnWarn:
        "Muntar la imatge desactiva el disc virtual, de manera que l'ordinador ja no pot accedir a /data. Vols continuar?",
      diskOffWarn:
        "El disc virtual està desactivat i cal activar-lo per muntar la imatge. Els dispositius USB de l'ordinador es tornaran a enumerar. Vols continuar?",
      unmountFailed: "No s'ha pogut desmuntar",
      unmountDesc:
        "En alguns sistemes, cal expulsar manualment de l'amfitrió remot abans de desmuntar la imatge",
      forceEject: "Força l'expulsió",
      forceEjectConfirm:
        "L'amfitrió ha bloquejat la unitat òptica. Forçar l'expulsió desconnecta el dispositiu USB virtual durant un moment, de manera que el teclat i el ratolí poden desconnectar-se breument. Vols continuar?",
      usbReconnect: 'Reconnecta USB',
      usbReconnectConfirm:
        'Reconnecta el gadget USB només si el host remot no ha detectat el canvi de mitjà. El teclat i el ratolí es poden desconnectar breument.',
      usbReconnectSuccess: 'USB reconnectat',
      usbReconnectFailed: "No s'ha pogut reconnectar USB",
      addImage: 'Afegeix una imatge',
      fromUrl: "Des d'una URL",
      fromFile: "Des d'un fitxer",
      turnOff: 'Apaga',
      deleteDiskShared: 'No es poden suprimir imatges mentre el disc virtual està activat.',
      eject: 'Expulsa',
      download: 'Baixa',
      upload: 'Puja',
      mountTitle: 'Munta la imatge',
      deleteTitle: 'Esborra la imatge',
      deleteConfirm: 'Estàs segur que vols suprimir aquesta imatge?',
      tips: {
        title: 'Com pujar imatges',
        usb1: 'Connecta el NanoKVM al teu ordinador via USB.',
        usb2: "Assegura't que el disc virtual està muntat a Configuració > Dispositiu > Disc virtual.",
        usb3: "Obre el disc virtual i copia la imatge a l'arrel.",
        scp1: 'Comprova que el NanoKVM i el teu ordinador estan a la mateixa xarxa.',
        scp2: 'Obre un terminal i usa SCP per pujar la imatge al directori /data del NanoKVM.',
        scp3: 'Exemple: scp ruta-de-la-imatge root@ip-del-nanokvm:/data',
        tfCard: 'Targeta SD',
        tf1: 'Mètode disponible a sistemes GNU/Linux',
        tf2: 'Extreu la targeta SD del NanoKVM. A la versió FULL, obre primer la carcassa.',
        tf3: "Introdueix la targeta en un lector i connecta'l a l'ordinador.",
        tf4: 'Copia la imatge al directori /data de la targeta.',
        tf5: 'Reintrodueix la targeta al NanoKVM.'
      }
    },
    script: {
      title: 'Scripts',
      upload: 'Puja',
      run: 'Executa',
      runBackground: 'Executa en segon pla',
      runFailed: "Error en l'execució",
      delDesc: 'Estàs segur que vols eliminar aquest fitxer?',
      delete: 'Esborra',
      close: 'Tanca',
      unlockDesc:
        "Els scripts s'executen com a root al NanoKVM. Introduïu la contrasenya del compte web per pujar-ne o executar-ne un.",
      terminalRequired:
        'Els scripts necessiten accés al terminal web. Activeu primer el terminal a la configuració.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'Terminal NanoKVM',
      serial: 'Terminal de port sèrie',
      unlockTitle: 'Desbloqueja el terminal',
      unlockDesc: 'Introdueix la contrasenya del compte web per iniciar una sessió de terminal',
      unlock: 'Desbloqueja',
      unlockFailed: "No s'ha pogut desbloquejar el terminal",
      invalidCredentials: "Nom d'usuari o contrasenya no vàlids",
      locked: 'Massa intents, torna-ho a provar més tard',
      sessionClosed: 'Sessió de terminal tancada. Desbloqueja de nou per reconnectar.',
      sessionError: 'La connexió del terminal ha fallat. Desbloqueja de nou per reintentar.',
      serialPort: 'Port sèrie',
      serialPortPlaceholder: 'Per exemple /dev/ttyS1',
      baudrate: 'Velocitat en bauds',
      parity: 'Paritat',
      parityNone: 'Cap',
      parityEven: 'Parell',
      parityOdd: 'Senar',
      flowControl: 'Control de flux',
      flowControlNone: 'Cap',
      flowControlSoft: 'Programari',
      flowControlHard: 'Maquinari',
      dataBits: 'Bits de dades',
      stopBits: 'Bits de parada',
      open: 'Obre el terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Enviant comanda...',
      sent: 'Comanda enviada',
      input: 'Adreça MAC',
      ok: "D'acord"
    },
    download: {
      input: 'URL de la imatge remota',
      ok: 'OK',
      disabled:
        "Ara no es poden descarregar ni pujar imatges perquè l'emmagatzematge no és escrivible. Si hi ha una imatge muntada, desmunta-la i després apaga el disc virtual perquè l'emmagatzematge torni a ser escrivible.",
      diskShared: "Apaga el disc virtual per fer servir la descàrrega d'imatges",
      mountedImage:
        'Aquesta imatge està muntada, desmunta-la abans de pujar un fitxer amb el mateix nom',
      diskOff: 'Apaga el disc virtual',
      uploadbox: 'Deixa anar el fitxer aquí o fes clic per seleccionar-lo',
      inputfile: "Fitxer d'imatge",
      NoISO: 'Cap imatge',
      complete: 'Descàrrega completada',
      uploadComplete: 'Pujada completada',
      downloading: 'Descarregant',
      uploading: 'Pujant',
      failed: 'La transferència ha fallat',
      uploadFailed: 'La pujada ha fallat',
      stalled: "La transferència s'ha aturat, comprova la connexió i torna-ho a provar",
      canceled: 'Pujada cancel·lada',
      downloadCanceled: 'Descàrrega cancel·lada',
      cancel: 'Cancel·la',
      remoteDisabled:
        "La descàrrega remota d'ISO està desactivada a Configuració > Usuari > Preferències",
      remoteFailed: "La descàrrega remota d'ISO ha fallat",
      sha256: 'Suma de verificació SHA-256 opcional',
      sha256Placeholder: 'Introdueix una suma de verificació SHA-256 de 64 caràcters',
      invalidSHA256: 'SHA-256 ha de ser una cadena hexadecimal de 64 caràcters',
      checksumFailed: 'Descàrrega fallida: ha fallat la verificació SHA-256'
    },
    power: {
      title: 'Alimentació',
      showConfirm: 'Confirmació',
      showConfirmTip: "Les operacions d'alimentació requereixen confirmació",
      reset: 'Reinicia',
      powerShort: "Botó d'engegada: clic curt",
      powerLong: "Botó d'engegada: clic llarg",
      resetConfirm: 'Vols realment reiniciar?',
      powerConfirm: 'Vols realment encendre/apagar?',
      okBtn: 'Sí',
      cancelBtn: 'No'
    },
    settings: {
      title: 'Configuració',
      about: {
        title: 'Quant a',
        information: 'Informació',
        ip: 'Adreça IP',
        mdns: 'Adreça local',
        application: 'Versió aplicació',
        uptime: 'Temps actiu',
        community: 'Comunitat',
        credit: 'Basat en <a1>NanoKVM</a1> de Sipeed i <a2>Hardened NanoKVM</a2> de woffko',
        hostname: 'Nom del dispositiu',
        changeIn: 'Canvia-ho a {{path}}',
        updateIn: 'Actualitza-ho a {{path}}',
        toggleIn: 'Activa-ho o desactiva-ho a {{path}}'
      },
      appearance: {
        title: 'Preferències',
        display: 'Pantalla',
        language: 'Idioma',
        languageDesc: "Selecciona l'idioma per a la interfície",
        webTitle: 'Títol web',
        webTitleDesc: 'Personalitza el títol de la pàgina',
        layoutMode: 'Disseny de la interfície',
        layoutModeDesc: 'Utilitza el disseny de mòbil/tàctil en aquest navegador',
        layoutAuto: 'Automàtic',
        layoutMobile: 'Mòbil',
        menuBar: {
          title: 'Barra de menús',
          mode: 'Mode de visualització',
          modeDesc: 'Mostra la barra de menús a la pantalla',
          modeOff: 'Apagat',
          modeAuto: 'Ocultació automàtica',
          modeAlways: 'Sempre visible',
          keyboardLedStatus: 'Indicadors de bloqueig del teclat',
          keyboardLedStatusDesc:
            "Mostra l'estat de Bloq Num, Bloq Maj i Bloq Despl de l'ordinador remot",
          icons: 'Icones del submenú',
          iconsDesc: 'Mostra les icones del submenú a la barra de menús',
          terminalWarningTitle: 'Vols activar el terminal web?',
          terminalWarningDesc:
            "El terminal obre una shell root al navegador. Activa'l només en una xarxa de confiança i desactiva'l en acabar.",
          terminalWarningConfirm: 'Activa',
          remoteDownload: 'Descarrega ISO remota',
          remoteDownloadWarningTitle: "Vols activar la descàrrega remota d'ISO?",
          remoteDownloadWarningDesc:
            "NanoKVM baixarà una ISO des d'un URL i l'escriurà a /data. Activa'l només per a URL de confiança i desactiva'l en acabar.",
          remoteDownloadWarningConfirm: 'Activa'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Estat de bloqueig del teclat remot',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Bloq Num',
        numLockShort: 'Num',
        capsLock: 'Bloq Maj',
        capsLockShort: 'Maj',
        scrollLock: 'Bloq Despl',
        scrollLockShort: 'Despl',
        on: 'Activat',
        off: 'Desactivat',
        unknown: 'Desconegut'
      },
      device: {
        title: 'Dispositiu',
        minutes: 'min',
        sections: {
          general: 'General',
          connectivity: 'Connectivitat',
          hostConnection: "Connexió amb l'amfitrió",
          inputOutput: 'Entrada i sortida'
        },
        oled: {
          title: "Temps d'espera de l'OLED",
          description: 'Apagar pantalla OLED després de',
          keepOn: "Mantén l'OLED encesa",
          keepOnDescription: 'No apaguis mai la pantalla OLED'
        },
        ssh: {
          description: 'Activa accés remot per SSH',
          tip: "Configura una contrasenya segura a Compte > Contrasenya abans d'activar aquesta opció"
        },
        swap: {
          title: 'Swap',
          description: "Utilitza un fitxer swap quan la memòria s'esgota",
          size: 'Mida del swap',
          sizeDescription: 'Defineix la mida del fitxer swap',
          tip: 'Pot reduir la vida útil de la targeta SD'
        },
        mouseJiggler: {
          title: 'Mou-ratolí automàtic',
          description: 'Evita que el dispositiu remot entri en repòs',
          disable: 'Desactiva',
          absolute: 'Mode absolut',
          relative: 'Mode relatiu'
        },
        sessionLock: {
          title: 'Bloqueja la sessió quan estigui inactiva',
          description: "Demana iniciar sessió de nou després d'aquest temps"
        },
        mdns: {
          description: 'Activa descobriment mDNS',
          tip: "Permet accedir a aquest dispositiu pel seu nom .local. No cal si et connectes per adreça IP o si el teu DNS ja resol el nom d'amfitrió."
        },
        hdmi: {
          description: 'Activa la sortida HDMI',
          idleTimeoutTitle: "Temps d'espera d'inactivitat de captura",
          idleTimeoutDescription:
            'Atura la captura HDMI després de no detectar espectadors actius durant'
        },
        hidOnly: 'Mode HID-Only',
        hidOnlyDesc:
          "Millora la compatibilitat amb l'amfitrió si el ratolí o el teclat deixen de respondre",
        hidOnlyTip:
          "El mode HID-Only deixa d'emular dispositius virtuals i només conserva el control bàsic HID",
        disk: 'Disc virtual',
        diskDesc: 'Munta la targeta SD al dispositiu remot',
        diskLocked:
          'Desactivat mentre hi ha una imatge muntada, i activar-lo cancel·la el muntatge',
        diskEnable: 'Activa el disc virtual',
        networkChange: 'Canvia la xarxa virtual',
        diskCancelMount: 'Activar el disc virtual cancel·la la imatge muntada. Vols continuar?',
        networkCancelMount:
          'Canviar la xarxa virtual reinicia la connexió USB. Això cancel·la la imatge muntada i activa el disc virtual. Vols continuar?',
        diskTransferRunning:
          "Hi ha una transferència d'imatge en curs. Espera que acabi abans d'activar el disc virtual.",
        network: 'Xarxa virtual',
        networkDesc: 'Munta una targeta de xarxa virtual al dispositiu remot',
        usbWakeup: 'Activació per USB',
        usbWakeupDesc: 'Permet que els esdeveniments de teclat o ratolí despertin el host remot',
        usbWakeupTip: 'Desactiva-ho si el host registra missatges USB wakeup repetits',
        hostname: {
          description: "Nom d'aquest dispositiu a la xarxa",
          reachable: 'Accessible a la xarxa local com a {{address}}'
        },
        rebootRequired: 'Cal reiniciar',
        rebootPending: 'Cal reiniciar per a: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Actualització del sistema'
        },
        reboot: 'Reinicia',
        rebootDesc: 'Segur que vols reiniciar el NanoKVM?',
        poweroff: 'Apaga',
        poweroffDesc: 'Segur que vols apagar NanoKVM?'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Connexió',
        configuration: 'Configuració',
        wifi: {
          title: 'Wi-Fi',
          description: 'Configura la xarxa Wi-Fi',
          apMode: "El mode AP està activat; connecta't al Wi-Fi escanejant el codi QR",
          connect: "Connecta't a Wi-Fi",
          connectDesc1: 'Introdueix el SSID i la contrasenya de la xarxa',
          disconnect: 'Segur que vols desconnectar la xarxa?',
          disconnectBtn: 'Desconnecta',
          connected: 'Connectat',
          ssid: 'Nom',
          password: 'Contrasenya',
          joinBtn: 'Connecta',
          cancelBtn: 'Cancel·la'
        },
        tls: {
          description: 'Activa el protocol HTTPS',
          tip: 'Atenció: Usar HTTPS pot augmentar la latència, sobretot amb vídeo MJPEG',
          restartTitle: 'El servidor es reiniciarà',
          restartDesc:
            'El canvi de protocol reinicia el servidor. El navegador canviarà a la nova adreça al cap de {{seconds}} segons:',
          restartOk: 'Aplica i reinicia',
          confirmTitle: 'Mantenir el nou protocol?',
          confirmDesc:
            "El servidor ara funciona amb {{protocol}}. Tornarà al protocol anterior d'aquí a {{seconds}} segons si no el mantens.",
          confirmKeep: 'Mantén',
          confirmRevert: 'Torna enrere',
          reverting:
            'Es torna al protocol anterior. El navegador canviarà a aquesta adreça al cap de {{seconds}} segons.',
          certTitle: 'Voleu mantenir el nou certificat?',
          certDesc:
            "El servidor ara utilitza el nou certificat. Torna a l'anterior d'aquí a {{seconds}} segons si no el manteniu.",
          certReverted: 'El certificat anterior ha tornat'
        },
        trustedProxies: {
          section: 'Servidor intermediari invers',
          title: 'Servidors intermediaris de confiança',
          description:
            "Servidors intermediaris inversos en què el dispositiu confia per informar de l'adreça i el protocol del client",
          tip: "Una adreça de la llista tria l'adreça del client que registren el límit d'inici de sessió i el registre, així que llista només servidors intermediaris que controles",
          none: 'Cap',
          edit: 'Edita',
          editRow: 'Edita la llista',
          editTitle: 'Edita els servidors intermediaris de confiança',
          editDescription: 'Canviar la llista requereix la teva contrasenya',
          dialogDescription:
            "Introdueix l'adreça de cada servidor intermediari invers tal com la veu aquest dispositiu, o un interval com 10.0.0.0/24. Un servidor de la llista diu al dispositiu quina adreça i quin protocol de client ha d'usar. Es creu tot el que reenvia, així que llista només servidors intermediaris que controles."
        },
        certificate: {
          title: 'Certificat',
          desc: "D'on prové el certificat HTTPS",
          requesting: "S'està sol·licitant el certificat",
          selfSigned: 'Autosignat',
          domain: 'Domini',
          domainDesc: "Ha d'apuntar a aquest dispositiu, amb el port 443 accessible des d'Internet",
          domainTailscale: 'Definit per Tailscale per a aquest dispositiu',
          domainInvalid: 'Feu servir un nom de domini complet, per exemple kvm.example.org',
          email: 'Correu electrònic',
          emailDesc: "Opcional, per als avisos de Let's Encrypt",
          emailInvalid: 'Feu servir una adreça com nom@example.org',
          validUntil: 'Vàlid fins al',
          valid: 'Vàlid',
          expiresSoon: 'Caduca aviat',
          expired: 'Caducat',
          lastRenewal: 'Última renovació',
          renewed: 'Renovat',
          failed: 'Ha fallat',
          renewNow: 'Renova ara',
          renewNowDesc: 'Sol·licita un nou certificat sense esperar',
          renewBtn: 'Renova',
          applyTitle: 'Canvia el certificat',
          applyOk: 'Aplica',
          applyAcme:
            "El dispositiu sol·licita un certificat a Let's Encrypt. Let's Encrypt es connecta al port 443 des d'Internet per comprovar-lo, cosa que pot trigar fins a un minut. Si la sol·licitud falla, el certificat actual continua en ús.",
          applyTailscale:
            'El dispositiu obté un certificat de Tailscale, cosa que pot trigar fins a un minut. Si la sol·licitud falla, el certificat actual continua en ús.',
          applySelfSigned:
            'El dispositiu torna al seu propi certificat autosignat. Els navegadors mostren un avís.',
          openTitle: "Obre l'adreça nova",
          openDesc:
            "El certificat està a punt. Obriu l'adreça de sota i inicieu la sessió per mantenir-lo. Sense la vostra confirmació en 3 minuts, torna el certificat anterior.",
          openOk: 'Obre',
          blockedClock:
            'Els certificats no es poden sol·licitar fins que el rellotge del dispositiu estigui sincronitzat',
          blockedParanoid: 'El mode del tallafoc Paranoic bloqueja les sol·licituds de certificat',
          tailscaleUnavailable:
            "Tailscale no s'està executant, o els certificats HTTPS no estan activats per a la tailnet"
        },
        dns: {
          title: 'DNS',
          description: 'Configura els servidors DNS per a NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: "Configura l'adreçament IPv4 per a la interfície cablejada",
          servers: 'Servidors',
          dhcp: 'DHCP',
          manual: 'Manual',
          apply: 'Aplica',
          invalid: 'Introdueix una adreça IPv4 o IPv6 vàlida',
          invalidNetwork:
            'Introdueix una adreça IPv4, una màscara de subxarxa i un encaminador vàlids',
          saved: 'Configuració DNS desada',
          redirecting: 'Configuració de xarxa desada. Obrint la nova adreça...',
          saveFailed: "No s'ha pogut desar la configuració DNS",
          unsaved: 'Canvis no desats',
          maxServers: 'Es permeten com a màxim {{count}} servidors DNS',
          dhcpServersDescription: "Els servidors DNS s'obtenen automàticament via DHCP",
          manualServersDescription: "S'admeten servidors IPv4 i IPv6",
          interface: 'Interfície',
          ipAddress: 'Adreça IP',
          subnetMask: 'Màscara de subxarxa',
          router: 'Encaminador'
        },
        ipv6: {
          title: 'IPv6',
          description: "Configura l'adreçament IPv6 per a la interfície amb cable",
          disabled: 'Desactivat',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manual',
          interface: 'Interfície',
          state: 'Estat',
          router: 'Encaminador',
          addresses: 'Adreces',
          dhcpv6Client: 'Client DHCPv6',
          notInstalled: 'No instal·lat',
          ipAddress: 'Adreça IPv6',
          prefix: 'Prefix',
          invalidManual: 'Introdueix una adreça IPv6, un prefix i un encaminador vàlids',
          clientMissing:
            "El client DHCPv6 no està instal·lat. Instal·la primer l'actualització raw del sistema corresponent.",
          saved: 'Configuració IPv6 desada',
          saveFailed: "No s'ha pogut desar la configuració IPv6",
          unsaved: 'Canvis no desats'
        }
      },
      system: {
        title: 'Sistema',
        performance: {
          processor: 'Processador',
          overdrive: {
            title: 'Sobreesforç de rellotge',
            description:
              'Arrenca amb les freqüències més altes de processador i de vídeo especificades pel fabricant',
            tip: 'Si el dispositiu no arrenca amb el sobreesforç, cal tornar a gravar la targeta SD',
            unavailable: 'No inclòs en aquesta imatge del sistema',
            keepTitle: "Mantén l'overdrive després d'actualitzar",
            keepDescription:
              'Una actualització del sistema torna el dispositiu als rellotges estàndard si això no està activat',
            confirmTitle: 'Activar el sobreesforç de rellotge?',
            confirmText:
              "Si el dispositiu no arrenca amb el sobreesforç, haureu de tornar a gravar la targeta SD per recuperar-lo. El canvi s'aplica després del proper reinici.",
            confirmOk: 'Activa'
          },
          watchdog: {
            title: 'Watchdog de maquinari',
            description: 'Reinicia el dispositiu automàticament quan deixa de respondre',
            unavailable: 'No inclòs en aquesta imatge del sistema',
            notRunning: "No s'està executant ara mateix",
            lastRestart: 'Últim reinici',
            lastRestartCaption: "Motiu més recent pel qual s'ha reiniciat el sistema",
            reasonPowerOn: 'Engegada',
            reasonRestart: 'Reinici sol·licitat',
            reasonWatchdog: 'Reinici del watchdog',
            reasonOverheat: 'Protecció contra sobreescalfament',
            reasonUnknown: 'Desconegut'
          },
          recovery: 'Recuperació',
          memory: 'Memòria'
        },
        monitor: {
          processorClock: 'Subsistema de CPU',
          videoClock: 'Subsistema de vídeo',
          videoClockCaption: 'Freqüència del rellotge de vídeo',
          cpuClockCaption: 'Freqüència del rellotge de la CPU',
          overdrive: 'Sobreesforç',
          temperature: 'Temperatura',
          lastMinutes: 'Últims 5 minuts',
          ram: 'RAM',
          off: 'Desactivat',
          ramHistory: 'Utilització de la RAM',
          cpuLoad: 'Càrrega de la CPU',
          cpuLoadCaption: 'Usuari {{user}} per cent, sistema {{system}} per cent',
          cpuUtilization: 'Utilització de la CPU',
          swapUtilization: "Utilització de la memòria d'intercanvi",
          swapSizeLastMinutes: '{{size}}, últims 5 minuts',
          percent: '{{percent}} per cent',
          percentUsed: '{{percent}} per cent en ús',
          sizeOf: '{{used}} de {{total}}',
          systemPartition: 'Partició del sistema',
          dataPartition: 'Partició de dades',
          unavailable: 'No disponible',
          noReadings: 'El dispositiu no retorna lectures',
          refresh: "S'actualitza cada segon mentre aquesta pàgina és oberta"
        },
        sections: {
          time: 'Hora',
          firewall: 'Tallafoc',
          systemLog: 'Registre',
          performance: 'Rendiment',
          monitor: 'Monitor',
          services: 'Serveis',
          webInterface: 'Accés web segur'
        },
        time: {
          saveFailed: "No s'han pogut desar els paràmetres d'hora",
          saved: "Paràmetres d'hora desats",
          syncFailed: "No s'ha pogut sincronitzar l'hora",
          synced: 'Hora sincronitzada',
          invalidServers: 'Introdueix almenys un servidor NTP',
          maxServers: 'Es permeten com a màxim {{count}} servidors NTP',
          refresh: 'Actualitza',
          syncNow: 'Sincronitza',
          syncNowDesc: 'Ajusta el rellotge amb els servidors NTP ara',
          save: 'Desa',
          ntp: {
            title: 'NTP',
            description: "Sincronitza l'hora del dispositiu des dels servidors NTP configurats"
          },
          networkTime: 'Hora de xarxa',
          clock: {
            title: 'Rellotge',
            description: 'Defineix la zona horària local usada pels registres i la interfície',
            current: 'Hora actual',
            timezone: 'Zona horària'
          },
          servers: {
            title: 'Servidors NTP',
            description:
              'Fes servir els servidors públics per defecte, el teu encaminador local o servidors NTP personalitzats',
            useRouter: 'Fes servir encaminador',
            useDefaults: 'Fes servir valors per defecte',
            presets: 'Predefinits de servidors',
            presetsDesc: 'Substitueix la llista de servidors per un valor predefinit'
          }
        },
        firewall: {
          saveFailed: "No s'han pogut aplicar els paràmetres del tallafoc",
          saved: 'Paràmetres del tallafoc aplicats',
          cancel: 'Cancel·la',
          refresh: 'Actualitza',
          backends: 'Backends',
          enableHttpsFirst:
            "Activa HTTPS abans d'activar el mode de tallafoc Restringit o Paranoic",
          httpsRequired:
            "Els modes Restringit i Paranoic estan desactivats fins que s'activi HTTPS a Configuració > Xarxa > Serveis",
          mode: {
            title: 'Mode del tallafoc',
            baseline: 'Base',
            baselineDesc:
              "Perfil obert de compatibilitat. El tallafoc funciona, però els orígens entrants no estan restringits. Utilitza'l només en xarxes de confiança.",
            moderate: 'Moderat',
            moderateDesc:
              "Perfil per defecte. Manté els serveis de Base, però només accepta noves connexions entrants d'intervals privats, d'enllaç local o de loopback. El trànsit de sortida continua obert.",
            restricted: 'Restringit',
            restrictedDesc:
              'HTTPS i SSH només locals, més DNS, NTP, syslog i actualitzacions en línia de sortida. DHCP i el trànsit IPv6 essencial continuen disponibles. WebRTC està bloquejat.',
            paranoid: 'Paranoic',
            paranoidDesc:
              "Accés HTTPS només local. Bloqueja SSH, HTTP, les actualitzacions en línia i altres funcions de xarxa de sortida. La pujada d'actualitzacions fora de línia i les instal·lacions ja preparades continuen disponibles.",
            current: 'Actual',
            default: 'Per defecte',
            localOnly: 'Només local',
            openTag: 'Entrada oberta',
            httpsRequiredTag: 'Cal HTTPS',
            outboundOpen: 'Sortida oberta',
            outboundLimited: 'Sortida limitada',
            httpsOnly: 'Només HTTPS'
          },
          moderate: {
            apply: 'Canvia a Moderat'
          },
          restricted: {
            enable: 'Activa Restringit',
            confirmTitle: 'Vols activar el mode Restringit?',
            confirmDesc:
              "L'accés administratiu entrant quedarà limitat als rangs private IPv4, IPv4 link-local/loopback, IPv6 link-local o IPv6 loopback per a HTTPS i SSH. Els rangs públics no estan permesos. DNS, NTP, syslog remot, actualitzacions online, DHCP, connexions establertes i trànsit essencial IPv6 de sortida romandran disponibles. WebRTC/ICE UDP i la resta de trànsit entrant/sortint quedaran bloquejats."
          },
          paranoid: {
            enable: 'Activa Paranoic',
            confirmTitle: 'Vols activar el mode Paranoic?',
            confirmDesc:
              "Només quedarà disponible l'accés HTTPS des de rangs private IPv4, IPv4 link-local/loopback, IPv6 link-local o IPv6 loopback. SSH, HTTP, mDNS, NTP, descàrregues de GitHub i la resta de trànsit quedaran bloquejats excepte el mínim DHCP/control IPv6."
          },
          baseline: {
            apply: 'Canvia a Base',
            confirmTitle: 'Canviar al mode Base obert?',
            confirmDesc:
              "El servei de tallafoc continua actiu, però se suprimeix la restricció d'intervals d'origen només locals. Els intervals d'origen públics poden arribar als serveis exposats de NanoKVM si la xarxa els encamina."
          },
          rules: {
            title: 'Regles actuals',
            empty: 'No hi ha regles'
          }
        },
        saveChanges: 'Desa els canvis',
        unsaved: 'Canvis no desats'
      },
      systemLog: {
        saveFailed: "No s'han pogut desar els paràmetres de registre",
        saved: 'Paràmetres de registre desats',
        invalidHost: 'Introdueix un host de servidor syslog',
        logLoadFailed: "No s'han pogut carregar els registres",
        save: 'Desa',
        test: 'Envia registre de prova',
        testSent: 'Registre de prova enviat',
        testFailed: "No s'ha pogut enviar el registre de prova",
        remote: {
          title: 'Registre remot',
          forward: 'Reenvia el registre del sistema',
          description: 'Reenvia els missatges del sistema a un servidor remot',
          host: 'Servidor',
          hostDesc: "Nom d'amfitrió o adreça IPv4 del servidor syslog",
          port: 'Port',
          protocol: 'Port UDP del servidor syslog'
        },
        local: {
          title: 'Memòria intermèdia del registre del sistema',
          description:
            'Els registres actuals es mantenen a la RAM a {{path}} per evitar escriptures a la targeta SD',
          priority: 'Prioritat mínima',
          priorityDesc: 'Urgència mínima perquè un missatge es registri',
          buffer: 'Mida del buffer',
          bufferDesc: 'Mida del registre a partir de la qual es fa la rotació del fitxer',
          rotations: 'Rotacions',
          rotationsDesc: 'Nombre de fitxers de registre rotats que es conserven',
          compact: 'Sortida compacta',
          compactDesc: "Ometeix el nom d'amfitrió i la facilitat de cada línia",
          stripTimestamps: 'Elimina marques de temps',
          stripTimestampsDesc:
            "Elimina les marques de temps afegides per l'emissor; syslog afegeix les seves"
        },
        kernel: {
          title: 'Registre del kernel',
          enabled: 'Reenvia el registre del kernel',
          enabledDesc: 'Captura els missatges del kernel al registre del sistema',
          consoleLevel: 'Nivell de consola',
          consoleLevelDesc:
            "Urgència mínima perquè un missatge del kernel s'imprimeixi a la consola"
        },
        viewer: {
          title: 'Registre del sistema',
          refresh: 'Actualitza',
          empty: 'No hi ha entrades de registre',
          truncated: 'Només es mostren les dades de registre més recents',
          linesUnit: 'línies'
        },
        level: {
          '1': '1 - Alerta',
          '2': '2 - Crític',
          '3': '3 - Error',
          '4': '4 - Avís',
          '5': '5 - Notificació',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Tot'
        }
      },
      user: {
        title: 'Usuari'
      },
      networking: {
        title: 'Xarxa'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Túnel xifrat',
        device: 'Aquest dispositiu',
        description: 'Accedeix a aquest KVM mitjançant un túnel WireGuard',
        unavailable: 'WireGuard no està instal·lat en aquest dispositiu',
        blocked: 'El mode del tallafoc Paranoic bloqueja WireGuard',
        needsKey: "Defineix una clau privada abans d'activar WireGuard",
        saved: "S'ha desat la configuració de WireGuard",
        save: 'Desa els canvis',
        unsaved: 'Canvis no desats',
        invalid: 'Revisa els camps ressaltats',
        invalidAddress: 'Introdueix una adreça amb la seva màscara, com 10.0.0.1/24',
        invalidKey: 'Introdueix una clau WireGuard de 44 caràcters',
        invalidEndpoint: "Introdueix un nom d'amfitrió o una adreça IP",
        invalidPort: "Introdueix un port de l'1 al 65535",
        invalidRanges: 'Fes servir intervals IPv4 com 10.0.0.0/24, no 0.0.0.0/0',
        status: {
          connected: 'Connectat',
          waiting: 'Esperant el peer',
          stopped: 'Aturat',
          handshake: 'Últim handshake {{time}}'
        },
        privateKey: {
          title: 'Clau privada',
          description: 'Es queda en aquest dispositiu i no es mostra mai més',
          set: 'Definida',
          notSet: 'No definida',
          setBtn: 'Defineix',
          generate: 'Genera',
          remove: 'Elimina',
          modalTitle: 'Defineix la clau privada',
          modalDescription: 'La clau es desa en aquest dispositiu i no es torna a mostrar mai',
          placeholder: 'Enganxa la clau privada',
          generateConfirmTitle: 'Generar una clau privada nova?',
          generateConfirmDesc:
            'La clau actual deixa de funcionar. Afegeix després la nova clau pública al peer.',
          removeConfirmTitle: 'Eliminar la clau privada?',
          removeConfirmDesc:
            "WireGuard s'apaga i continua apagat fins que es defineixi una clau nova."
        },
        publicKey: {
          title: 'Clau pública',
          description: 'Afegeix-la a la configuració del peer'
        },
        address: {
          title: 'Adreça',
          description: 'Adreça del KVM al túnel i la seva màscara'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Clau pública',
          publicKeyDescription: 'Clau pública del peer al qual et connectes',
          server: 'Servidor',
          serverDescription: "Nom d'amfitrió o adreça IP del peer",
          port: 'Port',
          portDescription: 'Port UDP del peer, normalment 51820',
          allowedIps: 'IP permeses',
          allowedIpsDescription: 'Adreça o interval del peer al túnel, com 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: "Segons entre els paquets keepalive, necessaris darrere d'un router"
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Accedeix a aquest KVM mitjançant la teva xarxa Tailscale',
        service: 'Servei',
        performance: 'Rendiment',
        memory: {
          title: 'Optimització de memòria',
          tip: "Manté baix l'ús de memòria de Tailscale, cosa que ajuda en un dispositiu amb poca RAM. Reinicia Tailscale perquè el canvi tingui efecte."
        },
        swap: {
          title: 'Fitxer swap',
          tip: "Si els problemes persisteixen després d'activar l'optimització de memòria, prova d'activar el fitxer swap",
          sizeTip:
            'Això estableix la mida del fitxer a 128MB; ajusta-la a Configuració > Sistema > Rendiment'
        },
        restartTitle: 'Reinicia Tailscale',
        restartDesc: 'Reinicia el servei',
        restartBtn: 'Reinicia',
        restart: 'Reiniciar Tailscale?',
        stopTitle: 'Atura Tailscale',
        stopBtn: 'Atura',
        stop: 'Aturar Tailscale?',
        stopDesc: "Atura el servei i evita que s'iniciï en arrencar",
        loading: 'Carregant...',
        notInstall: 'Tailscale no instal·lat, instal·la-ho',
        install: 'Instal·la',
        installing: 'Instal·lant',
        failed: 'Error en la instal·lació',
        retry: 'Actualitza la pàgina i torna-ho a provar, o instal·la manualment.',
        download: 'Descarrega el',
        package: "paquet d'instal·lació",
        unzip: 'i descomprimeix-lo',
        upTailscale: 'Puja tailscale al directori /usr/bin/ del NanoKVM',
        upTailscaled: 'Puja tailscaled al directori /usr/sbin/ del NanoKVM',
        refresh: 'Actualitza la pàgina',
        notRunning: "Tailscale no s'està executant. Si us plau, inicia'l per continuar.",
        run: 'Comença',
        notLogin: 'El dispositiu no està vinculat. Inicia sessió per vincular-lo.',
        urlPeriod: 'Aquesta URL és vàlida durant 10 minuts',
        login: 'Inicia sessió',
        loginSuccess: 'Sessió iniciada correctament',
        deviceName: 'Nom del dispositiu',
        deviceIP: 'IP del dispositiu',
        account: 'Compte',
        logout: 'Tanca sessió',
        logoutDesc: 'Segur que vols tancar sessió?',
        uninstall: 'Desinstal·la Tailscale',
        uninstallDesc: 'Estàs segur que vols desinstal·lar Tailscale?',
        okBtn: 'Sí',
        cancelBtn: 'No'
      },
      update: {
        title: 'Actualitzacions',
        currentVersion: 'Versió actual',
        latestVersion: 'Última versió',
        queryFailed: 'Error en obtenir la versió',
        updateFailed: 'Error en actualitzar',
        paranoidBlocked:
          'Les actualitzacions en línia estan bloquejades pel mode de tallafoc Paranoic',
        paranoidBlockedDesc:
          'Les comprovacions i descàrregues de GitHub requereixen accés de sortida. La pujada offline i les instal·lacions ja preparades continuen disponibles.',
        available: 'Hi ha una actualització disponible. Vols actualitzar ara?',
        updating: 'Actualització iniciada',
        confirm: 'Confirma',
        cancel: 'Cancel·la',
        badge: {
          checking: 'Comprovant',
          latest: 'Actualitzat',
          available: 'Actualització disponible',
          failed: 'Comprovació fallida',
          local: 'Local'
        },
        application: {
          title: 'Aplicació'
        },
        system: {
          queryFailed: "No s'ha pogut obtenir la versió del sistema",
          appUpdateRequired:
            "Actualitza l'aplicació a {{version}} abans d'instal·lar aquesta actualització del sistema",
          requiredAppVersion: "Versió d'aplicació necessària",
          downloadFailed: 'La descàrrega o verificació ha fallat',
          available: 'Hi ha una actualització del sistema base disponible.',
          downloading: "Descarregant i verificant l'actualització del sistema...",
          downloadVerify: 'Descarrega i verifica',
          installing: "Instal·lant l'actualització del sistema preparada...",
          install: 'Instal·la',
          installFailed: 'La instal·lació ha fallat',
          installConfirmTitle: "Instal·lar l'actualització del sistema?",
          installConfirmDesc:
            'Això substituirà fitxers del sistema base des del paquet verificat. Caldrà reiniciar.',
          rawInstallConfirmDesc:
            "Aquest paquet verificat escriurà imatges raw boot/rootfs a les particions de la targeta SD i reiniciarà automàticament. L'escriptura pot trigar uns minuts; mantén l'alimentació connectada.",
          rawInstallWarning:
            "No hi ha rollback automàtic per a actualitzacions de particions raw. Si l'arrencada falla, recupera la targeta SD manualment.",
          rawWaitTitle: "Instal·lant l'actualització del sistema",
          rawWaitWriting: "S'està escrivint el sistema nou a la targeta SD",
          rawWaitRestarting: 'El dispositiu es reinicia. Aquesta pàgina es recarrega quan torni.',
          rawWaitDesc:
            "Això triga uns tres minuts. Mantingueu l'alimentació connectada i no tanqueu aquesta pàgina.",
          rawWaitSlow:
            "Està trigant més del previst. Espereu uns minuts més abans de tallar l'alimentació.",
          rebootRequired: 'Cal reiniciar per activar aquest estat del sistema.',
          rollingBack: "Fent rollback de l'actualització del sistema...",
          rollback: 'Rollback',
          rollbackDone: 'Rollback preparat',
          rollbackFailed: 'Rollback fallat',
          rollbackConfirmTitle: "Fer rollback de l'actualització del sistema?",
          rollbackConfirmDesc:
            "Això restaurarà fitxers des de l'última còpia del sistema. Caldrà reiniciar.",
          stagedDesc:
            "L'actualització del sistema s'ha descarregat i verificat, ja es pot instal·lar",
          refresh: 'Actualitza',
          releaseNotes: 'Notes de versió',
          systemVersion: 'Versió del sistema',
          kernel: 'Kernel',
          stagedVersion: 'Versió preparada',
          archive: 'Arxiu',
          requiredFree: 'Espai lliure requerit',
          fileCount: 'Fitxers',
          rawImages: 'Imatges raw',
          progress: 'Progrés',
          progressMessage: 'Missatge de progrés',
          pendingVersion: 'Versió pendent',
          bootHealth: "Estat d'arrencada",
          healthy: 'Correcte',
          unhealthy: 'Requereix atenció',
          rollbackBackup: 'Còpia de rollback'
        },
        offline: {
          title: "Puja un paquet de l'aplicació",
          desc: "Instal·la un paquet de l'aplicació des d'aquest ordinador. El servidor es reinicia després.",
          installTitle: "Instal·lar l'actualització de l'aplicació?",
          installDesc:
            "L'aplicació se substitueix i el servidor es reinicia. Hauràs de tornar a iniciar la sessió."
        },
        local: {
          title: 'Puja un paquet del sistema',
          desc: "Instal·la un paquet del sistema des d'aquest ordinador. Un sol fitxer conté l'arxiu i les seves metadades signades.",
          choose: 'Tria el fitxer',
          invalidFile: 'Selecciona un paquet que acabi en .tar o .tar.gz.',
          diskTitle: 'Apagar el disc virtual?',
          diskWarn:
            "El paquet es desa a /data, que és de només lectura mentre el disc virtual està activat. Si l'apagues, l'ordinador ja no pot accedir a /data. Vols continuar?",
          uploading: 'Pujant',
          verifying: 'Verificant i preparant el paquet',
          keyTitle: "Clau d'actualització local",
          keyDesc: 'Clau pública en format PEM que pot signar els paquets que compilis tu mateix',
          keyNone: 'Cap clau definida',
          keySet: 'Defineix la clau',
          keyRemove: 'Elimina',
          signer: 'Signat per',
          section: 'Actualitzacions locals',
          keyRequired: 'Cal una clau local'
        }
      },
      account: {
        title: 'Compte',
        webAccount: 'Nom del compte web',
        password: 'Contrasenya',
        passwordDesc: "Canvia la contrasenya que s'usa per iniciar sessió a la interfície web",
        updateBtn: 'Canvia',
        logoutBtn: 'Tanca sessió',
        logoutDesc: 'Segur que vols tancar sessió?',
        okBtn: 'Sí',
        cancelBtn: 'No',
        session: {
          title: 'Sessió'
        },
        logoutOnClose: {
          title: 'Tanca la sessió en tancar el navegador',
          description:
            'Finalitza la sessió quan es tanca el navegador en lloc de mantenir-la oberta'
        },
        totp: {
          title: 'Autenticació de dos factors',
          authenticator: "Aplicació d'autenticació",
          description:
            "Exigeix un codi temporal d'una aplicació d'autenticació, a més de la contrasenya",
          required: 'Exigida per la política',
          disable: 'Desactiva',
          enableTitle: "Configura l'autenticació de dos factors",
          enableDescription:
            'Confirma la contrasenya per continuar. Cal per a qualsevol canvi del segon factor.',
          continue: 'Continua',
          disableTitle: "Vols desactivar l'autenticació de dos factors?",
          disableDescription:
            'El teu compte només quedarà protegit per la contrasenya. Confirma amb la contrasenya per continuar.',
          disableFailed: "No s'ha pogut desactivar l'autenticació de dos factors",
          passwordPlaceholder: 'Contrasenya actual',
          enrollFailed: "No s'ha pogut iniciar la configuració",
          invalidCode: 'Aquest codi no coincideix. Prova el següent.',
          scan: "Escaneja-ho amb l'aplicació d'autenticació.",
          manualEntry: 'O introdueix aquesta clau manualment:',
          codePlaceholder: 'Introdueix el codi de 6 dígits per confirmar',
          confirm: 'Confirma',
          cancel: 'Cancel·la',
          backupTitle: 'Desa ara els codis de còpia de seguretat',
          backupDescription:
            "Cada codi funciona una sola vegada i no es tornarà a mostrar. Són l'única manera de tornar a entrar si perdeu l'aplicació d'autenticació, i continuen funcionant quan el rellotge del dispositiu no està sincronitzat.",
          copy: 'Copia',
          copied: "S'han copiat els codis de còpia de seguretat",
          savedThem: 'Ja els he desat',
          remaining: 'Queden {{remaining}} codis de còpia de seguretat',
          clockUnsynced:
            "El rellotge del dispositiu encara no està sincronitzat. Sincronitza l'hora a Configuració > Sistema > Hora abans de configurar-ho.",
          noBackupCodes:
            'No queda cap codi de còpia de seguretat. Fes clic a Genera per crear-ne un joc nou.',
          regenerate: 'Codis de còpia de seguretat nous',
          generate: 'Genera',
          regenerateTitle: 'Vols generar codis de còpia de seguretat nous?',
          regenerateDescription:
            'Els codis de còpia de seguretat actuals deixaran de funcionar. Confirma amb la contrasenya per continuar.',
          regenerateFailed: "No s'han pogut generar codis de còpia de seguretat nous",
          download: 'Baixa',
          copyFailed: "No s'ha pogut copiar. Selecciona els codis i copia'ls manualment.",
          requireTitle: "Exigeix l'autenticació de dos factors",
          requireDescription:
            "Impedeix desactivar l'autenticació de dos factors, i un compte que no la tingui l'haurà de configurar abans d'utilitzar el dispositiu",
          requireFailed: "No s'ha pogut canviar l'exigència",
          requiredTitle: "Cal l'autenticació de dos factors",
          requiredDescription:
            "Aquest dispositiu està configurat per exigir un segon factor, però el teu compte encara no en té cap. Configura'l ara per continuar."
        }
      }
    },
    picoclaw: {
      title: 'Assistent PicoClaw',
      empty: 'Descriu una tasca per començar',
      inputPlaceholder: 'Descriu què vols que faci PicoClaw',
      newConversation: 'Nova conversa',
      processing: "S'està processant...",
      agent: {
        defaultTitle: 'Assistent general',
        defaultDescription: 'Ajuda general de xat, cerca i espai de treball',
        kvmTitle: 'Control remot',
        kvmDescription: "Opera l'amfitrió remot mitjançant NanoKVM",
        switched: "Rol d'agent canviat",
        switchFailed: "No s'ha pogut canviar la funció d'agent"
      },
      send: 'Envia',
      cancel: 'Cancel·la',
      status: {
        connecting: "S'està connectant a la passarel·la...",
        connected: 'Sessió de PicoClaw connectada',
        disconnected: 'Sessió de PicoClaw tancada',
        stopped: "S'ha enviat la sol·licitud d'aturada",
        runtimeStarted: "Temps d'execució de PicoClaw iniciat",
        runtimeStartFailed: "No s'ha pogut iniciar el temps d'execució de PicoClaw",
        runtimeStopped: "Temps d'execució de PicoClaw aturat",
        runtimeStopFailed: "No s'ha pogut aturar el temps d'execució de PicoClaw"
      },
      connection: {
        runtime: {
          checking: 'Comprovació',
          ready: "Temps d'execució a punt",
          stopped: "El temps d'execució s'ha aturat",
          unavailable: "Temps d'execució no disponible",
          configError: 'Error de configuració'
        },
        transport: {
          connecting: 'En connexió',
          connected: 'Connectat'
        },
        run: {
          idle: 'Inactiu',
          busy: 'Ocupat'
        }
      },
      error: {
        lockHeld: "PicoClaw s'està fent servir en una altra finestra",
        takenOver: 'Una altra finestra ha pres el control de PicoClaw',
        authFailed: 'PicoClaw ha rebutjat la connexió',
        upstreamClosed: "S'ha perdut la connexió amb PicoClaw"
      },
      tool: {
        screenshot: 'Fent una captura de pantalla',
        loadImage: 'Mirant la captura de pantalla',
        actions: "Controlant l'amfitrió",
        generic: 'Fent servir {{name}}',
        type: 'Escrivint {{text}}',
        hotkey: 'Prement {{keys}}',
        click: 'Fent clic',
        doubleClick: 'Fent doble clic',
        move: 'Movent el ratolí',
        drag: 'Arrossegant',
        scroll: 'Desplaçant',
        wait: 'Esperant'
      },
      message: {
        toolAction: 'Acció',
        observation: 'Observació',
        screenshot: 'Captura de pantalla'
      },
      overlay: {
        locked: "PicoClaw està controlant el dispositiu. L'entrada manual està en pausa."
      },
      install: {
        install: 'Instal·la PicoClaw',
        installing: 'Instal·lant PicoClaw',
        success: 'PicoClaw instal·lat correctament',
        failed: "No s'ha pogut instal·lar PicoClaw",
        uninstalled: 'PicoClaw desinstal·lat correctament',
        uninstallFailed: 'La desinstal·lació ha fallat',
        requiredTitle: 'PicoClaw no està instal·lat',
        requiredDescription: "Instal·leu PicoClaw abans d'iniciar el temps d'execució de PicoClaw.",
        progressDescription: "PicoClaw s'està baixant i instal·lant.",
        stages: {
          preparing: 'Preparant',
          downloading: "S'està baixant",
          extracting: 'Extracció',
          verifying: 'Verificant',
          installing: 'Instal·lant',
          installed: 'Instal·lat',
          install_timeout: 'Temps esgotat',
          install_failed: 'Ha fallat'
        }
      },
      model: {
        requiredTitle: 'La configuració del model és necessària',
        requiredDescription: "Configura el model PicoClaw abans d'utilitzar el xat PicoClaw.",
        docsTitle: 'Guia de configuració',
        docsDesc: 'Models i protocols compatibles',
        menuLabel: 'Configura el model',
        modelIdentifier: 'Identificador del model',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: "URL base de l'API",
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Clau API',
        apiKeyPlaceholder: 'Introdueix la clau API del model',
        apiKeyKeepPlaceholder: 'Deixa-ho buit per mantenir la clau actual',
        save: 'Desa',
        saving: "S'està desant",
        saved: "S'ha desat la configuració del model",
        saveFailed: "No s'ha pogut desar la configuració del model",
        invalid: "Cal indicar l'identificador del model, l'URL base de l'API i la clau API"
      },
      uninstall: {
        confirmTitle: 'Desinstal·la PicoClaw',
        confirmContent:
          "Estàs segur que vols desinstal·lar PicoClaw? Això suprimirà l'executable i tots els fitxers de configuració.",
        confirmOk: 'Desinstal·la'
      },
      history: {
        title: 'Historial',
        loading: 'Carregant sessions...',
        emptyTitle: 'Encara no hi ha historial',
        emptyDescription: 'Les sessions anteriors de PicoClaw apareixeran aquí.',
        loadFailed: "No s'ha pogut carregar l'historial de sessions",
        deleteFailed: "No s'ha pogut suprimir la sessió",
        deleteConfirmTitle: 'Suprimeix la sessió',
        deleteConfirmContent: 'Estàs segur que vols suprimir "{{title}}"?',
        deleteConfirmOk: 'Esborra',
        messageCount_one: '{{count}} missatge',
        messageCount_many: '{{count}} de missatges',
        messageCount_other: '{{count}} missatges'
      },
      config: {
        startRuntime: 'Inicia PicoClaw',
        stopRuntime: 'Atura PicoClaw',
        stopConfirm: 'Aturar PicoClaw?'
      },
      start: {
        title: 'Inicia PicoClaw',
        description: "Inicia el temps d'execució per començar a utilitzar l'assistent PicoClaw."
      }
    },
    error: {
      title: 'Hi ha hagut un error',
      refresh: 'Actualitza'
    },
    fullscreen: {
      toggle: 'Pantalla completa'
    },
    menu: {
      collapse: 'Amaga menú'
    }
  }
};

export default ca;
