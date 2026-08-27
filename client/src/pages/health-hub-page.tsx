import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useTrack } from "@/hooks/use-track";
import SiteHeader from "@/components/site-header";
import { Phone, MapPin, Clock, ChevronRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import NotFound from "@/pages/not-found";
import SeoArticleBody from "@/components/seo-article-body";
import { buildKeywordArticle } from "@shared/seo-article";

const PHONE = "+905422114944";
const WHATSAPP_URL = `https://wa.me/905422114944`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";

const GUIDES: Record<string, {
  title: string;
  h1: string;
  desc: string;
  prefix: string;
  links: { href: string; label: string }[];
}> = {
  kedi: {
    title: "Kedi Sağlığı ve Beslenme Rehberi | EnuygunPet",
    h1: "Kedi Sağlığı ve Beslenme Rehberi",
    desc: "Kedi beslenmesi, kısırlaştırma sonrası diyet ve tüy bakımı. Samsun Atakum'da uzman danışmanlık için EnuygunPet.",
    prefix: "kedi-hastaliklari",
    links: [
      { href: "/kedi-mamasi", label: "Kedi Maması" },
      { href: "/blog/kisir-kedi-mamasi-hangisi", label: "Kısır Kedi Maması Rehberi" },
      { href: "/blog/kedi-tuy-dokulmesi-nedenleri-ve-cozumler", label: "Kedi Tüy Dökülmesi" },
      { href: "/kedi-urunleri", label: "Tüm Kedi Ürünleri" },
    ],
  },
  kopek: {
    title: "Köpek Sağlığı ve Beslenme Rehberi | EnuygunPet",
    h1: "Köpek Sağlığı ve Beslenme Rehberi",
    desc: "Köpek beslenmesi, ırka özel diyet ve yavru bakımı. Samsun Atakum'da uzman danışmanlık için EnuygunPet.",
    prefix: "kopek-hastaliklari",
    links: [
      { href: "/kopek-mamasi", label: "Köpek Maması" },
      { href: "/blog/kopek-mamasi-secimi-tam-rehber-2025", label: "Köpek Maması Seçimi" },
      { href: "/blog/yavru-kopek-bakim-rehberi-ilk-haftalar", label: "Yavru Köpek Bakımı" },
      { href: "/kopek-urunleri", label: "Tüm Köpek Ürünleri" },
    ],
  },
  kus: {
    title: "Kuş Sağlığı ve Beslenme Rehberi | EnuygunPet",
    h1: "Kuş Sağlığı ve Beslenme Rehberi",
    desc: "Muhabbet kuşu, papağan ve kanarya bakımı. Samsun Atakum'da kuş ürünleri için EnuygunPet Gross Market.",
    prefix: "muhabbet-kusu-hastaliklari",
    links: [
      { href: "/kus-urunleri", label: "Kuş Ürünleri" },
      { href: "/blog/muhabbet-kusu-nasil-beslenir-dogru-diyet", label: "Muhabbet Kuşu Beslenmesi" },
      { href: "/blog/papagan-mamasi-ve-beslenmesi-kapsamli-rehber-2026", label: "Papağan Beslenmesi" },
    ],
  },
  balik: {
    title: "Balık ve Akvaryum Bakım Rehberi | EnuygunPet",
    h1: "Balık ve Akvaryum Bakım Rehberi",
    desc: "Akvaryum kurulumu, su kalitesi ve balık beslenmesi. Samsun Atakum'da akvaryum ürünleri EnuygunPet'te.",
    prefix: "balik-urunleri",
    links: [
      { href: "/balik-urunleri", label: "Balık ve Akvaryum Ürünleri" },
      { href: "/blog/balik-akvaryumu-kurma-baslangic-rehberi", label: "Akvaryum Kurulum Rehberi" },
    ],
  },
};

export default function HealthHubPage() {
  const [, params] = useRoute("/saglik/:animal");
  const animal = params?.animal || "";
  const guide = GUIDES[animal];
  useTrack(guide ? `saglik/${animal}` : "", animal);

  useEffect(() => {
    if (!guide) return;
    const canonicalUrl = `https://www.enuygun.pet/saglik/${animal}`;
    document.title = guide.title;
    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel);
      if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) { el = document.createElement("link"); el.setAttribute("rel", rel); document.head.appendChild(el); }
      el.setAttribute("href", href);
    };
    setLink("canonical", canonicalUrl);
    setMeta('meta[name="description"]', "content", guide.desc);
    setMeta('meta[property="og:title"]', "content", guide.title);
    setMeta('meta[property="og:description"]', "content", guide.desc);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
  }, [guide, animal]);

  if (!guide) return <NotFound />;

  const article = buildKeywordArticle(guide.h1, `saglik/${animal}`);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <nav className="text-xs text-muted-foreground flex items-center gap-1">
          <Link href="/"><a>Ana Sayfa</a></Link>
          <ChevronRight className="w-3 h-3" />
          <span>{guide.h1}</span>
        </nav>
        <h1 className="text-2xl font-bold">{guide.h1}</h1>
        <p className="text-sm text-muted-foreground">{guide.desc}</p>
        <ul className="space-y-2">
          {guide.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>
                <a className="text-primary font-medium underline">{l.label}</a>
              </Link>
            </li>
          ))}
        </ul>
        <SeoArticleBody article={article} testId="health-hub-article" />
        <div className="flex flex-wrap gap-2 pt-2">
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-1 text-sm"><Phone className="w-4 h-4" /> 0542 211 49 44</a>
          <a href={WHATSAPP_URL} className="inline-flex items-center gap-1 text-sm"><SiWhatsapp className="w-4 h-4" /> WhatsApp</a>
          <a href={MAPS_URL} className="inline-flex items-center gap-1 text-sm"><MapPin className="w-4 h-4" /> Yol tarifi</a>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Her gün 09:00–21:00 · Atatürk Bulvarı No:113 Atakum / Samsun</p>
      </main>
    </div>
  );
}
