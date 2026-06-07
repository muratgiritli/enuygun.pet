import { useState, useEffect } from "react";
import { useTrack } from "@/hooks/use-track";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  Star,
  Navigation,
  Cat,
  Dog,
  Bird,
  Fish,
  BookOpen,
  ChevronRight,
  Search,
} from "lucide-react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";

const PHONE = "+905422114944";
const WHATSAPP_URL = `https://wa.me/905422114944?text=Merhaba,%20Enuygun.pet%20mağazanızdaki%20ürünler%20hakkında%20bilgi%20almak%20istiyorum.`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";
const INSTAGRAM_URL = "https://www.instagram.com/enuygun.pet/";

const STORE_HERO = "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg";
const STORE_PHOTOS = [
  "https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg",
  "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
  "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
  "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
];

function optimizedImg(url: string, width: number = 0) {
  if (!url.includes("wixstatic.com")) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}${width > 0 ? `&w=${width}` : ""}`;
}

const categories = [
  { icon: Cat, label: "Kedi Maması", emoji: "🐱", slug: "kedi-mamasi", color: "from-orange-400 to-amber-500" },
  { icon: Dog, label: "Köpek Maması", emoji: "🐶", slug: "kopek-mamasi", color: "from-blue-400 to-blue-600" },
  { icon: Bird, label: "Kuş Ürünleri", emoji: "🦜", slug: "gold-wings-muhabbet-yemi", color: "from-green-400 to-emerald-600" },
  { icon: Fish, label: "Akvaryum", emoji: "🐠", slug: "balik-yemi-samsun", color: "from-cyan-400 to-blue-500" },
  { icon: Cat, label: "Kemirgen Sürüngen", emoji: "🐹", slug: "kedi-kumu", color: "from-slate-400 to-slate-600" },
  { icon: Dog, label: "Atakum Petshop", emoji: "📍", slug: "atakum-petshop", color: "from-red-400 to-rose-600" },
];

const popularSearches = [
  { label: "Royal Canin Kedi Maması", slug: "royal-canin-kedi-mamasi" },
  { label: "Pro Plan Köpek Maması", slug: "pro-plan-kopek-mamasi" },
  { label: "Kedi Kumu Samsun", slug: "kedi-kumu-samsun" },
  { label: "Köpek Maması Samsun", slug: "kopek-mamasi-samsun" },
  { label: "Kedi Maması Atakum", slug: "kedi-mamasi-atakum-samsun" },
  { label: "Brit Care Kedi", slug: "brit-care-kedi-mamasi" },
  { label: "Hill's Kedi Maması", slug: "hills-kedi-mamasi" },
  { label: "Vancat Kedi Kumu", slug: "vancat-kedi-kumu" },
  { label: "Köpek Tasması", slug: "kopek-tasmasi" },
  { label: "Kedi Tırmalama", slug: "kedi-tirmalama" },
  { label: "Furminator Tarak", slug: "furminator-tarak" },
  { label: "Muhabbet Kuşu Kafesi", slug: "muhabbet-kusu-kafesi" },
  { label: "Papağan Kafesi", slug: "papagan-kafesi" },
  { label: "Kedi Taşıma Çantası", slug: "kedi-tasima-cantasi" },
  { label: "Köpek Şampuanı", slug: "kopek-sampuani" },
  { label: "Felicia Kedi Maması", slug: "felicia-kedi-mamasi" },
  { label: "Reflex Kedi Maması", slug: "reflex-kedi-mamasi" },
  { label: "N&D Kedi Maması", slug: "nd-kedi-mamasi" },
  { label: "Proline Kedi Kumu", slug: "proline-kedi-kumu" },
  { label: "Pelet Kedi Kumu", slug: "pelet-kedi-kumu" },
  { label: "GimCat Ödül", slug: "gimcat" },
  { label: "Wanpy Kedi Ödülü", slug: "wanpy-kedi-odulu" },
];

const brandLinks = [
  { name: "Royal Canin", slug: "royal-canin-kedi-mamasi" },
  { name: "Pro Plan", slug: "pro-plan-kedi-mamasi" },
  { name: "Acana", slug: "acana-kedi-mamasi" },
  { name: "Orijen", slug: "orijen-kedi-mamasi" },
  { name: "Reflex", slug: "reflex-kedi-mamasi" },
  { name: "N&D", slug: "nd-kedi-mamasi" },
  { name: "Brit Care", slug: "brit-care-kedi-mamasi" },
  { name: "GimCat", slug: "gimcat" },
  { name: "Trixie", slug: "trixie-kedi" },
  { name: "Ferplast", slug: "ferplast-kus-kafesi" },
  { name: "Felix", slug: "felix-kedi-mamasi" },
  { name: "Whiskas", slug: "whiskas-kedi-mamasi" },
  { name: "Pedigree", slug: "pedigree-kopek-mamasi-15-kg" },
  { name: "Hill's", slug: "hills-kedi-mamasi" },
];

const galleryImages = [
  { src: STORE_HERO, alt: "EnuygunPet Gross Market mağaza girişi" },
  { src: STORE_PHOTOS[0], alt: "Mağaza iç mekan ürün reyonları" },
  { src: STORE_PHOTOS[1], alt: "Kedi maması ve ürünleri" },
  { src: STORE_PHOTOS[2], alt: "Köpek maması ve aksesuarları" },
  { src: STORE_PHOTOS[3], alt: "Kuş yemleri ve ürünleri" },
];

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.enuygun.pet/#website",
      "url": "https://www.enuygun.pet/",
      "name": "EnuygunPet Gross Market",
      "inLanguage": "tr-TR",
    },
    {
      "@type": ["LocalBusiness", "PetStore"],
      "@id": "https://www.enuygun.pet/#localbusiness",
      "name": "EnuygunPet Gross Market",
      "url": "https://www.enuygun.pet/",
      "telephone": "+905422114944",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113",
        "addressLocality": "Atakum",
        "addressRegion": "Samsun",
        "postalCode": "55200",
        "addressCountry": "TR"
      },
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "09:00",
        "closes": "21:00"
      }],
      "hasMap": "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu",
    }
  ]
};

export default function Home() {
  useTrack("anasayfa", "EnuygunPet Petshop Samsun Atakum");
  const [activeGallery, setActiveGallery] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGallery(p => (p + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />


      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow">
              <span className="text-lg">🐾</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-gray-900 tracking-tight block" data-testid="text-brand-name">
                ENUYGUN<span className="text-green-600">.PET</span>
              </span>
              <p className="text-[10px] text-gray-500 leading-tight">Petshop Gross Market · Samsun Atakum</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${PHONE}`} data-testid="link-header-phone">
              <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center bg-white shadow-sm">
                <Phone className="w-4 h-4 text-gray-600" />
              </button>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="link-header-whatsapp">
              <button className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center shadow-sm">
                <SiWhatsapp className="w-4 h-4 text-white" />
              </button>
            </a>
          </div>
        </div>
      </header>


      {/* ── QUICK INFO BAR ── */}
      <div className="bg-green-600 text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 opacity-80" />
          <span className="text-xs font-medium">Her Gün 09:00–21:00</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span className="text-xs font-medium">4.8 · 120+ Yorum</span>
        </div>
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1" data-testid="link-maps-bar">
          <MapPin className="w-3.5 h-3.5 opacity-80" />
          <span className="text-xs font-medium">Haritada Gör</span>
        </a>
      </div>

      <main className="pb-36">

        {/* ── KATEGORİLER ── */}
        <section className="px-4 pt-5 pb-2" aria-label="Ürün kategorileri">
          <h2 className="text-base font-bold text-gray-800 mb-3" data-testid="text-categories-title">🛒 Ürün Kategorileri</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {categories.map((cat, i) => (
              <a key={cat.slug} href="https://www.atakumpetshop.com" target="_blank" rel="noopener noreferrer" data-testid={`link-category-${i}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className={`rounded-2xl bg-gradient-to-br ${cat.color} p-3 flex flex-col items-center justify-center gap-1.5 shadow-sm aspect-square`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-white text-[11px] font-bold text-center leading-tight">{cat.label}</span>
                  </motion.div>
                </a>
            ))}
          </div>
        </section>

        {/* ── MAĞAZA GALERİSİ ── */}
        <section className="px-4 pt-5" aria-label="Mağaza görselleri">
          <h2 className="text-base font-bold text-gray-800 mb-3" data-testid="text-gallery-title">📸 Mağazamızdan</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
            <div className="relative h-48">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeGallery}
                  src={optimizedImg(galleryImages[activeGallery].src, 600)}
                  alt={galleryImages[activeGallery].alt}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  loading="lazy"
                />
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-center gap-2 py-2.5">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`rounded-full transition-all ${i === activeGallery ? "bg-green-600 w-5 h-2" : "bg-gray-300 w-2 h-2"}`}
                  data-testid={`button-gallery-dot-${i}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── POPÜLER KATEGORİLER ── */}
        <section className="px-4 pt-5" aria-label="Popüler kategoriler">
          <h2 className="text-base font-bold text-gray-800 mb-3" data-testid="text-hub-title">📂 Popüler Kategoriler</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { slug: "kedi-mamasi", label: "Kedi Maması", emoji: "🐱" },
              { slug: "kopek-mamasi", label: "Köpek Maması", emoji: "🐶" },
              { slug: "kedi-kumu", label: "Kemirgen Sürüngen", emoji: "🐹" },
              { slug: "atakum-petshop", label: "Atakum Petshop", emoji: "📍" },
              { slug: "petshop-samsun", label: "Samsun Petshop", emoji: "🏪" },
              { slug: "kapida-teslim-petshop", label: "Kapıda Teslim", emoji: "🚚" },
            ].map(c => (
              <a key={c.slug} href="https://www.atakumpetshop.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-green-400 transition-all" data-testid={`link-hub-${c.slug}`}>
                <span className="text-xl">{c.emoji}</span>
                <span className="text-sm font-semibold text-gray-700">{c.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-auto shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* ── POPÜLER MARKALAR ── */}
        <section className="px-4 pt-5" aria-label="Popüler markalar">
          <h2 className="text-base font-bold text-gray-800 mb-3" data-testid="text-brands-title">🏷️ Popüler Markalar</h2>
          <div className="flex flex-wrap gap-2">
            {brandLinks.map(brand => (
              <Link key={brand.slug} href={`/${brand.slug}`}>
                <a data-testid={`link-brand-${brand.slug}`}>
                  <Badge variant="secondary" className="text-xs py-1 px-3 cursor-pointer bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-colors shadow-sm">
                    {brand.name}
                  </Badge>
                </a>
              </Link>
            ))}
          </div>
        </section>

        {/* ── POPÜLER ARAMALAR ── */}
        <section className="px-4 pt-5" aria-label="Popüler aramalar">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-green-600" />
            <h2 className="text-base font-bold text-gray-800" data-testid="text-popular-title">Popüler Aramalar</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(item => (
              <Link key={item.slug} href={`/${item.slug}`}>
                <a
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-colors shadow-sm"
                  data-testid={`link-popular-${item.slug}`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </section>

        {/* ── BLOG / BAKIM REHBERİ ── */}
        <section className="px-4 pt-5" aria-label="Bakım rehberleri">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-green-600" />
            <h2 className="text-base font-bold text-gray-800">Bakım Rehberi</h2>
          </div>
          <div className="space-y-2">
            {[
              { slug: "kopek-asi-takvimi-hangi-asilar-ne-zaman-yapilmali", title: "Köpek Aşı Takvimi: Hangi Aşılar Ne Zaman?", isNew: true },
              { slug: "kisir-kedi-mamasi-hangisi", title: "Kısır Kedi Maması Hangisi?", isNew: false },
              { slug: "en-iyi-kedi-mamasi-hangisi-2025-rehberi", title: "En İyi Kedi Maması 2025 Rehberi", isNew: false },
              { slug: "kopek-neden-mama-yemez-7-neden-ve-cozumler", title: "Köpek Neden Mama Yemez?", isNew: false },
            ].map(({ slug, title, isNew }, i) => (
              <Link key={slug} href={`/blog/${slug}`}>
                <a className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-green-400 transition-all" data-testid={`link-blog-home-${i}`}>
                  {isNew && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 shrink-0">YENİ</span>}
                  <span className="text-sm text-gray-700 flex-1">{title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </a>
              </Link>
            ))}
            <Link href="/blog">
              <a className="flex items-center justify-center gap-1.5 mt-1 text-sm text-green-600 font-medium hover:underline" data-testid="link-all-blogs">
                Tüm Blog Yazıları <ChevronRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </section>

        {/* ── İLETİŞİM ── */}
        <section className="px-4 pt-5" aria-label="İletişim ve konum">
          <h2 className="text-base font-bold text-gray-800 mb-3" data-testid="text-contact-title">📞 İletişim & Konum</h2>
          <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Adres</p>
                  <p className="text-xs text-gray-500 leading-relaxed" data-testid="text-address">
                    Atatürk 3. Kısım Bulvarı No:113, Atakum / Samsun
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Telefon</p>
                  <a href={`tel:${PHONE}`} className="text-xs text-green-600 font-semibold" data-testid="link-contact-phone">0542 211 49 44</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">Çalışma Saatleri</p>
                  <p className="text-xs text-gray-500" data-testid="text-working-hours">Haftanın Her Günü: 09:00 – 21:00</p>
                </div>
              </div>
            </div>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="link-google-maps"
              className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white text-sm font-semibold">
              <Navigation className="w-4 h-4" />
              Google Harita'da Aç – Yol Tarifi Al
            </a>
          </Card>
        </section>

        {/* ── SOSYAL MEDYA ── */}
        <section className="px-4 pt-4" aria-label="Sosyal medya">
          <div className="grid grid-cols-2 gap-2">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-testid="link-instagram"
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-sm">
              <SiInstagram className="w-5 h-5 text-white shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Instagram</p>
                <p className="text-[10px] text-white/80">@enuygun.pet</p>
              </div>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-social"
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#25D366] shadow-sm">
              <SiWhatsapp className="w-5 h-5 text-white shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">WhatsApp</p>
                <p className="text-[10px] text-white/80">Mesaj Gönder</p>
              </div>
            </a>
          </div>
        </section>

        {/* ── SSS ── */}
        <section className="px-4 pt-5 pb-2" aria-label="Sıkça sorulan sorular">
          <h2 className="text-base font-bold text-gray-800 mb-3" data-testid="text-faq-title">❓ Sıkça Sorulan Sorular</h2>
          <div className="space-y-2">
            <FaqItem question="Mağazada canlı hayvan satılıyor mu?" answer="Hayır, mağazamızda canlı hayvan satışı yapılmamaktadır. Sadece evcil hayvan ürünleri ve aksesuarları satılmaktadır." />
            <FaqItem question="Hangi ödeme yöntemleri kabul ediliyor?" answer="Nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz." />
            <FaqItem question="Online sipariş verebilir miyim?" answer="Şu an için online sipariş hizmetimiz bulunmamaktadır. WhatsApp üzerinden ürün sorgulayabilir ve mağazamızı ziyaret edebilirsiniz." />
            <FaqItem question="Hangi markalar mevcut?" answer="Royal Canin, Pro Plan, Acana, Orijen, Reflex, N&D, Brit Care ve daha birçok premium markanın ürünleri mağazamızda mevcuttur." />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="px-4 pt-5 pb-4 border-t border-gray-200 mt-5" data-testid="footer">
          <div className="text-center space-y-1">
            <p className="text-[10px] text-gray-400">&copy; {new Date().getFullYear()} EnuygunPet — Tüm hakları saklıdır.</p>
            <p className="text-[10px] text-gray-400">
              Tasarım:{" "}
              <a href="https://www.sizpa.net/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600">
                Sizpa Yazılım
              </a>
            </p>
          </div>
        </footer>
      </main>

      {/* ── CANLI HAYVAN UYARI ── */}
      <div className="fixed bottom-[68px] left-0 right-0 z-50 bg-red-600 text-white text-center text-[11px] font-bold py-1.5 px-3 leading-snug shadow-lg">
        🚫 CANLI HAYVAN SATIŞIMIZ YOKTUR — Ürün sormak için yukarıdaki "E-TİCARET / TIKLA ALIŞVERİŞ YAP" resmine tıklayın.
      </div>

      {/* ── ALT NAVİGASYON ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg" aria-label="Hızlı iletişim">
        <div className="flex items-center max-w-lg mx-auto">
          <a href={`tel:${PHONE}`} className="flex-1 flex flex-col items-center gap-0.5 py-3 border-r border-gray-200" data-testid="link-bottom-call">
            <Phone className="w-5 h-5 text-gray-600" />
            <span className="text-[10px] font-semibold text-gray-600">Ara</span>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center gap-0.5 py-3 bg-[#25D366] border-r border-[#20BD5A]" data-testid="link-bottom-whatsapp">
            <SiWhatsapp className="w-5 h-5 text-white" />
            <span className="text-[10px] font-semibold text-white">WhatsApp</span>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center gap-0.5 py-3" data-testid="link-bottom-map">
            <Navigation className="w-5 h-5 text-gray-600" />
            <span className="text-[10px] font-semibold text-gray-600">Yol Tarifi</span>
          </a>
        </div>
      </nav>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" data-testid={`faq-item-${question.slice(0, 20)}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 p-3.5 text-left"
        data-testid={`button-faq-${question.slice(0, 20)}`}
      >
        <span className="text-sm font-semibold text-gray-700">{question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs text-gray-500 px-3.5 pb-3.5 leading-relaxed border-t border-gray-100 pt-2">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
