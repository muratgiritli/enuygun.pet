
# -*- coding: utf-8 -*-
import html, json, os, re

OUT_DIR = "/build/public"

PAGES = [
    {
        "slug": "atakum-petshop",
        "nav_short": "Atakum Petshop",
        "theme": {
            "primary": "#0e4d64",
            "primary_dark": "#083344",
            "accent": "#0b6b3a",
            "cta_alt": "#b84300",
            "hero_bg": "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 52%, #ecfdf5 100%)",
            "surface": "#f4f9fc",
            "badge_bg": "#0e4d64"
        },
        "hero_img": "/img/hero-pets-520.webp",
        "hero_fallback": "/img/hero-pets.png",
        "title": "Atakum Petshop | Samsun Atakum Pet Shop & Eve Mama Teslimatı",
        "description": "Samsun Atakum petshop ve pet market sipariş hattı: 0 532 354 40 55. Atakum içi 12 mahalleye her gün 12.00 - 18.00 arası kapıda ödemeli mama ve kum teslimatı (Min. 600 TL).",
        "kicker": "SAMSUN ATAKUM YEREL PET MARKET REHBERİ",
        "h1": "Atakum Petshop: Samsun Sahil Hattında Aynı Gün Kapıya Teslimat",
        "lead": "Samsun Atakum pet shop arayışınızda mağaza kalitesini kapınıza getiriyoruz. Atakum en iyi petshop deneyimi için orijinal kedi maması, köpek maması, kedi kumu ve bakım ürünlerini her gün 12.00 – 18.00 saatleri arasında 0 532 354 40 55 WhatsApp hattımızdan sipariş edebilirsiniz.",
        "wa_prefill": "Merhaba, Atakum içi petshop siparişi vermek istiyorum.",
        "layout_variant": "editorial-split",
        "custom_html": """
        <section class="sec" id="bolge-tablosu" aria-labelledby="t1">
          <div class="wrap">
            <h2 class="h2" id="t1">Samsun Atakum Pet Shop Teslimat Bölgeleri ve Ulaşım Özeti</h2>
            <p class="sub">Atakum petshop Samsun hizmet ağımız, sahil bandından üst bulvarlara kadar seçili 12 mahalleyi kapsar. En uygun pet Atakum fiyatlarıyla minimum <strong>600 TL</strong> sepet tutarında kapıda ödeme kolaylığı sunuyoruz.</p>
            <div class="tbl-wrap" role="region" aria-label="Atakum mahalle teslimat tablosu" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Mahalle Grubu</th>
                    <th>Kapsanan Atakum Mahalleleri</th>
                    <th>Teslimat Saatleri</th>
                    <th>Alt Limit &amp; Ödeme</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Merkez &amp; Sahil Hattı</strong></td>
                    <td>Yenimahalle, Atakent, Güzelyalı, Denizevleri</td>
                    <td>Her gün 12.00 – 18.00</td>
                    <td>Min. 600 TL • Kapıda Ödeme</td>
                  </tr>
                  <tr>
                    <td><strong>Bulvar &amp; Doğu Atakum</strong></td>
                    <td>Mimarsinan, Cumhuriyet, Esenevler, Kamalı</td>
                    <td>Her gün 12.00 – 18.00</td>
                    <td>Min. 600 TL • Kapıda Ödeme</td>
                  </tr>
                  <tr>
                    <td><strong>Batı &amp; Üniversite Aksı</strong></td>
                    <td>Körfez, Kurupelit, Yeşilyurt, İncesu</td>
                    <td>Her gün 12.00 – 18.00</td>
                    <td>Min. 600 TL • Kapıda Ödeme</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="neden-atakum" aria-labelledby="t2">
          <div class="wrap">
            <h2 class="h2" id="t2">Atakum Pet Market Alışverişinde Neden Yerel Mağaza?</h2>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Kargo Beklemeden Aynı Gün Çözüm</h3>
                <p>Şehir dışı kargolarda yaşanan patlamış kum torbası veya gecikme stresi olmadan, petshop Samsun Atakum kuryemizle siparişiniz aynı gün 12.00–18.00 aralığında kapınıza ulaşır.</p>
              </article>
              <article class="info-card">
                <h3>Karadeniz Nemine Karşı Taze Stok</h3>
                <p>Samsun sahil ikliminde açıkta bekleyen mamalar hızla bayatlar. Atakum petshop yakın depolama alanımızda tüm mamalar kapalı ambalajında, serin raf koşullarında ve uzun SKT ile tutulur.</p>
              </article>
              <article class="info-card">
                <h3>Birebir WhatsApp Danışmanlığı</h3>
                <p>Kısırlaştırılmış kedi maması, yavru köpek maması veya topaklanan kum seçerken doğrudan mağaza ekibimize WhatsApp üzerinden danışıp anında güncel fiyat alabilirsiniz.</p>
              </article>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("Atakum petshop siparişleri hangi saatlerde teslim ediliyor?", "Samsun Atakum pet shop sipariş hattımız haftanın her günü 12.00 ile 18.00 saatleri arasında aktiftir ve bu saat diliminde adrese teslimat yapılır."),
            ("Atakum içi minimum sipariş tutarı ne kadar?", "Atakum içi 12 mahalleye (Yenimahalle, Atakent, Güzelyalı, Mimarsinan, Denizevleri, Körfez, Kurupelit, Esenevler, Yeşilyurt, Cumhuriyet, Kamalı ve İncesu) yapılan teslimatlarda minimum sipariş tutarı 600 TL'dir."),
            ("Mağazadan gel-al alışveriş yapabilir miyim?", "Evet. Petshop Atakum, pet shop Atakum ve Samsun petshop Atakum aramalarınızda Yeni Mahalle, 3078. Sokak No:10 Atakum / Samsun adresindeki mağazamıza gelerek veya öncesinde 0 532 354 40 55 hattımızdan stok ayırttırarak alışveriş yapabilirsiniz.")
        ]
    },
    {
        "slug": "atakent-yeni-mahalle-petshop",
        "nav_short": "Atakent & Yeni Mahalle",
        "theme": {
            "primary": "#7c2d12",
            "primary_dark": "#431407",
            "accent": "#0b6b3a",
            "cta_alt": "#9a3412",
            "hero_bg": "linear-gradient(135deg, #fff7ed 0%, #ffedd5 55%, #fef3c7 100%)",
            "surface": "#fffaf5",
            "badge_bg": "#9a3412"
        },
        "hero_img": "/img/cat.webp",
        "hero_fallback": "/img/cat.jpg",
        "title": "Atakent Petshop & Yeni Mahalle Pet Shop | Komşu Mağaza Sipariş",
        "description": "Atakent petshop ve Yeni Mahalle petshop ihtiyaçlarınız için 3078. Sokak No:10 adresindeyiz! Her gün 12.00 - 18.00 arası WhatsApp sipariş: 0 532 354 40 55 (Min. 600 TL).",
        "kicker": "MAHALLE İÇİ HIZLI PET SHOP NOKTASI",
        "h1": "Atakent Pet Shop ve Yeni Mahalle Petshop: Komşu Mağazanız Kapınızda",
        "lead": "Yeni Mahalle 3078. Sokak No:10 adresindeki mağazamızla Atakent petshop ve Yeni Mahalle petshop aramalarınızda tam merkezdeyiz. Ağır mama ve kedi kumu paketlerini taşımanıza gerek kalmadan kapınıza getiriyoruz.",
        "wa_prefill": "Merhaba, Atakent / Yeni Mahalle bölgesinden sipariş vermek istiyorum.",
        "layout_variant": "boutique-neighborhood",
        "custom_html": """
        <section class="sec" id="komsu-avantaj" aria-labelledby="at1">
          <div class="wrap">
            <h2 class="h2" id="at1">Atakent ve Yeni Mahalle Sakinlerine Özel Yakınlık Avantajı</h2>
            <p class="sub">Pet shop Atakent, Güzelyalı ve Yenimahalle aksının tam kalbinde yer alan mağazamız, hem yürüyerek uğrayabileceğiniz hem de tek mesajla evinize sipariş verebileceğiniz yerel komşu işletmenizdir.</p>
            <div class="step-boxes">
              <div class="step-box">
                <span class="step-num">1</span>
                <h3>WhatsApp'tan Ürünü Yazın</h3>
                <p>Kullandığınız mama markasını veya kum litresini <strong>0 532 354 40 55</strong> hattımıza gönderin; stoktaki seçenekleri ve fiyatları hemen paylaşalım.</p>
              </div>
              <div class="step-box">
                <span class="step-num">2</span>
                <h3>600 TL ve Üzeri Sepetinizi Oluşturun</h3>
                <p>Kuru mama, yaş mama, ödül çubuğu veya kum ekleyerek minimum 600 TL sipariş limitini kolayca tamamlayın.</p>
              </div>
              <div class="step-box">
                <span class="step-num">3</span>
                <h3>12.00 – 18.00 Arası Kapıda Ödeyin</h3>
                <p>Atakent, Yenimahalle ve diğer 10 komşu Atakum mahallesinde ödemenizi teslimat anında kapıda güvenle yapın.</p>
              </div>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="sokak-rehberi" aria-labelledby="at2">
          <div class="wrap">
            <h2 class="h2" id="at2">Yeni Mahalle 3078. Sokak Mağaza Konumu ve Çevre Mahalleler</h2>
            <div class="tbl-wrap" role="region" aria-label="Atakent ve Yeni Mahalle mesafe tablosu" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Başlangıç Noktası</th>
                    <th>Mağazaya Yakınlık</th>
                    <th>Adrese Teslimat Durumu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Yenimahalle (3078. Sokak &amp; Çevresi)</strong></td>
                    <td>Mağaza Merkezi (Yürüme Mesafesi)</td>
                    <td>Aktif (Her gün 12.00 – 18.00, Min. 600 TL)</td>
                  </tr>
                  <tr>
                    <td><strong>Atakent &amp; Güzelyalı Sahil / Bulvar</strong></td>
                    <td>Araçla ~3–6 Dakika</td>
                    <td>Aktif (Her gün 12.00 – 18.00, Min. 600 TL)</td>
                  </tr>
                  <tr>
                    <td><strong>Cumhuriyet, Mimarsinan, Denizevleri, Körfez</strong></td>
                    <td>Araçla ~5–10 Dakika</td>
                    <td>Aktif (Her gün 12.00 – 18.00, Min. 600 TL)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("Petshop Atakent bölgesine aynı gün teslimat yapıyor mu?", "Evet, Atakent mahallesi ana teslimat bölgemizdir. Her gün 12.00 – 18.00 saatleri arasında 600 TL ve üzeri siparişleriniz kapınıza teslim edilir."),
            ("Yeni Mahalle petshop mağaza adresiniz tam olarak nerede?", "Mağazamız Yeni Mahalle, 3078. Sokak No:10, 55270 Atakum / Samsun adresindedir."),
            ("Atakent pet shop siparişlerinde kapıda kart geçerli mi?", "Evet, kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz.")
        ]
    },
    {
        "slug": "en-yakin-petshop-yol-tarifi",
        "nav_short": "En Yakın Petshop & Yol Tarifi",
        "theme": {
            "primary": "#16325c",
            "primary_dark": "#0b1930",
            "accent": "#0b6b3a",
            "cta_alt": "#b84300",
            "hero_bg": "linear-gradient(135deg, #eef4ff 0%, #e0e7ff 50%, #f0fdfa 100%)",
            "surface": "#f5f8fc",
            "badge_bg": "#1e3a8a"
        },
        "hero_img": "/img/dog.webp",
        "hero_fallback": "/img/dog.jpg",
        "title": "En Yakın Petshop Yol Tarifi | Konuma Yakın Pet Shop (Atakum)",
        "description": "Bana en yakın petshop nerede diyorsanız: Yeni Mahalle 3078. Sokak No:10 Atakum / Samsun. Tek tıkla en yakın petshop yol tarifi alın veya 0 532 354 40 55'ten eve isteyin!",
        "kicker": "KONUM & NAVİGASYON REHBERİ (41.34991, 36.24213)",
        "h1": "En Yakın Petshop Nerede? Tek Dokunuşla Yol Tarifi ve Eve Sipariş",
        "lead": "Telefondan 'konumuma en yakın petshop', 'konuma en yakın petshop', 'bana en yakın pet shop' veya 'yakınlarda petshop var mı' diye aradığınızda Samsun Atakum'daki merkezi adresimizle yanınızdayız. İster navigasyonla mağazamıza gelin, ister yorulmadan siparişinizi kapınıza getirelim.",
        "wa_prefill": "Merhaba, konuma en yakın petshop aramasıyla ulaştım; konum/sipariş bilgisi alabilir miyim?",
        "layout_variant": "navigation-cockpit",
        "custom_html": """
        <section class="sec" id="navigasyon-butonlari" aria-labelledby="nv1">
          <div class="wrap">
            <h2 class="h2" id="nv1">Harita Uygulamanızı Seçin — Doğrudan Mağaza Kapısına Gelin</h2>
            <p class="sub">En yakın petshop mağazası adresimiz: <strong>Yeni Mahalle, 3078. Sokak No:10, Atakum / Samsun</strong>. Aşağıdaki butonlardan kullandığınız navigasyon uygulamasını tek dokunuşla başlatabilirsiniz:</p>
            <div class="nav-app-grid">
              <a class="nav-app-btn" href="https://maps.google.com/?q=41.34991,36.24213" target="_blank" rel="noopener noreferrer">
                <strong>Google Haritalar Yol Tarifi ↗</strong>
                <span>Android &amp; iOS için anlık trafik rotası</span>
              </a>
              <a class="nav-app-btn" href="https://yandex.com.tr/harita/?pt=36.24213,41.34991&amp;z=16&amp;l=map" target="_blank" rel="noopener noreferrer">
                <strong>Yandex Navigasyon'da Aç ↗</strong>
                <span>Sokak girişi ve dönüş yönlendirmesi</span>
              </a>
              <a class="nav-app-btn" href="https://maps.apple.com/?ll=41.34991,36.24213&amp;q=Enuygun%20Petshop" target="_blank" rel="noopener noreferrer">
                <strong>Apple Haritalar (iPhone) ↗</strong>
                <span>iOS cihazlar için doğrudan rota</span>
              </a>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="ulasim-modlari" aria-labelledby="nv2">
          <div class="wrap">
            <h2 class="h2" id="nv2">Konuma Yakın Petshop: Nasıl Ulaşılır, Yoksa Eve Mi İstenir?</h2>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Özel Araçla Ulaşım</h3>
                <p>Atatürk Bulvarı ve İsmet İnönü Bulvarı bağlantı sokaklarından Yeni Mahalle 3078. Sokak No:10 önüne kolayca yanaşıp ağır çuval mamaları aracınıza yükleyebilirsiniz.</p>
              </article>
              <article class="info-card">
                <h3>Yürüyerek &amp; Toplu Taşıma</h3>
                <p>Yakınımda pet shop arayan Yenimahalle, Atakent ve Cumhuriyet sakinleri için mağazamız düz ayak yürüyüş ve tramvay/otobüs güzergâhlarına yakın konumdadır.</p>
              </article>
              <article class="info-card">
                <h3>Hiç Çıkmadan Kapıya Teslimat</h3>
                <p>Yakında petshop arayıp evden çıkmak istemiyorsanız, Atakum içi 12 mahallede (min. 600 TL, 12.00–18.00) siparişinizi doğrudan adresinize ulaştırıyoruz.</p>
              </article>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("Bana en yakın petshop yol tarifi için hangi adresi girmeliyim?", "En yakın pet shop nerede, bana yakın petshop veya Samsun petshop yakın diye aradığınızda navigasyon uygulamanıza 'Yeni Mahalle, 3078. Sokak No:10 Atakum / Samsun' yazabilir ya da Google/Yandex/Apple Haritalar butonlarına dokunabilirsiniz."),
            ("Yakınlarda petshop ararken petsop / pershop / petshoo gibi yazımlarda da aynı mağaza mı çıkıyor?", "Evet; pet shop en yakın, en yakın petshoplar, petshop yakınlarda, yakında pet shop, yakınlarda pet shop, yakınlardaki petshop ve en yakın petsop / pershop / petshoo sorgularının tamamında resmi Enuygun Petshop mağazamız hizmetinizdedir."),
            ("Konuma yakın petshop kuryesi hangi mahallelere geliyor?", "Atakum içindeki Yenimahalle, Atakent, Güzelyalı, Mimarsinan, Denizevleri, Körfez, Kurupelit, Esenevler, Yeşilyurt, Cumhuriyet, Kamalı ve İncesu mahallelerine her gün 12.00 – 18.00 arası teslimat yapıyoruz.")
        ]
    },
    {
        "slug": "acik-petshop-pazar-hafta-sonu",
        "nav_short": "Pazar & Hafta Sonu Açık",
        "theme": {
            "primary": "#065f46",
            "primary_dark": "#022c22",
            "accent": "#0b6b3a",
            "cta_alt": "#b45309",
            "hero_bg": "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #fef9c3 100%)",
            "surface": "#f2fbf7",
            "badge_bg": "#047857"
        },
        "hero_img": "/img/hero-pets-520.webp",
        "hero_fallback": "/img/hero-pets.png",
        "title": "Pazar Günü Açık Petshop | Hafta Sonu Açık Pet Shop (12.00-18.00)",
        "description": "Pazar günü açık petshop mu arıyorsunuz? Hafta sonu petshoplar açık mı sorusuna kesin yanıt: Cumartesi ve Pazar dahil her gün 12.00 - 18.00 arası açığız! Tel: 0 532 354 40 55.",
        "kicker": "CUMARTESİ & PAZAR DAHİL 7 GÜN HİZMET",
        "h1": "Açık Petshop: Pazar Günü ve Hafta Sonu Kesintisiz Mama & Kum Siparişi",
        "lead": "Pazar sabahı mama kabının boşaldığını fark ettiğinizde 'petshop pazar günü açık mı' veya 'en yakın açık petshop' diye endişelenmeyin. Enuygun Petshop Cumartesi ve Pazar dahil haftanın 7 günü 12.00 – 18.00 saatleri arasında hizmetinizdedir.",
        "wa_prefill": "Merhaba, açık petshop sipariş hattından yazıyorum; bugün teslimat için sipariş vermek istiyorum.",
        "layout_variant": "live-hours-board",
        "custom_html": """
        <section class="sec" id="canli-saat-tablosu" aria-labelledby="op1">
          <div class="wrap">
            <div class="live-status-card" id="liveHoursBox" aria-live="polite">
              <strong>Çalışma Saatlerimiz: Pazartesi – Pazar Her Gün 12.00 / 18.00</strong>
              <span id="liveHoursDynamic">Türkiye saatine göre güncel durum kontrol ediliyor...</span>
            </div>
            <h2 class="h2" id="op1">Haftalık Çalışma ve Adrese Teslimat Çizelgesi</h2>
            <div class="tbl-wrap" role="region" aria-label="Haftalık çalışma saatleri tablosu" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Gün</th>
                    <th>Mağaza &amp; WhatsApp Durumu</th>
                    <th>Aktif Saat Aralığı</th>
                    <th>Atakum İçi Kurye</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>Pazartesi – Cuma (Hafta İçi)</strong></td><td>Açık</td><td>12.00 – 18.00</td><td>Aktif (Min. 600 TL)</td></tr>
                  <tr><td><strong>Cumartesi</strong></td><td><strong>Açık (Hafta Sonu)</strong></td><td>12.00 – 18.00</td><td>Aktif (Min. 600 TL)</td></tr>
                  <tr><td><strong>Pazar</strong></td><td><strong>Açık (Pazar Günü Hizmet)</strong></td><td>12.00 – 18.00</td><td>Aktif (Min. 600 TL)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="acil-kontrol" aria-labelledby="op2">
          <div class="wrap">
            <h2 class="h2" id="op2">Hafta Sonu Mama Bitmeden Önce 3 Hızlı İpucu</h2>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Saat 12.00 Öncesi Mesaj Bırakın</h3>
                <p>Sabah erken saatte WhatsApp hattımıza (0 532 354 40 55) ürün listenizi yazabilirsiniz; saat 12.00 itibarıyla siparişiniz öncelikli sıraya alınır.</p>
              </article>
              <article class="info-card">
                <h3>Saat 18.00 Kapanışını Kaçırmayın</h3>
                <p>Açık petshop en yakın kurye çıkışlarımız 18.00'e kadar sürer. Akşam mağduriyet yaşamamak için öğleden sonra siparişinizi tamamlamanızı öneririz.</p>
              </article>
              <article class="info-card">
                <h3>Yedek Yaş Mama &amp; Kum Ekleyin</h3>
                <p>Pazar günü açık petshop siparişinizde 600 TL sepetinizi tamamlarken birkaç adet konserve/pouch yaş mama eklemek acil durumlar için hayat kurtarır.</p>
              </article>
            </div>
          </div>
        </section>
        <script>
          (function(){
            var el = document.getElementById("liveHoursDynamic");
            if (!el) return;
            try {
              var parts = new Intl.DateTimeFormat("tr-TR", {
                timeZone: "Europe/Istanbul",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              }).formatToParts(new Date());
              var h = 0, m = 0;
              for (var i = 0; i < parts.length; i++) {
                if (parts[i].type === "hour") h = parseInt(parts[i].value, 10);
                if (parts[i].type === "minute") m = parseInt(parts[i].value, 10);
              }
              var mins = h * 60 + m;
              if (mins >= 720 && mins < 1080) {
                el.textContent = "ŞU AN AÇIĞIZ (Samsun saati " + String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0") + ") — Saat 18.00'e kadar hemen sipariş verebilirsiniz!";
              } else {
                el.textContent = "Şu an mesai saatleri dışındayız (Samsun saati " + String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0") + ") — WhatsApp'tan mesaj bırakabilirsiniz, 12.00 – 18.00 arası teslim ediyoruz.";
              }
            } catch (e) {
              el.textContent = "Her gün 12.00 – 18.00 saatleri arasında hizmet veriyoruz.";
            }
          })();
        </script>
        """,
        "faqs": [
            ("Hafta sonu petshoplar açık mı, Pazar günü teslimat var mı?", "Evet! Enuygun Petshop Cumartesi ve Pazar günleri dahil haftanın her günü 12.00 ile 18.00 saatleri arasında açıktır ve Atakum içi 12 mahalleye teslimat yapar."),
            ("Petshop açık saatler dışında WhatsApp'tan sipariş yazabilir miyim?", "Evet, 0 532 354 40 55 numaralı WhatsApp hattımıza dilediğiniz saatte sipariş notunuzu bırakabilirsiniz; ekibimiz 12.00'de mesai başladığında hemen dönüş yapar."),
            ("Pazar günü minimum sipariş limiti değişiyor mu?", "Hayır, hafta içi ve hafta sonu tüm günlerde Atakum içi minimum sipariş tutarı standart olarak 600 TL'dir.")
        ]
    },
    {
        "slug": "en-uygun-petshop-fiyatlari",
        "nav_short": "En Uygun Petshop",
        "theme": {
            "primary": "#1e3a5f",
            "primary_dark": "#0f2444",
            "accent": "#0b6b3a",
            "cta_alt": "#b84300",
            "hero_bg": "linear-gradient(135deg, #fffbeb 0%, #fef3c7 48%, #e0f2fe 100%)",
            "surface": "#fcfaf2",
            "badge_bg": "#b84300"
        },
        "hero_img": "/img/cat.webp",
        "hero_fallback": "/img/cat.jpg",
        "title": "En Uygun Petshop Samsun | Hesaplı Mama & Kum Fiyatları (Atakum)",
        "description": "En uygun petshop Samsun Atakum adresiniz: Orijinal kedi-köpek maması ve kumlarda bütçe dostu fiyatlar, kapıda ödeme! WhatsApp fiyat sor: 0 532 354 40 55 (Min. 600 TL).",
        "kicker": "AKILLI SEPET & BÜTÇE DOSTU PET ALIŞVERİŞİ",
        "h1": "En Uygun Petshop: Kaliteden Ödün Vermeden Hesaplı Mama ve Kum",
        "lead": "En uygun pet ve uygun petshop arayışında dikkat edilmesi gereken en önemli nokta, düşük fiyat uğruna bayat veya sahte ürün riskine girmemektir. Enuygun Petshop (enuygunpet) olarak Samsun Atakum'da %100 orijinal ürünleri yerel esnaf fiyatlarıyla sunuyoruz.",
        "wa_prefill": "Merhaba, en uygun petshop kampanyalı mama ve kum fiyatlarını öğrenebilir miyim?",
        "layout_variant": "smart-basket-cards",
        "custom_html": """
        <section class="sec" id="akilli-paketler" aria-labelledby="uy1">
          <div class="wrap">
            <h2 class="h2" id="uy1">600 TL Minimum Sepeti En Verimli Tamamlama Örnekleri</h2>
            <p class="sub">Ucuz petshop veya en ucuz petshop ararken tekli küçük paketler yerine aylık kombine sepet yapmak birim maliyeti ciddi oranda düşürür:</p>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Ekonomik Kedi Bakım Sepeti</h3>
                <p>Kısırlaştırılmış kuru kedi maması + 10L topaklanan bentonit kedi kumu + tüy yumağı önleyici malt macun kombinasyonuyla aylık temel ihtiyacı tek seferde karşılayın.</p>
              </article>
              <article class="info-card">
                <h3>Köpek Beslenme &amp; Ödül Sepeti</h3>
                <p>Orta/büyük boy kuru köpek maması + eğitim ödül bisküvisi + çiğneme kemiği veya hijyen pedi ile kargo ücreti ödemeden kapıda teslim alın.</p>
              </article>
              <article class="info-card">
                <h3>Karma Evcil Dost Sepeti</h3>
                <p>Evde hem kedi hem kuş veya kemirgen besleyenler için kedi maması + muhabbet kuşu yemi + dal darı + taban talaşı birleştirerek 600 TL limitini rahatça tamamlayın.</p>
              </article>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="fiyat-karsilastirma" aria-labelledby="uy2">
          <div class="wrap">
            <h2 class="h2" id="uy2">En İyi Petshop Deneyimi: Neden Enuygun Market / Pet Tercih Ediliyor?</h2>
            <div class="tbl-wrap" role="region" aria-label="Alışveriş avantaj karşılaştırması" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Kriter</th>
                    <th>Enuygun Petshop (Atakum Yerel)</th>
                    <th>Rastgele İnternet Satıcıları</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Son Kullanma Tarihi (SKT)</strong></td>
                    <td>Sipariş öncesi WhatsApp'tan kontrol edilebilir</td>
                    <td>Kutu açılana kadar belirsiz</td>
                  </tr>
                  <tr>
                    <td><strong>Teslimat Hızı (Atakum İçi)</strong></td>
                    <td>Her gün 12.00 – 18.00 arası aynı gün</td>
                    <td>2 – 5 iş günü kargo bekleme</td>
                  </tr>
                  <tr>
                    <td><strong>Ödeme Güvenliği</strong></td>
                    <td>Ürünü görerek kapıda ödeme imkânı</td>
                    <td>Önden kart ödemesi zorunlu</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("En uygun petshop Samsun fiyat listesini nasıl öğrenebilirim?", "Stok ve kampanyalarımız günlük güncellendiği için 0 532 354 40 55 numaralı WhatsApp hattımıza aradığınız markayı yazarak saniyeler içinde net fiyat alabilirsiniz."),
            ("Enuygunpet ile Enuygun Petshop aynı yer mi?", "Evet, Enuygun Petshop (enuygun pet / enuygunpet), Yeni Mahalle 3078. Sokak No:10 Atakum / Samsun adresindeki yerel pet mağazamızdır."),
            ("600 TL üzeri siparişlerde ekstra getirme ücreti var mı?", "Atakum içi 12 teslimat mahallemizde 600 TL ve üzeri siparişleriniz doğrudan adresinize teslim edilmektedir; detayları sipariş anında WhatsApp'tan teyit edebilirsiniz.")
        ]
    },
    {
        "slug": "pet-gross-buyuk-petshop-magazasi",
        "nav_short": "Pet Gross & Büyük Boy",
        "theme": {
            "primary": "#1f2937",
            "primary_dark": "#111827",
            "accent": "#0b6b3a",
            "cta_alt": "#b84300",
            "hero_bg": "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 48%, #d1fae5 100%)",
            "surface": "#f8fafc",
            "badge_bg": "#1f2937"
        },
        "hero_img": "/img/dog.webp",
        "hero_fallback": "/img/dog.jpg",
        "title": "Pet Gross & Büyük Petshop Mağazası | Çuval Mama & Çoklu Kum (Atakum)",
        "description": "Pet gross market ve büyük petshop çeşitliliği Atakum'da! 10-15 kg çuval mama, çoklu kedi kumu ve premium petshop markaları kapınıza gelsin: 0 532 354 40 55.",
        "kicker": "ÇUVAL MAMA • ÇOKLU KUM • GENİŞ ÜRÜN YELPAZESİ",
        "h1": "Pet Gross Konsepti ve Büyük Petshop Çeşitliliği: Ağır Paketleri Biz Taşıyoruz",
        "lead": "Samsun'da 'pet gross', 'gross petshop', 'büyük petshop mağazası' veya 'Cazip Pet AVM / gross plus market tarzı geniş ürünlü hayvan mağazası' arayan hayvanseverlerin en büyük sorunu 15 kiloluk çuval mamaları ve 20 litrelik kumları eve taşımaktır. Atakum içi kuryemizle tüm ağır paketleri daire kapınıza kadar çıkarıyoruz.",
        "wa_prefill": "Merhaba, büyük boy çuval mama / çoklu kum stok ve fiyat bilgisi almak istiyorum.",
        "layout_variant": "gross-warehouse",
        "custom_html": """
        <section class="sec" id="cuval-avantaj" aria-labelledby="gr1">
          <div class="wrap">
            <h2 class="h2" id="gr1">Toptan Boy (Gross) ve Premium Petshop Ürün Gruplarımız</h2>
            <p class="sub">İster çok kedili/köpekli evler için uygun pet gross boy çuvallar, ister seçici dostlar için premium pet shop serileri arayın; doğru gramajı birlikte seçelim:</p>
            <div class="tbl-wrap" role="region" aria-label="Büyük boy mama ve kum tüketim tablosu" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Ürün Tipi</th>
                    <th>Popüler Gross / Büyük Boy Seçenekleri</th>
                    <th>Kimler İçin İdeal?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Büyük Boy Kedi Maması</strong></td>
                    <td>7 kg, 10 kg ve 15 kg Orijinal Kapalı Çuval</td>
                    <td>2+ kedili evler ve bahçe/sokak beslemesi yapanlar</td>
                  </tr>
                  <tr>
                    <td><strong>Büyük Boy Köpek Maması</strong></td>
                    <td>12 kg ve 15 kg Yavru / YetişkinIrk Çuvalları</td>
                    <td>Orta ve büyük ırk köpek sahipleri</td>
                  </tr>
                  <tr>
                    <td><strong>Çoklu Kedi Kumu Paketleri</strong></td>
                    <td>10L × 2 (20L) İnce/Kalın Taneli Bentonit &amp; Pelet</td>
                    <td>Ağır kum poşetlerini marketten taşımak istemeyenler</td>
                  </tr>
                  <tr>
                    <td><strong>Premium Petshop Serileri</strong></td>
                    <td>Tahılsız, Somonlu, Kuzulu, Deri &amp; Tüy Destekli Seriler</td>
                    <td>Hassas sindirimli veya seçici kedi ve köpekler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="gross-ozellikler" aria-labelledby="gr2">
          <div class="wrap">
            <h2 class="h2" id="gr2">Pet Shop Gross Alışverişinde 3 Altın Kural</h2>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Orijinal Kapalı Çuval Güvencesi</h3>
                <p>Gross pet market alışverişinde çuvalın fabrika ağzı kapalı olması tazelik ve hijyen için şarttır; stoklarımızı güvenle inceleyebilirsiniz.</p>
              </article>
              <article class="info-card">
                <h3>Apartman Kapısına Teslim</h3>
                <p>Asansör veya merdiven derdi olmadan, 12.00–18.00 saatleri arasında Atakum içi 12 mahallede ağır siparişlerinizi kapınıza teslim ediyoruz.</p>
              </article>
              <article class="info-card">
                <h3>Tek Noktadan Pet Market</h3>
                <p>Kedi, köpek, kuş, tavşan, ginepig ve akvaryum ihtiyaçlarını tek bir hayvan mağazası siparişinde birleştirebilirsiniz.</p>
              </article>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("15 kg çuval mama ve çoklu kedi kumu eve teslim ediliyor mu?", "Evet! Atakum içi 12 mahallemizde (min. 600 TL siparişle) 10-15 kg çuval mamalar ve çoklu kedi kumları her gün 12.00 – 18.00 arası kapınıza kadar getirilir."),
            ("Premium petshop markaları ve ekonomik gross mamalar bir arada var mı?", "Evet; büyük pet shop ve en büyük petshop çeşitliliğini hedefleyen mağazamızda hem petgross / petshop gross / uygun petgross ekonomik çuval mamalar hem de seçkin premium pet shop markaları bir arada yer almaktadır."),
            ("Hangi markaların büyük boy paketleri mevcut?", "Güncel çuval stoklarımız hızlı değiştiği için 0 532 354 40 55 WhatsApp hattımızdan kedi veya köpeğinizin ırk/yaş bilgisini yazarak anlık stok öğrenebilirsiniz.")
        ]
    },
    {
        "slug": "kedi-kopek-mamasi-kedi-market",
        "nav_short": "Kedi & Köpek Maması",
        "theme": {
            "primary": "#0f4c5c",
            "primary_dark": "#082f3a",
            "accent": "#0b6b3a",
            "cta_alt": "#b84300",
            "hero_bg": "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 48%, #ffedd5 100%)",
            "surface": "#f4fbfa",
            "badge_bg": "#0f4c5c"
        },
        "hero_img": "/img/cat.webp",
        "hero_fallback": "/img/cat.jpg",
        "title": "Kedi Köpek Maması & Kedi Market | Atakum Aynı Gün Sipariş",
        "description": "Atakum kedi market ve kedi köpek maması sipariş hattı: 0 532 354 40 55. Kısırlaştırılmış kedi maması, yavru köpek maması, yaş mama ve kum çeşitleri kapınızda!",
        "kicker": "BESLENME, KUM & BAKIM UZMAN REHBERİ",
        "h1": "Kedi Köpek Maması ve Kedi Market: Doğru Beslenme Kapınızda",
        "lead": "Evcil dostunuzun yaşına, kısırlaştırma durumuna ve tüy yapısına uygun kedi köpek maması seçimi sağlıklı bir ömrün temelidir. Atakum'daki kapsamlı kedi market reyonumuzla tüm mama, kum ve bakım ürünlerini aynı gün evinize ulaştırıyoruz.",
        "wa_prefill": "Merhaba, kedi / köpek maması ve kedi market ürünleri için sipariş vermek istiyorum.",
        "layout_variant": "nutrition-matrix",
        "custom_html": """
        <section class="sec" id="mama-matrisi" aria-labelledby="km1">
          <div class="wrap">
            <h2 class="h2" id="km1">Yaş ve İhtiyaca Göre Kedi &amp; Köpek Maması Seçim Tablosu</h2>
            <div class="tbl-wrap" role="region" aria-label="Kedi ve köpek maması seçim tablosu" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Evcil Dost Grubu</th>
                    <th>Önerilen Mama İçeriği</th>
                    <th>Tamamlayıcı Kedi Market / Bakım Ürünü</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Yavru Kedi (Kitten, 0–12 Ay)</strong></td>
                    <td>Yüksek protein, DHA ve kalsiyum destekli küçük taneli mama</td>
                    <td>Yavru yaş mama (pouch), ince taneli kokusuz bentonit kum</td>
                  </tr>
                  <tr>
                    <td><strong>Kısırlaştırılmış Kedi (Sterilised)</strong></td>
                    <td>Dengeli magnezyum/fosfor oranlı, kilo kontrol destekli formül</td>
                    <td>Anti-hairball malt macun, aktif karbonlu topaklanan kum</td>
                  </tr>
                  <tr>
                    <td><strong>Yavru &amp; Yetişkin Köpek</strong></td>
                    <td>Küçük / orta / büyük ırk çene yapısına uygun kuzu, somon veya tavuklu mama</td>
                    <td>Eğitim ödülü, çiğneme kemiği, göğüs tasması, çiş pedi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="kum-secimi" aria-labelledby="km2">
          <div class="wrap">
            <h2 class="h2" id="km2">Kedi Market Reyonu: Hangi Kedi Kumunu Seçmelisiniz?</h2>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Topaklanan Doğal Bentonit</h3>
                <p>Yüksek sıvı emme gücü ve sağlam topaklanma özelliğiyle temizliği en pratik klasik kedi kumu tercihidir (ince ve kalın tane seçenekli).</p>
              </article>
              <article class="info-card">
                <h3>Doğal Çam Peleti &amp; Organik</h3>
                <p>Toz hassasiyeti olan kediler ve patilerle eve dağılmayı azaltmak isteyen sahipler için doğal ahşap/bitkisel pelet alternatifidir.</p>
              </article>
              <article class="info-card">
                <h3>Yaş Mama, Ödül &amp; Tırmalama</h3>
                <p>Su tüketimini artıran gurme konserve/çorba yaş mamalar, sıvı kedi ödülleri, tarak ve kedi otu oyuncakları tek mesajla sepetinizde.</p>
              </article>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("Kısırlaştırılmış kedim için hangi mamayı seçmeliyim?", "Kedinizin yaşına, kilosuna ve tüy dökme durumuna göre somonlu, kuzulu veya tavuklu kısırlaştırılmış (sterilised) serileri 0 532 354 40 55 WhatsApp hattımızdan birlikte belirleyebiliriz."),
            ("Kedi market siparişlerinde kum ve mamayı birlikte alabilir miyim?", "Evet, kuru mama, yaş mama ve ağır kedi kumlarını birlikte sipariş vererek 600 TL minimum sepet tutarını kolayca tamamlayabilirsiniz."),
            ("Teslimat saatleriniz nedir?", "Atakum içi 12 mahallemize her gün 12.00 – 18.00 saatleri arasında kapıda ödemeli teslimat yapıyoruz.")
        ]
    },
    {
        "slug": "kus-yemi-muhabbet-kusu-malzemeleri",
        "nav_short": "Kuş Yemi & Ekipman",
        "theme": {
            "primary": "#14532d",
            "primary_dark": "#052e16",
            "accent": "#0b6b3a",
            "cta_alt": "#a16207",
            "hero_bg": "linear-gradient(135deg, #fefce8 0%, #fef08a 42%, #dcfce7 100%)",
            "surface": "#f9fbee",
            "badge_bg": "#166534"
        },
        "hero_img": "/img/bird.webp",
        "hero_fallback": "/img/bird.jpg",
        "title": "Kuş Yemi Nerede Satılır? | Samsun Muhabbet Kuşu Malzemeleri & Kafes",
        "description": "Kuş yemi nerede satılır veya en yakın kuşçu malzemeleri nerede diyorsanız Atakum'dayız! Samsun muhabbet kuşu yemi, kafes, dal darı ve vitamin siparişi: 0 532 354 40 55.",
        "kicker": "MUHABBET KUŞU, PAPAĞAN & KANARYA BESLENME REHBERİ",
        "h1": "Kuş Yemi Nerede Satılır? Samsun Muhabbet Kuşu Yem ve Bakım Merkezi",
        "lead": "Samsun'da 'kuş yemi nerede satılır', 'en yakın kuşçu malzemeleri' veya 'Samsun muhabbet kuşu bakımı' aramalarınızda tozsuz, taze hasat yem karışımları, geniş kafesler ve vitamin takviyeleriyle Atakum Yeni Mahalle mağazamızda hizmet veriyoruz.",
        "wa_prefill": "Merhaba, kuş yemi / muhabbet kuşu kafes ve bakım malzemeleri için bilgi almak istiyorum.",
        "layout_variant": "avian-guide",
        "custom_html": """
        <section class="sec" id="kus-beslenme" aria-labelledby="bd1">
          <div class="wrap">
            <h2 class="h2" id="bd1">Kuş Türüne Göre Taze Yem ve Takviye Tablosu</h2>
            <p class="sub">Bayat veya tozlu açık yemler kanatlı dostlarda solunum ve sindirim sorunlarına yol açar. Mağazamızda kapalı paket, parlak ve taze tohum karışımları sunulmaktadır:</p>
            <div class="tbl-wrap" role="region" aria-label="Kuş yemi ve bakım tablosu" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Kanatlı Türü</th>
                    <th>Temel Yem &amp; Ödül Ürünleri</th>
                    <th>Kafes İçi Zorunlu Ekipmanlar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Samsun Muhabbet Kuşu Bakımı</strong></td>
                    <td> Sarı/ak darı ağırlıklı kapalı muhabbet yemi, kızıl dal darı, ballı/meyveli kraker</td>
                    <td>Kalamar kemiği, mineral gaga taşı, ahşap tünek, kuş kumu</td>
                  </tr>
                  <tr>
                    <td><strong>Sultan Papağanı &amp; Cennet Papağanı</strong></td>
                    <td>Çekirdekli paraket/papağan yemi, kabuklu yemiş karışımları, yumurta maması</td>
                    <td>Geniş telli papağan kafesi, kemirme oyuncakları, B-vitamini</td>
                  </tr>
                  <tr>
                    <td><strong>Kanarya &amp; İspinoz Türleri</strong></td>
                    <td>Aspur (kanarya yemi), nijer tohumu karışımı, kondisyon maması</td>
                    <td>Banyoluk, taze suluk, tüy dökümü dönemi multivitamin damla</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="kuscu-ekipman" aria-labelledby="bd2">
          <div class="wrap">
            <h2 class="h2" id="bd2">En Yakın Kuşçu Ekipmanları: Kafes Düzeninde Nelere Dikkat Edilmeli?</h2>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Doğal Ahşap Tünek Kullanımı</h3>
                <p>Plastik tünekler ayak tabanı yaralarına neden olabilir; farklı kalınlıktaki ahşap tünekler muhabbet kuşlarının ayak sağlığını korur.</p>
              </article>
              <article class="info-card">
                <h3>Tüy Dökümü Dönemi Desteği</h3>
                <p>Mevsim geçişlerinde suya eklenen B vitamini ve aminoasit damlaları kuşunuzun stresini azaltır, parlak yeni tüylerin çıkmasını hızlandırır.</p>
              </article>
              <article class="info-card">
                <h3>Diğer Ürünlerle Birleştirip Eve İsteyin</h3>
                <p>Kuş yemi, kafes, kedi/köpek maması veya kemirgen ürünleriyle 600 TL sepet oluşturarak Atakum içi adrese teslimatımızdan yararlanabilirsiniz.</p>
              </article>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("Atakum'da kapalı paket taze muhabbet kuşu yemi nerede satılır?", "Yeni Mahalle, 3078. Sokak No:10 Atakum / Samsun adresindeki Enuygun Petshop mağazamızdan alabilir veya 0 532 354 40 55 hattımızdan sipariş verebilirsiniz."),
            ("Kuş kafesi, dal darı ve vitamin çeşitleri var mı?", "Evet; kafesler, suluk/yemlikler, kalamar kemiği, gaga taşı, kuş kumu, dal darı ve multivitamin damlalar mağazamızda mevcuttur."),
            ("Eve teslimat şartlarınız nedir?", "Atakum içindeki 12 mahallemize her gün 12.00 – 18.00 arası minimum 600 TL tutarındaki siparişlerde kapıda ödemeli teslimat yapılmaktadır.")
        ]
    },
    {
        "slug": "samsun-ilkadim-petshop-ulasim",
        "nav_short": "Samsun & İlkadım Ulaşım",
        "theme": {
            "primary": "#1e3a8a",
            "primary_dark": "#172554",
            "accent": "#0b6b3a",
            "cta_alt": "#b84300",
            "hero_bg": "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f0fdfa 100%)",
            "surface": "#f5f8ff",
            "badge_bg": "#1d4ed8"
        },
        "hero_img": "/img/fish.webp",
        "hero_fallback": "/img/fish.jpg",
        "title": "Samsun Petshop & İlkadım'dan Mağaza Ulaşım / Teslimat Rehberi",
        "description": "Samsun petshop ve İlkadım petshop aramalarınız için mağaza ulaşım ve teslimat kapsamı rehberi. Mağaza: Yeni Mahalle 3078. Sokak No:10 Atakum. Tel: 0 532 354 40 55.",
        "kicker": "ŞEHİR İÇİ ULAŞIM & TESLİMAT KAPSAMI BİLGİLENDİRMESİ",
        "h1": "Samsun Petshop Rehberi: İlkadım'dan Ulaşım ve Atakum Teslimat Sınırları",
        "lead": "Samsun pet shop, Samsun pet veya İlkadım petshop araması yapan hayvanseverler için hem mağazadan gel-al ulaşım güzergâhımızı hem de adrese kurye bölgelerimizi şeffaf biçimde paylaşıyoruz.",
        "wa_prefill": "Merhaba, Samsun petshop mağaza stoğu ve ulaşım/teslimat hakkında bilgi almak istiyorum.",
        "layout_variant": "city-transit",
        "custom_html": """
        <section class="sec" id="kapsam-karsilastirma" aria-labelledby="sm1">
          <div class="wrap">
            <h2 class="h2" id="sm1">İlçelere Göre Hizmet Şeklimiz: Kurye Teslimatı vs. Mağazadan Gel-Al</h2>
            <p class="sub">Sipariş planlamanızda hiçbir sürprizle karşılaşmamanız için Samsun ilçelerine göre hizmet modelimiz aşağıda net olarak belirtilmiştir:</p>
            <div class="tbl-wrap" role="region" aria-label="Samsun ilçelerine göre hizmet tablosu" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Bölge / İlçe</th>
                    <th>Adrese Kurye Teslimatı</th>
                    <th>Mağazadan Gel-Al (12.00 – 18.00)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Atakum (Seçili 12 Mahalle)</strong><br><small>Yenimahalle, Atakent, Güzelyalı, Mimarsinan, Denizevleri, Körfez, Kurupelit, Esenevler, Yeşilyurt, Cumhuriyet, Kamalı, İncesu</small></td>
                    <td><strong>Aktif</strong> (Her gün 12.00 – 18.00, Min. 600 TL, Kapıda Ödeme)</td>
                    <td><strong>Aktif</strong> (Yeni Mahalle, 3078. Sokak No:10)</td>
                  </tr>
                  <tr>
                    <td><strong>İlkadım &amp; Canik &amp; Diğer Bölgeler</strong><br><small>Samsun İlkadım petshop / merkez aramaları</small></td>
                    <td>Kurye kapsamı dışındadır (Yalnızca Atakum içi 12 mahalleye kurye çıkmaktadır)</td>
                    <td><strong>Aktif!</strong> Gelmeden önce 0 532 354 40 55'ten ürününüzü ayırttırıp mağazamızdan teslim alabilirsiniz.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="ilkadim-rota" aria-labelledby="sm2">
          <div class="wrap">
            <h2 class="h2" id="sm2">İlkadım'dan Atakum Mağazamıza Nasıl Gelinir?</h2>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Atatürk Bulvarı (Sahil Yolu / Anayol)</h3>
                <p>İlkadım merkezden Atakum yönüne ilerleyerek Yeni Mahalle 3078. Sokak No:10 adresimize özel aracınızla doğrudan ulaşabilir, mağaza önünde kolayca yükleme yapabilirsiniz.</p>
              </article>
              <article class="info-card">
                <h3>Hafif Raylı Sistem (Tramvay) &amp; Ring</h3>
                <p>Samsun tramvay hattı ile İlkadım'dan Atakum Yeni Mahalle / Atakent aksına kısa sürede ulaşıp mağazamızı ziyaret edebilirsiniz.</p>
              </article>
              <article class="info-card">
                <h3>Gelmeden Önce WhatsApp Stok Teyidi</h3>
                <p>Petshop Samsun İlkadım güzergâhından yola çıkmadan önce aradığınız mama, kum, kemirgen veya akvaryum ürününü WhatsApp'tan sorup adınıza ayırttırabilirsiniz.</p>
              </article>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("İlkadım bölgesine eve kurye servisiniz var mı?", "Kurye ile adrese teslimat hizmetimiz yalnızca Atakum ilçesindeki 12 mahalleyi kapsamaktadır. Ancak İlkadım'dan gelen müşterilerimiz her gün 12.00 – 18.00 saatleri arasında Yeni Mahalle 3078. Sokak No:10 Atakum mağazamızdan alışveriş yapabilirler."),
            ("Mağazaya gelmeden önce ürün ayırttırabilir miyim?", "Evet, 0 532 354 40 55 numaralı WhatsApp hattımıza mesaj atarak istediğiniz ürünü ve fiyatı teyit edip mağazamızda adınıza ayırttırabilirsiniz."),
            ("Samsun pet shop mağazanız Pazar günü de açık mı?", "Evet, pet shop Samsun ve Atakum müşterilerimiz için mağazamız Pazartesi'den Pazar'a haftanın 7 günü 12.00 – 18.00 saatleri arasında açıktır.")
        ]
    },
    {
        "slug": "pet-store-atakum-samsun",
        "nav_short": "EN / DE Pet Store",
        "theme": {
            "primary": "#0f2942",
            "primary_dark": "#071626",
            "accent": "#0b6b3a",
            "cta_alt": "#b84300",
            "hero_bg": "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 48%, #ede9fe 100%)",
            "surface": "#f6f9fc",
            "badge_bg": "#0f2942"
        },
        "hero_img": "/img/hamster.webp",
        "hero_fallback": "/img/hamster.jpg",
        "title": "Pet Store Atakum Samsun | Pet Shop Near Me & Tierhandlung",
        "description": "Looking for a pet store near me open now in Atakum, Samsun? Oder suchen Sie einen Petshop in der Nähe? Same-day WhatsApp delivery (12:00-18:00): +90 532 354 40 55.",
        "kicker": "INTERNATIONAL GUIDE • ENGLISH • DEUTSCH • TÜRKÇE",
        "h1": "Pet Store in Atakum, Samsun — Open Daily (English & Deutsch Guide)",
        "lead": "Searching for a 'pet store near me', 'pet stores near me', or 'pet shop in der Nähe' while living in or visiting Samsun Atakum? Enuygun Petshop delivers authentic cat food, dog food, cat litter, bird, rodent, and aquarium supplies right to your door every day from 12:00 to 18:00.",
        "wa_prefill": "Hello / Hallo, I would like to order pet supplies in Atakum, Samsun.",
        "layout_variant": "international-trilingual",
        "custom_html": """
        <section class="sec" id="english-guide" lang="en" aria-labelledby="en1">
          <div class="wrap">
            <h2 class="h2" id="en1">🇬🇧 English Guide: Pet Store Near Me Open Now in Atakum, Samsun</h2>
            <p class="sub">Whether you are an international student near Ondokuz Mayıs University (Kurupelit / Körfez) or an expat residing along the Atakum coast, ordering from our local pet store Samsun team is simple and fast:</p>
            <div class="card-grid-3">
              <article class="info-card">
                <h3>Daily Hours &amp; Same-Day Delivery</h3>
                <p>Open 7 days a week (Monday – Sunday, <strong>12:00 – 18:00</strong>). Minimum home-delivery order in Atakum is <strong>600 TL</strong> with Cash or Card on Delivery.</p>
              </article>
              <article class="info-card">
                <h3>12 Covered Atakum Neighborhoods</h3>
                <p>We deliver to Yenimahalle, Atakent, Güzelyalı, Mimarsinan, Denizevleri, Körfez, Kurupelit, Esenevler, Yeşilyurt, Cumhuriyet, Kamalı, and İncesu.</p>
              </article>
              <article class="info-card">
                <h3>Order Easily via WhatsApp</h3>
                <p>Send a message or photo of your pet's food brand in English to <strong>+90 532 354 40 55</strong>, or visit our pet shop at <em>Yeni Mahalle, 3078. Sokak No:10, Atakum</em>.</p>
              </article>
            </div>
          </div>
        </section>
        <section class="sec alt-bg" id="deutsch-guide" lang="de" aria-labelledby="de1">
          <div class="wrap">
            <h2 class="h2" id="de1">🇩🇪 Deutsch: Petshop in der Nähe — Tierhandlung in Atakum, Samsun</h2>
            <p class="sub">Sie suchen einen <strong>Pet Shop in der Nähe</strong> oder einen zuverlässigen <strong>Petshop in der Nähe</strong> in Samsun Atakum? Wir liefern Original-Tiernahrung und Zubehör direkt an Ihre Haustür:</p>
            <div class="tbl-wrap" role="region" aria-label="Informationen auf Deutsch" tabindex="0">
              <table class="data-tbl">
                <thead>
                  <tr>
                    <th>Service-Details</th>
                    <th>Informationen (Atakum / Samsun)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Öffnungs- &amp; Lieferzeiten</strong></td>
                    <td>Täglich (auch am Sonntag) von <strong>12:00 bis 18:00 Uhr</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Mindestbestellwert (Lieferung)</strong></td>
                    <td><strong>600 TL</strong> innerhalb der 12 Stadtteile in Atakum (Zahlung an der Haustür möglich)</td>
                  </tr>
                  <tr>
                    <td><strong>Sortiment</strong></td>
                    <td>Katzenfutter, Katzenstreu, Hundefutter, Vogelfutter, Kleintier- &amp; Aquaristikbedarf</td>
                  </tr>
                  <tr>
                    <td><strong>Adresse &amp; WhatsApp</strong></td>
                    <td>Yeni Mahalle, 3078. Sokak No:10, 55270 Atakum / Samsun • Tel/WhatsApp: <strong>+90 532 354 40 55</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        """,
        "faqs": [
            ("Is this pet store near me open on Sundays in Atakum?", "Yes! Enuygun Petshop is open 7 days a week, including Saturdays and Sundays, from 12:00 to 18:00, offering both in-store shopping and Atakum home delivery (min. 600 TL)."),
            ("Wie kann ich beim Petshop in der Nähe in Atakum bestellen?", "Schreiben Sie uns einfach auf WhatsApp unter +90 532 354 40 55 (gerne auf Deutsch, Englisch oder Türkisch) oder besuchen Sie unser Geschäft in Yeni Mahalle, 3078. Sokak No:10."),
            ("Hangi yabancı dil aramaları için bu sayfa hazırlandı?", "Samsun Atakum'da yaşayan yabancı konuklar ve gurbetçilerin pet store Atakum, pet store Samsun, pet store near me open now ve petshop in der Nähe aramalarında doğru yerel bilgiye ulaşması için hazırlanmıştır.")
        ]
    }
]


