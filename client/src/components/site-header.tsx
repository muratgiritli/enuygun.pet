import { motion } from "framer-motion";
import { Link } from "wouter";
import { Phone, Clock, Star, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const PHONE = "+905422114944";
const WHATSAPP_URL = `https://wa.me/905422114944?text=Merhaba,%20Enuygun.pet%20mağazanızdaki%20ürünler%20hakkında%20bilgi%20almak%20istiyorum.`;
const MAPS_URL = "https://www.google.com/maps/place/Samsun+Petshop+Enuygunpet/@41.3494032,36.2410372,17z/data=!4m10!1m2!2m1!1senuygunpet!3m6!1s0x408879a38cad8b89:0x2f8d7996011cec2d!8m2!3d41.349366!4d36.243738!15sCgplbnV5Z3VucGV0WgwiCmVudXlndW5wZXSSAQlwZXRfc3RvcmXgAQA!16s%2Fg%2F11x2x7jtwk?entry=ttu";
const SHOP_URL = "https://www.atakumpetshop.com";

const categories = [
  { label: "Kedi Maması", emoji: "🐱", color: "from-orange-400 to-amber-500" },
  { label: "Köpek Maması", emoji: "🐶", color: "from-blue-400 to-blue-600" },
  { label: "Kuş Ürünleri", emoji: "🦜", color: "from-green-400 to-emerald-600" },
  { label: "Akvaryum", emoji: "🐠", color: "from-cyan-400 to-blue-500" },
  { label: "Kemirgen Sürüngen", emoji: "🐹", color: "from-slate-400 to-slate-600" },
  { label: "Atakum Petshop", emoji: "📍", color: "from-red-400 to-rose-600" },
];

export default function SiteHeader() {
  return (
    <>
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-home-logo">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow">
              <span className="text-lg">🐾</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-gray-900 tracking-tight block" data-testid="text-brand-name">
                ENUYGUN<span className="text-green-600">.PET</span>
              </span>
              <p className="text-[10px] text-gray-500 leading-tight">Petshop Gross Market · Samsun Atakum</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <a href={`tel:${PHONE}`} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center bg-white shadow-sm" data-testid="link-header-phone" aria-label="Telefon">
              <Phone className="w-4 h-4 text-gray-600" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center shadow-sm" data-testid="link-header-whatsapp" aria-label="WhatsApp">
              <SiWhatsapp className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </header>

      {/* ── QUICK INFO BAR ── */}
      <div className="bg-green-600 text-white px-4 py-2.5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 opacity-80" />
            <span className="text-xs font-medium">Her Gün 09:00–21:00</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="text-xs font-medium">4.8 · 120+ Yorum</span>
          </div>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1" data-testid="link-maps-bar">
            <MapPin className="w-3.5 h-3.5 opacity-80" />
            <span className="text-xs font-medium">Haritada Gör</span>
          </a>
        </div>
      </div>

      {/* ── CTA + KATEGORİLER ── */}
      <section className="px-4 pt-5 pb-2 max-w-lg mx-auto" aria-label="Online alışveriş ve kategoriler">
        <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center mb-3" data-testid="link-categories-cta">
          <span className="animate-pulse inline-flex items-center gap-2 bg-red-600 text-white text-sm font-extrabold px-5 py-2.5 rounded-full shadow-lg tracking-wide">
            🛒 TIKLA ONLİNE ALIŞVERİŞ YAP
          </span>
        </a>
        <div className="grid grid-cols-3 gap-2.5">
          {categories.map((cat, i) => (
            <a key={cat.label} href={SHOP_URL} target="_blank" rel="noopener noreferrer" data-testid={`link-category-${i}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className={`rounded-2xl bg-gradient-to-br ${cat.color} p-3 flex flex-col items-center justify-center gap-1.5 shadow-sm aspect-square`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-white text-[11px] font-bold text-center leading-tight">{cat.label}</span>
              </motion.div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
