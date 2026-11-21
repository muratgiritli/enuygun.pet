/**
 * Online mağaza (enuygunpetshop.com) koleksiyon ve arama adresleri.
 * Ürün sayfalarında rastgele anasayfa yerine ilgili kategoriye gidilir.
 */

import { SHOP_URL } from "./store-info";

const COLLECTIONS = {
  kedi: `${SHOP_URL}/kategori/kedi`,
  kopek: `${SHOP_URL}/kategori/kopek`,
  kus: `${SHOP_URL}/kategori/kus`,
  kemirgen: `${SHOP_URL}/kategori/kemirgen`,
  akvaryum: `${SHOP_URL}/kategori/akvaryum`,
  kediMamasi: `${SHOP_URL}/samsun-kedi-mamasi`,
  kopekMamasi: `${SHOP_URL}/samsun-kopek-mamasi`,
  kediKumu: `${SHOP_URL}/samsun-kedi-kumu`,
} as const;

function fold(value: string): string {
  return value.toLocaleLowerCase("tr-TR");
}

export function shopSearchUrl(query: string): string {
  const q = query.trim();
  if (!q) return SHOP_URL;
  return `${SHOP_URL}/search?q=${encodeURIComponent(q)}`;
}

/**
 * Anahtar kelime veya ürün etiketine göre en yakın mağaza koleksiyonu.
 * Marka adı varsa koleksiyon + arama yerine doğrudan arama kullanılır.
 */
export function shopUrlFor(productLabel?: string): string {
  if (!productLabel) return SHOP_URL;
  const lower = fold(productLabel);

  const branded =
    /royal\s*canin|pro\s*plan|proplan|hill'?s|hills|brit|reflex|acana|orijen|purina|felix|whiskas|pedigree|felicia|josera|gold wings|vancat|ever clean/.test(
      lower,
    );
  if (branded) return shopSearchUrl(productLabel);

  if (/(kedi)/.test(lower) && /(kum|pelet|tofu|silika|bentonit)/.test(lower)) {
    return COLLECTIONS.kediKumu;
  }
  if (/(kedi|kitten|kisir|kısır)/.test(lower) && /(mama|food)/.test(lower)) {
    return COLLECTIONS.kediMamasi;
  }
  if (/(köpek|kopek|dog|puppy)/.test(lower) && /(mama|food)/.test(lower)) {
    return COLLECTIONS.kopekMamasi;
  }
  if (/(kuş|kus|muhabbet|papağan|papagan|kanarya|sultan)/.test(lower)) {
    return COLLECTIONS.kus;
  }
  if (/(akvaryum|balık|balik|filtre|betta)/.test(lower)) {
    return COLLECTIONS.akvaryum;
  }
  if (/(hamster|tavşan|tavsan|kobay|kemirgen|chinchilla|sürüngen|surungen)/.test(lower)) {
    return COLLECTIONS.kemirgen;
  }
  if (/(köpek|kopek|tasma|koşum|kosum)/.test(lower)) return COLLECTIONS.kopek;
  if (/(kedi|kum|tuvalet|tırnal|tirmala)/.test(lower)) return COLLECTIONS.kedi;

  return shopSearchUrl(productLabel);
}

export const SHOP_COLLECTIONS = COLLECTIONS;