def render_hub_links(current_slug=""):
    items = ['<li><a href="/">Ana Sayfa (Genel Sipariş)</a></li>']
    for p in PAGES:
        cls = ' aria-current="page" class="active-hub"' if p["slug"] == current_slug else ""
        items.append(f'<li><a href="/{p["slug"]}"{cls}>{html.escape(p["nav_short"])}</a></li>')
    return '<ul class="hub-links">' + "".join(items) + "</ul>"


def build_page_html(p):
    t = p["theme"]
    wa_url = "https://wa.me/905323544055?text=" + (
        p["wa_prefill"]
        .encode("utf-8")
        .hex()
    )
    # Proper percent encoding via urllib.parse
    import urllib.parse
    wa_url = "https://wa.me/905323544055?text=" + urllib.parse.quote(p["wa_prefill"])
    canon = f"https://www.enuygunpetshop.com/{p['slug']}"

    faq_html_items = []
    faq_schema_items = []
    for idx, (q, a) in enumerate(p["faqs"]):
        open_attr = " open" if idx == 0 else ""
        faq_html_items.append(
            f'<details class="faq-item"{open_attr}><summary>{html.escape(q)}</summary>'
            f'<div class="faq-ans">{html.escape(a)}</div></details>'
        )
        faq_schema_items.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": a}
        })

    schema_graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "PetStore",
                "@id": "https://www.enuygunpetshop.com/#store",
                "name": "Enuygun Petshop",
                "url": "https://www.enuygunpetshop.com/",
                "logo": "https://www.enuygunpetshop.com/icon-512.png",
                "image": [
                    "https://www.enuygunpetshop.com/img/og-share.jpg",
                    "https://www.enuygunpetshop.com/img/store-4x3.jpg",
                    "https://www.enuygunpetshop.com/img/store-1x1.jpg"
                ],
                "telephone": "+905323544055",
                "priceRange": "₺₺",
                "paymentAccepted": "Nakit, Kredi Kartı, Kapıda Ödeme",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Yeni Mahalle, 3078. Sokak No:10",
                    "addressLocality": "Atakum",
                    "addressRegion": "Samsun",
                    "postalCode": "55270",
                    "addressCountry": "TR"
                },
                "geo": {"@type": "GeoCoordinates", "latitude": 41.34991, "longitude": 36.24213},
                "openingHoursSpecification": [{
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens": "12:00",
                    "closes": "18:00"
                }]
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{canon}#breadcrumb",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Enuygun Petshop Ana Sayfa", "item": "https://www.enuygunpetshop.com/"},
                    {"@type": "ListItem", "position": 2, "name": p["nav_short"], "item": canon}
                ]
            },
            {
                "@type": "WebPage",
                "@id": f"{canon}#webpage",
                "url": canon,
                "name": p["title"],
                "description": p["description"],
                "inLanguage": ["en", "de", "tr"] if p["slug"] == "pet-store-atakum-samsun" else "tr-TR",
                "isPartOf": {"@id": "https://www.enuygunpetshop.com/#website"},
                "about": {"@id": "https://www.enuygunpetshop.com/#store"},
                "breadcrumb": {"@id": f"{canon}#breadcrumb"},
                "dateModified": "2026-11-15"
            },
            {
                "@type": "FAQPage",
                "@id": f"{canon}#faq",
                "mainEntity": faq_schema_items
            }
        ]
    }

    is_square_img = p["hero_img"] != "/img/hero-pets-520.webp"
    img_w = "240" if is_square_img else "880"
    img_h = "240" if is_square_img else "__HERO_H880__"
    img_cls = "hero-thumb-round" if is_square_img else "hero-wide-art"

    return f"""<!DOCTYPE html>
<html lang="tr">
<head>
  <link rel="preconnect" href="https://www.googletagmanager.com" />
  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-5CT6KRB2"></script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=GTM-N9S2H3K3"></script>
  <script async src="https://www.googletagmanager.com/gtm.js?id=AW-17125223643"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({{'gtm.start': new Date().getTime(), event: 'gtm.js'}});
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'GTM-N9S2H3K3');
    gtag('config', 'AW-17125223643');
  </script>
  <meta name="yandex-verification" content="9518e7484418cca4" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>{html.escape(p["title"])}</title>
  <meta name="description" content="{html.escape(p["description"])}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="{canon}" />
  <link rel="alternate" hreflang="tr-TR" href="{canon}" />
  {('<link rel="alternate" hreflang="en" href="' + canon + '" />\n  <link rel="alternate" hreflang="de" href="' + canon + '" />') if p["slug"] == "pet-store-atakum-samsun" else ''}
  <link rel="alternate" hreflang="x-default" href="{canon}" />
  <meta name="geo.region" content="TR-55" />
  <meta name="geo.placename" content="Atakum, Samsun" />
  <meta name="geo.position" content="41.34991;36.24213" />
  <meta name="ICBM" content="41.34991, 36.24213" />
  <link rel="icon" href="/favicon.ico" sizes="48x48" />
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta property="og:title" content="{html.escape(p["title"])}" />
  <meta property="og:description" content="{html.escape(p["description"])}" />
  <meta property="og:url" content="{canon}" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="tr_TR" />
  <meta property="og:site_name" content="Enuygun Petshop" />
  <meta property="og:image" content="https://www.enuygunpetshop.com/img/og-share.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{html.escape(p["title"])}" />
  <meta name="twitter:description" content="{html.escape(p["description"])}" />
  <meta name="twitter:image" content="https://www.enuygunpetshop.com/img/og-share.jpg" />
  <meta name="theme-color" content="{t["primary"]}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap" media="print" onload="this.media='all'" />
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap" /></noscript>
  <style>
    :root {{
      --pri: {t["primary"]};
      --pri-dark: {t["primary_dark"]};
      --wa: {t["accent"]};
      --cta2: {t["cta_alt"]};
      --surf: {t["surface"]};
      --badge: {t["badge_bg"]};
      --hdr-off: 5.25rem;
    }}
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    html {{ -webkit-text-size-adjust: 100%; text-size-adjust: 100%; scroll-padding-top: var(--hdr-off); }}
    @media (prefers-reduced-motion: no-preference) {{ html {{ scroll-behavior: smooth; }} }}
    body {{
      font-family: Montserrat, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      color: #16325c;
      background: #fff;
      line-height: 1.55;
      overflow-x: clip;
    }}
    body.menu-open {{ overflow: hidden; }}
    a {{ color: inherit; text-decoration: none; }}
    img {{ max-width: 100%; height: auto; display: block; }}
    button {{ font: inherit; }}
    :focus-visible {{ outline: 3px solid var(--wa); outline-offset: 3px; border-radius: 6px; }}
    .skip-link {{
      position: absolute; left: -9999px; top: 0.5rem; z-index: 200;
      background: var(--pri-dark); color: #fff; font-weight: 800; padding: 0.75rem 1.25rem; border-radius: 0.5rem;
    }}
    .skip-link:focus {{ left: max(1rem, env(safe-area-inset-left)); }}
    .wrap {{
      width: 100%; max-width: 72rem; margin: 0 auto;
      padding-left: max(1rem, env(safe-area-inset-left));
      padding-right: max(1rem, env(safe-area-inset-right));
    }}
    .wa-top {{
      background: var(--pri-dark); color: #fff; font-size: 0.8125rem; padding: 0.5rem 0;
    }}
    .wa-top-inner {{
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.5rem 0.75rem;
    }}
    .wa-pill {{
      background: #fff; color: var(--pri-dark); font-weight: 800; min-height: 2.75rem;
      padding: 0.5rem 0.95rem; border-radius: 999px; display: inline-flex; align-items: center; overflow-wrap: anywhere;
    }}
    .wa-meta {{ font-weight: 700; display: flex; flex-wrap: wrap; gap: 0.4rem 0.5rem; align-items: center; }}
    .wa-min {{ background: #fbbf24; color: #111827; font-weight: 900; padding: 0.25rem 0.65rem; border-radius: 999px; }}

    header.top {{ position: sticky; top: 0; z-index: 80; background: #fff; border-bottom: 1px solid #e2e8f0; }}
    .top-inner {{ display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; min-height: 4.25rem; padding-top: 0.3rem; padding-bottom: 0.3rem; }}
    .brand {{ display: inline-flex; align-items: center; gap: 0.6rem; min-height: 2.75rem; }}
    .paw {{ width: 2.4rem; height: 2.4rem; border-radius: 50%; background: #e8650a; display: grid; place-items: center; flex-shrink: 0; }}
    .paw svg {{ width: 1.3rem; height: 1.3rem; }}
    .brand-txt {{ display: flex; flex-direction: column; line-height: 1.05; }}
    .brand-txt b {{ font-size: 0.9375rem; font-weight: 800; letter-spacing: 0.06em; color: #16325c; }}
    .brand-txt i {{ font-style: normal; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; color: #b84300; }}
    nav.desk {{ display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 0.35rem 0.5rem; flex: 1; }}
    nav.desk a {{ display: inline-flex; align-items: center; min-height: 2.75rem; padding: 0.35rem 0.6rem; font-size: 0.75rem; font-weight: 700; border-radius: 0.5rem; }}
    nav.desk a:hover {{ background: var(--surf); color: var(--pri); }}
    .burger {{
      display: none; align-items: center; justify-content: center; min-width: 2.875rem; min-height: 2.875rem;
      background: #f4f7fa; border: 1px solid #dce5ef; border-radius: 0.625rem; color: #16325c; cursor: pointer;
    }}

    .breadcrumb {{ background: var(--surf); border-bottom: 1px solid #e5edf5; padding: 0.6rem 0; font-size: 0.8125rem; font-weight: 700; }}
    .breadcrumb ol {{ list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }}
    .breadcrumb a {{ color: var(--pri); text-decoration: underline; text-underline-offset: 2px; }}

    .sub-hero {{ background: {t["hero_bg"]}; padding: 2.25rem 0 2rem; border-bottom: 1px solid #e5edf5; }}
    .sub-hero-grid {{ display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1.5rem; align-items: center; }}
    .kicker {{
      display: inline-block; background: var(--badge); color: #fff; font-size: 0.75rem; font-weight: 800;
      letter-spacing: 0.06em; padding: 0.35rem 0.75rem; border-radius: 999px; margin-bottom: 0.85rem;
    }}
    .sub-hero h1 {{ font-size: clamp(1.6rem, 3.6vw, 2.55rem); font-weight: 900; line-height: 1.15; color: var(--pri-dark); overflow-wrap: anywhere; }}
    .sub-hero .lead {{ margin-top: 0.875rem; font-size: 0.95rem; font-weight: 600; color: #2b3e54; line-height: 1.65; }}
    .rule-pills {{ display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.15rem; list-style: none; }}
    .rule-pills li {{ background: #fff; border: 1px solid #d7e3ef; border-radius: 0.625rem; padding: 0.45rem 0.75rem; font-size: 0.75rem; font-weight: 800; color: var(--pri-dark); }}
    .ctas {{ display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.35rem; }}
    .btn-wa, .btn-call {{
      display: inline-flex; align-items: center; justify-content: center; min-height: 3rem;
      padding: 0.85rem 1.25rem; border-radius: 0.75rem; color: #fff; font-size: 0.875rem; font-weight: 800;
      text-align: center; overflow-wrap: anywhere;
    }}
    .btn-wa {{ background: var(--wa); }}
    .btn-call {{ background: var(--cta2); }}
    .hero-media {{ display: flex; justify-content: center; align-items: center; }}
    .hero-thumb-round {{ width: min(14.5rem, 68vw); height: auto; aspect-ratio: 1 / 1; border-radius: 50%; object-fit: cover; border: 6px solid #fff; box-shadow: 0 12px 28px rgba(15,36,68,0.14); }}
    .hero-wide-art {{ width: min(28rem, 100%); aspect-ratio: 880 / __HERO_H880__; object-fit: contain; }}

    section[id] {{ scroll-margin-top: var(--hdr-off); }}
    .sec {{ padding: 2.4rem 0; }}
    .alt-bg {{ background: var(--surf); border-top: 1px solid #e6eef6; border-bottom: 1px solid #e6eef6; }}
    .h2 {{ font-size: clamp(1.25rem, 2.4vw, 1.6rem); font-weight: 800; color: var(--pri-dark); margin-bottom: 0.6rem; overflow-wrap: anywhere; }}
    .sub {{ font-size: 0.92rem; font-weight: 600; color: #33485e; margin-bottom: 1.25rem; max-width: 54rem; line-height: 1.6; }}

    .tbl-wrap {{ width: 100%; overflow-x: auto; border: 1px solid #d8e3ee; border-radius: 0.875rem; background: #fff; }}
    .data-tbl {{ width: 100%; border-collapse: collapse; min-width: 32rem; font-size: 0.875rem; }}
    .data-tbl th, .data-tbl td {{ padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid #e6eef6; vertical-align: top; }}
    .data-tbl th {{ background: var(--pri); color: #fff; font-weight: 800; font-size: 0.8125rem; }}
    .data-tbl tr:last-child td {{ border-bottom: 0; }}

    .card-grid-3 {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: 1rem; margin-top: 1rem; }}
    .info-card {{ background: #fff; border: 1px solid #dce6f0; border-radius: 0.95rem; padding: 1.25rem; box-shadow: 0 4px 14px rgba(15,36,68,0.05); }}
    .info-card h3 {{ font-size: 1rem; font-weight: 800; color: var(--pri-dark); margin-bottom: 0.5rem; }}
    .info-card p {{ font-size: 0.875rem; font-weight: 600; color: #33485e; line-height: 1.6; }}

    .step-boxes {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: 1rem; }}
    .step-box {{ background: #fff; border: 1px solid #fed7aa; border-radius: 1rem; padding: 1.25rem; }}
    .step-num {{ display: inline-grid; place-items: center; width: 2.1rem; height: 2.1rem; border-radius: 50%; background: var(--pri); color: #fff; font-weight: 900; margin-bottom: 0.6rem; }}
    .step-box h3 {{ font-size: 1rem; font-weight: 800; margin-bottom: 0.45rem; }}
    .step-box p {{ font-size: 0.875rem; font-weight: 600; color: #3b4d61; }}

    .nav-app-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15.5rem), 1fr)); gap: 0.875rem; }}
    .nav-app-btn {{
      display: flex; flex-direction: column; justify-content: center; gap: 0.3rem; min-height: 4.5rem;
      padding: 1rem 1.15rem; border-radius: 0.875rem; background: var(--pri); color: #fff;
    }}
    .nav-app-btn strong {{ font-size: 0.95rem; font-weight: 800; }}
    .nav-app-btn span {{ font-size: 0.8rem; color: #dbeafe; font-weight: 600; }}

    .live-status-card {{
      background: #fff; border: 2px solid var(--wa); border-radius: 0.95rem; padding: 1.1rem 1.25rem;
      margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.35rem;
    }}
    .live-status-card strong {{ font-size: 0.95rem; color: var(--pri-dark); }}
    .live-status-card span {{ font-size: 0.875rem; font-weight: 700; color: var(--wa); }}

    .zones-strip {{ background: var(--pri); color: #fff; padding: 2rem 0; }}
    .zones-strip h2 {{ font-size: clamp(1.2rem, 2.2vw, 1.5rem); font-weight: 800; margin-bottom: 0.5rem; }}
    .zones-strip p {{ font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem; color: #e2e8f0; }}
    .zones-ul {{ list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 8.25rem), 1fr)); gap: 0.5rem; }}
    .zones-ul li {{ background: #fff; color: #16325c; font-size: 0.75rem; font-weight: 800; text-align: center; padding: 0.6rem 0.5rem; border-radius: 0.55rem; overflow-wrap: anywhere; }}

    .faq-list {{ display: grid; gap: 0.75rem; margin-top: 1rem; }}
    .faq-item {{ border: 1px solid #dbe5ef; border-radius: 0.875rem; background: #f8fbfd; overflow: hidden; }}
    .faq-item summary {{
      list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
      min-height: 3.125rem; padding: 0.85rem 1rem; font-size: 0.9375rem; font-weight: 800; cursor: pointer; overflow-wrap: anywhere;
    }}
    .faq-item summary::-webkit-details-marker {{ display: none; }}
    .faq-item summary::after {{ content: "+"; font-size: 1.25rem; font-weight: 800; color: var(--pri); flex-shrink: 0; }}
    .faq-item[open] summary::after {{ content: "−"; }}
    .faq-item .faq-ans {{ padding: 0 1rem 1rem; font-size: 0.875rem; font-weight: 600; color: #2f435a; line-height: 1.65; }}

    .contact-grid {{ display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 1.25rem; align-items: start; margin-top: 1rem; }}
    .c-rows {{ display: grid; gap: 0.65rem; }}
    .c-row {{ background: #f4f8fb; border: 1px solid #e2ecf5; border-radius: 0.75rem; padding: 0.85rem 1rem; font-size: 0.9rem; font-weight: 600; overflow-wrap: anywhere; }}
    a.c-row {{ display: flex; flex-wrap: wrap; align-items: center; min-height: 3rem; gap: 0.35rem; text-decoration: underline; }}
    .map-box {{ width: 100%; min-height: 16.5rem; aspect-ratio: 16 / 10; border-radius: 0.875rem; overflow: hidden; border: 1px solid #d7e3ec; background: #e2ecf2; }}
    .map-box iframe {{ width: 100%; height: 100%; min-height: 16.5rem; border: 0; display: block; }}
    .btn-map-ext {{
      display: inline-flex; align-items: center; justify-content: center; width: 100%; min-height: 2.875rem;
      margin-top: 0.6rem; padding: 0.65rem 1rem; border-radius: 0.625rem; background: #eef5fa; border: 1px solid #cbd9e6; font-size: 0.8125rem; font-weight: 800;
    }}

    .hub-sec {{ background: #0f2444; color: #fff; padding: 2rem 0 1.25rem; }}
    .hub-sec h2 {{ font-size: 1rem; font-weight: 800; margin-bottom: 0.85rem; letter-spacing: 0.04em; color: #fbbf24; }}
    .hub-links {{ list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.14); }}
    .hub-links a {{
      display: inline-flex; align-items: center; min-height: 2.75rem; padding: 0.4rem 0.8rem;
      border-radius: 0.5rem; background: rgba(255,255,255,0.09); color: #f1f5f9; font-size: 0.78rem; font-weight: 700;
    }}
    .hub-links a.active-hub {{ background: #fff; color: #0f2444; font-weight: 800; }}
    footer.site {{ background: #0f2444; color: #dbe7f3; padding-top: 1rem; padding-bottom: max(1.5rem, env(safe-area-inset-bottom)); font-size: 0.8125rem; }}
    .foot-inner {{ display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.75rem; align-items: center; }}

    .mob-bar {{ display: none; }}
    .drawer {{ position: fixed; top: 0; right: 0; bottom: 0; left: 0; inset: 0; z-index: 120; background: rgba(15,36,68,0.55); }}
    .drawer[hidden] {{ display: none; }}
    .drawer-panel {{
      position: absolute; top: 0; right: 0; width: min(20rem, 88vw); height: 100vh; height: 100dvh; overflow-y: auto;
      background: #fff; padding: max(1rem, env(safe-area-inset-top)) max(1.25rem, env(safe-area-inset-right)) max(1.5rem, env(safe-area-inset-bottom)) 1.25rem;
      display: flex; flex-direction: column; gap: 0.5rem;
    }}
    .drawer-top {{ display: flex; align-items: center; justify-content: space-between; padding-bottom: 0.75rem; border-bottom: 1px solid #e6edf5; }}
    .drawer-close {{ min-width: 2.875rem; min-height: 2.875rem; border-radius: 0.625rem; border: 1px solid #dce5ef; background: #f4f7fa; cursor: pointer; display: inline-grid; place-items: center; }}
    .drawer-panel nav {{ display: flex; flex-direction: column; gap: 0.45rem; }}
    .drawer-panel nav a {{ display: flex; align-items: center; min-height: 2.875rem; padding: 0.55rem 0.75rem; border-radius: 0.6rem; background: #f8fafc; font-weight: 700; font-size: 0.9rem; }}
    .drawer-panel nav a.d-wa {{ background: var(--wa); color: #fff; justify-content: center; }}
    .drawer-panel nav a.d-call {{ background: var(--cta2); color: #fff; justify-content: center; }}

    @media (max-width: 980px) {{
      nav.desk {{ display: none; }}
      .burger {{ display: inline-flex; }}
      .sub-hero-grid, .contact-grid {{ grid-template-columns: 1fr; }}
      .data-tbl {{ min-width: 26rem; }}
    }}
    @media (max-width: 768px) and (min-height: 481px) {{
      footer.site {{
        padding-bottom: calc(7rem + env(safe-area-inset-bottom));
      }}
      .mob-bar {{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 75;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-top: 1px solid #dbe5ef;
        box-shadow: 0 -4px 20px rgba(15, 36, 68, 0.1);
        padding: 0.45rem max(0.6rem, env(safe-area-inset-right)) max(0.45rem, env(safe-area-inset-bottom)) max(0.6rem, env(safe-area-inset-left));
      }}
      body.menu-open .mob-bar {{ display: none; }}
      .mob-badge {{
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.35rem;
        width: 100%;
        padding: 0.25rem 0.5rem;
        border-radius: 999px;
        background: #fef2f2;
        color: #991b1b;
        border: 1px solid #fecaca;
        font-size: 0.6875rem;
        font-weight: 800;
        line-height: 1.25;
        letter-spacing: -0.01em;
        box-shadow: 0 1px 3px rgba(185, 28, 28, 0.1);
        animation: pulse-badge 2s ease-in-out infinite;
      }}
      @keyframes pulse-badge {{
        0%, 100% {{
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.45);
        }}
        50% {{
          transform: scale(1.02);
          box-shadow: 0 0 0 5px rgba(220, 38, 38, 0);
        }}
      }}
      @media (prefers-reduced-motion: reduce) {{
        .mob-badge {{ animation: none; }}
      }}
      .mob-badge-ic {{ font-size: 0.8125rem; flex-shrink: 0; }}
      .mob-badge-txt {{ overflow-wrap: anywhere; }}
      .mob-btn-grid {{
        display: grid;
        grid-template-columns: 1fr 1.3fr 1fr;
        gap: 0.35rem;
        width: 100%;
      }}
      .mob-btn {{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.75rem;
        padding: 0.4rem 0.25rem;
        border-radius: 0.55rem;
        color: #fff !important;
        font-size: 0.75rem;
        font-weight: 800;
        text-align: center;
        line-height: 1.15;
        gap: 0.25rem;
        text-decoration: none;
        transition: transform 0.15s ease, filter 0.15s ease;
      }}
      .mob-btn:active {{ transform: scale(0.97); }}
      .mob-btn-ic {{ font-size: 0.875rem; line-height: 1; }}
      .mob-btn-txt {{ white-space: nowrap; }}
      .mob-btn-call {{ background: var(--cta2); }}
      .mob-btn-call:hover, .mob-btn-call:active {{ filter: brightness(0.9); }}
      .mob-btn-wa {{ background: var(--wa); }}
      .mob-btn-wa:hover, .mob-btn-wa:active {{ filter: brightness(0.9); }}
      .mob-btn-map {{ background: var(--pri); }}
      .mob-btn-map:hover, .mob-btn-map:active {{ filter: brightness(0.9); }}
      @media (max-width: 360px) {{
        .mob-btn {{
          font-size: 0.6875rem;
          padding: 0.35rem 0.15rem;
          gap: 0.15rem;
        }}
        .mob-btn-ic {{ font-size: 0.75rem; }}
      }}
    }}
    @media (max-width: 640px) {{
      .ctas {{ flex-direction: column; }}
      .btn-wa, .btn-call, .wa-pill {{ width: 100%; justify-content: center; text-align: center; }}
    }}
  </style>
  <script type="application/ld+json">
{json.dumps(schema_graph, ensure_ascii=False, indent=2)}
  </script>
</head>
<body>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5CT6KRB2" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N9S2H3K3" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <a class="skip-link" href="#ana-icerik">İçeriğe atla</a>

  <div class="wa-top" role="region" aria-label="Sipariş ve teslimat özeti">
    <div class="wrap wa-top-inner">
      <a class="wa-pill" href="{wa_url}" target="_blank" rel="noopener noreferrer">WhatsApp Sipariş Hattı: 0 532 354 40 55</a>
      <div class="wa-meta">
        <span>Her Gün 12.00 / 18.00 Arası</span>
        <span aria-hidden="true">•</span>
        <span>Atakum İçi</span>
        <span class="wa-min">Min. Sipariş: 600 TL</span>
      </div>
    </div>
  </div>

  <header class="top">
    <div class="wrap top-inner">
      <a class="brand" href="/" aria-label="Enuygun Petshop Ana Sayfa">
        <span class="paw" aria-hidden="true"><svg viewBox="0 0 48 48" fill="#fff"><path d="M16.2 18.4c2.4 0 4.3-2.2 4.3-5s-1.9-5-4.3-5-4.3 2.2-4.3 5 1.9 5 4.3 5zm15.6 0c2.4 0 4.3-2.2 4.3-5s-1.9-5-4.3-5-4.3 2.2-4.3 5 1.9 5 4.3 5zM10 29.2c2.6 0 4.7-2.4 4.7-5.3S12.6 18.6 10 18.6s-4.7 2.4-4.7 5.3 2.1 5.3 4.7 5.3zm28 0c2.6 0 4.7-2.4 4.7-5.3s-2.1-5.3-4.7-5.3-4.7 2.4-4.7 5.3 2.1 5.3 4.7 5.3zM24 24.2c-5.8 0-10.4 4.4-10.4 8.4 0 4.6 4.2 9.2 10.4 9.2s10.4-4.6 10.4-9.2c0-4-4.6-8.4-10.4-8.4z"/></svg></span>
        <span class="brand-txt"><b>ENUYGUN</b> <i>PETSHOP</i></span>
      </a>
      <nav class="desk" aria-label="Ana menü">
        <a href="/">ANA SAYFA</a>
        <a href="#mahalleler">12 MAHALLE</a>
        <a href="#sss">SIK SORULANLAR</a>
        <a href="#iletisim">MAĞAZA &amp; HARİTA</a>
        <a href="{wa_url}" target="_blank" rel="noopener noreferrer">WHATSAPP SİPARİŞ</a>
      </nav>
      <button type="button" class="burger" id="menuBtn" aria-label="Menüyü aç" aria-expanded="false" aria-controls="drawer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </header>

  <nav class="breadcrumb" aria-label="Sayfa konumu">
    <div class="wrap">
      <ol>
        <li><a href="/">Enuygun Petshop</a></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">{html.escape(p["nav_short"])}</li>
      </ol>
    </div>
  </nav>

  <main id="ana-icerik" tabindex="-1">
    <section class="sub-hero" aria-labelledby="page-h1">
      <div class="wrap sub-hero-grid">
        <div>
          <span class="kicker">{html.escape(p["kicker"])}</span>
          <h1 id="page-h1">{html.escape(p["h1"])}</h1>
          <p class="lead">{html.escape(p["lead"])}</p>
          <ul class="rule-pills" aria-label="Temel sipariş şartları">
            <li>Her Gün 12.00 – 18.00</li>
            <li>Atakum İçi 12 Mahalle</li>
            <li>Min. Sipariş 600 TL</li>
            <li>Kapıda Ödeme</li>
          </ul>
          <div class="ctas">
            <a class="btn-wa" href="{wa_url}" target="_blank" rel="noopener noreferrer">WHATSAPP SİPARİŞ: 0 532 354 40 55</a>
            <a class="btn-call" href="tel:+905323544055">HEMEN ARA: 0 532 354 40 55</a>
          </div>
        </div>
        <div class="hero-media">
          <picture>
            <source type="image/webp" srcset="{p["hero_img"]}" />
            <img class="{img_cls}" src="{p["hero_fallback"]}" alt="{html.escape(p["h1"])}" width="{img_w}" height="{img_h}" fetchpriority="high" decoding="async" />
          </picture>
        </div>
      </div>
    </section>

{p["custom_html"]}

    <section class="zones-strip" id="mahalleler" aria-labelledby="z-title">
      <div class="wrap">
        <h2 id="z-title">Atakum İçi Adrese Teslimat Yapılan 12 Mahalle</h2>
        <p>Her gün <strong>12.00 / 18.00</strong> arası • Minimum sipariş <strong>600 TL</strong> • WhatsApp Sipariş Hattı: <strong>0 532 354 40 55</strong></p>
        <ul class="zones-ul">
          <li>YENİMAHALLE</li><li>ATAKENT</li><li>GÜZELYALI</li><li>MİMARSİNAN</li>
          <li>DENİZEVLERİ</li><li>KÖRFEZ</li><li>KURUPELİT</li><li>ESENEVLER</li>
          <li>YEŞİLYURT</li><li>CUMHURİYET</li><li>KAMALI</li><li>İNCESU</li>
        </ul>
      </div>
    </section>

    <section class="sec" id="sss" aria-labelledby="f-title">
      <div class="wrap">
        <h2 class="h2" id="f-title">Sıkça Sorulan Sorular</h2>
        <div class="faq-list">
          {"".join(faq_html_items)}
        </div>
      </div>
    </section>

    <section class="sec alt-bg" id="iletisim" aria-labelledby="c-title">
      <div class="wrap">
        <h2 class="h2" id="c-title">Mağaza Adresi, WhatsApp ve Harita Konumu</h2>
        <div class="contact-grid">
          <div class="c-rows">
            <div class="c-row"><strong>Mağaza Adresi:</strong> Yeni Mahalle, 3078. Sokak No:10, 55270 Atakum / Samsun</div>
            <a class="c-row" href="{wa_url}" target="_blank" rel="noopener noreferrer"><strong>WhatsApp Sipariş Hattı:</strong> <span>0 532 354 40 55</span></a>
            <a class="c-row" href="tel:+905323544055"><strong>Telefonla Ara:</strong> <span>0 532 354 40 55</span></a>
            <div class="c-row"><strong>Sipariş Saatleri:</strong> Her Gün 12.00 / 18.00 Arası (Atakum İçi • Min. 600 TL)</div>
          </div>
          <div>
            <div class="map-box">
              <iframe title="Atakum Enuygun Petshop Mağaza Konumu" width="600" height="450" style="border:0;" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.100796386986!2d36.242179500000006!3d41.3501628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x408879084590d33b%3A0x47f16b6777453014!2sAtakum%20Enuygun%20Petshop!5e0!3m2!1str!2str!4v1794833511213!5m2!1str!2str" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
            </div>
            <a class="btn-map-ext" href="https://maps.google.com/?q=41.34991,36.24213" target="_blank" rel="noopener noreferrer">Google Haritalar'da Aç / Yol Tarifi Al ↗</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <aside class="hub-sec" aria-label="Hizmet ve rehber sayfalarımız">
    <div class="wrap">
      <h2>REHBERLER &amp; HİZMET SAYFALARIMIZ</h2>
      {render_hub_links(p["slug"])}
    </div>
  </aside>

  <footer class="site">
    <div class="wrap foot-inner">
      <strong>ENUYGUN PETSHOP — Yeni Mahalle, 3078. Sokak No:10 Atakum / Samsun</strong>
      <span>WhatsApp &amp; Tel: 0 532 354 40 55 • Her Gün 12.00 – 18.00 • Min. 600 TL</span>
    </div>
  </footer>

  <div class="mob-bar" role="region" aria-label="Mobil hızlı sipariş ve iletişim menüsü">
    <div class="mob-badge" role="note" aria-label="Evcil hayvan satışı yapılmamaktadır">
      <span class="mob-badge-ic" aria-hidden="true">🐾</span>
      <span class="mob-badge-txt">Herhangi bir evcil hayvan almak ya da satmak için bizi aramayın.</span>
    </div>
    <div class="mob-btn-grid">
      <a class="mob-btn mob-btn-call" href="tel:+905323544055">
        <span class="mob-btn-ic" aria-hidden="true">📞</span>
        <span class="mob-btn-txt">Hemen Ara</span>
      </a>
      <a class="mob-btn mob-btn-wa" href="{wa_url}" target="_blank" rel="noopener noreferrer">
        <span class="mob-btn-ic" aria-hidden="true">💬</span>
        <span class="mob-btn-txt">WhatsApp Sipariş</span>
      </a>
      <a class="mob-btn mob-btn-map" href="https://maps.google.com/?q=41.34991,36.24213" target="_blank" rel="noopener noreferrer">
        <span class="mob-btn-ic" aria-hidden="true">📍</span>
        <span class="mob-btn-txt">Yol Tarifi</span>
      </a>
    </div>
  </div>

  <div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawerTitle" hidden>
    <div class="drawer-panel">
      <div class="drawer-top">
        <strong id="drawerTitle">MENÜ &amp; REHBERLER</strong>
        <button type="button" class="drawer-close" id="drawerCloseBtn" aria-label="Menüyü kapat">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <nav aria-label="Mobil menü">
        <a href="/">Ana Sayfa</a>
        {"".join(f'<a href="/{x["slug"]}">{html.escape(x["nav_short"])}</a>' for x in PAGES)}
        <a class="d-wa" href="{wa_url}" target="_blank" rel="noopener noreferrer">WHATSAPP: 0 532 354 40 55</a>
        <a class="d-call" href="tel:+905323544055">HEMEN ARA: 0 532 354 40 55</a>
      </nav>
    </div>
  </div>

  <script>
    (function () {{
      var menuBtn = document.getElementById("menuBtn");
      var drawer = document.getElementById("drawer");
      var closeBtn = document.getElementById("drawerCloseBtn");
      function openDrawer() {{
        if (!drawer || !menuBtn) return;
        drawer.hidden = false;
        document.body.classList.add("menu-open");
        menuBtn.setAttribute("aria-expanded", "true");
        if (closeBtn) closeBtn.focus();
      }}
      function closeDrawer(restore) {{
        if (!drawer || !menuBtn || drawer.hidden) return;
        drawer.hidden = true;
        document.body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
        if (restore) menuBtn.focus();
      }}
      if (menuBtn && drawer) {{
        menuBtn.addEventListener("click", openDrawer);
        if (closeBtn) closeBtn.addEventListener("click", function () {{ closeDrawer(true); }});
        drawer.addEventListener("click", function (e) {{
          if (e.target === drawer) closeDrawer(true);
          else if (e.target.closest && e.target.closest("a")) closeDrawer(false);
        }});
        document.addEventListener("keydown", function (e) {{
          if (drawer.hidden) return;
          if (e.key === "Escape") {{ e.preventDefault(); closeDrawer(true); }}
        }});
      }}
    }})();
  </script>
</body>
</html>
"""


