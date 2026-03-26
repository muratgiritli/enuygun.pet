import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Phone, MessageCircle, MapPin, ArrowLeft, BookOpen, Tag, ChevronRight } from "lucide-react";
import InternalLinksSection, { detectType } from "@/components/internal-links";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const PHONE = "+905422114944";
const WA_URL = `https://wa.me/905422114944`;
const MAPS_URL = "https://www.google.com/maps?cid=1443692801456575727";

const CAT_LABELS: Record<string, string> = {
  kedi: "Kedi",
  kopek: "Köpek",
  kus: "Kuş",
  genel: "Genel",
};

type BlogPost = {
  slug: string;
  title: string;
  cat: string;
  desc: string;
  sections: { h: string; p: string }[];
  products: string[];
  productLinks: { slug: string; keyword: string }[];
  related: { slug: string; title: string }[];
};

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: () => fetch(`/api/blog/${slug}`).then(r => r.json()),
    enabled: !!slug,
  });

  useEffect(() => {
    if (!post || (post as any).error) return;
    const title = `${post.title} | EnuygunPet Evcil Hayvan Bakım Rehberi`;
    const canonicalUrl = `https://www.enuygun.pet/blog/${post.slug}`;
    const CAT_IMGS: Record<string, string> = {
      kedi: "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
      kopek: "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
      kus: "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
    };
    const img = CAT_IMGS[post.cat] || "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg";
    const desc = post.desc.length < 100
      ? `${post.desc} Samsun Atakum EnuygunPet Gross Market'te uzman tavsiye ve ürün desteği.`
      : post.desc;
    document.title = title;
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
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[property="og:image:alt"]', "content", `${post.title} - EnuygunPet Evcil Hayvan Bakım Rehberi`);
    setMeta('meta[property="og:type"]', "content", "article");
    setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", img);
  }, [post]);

  if (isLoading) return (
    <div className="min-h-screen bg-background p-4 max-w-2xl mx-auto">
      <Skeleton className="h-8 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      {[1,2,3].map(i => (
        <div key={i} className="mb-4">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );

  if (isError || !post || (post as any).error) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center gap-4">
      <p className="text-muted-foreground">Bu blog yazısı bulunamadı.</p>
      <Link href="/blog"><a className="text-primary underline">Tüm blog yazıları</a></Link>
    </div>
  );

  const BLOG_CAT_IMGS: Record<string, string> = {
    kedi: "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
    kopek: "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
    kus: "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
  };
  const postImg = BLOG_CAT_IMGS[post.cat] || "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg";
  const postImgObj = {
    "@type": "ImageObject",
    "url": postImg,
    "contentUrl": postImg,
    "name": `${post.title} - EnuygunPet Evcil Hayvan Bakım Rehberi`,
    "description": post.desc,
    "caption": `${post.title} | EnuygunPet Samsun Atakum`,
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
        "@type": "BlogPosting",
        "@id": `https://www.enuygun.pet/blog/${post.slug}`,
        "url": `https://www.enuygun.pet/blog/${post.slug}`,
        "headline": post.title,
        "name": post.title,
        "description": post.desc,
        "image": postImgObj,
        "thumbnailUrl": postImg,
        "datePublished": "2025-01-01",
        "dateModified": new Date().toISOString().split("T")[0],
        "inLanguage": "tr-TR",
        "author": {
          "@type": "Organization",
          "@id": "https://www.enuygun.pet/#organization",
          "name": "EnuygunPet Gross Market"
        },
        "publisher": { "@id": "https://www.enuygun.pet/#organization" },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.enuygun.pet/blog/${post.slug}`
        },
        "isPartOf": {
          "@type": "Blog",
          "@id": "https://www.enuygun.pet/blog",
          "name": "EnuygunPet — Evcil Hayvan Bakım Rehberi"
        }
      },
      postImgObj,
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.enuygun.pet/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://www.enuygun.pet/blog/${post.slug}` }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          ...post.sections.slice(0, 4).map((sec: { h: string; p: string }) => ({
            "@type": "Question",
            "name": sec.h,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": sec.p
            }
          })),
          {
            "@type": "Question",
            "name": "Bu ürünler Samsun'da nerede satın alınır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Samsun Atakum'daki EnuygunPet Gross Market'te (Atatürk Bulvarı No:113) tüm evcil hayvan ürünleri gross market fiyatıyla satılmaktadır. Haftanın her günü 09:00-21:00 açıktır. WhatsApp: +90 542 211 49 44"
            }
          },
          {
            "@type": "Question",
            "name": "EnuygunPet Samsun'da hangi markaları satıyor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Royal Canin, Hills Science Plan, Pro Plan, Reflex, Brit Care, Acana, Taste of the Wild başta olmak üzere 50'den fazla marka bulunmaktadır. Tüm markalar perakende fiyatlarının altında gross market fiyatıyla satılmaktadır."
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
      <header className="bg-primary text-primary-foreground px-4 pt-10 pb-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog">
            <a className="inline-flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors" data-testid="link-back-blog">
              <ArrowLeft className="w-4 h-4" />
              Blog
            </a>
          </Link>
          <Badge variant="secondary" className="mb-3 text-xs">
            {CAT_LABELS[post.cat] || post.cat}
          </Badge>
          <h1 className="text-2xl font-bold leading-tight" data-testid="blog-h1">{post.title}</h1>
          <p className="mt-2 text-primary-foreground/80 text-sm">{post.desc}</p>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {post.sections.map((sec, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-foreground mb-2">{sec.h}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{sec.p}</p>
          </section>
        ))}

        <section className="space-y-3 border-t border-border pt-6">
          <h2 className="text-base font-bold text-foreground">EnuygunPet'te Satın Alın</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bu içerikte bahsedilen tüm ürünleri Samsun Atakum'daki EnuygunPet Gross Market mağazamızda bulabilirsiniz. Royal Canin, Hills Science Plan, Pro Plan, Brit Care, Reflex ve daha pek çok markayı gross market fiyatıyla sunuyoruz. Mağazamız Atatürk Bulvarı No:113, Atakum / Samsun adresinde haftanın her günü 09:00–21:00 saatleri arasında açıktır.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ürün stok sorgusu, fiyat bilgisi ve sipariş için WhatsApp hattımız (+90 542 211 49 44) üzerinden bize ulaşabilirsiniz. Uzman personelimiz evcil hayvanınızın ihtiyacına en uygun ürünü önerir. Kedi maması, köpek maması, kuş yemi, kedi kumu, vitamin takviyeleri ve bakım ürünlerinden oluşan geniş stok yapımızla tüm ihtiyaçlarınıza tek adreste hizmet veriyoruz.
          </p>
          <h3 className="text-sm font-bold text-foreground">Neden EnuygunPet?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Gross market fiyat avantajı, geniş stok ve uzman danışmanlıkla Samsun'un en büyük petshopuyuz. Perakende fiyatların %30-50 altında alışveriş imkânı, büyük gramaj seçenekleri ve toplu alım indirimleri sunuyoruz.
          </p>
        </section>

        {post.productLinks && post.productLinks.length > 0 && (
          <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-sm text-amber-800 dark:text-amber-200">İlgili Ürünler</span>
            </div>
            <div className="space-y-2">
              {post.productLinks.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`}>
                  <a className="flex items-center justify-between group p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors" data-testid={`link-product-${p.slug}`}>
                    <span className="text-sm text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">{p.keyword}</span>
                    <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </Link>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-4 bg-primary text-primary-foreground rounded-2xl">
          <p className="text-sm font-semibold mb-3">EnuygunPet'te Bulabilirsiniz</p>
          <div className="grid grid-cols-3 gap-2">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-wa-blog"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">WhatsApp</span>
            </a>
            <a href={`tel:${PHONE}`} data-testid="btn-phone-blog"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <Phone className="w-5 h-5" />
              <span className="text-xs font-medium">Ara</span>
            </a>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" data-testid="btn-maps-blog"
              className="flex flex-col items-center gap-1 bg-white/15 hover:bg-white/25 rounded-xl p-3 transition-colors">
              <MapPin className="w-5 h-5" />
              <span className="text-xs font-medium">Yol Tarifi</span>
            </a>
          </div>
        </Card>

        {post.related && post.related.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              İlgili Yazılar
            </h3>
            <div className="space-y-2">
              {post.related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`}>
                  <a className="flex items-center justify-between group p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors" data-testid={`link-related-${r.slug}`}>
                    <span className="text-sm text-foreground">{r.title}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}

        <InternalLinksSection type={detectType(post.title)} currentSlug={post.slug} showBlog={false} />

        <div className="flex justify-center">
          <Link href="/">
            <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-home-blog">
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
