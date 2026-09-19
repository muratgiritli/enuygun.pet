/**
 * Düşük değerli arama niyetlerini kanonik sayfalara toplayan kurallar.
 * Rakip mağaza adları, başka perakendeciler, yabancı dil sorguları,
 * ikinci el ilanları ve canlı hayvan satışı aramaları burada ele alınır.
 */

export const PRUNE_TARGETS = {
  atakumPetshop: "/atakum-petshop",
  samsunPetshop: "/petshop-samsun",
  kediMamasi: "/kedi-mamasi",
  kopekMamasi: "/kopek-mamasi",
  kediKumu: "/kedi-kumu",
  kediUrunleri: "/kedi-urunleri",
  kopekUrunleri: "/kopek-urunleri",
  kusUrunleri: "/kus-urunleri",
  balikUrunleri: "/balik-urunleri",
  kucukHayvanUrunleri: "/kucuk-hayvan-urunleri",
  surungenUrunleri: "/surungen-urunleri",
} as const;

/** Kendi petshop sayfalarımız — asla yönlendirilmez. */
const OWN_PETSHOP_SLUGS = new Set([
  "petshop-samsun",
  "atakum-petshop",
  "kapida-teslim-petshop",
]);

const PETSHOP_TOKEN = /(^|-)(petshop|petshoplar|petshoplari|pet-shop|pet-shoplar|pet-market|pet-marketi|pet-store|pet-avm|petmarket|petstore|petsop|pet-sop)($|-)/;

/** Zincir market ve pazaryerleri: stok ve fiyat bizde değil. */
const OTHER_RETAILER = /(^|-)(a101|a-101|bim|bim-market|sok-market|sokmarket|migros|macrocenter|carrefour|carrefoursa|metro-market|hakmar|tarim-kredi|trendyol|hepsiburada|hepsi-burada|amazon|n11|gittigidiyor|ciceksepeti|pttavm|getir|banabi|teknosa|lcw|ikea|decathlon|watsons|gratis|rossmann|tekzen|koctas|bauhaus)($|-)/;

/** Yabancı dil ve konum tabanlı genel aramalar. */
const FOREIGN_QUERY = /(^|-)(near-me|nearme|proximite|cerca-de-mi|cerca|nearby|open-now|delivery|online-shop|pet-supplies|pet-supply|cat-food|dog-food|bird-food|buy-pet-food|pet-food|petfood|best-cat-food|best-dog-food|price-list|where-to-buy)($|-)/;

/** İkinci el ilan siteleri ve kullanılmış ürün aramaları. */
const SECOND_HAND = /(^|-)(2-el|2el|iki-el|ikinci-el|ikinciel|sifir-ayarinda|letgo|sahibinden|dolap|gardrops|spotci|bit-pazari)($|-)/;

/** Canlı hayvan satın alma niyeti taşıyan ifadeler. */
const LIVE_ANIMAL_INTENT = /(^|-)(satilik|satilir|satis|satisi|satan|satanlar|satan-yerler|satilan|satilan-yerler|nereden-alinir|nereden-alabilirim|nerede-satilir|sahiplendirme|sahiplenme|ucretsiz-sahiplendirme|yavrusu|yavrulari|ilan|ilanlari)($|-)/;

/** Fiyat sorgusu tek başına canlı hayvan niyeti sayılmaz; tür ile birlikte değerlendirilir. */
const LIVE_ANIMAL_PRICE = /(^|-)(fiyat|fiyati|fiyatlari|kac-tl|ne-kadar|ucuz)($|-)/;

/** Mağazada satılmayan canlı hayvan türleri. */
const LIVE_SPECIES = /(^|-)(hamster|hamsterlar|tavsan|tavsanlar|kobay|ginepig|gine-domuzu|guinea-pig|chinchilla|sinsilla|cincilla|muhabbet-kusu|muhabbet-kuslari|sultan-papagani|papagan|papaganlar|jako|kakadu|macaw|kanarya|cennet-papagani|forpus|agapornis|iguana|gecko|bukalemun|yilan|piton|kaplumbaga|orumcek|tarantula|japon-baligi|betta|lepistes|melek-balik|discus|oscar-balik|koi|akvaryum-baligi|akvaryum-balilari|kedi-yavrusu|kopek-yavrusu|scottish-fold|british-shorthair|maine-coon|ragdoll|bengal|sfenks|sphynx|golden-retriever|labrador|pomeranian|chihuahua|husky|pug|beagle|rottweiler|doberman|kangal|malinois|poodle|maltese|maltez|shih-tzu|yorkshire|terrier|bulldog|samoyed|akita|chow-chow)($|-)/;

