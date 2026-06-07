import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTrack } from "@/hooks/use-track";
import SiteHeader from "@/components/site-header";

import { Phone, MessageCircle, MapPin, ArrowLeft, ChevronRight, BookOpen, Store } from "lucide-react";
import InternalLinksSection from "@/components/internal-links";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PHONE = "+905422114944";
const WA_URL = `https://wa.me/905422114944`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";

const RELATED_CATEGORIES = [
  { slug: "kedi-mamasi", label: "Kedi Maması" },
  { slug: "kopek-mamasi", label: "Köpek Maması" },
  { slug: "kedi-kumu", label: "Kedi Kumu" },
  { slug: "petshop-samsun", label: "Petshop Samsun" },
];

const RELATED_BLOGS = [
  { slug: "samsuunda-petshop-secimi-nasil-yapilir", label: "Samsun'da Petshop Seçimi" },
  { slug: "atakumda-evcil-hayvan-sahiplenmek-nereden-baslamali", label: "Atakum'da Evcil Hayvan Sahiplenmek" },
  { slug: "kapida-teslim-petshop-samsun-rehberi", label: "Kapıda Teslim Petshop Samsun" },
];

type LocalData = {
  slug: string;
  title: string;
  h1: string;
  district: string;
  neighborhood: string | null;
  desc: string;
  intro: string;
  sections: { h: string; p: string }[];
};

