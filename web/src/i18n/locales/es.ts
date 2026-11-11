const es = {
  translation: {
    common: {
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      save: 'Guardar',
      discard: 'Descartar',
      delete: 'Eliminar',
      actionFailed: 'La operación ha fallado',
      loading: 'Cargando la configuración del dispositivo...',
      loadFailed: 'No se pudo cargar la configuración del dispositivo',
      retry: 'Reintentar'
    },
    head: {
      desktop: 'Escritorio remoto',
      login: 'Inicio de sesión',
      firstSetup: 'Primera configuración',
      changePassword: 'Cambiar contraseña',
      terminal: 'Consola',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Iniciar sesión',
      placeholderUsername: 'Introduce tu nombre de usuario',
      placeholderPassword: 'Introduce tu contraseña',
      placeholderPassword2: 'Introduce tu contraseña de nuevo',
      noEmptyUsername: 'El nombre de usuario no puede estar vacío',
      noEmptyPassword: 'La contraseña no puede estar vacía',
      invalidUser: 'Nombre de usuario o contraseña incorrectos',
      locked: 'Demasiados inicios de sesión, inténtalo de nuevo más tarde',
      globalLocked: 'Sistema bajo protección, inténtelo nuevamente más tarde',
      error: 'Error inesperado',
      changePassword: 'Cambiar contraseña',
      changePasswordDesc:
        'Para la seguridad de tu dispositivo, por favor, modifica la contraseña de inicio de sesión en la web',
      differentPassword: 'Las contraseñas no coinciden',
      illegalUsername: 'El nombre de usuario contiene caracteres no permitidos',
      illegalPassword:
        'La contraseña debe tener al menos 8 caracteres y no puede contener comillas ni barras',
      forgetPassword: 'Contraseña olvidada',
      ok: 'Aceptar',
      cancel: 'Cancelar',
      loginButtonText: 'Iniciar sesión',
      setupTitle: 'Crear cuenta de administrador',
      setupDescription:
        'Este dispositivo aún no tiene una cuenta web. Crea la primera cuenta de administrador para continuar.',
      setupRecovery:
        'Si se pierde esta contraseña, la recuperación requiere volver a grabar la tarjeta SD',
      setupButtonText: 'Crear cuenta',
      tips: {
        hardenedRecovery:
          'Esta imagen Hardened no permite restablecer la contraseña con el botón BOOT. Si se pierde la contraseña, vuelve a grabar la tarjeta SD y crea una cuenta nueva.',
        change1: 'Ten en cuenta que esta acción cambiará las siguientes contraseñas:',
        change2: 'Contraseña de acceso web',
        change3: 'Contraseña root del sistema para el acceso por SSH'
      },
      placeholderCurrentPassword: 'Contraseña actual',
      placeholderNewPassword: 'Contraseña nueva',
      wrongCurrentPassword: 'La contraseña actual no es correcta',
      totp: {
        title: 'Autenticación en dos pasos',
        prompt: 'Introduce el código de 6 dígitos de tu aplicación de autenticación',
        backupPrompt: 'Introduce uno de tus códigos de respaldo',
        noEmptyCode: 'Introduce un código',
        placeholderCode: 'Código de 6 dígitos',
        placeholderBackup: 'Código de respaldo',
        verifyButtonText: 'Verificar',
        useBackupCode: 'Usar un código de respaldo',
        useAuthenticator: 'Usar el código de la aplicación de autenticación',
        cancel: 'Atrás',
        invalidCode: 'Ese código no es válido. Inténtalo de nuevo.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Configura el Wi-Fi para el NanoKVM',
      success: 'Comprueba el estado de red del NanoKVM y accede a la nueva dirección IP',
      failed: 'La operación ha fallado, vuelve a intentarlo',
      invalidMode:
        'El modo actual no admite la configuración de red. Ve a tu dispositivo y habilita el modo de configuración Wi-Fi.',
      confirmBtn: 'Aceptar',
      finishBtn: 'Finalizado',
      ap: {
        authTitle: 'Autenticación requerida',
        authDescription: 'Introduce la contraseña AP para continuar',
        authFailed: 'Contraseña AP no válida',
        passPlaceholder: 'Contraseña AP',
        verifyBtn: 'Verificar'
      }
    },
    screen: {
      scale: 'Escala',
      title: 'Pantalla',
      video: 'Modo de vídeo',
      videoDirectTips: 'Activa HTTPS en "Ajustes > Red > Servicios" para usar este modo',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC está desactivado en los modos de firewall Restringido y Paranoico',
      transferRunningTitle: 'Transferencia de imagen en curso',
      transferRunningDesc:
        'Cambiar el modo de vídeo recarga la página, lo que cancela la subida o descarga de imagen en curso.',
      transferRunningOk: 'Cambiar modo',
      resolution: 'Resolución',
      auto: 'Automático',
      autoTips:
        'En determinadas resoluciones pueden producirse desgarros de imagen o desplazamiento del ratón, así que ajusta la resolución del host remoto o desactiva el modo automático',
      fps: 'FPS',
      customizeFps: 'Personalizar',
      quality: 'Calidad',
      qualityLossless: 'Sin pérdida',
      qualityHigh: 'Alto',
      qualityMedium: 'Medio',
      qualityLow: 'Bajo',
      frameDetect: 'Detectar fotogramas',
      frameDetectTip:
        'Compara fotogramas y deja de enviar vídeo mientras la pantalla del host remoto no cambia',
      resetHdmi: 'Reiniciar HDMI',
      webrtcConnectionFailed: {
        title: 'Error de conexión de WebRTC',
        description: 'Comprueba la conexión de red o cambia el modo de vídeo'
      },
      captureStatus: {
        hdmiError: 'Error de imagen HDMI',
        unsupportedResolution: 'La resolución actual no es compatible',
        retrieving: 'Obteniendo pantalla...',
        changingResolution: 'Cambiando resolución...',
        updateFailed: 'La pantalla no puede actualizarse ahora',
        videoError: 'Error de visualización de video',
        noHdmi: 'No se detectó señal HDMI',
        unavailable: 'La pantalla no puede mostrarse ahora'
      }
    },
    keyboard: {
      title: 'Teclado',
      paste: 'Pegar',
      tips: 'Sólo están soportadas las letras y símbolos estándar del teclado',
      placeholder: 'Texto para pegar',
      local: 'Teclado móvil',
      virtual: 'Teclado en pantalla',
      readClipboard: 'Leer del portapapeles',
      clipboardPermissionDenied:
        'Permiso de portapapeles denegado, permite el acceso al portapapeles en tu navegador',
      clipboardReadError: 'Error al leer del portapapeles',
      dropdownEnglish: 'Inglés',
      dropdownGerman: 'Alemán',
      dropdownFrench: 'Francés',
      dropdownRussian: 'Ruso',
      dropdownKorean: 'Coreano',
      dropdownJapanese: 'Japonés',
      localInput: 'Entrada del teclado móvil',
      shortcut: {
        title: 'Atajos',
        custom: 'Personalizado',
        capture: 'Haz clic aquí para capturar el acceso directo',
        clear: 'Borrar',
        save: 'Guardar',
        captureTips:
          'Capturar teclas del sistema, como la tecla Windows, requiere permiso de pantalla completa',
        enterFullScreen: 'Alternar el modo de pantalla completa'
      },
      leaderKey: {
        title: 'Tecla líder',
        desc: 'Omite las restricciones del navegador y envía accesos directos al sistema directamente al host remoto',
        howToUse: 'Cómo utilizar',
        simultaneous: {
          title: 'Modo simultáneo',
          desc1: 'Mantenga pulsada la tecla líder y luego pulse el atajo.',
          desc2: 'Intuitivo, pero puede entrar en conflicto con los atajos del sistema.'
        },
        sequential: {
          title: 'Modo secuencial',
          desc1:
            'Pulsa la tecla líder → pulsa el atajo en secuencia → vuelve a pulsar la tecla líder.',
          desc2: 'Requiere más pasos, pero evita por completo conflictos del sistema.'
        },
        enable: 'Habilitar tecla líder',
        tip: 'Al asignarse como tecla líder, esta tecla funciona únicamente como activador de atajos y pierde su comportamiento predeterminado.',
        placeholder: 'Pulsa la tecla líder',
        shiftRight: 'Shift derecho',
        ctrlRight: 'Ctrl derecho',
        metaRight: 'Win derecho',
        recorder: {
          rec: 'REC',
          activate: 'Activar teclas',
          input: 'Pulsa el atajo'
        }
      }
    },
    mouse: {
      title: 'Ratón',
      cursor: 'Estilo de cursor',
      default: 'Cursor por defecto',
      cell: 'Cursor de celda',
      text: 'Cursor de texto',
      grab: 'Cursor de agarre',
      hide: 'Ocultar cursor',
      mode: 'Modo de ratón',
      absolute: 'Modo absoluto',
      relative: 'Modo relativo',
      direction: 'Dirección de la rueda de desplazamiento',
      scrollUp: 'Desplazarse hacia arriba',
      scrollDown: 'Desplácese hacia abajo',
      speed: 'Velocidad de la rueda de desplazamiento',
      sensitivity: 'Velocidad del puntero',
      sensitivityDesc:
        'Para el modo relativo de escritorio: valores más bajos reducen la deriva causada por la aceleración del ratón del host',
      fast: 'Rápida',
      slow: 'Lenta',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Muévete por cualquier punto del área KVM; el cursor remoto conserva su posición entre toques y se mantiene sincronizado con HID absoluto'
      },
      requestPointer:
        'Usando modo relativo, haz clic en el escritorio para obtener el cursor del ratón',
      resetHid: 'Restablecer HID',
      hidOnly: {
        title: 'Modo HID-Only',
        desc: 'Si el ratón o el teclado dejan de responder y restablecer el HID no ayuda, podría tratarse de un problema de compatibilidad entre el NanoKVM y el host.',
        tip1: 'Al activar el modo HID-Only se desmontarán el disco virtual y la red virtual',
        tip2: 'En el modo HID-Only, el montaje de imágenes está desactivado',
        tip3: 'El NanoKVM se reiniciará automáticamente después de cambiar de modo',
        enable: 'Activar el modo HID-Only',
        disable: 'Desactivar el modo HID-Only'
      }
    },
    image: {
      title: 'Imágenes',
      loading: 'Cargando...',
      empty: 'No se ha encontrado nada',
      mountMode: 'Montar como',
      mount: 'Montar',
      orDownload: 'O descargar desde un enlace',
      keepRunning:
        'Puede cerrar esta ventana. La transferencia continúa y su progreso aparece en la lista de imágenes.',
      massStorage: 'Almacenamiento masivo',
      cdRom: 'CD-ROM',
      mountFailed: 'Fallo al montar',
      mountDesc:
        'En algunos sistemas, es necesario expulsar el disco virtual del host remoto antes de montar una imagen',
      diskOnWarn:
        'Montar la imagen desactiva el disco virtual, por lo que el equipo ya no puede acceder a /data. ¿Continuar?',
      diskOffWarn:
        'El disco virtual está desactivado y hay que activarlo para montar la imagen. Los dispositivos USB del equipo se enumeran de nuevo. ¿Continuar?',
      unmountFailed: 'Fallo al desmontar',
      unmountDesc:
        'En algunos sistemas, es necesario expulsar manualmente el disco virtual desde el host remoto antes de desmontar la imagen',
      forceEject: 'Forzar expulsión',
      forceEjectConfirm:
        'El host ha bloqueado la unidad óptica. Forzar la expulsión desconecta el dispositivo USB virtual durante un momento, por lo que el teclado y el ratón pueden desconectarse brevemente. ¿Continuar?',
      usbReconnect: 'Reconectar USB',
      usbReconnectConfirm:
        'Reconecta el gadget USB solo si el host remoto no detectó el cambio de medio. El teclado y el ratón pueden desconectarse brevemente.',
      usbReconnectSuccess: 'USB reconectado',
      usbReconnectFailed: 'Error al reconectar USB',
      addImage: 'Añadir imagen',
      fromUrl: 'Desde URL',
      fromFile: 'Desde archivo',
      turnOff: 'Desactivar',
      deleteDiskShared: 'No se pueden eliminar imágenes mientras el disco virtual esté activado.',
      eject: 'Expulsar',
      download: 'Descargar',
      upload: 'Subir',
      mountTitle: 'Montar imagen',
      deleteTitle: 'Eliminar imagen',
      deleteConfirm: '¿Estás seguro de que deseas eliminar esta imagen?',
      tips: {
        title: 'Cómo subir imágenes',
        usb1: 'Conecta el NanoKVM a tu computadora mediante USB.',
        usb2: 'Asegúrate de que el disco virtual esté montado en Ajustes > Dispositivo > Disco virtual.',
        usb3: 'Abre el disco virtual en tu computadora y copia el archivo de imagen en el directorio raíz del disco virtual.',
        scp1: 'Asegúrate de que el NanoKVM y tu computadora estén en la misma red local.',
        scp2: 'Abre una terminal en tu computadora y usa el comando SCP para subir el archivo de imagen al directorio /data en el NanoKVM.',
        scp3: 'Ejemplo: scp tu-ruta-de-imagen root@tu-ip-del-nanokvm:/data',
        tfCard: 'Tarjeta SD',
        tf1: 'Este método es compatible con el sistema Linux',
        tf2: 'Obtén la tarjeta SD del NanoKVM. En la versión FULL, desmonta primero la carcasa.',
        tf3: 'Inserta la tarjeta SD en un lector de tarjetas y conéctalo a tu computadora.',
        tf4: 'Copia el archivo de imagen en el directorio /data de la tarjeta SD.',
        tf5: 'Inserta la tarjeta SD en el NanoKVM.'
      }
    },
    script: {
      title: 'Script',
      upload: 'Subir',
      run: 'Ejecutar',
      runBackground: 'Ejecutar en segundo plano',
      runFailed: 'Ejecución fallida',
      delDesc: '¿Estás seguro de que deseas eliminar este archivo?',
      delete: 'Eliminar',
      close: 'Cerrar',
      unlockDesc:
        'Los scripts se ejecutan como root en el NanoKVM. Introduzca la contraseña de la cuenta web para subir o ejecutar uno.',
      terminalRequired:
        'Los scripts necesitan acceso al terminal web. Active primero el terminal en la configuración.'
    },
    terminal: {
      title: 'Consola',
      nanokvm: 'Consola del NanoKVM',
      serial: 'Consola del puerto serie',
      unlockTitle: 'Desbloquear terminal',
      unlockDesc: 'Introduce la contraseña de tu cuenta web para iniciar una sesión de terminal',
      unlock: 'Desbloquear',
      unlockFailed: 'No se pudo desbloquear el terminal',
      invalidCredentials: 'Usuario o contraseña no válidos',
      locked: 'Demasiados intentos, inténtalo más tarde',
      sessionClosed: 'Sesión de terminal cerrada. Desbloquea de nuevo para reconectar.',
      sessionError: 'Error de conexión del terminal. Desbloquea de nuevo para reintentar.',
      serialPort: 'Puerto serie',
      serialPortPlaceholder: 'Por ejemplo /dev/ttyS1',
      baudrate: 'Tasa de baudios',
      parity: 'Paridad',
      parityNone: 'Ninguna',
      parityEven: 'Par',
      parityOdd: 'Impar',
      flowControl: 'Control de flujo',
      flowControlNone: 'Ninguno',
      flowControlSoft: 'Software',
      flowControlHard: 'Hardware',
      dataBits: 'Bits de datos',
      stopBits: 'Bits de parada',
      open: 'Abrir consola'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Enviando comando...',
      sent: 'Comando enviado',
      input: 'Dirección MAC',
      ok: 'Aceptar'
    },
    download: {
      input: 'URL de la imagen remota',
      ok: 'OK',
      disabled:
        'Ahora mismo no se pueden descargar ni subir imágenes porque el almacenamiento no es escribible. Si hay una imagen montada, desmóntala y después desactiva el disco virtual para que el almacenamiento vuelva a ser escribible.',
      diskShared: 'Desactiva el disco virtual para usar la descarga de imágenes',
      mountedImage:
        'Esta imagen está montada, desmóntala antes de subir un archivo con el mismo nombre',
      diskOff: 'Desactivar el disco virtual',
      uploadbox: 'Suelta el archivo aquí o haz clic para seleccionar',
      inputfile: 'Archivo de imagen',
      NoISO: 'Sin imagen',
      complete: 'Descarga completada',
      uploadComplete: 'Carga completada',
      downloading: 'Descargando',
      uploading: 'Cargando',
      failed: 'La transferencia falló',
      uploadFailed: 'La carga falló',
      stalled: 'La transferencia se detuvo, comprueba la conexión e inténtalo de nuevo',
      canceled: 'Carga cancelada',
      downloadCanceled: 'Descarga cancelada',
      cancel: 'Cancelar',
      remoteDisabled:
        'La descarga remota de ISO está desactivada en Ajustes > Usuario > Preferencias',
      remoteFailed: 'La descarga remota de ISO falló',
      sha256: 'Suma de comprobación SHA-256 opcional',
      sha256Placeholder: 'Introduce una suma de comprobación SHA-256 de 64 caracteres',
      invalidSHA256: 'SHA-256 debe ser una cadena hexadecimal de 64 caracteres',
      checksumFailed: 'Descarga fallida: error en la verificación SHA-256'
    },
    power: {
      title: 'Encender / Apagar',
      showConfirm: 'Confirmación',
      showConfirmTip: 'Las operaciones de encendido requieren confirmación adicional',
      reset: 'Reiniciar',
      powerShort: 'Botón de encendido: pulsación corta',
      powerLong: 'Botón de encendido: pulsación larga',
      resetConfirm: '¿Ejecutar la operación de reinicio?',
      powerConfirm: '¿Ejecutar la operación de encendido?',
      okBtn: 'Sí',
      cancelBtn: 'No'
    },
    settings: {
      title: 'Ajustes',
      about: {
        title: 'Acerca de',
        information: 'Información',
        ip: 'Dirección IP',
        mdns: 'Dirección local',
        application: 'Versión de la aplicación',
        uptime: 'Tiempo activo',
        community: 'Comunidad',
        credit: 'Basado en <a1>NanoKVM</a1> de Sipeed y <a2>Hardened NanoKVM</a2> de woffko',
        hostname: 'Nombre del dispositivo',
        changeIn: 'Cámbialo en {{path}}',
        updateIn: 'Actualízalo en {{path}}',
        toggleIn: 'Actívalo o desactívalo en {{path}}'
      },
      appearance: {
        title: 'Preferencias',
        display: 'Pantalla',
        language: 'Idioma',
        languageDesc: 'Seleccionar el idioma de la interfaz',
        webTitle: 'Título web',
        webTitleDesc: 'Personaliza el título de la página web',
        layoutMode: 'Diseño de la interfaz',
        layoutModeDesc: 'Usar el diseño de móvil/táctil en este navegador',
        layoutAuto: 'Automático',
        layoutMobile: 'Móvil',
        menuBar: {
          title: 'Barra de menú',
          mode: 'Modo de visualización',
          modeDesc: 'Mostrar barra de menú en la pantalla',
          modeOff: 'Apagado',
          modeAuto: 'Ocultar automáticamente',
          modeAlways: 'Siempre visible',
          keyboardLedStatus: 'Indicadores de bloqueo del teclado',
          keyboardLedStatusDesc:
            'Mostrar el estado de Bloq Num, Bloq Mayús y Bloq Despl del equipo remoto',
          icons: 'Iconos del submenú',
          iconsDesc: 'Mostrar iconos de submenú en la barra de menú',
          terminalWarningTitle: '¿Activar terminal web?',
          terminalWarningDesc:
            'El terminal abre una shell root en el navegador. Actívalo solo en una red de confianza y desactívalo al terminar.',
          terminalWarningConfirm: 'Activar',
          remoteDownload: 'Descargar ISO remota',
          remoteDownloadWarningTitle: '¿Activar descarga remota de ISO?',
          remoteDownloadWarningDesc:
            'NanoKVM descargará una ISO desde una URL y la escribirá en /data. Actívalo solo para URL de confianza y desactívalo al terminar.',
          remoteDownloadWarningConfirm: 'Activar'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Estado de bloqueos del teclado remoto',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Bloq Num',
        numLockShort: 'Num',
        capsLock: 'Bloq Mayús',
        capsLockShort: 'May',
        scrollLock: 'Bloq Despl',
        scrollLockShort: 'Despl',
        on: 'Activado',
        off: 'Desactivado',
        unknown: 'Desconocido'
      },
      device: {
        title: 'Dispositivo',
        minutes: 'min',
        sections: {
          general: 'General',
          connectivity: 'Conectividad',
          hostConnection: 'Conexión con el host',
          inputOutput: 'Entrada y salida'
        },
        oled: {
          title: 'Tiempo de espera de la OLED',
          description: 'La pantalla OLED entra en reposo automáticamente',
          keepOn: 'Mantener la OLED encendida',
          keepOnDescription: 'No apagar nunca la pantalla OLED'
        },
        ssh: {
          description: 'Habilitar acceso remoto SSH',
          tip: 'Establece una contraseña segura en Cuenta > Contraseña antes de activar esta opción'
        },
        swap: {
          title: 'Memoria swap',
          description: 'Usa un archivo swap cuando se agota la memoria',
          size: 'Tamaño de la memoria swap',
          sizeDescription: 'Establece el tamaño del archivo swap',
          tip: 'Habilitar esta función podría acortar la vida útil de tu tarjeta SD'
        },
        mouseJiggler: {
          title: 'Mouse jiggler',
          description: 'Evitar que el host remoto entre en reposo',
          disable: 'Desactivar',
          absolute: 'Modo absoluto',
          relative: 'Modo relativo'
        },
        sessionLock: {
          title: 'Bloquear sesión al estar inactiva',
          description: 'Pedir iniciar sesión de nuevo después de este tiempo'
        },
        mdns: {
          description: 'Habilitar servicio de descubrimiento mDNS',
          tip: 'Permite acceder a este dispositivo por su nombre .local. No es necesario si te conectas por dirección IP o si tu DNS ya resuelve su nombre de host.'
        },
        hdmi: {
          description: 'Habilitar salida HDMI/monitor',
          idleTimeoutTitle: 'Tiempo de espera de captura inactiva',
          idleTimeoutDescription:
            'Detener la captura HDMI después de no haber espectadores activos durante'
        },
        hidOnly: 'Modo HID-Only',
        hidOnlyDesc:
          'Mejora la compatibilidad con el host si el ratón o el teclado dejan de responder',
        hidOnlyTip:
          'El modo HID-Only deja de emular dispositivos virtuales y conserva solo el control básico HID',
        disk: 'Disco virtual',
        diskDesc: 'Montar la tarjeta SD en el host remoto',
        diskLocked: 'Desactivado mientras hay una imagen montada, y activarlo cancela el montaje',
        diskEnable: 'Activar el disco virtual',
        networkChange: 'Cambiar la red virtual',
        diskCancelMount: 'Activar el disco virtual cancela la imagen montada. ¿Continuar?',
        networkCancelMount:
          'Cambiar la red virtual reinicia la conexión USB. Esto cancela la imagen montada y activa el disco virtual. ¿Continuar?',
        diskTransferRunning:
          'Hay una transferencia de imagen en curso. Espera a que termine antes de activar el disco virtual.',
        network: 'Red virtual',
        networkDesc: 'Montar tarjeta de red virtual en el host remoto',
        usbWakeup: 'Activación por USB',
        usbWakeupDesc: 'Permite que eventos de teclado o ratón despierten el host remoto',
        usbWakeupTip: 'Desactívalo si el host registra mensajes USB wakeup repetidos',
        hostname: {
          description: 'Nombre de este dispositivo en la red',
          reachable: 'Accesible en la red local como {{address}}'
        },
        rebootRequired: 'Reinicio necesario',
        rebootPending: 'Reinicio necesario para: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Actualización del sistema'
        },
        reboot: 'Reiniciar',
        rebootDesc: '¿Estás seguro de que deseas reiniciar el NanoKVM?',
        poweroff: 'Apagar',
        poweroffDesc: '¿Seguro que quieres apagar NanoKVM?'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Conexión',
        configuration: 'Configuración',
        wifi: {
          title: 'Wi-Fi',
          description: 'Configura el Wi-Fi',
          apMode: 'El modo AP está activado; conéctate al Wi-Fi escaneando el código QR',
          connect: 'Conectar Wi-Fi',
          connectDesc1: 'Introduce el SSID de la red y la contraseña',
          disconnect: '¿Seguro que quieres desconectar la red?',
          disconnectBtn: 'Desconectar',
          connected: 'Conectado',
          ssid: 'Nombre',
          password: 'Contraseña',
          joinBtn: 'Unirse',
          cancelBtn: 'Cancelar'
        },
        tls: {
          description: 'Habilitar protocolo HTTPS',
          tip: 'Aviso: Usar HTTPS puede aumentar la latencia, especialmente en modo de vídeo MJPEG',
          restartTitle: 'El servidor se reiniciará',
          restartDesc:
            'El cambio de protocolo reinicia el servidor. El navegador cambiará a la nueva dirección después de {{seconds}} segundos:',
          restartOk: 'Aplicar y reiniciar',
          confirmTitle: '¿Mantener el nuevo protocolo?',
          confirmDesc:
            'El servidor ahora usa {{protocol}}. Volverá al protocolo anterior en {{seconds}} segundos si no lo mantienes.',
          confirmKeep: 'Mantener',
          confirmRevert: 'Volver',
          reverting:
            'Volviendo al protocolo anterior. El navegador cambiará a esa dirección después de {{seconds}} segundos.',
          certTitle: '¿Conservar el nuevo certificado?',
          certDesc:
            'El servidor usa ahora el nuevo certificado. Vuelve al anterior en {{seconds}} segundos si no lo conserva.',
          certReverted: 'El certificado anterior ha vuelto'
        },
        trustedProxies: {
          section: 'Proxy inverso',
          title: 'Proxies de confianza',
          description:
            'Proxies inversos en los que el dispositivo confía para informar de la dirección y el protocolo del cliente',
          tip: 'Una dirección de la lista elige la dirección del cliente que registran el límite de inicios de sesión y el registro, así que incluye solo proxies que controles',
          none: 'Ninguno',
          edit: 'Editar',
          editRow: 'Editar lista',
          editTitle: 'Editar proxies de confianza',
          editDescription: 'Cambiar la lista requiere tu contraseña',
          dialogDescription:
            'Introduce la dirección de cada proxy inverso tal como la ve este dispositivo, o un intervalo como 10.0.0.0/24. Un proxy de la lista le indica al dispositivo qué dirección y qué protocolo de cliente usar. Se cree todo lo que reenvía, así que incluye solo proxies que controles.'
        },
        certificate: {
          title: 'Certificado',
          desc: 'De dónde procede el certificado HTTPS',
          requesting: 'Solicitando el certificado',
          selfSigned: 'Autofirmado',
          domain: 'Dominio',
          domainDesc: 'Debe apuntar a este dispositivo, con el puerto 443 accesible desde Internet',
          domainTailscale: 'Definido por Tailscale para este dispositivo',
          domainInvalid: 'Use un nombre de dominio completo, por ejemplo kvm.example.org',
          email: 'Correo electrónico',
          emailDesc: "Opcional, para avisos de Let's Encrypt",
          emailInvalid: 'Use una dirección como nombre@example.org',
          validUntil: 'Válido hasta',
          valid: 'Válido',
          expiresSoon: 'Caduca pronto',
          expired: 'Caducado',
          lastRenewal: 'Última renovación',
          renewed: 'Renovado',
          failed: 'Error',
          renewNow: 'Renovar ahora',
          renewNowDesc: 'Solicitar un nuevo certificado sin esperar',
          renewBtn: 'Renovar',
          applyTitle: 'Cambiar certificado',
          applyOk: 'Aplicar',
          applyAcme:
            "El dispositivo solicita un certificado a Let's Encrypt. Let's Encrypt se conecta al puerto 443 desde Internet para comprobarlo, lo que puede tardar hasta un minuto. Si la solicitud falla, se sigue usando el certificado actual.",
          applyTailscale:
            'El dispositivo obtiene un certificado de Tailscale, lo que puede tardar hasta un minuto. Si la solicitud falla, se sigue usando el certificado actual.',
          applySelfSigned:
            'El dispositivo vuelve a su propio certificado autofirmado. Los navegadores muestran una advertencia.',
          openTitle: 'Abrir la nueva dirección',
          openDesc:
            'El certificado está listo. Abra la dirección de abajo e inicie sesión para conservarlo. Sin su confirmación en 3 minutos, vuelve el certificado anterior.',
          openOk: 'Abrir',
          blockedClock:
            'Los certificados no se pueden solicitar hasta que el reloj del dispositivo esté sincronizado',
          blockedParanoid: 'El modo Paranoico del firewall bloquea las solicitudes de certificado',
          tailscaleUnavailable:
            'Tailscale no se está ejecutando, o los certificados HTTPS no están habilitados para la tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'Configura los servidores DNS para NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Configurar direccionamiento IPv4 para la interfaz cableada',
          servers: 'Servidores',
          dhcp: 'DHCP',
          manual: 'Manual',
          apply: 'Aplicar',
          invalid: 'Introduce una dirección IPv4 o IPv6 válida',
          invalidNetwork: 'Introduce una dirección IPv4, máscara de subred y router válidos',
          saved: 'Configuración DNS guardada',
          redirecting: 'Configuración de red guardada. Abriendo la nueva dirección...',
          saveFailed: 'No se pudo guardar la configuración DNS',
          unsaved: 'Cambios sin guardar',
          maxServers: 'Se permiten como máximo {{count}} servidores DNS',
          dhcpServersDescription: 'Los servidores DNS se obtienen automáticamente por DHCP',
          manualServersDescription: 'Se admiten servidores IPv4 e IPv6',
          interface: 'Interfaz',
          ipAddress: 'Dirección IP',
          subnetMask: 'Máscara de subred',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Configurar direccionamiento IPv6 para la interfaz cableada',
          disabled: 'Desactivado',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manual',
          interface: 'Interfaz',
          state: 'Estado',
          router: 'Router',
          addresses: 'Direcciones',
          dhcpv6Client: 'Cliente DHCPv6',
          notInstalled: 'No instalado',
          ipAddress: 'Dirección IPv6',
          prefix: 'Prefijo',
          invalidManual: 'Introduce una dirección IPv6, un prefijo y un router válidos',
          clientMissing:
            'El cliente DHCPv6 no está instalado. Instala primero la actualización raw del sistema correspondiente.',
          saved: 'Configuración IPv6 guardada',
          saveFailed: 'No se pudo guardar la configuración IPv6',
          unsaved: 'Cambios sin guardar'
        }
      },
      system: {
        title: 'Sistema',
        performance: {
          processor: 'Procesador',
          overdrive: {
            title: 'Overdrive de reloj',
            description:
              'Arrancar con las frecuencias más altas de procesador y vídeo especificadas por el fabricante',
            tip: 'Si el dispositivo no arranca con overdrive, hay que volver a grabar la tarjeta SD',
            unavailable: 'No incluido en esta imagen del sistema',
            keepTitle: 'Mantener el overdrive tras actualizar',
            keepDescription:
              'Una actualización del sistema devuelve el dispositivo a los relojes estándar si esto no está activado',
            confirmTitle: '¿Activar el overdrive de reloj?',
            confirmText:
              'Si el dispositivo no arranca con overdrive, tendrá que volver a grabar la tarjeta SD para recuperarlo. El cambio se aplica tras el próximo reinicio.',
            confirmOk: 'Activar'
          },
          watchdog: {
            title: 'Watchdog de hardware',
            description: 'Reiniciar el dispositivo automáticamente cuando deje de responder',
            unavailable: 'No incluido en esta imagen del sistema',
            notRunning: 'No se está ejecutando ahora',
            lastRestart: 'Último reinicio',
            lastRestartCaption: 'Motivo más reciente por el que se reinició el sistema',
            reasonPowerOn: 'Encendido',
            reasonRestart: 'Reinicio solicitado',
            reasonWatchdog: 'Reinicio del watchdog',
            reasonOverheat: 'Protección contra sobrecalentamiento',
            reasonUnknown: 'Desconocido'
          },
          recovery: 'Recuperación',
          memory: 'Memoria'
        },
        monitor: {
          processorClock: 'Subsistema de CPU',
          videoClock: 'Subsistema de vídeo',
          videoClockCaption: 'Frecuencia de reloj de vídeo',
          cpuClockCaption: 'Frecuencia de reloj de la CPU',
          overdrive: 'Overdrive',
          temperature: 'Temperatura',
          lastMinutes: 'Últimos 5 minutos',
          ram: 'RAM',
          off: 'Desactivado',
          ramHistory: 'Uso de la RAM',
          cpuLoad: 'Carga de la CPU',
          cpuLoadCaption: 'Usuario {{user}} por ciento, sistema {{system}} por ciento',
          cpuUtilization: 'Utilización de la CPU',
          swapUtilization: 'Utilización del swap',
          swapSizeLastMinutes: '{{size}}, últimos 5 minutos',
          percent: '{{percent}} por ciento',
          percentUsed: '{{percent}} por ciento usado',
          sizeOf: '{{used}} de {{total}}',
          systemPartition: 'Partición del sistema',
          dataPartition: 'Partición de datos',
          unavailable: 'No disponible',
          noReadings: 'El dispositivo no devuelve lecturas',
          refresh: 'Se actualiza cada segundo mientras esta página está abierta'
        },
        sections: {
          time: 'Hora',
          firewall: 'Firewall',
          systemLog: 'Registro',
          performance: 'Rendimiento',
          monitor: 'Monitor',
          services: 'Servicios',
          webInterface: 'Acceso web seguro'
        },
        time: {
          saveFailed: 'No se pudieron guardar los ajustes de hora',
          saved: 'Ajustes de hora guardados',
          syncFailed: 'No se pudo sincronizar la hora',
          synced: 'Hora sincronizada',
          invalidServers: 'Introduce al menos un servidor NTP',
          maxServers: 'Máximo {{count}} servidores NTP permitidos',
          refresh: 'Actualizar',
          syncNow: 'Sincronizar',
          syncNowDesc: 'Ajusta el reloj con los servidores NTP ahora',
          save: 'Guardar',
          ntp: {
            title: 'NTP',
            description: 'Sincronizar la hora del dispositivo desde los servidores NTP configurados'
          },
          networkTime: 'Hora de red',
          clock: {
            title: 'Reloj',
            description: 'Definir la zona horaria local usada por los registros y la interfaz',
            current: 'Hora actual',
            timezone: 'Zona horaria'
          },
          servers: {
            title: 'Servidores NTP',
            description:
              'Usa los servidores públicos predeterminados, tu router local o servidores NTP personalizados',
            useRouter: 'Usar router',
            useDefaults: 'Usar valores predeterminados',
            presets: 'Servidores predefinidos',
            presetsDesc: 'Sustituye la lista de servidores por una predefinida'
          }
        },
        firewall: {
          saveFailed: 'No se pudieron aplicar los ajustes del firewall',
          saved: 'Ajustes del firewall aplicados',
          cancel: 'Cancelar',
          refresh: 'Actualizar',
          backends: 'Backends',
          enableHttpsFirst:
            'Activa HTTPS antes de activar el modo de firewall Restringido o Paranoico',
          httpsRequired:
            'Los modos Restringido y Paranoico están desactivados hasta que se active HTTPS en Ajustes > Red > Servicios',
          mode: {
            title: 'Modo del firewall',
            baseline: 'Base',
            baselineDesc:
              'Perfil abierto de compatibilidad. El cortafuegos está activo, pero los orígenes entrantes no se restringen. Úsalo solo en redes de confianza.',
            moderate: 'Moderado',
            moderateDesc:
              'Perfil predeterminado. Mantiene los servicios de Base, pero solo acepta nuevas conexiones entrantes de rangos privados, link-local o loopback. El acceso saliente sigue abierto.',
            restricted: 'Restringido',
            restrictedDesc:
              'HTTPS y SSH solo locales, más DNS, NTP, syslog y actualizaciones en línea salientes. DHCP y el tráfico IPv6 esencial siguen disponibles. WebRTC está bloqueado.',
            paranoid: 'Paranoico',
            paranoidDesc:
              'Acceso HTTPS solo local. Bloquea SSH, HTTP, las actualizaciones en línea y otras funciones de red de salida. La subida de actualizaciones sin conexión y las instalaciones ya preparadas siguen disponibles.',
            current: 'Actual',
            default: 'Predeterminado',
            localOnly: 'Solo local',
            openTag: 'Entrada abierta',
            httpsRequiredTag: 'Requiere HTTPS',
            outboundOpen: 'Salida abierta',
            outboundLimited: 'Salida limitada',
            httpsOnly: 'Solo HTTPS'
          },
          moderate: {
            apply: 'Cambiar a Moderado'
          },
          restricted: {
            enable: 'Activar Restringido',
            confirmTitle: '¿Activar el modo Restringido?',
            confirmDesc:
              'El acceso administrativo entrante se limitará a rangos private IPv4, IPv4 link-local/loopback, IPv6 link-local o IPv6 loopback para HTTPS y SSH. No se permiten rangos públicos de origen. DNS, NTP, syslog remoto, actualizaciones online, DHCP, conexiones establecidas y tráfico esencial IPv6 salientes seguirán disponibles. WebRTC/ICE UDP y el resto del tráfico entrante/saliente se bloquearán.'
          },
          paranoid: {
            enable: 'Activar Paranoico',
            confirmTitle: '¿Activar el modo Paranoico?',
            confirmDesc:
              'Solo quedará disponible el acceso HTTPS desde rangos private IPv4, IPv4 link-local/loopback, IPv6 link-local o IPv6 loopback. SSH, HTTP, mDNS, NTP, descargas de GitHub y el resto del tráfico se bloquearán salvo el mínimo DHCP/control IPv6.'
          },
          baseline: {
            apply: 'Cambiar a Base',
            confirmTitle: '¿Cambiar al modo Base abierto?',
            confirmDesc:
              'El servicio de firewall sigue activo, pero se elimina la restricción a rangos de origen solo locales. Los rangos de origen públicos pueden llegar a los servicios expuestos de NanoKVM si la red los enruta.'
          },
          rules: {
            title: 'Reglas actuales',
            empty: 'Sin reglas'
          }
        },
        saveChanges: 'Guardar cambios',
        unsaved: 'Cambios sin guardar'
      },
      systemLog: {
        saveFailed: 'No se pudieron guardar los ajustes de registro',
        saved: 'Ajustes de registro guardados',
        invalidHost: 'Introduce un host de servidor syslog',
        logLoadFailed: 'No se pudieron cargar los registros',
        save: 'Guardar',
        test: 'Enviar registro de prueba',
        testSent: 'Registro de prueba enviado',
        testFailed: 'No se pudo enviar el registro de prueba',
        remote: {
          title: 'Registro remoto',
          forward: 'Reenviar el registro del sistema',
          description: 'Reenvía los mensajes del sistema a un servidor remoto',
          host: 'Servidor',
          hostDesc: 'Nombre de host o dirección IPv4 del servidor syslog',
          port: 'Puerto',
          protocol: 'Puerto UDP del servidor syslog'
        },
        local: {
          title: 'Búfer del registro del sistema',
          description:
            'Los registros actuales se mantienen en RAM en {{path}} para evitar escrituras en la tarjeta SD',
          priority: 'Prioridad mínima',
          priorityDesc: 'Urgencia mínima para que un mensaje se registre',
          buffer: 'Tamaño del búfer',
          bufferDesc: 'Tamaño del registro a partir del cual se rota el archivo',
          rotations: 'Rotaciones',
          rotationsDesc: 'Número de archivos de registro rotados que se conservan',
          compact: 'Salida compacta',
          compactDesc: 'Omite el nombre de host y la facilidad de cada línea',
          stripTimestamps: 'Quitar marcas de tiempo',
          stripTimestampsDesc:
            'Elimina las marcas de tiempo añadidas por el emisor; syslog añade las suyas'
        },
        kernel: {
          title: 'Registro del kernel',
          enabled: 'Reenviar el registro del kernel',
          enabledDesc: 'Captura los mensajes del kernel en el registro del sistema',
          consoleLevel: 'Nivel de consola',
          consoleLevelDesc:
            'Urgencia mínima para que un mensaje del kernel se imprima en la consola'
        },
        viewer: {
          title: 'Registro del sistema',
          refresh: 'Actualizar',
          empty: 'No hay entradas de registro',
          truncated: 'Solo se muestran los datos de registro más recientes',
          linesUnit: 'líneas'
        },
        level: {
          '1': '1 - Alerta',
          '2': '2 - Crítico',
          '3': '3 - Error',
          '4': '4 - Advertencia',
          '5': '5 - Aviso',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Todo'
        }
      },
      user: {
        title: 'Usuario'
      },
      networking: {
        title: 'Red'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Túnel cifrado',
        device: 'Este dispositivo',
        description: 'Accede a este KVM mediante un túnel WireGuard',
        unavailable: 'WireGuard no está instalado en este dispositivo',
        blocked: 'El modo Paranoico del firewall bloquea WireGuard',
        needsKey: 'Define una clave privada antes de activar WireGuard',
        saved: 'Configuración de WireGuard guardada',
        save: 'Guardar cambios',
        unsaved: 'Cambios sin guardar',
        invalid: 'Revisa los campos resaltados',
        invalidAddress: 'Introduce una dirección con su máscara, como 10.0.0.1/24',
        invalidKey: 'Introduce una clave WireGuard de 44 caracteres',
        invalidEndpoint: 'Introduce un nombre de host o una dirección IP',
        invalidPort: 'Introduce un puerto del 1 al 65535',
        invalidRanges: 'Usa rangos IPv4 como 10.0.0.0/24, no 0.0.0.0/0',
        status: {
          connected: 'Conectado',
          waiting: 'Esperando al peer',
          stopped: 'Detenido',
          handshake: 'Último handshake {{time}}'
        },
        privateKey: {
          title: 'Clave privada',
          description: 'Se queda en este dispositivo y no se vuelve a mostrar nunca',
          set: 'Definida',
          notSet: 'No definida',
          setBtn: 'Definir',
          generate: 'Generar',
          remove: 'Quitar',
          modalTitle: 'Definir la clave privada',
          modalDescription: 'La clave se guarda en este dispositivo y no se vuelve a mostrar nunca',
          placeholder: 'Pega la clave privada',
          generateConfirmTitle: '¿Generar una clave privada nueva?',
          generateConfirmDesc:
            'La clave actual deja de funcionar. Después, añade la nueva clave pública al peer.',
          removeConfirmTitle: '¿Quitar la clave privada?',
          removeConfirmDesc:
            'WireGuard se apaga y sigue apagado hasta que se defina una clave nueva.'
        },
        publicKey: {
          title: 'Clave pública',
          description: 'Añádela a la configuración del peer'
        },
        address: {
          title: 'Dirección',
          description: 'Dirección del KVM en el túnel y su máscara'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Clave pública',
          publicKeyDescription: 'Clave pública del peer al que te conectas',
          server: 'Servidor',
          serverDescription: 'Nombre de host o dirección IP del peer',
          port: 'Puerto',
          portDescription: 'Puerto UDP del peer, normalmente 51820',
          allowedIps: 'IP permitidas',
          allowedIpsDescription: 'Dirección o rango del peer en el túnel, como 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Segundos entre paquetes keepalive, necesarios detrás de un router'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Accede a este KVM mediante tu red Tailscale',
        service: 'Servicio',
        performance: 'Rendimiento',
        memory: {
          title: 'Optimización de memoria',
          tip: 'Mantiene bajo el uso de memoria de Tailscale, lo que ayuda en un dispositivo con poca RAM. Reinicia Tailscale para que el cambio surta efecto.'
        },
        swap: {
          title: 'Archivo swap',
          tip: 'Si los problemas persisten después de activar la optimización de memoria, prueba a activar el archivo swap',
          sizeTip: 'Esto establece su tamaño en 128 MB; ajústalo en Ajustes > Sistema > Rendimiento'
        },
        restartTitle: 'Reiniciar Tailscale',
        restartDesc: 'Reinicia el servicio',
        restartBtn: 'Reiniciar',
        restart: '¿Seguro que deseas reiniciar Tailscale?',
        stopTitle: 'Detener Tailscale',
        stopBtn: 'Detener',
        stop: '¿Seguro que deseas detener Tailscale?',
        stopDesc: 'Detiene el servicio y evita que se inicie con el sistema',
        loading: 'Cargando...',
        notInstall: 'Tailscale no encontrado, por favor, instálalo',
        install: 'Instalar',
        installing: 'Instalando',
        failed: 'La instalación falló',
        retry: 'Por favor, actualiza la página e inténtalo de nuevo, o instala manualmente.',
        download: 'Descargar el',
        package: 'paquete de instalación',
        unzip: 'y descomprimirlo',
        upTailscale: 'Sube tailscale al directorio /usr/bin/ del NanoKVM',
        upTailscaled: 'Sube tailscaled al directorio /usr/sbin/ del NanoKVM',
        refresh: 'Actualizar la página actual',
        notRunning: 'Tailscale no se está ejecutando. Por favor, inícialo para continuar.',
        run: 'Iniciar',
        notLogin:
          'El dispositivo aún no ha sido vinculado. Por favor, inicia sesión y vincula este dispositivo a tu cuenta.',
        urlPeriod: 'Esta URL es válida por 10 minutos',
        login: 'Iniciar sesión',
        loginSuccess: 'Inicio de sesión exitoso',
        deviceName: 'Nombre del dispositivo',
        deviceIP: 'IP del dispositivo',
        account: 'Cuenta',
        logout: 'Cerrar sesión',
        logoutDesc: '¿Estás seguro de que deseas cerrar sesión?',
        uninstall: 'Desinstalar Tailscale',
        uninstallDesc: '¿Estás seguro de que deseas desinstalar Tailscale?',
        okBtn: 'Sí',
        cancelBtn: 'No'
      },
      update: {
        title: 'Actualizaciones',
        currentVersion: 'Versión actual',
        latestVersion: 'Última versión',
        queryFailed: 'Error al obtener la versión',
        updateFailed: 'La actualización falló',
        paranoidBlocked:
          'Las actualizaciones en línea están bloqueadas por el modo de firewall Paranoico',
        paranoidBlockedDesc:
          'Las comprobaciones y descargas de GitHub requieren acceso de red saliente. La carga offline y las instalaciones ya preparadas siguen disponibles.',
        available: 'Hay una actualización disponible. ¿Estás seguro de que quieres actualizar?',
        updating: 'Actualización iniciada',
        confirm: 'Confirmar',
        cancel: 'Cancelar',
        badge: {
          checking: 'Comprobando',
          latest: 'Actualizado',
          available: 'Actualización disponible',
          failed: 'Error de comprobación',
          local: 'Local'
        },
        application: {
          title: 'Aplicación'
        },
        system: {
          queryFailed: 'No se pudo obtener la versión del sistema',
          appUpdateRequired:
            'Actualiza la aplicación a {{version}} antes de instalar esta actualización del sistema',
          requiredAppVersion: 'Versión de aplicación requerida',
          downloadFailed: 'Falló la descarga o verificación',
          available: 'Hay una actualización del sistema base disponible.',
          downloading: 'Descargando y verificando actualización del sistema...',
          downloadVerify: 'Descargar y verificar',
          installing: 'Instalando actualización del sistema preparada...',
          install: 'Instalar',
          installFailed: 'Instalación fallida',
          installConfirmTitle: '¿Instalar actualización del sistema?',
          installConfirmDesc:
            'Esto reemplazará archivos del sistema base desde el paquete verificado. Será necesario reiniciar.',
          rawInstallConfirmDesc:
            'Este paquete verificado escribirá imágenes raw boot/rootfs en las particiones de la tarjeta SD y reiniciará automáticamente. La escritura puede tardar varios minutos; mantén la alimentación conectada.',
          rawInstallWarning:
            'No hay rollback automático para actualizaciones de particiones raw. Si falla el arranque, recupera la tarjeta SD manualmente.',
          rawWaitTitle: 'Instalando la actualización del sistema',
          rawWaitWriting: 'Escribiendo el nuevo sistema en la tarjeta SD',
          rawWaitRestarting:
            'El dispositivo se está reiniciando. Esta página se recarga cuando vuelva a estar disponible.',
          rawWaitDesc:
            'Tarda unos tres minutos. Mantén la alimentación conectada y no cierres esta página.',
          rawWaitSlow:
            'Está tardando más de lo esperado. Espera unos minutos más antes de cortar la alimentación.',
          rebootRequired: 'Se requiere reiniciar para activar este estado del sistema.',
          rollingBack: 'Revirtiendo actualización del sistema...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback preparado',
          rollbackFailed: 'Rollback fallido',
          rollbackConfirmTitle: '¿Hacer rollback de la actualización del sistema?',
          rollbackConfirmDesc:
            'Esto restaurará archivos desde la última copia de la actualización del sistema. Será necesario reiniciar.',
          stagedDesc: 'La actualización del sistema se descargó y verificó, ya puedes instalarla',
          refresh: 'Actualizar',
          releaseNotes: 'Notas de la versión',
          systemVersion: 'Versión del sistema',
          kernel: 'Kernel',
          stagedVersion: 'Versión preparada',
          archive: 'Archivo',
          requiredFree: 'Espacio libre requerido',
          fileCount: 'Archivos',
          rawImages: 'Imágenes raw',
          progress: 'Progreso',
          progressMessage: 'Mensaje de progreso',
          pendingVersion: 'Versión pendiente',
          bootHealth: 'Estado de arranque',
          healthy: 'Correcto',
          unhealthy: 'Requiere atención',
          rollbackBackup: 'Copia de rollback'
        },
        offline: {
          title: 'Subir paquete de la aplicación',
          desc: 'Instalar un paquete de la aplicación desde este equipo. Después, el servidor se reinicia.',
          installTitle: '¿Instalar actualización de la aplicación?',
          installDesc:
            'Se sustituye la aplicación y el servidor se reinicia. Tendrás que volver a iniciar sesión.'
        },
        local: {
          title: 'Subir paquete del sistema',
          desc: 'Instalar un paquete del sistema desde este equipo. Un solo archivo contiene el archivo comprimido y sus metadatos firmados.',
          choose: 'Elegir archivo',
          invalidFile: 'Seleccione un paquete que termine en .tar o .tar.gz.',
          diskTitle: '¿Desactivar el disco virtual?',
          diskWarn:
            'El paquete se guarda en /data, que es de solo lectura mientras el disco virtual está activado. Al desactivarlo, el equipo ya no puede acceder a /data. ¿Continuar?',
          uploading: 'Subiendo',
          verifying: 'Verificando y preparando el paquete',
          keyTitle: 'Clave de actualización local',
          keyDesc: 'Clave pública en formato PEM que puede firmar los paquetes que usted compile',
          keyNone: 'Sin clave definida',
          keySet: 'Definir clave',
          keyRemove: 'Quitar',
          signer: 'Firmado por',
          section: 'Actualizaciones locales',
          keyRequired: 'Se requiere clave local'
        }
      },
      account: {
        title: 'Cuenta',
        webAccount: 'Nombre de la cuenta web',
        password: 'Contraseña',
        passwordDesc: 'Cambia la contraseña que se usa para iniciar sesión en la interfaz web',
        updateBtn: 'Cambiar',
        logoutBtn: 'Cerrar sesión',
        logoutDesc: '¿Estás seguro de que deseas cerrar sesión?',
        okBtn: 'Sí',
        cancelBtn: 'No',
        session: {
          title: 'Sesión'
        },
        logoutOnClose: {
          title: 'Cerrar sesión al cerrar el navegador',
          description:
            'Finaliza la sesión cuando se cierra el navegador en lugar de mantenerla abierta'
        },
        totp: {
          title: 'Autenticación en dos pasos',
          authenticator: 'Aplicación de autenticación',
          description:
            'Exige un código temporal de una aplicación de autenticación además de la contraseña',
          required: 'Exigida por la política',
          disable: 'Desactivar',
          enableTitle: 'Configurar la autenticación en dos pasos',
          enableDescription:
            'Confirma tu contraseña para continuar. Es necesaria para cualquier cambio del segundo factor.',
          continue: 'Continuar',
          disableTitle: '¿Desactivar la autenticación en dos pasos?',
          disableDescription:
            'Tu cuenta quedará protegida solo por la contraseña. Confirma con tu contraseña para continuar.',
          disableFailed: 'No se pudo desactivar la autenticación en dos pasos',
          passwordPlaceholder: 'Contraseña actual',
          enrollFailed: 'No se pudo iniciar la configuración',
          invalidCode: 'Ese código no coincide. Prueba con el siguiente.',
          scan: 'Escanea esto con tu aplicación de autenticación.',
          manualEntry: 'O introduce esta clave manualmente:',
          codePlaceholder: 'Introduce el código de 6 dígitos para confirmar',
          confirm: 'Confirmar',
          cancel: 'Cancelar',
          backupTitle: 'Guarda ahora tus códigos de respaldo',
          backupDescription:
            'Cada código funciona una sola vez y no se volverá a mostrar. Son la única forma de volver a entrar si pierdes tu aplicación de autenticación, y siguen funcionando cuando el reloj del dispositivo no está sincronizado.',
          copy: 'Copiar',
          copied: 'Códigos de respaldo copiados',
          savedThem: 'Ya los he guardado',
          remaining: 'Quedan {{remaining}} códigos de respaldo',
          clockUnsynced:
            'El reloj del dispositivo aún no está sincronizado. Sincroniza la hora en Ajustes > Sistema > Hora antes de configurarlo.',
          noBackupCodes:
            'No quedan códigos de respaldo. Selecciona Generar para crear un conjunto nuevo.',
          regenerate: 'Nuevos códigos de respaldo',
          generate: 'Generar',
          regenerateTitle: '¿Generar nuevos códigos de respaldo?',
          regenerateDescription:
            'Tus códigos de respaldo actuales dejarán de funcionar. Confirma con tu contraseña para continuar.',
          regenerateFailed: 'No se pudieron generar nuevos códigos de respaldo',
          download: 'Descargar',
          copyFailed: 'No se pudo copiar. Selecciona los códigos y cópialos manualmente.',
          requireTitle: 'Exigir autenticación en dos pasos',
          requireDescription:
            'Impide desactivar la autenticación en dos pasos, y una cuenta que no la tenga deberá configurarla antes de usar el dispositivo',
          requireFailed: 'No se pudo cambiar el requisito',
          requiredTitle: 'Se requiere autenticación en dos pasos',
          requiredDescription:
            'Este dispositivo está configurado para exigir un segundo factor, pero tu cuenta todavía no tiene ninguno. Configúralo ahora para continuar.'
        }
      }
    },
    picoclaw: {
      title: 'Asistente PicoClaw',
      empty: 'Describe una tarea para empezar',
      inputPlaceholder: 'Describe lo que quieres que haga PicoClaw',
      newConversation: 'Nueva conversación',
      processing: 'Procesando...',
      agent: {
        defaultTitle: 'Asistente general',
        defaultDescription: 'Ayuda general para chat, búsqueda y espacio de trabajo',
        kvmTitle: 'Control remoto',
        kvmDescription: 'Opere el host remoto a través de NanoKVM',
        switched: 'Rol de agente cambiado',
        switchFailed: 'No se pudo cambiar la función del agente'
      },
      send: 'Enviar',
      cancel: 'Cancelar',
      status: {
        connecting: 'Conectándose a la puerta de enlace...',
        connected: 'Sesión de PicoClaw conectada',
        disconnected: 'Sesión de PicoClaw cerrada',
        stopped: 'Solicitud de detención enviada',
        runtimeStarted: 'Tiempo de ejecución de PicoClaw iniciado',
        runtimeStartFailed: 'Error al iniciar el tiempo de ejecución de PicoClaw',
        runtimeStopped: 'Tiempo de ejecución de PicoClaw detenido',
        runtimeStopFailed: 'No se pudo detener el tiempo de ejecución de PicoClaw'
      },
      connection: {
        runtime: {
          checking: 'Comprobando',
          ready: 'Tiempo de ejecución listo',
          stopped: 'Tiempo de ejecución detenido',
          unavailable: 'Tiempo de ejecución no disponible',
          configError: 'Error de configuración'
        },
        transport: {
          connecting: 'Conectando',
          connected: 'Conectado'
        },
        run: {
          idle: 'Inactivo',
          busy: 'Ocupado'
        }
      },
      error: {
        lockHeld: 'PicoClaw se está usando en otra ventana',
        takenOver: 'Otra ventana ha tomado el control de PicoClaw',
        authFailed: 'PicoClaw rechazó la conexión',
        upstreamClosed: 'Se perdió la conexión con PicoClaw'
      },
      tool: {
        screenshot: 'Haciendo una captura de pantalla',
        loadImage: 'Mirando la captura de pantalla',
        actions: 'Controlando el host',
        generic: 'Usando {{name}}',
        type: 'Escribiendo {{text}}',
        hotkey: 'Pulsando {{keys}}',
        click: 'Haciendo clic',
        doubleClick: 'Haciendo doble clic',
        move: 'Moviendo el ratón',
        drag: 'Arrastrando',
        scroll: 'Desplazando',
        wait: 'Esperando'
      },
      message: {
        toolAction: 'Acción',
        observation: 'Observación',
        screenshot: 'Captura de pantalla'
      },
      overlay: {
        locked: 'PicoClaw está controlando el dispositivo. La entrada manual está en pausa.'
      },
      install: {
        install: 'Instalar PicoClaw',
        installing: 'Instalando PicoClaw',
        success: 'PicoClaw instalado correctamente',
        failed: 'Error al instalar PicoClaw',
        uninstalled: 'PicoClaw desinstalado correctamente',
        uninstallFailed: 'Falló la desinstalación',
        requiredTitle: 'PicoClaw no está instalado',
        requiredDescription:
          'Instala PicoClaw antes de iniciar el tiempo de ejecución de PicoClaw.',
        progressDescription: 'PicoClaw se está descargando e instalando.',
        stages: {
          preparing: 'Preparando',
          downloading: 'Descargando',
          extracting: 'Extrayendo',
          verifying: 'Verificando',
          installing: 'Instalando',
          installed: 'Instalado',
          install_timeout: 'Tiempo de espera agotado',
          install_failed: 'Falló'
        }
      },
      model: {
        requiredTitle: 'Se requiere configuración del modelo',
        requiredDescription: 'Configura el modelo PicoClaw antes de usar el chat PicoClaw.',
        docsTitle: 'Guía de configuración',
        docsDesc: 'Modelos y protocolos compatibles',
        menuLabel: 'Configurar modelo',
        modelIdentifier: 'Identificador de modelo',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'URL base de la API',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Clave API',
        apiKeyPlaceholder: 'Introduce la clave API del modelo',
        apiKeyKeepPlaceholder: 'Déjalo vacío para conservar la clave actual',
        save: 'Guardar',
        saving: 'Guardando',
        saved: 'Configuración del modelo guardada',
        saveFailed: 'No se pudo guardar la configuración del modelo',
        invalid: 'Se requieren el identificador del modelo, la URL base de la API y la clave API'
      },
      uninstall: {
        confirmTitle: 'Desinstalar PicoClaw',
        confirmContent:
          '¿Está seguro de que desea desinstalar PicoClaw? Esto eliminará el ejecutable y todos los archivos de configuración.',
        confirmOk: 'Desinstalar'
      },
      history: {
        title: 'Historial',
        loading: 'Cargando sesiones...',
        emptyTitle: 'Aún no hay historial',
        emptyDescription: 'Las sesiones PicoClaw anteriores aparecerán aquí.',
        loadFailed: 'Error al cargar el historial de sesiones',
        deleteFailed: 'No se pudo eliminar la sesión',
        deleteConfirmTitle: 'Eliminar sesión',
        deleteConfirmContent: '¿Está seguro de que desea eliminar "{{title}}"?',
        deleteConfirmOk: 'Eliminar',
        messageCount_one: '{{count}} mensaje',
        messageCount_many: '{{count}} de mensajes',
        messageCount_other: '{{count}} mensajes'
      },
      config: {
        startRuntime: 'Iniciar PicoClaw',
        stopRuntime: 'Detener PicoClaw',
        stopConfirm: '¿Seguro que deseas detener PicoClaw?'
      },
      start: {
        title: 'Iniciar PicoClaw',
        description: 'Inicia el tiempo de ejecución para comenzar a utilizar el asistente PicoClaw.'
      }
    },
    error: {
      title: 'Hemos encontrado un problema',
      refresh: 'Actualizar'
    },
    fullscreen: {
      toggle: 'Activar/Desactivar pantalla completa'
    },
    menu: {
      collapse: 'Colapsar menú'
    }
  }
};

export default es;
