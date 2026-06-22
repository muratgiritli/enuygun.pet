import { useEffect } from "react";
import { Link } from "wouter";
import { useTrack } from "@/hooks/use-track";
import SiteHeader from "@/components/site-header";
import { Phone, MapPin, Clock, Star, Truck, ShieldCheck, BadgeCheck, ChevronRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const IMG = "/images/royal-canin";
const logoImg = `${IMG}/logo.png`;
const kittenImg = `${IMG}/kitten.jpg`;
const sterilisedImg = `${IMG}/sterilised.jpg`;
const miniAdultImg = `${IMG}/mini-adult.jpg`;
const miniPuppyImg = `${IMG}/mini-puppy.png`;
const mediumAdultImg = `${IMG}/medium-adult.jpg`;
const maxiAdultImg = `${IMG}/maxi-adult.jpg`;
const gastroImg = `${IMG}/gastrointestinal.jpg`;
const hypoImg = `${IMG}/hypoallergenic.jpg`;

const PHONE = "+905422114944";
const PHONE_DISPLAY = "0542 211 49 44";
const WHATSAPP_URL = `https://wa.me/905422114944?text=${encodeURIComponent("Merhaba, Royal Canin ürünleri hakkında bilgi almak istiyorum.")}`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";
const SHOP_URL = "https://www.atakumpetshop.com";

type Product = {
  id: string;
  name: string;
  type: "kedi" | "kopek";
  desc: string;
  size: string;
  price: number;
  rating: number;
  reviews: number;
  img: string;
  alt: string;
  best?: boolean;
};

const PRODUCTS: Product[] = [
  { id: "kitten", name: "Royal Canin Kitten", type: "kedi", desc: "Yavru kediler için (4-12 ay)", size: "2 kg", price: 549, rating: 4.9, reviews: 324, img: kittenImg, alt: "royal canin kitten", best: true },
  { id: "sterilised", name: "Royal Canin Sterilised", type: "kedi", desc: "Kısırlaştırılmış yetişkin kediler için", size: "4 kg", price: 1249, rating: 4.8, reviews: 512, img: sterilisedImg, alt: "royal canin sterilised", best: true },
  { id: "mini-adult", name: "Royal Canin Mini Adult", type: "kopek", desc: "Küçük ırk yetişkin köpekler için", size: "3 kg", price: 899, rating: 4.8, reviews: 268, img: miniAdultImg, alt: "royal canin mini adult", best: true },
  { id: "medium-adult", name: "Royal Canin Medium Adult", type: "kopek", desc: "Orta ırk yetişkin köpekler için", size: "4 kg", price: 1099, rating: 4.8, reviews: 211, img: mediumAdultImg, alt: "royal canin medium adult", best: true },
  { id: "mini-puppy", name: "Royal Canin Mini Puppy", type: "kopek", desc: "Küçük ırk yavru köpekler için", size: "3 kg", price: 949, rating: 4.9, reviews: 176, img: miniPuppyImg, alt: "royal canin puppy" },
  { id: "maxi-adult", name: "Royal Canin Maxi Adult", type: "kopek", desc: "Büyük ırk yetişkin köpekler için", size: "4 kg", price: 1149, rating: 4.7, reviews: 143, img: maxiAdultImg, alt: "royal canin maxi adult" },
  { id: "gastrointestinal", name: "Royal Canin Gastrointestinal", type: "kopek", desc: "Sindirim sistemi desteği — veteriner diyeti", size: "2 kg", price: 899, rating: 4.9, reviews: 98, img: gastroImg, alt: "royal canin gastrointestinal" },
  { id: "hypoallergenic", name: "Royal Canin Hypoallergenic", type: "kopek", desc: "Besin alerjileri için — veteriner diyeti", size: "2 kg", price: 1049, rating: 4.8, reviews: 84, img: hypoImg, alt: "royal canin hypoallergenic" },
];

const fmtPrice = (n: number) => n.toLocaleString("tr-TR") + " ₺";

function ProductCard({ p }: { p: Product }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 flex flex-col shadow-sm" data-testid={`card-product-${p.id}`}>
      <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center mb-2.5">
        <img src={p.img} alt={p.alt} loading="lazy" className="w-full h-full object-contain" data-testid={`img-product-${p.id}`} />
      </div>
      <h3 className="text-[13px] font-bold text-gray-900 leading-tight" data-testid={`text-name-${p.id}`}>{p.name}</h3>
      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{p.desc}</p>
      <div className="flex items-center gap-1 mt-1.5">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="text-[11px] font-semibold text-gray-700">{p.rating.toLocaleString("tr-TR")}</span>
        <span className="text-[11px] text-gray-400">({p.reviews})</span>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Stokta
        </span>
      </div>
      <div className="flex items-end justify-between mt-2">
        <div>
          <span className="text-[10px] text-gray-400 block leading-none">{p.size}</span>
          <span className="text-base font-extrabold text-gray-900" data-testid={`text-price-${p.id}`}>{fmtPrice(p.price)}</span>
        </div>
      </div>
      <a
        href={SHOP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] transition text-white text-[13px] font-bold py-2 rounded-xl shadow-sm"
        data-testid={`button-add-${p.id}`}
      >
        🛒 Sepete Ekle
      </a>
    </div>
  );
}

