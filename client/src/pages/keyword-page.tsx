import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTrack } from "@/hooks/use-track";
import SiteHeader from "@/components/site-header";
import { Phone, Navigation, ChevronRight, Home, ArrowLeft } from "lucide-react";
import InternalLinksSection, { detectType } from "@/components/internal-links";
import { SiWhatsapp } from "react-icons/si";
import { Card } from "@/components/ui/card";
import NotFound from "@/pages/not-found";
import SeoArticleBody from "@/components/seo-article-body";
import StoreTrust from "@/components/store-trust";
import {
  buildKeywordArticle,
  buildKeywordDescription,
  keywordAsTitle,
} from "@shared/seo-article";
import {
  PHONE_E164 as PHONE,
  PHONE_WHATSAPP_URL as WHATSAPP_URL,
  STORE_MAPS_URL as MAPS_URL,
  STORE_STREET,
  STORE_POSTAL,
  STORE_LAT,
  STORE_LNG,
} from "@shared/store-info";

interface KeywordData {
  keyword: string;
  slug: string;
  related: Array<{ keyword: string; slug: string }>;
}

const BREED_TERMS = [
  "golden retriever","labrador","labrador retriever","husky","sibirya kurdu",
  "yorkshire","yorkshire terrier","yorkie","chihuahua","pomeranian","pom",
  "maltese","maltez","beagle","rottweiler","doberman","dobermann",
  "alman çoban","alman coban","german shepherd","border collie","border koli",
  "shih tzu","poodle","pudel","jack russell","jack russel","cocker spaniel","cocker",
  "boxer köpek","boxer kopek","bulldog","ingiliz bulldog","fransız bulldog","fransiz bulldog",
  "dachshund","daksund","dalmaçyalı","dalmacyali","dalmatian",
  "chow chow","akita","samoyed","bernese","berner","bernese mountain",
  "golden","labrador retriever","belgian malinois","malinois","kangal",
  "british shorthair","british short hair","scottish fold","scottish straight",
  "iran kedisi","pers kedisi","persian","siamese","siyam kedisi",
  "maine coon","maine kun","bengal kedisi","ragdoll","russian blue","rus mavisi",
  "sphynx","sfenks","ankara kedisi","türk angora","turk angora","turkish angora",
  "türk van","turk van","turkish van","van kedisi","tekir kedi",
  "norveç orman kedisi","norvec orman","norveç orman",
  "hollanda tavşanı","hollanda tavsan","rex tavşanı","rex tavsan",
  "angora tavşanı","angora tavsan","lop tavşanı","lop tavsan","dwarf tavşan",
  "hamster","altın hamster","altin hamster","cüce hamster","cuce hamster",
  "roborovski","campbell hamster","chinchilla","şinşilla","sinşilla","kobay",
  "gine domuzu","guinea pig","degu","agouti",
  "agapornis","forpus","cennet papağanı","cennet papagani",
  "sultan papağanı","sultan papagani","jako papağanı","jako papagani",
  "amazon papağanı","amazon papagani","kakadu","macaw","ara papağanı",
  "conure","kakariki","lori","rosella","nymphicus","nim",
  "iguana","leopar gecko","leopar kertenkele","kral yılanı","kral yilani",
  "sakallı ejder","sakalı ejder","ball python","kral piton","boa","corn snake",
  "kaplumbağa","kaplumbaga","su kaplumbağası","box kaplumbağa",
  "betta balığı","betta baligi","oscar balığı","oscar baligi","koi","japon balığı",
  "altın balık","altin balik","goldfish","discus","akvaryum balık",
  "tavşan ırkı","tavsan irki","kedi ırkı","kedi irki","köpek ırkı","kopek irki",
];

function detectBreed(keyword: string): boolean {
  const kw = keyword.toLowerCase();
  return BREED_TERMS.some(t => kw.includes(t));
}

