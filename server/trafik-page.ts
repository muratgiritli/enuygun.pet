export function getTrafikHtml(): string {
  return `<!DOCTYPE html>
<html lang="tr" class="h-full bg-slate-900">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>ENUYGUN.PET - Canlı Ziyaretçi & Müşteri Aksiyon Takip Motoru</title>
  <!-- Arama Motorları Kesinlikle İndekslemesin -->
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex">
  <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet">
  
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * {
      -webkit-tap-highlight-color: transparent;
    }
    html, body, button, a, select, input, textarea, summary, [role="button"] {
      touch-action: manipulation;
    }
    select, input, textarea {
      font-size: 16px !important;
    }
    @keyframes pulse-fast {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.15); }
    }
    .animate-pulse-live {
      animation: pulse-fast 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }

    /* Canlı Harita İkon ve Nabız Efektleri */
    .pulse-marker-wrapper {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pulse-marker-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 9999px;
      background-color: rgba(16, 185, 129, 0.5);
      animation: map-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    .pulse-marker-core {
      position: relative;
      width: 13px;
      height: 13px;
      border-radius: 9999px;
      background-color: #10b981;
      border: 2.5px solid #ffffff;
      box-shadow: 0 0 14px #10b981;
    }
    .pulse-marker-action .pulse-marker-ring {
      background-color: rgba(236, 72, 153, 0.6);
      animation: map-ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    .pulse-marker-action .pulse-marker-core {
      background-color: #ec4899;
      border-color: #fdf2f8;
      box-shadow: 0 0 16px #ec4899;
    }
    @keyframes map-ping {
      0% { transform: scale(0.5); opacity: 1; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    .leaflet-popup-content-wrapper {
      background: #0f172a !important;
      color: #f1f5f9 !important;
      border: 1px solid #334155 !important;
      border-radius: 14px !important;
      box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.6) !important;
    }
    .leaflet-popup-tip {
      background: #0f172a !important;
      border: 1px solid #334155 !important;
    }
    .leaflet-container {
      background: #020617 !important;
    }
  </style>
</head>
<body class="h-full bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white">

  <!-- GİRİŞ EKRANI (Şifre Koruması) -->
  <div id="login-container" class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950">
    <div class="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="text-center mb-8 relative z-10">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <span class="material-symbols-outlined text-[32px] text-white">monitoring</span>
        </div>
        <h1 class="text-2xl font-extrabold text-white tracking-tight">ENUYGUN.PET</h1>
        <p class="text-sm font-semibold text-purple-400 mt-1">Canlı Ziyaretçi & Müşteri Aksiyon Takip Motoru</p>
        <p class="text-xs text-slate-400 mt-2">Bu sayfa arama motorlarına kapalıdır ve şifrelidir.</p>
      </div>

      <form id="login-form" class="space-y-4 relative z-10" onsubmit="handleLogin(event)">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Giriş Şifresi</label>
          <div class="relative">
            <input type="password" id="password-input" required autofocus placeholder="Şifrenizi yazınız..."
              autocapitalize="none" autocorrect="off" spellcheck="false" autocomplete="current-password"
              class="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all">
            <span class="material-symbols-outlined absolute right-3.5 top-3.5 text-slate-500">lock</span>
          </div>
          <div id="login-error" class="hidden text-xs text-red-400 font-semibold mt-2 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">error</span>
            <span>Hatalı şifre girdiniz. Lütfen tekrar deneyiniz.</span>
          </div>
        </div>

        <button type="submit" id="login-btn"
          class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all transform active:scale-95 flex items-center justify-center gap-2">
          <span>Giriş Yap</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </form>
    </div>
  </div>

  <!-- ANA KONTROL PANELİ -->
  <div id="dashboard-container" class="hidden min-h-screen flex flex-col bg-slate-950">
    
    <!-- Üst Bar -->
    <header class="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <span class="material-symbols-outlined text-[24px]">radar</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-base sm:text-lg text-white tracking-tight">ENUYGUN.PET</span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-live"></span>
                CANLI TAKİP
              </span>
            </div>
            <p class="text-[11px] text-slate-400 hidden sm:block">Ziyaretçi & Müşteri Arama/Yol Tarifi Takibi</p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Anlık Gerçek Sayaç -->
          <div class="flex items-center gap-2 bg-slate-800/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-sm shadow-emerald-500/10">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span class="text-xs font-semibold text-slate-300">Anlık:</span>
            <span id="header-online-count" class="font-mono text-sm font-extrabold text-emerald-400">0</span>
          </div>

          <!-- Otomatik Yenile Butonu -->
          <button id="toggle-autorefresh" onclick="toggleAutoRefresh()" title="Otomatik Yenileme (5s)"
            class="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-purple-400">sync</span>
            <span class="hidden sm:inline">Otomatik (5s):</span>
            <span id="autorefresh-label" class="font-bold text-emerald-400">Açık</span>
          </button>

          <!-- Manuel Yenile -->
          <button onclick="fetchData()" title="Şimdi Yenile"
            class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95 flex items-center justify-center">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
          </button>

          <!-- Çıkış -->
          <button onclick="logout()" title="Çıkış Yap"
            class="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all active:scale-95 flex items-center justify-center">
            <span class="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Ana Panel İçeriği -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- MÜŞTERİ AKSİYON & DÖNÜŞÜM BANNERI -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Telefon Arama Sayacı -->
        <div class="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg shadow-emerald-950/30">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">call</span>
              Bugün Telefon Butonuna Basanlar
            </span>
            <div class="flex items-baseline gap-2 mt-1">
              <span id="metric-phone-clicks" class="font-mono text-3xl font-black text-white">0</span>
              <span class="text-xs text-emerald-300 font-semibold">arama niyeti</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">0532 354 40 55 butonuna tıklayanlar</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <span class="material-symbols-outlined text-[28px] animate-pulse">phone_in_talk</span>
          </div>
        </div>

        <!-- Yol Tarifi Sayacı -->
        <div class="bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg shadow-cyan-950/30">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">near_me</span>
              Bugün Yol Tarifi Alanlar
            </span>
            <div class="flex items-baseline gap-2 mt-1">
              <span id="metric-direction-clicks" class="font-mono text-3xl font-black text-white">0</span>
              <span class="text-xs text-cyan-300 font-semibold">harita açtı</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">Dükkana gelmek üzere navigasyon başlatanlar</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <span class="material-symbols-outlined text-[28px] animate-pulse">directions</span>
          </div>
        </div>

        <!-- Dönüşüm Oranı -->
        <div class="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg shadow-purple-950/30">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px]">target</span>
              Müşteri Dönüşüm Oranı
            </span>
            <div class="flex items-baseline gap-2 mt-1">
              <span id="metric-conversion-rate" class="font-mono text-3xl font-black text-purple-300">%0.0</span>
              <span class="text-xs text-slate-400">aksiyon oranı</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">Gelenlerin arama veya yol tarifi alma yüzdesi</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <span class="material-symbols-outlined text-[28px]">insights</span>
          </div>
        </div>
      </div>

      <!-- ANA GÖRÜNÜM SEKMELERİ (BOTLARI AYRI GÖSTER + AKSİYON ALANLAR) -->
      <div class="flex items-center justify-between flex-wrap gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
        <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <!-- Sekme 1: Gerçek Ziyaretçiler -->
          <button id="tab-btn-users" onclick="switchViewMode('users')"
            class="view-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 whitespace-nowrap">
            <span class="material-symbols-outlined text-[18px]">person</span>
            <span>Gerçek Ziyaretçiler</span>
            <span id="tab-count-users" class="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800 text-emerald-200 font-mono">0</span>
          </button>

          <!-- Sekme 2: Aksiyon Alanlar (Telefon & Harita) -->
          <button id="tab-btn-actions" onclick="switchViewMode('actions')"
            class="view-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap">
            <span class="material-symbols-outlined text-[18px] text-emerald-400">ring_volume</span>
            <span>Arayanlar & Yol Tarifi Alanlar</span>
            <span id="tab-count-actions" class="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">0</span>
          </button>

          <!-- Sekme 3: Botlar & Tarayıcılar -->
          <button id="tab-btn-bots" onclick="switchViewMode('bots')"
            class="view-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap">
            <span class="material-symbols-outlined text-[18px] text-amber-400">smart_toy</span>
            <span>Botlar & Arama Motorları</span>
            <span id="tab-count-bots" class="px-2 py-0.5 rounded-full text-[11px] bg-slate-900 text-amber-400 font-mono">0</span>
          </button>

          <!-- Sekme 4: Tümü -->
          <button id="tab-btn-all" onclick="switchViewMode('all')"
            class="view-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-800 hover:bg-slate-700 text-slate-400 whitespace-nowrap">
            <span class="material-symbols-outlined text-[18px]">public</span>
            <span>Tümü (Karışık)</span>
            <span id="tab-count-all" class="px-2 py-0.5 rounded-full text-[11px] bg-slate-900 text-slate-400 font-mono">0</span>
          </button>
        </div>

        <div class="text-xs text-slate-400 flex items-center gap-2 px-2">
          <span class="material-symbols-outlined text-[16px] text-purple-400">info</span>
          <span id="view-mode-desc">Şu an <strong>sadece gerçek kullanıcı trafiği</strong> görüntüleniyor.</span>
        </div>
      </div>
      
      <!-- Metrik Kartları -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Kart 1: Anlık Çevrimiçi Gerçek Kişi -->
        <div class="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Çevrimiçi Gerçek Kişi</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <span class="material-symbols-outlined text-[20px]">person_pin_circle</span>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span id="metric-online" class="font-mono text-3xl sm:text-4xl font-black text-emerald-400">0</span>
            <span class="text-xs text-slate-400">kişi</span>
          </div>
          <p class="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Son 5 dk aktif insanlar
          </p>
        </div>

        <!-- Kart 2: Bugünkü Gerçek Ziyaret -->
        <div class="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Bugünkü Gerçek Kişi</span>
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <span class="material-symbols-outlined text-[20px]">group</span>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span id="metric-today-hits" class="font-mono text-3xl sm:text-4xl font-black text-purple-400">0</span>
            <span class="text-xs text-slate-400">ziyaret</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1">
            <span id="metric-today-unique" class="font-bold text-slate-200">0</span> tekil gerçek IP
          </p>
        </div>

        <!-- Kart 3: Toplam Gerçek / Bot Sayacı -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span id="metric-3-label" class="text-xs font-bold uppercase tracking-wider text-slate-400">Toplam Gerçek İnsan</span>
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <span class="material-symbols-outlined text-[20px]">bar_chart</span>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span id="metric-3-val" class="font-mono text-3xl sm:text-4xl font-black text-white">0</span>
            <span class="text-xs text-slate-400">ziyaret</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1">
            <span id="metric-3-sub" class="font-bold text-slate-200">0</span> tekil insan IP'si
          </p>
        </div>

        <!-- Kart 4: Bot Sayacı / Şehir -->
        <div class="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div class="flex items-center justify-between mb-2">
            <span id="metric-4-label" class="text-xs font-bold uppercase tracking-wider text-amber-400">Bot Taramaları</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <span class="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
          </div>
          <div class="flex items-baseline gap-2 truncate">
            <span id="metric-4-val" class="font-mono text-3xl font-black text-amber-300">0</span>
            <span class="text-xs text-slate-400">tarama</span>
          </div>
          <p id="metric-4-sub" class="text-[11px] text-slate-400 mt-1 truncate">Bugün: 0 bot isteği</p>
        </div>
      </div>

      <!-- CANLI HARİTA (ZİYARETÇİ NOKTALARI & PARLAMA) -->
      <div id="map-section-card" class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span class="material-symbols-outlined text-[24px]">explore</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-extrabold text-base text-white">Canlı Ziyaretçi Haritası</h2>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span id="map-active-count">0 Canlı Nokta</span>
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Sitedeki gerçek ziyaretçiler harita üzerinde yeşil nabız ile canlı parlar.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="focusMapSamsun()" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-all">
              <span class="material-symbols-outlined text-[16px]">location_on</span>
              <span>Samsun / Atakum'a Odaklan</span>
            </button>
            <button onclick="focusMapTurkey()" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all">
              <span class="material-symbols-outlined text-[16px]">zoom_out_map</span>
              <span>Tüm Türkiye</span>
            </button>
          </div>
        </div>

        <!-- Harita Alanı -->
        <div id="live-visitor-map" class="w-full h-72 sm:h-80 rounded-xl border border-slate-800 overflow-hidden relative z-10"></div>
      </div>

      <!-- ⏰ EN YOĞUN SAATLER GRAFİĞİ (ZİYARETÇİ SAAT DAĞILIMI) -->
      <div id="hourly-stats-card" class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <span class="material-symbols-outlined text-[24px]">schedule</span>
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="font-extrabold text-base text-white">En Yoğun Saatler Grafiği</h2>
                <span id="peak-hour-badge" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
                  <span class="material-symbols-outlined text-[13px]">bolt</span>
                  <span id="peak-hour-text">Zirve: Hesaplanıyor...</span>
                </span>
                <span id="current-hour-badge" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hidden sm:inline-flex">
                  <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span id="current-hour-text">Şu An: --:00</span>
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">Müşterilerin gün içinde en çok saat kaçta siteye girdiğini ve arama yaptığını gösterir.</p>
            </div>
          </div>

          <!-- Gösterge / Lejant -->
          <div class="flex items-center gap-3 text-[11px] text-slate-400">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span>
              <span>Ziyaretçi</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded bg-pink-500 inline-block"></span>
              <span>Telefon / Harita</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span>
              <span>En Yoğun Saat</span>
            </div>
          </div>
        </div>

        <!-- 24 Saatlik Çubuk Grafik Alanı -->
        <div class="pt-3 pb-1">
          <div id="hourly-chart-container" class="h-44 sm:h-52 flex items-end justify-between gap-1 sm:gap-1.5 px-1 border-b border-slate-800 pb-2">
            <!-- 24 Saat Çubukları JS ile eklenir -->
            <div class="w-full text-center text-xs text-slate-500 py-16">Saatlik grafik verileri yükleniyor...</div>
          </div>
          <!-- 24 Saatlik Eksen Etiketleri -->
          <div id="hourly-labels-container" class="flex justify-between text-[10px] text-slate-500 pt-2 font-mono px-1">
            <!-- Saat Etiketleri -->
          </div>
        </div>

        <!-- Akıllı Mesai ve Arama Önerisi Şeridi -->
        <div id="hourly-insight-box" class="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
          <span class="material-symbols-outlined text-amber-400 text-[20px] shrink-0">tips_and_updates</span>
          <span id="hourly-insight-text">Günlük saatlik trafik ve telefon eğilimleri hesaplanıyor...</span>
        </div>
      </div>

      <!-- BOT ÖZET ŞERİDİ (Bot Görünümünde) -->
      <div id="bot-summary-bar" class="hidden bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-400 text-[22px]">smart_toy</span>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-300">Ayrıştırılmış Botlar</span>
            <p class="text-[11px] text-slate-400">Sitenizi tarayan arama motoru botları ve örümcekler:</p>
          </div>
        </div>
        <div id="bot-chips" class="flex flex-wrap gap-2"></div>
      </div>

      <!-- Dağılım Kartları (Şehirler, Kaynaklar, Cihazlar - SADECE GERÇEK ZİYARETÇİLERDEN) -->
      <div id="stats-breakdown-row" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Şehirler -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-purple-400 text-[20px]">pin_drop</span>
              <h3 class="font-bold text-sm text-white">Şehir Dağılımı (Gerçek Kişiler)</h3>
            </div>
            <span class="text-[11px] text-slate-400">Top 10</span>
          </div>
          <div id="cities-list" class="space-y-2.5 flex-1 overflow-y-auto max-h-56 pr-1">
            <p class="text-xs text-slate-500 py-4 text-center">Veri bekleniyor...</p>
          </div>
        </div>

        <!-- Geliş Kaynakları & Aramalar -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-indigo-400 text-[20px]">share</span>
              <h3 class="font-bold text-sm text-white">Geliş Kaynakları & Arama</h3>
            </div>
            <span class="text-[11px] text-slate-400">Kaynaklar</span>
          </div>
          <div id="sources-list" class="space-y-2.5 flex-1 overflow-y-auto max-h-56 pr-1">
            <p class="text-xs text-slate-500 py-4 text-center">Veri bekleniyor...</p>
          </div>
        </div>

        <!-- Cihaz & Sayfalar -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-cyan-400 text-[20px]">devices</span>
              <h3 class="font-bold text-sm text-white">Cihaz & Popüler Sayfalar</h3>
            </div>
            <span class="text-[11px] text-slate-400">Oranlar</span>
          </div>
          <div id="devices-pages-list" class="space-y-2.5 flex-1 overflow-y-auto max-h-56 pr-1">
            <p class="text-xs text-slate-500 py-4 text-center">Veri bekleniyor...</p>
          </div>
        </div>
      </div>

      <!-- Arama ve Filtre Çubuğu -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <!-- Canlı Arama Input'u -->
        <div class="relative flex-1">
          <span class="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[20px]">search</span>
          <input type="text" id="table-search" oninput="filterLogs()" placeholder="Canlı filtrele: IP, Şehir, Mahalle, Sayfa, Arama veya Cihaz..."
            class="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500">
        </div>

        <!-- Hızlı Filtre Butonları -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button onclick="setSubFilter('all')" data-sub="all" class="subfilter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white transition-all whitespace-nowrap">Tümü</button>
          <button onclick="setSubFilter('actioned')" data-sub="actioned" class="subfilter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-all whitespace-nowrap flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">bolt</span>
            <span>Sadece Arayanlar & Yol Tarifi</span>
          </button>
          <button onclick="setSubFilter('samsun')" data-sub="samsun" class="subfilter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all whitespace-nowrap">📍 Samsun & Atakum</button>
          <button onclick="setSubFilter('google')" data-sub="google" class="subfilter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all whitespace-nowrap">🔍 Google Arama</button>
          <button onclick="setSubFilter('mobile')" data-sub="mobile" class="subfilter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all whitespace-nowrap">📱 Mobil</button>
        </div>
      </div>

      <!-- Detaylı Ziyaretçi Tablosu -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div class="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 class="font-extrabold text-base text-white flex items-center gap-2">
              <span id="table-title">Gerçek Ziyaretçi Akış Tablosu</span>
              <span id="log-count-badge" class="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">0 kayıt</span>
            </h2>
            <p id="table-subtitle" class="text-xs text-slate-400 mt-0.5">Sadece gerçek müşteri ve kullanıcı ziyaretleri gösteriliyor.</p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- EXCEL / CSV İNDİR (FİLTRELENEN LİSTE) -->
            <button onclick="downloadFilteredCsv()" title="Şu an ekranda listelenen kayıtları Excel (.csv) olarak bilgisayarınıza indirir"
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95">
              <span class="material-symbols-outlined text-[18px]">download</span>
              <span>Excel / CSV İndir</span>
            </button>

            <!-- TÜM GEÇMİŞİ İNDİR (FULL SUNUCU ARŞİVİ) -->
            <button onclick="downloadFullServerCsv()" title="Sunucudaki tüm geçmiş ziyaretçi kayıtlarını Excel (.csv) olarak indirir"
              class="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95 hidden sm:flex">
              <span class="material-symbols-outlined text-[18px]">file_save</span>
              <span>Tüm Geçmiş (Full)</span>
            </button>

            <span id="last-updated-text" class="text-[11px] text-slate-500 font-mono hidden md:block">Son güncelleme: --:--:--</span>
          </div>
        </div>

        <div class="overflow-x-auto flex-1">
          <table class="w-full text-left text-xs">
            <thead id="table-thead" class="bg-slate-950/70 border-b border-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
              <!-- Dinamik Başlıklar -->
            </thead>
            <tbody id="logs-tbody" class="divide-y divide-slate-800/60 font-medium">
              <tr>
                <td colspan="7" class="py-8 text-center text-slate-500">
                  <div class="inline-flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px] animate-spin text-purple-400">progress_activity</span>
                    <span>Ziyaretçi verileri yükleniyor...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- Alt Bilgi -->
    <footer class="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
      ENUYGUN.PET &bull; Özel Yönetici Ziyaretçi & Müşteri Takip Motoru &bull; Samsun / Atakum
    </footer>
  </div>

  <script>
    let globalData = null;
    let viewMode = 'users'; // 'users' | 'actions' | 'bots' | 'all'
    let subFilter = 'all';
    let autoRefreshTimer = null;
    let isAutoRefreshActive = true;
    let visitorMap = null;
    let mapMarkersLayer = null;
    let currentFilteredLogs = [];

    // Sayfa Yüklendiğinde
    document.addEventListener("DOMContentLoaded", () => {
      const savedToken = localStorage.getItem("enuygun_trafik_token");
      if (savedToken) {
        showDashboard();
        fetchData();
        startAutoRefresh();
      } else {
        showLogin();
      }
    });

    function showLogin() {
      document.getElementById("login-container").classList.remove("hidden");
      document.getElementById("dashboard-container").classList.add("hidden");
    }

    function showDashboard() {
      document.getElementById("login-container").classList.add("hidden");
      document.getElementById("dashboard-container").classList.remove("hidden");
      setTimeout(initMap, 200);
    }

    function initMap() {
      if (visitorMap) {
        visitorMap.invalidateSize();
        return;
      }
      const mapEl = document.getElementById("live-visitor-map");
      if (!mapEl || typeof L === 'undefined') return;

      try {
        visitorMap = L.map('live-visitor-map', {
          center: [41.3496, 36.2418],
          zoom: 7,
          attributionControl: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd'
        }).addTo(visitorMap);

        mapMarkersLayer = L.layerGroup().addTo(visitorMap);

        setTimeout(() => {
          if (visitorMap) visitorMap.invalidateSize();
        }, 300);
      } catch (err) {
        console.error("Harita başlatılamadı:", err);
      }
    }

    function focusMapSamsun() {
      if (!visitorMap) initMap();
      if (visitorMap) {
        visitorMap.setView([41.3496, 36.2418], 12, { animate: true });
      }
    }

    function focusMapTurkey() {
      if (!visitorMap) initMap();
      if (visitorMap) {
        visitorMap.setView([39.1667, 35.6667], 6, { animate: true });
      }
    }

    function updateMapMarkers(markers) {
      if (!visitorMap) initMap();
      if (!mapMarkersLayer) return;

      mapMarkersLayer.clearLayers();

      const countEl = document.getElementById("map-active-count");
      if (!markers || markers.length === 0) {
        if (countEl) countEl.innerText = "0 Canlı Nokta";
        return;
      }

      if (countEl) countEl.innerText = markers.length + " Canlı Nokta";

      markers.forEach(m => {
        if (!m.lat || !m.lon) return;

        const hasAction = m.actions && m.actions.length > 0;
        const actionClass = hasAction ? 'pulse-marker-action' : '';

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: \`
            <div class="pulse-marker-wrapper \${actionClass}">
              <div class="pulse-marker-ring"></div>
              <div class="pulse-marker-core"></div>
            </div>
          \`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        let actionBadges = "";
        if (m.actions && m.actions.includes("phone")) {
          actionBadges += '<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:6px;background:rgba(16,185,129,0.25);color:#34d399;font-weight:700;font-size:10px;">📞 Telefon Butonuna Bastı</span> ';
        }
        if (m.actions && m.actions.includes("directions")) {
          actionBadges += '<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:6px;background:rgba(6,182,212,0.25);color:#22d3ee;font-weight:700;font-size:10px;">🗺️ Yol Tarifi Aldı</span> ';
        }

        const onlineStatus = m.isOnline
          ? '<span style="color:#10b981;font-weight:bold;">🟢 Şu An Sitede (Canlı)</span>'
          : '<span style="color:#94a3b8;">⚪ Son 1 Saat İçinde</span>';

        const popupHtml = \`
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;line-height:1.45;min-width:180px;">
            <div style="font-weight:800;color:#ffffff;font-size:13px;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between;">
              <span>📍 \${m.city || 'Bilinmiyor'} \${m.district ? ' / ' + m.district : ''}</span>
            </div>
            <div style="margin-bottom:4px;">\${onlineStatus}</div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:2px;">IP: <strong style="color:#e2e8f0;font-family:monospace;">\${m.ip}</strong></div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:2px;">Cihaz: <strong style="color:#e2e8f0;">\${m.device || 'Bilinmiyor'}</strong></div>
            <div style="color:#94a3b8;font-size:11px;margin-bottom:2px;">Sayfa: <span style="color:#38bdf8;font-family:monospace;">\${m.page || '/'}</span></div>
            <div style="color:#64748b;font-size:10px;margin-bottom:6px;">Zaman: \${m.timeStr || ''}</div>
            \${actionBadges ? '<div style="margin-top:6px;padding-top:6px;border-top:1px solid #334155;">' + actionBadges + '</div>' : ''}
          </div>
        \`;

        L.marker([m.lat, m.lon], { icon })
          .bindPopup(popupHtml)
          .addTo(mapMarkersLayer);
      });
    }

    function updateHourlyChart(stats) {
      if (!stats) return;

      const container = document.getElementById("hourly-chart-container");
      const labelsContainer = document.getElementById("hourly-labels-container");
      const peakBadge = document.getElementById("peak-hour-text");
      const currentBadge = document.getElementById("current-hour-text");
      const insightText = document.getElementById("hourly-insight-text");

      if (!container) return;

      const maxVisitors = Math.max(...(stats.visitors || [1]), 1);
      const currentH = stats.currentHour;
      const peakH = stats.peakHour;
      const peakCount = stats.peakCount;

      if (peakBadge) {
        if (peakCount > 0) {
          peakBadge.innerText = "Zirve: " + stats.peakLabel + " (" + peakCount + " ziyaret)";
        } else {
          peakBadge.innerText = "Zirve: Henüz veri yok";
        }
      }

      if (currentBadge) {
        const curCount = (stats.visitors && stats.visitors[currentH]) || 0;
        const curHStr = String(currentH).padStart(2, '0') + ":00";
        currentBadge.innerText = "Şu An (" + curHStr + "): " + curCount + " kişi";
      }

      let barsHtml = "";
      let labelsHtml = "";

      for (let i = 0; i < 24; i++) {
        const vCount = (stats.visitors && stats.visitors[i]) || 0;
        const aCount = (stats.actions && stats.actions[i]) || 0;
        const heightPct = Math.max(Math.round((vCount / maxVisitors) * 100), vCount > 0 ? 8 : 4);
        const isCurrent = i === currentH;
        const isPeak = i === peakH && peakCount > 0;

        let barColor = "from-indigo-600 to-cyan-500";
        let glowClass = "";
        let borderClass = "border border-cyan-500/20";

        if (isPeak) {
          barColor = "from-amber-600 via-rose-500 to-amber-400";
          glowClass = "shadow-lg shadow-amber-500/30";
          borderClass = "border border-amber-400";
        } else if (isCurrent) {
          barColor = "from-cyan-600 to-emerald-400";
          glowClass = "shadow-md shadow-emerald-500/20";
          borderClass = "border-2 border-emerald-400";
        }

        const hourStr = String(i).padStart(2, '0') + ":00";
        const nextHourStr = String((i + 1) % 24).padStart(2, '0') + ":00";

        const actionDot = aCount > 0
          ? \`<div class="w-2 h-2 rounded-full bg-pink-500 shadow-sm shadow-pink-500 mb-1 animate-pulse" title="\${aCount} telefon/harita aksiyonu"></div>\`
          : \`<div class="h-2 mb-1"></div>\`;

        const actionTooltip = aCount > 0
          ? \`<div class="flex items-center gap-1 text-pink-400 font-bold"><span class="w-1.5 h-1.5 rounded-full bg-pink-400"></span><span>Telefon / Harita: <strong>\${aCount}</strong></span></div>\`
          : '';

        const peakTag = isPeak ? \`<div class="text-[10px] text-amber-400 font-bold mt-0.5">🏆 Günün En Yoğun Saati</div>\` : '';
        const currentTag = isCurrent ? \`<div class="text-[10px] text-emerald-400 font-bold mt-0.5">🟢 Şu Anki Saat Dilimi</div>\` : '';
        const currentPing = isCurrent ? \`<span class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>\` : '';

        barsHtml += \`
          <div class="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
            
            <!-- Hover Tooltip -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-20 z-30 pointer-events-none bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-[11px] shadow-2xl whitespace-nowrap">
              <div class="font-extrabold text-cyan-300">\${hourStr} - \${nextHourStr}</div>
              <div class="flex items-center gap-1 text-slate-200">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Ziyaretçi: <strong>\${vCount}</strong></span>
              </div>
              \${actionTooltip}
              \${peakTag}
              \${currentTag}
            </div>

            <!-- Aksiyon Noktası -->
            \${actionDot}

            <!-- Bar -->
            <div class="w-full rounded-t-md bg-gradient-to-t \${barColor} \${glowClass} \${borderClass} transition-all duration-300 hover:brightness-125 relative"
                 style="height: \${heightPct}%;">
              \${currentPing}
            </div>

            <!-- Sayı -->
            <span class="text-[9px] font-mono text-slate-400 mt-1 hidden sm:block \${vCount > 0 ? 'opacity-100 font-bold text-white' : 'opacity-30'}">\${vCount}</span>
          </div>
        \`;

        const showLabel = (i % 3 === 0);
        labelsHtml += \`
          <div class="flex-1 text-center truncate \${showLabel ? 'opacity-100 font-bold text-slate-300' : 'opacity-0 sm:opacity-40'}">
            \${String(i).padStart(2, '0')}
          </div>
        \`;
      }

      container.innerHTML = barsHtml;
      labelsContainer.innerHTML = labelsHtml;

      if (insightText) {
        if (peakCount > 0) {
          insightText.innerHTML = \`
            <span>💡 <strong>Dükkan Mesaisi & Telefon Takibi Tavsiyesi:</strong> Müşterileriniz en çok <strong>\${stats.peakLabel}</strong> saatleri arasında dükkanınızı arıyor veya siteyi inceliyor. Bu saatlerde <strong>0532 354 40 55</strong> telefonuna anında yanıt vermek ve dükkan mesaisini buna göre koordine etmek satış dönüşümünü maksimuma çıkarır.</span>
          \`;
        } else {
          insightText.innerHTML = \`
            <span>💡 Ziyaretçi saatlik verileri kaydediliyor. Müşteriler siteye girdikçe en yoğun saatler ve müşteri arama eğilimleri burada canlı analiz edilecektir.</span>
          \`;
        }
      }
    }

    async function handleLogin(e) {
      e.preventDefault();
      const pass = (document.getElementById("password-input").value || "").trim();
      const errBox = document.getElementById("login-error");
      const btn = document.getElementById("login-btn");

      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span><span>Giriş Yapılıyor...</span>';
      errBox.classList.add("hidden");

      try {
        const res = await fetch("/api/trafik/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pass })
        });
        const d = await res.json();
        if (d.ok && d.token) {
          localStorage.setItem("enuygun_trafik_token", d.token);
          showDashboard();
          fetchData();
          startAutoRefresh();
        } else {
          errBox.classList.remove("hidden");
        }
      } catch (err) {
        errBox.classList.remove("hidden");
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Giriş Yap</span><span class="material-symbols-outlined text-[18px]">arrow_forward</span>';
      }
    }

    function logout() {
      localStorage.removeItem("enuygun_trafik_token");
      if (autoRefreshTimer) clearInterval(autoRefreshTimer);
      showLogin();
    }

    function toggleAutoRefresh() {
      isAutoRefreshActive = !isAutoRefreshActive;
      const lbl = document.getElementById("autorefresh-label");
      if (isAutoRefreshActive) {
        lbl.innerText = "Açık";
        lbl.className = "font-bold text-emerald-400";
        startAutoRefresh();
      } else {
        lbl.innerText = "Kapalı";
        lbl.className = "font-bold text-slate-500";
        if (autoRefreshTimer) clearInterval(autoRefreshTimer);
      }
    }

    function startAutoRefresh() {
      if (autoRefreshTimer) clearInterval(autoRefreshTimer);
      autoRefreshTimer = setInterval(() => {
        if (isAutoRefreshActive) {
          fetchData(true);
        }
      }, 5000);
    }

    async function fetchData(isSilent = false) {
      const token = localStorage.getItem("enuygun_trafik_token");
      if (!token) return logout();

      try {
        const res = await fetch("/api/trafik/data", {
          headers: { "Authorization": "Bearer " + token }
        });
        if (res.status === 401) {
          return logout();
        }
        globalData = await res.json();
        updateDashboard();
      } catch (e) {
        console.error("Veri çekilemedi:", e);
      }
    }

    function switchViewMode(mode) {
      viewMode = mode;
      
      const btnUsers = document.getElementById("tab-btn-users");
      const btnActions = document.getElementById("tab-btn-actions");
      const btnBots = document.getElementById("tab-btn-bots");
      const btnAll = document.getElementById("tab-btn-all");

      const activeClass = "view-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all text-white shadow-lg whitespace-nowrap";
      const passiveClass = "view-tab-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap";

      btnUsers.className = mode === 'users' ? activeClass + " bg-emerald-600 shadow-emerald-600/30" : passiveClass;
      btnActions.className = mode === 'actions' ? activeClass + " bg-emerald-700 shadow-emerald-700/40 ring-2 ring-emerald-400" : passiveClass;
      btnBots.className = mode === 'bots' ? activeClass + " bg-amber-600 shadow-amber-600/30" : passiveClass;
      btnAll.className = mode === 'all' ? activeClass + " bg-purple-600 shadow-purple-600/30" : passiveClass;

      const desc = document.getElementById("view-mode-desc");
      const botSummaryBar = document.getElementById("bot-summary-bar");

      if (mode === 'users') {
        desc.innerHTML = "Şu an <strong>sadece gerçek kullanıcı trafiği</strong> görüntüleniyor.";
        botSummaryBar.classList.add("hidden");
      } else if (mode === 'actions') {
        desc.innerHTML = "Şu an <strong>sadece telefon eden ve yol tarifi alan niyetli müşteriler</strong> görüntüleniyor.";
        botSummaryBar.classList.add("hidden");
      } else if (mode === 'bots') {
        desc.innerHTML = "Şu an <strong>sadece arama motoru botları ve tarayıcılar</strong> görüntüleniyor.";
        botSummaryBar.classList.remove("hidden");
      } else {
        desc.innerHTML = "Şu an <strong>tüm trafik (botlar ve kullanıcılar karışık)</strong> görüntüleniyor.";
        botSummaryBar.classList.remove("hidden");
      }

      filterLogs();
    }

    function setSubFilter(sub) {
      subFilter = sub;
      document.querySelectorAll(".subfilter-btn").forEach(b => {
        if (b.dataset.sub === sub) {
          b.className = "subfilter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white transition-all whitespace-nowrap";
        } else {
          b.className = "subfilter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all whitespace-nowrap";
        }
      });
      filterLogs();
    }

    function updateDashboard() {
      if (!globalData) return;

      // Sayaçlar
      document.getElementById("header-online-count").innerText = globalData.onlineCount || 0;
      document.getElementById("metric-online").innerText = globalData.onlineCount || 0;

      // Aksiyon Metrikleri (Telefon, Yol Tarifi, Dönüşüm Oranı)
      document.getElementById("metric-phone-clicks").innerText = globalData.todayPhoneClicks || 0;
      document.getElementById("metric-direction-clicks").innerText = globalData.todayDirectionClicks || 0;
      document.getElementById("metric-conversion-rate").innerText = "%" + (globalData.conversionRate || "0.0");
      
      // Tab Sayıları
      const actionCount = (globalData.userLogs || []).filter(l => l.actions && l.actions.length > 0).length;
      document.getElementById("tab-count-users").innerText = globalData.realHits || 0;
      document.getElementById("tab-count-actions").innerText = actionCount;
      document.getElementById("tab-count-bots").innerText = globalData.botHits || 0;
      document.getElementById("tab-count-all").innerText = globalData.totalHits || 0;

      // Gerçek Kullanıcı Metrikleri
      document.getElementById("metric-today-hits").innerText = globalData.todayRealHits || 0;
      document.getElementById("metric-today-unique").innerText = globalData.todayRealUnique || 0;
      document.getElementById("metric-3-val").innerText = globalData.realHits || 0;
      document.getElementById("metric-3-sub").innerText = (globalData.realUnique || 0) + " tekil insan IP'si";

      // Bot Metriği
      document.getElementById("metric-4-val").innerText = globalData.botHits || 0;
      document.getElementById("metric-4-sub").innerText = "Bugün: " + (globalData.todayBotHits || 0) + " bot isteği";

      // Bot Çipleri
      const botChips = document.getElementById("bot-chips");
      if (globalData.topBots && globalData.topBots.length > 0) {
        botChips.innerHTML = globalData.topBots.map(b => \`
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-950 border border-amber-500/30 text-amber-300 shadow-sm">
            <span class="material-symbols-outlined text-[14px]">smart_toy</span>
            \${b.name}: <strong class="text-white">\${b.count}</strong>
          </span>
        \`).join("");
      } else {
        botChips.innerHTML = '<span class="text-xs text-slate-400">Henüz bot kaydı yok</span>';
      }

      // Şehirler Listesi (Gerçek Ziyaretçiler)
      const cList = document.getElementById("cities-list");
      if (globalData.topCities && globalData.topCities.length > 0) {
        const max = globalData.topCities[0].count || 1;
        cList.innerHTML = globalData.topCities.map(c => {
          const pct = Math.round((c.count / max) * 100);
          return \`
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[14px] text-purple-400">location_on</span>
                  \${c.name}
                </span>
                <span class="font-mono font-bold text-purple-400">\${c.count}</span>
              </div>
              <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style="width: \${pct}%"></div>
              </div>
            </div>
          \`;
        }).join("");
      } else {
        cList.innerHTML = '<p class="text-xs text-slate-500 py-3 text-center">Henüz şehir verisi yok</p>';
      }

      // Kaynaklar Listesi (Gerçek Ziyaretçiler)
      const sList = document.getElementById("sources-list");
      if (globalData.topReferrers && globalData.topReferrers.length > 0) {
        const max = globalData.topReferrers[0].count || 1;
        sList.innerHTML = globalData.topReferrers.map(s => {
          const pct = Math.round((s.count / max) * 100);
          return \`
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="font-semibold text-slate-200 truncate flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[14px] text-indigo-400">travel_explore</span>
                  \${s.name}
                </span>
                <span class="font-mono font-bold text-indigo-400">\${s.count}</span>
              </div>
              <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style="width: \${pct}%"></div>
              </div>
            </div>
          \`;
        }).join("");
      } else {
        sList.innerHTML = '<p class="text-xs text-slate-500 py-3 text-center">Henüz kaynak verisi yok</p>';
      }

      // Cihaz ve Sayfalar
      const dpList = document.getElementById("devices-pages-list");
      const devHtml = (globalData.topDevices || []).map(d => \`
        <span class="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
          \${d.name}: <strong class="text-cyan-400">\${d.count}</strong>
        </span>
      \`).join("");

      const pagesHtml = (globalData.topPages || []).slice(0, 4).map(p => \`
        <div class="flex justify-between items-center text-xs py-1 border-b border-slate-800/60 last:border-0">
          <span class="font-mono text-slate-300 truncate max-w-[180px]">\${p.name === '/' ? 'Ana Sayfa (/)' : p.name}</span>
          <span class="font-mono font-bold text-cyan-400">\${p.count}</span>
        </div>
      \`).join("");

      dpList.innerHTML = \`
        <div class="flex flex-wrap gap-1.5 mb-3">\${devHtml || '<span class="text-xs text-slate-500">Cihaz yok</span>'}</div>
        <div class="pt-2 border-t border-slate-800/80">
          <div class="text-[11px] font-bold uppercase text-slate-400 mb-1.5">En Çok Ziyaret Edilenler:</div>
          \${pagesHtml}
        </div>
      \`;

      // Harita Noktalarını Güncelle
      if (globalData.liveMarkers) {
        updateMapMarkers(globalData.liveMarkers);
      }

      // Saatlik Yoğunluk Grafiğini Güncelle
      if (globalData.hourlyStats) {
        updateHourlyChart(globalData.hourlyStats);
      }

      filterLogs();

      // Saat
      const now = new Date();
      document.getElementById("last-updated-text").innerText = "Son güncelleme: " + now.toLocaleTimeString("tr-TR");
    }

    function filterLogs() {
      if (!globalData) return;

      let logs = [];
      const title = document.getElementById("table-title");
      const subtitle = document.getElementById("table-subtitle");
      const thead = document.getElementById("table-thead");

      if (viewMode === 'users') {
        logs = globalData.userLogs || [];
        title.innerText = "Gerçek Ziyaretçi Akış Tablosu";
        subtitle.innerText = "Sadece gerçek kullanıcılar, telefonlar ve bilgisayarlar listeleniyor.";
        thead.innerHTML = \`
          <tr>
            <th class="py-3 px-4">Tarih & Saat</th>
            <th class="py-3 px-4">Müşteri Aksiyonu</th>
            <th class="py-3 px-4">IP & Servis Sağlayıcı</th>
            <th class="py-3 px-4">Konum (Şehir & İlçe/Mahalle)</th>
            <th class="py-3 px-4">Sayfa</th>
            <th class="py-3 px-4">Geliş Kaynağı & Arama</th>
            <th class="py-3 px-4">Cihaz</th>
          </tr>
        \`;
      } else if (viewMode === 'actions') {
        logs = (globalData.userLogs || []).filter(l => l.actions && l.actions.length > 0);
        title.innerText = "Müşteri Aksiyonları (Telefon & Yol Tarifi)";
        subtitle.innerText = "Sitedeki telefon butonuna basan ve haritadan yol tarifi alan niyetli müşteriler.";
        thead.innerHTML = \`
          <tr>
            <th class="py-3 px-4">Tarih & Saat</th>
            <th class="py-3 px-4">Yapılan Aksiyon</th>
            <th class="py-3 px-4">IP & Servis Sağlayıcı</th>
            <th class="py-3 px-4">Konum (Şehir & Mahalle)</th>
            <th class="py-3 px-4">Hangi Sayfadan Aradı?</th>
            <th class="py-3 px-4">Geliş Kaynağı & Arama</th>
            <th class="py-3 px-4">Cihaz</th>
          </tr>
        \`;
      } else if (viewMode === 'bots') {
        logs = globalData.botLogs || [];
        title.innerText = "Bot & Arama Motoru Tarama Tablosu";
        subtitle.innerText = "Googlebot, Bingbot, YandexBot ve web tarayıcı botları listeleniyor.";
        thead.innerHTML = \`
          <tr>
            <th class="py-3 px-4">Tarih & Saat</th>
            <th class="py-3 px-4">Bot Kimliği / Adı</th>
            <th class="py-3 px-4">IP & Veri Merkezi / Sunucu</th>
            <th class="py-3 px-4">Taranan Sayfa</th>
            <th class="py-3 px-4">Kaynak & Detay</th>
            <th class="py-3 px-4">User-Agent İmzası</th>
            <th class="py-3 px-4 text-center">Tür</th>
          </tr>
        \`;
      } else {
        logs = globalData.allLogs || [];
        title.innerText = "Tüm Ziyaretçi & Bot Akış Tablosu";
        subtitle.innerText = "Gerçek ziyaretçiler ve botlar karışık kronolojik sırada listeleniyor.";
        thead.innerHTML = \`
          <tr>
            <th class="py-3 px-4">Tarih & Saat</th>
            <th class="py-3 px-4">Aksiyon / Tür</th>
            <th class="py-3 px-4">IP / Bot Adı</th>
            <th class="py-3 px-4">Konum / Sunucu</th>
            <th class="py-3 px-4">Sayfa</th>
            <th class="py-3 px-4">Kaynak & Arama</th>
            <th class="py-3 px-4">Cihaz</th>
          </tr>
        \`;
      }

      // Alt filtreler
      if (subFilter === 'actioned') {
        logs = logs.filter(l => l.actions && l.actions.length > 0);
      } else if (subFilter === 'samsun') {
        logs = logs.filter(l => (l.city && l.city.toLowerCase().includes('samsun')) || (l.district && l.district.toLowerCase().includes('atakum')));
      } else if (subFilter === 'google') {
        logs = logs.filter(l => (l.referrerSource && l.referrerSource.toLowerCase().includes('google')) || (l.botName && l.botName.toLowerCase().includes('google')));
      } else if (subFilter === 'mobile') {
        logs = logs.filter(l => l.device === 'Mobil');
      }

      // Metin arama filtresi
      const q = document.getElementById("table-search").value.toLowerCase().trim();
      if (q) {
        logs = logs.filter(l =>
          (l.ip && l.ip.includes(q)) ||
          (l.city && l.city.toLowerCase().includes(q)) ||
          (l.district && l.district.toLowerCase().includes(q)) ||
          (l.isp && l.isp.toLowerCase().includes(q)) ||
          (l.path && l.path.toLowerCase().includes(q)) ||
          (l.referrerSource && l.referrerSource.toLowerCase().includes(q)) ||
          (l.searchQuery && l.searchQuery.toLowerCase().includes(q)) ||
          (l.device && l.device.toLowerCase().includes(q)) ||
          (l.botName && l.botName.toLowerCase().includes(q)) ||
          (l.ua && l.ua.toLowerCase().includes(q))
        );
      }

      renderTable(logs);
    }

    function renderTable(logs) {
      currentFilteredLogs = logs || [];
      const tbody = document.getElementById("logs-tbody");
      document.getElementById("log-count-badge").innerText = logs.length + " kayıt gösteriliyor";

      if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-500 font-medium">Bu kategoride veya filtrede gösterilecek kayıt bulunamadı.</td></tr>';
        return;
      }

      tbody.innerHTML = logs.map(l => {
        let locStr = l.city || "Bilinmiyor";
        if (l.district) locStr += " / " + l.district;
        if (l.countryCode && l.countryCode !== "TR") locStr += " (" + l.countryCode + ")";

        const pageLabel = l.path === "/" ? "Ana Sayfa (/)" : l.path;

        // Bot görünümünde özel satır
        if (viewMode === 'bots') {
          return \`
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="font-mono text-xs font-semibold text-amber-300">\${l.timeStr}</div>
                <div class="text-[10px] text-slate-500 mt-0.5">\${timeAgo(l.ts)}</div>
              </td>
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5 font-bold text-amber-400">
                  <span class="material-symbols-outlined text-[16px]">smart_toy</span>
                  <span>\${l.botName || 'Arama Botu'}</span>
                </div>
              </td>
              <td class="py-3 px-4">
                <div class="font-mono text-xs font-semibold text-slate-200 select-all">\${l.ip}</div>
                <div class="text-[11px] text-slate-400 truncate max-w-[220px]" title="\${l.isp || l.org || ''}">\${l.isp || l.org || locStr}</div>
              </td>
              <td class="py-3 px-4">
                <a href="\${l.path}" target="_blank" class="font-mono text-xs text-indigo-300 hover:text-indigo-200 hover:underline max-w-[180px] block truncate" title="\${l.path}">
                  \${pageLabel}
                </a>
              </td>
              <td class="py-3 px-4 max-w-[180px]">
                <span class="text-xs text-slate-300 truncate block">\${l.referrerSource || 'Doğrudan İstek'}</span>
              </td>
              <td class="py-3 px-4 max-w-[240px]">
                <span class="font-mono text-[10px] text-slate-400 block truncate" title="\${l.ua}">\${l.ua}</span>
              </td>
              <td class="py-3 px-4 text-center whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">🤖 Bot</span>
              </td>
            </tr>
          \`;
        }

        // Aksiyon Rozetleri
        let actionBadges = '';
        if (l.actions && l.actions.includes("phone")) {
          actionBadges += \`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20 mr-1 animate-pulse">
            <span class="material-symbols-outlined text-[15px]">call</span>
            <span>TELEFON ETTİ</span>
          </span>\`;
        }
        if (l.actions && l.actions.includes("directions")) {
          actionBadges += \`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20 animate-pulse">
            <span class="material-symbols-outlined text-[15px]">near_me</span>
            <span>YOL TARİFİ ALDI</span>
          </span>\`;
        }
        if (!actionBadges) {
          actionBadges = \`<span class="text-slate-500 text-[11px] flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">visibility</span>
            <span>Sayfa İnceledi</span>
          </span>\`;
        }

        // Gerçek kullanıcı satırı
        let sourceHtml = \`<span class="font-semibold text-slate-200">\${l.referrerSource || 'Doğrudan Giriş'}</span>\`;
        if (l.searchQuery) {
          sourceHtml += \`<div class="text-[11px] text-amber-300/90 font-mono mt-0.5 flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">search</span>
            <span>"\${l.searchQuery}"</span>
          </div>\`;
        }

        const isMobile = l.device === 'Mobil';
        const devIcon = isMobile ? 'phone_iphone' : l.device === 'Tablet' ? 'tablet_mac' : 'computer';

        return \`
          <tr class="hover:bg-slate-800/40 transition-colors \${l.actions && l.actions.length > 0 ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500' : ''}">
            <!-- Tarih -->
            <td class="py-3 px-4 whitespace-nowrap">
              <div class="font-mono text-xs font-semibold text-slate-200">\${l.timeStr}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">\${timeAgo(l.ts)}</div>
            </td>

            <!-- Aksiyon Rozeti -->
            <td class="py-3 px-4 whitespace-nowrap">
              \${actionBadges}
            </td>

            <!-- IP & Servis Sağlayıcı -->
            <td class="py-3 px-4">
              <div class="font-mono text-xs font-bold text-purple-300 select-all">\${l.ip}</div>
              <div class="text-[11px] text-slate-400 truncate max-w-[200px]" title="\${l.isp || l.org || ''}">\${l.isp || l.org || 'Bilinmeyen ISS'}</div>
            </td>

            <!-- Konum -->
            <td class="py-3 px-4">
              <div class="flex items-center gap-1.5 font-semibold text-slate-200">
                <span class="material-symbols-outlined text-[16px] \${locStr.includes('Samsun') ? 'text-amber-400' : 'text-purple-400'}">location_on</span>
                <span>\${locStr}</span>
              </div>
              <div class="text-[10px] text-slate-500 pl-5">\${l.region ? l.region + ', ' : ''}\${l.country || 'Türkiye'}</div>
            </td>

            <!-- Sayfa -->
            <td class="py-3 px-4">
              <a href="\${l.path}" target="_blank" class="font-mono text-xs text-indigo-300 hover:text-indigo-200 hover:underline max-w-[180px] block truncate" title="\${l.path}">
                \${pageLabel}
              </a>
            </td>

            <!-- Geliş Kaynağı -->
            <td class="py-3 px-4 max-w-[220px]">
              \${sourceHtml}
            </td>

            <!-- Cihaz & Tarayıcı -->
            <td class="py-3 px-4 whitespace-nowrap">
              <div class="flex items-center gap-1.5 text-slate-300">
                <span class="material-symbols-outlined text-[16px] text-slate-400">\${devIcon}</span>
                <span class="font-medium">\${l.device}</span>
                <span class="text-slate-500">&bull;</span>
                <span class="text-slate-400">\${l.browser}</span>
              </div>
              <div class="text-[10px] text-slate-500 pl-5">\${l.os}</div>
            </td>
          </tr>
        \`;
      }).join("");
    }

    function timeAgo(ts) {
      const diffSec = Math.floor((Date.now() - ts) / 1000);
      if (diffSec < 10) return "az önce";
      if (diffSec < 60) return diffSec + " sn önce";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return diffMin + " dk önce";
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return diffHour + " sa önce";
      return Math.floor(diffHour / 24) + " gün önce";
    }

    // EXCEL / CSV İNDİRME MOTORU
    function downloadFilteredCsv() {
      if (!currentFilteredLogs || currentFilteredLogs.length === 0) {
        alert("İndirilecek kayıt bulunamadı.");
        return;
      }

      const headers = [
        "Tarih & Saat",
        "Kullanıcı Türü",
        "Müşteri Aksiyonu",
        "IP Adresi",
        "Şehir",
        "İlçe / Mahalle",
        "Bölge",
        "Ülke",
        "Servis Sağlayıcı (ISP)",
        "Ziyaret Edilen Sayfa",
        "Geliş Kaynağı",
        "Arama Kelimesi",
        "Cihaz",
        "İşletim Sistemi",
        "Tarayıcı"
      ];

      const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        const s = String(str).replace(/"/g, '""');
        return '"' + s + '"';
      };

      const rows = [headers.join(";")];

      currentFilteredLogs.forEach(l => {
        let actionStr = "Aksiyon Yok";
        if (l.actions && l.actions.length > 0) {
          const parts = [];
          if (l.actions.includes("phone")) parts.push("Telefon Etti");
          if (l.actions.includes("directions")) parts.push("Yol Tarifi Aldı");
          actionStr = parts.join(" + ");
        }

        const row = [
          escapeCsv(l.timeStr || ""),
          escapeCsv(l.isBot ? ("Bot (" + (l.botName || 'Bilinmiyor') + ")") : "Gerçek Ziyaretçi"),
          escapeCsv(actionStr),
          escapeCsv(l.ip || ""),
          escapeCsv(l.city || "Bilinmiyor"),
          escapeCsv(l.district || ""),
          escapeCsv(l.region || ""),
          escapeCsv(l.country || "Türkiye"),
          escapeCsv(l.isp || ""),
          escapeCsv(l.path || "/"),
          escapeCsv(l.referrerSource || l.referrer || "Doğrudan"),
          escapeCsv(l.searchQuery || ""),
          escapeCsv(l.device || "Bilinmiyor"),
          escapeCsv(l.os || "Bilinmiyor"),
          escapeCsv(l.browser || "Bilinmiyor")
        ];
        rows.push(row.join(";"));
      });

      const csvString = String.fromCharCode(0xFEFF) + rows.join(String.fromCharCode(13, 10));
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      a.href = url;
      a.download = "enuygun-pet-ziyaretciler-" + viewMode + "-" + dateStr + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function downloadFullServerCsv() {
      const token = localStorage.getItem("enuygun_trafik_token");
      if (!token) return logout();

      const type = viewMode === "bots" ? "bots" : (viewMode === "all" ? "all" : "users");
      const url = "/api/trafik/export?token=" + encodeURIComponent(token) + "&type=" + type + "&period=all";

      const a = document.createElement("a");
      a.href = url;
      a.download = "enuygun-pet-ziyaretciler-full.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  </script>
</body>
</html>`;
}
