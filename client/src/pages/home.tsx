import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  Star,
  ShieldCheck,
  Truck,
  Tag,
  Store,
  Heart,
  Navigation,
  Cat,
  Dog,
  Bird,
  Fish,
  Sparkles,
  CheckCircle2,
  X,
  Download,
  Share2,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { SiWhatsapp, SiInstagram, SiGoogle } from "react-icons/si";

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
  { icon: Cat, title: "Kedi", desc: "Maması", image: STORE_PHOTOS[1], slug: "kedi-mamasi" },
  { icon: Dog, title: "Köpek", desc: "Maması", image: STORE_PHOTOS[2], slug: "kopek-mamasi" },
  { icon: Bird, title: "Kuş", desc: "Ürünleri", image: STORE_PHOTOS[3], slug: "gold-wings-muhabbet-yemi" },
  { icon: Fish, title: "Akvaryum", desc: "Ürünleri", image: STORE_PHOTOS[0], slug: "balik-yemi-samsun" },
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
  { label: "Köpek Kulübesi", slug: "kopek-kulubesi" },
  { label: "Kedi Yatağı", slug: "kedi-yatagi" },
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

const features = [
  { icon: Tag, title: "En Uygun Fiyat", desc: "Gross market fiyatlarıyla tasarruf edin" },
  { icon: ShieldCheck, title: "Orijinal Ürün", desc: "Tüm markalardan orijinal ürünler" },
  { icon: Store, title: "Geniş Ürün Yelpazesi", desc: "Binlerce çeşit tek çatı altında" },
  { icon: Truck, title: "Taze & Güncel Stok", desc: "Her zaman taze ürünler" },
];

