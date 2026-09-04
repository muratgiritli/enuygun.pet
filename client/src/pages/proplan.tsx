import { useEffect } from "react";
import { Link } from "wouter";
import { useTrack } from "@/hooks/use-track";
import SiteHeader from "@/components/site-header";
import SiteCredit from "@/components/site-credit";
import { Phone, MapPin, Clock, Truck, ShieldCheck, BadgeCheck, ChevronRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const IMG = "/images/proplan";
const logoImg = `${IMG}/logo.jpg`;
const kittenImg = `${IMG}/kitten.jpg`;
const sterilisedImg = `${IMG}/sterilised.jpg`;
const adultCatImg = `${IMG}/adult-cat.jpg`;
const puppyImg = `${IMG}/puppy.jpg`;
const smallAdultImg = `${IMG}/small-adult.jpg`;
const mediumAdultImg = `${IMG}/medium-adult.jpg`;
const largeAdultImg = `${IMG}/large-adult.jpg`;
const gastroImg = `${IMG}/gastrointestinal.jpg`;
const hypoImg = `${IMG}/hypoallergenic.webp`;

const PHONE = "+905422114944";
const PHONE_DISPLAY = "0542 211 49 44";
const WHATSAPP_URL = `https://wa.me/905422114944?text=${encodeURIComponent("Merhaba, Pro Plan ürünleri hakkında bilgi almak istiyorum.")}`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";
const SHOP_URL = "https://www.enuygunpetshop.com";

const catProducts = [
  { img: kittenImg, alt: "pro plan kitten kedi maması", label: "Kitten" },
  { img: sterilisedImg, alt: "pro plan sterilised kedi maması", label: "Sterilised" },
  { img: adultCatImg, alt: "pro plan adult kedi maması", label: "Adult" },
];
const dogProducts = [
  { img: puppyImg, alt: "pro plan puppy köpek maması", label: "Puppy" },
  { img: smallAdultImg, alt: "pro plan small mini adult köpek maması", label: "Small & Mini" },
  { img: mediumAdultImg, alt: "pro plan medium adult köpek maması", label: "Medium Adult" },
  { img: largeAdultImg, alt: "pro plan large adult köpek maması", label: "Large Adult" },
];
const vetProducts = [
  { img: gastroImg, alt: "pro plan veterinary diets en gastrointestinal", label: "EN Gastrointestinal" },
  { img: hypoImg, alt: "pro plan veterinary diets ha hypoallergenic", label: "HA Hypoallergenic" },
];

const heroShowcase = [
  { img: kittenImg, label: "Kitten" },
  { img: puppyImg, label: "Puppy" },
  { img: adultCatImg, label: "Adult Kedi" },
  { img: largeAdultImg, label: "Large Adult" },
];

function ProductCard({ img, alt, label }: { img: string; alt: string; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 lg:p-4 shadow-sm lg:hover:shadow-md lg:hover:-translate-y-0.5 lg:transition-all">
      <img src={img} alt={alt} loading="lazy" className="w-full aspect-square object-contain" />
      <p className="mt-2 text-center text-[11px] lg:text-xs font-semibold text-gray-700">{label}</p>
    </div>
  );
}

type Product = { img: string; alt: string; label: string };
function ArticleSection({ title, testId, imagesSide, images, cols, children }: {
  title: string; testId?: string; imagesSide: "left" | "right"; images: Product[]; cols: string; children: React.ReactNode;
}) {
  const imgCol = imagesSide === "left" ? "lg:col-start-1" : "lg:col-start-2";
  const txtCol = imagesSide === "left" ? "lg:col-start-2" : "lg:col-start-1";
  return (
    <section aria-label={title} className="grid gap-3 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-3 lg:items-start">
      <h2 className={`text-lg lg:text-3xl font-extrabold text-gray-900 lg:row-start-1 ${txtCol}`} data-testid={testId}>{title}</h2>
      <div className={`grid ${cols} gap-2.5 lg:gap-4 lg:row-start-1 lg:row-span-2 lg:self-center ${imgCol}`}>
        {images.map(p => <ProductCard key={p.label} {...p} />)}
      </div>
      <div className={`space-y-3 lg:row-start-2 ${txtCol}`}>
        {children}
      </div>
    </section>
  );
}

export default function ProPlanPage() {
  useTrack("proplan", "proplan");

  useEffect(() => {
    const canonicalUrl = "https://www.enuygun.pet/proplan";
    const title = "Pro Plan Samsun | Atakum İçi 1 Saatte Teslim";
    const desc = "Pro Plan (Purina Pro Plan) kedi ve köpek mamaları Samsun Atakum'da hızlı teslimat ile. Kitten, Sterilised, Adult, Puppy, Small & Mini, Medium Adult, Large Adult ve Veterinary Diets ürünleri uygun fiyatla EnuygunPet'te.";
    document.title = title;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
      el.setAttribute("href", href);
    };
    setLink("canonical", canonicalUrl);
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[name="keywords"]', "content", "pro plan samsun, proplan atakum, pro plan kedi maması, pro plan köpek maması, pro plan kitten, pro plan sterilised, purina pro plan");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": "Pro Plan", "item": "https://www.enuygun.pet/proplan" }
        ]
      },
      {
        "@type": "Store",
        "@id": "https://www.enuygun.pet/proplan#store",
        "name": "EnuygunPet Gross Market — Pro Plan Bayi",
        "description": "Samsun Atakum'da Pro Plan kedi ve köpek mamaları satış noktası.",
        "url": "https://www.enuygun.pet/proplan",
        "telephone": "+905422114944",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113",
          "addressLocality": "Atakum",
          "addressRegion": "Samsun",
          "postalCode": "55200",
          "addressCountry": "TR"
        },
        "geo": { "@type": "GeoCoordinates", "latitude": 41.349366, "longitude": 36.243738 },
        "openingHoursSpecification": [{
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "09:00",
          "closes": "21:00"
        }],
        "areaServed": { "@type": "City", "name": "Samsun" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Pro Plan ürünleri Samsun'da hangi adreste bulunur?",
            "acceptedAnswer": { "@type": "Answer", "text": "Pro Plan kedi ve köpek mamalarının tüm çeşitleri EnuygunPet Gross Market'te, Samsun Atakum Atatürk Bulvarı No:113 adresinde bulunmaktadır. Atakum içine 1 saatte teslimat yapılmaktadır." }
          },
          {
            "@type": "Question",
            "name": "Pro Plan siparişi nasıl verebilirim?",
            "acceptedAnswer": { "@type": "Answer", "text": "Online alışveriş için enuygunpetshop.com üzerinden sipariş verebilir, ayrıca 0542 211 49 44 numaralı telefon ve WhatsApp hattından da sipariş oluşturabilirsiniz." }
          },
          {
            "@type": "Question",
            "name": "Atakum'a teslimat ne kadar sürer?",
            "acceptedAnswer": { "@type": "Answer", "text": "Atakum bölgesi içine Pro Plan siparişleriniz genellikle 1 saat içinde adresinize teslim edilmektedir." }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader showShopGrid={false} />

      {/* ── HERO ── */}
      <section className="px-4 pt-4 lg:pt-8 max-w-lg lg:max-w-6xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#c8102e] to-[#7a0a1c] text-white p-5 lg:p-12 shadow-lg lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div>
            <div className="bg-white rounded-2xl px-4 py-3 inline-flex items-center justify-center mb-3 lg:mb-5 shadow">
              <img src={logoImg} alt="pro plan logo" className="h-9 lg:h-12 w-auto object-contain" data-testid="img-logo" />
            </div>
            <h1 className="text-2xl lg:text-5xl font-extrabold leading-tight" data-testid="text-h1">Pro Plan Kedi ve Köpek Mamaları</h1>
            <p className="mt-2 lg:mt-4 text-white/90 text-sm lg:text-lg leading-relaxed lg:max-w-md">
              Samsun Atakum'da orijinal Purina Pro Plan ürünleri — uygun fiyat, geniş stok ve <strong>Atakum içine 1 saatte teslimat</strong>.
            </p>
            <div className="flex flex-wrap gap-2 mt-3.5 lg:mt-5">
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] lg:text-sm font-semibold px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full"><Truck className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> 1 Saatte Teslimat</span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] lg:text-sm font-semibold px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full"><BadgeCheck className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> %100 Orijinal</span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] lg:text-sm font-semibold px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full"><ShieldCheck className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Güncel Üretim</span>
            </div>
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="mt-4 lg:mt-7 flex lg:inline-flex items-center justify-center gap-2 bg-white text-[#c8102e] font-extrabold text-sm lg:text-base py-3 lg:py-4 lg:px-8 rounded-2xl shadow-md hover:bg-gray-50 active:scale-[0.98] transition" data-testid="button-shop-hero">
              🛒 ONLİNE ALIŞVERİŞ İÇİN TIKLA
            </a>
          </div>
          {/* desktop ürün vitrini */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {heroShowcase.map(p => (
              <div key={p.label} className="bg-white rounded-2xl p-4 shadow-md flex flex-col items-center">
                <img src={p.img} alt={`pro plan ${p.label}`} className="w-full aspect-square object-contain" />
                <span className="mt-1.5 text-xs font-bold text-gray-700">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-lg lg:max-w-6xl mx-auto w-full px-4 lg:px-8 py-6 lg:py-14 space-y-8 lg:space-y-16">
        {/* ── MAKALE: NEDEN PRO PLAN ── */}
        <section aria-label="Pro Plan neden tercih edilmeli" className="space-y-3 lg:max-w-3xl">
          <h2 className="text-lg lg:text-3xl font-extrabold text-gray-900">Neden Pro Plan?</h2>
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
            Purina Pro Plan, beslenme bilimcileri ve veteriner hekimlerle birlikte geliştirilen, kedi ve köpeklerin yaşına, boyutuna ve özel ihtiyaçlarına göre formüle edilmiş üst segment bir mama markasıdır. Markanın <strong>OptiStart, OptiBalance, OptiDigest</strong> ve <strong>OptiSenses</strong> gibi özel formülleri; bağışıklık, sindirim, tüy sağlığı ve yaşam enerjisi gibi farklı ihtiyaçları hedefler.
          </p>
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
            Yüksek kaliteli protein kaynağı, dengeli besin profili ve canlı probiyotik destekleri sayesinde Pro Plan mamaları; güçlü bağışıklık, sağlıklı sindirim ve parlak bir tüy yapısı sağlar. EnuygunPet olarak tüm Pro Plan ürünlerini <strong>orijinal, güncel üretim tarihli ve Samsun'un en uygun fiyatlarıyla</strong> sunuyoruz.
          </p>
        </section>

        {/* ── MAKALE: KEDI MAMALARI ── */}
        <ArticleSection title="Pro Plan Kedi Mamaları" testId="text-h2-kedi" imagesSide="right" images={catProducts} cols="grid-cols-3">
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
            Pro Plan kedi mamaları, kedinizin yaşam evresine göre özelleştirilmiştir. <strong>Pro Plan Kitten</strong>, yavru kedilerin hızlı büyüme dönemini ve bağışıklık gelişimini kolostrum kaynaklı antikorlarla destekler. <strong>Pro Plan Sterilised</strong>, kısırlaştırılmış yetişkin kedilerin ideal kiloda kalmasını ve idrar yolu sağlığını korurken, <strong>Pro Plan Adult</strong> formülleri yetişkin kedilerin günlük enerji ve tüy sağlığı ihtiyacını eksiksiz karşılar.
          </p>
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
            Hassas mideli, tüy yumağı problemi yaşayan veya iç organ sağlığına özen gösterilmesi gereken kediler için de Pro Plan'in özel reçeteleri mevcuttur. Mağazamızdan kedinize en uygun çeşidi seçebilir, emin olamadığınız noktada ekibimizden ücretsiz öneri alabilirsiniz.
          </p>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm lg:text-base font-bold text-[#c8102e] hover:gap-2 transition-all" data-testid="link-shop-kedi">
            Kedi mamalarını online incele <ChevronRight className="w-4 h-4" />
          </a>
        </ArticleSection>

        {/* ── MAKALE: KOPEK MAMALARI ── */}
        <ArticleSection title="Pro Plan Köpek Mamaları" testId="text-h2-kopek" imagesSide="left" images={dogProducts} cols="grid-cols-2">
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
            Pro Plan köpek mamaları, köpeğinizin ırk boyutuna ve yaşına göre ayrılır. <strong>Pro Plan Puppy</strong> yavruların sağlıklı büyümesini ve beyin gelişimini desteklerken, <strong>Pro Plan Small &amp; Mini Adult</strong> küçük ırk yetişkinler için yoğun enerji ve uygun kroket boyutu sunar. Orta ırklar için <strong>Medium Adult</strong>, büyük ırklar için ise <strong>Large Adult</strong> formülleri eklem sağlığını ve güçlü kas yapısını korur.
          </p>
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
            Her formül; köpeğin çene yapısına uygun kroket tasarımı, ırkına özgü enerji ihtiyacı ve sindirim hassasiyeti göz önünde bulundurularak hazırlanır. Bu sayede dostunuz hem mamayı severek yer hem de günlük ihtiyacı olan tüm besinleri eksiksiz alır.
          </p>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm lg:text-base font-bold text-[#c8102e] hover:gap-2 transition-all" data-testid="link-shop-kopek">
            Köpek mamalarını online incele <ChevronRight className="w-4 h-4" />
          </a>
        </ArticleSection>

        {/* ── MAKALE: VETERINER DIYET ── */}
        <ArticleSection title="Pro Plan Veterinary Diets Mamaları" imagesSide="right" images={vetProducts} cols="grid-cols-2">
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
            Bazı dostlarımızın özel sağlık ihtiyaçları olur. <strong>Pro Plan Veterinary Diets EN Gastrointestinal</strong>, hassas sindirim sistemine sahip, ishal veya kusma gibi sorunlar yaşayan kedi ve köpekler için yüksek sindirilebilirlikte hazırlanmış bir veteriner diyetidir. <strong>Pro Plan Veterinary Diets HA Hypoallergenic</strong> ise besin alerjisi ya da gıda intoleransı bulunan dostlar için hidrolize protein içeren özel bir formüldür.
          </p>
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
            Veteriner diyet mamaları mutlaka bir veteriner hekim önerisiyle kullanılmalıdır. EnuygunPet'te bu özel ürünleri orijinal garantisiyle bulabilir, doğru kullanımı hakkında bilgi alabilirsiniz.
          </p>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm lg:text-base font-bold text-[#c8102e] hover:gap-2 transition-all" data-testid="link-shop-vet">
            Veteriner diyet mamalarını online incele <ChevronRight className="w-4 h-4" />
          </a>
        </ArticleSection>

        {/* ── ILETISIM + ACIKLAMA ── */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-12 lg:items-start space-y-8 lg:space-y-0">
          {/* ── ILETISIM / KONUM ── */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-6 shadow-sm lg:col-span-1 lg:order-2 lg:sticky lg:top-24" aria-label="İletişim ve konum">
            <h3 className="text-base lg:text-lg font-extrabold text-gray-900 mb-3">Sipariş & İletişim</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <a href={`tel:${PHONE}`} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 hover:bg-gray-100 active:scale-95 transition" data-testid="link-phone">
                <Phone className="w-5 h-5 text-green-600" /><span className="text-[11px] font-semibold text-gray-700">Ara</span>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 hover:bg-gray-100 active:scale-95 transition" data-testid="link-whatsapp">
                <SiWhatsapp className="w-5 h-5 text-[#25D366]" /><span className="text-[11px] font-semibold text-gray-700">WhatsApp</span>
              </a>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 hover:bg-gray-100 active:scale-95 transition" data-testid="link-maps">
                <MapPin className="w-5 h-5 text-red-500" /><span className="text-[11px] font-semibold text-gray-700">Konum</span>
              </a>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /> Yeni Mah. Atatürk 3. Kısım Bulvarı No:113, Atakum / Samsun</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400 shrink-0" /> {PHONE_DISPLAY}</p>
              <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400 shrink-0" /> Her gün 09:00 – 21:00</p>
            </div>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center justify-center gap-2 mt-4 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white text-sm font-semibold rounded-xl" data-testid="link-maps-cta">
              <MapPin className="w-4 h-4" /> Yol Tarifi Al
            </a>
          </section>

          {/* ── ACIKLAMA (300-500 kelime) ── */}
          <section className="space-y-3 lg:col-span-2 lg:order-1" aria-label="Pro Plan hakkında">
            <h2 className="text-base lg:text-2xl font-extrabold text-gray-900">Samsun Atakum'da Pro Plan Mamaları</h2>
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              Pro Plan kedi ve köpek mamaları Samsun Atakum'da hızlı teslimat ile sizlerle. EnuygunPet Gross Market olarak Purina Pro Plan'in tüm ürün gamını orijinal, güncel üretim tarihli ve uygun fiyatlarla sunuyoruz. Kitten, Sterilised, Adult, Puppy, Small &amp; Mini Adult, Medium Adult, Large Adult ve Veterinary Diets dahil olmak üzere Pro Plan ürünlerini stoğumuzdan inceleyebilir, dilediğiniz çeşidi aynı gün temin edebilirsiniz. Samsun ve Atakum genelinde Pro Plan bayisi arayan evcil hayvan sahipleri için geniş stok, doğru fiyat ve güvenilir hizmeti bir arada sunuyoruz.
            </p>
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              Pro Plan, evcil hayvanların yaşına, ırkına ve özel ihtiyaçlarına göre formüle edilmiş bilimsel beslenme çözümleriyle dünya genelinde veteriner hekimlerin önerdiği lider markalardan biridir. <strong>Pro Plan Kitten</strong> yavru kedilerin bağışıklık sistemini ve sağlıklı gelişimini desteklerken, <strong>Pro Plan Sterilised</strong> kısırlaştırılmış kedilerin ideal kiloda kalmasına ve idrar yolu sağlığına yardımcı olur. Köpekler için <strong>Small &amp; Mini Adult</strong> küçük ırklara, <strong>Medium Adult</strong> orta ırklara, <strong>Large Adult</strong> ise büyük ırklara özel olarak geliştirilmiştir. Her bir formül, ırkın çiğneme yapısına, enerji ihtiyacına ve sindirim hassasiyetine göre tasarlanmıştır; böylece dostunuz hem severek yer hem de ihtiyacı olan tüm besinleri eksiksiz alır.
            </p>
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              Hassas sindirim sistemine sahip dostlarınız için <strong>Pro Plan Veterinary Diets EN Gastrointestinal</strong>, besin alerjisi olan dostlar için ise <strong>Pro Plan Veterinary Diets HA Hypoallergenic</strong> veteriner diyet mamalarımız mevcuttur. Bu özel diyet ürünleri, veteriner hekim önerisiyle kullanıldığında sindirim ve cilt sağlığı sorunlarının yönetilmesine destek olur. Tüm ürünlerimiz orijinal Pro Plan garantisi taşır, son kullanma tarihleri uzun ve saklama koşulları uygundur. Samsun Atakum bölgesinde Pro Plan arayanlar için EnuygunPet, gross market fiyat avantajı ve geniş stok seçeneğiyle en doğru adrestir. Mağazamızda ayrıca farklı gramaj ve paket seçenekleriyle hem küçük denemelik boylar hem de avantajlı büyük boy çuvallar bulunur.
            </p>
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              Atakum içine <strong>1 saatte teslimat</strong> imkanımızla, mamanız bittiğinde beklemeden sipariş verebilirsiniz. Online alışveriş için sayfanın üstündeki <strong>"ONLİNE ALIŞVERİŞ İÇİN TIKLA"</strong> butonuna tıklayarak enuygunpetshop.com üzerinden güvenle ödeme yapabilir; dilerseniz telefon veya WhatsApp hattımızdan da hızlıca sipariş oluşturabilirsiniz. Hangi ürünün dostunuza uygun olduğundan emin değilseniz, deneyimli ekibimiz yaş, ırk ve özel ihtiyaçlara göre ücretsiz ürün önerisi sunar. Pro Plan Samsun, Pro Plan Atakum ve uygun fiyatlı kedi-köpek maması arayışınızda EnuygunPet Gross Market her gün 09:00–21:00 saatleri arasında yanınızda. Doğru beslenme, sağlıklı ve mutlu bir evcil hayvan için ilk adımdır; biz de bu yolda en kaliteli ürünleri en uygun fiyatla sizlere ulaştırmak için buradayız.
            </p>
          </section>
        </div>

        {/* ── DIGER KATEGORILER ── */}
        <section aria-label="Diğer kategoriler">
          <h3 className="text-sm lg:text-base font-bold text-gray-700 mb-2 lg:mb-3">İlgili Sayfalar</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/royal-canin", label: "Royal Canin" },
              { href: "/kedi-mamasi", label: "Kedi Maması" },
              { href: "/kopek-mamasi", label: "Köpek Maması" },
              { href: "/atakum-petshop", label: "Atakum Petshop" },
              { href: "/petshop-samsun", label: "Petshop Samsun" },
            ].map(c => (
              <Link key={c.href} href={c.href} className="inline-flex items-center gap-1 text-xs lg:text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors px-3 py-1.5 lg:px-4 lg:py-2 rounded-full" data-testid={`link-related-${c.href.slice(1)}`}>
                {c.label} <ChevronRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-4 pb-6 text-center space-y-1">
        <SiteCredit />
      </footer>

      {/* ── STICKY BOTTOM BAR ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-lg mx-auto grid grid-cols-4 gap-1.5 px-3 py-2">
          <a href={`tel:${PHONE}`} className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl" data-testid="bottom-phone">
            <Phone className="w-5 h-5 text-gray-700" /><span className="text-[10px] font-semibold text-gray-600">Ara</span>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl" data-testid="bottom-whatsapp">
            <SiWhatsapp className="w-5 h-5 text-[#25D366]" /><span className="text-[10px] font-semibold text-gray-600">WhatsApp</span>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl" data-testid="bottom-maps">
            <MapPin className="w-5 h-5 text-red-500" /><span className="text-[10px] font-semibold text-gray-600">Konum</span>
          </a>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl bg-[#c8102e]" data-testid="bottom-shop">
            <span className="text-base leading-none">🛒</span><span className="text-[10px] font-bold text-white">Alışveriş</span>
          </a>
        </div>
      </div>
    </div>
  );
}