export default function RoyalCaninPage() {
  useTrack("royal-canin", "royal canin");

  useEffect(() => {
    const canonicalUrl = "https://www.enuygun.pet/royal-canin";
    const title = "Royal Canin Samsun | Atakum İçi 1 Saatte Teslim";
    const desc = "Royal Canin kedi ve köpek mamaları Samsun Atakum'da hızlı teslimat ile. Kitten, Sterilised, Mini Adult, Mini Puppy, Medium Adult, Maxi Adult, Gastrointestinal ve Hypoallergenic ürünleri uygun fiyatla EnuygunPet'te.";
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
    setMeta('meta[name="keywords"]', "content", "royal canin samsun, royal canin atakum, royal canin kedi maması, royal canin köpek maması, royal canin kitten, royal canin sterilised");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
  }, []);

  const kediProducts = PRODUCTS.filter(p => p.type === "kedi");
  const kopekProducts = PRODUCTS.filter(p => p.type === "kopek" && p.id !== "gastrointestinal" && p.id !== "hypoallergenic");
  const vetProducts = PRODUCTS.filter(p => p.id === "gastrointestinal" || p.id === "hypoallergenic");
  const bestSellers = PRODUCTS.filter(p => p.best);

  const productSchema = PRODUCTS.map(p => ({
    "@type": "Product",
    "name": p.name,
    "image": `https://www.enuygun.pet/images/royal-canin/${p.id}.${p.img.includes(".png") ? "png" : "jpg"}`,
    "description": p.desc,
    "brand": { "@type": "Brand", "name": "Royal Canin" },
    "category": p.type === "kedi" ? "Kedi Maması" : "Köpek Maması",
    "offers": {
      "@type": "Offer",
      "url": "https://www.enuygun.pet/royal-canin",
      "priceCurrency": "TRY",
      "price": p.price,
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "EnuygunPet Gross Market" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating,
      "reviewCount": p.reviews,
      "bestRating": 5,
      "worstRating": 1
    }
  }));

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": "Royal Canin Kedi ve Köpek Mamaları",
        "itemListElement": PRODUCTS.map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": productSchema[i]
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": "Royal Canin", "item": "https://www.enuygun.pet/royal-canin" }
        ]
      },
      {
        "@type": "Store",
        "@id": "https://www.enuygun.pet/royal-canin#store",
        "name": "EnuygunPet Gross Market — Royal Canin Bayi",
        "description": "Samsun Atakum'da Royal Canin kedi ve köpek mamaları satış noktası.",
        "url": "https://www.enuygun.pet/royal-canin",
        "telephone": "+905422114944",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113",
          "addressLocality": "Atakum",
          "addressRegion": "Samsun",
          "postalCode": "55200",
          "addressCountry": "TR"
        },
        "geo": { "@type": "GeoCoordinates", "latitude": 41.3286, "longitude": 36.2917 },
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
            "name": "Royal Canin ürünleri Samsun'da hangi adreste bulunur?",
            "acceptedAnswer": { "@type": "Answer", "text": "Royal Canin kedi ve köpek mamalarının tüm çeşitleri EnuygunPet Gross Market'te, Samsun Atakum Atatürk Bulvarı No:113 adresinde bulunmaktadır. Atakum içine 1 saatte teslimat yapılmaktadır." }
          },
          {
            "@type": "Question",
            "name": "Royal Canin siparişi nasıl verebilirim?",
            "acceptedAnswer": { "@type": "Answer", "text": "Online alışveriş için atakumpetshop.com üzerinden sipariş verebilir, ayrıca 0542 211 49 44 numaralı telefon ve WhatsApp hattından da sipariş oluşturabilirsiniz." }
          },
          {
            "@type": "Question",
            "name": "Atakum'a teslimat ne kadar sürer?",
            "acceptedAnswer": { "@type": "Answer", "text": "Atakum bölgesi içine Royal Canin siparişleriniz genellikle 1 saat içinde adresinize teslim edilmektedir." }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />

      {/* ── HERO ── */}
      <section className="px-4 pt-4 max-w-lg mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-br from-[#b91c1c] to-[#7f1d1d] text-white p-5 shadow-lg">
          <div className="bg-white rounded-2xl px-4 py-3 inline-flex items-center justify-center mb-3 shadow">
            <img src={logoImg} alt="royal canin logo" className="h-9 w-auto object-contain" data-testid="img-logo" />
          </div>
          <h1 className="text-2xl font-extrabold leading-tight" data-testid="text-h1">Royal Canin Kedi ve Köpek Mamaları</h1>
          <p className="mt-2 text-white/90 text-sm leading-relaxed">
            Samsun Atakum'da orijinal Royal Canin ürünleri — uygun fiyat, geniş stok ve <strong>Atakum içine 1 saatte teslimat</strong>.
          </p>
          <div className="flex flex-wrap gap-2 mt-3.5">
            <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"><Truck className="w-3.5 h-3.5" /> 1 Saatte Teslimat</span>
            <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"><BadgeCheck className="w-3.5 h-3.5" /> %100 Orijinal</span>
            <span className="inline-flex items-center gap-1 bg-white/15 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"><ShieldCheck className="w-3.5 h-3.5" /> Güncel Üretim</span>
          </div>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 bg-white text-[#b91c1c] font-extrabold text-sm py-3 rounded-2xl shadow-md active:scale-[0.98] transition" data-testid="button-shop-hero">
            🛒 ONLİNE ALIŞVERİŞ İÇİN TIKLA
          </a>
        </div>
      </section>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-8">
        {/* ── EN ÇOK SATANLAR ── */}
        <section aria-label="En çok satan Royal Canin ürünleri">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-extrabold text-gray-900">⭐ En Çok Satanlar</h3>
            <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Stokta</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {bestSellers.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* ── KEDI MAMALARI ── */}
        <section aria-label="Royal Canin Kedi Mamaları">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3" data-testid="text-h2-kedi">🐱 Royal Canin Kedi Mamaları</h2>
          <div className="grid grid-cols-2 gap-3">
            {kediProducts.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* ── KOPEK MAMALARI ── */}
        <section aria-label="Royal Canin Köpek Mamaları">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3" data-testid="text-h2-kopek">🐶 Royal Canin Köpek Mamaları</h2>
          <div className="grid grid-cols-2 gap-3">
            {kopekProducts.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* ── VETERINER DIYET ── */}
        <section aria-label="Royal Canin Veteriner Diyet Mamaları">
          <h3 className="text-lg font-extrabold text-gray-900 mb-3">🩺 Veteriner Diyet Mamaları</h3>
          <div className="grid grid-cols-2 gap-3">
            {vetProducts.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* ── ILETISIM / KONUM ── */}
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" aria-label="İletişim ve konum">
          <h3 className="text-base font-extrabold text-gray-900 mb-3">Sipariş & İletişim</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <a href={`tel:${PHONE}`} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 active:scale-95 transition" data-testid="link-phone">
              <Phone className="w-5 h-5 text-green-600" /><span className="text-[11px] font-semibold text-gray-700">Ara</span>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 active:scale-95 transition" data-testid="link-whatsapp">
              <SiWhatsapp className="w-5 h-5 text-[#25D366]" /><span className="text-[11px] font-semibold text-gray-700">WhatsApp</span>
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 active:scale-95 transition" data-testid="link-maps">
              <MapPin className="w-5 h-5 text-red-500" /><span className="text-[11px] font-semibold text-gray-700">Konum</span>
            </a>
          </div>
          <div className="space-y-1.5 text-sm text-gray-600">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /> Yeni Mah. Atatürk 3. Kısım Bulvarı No:113, Atakum / Samsun</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400 shrink-0" /> {PHONE_DISPLAY}</p>
            <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400 shrink-0" /> Her gün 09:00 – 21:00</p>
          </div>
        </section>

        {/* ── ACIKLAMA (300-500 kelime) ── */}
        <section className="space-y-3" aria-label="Royal Canin hakkında">
          <h2 className="text-base font-extrabold text-gray-900">Samsun Atakum'da Royal Canin Mamaları</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Royal Canin kedi ve köpek mamaları Samsun Atakum'da hızlı teslimat ile sizlerle. EnuygunPet Gross Market olarak Royal Canin'in tüm ürün gamını orijinal, güncel üretim tarihli ve uygun fiyatlarla sunuyoruz. Kitten, Sterilised, Mini Adult, Mini Puppy, Medium Adult, Maxi Adult, Gastrointestinal ve Hypoallergenic dahil olmak üzere Royal Canin ürünlerini stoğumuzdan inceleyebilir, dilediğiniz çeşidi aynı gün temin edebilirsiniz. Samsun ve Atakum genelinde Royal Canin bayisi arayan evcil hayvan sahipleri için geniş stok, doğru fiyat ve güvenilir hizmeti bir arada sunuyoruz.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Royal Canin, evcil hayvanların yaşına, ırkına ve özel ihtiyaçlarına göre formüle edilmiş bilimsel beslenme çözümleriyle dünya genelinde veteriner hekimlerin önerdiği lider markadır. <strong>Royal Canin Kitten</strong> yavru kedilerin bağışıklık sistemini ve sağlıklı gelişimini desteklerken, <strong>Royal Canin Sterilised</strong> kısırlaştırılmış kedilerin ideal kiloda kalmasına ve idrar yolu sağlığına yardımcı olur. Köpekler için <strong>Mini Adult</strong> ve <strong>Mini Puppy</strong> küçük ırklara, <strong>Medium Adult</strong> orta ırklara, <strong>Maxi Adult</strong> ise büyük ırklara özel olarak geliştirilmiştir. Her bir formül, ırkın çiğneme yapısına, enerji ihtiyacına ve sindirim hassasiyetine göre tasarlanmıştır; böylece dostunuz hem severek yer hem de ihtiyacı olan tüm besinleri eksiksiz alır.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Hassas sindirim sistemine sahip dostlarınız için <strong>Royal Canin Gastrointestinal</strong>, besin alerjisi olan köpekler için ise <strong>Royal Canin Hypoallergenic</strong> veteriner diyet mamalarımız mevcuttur. Bu özel diyet ürünleri, veteriner hekim önerisiyle kullanıldığında sindirim ve cilt sağlığı sorunlarının yönetilmesine destek olur. Tüm ürünlerimiz orijinal Royal Canin garantisi taşır, son kullanma tarihleri uzun ve saklama koşulları uygundur. Samsun Atakum bölgesinde Royal Canin arayanlar için EnuygunPet, gross market fiyat avantajı ve geniş stok seçeneğiyle en doğru adrestir. Mağazamızda ayrıca farklı gramaj ve paket seçenekleriyle hem küçük denemelik boylar hem de avantajlı büyük boy çuvallar bulunur.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Atakum içine <strong>1 saatte teslimat</strong> imkanımızla, mamanız bittiğinde beklemeden sipariş verebilirsiniz. Online alışveriş için sayfanın üstündeki <strong>"ONLİNE ALIŞVERİŞ İÇİN TIKLA"</strong> butonuna tıklayarak atakumpetshop.com üzerinden güvenle ödeme yapabilir; dilerseniz telefon veya WhatsApp hattımızdan da hızlıca sipariş oluşturabilirsiniz. Hangi ürünün dostunuza uygun olduğundan emin değilseniz, deneyimli ekibimiz yaş, ırk ve özel ihtiyaçlara göre ücretsiz ürün önerisi sunar. Royal Canin Samsun, Royal Canin Atakum ve uygun fiyatlı kedi-köpek maması arayışınızda EnuygunPet Gross Market her gün 09:00–21:00 saatleri arasında yanınızda. Doğru beslenme, sağlıklı ve mutlu bir evcil hayvan için ilk adımdır; biz de bu yolda en kaliteli ürünleri en uygun fiyatla sizlere ulaştırmak için buradayız.
          </p>
        </section>

        {/* ── DIGER KATEGORILER ── */}
        <section aria-label="Diğer kategoriler">
          <h3 className="text-sm font-bold text-gray-700 mb-2">İlgili Sayfalar</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/kedi-mamasi", label: "Kedi Maması" },
              { href: "/kopek-mamasi", label: "Köpek Maması" },
              { href: "/atakum-petshop", label: "Atakum Petshop" },
              { href: "/petshop-samsun", label: "Petshop Samsun" },
            ].map(c => (
              <Link key={c.href} href={c.href} className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full" data-testid={`link-related-${c.href.slice(1)}`}>
                {c.label} <ChevronRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* ── STICKY BOTTOM BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
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
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl bg-red-600" data-testid="bottom-shop">
            <span className="text-base leading-none">🛒</span><span className="text-[10px] font-bold text-white">Alışveriş</span>
          </a>
        </div>
      </div>
    </div>
  );
}