for p in PAGES:
    out_file = os.path.join(OUT_DIR, f"{p['slug']}.html")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(build_page_html(p))

# Inject clean internal SEO hub into index.html right before <footer class="site">
idx_path = os.path.join(OUT_DIR, "index.html")
idx_html = open(idx_path, "r", encoding="utf-8").read()
hub_css = """
    .hub-home { background: #132c50; color: #fff; padding: 1.75rem 0 0.5rem; }
    .hub-home h2 { font-size: 0.95rem; font-weight: 800; color: #fbbf24; margin-bottom: 0.75rem; letter-spacing: 0.04em; }
    .hub-links { list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .hub-links a { display: inline-flex; align-items: center; min-height: 2.75rem; padding: 0.4rem 0.8rem; border-radius: 0.5rem; background: rgba(255,255,255,0.1); color: #f1f5f9; font-size: 0.78rem; font-weight: 700; }
"""
if ".hub-home" not in idx_html:
    idx_html = idx_html.replace("</style>", hub_css + "  </style>", 1)

hub_block = f"""  <aside class="hub-home" aria-label="Bölge ve ürün rehberlerimiz">
    <div class="wrap">
      <h2>ATAKUM &amp; SAMSUN PETSHOP REHBERLERİ</h2>
      {render_hub_links("")}
    </div>
  </aside>
"""
idx_html = re.sub(r'\s*<aside class="hub-home".*?</aside>\s*', "\n", idx_html, flags=re.DOTALL)
idx_html = idx_html.replace('  <footer class="site">', hub_block + '\n  <footer class="site">', 1)
open(idx_path, "w", encoding="utf-8").write(idx_html)

