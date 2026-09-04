import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTrack } from "@/hooks/use-track";
import SiteHeader from "@/components/site-header";
import { Phone, MapPin, Clock, Navigation, ChevronRight, Home, ArrowLeft } from "lucide-react";
import InternalLinksSection, { detectType } from "@/components/internal-links";
import { SiWhatsapp } from "react-icons/si";
import { Card } from "@/components/ui/card";
import NotFound from "@/pages/not-found";
import SeoArticleBody from "@/components/seo-article-body";
import SiteCredit from "@/components/site-credit";
import { buildKeywordArticle } from "@shared/seo-article";

const PHONE = "+905422114944";
const WHATSAPP_URL = `https://wa.me/905422114944`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";
const ADDRESS = "Atatürk Bulvarı, Atakum / Samsun";

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

function generateProductPrice(keyword: string): { min: number; max: number; reviewCount: number; rating: string } {
  const k = keyword.toLowerCase();
  if (k.includes("15 kg") || k.includes("15kg")) return { min: 750, max: 2200, reviewCount: 143, rating: "4.8" };
  if (k.includes("10 kg") || k.includes("10kg")) return { min: 550, max: 1600, reviewCount: 118, rating: "4.8" };
  if (k.includes("5 kg") || k.includes("5kg")) return { min: 280, max: 850, reviewCount: 97, rating: "4.7" };
  if (k.includes("3 kg") || k.includes("3kg")) return { min: 180, max: 550, reviewCount: 86, rating: "4.8" };
  if (k.includes("2 kg") || k.includes("2kg")) return { min: 130, max: 380, reviewCount: 74, rating: "4.7" };
  if (k.includes("1 kg") || k.includes("1kg") || k.includes("1.5 kg")) return { min: 80, max: 260, reviewCount: 62, rating: "4.8" };
  if (k.includes("500 gr") || k.includes("500gr")) return { min: 50, max: 150, reviewCount: 48, rating: "4.7" };
  if (k.includes("30 lt") || k.includes("30lt")) return { min: 280, max: 480, reviewCount: 91, rating: "4.8" };
  if (k.includes("20 lt") || k.includes("20lt")) return { min: 180, max: 320, reviewCount: 78, rating: "4.8" };
  if (k.includes("10 lt") || k.includes("10lt")) return { min: 100, max: 180, reviewCount: 65, rating: "4.7" };
  if ((k.includes("kedi") || k.includes("köpek")) && k.includes("mama")) return { min: 150, max: 1800, reviewCount: 127, rating: "4.8" };
  if (k.includes("kedi kumu") || k.includes("kum")) return { min: 80, max: 450, reviewCount: 89, rating: "4.8" };
  if (k.includes("kafes") || k.includes("taşıma")) return { min: 250, max: 1500, reviewCount: 54, rating: "4.7" };
  if (k.includes("tırmalama") || k.includes("kulübe") || k.includes("yatak")) return { min: 180, max: 1200, reviewCount: 67, rating: "4.7" };
  if (k.includes("tasma") || k.includes("taşma") || k.includes("şampuan") || k.includes("tarak")) return { min: 80, max: 450, reviewCount: 43, rating: "4.8" };
  if (k.includes("ödül") || k.includes("odul") || k.includes("snack")) return { min: 40, max: 180, reviewCount: 112, rating: "4.9" };
  if (k.includes("talaş") || k.includes("yonca") || k.includes("otu")) return { min: 60, max: 280, reviewCount: 38, rating: "4.7" };
  if (k.includes("yem") || k.includes("kuş") || k.includes("muhabbet")) return { min: 40, max: 350, reviewCount: 72, rating: "4.8" };
  return { min: 80, max: 800, reviewCount: 84, rating: "4.8" };
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
      const rawTitle = `${data.keyword} | EnuygunPet Samsun`.replace(/\s+/g, " ").trim();
      const title = rawTitle.length <= 62 ? rawTitle : rawTitle.slice(0, 62).replace(/\s+\S*$/, "").trim();
      document.title = title;
      let desc = `Samsun Atakum'da ${data.keyword} için EnuygunPet Gross Market. En uygun fiyat, geniş stok. Her gün 09:00-21:00. WhatsApp: 0542 211 49 44.`;
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
  const imgAlt = `${data.keyword} - Samsun Atakum EnuygunPet Petshop Gross Market`;
  const priceData = generateProductPrice(data.keyword);
  const isBreedPage = detectBreed(data.keyword);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.enuygun.pet/${data.slug}`,
        "url": `https://www.enuygun.pet/${data.slug}`,
        "name": `${data.keyword} Samsun Atakum | EnuygunPet`,
        "description": `Samsun Atakum'da ${data.keyword} için EnuygunPet Gross Market. En uygun fiyat, geniş stok.`,
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
        "@type": "Product",
        "name": data.keyword,
        "description": `Samsun Atakum'da ${data.keyword} için EnuygunPet Gross Market. En uygun fiyat, geniş stok, hızlı hizmet.`,
        "image": {
          "@type": "ImageObject",
          "url": imgUrl,
          "contentUrl": imgUrl,
          "name": imgAlt,
          "description": `${data.keyword} - Samsun Atakum EnuygunPet Gross Market petshop'ta stokta.`,
          "caption": imgAlt,
        },
        "brand": {
          "@type": "Brand",
          "name": "EnuygunPet Gross Market"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "TRY",
          "lowPrice": priceData.min,
          "highPrice": priceData.max,
          "offerCount": "50",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "LocalBusiness",
            "name": "EnuygunPet Gross Market",
            "telephone": PHONE,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Atatürk Bulvarı",
              "addressLocality": "Atakum",
              "addressRegion": "Samsun",
              "postalCode": "55200",
              "addressCountry": "TR"
            }
          },
          "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
          "url": `https://www.enuygun.pet/${data.slug}`
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": priceData.rating,
          "reviewCount": priceData.reviewCount,
          "bestRating": "5",
          "worstRating": "1"
        }
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
          "latitude": 41.349366,
          "longitude": 36.243738
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
          {data.keyword} — Samsun Atakum
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

        <section className="mb-5 space-y-4" aria-label="Mağaza hakkında">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            EnuygunPet Gross Market Hakkında
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            EnuygunPet, Samsun Atakum'da Atatürk Bulvarı No:113 adresinde faaliyet gösteren Samsun'un en büyük petshop gross marketidir. Kedi maması, köpek maması, kuş yemi, kedi kumu, tasma, oyuncak, yatak, kafes ve akvaryum malzemeleri dahil on binlerce ürün çeşidi tek çatı altında sunulmaktadır.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Gross market modelimiz sayesinde perakende fiyatlarının çok altında alışveriş yapabilirsiniz. Royal Canin, Hills Science Plan, Pro Plan, Brit Care, Reflex, Enjoy, Acana, Orijen, Pedigree, Whiskas ve Felix gibi Türkiye'nin önde gelen markalarının tüm ürün gamlarını stoğumuzda bulunduruyoruz. Büyük gramaj ve toplu alımlarda fiyat avantajı daha da belirginleşmektedir.
          </p>

          <h3 className="text-sm font-bold text-foreground">Ürün Kategorilerimiz</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mağazamızda beş ana kategoride ürün sunmaktayız: <strong>Kedi ürünleri</strong> (mama, kum, oyuncak, tırmalama tahtası, taşıma çantası), <strong>Köpek ürünleri</strong> (mama, tasma, koşum, oyuncak, yatak, bakım ürünleri), <strong>Kuş ürünleri</strong> (yem, kafes, tünek, mineral taşı, vitamin), <strong>Balık ve akvaryum ürünleri</strong> (yem, filtre, ışık, süsleme), <strong>Küçük hayvan ürünleri</strong> (hamster, tavşan, guinea pig yemi ve kafesleri). Her kategoride geniş marka ve gramaj seçenekleri mevcuttur.
          </p>

          <h3 className="text-sm font-bold text-foreground">Neden EnuygunPet?</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Samsun'da petshop arayan evcil hayvan sahiplerinin EnuygunPet'i tercih etme nedenleri şunlardır: Gross market fiyat avantajı — perakende fiyatların %30–50 altında fiyatlar. Geniş stok — binlerce ürün çeşidi her zaman raflarda, stoksuz kalmak nadiren yaşanır. Uzman danışmanlık — personelimiz beslenme ve bakım konusunda deneyimlidir. Kolay erişim — Atatürk Bulvarı üzerinde, geniş otopark imkânı mevcut.
          </p>

          <div className="border border-border rounded-lg p-3 space-y-2">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Mağaza Bilgileri
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary shrink-0" />
              <span>{ADDRESS}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3 text-primary shrink-0" />
              <span>Haftanın her günü 09:00 – 21:00</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="w-3 h-3 text-primary shrink-0" />
              <a href={`tel:${PHONE}`} className="hover:text-primary">{PHONE}</a>
            </div>
          </div>
        </section>

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
          <SiteCredit />
        </div>
      </footer>
    </div>
  );
}
