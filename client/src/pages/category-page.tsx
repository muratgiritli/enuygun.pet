import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Phone, MessageCircle, MapPin, ArrowLeft, BookOpen, Tag, ChevronRight, Star } from "lucide-react";
import InternalLinksSection, { detectType } from "@/components/internal-links";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PHONE = "+905422114944";
const WA_URL = `https://wa.me/905422114944`;
const MAPS_URL = "https://www.google.com/maps?cid=1443692801456575727";

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
  const { slug } = useParams<{ slug: string }>();

  const { data: cat, isLoading, isError } = useQuery<CategoryData>({
    queryKey: ["/api/category", slug],
    queryFn: () => fetch(`/api/category/${slug}`).then(r => r.json()),
    enabled: !!slug,
  });

  useEffect(() => {
    if (!cat || (cat as any).error) return;
    document.title = cat.title;
    const setMeta = (sel: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta") as HTMLMetaElement; document.head.appendChild(el); }
      el.setAttribute("content", val);
    };
    setMeta('meta[name="description"]', cat.desc);
    setMeta('meta[property="og:title"]', cat.title);
    setMeta('meta[property="og:description"]', cat.desc);
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
        "isPartOf": { "@id": "https://www.enuygun.pet/#website" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": cat.h1, "item": `https://www.enuygun.pet/${cat.slug}` }
        ]
      },
      {
        "@type": "Service",
        "name": cat.h1,
        "description": cat.desc,
        "serviceType": "Evcil Hayvan Ürünleri Satışı",
        "provider": { "@id": "https://www.enuygun.pet/#organization" },
        "areaServed": { "@type": "City", "name": "Samsun" },
        "offers": (cat.brands || []).map((brand: string) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": `${cat.h1} - ${brand}`,
            "brand": { "@type": "Brand", "name": brand }
          },
          "priceCurrency": "TRY",
          "availability": "https://schema.org/InStock"
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <header className="bg-primary text-primary-foreground px-4 pt-10 pb-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/">
            <a className="inline-flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors" data-testid="link-back">
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </a>
          </Link>
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