# Generate restructured, standards-compliant sitemap.xml (Sitemap 0.9 + Google Image 1.1 + xhtml:link hreflang + XSL)
LASTMOD_ISO = "2026-11-15T23:03:00+03:00"

SITEMAP_XSL = """<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="tr">
      <head>
        <title>XML Site Haritası (Sitemap) — Enuygun Petshop</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #16325c; background: #f4f8fb; margin: 0; padding: 1.5rem 1rem; line-height: 1.5; }
          .box { max-width: 72rem; margin: 0 auto; background: #fff; border-radius: 0.875rem; border: 1px solid #d8e3ee; overflow: hidden; box-shadow: 0 6px 20px rgba(15,36,68,0.06); }
          .hdr { background: #0f2444; color: #fff; padding: 1.25rem 1.5rem; }
          .hdr h1 { margin: 0 0 0.35rem; font-size: 1.25rem; }
          .hdr p { margin: 0; font-size: 0.875rem; color: #cbd5e1; }
          .hdr a { color: #fbbf24; text-decoration: underline; }
          .tbl-wrap { width: 100%; overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
          th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e6eef6; }
          th { background: #eef4fa; font-weight: 700; color: #0f2444; white-space: nowrap; }
          tr:hover td { background: #f8fbff; }
          td a { color: #0e4d64; font-weight: 600; text-decoration: none; word-break: break-all; }
          td a:hover { text-decoration: underline; }
          .pill { display: inline-block; background: #e0f2fe; color: #083344; font-weight: 700; font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 999px; }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="hdr">
            <h1>Enuygun Petshop — XML Site Haritası</h1>
            <p>Google, Bing, Yandex ve Yapay Zeka arama motorları için yapılandırılmış kanonik site haritası • Toplam <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> sayfa • <a href="https://www.enuygunpetshop.com/">Ana Sayfaya Dön</a></p>
          </div>
          <div class="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Kanonik Sayfa Adresi (URL)</th>
                  <th>Öncelik</th>
                  <th>Görsel</th>
                  <th>Son Güncelleme (ISO 8601)</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td><xsl:value-of select="position()"/></td>
                    <td>
                      <xsl:variable name="u"><xsl:value-of select="sitemap:loc"/></xsl:variable>
                      <a href="{$u}"><xsl:value-of select="sitemap:loc"/></a>
                    </td>
                    <td><span class="pill"><xsl:value-of select="sitemap:priority"/></span></td>
                    <td><xsl:value-of select="count(image:image)"/> adet</td>
                    <td><xsl:value-of select="sitemap:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
"""
open(os.path.join(OUT_DIR, "sitemap.xsl"), "w", encoding="utf-8").write(SITEMAP_XSL)