export default function KeywordPage() {
  const [, params] = useRoute("/:slug");
  const slug = params?.slug || "";

  useTrack(slug, slug);

  const { data, isLoading, isError } = useQuery<KeywordData>({
    queryKey: ["/api/keyword", slug],
    queryFn: () => fetch(`/api/keyword/${slug}`).then(r => {
      if (!r.ok) throw new Error("not found");
      return r.json();
    }),
    retry: false,
  });

  useEffect(() => {
    if (data) {
      const title = keywordAsTitle(data.keyword);
      document.title = title;
      let desc = buildKeywordDescription(data.keyword);
      if (desc.length > 160) desc = desc.slice(0, 160).replace(/\s+\S*$/, "").trim();
      const article = buildKeywordArticle(data.keyword, data.slug);
      const imgUrl = article.images[0]?.src || "";

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

      setLink("canonical", `https://www.enuygun.pet/${data.slug}`);
      setMeta('meta[name="description"]', "content", desc);
      setMeta('meta[property="og:title"]', "content", title);
      setMeta('meta[property="og:description"]', "content", desc);
      setMeta('meta[property="og:image"]', "content", imgUrl);
      setMeta('meta[property="og:image:alt"]', "content", `${data.keyword} - Samsun Atakum EnuygunPet Petshop Gross Market`);
      setMeta('meta[property="og:url"]', "content", `https://www.enuygun.pet/${data.slug}`);
      setMeta('meta[property="og:type"]', "content", "website");
      setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
      setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
      setMeta('meta[name="twitter:title"]', "content", title);
      setMeta('meta[name="twitter:description"]', "content", desc);
      setMeta('meta[name="twitter:image"]', "content", imgUrl);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (isError || !data) {
    return <NotFound />;
  }

  const article = buildKeywordArticle(data.keyword, data.slug);
  const faqs = article.faqs;
  const imgUrl = article.images[0]?.src || "";
  const imgAlt = `${data.keyword} ürün seçimi ve kullanım rehberi`;
  const isBreedPage = detectBreed(data.keyword);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.enuygun.pet/${data.slug}`,
        "url": `https://www.enuygun.pet/${data.slug}`,
        "name": keywordAsTitle(data.keyword),
        "description": buildKeywordDescription(data.keyword),
        "isPartOf": { "@id": "https://www.enuygun.pet/#website" },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": imgUrl,
          "name": imgAlt,
          "description": imgAlt,
          "caption": imgAlt,
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
            { "@type": "ListItem", "position": 2, "name": data.keyword, "item": `https://www.enuygun.pet/${data.slug}` },
          ],
        },
      },
      {
        "@type": "ImageObject",
        "url": imgUrl,
        "name": imgAlt,
        "description": imgAlt,
        "caption": imgAlt,
        "contentUrl": imgUrl,
        "license": "https://www.enuygun.pet",
        "acquireLicensePage": "https://www.enuygun.pet",
        "creditText": "EnuygunPet Gross Market Samsun Atakum",
        "creator": { "@type": "Organization", "name": "EnuygunPet Gross Market" },
        "copyrightNotice": "EnuygunPet",
        "representativeOfPage": true,
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
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <SiteHeader />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/"><a className="hover:text-primary flex items-center gap-1"><Home className="w-3 h-3" />Ana Sayfa</a></Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate">{data.keyword}</span>
        </nav>

        <h1 className="text-xl font-bold text-foreground mb-4 leading-tight" data-testid="text-keyword-title">
          {keywordAsTitle(data.keyword)}
        </h1>

        {isBreedPage && (
          <div
            className="flex items-center gap-3 mb-5 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/40 px-4 py-3"
            data-testid="notice-no-live-animal"
            role="alert"
          >
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <p className="text-xs font-bold text-red-700 dark:text-red-400 leading-snug uppercase tracking-wide">
              Mağazamızda canlı hayvan cinsi satılmamaktadır — bu konu için aramayınız.
            </p>
          </div>
        )}

        <SeoArticleBody article={article} testId="text-article" />

        <div className="grid grid-cols-3 gap-2 mb-5 mt-5">
          <a href={`tel:${PHONE}`} data-testid="link-kw-call">
            <Card className="p-3 border border-card-border text-center">
              <Phone className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-foreground">Ara</p>
              <p className="text-[10px] text-muted-foreground">Hemen bilgi al</p>
            </Card>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="link-kw-whatsapp">
            <Card className="p-3 border border-card-border text-center">
              <SiWhatsapp className="w-5 h-5 text-[#25D366] mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-foreground">WhatsApp</p>
              <p className="text-[10px] text-muted-foreground">Stok sor</p>
            </Card>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="link-kw-map">
            <Card className="p-3 border border-card-border text-center">
              <Navigation className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-[11px] font-semibold text-foreground">Yol Tarifi</p>
              <p className="text-[10px] text-muted-foreground">Atakum</p>
            </Card>
          </a>
        </div>

        <section className="mb-5" aria-label="Sıkça sorulan sorular">
          <h2 className="text-base font-bold text-foreground mb-3" data-testid="text-faq-title">
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-4 border border-card-border">
                <h3 className="text-sm font-semibold text-foreground mb-1.5" data-testid={`text-faq-q-${i}`}>{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed" data-testid={`text-faq-a-${i}`}>{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>

        <div className="mb-5">
          <StoreTrust productLabel={data.keyword} />
        </div>

        {data.related.length > 0 && (
          <section className="mb-5" aria-label="Benzer ürünler">
            <h3 className="text-base font-bold text-foreground mb-3">Benzer Ürünler</h3>
            <div className="grid grid-cols-2 gap-2">
              {data.related.slice(0, 8).map(r => (
                <Link key={r.slug} href={`/${r.slug}`}>
                  <a
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-muted/30 hover:border-primary hover:bg-primary/5 transition-colors group"
                    data-testid={`link-related-${r.slug}`}
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs text-foreground group-hover:text-primary leading-snug line-clamp-2">{r.keyword}</span>
                  </a>
                </Link>
              ))}
            </div>
            {data.related.length > 8 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.related.slice(8).map(r => (
                  <Link key={r.slug} href={`/${r.slug}`}>
                    <a
                      className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/40 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      data-testid={`link-related-extra-${r.slug}`}
                    >
                      {r.keyword}
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <InternalLinksSection type={detectType(data.keyword)} currentSlug={data.slug} />
      </main>

      <footer className="border-t border-border px-4 py-5 mt-2" data-testid="keyword-footer">
        <div className="max-w-lg mx-auto text-center space-y-1.5">
          <Link href="/">
            <a className="text-xs font-semibold text-primary flex items-center justify-center gap-1.5 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              Ana Sayfaya Dön
            </a>
          </Link>
          <p className="text-[10px] text-muted-foreground/70">© {new Date().getFullYear()} EnuygunPet — Tüm hakları saklıdır.</p>
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
    </div>
  );
}
