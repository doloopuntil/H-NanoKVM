const de = {
  translation: {
    common: {
      confirm: 'Bestätigen',
      cancel: 'Abbrechen',
      close: 'Schließen',
      save: 'Speichern',
      discard: 'Verwerfen',
      delete: 'Löschen',
      actionFailed: 'Vorgang fehlgeschlagen',
      loading: 'Einstellungen werden vom Gerät geladen...',
      loadFailed: 'Einstellungen konnten nicht vom Gerät geladen werden',
      retry: 'Erneut versuchen'
    },
    head: {
      desktop: 'Entfernter Desktop',
      login: 'Anmelden',
      firstSetup: 'Ersteinrichtung',
      changePassword: 'Passwort ändern',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Anmelden',
      placeholderUsername: 'Benutzername',
      placeholderPassword: 'Passwort',
      placeholderPassword2: 'Bitte Passwort erneut eingeben',
      noEmptyUsername: 'Benutzername benötigt',
      noEmptyPassword: 'Passwort benötigt',
      invalidUser: 'Falscher Benutzername oder falsches Passwort',
      locked: 'Zu viele Anmeldungen, bitte versuchen Sie es später noch einmal',
      globalLocked: 'System wird geschützt, bitte versuchen Sie es später erneut',
      error: 'Unerwarteter Fehler',
      changePassword: 'Passwort ändern',
      changePasswordDesc: 'Für die Sicherheit Ihres Geräts ändern Sie bitte das Passwort',
      differentPassword: 'Passwörter stimmen nicht überein',
      illegalUsername: 'Benutzername enthält ungültige Zeichen',
      illegalPassword:
        'Das Passwort muss mindestens 8 Zeichen lang sein und darf keine Anführungszeichen oder Schrägstriche enthalten',
      forgetPassword: 'Passwort vergessen',
      ok: 'Ok',
      cancel: 'Abbrechen',
      loginButtonText: 'Anmelden',
      setupTitle: 'Administratorkonto erstellen',
      setupDescription:
        'Auf diesem Gerät gibt es noch kein Webkonto. Erstellen Sie das erste Administratorkonto, um fortzufahren.',
      setupRecovery:
        'Wenn dieses Passwort verloren geht, muss zur Wiederherstellung die SD-Karte neu geschrieben werden',
      setupButtonText: 'Konto erstellen',
      tips: {
        hardenedRecovery:
          'Dieses Hardened-Image unterstützt keinen Passwort-Reset über die BOOT-Taste. Wenn das Passwort verloren geht, schreiben Sie die SD-Karte neu und erstellen Sie ein neues Konto.',
        change1: 'Bitte beachten Sie, dass diese Aktion folgende Passwörter ändert:',
        change2: 'Web Anmelde-Passwort',
        change3: 'System-Root-Passwort für die SSH-Anmeldung'
      },
      placeholderCurrentPassword: 'Aktuelles Passwort',
      placeholderNewPassword: 'Neues Passwort',
      wrongCurrentPassword: 'Das aktuelle Passwort ist falsch',
      totp: {
        title: 'Zwei-Faktor-Authentifizierung',
        prompt: 'Geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein',
        backupPrompt: 'Geben Sie einen Ihrer Backup-Codes ein',
        noEmptyCode: 'Code eingeben',
        placeholderCode: '6-stelliger Code',
        placeholderBackup: 'Backup-Code',
        verifyButtonText: 'Bestätigen',
        useBackupCode: 'Backup-Code verwenden',
        useAuthenticator: 'Code der Authenticator-App verwenden',
        cancel: 'Zurück',
        invalidCode: 'Dieser Code ist ungültig. Versuche es erneut.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Wi-Fi Konfiguration für NanoKVM',
      success:
        'Bitte überprüfen Sie den Netzwerk-Status des NanoKVM und greifen Sie über die neue IP Adresse darauf zu',
      failed: 'Aktion fehlgeschlagen, bitte erneut versuchen',
      invalidMode:
        'Der aktuelle Modus unterstützt keine Netzwerkeinrichtung. Bitte gehen Sie zu Ihrem Gerät und aktivieren Sie den Wi-Fi-Konfigurationsmodus.',
      confirmBtn: 'Ok',
      finishBtn: 'Fertig',
      ap: {
        authTitle: 'Authentifizierung erforderlich',
        authDescription: 'Bitte geben Sie das AP-Passwort ein, um fortzufahren',
        authFailed: 'Ungültiges AP Passwort',
        passPlaceholder: 'AP-Passwort',
        verifyBtn: 'Überprüfen'
      }
    },
    screen: {
      scale: 'Skala',
      size: 'Größe',
      sizeFill: 'Fenster füllen',
      sizeNative: 'Originalgröße',
      title: 'Bildschirm',
      video: 'Videomodus',
      videoDirectTips:
        'Aktivieren Sie HTTPS unter „Einstellungen > Netzwerk > Dienste“, um diesen Modus zu verwenden',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC ist in den Firewall-Modi Eingeschränkt und Paranoid deaktiviert',
      transferRunningTitle: 'Image-Übertragung läuft',
      transferRunningDesc:
        'Beim Wechsel des Videomodus wird die Seite neu geladen, wodurch der laufende Image-Upload oder -Download abgebrochen wird.',
      transferRunningOk: 'Modus wechseln',
      resolution: 'Auflösung',
      auto: 'Automatisch',
      autoTips:
        'Bei bestimmten Auflösungen können Bildverzerrungen oder ein versetzter Mauszeiger auftreten, passen Sie daher die Auflösung des entfernten Hosts an oder deaktivieren Sie den automatischen Modus',
      fps: 'FPS',
      customizeFps: 'Anpassen',
      quality: 'Qualität',
      qualityLossless: 'Verlustfrei',
      qualityHigh: 'Hoch',
      qualityMedium: 'Mittel',
      qualityLow: 'Niedrig',
      frameDetect: 'Änderungserkennung',
      frameDetectTip:
        'Vergleicht die Einzelbilder und beendet die Videoübertragung, solange sich der Bildschirm des Hosts nicht ändert',
      resetHdmi: 'HDMI zurücksetzen',
      webrtcConnectionFailed: {
        title: 'WebRTC-Verbindung fehlgeschlagen',
        description: 'Überprüfen Sie die Netzwerkverbindung oder wechseln Sie den Videomodus'
      },
      captureStatus: {
        hdmiError: 'HDMI-Bildschirmfehler',
        unsupportedResolution: 'Die aktuelle Auflösung wird nicht unterstützt',
        retrieving: 'Bildschirm wird abgerufen...',
        changingResolution: 'Auflösung wird gewechselt...',
        updateFailed: 'Der Bildschirm kann derzeit nicht aktualisiert werden',
        videoError: 'Fehler bei der Videoanzeige',
        noHdmi: 'Kein HDMI-Signal erkannt',
        unavailable: 'Der Bildschirm kann derzeit nicht angezeigt werden'
      }
    },
    keyboard: {
      title: 'Tastatur',
      paste: 'Einfügen',
      tips: 'Nur Standardbuchstaben und -symbole der Tastatur werden unterstützt',
      placeholder: 'Einzufügender Text',
      local: 'Mobile Tastatur',
      virtual: 'Bildschirmtastatur',
      readClipboard: 'Aus der Zwischenablage lesen',
      clipboardPermissionDenied:
        'Berechtigung für die Zwischenablage verweigert, erlauben Sie den Zugriff in Ihrem Browser',
      clipboardReadError: 'Zwischenablage konnte nicht gelesen werden',
      dropdownEnglish: 'Englisch',
      dropdownGerman: 'Deutsch',
      dropdownFrench: 'Französisch',
      dropdownRussian: 'Russisch',
      dropdownKorean: 'Koreanisch',
      dropdownJapanese: 'Japanisch',
      localInput: 'Eingabe über die Mobiltastatur',
      shortcut: {
        title: 'Tastenkombinationen',
        custom: 'Benutzerdefiniert',
        capture: 'Klicken Sie hier, um die Verknüpfung zu erfassen',
        clear: 'Löschen',
        save: 'Speichern',
        captureTips:
          'Das Erfassen systemweiter Tasten, z. B. der Windows-Taste, erfordert die Vollbildberechtigung',
        enterFullScreen: 'Vollbildmodus umschalten'
      },
      leaderKey: {
        title: 'Leader-Taste',
        desc: 'Browserbeschränkungen umgehen und Systemverknüpfungen direkt an den Remote-Host senden',
        howToUse: 'Verwendung',
        simultaneous: {
          title: 'Simultanmodus',
          desc1: 'Halten Sie die Leader-Taste gedrückt und drücken Sie dann die Tastenkombination.',
          desc2: 'Intuitiv, kann jedoch zu Konflikten mit Systemverknüpfungen führen.'
        },
        sequential: {
          title: 'Sequenzieller Modus',
          desc1:
            'Drücken Sie die Leader-Taste → drücken Sie die Tastenkombination nacheinander → drücken Sie erneut die Leader-Taste.',
          desc2: 'Erfordert mehr Schritte, vermeidet jedoch vollständig Systemkonflikte.'
        },
        enable: 'Leader-Taste aktivieren',
        tip: 'Wenn diese Taste als Leader-Taste zugewiesen wird, dient sie ausschließlich als Auslöser für Tastenkombinationen und verliert ihr Standardverhalten.',
        placeholder: 'Drücken Sie die Leader-Taste',
        shiftRight: 'Rechts Shift',
        ctrlRight: 'Rechts Ctrl',
        metaRight: 'Rechts Win',
        recorder: {
          rec: 'REC',
          activate: 'Tasten aktivieren',
          input: 'Drücken Sie die Tastenkombination'
        }
      }
    },
    mouse: {
      title: 'Maus',
      cursor: 'Cursor',
      default: 'Standard Cursor',
      cell: 'Zellen Cursor',
      text: 'Text Cursor',
      grab: 'Greif Cursor',
      hide: 'Cursor ausblenden',
      mode: 'Maus Modus',
      absolute: 'Absoluter Modus',
      relative: 'Relativer Modus',
      direction: 'Scrollrichtung',
      scrollUp: 'Nach oben scrollen',
      scrollDown: 'Nach unten scrollen',
      speed: 'Scrollgeschwindigkeit',
      sensitivity: 'Zeigergeschwindigkeit',
      sensitivityDesc:
        'Für den relativen Desktopmodus: niedrigere Werte verringern Drift durch die Mausbeschleunigung des Hosts',
      fast: 'Schnell',
      slow: 'Langsam',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Bewegen Sie den Finger überall im KVM-Bereich; der Remote-Cursor behält seine Position zwischen Berührungen und bleibt mit absolutem HID synchron'
      },
      requestPointer:
        'Relativer Modus aktiv, klicken Sie auf den Desktop, um den Mauszeiger zu sehen',
      resetHid: 'HID zurücksetzen',
      hidOnly: {
        title: 'HID-Only-Modus',
        desc: 'Wenn Maus oder Tastatur nicht mehr reagieren und ein Zurücksetzen von HID nicht hilft, kann ein Kompatibilitätsproblem zwischen dem NanoKVM und dem Host vorliegen.',
        tip1: 'Beim Aktivieren des HID-Only-Modus werden die virtuelle Festplatte und das virtuelle Netzwerk getrennt',
        tip2: 'Im HID-Only-Modus ist das Einbinden von Images deaktiviert',
        tip3: 'NanoKVM wird nach dem Wechsel in den neuen Modus automatisch neu gestartet',
        enable: 'HID-Only-Modus aktivieren',
        disable: 'HID-Only-Modus deaktivieren'
      }
    },
    image: {
      title: 'Bilder',
      loading: 'Lädt...',
      empty: 'Nichts gefunden',
      mountMode: 'Einbinden als',
      mount: 'Einbinden',
      orDownload: 'Oder von einem Link herunterladen',
      keepRunning:
        'Sie können dieses Fenster schließen. Die Übertragung läuft weiter, und der Fortschritt erscheint in der Bilderliste.',
      massStorage: 'Massenspeicher',
      cdRom: 'CD-ROM',
      mountFailed: 'Einbinden fehlgeschlagen',
      mountDesc:
        'In einigen Systemen ist es notwendig, die virtuelle Festplatte auf dem entfernten Host auszuwerfen, bevor das Image eingebunden werden kann',
      diskOnWarn:
        'Beim Einbinden des Images wird das virtuelle Laufwerk ausgeschaltet, sodass der Computer nicht mehr auf /data zugreifen kann. Fortfahren?',
      diskOffWarn:
        'Das virtuelle Laufwerk ist ausgeschaltet und muss zum Einbinden des Images aktiviert werden. Die USB-Geräte am Computer werden neu erkannt. Fortfahren?',
      unmountFailed: 'Aushängen fehlgeschlagen',
      unmountDesc:
        'Auf einigen Systemen müssen Sie das Image manuell vom Remote-Host auswerfen, bevor Sie die Bereitstellung aufheben',
      forceEject: 'Auswerfen erzwingen',
      forceEjectConfirm:
        'Der Host hat das optische Laufwerk gesperrt. Beim erzwungenen Auswerfen wird das virtuelle USB-Gerät kurz getrennt, sodass Tastatur und Maus kurzzeitig ausfallen können. Fortfahren?',
      usbReconnect: 'USB neu verbinden',
      usbReconnectConfirm:
        'USB-Gadget nur neu verbinden, wenn der Remote-Host den Medienwechsel nicht erkannt hat. Tastatur und Maus können kurz getrennt werden.',
      usbReconnectSuccess: 'USB neu verbunden',
      usbReconnectFailed: 'USB-Neuverbindung fehlgeschlagen',
      addImage: 'Bild hinzufügen',
      fromUrl: 'Von URL',
      fromFile: 'Aus Datei',
      turnOff: 'Ausschalten',
      deleteDiskShared:
        'Abbilder können nicht gelöscht werden, solange das virtuelle Laufwerk eingeschaltet ist.',
      eject: 'Auswerfen',
      download: 'Herunterladen',
      upload: 'Hochladen',
      mountTitle: 'Bild einbinden',
      deleteTitle: 'Bild löschen',
      deleteConfirm: 'Sind Sie sicher, dass Sie dieses Bild löschen möchten?',
      tips: {
        title: 'So laden Sie Dateien hoch',
        usb1: 'Verbinden Sie den NanoKVM über USB mit Ihrem Computer.',
        usb2: 'Stellen Sie sicher, dass die virtuelle Festplatte unter Einstellungen > Gerät > Virtuelle Festplatte eingebunden ist.',
        usb3: 'Öffnen Sie die virtuelle Festplatte auf Ihrem Computer und kopieren Sie die Image-Datei in das Stammverzeichnis der virtuellen Festplatte.',
        scp1: 'Stellen Sie sicher, dass sich der NanoKVM und Ihr Computer im selben lokalen Netzwerk befinden.',
        scp2: 'Öffnen Sie ein Terminal auf Ihrem Computer und verwenden Sie den SCP-Befehl, um die Image-Datei in das Verzeichnis /data auf dem NanoKVM hochzuladen.',
        scp3: 'Beispiel: scp your-image-path root@your-nanokvm-ip:/data',
        tfCard: 'SD-Karte',
        tf1: 'Diese Methode wird unter Linux-Systemen unterstützt',
        tf2: 'Entnehmen Sie die SD-Karte aus dem NanoKVM. Bei der FULL-Version muss zuvor das Gehäuse geöffnet werden.',
        tf3: 'Stecken Sie die SD-Karte in einen Kartenleser und verbinden Sie diesen mit Ihrem Computer.',
        tf4: 'Kopieren Sie die Image-Datei in das Verzeichnis /data auf der SD-Karte.',
        tf5: 'Setzen Sie die SD-Karte wieder in den NanoKVM ein.'
      }
    },
    script: {
      title: 'Skripte',
      upload: 'Hochladen',
      run: 'Ausführen',
      runBackground: 'Im Hintergrund ausführen',
      runFailed: 'Ausführung fehlgeschlagen',
      delDesc: 'Möchten Sie diese Datei wirklich löschen?',
      delete: 'Löschen',
      close: 'Schliessen',
      unlockDesc:
        'Skripte laufen auf dem NanoKVM als root. Geben Sie das Passwort des Webkontos ein, um ein Skript zu ersetzen oder auszuführen.',
      unreviewedTitle: 'Ungeprüftes Skript',
      unreviewedDesc:
        'Dieses Skript ist neu oder wurde seit der letzten Ausführung ersetzt. Jeder mit Ihrer Sitzung könnte es hochgeladen haben. Sehen Sie es sich daher im Terminal an, bevor Sie es als root ausführen.',
      terminalRequired:
        'Skripte benötigen Zugriff auf das Web-Terminal. Aktivieren Sie zuerst das Terminal in den Einstellungen.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'NanoKVM Terminal',
      serial: 'Serieller Anschluss Terminal',
      unlockTitle: 'Terminal entsperren',
      unlockDesc: 'Geben Sie das Passwort Ihres Webkontos ein, um eine Terminalsitzung zu starten',
      unlock: 'Entsperren',
      unlockFailed: 'Terminal konnte nicht entsperrt werden',
      invalidCredentials: 'Ungültiger Benutzername oder Passwort',
      locked: 'Zu viele Versuche, versuchen Sie es später erneut',
      sessionClosed: 'Terminalsitzung geschlossen. Zum erneuten Verbinden wieder entsperren.',
      sessionError: 'Terminalverbindung fehlgeschlagen. Zum erneuten Versuch wieder entsperren.',
      serialPort: 'Serieller Anschluss',
      serialPortPlaceholder: 'Zum Beispiel /dev/ttyS1',
      baudrate: 'Baudrate',
      parity: 'Parität',
      parityNone: 'Keine',
      parityEven: 'Gerade',
      parityOdd: 'Ungerade',
      flowControl: 'Fluss-Kontrolle',
      flowControlNone: 'Keine',
      flowControlSoft: 'Software',
      flowControlHard: 'Hardware',
      dataBits: 'Daten bits',
      stopBits: 'Stopp bits',
      open: 'Terminal öffnen'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Sende Befehl...',
      sent: 'Befehl gesendet',
      input: 'MAC-Adresse',
      ok: 'OK'
    },
    download: {
      input: 'URL des Remote-Images',
      ok: 'OK',
      disabled:
        'Images können derzeit weder heruntergeladen noch hochgeladen werden, da der Speicher nicht beschreibbar ist. Wenn ein Image eingebunden ist, binden Sie es aus und schalten Sie dann die virtuelle Festplatte aus, damit der Speicher wieder beschreibbar ist.',
      diskShared: 'Schalten Sie das virtuelle Laufwerk aus, um den Abbild-Download zu nutzen',
      mountedImage:
        'Dieses Image ist eingebunden, heben Sie die Einbindung auf, bevor Sie eine Datei mit demselben Namen hochladen',
      diskOff: 'Virtuelles Laufwerk ausschalten',
      uploadbox: 'Datei hier ablegen oder klicken zum Auswählen',
      inputfile: 'Image-Datei',
      NoISO: 'Kein Image',
      complete: 'Download abgeschlossen',
      uploadComplete: 'Upload abgeschlossen',
      downloading: 'Wird heruntergeladen',
      uploading: 'Wird hochgeladen',
      failed: 'Übertragung fehlgeschlagen',
      uploadFailed: 'Upload fehlgeschlagen',
      stalled: 'Übertragung hängt, Verbindung prüfen und erneut versuchen',
      canceled: 'Upload abgebrochen',
      downloadCanceled: 'Download abgebrochen',
      cancel: 'Abbrechen',
      remoteDisabled:
        'Remote-ISO-Download ist unter Einstellungen > Benutzer > Voreinstellungen deaktiviert',
      remoteFailed: 'Remote-ISO-Download fehlgeschlagen',
      sha256: 'Optionale SHA-256-Prüfsumme',
      sha256Placeholder: 'Geben Sie eine 64-stellige SHA-256-Prüfsumme ein',
      invalidSHA256: 'SHA-256 muss eine 64-stellige Hexadezimalzeichenfolge sein',
      checksumFailed: 'Download fehlgeschlagen: SHA-256-Prüfung fehlgeschlagen'
    },
    power: {
      title: 'Power',
      showConfirm: 'Bestätigung',
      showConfirmTip: 'Diese Aktionen benötigen eine zusätzliche Bestätigung',
      reset: 'Zurücksetzen',
      powerShort: 'Power-Taste: kurzer Klick',
      powerLong: 'Power-Taste: langer Klick',
      resetConfirm: 'Reset-Aktion durchführen?',
      powerConfirm: 'Power-Aktion durchführen?',
      okBtn: 'Ja',
      cancelBtn: 'Nein'
    },
    settings: {
      title: 'Einstellungen',
      about: {
        title: 'Über',
        information: 'Informationen',
        ip: 'IP-Adresse',
        mdns: 'Lokale Adresse',
        application: 'Applikations-Version',
        uptime: 'Laufzeit',
        community: 'Community',
        credit: 'Basiert auf <a1>NanoKVM</a1> von Sipeed und <a2>Hardened NanoKVM</a2> von woffko',
        hostname: 'Gerätename',
        changeIn: 'Änderbar unter {{path}}',
        updateIn: 'Aktualisierbar unter {{path}}',
        toggleIn: 'Ein- oder ausschaltbar unter {{path}}'
      },
      appearance: {
        title: 'Voreinstellungen',
        display: 'Bildschirm',
        language: 'Sprache',
        languageDesc: 'Wählen Sie die Sprache für die Benutzeroberfläche aus',
        webTitle: 'Webtitel',
        webTitleDesc: 'Passen Sie den Web-Seite Titel an',
        layoutMode: 'Oberflächenlayout',
        layoutModeDesc: 'Smartphone-/Touch-Layout in diesem Browser verwenden',
        layoutAuto: 'Automatisch',
        layoutMobile: 'Smartphone',
        menuBar: {
          title: 'Menüleiste',
          mode: 'Anzeigemodus',
          modeDesc: 'Menüleiste auf dem Bildschirm anzeigen',
          modeOff: 'Aus',
          modeAuto: 'Automatisch ausblenden',
          modeAlways: 'Immer sichtbar',
          keyboardLedStatus: 'Tastensperren-Anzeigen',
          keyboardLedStatusDesc:
            'Num-Lock-, Feststell- und Rollen-Status des Remote-Computers anzeigen',
          icons: 'Untermenüsymbole',
          iconsDesc: 'Untermenüsymbole in der Menüleiste anzeigen',
          terminalWarningTitle: 'Webterminal aktivieren?',
          terminalWarningDesc:
            'Das Terminal öffnet eine Root-Shell im Browser. Nur in einem vertrauenswürdigen Netzwerk aktivieren und danach wieder ausschalten.',
          terminalWarningConfirm: 'Aktivieren',
          remoteDownload: 'Remote-ISO herunterladen',
          remoteDownloadWarningTitle: 'Remote-ISO-Download aktivieren?',
          remoteDownloadWarningDesc:
            'NanoKVM lädt eine ISO von einer URL und schreibt sie nach /data. Nur für vertrauenswürdige URLs aktivieren und danach wieder ausschalten.',
          remoteDownloadWarningConfirm: 'Aktivieren'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Tastensperren-Status der Remote-Tastatur',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num-Taste',
        numLockShort: 'Num',
        capsLock: 'Feststelltaste',
        capsLockShort: 'Fest',
        scrollLock: 'Rollen-Taste',
        scrollLockShort: 'Roll',
        on: 'Ein',
        off: 'Aus',
        unknown: 'Unbekannt'
      },
      device: {
        title: 'Gerät',
        minutes: 'Min.',
        sections: {
          general: 'Allgemein',
          connectivity: 'Konnektivität',
          hostConnection: 'Host-Verbindung',
          inputOutput: 'Eingabe und Ausgabe'
        },
        oled: {
          title: 'OLED-Timeout',
          description: 'OLED-Bildschirm ausschalten nach',
          keepOn: 'OLED eingeschaltet lassen',
          keepOnDescription: 'Den OLED-Bildschirm nie ausschalten'
        },
        ssh: {
          description: 'Entfernten SSH-Zugang aktivieren',
          tip: 'Legen Sie unter Konto > Passwort ein starkes Passwort fest, bevor Sie diese Option aktivieren'
        },
        swap: {
          title: 'Swap',
          description: 'Eine Swap-Datei nutzen, wenn der Speicher knapp wird',
          size: 'Swap-Größe',
          sizeDescription: 'Grösse der Swap-Datei festlegen',
          tip: 'Das Aktivieren dieser Funktion kann die Lebensdauer Ihrer SD-Karte verkürzen'
        },
        mouseJiggler: {
          title: 'Mausaktivitäts-Simulator',
          description: 'Verhindert, dass der remote Host in den Energiesparmodus wechselt',
          disable: 'Deaktivieren',
          absolute: 'Absoluter Modus',
          relative: 'Relativer Modus'
        },
        sessionLock: {
          title: 'Sitzung bei Inaktivität sperren',
          description: 'Nach dieser Zeit erneut Login verlangen'
        },
        mdns: {
          description: 'mDNS-Erkennungsdienst aktivieren',
          tip: 'Ermöglicht den Zugriff auf dieses Gerät über seinen .local-Namen. Nicht nötig, wenn Sie sich per IP-Adresse verbinden oder Ihr DNS den Hostnamen bereits auflöst.'
        },
        hdmi: {
          description: 'HDMI/Monitor-Ausgabe aktivieren',
          idleTimeoutTitle: 'Zeitlimit für inaktive Aufnahme',
          idleTimeoutDescription:
            'HDMI-Aufnahme stoppen, wenn keine aktiven Zuschauer vorhanden sind für'
        },
        hidOnly: 'HID-Only-Modus',
        hidOnlyDesc:
          'Verbessert die Kompatibilität mit dem Host, wenn Maus oder Tastatur nicht mehr reagieren',
        hidOnlyTip:
          'Der HID-Only-Modus beendet die Emulation virtueller Geräte und behält nur die grundlegende HID-Steuerung bei',
        disk: 'Virtuelle Festplatte',
        diskDesc: 'SD-Karte am entfernten Host einbinden',
        diskLocked:
          'Aus, solange ein Image eingebunden ist, und Einschalten bricht die Einbindung ab',
        diskEnable: 'Virtuelle Festplatte aktivieren',
        networkChange: 'Virtuelles Netzwerk ändern',
        diskCancelMount:
          'Das Aktivieren der virtuellen Festplatte bricht das eingebundene Image ab. Fortfahren?',
        networkCancelMount:
          'Das Ändern des virtuellen Netzwerks startet die USB-Verbindung neu. Dadurch wird das eingebundene Image abgebrochen und die virtuelle Festplatte aktiviert. Fortfahren?',
        diskTransferRunning:
          'Eine Image-Übertragung läuft. Warten Sie, bis sie beendet ist, bevor Sie die virtuelle Festplatte aktivieren.',
        network: 'Virtuelles Netzwerk',
        networkDesc: 'Virtuelle Netzwerkkarte an den entfernten Host binden',
        usbWakeup: 'USB-Aufwecken',
        usbWakeupDesc: 'Erlaubt Tastatur- oder Mausereignissen, den Remote-Host aufzuwecken',
        usbWakeupTip: 'Ausschalten, wenn der Host wiederholt USB-Wakeup-Meldungen protokolliert',
        hostname: {
          description: 'Name dieses Geräts im Netzwerk',
          reachable: 'Im lokalen Netzwerk erreichbar als {{address}}'
        },
        rebootRequired: 'Neustart erforderlich',
        rebootPending: 'Neustart erforderlich für: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Systemupdate'
        },
        reboot: 'Neustarten',
        rebootDesc: 'Sind Sie sicher dass Sie NanoKVM neustarten möchten?',
        poweroff: 'Ausschalten',
        poweroffDesc: 'Möchten Sie NanoKVM wirklich ausschalten?'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Verbindung',
        configuration: 'Konfiguration',
        wifi: {
          title: 'Wi-Fi',
          description: 'Wi-Fi konfigurieren',
          apMode: 'AP-Modus ist aktiviert, verbinden Sie sich per QR-Code mit dem Wi-Fi',
          connect: 'Wi-Fi verbinden',
          connectDesc1: 'Bitte geben Sie die Netzwerk-SSID und das Passwort ein',
          disconnect: 'Möchten Sie die Netzwerkverbindung wirklich trennen?',
          disconnectBtn: 'Trennen',
          connected: 'Verbunden',
          ssid: 'Name',
          password: 'Passwort',
          joinBtn: 'Verbinden',
          cancelBtn: 'Abbrechen'
        },
        tls: {
          description: 'HTTPS-Protokoll aktivieren',
          tip: 'Hinweis: Die Verwendung von HTTPS kann die Latenz erhöhen, besonders im MJPEG-Videomodus',
          restartTitle: 'Der Server wird neu gestartet',
          restartDesc:
            'Die Protokolländerung startet den Server neu. Der Browser wechselt nach {{seconds}} Sekunden zur neuen Adresse:',
          restartOk: 'Übernehmen und neu starten',
          confirmTitle: 'Neues Protokoll beibehalten?',
          confirmDesc:
            'Der Server läuft jetzt mit {{protocol}}. Ohne Bestätigung kehrt er in {{seconds}} Sekunden zum vorherigen Protokoll zurück.',
          confirmKeep: 'Beibehalten',
          confirmRevert: 'Zurück',
          reverting:
            'Zurück zum vorherigen Protokoll. Der Browser wechselt nach {{seconds}} Sekunden zu dieser Adresse.',
          certTitle: 'Neues Zertifikat beibehalten?',
          certDesc:
            'Der Server verwendet jetzt das neue Zertifikat. Er kehrt in {{seconds}} Sekunden zum vorherigen zurück, wenn Sie es nicht beibehalten.',
          certReverted: 'Das vorherige Zertifikat ist wieder aktiv'
        },
        trustedProxies: {
          section: 'Reverse-Proxy',
          title: 'Vertrauenswürdige Proxys',
          description:
            'Reverse-Proxys, denen das Gerät bei Adresse und Protokoll des Clients vertraut',
          tip: 'Eine gelistete Adresse bestimmt die Client-Adresse, die Anmeldesperre und Protokoll erfassen, also nur Proxys eintragen, die Sie selbst betreiben',
          none: 'Keine',
          edit: 'Bearbeiten',
          editRow: 'Liste bearbeiten',
          editTitle: 'Vertrauenswürdige Proxys bearbeiten',
          editDescription: 'Zum Ändern der Liste ist Ihr Passwort nötig',
          dialogDescription:
            'Geben Sie die Adresse jedes Reverse-Proxys so ein, wie dieses Gerät sie sieht, oder einen Bereich wie 10.0.0.0/24. Ein gelisteter Proxy teilt dem Gerät mit, welche Client-Adresse und welches Protokoll gelten. Alles, was er weiterleitet, wird geglaubt, also nur Proxys eintragen, die Sie selbst betreiben.'
        },
        certificate: {
          title: 'Zertifikat',
          desc: 'Woher das HTTPS-Zertifikat stammt',
          requesting: 'Zertifikat wird angefordert',
          selfSigned: 'Selbstsigniert',
          domain: 'Domain',
          domainDesc:
            'Muss auf dieses Gerät zeigen, und Port 443 muss aus dem Internet erreichbar sein',
          domainTailscale: 'Von Tailscale für dieses Gerät festgelegt',
          domainInvalid: 'Vollständigen Domainnamen verwenden, zum Beispiel kvm.example.org',
          email: 'E-Mail',
          emailDesc: "Optional, für Hinweise von Let's Encrypt",
          emailInvalid: 'Adresse wie name@example.org verwenden',
          validUntil: 'Gültig bis',
          valid: 'Gültig',
          expiresSoon: 'Läuft bald ab',
          expired: 'Abgelaufen',
          lastRenewal: 'Letzte Erneuerung',
          renewed: 'Erneuert',
          failed: 'Fehlgeschlagen',
          renewNow: 'Jetzt erneuern',
          renewNowDesc: 'Neues Zertifikat ohne Warten anfordern',
          renewBtn: 'Erneuern',
          applyTitle: 'Zertifikat ändern',
          applyOk: 'Anwenden',
          applyAcme:
            "Das Gerät fordert bei Let's Encrypt ein Zertifikat an. Let's Encrypt verbindet sich zur Prüfung aus dem Internet mit Port 443, was bis zu einer Minute dauern kann. Schlägt die Anfrage fehl, bleibt das aktuelle Zertifikat in Gebrauch.",
          applyTailscale:
            'Das Gerät holt ein Zertifikat von Tailscale, was bis zu einer Minute dauern kann. Schlägt die Anfrage fehl, bleibt das aktuelle Zertifikat in Gebrauch.',
          applySelfSigned:
            'Das Gerät kehrt zu seinem eigenen selbstsignierten Zertifikat zurück. Browser warnen davor.',
          openTitle: 'Neue Adresse öffnen',
          openDesc:
            'Das Zertifikat ist bereit. Öffnen Sie die Adresse unten und melden Sie sich an, um es beizubehalten. Ohne Ihre Bestätigung innerhalb von 3 Minuten kehrt das vorherige Zertifikat zurück.',
          openOk: 'Öffnen',
          blockedClock:
            'Zertifikate können erst angefordert werden, wenn die Gerätezeit synchronisiert ist',
          blockedParanoid: 'Der Firewallmodus Paranoid blockiert Zertifikatsanfragen',
          tailscaleUnavailable:
            'Tailscale läuft nicht, oder HTTPS-Zertifikate sind für das Tailnet nicht aktiviert'
        },
        dns: {
          title: 'DNS',
          description: 'DNS-Server für NanoKVM konfigurieren',
          ipv4Title: 'IPv4',
          ipv4Description: 'IPv4-Adressierung für die kabelgebundene Schnittstelle konfigurieren',
          servers: 'Server',
          dhcp: 'DHCP',
          manual: 'Manuell',
          apply: 'Übernehmen',
          invalid: 'Bitte eine gültige IPv4- oder IPv6-Adresse eingeben',
          invalidNetwork: 'Bitte eine gültige IPv4-Adresse, Subnetzmaske und Router eingeben',
          saved: 'DNS-Einstellungen gespeichert',
          redirecting: 'Netzwerkeinstellungen gespeichert. Neue Adresse wird geöffnet...',
          saveFailed: 'DNS-Einstellungen konnten nicht gespeichert werden',
          unsaved: 'Ungespeicherte Änderungen',
          maxServers: 'Maximal {{count}} DNS-Server erlaubt',
          dhcpServersDescription: 'DNS-Server werden automatisch per DHCP bezogen',
          manualServersDescription: 'IPv4- und IPv6-Server werden unterstützt',
          interface: 'Schnittstelle',
          ipAddress: 'IP-Adresse',
          subnetMask: 'Subnetzmaske',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'IPv6-Adressierung für die kabelgebundene Schnittstelle konfigurieren',
          disabled: 'Deaktiviert',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manuell',
          interface: 'Schnittstelle',
          state: 'Status',
          router: 'Router',
          addresses: 'Adressen',
          dhcpv6Client: 'DHCPv6-Client',
          notInstalled: 'Nicht installiert',
          ipAddress: 'IPv6-Adresse',
          prefix: 'Präfix',
          invalidManual: 'Bitte eine gültige IPv6-Adresse, ein Präfix und einen Router eingeben',
          clientMissing:
            'Der DHCPv6-Client ist nicht installiert. Installieren Sie zuerst das passende Raw-Systemupdate.',
          saved: 'IPv6-Einstellungen gespeichert',
          saveFailed: 'IPv6-Einstellungen konnten nicht gespeichert werden',
          unsaved: 'Ungespeicherte Änderungen'
        }
      },
      system: {
        title: 'System',
        performance: {
          processor: 'Prozessor',
          overdrive: {
            title: 'Übertaktung',
            description:
              'Mit den höheren, vom Hersteller spezifizierten Prozessor- und Videotaktraten starten',
            tip: 'Startet das Gerät mit Übertaktung nicht, muss die SD-Karte neu beschrieben werden',
            unavailable: 'Nicht in diesem Systemabbild enthalten',
            keepTitle: 'Overdrive nach Updates beibehalten',
            keepDescription:
              'Ein Systemupdate setzt das Gerät auf die Standardtakte zurück, sofern dies nicht aktiviert ist',
            confirmTitle: 'Übertaktung aktivieren?',
            confirmText:
              'Startet das Gerät mit Übertaktung nicht, müssen Sie die SD-Karte neu beschreiben, um es wiederherzustellen. Die Änderung gilt nach dem nächsten Neustart.',
            confirmOk: 'Aktivieren'
          },
          watchdog: {
            title: 'Hardware-Watchdog',
            description: 'Das Gerät automatisch neu starten, wenn es nicht mehr reagiert',
            unavailable: 'Nicht in diesem Systemabbild enthalten',
            notRunning: 'Läuft momentan nicht',
            lastRestart: 'Letzter Neustart',
            lastRestartCaption: 'Letzter Grund, warum das System neu gestartet wurde',
            reasonPowerOn: 'Einschalten',
            reasonRestart: 'Neustart angefordert',
            reasonWatchdog: 'Watchdog-Reset',
            reasonOverheat: 'Überhitzungsschutz',
            reasonUnknown: 'Unbekannt'
          },
          recovery: 'Wiederherstellung',
          memory: 'Arbeitsspeicher'
        },
        monitor: {
          processorClock: 'CPU-Subsystem',
          videoClock: 'Video-Subsystem',
          videoClockCaption: 'Video-Taktfrequenz',
          cpuClockCaption: 'CPU-Taktfrequenz',
          overdrive: 'Übertaktet',
          temperature: 'Temperatur',
          lastMinutes: 'Letzte 5 Minuten',
          ram: 'RAM',
          off: 'Aus',
          ramHistory: 'RAM-Auslastung',
          cpuLoad: 'CPU-Last',
          cpuLoadCaption: 'Benutzer {{user}} Prozent, System {{system}} Prozent',
          cpuUtilization: 'CPU-Auslastung',
          swapUtilization: 'Swap-Auslastung',
          swapSizeLastMinutes: '{{size}}, letzte 5 Minuten',
          percent: '{{percent}} Prozent',
          percentUsed: '{{percent}} Prozent belegt',
          sizeOf: '{{used}} von {{total}}',
          systemPartition: 'Systempartition',
          dataPartition: 'Datenpartition',
          unavailable: 'Nicht verfügbar',
          noReadings: 'Das Gerät liefert keine Messwerte',
          refresh: 'Wird jede Sekunde aktualisiert, solange diese Seite geöffnet ist'
        },
        sections: {
          time: 'Zeit',
          firewall: 'Firewall',
          systemLog: 'Protokollierung',
          performance: 'Leistung',
          monitor: 'Überwachung',
          services: 'Dienste',
          webInterface: 'Sicherer Webzugang'
        },
        time: {
          saveFailed: 'Zeiteinstellungen konnten nicht gespeichert werden',
          saved: 'Zeiteinstellungen gespeichert',
          syncFailed: 'Zeitsynchronisierung fehlgeschlagen',
          synced: 'Zeit synchronisiert',
          invalidServers: 'Mindestens einen NTP-Server eingeben',
          maxServers: 'Maximal {{count}} NTP-Server erlaubt',
          refresh: 'Aktualisieren',
          syncNow: 'Synchronisieren',
          syncNowDesc: 'Die Uhr jetzt mit den NTP-Servern abgleichen',
          save: 'Speichern',
          ntp: {
            title: 'NTP',
            description: 'Gerätezeit mit konfigurierten NTP-Servern synchronisieren'
          },
          networkTime: 'Netzwerkzeit',
          clock: {
            title: 'Uhr',
            description: 'Lokale Zeitzone für Protokolle und Benutzeroberfläche festlegen',
            current: 'Aktuelle Zeit',
            timezone: 'Zeitzone'
          },
          servers: {
            title: 'NTP-Server',
            description:
              'Öffentliche Standardserver, den lokalen Router oder eigene NTP-Server verwenden',
            useRouter: 'Router verwenden',
            useDefaults: 'Standardwerte verwenden',
            presets: 'Server-Voreinstellungen',
            presetsDesc: 'Serverliste durch eine Voreinstellung ersetzen'
          }
        },
        firewall: {
          saveFailed: 'Firewall-Einstellungen konnten nicht angewendet werden',
          saved: 'Firewall-Einstellungen angewendet',
          cancel: 'Abbrechen',
          refresh: 'Aktualisieren',
          backends: 'Backends',
          enableHttpsFirst:
            'HTTPS aktivieren, bevor der Firewall-Modus Eingeschränkt oder Paranoid aktiviert wird',
          httpsRequired:
            'Die Modi Eingeschränkt und Paranoid sind deaktiviert, bis HTTPS unter Einstellungen > Netzwerk > Dienste aktiviert wird',
          mode: {
            title: 'Firewallmodus',
            baseline: 'Basis',
            baselineDesc:
              'Offenes Kompatibilitätsprofil. Die Firewall läuft, aber eingehende Quellen werden nicht eingeschränkt. Nur in vertrauenswürdigen Netzwerken verwenden.',
            moderate: 'Moderat',
            moderateDesc:
              'Standardprofil. Behält die Basis-Dienste bei, nimmt neue eingehende Verbindungen aber nur aus privaten, Link-Local- oder Loopback-Bereichen an. Ausgehender Zugriff bleibt offen.',
            restricted: 'Eingeschränkt',
            restrictedDesc:
              'Nur lokales HTTPS und SSH sowie ausgehendes DNS, NTP, Syslog und Online-Updates. DHCP und wichtiger IPv6-Verkehr bleiben verfügbar. WebRTC ist blockiert.',
            paranoid: 'Paranoid',
            paranoidDesc:
              'Nur lokaler HTTPS-Zugriff. Blockiert SSH, HTTP, Online-Updates und andere ausgehende Netzwerkfunktionen. Das Hochladen von Offline-Updates und bereits bereitgestellte Installationen bleiben verfügbar.',
            current: 'Aktuell',
            default: 'Standard',
            localOnly: 'Nur lokal',
            openTag: 'Eingehend offen',
            httpsRequiredTag: 'HTTPS erforderlich',
            outboundOpen: 'Ausgehend offen',
            outboundLimited: 'Ausgehend eingeschränkt',
            httpsOnly: 'Nur HTTPS'
          },
          moderate: {
            apply: 'Zu Moderat wechseln'
          },
          restricted: {
            enable: 'Eingeschränkt aktivieren',
            confirmTitle: 'Firewall-Modus Eingeschränkt aktivieren?',
            confirmDesc:
              'Eingehender Adminzugriff wird für HTTPS und SSH auf private IPv4-, IPv4 link-local/loopback-, IPv6 link-local- oder IPv6 loopback-Quellbereiche begrenzt. Öffentliche Quellbereiche sind nicht erlaubt. Ausgehendes DNS, NTP, Remote-Syslog, Online-Updates, DHCP, bestehende Verbindungen und notwendiger IPv6-Steuerverkehr bleiben verfügbar. WebRTC/ICE UDP und anderer ein-/ausgehender Verkehr werden blockiert.'
          },
          paranoid: {
            enable: 'Paranoid aktivieren',
            confirmTitle: 'Firewall-Modus Paranoid aktivieren?',
            confirmDesc:
              'Nur HTTPS-Zugriff aus privaten IPv4-, IPv4 link-local/loopback-, IPv6 link-local- oder IPv6 loopback-Quellbereichen bleibt verfügbar. SSH, HTTP, mDNS, NTP, GitHub-Downloads und anderer Verkehr werden außer minimalem DHCP/IPv6-Steuerverkehr blockiert.'
          },
          baseline: {
            apply: 'Zu Basis wechseln',
            confirmTitle: 'Zum offenen Modus Basis wechseln?',
            confirmDesc:
              'Der Firewall-Dienst bleibt aktiv, aber die Beschränkung auf lokale Quellbereiche entfällt. Öffentliche Quellbereiche können exponierte NanoKVM-Dienste erreichen, wenn das Netzwerk sie weiterleitet.'
          },
          rules: {
            title: 'Aktuelle Regeln',
            empty: 'Keine Regeln'
          }
        },
        saveChanges: 'Änderungen speichern',
        unsaved: 'Ungespeicherte Änderungen'
      },
      systemLog: {
        saveFailed: 'Protokolleinstellungen konnten nicht gespeichert werden',
        saved: 'Protokolleinstellungen gespeichert',
        invalidHost: 'Syslog-Serverhost eingeben',
        logLoadFailed: 'Protokolle konnten nicht geladen werden',
        save: 'Speichern',
        test: 'Testprotokoll senden',
        testSent: 'Testprotokoll gesendet',
        testFailed: 'Testprotokoll konnte nicht gesendet werden',
        remote: {
          title: 'Remote-Protokollierung',
          forward: 'Systemprotokoll weiterleiten',
          description: 'Systemmeldungen an einen Remote-Server weiterleiten',
          host: 'Server',
          hostDesc: 'Hostname oder IPv4-Adresse des Syslog-Servers',
          port: 'Port',
          protocol: 'UDP-Port des Syslog-Servers'
        },
        local: {
          title: 'Systemprotokoll-Puffer',
          description:
            'Aktuelle Protokolle werden im RAM unter {{path}} gehalten, um Schreibzugriffe auf die SD-Karte zu vermeiden',
          priority: 'Mindestpriorität',
          priorityDesc: 'Mindestdringlichkeit, damit eine Meldung protokolliert wird',
          buffer: 'Puffergröße',
          bufferDesc: 'Protokollgröße, ab der die Datei rotiert wird',
          rotations: 'Rotationen',
          rotationsDesc: 'Anzahl der aufbewahrten rotierten Protokolldateien',
          compact: 'Kompakte Ausgabe',
          compactDesc: 'Hostname und Facility in jeder Zeile weglassen',
          stripTimestamps: 'Zeitstempel entfernen',
          stripTimestampsDesc:
            'Vom Absender hinzugefügte Zeitstempel entfernen; Syslog fügt eigene hinzu'
        },
        kernel: {
          title: 'Kernel-Protokollierung',
          enabled: 'Kernelprotokoll weiterleiten',
          enabledDesc: 'Kernel-Meldungen im Systemprotokoll erfassen',
          consoleLevel: 'Konsolenstufe',
          consoleLevelDesc:
            'Mindestdringlichkeit, damit eine Kernel-Meldung auf der Konsole ausgegeben wird'
        },
        viewer: {
          title: 'Systemprotokoll',
          refresh: 'Aktualisieren',
          empty: 'Keine Protokolleinträge',
          truncated: 'Nur die neuesten Protokolldaten werden angezeigt',
          linesUnit: 'Zeilen'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Kritisch',
          '3': '3 - Fehler',
          '4': '4 - Warnung',
          '5': '5 - Hinweis',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Alle'
        }
      },
      user: {
        title: 'Benutzer'
      },
      networking: {
        title: 'Netzwerk'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Verschlüsselter Tunnel',
        device: 'Dieses Gerät',
        description: 'Greifen Sie über einen WireGuard-Tunnel auf diesen KVM zu',
        unavailable: 'WireGuard ist auf diesem Gerät nicht installiert',
        blocked: 'Der Firewallmodus Paranoid blockiert WireGuard',
        needsKey: 'Legen Sie einen privaten Schlüssel fest, bevor Sie WireGuard einschalten',
        saved: 'WireGuard-Einstellungen gespeichert',
        save: 'Änderungen speichern',
        unsaved: 'Ungespeicherte Änderungen',
        invalid: 'Prüfen Sie die markierten Felder',
        invalidAddress: 'Geben Sie eine Adresse mit Maske ein, zum Beispiel 10.0.0.1/24',
        invalidKey: 'Geben Sie einen WireGuard-Schlüssel mit 44 Zeichen ein',
        invalidEndpoint: 'Geben Sie einen Hostnamen oder eine IP-Adresse ein',
        invalidPort: 'Geben Sie einen Port von 1 bis 65535 ein',
        invalidRanges: 'Verwenden Sie IPv4-Bereiche wie 10.0.0.0/24, nicht 0.0.0.0/0',
        status: {
          connected: 'Verbunden',
          waiting: 'Warten auf den Peer',
          stopped: 'Gestoppt',
          handshake: 'Letzter Handshake {{time}}'
        },
        privateKey: {
          title: 'Privater Schlüssel',
          description: 'Bleibt auf diesem Gerät und wird nie wieder angezeigt',
          set: 'Festgelegt',
          notSet: 'Nicht festgelegt',
          setBtn: 'Festlegen',
          generate: 'Erzeugen',
          remove: 'Entfernen',
          modalTitle: 'Privaten Schlüssel festlegen',
          modalDescription:
            'Der Schlüssel wird auf diesem Gerät gespeichert und nie wieder angezeigt',
          placeholder: 'Privaten Schlüssel einfügen',
          generateConfirmTitle: 'Neuen privaten Schlüssel erzeugen?',
          generateConfirmDesc:
            'Der aktuelle Schlüssel funktioniert dann nicht mehr. Tragen Sie anschließend den neuen öffentlichen Schlüssel beim Peer ein.',
          removeConfirmTitle: 'Privaten Schlüssel entfernen?',
          removeConfirmDesc:
            'WireGuard wird ausgeschaltet und bleibt aus, bis ein neuer Schlüssel festgelegt wird.'
        },
        publicKey: {
          title: 'Öffentlicher Schlüssel',
          description: 'Tragen Sie ihn in der Konfiguration des Peers ein'
        },
        address: {
          title: 'Adresse',
          description: 'KVM-Adresse im Tunnel und ihre Maske'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Öffentlicher Schlüssel',
          publicKeyDescription: 'Öffentlicher Schlüssel des Peers, mit dem Sie sich verbinden',
          server: 'Server',
          serverDescription: 'Hostname oder IP-Adresse des Peers',
          port: 'Port',
          portDescription: 'UDP-Port des Peers, meist 51820',
          allowedIps: 'Erlaubte IPs',
          allowedIpsDescription:
            'Adresse oder Bereich des Peers im Tunnel, zum Beispiel 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Sekunden zwischen Keepalive-Paketen, nötig hinter einem Router'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Greifen Sie über Ihr Tailscale-Netzwerk auf diesen KVM zu',
        service: 'Dienst',
        performance: 'Leistung',
        memory: {
          title: 'Speicheroptimierung',
          tip: 'Hält den Speicherverbrauch von Tailscale niedrig, was auf einem Gerät mit wenig RAM hilft. Starten Sie Tailscale neu, damit die Änderung wirksam wird.'
        },
        swap: {
          title: 'Swap-Datei',
          tip: 'Wenn die Probleme nach der Aktivierung der Speicheroptimierung weiterhin bestehen, aktivieren Sie die Swap-Datei',
          sizeTip:
            'Das setzt die Dateigröße auf 128MB; Sie können sie unter Einstellungen > System > Leistung ändern'
        },
        restartTitle: 'Tailscale neu starten',
        restartDesc: 'Startet den Dienst neu',
        restartBtn: 'Neu starten',
        restart: 'Tailscale neu starten?',
        stopTitle: 'Tailscale stoppen',
        stopBtn: 'Stoppen',
        stop: 'Tailscale stoppen?',
        stopDesc: 'Stoppt den Dienst und verhindert den Start beim Hochfahren',
        loading: 'Lädt...',
        notInstall: 'Tailscale nicht gefunden, bitte installieren',
        install: 'Installieren',
        installing: 'Installiere',
        failed: 'Installation fehlgeschlagen',
        retry: 'Bitte Seite neu laden und erneut versuchen oder manuell installieren.',
        download: 'Laden Sie das',
        package: 'Installations-Paket herunter',
        unzip: 'und entpacken Sie es',
        upTailscale: 'tailscale nach /usr/bin/ auf NanoKVM hochladen',
        upTailscaled: 'tailscaled nach /usr/sbin/ auf NanoKVM hochladen',
        refresh: 'Aktuelle Seite neu laden',
        notRunning: 'Tailscale läuft nicht. Bitte starten Sie es, um fortzufahren.',
        run: 'Start',
        notLogin:
          'Das Gerät konnte noch nicht gefunden werden. Bitte melden Sie sich an und verknüpfen Sie dieses Gerät mit Ihrem Konto.',
        urlPeriod: 'Diese URL ist für 10 Minuten gültig',
        login: 'Anmelden',
        loginSuccess: 'Anmeldung erfolgreich',
        deviceName: 'Gerätename',
        deviceIP: 'Geräte-IP',
        account: 'Konto',
        logout: 'Abmelden',
        logoutDesc: 'Möchten Sie sich wirklich abmelden?',
        uninstall: 'Tailscale deinstallieren',
        uninstallDesc: 'Sind Sie sicher, dass Sie Tailscale deinstallieren möchten?',
        okBtn: 'Ja',
        cancelBtn: 'Nein'
      },
      update: {
        title: 'Updates',
        currentVersion: 'Aktuelle Version',
        latestVersion: 'Neueste Version',
        queryFailed: 'Version konnte nicht abgefragt werden',
        updateFailed: 'Aktualisierung fehlgeschlagen',
        paranoidBlocked: 'Online-Updates werden vom Firewall-Modus Paranoid blockiert',
        paranoidBlockedDesc:
          'GitHub-Prüfungen und Downloads benötigen ausgehenden Netzwerkzugriff. Offline-Upload und bereits vorbereitete Installationen bleiben verfügbar.',
        available: 'Eine Aktualisierung ist verfügbar. Möchten sie diese jetzt durchführen?',
        updating: 'Aktualisierung gestartet',
        confirm: 'Bestätigen',
        cancel: 'Abbrechen',
        badge: {
          checking: 'Wird geprüft',
          latest: 'Aktuell',
          available: 'Update verfügbar',
          failed: 'Prüfung fehlgeschlagen',
          local: 'Lokal'
        },
        application: {
          title: 'Anwendung'
        },
        system: {
          queryFailed: 'Systemversion konnte nicht abgerufen werden',
          appUpdateRequired:
            'Aktualisieren Sie die Anwendung auf {{version}}, bevor Sie dieses Systemupdate installieren',
          requiredAppVersion: 'Erforderliche Anwendungsversion',
          downloadFailed: 'Download oder Verifizierung fehlgeschlagen',
          available: 'Ein Update für das Basissystem ist verfügbar.',
          downloading: 'Systemupdate wird heruntergeladen und verifiziert...',
          downloadVerify: 'Herunterladen und verifizieren',
          installing: 'Vorbereitetes Systemupdate wird installiert...',
          install: 'Installieren',
          installFailed: 'Installation fehlgeschlagen',
          installConfirmTitle: 'Systemupdate installieren?',
          installConfirmDesc:
            'Dies ersetzt Basissystemdateien aus dem verifizierten Paket. Ein Neustart ist erforderlich.',
          rawInstallConfirmDesc:
            'Dieses verifizierte Paket schreibt raw Boot-/Rootfs-Images auf die SD-Kartenpartitionen und startet automatisch neu. Das Schreiben kann mehrere Minuten dauern; Strom angeschlossen lassen.',
          rawInstallWarning:
            'Für raw Partitionsupdates gibt es keinen automatischen Rollback. Falls der Boot fehlschlägt, stellen Sie die SD-Karte manuell wieder her.',
          rawWaitTitle: 'Systemupdate wird installiert',
          rawWaitWriting: 'Das neue System wird auf die SD-Karte geschrieben',
          rawWaitRestarting:
            'Das Gerät startet neu. Diese Seite lädt sich neu, sobald es wieder erreichbar ist.',
          rawWaitDesc:
            'Das dauert etwa drei Minuten. Lassen Sie die Stromversorgung angeschlossen und schließen Sie diese Seite nicht.',
          rawWaitSlow:
            'Das dauert länger als erwartet. Warten Sie noch einige Minuten, bevor Sie die Stromversorgung trennen.',
          rebootRequired: 'Ein Neustart ist erforderlich, um diesen Systemzustand zu aktivieren.',
          rollingBack: 'Systemupdate wird zurückgerollt...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback vorbereitet',
          rollbackFailed: 'Rollback fehlgeschlagen',
          rollbackConfirmTitle: 'Systemupdate zurückrollen?',
          rollbackConfirmDesc:
            'Dies stellt Dateien aus der letzten Systemupdate-Sicherung wieder her. Ein Neustart ist erforderlich.',
          stagedDesc:
            'Das Systemupdate wurde heruntergeladen und verifiziert, es kann jetzt installiert werden',
          refresh: 'Aktualisieren',
          releaseNotes: 'Versionshinweise',
          systemVersion: 'Systemversion',
          kernel: 'Kernel',
          stagedVersion: 'Vorbereitete Version',
          archive: 'Archiv',
          requiredFree: 'Erforderlicher freier Speicher',
          fileCount: 'Dateien',
          rawImages: 'Raw-Images',
          progress: 'Fortschritt',
          progressMessage: 'Fortschrittsmeldung',
          pendingVersion: 'Ausstehende Version',
          bootHealth: 'Boot-Zustand',
          healthy: 'In Ordnung',
          unhealthy: 'Benötigt Aufmerksamkeit',
          rollbackBackup: 'Rollback-Sicherung'
        },
        offline: {
          title: 'Anwendungspaket hochladen',
          desc: 'Ein Anwendungspaket von diesem Computer installieren. Danach startet der Server neu.',
          installTitle: 'Anwendungsupdate installieren?',
          installDesc:
            'Die Anwendung wird ersetzt und der Server startet neu. Danach ist eine erneute Anmeldung nötig.'
        },
        local: {
          title: 'Systempaket hochladen',
          desc: 'Ein Systempaket von diesem Computer installieren. Eine Datei enthält das Archiv und seine signierten Metadaten.',
          choose: 'Datei auswählen',
          invalidFile: 'Ein Paket mit der Endung .tar oder .tar.gz auswählen.',
          diskTitle: 'Virtuelles Laufwerk ausschalten?',
          diskWarn:
            'Das Paket wird auf /data gespeichert, das bei eingeschaltetem virtuellem Laufwerk schreibgeschützt ist. Nach dem Ausschalten kann der Computer nicht mehr auf /data zugreifen. Fortfahren?',
          uploading: 'Wird hochgeladen',
          verifying: 'Paket wird geprüft und bereitgestellt',
          keyTitle: 'Lokaler Update-Schlüssel',
          keyDesc:
            'Öffentlicher Schlüssel im PEM-Format, der selbst erstellte Pakete signieren darf',
          keyNone: 'Kein Schlüssel gesetzt',
          keySet: 'Schlüssel setzen',
          keyRemove: 'Entfernen',
          signer: 'Signiert von',
          section: 'Lokale Updates',
          keyRequired: 'Lokaler Schlüssel erforderlich'
        }
      },
      account: {
        title: 'Konto',
        webAccount: 'Name des Webkontos',
        password: 'Passwort',
        passwordDesc: 'Das Passwort ändern, mit dem Sie sich an der Weboberfläche anmelden',
        updateBtn: 'Ändern',
        logoutBtn: 'Abmelden',
        logoutDesc: 'Möchten Sie sich wirklich abmelden?',
        okBtn: 'Ja',
        cancelBtn: 'Nein',
        session: {
          title: 'Sitzung'
        },
        logoutOnClose: {
          title: 'Abmelden, wenn der Browser geschlossen wird',
          description:
            'Sitzung beenden, sobald der Browser geschlossen wird, statt sie offen zu halten'
        },
        totp: {
          title: 'Zwei-Faktor-Authentifizierung',
          authenticator: 'Authenticator-App',
          description:
            'Zusätzlich zum Passwort einen zeitbasierten Code aus einer Authenticator-App verlangen',
          required: 'Per Richtlinie erforderlich',
          disable: 'Deaktivieren',
          enableTitle: 'Zwei-Faktor-Authentifizierung einrichten',
          enableDescription:
            'Bestätigen Sie Ihr Passwort, um fortzufahren. Es ist bei jeder Änderung des zweiten Faktors erforderlich.',
          continue: 'Weiter',
          disableTitle: 'Zwei-Faktor-Authentifizierung deaktivieren?',
          disableDescription:
            'Ihr Konto ist dann nur noch durch das Passwort geschützt. Bestätigen Sie mit Ihrem Passwort, um fortzufahren.',
          disableFailed: 'Die Zwei-Faktor-Authentifizierung konnte nicht deaktiviert werden',
          passwordPlaceholder: 'Aktuelles Passwort',
          enrollFailed: 'Die Einrichtung konnte nicht gestartet werden',
          invalidCode: 'Dieser Code stimmt nicht überein. Versuche den nächsten.',
          scan: 'Scannen Sie dies mit Ihrer Authenticator-App.',
          manualEntry: 'Oder geben Sie diesen Schlüssel manuell ein:',
          codePlaceholder: 'Geben Sie den 6-stelligen Code zur Bestätigung ein',
          confirm: 'Bestätigen',
          cancel: 'Abbrechen',
          backupTitle: 'Speichern Sie jetzt Ihre Backup-Codes',
          backupDescription:
            'Jeder Code funktioniert nur einmal und wird nicht erneut angezeigt. Die Codes sind der einzige Weg zurück, wenn Sie Ihre Authenticator-App verlieren, und sie funktionieren auch, wenn die Uhr des Geräts nicht synchronisiert ist.',
          copy: 'Kopieren',
          copied: 'Backup-Codes kopiert',
          savedThem: 'Ich habe sie gespeichert',
          remaining: 'Noch {{remaining}} Backup-Codes übrig',
          clockUnsynced:
            'Die Uhr des Geräts ist noch nicht synchronisiert. Synchronisieren Sie die Zeit unter Einstellungen > System > Zeit, bevor Sie die Einrichtung starten.',
          noBackupCodes:
            'Es sind keine Backup-Codes mehr übrig. Wählen Sie „Erzeugen“, um einen neuen Satz auszustellen.',
          regenerate: 'Neue Backup-Codes',
          generate: 'Erzeugen',
          regenerateTitle: 'Neue Backup-Codes ausstellen?',
          regenerateDescription:
            'Ihre aktuellen Backup-Codes funktionieren dann nicht mehr. Bestätigen Sie mit Ihrem Passwort, um fortzufahren.',
          regenerateFailed: 'Neue Backup-Codes konnten nicht ausgestellt werden',
          download: 'Herunterladen',
          copyFailed: 'Kopieren nicht möglich. Markiere die Codes und kopiere sie manuell.',
          requireTitle: 'Zwei-Faktor-Authentifizierung erzwingen',
          requireDescription:
            'Verhindert das Deaktivieren der Zwei-Faktor-Authentifizierung, und ein Konto ohne sie muss sie einrichten, bevor es das Gerät nutzen kann',
          requireFailed: 'Die Anforderung konnte nicht geändert werden',
          requiredTitle: 'Zwei-Faktor-Authentifizierung ist erforderlich',
          requiredDescription:
            'Dieses Gerät verlangt einen zweiten Faktor, aber Ihr Konto hat noch keinen eingerichtet. Richten Sie ihn jetzt ein, um fortzufahren.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw-Assistent',
      empty: 'Beschreiben Sie eine Aufgabe, um zu beginnen',
      inputPlaceholder: 'Beschreiben Sie, was PicoClaw tun soll',
      newConversation: 'Neues Gespräch',
      processing: 'Wird verarbeitet...',
      agent: {
        defaultTitle: 'Allgemeiner Assistent',
        defaultDescription: 'Allgemeine Chat-, Such- und Arbeitsbereichshilfe',
        kvmTitle: 'Fernsteuerung',
        kvmDescription: 'Betreiben Sie den Remote-Host über NanoKVM',
        switched: 'Agentenrolle gewechselt',
        switchFailed: 'Agentenrolle konnte nicht gewechselt werden'
      },
      send: 'Senden',
      cancel: 'Abbrechen',
      status: {
        connecting: 'Verbindung zum Gateway wird hergestellt...',
        connected: 'PicoClaw Sitzung verbunden',
        disconnected: 'PicoClaw Sitzung geschlossen',
        stopped: 'Stoppanforderung gesendet',
        runtimeStarted: 'PicoClaw Runtime gestartet',
        runtimeStartFailed: 'PicoClaw Runtime konnte nicht gestartet werden',
        runtimeStopped: 'PicoClaw Runtime gestoppt',
        runtimeStopFailed: 'PicoClaw Runtime konnte nicht gestoppt werden'
      },
      connection: {
        runtime: {
          checking: 'Überprüfung',
          ready: 'Runtime bereit',
          stopped: 'Runtime gestoppt',
          unavailable: 'Runtime nicht verfügbar',
          configError: 'Konfigurationsfehler'
        },
        transport: {
          connecting: 'Verbinden',
          connected: 'Verbunden'
        },
        run: {
          idle: 'Leerlauf',
          busy: 'Beschäftigt'
        }
      },
      error: {
        lockHeld: 'PicoClaw wird in einem anderen Fenster verwendet',
        takenOver: 'Ein anderes Fenster hat PicoClaw übernommen',
        authFailed: 'PicoClaw hat die Verbindung abgelehnt',
        upstreamClosed: 'Die Verbindung zu PicoClaw wurde unterbrochen'
      },
      tool: {
        screenshot: 'Erstelle einen Screenshot',
        loadImage: 'Sehe mir den Screenshot an',
        actions: 'Steuere den Host',
        generic: 'Verwende {{name}}',
        type: 'Tippe {{text}}',
        hotkey: 'Drücke {{keys}}',
        click: 'Klicke',
        doubleClick: 'Doppelklicke',
        move: 'Bewege die Maus',
        drag: 'Ziehe',
        scroll: 'Scrolle',
        wait: 'Warte'
      },
      message: {
        toolAction: 'Aktion',
        observation: 'Beobachtung',
        screenshot: 'Screenshot'
      },
      overlay: {
        locked: 'PicoClaw steuert das Gerät. Die manuelle Eingabe wird angehalten.'
      },
      install: {
        install: 'PicoClaw installieren',
        installing: 'Installation von PicoClaw',
        success: 'PicoClaw erfolgreich installiert',
        failed: 'Installation von PicoClaw fehlgeschlagen',
        uninstalled: 'PicoClaw erfolgreich deinstalliert',
        uninstallFailed: 'Deinstallation fehlgeschlagen',
        requiredTitle: 'PicoClaw ist nicht installiert',
        requiredDescription: 'Installieren Sie PicoClaw, bevor Sie die PicoClaw Runtime starten.',
        progressDescription: 'PicoClaw wird heruntergeladen und installiert.',
        stages: {
          preparing: 'Vorbereiten',
          downloading: 'Wird heruntergeladen',
          extracting: 'Extrahieren',
          verifying: 'Überprüfen',
          installing: 'Installiere',
          installed: 'Installiert',
          install_timeout: 'Zeitüberschreitung',
          install_failed: 'Fehlgeschlagen'
        }
      },
      model: {
        requiredTitle: 'Modellkonfiguration ist erforderlich',
        requiredDescription:
          'Konfigurieren Sie das PicoClaw-Modell, bevor Sie den PicoClaw-Chat verwenden.',
        docsTitle: 'Konfigurationshandbuch',
        docsDesc: 'Unterstützte Modelle und Protokolle',
        menuLabel: 'Modell konfigurieren',
        modelIdentifier: 'Modell-ID',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API-Basis-URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API-Schlüssel',
        apiKeyPlaceholder: 'API-Schlüssel des Modells eingeben',
        apiKeyKeepPlaceholder: 'Leer lassen, um den aktuellen Schlüssel zu behalten',
        save: 'Speichern',
        saving: 'Speichern',
        saved: 'Modellkonfiguration gespeichert',
        saveFailed: 'Modellkonfiguration konnte nicht gespeichert werden',
        invalid: 'Modellkennung, API-Basis-URL und API-Schlüssel sind erforderlich'
      },
      uninstall: {
        confirmTitle: 'PicoClaw deinstallieren',
        confirmContent:
          'Sind Sie sicher, dass Sie PicoClaw deinstallieren möchten? Dadurch werden die ausführbare Datei und alle Konfigurationsdateien gelöscht.',
        confirmOk: 'Deinstallieren'
      },
      history: {
        title: 'Verlauf',
        loading: 'Sitzungen werden geladen...',
        emptyTitle: 'Noch keine Historie',
        emptyDescription: 'Frühere PicoClaw-Sitzungen werden hier angezeigt.',
        loadFailed: 'Der Sitzungsverlauf konnte nicht geladen werden',
        deleteFailed: 'Sitzung konnte nicht gelöscht werden',
        deleteConfirmTitle: 'Sitzung löschen',
        deleteConfirmContent: 'Sind Sie sicher, dass Sie „{{title}}“ löschen möchten?',
        deleteConfirmOk: 'Löschen',
        messageCount_one: '{{count}} Nachricht',
        messageCount_other: '{{count}} Nachrichten'
      },
      config: {
        startRuntime: 'PicoClaw starten',
        stopRuntime: 'PicoClaw stoppen',
        stopConfirm: 'PicoClaw stoppen?'
      },
      start: {
        title: 'PicoClaw starten',
        description:
          'Starten Sie die Runtime, um mit der Verwendung des PicoClaw-Assistenten zu beginnen.'
      }
    },
    error: {
      title: 'Wir sind auf ein Problem gestossen',
      refresh: 'Neuladen'
    },
    fullscreen: {
      toggle: 'Vollbild ein/aus'
    },
    menu: {
      collapse: 'Menü einklappen'
    }
  }
};

export default de;