PRIORITY_MAP = {
    "atakum-petshop": ("daily", "0.95"),
    "atakent-yeni-mahalle-petshop": ("weekly", "0.90"),
    "en-yakin-petshop-yol-tarifi": ("weekly", "0.90"),
    "acik-petshop-pazar-hafta-sonu": ("daily", "0.90"),
    "en-uygun-petshop-fiyatlari": ("weekly", "0.85"),
    "pet-gross-buyuk-petshop-magazasi": ("weekly", "0.85"),
    "kedi-kopek-mamasi-kedi-market": ("weekly", "0.85"),
    "kus-yemi-muhabbet-kusu-malzemeleri": ("weekly", "0.85"),
    "samsun-ilkadim-petshop-ulasim": ("weekly", "0.80"),
    "pet-store-atakum-samsun": ("weekly", "0.80"),
}

def build_url_entry(loc, lastmod, changefreq, priority, hreflangs, images):
    lines = [
        "  <url>",
        f"    <loc>{loc}</loc>",
        f"    <lastmod>{lastmod}</lastmod>",
        f"    <changefreq>{changefreq}</changefreq>",
        f"    <priority>{priority}</priority>",
    ]
    for hl in hreflangs:
        lines.append(f'    <xhtml:link rel="alternate" hreflang="{hl}" href="{loc}" />')
    for img_url in images:
        lines.append("    <image:image>")
        lines.append(f"      <image:loc>{img_url}</image:loc>")
        lines.append("    </image:image>")
    lines.append("  </url>")
    return "\n".join(lines)

