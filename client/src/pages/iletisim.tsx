import { useEffect } from "react";
import { Link } from "wouter";
import { useTrack } from "@/hooks/use-track";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MapPin,
  Clock,
  ChevronLeft,
  Mail,
  Navigation,
} from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook, SiX, SiYoutube, SiGoogle } from "react-icons/si";

const PHONE = "+905422114944";
const WHATSAPP_URL = `https://wa.me/905422114944?text=Merhaba,%20Enuygun.pet%20mağazanızdaki%20ürünler%20hakkında%20bilgi%20almak%20istiyorum.`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";
const INSTAGRAM_URL = "https://www.instagram.com/enuygun.pet/";
const FACEBOOK_URL = "https://www.facebook.com/enuygun.pet";
const TWITTER_URL = "https://x.com/enuygunpet";
const YOUTUBE_URL = "https://www.youtube.com/@samsunenuygunpet";

function setMeta(name: string, content: string, prop = false) {
  const attr = prop ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.enuygun.pet/iletisim#webpage",
      "url": "https://www.enuygun.pet/iletisim",
      "name": "İletişim | EnuygunPet Samsun Atakum Petshop",
      "description": "EnuygunPet Gross Market iletişim bilgileri. Adres: Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113 Atakum/Samsun. Telefon: 0542 211 49 44.",
      "inLanguage": "tr",
      "isPartOf": { "@id": "https://www.enuygun.pet/#website" },
    },
    {
      "@type": ["LocalBusiness", "PetStore"],
      "@id": "https://www.enuygun.pet/#localbusiness",
      "name": "EnuygunPet Gross Market",
      "url": "https://www.enuygun.pet",
      "telephone": "+905422114944",
      "email": "info@enuygun.pet",
      "image": "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg",
      "priceRange": "₺₺",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113",
        "addressLocality": "Atakum",
        "addressRegion": "Samsun",
        "postalCode": "55200",
        "addressCountry": "TR",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 41.349366,
        "longitude": 36.243738,
      },
      "hasMap": "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "09:00",
          "closes": "21:00",
        },
      ],
      "sameAs": [
        "https://www.instagram.com/enuygun.pet/",
        "https://www.facebook.com/enuygun.pet",
        "https://x.com/enuygunpet",
        "https://www.youtube.com/@samsunenuygunpet",
        "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu",
      ],
      "areaServed": [
        { "@type": "City", "name": "Samsun" },
        { "@type": "AdministrativeArea", "name": "Atakum" },
      ],
    },
  ],
};

export default function IletisimPage() {
  useTrack("iletisim", "İletişim Sayfası");
  useEffect(() => {
    document.title = "İletişim | EnuygunPet – Samsun Atakum Petshop Gross Market";
    setMeta("description", "EnuygunPet Gross Market iletişim bilgileri. Adres: Atatürk 3. Kısım Bulvarı No:113 Atakum/Samsun. Tel: 0542 211 49 44. Haftanın 7 günü 09:00-21:00 açık.");
    setMeta("robots", "index, follow");
    setMeta("og:title", "İletişim | EnuygunPet Samsun Atakum Petshop", true);
    setMeta("og:description", "Adres, telefon, çalışma saatleri ve sosyal medya hesaplarımız.", true);
    setMeta("og:url", "https://www.enuygun.pet/iletisim", true);
    setMeta("og:type", "website", true);
    setLink("canonical", "https://www.enuygun.pet/iletisim");

    let sd = document.getElementById("ld-iletisim");
    if (!sd) {
      sd = document.createElement("script");
      sd.id = "ld-iletisim";
      (sd as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(sd);
    }
    sd.textContent = JSON.stringify(schema);
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-24">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
        <Link href="/" data-testid="link-back-home">
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        </Link>
        <div>
          <h1 className="text-base font-bold text-foreground leading-tight">İletişim</h1>
          <p className="text-[11px] text-muted-foreground">EnuygunPet Gross Market</p>
        </div>
      </header>

      <main className="px-4 pt-5 space-y-4">

        <Card className="border border-card-border overflow-hidden">
          <div className="p-4 space-y-4">

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Adres</h2>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed" data-testid="text-address">
                  Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113<br />
                  Atakum / SAMSUN
                </p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary font-medium mt-1"
                  data-testid="link-maps-address"
                >
                  <Navigation className="w-3 h-3" />
                  Yol tarifi al
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Telefon</h2>
                <a
                  href={`tel:${PHONE}`}
                  className="text-xs text-primary font-medium mt-0.5 block"
                  data-testid="link-phone"
                >
                  0542 211 49 44
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Çalışma Saatleri</h2>
                <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-hours">
                  Pazartesi – Pazar: 09:00 – 21:00
                </p>
                <p className="text-[11px] text-muted-foreground">Resmi tatillerde de açığız</p>
              </div>
            </div>

          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <a href={`tel:${PHONE}`} data-testid="button-call">
            <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Phone className="w-4 h-4" />
              Ara
            </Button>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="button-whatsapp">
            <Button variant="outline" className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20">
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp
            </Button>
          </a>
        </div>

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          data-testid="link-google-maps"
        >
          <Card className="border border-card-border">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <SiGoogle className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Google Harita'da Aç</p>
                <p className="text-[11px] text-muted-foreground">Yol tarifi ve değerlendirmeler</p>
              </div>
              <Navigation className="w-4 h-4 text-primary" />
            </div>
          </Card>
        </a>

        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3" data-testid="text-social-title">Sosyal Medya</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-testid="link-instagram">
              <Card className="p-3 border border-card-border flex items-center gap-2 hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shrink-0">
                  <SiInstagram className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Instagram</p>
                  <p className="text-[10px] text-muted-foreground">@enuygun.pet</p>
                </div>
              </Card>
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" data-testid="link-facebook">
              <Card className="p-3 border border-card-border flex items-center gap-2 hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <SiFacebook className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Facebook</p>
                  <p className="text-[10px] text-muted-foreground">enuygun.pet</p>
                </div>
              </Card>
            </a>
            <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" data-testid="link-twitter">
              <Card className="p-3 border border-card-border flex items-center gap-2 hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                  <SiX className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">X (Twitter)</p>
                  <p className="text-[10px] text-muted-foreground">@enuygunpet</p>
                </div>
              </Card>
            </a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" data-testid="link-youtube">
              <Card className="p-3 border border-card-border flex items-center gap-2 hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                  <SiYoutube className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">YouTube</p>
                  <p className="text-[10px] text-muted-foreground">@samsunenuygunpet</p>
                </div>
              </Card>
            </a>
          </div>
        </div>

        <Card className="border border-card-border">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-foreground mb-2">Hakkımızda</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              EnuygunPet, Samsun Atakum'da Atatürk Bulvarı No:113 adresinde hizmet veren petshop gross marketidir.
              Kedi maması, köpek maması, kuş yemi ve tüm evcil hayvan ürünlerini gross market fiyatıyla sunuyoruz.
              Haftanın 7 günü 09:00–21:00 arası kesintisiz açığız.
            </p>
          </div>
        </Card>

      </main>
    </div>
  );
}
