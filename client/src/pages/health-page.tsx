import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTrack } from "@/hooks/use-track";
import SiteHeader from "@/components/site-header";
import { Phone, MapPin, ChevronRight, AlertTriangle, Stethoscope, ShoppingBag } from "lucide-react";
import InternalLinksSection, { detectType } from "@/components/internal-links";
import { SiWhatsapp } from "react-icons/si";
import { Card } from "@/components/ui/card";
import NotFound from "@/pages/not-found";
import SeoArticleBody from "@/components/seo-article-body";
import {
  buildHealthArticle,
  buildKeywordDescription,
  keywordAsTitle,
} from "@shared/seo-article";
import {
  PHONE_E164 as PHONE,
  PHONE_INTL,
  PHONE_WHATSAPP_URL as WHATSAPP_URL,
  STORE_MAPS_URL as MAPS_URL,
  STORE_ADDRESS_SHORT as ADDRESS,
  STORE_STREET,
  STORE_POSTAL,
  STORE_LAT,
  STORE_LNG,
} from "@shared/store-info";

interface HealthData {
  keyword: string;
  slug: string;
  category: string;
  categoryName: string;
  animalTr: string;
  urlPrefix: string;
  related: Array<{ keyword: string; slug: string }>;
}

export default function HealthPage() {
  const [, params] = useRoute("/:prefix/:slug");
  useTrack(params?.slug || "", params?.slug || "");

  const [matchedKedi, paramsKedi]     = useRoute("/kedi-hastaliklari/:slug");
  const [matchedKopek, paramsKopek]   = useRoute("/kopek-hastaliklari/:slug");
  const [matchedPapagan, paramsP]     = useRoute("/papagan-hastaliklari/:slug");
  const [matchedMuhabbet, paramsMuh]  = useRoute("/muhabbet-kusu-hastaliklari/:slug");

  let animal = "";
  let slug = "";

  if (matchedKedi)     { animal = "kedi";     slug = paramsKedi?.slug || ""; }
  else if (matchedKopek)    { animal = "kopek";    slug = paramsKopek?.slug || ""; }
  else if (matchedPapagan)  { animal = "papagan";  slug = paramsP?.slug || ""; }
  else if (matchedMuhabbet) { animal = "muhabbet"; slug = paramsMuh?.slug || ""; }

  const { data, isLoading, isError } = useQuery<HealthData>({
    queryKey: ["/api/health", animal, slug],
    queryFn: () => fetch(`/api/health/${animal}/${slug}`).then(r => {
      if (!r.ok) throw new Error("not found");
      return r.json();
    }),
    enabled: !!animal && !!slug,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      const title = keywordAsTitle(data.keyword);
      const desc = buildKeywordDescription(`${data.animalTr} bakım ürünleri`);
      document.title = title;
      const built = buildHealthArticle(data.keyword, data.animalTr, data.category, data.slug);
      const imgUrl = built.images[0]?.src || "";

      const setMeta = (sel: string, attr: string, val: string) => {
        let el = document.querySelector(sel);
        if (!el) { el = document.createElement("meta"); document.head.appendChild(el); }
        el.setAttribute(attr, val);
      };
      const setLink = (rel: string, href: string) => {
        let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
        if (!el) { el = document.createElement("link") as HTMLLinkElement; el.setAttribute("rel", rel); document.head.appendChild(el); }
        el.setAttribute("href", href);
      };
      const canonicalUrl = `https://www.enuygun.pet/${data.urlPrefix}/${data.slug}`;
      setLink("canonical", canonicalUrl);
      setMeta('meta[name="robots"]', "content", "noindex, follow");
      setMeta('meta[name="description"]', "content", desc);
      setMeta('meta[property="og:title"]', "content", title);
      setMeta('meta[property="og:description"]', "content", desc);
      setMeta('meta[property="og:image"]', "content", imgUrl);
      setMeta('meta[property="og:image:alt"]', "content", `${data.keyword} - ${data.animalTr} Sağlığı EnuygunPet`);
      setMeta('meta[property="og:url"]', "content", canonicalUrl);
      setMeta('meta[property="og:type"]', "content", "article");
      setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
      setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
      setMeta('meta[name="twitter:title"]', "content", title);
      setMeta('meta[name="twitter:description"]', "content", desc);
      setMeta('meta[name="twitter:image"]', "content", imgUrl);
    }
  }, [data, animal]);

  if (!animal || !slug) return <NotFound />;
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground text-sm">Yükleniyor...</div>
    </div>
  );
  if (isError || !data) return <NotFound />;

  const article = buildHealthArticle(data.keyword, data.animalTr, data.category, data.slug);
  const { faqs, productRec } = article;
  const imgUrl = article.images[0]?.src || "";

  const LOGO_IMG = "https://www.enuygun.pet/images/magaza/magaza-1200.webp";
  const articleImgObj = {
    "@type": "ImageObject",
    "url": imgUrl,
    "contentUrl": imgUrl,
    "name": `${data.keyword} - ${data.animalTr} Sağlığı | EnuygunPet Samsun Atakum`,
    "description": `${data.keyword} hakkında bilgi: belirtiler, nedenler, öneriler ve EnuygunPet'te ${data.animalTr.toLowerCase()} sağlık ürünleri.`,
    "caption": `${data.keyword} | EnuygunPet Samsun Atakum ${data.animalTr} Sağlığı`,
    "representativeOfPage": true,
    "license": "https://www.enuygun.pet",
    "acquireLicensePage": "https://www.enuygun.pet",
    "creditText": "EnuygunPet Gross Market",
    "creator": { "@type": "Organization", "name": "EnuygunPet Gross Market" },
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://www.enuygun.pet/${data.urlPrefix}/${data.slug}#article`,
        "headline": `${data.keyword} - ${data.animalTr} Sağlığı`,
        "description": `${data.keyword} hakkında belirtiler, nedenler ve öneriler.`,
        "image": articleImgObj,
        "thumbnailUrl": imgUrl,
        "author": { "@type": "Organization", "name": "EnuygunPet Gross Market" },
        "publisher": {
          "@type": "Organization",
          "name": "EnuygunPet Gross Market",
          "logo": {
            "@type": "ImageObject",
            "url": LOGO_IMG,
            "width": 600,
            "height": 315,
            "caption": "EnuygunPet Gross Market - Samsun Atakum Petshop"
          }
        },
        "datePublished": "2025-01-01",
        "dateModified": new Date().toISOString().split("T")[0],
        "mainEntityOfPage": `https://www.enuygun.pet/${data.urlPrefix}/${data.slug}`,
      },
      articleImgObj,
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": `${data.animalTr} Sağlığı`, "item": `https://www.enuygun.pet/${data.urlPrefix}` },
          { "@type": "ListItem", "position": 3, "name": data.keyword, "item": `https://www.enuygun.pet/${data.urlPrefix}/${data.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      },
      {
        "@type": ["LocalBusiness", "PetStore"],
        "@id": "https://www.enuygun.pet/#localbusiness",
        "name": "EnuygunPet Gross Market",
        "alternateName": "Enuygun Pet",
        "description": "Samsun Atakum'da evcil hayvan ürünleri gross market. Kedi maması, köpek maması, kuş yemi ve aksesuar toptan fiyatıyla.",
        "url": "https://www.enuygun.pet/",
        "telephone": PHONE,
        "image": [
          "https://www.enuygun.pet/images/magaza/magaza-1200.webp",
          "https://www.enuygun.pet/images/magaza/reyonlar-1200.webp",
          "https://www.enuygun.pet/images/magaza/kedi-1200.webp",
          "https://www.enuygun.pet/images/magaza/kopek-1200.webp",
          "https://www.enuygun.pet/images/magaza/kus-1200.webp"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": STORE_STREET,
          "addressLocality": "Atakum",
          "addressRegion": "Samsun",
          "postalCode": STORE_POSTAL,
          "addressCountry": "TR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": STORE_LAT,
          "longitude": STORE_LNG
        },
        "hasMap": MAPS_URL,
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
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <SiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-foreground font-medium">{data.animalTr} Sağlığı</span>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-foreground font-medium truncate max-w-[180px]">{data.keyword}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight" data-testid="health-page-title">
          {data.keyword}
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          {data.categoryName} — {data.animalTr} Sağlık Bilgisi
        </p>

        {/* Disclaimer */}
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-900">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
          <p>
            Bu sayfa genel bilgi amaçlıdır ve veteriner tanısının yerini tutmaz.
            Evcil hayvanınızın sağlığı için lütfen bir veterinere başvurun.
          </p>
        </div>

        <SeoArticleBody article={article} testId="health-article" />

        {/* Store information */}
        <section className="mb-6 space-y-3">
          <h2 className="text-base font-bold text-foreground">EnuygunPet'te Ürün ve Destek</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Evcil hayvanınız için mama, takviye veya bakım ürünü ararken veterinerin verdiği ürün adını, kullanım amacını ve hayvanın güncel kilosunu not edin. Petshop ürünü tanı ya da tedavinin yerine geçmez.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tam ürün adı ve gramajla WhatsApp hattımızdan ({PHONE_INTL}) güncel stok bilgisi alabilirsiniz. Haftanın her günü 09:00–21:00 arasında {ADDRESS} adresindeyiz.
          </p>
          <h3 className="text-sm font-bold text-foreground">Güvenli Ürün Seçimi</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Etikette hedef hayvan türünü, kullanım talimatını, son kullanma tarihini ve uyarıları kontrol edin. İlaç niteliğindeki ürünleri yalnızca veteriner yönlendirmesiyle kullanın.
          </p>
        </section>

        {/* Product recommendation */}
        <Card className="p-5 mb-8 border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Bu Sorun İçin Önerilen Ürünler</h3>
              <p className="text-sm text-muted-foreground mb-3">{productRec}</p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                data-testid="btn-product-whatsapp"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <SiWhatsapp className="w-4 h-4" />
                Ürünü WhatsApp'tan Sor
              </a>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <section className="mb-8" data-testid="health-faq">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            Sık Sorulan Sorular
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground text-sm mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {data.related.length > 0 && (
          <section className="mb-8">
            <h3 className="text-base font-semibold text-foreground mb-3">İlgili Konular</h3>
            <div className="flex flex-wrap gap-2">
              {data.related.map(r => (
                <Link
                  key={r.slug}
                  href={`/${data.urlPrefix}/${r.slug}`}
                  data-testid={`link-related-${r.slug}`}
                  className="text-xs bg-muted hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors border border-border">
                  {r.keyword}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Card className="p-5 bg-primary text-primary-foreground">
          <h3 className="font-bold text-lg mb-1">EnuygunPet Gross Market</h3>
          <p className="text-primary-foreground/80 text-sm mb-4">{ADDRESS} • Her gün 09:00–21:00</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a href={`tel:${PHONE}`} data-testid="btn-phone-cta"
              className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
              <Phone className="w-4 h-4" />
              Ara
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-whatsapp-cta"
              className="flex items-center justify-center gap-2 bg-green-400 hover:bg-green-300 text-green-900 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
              <SiWhatsapp className="w-4 h-4" />
              WhatsApp
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-maps-cta"
              className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
              <MapPin className="w-4 h-4" />
              Yol Tarifi
            </a>
          </div>
        </Card>

        <InternalLinksSection type={detectType(data.keyword)} currentSlug={data.slug} showHealth={false} />

        <footer className="mt-8 pb-6 text-center space-y-1">
          <p className="text-[10px] text-muted-foreground/70">© {new Date().getFullYear()} EnuygunPet — Tüm hakları saklıdır.</p>
          <p className="text-[10px] text-muted-foreground/60">
            Bu web sitesi,{" "}
            <a href="https://www.sizpa.net/" target="_blank" rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors">
              Sizpa Yazılım
            </a>{" "}
            tarafından tasarlanmış ve geliştirilmiştir.
          </p>
        </footer>
      </main>
    </div>
  );
}