url_blocks = [
    build_url_entry(
        loc="https://www.enuygunpetshop.com/",
        lastmod=LASTMOD_ISO,
        changefreq="daily",
        priority="1.00",
        hreflangs=["tr-TR", "x-default"],
        images=[
            "https://www.enuygunpetshop.com/img/og-share.jpg",
            "https://www.enuygunpetshop.com/img/hero-pets-880.webp",
            "https://www.enuygunpetshop.com/img/cat.webp",
            "https://www.enuygunpetshop.com/img/dog.webp",
            "https://www.enuygunpetshop.com/img/bird.webp",
            "https://www.enuygunpetshop.com/img/fish.webp",
            "https://www.enuygunpetshop.com/img/hamster.webp",
        ],
    )
]

for p in PAGES:
    slug = p["slug"]
    cf, pri = PRIORITY_MAP.get(slug, ("weekly", "0.85"))
    hlangs = ["tr-TR", "en", "de", "x-default"] if slug == "pet-store-atakum-samsun" else ["tr-TR", "x-default"]
    page_img = f'https://www.enuygunpetshop.com{p["hero_img"]}'
    imgs = [page_img, "https://www.enuygunpetshop.com/img/og-share.jpg"]
    url_blocks.append(
        build_url_entry(
            loc=f"https://www.enuygunpetshop.com/{slug}",
            lastmod=LASTMOD_ISO,
            changefreq=cf,
            priority=pri,
            hreflangs=hlangs,
            images=imgs,
        )
    )

