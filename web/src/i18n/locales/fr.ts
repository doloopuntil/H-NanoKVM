const fr = {
  translation: {
    common: {
      confirm: 'Confirmer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      discard: 'Ignorer',
      delete: 'Supprimer',
      actionFailed: "L'opération a échoué",
      loading: "Chargement des paramètres de l'appareil...",
      loadFailed: "Impossible de charger les paramètres de l'appareil",
      retry: 'Réessayer'
    },
    head: {
      desktop: 'Bureau à distance',
      login: 'Connexion',
      firstSetup: 'Première configuration',
      changePassword: 'Changer le mot de passe',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Connexion',
      placeholderUsername: "Veuillez entrer votre nom d'utilisateur",
      placeholderPassword: 'Veuillez entrer votre mot de passe',
      placeholderPassword2: 'Veuillez entrer votre mot de passe à nouveau',
      noEmptyUsername: "Le nom d'utilisateur ne peut pas être vide",
      noEmptyPassword: 'Le mot de passe ne peut pas être vide',
      invalidUser: "Nom d'utilisateur ou mot de passe invalide",
      locked: 'Trop de connexions, veuillez réessayer plus tard',
      globalLocked: 'Système sous protection, veuillez réessayer plus tard',
      error: 'Erreur inattendue',
      changePassword: 'Changer le mot de passe',
      changePasswordDesc:
        'Pour la sécurité de votre appareil, veuillez modifier le mot de passe de connexion Web',
      differentPassword: 'Les mots de passe ne correspondent pas',
      illegalUsername: "Le nom d'utilisateur contient des caractères illégaux",
      illegalPassword:
        'Le mot de passe doit contenir au moins 8 caractères et ne peut pas contenir de guillemets ni de barres obliques',
      forgetPassword: 'Mot de passe oublié',
      ok: 'OK',
      cancel: 'Annuler',
      loginButtonText: 'Connexion',
      setupTitle: 'Créer un compte administrateur',
      setupDescription:
        "Aucun compte web n'existe encore sur cet appareil. Créez le premier compte administrateur pour continuer.",
      setupRecovery:
        'Si ce mot de passe est perdu, la récupération nécessite de réécrire la carte SD',
      setupButtonText: 'Créer le compte',
      tips: {
        hardenedRecovery:
          'Cette image Hardened ne permet pas de réinitialiser le mot de passe avec le bouton BOOT. Si le mot de passe est perdu, réécrivez la carte SD et créez un nouveau compte.',
        change1: 'Veuillez noter que cette action modifiera les mots de passe suivants :',
        change2: 'Mot de passe de connexion Web',
        change3: 'Mot de passe racine du système pour la connexion SSH'
      },
      placeholderCurrentPassword: 'Mot de passe actuel',
      placeholderNewPassword: 'Nouveau mot de passe',
      wrongCurrentPassword: 'Le mot de passe actuel est incorrect',
      totp: {
        title: 'Authentification à deux facteurs',
        prompt: "Saisissez le code à 6 chiffres de votre application d'authentification",
        backupPrompt: "Saisissez l'un de vos codes de secours",
        noEmptyCode: 'Saisissez un code',
        placeholderCode: 'Code à 6 chiffres',
        placeholderBackup: 'Code de secours',
        verifyButtonText: 'Vérifier',
        useBackupCode: 'Utiliser un code de secours',
        useAuthenticator: "Utiliser le code de l'application d'authentification",
        cancel: 'Retour',
        invalidCode: "Ce code n'est pas valide. Réessayez."
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Configurez le Wi-Fi pour le NanoKVM',
      success: 'Veuillez vérifier le statut du réseau du NanoKVM et visitez la nouvelle adresse IP',
      failed: "L'opération a échoué, veuillez réessayer",
      invalidMode:
        'Le mode actuel ne prend pas en charge la configuration réseau. Veuillez accéder à votre appareil et activer le mode de configuration Wi-Fi.',
      confirmBtn: 'Ok',
      finishBtn: 'Terminé',
      ap: {
        authTitle: 'Authentification requise',
        authDescription: 'Veuillez saisir le mot de passe AP pour continuer',
        authFailed: 'Mot de passe AP invalide',
        passPlaceholder: 'Mot de passe AP',
        verifyBtn: 'Vérifier'
      }
    },
    screen: {
      scale: 'Échelle',
      title: 'Écran',
      video: 'Mode vidéo',
      videoDirectTips:
        'Activez HTTPS dans « Paramètres > Réseau > Services » pour utiliser ce mode',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC est désactivé dans les modes de pare-feu Restreint et Paranoïaque',
      transferRunningTitle: "Transfert d'image en cours",
      transferRunningDesc:
        "Changer le mode vidéo recharge la page, ce qui annule le téléversement ou le téléchargement d'image en cours.",
      transferRunningOk: 'Changer de mode',
      resolution: 'Résolution',
      auto: 'Automatique',
      autoTips:
        "Sous certaines résolutions, il peut y avoir des artefacts visuels ou un décalage de la souris, ajustez donc la résolution de l'hôte distant ou désactivez le mode automatique",
      fps: 'FPS',
      customizeFps: 'Personnaliser',
      quality: 'Qualité',
      qualityLossless: 'Sans perte',
      qualityHigh: 'Élevé',
      qualityMedium: 'Moyen',
      qualityLow: 'Bas',
      frameDetect: 'Détection de trame',
      frameDetectTip:
        "Compare les images et arrête l'envoi de la vidéo tant que l'écran de l'hôte distant ne change pas",
      resetHdmi: 'Réinitialiser le HDMI',
      webrtcConnectionFailed: {
        title: 'Échec de la connexion WebRTC',
        description: 'Vérifiez la connexion réseau ou changez de mode vidéo'
      },
      captureStatus: {
        hdmiError: "Erreur d'image HDMI",
        unsupportedResolution: "La résolution actuelle n'est pas prise en charge",
        retrieving: "Récupération de l'image...",
        changingResolution: 'Changement de résolution...',
        updateFailed: "L'image ne peut pas être mise à jour pour le moment",
        videoError: "Erreur d'affichage vidéo",
        noHdmi: 'Aucun signal HDMI détecté',
        unavailable: "L'image ne peut pas être affichée pour le moment"
      }
    },
    keyboard: {
      title: 'Clavier',
      paste: 'Coller',
      tips: 'Seuls les caractères et symboles standard du clavier sont pris en charge',
      placeholder: 'Texte à coller',
      local: 'Clavier mobile',
      virtual: "Clavier à l'écran",
      readClipboard: 'Lire le presse-papiers',
      clipboardPermissionDenied:
        "Accès au presse-papiers refusé, autorisez l'accès dans votre navigateur",
      clipboardReadError: 'Échec de la lecture du presse-papiers',
      dropdownEnglish: 'Anglais',
      dropdownGerman: 'Allemand',
      dropdownFrench: 'Français',
      dropdownRussian: 'Russe',
      dropdownKorean: 'Coréen',
      dropdownJapanese: 'Japonais',
      localInput: 'Saisie au clavier mobile',
      shortcut: {
        title: 'Raccourcis',
        custom: 'Personnalisé',
        capture: 'Cliquez ici pour capturer le raccourci',
        clear: 'Effacer',
        save: 'Enregistrer',
        captureTips:
          "La capture de touches système, comme la touche Windows, nécessite l'autorisation du plein écran",
        enterFullScreen: 'Basculer en mode plein écran'
      },
      leaderKey: {
        title: 'Touche Leader',
        desc: "Contournez les restrictions du navigateur et envoyez les raccourcis système directement à l'hôte distant",
        howToUse: 'Comment utiliser',
        simultaneous: {
          title: 'Mode simultané',
          desc1: 'Maintenez la touche Leader enfoncée, puis appuyez sur le raccourci.',
          desc2: 'Intuitif, mais peut entrer en conflit avec les raccourcis système.'
        },
        sequential: {
          title: 'Mode séquentiel',
          desc1:
            "Appuyez sur la touche Leader → appuyez sur le raccourci dans l'ordre → appuyez à nouveau sur la touche Leader.",
          desc2: "Nécessite plus d'étapes, mais évite complètement les conflits système."
        },
        enable: 'Activer la touche Leader',
        tip: "Lorsqu'elle est définie comme touche Leader, cette touche sert uniquement de déclencheur de raccourci et perd son comportement par défaut.",
        placeholder: 'Appuyez sur la touche Leader',
        shiftRight: 'Shift droit',
        ctrlRight: 'Ctrl droit',
        metaRight: 'Win droit',
        recorder: {
          rec: 'REC',
          activate: 'Activer les touches',
          input: 'Appuyez sur le raccourci'
        }
      }
    },
    mouse: {
      title: 'Souris',
      cursor: 'Style de curseur',
      default: 'Curseur par défaut',
      cell: 'Curseur de cellule',
      text: 'Curseur de texte',
      grab: 'Curseur de saisie',
      hide: 'Cacher le curseur',
      mode: 'Mode de la souris',
      absolute: 'Mode absolu',
      relative: 'Mode relatif',
      direction: 'Sens de la molette',
      scrollUp: 'Faire défiler vers le haut',
      scrollDown: 'Faites défiler vers le bas',
      speed: 'Vitesse de la molette',
      sensitivity: 'Vitesse du pointeur',
      sensitivityDesc:
        "Pour le mode relatif sur bureau : les valeurs plus basses réduisent la dérive due à l'accélération souris de l'hôte",
      fast: 'Rapide',
      slow: 'Lent',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          "Déplacez-vous n'importe où dans la zone KVM ; le curseur distant garde sa position entre les touchers et reste synchronisé avec le HID absolu"
      },
      requestPointer:
        'Mode relatif actif, cliquez sur le bureau pour capturer le pointeur de la souris',
      resetHid: 'Réinitialiser le périphérique HID',
      hidOnly: {
        title: 'Mode HID-Only',
        desc: "Si la souris ou le clavier ne répondent plus et que la réinitialisation du HID n'y change rien, il peut s'agir d'un problème de compatibilité entre le NanoKVM et l'hôte.",
        tip1: "L'activation du mode HID-Only démonte le disque virtuel et le réseau virtuel",
        tip2: "En mode HID-Only, le montage d'images est désactivé",
        tip3: 'NanoKVM redémarrera automatiquement après avoir changé de mode',
        enable: 'Activer le mode HID-Only',
        disable: 'Désactiver le mode HID-Only'
      }
    },
    image: {
      title: 'Images',
      loading: 'Chargement...',
      empty: 'Vide',
      mountMode: 'Monter comme',
      massStorage: 'Stockage de masse',
      cdRom: 'CD-ROM',
      mountFailed: "Échec du montage de l'image",
      mountDesc:
        "Dans certains systèmes, il est nécessaire de déséjecter le disque virtuel sur l'hôte distant avant de monter l'image",
      diskOnWarn:
        "Monter l'image désactive le disque virtuel : l'ordinateur ne peut plus accéder à /data. Continuer?",
      diskOffWarn:
        "Le disque virtuel est désactivé et doit être activé pour monter l'image. Les périphériques USB de l'ordinateur sont réénumérés. Continuer?",
      unmountFailed: 'Échec du démontage',
      unmountDesc:
        "Sur certains systèmes, vous devez l'éjecter manuellement de l'hôte distant avant de démonter l'image",
      forceEject: "Forcer l'éjection",
      forceEjectConfirm:
        "L'hôte a verrouillé le lecteur optique. Forcer l'éjection déconnecte brièvement le périphérique USB virtuel, de sorte que le clavier et la souris peuvent se déconnecter momentanément. Continuer?",
      usbReconnect: 'Reconnecter USB',
      usbReconnectConfirm:
        "Reconnectez le gadget USB seulement si l'hôte distant n'a pas détecté le changement de média. Le clavier et la souris peuvent se déconnecter brièvement.",
      usbReconnectSuccess: 'USB reconnecté',
      usbReconnectFailed: 'Échec de la reconnexion USB',
      addImage: 'Ajouter une image',
      fromUrl: 'Depuis une URL',
      fromFile: 'Depuis un fichier',
      turnOff: 'Désactiver',
      eject: 'Éjecter',
      download: 'Télécharger',
      upload: 'Téléverser',
      mountTitle: "Monter l'image",
      deleteTitle: "Supprimer l'image",
      deleteConfirm: 'Etes-vous sûr de vouloir supprimer cette image?',
      tips: {
        title: 'Comment télécharger',
        usb1: 'Connectez le NanoKVM à votre ordinateur via USB.',
        usb2: 'Assurez-vous que le disque virtuel est monté dans Paramètres > Appareil > Disque virtuel.',
        usb3: 'Ouvrez le disque virtuel sur votre ordinateur et copiez le fichier image dans le répertoire racine du disque virtuel.',
        scp1: 'Assurez-vous que le NanoKVM et votre ordinateur sont sur le même réseau local.',
        scp2: 'Ouvrez un terminal sur votre ordinateur et utilisez la commande SCP pour copier le fichier image dans le répertoire /data du NanoKVM.',
        scp3: 'Exemple : scp chemin-de-votre-image root@ip-de-votre-nanokvm:/data',
        tfCard: 'Carte SD',
        tf1: 'Cette méthode est adaptée aux systèmes Linux',
        tf2: "Retirez la carte SD du NanoKVM. Sur la version FULL, il faut d'abord ouvrir le boîtier.",
        tf3: 'Insérez la carte SD dans un lecteur de carte et connectez-la à votre ordinateur.',
        tf4: 'Copiez le fichier image dans le répertoire /data de la carte SD sur votre ordinateur.',
        tf5: 'Réinsérez la carte SD dans le NanoKVM.'
      }
    },
    script: {
      title: 'Script',
      upload: 'Téléverser',
      run: 'Exécuter',
      runBackground: 'Exécuter en arrière-plan',
      runFailed: "Échec de l'exécution",
      delDesc: 'Êtes-vous sûr de vouloir supprimer ce fichier?',
      delete: 'Supprimer',
      close: 'Fermer',
      unlockDesc:
        "Les scripts s'exécutent en root sur le NanoKVM. Saisissez le mot de passe du compte web pour en téléverser ou en exécuter un.",
      terminalRequired:
        "Les scripts nécessitent l'accès au terminal web. Activez d'abord le terminal dans les paramètres."
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'Terminal NanoKVM',
      serial: 'Terminal du port série',
      unlockTitle: 'Déverrouiller le terminal',
      unlockDesc: 'Saisissez le mot de passe du compte web pour démarrer une session terminal',
      unlock: 'Déverrouiller',
      unlockFailed: 'Échec du déverrouillage du terminal',
      invalidCredentials: "Nom d'utilisateur ou mot de passe invalide",
      locked: 'Trop de tentatives, réessayez plus tard',
      sessionClosed: 'Session terminal fermée. Déverrouillez à nouveau pour vous reconnecter.',
      sessionError: 'Échec de la connexion au terminal. Déverrouillez à nouveau pour réessayer.',
      serialPort: 'Port série',
      serialPortPlaceholder: 'Par exemple /dev/ttyS1',
      baudrate: 'Débit en bauds',
      parity: 'Parité',
      parityNone: 'Aucun',
      parityEven: 'Paire',
      parityOdd: 'Impaire',
      flowControl: 'Contrôle de débit',
      flowControlNone: 'Aucun',
      flowControlSoft: 'Logiciel',
      flowControlHard: 'Matériel',
      dataBits: 'Bits de données',
      stopBits: "Bits d'arrêt",
      open: 'Ouvrir le terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Envoi de la commande...',
      sent: 'Commande envoyée',
      input: 'Adresse MAC',
      ok: 'OK'
    },
    download: {
      input: "URL de l'image distante",
      ok: 'OK',
      disabled:
        "Les images ne peuvent pas être téléchargées ni téléversées pour le moment, car le stockage n'est pas accessible en écriture. Si une image est montée, démontez-la, puis désactivez le disque virtuel pour que le stockage redevienne accessible en écriture.",
      diskShared: "Désactivez le disque virtuel pour utiliser le téléchargement d'images",
      mountedImage: "Cette image est montée, démontez-la avant d'envoyer un fichier du même nom",
      diskOff: 'Désactiver le disque virtuel',
      uploadbox: 'Déposez le fichier ici ou cliquez pour sélectionner',
      inputfile: 'Fichier image',
      NoISO: 'Aucune image',
      complete: 'Téléchargement terminé',
      uploadComplete: 'Téléversement terminé',
      downloading: 'Téléchargement',
      uploading: 'Téléversement',
      failed: 'Échec du transfert',
      uploadFailed: 'Échec du téléversement',
      stalled: 'Le transfert est bloqué, vérifiez la connexion et réessayez',
      canceled: 'Téléversement annulé',
      downloadCanceled: 'Téléchargement annulé',
      cancel: 'Annuler',
      remoteDisabled:
        'Le téléchargement ISO distant est désactivé dans Paramètres > Utilisateur > Préférences',
      remoteFailed: 'Échec du téléchargement ISO distant',
      sha256: 'Somme de contrôle SHA-256 facultative',
      sha256Placeholder: 'Saisissez une somme de contrôle SHA-256 de 64 caractères',
      invalidSHA256: 'SHA-256 doit être une chaîne hexadécimale de 64 caractères',
      checksumFailed: 'Échec du téléchargement : échec de la vérification SHA-256'
    },
    power: {
      title: 'Alimentation',
      showConfirm: 'Confirmation',
      showConfirmTip: 'Les opérations électriques nécessitent une confirmation supplémentaire',
      reset: 'Réinitialiser',
      powerShort: "Bouton d'alimentation : appui court",
      powerLong: "Bouton d'alimentation : appui long",
      resetConfirm: "Exécuter l'opération de réinitialisation?",
      powerConfirm: "Exécuter l'opération d'alimentation?",
      okBtn: 'Oui',
      cancelBtn: 'Non'
    },
    settings: {
      title: 'Paramètres',
      about: {
        title: 'À propos',
        information: 'Informations',
        ip: 'Adresse IP',
        mdns: 'Adresse locale',
        application: "Version de l'application",
        uptime: 'Temps de fonctionnement',
        community: 'Communauté',
        credit: 'Basé sur <a1>NanoKVM</a1> de Sipeed et <a2>Hardened NanoKVM</a2> de woffko',
        hostname: "Nom de l'appareil",
        changeIn: 'À modifier dans {{path}}',
        updateIn: 'À mettre à jour dans {{path}}',
        toggleIn: 'À activer ou désactiver dans {{path}}'
      },
      appearance: {
        title: 'Préférences',
        display: 'Affichage',
        language: 'Langue',
        languageDesc: "Sélectionnez la langue de l'interface",
        webTitle: 'Titre web',
        webTitleDesc: 'Personnaliser le titre de la page Web',
        layoutMode: "Disposition de l'interface",
        layoutModeDesc: 'Utiliser la disposition téléphone/tactile dans ce navigateur',
        layoutAuto: 'Auto',
        layoutMobile: 'Téléphone',
        menuBar: {
          title: 'Barre de menus',
          mode: "Mode d'affichage",
          modeDesc: "Afficher la barre de menu sur l'écran",
          modeOff: 'Désactivé',
          modeAuto: 'Masquer automatiquement',
          modeAlways: 'Toujours visible',
          keyboardLedStatus: 'Indicateurs de verrouillage du clavier',
          keyboardLedStatusDesc:
            "Afficher l'état de Verr Num, Verr Maj et Arrêt défil du poste distant",
          icons: 'Icônes du sous-menu',
          iconsDesc: 'Afficher les icônes des sous-menus dans la barre de menus',
          terminalWarningTitle: 'Activer le terminal web?',
          terminalWarningDesc:
            'Le terminal ouvre un shell root dans le navigateur. Activez-le seulement sur un réseau de confiance et désactivez-le ensuite.',
          terminalWarningConfirm: 'Activer',
          remoteDownload: 'Télécharger une ISO distante',
          remoteDownloadWarningTitle: 'Activer le téléchargement ISO distant?',
          remoteDownloadWarningDesc:
            "NanoKVM téléchargera une ISO depuis une URL et l'écrira dans /data. Activez seulement pour des URL de confiance et désactivez ensuite.",
          remoteDownloadWarningConfirm: 'Activer'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'État des verrouillages du clavier distant',
        indicatorLabel: '{{label}} : {{state}}',
        numLock: 'Verr Num',
        numLockShort: 'Num',
        capsLock: 'Verr Maj',
        capsLockShort: 'Maj',
        scrollLock: 'Arrêt défil',
        scrollLockShort: 'Défil',
        on: 'Activé',
        off: 'Désactivé',
        unknown: 'Inconnu'
      },
      device: {
        title: 'Appareil',
        minutes: 'min',
        sections: {
          general: 'Général',
          connectivity: 'Connectivité',
          hostConnection: "Connexion à l'hôte",
          inputOutput: 'Entrée et sortie'
        },
        oled: {
          title: "Délai de l'OLED",
          description: "Écran OLED s'éteint automatiquement",
          keepOn: "Garder l'OLED allumé",
          keepOnDescription: "Ne jamais éteindre l'écran OLED"
        },
        ssh: {
          description: "Activer l'accès à distance SSH",
          tip: "Définissez un mot de passe fort dans Compte > Mot de passe avant d'activer cette option"
        },
        swap: {
          title: 'Swap',
          description: "Utiliser un fichier d'échange quand la mémoire manque",
          size: "Taille du fichier d'échange",
          sizeDescription: "Définir la taille du fichier d'échange",
          tip: "L'activation de cette fonctionnalité pourrait réduire la durée de vie de votre carte SD"
        },
        mouseJiggler: {
          title: 'Mouse jiggler',
          description: "Empêcher l'hôte distant de dormir",
          disable: 'Désactiver',
          absolute: 'Mode absolu',
          relative: 'Mode relatif'
        },
        sessionLock: {
          title: "Verrouiller la session en cas d'inactivité",
          description: 'Redemander la connexion après ce délai'
        },
        mdns: {
          description: 'Activer le service de découverte mDNS',
          tip: "Permet d'accéder à cet appareil par son nom .local. Inutile si vous vous connectez par adresse IP ou si votre DNS résout déjà son nom d'hôte."
        },
        hdmi: {
          description: 'Activer HDMI/sortie moniteur',
          idleTimeoutTitle: "Délai d'inactivité de la capture",
          idleTimeoutDescription:
            "Arrêter la capture HDMI lorsqu'il n'y a aucun spectateur actif pendant"
        },
        hidOnly: 'Mode HID-Only',
        hidOnlyDesc:
          "Améliore la compatibilité avec l'hôte si la souris ou le clavier ne répondent plus",
        hidOnlyTip:
          "Le mode HID-Only cesse d'émuler les périphériques virtuels et ne conserve que le contrôle HID de base",
        disk: 'Disque virtuel',
        diskDesc: "Monter la carte SD sur l'hôte distant",
        diskLocked: "Désactivé tant qu'une image est montée, et l'activer annule le montage",
        diskEnable: 'Activer le disque virtuel',
        networkChange: 'Modifier le réseau virtuel',
        diskCancelMount: "Activer le disque virtuel annule l'image montée. Continuer?",
        networkCancelMount:
          "Modifier le réseau virtuel redémarre la connexion USB. Cela annule l'image montée et active le disque virtuel. Continuer?",
        diskTransferRunning:
          "Un transfert d'image est en cours. Attendez qu'il se termine avant d'activer le disque virtuel.",
        network: 'Réseau virtuel',
        networkDesc: "Monter la carte réseau virtuelle sur l'hôte distant",
        usbWakeup: 'Réveil USB',
        usbWakeupDesc: "Autorise le clavier ou la souris à réveiller l'hôte distant",
        usbWakeupTip: "Désactivez si l'hôte journalise des messages USB wakeup répétés",
        hostname: {
          description: 'Nom de cet appareil sur le réseau',
          reachable: 'Joignable sur le réseau local sous le nom {{address}}'
        },
        rebootRequired: 'Redémarrage requis',
        rebootPending: 'Redémarrage requis pour : {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Mise à jour système'
        },
        reboot: 'Redémarrer',
        rebootDesc: 'Êtes-vous sûr de vouloir redémarrer NanoKVM?',
        poweroff: 'Éteindre',
        poweroffDesc:
          "Voulez-vous vraiment éteindre NanoKVM? Il sera inaccessible tant qu'il ne sera pas rallumé."
      },
      network: {
        title: 'IP & DNS',
        connection: 'Connexion',
        configuration: 'Configuration',
        wifi: {
          title: 'Wi-Fi',
          description: 'Configurez le Wi-Fi',
          apMode: 'Le mode AP est activé, connectez-vous au Wi-Fi en scannant le code QR',
          connect: 'Connecter le Wi-Fi',
          connectDesc1: 'Veuillez saisir le SSID du réseau et le mot de passe',
          disconnect: 'Voulez-vous vraiment déconnecter le réseau?',
          disconnectBtn: 'Déconnecter',
          connected: 'Connecté',
          ssid: 'Nom',
          password: 'Mot de passe',
          joinBtn: 'Rejoindre',
          cancelBtn: 'Annuler'
        },
        tls: {
          description: 'Activer le protocole HTTPS',
          tip: "Attention : l'utilisation de HTTPS peut augmenter la latence, surtout en mode vidéo MJPEG",
          restartTitle: 'Le serveur va redémarrer',
          restartDesc:
            'Le changement de protocole redémarre le serveur. Le navigateur passera à la nouvelle adresse après {{seconds}} secondes:',
          restartOk: 'Appliquer et redémarrer',
          confirmTitle: 'Conserver le nouveau protocole?',
          confirmDesc:
            'Le serveur utilise maintenant {{protocol}}. Il reviendra au protocole précédent dans {{seconds}} secondes si vous ne le conservez pas.',
          confirmKeep: 'Conserver',
          confirmRevert: 'Revenir',
          reverting:
            'Retour au protocole précédent. Le navigateur passera à cette adresse après {{seconds}} secondes.',
          certTitle: 'Conserver le nouveau certificat?',
          certDesc:
            'Le serveur utilise maintenant le nouveau certificat. Il revient au précédent dans {{seconds}} secondes si vous ne le conservez pas.',
          certReverted: 'Le certificat précédent est de retour'
        },
        trustedProxies: {
          section: 'Proxy inverse',
          title: 'Proxys de confiance',
          description:
            "Proxys inverses auxquels l'appareil fait confiance pour indiquer l'adresse et le protocole du client",
          tip: "Une adresse de la liste choisit l'adresse du client que la limite de connexion et le journal enregistrent, n'indiquez donc que des proxys que vous contrôlez",
          none: 'Aucun',
          edit: 'Modifier',
          editRow: 'Modifier la liste',
          editTitle: 'Modifier les proxys de confiance',
          editDescription: 'La modification de la liste demande votre mot de passe',
          dialogDescription:
            "Saisissez l'adresse de chaque proxy inverse telle que cet appareil la voit, ou une plage comme 10.0.0.0/24. Un proxy de la liste indique à l'appareil quelle adresse et quel protocole de client utiliser. Tout ce qu'il transmet est cru, n'indiquez donc que des proxys que vous contrôlez."
        },
        certificate: {
          title: 'Certificat',
          desc: "D'où vient le certificat HTTPS",
          requesting: 'Demande du certificat en cours',
          selfSigned: 'Auto-signé',
          domain: 'Domaine',
          domainDesc: 'Doit pointer vers cet appareil, avec le port 443 joignable depuis Internet',
          domainTailscale: 'Défini par Tailscale pour cet appareil',
          domainInvalid: 'Utilisez un nom de domaine complet, par exemple kvm.example.org',
          email: 'E-mail',
          emailDesc: "Facultatif, pour les avis de Let's Encrypt",
          emailInvalid: 'Utilisez une adresse comme nom@example.org',
          validUntil: "Valide jusqu'au",
          valid: 'Valide',
          expiresSoon: 'Expire bientôt',
          expired: 'Expiré',
          lastRenewal: 'Dernier renouvellement',
          renewed: 'Renouvelé',
          failed: 'Échec',
          renewNow: 'Renouveler maintenant',
          renewNowDesc: 'Demander un nouveau certificat sans attendre',
          renewBtn: 'Renouveler',
          applyTitle: 'Changer le certificat',
          applyOk: 'Appliquer',
          applyAcme:
            "L'appareil demande un certificat à Let's Encrypt. Let's Encrypt se connecte au port 443 depuis Internet pour le vérifier, ce qui peut prendre jusqu'à une minute. Si la demande échoue, le certificat actuel reste utilisé.",
          applyTailscale:
            "L'appareil obtient un certificat auprès de Tailscale, ce qui peut prendre jusqu'à une minute. Si la demande échoue, le certificat actuel reste utilisé.",
          applySelfSigned:
            "L'appareil revient à son propre certificat auto-signé. Les navigateurs affichent un avertissement.",
          openTitle: 'Ouvrir la nouvelle adresse',
          openDesc:
            "Le certificat est prêt. Ouvrez l'adresse ci-dessous et connectez-vous pour le conserver. Sans votre confirmation sous 3 minutes, le certificat précédent revient.",
          openOk: 'Ouvrir',
          blockedClock:
            "Les certificats ne peuvent être demandés qu'une fois l'horloge de l'appareil synchronisée",
          blockedParanoid: 'Le mode Paranoïaque du pare-feu bloque les demandes de certificat',
          tailscaleUnavailable:
            "Tailscale n'est pas en cours d'exécution, ou les certificats HTTPS ne sont pas activés pour le tailnet"
        },
        dns: {
          title: 'DNS',
          description: 'Configurer les serveurs DNS pour NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: "Configurer l'adressage IPv4 pour l'interface filaire",
          servers: 'Serveurs',
          dhcp: 'DHCP',
          manual: 'Manuel',
          apply: 'Appliquer',
          invalid: 'Veuillez saisir une adresse IPv4 ou IPv6 valide',
          invalidNetwork:
            'Veuillez saisir une adresse IPv4, un masque de sous-réseau et un routeur valides',
          saved: 'Paramètres DNS enregistrés',
          redirecting: 'Paramètres réseau enregistrés. Ouverture de la nouvelle adresse...',
          saveFailed: "Échec de l'enregistrement des paramètres DNS",
          unsaved: 'Modifications non enregistrées',
          maxServers: '{{count}} serveurs DNS maximum autorisés',
          dhcpServersDescription: 'Les serveurs DNS sont obtenus automatiquement par DHCP',
          manualServersDescription: 'Les serveurs IPv4 et IPv6 sont pris en charge',
          interface: 'Interface',
          ipAddress: 'Adresse IP',
          subnetMask: 'Masque de sous-réseau',
          router: 'Routeur'
        },
        ipv6: {
          title: 'IPv6',
          description: "Configurer l'adressage IPv6 de l'interface filaire",
          disabled: 'Désactivé',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manuel',
          interface: 'Interface',
          state: 'État',
          router: 'Routeur',
          addresses: 'Adresses',
          dhcpv6Client: 'Client DHCPv6',
          notInstalled: 'Non installé',
          ipAddress: 'Adresse IPv6',
          prefix: 'Préfixe',
          invalidManual: 'Saisissez une adresse IPv6, un préfixe et un routeur valides',
          clientMissing:
            "Le client DHCPv6 n'est pas installé. Installez d'abord la mise à jour système raw correspondante.",
          saved: 'Paramètres IPv6 enregistrés',
          saveFailed: "Échec de l'enregistrement des paramètres IPv6",
          unsaved: 'Modifications non enregistrées'
        }
      },
      system: {
        title: 'Système',
        performance: {
          processor: 'Processeur',
          overdrive: {
            title: 'Overdrive de fréquence',
            description:
              'Démarrer avec les fréquences de processeur et de vidéo plus élevées définies par le fabricant',
            tip: "Si l'appareil ne démarre pas avec l'overdrive, la carte SD doit être reflashée",
            unavailable: 'Absent de cette image système',
            keepTitle: "Conserver l'overdrive après les mises à jour",
            keepDescription:
              "Une mise à jour système remet l'appareil sur les fréquences standard si cette option n'est pas activée",
            confirmTitle: "Activer l'overdrive de fréquence?",
            confirmText:
              "Si l'appareil ne démarre pas avec l'overdrive, vous devrez reflasher la carte SD pour le récupérer. Le changement s'applique après le prochain redémarrage.",
            confirmOk: 'Activer'
          },
          watchdog: {
            title: 'Chien de garde matériel',
            description: "Redémarrer automatiquement l'appareil lorsqu'il ne répond plus",
            unavailable: 'Non inclus dans cette image système',
            notRunning: 'Ne fonctionne pas actuellement',
            lastRestart: 'Dernier redémarrage',
            lastRestartCaption: 'Motif le plus récent du redémarrage du système',
            reasonPowerOn: 'Mise sous tension',
            reasonRestart: 'Redémarrage demandé',
            reasonWatchdog: 'Réinitialisation par le chien de garde',
            reasonOverheat: 'Protection contre la surchauffe',
            reasonUnknown: 'Inconnu'
          },
          recovery: 'Récupération',
          memory: 'Mémoire'
        },
        monitor: {
          processorClock: 'Sous-système CPU',
          videoClock: 'Sous-système vidéo',
          videoClockCaption: "Fréquence d'horloge vidéo",
          cpuClockCaption: "Fréquence d'horloge du CPU",
          overdrive: 'Overdrive',
          temperature: 'Température',
          lastMinutes: '5 dernières minutes',
          ram: 'RAM',
          off: 'Désactivé',
          ramHistory: 'Utilisation de la RAM',
          cpuLoad: 'Charge du processeur',
          cpuLoadCaption: 'Utilisateur {{user}} pour cent, système {{system}} pour cent',
          cpuUtilization: 'Utilisation du processeur',
          swapUtilization: 'Utilisation du swap',
          swapSizeLastMinutes: '{{size}}, 5 dernières minutes',
          percent: '{{percent}} pour cent',
          percentUsed: '{{percent}} pour cent utilisé',
          sizeOf: '{{used}} sur {{total}}',
          systemPartition: 'Partition système',
          dataPartition: 'Partition de données',
          unavailable: 'Non disponible',
          noReadings: "L'appareil ne renvoie aucune mesure",
          refresh: 'Mise à jour chaque seconde tant que cette page est ouverte'
        },
        sections: {
          time: 'Heure',
          firewall: 'Pare-feu',
          systemLog: 'Journalisation',
          performance: 'Performances',
          monitor: 'Moniteur',
          services: 'Services',
          webInterface: 'Accès web sécurisé'
        },
        time: {
          saveFailed: "Échec de l'enregistrement des paramètres d'heure",
          saved: "Paramètres d'heure enregistrés",
          syncFailed: "Échec de la synchronisation de l'heure",
          synced: 'Heure synchronisée',
          invalidServers: 'Saisissez au moins un serveur NTP',
          maxServers: '{{count}} serveurs NTP maximum autorisés',
          refresh: 'Actualiser',
          syncNow: 'Synchroniser',
          syncNowDesc: "Régler l'horloge d'après les serveurs NTP maintenant",
          save: 'Enregistrer',
          ntp: {
            title: 'NTP',
            description: "Synchroniser l'heure de l'appareil depuis les serveurs NTP configurés"
          },
          networkTime: 'Heure réseau',
          clock: {
            title: 'Horloge',
            description: "Définir le fuseau horaire local utilisé par les journaux et l'interface",
            current: 'Heure actuelle',
            timezone: 'Fuseau horaire'
          },
          servers: {
            title: 'Serveurs NTP',
            description:
              'Utiliser les serveurs publics par défaut, votre routeur local ou des serveurs NTP personnalisés',
            useRouter: 'Utiliser le routeur',
            useDefaults: 'Utiliser les valeurs par défaut',
            presets: 'Serveurs prédéfinis',
            presetsDesc: 'Remplace la liste des serveurs par un préréglage'
          }
        },
        firewall: {
          saveFailed: "Échec de l'application des paramètres du pare-feu",
          saved: 'Paramètres du pare-feu appliqués',
          cancel: 'Annuler',
          refresh: 'Actualiser',
          backends: 'Backends',
          enableHttpsFirst:
            "Activez HTTPS avant d'activer le mode pare-feu Restreint ou Paranoïaque",
          httpsRequired:
            "Les modes Restreint et Paranoïaque sont désactivés tant que HTTPS n'est pas activé dans Paramètres > Réseau > Services",
          mode: {
            title: 'Mode du pare-feu',
            baseline: 'Base',
            baselineDesc:
              'Profil ouvert de compatibilité. Le pare-feu fonctionne, mais les sources entrantes ne sont pas restreintes. À utiliser uniquement sur des réseaux de confiance.',
            moderate: 'Modéré',
            moderateDesc:
              "Profil par défaut. Conserve les services de Base, mais n'accepte de nouvelles connexions entrantes que depuis des plages privées, link-local ou loopback. L'accès sortant reste ouvert.",
            restricted: 'Restreint',
            restrictedDesc:
              'HTTPS et SSH locaux uniquement, plus DNS, NTP, syslog et mises à jour en ligne sortants. Le DHCP et le trafic IPv6 essentiel restent disponibles. WebRTC est bloqué.',
            paranoid: 'Paranoïaque',
            paranoidDesc:
              'Accès HTTPS local uniquement. Bloque SSH, HTTP, les mises à jour en ligne et les autres fonctions réseau sortantes. Le téléversement de mises à jour hors ligne et les installations déjà préparées restent disponibles.',
            current: 'Actuel',
            default: 'Par défaut',
            localOnly: 'Local uniquement',
            openTag: 'Entrant ouvert',
            httpsRequiredTag: 'HTTPS requis',
            outboundOpen: 'Sortant ouvert',
            outboundLimited: 'Sortant limité',
            httpsOnly: 'HTTPS uniquement'
          },
          moderate: {
            apply: 'Passer à Modéré'
          },
          restricted: {
            enable: 'Activer Restreint',
            confirmTitle: 'Activer le mode Restreint?',
            confirmDesc:
              "L'accès administrateur entrant sera limité aux plages private IPv4, IPv4 link-local/loopback, IPv6 link-local ou IPv6 loopback pour HTTPS et SSH. Les plages publiques ne sont pas autorisées. DNS, NTP, syslog distant, mises à jour en ligne, DHCP, connexions établies et trafic de contrôle IPv6 essentiel sortants restent disponibles. WebRTC/ICE UDP et les autres trafics entrants/sortants seront bloqués."
          },
          paranoid: {
            enable: 'Activer Paranoïaque',
            confirmTitle: 'Activer le mode Paranoïaque?',
            confirmDesc:
              "Seul l'accès HTTPS depuis les plages private IPv4, IPv4 link-local/loopback, IPv6 link-local ou IPv6 loopback restera disponible. SSH, HTTP, mDNS, NTP, téléchargements GitHub et le reste du trafic seront bloqués sauf le minimum DHCP/contrôle IPv6."
          },
          baseline: {
            apply: 'Passer à Base',
            confirmTitle: 'Passer au mode Base ouvert?',
            confirmDesc:
              'Le service de pare-feu reste actif, mais la restriction aux plages sources locales est supprimée. Des plages sources publiques peuvent atteindre les services exposés de NanoKVM si le réseau les route.'
          },
          rules: {
            title: 'Règles actuelles',
            empty: 'Aucune règle'
          }
        },
        saveChanges: 'Enregistrer les modifications',
        unsaved: 'Modifications non enregistrées'
      },
      systemLog: {
        saveFailed: "Échec de l'enregistrement des paramètres de journal",
        saved: 'Paramètres de journal enregistrés',
        invalidHost: 'Saisissez un hôte de serveur syslog',
        logLoadFailed: 'Échec du chargement des journaux',
        save: 'Enregistrer',
        test: 'Envoyer un journal de test',
        testSent: 'Journal de test envoyé',
        testFailed: "Échec de l'envoi du journal de test",
        remote: {
          title: 'Journalisation distante',
          forward: 'Transférer le journal système',
          description: 'Transférer les messages système vers un serveur distant',
          host: 'Serveur',
          hostDesc: "Nom d'hôte ou adresse IPv4 du serveur syslog",
          port: 'Port',
          protocol: 'Port UDP du serveur syslog'
        },
        local: {
          title: 'Tampon du journal système',
          description:
            'Les journaux actuels sont conservés en RAM dans {{path}} pour éviter les écritures sur la carte SD',
          priority: 'Priorité minimale',
          priorityDesc: "Urgence minimale pour qu'un message soit enregistré",
          buffer: 'Taille du tampon',
          bufferDesc: "Taille du journal à laquelle le fichier fait l'objet d'une rotation",
          rotations: 'Rotations',
          rotationsDesc: 'Nombre de fichiers de journal archivés à conserver',
          compact: 'Sortie compacte',
          compactDesc: "Omettre le nom d'hôte et la facility de chaque ligne",
          stripTimestamps: 'Supprimer les horodatages',
          stripTimestampsDesc:
            "Supprimer les horodatages ajoutés par l'émetteur ; syslog ajoute les siens"
        },
        kernel: {
          title: 'Journalisation du noyau',
          enabled: 'Transférer le journal du noyau',
          enabledDesc: 'Enregistrer les messages du noyau dans le journal système',
          consoleLevel: 'Niveau console',
          consoleLevelDesc:
            "Urgence minimale pour qu'un message du noyau soit affiché sur la console"
        },
        viewer: {
          title: 'Journal système',
          refresh: 'Actualiser',
          empty: 'Aucune entrée de journal',
          truncated: 'Seules les données de journal les plus récentes sont affichées',
          linesUnit: 'lignes'
        },
        level: {
          '1': '1 - Alerte',
          '2': '2 - Critique',
          '3': '3 - Erreur',
          '4': '4 - Avertissement',
          '5': '5 - Avis',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Tout'
        }
      },
      user: {
        title: 'Utilisateur'
      },
      networking: {
        title: 'Réseau'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Tunnel chiffré',
        device: 'Cet appareil',
        description: 'Accédez à ce KVM par un tunnel WireGuard',
        unavailable: "WireGuard n'est pas installé sur cet appareil",
        blocked: 'Le mode Paranoïaque du pare-feu bloque WireGuard',
        needsKey: "Définissez une clé privée avant d'activer WireGuard",
        saved: 'Paramètres WireGuard enregistrés',
        save: 'Enregistrer les modifications',
        unsaved: 'Modifications non enregistrées',
        invalid: 'Vérifiez les champs en surbrillance',
        invalidAddress: 'Saisissez une adresse avec son masque, par exemple 10.0.0.1/24',
        invalidKey: 'Saisissez une clé WireGuard de 44 caractères',
        invalidEndpoint: "Saisissez un nom d'hôte ou une adresse IP",
        invalidPort: 'Saisissez un port de 1 à 65535',
        invalidRanges: 'Utilisez des plages IPv4 comme 10.0.0.0/24, pas 0.0.0.0/0',
        status: {
          connected: 'Connecté',
          waiting: 'En attente du pair',
          stopped: 'Arrêté',
          handshake: 'Dernier handshake {{time}}'
        },
        privateKey: {
          title: 'Clé privée',
          description: "Reste sur cet appareil et n'est plus jamais affichée",
          set: 'Définie',
          notSet: 'Non définie',
          setBtn: 'Définir',
          generate: 'Générer',
          remove: 'Supprimer',
          modalTitle: 'Définir la clé privée',
          modalDescription: "La clé est enregistrée sur cet appareil et n'est plus jamais affichée",
          placeholder: 'Collez la clé privée',
          generateConfirmTitle: 'Générer une nouvelle clé privée?',
          generateConfirmDesc:
            'La clé actuelle cesse de fonctionner. Ajoutez ensuite la nouvelle clé publique au pair.',
          removeConfirmTitle: 'Supprimer la clé privée?',
          removeConfirmDesc:
            "WireGuard est désactivé et le reste jusqu'à la définition d'une nouvelle clé."
        },
        publicKey: {
          title: 'Clé publique',
          description: 'Ajoutez-la à la configuration du pair'
        },
        address: {
          title: 'Adresse',
          description: 'Adresse du KVM dans le tunnel et son masque'
        },
        peer: {
          title: 'Pair',
          publicKey: 'Clé publique',
          publicKeyDescription: 'Clé publique du pair auquel vous vous connectez',
          server: 'Serveur',
          serverDescription: "Nom d'hôte ou adresse IP du pair",
          port: 'Port',
          portDescription: 'Port UDP du pair, généralement 51820',
          allowedIps: 'IP autorisées',
          allowedIpsDescription: 'Adresse ou plage du pair dans le tunnel, par exemple 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription:
            'Secondes entre les paquets keepalive, nécessaires derrière un routeur'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Accédez à ce KVM par votre réseau Tailscale',
        service: 'Service',
        performance: 'Performances',
        memory: {
          title: 'Optimisation de la mémoire',
          tip: "Maintient l'utilisation de la mémoire de Tailscale à un faible niveau, ce qui aide sur un appareil disposant de peu de RAM. Redémarrez Tailscale pour que le changement prenne effet."
        },
        swap: {
          title: "Fichier d'échange",
          tip: "Si les problèmes persistent après l'activation de l'optimisation de la mémoire, essayez d'activer le fichier d'échange",
          sizeTip:
            'Cela définit sa taille sur 128MB ; ajustez-la dans Paramètres > Système > Performances'
        },
        restartTitle: 'Redémarrer Tailscale',
        restartDesc: 'Redémarre le service',
        restartBtn: 'Redémarrer',
        restart: 'Êtes-vous sûr de vouloir redémarrer Tailscale?',
        stopTitle: 'Arrêter Tailscale',
        stopBtn: 'Arrêter',
        stop: 'Êtes-vous sûr de vouloir arrêter Tailscale?',
        stopDesc: "Arrête le service et l'empêche de démarrer au démarrage de l'appareil",
        loading: 'Chargement...',
        notInstall: "Tailscale non trouvé, veuillez l'installer",
        install: 'Installer',
        installing: 'Installation',
        failed: 'Installation échouée',
        retry: 'Veuillez rafraîchir et réessayer, ou installez manuellement.',
        download: 'Télécharger le',
        package: "paquet d'installation",
        unzip: 'et décompressez-le',
        upTailscale: 'Téléverser tailscale dans le répertoire NanoKVM /usr/bin/',
        upTailscaled: 'Téléverser tailscaled dans le répertoire NanoKVM /usr/sbin/',
        refresh: 'Rafraîchir la page courante',
        notRunning:
          "Tailscale n'est pas en cours d'exécution. Veuillez le démarrer pour continuer.",
        run: 'Démarrer',
        notLogin: "L'appareil n'est pas relié. Connectez-vous et liez cet appareil à votre compte.",
        urlPeriod: "L'URL est valide pendant 10 minutes",
        login: 'Connexion',
        loginSuccess: 'Connexion réussie',
        deviceName: "Nom de l'appareil",
        deviceIP: "IP de l'appareil",
        account: 'Compte',
        logout: 'Déconnexion',
        logoutDesc: 'Êtes-vous sûr de vouloir vous déconnecter?',
        uninstall: 'Désinstaller Tailscale',
        uninstallDesc: 'Êtes-vous sûr de vouloir désinstaller Tailscale?',
        okBtn: 'Oui',
        cancelBtn: 'Non'
      },
      update: {
        title: 'Mises à jour',
        currentVersion: 'Version actuelle',
        latestVersion: 'Dernière version',
        queryFailed: "Impossible d'obtenir la version",
        updateFailed: 'Mise à jour échouée',
        paranoidBlocked: 'Les mises à jour en ligne sont bloquées par le mode pare-feu Paranoïaque',
        paranoidBlockedDesc:
          "Les vérifications et téléchargements GitHub nécessitent un accès réseau sortant. L'envoi offline et les installations déjà préparées restent disponibles.",
        available: 'Une mise à jour est disponible. Voulez-vous vraiment mettre à jour?',
        updating: 'Mise à jour en cours',
        confirm: 'Confirmer',
        cancel: 'Annuler',
        badge: {
          checking: 'Vérification',
          latest: 'À jour',
          available: 'Mise à jour disponible',
          failed: 'Échec de la vérification',
          local: 'Local'
        },
        application: {
          title: 'Application'
        },
        system: {
          queryFailed: 'Échec de récupération de la version système',
          appUpdateRequired:
            "Mettez l'application à jour vers {{version}} avant d'installer cette mise à jour système",
          requiredAppVersion: "Version d'application requise",
          downloadFailed: 'Échec du téléchargement ou de la vérification',
          available: 'Une mise à jour du système de base est disponible.',
          downloading: 'Téléchargement et vérification de la mise à jour système...',
          downloadVerify: 'Télécharger et vérifier',
          installing: 'Installation de la mise à jour système préparée...',
          install: 'Installer',
          installFailed: "Échec de l'installation",
          installConfirmTitle: 'Installer la mise à jour système?',
          installConfirmDesc:
            'Cela remplacera les fichiers du système de base depuis le paquet vérifié. Un redémarrage sera nécessaire.',
          rawInstallConfirmDesc:
            "Ce paquet vérifié écrira les images raw boot/rootfs sur les partitions de la carte SD et redémarrera automatiquement. L'écriture peut prendre plusieurs minutes; gardez l'alimentation connectée.",
          rawInstallWarning:
            "Il n'y a pas de rollback automatique pour les mises à jour de partitions raw. Si le démarrage échoue, récupérez la carte SD manuellement.",
          rawWaitTitle: 'Installation de la mise à jour système',
          rawWaitWriting: 'Écriture du nouveau système sur la carte SD',
          rawWaitRestarting:
            "L'appareil redémarre. Cette page se recharge dès qu'il est de retour.",
          rawWaitDesc:
            "Cela prend environ trois minutes. Gardez l'alimentation branchée et ne fermez pas cette page.",
          rawWaitSlow:
            "Cela prend plus de temps que prévu. Attendez encore quelques minutes avant de couper l'alimentation.",
          rebootRequired: 'Un redémarrage est nécessaire pour activer cet état système.',
          rollingBack: 'Rollback de la mise à jour système...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback préparé',
          rollbackFailed: 'Rollback échoué',
          rollbackConfirmTitle: 'Faire un rollback de la mise à jour système?',
          rollbackConfirmDesc:
            'Cela restaurera les fichiers depuis la dernière sauvegarde de mise à jour système. Un redémarrage sera nécessaire.',
          stagedDesc:
            "La mise à jour du système a été téléchargée et vérifiée, vous pouvez l'installer",
          refresh: 'Actualiser',
          releaseNotes: 'Notes de version',
          systemVersion: 'Version du système',
          kernel: 'Kernel',
          stagedVersion: 'Version préparée',
          archive: 'Archive',
          requiredFree: 'Espace libre requis',
          fileCount: 'Fichiers',
          rawImages: 'Images raw',
          progress: 'Progression',
          progressMessage: 'Message de progression',
          pendingVersion: 'Version en attente',
          bootHealth: 'État du démarrage',
          healthy: 'Sain',
          unhealthy: 'Nécessite une attention',
          rollbackBackup: 'Sauvegarde rollback'
        },
        offline: {
          title: 'Téléverser un paquet applicatif',
          desc: 'Installer un paquet applicatif depuis cet ordinateur. Le serveur redémarre ensuite.',
          installTitle: "Installer la mise à jour de l'application?",
          installDesc:
            "L'application est remplacée et le serveur redémarre. Vous devrez vous reconnecter."
        },
        local: {
          title: 'Téléverser un paquet système',
          desc: "Installer un paquet système depuis cet ordinateur. Un seul fichier contient l'archive et ses métadonnées signées.",
          choose: 'Choisir un fichier',
          invalidFile: 'Sélectionnez un paquet se terminant par .tar ou .tar.gz.',
          diskTitle: 'Désactiver le disque virtuel?',
          diskWarn:
            "Le paquet est enregistré dans /data, qui est en lecture seule tant que le disque virtuel est activé. Le désactiver empêche l'ordinateur d'accéder à /data. Continuer?",
          uploading: 'Envoi en cours',
          verifying: 'Vérification et préparation du paquet',
          keyTitle: 'Clé de mise à jour locale',
          keyDesc:
            'Clé publique au format PEM autorisée à signer les paquets que vous créez vous-même',
          keyNone: 'Aucune clé définie',
          keySet: 'Définir la clé',
          keyRemove: 'Supprimer',
          signer: 'Signé par',
          section: 'Mises à jour locales',
          keyRequired: 'Clé locale requise'
        }
      },
      account: {
        title: 'Compte',
        webAccount: 'Nom du compte Web',
        password: 'Mot de passe',
        passwordDesc: "Modifier le mot de passe utilisé pour se connecter à l'interface web",
        updateBtn: 'Modifier',
        logoutBtn: 'Déconnexion',
        logoutDesc: 'Êtes-vous sûr de vouloir vous déconnecter?',
        okBtn: 'Oui',
        cancelBtn: 'Non',
        session: {
          title: 'Session'
        },
        logoutOnClose: {
          title: 'Se déconnecter à la fermeture du navigateur',
          description:
            'Terminer la session à la fermeture du navigateur au lieu de la garder ouverte'
        },
        totp: {
          title: 'Authentification à deux facteurs',
          authenticator: "Application d'authentification",
          description:
            "Exiger un code temporel d'une application d'authentification en plus du mot de passe",
          required: 'Exigée par la politique',
          disable: 'Désactiver',
          enableTitle: "Configurer l'authentification à deux facteurs",
          enableDescription:
            'Confirmez votre mot de passe pour continuer. Il est requis pour toute modification du second facteur.',
          continue: 'Continuer',
          disableTitle: "Désactiver l'authentification à deux facteurs?",
          disableDescription:
            'Votre compte ne sera plus protégé que par son mot de passe. Confirmez avec votre mot de passe pour continuer.',
          disableFailed: "Impossible de désactiver l'authentification à deux facteurs",
          passwordPlaceholder: 'Mot de passe actuel',
          enrollFailed: 'Impossible de démarrer la configuration',
          invalidCode: 'Ce code ne correspond pas. Essayez le suivant.',
          scan: "Scannez ceci avec votre application d'authentification.",
          manualEntry: 'Ou saisissez cette clé manuellement :',
          codePlaceholder: 'Saisissez le code à 6 chiffres pour confirmer',
          confirm: 'Confirmer',
          cancel: 'Annuler',
          backupTitle: 'Enregistrez vos codes de secours maintenant',
          backupDescription:
            "Chaque code ne fonctionne qu'une fois et ne sera plus affiché. Ils sont le seul moyen de revenir si vous perdez votre application d'authentification, et ils continuent de fonctionner quand l'horloge de l'appareil n'est pas synchronisée.",
          copy: 'Copier',
          copied: 'Codes de secours copiés',
          savedThem: 'Je les ai enregistrés',
          remaining: '{{remaining}} codes de secours restants',
          clockUnsynced:
            "L'horloge de l'appareil n'est pas encore synchronisée. Synchronisez l'heure dans Paramètres > Système > Heure avant la configuration.",
          noBackupCodes:
            'Il ne reste aucun code de secours. Sélectionnez Générer pour en émettre un nouveau jeu.',
          regenerate: 'Nouveaux codes de secours',
          generate: 'Générer',
          regenerateTitle: 'Émettre de nouveaux codes de secours?',
          regenerateDescription:
            'Vos codes de secours actuels cesseront de fonctionner. Confirmez avec votre mot de passe pour continuer.',
          regenerateFailed: "Impossible d'émettre de nouveaux codes de secours",
          download: 'Télécharger',
          copyFailed: 'Copie impossible. Sélectionnez les codes et copiez-les manuellement.',
          requireTitle: "Exiger l'authentification à deux facteurs",
          requireDescription:
            "Empêche la désactivation de l'authentification à deux facteurs, et un compte qui n'en dispose pas doit la configurer avant d'utiliser l'appareil",
          requireFailed: "Impossible de modifier l'exigence",
          requiredTitle: "L'authentification à deux facteurs est requise",
          requiredDescription:
            "Cet appareil est configuré pour exiger un second facteur, mais votre compte n'en a pas encore. Configurez-le maintenant pour continuer."
        }
      }
    },
    picoclaw: {
      title: 'Assistant PicoClaw',
      empty: 'Décrivez une tâche pour commencer',
      inputPlaceholder: 'Décrivez ce que vous voulez que PicoClaw fasse',
      newConversation: 'Nouvelle conversation',
      processing: 'Traitement...',
      agent: {
        defaultTitle: 'Assistant général',
        defaultDescription: "Aide générale sur le chat, la recherche et l'espace de travail",
        kvmTitle: 'Contrôle à distance',
        kvmDescription: "Faites fonctionner l'hôte distant via NanoKVM",
        switched: "Rôle d'agent modifié",
        switchFailed: "Échec du changement de rôle d'agent"
      },
      send: 'Envoyer',
      cancel: 'Annuler',
      status: {
        connecting: 'Connexion à la passerelle...',
        connected: 'Session PicoClaw connectée',
        disconnected: 'Session PicoClaw fermée',
        stopped: "Demande d'arrêt envoyée",
        runtimeStarted: 'Runtime PicoClaw démarré',
        runtimeStartFailed: 'Échec du démarrage du runtime PicoClaw',
        runtimeStopped: 'Runtime PicoClaw arrêté',
        runtimeStopFailed: "Échec de l'arrêt du runtime PicoClaw"
      },
      connection: {
        runtime: {
          checking: 'Vérification',
          ready: 'Runtime prêt',
          stopped: 'Runtime arrêté',
          unavailable: 'Runtime indisponible',
          configError: 'Erreur de configuration'
        },
        transport: {
          connecting: 'Connexion',
          connected: 'Connecté'
        },
        run: {
          idle: 'Inactif',
          busy: 'Occupé'
        }
      },
      error: {
        lockHeld: 'PicoClaw est utilisé dans une autre fenêtre',
        takenOver: 'Une autre fenêtre a pris le contrôle de PicoClaw',
        authFailed: 'PicoClaw a refusé la connexion',
        upstreamClosed: 'La connexion à PicoClaw a été perdue'
      },
      tool: {
        screenshot: "Capture d'écran en cours",
        loadImage: "Examen de la capture d'écran",
        actions: "Contrôle de l'hôte",
        generic: 'Utilisation de {{name}}',
        type: 'Saisie de {{text}}',
        hotkey: 'Appui sur {{keys}}',
        click: 'Clic',
        doubleClick: 'Double-clic',
        move: 'Déplacement de la souris',
        drag: 'Glisser-déposer',
        scroll: 'Défilement',
        wait: 'Attente'
      },
      message: {
        toolAction: 'Action',
        observation: 'Observation',
        screenshot: "Capture d'écran"
      },
      overlay: {
        locked: "PicoClaw contrôle l'appareil. La saisie manuelle est suspendue."
      },
      install: {
        install: 'Installer PicoClaw',
        installing: 'Installation de PicoClaw',
        success: 'PicoClaw installé avec succès',
        failed: "Échec de l'installation de PicoClaw",
        uninstalled: 'PicoClaw désinstallé avec succès',
        uninstallFailed: 'Échec de la désinstallation',
        requiredTitle: "PicoClaw n'est pas installé",
        requiredDescription: 'Installez PicoClaw avant de démarrer le runtime PicoClaw.',
        progressDescription: "PicoClaw est en cours de téléchargement et d'installation.",
        stages: {
          preparing: 'Préparation',
          downloading: 'Téléchargement',
          extracting: 'Extraction',
          verifying: 'Vérification',
          installing: 'Installation',
          installed: 'Installé',
          install_timeout: 'Délai expiré',
          install_failed: 'Échec'
        }
      },
      model: {
        requiredTitle: 'La configuration du modèle est requise',
        requiredDescription: "Configurez le modèle PicoClaw avant d'utiliser le chat PicoClaw.",
        docsTitle: 'Guide de configuration',
        docsDesc: 'Modèles et protocoles pris en charge',
        menuLabel: 'Configurer le modèle',
        modelIdentifier: 'Identifiant du modèle',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: "URL de base de l'API",
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Clé API',
        apiKeyPlaceholder: 'Saisissez la clé API du modèle',
        apiKeyKeepPlaceholder: 'Laissez vide pour conserver la clé actuelle',
        save: 'Enregistrer',
        saving: 'Enregistrement',
        saved: 'Configuration du modèle enregistrée',
        saveFailed: "Échec de l'enregistrement de la configuration du modèle",
        invalid: "L'identifiant du modèle, l'URL de base de l'API et la clé API sont requis"
      },
      uninstall: {
        confirmTitle: 'Désinstaller PicoClaw',
        confirmContent:
          "Êtes-vous sûr de vouloir désinstaller PicoClaw? Cela supprimera l'exécutable et tous les fichiers de configuration.",
        confirmOk: 'Désinstaller'
      },
      history: {
        title: 'Historique',
        loading: 'Chargement des sessions...',
        emptyTitle: "Pas encore d'historique",
        emptyDescription: 'Les sessions précédentes PicoClaw apparaîtront ici.',
        loadFailed: "Échec du chargement de l'historique de la session",
        deleteFailed: 'Échec de la suppression de la session',
        deleteConfirmTitle: 'Supprimer la session',
        deleteConfirmContent: 'Etes-vous sûr de vouloir supprimer « {{title}} »?',
        deleteConfirmOk: 'Supprimer',
        messageCount_one: '{{count}} message',
        messageCount_many: '{{count}} de messages',
        messageCount_other: '{{count}} messages'
      },
      config: {
        startRuntime: 'Démarrer PicoClaw',
        stopRuntime: 'Arrêter PicoClaw',
        stopConfirm: 'Êtes-vous sûr de vouloir arrêter PicoClaw?'
      },
      start: {
        title: 'Démarrer PicoClaw',
        description: "Démarrez le runtime pour commencer à utiliser l'assistant PicoClaw."
      }
    },
    error: {
      title: 'Nous avons rencontré un problème',
      refresh: 'Actualiser'
    },
    fullscreen: {
      toggle: 'Basculer vers le plein écran'
    },
    menu: {
      collapse: 'Réduire le menu'
    }
  }
};

export default fr;
