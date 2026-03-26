import { Link } from "wouter";
import { Tag, MapPin, Heart, BookOpen, Grid3X3 } from "lucide-react";

export type AnimalType = "kedi" | "kopek" | "kus" | "balik" | "genel";

/* ── Sabit bağlantı setleri ─────────────────────────────────────────── */

const CATEGORY_LINKS = [
  { href: "/kedi-urunleri",          label: "Kedi Ürünleri" },
  { href: "/kopek-urunleri",         label: "Köpek Ürünleri" },
  { href: "/kus-urunleri",           label: "Kuş Ürünleri" },
  { href: "/balik-urunleri",         label: "Balık & Akvaryum" },
  { href: "/kucuk-hayvan-urunleri",  label: "Küçük Hayvanlar" },
  { href: "/surungen-urunleri",      label: "Sürüngenler" },
];

const HEALTH_LINKS = [
  { href: "/saglik/kedi",   label: "Kedi Sağlığı Rehberi" },
  { href: "/saglik/kopek",  label: "Köpek Sağlığı Rehberi" },
  { href: "/saglik/kus",    label: "Kuş Sağlığı Rehberi" },
  { href: "/saglik/balik",  label: "Balık & Akvaryum Rehberi" },
];

const LOCAL_LINKS = [
  { href: "/local/atakum-petshop",         label: "Atakum" },
  { href: "/local/yeni-mahalle-petshop",   label: "Yeni Mahalle" },
  { href: "/local/kurupelit-petshop",      label: "Kurupelit" },
  { href: "/local/ondokuzmayis-petshop",   label: "19 Mayıs" },
  { href: "/local/ilkadim-petshop",        label: "İlkadım" },
  { href: "/local/canik-petshop",          label: "Canik" },
  { href: "/local/tekkeköy-petshop",       label: "Tekkeköy" },
  { href: "/local/bafra-petshop",          label: "Bafra" },
];

const POPULAR_BY_TYPE: Record<AnimalType, { href: string; label: string }[]> = {
  kedi: [
    { href: "/kedi-mamasi-samsun",             label: "Kedi Maması Samsun" },
    { href: "/kedi-mamasi-atakum",             label: "Kedi Maması Atakum" },
    { href: "/kedi-kumu-samsun",               label: "Kedi Kumu Samsun" },
    { href: "/kisir-kedi-mamasi",              label: "Kısır Kedi Maması" },
    { href: "/sterilised-kedi-mamasi",         label: "Sterilised Kedi Maması" },
    { href: "/yavru-kedi-mamasi",              label: "Yavru Kedi Maması" },
    { href: "/royal-canin-samsun",             label: "Royal Canin Samsun" },
    { href: "/hills-science-plan-samsun",      label: "Hills Science Plan" },
  ],
  kopek: [
    { href: "/kopek-mamasi-samsun",            label: "Köpek Maması Samsun" },
    { href: "/kopek-mamasi-atakum",            label: "Köpek Maması Atakum" },
    { href: "/yavru-kopek-mamasi",             label: "Yavru Köpek Maması" },
    { href: "/kopek-tasmasi",                  label: "Köpek Tasması" },
    { href: "/kucuk-irk-kopek-mamasi",         label: "Küçük Irk Köpek Maması" },
    { href: "/buyuk-irk-kopek-mamasi",         label: "Büyük Irk Köpek Maması" },
    { href: "/royal-canin-samsun",             label: "Royal Canin Samsun" },
    { href: "/hills-science-plan-samsun",      label: "Hills Science Plan" },
  ],
  kus: [
    { href: "/gold-wings-muhabbet-yemi",       label: "Gold Wings Muhabbet Yemi" },
    { href: "/vitapol-kus-yemi",               label: "Vitapol Kuş Yemi" },
    { href: "/muhabbet-kusu-yemi-samsun",      label: "Muhabbet Kuşu Yemi" },
    { href: "/sultan-papagani-yemi",           label: "Sultan Papağanı Yemi" },
    { href: "/kanarya-yemi-samsun",            label: "Kanarya Yemi" },
    { href: "/kus-kafesi-samsun",              label: "Kuş Kafesi Samsun" },
    { href: "/kus-vitamini-samsun",            label: "Kuş Vitamini" },
    { href: "/mineral-tasi-kus",               label: "Mineral Taşı" },
  ],
  balik: [
    { href: "/balik-yemi-samsun",              label: "Balık Yemi Samsun" },
    { href: "/akvaryum-urunleri-samsun",       label: "Akvaryum Ürünleri" },
    { href: "/koi-yemi-samsun",                label: "Koi Yemi" },
    { href: "/akvaryum-filtre-samsun",         label: "Akvaryum Filtre" },
    { href: "/tropikal-balik-yemi",            label: "Tropikal Balık Yemi" },
    { href: "/akvaryum-susleme-samsun",        label: "Akvaryum Süsleme" },
    { href: "/petshop-samsun",                 label: "Petshop Samsun" },
    { href: "/petshop-atakum",                 label: "Petshop Atakum" },
  ],
  genel: [
    { href: "/petshop-samsun",                 label: "Petshop Samsun" },
    { href: "/petshop-atakum",                 label: "Petshop Atakum" },
    { href: "/kapida-teslim-petshop",          label: "Kapıda Teslim Petshop" },
    { href: "/kedi-mamasi-samsun",             label: "Kedi Maması Samsun" },
    { href: "/kopek-mamasi-samsun",            label: "Köpek Maması Samsun" },
    { href: "/kedi-kumu-samsun",               label: "Kedi Kumu Samsun" },
    { href: "/royal-canin-samsun",             label: "Royal Canin Samsun" },
    { href: "/pro-plan-samsun",                label: "Pro Plan Samsun" },
  ],
};