sitemap_str = (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n'
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
    + "\n".join(url_blocks)
    + "\n</urlset>\n"
)
open(os.path.join(OUT_DIR, "sitemap.xml"), "w", encoding="utf-8").write(sitemap_str)

# Update llms.txt & llms-full.txt with all 10 topic pages
llms_links = "\n".join(
    f'- [{p["title"]}](https://www.enuygunpetshop.com/{p["slug"]}): {p["description"]}'
    for p in PAGES
)
llms_path = os.path.join(OUT_DIR, "llms.txt")
llms_txt = open(llms_path, "r", encoding="utf-8").read()
if "## Konu ve Bölge Rehber Sayfaları" not in llms_txt:
    llms_txt += "\n## Konu ve Bölge Rehber Sayfaları\n" + llms_links + "\n"
    open(llms_path, "w", encoding="utf-8").write(llms_txt)

llms_full_path = os.path.join(OUT_DIR, "llms-full.txt")
llms_full = open(llms_full_path, "r", encoding="utf-8").read()
if "## 6. Özel Konu, Mahalle ve Ürün Rehber Sayfaları" not in llms_full:
    extra = ["\n## 6. Özel Konu, Mahalle ve Ürün Rehber Sayfaları"]
    for p in PAGES:
        extra.append(f"### {p['h1']} (https://www.enuygunpetshop.com/{p['slug']})\n{p['lead']}")
        for q, a in p["faqs"]:
            extra.append(f"- **{q}** {a}")
    open(llms_full_path, "w", encoding="utf-8").write(llms_full + "\n\n".join(extra) + "\n")

print(f"Generated {len(PAGES)} distinct SEO/AI-Search pages + updated index.html, sitemap.xml, llms.txt, llms-full.txt!")
