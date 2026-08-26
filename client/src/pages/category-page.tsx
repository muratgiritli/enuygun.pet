import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTrack } from "@/hooks/use-track";
import SiteHeader from "@/components/site-header";

import { Phone, MessageCircle, MapPin, ArrowLeft, BookOpen, Tag, ChevronRight, Star } from "lucide-react";
import InternalLinksSection, { detectType } from "@/components/internal-links";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PHONE = "+905422114944";
const WA_URL = `https://wa.me/905422114944`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";

type CategoryData = {
  slug: string;
  title: string;
  h1: string;
  desc: string;
  intro: string;
  brands: string[];
  sections: { h: string; p: string }[];
  relatedKeywords: string[];
  relatedBlogData: { slug: string; title: string }[];
};

export default function CategoryPage() {
  const [location] = useLocation();
  const slug = location.split("?")[0].replace(/^\//, "").replace(/\/$/, "");
  useTrack(slug || "", slug || "");

  const { data: cat, isLoading, isError } = useQuery<CategoryData>({
    queryKey: ["/api/category", slug],
    queryFn: () => fetch(`/api/category/${slug}`).then(r => r.json()),
    enabled: !!slug,
  });

  useEffect(() => {
    if (!cat || (cat as any).error) return;
    const canonicalUrl = `https://www.enuygun.pet/${cat.slug}`;
    const img = "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg";
    document.title = cat.title;
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
    setMeta('meta[name="description"]', "content", cat.desc);
    setMeta('meta[property="og:title"]', "content", cat.title);
    setMeta('meta[property="og:description"]', "content", cat.desc);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[property="og:image:alt"]', "content", `${cat.h1} - EnuygunPet Samsun Atakum`);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", cat.title);
    setMeta('meta[name="twitter:description"]', "content", cat.desc);
    setMeta('meta[name="twitter:image"]', "content", img);
  }, [cat]);

  if (isLoading) return (
    <div className="min-h-screen bg-background p-4 max-w-2xl mx-auto">
      <Skeleton className="h-8 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-6" />
      {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl mb-3" />)}
    </div>
  );

  if (isError || !cat || (cat as any).error) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
      <p className="text-muted-foreground">Kategori sayfası bulunamadı.</p>
      <Link href="/"><a className="text-primary underline">Ana Sayfa</a></Link>
    </div>
  );

  const CAT_SLUG_IMAGES: Record<string, string> = {
    "kedi-urunleri": "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
    "kopek-urunleri": "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
    "kus-urunleri": "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
  };
  const catImg = CAT_SLUG_IMAGES[cat.slug] || "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg";
  const catImgObj = {
    "@type": "ImageObject",
    "url": catImg,
    "contentUrl": catImg,
    "name": `${cat.h1} - EnuygunPet Samsun Atakum`,
    "description": cat.desc,
    "caption": `${cat.h1} | EnuygunPet Gross Market Samsun Atakum`,
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
        "@type": "CollectionPage",
        "@id": `https://www.enuygun.pet/${cat.slug}`,
        "url": `https://www.enuygun.pet/${cat.slug}`,
        "name": cat.title,
        "description": cat.desc,
        "inLanguage": "tr-TR",
        "isPartOf": { "@id": "https://www.enuygun.pet/#website" },
        "primaryImageOfPage": catImgObj
      },
      catImgObj,
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": cat.h1, "item": `https://www.enuygun.pet/${cat.slug}` }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          ...cat.sections.slice(0, 3).map((sec: { h: string; p: string }) => ({
            "@type": "Question",
            "name": sec.h,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": sec.p
            }
          })),
          {
            "@type": "Question",
            "name": `Samsun'da ${cat.h1.toLowerCase()} nerede bulunur?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Samsun Atakum'da ${cat.h1.toLowerCase()} için EnuygunPet Gross Market'i ziyaret edebilirsiniz. Atatürk Bulvarı No:113 adresinde haftanın her günü 09:00-21:00 açıktır. ${cat.brands?.slice(0,3).join(", ")} başta olmak üzere pek çok marka bulunmaktadır.`
            }
          },
          {
            "@type": "Question",
            "name": "Gross market petshop ile normal petshop arasındaki fark nedir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Gross market petshop, perakende mağazalara kıyasla çok daha büyük gramajlı ürünleri ve toplu alım avantajlarını doğrudan son tüketiciye sunar. EnuygunPet'te büyük gramaj ürünlerde %20-40 daha uygun fiyatlar mevcuttur."
            }
          }
        ]
      },
      {
        "@type": "Service",
        "name": cat.h1,
        "description": cat.desc,
        "serviceType": "Evcil Hayvan Ürünleri Satışı",
        "provider": { "@id": "https://www.enuygun.pet/#organization" },
        "areaServed": { "@type": "City", "name": "Samsun" },
        "image": catImg,
        "offers": (cat.brands || []).map((brand: string) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": `${cat.h1} - ${brand}`,
            "description": `${brand} marka ${cat.h1.toLowerCase()} EnuygunPet Gross Market'te. Samsun Atakum'da geniş stok ve uygun fiyat.`,
            "image": catImg,
            "brand": { "@type": "Brand", "name": brand },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "TRY",
              "availability": "https://schema.org/InStock",
              "seller": { "@id": "https://www.enuygun.pet/#organization" }
            }
          },
          "priceCurrency": "TRY",
          "availability": "https://schema.org/InStock"
        }))
      },
      {
        "@type": "Organization",
        "@id": "https://www.enuygun.pet/#organization",
        "name": "EnuygunPet Gross Market",
        "url": "https://www.enuygun.pet/"
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
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <SiteHeader />
      <header className="bg-primary text-primary-foreground px-4 pt-6 pb-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold leading-tight" data-testid="category-h1">{cat.h1}</h1>
          <p className="mt-2 text-primary-foreground/80 text-sm leading-relaxed">{cat.intro}</p>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {cat.sections.map((sec, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-foreground mb-2">{sec.h}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{sec.p}</p>
          </section>
        ))}

        {cat.brands && cat.brands.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-sm">Stokta Bulunan Markalar</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.brands.map(b => (
                <span key={b} className="text-xs px-2.5 py-1 bg-muted rounded-full text-muted-foreground">{b}</span>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-4 bg-primary text-primary-foreground rounded-2xl">
          <p className="text-sm font-semibold mb-3">Hemen İletişime Geçin</p>
          <div className="grid grid-cols-3 gap-2">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-wa-cat"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">WhatsApp</span>
            </a>
            <a href={`tel:${PHONE}`} data-testid="btn-phone-cat"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <Phone className="w-5 h-5" />
              <span className="text-xs font-medium">Ara</span>
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-maps-cat"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <MapPin className="w-5 h-5" />
              <span className="text-xs font-medium">Yol Tarifi</span>
            </a>
          </div>
        </Card>

        {cat.relatedKeywords && cat.relatedKeywords.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Ürün Sayfaları
            </h3>
            <div className="space-y-2">
              {cat.relatedKeywords.map(kSlug => (
                <Link key={kSlug} href={`/${kSlug}`}>
                  <a className="flex items-center justify-between group p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors" data-testid={`link-kw-${kSlug}`}>
                    <span className="text-sm text-foreground capitalize">{kSlug.replace(/-/g, ' ')}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}

        {cat.relatedBlogData && cat.relatedBlogData.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              İlgili Blog Yazıları
            </h3>
            <div className="space-y-2">
              {cat.relatedBlogData.map((b: { slug: string; title: string }) => (
                <Link key={b.slug} href={`/blog/${b.slug}`}>
                  <a className="flex items-center justify-between group p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors" data-testid={`link-blog-${b.slug}`}>
                    <span className="text-sm text-foreground">{b.title}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}

        <InternalLinksSection type={detectType(cat.h1)} showBlog={false} />

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
