const fi = {
  translation: {
    common: {
      confirm: 'Vahvista',
      cancel: 'Peruuta',
      save: 'Tallenna',
      discard: 'Hylkää',
      delete: 'Poista',
      actionFailed: 'Toiminto epäonnistui',
      loading: 'Ladataan asetuksia laitteelta...',
      loadFailed: 'Asetuksia ei voitu ladata laitteelta',
      retry: 'Yritä uudelleen'
    },
    head: {
      desktop: 'Etätyöpöytä',
      login: 'Kirjautuminen',
      firstSetup: 'Ensiasetus',
      changePassword: 'Vaihda salasana',
      terminal: 'Pääte',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Kirjautuminen',
      placeholderUsername: 'Käyttäjätunnus',
      placeholderPassword: 'Salasana',
      placeholderPassword2: 'Syötä salasana uudelleen',
      noEmptyUsername: 'Käyttäjätunnus vaaditaan',
      noEmptyPassword: 'Salasana vaaditaan',
      invalidUser: 'Virheellinen käyttäjätunnus tai salasana',
      locked: 'Liian monta kirjautumisyritystä, yritä myöhemmin uudelleen',
      globalLocked: 'Järjestelmä on suojattu, yritä myöhemmin uudelleen',
      error: 'Odottamaton virhe',
      changePassword: 'Vaihda salasana',
      changePasswordDesc: 'Vaihda salasana laitteen turvallisuuden vuoksi',
      differentPassword: 'Salasanat eivät täsmää',
      illegalUsername: 'Käyttäjätunnuksessa on kiellettyjä merkkejä',
      illegalPassword:
        'Salasanan on oltava vähintään 8 merkkiä eikä se saa sisältää lainausmerkkejä tai kauttaviivoja',
      forgetPassword: 'Unohditko salasanan',
      ok: 'OK',
      cancel: 'Peruuta',
      loginButtonText: 'Kirjaudu',
      setupTitle: 'Luo ylläpitäjätili',
      setupDescription:
        'Tällä laitteella ei ole vielä verkkotiliä. Luo ensimmäinen ylläpitäjätili jatkaaksesi.',
      setupRecovery: 'Jos tämä salasana katoaa, palautus vaatii SD-kortin kirjoittamisen uudelleen',
      setupButtonText: 'Luo tili',
      tips: {
        hardenedRecovery:
          'Tämä Hardened-image ei tue salasanan palautusta BOOT-painikkeella. Jos salasana katoaa, kirjoita SD-kortti uudelleen ja luo uusi tili.',
        change1: 'Huomaa, että tämä toiminto muuttaa seuraavat salasanat:',
        change2: 'Verkkokirjautumisen salasana',
        change3: 'Järjestelmän root-salasana SSH-kirjautumiseen'
      },
      placeholderCurrentPassword: 'Nykyinen salasana',
      placeholderNewPassword: 'Uusi salasana',
      wrongCurrentPassword: 'Nykyinen salasana on väärä',
      totp: {
        title: 'Kaksivaiheinen tunnistautuminen',
        prompt: 'Anna todennussovelluksen 6-numeroinen koodi',
        backupPrompt: 'Anna yksi varakoodeistasi',
        noEmptyCode: 'Anna koodi',
        placeholderCode: '6-numeroinen koodi',
        placeholderBackup: 'Varakoodi',
        verifyButtonText: 'Vahvista',
        useBackupCode: 'Käytä varakoodia',
        useAuthenticator: 'Käytä todennussovelluksen koodia',
        cancel: 'Takaisin',
        invalidCode: 'Koodi ei kelpaa. Yritä uudelleen.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Määritä NanoKVM:n Wi-Fi',
      success: 'Tarkista NanoKVM:n verkon tila laitteen luona',
      failed: 'Toiminto epäonnistui, yritä uudelleen',
      invalidMode:
        'Nykyinen tila ei tue verkon määritystä. Mene laitteen luo ja ota Wi-Fi-määritystila käyttöön.',
      confirmBtn: 'OK',
      finishBtn: 'Valmis',
      ap: {
        authTitle: 'Todennus vaaditaan',
        authDescription: 'Jatka syöttämällä AP-salasana',
        authFailed: 'Virheellinen AP-salasana',
        passPlaceholder: 'AP-salasana',
        verifyBtn: 'Vahvista'
      }
    },
    screen: {
      scale: 'Skaalaus',
      title: 'Näyttö',
      video: 'Videotila',
      videoDirectTips:
        'Ota HTTPS käyttöön kohdassa "Asetukset > Verkko > Palvelut" käyttääksesi tätä tilaa',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC on poistettu käytöstä palomuuritiloissa Rajoitettu ja Paranoidi',
      transferRunningTitle: 'Levykuvan siirto käynnissä',
      transferRunningDesc:
        'Videotilan vaihtaminen lataa sivun uudelleen, mikä keskeyttää käynnissä olevan levykuvan lähetyksen tai latauksen.',
      transferRunningOk: 'Vaihda tila',
      resolution: 'Tarkkuus',
      auto: 'Automaattinen',
      autoTips:
        'Tietyillä tarkkuuksilla voi esiintyä kuvan repeilyä tai hiiren siirtymää, joten muuta etäkoneen tarkkuutta tai poista automaattitila käytöstä',
      fps: 'FPS',
      customizeFps: 'Mukauta',
      quality: 'Laatu',
      qualityLossless: 'Häviötön',
      qualityHigh: 'Korkea',
      qualityMedium: 'Keskitaso',
      qualityLow: 'Matala',
      frameDetect: 'Kehysmuutosten tunnistus',
      frameDetectTip:
        'Vertaa kehyksiä ja pysäyttää videon lähetyksen, kun etäkoneen näyttö ei muutu',
      resetHdmi: 'Nollaa HDMI',
      webrtcConnectionFailed: {
        title: 'WebRTC-yhteys epäonnistui',
        description: 'Tarkista verkkoyhteys tai vaihda videotilaa'
      },
      captureStatus: {
        hdmiError: 'HDMI-näytön virhe',
        unsupportedResolution: 'Nykyistä tarkkuutta ei tueta',
        retrieving: 'Haetaan näyttöä...',
        changingResolution: 'Vaihdetaan tarkkuutta...',
        updateFailed: 'Näyttöä ei voi päivittää juuri nyt',
        videoError: 'Videon näyttövirhe',
        noHdmi: 'HDMI-signaalia ei havaittu',
        unavailable: 'Näyttöä ei voi näyttää juuri nyt'
      }
    },
    keyboard: {
      title: 'Näppäimistö',
      paste: 'Liitä',
      tips: 'Vain tavalliset näppäimistön kirjaimet ja symbolit ovat tuettuja',
      placeholder: 'Liitettävä teksti',
      local: 'Mobiilinäppäimistö',
      virtual: 'Näyttönäppäimistö',
      readClipboard: 'Lue leikepöydältä',
      clipboardPermissionDenied:
        'Leikepöydän käyttöoikeus evätty, salli leikepöydän käyttö selaimessa',
      clipboardReadError: 'Leikepöydän lukeminen epäonnistui',
      dropdownEnglish: 'Englanti',
      dropdownGerman: 'Saksa',
      dropdownFrench: 'Ranska',
      dropdownRussian: 'Venäjä',
      dropdownKorean: 'Korea',
      dropdownJapanese: 'Japani',
      localInput: 'Mobiilinäppäimistön syöte',
      shortcut: {
        title: 'Pikanäppäimet',
        custom: 'Mukautettu',
        capture: 'Tallenna pikanäppäin napsauttamalla tästä',
        clear: 'Tyhjennä',
        save: 'Tallenna',
        captureTips:
          'Järjestelmätason näppäinten, kuten Windows-näppäimen, tallennus vaatii koko näytön luvan',
        enterFullScreen: 'Vaihda koko näytön tilaa'
      },
      leaderKey: {
        title: 'Leader-näppäin',
        desc: 'Ohita selaimen rajoitukset ja lähetä järjestelmän pikanäppäimet suoraan etäkoneelle',
        howToUse: 'Käyttöohje',
        simultaneous: {
          title: 'Samanaikainen tila',
          desc1: 'Pidä Leader-näppäintä painettuna ja paina sitten pikanäppäintä.',
          desc2:
            'Helppokäyttöinen, mutta voi olla ristiriidassa järjestelmän pikanäppäinten kanssa.'
        },
        sequential: {
          title: 'Peräkkäinen tila',
          desc1:
            'Paina Leader-näppäintä → paina pikanäppäimet järjestyksessä → paina Leader-näppäintä uudelleen.',
          desc2: 'Vaatii enemmän vaiheita, mutta välttää järjestelmäristiriidat kokonaan.'
        },
        enable: 'Ota Leader-näppäin käyttöön',
        tip: 'Leader-näppäimeksi määritetty näppäin toimii vain pikanäppäimen käynnistimenä ja menettää normaalin toimintonsa.',
        placeholder: 'Paina Leader-näppäintä',
        shiftRight: 'Oikea Shift',
        ctrlRight: 'Oikea Ctrl',
        metaRight: 'Oikea Win',
        recorder: {
          rec: 'REC',
          activate: 'Aktivoi näppäimet',
          input: 'Paina pikanäppäintä'
        }
      }
    },
    mouse: {
      title: 'Hiiri',
      cursor: 'Kohdistimen tyyli',
      default: 'Oletuskohdistin',
      cell: 'Solukohdistin',
      text: 'Tekstikohdistin',
      grab: 'Tarttumiskohdistin',
      hide: 'Piilota kohdistin',
      mode: 'Hiiritila',
      absolute: 'Absoluuttinen tila',
      relative: 'Suhteellinen tila',
      direction: 'Rullan suunta',
      scrollUp: 'Vieritä ylös',
      scrollDown: 'Vieritä alas',
      speed: 'Rullan nopeus',
      sensitivity: 'Osoittimen nopeus',
      sensitivityDesc:
        'Työpöydän suhteellista tilaa varten: pienemmät arvot vähentävät isännän hiirikiihdytyksestä johtuvaa ajelehtimista',
      fast: 'Nopea',
      slow: 'Hidas',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Liiku missä tahansa KVM-alueella; etäkursori säilyttää sijaintinsa kosketusten välillä ja pysyy synkronoituna absoluuttisen HID:n kanssa'
      },
      requestPointer:
        'Suhteellinen tila on käytössä, napsauta työpöytää saadaksesi hiiriosoittimen',
      resetHid: 'Nollaa HID',
      hidOnly: {
        title: 'HID-Only-tila',
        desc: 'Jos hiiri tai näppäimistö lakkaa reagoimasta eikä HID:n nollaus auta, kyseessä voi olla NanoKVM:n ja isäntälaitteen yhteensopivuusongelma.',
        tip1: 'HID-Only-tilan käyttöönotto irrottaa virtuaalilevyn ja virtuaaliverkon',
        tip2: 'HID-Only-tilassa levykuvien liittäminen on pois käytöstä',
        tip3: 'NanoKVM käynnistyy automaattisesti uudelleen tilan vaihdon jälkeen',
        enable: 'Ota HID-Only-tila käyttöön',
        disable: 'Poista HID-Only-tila käytöstä'
      }
    },
    image: {
      title: 'Levykuvat',
      loading: 'Ladataan...',
      empty: 'Mitään ei löytynyt',
      mountMode: 'Liitä tyyppinä',
      massStorage: 'Massamuisti',
      cdRom: 'CD-ROM',
      mountFailed: 'Liittäminen epäonnistui',
      mountDesc:
        'Joissakin järjestelmissä virtuaalilevy on poistettava etäkoneesta ennen levykuvan liittämistä',
      diskOnWarn:
        'Levykuvan liittäminen sammuttaa virtuaalilevyn, joten tietokone ei enää pääse hakemistoon /data. Jatketaanko?',
      diskOffWarn:
        'Virtuaalilevy on pois päältä ja se on otettava käyttöön levykuvan liittämiseksi. Tietokoneen USB-laitteet tunnistetaan uudelleen. Jatketaanko?',
      unmountFailed: 'Irrottaminen epäonnistui',
      unmountDesc:
        'Joissakin järjestelmissä levykuva on poistettava etäkoneesta käsin ennen irrottamista',
      forceEject: 'Pakota poisto',
      forceEjectConfirm:
        'Etäkone on lukinnut optisen aseman. Pakotettu poisto katkaisee virtuaalisen USB-laitteen yhteyden hetkeksi, joten näppäimistö ja hiiri voivat irrota lyhyesti. Jatketaanko?',
      usbReconnect: 'Yhdistä USB uudelleen',
      usbReconnectConfirm:
        'Yhdistä USB-gadget uudelleen vain, jos etäisäntä ei huomannut median vaihtoa. Näppäimistö ja hiiri voivat katketa hetkeksi.',
      usbReconnectSuccess: 'USB yhdistetty uudelleen',
      usbReconnectFailed: 'USB-uudelleenyhdistys epäonnistui',
      addImage: 'Lisää levykuva',
      fromUrl: 'URL-osoitteesta',
      fromFile: 'Tiedostosta',
      turnOff: 'Sammuta',
      eject: 'Poista',
      download: 'Lataa',
      upload: 'Lataa',
      mountTitle: 'Liitä levykuva',
      deleteTitle: 'Poista levykuva',
      deleteConfirm: 'Haluatko varmasti poistaa tämän levykuvan?',
      tips: {
        title: 'Latausohje',
        usb1: 'Yhdistä NanoKVM tietokoneeseen USB:llä.',
        usb2: 'Varmista, että virtuaalilevy on liitetty kohdassa Asetukset > Laite > Virtuaalilevy.',
        usb3: 'Avaa virtuaalilevy tietokoneella ja kopioi levykuvatiedosto virtuaalilevyn juurihakemistoon.',
        scp1: 'Varmista, että NanoKVM ja tietokone ovat samassa lähiverkossa.',
        scp2: 'Avaa tietokoneella pääte ja lataa levykuvatiedosto NanoKVM:n /data-hakemistoon SCP-komennolla.',
        scp3: 'Esimerkki: scp levykuvan-polku root@nanoKVM-ip:/data',
        tfCard: 'SD-kortti',
        tf1: 'Tätä menetelmää tuetaan Linux-järjestelmissä',
        tf2: 'Ota SD-kortti NanoKVM:stä. FULL-versiossa pura ensin kotelo.',
        tf3: 'Aseta SD-kortti kortinlukijaan ja yhdistä se tietokoneeseen.',
        tf4: 'Kopioi levykuvatiedosto SD-kortin /data-hakemistoon.',
        tf5: 'Aseta SD-kortti NanoKVM:ään.'
      }
    },
    script: {
      title: 'Skriptit',
      upload: 'Lataa',
      run: 'Suorita',
      runBackground: 'Suorita taustalla',
      runFailed: 'Suoritus epäonnistui',
      delDesc: 'Haluatko varmasti poistaa tämän tiedoston?',
      delete: 'Poista',
      close: 'Sulje',
      unlockDesc:
        'Skriptit suoritetaan NanoKVM:ssä root-oikeuksin. Anna verkkotilin salasana ladataksesi tai suorittaaksesi skriptin.',
      terminalRequired:
        'Skriptit tarvitsevat pääsyn verkkopäätteeseen. Ota pääte ensin käyttöön asetuksista.'
    },
    terminal: {
      title: 'Pääte',
      nanokvm: 'NanoKVM-pääte',
      serial: 'Sarjaporttipääte',
      unlockTitle: 'Avaa terminaali',
      unlockDesc: 'Anna verkkotilin salasana käynnistääksesi terminaali-istunnon',
      unlock: 'Avaa',
      unlockFailed: 'Terminaalin avaaminen epäonnistui',
      invalidCredentials: 'Virheellinen käyttäjänimi tai salasana',
      locked: 'Liikaa yrityksiä, yritä myöhemmin uudelleen',
      sessionClosed: 'Terminaali-istunto suljettiin. Avaa uudelleen yhdistääksesi.',
      sessionError: 'Terminaaliyhteys epäonnistui. Avaa uudelleen yrittääksesi.',
      serialPort: 'Sarjaportti',
      serialPortPlaceholder: 'Esimerkiksi /dev/ttyS1',
      baudrate: 'Baudinopeus',
      parity: 'Pariteetti',
      parityNone: 'Ei mitään',
      parityEven: 'Parillinen',
      parityOdd: 'Pariton',
      flowControl: 'Vuonohjaus',
      flowControlNone: 'Ei mitään',
      flowControlSoft: 'Ohjelmistopohjainen',
      flowControlHard: 'Laitteistopohjainen',
      dataBits: 'Databitit',
      stopBits: 'Stop-bitit',
      open: 'Avaa pääte'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Lähetetään komentoa...',
      sent: 'Komento lähetetty',
      input: 'MAC-osoite',
      ok: 'OK'
    },
    download: {
      input: 'Etälevykuvan URL',
      ok: 'OK',
      disabled:
        'Levykuvia ei voi nyt ladata eikä lähettää, koska tallennustila ei ole kirjoitettavissa. Jos levykuva on liitetty, irrota se ja kytke sitten virtuaalilevy pois päältä, jotta tallennustila on taas kirjoitettavissa.',
      diskShared: 'Sammuta virtuaalilevy käyttääksesi levykuvan latausta',
      mountedImage:
        'Tämä levykuva on liitettynä, irrota se ennen samannimisen tiedoston lähettämistä',
      diskOff: 'Sammuta virtuaalilevy',
      uploadbox: 'Pudota tiedosto tähän tai valitse napsauttamalla',
      inputfile: 'Levykuvatiedosto',
      NoISO: 'Ei levykuvaa',
      complete: 'Lataus valmis',
      uploadComplete: 'Lähetys valmis',
      downloading: 'Ladataan',
      uploading: 'Lähetetään',
      failed: 'Siirto epäonnistui',
      uploadFailed: 'Lähetys epäonnistui',
      stalled: 'Siirto pysähtyi, tarkista yhteys ja yritä uudelleen',
      canceled: 'Lähetys peruutettu',
      downloadCanceled: 'Lataus peruttu',
      cancel: 'Peruuta',
      remoteDisabled:
        'ISO-etälataus on poistettu käytöstä kohdassa Asetukset > Käyttäjä > Mieltymykset',
      remoteFailed: 'ISO-etälataus epäonnistui',
      sha256: 'Valinnainen SHA-256-tarkistussumma',
      sha256Placeholder: 'Anna 64-merkkinen SHA-256-tarkistussumma',
      invalidSHA256: 'SHA-256:n on oltava 64-merkkinen heksadesimaalimerkkijono',
      checksumFailed: 'Lataus epäonnistui: SHA-256-tarkistus epäonnistui'
    },
    power: {
      title: 'Virta',
      showConfirm: 'Vahvistus',
      showConfirmTip: 'Virtatoiminnot vaativat lisävahvistuksen',
      reset: 'Nollaa',
      powerShort: 'Virtapainike: lyhyt painallus',
      powerLong: 'Virtapainike: pitkä painallus',
      resetConfirm: 'Suoritetaanko nollaus?',
      powerConfirm: 'Suoritetaanko virtatoiminto?',
      okBtn: 'Kyllä',
      cancelBtn: 'Ei'
    },
    settings: {
      title: 'Asetukset',
      about: {
        title: 'Tietoja',
        information: 'Tiedot',
        ip: 'IP-osoite',
        mdns: 'Paikallinen osoite',
        application: 'Sovelluksen versio',
        uptime: 'Käyttöaika',
        community: 'Yhteisö',
        credit: 'Perustuu Sipeedin <a1>NanoKVM</a1>:ään ja woffkon <a2>Hardened NanoKVM</a2>:ään',
        hostname: 'Laitteen nimi',
        changeIn: 'Muuta kohdassa {{path}}',
        updateIn: 'Päivitä kohdassa {{path}}',
        toggleIn: 'Kytke päälle tai pois kohdassa {{path}}'
      },
      appearance: {
        title: 'Mieltymykset',
        display: 'Näyttö',
        language: 'Kieli',
        languageDesc: 'Valitse käyttöliittymän kieli',
        webTitle: 'Verkkosivun otsikko',
        webTitleDesc: 'Mukauta verkkosivun otsikkoa',
        layoutMode: 'Käyttöliittymän asettelu',
        layoutModeDesc: 'Käytä tässä selaimessa puhelin-/kosketusasettelua',
        layoutAuto: 'Automaattinen',
        layoutMobile: 'Puhelin',
        menuBar: {
          title: 'Valikkopalkki',
          mode: 'Näyttötila',
          modeDesc: 'Näytä valikkopalkki näytöllä',
          modeOff: 'Pois',
          modeAuto: 'Piilota automaattisesti',
          modeAlways: 'Aina näkyvissä',
          keyboardLedStatus: 'Näppäimistön lukitusilmaisimet',
          keyboardLedStatusDesc: 'Näytä etäkoneen Num Lock-, Caps Lock- ja Scroll Lock -tila',
          icons: 'Alavalikon kuvakkeet',
          iconsDesc: 'Näytä alavalikon kuvakkeet valikkopalkissa',
          terminalWarningTitle: 'Otetaanko webterminaali käyttöön?',
          terminalWarningDesc:
            'Terminaali avaa root-shellin selaimessa. Ota käyttöön vain luotetussa verkossa ja poista käytöstä lopuksi.',
          terminalWarningConfirm: 'Ota käyttöön',
          remoteDownload: 'Lataa ISO etänä',
          remoteDownloadWarningTitle: 'Otetaanko ISO-etälataus käyttöön?',
          remoteDownloadWarningDesc:
            'NanoKVM lataa ISO:n URL-osoitteesta ja kirjoittaa sen hakemistoon /data. Ota käyttöön vain luotetuille URL-osoitteille ja poista käytöstä lopuksi.',
          remoteDownloadWarningConfirm: 'Ota käyttöön'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Etänäppäimistön lukitusten tila',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Päällä',
        off: 'Pois',
        unknown: 'Tuntematon'
      },
      device: {
        title: 'Laite',
        minutes: 'min',
        sections: {
          general: 'Yleiset',
          connectivity: 'Yhteydet',
          hostConnection: 'Isäntäyhteys',
          inputOutput: 'Syöte ja tuloste'
        },
        oled: {
          title: 'OLEDin aikakatkaisu',
          description: 'Sammuta OLED-näyttö ajan kuluttua',
          keepOn: 'Pidä OLED päällä',
          keepOnDescription: 'Älä sammuta OLED-näyttöä koskaan'
        },
        ssh: {
          description: 'Ota SSH-etäkäyttö käyttöön',
          tip: 'Aseta vahva salasana kohdassa Tili > Salasana ennen tämän asetuksen käyttöönottoa'
        },
        swap: {
          title: 'Swap',
          description: 'Käytä swap-tiedostoa, kun muisti on vähissä',
          size: 'Swapin koko',
          sizeDescription: 'Aseta swap-tiedoston koko',
          tip: 'Tämän ominaisuuden käyttö voi lyhentää SD-kortin käyttöikää'
        },
        mouseJiggler: {
          title: 'Hiiren liikuttaja',
          description: 'Estä etäkoneen lepotila',
          disable: 'Poista käytöstä',
          absolute: 'Absoluuttinen tila',
          relative: 'Suhteellinen tila'
        },
        sessionLock: {
          title: 'Lukitse istunto, kun ei käytössä',
          description: 'Vaadi kirjautuminen uudelleen tämän ajan jälkeen'
        },
        mdns: {
          description: 'Ota mDNS-löytöpalvelu käyttöön',
          tip: 'Mahdollistaa laitteen tavoittamisen sen .local-nimellä. Ei tarvita, jos yhdistät IP-osoitteella tai DNS ratkaisee jo isäntänimen.'
        },
        hdmi: {
          description: 'Ota HDMI-/monitorilähtö käyttöön',
          idleTimeoutTitle: 'Kaappauksen joutilasaika',
          idleTimeoutDescription: 'Pysäytä HDMI-kaappaus, kun aktiivisia katselijoita ei ole'
        },
        hidOnly: 'HID-Only-tila',
        hidOnlyDesc:
          'Parantaa yhteensopivuutta isäntälaitteen kanssa, jos hiiri tai näppäimistö lakkaa reagoimasta',
        hidOnlyTip:
          'HID-Only-tila lopettaa virtuaalilaitteiden emuloinnin ja säilyttää vain perus-HID-ohjauksen',
        disk: 'Virtuaalilevy',
        diskDesc: 'Liitä SD-kortti etäkoneeseen',
        diskLocked: 'Pois päältä, kun levykuva on liitettynä, ja käyttöönotto peruu liitoksen',
        diskEnable: 'Ota virtuaalilevy käyttöön',
        networkChange: 'Muuta virtuaaliverkkoa',
        diskCancelMount: 'Virtuaalilevyn käyttöönotto peruu liitetyn levykuvan. Jatketaanko?',
        networkCancelMount:
          'Virtuaaliverkon muuttaminen käynnistää USB-yhteyden uudelleen. Tämä peruu liitetyn levykuvan ja ottaa virtuaalilevyn käyttöön. Jatketaanko?',
        diskTransferRunning:
          'Levykuvan siirto on käynnissä. Odota sen päättymistä, ennen kuin otat virtuaalilevyn käyttöön.',
        network: 'Virtuaaliverkko',
        networkDesc: 'Liitä virtuaalinen verkkokortti etäkoneeseen',
        usbWakeup: 'USB-herätys',
        usbWakeupDesc: 'Salli näppäimistön tai hiiren tapahtumien herättää etäisäntä',
        usbWakeupTip: 'Poista käytöstä, jos isäntä kirjaa toistuvia USB wakeup -viestejä',
        hostname: {
          description: 'Tämän laitteen nimi verkossa',
          reachable: 'Tavoitettavissa paikallisverkossa osoitteella {{address}}'
        },
        rebootRequired: 'Vaatii uudelleenkäynnistyksen',
        rebootPending: 'Uudelleenkäynnistys vaaditaan: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Järjestelmäpäivitys'
        },
        reboot: 'Käynnistä uudelleen',
        rebootDesc: 'Haluatko varmasti käynnistää NanoKVM:n uudelleen?',
        poweroff: 'Sammuta',
        poweroffDesc:
          'Haluatko varmasti sammuttaa NanoKVM:n? Siihen ei saa yhteyttä, ennen kuin se käynnistetään uudelleen.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Yhteys',
        configuration: 'Määritys',
        wifi: {
          title: 'Wi-Fi',
          description: 'Määritä Wi-Fi',
          apMode: 'AP-tila on käytössä, yhdistä Wi-Fiin skannaamalla QR-koodi',
          connect: 'Liity Wi-Fiin',
          connectDesc1: 'Syötä verkon SSID ja salasana',
          disconnect: 'Haluatko varmasti katkaista verkkoyhteyden?',
          disconnectBtn: 'Katkaise yhteys',
          connected: 'Yhdistetty',
          ssid: 'Nimi',
          password: 'Salasana',
          joinBtn: 'Liity',
          cancelBtn: 'Peruuta'
        },
        tls: {
          description: 'Ota HTTPS-protokolla käyttöön',
          tip: 'Huomaa: HTTPS voi lisätä viivettä, erityisesti MJPEG-videotilassa',
          restartTitle: 'Palvelin käynnistyy uudelleen',
          restartDesc:
            'Protokollan muutos käynnistää palvelimen uudelleen. Selain siirtyy uuteen osoitteeseen {{seconds}} sekunnin kuluttua:',
          restartOk: 'Käytä ja käynnistä uudelleen',
          confirmTitle: 'Pidetäänkö uusi protokolla?',
          confirmDesc:
            'Palvelin käyttää nyt protokollaa {{protocol}}. Se palaa edelliseen protokollaan {{seconds}} sekunnin kuluttua, ellet pidä sitä.',
          confirmKeep: 'Pidä',
          confirmRevert: 'Palaa takaisin',
          reverting:
            'Palataan edelliseen protokollaan. Selain siirtyy siihen osoitteeseen {{seconds}} sekunnin kuluttua.',
          certTitle: 'Säilytetäänkö uusi varmenne?',
          certDesc:
            'Palvelin käyttää nyt uutta varmennetta. Se palaa edelliseen {{seconds}} sekunnin kuluttua, ellet säilytä uutta.',
          certReverted: 'Edellinen varmenne on takaisin'
        },
        trustedProxies: {
          section: 'Käänteinen välityspalvelin',
          title: 'Luotetut välityspalvelimet',
          description:
            'Käänteiset välityspalvelimet, joiden ilmoittamaan asiakkaan osoitteeseen ja protokollaan laite luottaa',
          tip: 'Luettelossa oleva osoite valitsee asiakkaan osoitteen, jonka kirjautumisraja ja loki tallentavat, joten luettele vain omia välityspalvelimia',
          none: 'Ei mitään',
          edit: 'Muokkaa',
          editRow: 'Muokkaa luetteloa',
          editTitle: 'Muokkaa luotettuja välityspalvelimia',
          editDescription: 'Luettelon muuttaminen vaatii salasanasi',
          dialogDescription:
            'Anna jokaisen käänteisen välityspalvelimen osoite sellaisena kuin tämä laite sen näkee tai alue, kuten 10.0.0.0/24. Luettelossa oleva välityspalvelin kertoo laitteelle, mitä asiakkaan osoitetta ja protokollaa käytetään. Kaikki, minkä se välittää, uskotaan, joten luettele vain omia välityspalvelimia.'
        },
        certificate: {
          title: 'Varmenne',
          desc: 'Mistä HTTPS-varmenne tulee',
          requesting: 'Varmennetta pyydetään',
          selfSigned: 'Itse allekirjoitettu',
          domain: 'Verkkotunnus',
          domainDesc:
            'Pitää osoittaa tähän laitteeseen, ja portin 443 pitää olla tavoitettavissa internetistä',
          domainTailscale: 'Tailscalen tälle laitteelle määrittämä',
          domainInvalid: 'Käytä koko verkkotunnusta, esimerkiksi kvm.example.org',
          email: 'Sähköposti',
          emailDesc: "Valinnainen, Let's Encryptin ilmoituksia varten",
          emailInvalid: 'Käytä osoitetta, kuten nimi@example.org',
          validUntil: 'Voimassa asti',
          valid: 'Voimassa',
          expiresSoon: 'Vanhenee pian',
          expired: 'Vanhentunut',
          lastRenewal: 'Viimeisin uusinta',
          renewed: 'Uusittu',
          failed: 'Epäonnistui',
          renewNow: 'Uusi nyt',
          renewNowDesc: 'Pyydä uusi varmenne odottamatta',
          renewBtn: 'Uusi',
          applyTitle: 'Vaihda varmenne',
          applyOk: 'Käytä',
          applyAcme:
            "Laite pyytää varmennetta Let's Encryptiltä. Let's Encrypt ottaa tarkistusta varten yhteyden porttiin 443 internetistä, mikä voi kestää jopa minuutin. Jos pyyntö epäonnistuu, nykyinen varmenne pysyy käytössä.",
          applyTailscale:
            'Laite hakee varmenteen Tailscalelta, mikä voi kestää jopa minuutin. Jos pyyntö epäonnistuu, nykyinen varmenne pysyy käytössä.',
          applySelfSigned:
            'Laite palaa omaan itse allekirjoitettuun varmenteeseensa. Selaimet varoittavat siitä.',
          openTitle: 'Avaa uusi osoite',
          openDesc:
            'Varmenne on valmis. Avaa alla oleva osoite ja kirjaudu sisään säilyttääksesi sen. Ilman vahvistustasi 3 minuutin kuluessa edellinen varmenne palaa.',
          openOk: 'Avaa',
          blockedClock: 'Varmenteita ei voi pyytää ennen kuin laitteen kello on synkronoitu',
          blockedParanoid: 'Palomuuritila Paranoidi estää varmennepyynnöt',
          tailscaleUnavailable:
            'Tailscale ei ole käynnissä, tai HTTPS-varmenteet eivät ole käytössä tailnetissä'
        },
        dns: {
          title: 'DNS',
          description: 'Määritä NanoKVM:n DNS-palvelimet',
          ipv4Title: 'IPv4',
          ipv4Description: 'Määritä langallisen liitännän IPv4-osoite',
          servers: 'Palvelimet',
          dhcp: 'DHCP',
          manual: 'Manuaalinen',
          apply: 'Käytä',
          invalid: 'Anna kelvollinen IPv4- tai IPv6-osoite',
          invalidNetwork: 'Anna kelvollinen IPv4-osoite, aliverkon peite ja reititin',
          saved: 'DNS-asetukset tallennettu',
          redirecting: 'Verkkoasetukset tallennettu. Avataan uusi osoite...',
          saveFailed: 'DNS-asetusten tallennus epäonnistui',
          unsaved: 'Tallentamattomia muutoksia',
          maxServers: 'Enintään {{count}} DNS-palvelinta sallittu',
          dhcpServersDescription: 'DNS-palvelimet haetaan automaattisesti DHCP:lla',
          manualServersDescription: 'IPv4- ja IPv6-palvelimet ovat tuettuja',
          interface: 'Liitäntä',
          ipAddress: 'IP-osoite',
          subnetMask: 'Aliverkon peite',
          router: 'Reititin'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Määritä langallisen liitännän IPv6-osoite',
          disabled: 'Pois käytöstä',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manuaalinen',
          interface: 'Liitäntä',
          state: 'Tila',
          router: 'Reititin',
          addresses: 'Osoitteet',
          dhcpv6Client: 'DHCPv6-asiakas',
          notInstalled: 'Ei asennettu',
          ipAddress: 'IPv6-osoite',
          prefix: 'Prefiksi',
          invalidManual: 'Anna kelvollinen IPv6-osoite, prefiksi ja reititin',
          clientMissing:
            'DHCPv6-asiakasta ei ole asennettu. Asenna ensin vastaava raw-järjestelmäpäivitys.',
          saved: 'IPv6-asetukset tallennettu',
          saveFailed: 'IPv6-asetusten tallennus epäonnistui',
          unsaved: 'Tallentamattomia muutoksia'
        }
      },
      system: {
        title: 'Järjestelmä',
        performance: {
          processor: 'Suoritin',
          overdrive: {
            title: 'Ylikellotus',
            description:
              'Käynnistä valmistajan määrittämillä korkeammilla suorittimen ja videon kellotaajuuksilla',
            tip: 'Jos laite ei käynnisty ylikellotuksella, SD-kortti on kirjoitettava uudelleen',
            unavailable: 'Ei sisälly tähän järjestelmäkuvaan',
            keepTitle: 'Säilytä overdrive päivitysten jälkeen',
            keepDescription:
              'Järjestelmäpäivitys palauttaa laitteen vakiotaajuuksille, ellei tämä ole päällä',
            confirmTitle: 'Otetaanko ylikellotus käyttöön?',
            confirmText:
              'Jos laite ei käynnisty ylikellotuksella, sinun on kirjoitettava SD-kortti uudelleen sen palauttamiseksi. Muutos tulee voimaan seuraavan uudelleenkäynnistyksen jälkeen.',
            confirmOk: 'Ota käyttöön'
          },
          watchdog: {
            title: 'Laitteistovahtikoira',
            description: 'Käynnistä laite automaattisesti uudelleen, kun se lakkaa vastaamasta',
            unavailable: 'Ei sisälly tähän järjestelmäkuvaan',
            notRunning: 'Ei ole käynnissä tällä hetkellä',
            lastRestart: 'Viimeisin uudelleenkäynnistys',
            lastRestartCaption: 'Viimeisin syy järjestelmän uudelleenkäynnistykseen',
            reasonPowerOn: 'Virran kytkentä',
            reasonRestart: 'Uudelleenkäynnistystä pyydetty',
            reasonWatchdog: 'Vahtikoiran nollaus',
            reasonOverheat: 'Ylikuumenemissuoja',
            reasonUnknown: 'Tuntematon'
          },
          recovery: 'Palautuminen',
          memory: 'Muisti'
        },
        monitor: {
          processorClock: 'CPU-alijärjestelmä',
          videoClock: 'Videoalijärjestelmä',
          videoClockCaption: 'Videon kellotaajuus',
          cpuClockCaption: 'CPU:n kellotaajuus',
          overdrive: 'Ylikellotus',
          temperature: 'Lämpötila',
          lastMinutes: 'Viimeiset 5 minuuttia',
          ram: 'RAM',
          off: 'Pois',
          ramHistory: 'RAM-muistin käyttö',
          cpuLoad: 'Suorittimen kuormitus',
          cpuLoadCaption: 'Käyttäjä {{user}} prosenttia, järjestelmä {{system}} prosenttia',
          cpuUtilization: 'Suorittimen käyttöaste',
          swapUtilization: 'Swapin käyttöaste',
          swapSizeLastMinutes: '{{size}}, viimeiset 5 minuuttia',
          percent: '{{percent}} prosenttia',
          percentUsed: '{{percent}} prosenttia käytössä',
          sizeOf: '{{used}} / {{total}}',
          systemPartition: 'Järjestelmäosio',
          dataPartition: 'Dataosio',
          unavailable: 'Ei saatavilla',
          noReadings: 'Laite ei palauta lukemia',
          refresh: 'Päivittyy sekunnin välein, kun tämä sivu on auki'
        },
        sections: {
          time: 'Aika',
          firewall: 'Palomuuri',
          systemLog: 'Lokitus',
          performance: 'Suorituskyky',
          monitor: 'Valvonta',
          services: 'Palvelut',
          webInterface: 'Suojattu verkkoyhteys'
        },
        time: {
          saveFailed: 'Aika-asetusten tallennus epäonnistui',
          saved: 'Aika-asetukset tallennettu',
          syncFailed: 'Ajan synkronointi epäonnistui',
          synced: 'Aika synkronoitu',
          invalidServers: 'Syötä vähintään yksi NTP-palvelin',
          maxServers: 'Enintään {{count}} NTP-palvelinta sallittu',
          refresh: 'Päivitä',
          syncNow: 'Synkronoi',
          syncNowDesc: 'Aseta kello NTP-palvelimilta nyt',
          save: 'Tallenna',
          ntp: {
            title: 'NTP',
            description: 'Synkronoi laitteen aika määritetyiltä NTP-palvelimilta'
          },
          networkTime: 'Verkkoaika',
          clock: {
            title: 'Kello',
            description: 'Aseta paikallinen aikavyöhyke lokien ja käyttöliittymän käyttöön',
            current: 'Nykyinen aika',
            timezone: 'Aikavyöhyke'
          },
          servers: {
            title: 'NTP-palvelimet',
            description:
              'Käytä julkisia oletuspalvelimia, paikallista reititintä tai omia NTP-palvelimia',
            useRouter: 'Käytä reititintä',
            useDefaults: 'Käytä oletuksia',
            presets: 'Palvelinten esiasetukset',
            presetsDesc: 'Korvaa palvelinluettelo esiasetuksella'
          }
        },
        firewall: {
          saveFailed: 'Palomuuriasetusten käyttöönotto epäonnistui',
          saved: 'Palomuuriasetukset otettu käyttöön',
          cancel: 'Peruuta',
          refresh: 'Päivitä',
          backends: 'Backendit',
          enableHttpsFirst:
            'Ota HTTPS käyttöön ennen palomuuritilan Rajoitettu tai Paranoidi käyttöönottoa',
          httpsRequired:
            'Tilat Rajoitettu ja Paranoidi ovat pois käytöstä, kunnes HTTPS otetaan käyttöön kohdassa Asetukset > Verkko > Palvelut',
          mode: {
            title: 'Palomuuritila',
            baseline: 'Perus',
            baselineDesc:
              'Avoin yhteensopivuusprofiili. Palomuuri on käynnissä, mutta saapuvia lähteitä ei rajoiteta. Käytä vain luotetuissa verkoissa.',
            moderate: 'Kohtuullinen',
            moderateDesc:
              'Oletusprofiili. Säilyttää tilan Perus palvelut, mutta hyväksyy uudet saapuvat yhteydet vain yksityisistä, link-local- tai loopback-alueista. Lähtevä liikenne pysyy avoimena.',
            restricted: 'Rajoitettu',
            restrictedDesc:
              'Vain paikallinen HTTPS ja SSH sekä lähtevä DNS, NTP, syslog ja verkkopäivitykset. DHCP ja välttämätön IPv6-liikenne pysyvät käytettävissä. WebRTC on estetty.',
            paranoid: 'Paranoidi',
            paranoidDesc:
              'Vain paikallinen HTTPS-yhteys. Estää SSH:n, HTTP:n, verkkopäivitykset ja muut lähtevän liikenteen verkko-ominaisuudet. Offline-päivitysten lähetys ja jo valmisteltu asennus pysyvät käytettävissä.',
            current: 'Nykyinen',
            default: 'Oletus',
            localOnly: 'Vain paikallinen',
            openTag: 'Saapuva avoin',
            httpsRequiredTag: 'HTTPS vaaditaan',
            outboundOpen: 'Lähtevä avoin',
            outboundLimited: 'Lähtevä rajoitettu',
            httpsOnly: 'Vain HTTPS'
          },
          moderate: {
            apply: 'Siirry tilaan Kohtuullinen'
          },
          restricted: {
            enable: 'Ota Rajoitettu käyttöön',
            confirmTitle: 'Otetaanko palomuuritila Rajoitettu käyttöön?',
            confirmDesc:
              'Saapuva ylläpitokäyttö rajataan HTTPS:lle ja SSH:lle private IPv4-, IPv4 link-local/loopback-, IPv6 link-local- tai IPv6 loopback-lähdealueisiin. Julkisia lähdealueita ei sallita. Lähtevä DNS, NTP, etä-syslog, verkkopäivitykset, DHCP, muodostetut yhteydet ja välttämätön IPv6-ohjausliikenne pysyvät käytettävissä. WebRTC/ICE UDP ja muu sisään-/ulospäin kulkeva liikenne estetään.'
          },
          paranoid: {
            enable: 'Ota Paranoidi käyttöön',
            confirmTitle: 'Otetaanko palomuuritila Paranoidi käyttöön?',
            confirmDesc:
              'Vain HTTPS-käyttö private IPv4-, IPv4 link-local/loopback-, IPv6 link-local- tai IPv6 loopback-lähdealueilta jää käyttöön. SSH, HTTP, mDNS, NTP, GitHub-lataukset ja muu liikenne estetään lukuun ottamatta vähäistä DHCP/IPv6-ohjausliikennettä.'
          },
          baseline: {
            apply: 'Siirry tilaan Perus',
            confirmTitle: 'Siirrytäänkö avoimeen tilaan Perus?',
            confirmDesc:
              'Palomuuripalvelu pysyy käytössä, mutta vain paikallisiin lähdealueisiin rajoittava sääntö poistuu. Julkiset lähdealueet voivat tavoittaa NanoKVM:n julkaistut palvelut, jos verkko reitittää ne.'
          },
          rules: {
            title: 'Nykyiset säännöt',
            empty: 'Ei sääntöjä'
          }
        },
        saveChanges: 'Tallenna muutokset',
        unsaved: 'Tallentamattomia muutoksia'
      },
      systemLog: {
        saveFailed: 'Lokiasetusten tallennus epäonnistui',
        saved: 'Lokiasetukset tallennettu',
        invalidHost: 'Syötä syslog-palvelimen isäntä',
        logLoadFailed: 'Lokien lataus epäonnistui',
        save: 'Tallenna',
        test: 'Lähetä testiloki',
        testSent: 'Testiloki lähetetty',
        testFailed: 'Testilokin lähetys epäonnistui',
        remote: {
          title: 'Etälokitus',
          forward: 'Välitä järjestelmäloki',
          description: 'Välitä järjestelmäviestit etäpalvelimelle',
          host: 'Palvelin',
          hostDesc: 'Syslog-palvelimen isäntänimi tai IPv4-osoite',
          port: 'Portti',
          protocol: 'Syslog-palvelimen UDP-portti'
        },
        local: {
          title: 'Järjestelmälokin puskuri',
          description:
            'Nykyiset lokit säilytetään RAMissa polussa {{path}}, jotta SD-kortille ei kirjoiteta',
          priority: 'Vähimmäisprioriteetti',
          priorityDesc: 'Pienin kiireellisyys, jolla viesti kirjataan lokiin',
          buffer: 'Puskurin koko',
          bufferDesc: 'Lokin koko, jossa tiedosto kierrätetään',
          rotations: 'Kierrot',
          rotationsDesc: 'Säilytettävien kierrätettyjen lokitiedostojen määrä',
          compact: 'Tiivis tulostus',
          compactDesc: 'Jätä isäntänimi ja facility pois jokaiselta riviltä',
          stripTimestamps: 'Poista aikaleimat',
          stripTimestampsDesc: 'Poista lähettäjän lisäämät aikaleimat; syslog lisää omansa'
        },
        kernel: {
          title: 'Kernel-lokitus',
          enabled: 'Välitä kernel-loki',
          enabledDesc: 'Tallenna kernel-viestit järjestelmälokiin',
          consoleLevel: 'Konsolitaso',
          consoleLevelDesc: 'Pienin kiireellisyys, jolla kernel-viesti tulostetaan konsoliin'
        },
        viewer: {
          title: 'Järjestelmäloki',
          refresh: 'Päivitä',
          empty: 'Ei lokimerkintöjä',
          truncated: 'Vain uusimmat lokitiedot näytetään',
          linesUnit: 'riviä'
        },
        level: {
          '1': '1 - Hälytys',
          '2': '2 - Kriittinen',
          '3': '3 - Virhe',
          '4': '4 - Varoitus',
          '5': '5 - Huomautus',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Kaikki'
        }
      },
      user: {
        title: 'Käyttäjä'
      },
      networking: {
        title: 'Verkko'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Salattu tunneli',
        device: 'Tämä laite',
        description: 'Ota yhteys tähän KVM-laitteeseen WireGuard-tunnelin kautta',
        unavailable: 'WireGuardia ei ole asennettu tähän laitteeseen',
        blocked: 'Palomuuritila Paranoidi estää WireGuardin',
        needsKey: 'Aseta yksityinen avain ennen WireGuardin käynnistämistä',
        saved: 'WireGuard-asetukset tallennettu',
        save: 'Tallenna muutokset',
        unsaved: 'Tallentamattomia muutoksia',
        invalid: 'Tarkista korostetut kentät',
        invalidAddress: 'Anna osoite peitteineen, esimerkiksi 10.0.0.1/24',
        invalidKey: 'Anna 44-merkkinen WireGuard-avain',
        invalidEndpoint: 'Anna isäntänimi tai IP-osoite',
        invalidPort: 'Anna portti väliltä 1–65535',
        invalidRanges: 'Käytä IPv4-alueita, kuten 10.0.0.0/24, älä 0.0.0.0/0',
        status: {
          connected: 'Yhdistetty',
          waiting: 'Odotetaan peeriä',
          stopped: 'Pysäytetty',
          handshake: 'Viimeisin kättely {{time}}'
        },
        privateKey: {
          title: 'Yksityinen avain',
          description: 'Pysyy tässä laitteessa, eikä sitä näytetä enää koskaan',
          set: 'Asetettu',
          notSet: 'Ei asetettu',
          setBtn: 'Aseta',
          generate: 'Luo',
          remove: 'Poista',
          modalTitle: 'Aseta yksityinen avain',
          modalDescription: 'Avain tallennetaan tähän laitteeseen, eikä sitä näytetä enää koskaan',
          placeholder: 'Liitä yksityinen avain',
          generateConfirmTitle: 'Luodaanko uusi yksityinen avain?',
          generateConfirmDesc:
            'Nykyinen avain lakkaa toimimasta. Lisää uusi julkinen avain sen jälkeen peerille.',
          removeConfirmTitle: 'Poistetaanko yksityinen avain?',
          removeConfirmDesc:
            'WireGuard sammutetaan, ja se pysyy pois päältä, kunnes uusi avain on asetettu.'
        },
        publicKey: {
          title: 'Julkinen avain',
          description: 'Lisää se peerin asetuksiin'
        },
        address: {
          title: 'Osoite',
          description: 'KVM-laitteen osoite tunnelissa ja sen peite'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Julkinen avain',
          publicKeyDescription: 'Peerin julkinen avain, johon yhdistät',
          server: 'Palvelin',
          serverDescription: 'Peerin isäntänimi tai IP-osoite',
          port: 'Portti',
          portDescription: 'Peerin UDP-portti, yleensä 51820',
          allowedIps: 'Sallitut IP-osoitteet',
          allowedIpsDescription: 'Peerin osoite tai alue tunnelissa, esimerkiksi 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Sekuntia keepalive-pakettien välillä, tarpeen reitittimen takana'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Ota yhteys tähän KVM-laitteeseen Tailscale-verkkosi kautta',
        service: 'Palvelu',
        performance: 'Suorituskyky',
        memory: {
          title: 'Muistin optimointi',
          tip: 'Pitää Tailscalen muistinkäytön alhaisena, mikä auttaa laitteella, jossa on vähän RAM-muistia. Käynnistä Tailscale uudelleen, jotta muutos tulee voimaan.'
        },
        swap: {
          title: 'Swap-tiedosto',
          tip: 'Jos ongelmat jatkuvat muistin optimoinnin jälkeen, kokeile ottaa swap-tiedosto käyttöön',
          sizeTip:
            'Tämä asettaa tiedoston kooksi 128 Mt; voit muuttaa sitä kohdassa Asetukset > Järjestelmä > Suorituskyky'
        },
        restartTitle: 'Käynnistä Tailscale uudelleen',
        restartDesc: 'Käynnistää palvelun uudelleen',
        restartBtn: 'Käynnistä uudelleen',
        restart: 'Käynnistetäänkö Tailscale uudelleen?',
        stopTitle: 'Pysäytä Tailscale',
        stopBtn: 'Pysäytä',
        stop: 'Pysäytetäänkö Tailscale?',
        stopDesc: 'Pysäyttää palvelun ja estää sen käynnistymisen järjestelmän käynnistyessä',
        loading: 'Ladataan...',
        notInstall: 'Tailscalea ei löytynyt, asenna se',
        install: 'Asenna',
        installing: 'Asennetaan',
        failed: 'Asennus epäonnistui',
        retry: 'Päivitä ja yritä uudelleen tai asenna käsin.',
        download: 'Lataa',
        package: 'asennuspaketti',
        unzip: 'ja pura se',
        upTailscale: 'Lataa tailscale NanoKVM:n hakemistoon /usr/bin/',
        upTailscaled: 'Lataa tailscaled NanoKVM:n hakemistoon /usr/sbin/',
        refresh: 'Päivitä nykyinen sivu',
        notRunning: 'Tailscale ei ole käynnissä. Käynnistä se jatkaaksesi.',
        run: 'Käynnistä',
        notLogin: 'Laitetta ei ole vielä sidottu. Kirjaudu sisään ja sido laite tiliisi.',
        urlPeriod: 'Tämä URL on voimassa 10 minuuttia',
        login: 'Kirjaudu',
        loginSuccess: 'Kirjautuminen onnistui',
        deviceName: 'Laitteen nimi',
        deviceIP: 'Laitteen IP',
        account: 'Tili',
        logout: 'Kirjaudu ulos',
        logoutDesc: 'Haluatko varmasti kirjautua ulos?',
        uninstall: 'Poista Tailscale',
        uninstallDesc: 'Haluatko varmasti poistaa Tailscalen?',
        okBtn: 'Kyllä',
        cancelBtn: 'Ei'
      },
      update: {
        title: 'Päivitykset',
        currentVersion: 'Nykyinen versio',
        latestVersion: 'Uusin versio',
        queryFailed: 'Version haku epäonnistui',
        updateFailed: 'Päivitys epäonnistui',
        paranoidBlocked: 'Palomuuritila Paranoidi estää verkkopäivitykset',
        paranoidBlockedDesc:
          'GitHub-tarkistukset ja lataukset tarvitsevat ulospäin suuntautuvan verkkoyhteyden. Offline-lataus ja jo valmistellut asennukset ovat edelleen käytettävissä.',
        available: 'Päivitys on saatavilla. Haluatko päivittää nyt?',
        updating: 'Päivitys käynnistyi',
        confirm: 'Vahvista',
        cancel: 'Peruuta',
        badge: {
          checking: 'Tarkistetaan',
          latest: 'Ajan tasalla',
          available: 'Päivitys saatavilla',
          failed: 'Tarkistus epäonnistui',
          local: 'Paikallinen'
        },
        application: {
          title: 'Sovellus'
        },
        system: {
          queryFailed: 'Järjestelmäversion haku epäonnistui',
          appUpdateRequired:
            'Päivitä sovellus versioon {{version}} ennen tämän järjestelmäpäivityksen asentamista',
          requiredAppVersion: 'Vaadittu sovellusversio',
          downloadFailed: 'Lataus tai varmistus epäonnistui',
          available: 'Perusjärjestelmän päivitys on saatavilla.',
          downloading: 'Ladataan ja varmistetaan järjestelmäpäivitystä...',
          downloadVerify: 'Lataa ja varmista',
          installing: 'Asennetaan valmisteltua järjestelmäpäivitystä...',
          install: 'Asenna',
          installFailed: 'Asennus epäonnistui',
          installConfirmTitle: 'Asennetaanko järjestelmäpäivitys?',
          installConfirmDesc:
            'Tämä korvaa perusjärjestelmän tiedostoja varmistetusta paketista. Uudelleenkäynnistys vaaditaan.',
          rawInstallConfirmDesc:
            'Tämä varmistettu paketti kirjoittaa raw boot/rootfs -imaget SD-kortin osioihin ja käynnistää laitteen automaattisesti uudelleen. Kirjoitus voi kestää useita minuutteja; pidä virta kytkettynä.',
          rawInstallWarning:
            'Raw-osiopäivityksille ei ole automaattista palautusta. Jos käynnistys epäonnistuu, palauta SD-kortti käsin.',
          rawWaitTitle: 'Asennetaan järjestelmäpäivitystä',
          rawWaitWriting: 'Uutta järjestelmää kirjoitetaan SD-kortille',
          rawWaitRestarting:
            'Laite käynnistyy uudelleen. Tämä sivu latautuu uudelleen, kun laite on takaisin.',
          rawWaitDesc:
            'Tämä kestää noin kolme minuuttia. Pidä virta kytkettynä äläkä sulje tätä sivua.',
          rawWaitSlow:
            'Tämä kestää odotettua kauemmin. Odota vielä muutama minuutti ennen virran katkaisua.',
          rebootRequired: 'Uudelleenkäynnistys vaaditaan tämän järjestelmätilan aktivoimiseksi.',
          rollingBack: 'Palautetaan järjestelmäpäivitystä...',
          rollback: 'Palauta',
          rollbackDone: 'Palautus valmisteltu',
          rollbackFailed: 'Palautus epäonnistui',
          rollbackConfirmTitle: 'Palautetaanko järjestelmäpäivitys?',
          rollbackConfirmDesc:
            'Tämä palauttaa tiedostot viimeisimmästä järjestelmäpäivityksen varmuuskopiosta. Uudelleenkäynnistys vaaditaan.',
          stagedDesc: 'Järjestelmäpäivitys on ladattu ja varmennettu, voit asentaa sen nyt',
          refresh: 'Päivitä',
          releaseNotes: 'Julkaisutiedot',
          systemVersion: 'Järjestelmän versio',
          kernel: 'Kernel',
          stagedVersion: 'Valmisteltu versio',
          archive: 'Arkisto',
          requiredFree: 'Vaadittu vapaa tila',
          fileCount: 'Tiedostot',
          rawImages: 'Raw-imaget',
          progress: 'Edistyminen',
          progressMessage: 'Edistymisviesti',
          pendingVersion: 'Odottava versio',
          bootHealth: 'Käynnistyksen kunto',
          healthy: 'Kunnossa',
          unhealthy: 'Vaatii huomiota',
          rollbackBackup: 'Palautusvarmuuskopio'
        },
        offline: {
          title: 'Lataa sovelluspaketti',
          desc: 'Asenna sovelluspaketti tältä tietokoneelta. Palvelin käynnistyy sen jälkeen uudelleen.',
          installTitle: 'Asennetaanko sovelluspäivitys?',
          installDesc:
            'Sovellus korvataan ja palvelin käynnistyy uudelleen. Sinun täytyy kirjautua sisään uudelleen.'
        },
        local: {
          title: 'Lataa järjestelmäpaketti',
          desc: 'Asenna järjestelmäpaketti tältä tietokoneelta. Yksi tiedosto sisältää arkiston ja sen allekirjoitetut metatiedot.',
          choose: 'Valitse tiedosto',
          invalidFile: 'Valitse paketti, jonka pääte on .tar tai .tar.gz.',
          diskTitle: 'Sammutetaanko virtuaalilevy?',
          diskWarn:
            'Paketti tallennetaan hakemistoon /data, joka on vain luettavissa, kun virtuaalilevy on päällä. Kun virtuaalilevy sammutetaan, tietokone ei enää pääse hakemistoon /data. Jatketaanko?',
          uploading: 'Lähetetään',
          verifying: 'Tarkistetaan ja valmistellaan pakettia',
          keyTitle: 'Paikallinen päivitysavain',
          keyDesc: 'PEM-muotoinen julkinen avain, jolla saa allekirjoittaa itse rakennetut paketit',
          keyNone: 'Avainta ei ole asetettu',
          keySet: 'Aseta avain',
          keyRemove: 'Poista',
          signer: 'Allekirjoittaja',
          section: 'Paikalliset päivitykset',
          keyRequired: 'Paikallinen avain vaaditaan'
        }
      },
      account: {
        title: 'Tili',
        webAccount: 'Verkkotilin nimi',
        password: 'Salasana',
        passwordDesc: 'Vaihda salasana, jolla kirjaudutaan verkkokäyttöliittymään',
        updateBtn: 'Vaihda',
        logoutBtn: 'Kirjaudu ulos',
        logoutDesc: 'Haluatko varmasti kirjautua ulos?',
        okBtn: 'Kyllä',
        cancelBtn: 'Ei',
        session: {
          title: 'Istunto'
        },
        logoutOnClose: {
          title: 'Kirjaudu ulos selaimen sulkeutuessa',
          description: 'Päätä istunto, kun selain suljetaan, sen sijaan että se pidetään auki'
        },
        totp: {
          title: 'Kaksivaiheinen tunnistautuminen',
          authenticator: 'Todennussovellus',
          description: 'Vaadi salasanan lisäksi todennussovelluksen aikaperusteinen koodi',
          required: 'Vaaditaan käytännössä',
          disable: 'Poista käytöstä',
          enableTitle: 'Ota kaksivaiheinen tunnistautuminen käyttöön',
          enableDescription:
            'Jatka vahvistamalla salasanasi. Se vaaditaan toisen vaiheen jokaiseen muutokseen.',
          continue: 'Jatka',
          disableTitle: 'Poistetaanko kaksivaiheinen tunnistautuminen käytöstä?',
          disableDescription:
            'Tiliäsi suojaa jatkossa vain salasana. Jatka vahvistamalla salasanallasi.',
          disableFailed: 'Kaksivaiheisen tunnistautumisen poistaminen käytöstä epäonnistui',
          passwordPlaceholder: 'Nykyinen salasana',
          enrollFailed: 'Käyttöönoton aloittaminen epäonnistui',
          invalidCode: 'Koodi ei täsmää. Kokeile seuraavaa.',
          scan: 'Skannaa tämä todennussovelluksella.',
          manualEntry: 'Tai anna tämä avain käsin:',
          codePlaceholder: 'Vahvista antamalla 6-numeroinen koodi',
          confirm: 'Vahvista',
          cancel: 'Peruuta',
          backupTitle: 'Tallenna varakoodisi nyt',
          backupDescription:
            'Jokainen koodi toimii vain kerran, eikä sitä näytetä uudelleen. Ne ovat ainoa tapa päästä takaisin sisään, jos menetät todennussovelluksesi, ja ne toimivat myös silloin, kun laitteen kelloa ei ole synkronoitu.',
          copy: 'Kopioi',
          copied: 'Varakoodit kopioitu',
          savedThem: 'Olen tallentanut ne',
          remaining: 'Varakoodeja jäljellä: {{remaining}}',
          clockUnsynced:
            'Laitteen kelloa ei ole vielä synkronoitu. Synkronoi aika kohdassa Asetukset > Järjestelmä > Aika ennen käyttöönottoa.',
          noBackupCodes: 'Varakoodeja ei ole jäljellä. Luo uusi sarja valitsemalla Luo.',
          regenerate: 'Uudet varakoodit',
          generate: 'Luo',
          regenerateTitle: 'Luodaanko uudet varakoodit?',
          regenerateDescription:
            'Nykyiset varakoodisi lakkaavat toimimasta. Jatka vahvistamalla salasanallasi.',
          regenerateFailed: 'Uusien varakoodien luominen epäonnistui',
          download: 'Lataa',
          copyFailed: 'Kopiointi epäonnistui. Valitse koodit ja kopioi ne käsin.',
          requireTitle: 'Vaadi kaksivaiheinen tunnistautuminen',
          requireDescription:
            'Estää kaksivaiheisen tunnistautumisen poistamisen käytöstä, ja tilin, jolla sitä ei ole, on otettava se käyttöön ennen laitteen käyttöä',
          requireFailed: 'Vaatimuksen muuttaminen epäonnistui',
          requiredTitle: 'Kaksivaiheinen tunnistautuminen vaaditaan',
          requiredDescription:
            'Tämä laite vaatii toisen vaiheen, mutta tililläsi sitä ei ole vielä otettu käyttöön. Ota se käyttöön nyt jatkaaksesi.'
        }
      }
    },
    picoclaw: {
      title: 'PicoClaw-avustaja',
      empty: 'Aloita kuvaamalla tehtävä',
      inputPlaceholder: "Kuvaile, mitä haluat PicoClaw'n tekevän",
      newConversation: 'Uusi keskustelu',
      processing: 'Käsitellään...',
      agent: {
        defaultTitle: 'Yleisavustaja',
        defaultDescription: 'Yleinen keskustelu, haku ja työtilan apu',
        kvmTitle: 'Etäohjaus',
        kvmDescription: 'Ohjaa etäkonetta NanoKVM:n kautta',
        switched: 'Agentin rooli vaihdettu',
        switchFailed: 'Agentin roolin vaihto epäonnistui'
      },
      send: 'Lähetä',
      cancel: 'Peruuta',
      status: {
        connecting: 'Yhdistetään gatewayhin...',
        connected: 'PicoClaw-istunto yhdistetty',
        disconnected: 'PicoClaw-istunto suljettu',
        stopped: 'Pysäytyspyyntö lähetetty',
        runtimeStarted: 'PicoClaw-runtime käynnistetty',
        runtimeStartFailed: 'PicoClaw-runtimen käynnistys epäonnistui',
        runtimeStopped: 'PicoClaw-runtime pysäytetty',
        runtimeStopFailed: 'PicoClaw-runtimen pysäytys epäonnistui'
      },
      connection: {
        runtime: {
          checking: 'Tarkistetaan',
          ready: 'Runtime valmis',
          stopped: 'Runtime pysäytetty',
          unavailable: 'Runtime ei ole saatavilla',
          configError: 'Määritysvirhe'
        },
        transport: {
          connecting: 'Yhdistetään',
          connected: 'Yhdistetty'
        },
        run: {
          idle: 'Jouten',
          busy: 'Varattu'
        }
      },
      error: {
        lockHeld: 'PicoClaw on käytössä toisessa ikkunassa',
        takenOver: "Toinen ikkuna otti PicoClaw'n haltuunsa",
        authFailed: 'PicoClaw hylkäsi yhteyden',
        upstreamClosed: "Yhteys PicoClaw'iin katkesi"
      },
      tool: {
        screenshot: 'Otetaan kuvakaappaus',
        loadImage: 'Katsotaan kuvakaappausta',
        actions: 'Ohjataan isäntää',
        generic: 'Käytetään: {{name}}',
        type: 'Kirjoitetaan {{text}}',
        hotkey: 'Painetaan {{keys}}',
        click: 'Napsautetaan',
        doubleClick: 'Kaksoisnapsautetaan',
        move: 'Siirretään hiirtä',
        drag: 'Vedetään',
        scroll: 'Vieritetään',
        wait: 'Odotetaan'
      },
      message: {
        toolAction: 'Toiminto',
        observation: 'Havainto',
        screenshot: 'Kuvakaappaus'
      },
      overlay: {
        locked: 'PicoClaw ohjaa laitetta. Käsinsyöttö on keskeytetty.'
      },
      install: {
        install: 'Asenna PicoClaw',
        installing: "Asennetaan PicoClaw'ta",
        success: 'PicoClaw asennettu onnistuneesti',
        failed: "PicoClaw'n asennus epäonnistui",
        uninstalled: 'PicoClaw poistettu onnistuneesti',
        uninstallFailed: 'Poisto epäonnistui',
        requiredTitle: 'PicoClaw ei ole asennettu',
        requiredDescription: 'Asenna PicoClaw ennen PicoClaw-runtimen käynnistämistä.',
        progressDescription: 'PicoClaw ladataan ja asennetaan.',
        stages: {
          preparing: 'Valmistellaan',
          downloading: 'Ladataan',
          extracting: 'Puretaan',
          verifying: 'Varmistetaan',
          installing: 'Asennetaan',
          installed: 'Asennettu',
          install_timeout: 'Aikakatkaisu',
          install_failed: 'Epäonnistui'
        }
      },
      model: {
        requiredTitle: 'Mallin määritys vaaditaan',
        requiredDescription: 'Määritä PicoClaw-malli ennen PicoClaw-chatin käyttöä.',
        docsTitle: 'Määritysopas',
        docsDesc: 'Tuetut mallit ja protokollat',
        menuLabel: 'Määritä malli',
        modelIdentifier: 'Mallin tunniste',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'API:n perus-URL',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'API-avain',
        apiKeyPlaceholder: 'Syötä mallin API-avain',
        apiKeyKeepPlaceholder: 'Jätä tyhjäksi säilyttääksesi nykyisen avaimen',
        save: 'Tallenna',
        saving: 'Tallennetaan',
        saved: 'Mallin määritys tallennettu',
        saveFailed: 'Mallin määrityksen tallennus epäonnistui',
        invalid: 'Mallin tunniste, API:n perus-URL ja API-avain vaaditaan'
      },
      uninstall: {
        confirmTitle: 'Poista PicoClaw',
        confirmContent:
          "Haluatko varmasti poistaa PicoClaw'n? Tämä poistaa suoritettavan tiedoston ja kaikki määritystiedostot.",
        confirmOk: 'Poista'
      },
      history: {
        title: 'Historia',
        loading: 'Ladataan istuntoja...',
        emptyTitle: 'Ei historiaa vielä',
        emptyDescription: 'Aiemmat PicoClaw-istunnot näkyvät täällä.',
        loadFailed: 'Istuntohistorian lataus epäonnistui',
        deleteFailed: 'Istunnon poisto epäonnistui',
        deleteConfirmTitle: 'Poista istunto',
        deleteConfirmContent: 'Haluatko varmasti poistaa "{{title}}"?',
        deleteConfirmOk: 'Poista',
        messageCount_one: '{{count}} viesti',
        messageCount_other: '{{count}} viestiä'
      },
      config: {
        startRuntime: 'Käynnistä PicoClaw',
        stopRuntime: 'Pysäytä PicoClaw',
        stopConfirm: 'Pysäytetäänkö PicoClaw?'
      },
      start: {
        title: 'Käynnistä PicoClaw',
        description: 'Käynnistä runtime aloittaaksesi PicoClaw-avustajan käytön.'
      }
    },
    error: {
      title: 'Tapahtui ongelma',
      refresh: 'Päivitä'
    },
    fullscreen: {
      toggle: 'Vaihda koko näyttö'
    },
    menu: {
      collapse: 'Pienennä valikko'
    }
  }
};

export default fi;