const BLOG_BY_TYPE: Record<AnimalType, { href: string; label: string }[]> = {
  kedi: [
    { href: "/blog/kisir-kedi-mamasi-hangisi",                 label: "Kısır Kedi Maması Hangisi?" },
    { href: "/blog/en-iyi-kedi-mamasi-hangisi-2025-rehberi",   label: "En İyi Kedi Maması 2025" },
    { href: "/blog/yavru-kedi-nasil-beslenir-kapsamli-rehber", label: "Yavru Kedi Nasıl Beslenir?" },
    { href: "/blog/kedi-tuy-dokulmesi-nedenleri-ve-cozumler",  label: "Kedi Tüy Dökülmesi" },
  ],
  kopek: [
    { href: "/blog/kopek-mamasi-secimi-tam-rehber-2025",            label: "Köpek Maması Seçimi 2025" },
    { href: "/blog/kopek-neden-mama-yemez-7-neden-ve-cozumler",     label: "Köpek Mama Yemezse?" },
    { href: "/blog/yavru-kopek-bakim-rehberi-ilk-haftalar",         label: "Yavru Köpek Bakım Rehberi" },
    { href: "/blog/kopek-tasmasi-ve-kosum-secim-rehberi",           label: "Köpek Tasması Seçimi" },
  ],
  kus: [
    { href: "/blog/muhabbet-kusu-nasil-beslenir-dogru-diyet",   label: "Muhabbet Kuşu Beslenmesi" },
    { href: "/blog/papagan-konusturmak-icin-egitim-rehberi",    label: "Papağan Konuşturma" },
    { href: "/blog/kanarya-bakim-rehberi-sesli-kuslar",         label: "Kanarya Bakım Rehberi" },
  ],
  balik: [
    { href: "/blog/samsuunda-petshop-secimi-nasil-yapilir",     label: "Petshop Nasıl Seçilir?" },
    { href: "/blog/kapida-teslim-petshop-samsun-rehberi",       label: "Kapıda Teslim Petshop" },
  ],
  genel: [
    { href: "/blog/samsuunda-petshop-secimi-nasil-yapilir",         label: "Samsun'da Petshop Seçimi" },
    { href: "/blog/kapida-teslim-petshop-samsun-rehberi",           label: "Kapıda Teslim Petshop" },
    { href: "/blog/hamster-bakim-rehberi-yeni-baslayanlar-icin",    label: "Hamster Bakım Rehberi" },
    { href: "/blog/atakumda-evcil-hayvan-sahiplenmek-nereden-baslamali", label: "Evcil Hayvan Sahiplenmek" },
  ],
};

