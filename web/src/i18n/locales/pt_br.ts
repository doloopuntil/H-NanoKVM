const pt_br = {
  translation: {
    common: {
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      save: 'Salvar',
      discard: 'Descartar',
      delete: 'Excluir',
      actionFailed: 'Falha na operação',
      loading: 'Carregando configurações do dispositivo...',
      loadFailed: 'Não foi possível carregar as configurações do dispositivo',
      retry: 'Tentar novamente'
    },
    head: {
      desktop: 'Área de trabalho remota',
      login: 'Login',
      firstSetup: 'Primeira configuração',
      changePassword: 'Mudar senha',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Login',
      placeholderUsername: 'Nome de usuário',
      placeholderPassword: 'Senha',
      placeholderPassword2: 'Por favor, digite a senha novamente',
      noEmptyUsername: 'Nome de usuário é obrigatório',
      noEmptyPassword: 'Senha é obrigatória',
      invalidUser: 'Nome de usuário ou senha inválidos',
      locked: 'Muitos logins, tente novamente mais tarde',
      globalLocked: 'Sistema sob proteção, tente novamente mais tarde',
      error: 'Erro inesperado',
      changePassword: 'Mudar senha',
      changePasswordDesc: 'Para a segurança do seu dispositivo, por favor, mude a senha',
      differentPassword: 'Senhas não conferem',
      illegalUsername: 'Nome de usuário contém caracteres inválidos',
      illegalPassword:
        'A senha deve ter pelo menos 8 caracteres e não pode conter aspas nem barras',
      forgetPassword: 'Esqueci a senha',
      ok: 'Ok',
      cancel: 'Cancelar',
      loginButtonText: 'Login',
      setupTitle: 'Criar conta de administrador',
      setupDescription:
        'Ainda não há conta web neste dispositivo. Crie a primeira conta de administrador para continuar.',
      setupRecovery: 'Se esta senha for perdida, a recuperação exige regravar o cartão SD',
      setupButtonText: 'Criar conta',
      tips: {
        hardenedRecovery:
          'Esta imagem Hardened não permite redefinir a senha pelo botão BOOT. Se a senha for perdida, regrave o cartão SD e crie uma nova conta.',
        change1: 'Por favor, note que esta ação irá alterar as seguintes senhas:',
        change2: 'Senha de login da Web',
        change3: 'Senha root do sistema para login SSH'
      },
      placeholderCurrentPassword: 'Senha atual',
      placeholderNewPassword: 'Nova senha',
      wrongCurrentPassword: 'A senha atual está incorreta',
      totp: {
        title: 'Autenticação em duas etapas',
        prompt: 'Digite o código de 6 dígitos do seu app autenticador',
        backupPrompt: 'Digite um dos seus códigos de backup',
        noEmptyCode: 'Digite um código',
        placeholderCode: 'Código de 6 dígitos',
        placeholderBackup: 'Código de backup',
        verifyButtonText: 'Verificar',
        useBackupCode: 'Usar um código de backup',
        useAuthenticator: 'Usar o código do app autenticador',
        cancel: 'Voltar',
        invalidCode: 'Esse código não é válido. Tente novamente.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Configurar Wi-Fi para o NanoKVM',
      success: 'Por favor, verifique o status da rede do NanoKVM e visite o novo endereço IP',
      failed: 'Operação falhou, por favor, tente novamente',
      invalidMode:
        'O modo atual não suporta configuração de rede. Vá para o seu dispositivo e ative o modo de configuração Wi-Fi.',
      confirmBtn: 'Ok',
      finishBtn: 'Finalizado',
      ap: {
        authTitle: 'Autenticação necessária',
        authDescription: 'Por favor, digite a senha AP para continuar',
        authFailed: 'Senha AP inválida',
        passPlaceholder: 'Senha AP',
        verifyBtn: 'Verificar'
      }
    },
    screen: {
      scale: 'Escala',
      title: 'Tela',
      video: 'Modo de vídeo',
      videoDirectTips: 'Ative o HTTPS em "Configurações > Rede > Serviços" para usar este modo',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC está desativado nos modos de firewall Restrito e Paranoico',
      transferRunningTitle: 'Transferência de imagem em andamento',
      transferRunningDesc:
        'Alterar o modo de vídeo recarrega a página e cancela o upload ou download de imagem em andamento.',
      transferRunningOk: 'Alterar modo',
      resolution: 'Resolução',
      auto: 'Automático',
      autoTips:
        'Rasgos na tela ou desvio do mouse podem ocorrer em resoluções específicas, então ajuste a resolução do host remoto ou desative o modo automático',
      fps: 'FPS',
      customizeFps: 'Personalizar',
      quality: 'Qualidade',
      qualityLossless: 'Sem perdas',
      qualityHigh: 'Alta',
      qualityMedium: 'Média',
      qualityLow: 'Baixa',
      frameDetect: 'Detecção de quadros',
      frameDetectTip:
        'Compara os quadros e interrompe o envio de vídeo enquanto a tela do host remoto não mudar',
      resetHdmi: 'Redefinir HDMI',
      webrtcConnectionFailed: {
        title: 'Falha na conexão WebRTC',
        description: 'Verifique a conexão de rede ou alterne o modo de vídeo'
      },
      captureStatus: {
        hdmiError: 'Erro na imagem HDMI',
        unsupportedResolution: 'A resolução atual não é compatível',
        retrieving: 'Obtendo tela...',
        changingResolution: 'Alterando resolução...',
        updateFailed: 'A tela não pode ser atualizada agora',
        videoError: 'Erro na exibição de vídeo',
        noHdmi: 'Nenhum sinal HDMI detectado',
        unavailable: 'A tela não pode ser exibida agora'
      }
    },
    keyboard: {
      title: 'Teclado',
      paste: 'Colar',
      tips: 'Apenas letras e símbolos de teclado padrão são suportados',
      placeholder: 'Texto para colar',
      local: 'Teclado móvel',
      virtual: 'Teclado na tela',
      readClipboard: 'Ler da área de transferência',
      clipboardPermissionDenied:
        'Permissão da área de transferência negada, permita o acesso no seu navegador',
      clipboardReadError: 'Falha ao ler a área de transferência',
      dropdownEnglish: 'Inglês',
      dropdownGerman: 'Alemão',
      dropdownFrench: 'Francês',
      dropdownRussian: 'Russo',
      dropdownKorean: 'Coreano',
      dropdownJapanese: 'Japonês',
      localInput: 'Entrada do teclado do celular',
      shortcut: {
        title: 'Atalhos',
        custom: 'Personalizado',
        capture: 'Clique aqui para capturar o atalho',
        clear: 'Limpar',
        save: 'Salvar',
        captureTips:
          'Capturar teclas do sistema, como a tecla Windows, requer permissão de tela cheia',
        enterFullScreen: 'Alternar modo de tela cheia'
      },
      leaderKey: {
        title: 'Tecla Leader',
        desc: 'Ignore as restrições do navegador e envie atalhos do sistema diretamente para o host remoto',
        howToUse: 'Como usar',
        simultaneous: {
          title: 'Modo simultâneo',
          desc1: 'Pressione e segure a tecla Leader e depois pressione o atalho.',
          desc2: 'Intuitivo, mas pode entrar em conflito com atalhos do sistema.'
        },
        sequential: {
          title: 'Modo sequencial',
          desc1:
            'Pressione a tecla Leader → pressione o atalho em sequência → pressione a tecla Leader novamente.',
          desc2: 'Requer mais etapas, mas evita completamente conflitos de sistema.'
        },
        enable: 'Habilitar tecla Leader',
        tip: 'Quando atribuída como tecla Leader, esta tecla funciona apenas como gatilho de atalho e perde seu comportamento padrão.',
        placeholder: 'Pressione a tecla Leader',
        shiftRight: 'Shift direito',
        ctrlRight: 'Ctrl direito',
        metaRight: 'Win direito',
        recorder: {
          rec: 'REC',
          activate: 'Ativar teclas',
          input: 'Pressione o atalho'
        }
      }
    },
    mouse: {
      title: 'Mouse',
      cursor: 'Estilo do cursor',
      default: 'Cursor padrão',
      cell: 'Cursor de célula',
      text: 'Cursor de texto',
      grab: 'Cursor de arrastar',
      hide: 'Ocultar cursor',
      mode: 'Modo do mouse',
      absolute: 'Modo absoluto',
      relative: 'Modo relativo',
      direction: 'Direção da roda de rolagem',
      scrollUp: 'Role para cima',
      scrollDown: 'Role para baixo',
      speed: 'Velocidade da roda de rolagem',
      sensitivity: 'Velocidade do ponteiro',
      sensitivityDesc:
        'Para o modo relativo de desktop: valores menores reduzem o desvio causado pela aceleração do mouse do host',
      fast: 'Rápido',
      slow: 'Lento',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Mova em qualquer lugar da área KVM; o cursor remoto mantém a posição entre toques e fica sincronizado com HID absoluto'
      },
      requestPointer:
        'Usando o modo relativo, clique na área de trabalho para obter o ponteiro do mouse',
      resetHid: 'Redefinir HID',
      hidOnly: {
        title: 'Modo HID-Only',
        desc: 'Se o mouse ou o teclado pararem de responder e redefinir o HID não ajudar, pode haver um problema de compatibilidade entre o NanoKVM e o host.',
        tip1: 'Ativar o modo HID-Only desmontará o disco virtual e a rede virtual',
        tip2: 'No modo HID-Only, a montagem de imagens fica desativada',
        tip3: 'NanoKVM será reiniciado automaticamente após a troca de modos',
        enable: 'Ativar modo HID-Only',
        disable: 'Desativar modo HID-Only'
      }
    },
    image: {
      title: 'Imagens',
      loading: 'Carregando...',
      empty: 'Nada encontrado',
      mountMode: 'Montar como',
      massStorage: 'Armazenamento em massa',
      cdRom: 'CD-ROM',
      mountFailed: 'Falha na montagem',
      mountDesc:
        'Em alguns sistemas, é necessário ejetar o disco virtual no host remoto antes de montar a imagem',
      diskOnWarn:
        'Montar a imagem desliga o disco virtual, então o computador não pode mais acessar /data. Continuar?',
      diskOffWarn:
        'O disco virtual está desligado e precisa ser ativado para montar a imagem. Os dispositivos USB do computador são reconectados. Continuar?',
      unmountFailed: 'Falha na desmontagem',
      unmountDesc:
        'Em alguns sistemas, é necessário ejetar manualmente do host remoto antes de desmontar a imagem',
      forceEject: 'Forçar ejeção',
      forceEjectConfirm:
        'O host bloqueou a unidade óptica. Forçar a ejeção desconecta o dispositivo USB virtual por um momento, então o teclado e o mouse podem se desconectar brevemente. Continuar?',
      usbReconnect: 'Reconectar USB',
      usbReconnectConfirm:
        'Reconecte o gadget USB apenas se o host remoto não percebeu a troca de mídia. Teclado e mouse podem desconectar por instantes.',
      usbReconnectSuccess: 'USB reconectado',
      usbReconnectFailed: 'Falha ao reconectar USB',
      addImage: 'Adicionar imagem',
      fromUrl: 'Por URL',
      fromFile: 'Por arquivo',
      turnOff: 'Desligar',
      eject: 'Ejetar',
      download: 'Baixar',
      upload: 'Upload',
      mountTitle: 'Montar imagem',
      deleteTitle: 'Excluir imagem',
      deleteConfirm: 'Tem certeza que deseja excluir esta imagem?',
      tips: {
        title: 'Como fazer upload',
        usb1: 'Conecte o NanoKVM ao seu computador via USB.',
        usb2: 'Certifique-se de que o disco virtual está montado em Configurações > Dispositivo > Disco Virtual.',
        usb3: 'Abra o disco virtual no seu computador e copie o arquivo de imagem para o diretório raiz do disco virtual.',
        scp1: 'Certifique-se de que o NanoKVM e seu computador estão na mesma rede local.',
        scp2: 'Abra um terminal no seu computador e use o comando SCP para fazer upload do arquivo de imagem para o diretório /data no NanoKVM.',
        scp3: 'Exemplo: scp seu-caminho-da-imagem root@seu-ip-nanokvm:/data',
        tfCard: 'Cartão SD',
        tf1: 'Este método é suportado em sistemas Linux',
        tf2: 'Remova o cartão SD do NanoKVM. Na versão FULL, desmonte a caixa primeiro.',
        tf3: 'Insira o cartão SD em um leitor de cartão e conecte-o ao seu computador.',
        tf4: 'Copie o arquivo de imagem para o diretório /data no cartão SD.',
        tf5: 'Insira o cartão SD no NanoKVM.'
      }
    },
    script: {
      title: 'Scripts',
      upload: 'Upload',
      run: 'Executar',
      runBackground: 'Executar em segundo plano',
      runFailed: 'Falha na execução',
      delDesc: 'Tem certeza de que deseja excluir este arquivo?',
      delete: 'Excluir',
      close: 'Fechar'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'Terminal NanoKVM',
      serial: 'Terminal de porta serial',
      unlockTitle: 'Desbloquear terminal',
      unlockDesc: 'Digite a senha da conta web para iniciar uma sessão de terminal',
      unlock: 'Desbloquear',
      unlockFailed: 'Falha ao desbloquear terminal',
      invalidCredentials: 'Nome de usuário ou senha inválidos',
      locked: 'Muitas tentativas, tente novamente mais tarde',
      sessionClosed: 'Sessão de terminal fechada. Desbloqueie novamente para reconectar.',
      sessionError: 'Falha na conexão do terminal. Desbloqueie novamente para tentar.',
      serialPort: 'Porta serial',
      serialPortPlaceholder: 'Por exemplo /dev/ttyS1',
      baudrate: 'Taxa de transmissão',
      parity: 'Paridade',
      parityNone: 'Nenhum',
      parityEven: 'Par',
      parityOdd: 'Ímpar',
      flowControl: 'Controle de fluxo',
      flowControlNone: 'Nenhum',
      flowControlSoft: 'Software',
      flowControlHard: 'Hardware',
      dataBits: 'Bits de dados',
      stopBits: 'Bits de parada',
      open: 'Abrir terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Enviando comando...',
      sent: 'Comando enviado',
      input: 'Endereço MAC',
      ok: 'OK'
    },
    download: {
      input: 'URL da imagem remota',
      ok: 'OK',
      disabled:
        'No momento não é possível baixar nem enviar imagens porque o armazenamento não permite gravação. Se houver uma imagem montada, desmonte-a e depois desative o disco virtual para que o armazenamento volte a permitir gravação.',
      diskShared: 'Desligue o disco virtual para usar o download de imagens',
      mountedImage:
        'Esta imagem está montada, desmonte-a antes de enviar um arquivo com o mesmo nome',
      diskOff: 'Desligar o disco virtual',
      uploadbox: 'Solte o arquivo aqui ou clique para selecionar',
      inputfile: 'Arquivo de imagem',
      NoISO: 'Sem imagem',
      complete: 'Download concluído',
      uploadComplete: 'Upload concluído',
      downloading: 'Baixando',
      uploading: 'Enviando',
      failed: 'Falha na transferência',
      uploadFailed: 'Falha no upload',
      stalled: 'A transferência parou, verifique a conexão e tente novamente',
      canceled: 'Upload cancelado',
      downloadCanceled: 'Download cancelado',
      cancel: 'Cancelar',
      remoteDisabled:
        'O download remoto de ISO está desativado em Configurações > Usuário > Preferências',
      remoteFailed: 'Falha no download remoto de ISO',
      sha256: 'Checksum SHA-256 opcional',
      sha256Placeholder: 'Digite um checksum SHA-256 de 64 caracteres',
      invalidSHA256: 'SHA-256 deve ser uma sequência hexadecimal de 64 caracteres',
      checksumFailed: 'Falha no download: a verificação SHA-256 falhou'
    },
    power: {
      title: 'Energia',
      showConfirm: 'Confirmação',
      showConfirmTip: 'Operações de energia requerem uma confirmação extra',
      reset: 'Redefinir',
      powerShort: 'Botão de energia: clique curto',
      powerLong: 'Botão de energia: clique longo',
      resetConfirm: 'Executar a operação de redefinição?',
      powerConfirm: 'Executar a operação de energia?',
      okBtn: 'Sim',
      cancelBtn: 'Não'
    },
    settings: {
      title: 'Configurações',
      about: {
        title: 'Sobre',
        information: 'Informação',
        ip: 'Endereço IP',
        mdns: 'Endereço local',
        application: 'Versão do aplicativo',
        uptime: 'Tempo ativo',
        community: 'Comunidade',
        credit: 'Baseado no <a1>NanoKVM</a1> da Sipeed e no <a2>Hardened NanoKVM</a2> de woffko',
        hostname: 'Nome do dispositivo',
        changeIn: 'Altere em {{path}}',
        updateIn: 'Atualize em {{path}}',
        toggleIn: 'Ative ou desative em {{path}}'
      },
      appearance: {
        title: 'Preferências',
        display: 'Exibição',
        language: 'Idioma',
        languageDesc: 'Selecione o idioma da interface',
        webTitle: 'Título da web',
        webTitleDesc: 'Personalizar o título da página web',
        layoutMode: 'Layout da interface',
        layoutModeDesc: 'Usar o layout de celular/toque neste navegador',
        layoutAuto: 'Automático',
        layoutMobile: 'Celular',
        menuBar: {
          title: 'Barra de menu',
          mode: 'Modo de exibição',
          modeDesc: 'Exibir barra de menu na tela',
          modeOff: 'Desligado',
          modeAuto: 'Ocultar automaticamente',
          modeAlways: 'Sempre visível',
          keyboardLedStatus: 'Indicadores de bloqueio do teclado',
          keyboardLedStatusDesc:
            'Exibir o estado de Num Lock, Caps Lock e Scroll Lock do computador remoto',
          icons: 'Ícones do submenu',
          iconsDesc: 'Exibir ícones de submenus na barra de menu',
          terminalWarningTitle: 'Ativar terminal web?',
          terminalWarningDesc:
            'O terminal abre um shell root no navegador. Ative apenas em uma rede confiável e desative ao terminar.',
          terminalWarningConfirm: 'Ativar',
          remoteDownload: 'Baixar ISO remota',
          remoteDownloadWarningTitle: 'Ativar download remoto de ISO?',
          remoteDownloadWarningDesc:
            'O NanoKVM baixará uma ISO de uma URL e gravará em /data. Ative apenas para URLs confiáveis e desative ao terminar.',
          remoteDownloadWarningConfirm: 'Ativar'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Estado dos bloqueios do teclado remoto',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Ativado',
        off: 'Desativado',
        unknown: 'Desconhecido'
      },
      device: {
        title: 'Dispositivo',
        minutes: 'min',
        sections: {
          general: 'Geral',
          connectivity: 'Conectividade',
          hostConnection: 'Conexão com o host',
          inputOutput: 'Entrada e saída'
        },
        oled: {
          title: 'Tempo limite do OLED',
          description: 'Desligar tela OLED após',
          keepOn: 'Manter o OLED ligado',
          keepOnDescription: 'Nunca desligar a tela OLED'
        },
        ssh: {
          description: 'Habilitar acesso remoto SSH',
          tip: 'Defina uma senha forte em Conta > Senha antes de habilitar esta opção'
        },
        swap: {
          title: 'Swap',
          description: 'Use um arquivo de swap quando a memória estiver acabando',
          size: 'Tamanho do swap',
          sizeDescription: 'Defina o tamanho do arquivo de swap',
          tip: 'Habilitar esta função pode encurtar a vida útil do seu cartão SD'
        },
        mouseJiggler: {
          title: 'Movimentador de mouse',
          description: 'Impedir que o host remoto entre em suspensão',
          disable: 'Desativar',
          absolute: 'Modo absoluto',
          relative: 'Modo relativo'
        },
        sessionLock: {
          title: 'Bloquear sessão quando inativa',
          description: 'Exigir login novamente após este tempo'
        },
        mdns: {
          description: 'Habilitar serviço de descoberta mDNS',
          tip: 'Permite acessar este dispositivo pelo nome .local. Desnecessário se você se conecta por endereço IP ou se o seu DNS já resolve o nome do host.'
        },
        hdmi: {
          description: 'Habilitar saída HDMI/monitor',
          idleTimeoutTitle: 'Tempo limite de captura inativa',
          idleTimeoutDescription: 'Parar a captura HDMI após não haver visualizadores ativos por'
        },
        hidOnly: 'Modo HID-Only',
        hidOnlyDesc:
          'Melhora a compatibilidade com o host se o mouse ou o teclado pararem de responder',
        hidOnlyTip:
          'O modo HID-Only deixa de emular dispositivos virtuais e mantém apenas o controle básico HID',
        disk: 'Disco virtual',
        diskDesc: 'Montar o cartão SD no host remoto',
        diskLocked: 'Desligado enquanto uma imagem estiver montada, e ligá-lo cancela a montagem',
        diskEnable: 'Ativar disco virtual',
        networkChange: 'Alterar rede virtual',
        diskCancelMount: 'Ativar o disco virtual cancela a imagem montada. Continuar?',
        networkCancelMount:
          'Alterar a rede virtual reinicia a conexão USB. Isso cancela a imagem montada e ativa o disco virtual. Continuar?',
        diskTransferRunning:
          'Há uma transferência de imagem em andamento. Aguarde o término antes de ativar o disco virtual.',
        network: 'Rede virtual',
        networkDesc: 'Montar placa de rede virtual no host remoto',
        usbWakeup: 'Ativação por USB',
        usbWakeupDesc: 'Permite que eventos de teclado ou mouse acordem o host remoto',
        usbWakeupTip: 'Desative se o host registrar mensagens USB wakeup repetidas',
        hostname: {
          description: 'Nome deste dispositivo na rede',
          reachable: 'Acessível na rede local como {{address}}'
        },
        rebootRequired: 'Reinício necessário',
        rebootPending: 'Reinício necessário para: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Atualização do sistema'
        },
        reboot: 'Reiniciar',
        rebootDesc: 'Tem certeza de que deseja reiniciar o NanoKVM?',
        poweroff: 'Desligar',
        poweroffDesc:
          'Tem certeza de que deseja desligar o NanoKVM? Ele ficará inacessível até ser ligado novamente.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Conexão',
        configuration: 'Configuração',
        wifi: {
          title: 'Wi-Fi',
          description: 'Configurar Wi-Fi',
          apMode: 'O modo AP está ativado, conecte-se ao Wi-Fi escaneando o QR code',
          connect: 'Conectar Wi-Fi',
          connectDesc1: 'Digite o SSID da rede e a senha',
          disconnect: 'Tem certeza de que deseja desconectar a rede?',
          disconnectBtn: 'Desconectar',
          connected: 'Conectado',
          ssid: 'Nome',
          password: 'Senha',
          joinBtn: 'Entrar',
          cancelBtn: 'Cancelar'
        },
        tls: {
          description: 'Habilitar protocolo HTTPS',
          tip: 'Atenção: O uso de HTTPS pode aumentar a latência, especialmente com o modo de vídeo MJPEG',
          restartTitle: 'O servidor será reiniciado',
          restartDesc:
            'A alteração do protocolo reinicia o servidor. O navegador mudará para o novo endereço após {{seconds}} segundos:',
          restartOk: 'Aplicar e reiniciar',
          confirmTitle: 'Manter o novo protocolo?',
          confirmDesc:
            'O servidor agora usa {{protocol}}. Ele voltará ao protocolo anterior em {{seconds}} segundos se você não o mantiver.',
          confirmKeep: 'Manter',
          confirmRevert: 'Voltar',
          reverting:
            'Voltando ao protocolo anterior. O navegador mudará para esse endereço após {{seconds}} segundos.',
          certTitle: 'Manter o novo certificado?',
          certDesc:
            'O servidor agora usa o novo certificado. Ele volta ao anterior em {{seconds}} segundos se você não o mantiver.',
          certReverted: 'O certificado anterior voltou'
        },
        trustedProxies: {
          section: 'Proxy reverso',
          title: 'Proxies confiáveis',
          description:
            'Proxies reversos em que o dispositivo confia para informar o endereço e o protocolo do cliente',
          tip: 'Um endereço da lista escolhe o endereço do cliente que o limite de login e o registro gravam, então liste apenas proxies que você controla',
          none: 'Nenhum',
          edit: 'Editar',
          editRow: 'Editar lista',
          editTitle: 'Editar proxies confiáveis',
          editDescription: 'Alterar a lista exige sua senha',
          dialogDescription:
            'Informe o endereço de cada proxy reverso como este dispositivo o vê, ou um intervalo como 10.0.0.0/24. Um proxy da lista diz ao dispositivo qual endereço e qual protocolo de cliente usar. Tudo o que ele encaminha é aceito como verdadeiro, então liste apenas proxies que você controla.'
        },
        certificate: {
          title: 'Certificado',
          desc: 'De onde vem o certificado HTTPS',
          requesting: 'Solicitando o certificado',
          selfSigned: 'Autoassinado',
          domain: 'Domínio',
          domainDesc: 'Deve apontar para este dispositivo, com a porta 443 acessível pela internet',
          domainTailscale: 'Definido pelo Tailscale para este dispositivo',
          domainInvalid: 'Use um nome de domínio completo, por exemplo kvm.example.org',
          email: 'E-mail',
          emailDesc: "Opcional, para avisos do Let's Encrypt",
          emailInvalid: 'Use um endereço como nome@example.org',
          validUntil: 'Válido até',
          valid: 'Válido',
          expiresSoon: 'Expira em breve',
          expired: 'Expirado',
          lastRenewal: 'Última renovação',
          renewed: 'Renovado',
          failed: 'Falhou',
          renewNow: 'Renovar agora',
          renewNowDesc: 'Solicitar um novo certificado sem esperar',
          renewBtn: 'Renovar',
          applyTitle: 'Alterar certificado',
          applyOk: 'Aplicar',
          applyAcme:
            "O dispositivo solicita um certificado ao Let's Encrypt. O Let's Encrypt se conecta à porta 443 pela internet para verificá-lo, o que pode levar até um minuto. Se a solicitação falhar, o certificado atual continua em uso.",
          applyTailscale:
            'O dispositivo obtém um certificado do Tailscale, o que pode levar até um minuto. Se a solicitação falhar, o certificado atual continua em uso.',
          applySelfSigned:
            'O dispositivo volta ao seu próprio certificado autoassinado. Os navegadores mostram um aviso.',
          openTitle: 'Abrir o novo endereço',
          openDesc:
            'O certificado está pronto. Abra o endereço abaixo e entre para mantê-lo. Sem a sua confirmação em 3 minutos, o certificado anterior volta.',
          openOk: 'Abrir',
          blockedClock:
            'Os certificados só podem ser solicitados depois que o relógio do dispositivo for sincronizado',
          blockedParanoid: 'O modo Paranoico do firewall bloqueia solicitações de certificado',
          tailscaleUnavailable:
            'O Tailscale não está em execução, ou os certificados HTTPS não estão ativados para a tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'Configurar servidores DNS para o NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Configure o endereçamento IPv4 para a interface cabeada',
          servers: 'Servidores',
          dhcp: 'DHCP',
          manual: 'Manual',
          apply: 'Aplicar',
          invalid: 'Insira um endereço IPv4 ou IPv6 válido',
          invalidNetwork: 'Insira um endereço IPv4, máscara de sub-rede e roteador válidos',
          saved: 'Configurações de DNS salvas',
          redirecting: 'Configurações de rede salvas. Abrindo o novo endereço...',
          saveFailed: 'Falha ao salvar as configurações de DNS',
          unsaved: 'Alterações não salvas',
          maxServers: 'Máximo de {{count}} servidores DNS permitido',
          dhcpServersDescription: 'Os servidores DNS são obtidos automaticamente via DHCP',
          manualServersDescription: 'Servidores IPv4 e IPv6 são compatíveis',
          interface: 'Interface',
          ipAddress: 'Endereço IP',
          subnetMask: 'Máscara de sub-rede',
          router: 'Roteador'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Configurar endereçamento IPv6 para a interface cabeada',
          disabled: 'Desativado',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manual',
          interface: 'Interface',
          state: 'Estado',
          router: 'Roteador',
          addresses: 'Enderecos',
          dhcpv6Client: 'Cliente DHCPv6',
          notInstalled: 'Não instalado',
          ipAddress: 'Endereço IPv6',
          prefix: 'Prefixo',
          invalidManual: 'Insira um endereço IPv6, prefixo e roteador válidos',
          clientMissing:
            'O cliente DHCPv6 não está instalado. Instale primeiro a atualização raw do sistema correspondente.',
          saved: 'Configurações IPv6 salvas',
          saveFailed: 'Falha ao salvar as configurações IPv6',
          unsaved: 'Alterações não salvas'
        }
      },
      system: {
        title: 'Sistema',
        performance: {
          processor: 'Processador',
          overdrive: {
            title: 'Overdrive de clock',
            description:
              'Iniciar com as frequências mais altas de processador e vídeo especificadas pelo fabricante',
            tip: 'Se o dispositivo não iniciar com overdrive, o cartão SD precisa ser regravado',
            unavailable: 'Não incluído nesta imagem do sistema',
            keepTitle: 'Manter o overdrive após atualizações',
            keepDescription:
              'Uma atualização do sistema devolve o dispositivo aos clocks padrão, a menos que isto esteja ativado',
            confirmTitle: 'Ativar o overdrive de clock?',
            confirmText:
              'Se o dispositivo não iniciar com overdrive, você precisará regravar o cartão SD para recuperá-lo. A alteração é aplicada após a próxima reinicialização.',
            confirmOk: 'Ativar'
          },
          watchdog: {
            title: 'Watchdog de hardware',
            description: 'Reiniciar o dispositivo automaticamente quando ele parar de responder',
            unavailable: 'Não incluído nesta imagem do sistema',
            notRunning: 'Não está em execução no momento',
            lastRestart: 'Última reinicialização',
            lastRestartCaption: 'Motivo mais recente da reinicialização do sistema',
            reasonPowerOn: 'Ligado',
            reasonRestart: 'Reinicialização solicitada',
            reasonWatchdog: 'Reinício pelo watchdog',
            reasonOverheat: 'Proteção contra superaquecimento',
            reasonUnknown: 'Desconhecido'
          },
          recovery: 'Recuperação',
          memory: 'Memória'
        },
        monitor: {
          processorClock: 'Subsistema da CPU',
          videoClock: 'Subsistema de vídeo',
          videoClockCaption: 'Frequência de clock de vídeo',
          cpuClockCaption: 'Frequência de clock da CPU',
          overdrive: 'Overdrive',
          temperature: 'Temperatura',
          lastMinutes: 'Últimos 5 minutos',
          ram: 'RAM',
          off: 'Desativado',
          ramHistory: 'Utilização da RAM',
          cpuLoad: 'Carga da CPU',
          cpuLoadCaption: 'Usuário {{user}} por cento, sistema {{system}} por cento',
          cpuUtilization: 'Utilização da CPU',
          swapUtilization: 'Utilização do swap',
          swapSizeLastMinutes: '{{size}}, últimos 5 minutos',
          percent: '{{percent}} por cento',
          percentUsed: '{{percent}} por cento usado',
          sizeOf: '{{used}} de {{total}}',
          systemPartition: 'Partição do sistema',
          dataPartition: 'Partição de dados',
          unavailable: 'Indisponível',
          noReadings: 'O dispositivo não está retornando leituras',
          refresh: 'Atualizado a cada segundo enquanto esta página estiver aberta'
        },
        sections: {
          time: 'Hora',
          firewall: 'Firewall',
          systemLog: 'Registros',
          performance: 'Desempenho',
          monitor: 'Monitor',
          services: 'Serviços',
          webInterface: 'Acesso web seguro'
        },
        time: {
          saveFailed: 'Falha ao salvar as configurações de hora',
          saved: 'Configurações de hora salvas',
          syncFailed: 'Falha ao sincronizar a hora',
          synced: 'Hora sincronizada',
          invalidServers: 'Informe pelo menos um servidor NTP',
          maxServers: 'Máximo de {{count}} servidores NTP permitido',
          refresh: 'Atualizar',
          syncNow: 'Sincronizar',
          syncNowDesc: 'Acertar o relógio com os servidores NTP agora',
          save: 'Salvar',
          ntp: {
            title: 'NTP',
            description: 'Sincronizar a hora do dispositivo pelos servidores NTP configurados'
          },
          networkTime: 'Hora da rede',
          clock: {
            title: 'Relógio',
            description: 'Definir o fuso horário local usado pelos logs e pela interface',
            current: 'Hora atual',
            timezone: 'Fuso horário'
          },
          servers: {
            title: 'Servidores NTP',
            description:
              'Use os servidores públicos padrão, seu roteador local ou servidores NTP personalizados',
            useRouter: 'Usar roteador',
            useDefaults: 'Usar padrões',
            presets: 'Servidores predefinidos',
            presetsDesc: 'Substitui a lista de servidores por uma predefinição'
          }
        },
        firewall: {
          saveFailed: 'Falha ao aplicar as configurações do firewall',
          saved: 'Configurações do firewall aplicadas',
          cancel: 'Cancelar',
          refresh: 'Atualizar',
          backends: 'Backends',
          enableHttpsFirst:
            'Ative o HTTPS antes de ativar o modo de firewall Restrito ou Paranoico',
          httpsRequired:
            'Os modos Restrito e Paranoico ficam desativados até que o HTTPS seja ativado em Configurações > Rede > Serviços',
          mode: {
            title: 'Modo do firewall',
            baseline: 'Base',
            baselineDesc:
              'Perfil aberto de compatibilidade. O firewall está ativo, mas as origens de entrada não são restringidas. Use apenas em redes confiáveis.',
            moderate: 'Moderado',
            moderateDesc:
              'Perfil padrão. Mantém os serviços do Base, mas só aceita novas conexões de entrada de faixas privadas, link-local ou loopback. O acesso de saída continua aberto.',
            restricted: 'Restrito',
            restrictedDesc:
              'Somente HTTPS e SSH locais, além de DNS, NTP, syslog e atualizações online de saída. DHCP e o tráfego IPv6 essencial continuam disponíveis. O WebRTC está bloqueado.',
            paranoid: 'Paranoico',
            paranoidDesc:
              'Acesso HTTPS somente local. Bloqueia SSH, HTTP, atualizações online e outros recursos de rede de saída. O envio de atualizações offline e as instalações já preparadas continuam disponíveis.',
            current: 'Atual',
            default: 'Padrão',
            localOnly: 'Somente local',
            openTag: 'Entrada aberta',
            httpsRequiredTag: 'Requer HTTPS',
            outboundOpen: 'Saída aberta',
            outboundLimited: 'Saída limitada',
            httpsOnly: 'Somente HTTPS'
          },
          moderate: {
            apply: 'Mudar para Moderado'
          },
          restricted: {
            enable: 'Ativar Restrito',
            confirmTitle: 'Ativar o modo Restrito?',
            confirmDesc:
              'O acesso administrativo de entrada será limitado a faixas private IPv4, IPv4 link-local/loopback, IPv6 link-local ou IPv6 loopback para HTTPS e SSH. Faixas públicas de origem não são permitidas. DNS, NTP, syslog remoto, atualizações online, DHCP, conexões estabelecidas e tráfego essencial IPv6 de saída permanecerão disponíveis. WebRTC/ICE UDP e demais tráfegos de entrada/saída serão bloqueados.'
          },
          paranoid: {
            enable: 'Ativar Paranoico',
            confirmTitle: 'Ativar o modo Paranoico?',
            confirmDesc:
              'Apenas acesso HTTPS de faixas private IPv4, IPv4 link-local/loopback, IPv6 link-local ou IPv6 loopback permanecerá disponível. SSH, HTTP, mDNS, NTP, downloads do GitHub e outro tráfego serão bloqueados exceto DHCP/controle IPv6 mínimo.'
          },
          baseline: {
            apply: 'Mudar para Base',
            confirmTitle: 'Mudar para o modo Base aberto?',
            confirmDesc:
              'O serviço de firewall continua ativo, mas a restrição a faixas de origem somente locais é removida. Faixas de origem públicas podem alcançar os serviços expostos do NanoKVM se a rede as rotear.'
          },
          rules: {
            title: 'Regras atuais',
            empty: 'Nenhuma regra'
          }
        },
        saveChanges: 'Salvar alterações',
        unsaved: 'Alterações não salvas'
      },
      systemLog: {
        saveFailed: 'Falha ao salvar as configurações de log',
        saved: 'Configurações de log salvas',
        invalidHost: 'Informe um host de servidor syslog',
        logLoadFailed: 'Falha ao carregar logs',
        save: 'Salvar',
        test: 'Enviar log de teste',
        testSent: 'Log de teste enviado',
        testFailed: 'Falha ao enviar log de teste',
        remote: {
          title: 'Registro remoto',
          forward: 'Encaminhar log do sistema',
          description: 'Encaminha as mensagens do sistema para um servidor remoto',
          host: 'Servidor',
          hostDesc: 'Nome do host ou endereço IPv4 do servidor syslog',
          port: 'Porta',
          protocol: 'Porta UDP do servidor syslog'
        },
        local: {
          title: 'Buffer do log do sistema',
          description: 'Os logs atuais ficam em RAM em {{path}} para evitar gravações no cartão SD',
          priority: 'Prioridade mínima',
          priorityDesc: 'Urgência mínima para uma mensagem ser registrada',
          buffer: 'Tamanho do buffer',
          bufferDesc: 'Tamanho do log em que o arquivo é rotacionado',
          rotations: 'Rotações',
          rotationsDesc: 'Número de arquivos de log rotacionados que são mantidos',
          compact: 'Saída compacta',
          compactDesc: 'Omite o nome do host e a facility de cada linha',
          stripTimestamps: 'Remover timestamps',
          stripTimestampsDesc:
            'Remove os carimbos de data e hora adicionados pelo remetente; o syslog adiciona os seus'
        },
        kernel: {
          title: 'Registro do kernel',
          enabled: 'Encaminhar log do kernel',
          enabledDesc: 'Captura as mensagens do kernel no log do sistema',
          consoleLevel: 'Nível do console',
          consoleLevelDesc: 'Urgência mínima para uma mensagem do kernel ser impressa no console'
        },
        viewer: {
          title: 'Log do sistema',
          refresh: 'Atualizar',
          empty: 'Nenhuma entrada de log',
          truncated: 'Apenas os dados de log mais recentes são exibidos',
          linesUnit: 'linhas'
        },
        level: {
          '1': '1 - Alerta',
          '2': '2 - Crítico',
          '3': '3 - Erro',
          '4': '4 - Aviso',
          '5': '5 - Notificação',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Tudo'
        }
      },
      user: {
        title: 'Usuário'
      },
      networking: {
        title: 'Rede'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Túnel criptografado',
        device: 'Este dispositivo',
        description: 'Acesse este KVM por um túnel WireGuard',
        unavailable: 'O WireGuard não está instalado neste dispositivo',
        blocked: 'O modo Paranoico do firewall bloqueia o WireGuard',
        needsKey: 'Defina uma chave privada antes de ativar o WireGuard',
        saved: 'Configurações do WireGuard salvas',
        save: 'Salvar alterações',
        unsaved: 'Alterações não salvas',
        invalid: 'Verifique os campos destacados',
        invalidAddress: 'Digite um endereço com a máscara, como 10.0.0.1/24',
        invalidKey: 'Digite uma chave WireGuard de 44 caracteres',
        invalidEndpoint: 'Digite um nome de host ou endereço IP',
        invalidPort: 'Digite uma porta de 1 a 65535',
        invalidRanges: 'Use intervalos IPv4 como 10.0.0.0/24, não 0.0.0.0/0',
        status: {
          connected: 'Conectado',
          waiting: 'Aguardando o peer',
          stopped: 'Parado',
          handshake: 'Último handshake {{time}}'
        },
        privateKey: {
          title: 'Chave privada',
          description: 'Fica neste dispositivo e nunca é exibida novamente',
          set: 'Definida',
          notSet: 'Não definida',
          setBtn: 'Definir',
          generate: 'Gerar',
          remove: 'Remover',
          modalTitle: 'Definir a chave privada',
          modalDescription: 'A chave é salva neste dispositivo e nunca é exibida novamente',
          placeholder: 'Cole a chave privada',
          generateConfirmTitle: 'Gerar uma nova chave privada?',
          generateConfirmDesc:
            'A chave atual deixa de funcionar. Depois, adicione a nova chave pública ao peer.',
          removeConfirmTitle: 'Remover a chave privada?',
          removeConfirmDesc:
            'O WireGuard é desligado e permanece desligado até que uma nova chave seja definida.'
        },
        publicKey: {
          title: 'Chave pública',
          description: 'Adicione-a à configuração do peer'
        },
        address: {
          title: 'Endereço',
          description: 'Endereço do KVM no túnel e sua máscara'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Chave pública',
          publicKeyDescription: 'Chave pública do peer ao qual você se conecta',
          server: 'Servidor',
          serverDescription: 'Nome de host ou endereço IP do peer',
          port: 'Porta',
          portDescription: 'Porta UDP do peer, normalmente 51820',
          allowedIps: 'IPs permitidos',
          allowedIpsDescription: 'Endereço ou intervalo do peer no túnel, como 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Segundos entre pacotes keepalive, necessários atrás de um roteador'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Acesse este KVM pela sua rede Tailscale',
        service: 'Serviço',
        performance: 'Desempenho',
        memory: {
          title: 'Otimização de memória',
          tip: 'Mantém o uso de memória do Tailscale baixo, o que ajuda em um dispositivo com pouca RAM. Reinicie o Tailscale para que a alteração tenha efeito.'
        },
        swap: {
          title: 'Arquivo de swap',
          tip: 'Se os problemas persistirem após ativar a otimização de memória, tente ativar o arquivo de swap',
          sizeTip:
            'Isso define o tamanho do arquivo como 128MB; ajuste-o em Configurações > Sistema > Desempenho'
        },
        restartTitle: 'Reiniciar Tailscale',
        restartDesc: 'Reinicia o serviço',
        restartBtn: 'Reiniciar',
        restart: 'Reiniciar Tailscale?',
        stopTitle: 'Parar Tailscale',
        stopBtn: 'Parar',
        stop: 'Parar Tailscale?',
        stopDesc: 'Interrompe o serviço e impede que ele inicie com o sistema',
        loading: 'Carregando...',
        notInstall: 'Tailscale não encontrado, por favor, instale',
        install: 'Instalar',
        installing: 'Instalando',
        failed: 'Falha na instalação',
        retry: 'Por favor, atualize e tente novamente, ou instale manualmente.',
        download: 'Baixar o',
        package: 'pacote de instalação',
        unzip: 'e descompacte-o',
        upTailscale: 'Fazer upload do tailscale para o diretório NanoKVM /usr/bin/',
        upTailscaled: 'Fazer upload do tailscaled para o diretório NanoKVM /usr/sbin/',
        refresh: 'Atualizar página atual',
        notRunning: 'Tailscale não está em execução. Por favor, inicie-o para continuar.',
        run: 'Iniciar',
        notLogin:
          'O dispositivo ainda não foi vinculado. Por favor, faça login e vincule este dispositivo à sua conta.',
        urlPeriod: 'Esta URL é válida por 10 minutos',
        login: 'Login',
        loginSuccess: 'Login bem-sucedido',
        deviceName: 'Nome do dispositivo',
        deviceIP: 'IP do dispositivo',
        account: 'Conta',
        logout: 'Sair',
        logoutDesc: 'Tem certeza de que deseja sair?',
        uninstall: 'Desinstalar Tailscale',
        uninstallDesc: 'Tem certeza de que deseja desinstalar Tailscale?',
        okBtn: 'Sim',
        cancelBtn: 'Não'
      },
      update: {
        title: 'Atualizações',
        currentVersion: 'Versão atual',
        latestVersion: 'Versão mais recente',
        queryFailed: 'Falha ao obter a versão',
        updateFailed: 'Falha na atualização',
        paranoidBlocked: 'Atualizações online são bloqueadas pelo modo de firewall Paranoico',
        paranoidBlockedDesc:
          'Verificações e downloads do GitHub exigem acesso de rede de saída. Upload offline e instalações já preparadas continuam disponíveis.',
        available: 'Uma atualização está disponível. Tem certeza de que deseja atualizar agora?',
        updating: 'Atualização iniciada',
        confirm: 'Confirmar',
        cancel: 'Cancelar',
        badge: {
          checking: 'Verificando',
          latest: 'Atualizado',
          available: 'Atualização disponível',
          failed: 'Falha na verificação',
          local: 'Local'
        },
        application: {
          title: 'Aplicativo'
        },
        system: {
          queryFailed: 'Falha ao obter versão do sistema',
          appUpdateRequired:
            'Atualize o aplicativo para {{version}} antes de instalar esta atualização do sistema',
          requiredAppVersion: 'Versão do aplicativo necessária',
          downloadFailed: 'Falha no download ou verificação',
          available: 'Há uma atualização do sistema base disponível.',
          downloading: 'Baixando e verificando atualização do sistema...',
          downloadVerify: 'Baixar e verificar',
          installing: 'Instalando atualização do sistema preparada...',
          install: 'Instalar',
          installFailed: 'Instalação falhou',
          installConfirmTitle: 'Instalar atualização do sistema?',
          installConfirmDesc:
            'Isso substituirá arquivos do sistema base a partir do pacote verificado. Será necessário reiniciar.',
          rawInstallConfirmDesc:
            'Este pacote verificado gravará imagens raw boot/rootfs nas partições do cartão SD e reiniciará automaticamente. A gravação pode levar vários minutos; mantenha a energia conectada.',
          rawInstallWarning:
            'Não há rollback automático para atualizações de partições raw. Se o boot falhar, recupere o cartão SD manualmente.',
          rawWaitTitle: 'Instalando a atualização do sistema',
          rawWaitWriting: 'Gravando o novo sistema no cartão SD',
          rawWaitRestarting:
            'O dispositivo está reiniciando. Esta página recarrega quando ele voltar.',
          rawWaitDesc:
            'Isso leva cerca de três minutos. Mantenha a energia conectada e não feche esta página.',
          rawWaitSlow:
            'Está demorando mais do que o esperado. Aguarde mais alguns minutos antes de cortar a energia.',
          rebootRequired: 'É necessário reiniciar para ativar este estado do sistema.',
          rollingBack: 'Fazendo rollback da atualização do sistema...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback preparado',
          rollbackFailed: 'Rollback falhou',
          rollbackConfirmTitle: 'Fazer rollback da atualização do sistema?',
          rollbackConfirmDesc:
            'Isso restaurará arquivos do backup mais recente da atualização do sistema. Será necessário reiniciar.',
          stagedDesc: 'A atualização do sistema foi baixada e verificada, você já pode instalá-la',
          refresh: 'Atualizar',
          releaseNotes: 'Notas da versão',
          systemVersion: 'Versão do sistema',
          kernel: 'Kernel',
          stagedVersion: 'Versão preparada',
          archive: 'Arquivo',
          requiredFree: 'Espaço livre necessário',
          fileCount: 'Arquivos',
          rawImages: 'Imagens raw',
          progress: 'Progresso',
          progressMessage: 'Mensagem de progresso',
          pendingVersion: 'Versão pendente',
          bootHealth: 'Saúde do boot',
          healthy: 'Saudável',
          unhealthy: 'Requer atenção',
          rollbackBackup: 'Backup de rollback'
        },
        offline: {
          title: 'Enviar pacote do aplicativo',
          desc: 'Instalar um pacote do aplicativo a partir deste computador. Depois, o servidor reinicia.',
          installTitle: 'Instalar atualização do aplicativo?',
          installDesc:
            'O aplicativo é substituído e o servidor reinicia. Você precisará entrar novamente.'
        },
        local: {
          title: 'Enviar pacote do sistema',
          desc: 'Instalar um pacote do sistema a partir deste computador. Um único arquivo contém o pacote e seus metadados assinados.',
          choose: 'Escolher arquivo',
          invalidFile: 'Selecione um pacote terminado em .tar ou .tar.gz.',
          diskTitle: 'Desligar o disco virtual?',
          diskWarn:
            'O pacote é salvo em /data, que fica somente leitura enquanto o disco virtual está ligado. Ao desligá-lo, o computador não pode mais acessar /data. Continuar?',
          uploading: 'Enviando',
          verifying: 'Verificando e preparando o pacote',
          keyTitle: 'Chave de atualização local',
          keyDesc: 'Chave pública em formato PEM que pode assinar pacotes compilados por você',
          keyNone: 'Nenhuma chave definida',
          keySet: 'Definir chave',
          keyRemove: 'Remover',
          signer: 'Assinado por',
          section: 'Atualizações locais',
          keyRequired: 'Chave local necessária'
        }
      },
      account: {
        title: 'Conta',
        webAccount: 'Nome da conta web',
        password: 'Senha',
        passwordDesc: 'Altere a senha usada para entrar na interface web',
        updateBtn: 'Alterar',
        logoutBtn: 'Sair',
        logoutDesc: 'Tem certeza de que deseja sair?',
        okBtn: 'Sim',
        cancelBtn: 'Não',
        session: {
          title: 'Sessão'
        },
        logoutOnClose: {
          title: 'Sair ao fechar o navegador',
          description: 'Encerra a sessão quando o navegador é fechado em vez de mantê-la aberta'
        },
        totp: {
          title: 'Autenticação em duas etapas',
          authenticator: 'App autenticador',
          description: 'Exige um código temporário de um app autenticador além da senha',
          required: 'Exigida pela política',
          disable: 'Desativar',
          enableTitle: 'Configurar a autenticação em duas etapas',
          enableDescription:
            'Confirme sua senha para continuar. Ela é necessária para qualquer alteração da segunda etapa.',
          continue: 'Continuar',
          disableTitle: 'Desativar a autenticação em duas etapas?',
          disableDescription:
            'Sua conta ficará protegida apenas pela senha. Confirme com sua senha para continuar.',
          disableFailed: 'Não foi possível desativar a autenticação em duas etapas',
          passwordPlaceholder: 'Senha atual',
          enrollFailed: 'Não foi possível iniciar a configuração',
          invalidCode: 'Esse código não confere. Tente o próximo.',
          scan: 'Escaneie isto com o seu app autenticador.',
          manualEntry: 'Ou digite esta chave manualmente:',
          codePlaceholder: 'Digite o código de 6 dígitos para confirmar',
          confirm: 'Confirmar',
          cancel: 'Cancelar',
          backupTitle: 'Salve agora os seus códigos de backup',
          backupDescription:
            'Cada código funciona uma única vez e não será mostrado novamente. Eles são a única forma de voltar a entrar se você perder o app autenticador, e continuam funcionando quando o relógio do dispositivo não está sincronizado.',
          copy: 'Copiar',
          copied: 'Códigos de backup copiados',
          savedThem: 'Já salvei',
          remaining: 'Restam {{remaining}} códigos de backup',
          clockUnsynced:
            'O relógio do dispositivo ainda não está sincronizado. Sincronize a hora em Configurações > Sistema > Hora antes de configurar.',
          noBackupCodes:
            'Não restam códigos de backup. Selecione Gerar para criar um novo conjunto.',
          regenerate: 'Novos códigos de backup',
          generate: 'Gerar',
          regenerateTitle: 'Gerar novos códigos de backup?',
          regenerateDescription:
            'Seus códigos de backup atuais deixarão de funcionar. Confirme com sua senha para continuar.',
          regenerateFailed: 'Não foi possível gerar novos códigos de backup',
          download: 'Baixar',
          copyFailed: 'Não foi possível copiar. Selecione os códigos e copie-os manualmente.',
          requireTitle: 'Exigir autenticação em duas etapas',
          requireDescription:
            'Impede a desativação da autenticação em duas etapas, e uma conta sem ela precisa configurá-la antes de usar o dispositivo',
          requireFailed: 'Não foi possível alterar a exigência',
          requiredTitle: 'A autenticação em duas etapas é obrigatória',
          requiredDescription:
            'Este dispositivo está configurado para exigir uma segunda etapa, mas a sua conta ainda não configurou nenhuma. Configure agora para continuar.'
        }
      }
    },
    picoclaw: {
      title: 'Assistente PicoClaw',
      empty: 'Descreva uma tarefa para começar',
      inputPlaceholder: 'Descreva o que você deseja que PicoClaw faça',
      newConversation: 'Nova conversa',
      processing: 'Processando...',
      agent: {
        defaultTitle: 'Assistente geral',
        defaultDescription: 'Ajuda geral sobre bate-papo, pesquisa e espaço de trabalho',
        kvmTitle: 'Controle remoto',
        kvmDescription: 'Opera o host remoto por meio de NanoKVM',
        switched: 'Função de agente trocada',
        switchFailed: 'Falha ao mudar de função de agente'
      },
      send: 'Enviar',
      cancel: 'Cancelar',
      status: {
        connecting: 'Conectando ao gateway...',
        connected: 'Sessão PicoClaw conectada',
        disconnected: 'Sessão PicoClaw desconectada',
        stopped: 'Solicitação de parada enviada',
        runtimeStarted: 'Runtime do PicoClaw iniciado',
        runtimeStartFailed: 'Falha ao iniciar o runtime do PicoClaw',
        runtimeStopped: 'Runtime do PicoClaw interrompido',
        runtimeStopFailed: 'Falha ao parar o runtime do PicoClaw'
      },
      connection: {
        runtime: {
          checking: 'Verificando',
          ready: 'Runtime pronto',
          stopped: 'Runtime interrompido',
          unavailable: 'Runtime indisponível',
          configError: 'Erro de configuração'
        },
        transport: {
          connecting: 'Conectando',
          connected: 'Conectado'
        },
        run: {
          idle: 'Inativo',
          busy: 'Ocupado'
        }
      },
      error: {
        lockHeld: 'PicoClaw está em uso em outra janela',
        takenOver: 'Outra janela assumiu o controle do PicoClaw',
        authFailed: 'PicoClaw recusou a conexão',
        upstreamClosed: 'A conexão com PicoClaw foi perdida'
      },
      tool: {
        screenshot: 'Fazendo uma captura de tela',
        loadImage: 'Olhando a captura de tela',
        actions: 'Controlando o host',
        generic: 'Usando {{name}}',
        type: 'Digitando {{text}}',
        hotkey: 'Pressionando {{keys}}',
        click: 'Clicando',
        doubleClick: 'Clicando duas vezes',
        move: 'Movendo o mouse',
        drag: 'Arrastando',
        scroll: 'Rolando',
        wait: 'Aguardando'
      },
      message: {
        toolAction: 'Ação',
        observation: 'Observação',
        screenshot: 'Captura de tela'
      },
      overlay: {
        locked: 'PicoClaw está controlando o dispositivo. A entrada manual está pausada.'
      },
      install: {
        install: 'Instalar PicoClaw',
        installing: 'Instalando PicoClaw',
        success: 'PicoClaw instalado com sucesso',
        failed: 'Falha ao instalar PicoClaw',
        uninstalled: 'PicoClaw desinstalado com sucesso',
        uninstallFailed: 'Falha na desinstalação',
        requiredTitle: 'PicoClaw não está instalado',
        requiredDescription: 'Instale o PicoClaw antes de iniciar o runtime do PicoClaw.',
        progressDescription: 'PicoClaw está sendo baixado e instalado.',
        stages: {
          preparing: 'Preparando',
          downloading: 'Baixando',
          extracting: 'Extraindo',
          verifying: 'Verificando',
          installing: 'Instalando',
          installed: 'Instalado',
          install_timeout: 'Tempo limite esgotado',
          install_failed: 'Falhou'
        }
      },
      model: {
        requiredTitle: 'A configuração do modelo é necessária',
        requiredDescription: 'Configure o modelo PicoClaw antes de usar o chat PicoClaw.',
        docsTitle: 'Guia de configuração',
        docsDesc: 'Modelos e protocolos suportados',
        menuLabel: 'Configurar modelo',
        modelIdentifier: 'Identificador do modelo',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'URL base da API',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Chave API',
        apiKeyPlaceholder: 'Insira a chave API do modelo',
        apiKeyKeepPlaceholder: 'Deixe em branco para manter a chave atual',
        save: 'Salvar',
        saving: 'Salvando',
        saved: 'Configuração do modelo salva',
        saveFailed: 'Falha ao salvar a configuração do modelo',
        invalid: 'Identificador do modelo, URL base da API e chave API são obrigatórios'
      },
      uninstall: {
        confirmTitle: 'Desinstalar PicoClaw',
        confirmContent:
          'Tem certeza de que deseja desinstalar PicoClaw? Isso excluirá o executável e todos os arquivos de configuração.',
        confirmOk: 'Desinstalar'
      },
      history: {
        title: 'Histórico',
        loading: 'Carregando sessões...',
        emptyTitle: 'Ainda sem histórico',
        emptyDescription: 'As sessões anteriores de PicoClaw aparecerão aqui.',
        loadFailed: 'Falha ao carregar o histórico da sessão',
        deleteFailed: 'Falha ao excluir sessão',
        deleteConfirmTitle: 'Excluir sessão',
        deleteConfirmContent: 'Tem certeza de que deseja excluir "{{title}}"?',
        deleteConfirmOk: 'Excluir',
        messageCount_one: '{{count}} mensagem',
        messageCount_many: '{{count}} de mensagens',
        messageCount_other: '{{count}} mensagens'
      },
      config: {
        startRuntime: 'Iniciar PicoClaw',
        stopRuntime: 'Parar PicoClaw',
        stopConfirm: 'Parar PicoClaw?'
      },
      start: {
        title: 'Iniciar PicoClaw',
        description: 'Inicie o runtime para começar a usar o assistente PicoClaw.'
      }
    },
    error: {
      title: 'Encontramos um problema',
      refresh: 'Atualizar'
    },
    fullscreen: {
      toggle: 'Alternar tela cheia'
    },
    menu: {
      collapse: 'Recolher menu'
    }
  }
};

export default pt_br;
