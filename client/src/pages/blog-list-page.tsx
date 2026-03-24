import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { BookOpen, ChevronRight, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const CAT_LABELS: Record<string, string> = {
  kedi: "Kedi",
  kopek: "Köpek",
  kus: "Kuş",
  genel: "Genel",
};

const CAT_COLORS: Record<string, string> = {
  kedi: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  kopek: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  kus: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  genel: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

type BlogSummary = { slug: string; title: string; cat: string; desc: string };

export default function BlogListPage() {
  const { data: posts, isLoading } = useQuery<BlogSummary[]>({
    queryKey: ["/api/blog"],
  });

  useEffect(() => {
    document.title = "Blog — Evcil Hayvan Bakım Rehberi | EnuygunPet Samsun";
    let el = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!el) { el = document.createElement("meta") as HTMLMetaElement; document.head.appendChild(el); }
    el.setAttribute("content", "Kedi, köpek, kuş ve evcil hayvan bakımı hakkında uzman ipuçları. Samsun Atakum EnuygunPet Gross Market.");
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          <div className="space-y-3">
            {posts?.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <a className="flex items-center justify-between group p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all" data-testid={`blog-item-${post.slug}`}>
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="mb-1">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${CAT_COLORS[post.cat] || CAT_COLORS.genel}`}>
                        {CAT_LABELS[post.cat] || post.cat}
                      </span>
                    </div>
                    <p className="font-medium text-sm text-foreground leading-tight">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </Link>
            ))}
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