/* ── Yardımcı: keyword string'den type tespit ─────────────────────────── */
export function detectType(text: string): AnimalType {
  const t = text.toLowerCase();
  if (t.includes("kuş") || t.includes("kus") || t.includes("papağan") || t.includes("papagan") || t.includes("kanarya") || t.includes("muhabbet"))
    return "kus";
  if (t.includes("köpek") || t.includes("kopek"))
    return "kopek";
  if (t.includes("kedi"))
    return "kedi";
  if (t.includes("balık") || t.includes("balik") || t.includes("akvaryum"))
    return "balik";
  return "genel";
}

/* ── Bileşen ─────────────────────────────────────────────────────────── */
interface InternalLinksProps {
  type?: AnimalType;
  currentSlug?: string;
  showLocal?: boolean;
  showHealth?: boolean;
  showBlog?: boolean;
}

export default function InternalLinksSection({
  type = "genel",
  currentSlug,
  showLocal = true,
  showHealth = true,
  showBlog = true,
}: InternalLinksProps) {
  const popularLinks = POPULAR_BY_TYPE[type].filter(l => l.href !== `/${currentSlug}`);
  const blogLinks = BLOG_BY_TYPE[type].filter(l => l.href !== `/blog/${currentSlug}`);

  return (
    <nav aria-label="Site içi bağlantılar" className="border-t border-border pt-6 mt-6 space-y-5">

      {/* Ana Kategoriler */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Grid3X3 className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Ana Kategoriler</h3>
        </div>
        <ul className="grid grid-cols-2 gap-1">
          {CATEGORY_LINKS.map(l => (
            <li key={l.href}>
              <Link href={l.href}>
                <a className="text-xs text-muted-foreground hover:text-primary transition-colors leading-relaxed">
                  {l.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popüler Aramalar (türe özgü) */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Tag className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Popüler Aramalar</h3>
        </div>
        <ul className="grid grid-cols-2 gap-1">
          {popularLinks.map(l => (
            <li key={l.href}>
              <Link href={l.href}>
                <a className="text-xs text-muted-foreground hover:text-primary transition-colors leading-relaxed">
                  {l.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Sağlık Rehberleri */}
      {showHealth && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Heart className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Sağlık Rehberleri</h3>
          </div>
          <ul className="grid grid-cols-2 gap-1">
            {HEALTH_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href}>
                  <a className="text-xs text-muted-foreground hover:text-primary transition-colors leading-relaxed">
                    {l.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Blog Yazıları */}
      {showBlog && blogLinks.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">İlgili Rehberler</h3>
          </div>
          <ul className="space-y-0.5">
            {blogLinks.map(l => (
              <li key={l.href}>
                <Link href={l.href}>
                  <a className="text-xs text-muted-foreground hover:text-primary transition-colors leading-relaxed">
                    {l.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* İlçe ve Semt Bazlı Petshop */}
      {showLocal && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Samsun Semtlerine Göre</h3>
          </div>
          <ul className="grid grid-cols-2 gap-1">
            {LOCAL_LINKS.map(l => (
              <li key={l.href}>
                <Link href={l.href}>
                  <a className="text-xs text-muted-foreground hover:text-primary transition-colors leading-relaxed">
                    {l.label} Petshop
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
