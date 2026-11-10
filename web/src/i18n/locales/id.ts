const id = {
  translation: {
    common: {
      confirm: 'Konfirmasi',
      cancel: 'Batalkan',
      close: 'Tutup',
      save: 'Simpan',
      discard: 'Buang',
      delete: 'Hapus',
      actionFailed: 'Operasi gagal',
      loading: 'Memuat pengaturan dari perangkat...',
      loadFailed: 'Gagal memuat pengaturan dari perangkat',
      retry: 'Coba lagi'
    },
    head: {
      desktop: 'Desktop jarak jauh',
      login: 'Masuk',
      firstSetup: 'Penyiapan pertama',
      changePassword: 'Ubah sandi',
      terminal: 'Terminal',
      wifi: 'Wi-Fi'
    },
    auth: {
      login: 'Masuk',
      placeholderUsername: 'Silakan masukkan nama pengguna',
      placeholderPassword: 'Silakan masukkan kata sandi',
      placeholderPassword2: 'Silakan masukkan kata sandi lagi',
      noEmptyUsername: 'Nama pengguna tidak boleh kosong',
      noEmptyPassword: 'Kata sandi tidak boleh kosong',
      invalidUser: 'Nama pengguna atau kata sandi tidak valid',
      locked: 'Terlalu banyak login, silakan coba lagi nanti',
      globalLocked: 'Sistem dalam perlindungan, silakan coba lagi nanti',
      error: 'Terjadi kesalahan tak terduga',
      changePassword: 'Ganti sandi',
      changePasswordDesc: 'Untuk keamanan perangkat Anda, silakan ubah kata sandi masuk web',
      differentPassword: 'Kata sandi tidak sesuai',
      illegalUsername: 'Nama pengguna mengandung karakter ilegal',
      illegalPassword:
        'Kata sandi harus minimal 8 karakter dan tidak boleh berisi tanda kutip atau garis miring',
      forgetPassword: 'Lupa sandi',
      ok: 'Ok',
      cancel: 'Batalkan',
      loginButtonText: 'Masuk',
      setupTitle: 'Buat akun administrator',
      setupDescription:
        'Belum ada akun web pada perangkat ini. Buat akun administrator pertama untuk melanjutkan.',
      setupRecovery: 'Jika kata sandi ini hilang, pemulihan memerlukan penulisan ulang kartu SD',
      setupButtonText: 'Buat akun',
      tips: {
        hardenedRecovery:
          'Image Hardened ini tidak mendukung reset kata sandi dari tombol BOOT. Jika kata sandi hilang, tulis ulang kartu SD dan buat akun baru.',
        change1: 'Perhatikan bahwa tindakan ini akan mengubah kata sandi berikut:',
        change2: 'Kata sandi login web',
        change3: 'Kata sandi root sistem untuk login SSH'
      },
      placeholderCurrentPassword: 'Kata sandi saat ini',
      placeholderNewPassword: 'Kata sandi baru',
      wrongCurrentPassword: 'Kata sandi saat ini salah',
      totp: {
        title: 'Autentikasi dua faktor',
        prompt: 'Masukkan kode 6 digit dari aplikasi autentikator Anda',
        backupPrompt: 'Masukkan salah satu kode cadangan Anda',
        noEmptyCode: 'Masukkan kode',
        placeholderCode: 'Kode 6 digit',
        placeholderBackup: 'Kode cadangan',
        verifyButtonText: 'Verifikasi',
        useBackupCode: 'Gunakan kode cadangan',
        useAuthenticator: 'Gunakan kode autentikator',
        cancel: 'Kembali',
        invalidCode: 'Kode itu tidak valid. Coba lagi.'
      }
    },
    wifi: {
      title: 'Wi-Fi',
      description: 'Konfigurasi Wi-Fi untuk NanoKVM',
      success: 'Silakan periksa status jaringan NanoKVM langsung pada perangkat',
      failed: 'Operasi gagal, silakan coba lagi',
      invalidMode:
        'Mode saat ini tidak mendukung pengaturan jaringan. Silakan buka perangkat Anda dan aktifkan mode konfigurasi Wi-Fi.',
      confirmBtn: 'Ok',
      finishBtn: 'Selesai',
      ap: {
        authTitle: 'Otentikasi diperlukan',
        authDescription: 'Silakan masukkan kata sandi AP untuk melanjutkan',
        authFailed: 'Kata sandi AP tidak valid',
        passPlaceholder: 'Kata sandi AP',
        verifyBtn: 'Verifikasi'
      }
    },
    screen: {
      scale: 'Skala',
      title: 'Layar',
      video: 'Mode video',
      videoDirectTips:
        'Aktifkan HTTPS di "Pengaturan > Jaringan > Layanan" untuk menggunakan mode ini',
      videoWebrtcBlockedByFirewall:
        'H.264 WebRTC dinonaktifkan dalam mode firewall Terbatas dan Paranoid',
      transferRunningTitle: 'Transfer image sedang berlangsung',
      transferRunningDesc:
        'Mengubah mode video akan memuat ulang halaman sehingga unggahan atau unduhan image yang sedang berjalan dibatalkan.',
      transferRunningOk: 'Ubah mode',
      resolution: 'Resolusi',
      auto: 'Otomatis',
      autoTips:
        'Tearing layar atau offset tetikus dapat terjadi pada resolusi tertentu, jadi sesuaikan resolusi host jarak jauh atau nonaktifkan mode otomatis',
      fps: 'FPS',
      customizeFps: 'Sesuaikan',
      quality: 'Kualitas',
      qualityLossless: 'Tanpa kehilangan',
      qualityHigh: 'Tinggi',
      qualityMedium: 'Sedang',
      qualityLow: 'Rendah',
      frameDetect: 'Deteksi bingkai',
      frameDetectTip:
        'Membandingkan frame dan menghentikan pengiriman video selama layar host jarak jauh tidak berubah',
      resetHdmi: 'Atur ulang HDMI',
      webrtcConnectionFailed: {
        title: 'Koneksi WebRTC gagal',
        description: 'Periksa koneksi jaringan atau ganti mode video'
      },
      captureStatus: {
        hdmiError: 'Kesalahan layar HDMI',
        unsupportedResolution: 'Resolusi saat ini tidak didukung',
        retrieving: 'Mengambil layar...',
        changingResolution: 'Mengganti resolusi...',
        updateFailed: 'Layar tidak dapat diperbarui saat ini',
        videoError: 'Kesalahan tampilan video',
        noHdmi: 'Sinyal HDMI tidak terdeteksi',
        unavailable: 'Layar tidak dapat ditampilkan saat ini'
      }
    },
    keyboard: {
      title: 'Keyboard',
      paste: 'Tempel',
      tips: 'Hanya huruf dan simbol keyboard standar yang didukung',
      placeholder: 'Teks yang akan ditempel',
      local: 'Keyboard seluler',
      virtual: 'Keyboard layar',
      readClipboard: 'Membaca dari papan klip',
      clipboardPermissionDenied:
        'Izin papan klip ditolak, izinkan akses papan klip di browser Anda',
      clipboardReadError: 'Gagal membaca papan klip',
      dropdownEnglish: 'Bahasa Inggris',
      dropdownGerman: 'Bahasa Jerman',
      dropdownFrench: 'Bahasa Prancis',
      dropdownRussian: 'Bahasa Rusia',
      dropdownKorean: 'Bahasa Korea',
      dropdownJapanese: 'Bahasa Jepang',
      localInput: 'Input papan ketik seluler',
      shortcut: {
        title: 'Pintasan',
        custom: 'Kustom',
        capture: 'Klik di sini untuk mengambil pintasan',
        clear: 'Hapus',
        save: 'Simpan',
        captureTips:
          'Menangkap tombol tingkat sistem, seperti tombol Windows, memerlukan izin layar penuh',
        enterFullScreen: 'Beralih ke mode layar penuh'
      },
      leaderKey: {
        title: 'Tombol Leader',
        desc: 'Lewati batasan browser dan kirim pintasan sistem langsung ke host jarak jauh',
        howToUse: 'Cara menggunakan',
        simultaneous: {
          title: 'Mode simultan',
          desc1: 'Tekan dan tahan tombol Leader, lalu tekan pintasan.',
          desc2: 'Intuitif, tetapi mungkin bertentangan dengan pintasan sistem.'
        },
        sequential: {
          title: 'Mode berurutan',
          desc1:
            'Tekan tombol Leader → tekan pintasan secara berurutan → tekan tombol Leader lagi.',
          desc2: 'Memerlukan lebih banyak langkah, namun sepenuhnya menghindari konflik sistem.'
        },
        enable: 'Aktifkan tombol Leader',
        tip: 'Saat ditetapkan sebagai tombol Leader, tombol ini hanya berfungsi sebagai pemicu pintasan dan kehilangan perilaku defaultnya.',
        placeholder: 'Tekan tombol Leader',
        shiftRight: 'Shift kanan',
        ctrlRight: 'Ctrl kanan',
        metaRight: 'Win kanan',
        recorder: {
          rec: 'REKAM',
          activate: 'Aktifkan tombol',
          input: 'Tekan pintasan'
        }
      }
    },
    mouse: {
      title: 'Mouse',
      cursor: 'Gaya kursor',
      default: 'Kursor bawaan',
      cell: 'Kursor cell',
      text: 'Kursor teks',
      grab: 'Kursor ambil',
      hide: 'Sembunyikan kursor',
      mode: 'Mode tetikus',
      absolute: 'Mode absolut',
      relative: 'Mode relatif',
      direction: 'Arah roda gulir',
      scrollUp: 'Gulir ke atas',
      scrollDown: 'Gulir ke bawah',
      speed: 'Kecepatan roda gulir',
      sensitivity: 'Kecepatan pointer',
      sensitivityDesc:
        'Untuk mode relatif desktop: nilai lebih rendah mengurangi drift dari akselerasi mouse host',
      fast: 'Cepat',
      slow: 'Lambat',
      mobile: {
        touchSync: 'TouchSync',
        touchSyncDesc:
          'Gerakkan di mana saja pada area KVM; kursor jarak jauh mempertahankan posisinya antar sentuhan dan tetap sinkron dengan HID absolut'
      },
      requestPointer: 'Menggunakan mode relatif, klik desktop untuk mendapatkan penunjuk tetikus',
      resetHid: 'Setel ulang HID',
      hidOnly: {
        title: 'Mode HID-Only',
        desc: 'Jika mouse atau keyboard berhenti merespons dan mereset HID tidak membantu, mungkin ada masalah kompatibilitas antara NanoKVM dan host.',
        tip1: 'Mengaktifkan mode HID-Only akan melepas disk virtual dan jaringan virtual',
        tip2: 'Dalam mode HID-Only, pemasangan image dinonaktifkan',
        tip3: 'NanoKVM akan otomatis reboot setelah berpindah mode',
        enable: 'Aktifkan mode HID-Only',
        disable: 'Nonaktifkan mode HID-Only'
      }
    },
    image: {
      title: 'Gambar',
      loading: 'Memuat...',
      empty: 'Tidak ada yang ditemukan',
      mountMode: 'Pasang sebagai',
      mount: 'Pasang',
      orDownload: 'Atau unduh dari tautan',
      keepRunning:
        'Anda dapat menutup jendela ini. Transfer tetap berjalan dan progresnya tampil di daftar gambar.',
      massStorage: 'Penyimpanan massal',
      cdRom: 'CD-ROM',
      mountFailed: 'Pemasangan gagal',
      mountDesc:
        'Di beberapa sistem, perlu mengeluarkan disk virtual pada host jarak jauh sebelum memasang gambar',
      diskOnWarn:
        'Memasang image akan mematikan disk virtual, sehingga komputer tidak lagi dapat mengakses /data. Lanjutkan?',
      diskOffWarn:
        'Disk virtual sedang mati dan harus diaktifkan untuk memasang image. Perangkat USB pada komputer akan dienumerasi ulang. Lanjutkan?',
      unmountFailed: 'Pelepasan gagal',
      unmountDesc:
        'Pada beberapa sistem, Anda perlu mengeluarkan secara manual dari host jarak jauh sebelum melepas gambar',
      forceEject: 'Paksa keluarkan',
      forceEjectConfirm:
        'Host telah mengunci drive optik. Memaksa pengeluaran akan memutuskan perangkat USB virtual sesaat, sehingga keyboard dan mouse dapat terputus sebentar. Lanjutkan?',
      usbReconnect: 'Sambung ulang USB',
      usbReconnectConfirm:
        'Sambungkan ulang gadget USB hanya jika host jarak jauh tidak mendeteksi perubahan media. Keyboard dan mouse mungkin terputus sebentar.',
      usbReconnectSuccess: 'USB tersambung ulang',
      usbReconnectFailed: 'Sambung ulang USB gagal',
      addImage: 'Tambah gambar',
      fromUrl: 'Dari URL',
      fromFile: 'Dari berkas',
      turnOff: 'Matikan',
      deleteDiskShared: 'Image tidak dapat dihapus selama disk virtual menyala.',
      eject: 'Keluarkan',
      download: 'Unduh',
      upload: 'Mengunggah',
      mountTitle: 'Pasang gambar',
      deleteTitle: 'Hapus gambar',
      deleteConfirm: 'Apakah Anda yakin ingin menghapus gambar ini?',
      tips: {
        title: 'Cara mengunggah',
        usb1: 'Hubungkan NanoKVM ke komputer Anda melalui USB.',
        usb2: 'Pastikan disk virtual telah terpasang di Pengaturan > Perangkat > Disk virtual.',
        usb3: 'Buka disk virtual di komputer Anda dan salin file gambar ke direktori root disk virtual.',
        scp1: 'Pastikan NanoKVM dan komputer Anda berada di jaringan lokal yang sama.',
        scp2: 'Buka terminal di komputer Anda dan gunakan perintah SCP untuk mengunggah file gambar ke direktori /data di NanoKVM.',
        scp3: 'Contoh: scp jalur-gambar-anda root@ip-nanokvm-anda:/data',
        tfCard: 'Kartu SD',
        tf1: 'Metode ini didukung di sistem linux',
        tf2: 'Ambil kartu SD dari NanoKVM. Pada versi FULL, bongkar casingnya terlebih dahulu.',
        tf3: 'Masukkan Kartu SD ke pembaca kartu dan hubungkan ke komputer Anda.',
        tf4: 'Salin berkas gambar ke direktori /data pada Kartu SD.',
        tf5: 'Masukkan Kartu SD ke dalam NanoKVM.'
      }
    },
    script: {
      title: 'Script',
      upload: 'Mengunggah',
      run: 'Jalankan',
      runBackground: 'Jalankan di belakang',
      runFailed: 'Gagal menjalankan',
      delDesc: 'Apakah Anda yakin ingin menghapus data ini?',
      delete: 'Hapus',
      close: 'Tutup',
      unlockDesc:
        'Skrip berjalan sebagai root di NanoKVM. Masukkan kata sandi akun web untuk mengunggah atau menjalankan skrip.',
      terminalRequired:
        'Skrip memerlukan akses terminal web. Aktifkan terminal di pengaturan terlebih dahulu.'
    },
    terminal: {
      title: 'Terminal',
      nanokvm: 'Terminal NanoKVM',
      serial: 'Terminal port serial',
      unlockTitle: 'Buka kunci terminal',
      unlockDesc: 'Masukkan kata sandi akun web untuk memulai sesi terminal',
      unlock: 'Buka kunci',
      unlockFailed: 'Gagal membuka kunci terminal',
      invalidCredentials: 'Nama pengguna atau kata sandi tidak valid',
      locked: 'Terlalu banyak percobaan, coba lagi nanti',
      sessionClosed: 'Sesi terminal ditutup. Buka kunci lagi untuk menyambung ulang.',
      sessionError: 'Koneksi terminal gagal. Buka kunci lagi untuk mencoba ulang.',
      serialPort: 'Port serial',
      serialPortPlaceholder: 'Contoh /dev/ttyS1',
      baudrate: 'Baud rate',
      parity: 'Paritas',
      parityNone: 'Tidak ada',
      parityEven: 'Genap',
      parityOdd: 'Ganjil',
      flowControl: 'Kontrol aliran',
      flowControlNone: 'Tidak ada',
      flowControlSoft: 'Perangkat lunak',
      flowControlHard: 'Perangkat keras',
      dataBits: 'Bit data',
      stopBits: 'Hentikan bit',
      open: 'Buka terminal'
    },
    wol: {
      title: 'Wake-on-LAN',
      sending: 'Mengirim perintah...',
      sent: 'Perintah terkirim',
      input: 'Alamat MAC',
      ok: 'OK'
    },
    download: {
      input: 'URL image jarak jauh',
      ok: 'OK',
      disabled:
        'Image tidak dapat diunduh atau diunggah saat ini karena penyimpanan tidak dapat ditulisi. Jika ada image yang terpasang, lepaskan, lalu matikan disk virtual agar penyimpanan dapat ditulisi lagi.',
      diskShared: 'Matikan disk virtual untuk menggunakan unduhan image',
      mountedImage:
        'Image ini sedang di-mount, lepaskan mount-nya sebelum mengunggah berkas dengan nama yang sama',
      diskOff: 'Matikan disk virtual',
      uploadbox: 'Letakkan file di sini atau klik untuk memilih',
      inputfile: 'File gambar',
      NoISO: 'Tidak ada image',
      complete: 'Unduhan selesai',
      uploadComplete: 'Unggahan selesai',
      downloading: 'Mengunduh',
      uploading: 'Mengunggah',
      failed: 'Transfer gagal',
      uploadFailed: 'Unggahan gagal',
      stalled: 'Transfer terhenti, periksa koneksi dan coba lagi',
      canceled: 'Unggahan dibatalkan',
      downloadCanceled: 'Unduhan dibatalkan',
      cancel: 'Batal',
      remoteDisabled: 'Unduhan ISO jarak jauh dinonaktifkan di Pengaturan > Pengguna > Preferensi',
      remoteFailed: 'Unduhan ISO jarak jauh gagal',
      sha256: 'Checksum SHA-256 opsional',
      sha256Placeholder: 'Masukkan checksum SHA-256 64 karakter',
      invalidSHA256: 'SHA-256 harus berupa string heksadesimal 64 karakter',
      checksumFailed: 'Unduhan gagal: verifikasi SHA-256 gagal'
    },
    power: {
      title: 'Daya',
      showConfirm: 'Konfirmasi',
      showConfirmTip: 'Pengoperasian listrik memerlukan konfirmasi tambahan',
      reset: 'Atur ulang',
      powerShort: 'Tombol daya: tekan sebentar',
      powerLong: 'Tombol daya: tekan lama',
      resetConfirm: 'Jalankan operasi penyetelan ulang?',
      powerConfirm: 'Jalankan operasi daya?',
      okBtn: 'Ya',
      cancelBtn: 'Tidak'
    },
    settings: {
      title: 'Pengaturan',
      about: {
        title: 'Tentang',
        information: 'Informasi',
        ip: 'Alamat IP',
        mdns: 'Alamat lokal',
        application: 'Versi aplikasi',
        uptime: 'Waktu aktif',
        community: 'Komunitas',
        credit:
          'Dibangun di atas <a1>NanoKVM</a1> dari Sipeed dan <a2>Hardened NanoKVM</a2> oleh woffko',
        hostname: 'Nama perangkat',
        changeIn: 'Ubah di {{path}}',
        updateIn: 'Perbarui di {{path}}',
        toggleIn: 'Aktifkan atau nonaktifkan di {{path}}'
      },
      appearance: {
        title: 'Preferensi',
        display: 'Layar',
        language: 'Bahasa',
        languageDesc: 'Pilih bahasa untuk antarmuka',
        webTitle: 'Judul web',
        webTitleDesc: 'Menyesuaikan judul halaman web',
        layoutMode: 'Tata letak antarmuka',
        layoutModeDesc: 'Gunakan tata letak ponsel/sentuh di browser ini',
        layoutAuto: 'Otomatis',
        layoutMobile: 'Ponsel',
        menuBar: {
          title: 'Bilah menu',
          mode: 'Mode tampilan',
          modeDesc: 'Menampilkan bilah menu di layar',
          modeOff: 'Mati',
          modeAuto: 'Sembunyikan otomatis',
          modeAlways: 'Selalu terlihat',
          keyboardLedStatus: 'Indikator kunci keyboard',
          keyboardLedStatusDesc:
            'Tampilkan status Num Lock, Caps Lock, dan Scroll Lock komputer jarak jauh',
          icons: 'Ikon submenu',
          iconsDesc: 'Menampilkan ikon submenu di bilah menu',
          terminalWarningTitle: 'Aktifkan terminal web?',
          terminalWarningDesc:
            'Terminal membuka shell root melalui browser. Aktifkan hanya di jaringan tepercaya dan matikan setelah selesai.',
          terminalWarningConfirm: 'Aktifkan',
          remoteDownload: 'Unduh ISO jarak jauh',
          remoteDownloadWarningTitle: 'Aktifkan unduhan ISO jarak jauh?',
          remoteDownloadWarningDesc:
            'NanoKVM akan mengambil ISO dari URL dan menulisnya ke /data. Aktifkan hanya untuk URL tepercaya dan matikan setelah selesai.',
          remoteDownloadWarningConfirm: 'Aktifkan'
        }
      },
      keyboardLedStatus: {
        groupLabel: 'Status kunci keyboard jarak jauh',
        indicatorLabel: '{{label}}: {{state}}',
        numLock: 'Num Lock',
        numLockShort: 'Num',
        capsLock: 'Caps Lock',
        capsLockShort: 'Caps',
        scrollLock: 'Scroll Lock',
        scrollLockShort: 'Scr',
        on: 'Aktif',
        off: 'Nonaktif',
        unknown: 'Tidak diketahui'
      },
      device: {
        title: 'Perangkat',
        minutes: 'mnt',
        sections: {
          general: 'Umum',
          connectivity: 'Konektivitas',
          hostConnection: 'Koneksi host',
          inputOutput: 'Input dan output'
        },
        oled: {
          title: 'Batas waktu OLED',
          description: 'Matikan layar OLED setelah',
          keepOn: 'Biarkan OLED menyala',
          keepOnDescription: 'Jangan pernah mematikan layar OLED'
        },
        ssh: {
          description: 'Aktifkan akses jarak jauh SSH',
          tip: 'Tetapkan kata sandi yang kuat di Akun > Kata sandi sebelum mengaktifkan opsi ini'
        },
        swap: {
          title: 'Swap',
          description: 'Gunakan file swap saat memori hampir habis',
          size: 'Ukuran swap',
          sizeDescription: 'Atur ukuran file swap',
          tip: 'Mengaktifkan fitur ini dapat mempersingkat masa pakai kartu SD Anda'
        },
        mouseJiggler: {
          title: 'Tikus jiggler',
          description: 'Mencegah host jarak jauh tertidur',
          disable: 'Nonaktifkan',
          absolute: 'Mode absolut',
          relative: 'Mode relatif'
        },
        sessionLock: {
          title: 'Kunci sesi saat tidak aktif',
          description: 'Minta login lagi setelah waktu ini'
        },
        mdns: {
          description: 'Aktifkan layanan penemuan mDNS',
          tip: 'Memungkinkan perangkat ini dijangkau lewat nama .local. Tidak diperlukan jika Anda terhubung lewat alamat IP atau DNS Anda sudah meresolusi nama host.'
        },
        hdmi: {
          description: 'Aktifkan keluaran HDMI/monitor',
          idleTimeoutTitle: 'Batas waktu tangkapan tidak aktif',
          idleTimeoutDescription: 'Hentikan tangkapan HDMI setelah tidak ada penonton aktif selama'
        },
        hidOnly: 'Mode HID-Only',
        hidOnlyDesc:
          'Meningkatkan kompatibilitas dengan host jika mouse atau keyboard berhenti merespons',
        hidOnlyTip:
          'Mode HID-Only berhenti meniru perangkat virtual dan hanya mempertahankan kontrol dasar HID',
        disk: 'Disk virtual',
        diskDesc: 'Pasang kartu SD pada host jarak jauh',
        diskLocked: 'Mati saat image terpasang, dan mengaktifkannya membatalkan pemasangan',
        diskEnable: 'Aktifkan disk virtual',
        networkChange: 'Ubah jaringan virtual',
        diskCancelMount:
          'Mengaktifkan disk virtual akan membatalkan image yang terpasang. Lanjutkan?',
        networkCancelMount:
          'Mengubah jaringan virtual akan memulai ulang koneksi USB. Ini membatalkan image yang terpasang dan mengaktifkan disk virtual. Lanjutkan?',
        diskTransferRunning:
          'Transfer image sedang berjalan. Tunggu sampai selesai sebelum mengaktifkan disk virtual.',
        network: 'Jaringan virtual',
        networkDesc: 'Pasang kartu jaringan virtual pada host jarak jauh',
        usbWakeup: 'Bangunkan lewat USB',
        usbWakeupDesc: 'Izinkan kejadian keyboard atau mouse membangunkan host jarak jauh',
        usbWakeupTip: 'Matikan jika host mencatat pesan USB wakeup berulang',
        hostname: {
          description: 'Nama perangkat ini di jaringan',
          reachable: 'Dapat dijangkau di jaringan lokal sebagai {{address}}'
        },
        rebootRequired: 'Perlu mulai ulang',
        rebootPending: 'Perlu mulai ulang untuk: {{reasons}}',
        rebootReasons: {
          systemUpdate: 'Pembaruan sistem'
        },
        reboot: 'Mulai ulang',
        rebootDesc: 'Apakah Anda yakin ingin me-reboot NanoKVM?',
        poweroff: 'Matikan',
        poweroffDesc:
          'Yakin ingin mematikan NanoKVM? Perangkat tidak dapat dijangkau sampai dinyalakan kembali.'
      },
      network: {
        title: 'IP & DNS',
        connection: 'Koneksi',
        configuration: 'Konfigurasi',
        wifi: {
          title: 'Wi-Fi',
          description: 'Konfigurasi Wi-Fi',
          apMode: 'Mode AP aktif, sambungkan ke Wi-Fi dengan memindai kode QR',
          connect: 'Hubungkan Wi-Fi',
          connectDesc1: 'Masukkan SSID jaringan dan kata sandi',
          disconnect: 'Yakin ingin memutuskan jaringan?',
          disconnectBtn: 'Putuskan',
          connected: 'Terhubung',
          ssid: 'Nama',
          password: 'Kata sandi',
          joinBtn: 'Gabung',
          cancelBtn: 'Batal'
        },
        tls: {
          description: 'Aktifkan protokol HTTPS',
          tip: 'Perhatian: Menggunakan HTTPS dapat meningkatkan latensi, terutama pada mode video MJPEG',
          restartTitle: 'Server akan dimulai ulang',
          restartDesc:
            'Perubahan protokol memulai ulang server. Browser akan beralih ke alamat baru setelah {{seconds}} detik:',
          restartOk: 'Terapkan dan mulai ulang',
          confirmTitle: 'Pertahankan protokol baru?',
          confirmDesc:
            'Server kini berjalan dengan {{protocol}}. Server akan kembali ke protokol sebelumnya dalam {{seconds}} detik jika tidak dipertahankan.',
          confirmKeep: 'Pertahankan',
          confirmRevert: 'Kembali',
          reverting:
            'Kembali ke protokol sebelumnya. Browser akan beralih ke alamat itu setelah {{seconds}} detik.',
          certTitle: 'Pertahankan sertifikat baru?',
          certDesc:
            'Server kini memakai sertifikat baru. Server kembali ke sertifikat sebelumnya dalam {{seconds}} detik kecuali Anda mempertahankannya.',
          certReverted: 'Sertifikat sebelumnya kembali'
        },
        trustedProxies: {
          section: 'Proxy terbalik',
          title: 'Proxy tepercaya',
          description:
            'Proxy terbalik yang dipercaya perangkat untuk melaporkan alamat dan protokol klien',
          tip: 'Alamat dalam daftar menentukan alamat klien yang dicatat oleh batas login dan log, jadi cantumkan hanya proxy yang Anda kendalikan',
          none: 'Tidak ada',
          edit: 'Ubah',
          editRow: 'Ubah daftar',
          editTitle: 'Ubah proxy tepercaya',
          editDescription: 'Mengubah daftar memerlukan kata sandi Anda',
          dialogDescription:
            'Masukkan alamat setiap proxy terbalik seperti yang dilihat perangkat ini, atau rentang seperti 10.0.0.0/24. Proxy dalam daftar memberi tahu perangkat alamat dan protokol klien mana yang dipakai. Semua yang diteruskannya dipercaya, jadi cantumkan hanya proxy yang Anda kendalikan.'
        },
        certificate: {
          title: 'Sertifikat',
          desc: 'Asal sertifikat HTTPS',
          requesting: 'Meminta sertifikat',
          selfSigned: 'Ditandatangani sendiri',
          domain: 'Domain',
          domainDesc:
            'Harus mengarah ke perangkat ini, dengan port 443 dapat dijangkau dari internet',
          domainTailscale: 'Ditetapkan oleh Tailscale untuk perangkat ini',
          domainInvalid: 'Gunakan nama domain lengkap, misalnya kvm.example.org',
          email: 'Email',
          emailDesc: "Opsional, untuk pemberitahuan dari Let's Encrypt",
          emailInvalid: 'Gunakan alamat seperti nama@example.org',
          validUntil: 'Berlaku hingga',
          valid: 'Berlaku',
          expiresSoon: 'Segera kedaluwarsa',
          expired: 'Kedaluwarsa',
          lastRenewal: 'Pembaruan terakhir',
          renewed: 'Diperbarui',
          failed: 'Gagal',
          renewNow: 'Perbarui sekarang',
          renewNowDesc: 'Minta sertifikat baru tanpa menunggu',
          renewBtn: 'Perbarui',
          applyTitle: 'Ubah sertifikat',
          applyOk: 'Terapkan',
          applyAcme:
            "Perangkat meminta sertifikat dari Let's Encrypt. Let's Encrypt terhubung ke port 443 dari internet untuk memeriksanya, yang dapat memakan waktu hingga satu menit. Jika permintaan gagal, sertifikat saat ini tetap dipakai.",
          applyTailscale:
            'Perangkat mengambil sertifikat dari Tailscale, yang dapat memakan waktu hingga satu menit. Jika permintaan gagal, sertifikat saat ini tetap dipakai.',
          applySelfSigned:
            'Perangkat kembali ke sertifikat tanda tangan sendiri miliknya. Peramban menampilkan peringatan.',
          openTitle: 'Buka alamat baru',
          openDesc:
            'Sertifikat sudah siap. Buka alamat di bawah dan masuk untuk mempertahankannya. Tanpa konfirmasi Anda dalam 3 menit, sertifikat sebelumnya kembali.',
          openOk: 'Buka',
          blockedClock: 'Sertifikat tidak dapat diminta sampai jam perangkat disinkronkan',
          blockedParanoid: 'Mode Firewall Paranoid memblokir permintaan sertifikat',
          tailscaleUnavailable:
            'Tailscale tidak berjalan, atau sertifikat HTTPS tidak diaktifkan untuk tailnet'
        },
        dns: {
          title: 'DNS',
          description: 'Konfigurasi server DNS untuk NanoKVM',
          ipv4Title: 'IPv4',
          ipv4Description: 'Konfigurasikan pengalamatan IPv4 untuk antarmuka kabel',
          servers: 'Server',
          dhcp: 'DHCP',
          manual: 'Manual',
          apply: 'Terapkan',
          invalid: 'Masukkan alamat IPv4 atau IPv6 yang valid',
          invalidNetwork: 'Masukkan alamat IPv4, subnet mask, dan router yang valid',
          saved: 'Pengaturan DNS disimpan',
          redirecting: 'Pengaturan jaringan disimpan. Membuka alamat baru...',
          saveFailed: 'Gagal menyimpan pengaturan DNS',
          unsaved: 'Perubahan belum disimpan',
          maxServers: 'Maksimal {{count}} server DNS diizinkan',
          dhcpServersDescription: 'Server DNS diperoleh otomatis dari DHCP',
          manualServersDescription: 'Server IPv4 dan IPv6 didukung',
          interface: 'Antarmuka',
          ipAddress: 'Alamat IP',
          subnetMask: 'Subnet mask',
          router: 'Router'
        },
        ipv6: {
          title: 'IPv6',
          description: 'Konfigurasikan pengalamatan IPv6 untuk antarmuka kabel',
          disabled: 'Dinonaktifkan',
          slaac: 'SLAAC',
          dhcpv6: 'DHCPv6',
          manual: 'Manual',
          interface: 'Antarmuka',
          state: 'Status',
          router: 'Router',
          addresses: 'Alamat',
          dhcpv6Client: 'Klien DHCPv6',
          notInstalled: 'Belum terpasang',
          ipAddress: 'Alamat IPv6',
          prefix: 'Prefiks',
          invalidManual: 'Masukkan alamat IPv6, prefiks, dan router yang valid',
          clientMissing:
            'Klien DHCPv6 belum terpasang. Pasang pembaruan sistem raw yang sesuai terlebih dahulu.',
          saved: 'Pengaturan IPv6 disimpan',
          saveFailed: 'Gagal menyimpan pengaturan IPv6',
          unsaved: 'Perubahan belum disimpan'
        }
      },
      system: {
        title: 'Sistem',
        performance: {
          processor: 'Prosesor',
          overdrive: {
            title: 'Clock overdrive',
            description:
              'Booting dengan kecepatan clock prosesor dan video yang lebih tinggi sesuai spesifikasi pabrikan',
            tip: 'Jika perangkat tidak menyala dengan overdrive, kartu SD harus ditulis ulang',
            unavailable: 'Tidak termasuk dalam image sistem ini',
            keepTitle: 'Pertahankan overdrive setelah pembaruan',
            keepDescription:
              'Pembaruan sistem mengembalikan perangkat ke clock standar kecuali opsi ini aktif',
            confirmTitle: 'Aktifkan clock overdrive?',
            confirmText:
              'Jika perangkat tidak menyala dengan overdrive, Anda harus menulis ulang kartu SD untuk memulihkannya. Perubahan berlaku setelah reboot berikutnya.',
            confirmOk: 'Aktifkan'
          },
          watchdog: {
            title: 'Watchdog perangkat keras',
            description: 'Mulai ulang perangkat secara otomatis saat tidak merespons',
            unavailable: 'Tidak disertakan dalam citra sistem ini',
            notRunning: 'Tidak berjalan saat ini',
            lastRestart: 'Mulai ulang terakhir',
            lastRestartCaption: 'Alasan terbaru sistem dimulai ulang',
            reasonPowerOn: 'Daya menyala',
            reasonRestart: 'Mulai ulang diminta',
            reasonWatchdog: 'Reset watchdog',
            reasonOverheat: 'Perlindungan panas berlebih',
            reasonUnknown: 'Tidak diketahui'
          },
          recovery: 'Pemulihan',
          memory: 'Memori'
        },
        monitor: {
          processorClock: 'Subsistem CPU',
          videoClock: 'Subsistem video',
          videoClockCaption: 'Frekuensi clock video',
          cpuClockCaption: 'Frekuensi clock CPU',
          overdrive: 'Overdrive',
          temperature: 'Suhu',
          lastMinutes: '5 menit terakhir',
          ram: 'RAM',
          off: 'Mati',
          ramHistory: 'Pemakaian RAM',
          cpuLoad: 'Beban CPU',
          cpuLoadCaption: 'Pengguna {{user}} persen, sistem {{system}} persen',
          cpuUtilization: 'Pemakaian CPU',
          swapUtilization: 'Pemakaian swap',
          swapSizeLastMinutes: '{{size}}, 5 menit terakhir',
          percent: '{{percent}} persen',
          percentUsed: '{{percent}} persen terpakai',
          sizeOf: '{{used}} dari {{total}}',
          systemPartition: 'Partisi sistem',
          dataPartition: 'Partisi data',
          unavailable: 'Tidak tersedia',
          noReadings: 'Perangkat tidak mengembalikan pembacaan',
          refresh: 'Diperbarui setiap detik selama halaman ini terbuka'
        },
        sections: {
          time: 'Waktu',
          firewall: 'Firewall',
          systemLog: 'Pencatatan log',
          performance: 'Kinerja',
          monitor: 'Monitor',
          services: 'Layanan',
          webInterface: 'Akses web aman'
        },
        time: {
          saveFailed: 'Gagal menyimpan pengaturan waktu',
          saved: 'Pengaturan waktu disimpan',
          syncFailed: 'Gagal menyinkronkan waktu',
          synced: 'Waktu disinkronkan',
          invalidServers: 'Masukkan setidaknya satu server NTP',
          maxServers: 'Maksimum {{count}} server NTP diizinkan',
          refresh: 'Segarkan',
          syncNow: 'Sinkronkan',
          syncNowDesc: 'Atur jam dari server NTP sekarang',
          save: 'Simpan',
          ntp: {
            title: 'NTP',
            description: 'Sinkronkan waktu perangkat dari server NTP yang dikonfigurasi'
          },
          networkTime: 'Waktu jaringan',
          clock: {
            title: 'Jam',
            description: 'Atur zona waktu lokal yang digunakan log dan UI',
            current: 'Waktu saat ini',
            timezone: 'Zona waktu'
          },
          servers: {
            title: 'Server NTP',
            description: 'Gunakan server publik bawaan, router lokal Anda, atau server NTP kustom',
            useRouter: 'Gunakan router',
            useDefaults: 'Gunakan default',
            presets: 'Preset server',
            presetsDesc: 'Ganti daftar server dengan preset'
          }
        },
        firewall: {
          saveFailed: 'Gagal menerapkan pengaturan firewall',
          saved: 'Pengaturan firewall diterapkan',
          cancel: 'Batal',
          refresh: 'Segarkan',
          backends: 'Backend',
          enableHttpsFirst:
            'Aktifkan HTTPS sebelum mengaktifkan mode firewall Terbatas atau Paranoid',
          httpsRequired:
            'Mode Terbatas dan Paranoid dinonaktifkan sampai HTTPS diaktifkan di Pengaturan > Jaringan > Layanan',
          mode: {
            title: 'Mode firewall',
            baseline: 'Dasar',
            baselineDesc:
              'Profil kompatibilitas terbuka. Firewall berjalan, tetapi sumber masuk tidak dibatasi. Gunakan hanya di jaringan tepercaya.',
            moderate: 'Sedang',
            moderateDesc:
              'Profil default. Mempertahankan layanan Dasar, tetapi hanya menerima koneksi masuk baru dari rentang privat, link-local, atau loopback. Akses keluar tetap terbuka.',
            restricted: 'Terbatas',
            restrictedDesc:
              'Hanya HTTPS dan SSH lokal, ditambah DNS, NTP, syslog, dan pembaruan online keluar. DHCP dan lalu lintas IPv6 penting tetap tersedia. WebRTC diblokir.',
            paranoid: 'Paranoid',
            paranoidDesc:
              'Akses HTTPS khusus lokal. Memblokir SSH, HTTP, pembaruan online, dan fitur jaringan keluar lainnya. Unggah pembaruan offline dan instalasi yang sudah disiapkan tetap tersedia.',
            current: 'Saat ini',
            default: 'Default',
            localOnly: 'Khusus lokal',
            openTag: 'Masuk terbuka',
            httpsRequiredTag: 'Perlu HTTPS',
            outboundOpen: 'Keluar terbuka',
            outboundLimited: 'Keluar terbatas',
            httpsOnly: 'Hanya HTTPS'
          },
          moderate: {
            apply: 'Beralih ke Sedang'
          },
          restricted: {
            enable: 'Aktifkan Terbatas',
            confirmTitle: 'Aktifkan mode Terbatas?',
            confirmDesc:
              'Akses admin masuk akan dibatasi ke rentang private IPv4, IPv4 link-local/loopback, IPv6 link-local, atau IPv6 loopback untuk HTTPS dan SSH. Rentang sumber publik tidak diizinkan. DNS, NTP, syslog jarak jauh, pembaruan online, DHCP, koneksi yang sudah terbentuk, dan lalu lintas kontrol IPv6 penting keluar tetap tersedia. WebRTC/ICE UDP dan lalu lintas masuk/keluar lainnya akan diblokir.'
          },
          paranoid: {
            enable: 'Aktifkan Paranoid',
            confirmTitle: 'Aktifkan mode Paranoid?',
            confirmDesc:
              'Hanya akses HTTPS dari rentang private IPv4, IPv4 link-local/loopback, IPv6 link-local, atau IPv6 loopback yang tetap tersedia. SSH, HTTP, mDNS, NTP, unduhan GitHub, dan lalu lintas lain diblokir kecuali DHCP/kontrol IPv6 minimal.'
          },
          baseline: {
            apply: 'Beralih ke Dasar',
            confirmTitle: 'Beralih ke mode Dasar terbuka?',
            confirmDesc:
              'Layanan firewall tetap aktif, tetapi pembatasan rentang sumber khusus lokal dihapus. Rentang sumber publik dapat menjangkau layanan NanoKVM yang terbuka jika jaringan merutekannya.'
          },
          rules: {
            title: 'Aturan saat ini',
            empty: 'Tidak ada aturan'
          }
        },
        saveChanges: 'Simpan perubahan',
        unsaved: 'Perubahan belum disimpan'
      },
      systemLog: {
        saveFailed: 'Gagal menyimpan pengaturan log',
        saved: 'Pengaturan log disimpan',
        invalidHost: 'Masukkan host server syslog',
        logLoadFailed: 'Gagal memuat log',
        save: 'Simpan',
        test: 'Kirim log uji',
        testSent: 'Log uji terkirim',
        testFailed: 'Gagal mengirim log uji',
        remote: {
          title: 'Pencatatan log jarak jauh',
          forward: 'Teruskan log sistem',
          description: 'Teruskan pesan sistem ke server jarak jauh',
          host: 'Server',
          hostDesc: 'Nama host atau alamat IPv4 server syslog',
          port: 'Port',
          protocol: 'Port UDP server syslog'
        },
        local: {
          title: 'Buffer log sistem',
          description:
            'Log saat ini disimpan di RAM pada {{path}} untuk menghindari penulisan ke kartu SD',
          priority: 'Prioritas minimum',
          priorityDesc: 'Tingkat urgensi minimum agar pesan dicatat',
          buffer: 'Ukuran buffer',
          bufferDesc: 'Ukuran log saat file dirotasi',
          rotations: 'Rotasi',
          rotationsDesc: 'Jumlah file log hasil rotasi yang disimpan',
          compact: 'Output ringkas',
          compactDesc: 'Hilangkan nama host dan facility dari setiap baris',
          stripTimestamps: 'Hapus timestamp',
          stripTimestampsDesc:
            'Hapus stempel waktu dari pengirim; syslog menambahkan miliknya sendiri'
        },
        kernel: {
          title: 'Pencatatan log kernel',
          enabled: 'Teruskan log kernel',
          enabledDesc: 'Tangkap pesan kernel ke dalam log sistem',
          consoleLevel: 'Level konsol',
          consoleLevelDesc: 'Tingkat urgensi minimum agar pesan kernel dicetak ke konsol'
        },
        viewer: {
          title: 'Log sistem',
          refresh: 'Segarkan',
          empty: 'Tidak ada entri log',
          truncated: 'Hanya data log terbaru yang ditampilkan',
          linesUnit: 'baris'
        },
        level: {
          '1': '1 - Alarm',
          '2': '2 - Kritis',
          '3': '3 - Kesalahan',
          '4': '4 - Peringatan',
          '5': '5 - Pemberitahuan',
          '6': '6 - Info',
          '7': '7 - Debug',
          '8': '8 - Semua'
        }
      },
      user: {
        title: 'Pengguna'
      },
      networking: {
        title: 'Jaringan'
      },
      wireguard: {
        title: 'WireGuard',
        tunnel: 'Terowongan terenkripsi',
        device: 'Perangkat ini',
        description: 'Akses KVM ini melalui terowongan WireGuard',
        unavailable: 'WireGuard tidak terpasang di perangkat ini',
        blocked: 'Mode Firewall Paranoid memblokir WireGuard',
        needsKey: 'Atur kunci privat sebelum mengaktifkan WireGuard',
        saved: 'Pengaturan WireGuard disimpan',
        save: 'Simpan perubahan',
        unsaved: 'Perubahan belum disimpan',
        invalid: 'Periksa kolom yang disorot',
        invalidAddress: 'Masukkan alamat beserta maskernya, misalnya 10.0.0.1/24',
        invalidKey: 'Masukkan kunci WireGuard sepanjang 44 karakter',
        invalidEndpoint: 'Masukkan nama host atau alamat IP',
        invalidPort: 'Masukkan port dari 1 sampai 65535',
        invalidRanges: 'Gunakan rentang IPv4 seperti 10.0.0.0/24, bukan 0.0.0.0/0',
        status: {
          connected: 'Terhubung',
          waiting: 'Menunggu peer',
          stopped: 'Dihentikan',
          handshake: 'Handshake terakhir {{time}}'
        },
        privateKey: {
          title: 'Kunci privat',
          description: 'Tetap di perangkat ini dan tidak akan ditampilkan lagi',
          set: 'Sudah diatur',
          notSet: 'Belum diatur',
          setBtn: 'Atur',
          generate: 'Buat',
          remove: 'Hapus',
          modalTitle: 'Atur kunci privat',
          modalDescription: 'Kunci disimpan di perangkat ini dan tidak akan ditampilkan lagi',
          placeholder: 'Tempel kunci privat',
          generateConfirmTitle: 'Buat kunci privat baru?',
          generateConfirmDesc:
            'Kunci saat ini tidak akan berfungsi lagi. Setelah itu, tambahkan kunci publik yang baru ke peer.',
          removeConfirmTitle: 'Hapus kunci privat?',
          removeConfirmDesc: 'WireGuard dimatikan dan tetap mati sampai kunci baru diatur.'
        },
        publicKey: {
          title: 'Kunci publik',
          description: 'Tambahkan ke konfigurasi peer'
        },
        address: {
          title: 'Alamat',
          description: 'Alamat KVM di dalam terowongan beserta maskernya'
        },
        peer: {
          title: 'Peer',
          publicKey: 'Kunci publik',
          publicKeyDescription: 'Kunci publik peer yang Anda hubungi',
          server: 'Server',
          serverDescription: 'Nama host atau alamat IP peer',
          port: 'Port',
          portDescription: 'Port UDP peer, biasanya 51820',
          allowedIps: 'IP yang diizinkan',
          allowedIpsDescription:
            'Alamat atau rentang peer di dalam terowongan, misalnya 10.0.0.0/24',
          keepalive: 'Keepalive',
          keepaliveDescription: 'Detik antar paket keepalive, diperlukan di belakang router'
        }
      },
      tailscale: {
        title: 'Tailscale',
        enableDesc: 'Akses KVM ini melalui jaringan Tailscale Anda',
        service: 'Layanan',
        performance: 'Kinerja',
        memory: {
          title: 'Optimasi memori',
          tip: 'Menjaga penggunaan memori Tailscale tetap rendah, yang membantu pada perangkat dengan RAM terbatas. Mulai ulang Tailscale agar perubahan berlaku.'
        },
        swap: {
          title: 'File swap',
          tip: 'Jika masalah terus berlanjut setelah mengaktifkan pengoptimalan memori, coba aktifkan file swap',
          sizeTip: 'Ini menetapkan ukuran file ke 128MB; sesuaikan di Pengaturan > Sistem > Kinerja'
        },
        restartTitle: 'Mulai ulang Tailscale',
        restartDesc: 'Memulai ulang layanan',
        restartBtn: 'Mulai ulang',
        restart: 'Mulai ulang Tailscale?',
        stopTitle: 'Hentikan Tailscale',
        stopBtn: 'Hentikan',
        stop: 'Hentikan Tailscale?',
        stopDesc: 'Menghentikan layanan dan mencegahnya berjalan saat boot',
        loading: 'Memuat...',
        notInstall: 'Tailscale tidak ditemukan, silakan pasang',
        install: 'Memasang',
        installing: 'Memasangkan',
        failed: 'Gagal memasangkan',
        retry: 'Harap segarkan dan coba lagi, atau instal secara manual.',
        download: 'Mengunduh',
        package: 'paket instalasi',
        unzip: 'dan unzip itu',
        upTailscale: 'Unggah tailscale ke direktori NanoKVM /usr/bin/',
        upTailscaled: 'Unggah tailscaled ke direktori NanoKVM /usr/sbin/',
        refresh: 'Segarkan halaman ini',
        notRunning: 'Tailscale tidak berjalan. Silakan mulai untuk melanjutkan.',
        run: 'Mulai',
        notLogin:
          'Perangkat belum ditautkan. Silakan masuk dan tautkan perangkat ini ke akun Anda.',
        urlPeriod: 'Url ini berlaku selama 10 menit',
        login: 'Masuk',
        loginSuccess: 'Berhasil masuk',
        deviceName: 'Nama perangkat',
        deviceIP: 'IP perangkat',
        account: 'Akun',
        logout: 'Keluar',
        logoutDesc: 'Apakah Anda yakin ingin logout?',
        uninstall: 'Copot pemasangan Tailscale',
        uninstallDesc: 'Apakah Anda yakin ingin menghapus instalan Tailscale?',
        okBtn: 'Ya',
        cancelBtn: 'Tidak'
      },
      update: {
        title: 'Pembaruan',
        currentVersion: 'Versi saat ini',
        latestVersion: 'Versi terbaru',
        queryFailed: 'Gagal mendapatkan versi',
        updateFailed: 'Gagal memperbarui',
        paranoidBlocked: 'Pembaruan online diblokir oleh mode firewall Paranoid',
        paranoidBlockedDesc:
          'Pemeriksaan dan unduhan GitHub memerlukan akses jaringan keluar. Unggahan offline dan instalasi yang sudah disiapkan tetap tersedia.',
        available: 'Ada pembaruan baru. Apakah Anda mau memperbarui?',
        updating: 'Pembaruan dimulai',
        confirm: 'Konfirmasi',
        cancel: 'Batalkan',
        badge: {
          checking: 'Memeriksa',
          latest: 'Terbaru',
          available: 'Pembaruan tersedia',
          failed: 'Pemeriksaan gagal',
          local: 'Lokal'
        },
        application: {
          title: 'Aplikasi'
        },
        system: {
          queryFailed: 'Gagal mendapatkan versi sistem',
          appUpdateRequired:
            'Perbarui aplikasi ke {{version}} sebelum memasang pembaruan sistem ini',
          requiredAppVersion: 'Versi aplikasi yang diperlukan',
          downloadFailed: 'Unduhan atau verifikasi gagal',
          available: 'Pembaruan sistem dasar tersedia.',
          downloading: 'Mengunduh dan memverifikasi pembaruan sistem...',
          downloadVerify: 'Unduh dan verifikasi',
          installing: 'Menginstal pembaruan sistem yang disiapkan...',
          install: 'Instal',
          installFailed: 'Instalasi gagal',
          installConfirmTitle: 'Instal pembaruan sistem?',
          installConfirmDesc:
            'Ini akan mengganti file sistem dasar dari bundel terverifikasi. Reboot akan diperlukan.',
          rawInstallConfirmDesc:
            'Bundel terverifikasi ini akan menulis image raw boot/rootfs ke partisi kartu SD dan reboot otomatis. Penulisan dapat memakan beberapa menit; pastikan daya tetap tersambung.',
          rawInstallWarning:
            'Tidak ada rollback otomatis untuk pembaruan partisi raw. Jika boot gagal, pulihkan kartu SD secara manual.',
          rawWaitTitle: 'Menginstal pembaruan sistem',
          rawWaitWriting: 'Menulis sistem baru ke kartu SD',
          rawWaitRestarting:
            'Perangkat sedang dimulai ulang. Halaman ini dimuat ulang saat perangkat kembali.',
          rawWaitDesc:
            'Proses ini memakan waktu sekitar tiga menit. Biarkan daya tetap terhubung dan jangan tutup halaman ini.',
          rawWaitSlow:
            'Proses ini lebih lama dari perkiraan. Tunggu beberapa menit lagi sebelum memutus daya.',
          rebootRequired: 'Reboot diperlukan untuk mengaktifkan status sistem ini.',
          rollingBack: 'Melakukan rollback pembaruan sistem...',
          rollback: 'Rollback',
          rollbackDone: 'Rollback disiapkan',
          rollbackFailed: 'Rollback gagal',
          rollbackConfirmTitle: 'Rollback pembaruan sistem?',
          rollbackConfirmDesc:
            'Ini akan memulihkan file dari cadangan pembaruan sistem terbaru. Reboot akan diperlukan.',
          stagedDesc:
            'Pembaruan sistem sudah diunduh dan diverifikasi, Anda dapat memasangnya sekarang',
          refresh: 'Segarkan',
          releaseNotes: 'Catatan rilis',
          systemVersion: 'Versi sistem',
          kernel: 'Kernel',
          stagedVersion: 'Versi yang disiapkan',
          archive: 'Arsip',
          requiredFree: 'Ruang kosong yang diperlukan',
          fileCount: 'File',
          rawImages: 'Image raw',
          progress: 'Progres',
          progressMessage: 'Pesan progres',
          pendingVersion: 'Versi tertunda',
          bootHealth: 'Kesehatan boot',
          healthy: 'Sehat',
          unhealthy: 'Perlu perhatian',
          rollbackBackup: 'Cadangan rollback'
        },
        offline: {
          title: 'Unggah paket aplikasi',
          desc: 'Pasang paket aplikasi dari komputer ini. Server akan dimulai ulang setelahnya.',
          installTitle: 'Pasang pembaruan aplikasi?',
          installDesc: 'Aplikasi diganti dan server dimulai ulang. Anda harus masuk lagi.'
        },
        local: {
          title: 'Unggah paket sistem',
          desc: 'Pasang paket sistem dari komputer ini. Satu berkas berisi arsip dan metadata yang sudah ditandatangani.',
          choose: 'Pilih berkas',
          invalidFile: 'Pilih paket berakhiran .tar atau .tar.gz.',
          diskTitle: 'Matikan disk virtual?',
          diskWarn:
            'Paket disimpan di /data, yang bersifat hanya-baca selama disk virtual menyala. Setelah dimatikan, komputer tidak lagi dapat mengakses /data. Lanjutkan?',
          uploading: 'Mengunggah',
          verifying: 'Memverifikasi dan menyiapkan paket',
          keyTitle: 'Kunci pembaruan lokal',
          keyDesc:
            'Kunci publik berformat PEM yang boleh menandatangani paket yang Anda bangun sendiri',
          keyNone: 'Kunci belum diatur',
          keySet: 'Atur kunci',
          keyRemove: 'Hapus',
          signer: 'Ditandatangani oleh',
          section: 'Pembaruan lokal',
          keyRequired: 'Perlu kunci lokal'
        }
      },
      account: {
        title: 'Akun',
        webAccount: 'Nama akun web',
        password: 'Kata sandi',
        passwordDesc: 'Ubah kata sandi yang digunakan untuk masuk ke antarmuka web',
        updateBtn: 'Ubah',
        logoutBtn: 'Keluar',
        logoutDesc: 'Apakah Anda yakin ingin logout?',
        okBtn: 'Ya',
        cancelBtn: 'Tidak',
        session: {
          title: 'Sesi'
        },
        logoutOnClose: {
          title: 'Keluar saat peramban ditutup',
          description: 'Akhiri sesi saat peramban ditutup, bukan membiarkannya tetap terbuka'
        },
        totp: {
          title: 'Autentikasi dua faktor',
          authenticator: 'Aplikasi autentikator',
          description: 'Wajibkan kode berbasis waktu dari aplikasi autentikator selain kata sandi',
          required: 'Diwajibkan oleh kebijakan',
          disable: 'Nonaktifkan',
          enableTitle: 'Siapkan autentikasi dua faktor',
          enableDescription:
            'Konfirmasi kata sandi Anda untuk melanjutkan. Kata sandi diperlukan untuk setiap perubahan pada faktor kedua.',
          continue: 'Lanjutkan',
          disableTitle: 'Nonaktifkan autentikasi dua faktor?',
          disableDescription:
            'Akun Anda hanya akan dilindungi oleh kata sandi. Konfirmasi dengan kata sandi Anda untuk melanjutkan.',
          disableFailed: 'Tidak dapat menonaktifkan autentikasi dua faktor',
          passwordPlaceholder: 'Kata sandi saat ini',
          enrollFailed: 'Tidak dapat memulai penyiapan',
          invalidCode: 'Kode itu tidak cocok. Coba kode berikutnya.',
          scan: 'Pindai ini dengan aplikasi autentikator Anda.',
          manualEntry: 'Atau masukkan kunci ini secara manual:',
          codePlaceholder: 'Masukkan kode 6 digit untuk konfirmasi',
          confirm: 'Konfirmasi',
          cancel: 'Batal',
          backupTitle: 'Simpan kode cadangan Anda sekarang',
          backupDescription:
            'Setiap kode hanya berlaku sekali dan tidak akan ditampilkan lagi. Kode ini satu-satunya jalan masuk jika Anda kehilangan aplikasi autentikator, dan tetap berfungsi saat jam perangkat tidak tersinkronisasi.',
          copy: 'Salin',
          copied: 'Kode cadangan disalin',
          savedThem: 'Sudah saya simpan',
          remaining: 'Tersisa {{remaining}} kode cadangan',
          clockUnsynced:
            'Jam perangkat belum tersinkronisasi. Sinkronkan waktu di Pengaturan > Sistem > Waktu sebelum melakukan penyiapan.',
          noBackupCodes: 'Tidak ada kode cadangan tersisa. Pilih Buat untuk membuat satu set baru.',
          regenerate: 'Kode cadangan baru',
          generate: 'Buat',
          regenerateTitle: 'Buat kode cadangan baru?',
          regenerateDescription:
            'Kode cadangan Anda saat ini akan berhenti berfungsi. Konfirmasi dengan kata sandi Anda untuk melanjutkan.',
          regenerateFailed: 'Tidak dapat membuat kode cadangan baru',
          download: 'Unduh',
          copyFailed: 'Tidak dapat menyalin. Pilih kode lalu salin secara manual.',
          requireTitle: 'Wajibkan autentikasi dua faktor',
          requireDescription:
            'Mencegah autentikasi dua faktor dinonaktifkan, dan akun yang belum memilikinya harus menyiapkannya sebelum menggunakan perangkat',
          requireFailed: 'Tidak dapat mengubah persyaratan',
          requiredTitle: 'Autentikasi dua faktor diwajibkan',
          requiredDescription:
            'Perangkat ini dikonfigurasi untuk mewajibkan faktor kedua, tetapi akun Anda belum menyiapkannya. Siapkan sekarang untuk melanjutkan.'
        }
      }
    },
    picoclaw: {
      title: 'Asisten PicoClaw',
      empty: 'Jelaskan tugas untuk memulai',
      inputPlaceholder: 'Jelaskan apa yang Anda ingin PicoClaw lakukan',
      newConversation: 'Percakapan baru',
      processing: 'Memproses...',
      agent: {
        defaultTitle: 'Asisten umum',
        defaultDescription: 'Obrolan umum, pencarian, dan bantuan ruang kerja',
        kvmTitle: 'Kontrol jarak jauh',
        kvmDescription: 'Operasikan host jarak jauh melalui NanoKVM',
        switched: 'Peran agen dialihkan',
        switchFailed: 'Gagal mengganti peran agen'
      },
      send: 'Kirim',
      cancel: 'Batalkan',
      status: {
        connecting: 'Menghubungkan ke gerbang...',
        connected: 'Sesi PicoClaw terhubung',
        disconnected: 'Sesi PicoClaw ditutup',
        stopped: 'Permintaan penghentian terkirim',
        runtimeStarted: 'Runtime PicoClaw dimulai',
        runtimeStartFailed: 'Gagal memulai runtime PicoClaw',
        runtimeStopped: 'Runtime PicoClaw dihentikan',
        runtimeStopFailed: 'Gagal menghentikan runtime PicoClaw'
      },
      connection: {
        runtime: {
          checking: 'Memeriksa',
          ready: 'Runtime siap',
          stopped: 'Runtime dihentikan',
          unavailable: 'Runtime tidak tersedia',
          configError: 'Kesalahan konfigurasi'
        },
        transport: {
          connecting: 'Menghubungkan',
          connected: 'Terhubung'
        },
        run: {
          idle: 'Menganggur',
          busy: 'Sibuk'
        }
      },
      error: {
        lockHeld: 'PicoClaw sedang digunakan di jendela lain',
        takenOver: 'Jendela lain mengambil alih PicoClaw',
        authFailed: 'PicoClaw menolak koneksi',
        upstreamClosed: 'Koneksi ke PicoClaw terputus'
      },
      tool: {
        screenshot: 'Mengambil tangkapan layar',
        loadImage: 'Melihat tangkapan layar',
        actions: 'Mengendalikan host',
        generic: 'Menggunakan {{name}}',
        type: 'Mengetik {{text}}',
        hotkey: 'Menekan {{keys}}',
        click: 'Mengeklik',
        doubleClick: 'Mengeklik dua kali',
        move: 'Menggerakkan mouse',
        drag: 'Menyeret',
        scroll: 'Menggulir',
        wait: 'Menunggu'
      },
      message: {
        toolAction: 'Aksi',
        observation: 'Pengamatan',
        screenshot: 'Tangkapan layar'
      },
      overlay: {
        locked: 'PicoClaw sedang mengendalikan perangkat. Input manual dijeda.'
      },
      install: {
        install: 'Instal PicoClaw',
        installing: 'Menginstal PicoClaw',
        success: 'PicoClaw berhasil diinstal',
        failed: 'Gagal menginstal PicoClaw',
        uninstalled: 'PicoClaw berhasil dicopot pemasangannya',
        uninstallFailed: 'Pencopotan pemasangan gagal',
        requiredTitle: 'PicoClaw tidak diinstal',
        requiredDescription: 'Instal PicoClaw sebelum memulai runtime PicoClaw.',
        progressDescription: 'PicoClaw sedang diunduh dan diinstal.',
        stages: {
          preparing: 'Mempersiapkan',
          downloading: 'Mengunduh',
          extracting: 'Mengekstraksi',
          verifying: 'Memverifikasi',
          installing: 'Memasangkan',
          installed: 'Terpasang',
          install_timeout: 'Waktu habis',
          install_failed: 'Gagal'
        }
      },
      model: {
        requiredTitle: 'Konfigurasi model diperlukan',
        requiredDescription: 'Konfigurasikan model PicoClaw sebelum menggunakan obrolan PicoClaw.',
        docsTitle: 'Panduan konfigurasi',
        docsDesc: 'Model dan protokol yang didukung',
        menuLabel: 'Konfigurasi model',
        modelIdentifier: 'Pengenal model',
        modelIdentifierPlaceholder: 'openai/gpt-5.4',
        apiBase: 'URL dasar API',
        apiBasePlaceholder: 'https://api.example.com/v1',
        apiKey: 'Kunci API',
        apiKeyPlaceholder: 'Masukkan kunci API model',
        apiKeyKeepPlaceholder: 'Biarkan kosong untuk mempertahankan kunci saat ini',
        save: 'Simpan',
        saving: 'Menyimpan',
        saved: 'Konfigurasi model disimpan',
        saveFailed: 'Gagal menyimpan konfigurasi model',
        invalid: 'Pengenal model, URL dasar API, dan kunci API wajib diisi'
      },
      uninstall: {
        confirmTitle: 'Copot pemasangan PicoClaw',
        confirmContent:
          'Apakah Anda yakin ingin menghapus instalan PicoClaw? Ini akan menghapus semua file yang dapat dieksekusi dan konfigurasi.',
        confirmOk: 'Copot pemasangan'
      },
      history: {
        title: 'Riwayat',
        loading: 'Memuat sesi...',
        emptyTitle: 'Belum ada riwayat',
        emptyDescription: 'Sesi PicoClaw sebelumnya akan muncul di sini.',
        loadFailed: 'Gagal memuat riwayat sesi',
        deleteFailed: 'Gagal menghapus sesi',
        deleteConfirmTitle: 'Hapus sesi',
        deleteConfirmContent: 'Apakah Anda yakin ingin menghapus "{{title}}"?',
        deleteConfirmOk: 'Hapus',
        messageCount_other: '{{count}} pesan'
      },
      config: {
        startRuntime: 'Mulai PicoClaw',
        stopRuntime: 'Hentikan PicoClaw',
        stopConfirm: 'Hentikan PicoClaw?'
      },
      start: {
        title: 'Mulai PicoClaw',
        description: 'Mulai runtime untuk mulai menggunakan asisten PicoClaw.'
      }
    },
    error: {
      title: 'Kami mengalami masalah',
      refresh: 'Segarkan'
    },
    fullscreen: {
      toggle: 'Beralih layar penuh'
    },
    menu: {
      collapse: 'Tutup menu'
    }
  }
};

export default id;
