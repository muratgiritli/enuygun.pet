import { Link } from "wouter";
import { Home, BookOpen, ShoppingBag, ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="space-y-2">
          <p className="text-6xl font-bold text-primary">404</p>
          <h1 className="text-xl font-semibold text-foreground">Sayfa Bulunamadı</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aradığınız sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.
          </p>
        </div>

        <div className="space-y-2">
          <Link href="/">
            <a className="flex items-center justify-between w-full p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" data-testid="link-404-home">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Home className="w-4 h-4" />
                Ana Sayfaya Dön
              </span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </Link>
          <Link href="/blog">
            <a className="flex items-center justify-between w-full p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors" data-testid="link-404-blog">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <BookOpen className="w-4 h-4 text-primary" />
                Bakım Rehberleri
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </a>
          </Link>
          <Link href="/kedi-mamasi">
            <a className="flex items-center justify-between w-full p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors" data-testid="link-404-category">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <ShoppingBag className="w-4 h-4 text-primary" />
                Kedi & Köpek Mamaları
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </a>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Yardım için{" "}
          <a
            href="https://wa.me/905422114944"
            className="text-primary underline underline-offset-2"
            data-testid="link-404-whatsapp"
          >
            WhatsApp'tan bize ulaşın
          </a>
        </p>
      </div>
    </div>
  );
}