/** Ürün niyeti taşıyan kelimeler — bu varsa canlı hayvan kuralı uygulanmaz. */
const PRODUCT_TOKEN = /(^|-)(mama|mamasi|mamalari|yem|yemi|yemleri|kum|kumu|kumlari|tasma|tasmasi|kosum|oyuncak|oyuncagi|yatak|yatagi|kulube|kulubesi|kafes|kafesi|tuvalet|tuvaleti|tasima|canta|cantasi|tirmalama|suluk|sulugu|mamalik|kap|kabi|sampuan|sampuani|tarak|fircasi|firca|tirnak|makas|vitamin|takviye|probiyotik|parazit|damla|damlasi|pire|kene|talas|altlik|yonca|pelet|konserve|odul|odulu|bisküvi|biskuvi|snack|filtre|motor|isitici|akvaryum-malzeme|dekor|teraryum|mineral|gaga-tasi|banyo|banyoluk|tunek|elbise|mont|kap-mama|otomatik|besleyici|ev|evi|yuva|yuvasi|bez|bezi|kraker|krakeri|tuz|tuzu|kemik|kemigi|ip|ipi|cubuk|cubugu|merdiven|salincak|cark|carki|teker|tekerlek|biberon|aparat|kiyafet|kiyafetleri|halat|urun|urunleri|malzeme|malzemeleri|aksesuar|aksesuari)($|-)/;

/** Yalnızca tek türe ait mama markaları — tür kelimesi geçmeyen sorgularda ipucu verir. */
const CAT_ONLY_BRAND = /(^|-)(felix|whiskas|sheba|friskies|kitekat|gourmet|vancat|catsan|lindocat|toi-moi|ever-clean)($|-)/;
const DOG_ONLY_BRAND = /(^|-)(pedigree|chappi|dogsan|dogstar|cesar|dog-chow)($|-)/;

/** Ürün grubu → kanonik kategori eşlemesi. */
function categoryFor(slug: string): string {
  const cat = /(^|-)(kedi|kitten|sterilised|kisir)($|-)/.test(slug) || CAT_ONLY_BRAND.test(slug);
  const dog = /(^|-)(kopek|köpek|puppy|dog)($|-)/.test(slug) || DOG_ONLY_BRAND.test(slug);
  const bird = /(^|-)(kus|kuş|muhabbet|papagan|kanarya|sultan)($|-)/.test(slug);
  const fish = /(^|-)(balik|akvaryum|betta|lepistes|discus)($|-)/.test(slug);
  const small = /(^|-)(hamster|tavsan|kobay|ginepig|guinea-pig|chinchilla|kemirgen)($|-)/.test(slug);
  const reptile = /(^|-)(iguana|gecko|kaplumbaga|yilan|piton|bukalemun|surungen|teraryum)($|-)/.test(slug);

  if (cat && /(^|-)(kum|kumu|kumlari)($|-)/.test(slug)) return PRUNE_TARGETS.kediKumu;
  if (cat && /(^|-)(mama|mamasi|mamalari)($|-)/.test(slug)) return PRUNE_TARGETS.kediMamasi;
  if (dog && /(^|-)(mama|mamasi|mamalari)($|-)/.test(slug)) return PRUNE_TARGETS.kopekMamasi;
  if (small) return PRUNE_TARGETS.kucukHayvanUrunleri;
  if (reptile) return PRUNE_TARGETS.surungenUrunleri;
  if (fish) return PRUNE_TARGETS.balikUrunleri;
  if (bird) return PRUNE_TARGETS.kusUrunleri;
  if (dog) return PRUNE_TARGETS.kopekUrunleri;
  if (cat) return PRUNE_TARGETS.kediUrunleri;
  return PRUNE_TARGETS.samsunPetshop;
}

function petshopCanonical(slug: string): string {
  return /(^|-)atakum($|-)/.test(slug)
    ? PRUNE_TARGETS.atakumPetshop
    : PRUNE_TARGETS.samsunPetshop;
}

/**
 * Bir slug düşük değerli bir aramaya aitse gideceği kanonik yolu döndürür.
 */
export function resolvePrunedSlug(slug: string): string | null {
  if (!slug || slug.includes("/")) return null;
  if (OWN_PETSHOP_SLUGS.has(slug)) return null;

  if (PETSHOP_TOKEN.test(slug)) return petshopCanonical(slug);
  if (OTHER_RETAILER.test(slug)) return categoryFor(slug);
  if (FOREIGN_QUERY.test(slug)) return categoryFor(slug);
  if (SECOND_HAND.test(slug)) return categoryFor(slug);

  if (LIVE_SPECIES.test(slug) && !PRODUCT_TOKEN.test(slug)) {
    if (LIVE_ANIMAL_INTENT.test(slug) || LIVE_ANIMAL_PRICE.test(slug)) {
      return categoryFor(slug);
    }
  }

  return null;
}
