const pl = {
  translation: {
    common: {
      confirm: 'Potwierdź',
      cancel: 'Anuluj',
      save: 'Zapisz',
      discard: 'Odrzuć',
      delete: 'Usuń',
      actionFailed: 'Operacja nie powiodła się',
      loading: 'Wczytywanie ustawień z urządzenia...',
      loadFailed: 'Nie udało się wczytać ustawień z urządzenia',
      retry: 'Spróbuj ponownie'
    },
    head: {
      desktop: 'Zdalny pulpit',
      login: 'Logowanie',
      firstSetup: 'Pierwsza konfiguracja',
      changePassword: 'Zmień hasło',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Logowanie',
      placeholderUsername: 'Wprowadź nazwę użytkownika',
      placeholderPassword: 'Wprowadź hasło',
      placeholderPassword2: 'Wprowadź hasło ponownie',
      noEmptyUsername: 'Nazwa użytkownika nie może być pusta',
      noEmptyPassword: 'Hasło nie może być puste',
      invalidUser: 'Błędne hasło lub nazwa użytkownika',
      locked: 'Zbyt wiele loginów, spróbuj ponownie później',
      globalLocked: 'System chroniony, spróbuj ponownie później',
      error: 'Niespodziewany błąd',
      changePassword: 'Zmień hasło',
      changePasswordDesc: 'Dla bezpieczeństwa twojego urządzenia zmień hasło do logowania w sieci',
      differentPassword: 'Hasła nie zgadzają się',
      illegalUsername: 'Nazwa użytkownika zawiera niedozwolone znaki',
      illegalPassword:
        'Hasło musi mieć co najmniej 8 znaków i nie może zawierać cudzysłowów ani ukośników',
      forgetPassword: 'Nie pamiętasz hasła',
      ok: 'Ok',
      cancel: 'Anuluj',
      loginButtonText: 'Zaloguj się',
      setupTitle: 'Utwórz konto administratora',
      setupDescription:
        'Na tym urządzeniu nie ma jeszcze konta web. Utwórz pierwsze konto administratora, aby kontynuować.',
      setupRecovery:
        'Jeśli to hasło zostanie utracone, odzyskanie dostępu wymaga ponownego zapisania karty SD',
      setupButtonText: 'Utwórz konto',
      tips: {
        hardenedRecovery:
          'Ten obraz Hardened nie obsługuje resetu hasła przyciskiem BOOT. Jeśli hasło zostanie utracone, zapisz ponownie kartę SD i utwórz nowe konto.',
        change1: 'Pamiętaj, że ta operacja zmieni następujące hasła:',
        change2: 'Hasło logowania web',
        change3: 'Hasło roota systemu do logowania przez SSH'
      },
      placeholderCurrentPassword: 'Obecne hasło',
      placeholderNewPassword: 'Nowe hasło',
      wrongCurrentPassword: 'Obecne hasło jest nieprawidłowe',
      totp: {
        title: 'Uwierzytelnianie dwuskładnikowe',
        prompt: 'Wpisz 6-cyfrowy kod z aplikacji uwierzytelniającej',
        backupPrompt: 'Wpisz jeden ze swoich kodów zapasowych',
        noEmptyCode: 'Wpisz kod',
        placeholderCode: '6-cyfrowy kod',
        placeholderBackup: 'Kod zapasowy',
        verifyButtonText: 'Zweryfikuj',
        useBackupCode: 'Użyj kodu zapasowego',
        useAuthenticator: 'Użyj kodu z aplikacji uwierzytelniającej',
        cancel: 'Wstecz',
        invalidCode: 'Ten kod jest nieprawidłowy. Spróbuj ponownie.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Skonfiguruj Wi-Fi dla NanoKVM',
      success: 'Podejdź do urządzenia, aby sprawdzić stan sieci NanoKVM',
      failed: 'Operacja nie powiodła się, spróbuj ponownie',
      invalidMode:
        'Bieżący tryb nie obsługuje konfiguracji sieci. Przejdź do swojego urządzenia i włącz tryb konfiguracji Wi-Fi.',
      confirmBtn: 'Ok',
      finishBtn: 'Zakończono',
      ap: {
        authTitle: 'Wymagane uwierzytelnienie',
        authDescription: 'Aby kontynuować, wprowadź hasło AP',
        authFailed: 'Nieprawidłowe hasło AP',
        passPlaceholder: 'Hasło AP',
        verifyBtn: 'Sprawdź'
      }
    },
    screen: {
      scale: 'Skala',
      title: 'Ekran',
      video: 'Tryb wideo',
      videoDirectTips: 'Włącz HTTPS w „Ustawienia > Sieć > Usługi”, aby korzystać z tego trybu',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC jest wyłączony w trybach zapory Ograniczony i Paranoidalny',
      transferRunningTitle: 'Trwa przesyłanie obrazu',
      transferRunningDesc:
        'Zmiana trybu wideo przeładowuje stronę, co anuluje trwające przesyłanie lub pobieranie obrazu.',
      transferRunningOk: 'Zmień tryb',
      resolution: 'Rozdzielczość',
      auto: 'Automatyczny',
      autoTips:
        'W określonych rozdzielczościach może wystąpić rozrywanie ekranu lub przesunięcie myszy, więc dostosuj rozdzielczość zdalnego hosta lub wyłącz tryb automatyczny',
      fps: 'FPS',
      customizeFps: 'Personalizuj',
      quality: 'Jakość',
      qualityLossless: 'Bezstratny',
      qualityHigh: 'Wysoki',
      qualityMedium: 'Średni',
      qualityLow: 'Niski',
      frameDetect: 'Wykrywanie klatek',
      frameDetectTip:
        'Porównuje klatki i wstrzymuje wysyłanie wideo, dopóki ekran zdalnego hosta się nie zmienia',
      resetHdmi: 'Resetuj HDMI',
      webrtcConnectionFailed: {
        title: 'Połączenie WebRTC nie powiodło się',
        description: 'Sprawdź połączenie sieciowe lub zmień tryb wideo'
      },
      captureStatus: {
        hdmiError: 'Błąd obrazu HDMI',
        unsupportedResolution: 'Bieżąca rozdzielczość nie jest obsługiwana',
        retrieving: 'Pobieranie obrazu...',
        changingResolution: 'Przełączanie rozdzielczości...',
        updateFailed: 'Nie można teraz zaktualizować obrazu',
        videoError: 'Błąd wyświetlania wideo',
        noHdmi: 'Nie wykryto sygnału HDMI',
        unavailable: 'Nie można teraz wyświetlić obrazu'
      }
    },
    keyboard: {
      title: 'Klawiatura',
      paste: 'Wklej',
      tips: 'Tylko standardowe klawiaturowe znaki i symbole są obsługiwane',
      placeholder: 'Tekst do wklejenia',
      local: 'Klawiatura mobilna',
      virtual: 'Klawiatura ekranowa',
      readClipboard: 'Czytaj ze schowka',
      clipboardPermissionDenied:
        'Odmowa dostępu do schowka, zezwól na dostęp do schowka w przeglądarce',
      clipboardReadError: 'Nie udało się odczytać schowka',
      dropdownEnglish: 'Angielski',
      dropdownGerman: 'Niemiecki',
      dropdownFrench: 'Francuski',
      dropdownRussian: 'Rosyjski',
      dropdownKorean: 'Koreański',
      dropdownJapanese: 'Japoński',
      localInput: 'Wprowadzanie z klawiatury mobilnej',
      shortcut: {
        title: 'Skróty',
        custom: 'Niestandardowe',
        capture: 'Kliknij tutaj, aby przechwycić skrót',
        clear: 'Wyczyść',
        save: 'Zapisz',
        captureTips:
          'Przechwytywanie klawiszy systemowych, takich jak klawisz Windows, wymaga uprawnienia do pełnego ekranu',
        enterFullScreen: 'Przełącz tryb pełnoekranowy'
      },
      leaderKey: {
        title: 'Klawisz Leader',
        desc: 'Omiń ograniczenia przeglądarki i wyślij skróty systemowe bezpośrednio do zdalnego hosta',
        howToUse: 'Jak używać',
        simultaneous: {
          title: 'Tryb symultaniczny',
          desc1: 'Naciśnij i przytrzymaj klawisz Leader, a następnie naciśnij skrót.',
          desc2: 'Intuicyjne, ale może kolidować ze skrótami systemowymi.'
        },
        sequential: {
          title: 'Tryb sekwencyjny',
          desc1:
            'Naciśnij klawisz Leader → naciśnij skrót w sekwencji → ponownie naciśnij klawisz Leader.',
          desc2:
            'Wymaga większej liczby kroków, ale całkowicie pozwala uniknąć konfliktów systemowych.'
        },
        enable: 'Włącz klawisz Leader',
        tip: 'Po przypisaniu jako klawisz Leader ten klawisz działa wyłącznie jako wyzwalacz skrótów i traci swoje domyślne zachowanie.',
        placeholder: 'Naciśnij klawisz Leader',
        shiftRight: 'Prawy Shift',
        ctrlRight: 'Prawy Ctrl',
        metaRight: 'Prawy Win',
        recorder: {
          rec: 'NAGR',
          activate: 'Aktywuj klawisze',
          input: 'Naciśnij skrót'
        }
      }
    },
    mouse: {
      title: 'Mysz',
      cursor: 'Styl kursora',
      default: 'Domyślny kursor',
      cell: 'Kursor komórki',
      text: 'Kursor tekstowy',
      grab: 'Kursor chwytania',
      hide: 'Ukryj kursor',
      mode: 'Tryb myszki',
      absolute: 'Tryb bezwzględny',
      relative: 'Tryb względny',
      direction: 'Kierunek kółka przewijania',
      scrollUp: 'Przewiń w górę',
      scrollDown: 'Przewiń w dół',
      speed: 'Szybkość kółka przewijania',
      sensitivity: 'Szybkość wskaźnika',
      sensitivityDesc:
        'Dla desktopowego trybu względnego: niższe wartości zmniejszają dryf powodowany akceleracją myszy hosta',
      fast: 'Szybko',
      slow: 'Powoli',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Poruszaj palcem w dowolnym miejscu obszaru KVM; zdalny kursor zachowuje pozycję między dotknięciami i pozostaje zsynchronizowany z absolutnym HID'
      },
      requestPointer: 'Korzystanie z trybu względnego, kliknij pulpit, aby uzyskać wskaźnik myszy',
      resetHid: 'Zresetuj HID',
      hidOnly: {
        title: 'Tryb HID-Only',
        desc: 'Jeśli mysz lub klawiatura przestaną reagować, a reset HID nie pomaga, może to być problem ze zgodnością między NanoKVM a hostem.',
        tip1: 'Włączenie trybu HID-Only odmontuje dysk wirtualny i sieć wirtualną',
        tip2: 'W trybie HID-Only montowanie obrazów jest wyłączone',
        tip3: 'NanoKVM automatycznie uruchomi się ponownie po przełączeniu trybów',
        enable: 'Włącz tryb HID-Only',
        disable: 'Wyłącz tryb HID-Only'
      }
    },
    image: {
      title: 'Obrazy',
      loading: 'Ładowanie...',
      empty: 'Nic nie znaleziono',
      mountMode: 'Zamontuj jako',
      massStorage: 'Pamięć masowa',
      cdRom: 'CD-ROM',
      mountFailed: 'Nie udało się zamontować obrazu',
      mountDesc:
        'W niektórych systemach wymagane jest wyjęcie dysku wirtualnego na zdalnym hoście przed zamontowaniem obrazu',
      diskOnWarn:
        'Zamontowanie obrazu wyłącza dysk wirtualny, więc komputer straci dostęp do /data. Kontynuować?',
      diskOffWarn:
        'Dysk wirtualny jest wyłączony i musi zostać włączony, aby zamontować obraz. Urządzenia USB w komputerze zostaną wyliczone ponownie. Kontynuować?',
      unmountFailed: 'Odmontowanie nie powiodło się',
      unmountDesc:
        'W niektórych systemach należy ręcznie wysunąć obraz ze zdalnego hosta przed odmontowaniem obrazu',
      forceEject: 'Wymuś wysunięcie',
      forceEjectConfirm:
        'Host zablokował napęd optyczny. Wymuszenie wysunięcia na chwilę odłącza wirtualne urządzenie USB, więc klawiatura i mysz mogą na krótko się odłączyć. Kontynuować?',
      usbReconnect: 'Podłącz USB ponownie',
      usbReconnectConfirm:
        'Podłącz gadget USB ponownie tylko wtedy, gdy zdalny host nie zauważył zmiany nośnika. Klawiatura i mysz mogą na chwilę się rozłączyć.',
      usbReconnectSuccess: 'USB podłączono ponownie',
      usbReconnectFailed: 'Ponowne podłączenie USB nie powiodło się',
      addImage: 'Dodaj obraz',
      fromUrl: 'Z adresu URL',
      fromFile: 'Z pliku',
      turnOff: 'Wyłącz',
      eject: 'Wysuń',
      download: 'Pobierz',
      upload: 'Prześlij',
      mountTitle: 'Zamontuj obraz',
      deleteTitle: 'Usuń obraz',
      deleteConfirm: 'Czy na pewno chcesz usunąć ten obraz?',
      tips: {
        title: 'Jak przesłać obrazy',
        usb1: 'Podłącz urządzenie NanoKVM do komputera przez USB.',
        usb2: 'Upewnij się, że dysk wirtualny jest zamontowany w Ustawienia > Urządzenie > Dysk wirtualny.',
        usb3: 'Otwórz dysk wirtualny na swoim komputerze i skopiuj plik obrazu do katalogu głównego dysku wirtualnego.',
        scp1: 'Upewnij się, że NanoKVM i twój komputer są w tej samej sieci lokalnej.',
        scp2: 'Otwórz terminal na komputerze i użyj komendę SCP aby przesłać obraz do katalogu /data na NanoKVM.',
        scp3: 'Przykład: scp lokalizacja-zrodlowego-obrazu root@ip-twojego-nanokvm:/data',
        tfCard: 'Karta SD',
        tf1: 'Ta metoda jest obsługiwana w systemie Linux',
        tf2: 'Wyjmij kartę SD z NanoKVM. W wersji FULL najpierw zdemontuj obudowę.',
        tf3: 'Włóż kartę SD do czytnika kart i podłącz do twojego komputera.',
        tf4: 'Kopjuj obraz do katalogu /data na karcie SD.',
        tf5: 'Włóż kartę SD do NanoKVM.'
      }
    },
    script: {
      title: 'Skrypty',
      upload: 'Prześlij',
      run: 'Uruchom',
      runBackground: 'Uruchom w tle',
      runFailed: 'Uruchomienie nie powiodło się',
      delDesc: 'Czy na pewno chcesz usunąć ten plik?',
      delete: 'Usuń',
      close: 'Zamknij'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'Terminal NanoKVM',
      serial: 'Terminal portu szeregowego',
      unlockTitle: 'Odblokuj terminal',
      unlockDesc: 'Wprowadź dane konta web, aby otworzyć powłokę roota',
      unlock: 'Odblokuj',
      unlockFailed: 'Nie udało się odblokować terminala',
      invalidCredentials: 'Nieprawidłowa nazwa użytkownika lub hasło',
      locked: 'Zbyt wiele prób, spróbuj ponownie później',
      sessionClosed: 'Sesja terminala została zamknięta. Odblokuj ponownie, aby się połączyć.',
      sessionError: 'Połączenie terminala nie powiodło się. Odblokuj ponownie.',
      serialPort: 'Port szeregowy',
      serialPortPlaceholder: 'Na przykład /dev/ttyS1',
      baudrate: 'Szybkość transmisji',
      parity: 'Kontrola parzystości',
      parityNone: 'Brak kontroli',
      parityEven: 'Parzysta',
      parityOdd: 'Nieparzysta',
      flowControl: 'Kontrola przepływu',
      flowControlNone: 'Brak kontroli',
      flowControlSoft: 'Programowe',
      flowControlHard: 'Sprzętowe',
      dataBits: 'Bity danych',
      stopBits: 'Bity stopu',
      open: 'Otwórz terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Wysyłanie komendy...',
      sent: 'Komenda wysłana',
      input: 'Adres MAC',
      ok: 'OK'
    },
    download: {
      input: 'Adres URL zdalnego obrazu',
      ok: 'OK',
      disabled:
        'Obrazy nie mogą być teraz pobierane ani przesyłane, ponieważ pamięć nie jest zapisywalna. Jeśli obraz jest zamontowany, odmontuj go, a następnie wyłącz dysk wirtualny, aby pamięć znów była zapisywalna.',
      diskShared: 'Wyłącz dysk wirtualny, aby używać pobierania obrazów',
      mountedImage:
        'Ten obraz jest zamontowany, odmontuj go przed przesłaniem pliku o tej samej nazwie',
      diskOff: 'Wyłącz dysk wirtualny',
      uploadbox: 'Upuść plik tutaj lub kliknij, aby wybrać',
      inputfile: 'Plik obrazu',
      NoISO: 'Brak obrazu',
      complete: 'Pobieranie zakończone',
      uploadComplete: 'Przesyłanie zakończone',
      downloading: 'Pobieranie',
      uploading: 'Przesyłanie',
      failed: 'Transfer nie powiódł się',
      uploadFailed: 'Przesyłanie nie powiodło się',
      stalled: 'Transfer zatrzymał się, sprawdź połączenie i spróbuj ponownie',
      canceled: 'Przesyłanie anulowane',
      downloadCanceled: 'Pobieranie anulowane',
      cancel: 'Anuluj',
      remoteDisabled:
        'Zdalne pobieranie ISO jest wyłączone w Ustawienia > Użytkownik > Preferencje',
      remoteFailed: 'Zdalne pobieranie ISO nie powiodło się',
      sha256: 'Opcjonalna suma kontrolna SHA-256',
      sha256Placeholder: 'Wprowadź 64-znakową sumę kontrolną SHA-256',
      invalidSHA256: 'SHA-256 musi być 64-znakowym ciągiem szesnastkowym',
      checksumFailed: 'Pobieranie nie powiodło się: weryfikacja SHA-256 nie powiodła się'
    },
    power: {
      title: 'Zasilanie',
      showConfirm: 'Potwierdzenie',
      showConfirmTip: 'Operacje zasilania wymagają dodatkowego potwierdzenia',
      reset: 'Resetuj',
      powerShort: 'Przycisk zasilania: krótkie kliknięcie',
      powerLong: 'Przycisk zasilania: długie kliknięcie',
      resetConfirm: 'Kontynuować operację resetowania?',
      powerConfirm: 'Wykonać operację zasilania?',
      okBtn: 'Tak',
      cancelBtn: 'Nie'
    },
    settings: {
      title: 'Ustawienia',
      about: {
        title: 'Informacje',
        information: 'Informacje o systemie',
        ip: 'Adres IP',
        mdns: 'Adres lokalny',
        application: 'Wersja oprogramowania',
        uptime: 'Czas działania',
        community: 'Społeczność',
        credit:
          'Oparty na <a1>NanoKVM</a1> firmy Sipeed i <a2>Hardened NanoKVM</a2> autorstwa woffko',
        hostname: 'Nazwa urządzenia',
        changeIn: 'Zmienisz to w {{path}}',
        updateIn: 'Zaktualizujesz to w {{path}}',
        toggleIn: 'Włączysz lub wyłączysz to w {{path}}'
      },
      appearance: {
        title: 'Preferencje',
        display: 'Ekran',
        language: 'Język',
        languageDesc: 'Wybierz język interfejsu',
        webTitle: 'Tytuł strony internetowej',
        webTitleDesc: 'Dostosuj tytuł strony internetowej',
        layoutMode: 'Układ interfejsu',
        layoutModeDesc: 'Użyj układu dla telefonu/dotykowego w tej przeglądarce',
        layoutAuto: 'Automatycznie',
        layoutMobile: 'Telefon',
        menuBar: {
          title: 'Pasek menu',
          mode: 'Tryb wyświetlania',
          modeDesc: 'Wyświetl pasek menu na ekranie',
          modeOff: 'Wyłączone',
          modeAuto: 'Automatyczne ukrywanie',
          modeAlways: 'Zawsze widoczny',
          keyboardLedStatus: 'Wskaźniki blokad klawiatury',
          keyboardLedStatusDesc:
            'Wyświetl stan Num Lock, Caps Lock i Scroll Lock zdalnego komputera',
          icons: 'Ikony podmenu',
          iconsDesc: 'Wyświetla ikony podmenu na pasku menu',
          terminalWarningTitle: 'Włączyć terminal web?',
          terminalWarningDesc:
            'Terminal otwiera powłokę roota w przeglądarce. Włączaj go tylko w zaufanej sieci i wyłącz po zakończeniu pracy.',
          terminalWarningConfirm: 'Włącz',
          remoteDownload: 'Pobierz zdalne ISO',
          remoteDownloadWarningTitle: 'Włączyć zdalne pobieranie ISO?',
          remoteDownloadWarningDesc:
            'NanoKVM pobierze obraz ISO z adresu URL i zapisze go w /data. Włączaj tylko dla zaufanych adresów URL i wyłącz po zakończeniu pracy.',
          remoteDownloadWarningConfirm: 'Włącz'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Stan blokad zdalnej klawiatury',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Włączone',
        off: 'Wyłączone',
        unknown: 'Nieznany'
      },
      device: {
        title: 'Urządzenie',
        minutes: 'min',
        sections: {
          general: 'Ogólne',
          connectivity: 'Łączność',
          hostConnection: 'Połączenie z hostem',
          inputOutput: 'Wejście i wyjście'
        },
        oled: {
          title: 'Limit czasu OLED',
          description: 'Wyłącz ekran OLED po',
          keepOn: 'Zostaw OLED włączony',
          keepOnDescription: 'Nigdy nie wyłączaj ekranu OLED'
        },
        ssh: {
          description: 'Włącz SSH zdalny dostęp',
          tip: 'Ustaw silne hasło w Konto > Hasło przed włączeniem tej opcji'
        },
        swap: {
          title: 'Swap',
          description: 'Używaj pliku wymiany, gdy brakuje pamięci',
          size: 'Rozmiar swapu',
          sizeDescription: 'Ustaw rozmiar pliku wymiany',
          tip: 'Włączenie tej funkcji może skrócić żywotność karty SD'
        },
        mouseJiggler: {
          title: 'Jiggler myszy',
          description: 'Uniemożliwia uśpienie zdalnego hosta',
          disable: 'Wyłącz',
          absolute: 'Tryb absolutny',
          relative: 'Tryb względny'
        },
        sessionLock: {
          title: 'Blokuj sesję przy braku aktywności',
          description: 'Zablokuj aktywną sesję po okresie bezczynności'
        },
        mdns: {
          description: 'Włącz usługę wykrywania mDNS',
          tip: 'Umożliwia dostęp do urządzenia przez nazwę .local. Niepotrzebne, jeśli łączysz się przez adres IP lub twój DNS już rozwiązuje nazwę hosta.'
        },
        hdmi: {
          description: 'Włącz HDMI/wyjście monitora',
          idleTimeoutTitle: 'Limit czasu bezczynności przechwytywania',
          idleTimeoutDescription: 'Zatrzymaj przechwytywanie HDMI po czasie bez aktywnych widzów:'
        },
        hidOnly: 'Tryb HID-Only',
        hidOnlyDesc: 'Poprawia zgodność z hostem, gdy mysz lub klawiatura przestają reagować',
        hidOnlyTip:
          'Tryb HID-Only przestaje emulować urządzenia wirtualne i zachowuje tylko podstawową kontrolę HID',
        disk: 'Dysk wirtualny',
        diskDesc: 'Zamontuj kartę SD na zdalnym hoście',
        diskLocked: 'Wyłączony, gdy obraz jest zamontowany, a włączenie anuluje zamontowanie',
        diskEnable: 'Włącz dysk wirtualny',
        networkChange: 'Zmień sieć wirtualną',
        diskCancelMount: 'Włączenie dysku wirtualnego anuluje zamontowany obraz. Kontynuować?',
        networkCancelMount:
          'Zmiana sieci wirtualnej restartuje połączenie USB. Spowoduje to anulowanie zamontowanego obrazu i włączenie dysku wirtualnego. Kontynuować?',
        diskTransferRunning:
          'Trwa przesyłanie obrazu. Poczekaj na jego zakończenie, zanim włączysz dysk wirtualny.',
        network: 'Sieć wirtualna',
        networkDesc: 'Zamontuj wirtualną kartę sieciową na zdalnym hoście',
        usbWakeup: 'Wybudzanie przez USB',
        usbWakeupDesc: 'Pozwól zdarzeniom klawiatury lub myszy wybudzać zdalny host',
        usbWakeupTip: 'Wyłącz, jeśli host zapisuje powtarzające się komunikaty USB wakeup',
        hostname: {
          description: 'Nazwa tego urządzenia w sieci',
          reachable: 'Dostępne w sieci lokalnej pod nazwą {{address}}'
        },
        rebootRequired: 'Wymagany restart',
        rebootPending: 'Wymagany restart dla: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Aktualizacja systemu'
        },
        reboot: 'Uruchom ponownie',
        rebootDesc: 'Czy na pewno chcesz ponownie uruchomić NanoKVM?',
        poweroff: 'Wyłącz',
        poweroffDesc:
          'Czy na pewno wyłączyć NanoKVM? Będzie niedostępny, dopóki nie zostanie ponownie włączony.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Połączenie',
        configuration: 'Konfiguracja',
        wifi: {
          title: 'Wi-Fi',
          description: 'Skonfiguruj Wi-Fi',
          apMode: 'Tryb AP jest włączony, połącz z Wi-Fi skanując kod QR',
          connect: 'Połącz Wi-Fi',
          connectDesc1: 'Wprowadź SSID sieci i hasło',
          disconnect: 'Czy na pewno chcesz rozłączyć sieć?',
          disconnectBtn: 'Rozłącz',
          connected: 'Połączono',
          ssid: 'Nazwa',
          password: 'Hasło',
          joinBtn: 'Połącz',
          cancelBtn: 'Anuluj'
        },
        tls: {
          description: 'Włącz protokół HTTPS',
          tip: 'Uwaga: użycie HTTPS może zwiększyć opóźnienie, szczególnie w trybie wideo MJPEG',
          restartTitle: 'Serwer zostanie uruchomiony ponownie',
          restartDesc:
            'Zmiana protokołu uruchamia serwer ponownie. Przeglądarka przełączy się na nowy adres po {{seconds}} sekundach:',
          restartOk: 'Zastosuj i uruchom ponownie',
          confirmTitle: 'Zachować nowy protokół?',
          confirmDesc:
            'Serwer działa teraz na {{protocol}}. Za {{seconds}} sekund wróci do poprzedniego protokołu, jeśli go nie zachowasz.',
          confirmKeep: 'Zachowaj',
          confirmRevert: 'Cofnij',
          reverting:
            'Powrót do poprzedniego protokołu. Przeglądarka przełączy się na ten adres po {{seconds}} sekundach.',
          certTitle: 'Zachować nowy certyfikat?',
          certDesc:
            'Serwer używa teraz nowego certyfikatu. Jeśli go nie zachowasz, za {{seconds}} sekund wróci do poprzedniego.',
          certReverted: 'Poprzedni certyfikat wrócił'
        },
        trustedProxies: {
          section: 'Odwrotny serwer proxy',
          title: 'Zaufane serwery proxy',
          description:
            'Odwrotne serwery proxy, którym urządzenie ufa w podawaniu adresu i protokołu klienta',
          tip: 'Adres z listy wybiera adres klienta zapisywany przez limit logowania i dziennik, więc podawaj tylko serwery proxy, które kontrolujesz',
          none: 'Brak',
          edit: 'Edytuj',
          editRow: 'Edytuj listę',
          editTitle: 'Edytuj zaufane serwery proxy',
          editDescription: 'Zmiana listy wymaga hasła',
          dialogDescription:
            'Podaj adres każdego odwrotnego serwera proxy tak, jak widzi go to urządzenie, albo zakres, na przykład 10.0.0.0/24. Serwer proxy z listy mówi urządzeniu, jakiego adresu i protokołu klienta użyć. Wszystko, co przekazuje, jest uznawane za prawdę, więc podawaj tylko serwery proxy, które kontrolujesz.'
        },
        certificate: {
          title: 'Certyfikat',
          desc: 'Skąd pochodzi certyfikat HTTPS',
          requesting: 'Żądanie certyfikatu w toku',
          selfSigned: 'Samopodpisany',
          domain: 'Domena',
          domainDesc: 'Musi wskazywać na to urządzenie, a port 443 musi być osiągalny z internetu',
          domainTailscale: 'Ustawione przez Tailscale dla tego urządzenia',
          domainInvalid: 'Użyj pełnej nazwy domeny, na przykład kvm.example.org',
          email: 'E-mail',
          emailDesc: "Opcjonalnie, dla powiadomień od Let's Encrypt",
          emailInvalid: 'Użyj adresu takiego jak nazwa@example.org',
          validUntil: 'Ważny do',
          valid: 'Ważny',
          expiresSoon: 'Wkrótce wygaśnie',
          expired: 'Wygasł',
          lastRenewal: 'Ostatnie odnowienie',
          renewed: 'Odnowiono',
          failed: 'Niepowodzenie',
          renewNow: 'Odnów teraz',
          renewNowDesc: 'Zażądaj nowego certyfikatu bez czekania',
          renewBtn: 'Odnów',
          applyTitle: 'Zmień certyfikat',
          applyOk: 'Zastosuj',
          applyAcme:
            "Urządzenie prosi Let's Encrypt o certyfikat. Let's Encrypt łączy się z portem 443 z internetu, aby go sprawdzić, co może potrwać do minuty. Jeśli żądanie się nie powiedzie, nadal używany jest obecny certyfikat.",
          applyTailscale:
            'Urządzenie pobiera certyfikat z Tailscale, co może potrwać do minuty. Jeśli żądanie się nie powiedzie, nadal używany jest obecny certyfikat.',
          applySelfSigned:
            'Urządzenie wraca do własnego certyfikatu samopodpisanego. Przeglądarki ostrzegają przed nim.',
          openTitle: 'Otwórz nowy adres',
          openDesc:
            'Certyfikat jest gotowy. Otwórz poniższy adres i zaloguj się, aby go zachować. Bez Twojego potwierdzenia w ciągu 3 minut wróci poprzedni certyfikat.',
          openOk: 'Otwórz',
          blockedClock: 'Certyfikaty można żądać dopiero po zsynchronizowaniu zegara urządzenia',
          blockedParanoid: 'Tryb zapory Paranoidalny blokuje żądania certyfikatów',
          tailscaleUnavailable:
            'Tailscale nie działa albo certyfikaty HTTPS nie są włączone dla tailnetu'
        },
        dns: {
          title: 'DNS',
          description: 'Skonfiguruj serwery DNS dla NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Skonfiguruj adresację IPv4 dla interfejsu przewodowego',
          servers: 'Serwery',
          dhcp: 'DHCP',
          manual: 'Ręcznie',
          apply: 'Zastosuj',
          invalid: 'Wprowadź prawidłowy adres IPv4 lub IPv6',
          invalidNetwork: 'Wprowadź prawidłowy adres IPv4, maskę podsieci i router',
          saved: 'Ustawienia DNS zapisane',
          redirecting: 'Ustawienia sieci zapisane. Otwieranie nowego adresu...',
          saveFailed: 'Nie udało się zapisać ustawień DNS',
          unsaved: 'Niezapisane zmiany',
          maxServers: 'Dozwolone jest maksymalnie {{count}} serwerów DNS',
          dhcpServersDescription: 'Serwery DNS są automatycznie pobierane z DHCP',
          manualServersDescription: 'Obsługiwane są serwery IPv4 i IPv6',
          interface: 'Interfejs',
          ipAddress: 'Adres IP',
          subnetMask: 'Maska podsieci',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Skonfiguruj adresację IPv6 dla interfejsu przewodowego',
          disabled: 'Wyłączone',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Ręcznie',
          interface: 'Interfejs',
          state: 'Stan',
          router: 'Router',
          addresses: 'Adresy',
          dhcpv6Client: 'Klient DHCPv6',
          notInstalled: 'Nie zainstalowano',
          ipAddress: 'Adres IPv6',
          prefix: 'Prefiks',
          invalidManual: 'Wprowadź prawidłowy adres IPv6, prefiks i router',
          clientMissing:
            'Klient DHCPv6 nie jest zainstalowany. Najpierw zainstaluj pasującą raw aktualizację systemu.',
          saved: 'Ustawienia IPv6 zapisane',
          saveFailed: 'Nie udało się zapisać ustawień IPv6',
          unsaved: 'Niezapisane zmiany'
        }
      },
      system: {
        title: 'System',
        performance: {
          processor: 'Procesor',
          overdrive: {
            title: 'Podkręcanie',
            description:
              'Uruchom z wyższymi taktowaniami procesora i wideo określonymi przez producenta',
            tip: 'Jeśli urządzenie nie uruchomi się z podkręcaniem, trzeba ponownie zapisać kartę SD',
            unavailable: 'Nie ma tego w tym obrazie systemu',
            keepTitle: 'Zachowaj overdrive po aktualizacjach',
            keepDescription:
              'Aktualizacja systemu przywraca standardowe zegary urządzenia, chyba że ta opcja jest włączona',
            confirmTitle: 'Włączyć podkręcanie?',
            confirmText:
              'Jeśli urządzenie nie uruchomi się z podkręcaniem, aby je przywrócić, trzeba ponownie zapisać kartę SD. Zmiana zadziała po następnym restarcie.',
            confirmOk: 'Włącz'
          },
          watchdog: {
            title: 'Sprzętowy watchdog',
            description: 'Automatycznie uruchom urządzenie ponownie, gdy przestanie odpowiadać',
            unavailable: 'Nie zawarto w tym obrazie systemu',
            notRunning: 'Obecnie nie działa',
            lastRestart: 'Ostatni restart',
            lastRestartCaption: 'Najnowsza przyczyna ponownego uruchomienia systemu',
            reasonPowerOn: 'Włączenie zasilania',
            reasonRestart: 'Zażądano restartu',
            reasonWatchdog: 'Reset przez watchdog',
            reasonOverheat: 'Ochrona przed przegrzaniem',
            reasonUnknown: 'Nieznane'
          },
          recovery: 'Odzyskiwanie',
          memory: 'Pamięć'
        },
        monitor: {
          processorClock: 'Podsystem CPU',
          videoClock: 'Podsystem wideo',
          videoClockCaption: 'Częstotliwość taktowania wideo',
          cpuClockCaption: 'Częstotliwość taktowania CPU',
          overdrive: 'Podkręcanie',
          temperature: 'Temperatura',
          lastMinutes: 'Ostatnie 5 minut',
          ram: 'RAM',
          off: 'Wyłączone',
          ramHistory: 'Wykorzystanie RAM',
          cpuLoad: 'Obciążenie procesora',
          cpuLoadCaption: 'Użytkownik {{user}} procent, system {{system}} procent',
          cpuUtilization: 'Wykorzystanie procesora',
          swapUtilization: 'Wykorzystanie swap',
          swapSizeLastMinutes: '{{size}}, ostatnie 5 minut',
          percent: '{{percent}} procent',
          percentUsed: '{{percent}} procent zajęte',
          sizeOf: '{{used}} z {{total}}',
          systemPartition: 'Partycja systemowa',
          dataPartition: 'Partycja danych',
          unavailable: 'Niedostępne',
          noReadings: 'Urządzenie nie zwraca odczytów',
          refresh: 'Odświeżane co sekundę, gdy ta strona jest otwarta'
        },
        sections: {
          time: 'Czas',
          firewall: 'Zapora',
          systemLog: 'Logowanie',
          performance: 'Wydajność',
          monitor: 'Monitor',
          services: 'Usługi',
          webInterface: 'Bezpieczny dostęp WWW'
        },
        time: {
          saveFailed: 'Nie udało się zapisać ustawień czasu',
          saved: 'Ustawienia czasu zapisane',
          syncFailed: 'Nie udało się zsynchronizować czasu',
          synced: 'Czas zsynchronizowany',
          invalidServers: 'Wprowadź co najmniej jeden serwer NTP',
          maxServers: 'Dozwolona maksymalna liczba serwerów NTP: {{count}}',
          refresh: 'Odśwież',
          syncNow: 'Synchronizuj',
          syncNowDesc: 'Ustaw zegar według serwerów NTP teraz',
          save: 'Zapisz',
          ntp: {
            title: 'NTP',
            description: 'Synchronizuj czas urządzenia z skonfigurowanymi serwerami NTP'
          },
          networkTime: 'Czas sieciowy',
          clock: {
            title: 'Zegar',
            description: 'Ustaw lokalną strefę czasową używaną przez logi i interfejs',
            current: 'Aktualny czas',
            timezone: 'Strefa czasowa'
          },
          servers: {
            title: 'Serwery NTP',
            description:
              'Użyj domyślnych serwerów publicznych, lokalnego routera lub własnych serwerów NTP',
            useRouter: 'Użyj routera',
            useDefaults: 'Użyj domyślnych',
            presets: 'Ustawienia wstępne serwerów',
            presetsDesc: 'Zastąp listę serwerów ustawieniem wstępnym'
          }
        },
        firewall: {
          saveFailed: 'Nie udało się zastosować ustawień zapory',
          saved: 'Ustawienia zapory zastosowane',
          cancel: 'Anuluj',
          refresh: 'Odśwież',
          backends: 'Backendy',
          enableHttpsFirst: 'Włącz HTTPS przed włączeniem trybu Ograniczony lub Paranoidalny',
          httpsRequired:
            'Tryby Ograniczony i Paranoidalny są niedostępne, dopóki HTTPS nie zostanie włączony w Ustawienia > Sieć > Usługi',
          mode: {
            title: 'Tryb zapory',
            baseline: 'Podstawowy',
            baselineDesc:
              'Otwarty profil zgodności. Zapora działa, ale źródła przychodzące nie są ograniczane. Używaj tylko w zaufanych sieciach.',
            moderate: 'Umiarkowany',
            moderateDesc:
              'Profil domyślny. Zachowuje usługi baseline, ale przyjmuje nowe połączenia przychodzące tylko z zakresów prywatnych, link-local lub loopback. Dostęp wychodzący pozostaje otwarty.',
            restricted: 'Ograniczony',
            restrictedDesc:
              'Lokalny HTTPS i SSH oraz wychodzące DNS, NTP, syslog i aktualizacje online. DHCP i niezbędny ruch IPv6 pozostają dostępne. WebRTC jest zablokowany.',
            paranoid: 'Paranoidalny',
            paranoidDesc:
              'Lokalny dostęp tylko przez HTTPS. Blokuje SSH, HTTP, aktualizacje online i inne wychodzące funkcje sieciowe. Wgrywanie aktualizacji offline i już przygotowane instalacje pozostają dostępne.',
            current: 'Aktualny',
            default: 'Domyślny',
            localOnly: 'Tylko lokalnie',
            openTag: 'Przychodzące otwarte',
            httpsRequiredTag: 'Wymaga HTTPS',
            outboundOpen: 'Wychodzące otwarte',
            outboundLimited: 'Wychodzące ograniczone',
            httpsOnly: 'Tylko HTTPS'
          },
          moderate: {
            apply: 'Przełącz na Umiarkowany'
          },
          restricted: {
            enable: 'Włącz Ograniczony',
            confirmTitle: 'Włączyć tryb zapory Ograniczony?',
            confirmDesc:
              'Dostęp administracyjny przychodzący zostanie ograniczony do źródeł private IPv4, IPv4 link-local/loopback, IPv6 link-local lub IPv6 loopback dla HTTPS i SSH. Publiczne zakresy źródłowe nie są dozwolone. Wychodzące DNS, NTP, zdalny syslog, aktualizacje online, DHCP, istniejące połączenia i niezbędny ruch sterujący IPv6 pozostaną dostępne. WebRTC/ICE UDP oraz pozostały ruch przychodzący i wychodzący zostaną zablokowane.'
          },
          paranoid: {
            enable: 'Włącz Paranoidalny',
            confirmTitle: 'Włączyć tryb zapory Paranoidalny?',
            confirmDesc:
              'Dostępny pozostanie tylko HTTPS ze źródeł private IPv4, IPv4 link-local/loopback, IPv6 link-local lub IPv6 loopback. Publiczne zakresy źródłowe nie są dozwolone. SSH, HTTP, mDNS, NTP, pobieranie z GitHub i pozostały ruch przychodzący/wychodzący zostaną zablokowane z wyjątkiem minimalnego DHCP/ruchu sterującego IPv6.'
          },
          baseline: {
            apply: 'Przełącz na Podstawowy',
            confirmTitle: 'Przełączyć na otwarty tryb Podstawowy?',
            confirmDesc:
              'Usługa zapory pozostanie aktywna, ale ograniczenie local-only dla zakresów źródłowych zostanie zdjęte. Publiczne zakresy źródłowe mogą dotrzeć do wystawionych usług NanoKVM, jeśli sieć je routuje.'
          },
          rules: {
            title: 'Aktualne reguły',
            empty: 'Brak reguł'
          }
        },
        saveChanges: 'Zapisz zmiany',
        unsaved: 'Niezapisane zmiany'
      },
      systemLog: {
        saveFailed: 'Nie udało się zapisać ustawień logów',
        saved: 'Ustawienia logów zapisane',
        invalidHost: 'Wprowadź host serwera syslog',
        logLoadFailed: 'Nie udało się wczytać logów',
        save: 'Zapisz',
        test: 'Wyślij log testowy',
        testSent: 'Log testowy wysłany',
        testFailed: 'Nie udało się wysłać logu testowego',
        remote: {
          title: 'Zdalne logowanie',
          forward: 'Przekazuj dziennik systemowy',
          description: 'Przekazuj komunikaty systemowe do zdalnego serwera',
          host: 'Serwer',
          hostDesc: 'Nazwa hosta lub adres IPv4 serwera syslog',
          port: 'Port',
          protocol: 'Port UDP serwera syslog'
        },
        local: {
          title: 'Bufor dziennika systemowego',
          description:
            'Aktualne logi są przechowywane w RAM w {{path}}, aby unikać zapisów na kartę SD',
          priority: 'Minimalny priorytet',
          priorityDesc: 'Minimalna pilność komunikatu do zapisania',
          buffer: 'Rozmiar bufora',
          bufferDesc: 'Rozmiar dziennika, przy którym plik jest rotowany',
          rotations: 'Rotacje',
          rotationsDesc: 'Liczba przechowywanych rotowanych plików dziennika',
          compact: 'Kompaktowe wyjście',
          compactDesc: 'Pomiń nazwę hosta i facility w każdym wierszu',
          stripTimestamps: 'Usuń znaczniki czasu',
          stripTimestampsDesc: 'Usuń znaczniki czasu dodane przez nadawcę; syslog dodaje własne'
        },
        kernel: {
          title: 'Logowanie kernela',
          enabled: 'Przekazuj log kernela',
          enabledDesc: 'Zapisuj komunikaty kernela w dzienniku systemowym',
          consoleLevel: 'Poziom konsoli',
          consoleLevelDesc: 'Minimalna pilność komunikatu kernela do wypisania na konsoli'
        },
        viewer: {
          title: 'Dziennik systemowy',
          refresh: 'Odśwież',
          empty: 'Brak wpisów logu',
          truncated: 'Wyświetlane są tylko najnowsze dane logu',
          linesUnit: 'linii'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Krytyczny',
          '3': '3 - Błąd',
          '4': '4 - Ostrzeżenie',
          '5': '5 - Uwaga',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Wszystko'
        }
      },
      user: {
        title: 'Użytkownik'
      },
      networking: {
        title: 'Sieć'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Szyfrowany tunel',
        device: 'To urządzenie',
        description: 'Połącz się z tym KVM przez tunel WireGuard',
        unavailable: 'WireGuard nie jest zainstalowany na tym urządzeniu',
        blocked: 'Tryb zapory Paranoidalny blokuje WireGuard',
        needsKey: 'Ustaw klucz prywatny przed włączeniem WireGuard',
        saved: 'Zapisano ustawienia WireGuard',
        save: 'Zapisz zmiany',
        unsaved: 'Niezapisane zmiany',
        invalid: 'Sprawdź zaznaczone pola',
        invalidAddress: 'Wpisz adres z maską, na przykład 10.0.0.1/24',
        invalidKey: 'Wpisz 44-znakowy klucz WireGuard',
        invalidEndpoint: 'Wpisz nazwę hosta lub adres IP',
        invalidPort: 'Wpisz port od 1 do 65535',
        invalidRanges: 'Użyj zakresów IPv4, takich jak 10.0.0.0/24, a nie 0.0.0.0/0',
        status: {
          connected: 'Połączono',
          waiting: 'Oczekiwanie na peer',
          stopped: 'Zatrzymano',
          handshake: 'Ostatni handshake {{time}}'
        },
        privateKey: {
          title: 'Klucz prywatny',
          description: 'Pozostaje na tym urządzeniu i nigdy więcej nie jest wyświetlany',
          set: 'Ustawiony',
          notSet: 'Nie ustawiono',
          setBtn: 'Ustaw',
          generate: 'Generuj',
          remove: 'Usuń',
          modalTitle: 'Ustaw klucz prywatny',
          modalDescription:
            'Klucz jest zapisywany na tym urządzeniu i nigdy więcej nie jest wyświetlany',
          placeholder: 'Wklej klucz prywatny',
          generateConfirmTitle: 'Wygenerować nowy klucz prywatny?',
          generateConfirmDesc:
            'Obecny klucz przestanie działać. Następnie dodaj nowy klucz publiczny do peera.',
          removeConfirmTitle: 'Usunąć klucz prywatny?',
          removeConfirmDesc:
            'WireGuard zostanie wyłączony i pozostanie wyłączony do czasu ustawienia nowego klucza.'
        },
        publicKey: {
          title: 'Klucz publiczny',
          description: 'Dodaj go do konfiguracji peera'
        },
        address: {
          title: 'Adres',
          description: 'Adres KVM w tunelu i jego maska'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Klucz publiczny',
          publicKeyDescription: 'Klucz publiczny peera, z którym się łączysz',
          server: 'Serwer',
          serverDescription: 'Nazwa hosta lub adres IP peera',
          port: 'Port',
          portDescription: 'Port UDP peera, zwykle 51820',
          allowedIps: 'Dozwolone IP',
          allowedIpsDescription: 'Adres lub zakres peera w tunelu, na przykład 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Sekundy między pakietami keepalive, potrzebne za routerem'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Połącz się z tym KVM przez swoją sieć Tailscale',
        service: 'Usługa',
        performance: 'Wydajność',
        memory: {
          title: 'Optymalizacja pamięci',
          tip: 'Utrzymuje niskie zużycie pamięci przez Tailscale, co pomaga na urządzeniu z małą ilością pamięci RAM. Uruchom ponownie Tailscale, aby zmiana zaczęła obowiązywać.'
        },
        swap: {
          title: 'Plik wymiany',
          tip: 'Jeśli po włączeniu optymalizacji pamięci problemy nadal występują, spróbuj włączyć plik wymiany',
          sizeTip:
            'Ustawia to rozmiar pliku na 128MB; możesz go zmienić w Ustawienia > System > Wydajność'
        },
        restartTitle: 'Uruchom ponownie Tailscale',
        restartDesc: 'Uruchamia ponownie usługę',
        restartBtn: 'Uruchom ponownie',
        restart: 'Uruchomić ponownie Tailscale?',
        stopTitle: 'Zatrzymaj Tailscale',
        stopBtn: 'Zatrzymaj',
        stop: 'Zatrzymać Tailscale?',
        stopDesc: 'Zatrzymuje usługę i uniemożliwia jej uruchamianie przy starcie systemu',
        loading: 'Ładowanie...',
        notInstall: 'Nie znaleziono Tailscale, zainstaluj go',
        install: 'Instaluj',
        installing: 'Instalowanie',
        failed: 'Instalowanie nie powiodło się',
        retry: 'Odśwież stronę i spróbuj ponownie lub zainstaluj ręcznie.',
        download: 'Pobierz',
        package: 'pakiet instalacyjny',
        unzip: 'i wypakuj pliki',
        upTailscale: 'Prześlij tailscale do NanoKVM w katalogu /usr/bin/',
        upTailscaled: 'Prześlij tailscaled do NanoKVM w katalogu /usr/sbin/',
        refresh: 'Odśwież obecną stronę',
        notRunning: 'Tailscale nie działa. Rozpocznij, aby kontynuować.',
        run: 'Rozpocznij',
        notLogin:
          'Urządzenie nie zostało jeszcze powiązane. Zaloguj się i powiąż to urządzenie ze swoim kontem.',
        urlPeriod: 'Ten URL jest ważny przez 10 minut',
        login: 'Zaloguj',
        loginSuccess: 'Zalogowanie pomyślne',
        deviceName: 'Nazwa urządzenia',
        deviceIP: 'Adres IP urządzenia',
        account: 'Konto',
        logout: 'Wyloguj',
        logoutDesc: 'Czy na pewno chcesz się wylogować?',
        uninstall: 'Odinstaluj Tailscale',
        uninstallDesc: 'Czy na pewno chcesz odinstalować Tailscale?',
        okBtn: 'Tak',
        cancelBtn: 'Nie'
      },
      update: {
        title: 'Aktualizacje',
        currentVersion: 'Bieżąca wersja',
        latestVersion: 'Najnowsza wersja',
        queryFailed: 'Uzyskanie wersji nie powiodło się',
        updateFailed: 'Aktualizacja nie powiodła się',
        paranoidBlocked: 'Aktualizacje online są blokowane przez tryb zapory Paranoidalny',
        paranoidBlockedDesc:
          'Sprawdzanie GitHub i pobieranie wymagają dostępu wychodzącego do sieci. Przesyłanie offline i już przygotowane instalacje pozostają dostępne.',
        available: 'Aktualizacja jest dostępna. Czy na pewno chcesz dokonać aktualizacji?',
        updating: 'Aktualizacja rozpoczęta',
        confirm: 'Potwierdź',
        cancel: 'Anuluj',
        badge: {
          checking: 'Sprawdzanie',
          latest: 'Aktualne',
          available: 'Dostępna aktualizacja',
          failed: 'Sprawdzenie nie powiodło się',
          local: 'Lokalna'
        },
        application: {
          title: 'Aplikacja'
        },
        system: {
          queryFailed: 'Nie udało się pobrać wersji systemu',
          appUpdateRequired:
            'Zaktualizuj aplikację do wersji {{version}}, zanim zainstalujesz tę aktualizację systemu',
          requiredAppVersion: 'Wymagana wersja aplikacji',
          downloadFailed: 'Pobieranie lub weryfikacja nie powiodły się',
          available: 'Dostępna jest aktualizacja systemu bazowego.',
          downloading: 'Pobieranie i weryfikacja aktualizacji systemu...',
          downloadVerify: 'Pobierz i zweryfikuj',
          installing: 'Instalowanie przygotowanej aktualizacji systemu...',
          install: 'Zainstaluj',
          installFailed: 'Instalacja nie powiodła się',
          installConfirmTitle: 'Zainstalować aktualizację systemu?',
          installConfirmDesc:
            'Zastąpi to pliki systemu bazowego ze zweryfikowanego pakietu. Wymagany będzie restart.',
          rawInstallConfirmDesc:
            'Ten zweryfikowany pakiet zapisze obrazy raw boot/rootfs na partycje karty SD i automatycznie uruchomi urządzenie ponownie. Zapis może potrwać kilka minut; utrzymuj zasilanie.',
          rawInstallWarning:
            'Dla raw aktualizacji partycji nie ma automatycznego rollbacku. Jeśli rozruch się nie powiedzie, odzyskaj kartę SD ręcznie.',
          rawWaitTitle: 'Instalowanie aktualizacji systemu',
          rawWaitWriting: 'Zapisywanie nowego systemu na karcie SD',
          rawWaitRestarting:
            'Urządzenie uruchamia się ponownie. Ta strona załaduje się ponownie, gdy urządzenie wróci.',
          rawWaitDesc:
            'To potrwa około trzech minut. Pozostaw zasilanie podłączone i nie zamykaj tej strony.',
          rawWaitSlow:
            'To trwa dłużej, niż oczekiwano. Poczekaj jeszcze kilka minut, zanim odłączysz zasilanie.',
          rebootRequired: 'Restart jest wymagany, aby aktywować ten stan systemu.',
          rollingBack: 'Wycofywanie aktualizacji systemu...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback przygotowany',
          rollbackFailed: 'Rollback nie powiódł się',
          rollbackConfirmTitle: 'Wycofać aktualizację systemu?',
          rollbackConfirmDesc:
            'Przywróci to pliki z najnowszej kopii zapasowej aktualizacji systemu. Wymagany będzie restart.',
          stagedDesc:
            'Aktualizacja systemu została pobrana i zweryfikowana, możesz ją teraz zainstalować',
          refresh: 'Odśwież',
          releaseNotes: 'Informacje o wydaniu',
          systemVersion: 'Wersja systemu',
          kernel: 'Kernel',
          stagedVersion: 'Wersja przygotowana',
          archive: 'Archiwum',
          requiredFree: 'Wymagane wolne miejsce',
          fileCount: 'Pliki',
          rawImages: 'Obrazy raw',
          progress: 'Postęp',
          progressMessage: 'Komunikat postępu',
          pendingVersion: 'Wersja oczekująca',
          bootHealth: 'Stan rozruchu',
          healthy: 'Zdrowy',
          unhealthy: 'Wymaga uwagi',
          rollbackBackup: 'Kopia rollbacku'
        },
        offline: {
          title: 'Prześlij pakiet aplikacji',
          desc: 'Zainstaluj pakiet aplikacji z tego komputera. Potem serwer uruchomi się ponownie.',
          installTitle: 'Zainstalować aktualizację aplikacji?',
          installDesc:
            'Aplikacja zostanie zastąpiona, a serwer uruchomi się ponownie. Trzeba będzie zalogować się ponownie.'
        },
        local: {
          title: 'Prześlij pakiet systemowy',
          desc: 'Zainstaluj pakiet systemowy z tego komputera. Jeden plik zawiera archiwum i jego podpisane metadane.',
          choose: 'Wybierz plik',
          invalidFile: 'Wybierz pakiet z rozszerzeniem .tar lub .tar.gz.',
          diskTitle: 'Wyłączyć dysk wirtualny?',
          diskWarn:
            'Pakiet jest zapisywany w /data, które jest tylko do odczytu, gdy dysk wirtualny jest włączony. Po jego wyłączeniu komputer straci dostęp do /data. Kontynuować?',
          uploading: 'Wysyłanie',
          verifying: 'Weryfikowanie i przygotowywanie pakietu',
          keyTitle: 'Lokalny klucz aktualizacji',
          keyDesc:
            'Klucz publiczny w formacie PEM, który może podpisywać samodzielnie zbudowane pakiety',
          keyNone: 'Nie ustawiono klucza',
          keySet: 'Ustaw klucz',
          keyRemove: 'Usuń',
          signer: 'Podpisał',
          section: 'Aktualizacje lokalne',
          keyRequired: 'Wymagany klucz lokalny'
        }
      },
      account: {
        title: 'Konto',
        webAccount: 'Nazwa konta web',
        password: 'Hasło',
        passwordDesc: 'Zmień hasło używane do logowania do interfejsu webowego',
        updateBtn: 'Zmień',
        logoutBtn: 'Wyloguj',
        logoutDesc: 'Czy na pewno chcesz się wylogować?',
        okBtn: 'Tak',
        cancelBtn: 'Nie',
        session: {
          title: 'Sesja'
        },
        logoutOnClose: {
          title: 'Wyloguj po zamknięciu przeglądarki',
          description: 'Zakończ sesję po zamknięciu przeglądarki zamiast utrzymywać ją otwartą'
        },
        totp: {
          title: 'Uwierzytelnianie dwuskładnikowe',
          authenticator: 'Aplikacja uwierzytelniająca',
          description: 'Wymagaj oprócz hasła kodu czasowego z aplikacji uwierzytelniającej',
          required: 'Wymagane przez zasady',
          disable: 'Wyłącz',
          enableTitle: 'Skonfiguruj uwierzytelnianie dwuskładnikowe',
          enableDescription:
            'Potwierdź hasło, aby kontynuować. Jest wymagane przy każdej zmianie drugiego składnika.',
          continue: 'Kontynuuj',
          disableTitle: 'Wyłączyć uwierzytelnianie dwuskładnikowe?',
          disableDescription:
            'Twoje konto będzie chronione wyłącznie hasłem. Potwierdź hasłem, aby kontynuować.',
          disableFailed: 'Nie udało się wyłączyć uwierzytelniania dwuskładnikowego',
          passwordPlaceholder: 'Obecne hasło',
          enrollFailed: 'Nie udało się rozpocząć konfiguracji',
          invalidCode: 'Ten kod nie pasuje. Spróbuj następnego.',
          scan: 'Zeskanuj to aplikacją uwierzytelniającą.',
          manualEntry: 'Lub wpisz ten klucz ręcznie:',
          codePlaceholder: 'Wpisz 6-cyfrowy kod, aby potwierdzić',
          confirm: 'Potwierdź',
          cancel: 'Anuluj',
          backupTitle: 'Zapisz teraz swoje kody zapasowe',
          backupDescription:
            'Każdy kod działa tylko raz i nie zostanie wyświetlony ponownie. To jedyny sposób na odzyskanie dostępu po utracie aplikacji uwierzytelniającej, a działają one także wtedy, gdy zegar urządzenia nie jest zsynchronizowany.',
          copy: 'Kopiuj',
          copied: 'Skopiowano kody zapasowe',
          savedThem: 'Zapisałem je',
          remaining: 'Pozostało kodów zapasowych: {{remaining}}',
          clockUnsynced:
            'Zegar urządzenia nie jest jeszcze zsynchronizowany. Przed konfiguracją zsynchronizuj czas w Ustawienia > System > Czas.',
          noBackupCodes:
            'Nie pozostały żadne kody zapasowe. Wybierz Wygeneruj, aby utworzyć nowy zestaw.',
          regenerate: 'Nowe kody zapasowe',
          generate: 'Wygeneruj',
          regenerateTitle: 'Wygenerować nowe kody zapasowe?',
          regenerateDescription:
            'Twoje obecne kody zapasowe przestaną działać. Potwierdź hasłem, aby kontynuować.',
          regenerateFailed: 'Nie udało się wygenerować nowych kodów zapasowych',
          download: 'Pobierz',
          copyFailed: 'Nie udało się skopiować. Zaznacz kody i skopiuj je ręcznie.',
          requireTitle: 'Wymagaj uwierzytelniania dwuskładnikowego',
          requireDescription:
            'Zapobiega wyłączeniu uwierzytelniania dwuskładnikowego, a konto bez niego musi je skonfigurować przed użyciem urządzenia',
          requireFailed: 'Nie udało się zmienić wymagania',
          requiredTitle: 'Wymagane jest uwierzytelnianie dwuskładnikowe',
          requiredDescription:
            'To urządzenie wymaga drugiego składnika, ale Twoje konto jeszcze go nie skonfigurowało. Skonfiguruj go teraz, aby kontynuować.'
        }
      }
    },
    picoclaw: {
      title: 'Asystent PicoClaw',
      empty: 'Opisz zadanie, aby zacząć',
      inputPlaceholder: 'Opisz, co chcesz, aby PicoClaw zrobił',
      newConversation: 'Nowa rozmowa',
      processing: 'Przetwarzanie...',
      agent: {
        defaultTitle: 'Asystent ogólny',
        defaultDescription: 'Ogólna pomoc dotycząca czatu, wyszukiwania i przestrzeni roboczej',
        kvmTitle: 'Zdalne sterowanie',
        kvmDescription: 'Sterowanie zdalnym hostem poprzez NanoKVM',
        switched: 'Rola agenta została zmieniona',
        switchFailed: 'Nie udało się zmienić roli agenta'
      },
      send: 'Wyślij',
      cancel: 'Anuluj',
      status: {
        connecting: 'Łączenie z bramką...',
        connected: 'Sesja PicoClaw połączona',
        disconnected: 'Sesja PicoClaw zamknięta',
        stopped: 'Wysłano żądanie zatrzymania',
        runtimeStarted: 'Runtime PicoClaw uruchomiony',
        runtimeStartFailed: 'Nie udało się uruchomić runtime PicoClaw',
        runtimeStopped: 'Runtime PicoClaw zatrzymany',
        runtimeStopFailed: 'Nie udało się zatrzymać runtime PicoClaw'
      },
      connection: {
        runtime: {
          checking: 'Sprawdzam',
          ready: 'Runtime gotowy',
          stopped: 'Runtime zatrzymany',
          unavailable: 'Runtime niedostępny',
          configError: 'Błąd konfiguracji'
        },
        transport: {
          connecting: 'Łączenie',
          connected: 'Połączono'
        },
        run: {
          idle: 'Bezczynność',
          busy: 'Zajęty'
        }
      },
      error: {
        lockHeld: 'PicoClaw jest używany w innym oknie',
        takenOver: 'Inne okno przejęło PicoClaw',
        authFailed: 'PicoClaw odrzucił połączenie',
        upstreamClosed: 'Utracono połączenie z PicoClaw'
      },
      tool: {
        screenshot: 'Robię zrzut ekranu',
        loadImage: 'Oglądam zrzut ekranu',
        actions: 'Steruję hostem',
        generic: 'Używam: {{name}}',
        type: 'Wpisuję {{text}}',
        hotkey: 'Naciskam {{keys}}',
        click: 'Klikam',
        doubleClick: 'Klikam dwukrotnie',
        move: 'Przesuwam mysz',
        drag: 'Przeciągam',
        scroll: 'Przewijam',
        wait: 'Czekam'
      },
      message: {
        toolAction: 'Akcja',
        observation: 'Obserwacja',
        screenshot: 'Zrzut ekranu'
      },
      overlay: {
        locked: 'PicoClaw steruje urządzeniem. Wprowadzanie ręczne zostało wstrzymane.'
      },
      install: {
        install: 'Zainstaluj PicoClaw',
        installing: 'Instalowanie PicoClaw',
        success: 'PicoClaw zainstalowano pomyślnie',
        failed: 'Nie udało się zainstalować PicoClaw',
        uninstalled: 'PicoClaw został pomyślnie odinstalowany',
        uninstallFailed: 'Odinstalowanie nie powiodło się',
        requiredTitle: 'PicoClaw nie jest zainstalowany',
        requiredDescription: 'Zainstaluj PicoClaw przed uruchomieniem runtime PicoClaw.',
        progressDescription: 'PicoClaw jest pobierany i instalowany.',
        stages: {
          preparing: 'Przygotowanie',
          downloading: 'Pobieranie',
          extracting: 'Wypakowywanie',
          verifying: 'Weryfikowanie',
          installing: 'Instalowanie',
          installed: 'Zainstalowano',
          install_timeout: 'Upłynął limit czasu',
          install_failed: 'Niepowodzenie'
        }
      },
      model: {
        requiredTitle: 'Wymagana jest konfiguracja modelu',
        requiredDescription: 'Skonfiguruj model PicoClaw przed użyciem czatu PicoClaw.',
        docsTitle: 'Przewodnik konfiguracji',
        docsDesc: 'Obsługiwane modele i protokoły',
        menuLabel: 'Skonfiguruj model',
        modelIdentifier: 'Identyfikator modelu',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'Bazowy adres URL API',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Klucz API',
        apiKeyPlaceholder: 'Wprowadź klucz API modelu',
        apiKeyKeepPlaceholder: 'Pozostaw puste, aby zachować bieżący klucz',
        save: 'Zapisz',
        saving: 'Zapisywanie',
        saved: 'Konfiguracja modelu została zapisana',
        saveFailed: 'Nie udało się zapisać konfiguracji modelu',
        invalid: 'Identyfikator modelu, bazowy adres URL API i klucz API są wymagane'
      },
      uninstall: {
        confirmTitle: 'Odinstaluj PicoClaw',
        confirmContent:
          'Czy na pewno chcesz odinstalować PicoClaw? Spowoduje to usunięcie pliku wykonywalnego i wszystkich plików konfiguracyjnych.',
        confirmOk: 'Odinstaluj'
      },
      history: {
        title: 'Historia',
        loading: 'Ładowanie sesji...',
        emptyTitle: 'Nie ma jeszcze historii',
        emptyDescription: 'Tutaj pojawią się poprzednie sesje PicoClaw.',
        loadFailed: 'Nie udało się załadować historii sesji',
        deleteFailed: 'Nie udało się usunąć sesji',
        deleteConfirmTitle: 'Usuń sesję',
        deleteConfirmContent: 'Czy na pewno chcesz usunąć „{{title}}”?',
        deleteConfirmOk: 'Usuń',
        messageCount_one: '{{count}} wiadomość',
        messageCount_few: '{{count}} wiadomości',
        messageCount_many: '{{count}} wiadomości',
        messageCount_other: '{{count}} wiadomości'
      },
      config: {
        startRuntime: 'Uruchom PicoClaw',
        stopRuntime: 'Zatrzymaj PicoClaw',
        stopConfirm: 'Zatrzymać PicoClaw?'
      },
      start: {
        title: 'Uruchom PicoClaw',
        description: 'Uruchom runtime, aby rozpocząć korzystanie z asystenta PicoClaw.'
      }
    },
    error: {
      title: 'Wystąpił problem',
      refresh: 'Odśwież'
    },
    fullscreen: {
      toggle: 'Przełącz tryb pełnoekranowy'
    },
    menu: {
      collapse: 'Zwiń menu'
    }
  }
};

export default pl;
