/**
 * Mağaza görselleri kendi sunucumuzda barındırılır.
 * Üçüncü taraf bir CDN'e bağlı kalmamak ve WebP sunabilmek için
 * tüm sayfalar bu tek kaynağı kullanır.
 */

export const SITE_ORIGIN = "https://www.enuygun.pet";

type StoreImageKey = "magaza" | "reyonlar" | "kedi" | "kopek" | "kus";

const ALT: Record<StoreImageKey, string> = {
  magaza: "EnuygunPet Samsun Atakum mağaza girişi",
  reyonlar: "EnuygunPet mağazasında mama ve kum reyonları",
  kedi: "Kedi maması ve kedi ürünleri reyonu",
  kopek: "Köpek maması ve köpek ürünleri reyonu",
  kus: "Kuş yemi ve kafes ürünleri reyonu",
};

function path(key: StoreImageKey, width: 800 | 1200, ext: "webp" | "jpg" = "webp"): string {
  return `/images/magaza/${key}-${width}.${ext}`;
}

/** Göreli yollar — sayfa içi <img> etiketleri için. */
export const STORE_IMAGE_PATHS: Record<StoreImageKey, string> = {
  magaza: path("magaza", 800),
  reyonlar: path("reyonlar", 800),
  kedi: path("kedi", 800),
  kopek: path("kopek", 800),
  kus: path("kus", 800),
};

/** Mutlak URL'ler — schema.org, og:image ve RSS için. */
export const STORE_IMAGE_URLS: Record<StoreImageKey, string> = {
  magaza: `${SITE_ORIGIN}${path("magaza", 1200)}`,
  reyonlar: `${SITE_ORIGIN}${path("reyonlar", 1200)}`,
  kedi: `${SITE_ORIGIN}${path("kedi", 1200)}`,
  kopek: `${SITE_ORIGIN}${path("kopek", 1200)}`,
  kus: `${SITE_ORIGIN}${path("kus", 1200)}`,
};

/** Paylaşım önizlemeleri için geniş uyumluluk gereken tek görsel. */
export const SHARE_IMAGE_URL = `${SITE_ORIGIN}${path("magaza", 1200, "jpg")}`;

export const STORE_IMAGE_LIST = Object.values(STORE_IMAGE_URLS);

export function storeImageAlt(key: StoreImageKey): string {
  return ALT[key];
}
