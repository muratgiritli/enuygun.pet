/**
 * Mağaza ve kategori görselleri kendi sunucumuzda barındırılır.
 * Üçüncü taraf bir CDN'e bağlı kalmamak ve WebP sunabilmek için
 * tüm sayfalar bu tek kaynağı kullanır.
 */

export const SITE_ORIGIN = "https://www.enuygun.pet";

type StoreImageKey = "magaza" | "reyonlar" | "kedi" | "kopek" | "kus";
type CategoryImageKey = "cat" | "dog" | "bird" | "fish" | "hamster" | "petshop";

const ALT: Record<StoreImageKey, string> = {
  magaza: "EnuygunPet Samsun Atakum mağaza girişi",
  reyonlar: "EnuygunPet mağazasında mama ve kum reyonları",
  kedi: "Kedi maması ve kedi ürünleri reyonu",
  kopek: "Köpek maması ve köpek ürünleri reyonu",
  kus: "Kuş yemi ve kafes ürünleri reyonu",
};

const CATEGORY_ALT: Record<CategoryImageKey, string> = {
  cat: "Kedi maması, kum ve kedi ürünleri",
  dog: "Köpek maması, tasma ve köpek ürünleri",
  bird: "Kuş yemi, kafes ve kuş ürünleri",
  fish: "Akvaryum malzemeleri ve balık yemi",
  hamster: "Hamster, tavşan ve küçük hayvan ürünleri",
  petshop: "EnuygunPet Atakum petshop ürünleri",
};

function path(key: StoreImageKey, width: 800 | 1200, ext: "webp" | "jpg" = "webp"): string {
  return `/images/magaza/${key}-${width}.${ext}`;
}

function categoryPath(key: CategoryImageKey): string {
  return `/images/kategori/${key}-600.webp`;
}

/** Göreli yollar — sayfa içi <img> etiketleri için. */
export const STORE_IMAGE_PATHS: Record<StoreImageKey, string> = {
  magaza: path("magaza", 800),
  reyonlar: path("reyonlar", 800),
  kedi: path("kedi", 800),
  kopek: path("kopek", 800),
  kus: path("kus", 800),
};

export const CATEGORY_IMAGE_PATHS: Record<CategoryImageKey, string> = {
  cat: categoryPath("cat"),
  dog: categoryPath("dog"),
  bird: categoryPath("bird"),
  fish: categoryPath("fish"),
  hamster: categoryPath("hamster"),
  petshop: categoryPath("petshop"),
};

/** Mutlak URL'ler — schema.org, og:image ve RSS için. */
export const STORE_IMAGE_URLS: Record<StoreImageKey, string> = {
  magaza: `${SITE_ORIGIN}${path("magaza", 1200)}`,
  reyonlar: `${SITE_ORIGIN}${path("reyonlar", 1200)}`,
  kedi: `${SITE_ORIGIN}${path("kedi", 1200)}`,
  kopek: `${SITE_ORIGIN}${path("kopek", 1200)}`,
  kus: `${SITE_ORIGIN}${path("kus", 1200)}`,
};

export const CATEGORY_IMAGE_URLS: Record<CategoryImageKey, string> = {
  cat: `${SITE_ORIGIN}${categoryPath("cat")}`,
  dog: `${SITE_ORIGIN}${categoryPath("dog")}`,
  bird: `${SITE_ORIGIN}${categoryPath("bird")}`,
  fish: `${SITE_ORIGIN}${categoryPath("fish")}`,
  hamster: `${SITE_ORIGIN}${categoryPath("hamster")}`,
  petshop: `${SITE_ORIGIN}${categoryPath("petshop")}`,
};

/** Paylaşım önizlemeleri için geniş uyumluluk gereken tek görsel. */
export const SHARE_IMAGE_URL = `${SITE_ORIGIN}${path("magaza", 1200, "jpg")}`;

export const STORE_IMAGE_LIST = Object.values(STORE_IMAGE_URLS);

export function storeImageAlt(key: StoreImageKey): string {
  return ALT[key];
}

export function categoryImageAlt(key: CategoryImageKey): string {
  return CATEGORY_ALT[key];
}

export function categoryImageKeyFor(text: string): CategoryImageKey {
  const lower = text.toLocaleLowerCase("tr-TR");
  if (/(kuş|kus|muhabbet|papağan|papagan|kanarya)/.test(lower)) return "bird";
  if (/(akvaryum|balık|balik)/.test(lower)) return "fish";
  if (/(hamster|tavşan|tavsan|kobay|kemirgen|sürüngen|surungen)/.test(lower)) return "hamster";
  if (/(köpek|kopek|dog|puppy)/.test(lower)) return "dog";
  if (/(kedi|kitten|kısır|kisir)/.test(lower)) return "cat";
  return "petshop";
}