export default function LocalPage() {
  const { slug } = useParams<{ slug: string }>();
  useTrack(`local/${slug || ""}`, slug || "");

  const { data: page, isLoading, isError } = useQuery<LocalData>({
    queryKey: ["/api/local", slug],
    queryFn: () => fetch(`/api/local/${slug}`).then(r => r.json()),
    enabled: !!slug,
  });

  useEffect(() => {
    if (!page || (page as any).error) return;
    const canonicalUrl = `https://www.enuygun.pet/local/${page.slug}`;
    const img = "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg";
    document.title = page.title;
    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta") as HTMLMetaElement; document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) { el = document.createElement("link") as HTMLLinkElement; el.setAttribute("rel", rel); document.head.appendChild(el); }
      el.setAttribute("href", href);
    };
    setLink("canonical", canonicalUrl);
    setMeta('meta[name="description"]', "content", page.desc);
    setMeta('meta[property="og:title"]', "content", page.title);
    setMeta('meta[property="og:description"]', "content", page.desc);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[property="og:image:alt"]', "content", `${page.h1} - EnuygunPet Samsun Atakum`);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", page.title);
    setMeta('meta[name="twitter:description"]', "content", page.desc);
    setMeta('meta[name="twitter:image"]', "content", img);
  }, [page]);

  if (isLoading) return (
    <div className="min-h-screen bg-background p-4 max-w-2xl mx-auto">
      <Skeleton className="h-8 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-6" />
      {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl mb-3" />)}
    </div>
  );

  if (isError || !page || (page as any).error) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
      <p className="text-muted-foreground">Sayfa bulunamadı.</p>
      <Link href="/"><a className="text-primary underline">Ana Sayfa</a></Link>
    </div>
  );

  const locationLabel = page.neighborhood
    ? `${page.district} ${page.neighborhood}`
    : page.district;

  const STORE_IMAGES = [
    "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg",
    "https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg",
    "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
    "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
    "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
  ];
  const localImgObj = {
    "@type": "ImageObject",
    "url": STORE_IMAGES[0],
    "contentUrl": STORE_IMAGES[0],
    "name": `${page.h1} - EnuygunPet Samsun Petshop`,
    "description": `EnuygunPet Gross Market ${page.district} bölgesine hizmet veren Samsun Atakum evcil hayvan mağazası.`,
    "caption": `${page.h1} | EnuygunPet Gross Market Samsun Atakum`,
    "representativeOfPage": true,
    "license": "https://www.enuygun.pet",
    "acquireLicensePage": "https://www.enuygun.pet",
    "creditText": "EnuygunPet Gross Market",
    "creator": { "@type": "Organization", "name": "EnuygunPet Gross Market" },
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      localImgObj,
      {
        "@type": "LocalBusiness",
        "@id": `https://www.enuygun.pet/local/${page.slug}#localbusiness`,
        "name": page.h1,
        "description": page.desc,
        "url": `https://www.enuygun.pet/local/${page.slug}`,
        "telephone": "+905422114944",
        "image": STORE_IMAGES,
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
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "09:00",
          "closes": "21:00"
        }],
        "areaServed": { "@type": "City", "name": "Samsun" },
        "parentOrganization": { "@id": "https://www.enuygun.pet/#organization" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": page.district, "item": `https://www.enuygun.pet/local/${page.slug}` }
        ]
      },
      {
        "@type": "Service",
        "name": page.h1,
        "description": page.desc,
        "serviceType": "Evcil Hayvan Ürünleri Satışı",
        "provider": { "@id": "https://www.enuygun.pet/#organization" },
        "areaServed": { "@type": "Place", "name": locationLabel }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          ...page.sections.slice(0, 3).map((sec: { h: string; p: string }) => ({
            "@type": "Question",
            "name": sec.h,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": sec.p
            }
          })),
          {
            "@type": "Question",
            "name": `${locationLabel} bölgesine en yakın petshop nerede?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${locationLabel} bölgesine en yakın petshop EnuygunPet Gross Market'tir. Samsun Atakum, Atatürk Bulvarı No:113 adresinde hizmet vermektedir. Haftanın 7 günü 09:00-21:00 açık olup WhatsApp: +90 542 211 49 44 numarasından bilgi alabilirsiniz.`
            }
          },
          {
            "@type": "Question",
            "name": "EnuygunPet'te hangi evcil hayvan ürünleri bulunur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kedi maması, köpek maması, kuş yemi, kedi kumu, tasma, oyuncak, kafes, akvaryum malzemeleri ve binlerce aksesuar çeşidi gross market fiyatıyla bulunmaktadır. Royal Canin, Hills, Pro Plan, Reflex başta olmak üzere 50'den fazla marka mevcuttur."
            }
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.enuygun.pet/#organization",
        "name": "EnuygunPet Gross Market",
        "url": "https://www.enuygun.pet/"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />
      <header className="bg-primary text-primary-foreground px-4 pt-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-5 h-5 text-primary-foreground/80" />
            <span className="text-sm text-primary-foreground/80">{locationLabel}</span>
          </div>
          <h1 className="text-2xl font-bold leading-tight" data-testid="local-h1">{page.h1}</h1>
          <p className="mt-2 text-primary-foreground/80 text-sm leading-relaxed">{page.intro}</p>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {page.sections.map((sec, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-foreground mb-2">{sec.h}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{sec.p}</p>
          </section>
        ))}

        <section className="space-y-4">
          <h2 className="text-base font-bold text-foreground">EnuygunPet Gross Market Hakkında</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            EnuygunPet, Samsun Atakum'da Atatürk Bulvarı No:113 adresinde faaliyet gösteren Samsun'un en büyük petshop gross marketidir. Kedi maması, köpek maması, kuş yemi, kedi kumu, tasma, oyuncak, yatak, kafes ve akvaryum malzemeleri dahil on binlerce ürün çeşidi tek çatı altında sunulmaktadır. Royal Canin, Hills Science Plan, Pro Plan, Brit Care, Reflex ve Enjoy gibi önde gelen markaların tüm ürün gamları stoğumuzda mevcuttur.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Gross market modelimiz sayesinde perakende fiyatlarının çok altında alışveriş yapabilirsiniz. Büyük gramaj ve toplu alımlarda fiyat avantajı daha da belirginleşmektedir. Uzman personelimiz evcil hayvanınızın beslenme ve bakım ihtiyaçları hakkında ücretsiz danışmanlık sunmaktadır.
          </p>
          <h3 className="text-sm font-bold text-foreground">Ürün Kategorileri</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kedi ürünleri (mama, kum, oyuncak, tırmalama, taşıma çantası), köpek ürünleri (mama, tasma, koşum, oyuncak, yatak), kuş ürünleri (yem, kafes, tünek, vitamin), balık ve akvaryum ürünleri (yem, filtre, ışık, dekorasyon) ile küçük hayvan ürünleri (hamster, tavşan, guinea pig) kategorilerinde geniş ürün yelpazesi sunuyoruz.
          </p>
          <h3 className="text-sm font-bold text-foreground">Neden EnuygunPet?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Gross market fiyat avantajı, geniş stok, uzman danışmanlık ve kolay erişim imkânıyla Samsun'un en güvenilir petshop markasıyız. Haftanın her günü 09:00–21:00 saatleri arasında açığız. WhatsApp hattımız (+90 542 211 49 44) üzerinden stok sorgusu ve sipariş alıyoruz.
          </p>
        </section>

        <Card className="p-4 bg-primary text-primary-foreground rounded-2xl">
          <p className="text-sm font-semibold mb-1">EnuygunPet Gross Market</p>
          <p className="text-xs text-primary-foreground/80 mb-3">Atatürk Bulvarı, Atakum / Samsun — Her gün 09:00-21:00</p>
          <div className="grid grid-cols-3 gap-2">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-wa-local"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">WhatsApp</span>
            </a>
            <a href={`tel:${PHONE}`} data-testid="btn-phone-local"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <Phone className="w-5 h-5" />
              <span className="text-xs font-medium">Ara</span>
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-maps-local"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <MapPin className="w-5 h-5" />
              <span className="text-xs font-medium">Yol Tarifi</span>
            </a>
          </div>
        </Card>

        <div>
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            Ürün Kategorileri
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {RELATED_CATEGORIES.map(c => (
              <Link key={c.slug} href={`/${c.slug}`}>
                <a className="flex items-center justify-between group p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors" data-testid={`link-cat-${c.slug}`}>
                  <span className="text-sm text-foreground">{c.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Blog Rehberleri
          </h3>
          <div className="space-y-2">
            {RELATED_BLOGS.map(b => (
              <Link key={b.slug} href={`/blog/${b.slug}`}>
                <a className="flex items-center justify-between group p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors" data-testid={`link-blog-${b.slug}`}>
                  <span className="text-sm text-foreground">{b.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Link>
            ))}
          </div>
        </div>

        <InternalLinksSection type="genel" showLocal={false} />

        <div className="flex justify-center">
          <Link href="/">
            <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Ana Sayfaya Dön
            </a>
          </Link>
        </div>

        <footer className="pb-4 text-center space-y-1">
          <p className="text-[10px] text-muted-foreground/70">© {new Date().getFullYear()} EnuygunPet — Tüm hakları saklıdır.</p>
          <p className="text-[10px] text-muted-foreground/60">
            Bu web sitesi,{" "}
            <a href="https://www.sizpa.net/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
              Sizpa Yazılım
            </a>{" "}
            tarafından tasarlanmış ve geliştirilmiştir.
          </p>
        </footer>
      </main>
    </div>
  );
}
