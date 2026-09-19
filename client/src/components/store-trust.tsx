import { MapPin, Clock, Phone, ShieldCheck, Star, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
  STORE_ADDRESS_LINE,
  STORE_HOURS_LABEL,
  SHOP_URL,
  GOOGLE_REVIEWS_URL,
} from "@shared/store-info";

/**
 * Doğrulanabilir mağaza bilgileri ve gerçek Google yorumlarına bağlantı.
 * Site üzerinde puan veya yorum sayısı iddia edilmez; kaynak Google kaydıdır.
 */
export default function StoreTrust({ productLabel }: { productLabel?: string }) {
  const shopHref = productLabel
    ? `${SHOP_URL}/search?q=${encodeURIComponent(productLabel)}`
    : SHOP_URL;

  return (
    <section className="space-y-3" aria-label="Mağaza bilgileri ve sipariş">
      <Card className="p-4 space-y-3 border border-card-border">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Mağaza bilgileri
        </h2>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>{STORE_ADDRESS_LINE}</span>
          </li>
          <li className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>{STORE_HOURS_LABEL}</span>
          </li>
          <li className="flex items-start gap-2">
            <Phone className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <a href={PHONE_TEL_HREF} className="hover:text-primary">{PHONE_DISPLAY}</a>
          </li>
        </ul>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ürünler kapalı ambalajında satılır; son kullanma tarihi ve etiket mağazada kontrol edilebilir.
          Mağazada canlı hayvan satışı yapılmaz.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <a
          href={shopHref}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-shop-order"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold px-4 py-3 hover:opacity-90 transition-opacity"
        >
          <ShoppingCart className="w-4 h-4" />
          Online mağazada ara
        </a>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-google-reviews"
          className="flex items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold px-4 py-3 hover:border-primary hover:text-primary transition-colors"
        >
          <Star className="w-4 h-4" />
          Google yorumlarını oku
        </a>
      </div>
    </section>
  );
}