const galleryImages = [
  { src: STORE_HERO, alt: "EnuygunPet Gross Market mağaza girişi - Samsun Atakum Petshop" },
  { src: STORE_PHOTOS[0], alt: "EnuygunPet Samsun Atakum petshop gross market iç mekan ürün reyonları" },
  { src: STORE_PHOTOS[1], alt: "Samsun Atakum kedi maması ve kedi ürünleri - EnuygunPet petshop" },
  { src: STORE_PHOTOS[2], alt: "Samsun Atakum köpek maması ve köpek aksesuarları - EnuygunPet gross market" },
  { src: STORE_PHOTOS[3], alt: "Samsun Atakum kuş yemleri, muhabbet kuşu ve papağan ürünleri - EnuygunPet" },
];

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Home() {
  const [showNotice, setShowNotice] = useState(true);
  const [activeGallery, setActiveGallery] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGallery((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as any).standalone === true;

    if (isStandalone) return;

    if (ios) {
      const dismissed = localStorage.getItem("pwa-ios-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowInstallBanner(true), 3000);
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("pwa-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowInstallBanner(true), 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      setShowInstallBanner(false);
      return;
    }
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  }, [installPrompt, isIOS]);

  const dismissInstallBanner = useCallback(() => {
    setShowInstallBanner(false);
    localStorage.setItem(isIOS ? "pwa-ios-dismissed" : "pwa-dismissed", "1");
  }, [isIOS]);

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.enuygun.pet/#website",
        "url": "https://www.enuygun.pet/",
        "name": "EnuygunPet Gross Market",
        "description": "Samsun Atakum'da evcil hayvan ürünleri gross market. Kedi maması, köpek maması, kuş yemi ve aksesuar.",
        "inLanguage": "tr-TR",
        "publisher": { "@id": "https://www.enuygun.pet/#organization" }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.enuygun.pet/#webpage",
        "url": "https://www.enuygun.pet/",
        "name": "EnuygunPet Gross Market | Samsun Atakum Evcil Hayvan Ürünleri",
        "description": "Samsun Atakum'da kedi maması, köpek maması, kuş yemi ve tüm evcil hayvan ürünleri gross market fiyatıyla. Haftanın 7 günü 09:00-21:00 açık.",
        "inLanguage": "tr-TR",
        "isPartOf": { "@id": "https://www.enuygun.pet/#website" },
        "about": { "@id": "https://www.enuygun.pet/#localbusiness" },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://www.enuygun.pet/#organization",
        "name": "EnuygunPet Gross Market",
        "url": "https://www.enuygun.pet/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg"
        },
        "sameAs": [
          "https://www.facebook.com/enuygun.pet",
          "https://www.instagram.com/enuygun.pet",
          "https://x.com/enuygunpet",
          "https://www.youtube.com/@samsunenuygunpet"
        ]
      },
      {
        "@type": ["LocalBusiness", "PetStore"],
        "@id": "https://www.enuygun.pet/#localbusiness",
        "name": "EnuygunPet Gross Market",
        "alternateName": "Enuygun Pet",
        "description": "Samsun Atakum'da evcil hayvan ürünleri gross market. Kedi maması, köpek maması, kuş yemi ve aksesuar toptan fiyatıyla.",
        "url": "https://www.enuygun.pet/",
        "telephone": "+905422114944",
        "image": [
          "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg",
          "https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg",
          "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
          "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
          "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113",
          "addressLocality": "Atakum",
          "addressRegion": "Samsun",
          "postalCode": "55200",
          "addressCountry": "TR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.3286,
          "longitude": 36.2917
        },
        "hasMap": "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu",
        "openingHoursSpecification": [{
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "09:00",
          "closes": "21:00"
        }],
        "priceRange": "₺₺",
        "currenciesAccepted": "TRY",
        "paymentAccepted": "Nakit, Kredi Kartı",
        "areaServed": [
          { "@type": "City", "name": "Samsun" },
          { "@type": "AdministrativeArea", "name": "Atakum" }
        ],
        "sameAs": [
          "https://www.facebook.com/enuygun.pet",
          "https://www.instagram.com/enuygun.pet",
          "https://x.com/enuygunpet",
          "https://www.youtube.com/@samsunenuygunpet"
        ],
        "parentOrganization": { "@id": "https://www.enuygun.pet/#organization" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <AnimatePresence>
        {showNotice && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-center justify-between gap-2 px-4 py-2.5">
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-snug flex-1" data-testid="text-notice">
                <span className="font-semibold">Bilgi:</span> Mağazamızda canlı hayvan satışı yapılmamaktadır.
              </p>
              <button
                onClick={() => setShowNotice(false)}
                className="text-amber-600 dark:text-amber-400 shrink-0"
                data-testid="button-close-notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-base font-bold leading-tight text-foreground block" data-testid="text-brand-name">
                ENUYGUN<span className="text-primary">.PET</span>
              </span>
              <p className="text-[10px] text-muted-foreground leading-tight">Petshop Gross Market</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <a href={`tel:${PHONE}`} data-testid="link-header-phone">
              <Button size="icon" variant="ghost">
                <Phone className="w-4 h-4" />
              </Button>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="link-header-whatsapp">
              <Button size="icon" className="bg-[#25D366] text-white border-[#20BD5A]">
                <SiWhatsapp className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative" aria-label="Hero bölümü">
          <div className="relative h-[55vh] min-h-[340px] max-h-[480px]">
            <img
              src={optimizedImg(STORE_HERO, 800)}
              alt="EnuygunPet Samsun Atakum Petshop Gross Market mağaza görünümü"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={800}
              height={480}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-primary/90 text-primary-foreground border-0 mb-3 text-[11px]" data-testid="badge-location">
                  <MapPin className="w-3 h-3 mr-1" />
                  Samsun / Atakum
                </Badge>
                <h1 className="text-2xl font-extrabold text-white leading-tight mb-1.5" data-testid="text-hero-title">
                  Samsun Atakum Petshop Gross Market
                </h1>
                <p className="text-sm text-white/80 leading-snug mb-4 max-w-[280px]">
                  En uygun fiyatlarla binlerce evcil hayvan ürünü tek çatı altında
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="link-hero-whatsapp">
                    <Button className="bg-[#25D366] text-white border-[#20BD5A] gap-1.5 text-sm">
                      <SiWhatsapp className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href={`tel:${PHONE}`} data-testid="link-hero-call">
                    <Button variant="outline" className="backdrop-blur-sm bg-white/10 text-white border-white/30 gap-1.5 text-sm">
                      <Phone className="w-4 h-4" />
                      Ara
                    </Button>
                  </a>
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="link-hero-map">
                    <Button variant="outline" className="backdrop-blur-sm bg-white/10 text-white border-white/30 gap-1.5 text-sm">
                      <Navigation className="w-4 h-4" />
                      Yol Tarifi
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 -mt-4 relative z-10" aria-label="Hızlı bilgiler">
          <Card className="p-4 border border-card-border shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground" data-testid="text-hours">Her Gün Açık</p>
                  <p className="text-[11px] text-muted-foreground">09:00 - 21:00</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground" data-testid="text-rating">4.8 / 5</p>
                  <p className="text-[11px] text-muted-foreground">120+ Yorum</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground" data-testid="text-products">1000+</p>
                  <p className="text-[11px] text-muted-foreground">Ürün</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="px-4 mt-6" aria-label="Ürün kategorileri">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-lg font-bold text-foreground" data-testid="text-categories-title">Ürün Kategorileri</h3>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                <Link href={`/${cat.slug}`}>
                <a data-testid={`link-category-${i}`}>
                <Card className="group relative border border-card-border" data-testid={`card-category-${i}`}>
                  <div className="relative h-28 rounded-t-md">
                    <img
                      src={optimizedImg(cat.image, 400)}
                      alt={`${cat.title} - EnuygunPet Samsun`}
                      className="w-full h-full object-cover rounded-t-md"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-md" />
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 dark:bg-black/60 flex items-center justify-center">
                      <cat.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{cat.title}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{cat.desc}</p>
                  </div>
                </Card>
                </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-4 mt-8" aria-label="Kategori sayfaları">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-lg font-bold text-foreground">Popüler Kategoriler</h3>
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { slug: "kedi-mamasi", label: "Kedi Maması" },
              { slug: "kopek-mamasi", label: "Köpek Maması" },
              { slug: "kedi-kumu", label: "Kedi Kumu" },
              { slug: "atakum-petshop", label: "Atakum Petshop" },
              { slug: "petshop-samsun", label: "Samsun Petshop" },
              { slug: "kapida-teslim-petshop", label: "Kapıda Teslim" },
            ].map(c => (
              <Link key={c.slug} href={`/${c.slug}`}>
                <a className="flex items-center justify-between group p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all" data-testid={`link-hub-${c.slug}`}>
                  <span className="text-sm font-medium text-foreground">{c.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 mt-8" aria-label="Blog rehberleri">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-lg font-bold text-foreground">Bakım Rehberi</h3>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-2">
            {[
              { slug: "kopek-asi-takvimi-hangi-asilar-ne-zaman-yapilmali", title: "Köpek Aşı Takvimi: Hangi Aşılar Ne Zaman Yapılmalı?", isNew: true },
              { slug: "papagan-mamasi-ve-beslenmesi-kapsamli-rehber-2026", title: "Papağan Maması ve Beslenmesi: Kapsamlı Rehber 2026", isNew: true },
              { slug: "kisir-kedi-mamasi-hangisi", title: "Kısır Kedi Maması Hangisi", isNew: false },
              { slug: "kopek-neden-mama-yemez-7-neden-ve-cozumler", title: "Köpek Neden Mama Yemez? 7 Neden ve Çözümler", isNew: false },
              { slug: "en-iyi-kedi-mamasi-hangisi-2025-rehberi", title: "En İyi Kedi Maması Hangisi? 2025 Rehberi", isNew: false },
            ].map(({ slug, title, isNew }, i) => (
              <Link key={slug} href={`/blog/${slug}`}>
                <a className="flex items-center justify-between group p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all" data-testid={`link-blog-home-${i}`}>
                  <span className="text-sm text-foreground flex items-center gap-2">
                    {isNew && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 shrink-0">YENİ</span>}
                    {title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </Link>
            ))}
            <Link href="/blog">
              <a className="flex items-center justify-center gap-1.5 mt-1 text-sm text-primary hover:underline" data-testid="link-all-blogs">
                Tüm Blog Yazıları
                <ChevronRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </section>

        <section className="px-4 mt-8" aria-label="Neden bizi tercih etmelisiniz">
          <h2 className="text-lg font-bold text-foreground mb-3" data-testid="text-features-title">Neden EnuygunPet?</h2>
          <div className="space-y-2.5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.5 }}
              >
                <div className="flex items-center gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`feature-${i}`}>
                  <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Rich content section (500+ words, H2 sections) ── */}
        <section className="px-4 mt-10 space-y-7" aria-label="EnuygunPet hakkında" data-testid="section-rich-content">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-2" data-testid="text-rich-h2-1">
              Samsun Atakum'un En Büyük Petshop Gross Marketi
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-rich-p1">
              EnuygunPet, Samsun'un Atakum ilçesinde Atatürk Bulvarı No:113 adresinde hizmet veren petshop gross marketidir. Gross market formatıyla faaliyet gösteren mağazamız, perakende petshopların çok altında fiyatlarla kedi maması, köpek maması, kuş yemi ve tüm evcil hayvan ürünlerini müşterilerimize sunmaktadır. Büyük gramajlı ürünleri toplu temin ettiğimiz için birim maliyetlerimiz düşük tutulabilmektedir; bu avantajı doğrudan müşterilerimize yansıtıyoruz. Haftanın her günü 09:00-21:00 arası kesintisiz açığız, Pazar ve resmi tatillerde de kapılarımızı kapatmıyoruz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-2" data-testid="text-rich-h2-2">
              Kedi Sahiplerine Özel Geniş Ürün Seçeneği
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-rich-p2">
              Kedi maması seçimi; yaş, kısırlaştırma durumu ve sağlık geçmişine göre farklılık göstermektedir. Mağazamızda Royal Canin, Hills Science Plan, Pro Plan, Brit Care, Reflex, Acana, Orijen, Felicia ve N&D başta olmak üzere 20'yi aşkın markanın kedi mamasını bulabilirsiniz. Yavru kedi, yetişkin kedi, kısırlaştırılmış kedi ve özel diyet mamaları (böbrek, üriner, idrar yolu) ayrı ayrı stoklanmaktadır. Kedi kumu konusunda ise topaklanan bentonit kum, silika kristal kum, doğal odun talaşı ve tozsuz pelet seçenekleri mevcuttur. Bunların yanı sıra kedi tırmalama tahtaları, yataklar, taşıma çantaları ve oyuncaklar da raflarımızda hazır bulunmaktadır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-2" data-testid="text-rich-h2-3">
              Köpek Sahipleri İçin Her Şey Tek Çatı Altında
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-rich-p3">
              Köpek maması seçiminde ırkın büyüklüğü, yaşı ve aktivite düzeyi belirleyici rol oynar. Mağazamızda Royal Canin Breed Specific serisi, Pro Plan Performance, Hills Science Plan, Brit Care Grain Free, Acana ve Orijen gibi premium markaların yanı sıra uygun bütçeli seçenekler de yer almaktadır. Küçük ırk, orta ırk ve büyük ırk mamaları ayrı olarak stoklanmaktadır. Tasma, koşum, gezdirme ipi, kafes, oyuncak, yatak, şampuan, tarak ve diş bakım ürünleri gibi köpek aksesuarlarına da tek adresten ulaşabilirsiniz. Özellikle büyük gramajlı köpek mamalarında (15 kg ve üzeri) gross market fiyat avantajımız belirgin biçimde hissedilmektedir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-2" data-testid="text-rich-h2-4">
              Kuş, Akvaryum ve Küçük Hayvan Ürünleri
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-rich-p4">
              Muhabbet kuşu, kanarya, sultan papağanı ve Afrika gri papağanı gibi farklı kuş türleri için özel formüle edilmiş yemler, kafesler, tünekler, mineral taşları ve vitamin takviyeleri sunmaktayız. Akvaryum tutkunları için tatlı su ve tuzlu su balıkları yemleri, filtre sistemleri, hava motorları, termometreler ve dekor ürünleri geniş seçeneklerle mevcuttur. Hamster, tavşan, guinea pig ve diğer küçük hayvanlar için mama, altlık malzemeleri ve kafesler de mağazamızda bulunmaktadır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-2" data-testid="text-rich-h2-5">
              Gross Market Fiyat Avantajı Nasıl İşliyor?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-rich-p5">
              Gross market modeli, ürünleri büyük miktarda temin ederek birim maliyetleri düşüren bir ticaret biçimidir. Perakende petshoplar küçük miktarlarda stok tutarken biz aynı ürünü palet ve koli olarak satın alırız; bu da birim fiyatı önemli ölçüde aşağı çeker. Mağazamızda perakende fiyatlara kıyasla yüzde otuz ila elli arasında tasarruf etmek mümkündür. Özellikle büyük gramaj tercihi yapan çok kedili ya da köpekli haneler, yılda yüzlerce lira tasarruf sağlamaktadır. Toplu alım yapan müşterilerimize ek indirim uygulaması da mevcuttur.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-2" data-testid="text-rich-h2-6">
              Uzman Danışmanlık ve Kişisel Hizmet
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-rich-p6">
              Hangi mamayı seçeceğinizi bilmiyorsanız, kedi kumunun farkları konusunda kafanız karışıksa ya da köpeğiniz için ideal gramaj ve beden arıyorsanız mağazamızdaki deneyimli personelimiz size ücretsiz danışmanlık sunar. Veteriner tavsiyeleriyle örtüşen, kanıtlanmış ürün önerileri yapıyoruz. WhatsApp hattımız (+90 542 211 49 44) üzerinden görüntülü ya da yazılı danışma da yapabilirsiniz; ürün fotoğrafı göndererek stok ve fiyat sorabilirsiniz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-2" data-testid="text-rich-h2-7">
              Samsun'un Her Noktasından Bize Ulaşın
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-rich-p7">
              Mağazamız Samsun Atakum'da Atatürk Bulvarı üzerinde, ana arterde konumlanan tek katlı bir gross market yapısındadır. Önünde ücretsiz otopark imkânı bulunmaktadır. Minibüs ve dolmuş güzergahlarıyla ulaşımı kolaydır. İlkadım, Canik, Tekkeköy ve Samsun merkezden 15-30 dakika içinde ulaşılabilecek mesafededir. Google Harita üzerinden "EnuygunPet" aratarak doğrudan yol tarifi alabilirsiniz. Ayrıca Samsun içi WhatsApp üzerinden sipariş verip kapınıza teslim seçeneğimizden de yararlanabilirsiniz.
            </p>
          </div>
        </section>

        <section className="px-4 mt-8" aria-label="Mağaza görselleri">
          <h3 className="text-lg font-bold text-foreground mb-3" data-testid="text-gallery-title">Mağazamızdan Kareler</h3>
          <div className="relative rounded-md border border-card-border bg-card">
            <div className="relative h-52 rounded-t-md">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeGallery}
                  src={optimizedImg(galleryImages[activeGallery].src, 600)}
                  alt={galleryImages[activeGallery].alt}
                  className="w-full h-full object-cover rounded-t-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  loading="lazy"
                  decoding="async"
                />
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-3">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeGallery ? "bg-primary w-5" : "bg-muted-foreground/30"
                  }`}
                  data-testid={`button-gallery-dot-${i}`}
                  aria-label={`Görsel ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 mt-8" aria-label="Popüler markalar">
          <h3 className="text-lg font-bold text-foreground mb-3" data-testid="text-brands-title">Popüler Markalar</h3>
          <div className="flex flex-wrap gap-2">
            {brandLinks.map((brand) => (
              <Link key={brand.slug} href={`/${brand.slug}`}>
                <a data-testid={`link-brand-${brand.slug}`}>
                  <Badge variant="secondary" className="text-xs py-1 px-2.5 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                    {brand.name}
                  </Badge>
                </a>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 mt-8" aria-label="Popüler aramalar">
          <h3 className="text-lg font-bold text-foreground mb-3" data-testid="text-popular-title">Popüler Aramalar</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item) => (
              <Link key={item.slug} href={`/${item.slug}`}>
                <a
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/40 text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                  data-testid={`link-popular-${item.slug}`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 mt-8" aria-label="Konum ve iletişim">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground" data-testid="text-contact-title">Konum & İletişim</h2>
            <Link href="/iletisim" className="text-xs text-primary font-medium" data-testid="link-iletisim">Tümü →</Link>
          </div>
          <Card className="border border-card-border">
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Adres</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed" data-testid="text-address">
                    Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113
                    <br />Atakum / SAMSUN
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Telefon</h3>
                  <a href={`tel:${PHONE}`} className="text-xs text-primary font-medium mt-0.5 block" data-testid="link-contact-phone">
                    0542 211 49 44
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Çalışma Saatleri</h3>
                  <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-working-hours">
                    Haftanın Her Günü: 09:00 - 21:00
                  </p>
                </div>
              </div>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-testid="link-google-maps"
              >
                <div className="relative h-40 rounded-md bg-muted flex items-center justify-center border border-border">
                  <div className="text-center">
                    <SiGoogle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Google Harita'da Aç</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Yol tarifi almak için dokunun</p>
                  </div>
                </div>
              </a>
            </div>
          </Card>
        </section>

        <section className="px-4 mt-8 mb-6" aria-label="Sosyal medya">
          <h3 className="text-lg font-bold text-foreground mb-3" data-testid="text-social-title">Bizi Takip Edin</h3>
          <div className="grid grid-cols-2 gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-testid="link-instagram">
              <Card className="p-4 border border-card-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shrink-0">
                  <SiInstagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Instagram</p>
                  <p className="text-[11px] text-muted-foreground">@enuygun.pet</p>
                </div>
              </Card>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-social">
              <Card className="p-4 border border-card-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                  <SiWhatsapp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">WhatsApp</p>
                  <p className="text-[11px] text-muted-foreground">Mesaj Gönder</p>
                </div>
              </Card>
            </a>
          </div>
        </section>

        <section className="px-4 pb-4" aria-label="Sıkça sorulan sorular">
          <h2 className="text-lg font-bold text-foreground mb-3" data-testid="text-faq-title">Sıkça Sorulan Sorular</h2>
          <div className="space-y-2.5">
            <FaqItem
              question="Mağazada canlı hayvan satılıyor mu?"
              answer="Hayır, mağazamızda canlı hayvan satışı yapılmamaktadır. Sadece evcil hayvan ürünleri ve aksesuarları satılmaktadır."
            />
            <FaqItem
              question="Hangi ödeme yöntemlerini kabul ediyorsunuz?"
              answer="Nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz."
            />
            <FaqItem
              question="Online sipariş verebilir miyim?"
              answer="Şu an için online sipariş hizmetimiz bulunmamaktadır. WhatsApp üzerinden ürün sorgulayabilir ve mağazamızı ziyaret edebilirsiniz."
            />
            <FaqItem
              question="Hangi markaların ürünleri mevcut?"
              answer="Royal Canin, Pro Plan, Acana, Orijen, Reflex, N&D, Brit Care ve daha birçok premium markanın ürünleri mağazamızda mevcuttur."
            />
          </div>
        </section>

        <footer className="px-4 pt-6 pb-28 border-t border-border mt-6" data-testid="footer">
          <div className="text-center space-y-1.5">
            <p className="text-[10px] text-muted-foreground/70">&copy; {new Date().getFullYear()} EnuygunPet — Tüm hakları saklıdır.</p>
            <p className="text-[10px] text-muted-foreground/60">
              Bu web sitesi,{" "}
              <a href="https://www.sizpa.net/" target="_blank" rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors">
                Sizpa Yazılım
              </a>{" "}
              tarafından tasarlanmış ve geliştirilmiştir.
            </p>
          </div>
        </footer>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-bottom" aria-label="Hızlı iletişim">
        <div className="flex items-center justify-around gap-1 px-2 py-2 pb-3 max-w-lg mx-auto">
          <a href={`tel:${PHONE}`} className="flex-1" data-testid="link-bottom-call">
            <Button variant="outline" className="w-full gap-1.5 text-xs h-11">
              <Phone className="w-4 h-4" />
              Ara
            </Button>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex-1" data-testid="link-bottom-whatsapp">
            <Button className="w-full gap-1.5 text-xs h-11 bg-[#25D366] text-white border-[#20BD5A]">
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp
            </Button>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex-1" data-testid="link-bottom-map">
            <Button variant="outline" className="w-full gap-1.5 text-xs h-11">
              <Navigation className="w-4 h-4" />
              Yol Tarifi
            </Button>
          </a>
        </div>
      </nav>

      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-3 right-3 z-[60] max-w-lg mx-auto"
          >
            <Card className="p-4 border border-primary/30 bg-card shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">Uygulamayı Yükle</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    EnuygunPet'i telefonunuza ekleyin, her zaman hızlı erişim sağlayın.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" onClick={handleInstall} className="gap-1.5 text-xs" data-testid="button-install-pwa">
                      <Download className="w-3.5 h-3.5" />
                      Yükle
                    </Button>
                    <Button size="sm" variant="ghost" onClick={dismissInstallBanner} className="text-xs" data-testid="button-dismiss-install">
                      Daha Sonra
                    </Button>
                  </div>
                </div>
                <button onClick={dismissInstallBanner} className="text-muted-foreground shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 flex items-end justify-center"
            onClick={() => setShowIOSGuide(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-5 rounded-b-none border-t border-card-border">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-base font-bold text-foreground">Ana Ekrana Ekle</h3>
                  <button onClick={() => setShowIOSGuide(false)}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">1</div>
                    <p className="text-sm text-foreground">
                      Alt kısımdaki <Share2 className="w-4 h-4 inline text-blue-500" /> paylaş butonuna dokunun
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">2</div>
                    <p className="text-sm text-foreground">
                      "Ana Ekrana Ekle" seçeneğine dokunun
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">3</div>
                    <p className="text-sm text-foreground">
                      "Ekle" butonuna dokunun
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-5" onClick={() => setShowIOSGuide(false)} data-testid="button-close-ios-guide">
                  Anladım
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border border-card-border bg-card" data-testid={`faq-item-${question.slice(0, 20)}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 p-3 text-left"
        data-testid={`button-faq-${question.slice(0, 20)}`}
      >
        <span className="text-sm font-medium text-foreground">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs text-muted-foreground px-3 pb-3 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}