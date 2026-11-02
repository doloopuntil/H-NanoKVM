const cz = {
  translation: {
    common: {
      confirm: 'Potvrdit',
      cancel: 'Zrušit',
      save: 'Uložit',
      discard: 'Zahodit',
      delete: 'Smazat',
      actionFailed: 'Operace se nezdařila',
      loading: 'Načítání nastavení ze zařízení...',
      loadFailed: 'Nastavení se ze zařízení nepodařilo načíst',
      retry: 'Zkusit znovu'
    },
    head: {
      desktop: 'Vzdálená plocha',
      login: 'Přihlášení',
      firstSetup: 'První nastavení',
      changePassword: 'Změna hesla',
      terminal: 'Terminál',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Přihlášení',
      placeholderUsername: 'Zadejte prosím uživatelské jméno',
      placeholderPassword: 'Zadejte prosím heslo',
      placeholderPassword2: 'Zadejte prosím heslo znovu',
      noEmptyUsername: 'Uživatelské jméno nesmí být prázdné',
      noEmptyPassword: 'Heslo nesmí být prázdné',
      invalidUser: 'Neplatné uživatelské jméno nebo heslo',
      locked: 'Příliš mnoho přihlášení, zkuste to znovu později',
      globalLocked: 'Systém je chráněn, zkuste to znovu později',
      error: 'Neočekávaná chyba',
      changePassword: 'Změnit heslo',
      changePasswordDesc:
        'Pro bezpečnost vašeho zařízení prosím změňte heslo pro přihlášení na webu',
      differentPassword: 'Hesla se neshodují',
      illegalUsername: 'Uživatelské jméno obsahuje nepovolené znaky',
      illegalPassword: 'Heslo musí mít alespoň 8 znaků a nesmí obsahovat uvozovky ani lomítka',
      forgetPassword: 'Zapomenuté heslo',
      ok: 'OK',
      cancel: 'Zrušit',
      loginButtonText: 'Přihlášení',
      setupTitle: 'Vytvořit účet správce',
      setupDescription:
        'Na tomto zařízení ještě není webový účet. Pro pokračování vytvořte první účet správce.',
      setupRecovery: 'Pokud toto heslo ztratíte, obnova vyžaduje přepsání SD karty',
      setupButtonText: 'Vytvořit účet',
      tips: {
        hardenedRecovery:
          'Tento Hardened image nepodporuje reset hesla tlačítkem BOOT. Pokud heslo ztratíte, přepište SD kartu a vytvořte nový účet.',
        change1: 'Upozorňujeme, že tato akce změní následující hesla:',
        change2: 'Heslo pro webové přihlášení',
        change3: 'Heslo systémového uživatele root pro přihlášení přes SSH'
      },
      placeholderCurrentPassword: 'Aktuální heslo',
      placeholderNewPassword: 'Nové heslo',
      wrongCurrentPassword: 'Aktuální heslo není správné',
      totp: {
        title: 'Dvoufázové ověření',
        prompt: 'Zadejte 6místný kód z ověřovací aplikace',
        backupPrompt: 'Zadejte jeden ze svých záložních kódů',
        noEmptyCode: 'Zadejte kód',
        placeholderCode: '6místný kód',
        placeholderBackup: 'Záložní kód',
        verifyButtonText: 'Ověřit',
        useBackupCode: 'Použít záložní kód',
        useAuthenticator: 'Použít kód z ověřovací aplikace',
        cancel: 'Zpět',
        invalidCode: 'Tento kód není platný. Zkuste to znovu.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Nastavit Wi-Fi pro NanoKVM',
      success: 'Přejděte k zařízení a zkontrolujte stav sítě NanoKVM',
      failed: 'Operace selhala, zkuste to znovu',
      invalidMode:
        'Aktuální režim nepodporuje nastavení sítě. Přejděte do svého zařízení a povolte konfigurační režim Wi-Fi.',
      confirmBtn: 'Ok',
      finishBtn: 'Dokončeno',
      ap: {
        authTitle: 'Vyžaduje se ověření',
        authDescription: 'Pokračujte zadáním hesla AP',
        authFailed: 'Neplatné heslo AP',
        passPlaceholder: 'Heslo AP',
        verifyBtn: 'Ověřte'
      }
    },
    screen: {
      scale: 'Měřítko',
      title: 'Obrazovka',
      video: 'Režim videa',
      videoDirectTips: 'Chcete-li používat tento režim, povolte HTTPS v "Nastavení > Síť > Služby"',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC je v režimech firewallu Omezený a Paranoidní vypnuto',
      transferRunningTitle: 'Probíhá přenos obrazu',
      transferRunningDesc:
        'Změna režimu videa znovu načte stránku, čímž se zruší probíhající nahrávání nebo stahování obrazu.',
      transferRunningOk: 'Změnit režim',
      resolution: 'Rozlišení',
      auto: 'Automatické',
      autoTips:
        'Při určitých rozlišeních může docházet k trhání obrazu nebo posunu myši, proto upravte rozlišení vzdáleného hostitele nebo vypněte automatický režim',
      fps: 'FPS',
      customizeFps: 'Přizpůsobit',
      quality: 'Kvalita',
      qualityLossless: 'Bezeztrátový',
      qualityHigh: 'Vysoký',
      qualityMedium: 'Střední',
      qualityLow: 'Nízký',
      frameDetect: 'Detekce snímků',
      frameDetectTip:
        'Porovnává snímky a zastaví odesílání videa, dokud se obrazovka vzdáleného hostitele nemění',
      resetHdmi: 'Resetovat HDMI',
      webrtcConnectionFailed: {
        title: 'Připojení WebRTC se nezdařilo',
        description: 'Zkontrolujte síťové připojení nebo přepněte režim videa'
      },
      captureStatus: {
        hdmiError: 'Chyba obrazu HDMI',
        unsupportedResolution: 'Aktuální rozlišení není podporováno',
        retrieving: 'Načítá se obraz...',
        changingResolution: 'Přepíná se rozlišení...',
        updateFailed: 'Obraz se teď nemůže aktualizovat',
        videoError: 'Chyba zobrazení videa',
        noHdmi: 'Nebyl zjištěn signál HDMI',
        unavailable: 'Obraz teď nelze zobrazit'
      }
    },
    keyboard: {
      title: 'Klávesnice',
      paste: 'Vložit',
      tips: 'Podporovány jsou pouze standardní písmena a symboly klávesnice',
      placeholder: 'Text k vložení',
      local: 'Mobilní klávesnice',
      virtual: 'Klávesnice na obrazovce',
      readClipboard: 'Přečíst ze schránky',
      clipboardPermissionDenied:
        'Oprávnění ke schránce bylo odepřeno, povolte přístup do schránky v prohlížeči',
      clipboardReadError: 'Nepodařilo se přečíst schránku',
      dropdownEnglish: 'Anglicky',
      dropdownGerman: 'Německy',
      dropdownFrench: 'Francouzsky',
      dropdownRussian: 'Rusky',
      dropdownKorean: 'Korejsky',
      dropdownJapanese: 'Japonsky',
      localInput: 'Vstup z klávesnice mobilu',
      shortcut: {
        title: 'Zkratky',
        custom: 'Vlastní',
        capture: 'Kliknutím sem zachytíte zkratku',
        clear: 'Vymazat',
        save: 'Uložit',
        captureTips:
          'Zachycení systémových kláves, například klávesy Windows, vyžaduje oprávnění pro celou obrazovku',
        enterFullScreen: 'Přepnout režim celé obrazovky'
      },
      leaderKey: {
        title: 'Klávesa Leader',
        desc: 'Obejít omezení prohlížeče a odeslat systémové zkratky přímo vzdálenému hostiteli',
        howToUse: 'Jak používat',
        simultaneous: {
          title: 'Simultánní režim',
          desc1: 'Stiskněte a podržte klávesu Leader a poté stiskněte zkratku.',
          desc2: 'Intuitivní, ale může být v rozporu se systémovými zkratkami.'
        },
        sequential: {
          title: 'Sekvenční režim',
          desc1:
            'Stiskněte klávesu Leader → postupně stiskněte zkratku → znovu stiskněte klávesu Leader.',
          desc2: 'Vyžaduje více kroků, ale zcela se vyhne systémovým konfliktům.'
        },
        enable: 'Povolit klávesu Leader',
        tip: 'Když je tato klávesa nastavena jako klávesa Leader, slouží pouze jako spouštěč zkratek a ztrácí své výchozí chování.',
        placeholder: 'Stiskněte klávesu Leader',
        shiftRight: 'Pravý Shift',
        ctrlRight: 'Pravý Ctrl',
        metaRight: 'Pravý Win',
        recorder: {
          rec: 'REC',
          activate: 'Aktivovat klávesy',
          input: 'Stiskněte zkratku'
        }
      }
    },
    mouse: {
      title: 'Myš',
      cursor: 'Styl kurzoru',
      default: 'Výchozí kurzor',
      cell: 'Kurzor buňky',
      text: 'Textový kurzor',
      grab: 'Chytnout kurzor',
      hide: 'Skrýt kurzor',
      mode: 'Režim myši',
      absolute: 'Absolutní režim',
      relative: 'Relativní režim',
      direction: 'Směr kolečka',
      scrollUp: 'Přejděte nahoru',
      scrollDown: 'Přejděte dolů',
      speed: 'Rychlost kolečka',
      sensitivity: 'Rychlost ukazatele',
      sensitivityDesc:
        'Pro desktopový relativní režim: nižší hodnoty omezují drift způsobený akcelerací myši hosta',
      fast: 'Rychle',
      slow: 'Pomalu',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Pohybujte se kdekoli v oblasti KVM; vzdálený kurzor si mezi dotyky drží polohu a zůstává synchronizovaný s absolutním HID'
      },
      requestPointer: 'Používá se relativní režim, kliknutím na plochu získáte kurzor myši',
      resetHid: 'Resetovat HID',
      hidOnly: {
        title: 'Režim HID-Only',
        desc: 'Pokud myš nebo klávesnice přestanou reagovat a reset HID nepomůže, může jít o problém s kompatibilitou mezi NanoKVM a hostitelem.',
        tip1: 'Zapnutím režimu HID-Only se odpojí virtuální disk a virtuální síť',
        tip2: 'V režimu HID-Only je připojování obrazů zakázáno',
        tip3: 'NanoKVM se po přepnutí režimů automaticky restartuje',
        enable: 'Zapnout režim HID-Only',
        disable: 'Vypnout režim HID-Only'
      }
    },
    image: {
      title: 'Obrázky',
      loading: 'Načítání...',
      empty: 'Nic nenalezeno',
      mountMode: 'Připojit jako',
      massStorage: 'Velkokapacitní úložiště',
      cdRom: 'CD-ROM',
      mountFailed: 'Připojení se nezdařilo',
      mountDesc:
        'V některých systémech je nutné před připojením obrazu vysunout virtuální disk na vzdáleném hostiteli',
      diskOnWarn:
        'Připojením obrazu se virtuální disk vypne, takže počítač už nebude mít přístup k /data. Pokračovat?',
      diskOffWarn:
        'Virtuální disk je vypnutý a pro připojení obrazu je nutné ho zapnout. USB zařízení v počítači se znovu vyhledají. Pokračovat?',
      unmountFailed: 'Odpojení se nezdařilo',
      unmountDesc:
        'Na některých systémech se musíte před odpojením obrazu ručně vysunout ze vzdáleného hostitele',
      forceEject: 'Vynutit vysunutí',
      forceEjectConfirm:
        'Hostitel zamkl optickou jednotku. Vynucené vysunutí na chvíli odpojí virtuální zařízení USB, takže se klávesnice a myš mohou krátce odpojit. Pokračovat?',
      usbReconnect: 'Znovu připojit USB',
      usbReconnectConfirm:
        'USB gadget znovu připojte jen tehdy, pokud vzdálený host nezaznamenal změnu média. Klávesnice a myš se mohou krátce odpojit.',
      usbReconnectSuccess: 'USB znovu připojeno',
      usbReconnectFailed: 'Opětovné připojení USB selhalo',
      addImage: 'Přidat obraz',
      fromUrl: 'Z adresy URL',
      fromFile: 'Ze souboru',
      turnOff: 'Vypnout',
      eject: 'Vysunout',
      download: 'Stáhnout',
      upload: 'Nahrát',
      mountTitle: 'Připojit obraz',
      deleteTitle: 'Smazat obraz',
      deleteConfirm: 'Opravdu chcete smazat tento obrázek?',
      tips: {
        title: 'Jak nahrát',
        usb1: 'Připojte NanoKVM k vašemu počítači přes USB.',
        usb2: 'Ujistěte se, že je virtuální disk připojen v Nastavení > Zařízení > Virtuální disk.',
        usb3: 'Otevřete virtuální disk na vašem počítači a zkopírujte soubor s obrazem do kořenového adresáře virtuálního disku.',
        scp1: 'Ujistěte se, že jsou NanoKVM a váš počítač ve stejné místní síti.',
        scp2: 'Otevřete terminál na vašem počítači a použijte příkaz SCP pro nahrání souboru s obrazem do adresáře /data na zařízení NanoKVM.',
        scp3: 'Příklad: scp cesta-k-vašemu-obrazu root@ip-nanokvm:/data',
        tfCard: 'SD karta',
        tf1: 'Tato metoda je podporována na systémech Linux',
        tf2: 'Vyjměte kartu SD z NanoKVM. U verze FULL nejprve rozeberte pouzdro.',
        tf3: 'Vložte SD kartu do čtečky karet a připojte ji k vašemu počítači.',
        tf4: 'Zkopírujte soubor s obrazem do adresáře /data na SD kartě.',
        tf5: 'Vložte SD kartu zpět do NanoKVM.'
      }
    },
    script: {
      title: 'Skripty',
      upload: 'Nahrát',
      run: 'Spustit',
      runBackground: 'Spustit na pozadí',
      runFailed: 'Spuštění se nezdařilo',
      delDesc: 'Opravdu chcete tento soubor smazat?',
      delete: 'Smazat',
      close: 'Zavřít'
    },
    terminal: {
      title: 'Terminál',
      nanokvm: 'Terminál NanoKVM',
      serial: 'Terminál sériového portu',
      unlockTitle: 'Odemknout terminál',
      unlockDesc: 'Pro spuštění terminálové relace zadejte heslo webového účtu',
      unlock: 'Odemknout',
      unlockFailed: 'Terminál se nepodařilo odemknout',
      invalidCredentials: 'Neplatné uživatelské jméno nebo heslo',
      locked: 'Příliš mnoho pokusů, zkuste to později',
      sessionClosed: 'Terminálová relace byla ukončena. Pro opětovné připojení znovu odemkněte.',
      sessionError: 'Připojení terminálu selhalo. Odemkněte znovu a zkuste to.',
      serialPort: 'Sériový port',
      serialPortPlaceholder: 'Například /dev/ttyS1',
      baudrate: 'Přenosová rychlost',
      parity: 'Parita',
      parityNone: 'Žádné',
      parityEven: 'Sudá',
      parityOdd: 'Lichá',
      flowControl: 'Řízení toku',
      flowControlNone: 'Žádné',
      flowControlSoft: 'Softwarové',
      flowControlHard: 'Hardwarové',
      dataBits: 'Datové bity',
      stopBits: 'Stop bity',
      open: 'Otevřít terminál'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Odesílání příkazu...',
      sent: 'Příkaz odeslán',
      input: 'MAC adresa',
      ok: 'OK'
    },
    download: {
      input: 'URL vzdáleného obrazu',
      ok: 'OK',
      disabled:
        'Obrazy se teď nedají stáhnout ani nahrát, protože úložiště není zapisovatelné. Pokud je připojený obraz, odpojte ho a poté vypněte virtuální disk, aby bylo úložiště znovu zapisovatelné.',
      diskShared: 'Vypněte virtuální disk, abyste mohli používat stahování obrazů',
      mountedImage: 'Tento obraz je připojen, před nahráním souboru se stejným názvem jej odpojte',
      diskOff: 'Vypnout virtuální disk',
      uploadbox: 'Přetáhněte soubor sem nebo kliknutím vyberte',
      inputfile: 'Soubor obrazu',
      NoISO: 'Žádný obraz',
      complete: 'Stahování dokončeno',
      uploadComplete: 'Nahrání dokončeno',
      downloading: 'Stahování',
      uploading: 'Nahrávání',
      failed: 'Přenos selhal',
      uploadFailed: 'Nahrání selhalo',
      stalled: 'Přenos se zastavil, zkontrolujte připojení a zkuste to znovu',
      canceled: 'Nahrání zrušeno',
      downloadCanceled: 'Stahování zrušeno',
      cancel: 'Zrušit',
      remoteDisabled: 'Vzdálené stahování ISO je vypnuté v Nastavení > Uživatel > Předvolby',
      remoteFailed: 'Vzdálené stahování ISO selhalo',
      sha256: 'Volitelný kontrolní součet SHA-256',
      sha256Placeholder: 'Zadejte 64znakový kontrolní součet SHA-256',
      invalidSHA256: 'SHA-256 musí být 64znakový hexadecimální řetězec',
      checksumFailed: 'Stažení se nezdařilo: ověření SHA-256 selhalo'
    },
    power: {
      title: 'Napájení',
      showConfirm: 'Potvrzení',
      showConfirmTip: 'Výkonové operace vyžadují další potvrzení',
      reset: 'Resetovat',
      powerShort: 'Tlačítko napájení: krátký stisk',
      powerLong: 'Tlačítko napájení: dlouhý stisk',
      resetConfirm: 'Provést operaci resetování?',
      powerConfirm: 'Provést operaci napájení?',
      okBtn: 'Ano',
      cancelBtn: 'Ne'
    },
    settings: {
      title: 'Nastavení',
      about: {
        title: 'O aplikaci',
        information: 'Informace',
        ip: 'IP adresa',
        mdns: 'Místní adresa',
        application: 'Verze aplikace',
        uptime: 'Doba běhu',
        community: 'Komunita',
        credit: 'Postaveno na <a1>NanoKVM</a1> od Sipeed a <a2>Hardened NanoKVM</a2> od woffko',
        hostname: 'Název zařízení',
        changeIn: 'Změníte to v {{path}}',
        updateIn: 'Aktualizujete to v {{path}}',
        toggleIn: 'Zapnout nebo vypnout lze v {{path}}'
      },
      appearance: {
        title: 'Předvolby',
        display: 'Zobrazení',
        language: 'Jazyk',
        languageDesc: 'Vyberte jazyk rozhraní',
        webTitle: 'Název webu',
        webTitleDesc: 'Přizpůsobte název webové stránky',
        layoutMode: 'Rozvržení rozhraní',
        layoutModeDesc: 'Použít v tomto prohlížeči rozvržení pro telefon/dotykové ovládání',
        layoutAuto: 'Automaticky',
        layoutMobile: 'Telefon',
        menuBar: {
          title: 'Panel nabídek',
          mode: 'Režim zobrazení',
          modeDesc: 'Zobrazení panelu nabídek na obrazovce',
          modeOff: 'Vypnuto',
          modeAuto: 'Automatické skrytí',
          modeAlways: 'Vždy viditelné',
          keyboardLedStatus: 'Indikátory zámku klávesnice',
          keyboardLedStatusDesc:
            'Zobrazit stav Num Lock, Caps Lock a Scroll Lock vzdáleného počítače',
          icons: 'Ikony podnabídky',
          iconsDesc: 'Zobrazení ikon podnabídky na liště nabídek',
          terminalWarningTitle: 'Povolit webový terminál?',
          terminalWarningDesc:
            'Terminál otevře root shell v prohlížeči. Povolujte jen v důvěryhodné síti a po dokončení ho vypněte.',
          terminalWarningConfirm: 'Povolit',
          remoteDownload: 'Stáhnout vzdálené ISO',
          remoteDownloadWarningTitle: 'Povolit vzdálené stahování ISO?',
          remoteDownloadWarningDesc:
            'NanoKVM stáhne ISO z URL a zapíše ho do /data. Povolujte jen pro důvěryhodné URL a po dokončení vypněte.',
          remoteDownloadWarningConfirm: 'Povolit'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Stav zámků vzdálené klávesnice',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Zapnuto',
        off: 'Vypnuto',
        unknown: 'Neznámé'
      },
      device: {
        title: 'Zařízení',
        minutes: 'min',
        sections: {
          general: 'Obecné',
          connectivity: 'Připojení',
          hostConnection: 'Připojení k hostiteli',
          inputOutput: 'Vstup a výstup'
        },
        oled: {
          title: 'Časový limit OLED',
          description: 'Vypnout OLED displej po',
          keepOn: 'Nechat OLED zapnutý',
          keepOnDescription: 'Nikdy nevypínat obrazovku OLED'
        },
        ssh: {
          description: 'Povolit vzdálený přístup SSH',
          tip: 'Před zapnutím této možnosti nastavte silné heslo v Účet > Heslo'
        },
        swap: {
          title: 'Swap',
          description: 'Používat odkládací soubor, když dochází paměť',
          size: 'Velikost swapu',
          sizeDescription: 'Nastavte velikost odkládacího souboru',
          tip: 'Povolení této funkce může zkrátit životnost vaší SD karty'
        },
        mouseJiggler: {
          title: 'Mouse jiggler',
          description: 'Zabraňte spánku vzdáleného hostitele',
          disable: 'Zakázat',
          absolute: 'Absolutní režim',
          relative: 'Relativní režim'
        },
        sessionLock: {
          title: 'Zamknout relaci při nečinnosti',
          description: 'Po této době znovu vyžadovat přihlášení'
        },
        mdns: {
          description: 'Povolit službu zjišťování mDNS',
          tip: 'Umožňuje připojit se k zařízení přes jeho název .local. Není potřeba, pokud se připojujete přes IP adresu nebo váš DNS už název hostitele překládá.'
        },
        hdmi: {
          description: 'Povolit výstup HDMI/monitor',
          idleTimeoutTitle: 'Časový limit nečinnosti snímání',
          idleTimeoutDescription: 'Zastavit snímání HDMI po době bez aktivních diváků'
        },
        hidOnly: 'Režim HID-Only',
        hidOnlyDesc:
          'Zlepšuje kompatibilitu s hostitelem, pokud myš nebo klávesnice přestanou reagovat',
        hidOnlyTip:
          'Režim HID-Only přestane emulovat virtuální zařízení a ponechá pouze základní ovládání HID',
        disk: 'Virtuální disk',
        diskDesc: 'Připojit SD kartu ke vzdálenému hostiteli',
        diskLocked: 'Vypnuto, dokud je připojen obraz, a zapnutím se připojení zruší',
        diskEnable: 'Zapnout virtuální disk',
        networkChange: 'Změnit virtuální síť',
        diskCancelMount: 'Zapnutím virtuálního disku se zruší připojený obraz. Pokračovat?',
        networkCancelMount:
          'Změna virtuální sítě restartuje připojení USB. Tím se zruší připojený obraz a zapne virtuální disk. Pokračovat?',
        diskTransferRunning:
          'Probíhá přenos obrazu. Před zapnutím virtuálního disku počkejte, až skončí.',
        network: 'Virtuální síť',
        networkDesc: 'Připojit virtuální síťovou kartu na vzdáleném hostiteli',
        usbWakeup: 'Probuzení přes USB',
        usbWakeupDesc: 'Povolí klávesnici nebo myši probudit vzdálený host',
        usbWakeupTip: 'Vypněte, pokud host zapisuje opakované zprávy USB wakeup',
        hostname: {
          description: 'Název tohoto zařízení v síti',
          reachable: 'Dostupné v místní síti jako {{address}}'
        },
        rebootRequired: 'Nutný restart',
        rebootPending: 'Nutný restart kvůli: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Aktualizace systému'
        },
        reboot: 'Restartujte',
        rebootDesc: 'Opravdu chcete restartovat NanoKVM?',
        poweroff: 'Vypnout',
        poweroffDesc: 'Opravdu chcete vypnout NanoKVM? Nebude dostupné, dokud ho znovu nezapnete.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Připojení',
        configuration: 'Konfigurace',
        wifi: {
          title: 'Wi-Fi',
          description: 'Nastavit Wi-Fi',
          apMode: 'Režim AP je povolen, připojte se k Wi-Fi naskenováním QR kódu',
          connect: 'Připojit Wi-Fi',
          connectDesc1: 'Zadejte SSID sítě a heslo',
          disconnect: 'Opravdu chcete síť odpojit?',
          disconnectBtn: 'Odpojit',
          connected: 'Připojeno',
          ssid: 'Název',
          password: 'Heslo',
          joinBtn: 'Připojit',
          cancelBtn: 'Zrušit'
        },
        tls: {
          description: 'Povolit protokol HTTPS',
          tip: 'Upozornění: Použití HTTPS může zvýšit latenci, zejména v režimu videa MJPEG',
          restartTitle: 'Server se restartuje',
          restartDesc:
            'Změna protokolu restartuje server. Prohlížeč se po {{seconds}} sekundách přepne na novou adresu:',
          restartOk: 'Použít a restartovat',
          confirmTitle: 'Ponechat nový protokol?',
          confirmDesc:
            'Server nyní běží na {{protocol}}. Za {{seconds}} sekund se vrátí k předchozímu protokolu, pokud jej neponecháte.',
          confirmKeep: 'Ponechat',
          confirmRevert: 'Vrátit zpět',
          reverting:
            'Vrací se předchozí protokol. Prohlížeč se na tuto adresu přepne po {{seconds}} sekundách.',
          certTitle: 'Ponechat nový certifikát?',
          certDesc:
            'Server nyní používá nový certifikát. Pokud ho neponecháte, za {{seconds}} sekund se vrátí k předchozímu.',
          certReverted: 'Předchozí certifikát je zpět'
        },
        certificate: {
          title: 'Certifikát',
          desc: 'Odkud pochází certifikát HTTPS',
          requesting: 'Žádost o certifikát probíhá',
          selfSigned: 'Podepsaný sám sebou',
          domain: 'Doména',
          domainDesc: 'Musí odkazovat na toto zařízení a port 443 musí být dostupný z internetu',
          domainTailscale: 'Nastaveno službou Tailscale pro toto zařízení',
          domainInvalid: 'Použijte úplný název domény, například kvm.example.org',
          email: 'E-mail',
          emailDesc: "Volitelné, pro oznámení od Let's Encrypt",
          emailInvalid: 'Použijte adresu ve tvaru jmeno@example.org',
          validUntil: 'Platný do',
          valid: 'Platný',
          expiresSoon: 'Brzy vyprší',
          expired: 'Vypršel',
          lastRenewal: 'Poslední obnovení',
          renewed: 'Obnoveno',
          failed: 'Selhalo',
          renewNow: 'Obnovit nyní',
          renewNowDesc: 'Vyžádat nový certifikát bez čekání',
          renewBtn: 'Obnovit',
          applyTitle: 'Změnit certifikát',
          applyOk: 'Použít',
          applyAcme:
            "Zařízení žádá Let's Encrypt o certifikát. Let's Encrypt se kvůli ověření připojí z internetu k portu 443, což může trvat až minutu. Pokud žádost selže, zůstane v používání stávající certifikát.",
          applyTailscale:
            'Zařízení získá certifikát od služby Tailscale, což může trvat až minutu. Pokud žádost selže, zůstane v používání stávající certifikát.',
          applySelfSigned:
            'Zařízení se vrátí ke svému vlastnímu certifikátu podepsanému sám sebou. Prohlížeče na něj upozorňují.',
          openTitle: 'Otevřít novou adresu',
          openDesc:
            'Certifikát je připraven. Otevřete níže uvedenou adresu a přihlaste se, abyste ho ponechali. Bez vašeho potvrzení do 3 minut se vrátí předchozí certifikát.',
          openOk: 'Otevřít',
          blockedClock: 'Certifikáty nelze vyžádat, dokud nejsou synchronizovány hodiny zařízení',
          blockedParanoid: 'Režim firewallu Paranoidní blokuje žádosti o certifikáty',
          tailscaleUnavailable:
            'Tailscale neběží, nebo nejsou pro tailnet povoleny certifikáty HTTPS'
        },
        dns: {
          title: 'DNS',
          description: 'Nastavit DNS servery pro NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Nastavte adresaci IPv4 pro kabelové rozhraní',
          servers: 'Servery',
          dhcp: 'DHCP',
          manual: 'Ručně',
          apply: 'Použít',
          invalid: 'Zadejte platnou adresu IPv4 nebo IPv6',
          invalidNetwork: 'Zadejte platnou adresu IPv4, masku podsítě a směrovač',
          saved: 'Nastavení DNS uloženo',
          redirecting: 'Nastavení sítě uloženo. Otevírám novou adresu...',
          saveFailed: 'Nastavení DNS se nepodařilo uložit',
          unsaved: 'Neuložené změny',
          maxServers: 'Je povoleno maximálně {{count}} DNS serverů',
          dhcpServersDescription: 'DNS servery jsou automaticky získávány z DHCP',
          manualServersDescription: 'Podporovány jsou servery IPv4 i IPv6',
          interface: 'Rozhraní',
          ipAddress: 'IP adresa',
          subnetMask: 'Maska podsítě',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Konfigurace adresování IPv6 pro kabelové rozhraní',
          disabled: 'Zakázáno',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Ručně',
          interface: 'Rozhraní',
          state: 'Stav',
          router: 'Směrovač',
          addresses: 'Adresy',
          dhcpv6Client: 'Klient DHCPv6',
          notInstalled: 'Není nainstalováno',
          ipAddress: 'Adresa IPv6',
          prefix: 'Prefix',
          invalidManual: 'Zadejte platnou adresu IPv6, prefix a směrovač',
          clientMissing:
            'Klient DHCPv6 není nainstalován. Nejprve nainstalujte odpovídající raw aktualizaci systému.',
          saved: 'Nastavení IPv6 uloženo',
          saveFailed: 'Nastavení IPv6 se nepodařilo uložit',
          unsaved: 'Neuložené změny'
        }
      },
      system: {
        title: 'Systém',
        performance: {
          processor: 'Procesor',
          overdrive: {
            title: 'Přetaktování',
            description:
              'Spustit s vyššími frekvencemi procesoru a videa podle specifikace výrobce',
            tip: 'Pokud se zařízení s přetaktováním nespustí, je nutné znovu zapsat kartu SD',
            unavailable: 'Není součástí tohoto systémového obrazu',
            keepTitle: 'Ponechat overdrive po aktualizaci',
            keepDescription:
              'Aktualizace systému vrátí zařízení ke standardním taktům, pokud to není zapnuto',
            confirmTitle: 'Zapnout přetaktování?',
            confirmText:
              'Pokud se zařízení s přetaktováním nespustí, musíte kartu SD znovu zapsat, abyste ho obnovili. Změna se použije po příštím restartu.',
            confirmOk: 'Zapnout'
          },
          watchdog: {
            title: 'Hardwarový watchdog',
            description: 'Zařízení se automaticky restartuje, když přestane reagovat',
            unavailable: 'Není součástí tohoto systémového obrazu',
            notRunning: 'Momentálně neběží',
            lastRestart: 'Poslední restart',
            lastRestartCaption: 'Nejnovější důvod, proč se systém restartoval',
            reasonPowerOn: 'Zapnutí napájení',
            reasonRestart: 'Vyžádaný restart',
            reasonWatchdog: 'Reset watchdogem',
            reasonOverheat: 'Ochrana proti přehřátí',
            reasonUnknown: 'Neznámé'
          },
          recovery: 'Obnova',
          memory: 'Paměť'
        },
        monitor: {
          processorClock: 'Subsystém CPU',
          videoClock: 'Subsystém videa',
          videoClockCaption: 'Frekvence hodin videa',
          cpuClockCaption: 'Frekvence hodin CPU',
          overdrive: 'Přetaktování',
          temperature: 'Teplota',
          lastMinutes: 'Posledních 5 minut',
          ram: 'RAM',
          off: 'Vypnuto',
          ramHistory: 'Využití RAM',
          cpuLoad: 'Zatížení CPU',
          cpuLoadCaption: 'Uživatel {{user}} procent, systém {{system}} procent',
          cpuUtilization: 'Využití CPU',
          swapUtilization: 'Využití odkládacího prostoru',
          swapSizeLastMinutes: '{{size}}, posledních 5 minut',
          percent: '{{percent}} procent',
          percentUsed: '{{percent}} procent využito',
          sizeOf: '{{used}} z {{total}}',
          systemPartition: 'Systémový oddíl',
          dataPartition: 'Datový oddíl',
          unavailable: 'Není k dispozici',
          noReadings: 'Zařízení nevrací žádná měření',
          refresh: 'Aktualizuje se každou sekundu, dokud je tato stránka otevřená'
        },
        sections: {
          time: 'Čas',
          firewall: 'Firewall',
          systemLog: 'Protokolování',
          performance: 'Výkon',
          monitor: 'Monitor',
          services: 'Služby',
          webInterface: 'Zabezpečený webový přístup'
        },
        time: {
          saveFailed: 'Nepodařilo se uložit nastavení času',
          saved: 'Nastavení času uloženo',
          syncFailed: 'Nepodařilo se synchronizovat čas',
          synced: 'Čas synchronizován',
          invalidServers: 'Zadejte alespoň jeden server NTP',
          maxServers: 'Povoleno je maximálně {{count}} serverů NTP',
          refresh: 'Obnovit',
          syncNow: 'Synchronizovat',
          syncNowDesc: 'Nastavit hodiny podle serverů NTP hned',
          save: 'Uložit',
          ntp: {
            title: 'NTP',
            description: 'Synchronizovat čas zařízení z nastavených serverů NTP'
          },
          networkTime: 'Síťový čas',
          clock: {
            title: 'Hodiny',
            description: 'Nastavit místní časové pásmo používané protokoly a rozhraním',
            current: 'Aktuální čas',
            timezone: 'Časové pásmo'
          },
          servers: {
            title: 'Servery NTP',
            description: 'Použijte výchozí veřejné servery, místní router nebo vlastní servery NTP',
            useRouter: 'Použít router',
            useDefaults: 'Použít výchozí',
            presets: 'Předvolby serverů',
            presetsDesc: 'Nahradí seznam serverů předvolbou'
          }
        },
        firewall: {
          saveFailed: 'Nepodařilo se použít nastavení firewallu',
          saved: 'Nastavení firewallu použito',
          cancel: 'Zrušit',
          refresh: 'Obnovit',
          backends: 'Backendy',
          enableHttpsFirst: 'Před zapnutím režimu firewallu Omezený nebo Paranoidní zapněte HTTPS',
          httpsRequired:
            'Režimy Omezený a Paranoidní jsou vypnuté, dokud není HTTPS zapnuto v Nastavení > Síť > Služby',
          mode: {
            title: 'Režim firewallu',
            baseline: 'Základní',
            baselineDesc:
              'Otevřený profil kompatibility. Firewall běží, ale příchozí zdroje nejsou omezeny. Používejte jej jen v důvěryhodných sítích.',
            moderate: 'Umírněný',
            moderateDesc:
              'Výchozí profil. Zachovává služby profilu Základní, ale nová příchozí spojení přijímá jen ze soukromých, link-local nebo loopback rozsahů. Odchozí přístup zůstává otevřený.',
            restricted: 'Omezený',
            restrictedDesc:
              'HTTPS a SSH jen z lokální sítě plus odchozí DNS, NTP, syslog a online aktualizace. DHCP a nezbytný provoz IPv6 zůstávají dostupné. WebRTC je blokováno.',
            paranoid: 'Paranoidní',
            paranoidDesc:
              'Přístup HTTPS pouze z lokální sítě. Blokuje SSH, HTTP, online aktualizace a další odchozí síťové funkce. Offline nahrání aktualizací a již připravené instalace zůstávají dostupné.',
            current: 'Aktuální',
            default: 'Výchozí',
            localOnly: 'Pouze lokálně',
            openTag: 'Příchozí otevřené',
            httpsRequiredTag: 'Vyžaduje HTTPS',
            outboundOpen: 'Odchozí otevřené',
            outboundLimited: 'Odchozí omezené',
            httpsOnly: 'Pouze HTTPS'
          },
          moderate: {
            apply: 'Přepnout na Umírněný'
          },
          restricted: {
            enable: 'Povolit Omezený',
            confirmTitle: 'Povolit režim Omezený?',
            confirmDesc:
              'Příchozí administrátorský přístup bude omezen na rozsahy private IPv4, IPv4 link-local/loopback, IPv6 link-local nebo IPv6 loopback pro HTTPS a SSH. Veřejné zdrojové rozsahy nejsou povoleny. Odchozí DNS, NTP, vzdálený syslog, online aktualizace, DHCP, navázaná spojení a nezbytný IPv6 řídicí provoz zůstanou dostupné. WebRTC/ICE UDP a ostatní příchozí/odchozí provoz budou blokovány.'
          },
          paranoid: {
            enable: 'Povolit Paranoidní',
            confirmTitle: 'Povolit režim Paranoidní?',
            confirmDesc:
              'Zůstane dostupný pouze HTTPS přístup ze zdrojů private IPv4, IPv4 link-local/loopback, IPv6 link-local nebo IPv6 loopback. SSH, HTTP, mDNS, NTP, stahování z GitHubu a další provoz budou blokovány kromě minimálního DHCP/IPv6 řízení.'
          },
          baseline: {
            apply: 'Přepnout na Základní',
            confirmTitle: 'Přepnout na otevřený režim Základní?',
            confirmDesc:
              'Služba firewallu zůstane aktivní, ale odstraní se omezení pouze na lokální zdrojové rozsahy. Veřejné zdrojové rozsahy se mohou dostat k vystaveným službám NanoKVM, pokud je síť směruje.'
          },
          rules: {
            title: 'Aktuální pravidla',
            empty: 'Žádná pravidla'
          }
        },
        saveChanges: 'Uložit změny',
        unsaved: 'Neuložené změny'
      },
      systemLog: {
        saveFailed: 'Nepodařilo se uložit nastavení protokolu',
        saved: 'Nastavení protokolu uloženo',
        invalidHost: 'Zadejte hostitele syslog serveru',
        logLoadFailed: 'Nepodařilo se načíst protokoly',
        save: 'Uložit',
        test: 'Odeslat testovací protokol',
        testSent: 'Testovací protokol odeslán',
        testFailed: 'Nepodařilo se odeslat testovací protokol',
        remote: {
          title: 'Vzdálené protokolování',
          forward: 'Předávat systémový protokol',
          description: 'Předávat systémové zprávy na vzdálený server',
          host: 'Server',
          hostDesc: 'Název hostitele nebo adresa IPv4 serveru syslog',
          port: 'Port',
          protocol: 'Port UDP serveru syslog'
        },
        local: {
          title: 'Buffer systémového protokolu',
          description:
            'Aktuální protokoly jsou uchovány v RAM v {{path}}, aby se zabránilo zápisům na SD kartu',
          priority: 'Minimální priorita',
          priorityDesc: 'Minimální naléhavost zprávy pro zaznamenání',
          buffer: 'Velikost bufferu',
          bufferDesc: 'Velikost protokolu, při které se soubor rotuje',
          rotations: 'Rotace',
          rotationsDesc: 'Počet uchovávaných rotovaných souborů protokolu',
          compact: 'Kompaktní výstup',
          compactDesc: 'Vynechat z každého řádku název hostitele a facility',
          stripTimestamps: 'Odstranit časové značky',
          stripTimestampsDesc: 'Odebrat časová razítka přidaná odesílatelem; syslog přidá vlastní'
        },
        kernel: {
          title: 'Protokolování kernelu',
          enabled: 'Předávat protokol kernelu',
          enabledDesc: 'Zaznamenávat zprávy kernelu do systémového protokolu',
          consoleLevel: 'Úroveň konzole',
          consoleLevelDesc: 'Minimální naléhavost zprávy kernelu pro výpis na konzoli'
        },
        viewer: {
          title: 'Systémový protokol',
          refresh: 'Obnovit',
          empty: 'Žádné záznamy protokolu',
          truncated: 'Zobrazují se pouze nejnovější data protokolu',
          linesUnit: 'řádků'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Kritické',
          '3': '3 - Chyba',
          '4': '4 - Varování',
          '5': '5 - Oznámení',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Vše'
        }
      },
      user: {
        title: 'Uživatel'
      },
      networking: {
        title: 'Síť'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Šifrovaný tunel',
        device: 'Toto zařízení',
        description: 'Přistupujte k tomuto KVM přes tunel WireGuard',
        unavailable: 'WireGuard není na tomto zařízení nainstalován',
        blocked: 'Režim firewallu Paranoidní blokuje WireGuard',
        needsKey: 'Před zapnutím WireGuardu nastavte privátní klíč',
        saved: 'Nastavení WireGuardu bylo uloženo',
        save: 'Uložit změny',
        unsaved: 'Neuložené změny',
        invalid: 'Zkontrolujte zvýrazněná pole',
        invalidAddress: 'Zadejte adresu s maskou, například 10.0.0.1/24',
        invalidKey: 'Zadejte klíč WireGuard o 44 znacích',
        invalidEndpoint: 'Zadejte název hostitele nebo adresu IP',
        invalidPort: 'Zadejte port od 1 do 65535',
        invalidRanges: 'Použijte rozsahy IPv4 jako 10.0.0.0/24, ne 0.0.0.0/0',
        status: {
          connected: 'Připojeno',
          waiting: 'Čekání na peer',
          stopped: 'Zastaveno',
          handshake: 'Poslední handshake {{time}}'
        },
        privateKey: {
          title: 'Privátní klíč',
          description: 'Zůstává v tomto zařízení a nikdy se znovu nezobrazí',
          set: 'Nastaven',
          notSet: 'Nenastaven',
          setBtn: 'Nastavit',
          generate: 'Vygenerovat',
          remove: 'Odebrat',
          modalTitle: 'Nastavit privátní klíč',
          modalDescription: 'Klíč se uloží v tomto zařízení a už se nikdy nezobrazí',
          placeholder: 'Vložte privátní klíč',
          generateConfirmTitle: 'Vygenerovat nový privátní klíč?',
          generateConfirmDesc:
            'Stávající klíč přestane fungovat. Poté přidejte nový veřejný klíč do peeru.',
          removeConfirmTitle: 'Odebrat privátní klíč?',
          removeConfirmDesc: 'WireGuard se vypne a zůstane vypnutý, dokud nenastavíte nový klíč.'
        },
        publicKey: {
          title: 'Veřejný klíč',
          description: 'Přidejte jej do konfigurace peeru'
        },
        address: {
          title: 'Adresa',
          description: 'Adresa KVM v tunelu a její maska'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Veřejný klíč',
          publicKeyDescription: 'Veřejný klíč peeru, ke kterému se připojujete',
          server: 'Server',
          serverDescription: 'Název hostitele nebo adresa IP peeru',
          port: 'Port',
          portDescription: 'Port UDP peeru, obvykle 51820',
          allowedIps: 'Povolené IP adresy',
          allowedIpsDescription: 'Adresa nebo rozsah peeru v tunelu, například 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Sekundy mezi pakety keepalive, nutné za routerem'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Přistupujte k tomuto KVM přes svou síť Tailscale',
        service: 'Služba',
        performance: 'Výkon',
        memory: {
          title: 'Optimalizace paměti',
          tip: 'Udržuje nízkou spotřebu paměti Tailscale, což pomáhá na zařízení s malou pamětí RAM. Aby se změna projevila, restartujte Tailscale.'
        },
        swap: {
          title: 'Odkládací soubor',
          tip: 'Pokud problémy přetrvávají i po zapnutí optimalizace paměti, zkuste zapnout odkládací soubor',
          sizeTip:
            'Tím se velikost souboru nastaví na 128MB; upravit ji můžete v Nastavení > Systém > Výkon'
        },
        restartTitle: 'Restartovat Tailscale',
        restartDesc: 'Restartuje službu',
        restartBtn: 'Restartovat',
        restart: 'Restartovat Tailscale?',
        stopTitle: 'Zastavit Tailscale',
        stopBtn: 'Zastavit',
        stop: 'Zastavit Tailscale?',
        stopDesc: 'Zastaví službu a zabrání jejímu spuštění při startu systému',
        loading: 'Načítání...',
        notInstall: 'Tailscale nebyl nalezen, prosím nainstalujte jej',
        install: 'Nainstalovat',
        installing: 'Instalace probíhá',
        failed: 'Instalace se nezdařila',
        retry: 'Obnovte stránku a zkuste to znovu, nebo nainstalujte ručně.',
        download: 'Stáhnout',
        package: 'instalační balíček',
        unzip: 'a rozbalit ho',
        upTailscale: 'Nahrajte Tailscale do adresáře NanoKVM /usr/bin/',
        upTailscaled: 'Nahrajte Tailscaled do adresáře NanoKVM /usr/sbin/',
        refresh: 'Obnovit stránku',
        notRunning: 'Tailscale neběží. Chcete-li pokračovat, spusťte jej.',
        run: 'Spustit',
        notLogin:
          'Zařízení nebylo dosud spárováno. Přihlaste se prosím a spárujte toto zařízení s vaším účtem.',
        urlPeriod: 'Tento odkaz je platný po dobu 10 minut',
        login: 'Přihlášení',
        loginSuccess: 'Přihlášení úspěšné',
        deviceName: 'Název zařízení',
        deviceIP: 'IP zařízení',
        account: 'Účet',
        logout: 'Odhlásit se',
        logoutDesc: 'Opravdu se chcete odhlásit?',
        uninstall: 'Odinstalovat Tailscale',
        uninstallDesc: 'Opravdu chcete odinstalovat Tailscale?',
        okBtn: 'Ano',
        cancelBtn: 'Ne'
      },
      update: {
        title: 'Aktualizace',
        currentVersion: 'Aktuální verze',
        latestVersion: 'Nejnovější verze',
        queryFailed: 'Nepodařilo se získat verzi',
        updateFailed: 'Aktualizace se nezdařila',
        paranoidBlocked: 'Online aktualizace jsou blokovány režimem firewallu Paranoidní',
        paranoidBlockedDesc:
          'Kontroly a stahování z GitHubu vyžadují odchozí síťový přístup. Offline nahrání a již připravené instalace zůstávají dostupné.',
        available: 'Je dostupná aktualizace. Opravdu chcete aktualizovat?',
        updating: 'Aktualizace zahájena',
        confirm: 'Potvrdit',
        cancel: 'Zrušit',
        badge: {
          checking: 'Kontrola',
          latest: 'Aktuální',
          available: 'Dostupná aktualizace',
          failed: 'Kontrola selhala',
          local: 'Místní'
        },
        application: {
          title: 'Aplikace'
        },
        system: {
          queryFailed: 'Nepodařilo se získat verzi systému',
          appUpdateRequired:
            'Před instalací této aktualizace systému aktualizujte aplikaci na verzi {{version}}',
          requiredAppVersion: 'Požadovaná verze aplikace',
          downloadFailed: 'Stažení nebo ověření selhalo',
          available: 'Je dostupná aktualizace základního systému.',
          downloading: 'Stahuje a ověřuje se aktualizace systému...',
          downloadVerify: 'Stáhnout a ověřit',
          installing: 'Instaluje se připravená aktualizace systému...',
          install: 'Instalovat',
          installFailed: 'Instalace selhala',
          installConfirmTitle: 'Instalovat aktualizaci systému?',
          installConfirmDesc:
            'Tím se nahradí soubory základního systému z ověřeného balíčku. Bude vyžadován restart.',
          rawInstallConfirmDesc:
            'Tento ověřený balíček zapíše raw image boot/rootfs do oddílů SD karty a automaticky restartuje zařízení. Zápis může trvat několik minut; ponechte napájení připojené.',
          rawInstallWarning:
            'Pro raw aktualizace oddílů není automatický rollback. Pokud boot selže, obnovte SD kartu ručně.',
          rawWaitTitle: 'Instalace aktualizace systému',
          rawWaitWriting: 'Nový systém se zapisuje na kartu SD',
          rawWaitRestarting:
            'Zařízení se restartuje. Tato stránka se znovu načte, až bude zařízení zpět.',
          rawWaitDesc:
            'Trvá to asi tři minuty. Ponechte napájení připojené a tuto stránku nezavírejte.',
          rawWaitSlow:
            'Trvá to déle, než se čekalo. Před odpojením napájení počkejte ještě několik minut.',
          rebootRequired: 'Pro aktivaci tohoto stavu systému je vyžadován restart.',
          rollingBack: 'Provádí se rollback aktualizace systému...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback připraven',
          rollbackFailed: 'Rollback selhal',
          rollbackConfirmTitle: 'Provést rollback aktualizace systému?',
          rollbackConfirmDesc:
            'Tím se obnoví soubory z poslední zálohy aktualizace systému. Bude vyžadován restart.',
          stagedDesc: 'Aktualizace systému byla stažena a ověřena, můžete ji nainstalovat',
          refresh: 'Obnovit',
          releaseNotes: 'Poznámky k vydání',
          systemVersion: 'Verze systému',
          kernel: 'Kernel',
          stagedVersion: 'Připravená verze',
          archive: 'Archiv',
          requiredFree: 'Požadované volné místo',
          fileCount: 'Soubory',
          rawImages: 'Raw image',
          progress: 'Průběh',
          progressMessage: 'Zpráva průběhu',
          pendingVersion: 'Čekající verze',
          bootHealth: 'Stav bootu',
          healthy: 'V pořádku',
          unhealthy: 'Vyžaduje pozornost',
          rollbackBackup: 'Záloha rollbacku'
        },
        offline: {
          title: 'Nahrát balíček aplikace',
          desc: 'Nainstalovat balíček aplikace z tohoto počítače. Poté se server restartuje.',
          installTitle: 'Instalovat aktualizaci aplikace?',
          installDesc:
            'Aplikace bude nahrazena a server se restartuje. Budete se muset znovu přihlásit.'
        },
        local: {
          title: 'Nahrát systémový balíček',
          desc: 'Nainstalovat systémový balíček z tohoto počítače. Jeden soubor obsahuje archiv a jeho podepsaná metadata.',
          choose: 'Vybrat soubor',
          invalidFile: 'Vyberte balíček s příponou .tar nebo .tar.gz.',
          diskTitle: 'Vypnout virtuální disk?',
          diskWarn:
            'Balíček se ukládá do /data, které je při zapnutém virtuálním disku jen pro čtení. Po vypnutí virtuálního disku už počítač nebude mít přístup k /data. Pokračovat?',
          uploading: 'Nahrávání',
          verifying: 'Ověřování a příprava balíčku',
          keyTitle: 'Místní aktualizační klíč',
          keyDesc:
            'Veřejný klíč ve formátu PEM, který smí podepisovat balíčky, které si sami sestavíte',
          keyNone: 'Žádný klíč nenastaven',
          keySet: 'Nastavit klíč',
          keyRemove: 'Odebrat',
          signer: 'Podepsal',
          section: 'Místní aktualizace',
          keyRequired: 'Vyžaduje místní klíč'
        }
      },
      account: {
        title: 'Účet',
        webAccount: 'Název webového účtu',
        password: 'Heslo',
        passwordDesc: 'Změnit heslo používané k přihlášení do webového rozhraní',
        updateBtn: 'Změnit',
        logoutBtn: 'Odhlásit',
        logoutDesc: 'Opravdu se chcete odhlásit?',
        okBtn: 'Ano',
        cancelBtn: 'Ne',
        session: {
          title: 'Relace'
        },
        logoutOnClose: {
          title: 'Odhlásit při zavření prohlížeče',
          description: 'Ukončit relaci po zavření prohlížeče místo jejího ponechání otevřené'
        },
        totp: {
          title: 'Dvoufázové ověření',
          authenticator: 'Ověřovací aplikace',
          description: 'Kromě hesla vyžadovat časově omezený kód z ověřovací aplikace',
          required: 'Vyžadováno zásadami',
          disable: 'Vypnout',
          enableTitle: 'Nastavit dvoufázové ověření',
          enableDescription:
            'Pro pokračování potvrďte své heslo. Vyžaduje se při každé změně druhého faktoru.',
          continue: 'Pokračovat',
          disableTitle: 'Vypnout dvoufázové ověření?',
          disableDescription: 'Váš účet bude chráněn pouze heslem. Pro pokračování potvrďte heslo.',
          disableFailed: 'Dvoufázové ověření se nepodařilo vypnout',
          passwordPlaceholder: 'Aktuální heslo',
          enrollFailed: 'Nastavení se nepodařilo zahájit',
          invalidCode: 'Kód nesouhlasí. Zkuste další.',
          scan: 'Naskenujte to ověřovací aplikací.',
          manualEntry: 'Nebo zadejte tento klíč ručně:',
          codePlaceholder: 'Pro potvrzení zadejte 6místný kód',
          confirm: 'Potvrdit',
          cancel: 'Zrušit',
          backupTitle: 'Uložte si teď záložní kódy',
          backupDescription:
            'Každý kód funguje jen jednou a znovu se nezobrazí. Jsou jedinou cestou zpět, pokud ztratíte ověřovací aplikaci, a fungují i tehdy, když hodiny zařízení nejsou synchronizované.',
          copy: 'Kopírovat',
          copied: 'Záložní kódy byly zkopírovány',
          savedThem: 'Mám je uložené',
          remaining: 'Zbývá záložních kódů: {{remaining}}',
          clockUnsynced:
            'Hodiny zařízení ještě nejsou synchronizované. Před nastavením synchronizujte čas v Nastavení > Systém > Čas.',
          noBackupCodes: 'Nezbývají žádné záložní kódy. Novou sadu vydáte tlačítkem Vygenerovat.',
          regenerate: 'Nové záložní kódy',
          generate: 'Vygenerovat',
          regenerateTitle: 'Vydat nové záložní kódy?',
          regenerateDescription:
            'Vaše stávající záložní kódy přestanou fungovat. Pro pokračování potvrďte heslo.',
          regenerateFailed: 'Nové záložní kódy se nepodařilo vydat',
          download: 'Stáhnout',
          copyFailed: 'Kopírování se nezdařilo. Označte kódy a zkopírujte je ručně.',
          requireTitle: 'Vyžadovat dvoufázové ověření',
          requireDescription:
            'Zabrání vypnutí dvoufázového ověření a účet, který ho nemá, si ho musí před použitím zařízení nastavit',
          requireFailed: 'Požadavek se nepodařilo změnit',
          requiredTitle: 'Dvoufázové ověření je vyžadováno',
          requiredDescription:
            'Toto zařízení vyžaduje druhý faktor, ale váš účet ho dosud nemá nastavený. Nastavte jej nyní a pokračujte.'
        }
      }
    },
    picoclaw: {
      title: 'Asistent PicoClaw',
      empty: 'Popište úlohu a začněte',
      inputPlaceholder: 'Popište, co chcete, aby PicoClaw dělal',
      newConversation: 'Nová konverzace',
      processing: 'Zpracovává se...',
      agent: {
        defaultTitle: 'Obecný asistent',
        defaultDescription: 'Obecná nápověda pro chat, vyhledávání a pracovní prostor',
        kvmTitle: 'Vzdálené ovládání',
        kvmDescription: 'Ovládejte vzdáleného hostitele prostřednictvím NanoKVM',
        switched: 'Role agenta změněna',
        switchFailed: 'Přepnutí role agenta se nezdařilo'
      },
      send: 'Odeslat',
      cancel: 'Zrušit',
      status: {
        connecting: 'Připojování k bráně...',
        connected: 'Relace PicoClaw připojena',
        disconnected: 'Relace PicoClaw uzavřena',
        stopped: 'Požadavek na zastavení byl odeslán',
        runtimeStarted: 'Spuštěno běhové prostředí PicoClaw',
        runtimeStartFailed: 'Selhalo spuštění běhového prostředí PicoClaw',
        runtimeStopped: 'Běhové prostředí PicoClaw zastaveno',
        runtimeStopFailed: 'Zastavení běhového prostředí PicoClaw se nezdařilo'
      },
      connection: {
        runtime: {
          checking: 'Kontrola',
          ready: 'Běhové prostředí připraveno',
          stopped: 'Běhové prostředí zastaveno',
          unavailable: 'Běhové prostředí není k dispozici',
          configError: 'Chyba konfigurace'
        },
        transport: {
          connecting: 'Připojování',
          connected: 'Připojeno'
        },
        run: {
          idle: 'Nečinný',
          busy: 'Zaneprázdněn'
        }
      },
      error: {
        lockHeld: 'PicoClaw se používá v jiném okně',
        takenOver: 'Jiné okno převzalo PicoClaw',
        authFailed: 'PicoClaw odmítl připojení',
        upstreamClosed: 'Spojení s PicoClaw bylo ztraceno'
      },
      tool: {
        screenshot: 'Pořizuji snímek obrazovky',
        loadImage: 'Prohlížím snímek obrazovky',
        actions: 'Ovládám hostitele',
        generic: 'Používám {{name}}',
        type: 'Píšu {{text}}',
        hotkey: 'Mačkám {{keys}}',
        click: 'Klikám',
        doubleClick: 'Dvojklik',
        move: 'Posouvám myš',
        drag: 'Přetahuji',
        scroll: 'Posouvám obsah',
        wait: 'Čekám'
      },
      message: {
        toolAction: 'Akce',
        observation: 'Pozorování',
        screenshot: 'Snímek obrazovky'
      },
      overlay: {
        locked: 'PicoClaw ovládá zařízení. Ruční zadávání je pozastaveno.'
      },
      install: {
        install: 'Nainstalovat PicoClaw',
        installing: 'Instalace PicoClaw',
        success: 'PicoClaw úspěšně nainstalováno',
        failed: 'Nepodařilo se nainstalovat PicoClaw',
        uninstalled: 'PicoClaw byl úspěšně odinstalován',
        uninstallFailed: 'Odinstalace se nezdařila',
        requiredTitle: 'PicoClaw není nainstalováno',
        requiredDescription: 'Nainstalujte PicoClaw před spuštěním běhového prostředí PicoClaw.',
        progressDescription: 'PicoClaw se stahuje a instaluje.',
        stages: {
          preparing: 'Příprava',
          downloading: 'Stahování',
          extracting: 'Extrakce',
          verifying: 'Ověřování',
          installing: 'Instalace probíhá',
          installed: 'Instalováno',
          install_timeout: 'Vypršel časový limit',
          install_failed: 'Selhalo'
        }
      },
      model: {
        requiredTitle: 'Je vyžadována konfigurace modelu',
        requiredDescription: 'Před použitím chatu PicoClaw nakonfigurujte model PicoClaw.',
        docsTitle: 'Průvodce konfigurací',
        docsDesc: 'Podporované modely a protokoly',
        menuLabel: 'Konfigurace modelu',
        modelIdentifier: 'Identifikátor modelu',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'Základní URL API',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Klíč API',
        apiKeyPlaceholder: 'Zadejte klíč API modelu',
        apiKeyKeepPlaceholder: 'Nechte prázdné pro zachování aktuálního klíče',
        save: 'Uložit',
        saving: 'Ukládání',
        saved: 'Konfigurace modelu uložena',
        saveFailed: 'Nepodařilo se uložit konfiguraci modelu',
        invalid: 'Identifikátor modelu, základní URL API a klíč API jsou povinné'
      },
      uninstall: {
        confirmTitle: 'Odinstalovat PicoClaw',
        confirmContent:
          'Opravdu chcete odinstalovat PicoClaw? Tím smažete spustitelný soubor a všechny konfigurační soubory.',
        confirmOk: 'Odinstalovat'
      },
      history: {
        title: 'Historie',
        loading: 'Načítání relací...',
        emptyTitle: 'Zatím žádná historie',
        emptyDescription: 'Zde se zobrazí předchozí relace PicoClaw.',
        loadFailed: 'Nepodařilo se načíst historii relace',
        deleteFailed: 'Smazání relace se nezdařilo',
        deleteConfirmTitle: 'Smazat relaci',
        deleteConfirmContent: 'Opravdu chcete smazat "{{title}}"?',
        deleteConfirmOk: 'Smazat',
        messageCount_one: '{{count}} zpráva',
        messageCount_few: '{{count}} zprávy',
        messageCount_many: '{{count}} zprávy',
        messageCount_other: '{{count}} zpráv'
      },
      config: {
        startRuntime: 'Spustit PicoClaw',
        stopRuntime: 'Zastavit PicoClaw',
        stopConfirm: 'Zastavit PicoClaw?'
      },
      start: {
        title: 'Spustit PicoClaw',
        description: 'Spusťte běhové prostředí a začněte používat asistenta PicoClaw.'
      }
    },
    error: {
      title: 'Narazili jsme na problém',
      refresh: 'Obnovit'
    },
    fullscreen: {
      toggle: 'Přepnout na celou obrazovku'
    },
    menu: {
      collapse: 'Sbalit nabídku'
    }
  }
};

export default cz;
