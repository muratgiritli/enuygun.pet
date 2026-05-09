import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTrack } from "@/hooks/use-track";

import { BookOpen, ChevronRight, ArrowLeft, Cat, Dog, Bird, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CAT_META: Record<string, { label: string; icon: React.ReactNode; desc: string; color: string }> = {
  kedi: {
    label: "Kedi Bakımı",
    icon: <Cat className="w-4 h-4" />,
    desc: "Kedi beslenmesi, sağlığı ve bakımına dair uzman rehberler",
    color: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300",
  },
  kopek: {
    label: "Köpek Bakımı",
    icon: <Dog className="w-4 h-4" />,
    desc: "Köpek eğitimi, beslenmesi ve sağlığı hakkında bilgiler",
    color: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
  },
  kus: {
    label: "Kuş Bakımı",
    icon: <Bird className="w-4 h-4" />,
    desc: "Muhabbet kuşu, sultan papağanı ve diğer kuşlar için bakım rehberleri",
    color: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
  },
  genel: {
    label: "Genel Evcil Hayvan Bakımı",
    icon: <Sparkles className="w-4 h-4" />,
    desc: "Tüm evcil hayvanlar için genel bakım ve beslenme ipuçları",
    color: "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300",
  },
};

const CAT_ORDER = ["kedi", "kopek", "kus", "genel"];

type BlogSummary = { slug: string; title: string; cat: string; desc: string };

export default function BlogListPage() {
  useTrack("blog", "Blog Listesi");
  const { data: posts, isLoading } = useQuery<BlogSummary[]>({
    queryKey: ["/api/blog"],
  });

  useEffect(() => {
    const title = "Evcil Hayvan Bakım Rehberi — 36 Uzman Makale | EnuygunPet Samsun";
    const desc = "Kedi, köpek, kuş ve evcil hayvan bakımı hakkında 36 uzman rehber. Beslenme, sağlık ve bakım ipuçları. Samsun Atakum EnuygunPet Gross Market'te en uygun fiyatlarla.";
    const img = "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg";
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
    setLink("canonical", "https://www.enuygun.pet/blog");
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", "https://www.enuygun.pet/blog");
    setMeta('meta[property="og:image"]', "content", img);
    setMeta('meta[property="og:image:alt"]', "content", "EnuygunPet Evcil Hayvan Bakım Rehberi - Samsun Atakum");
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", "EnuygunPet");
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", img);
  }, []);

  const grouped = CAT_ORDER.reduce<Record<string, BlogSummary[]>>((acc, cat) => {
    acc[cat] = posts?.filter(p => p.cat === cat) ?? [];
    return acc;
  }, {});

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://www.enuygun.pet/blog",
        "url": "https://www.enuygun.pet/blog",
        "name": "EnuygunPet — Evcil Hayvan Bakım Rehberi",
        "description": "Kedi, köpek, kuş ve tüm evcil hayvanlar için uzman bakım, beslenme ve sağlık rehberleri.",
        "inLanguage": "tr-TR",
        "publisher": { "@id": "https://www.enuygun.pet/#organization" },
        "isPartOf": { "@id": "https://www.enuygun.pet/#website" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://www.enuygun.pet/" },
          { "@type": "ListItem", "position": 2, "name": "Bakım Rehberi", "item": "https://www.enuygun.pet/blog" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Evcil hayvan bakım rehberi nedir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "EnuygunPet Bakım Rehberi, kedi, köpek ve kuş sahiplerine beslenme, sağlık, bakım ve ürün seçimi konularında uzman rehberleri sunar. Tüm yazılar Samsun Atakum'daki EnuygunPet Gross Market uzmanları tarafından hazırlanmıştır."
            }
          },
          {
            "@type": "Question",
            "name": "Kedi ve köpek için doğru mama nasıl seçilir?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Doğru mama seçimi için evcil hayvanın yaşı, kilosu, ırkı ve sağlık durumu dikkate alınmalıdır. Yavru, yetişkin, kısır ve yaşlı hayvanlar için farklı formüller mevcuttur. EnuygunPet mağazasında uzman personelimizden ücretsiz tavsiye alabilirsiniz."
            }
          },
          {
            "@type": "Question",
            "name": "EnuygunPet'in blog yazıları kimler için?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tüm evcil hayvan sahipleri için hazırlanmıştır. Kedi, köpek, muhabbet kuşu, papağan ve balık sahibi olup beslenme, sağlık ve bakım konularında bilgi edinmek isteyenler için pratik rehberler sunulmaktadır."
            }
          },
          {
            "@type": "Question",
            "name": "Bu rehberlerdeki ürünler Samsun'da nereden alınır?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rehberlerde bahsedilen tüm ürünler Samsun Atakum, Atatürk Bulvarı No:113'teki EnuygunPet Gross Market'te satılmaktadır. Haftanın her günü 09:00-21:00 hizmetinizdeyiz. Bilgi için WhatsApp: +90 542 211 49 44"
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
          <Link href="/">
            <a className="inline-flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </a>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Evcil Hayvan Bakım Rehberi</h1>
          </div>
          <p className="text-primary-foreground/80 text-sm">Kedi, köpek, kuş ve daha fazlası için uzman ipuçları</p>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-10">
            {CAT_ORDER.map(cat => {
              const catPosts = grouped[cat];
              if (!catPosts || catPosts.length === 0) return null;
              const meta = CAT_META[cat] ?? CAT_META.genel;
              return (
                <section key={cat} aria-label={meta.label}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-3 ${meta.color}`}>
                    {meta.icon}
                    <div>
                      <h2 className="text-sm font-bold leading-tight">{meta.label}</h2>
                      <p className="text-[11px] opacity-80">{meta.desc}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {catPosts.map(post => (
                      <Link key={post.slug} href={`/blog/${post.slug}`}>
                        <a className="flex items-center justify-between group p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all" data-testid={`blog-item-${post.slug}`}>
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="font-medium text-sm text-foreground leading-tight">{post.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.desc}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                        </a>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/">
            <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Ana Sayfaya Dön
            </a>
          </Link>
        </div>

        <footer className="mt-8 pb-4 text-center space-y-1">
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
