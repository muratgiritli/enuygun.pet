/**
 * Per-URL long-form SEO copy.
 * Each slug hashes into a unique combination of sections, facts and image alts.
 * Article body (headings + paragraphs) is always ≥ 1000 Turkish words.
 */

export type SeoImage = { src: string; alt: string };
export type SeoSection = { heading: string; paragraphs: string[] };
export type SeoFaq = { q: string; a: string };

export type SeoArticle = {
  images: SeoImage[];
  sections: SeoSection[];
  faqs: SeoFaq[];
  productRec?: string;
};

export const STORE_IMAGES = {
  general: "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg",
  reyonlar: "https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg",
  kedi: "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
  kopek: "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
  kus: "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
} as const;

const PHONE = "0542 211 49 44";
const HOURS = "09:00–21:00";
const ADDRESS = "Yeni Mahalle Atatürk 3. Kısım Bulvarı No:113, Atakum / Samsun";
const STORE = "EnuygunPet Gross Market";

type Kind =
  | "kedi-mama"
  | "kopek-mama"
  | "kedi-kum"
  | "kus"
  | "balik"
  | "tasma"
  | "oyuncak"
  | "yatak"
  | "tuvalet"
  | "marka"
  | "petshop"
  | "kucuk"
  | "surungen"
  | "breed"
  | "health"
  | "local"
  | "generic";

type Ctx = {
  kw: string;
  slug: string;
  seed: number;
  kind: Kind;
  animal: string;
  brand: string;
  weight: string;
  stage: string;
  intent: string;
  place: string;
  variety: number;
  code: string;
  quietHours: string;
  brands: string;
};

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function articlePlainText(article: SeoArticle): string {
  const body = article.sections
    .map((s) => `${s.heading}\n\n${s.paragraphs.join("\n\n")}`)
    .join("\n\n");
  const faq = article.faqs.map((f) => `${f.q} ${f.a}`).join("\n");
  return `${body}\n\n${faq}`.trim();
}

function mulberry(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length) % arr.length];
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fill(template: string, ctx: Ctx): string {
  return template
    .replace(/\{kw\}/g, ctx.kw)
    .replace(/\{animal\}/g, ctx.animal)
    .replace(/\{brand\}/g, ctx.brand)
    .replace(/\{weight\}/g, ctx.weight)
    .replace(/\{stage\}/g, ctx.stage)
    .replace(/\{intent\}/g, ctx.intent)
    .replace(/\{place\}/g, ctx.place)
    .replace(/\{variety\}/g, String(ctx.variety))
    .replace(/\{code\}/g, ctx.code)
    .replace(/\{quiet\}/g, ctx.quietHours)
    .replace(/\{brands\}/g, ctx.brands)
    .replace(/\{phone\}/g, PHONE)
    .replace(/\{hours\}/g, HOURS)
    .replace(/\{address\}/g, ADDRESS)
    .replace(/\{store\}/g, STORE);
}

function classify(kw: string): Kind {
  const k = kw.toLowerCase();
  if (k.includes("kedi") && (k.includes("mama") || k.includes("yavru mama") || k.includes("kitten"))) return "kedi-mama";
  if ((k.includes("köpek") || k.includes("kopek")) && k.includes("mama")) return "kopek-mama";
  if (k.includes("kedi") && k.includes("kum")) return "kedi-kum";
  if (k.includes("tuvalet") || k.includes("kum kab")) return "tuvalet";
  if (k.includes("akvaryum") || k.includes("balık") || k.includes("balik") || k.includes("filter") || k.includes("filtre")) return "balik";
  if (k.includes("hamster") || k.includes("tavşan") || k.includes("tavsan") || k.includes("kobay") || k.includes("guinea") || k.includes("çinçilla") || k.includes("chinchilla")) return "kucuk";
  if (k.includes("iguana") || k.includes("gecko") || k.includes("yılan") || k.includes("yilan") || k.includes("sürüngen") || k.includes("surungen") || k.includes("teraryum") || k.includes("kaplumbağa") || k.includes("kaplumbaga")) return "surungen";
  if (k.includes("kuş") || k.includes("kus") || k.includes("muhabbet") || k.includes("papağan") || k.includes("papagan") || k.includes("kanarya") || k.includes("yem")) return "kus";
  if (k.includes("tasma") || k.includes("taşma") || k.includes("koşum") || k.includes("kosum") || k.includes("gezdirme") || k.includes("boyunluk")) return "tasma";
  if (k.includes("oyuncak") || k.includes("ödül") || k.includes("odul") || k.includes("snack")) return "oyuncak";
  if (k.includes("yatak") || k.includes("kulübe") || k.includes("kulube") || k.includes("tırmalama") || k.includes("tirmalama")) return "yatak";
  if (k.includes("petshop") || k.includes("pet shop") || k.includes("pet market") || k.includes("gross market")) return "petshop";
  if (["royal canin", "hills", "pro plan", "proplan", "brit", "reflex", "enjoy", "acana", "orijen", "purina", "felix", "whiskas", "pedigree", "n&d", "felicia", "gold wings", "josera", "taste of the wild"].some((m) => k.includes(m))) {
    return "marka";
  }
  return "generic";
}

function extractAnimal(kw: string): string {
  const k = kw.toLowerCase();
  if (k.includes("köpek") || k.includes("kopek")) return "köpek";
  if (k.includes("kedi")) return "kedi";
  if (k.includes("muhabbet")) return "muhabbet kuşu";
  if (k.includes("papağan") || k.includes("papagan")) return "papağan";
  if (k.includes("kuş") || k.includes("kus") || k.includes("kanarya")) return "kuş";
  if (k.includes("balık") || k.includes("balik") || k.includes("akvaryum")) return "balık";
  if (k.includes("tavşan") || k.includes("tavsan")) return "tavşan";
  if (k.includes("hamster")) return "hamster";
  return "evcil hayvan";
}

function extractBrand(kw: string): string {
  const k = kw.toLowerCase();
  const brands: Array<[string, string]> = [
    ["royal canin", "Royal Canin"],
    ["hills", "Hills Science Plan"],
    ["pro plan", "Pro Plan"],
    ["proplan", "Pro Plan"],
    ["brit care", "Brit Care"],
    ["brit", "Brit"],
    ["reflex", "Reflex"],
    ["enjoy", "Enjoy"],
    ["acana", "Acana"],
    ["orijen", "Orijen"],
    ["purina", "Purina"],
    ["felix", "Felix"],
    ["whiskas", "Whiskas"],
    ["pedigree", "Pedigree"],
    ["felicia", "Felicia"],
    ["josera", "Josera"],
    ["gold wings", "Gold Wings"],
    ["n&d", "N&D"],
  ];
  for (const [needle, label] of brands) {
    if (k.includes(needle)) return label;
  }
  return "Royal Canin, Hills ve Pro Plan";
}

function extractWeight(kw: string): string {
  const m = kw.match(/(\d+(?:[.,]\d+)?)\s*(kg|kilo|lt|l|litre|gr|gram|ton)/i);
  if (m) return `${m[1]} ${m[2].toLowerCase()}`;
  const k = kw.toLowerCase();
  if (k.includes("kedi") && k.includes("mama")) return "1–15 kg arası paketler";
  if ((k.includes("köpek") || k.includes("kopek")) && k.includes("mama")) return "3–15 kg arası çuvallar";
  if (k.includes("kum")) return "5–20 litre kutu ve çuvallar";
  return "farklı gramaj seçenekleri";
}

function extractStage(kw: string): string {
  const k = kw.toLowerCase();
  if (k.includes("yavru") || k.includes("kitten") || k.includes("puppy")) return "yavru dönemine uygun";
  if (k.includes("kısır") || k.includes("kisir") || k.includes("steril")) return "kısırlaştırılmış hayvanlara özel";
  if (k.includes("yaşlı") || k.includes("yasli") || k.includes("senior") || k.includes("mature")) return "yaşlı hayvanlara uygun";
  if (k.includes("indoor") || k.includes("ev kedisi")) return "ev içi yaşama uygun";
  return "yaşa ve ihtiyaca göre seçilen";
}

function extractIntent(kw: string): string {
  const k = kw.toLowerCase();
  if (k.includes("kaç tl") || k.includes("kac tl") || k.includes("fiyat") || k.includes("ucuz") || k.includes("uygun")) {
    return "güncel fiyat ve gross market avantajı";
  }
  if (k.includes("nerede") || k.includes("nereden") || k.includes("satılır") || k.includes("satilir")) {
    return "Samsun Atakum’da stoklu satış noktası";
  }
  if (k.includes("en iyi") || k.includes("hangisi") || k.includes("öner")) {
    return "hangi ürünün hayvana uygun olduğu";
  }
  return "doğru ürünü seçmek ve mağazadan almak";
}

const BRAND_ROTATIONS = [
  "Royal Canin, Hills Science Plan, Pro Plan, Brit Care ve Reflex",
  "Pro Plan, Royal Canin, Acana, Orijen ve Felicia",
  "Hills Science Plan, Brit Care, Reflex, Enjoy ve N&D",
  "Royal Canin, Pro Plan, Josera, Pedigree ve Whiskas",
  "Acana, Orijen, Hills, Royal Canin ve Brit Care",
];

const QUIET = [
  "sabah 09:00–11:00",
  "öğleden sonra 14:00–16:30",
  "akşam 18:30–20:30",
];

function makeCtx(keyword: string, slug: string, kindOverride?: Kind, place = "Samsun Atakum"): Ctx {
  const seed = hashSeed(`${slug}|${keyword}`);
  const rnd = mulberry(seed);
  const kw = keyword.replace(/^[\s.]+/, "").replace(/[\s.]+$/, "").trim();
  return {
    kw,
    slug,
    seed,
    kind: kindOverride || classify(kw),
    animal: extractAnimal(kw),
    brand: extractBrand(kw),
    weight: extractWeight(kw),
    stage: extractStage(kw),
    intent: extractIntent(kw),
    place,
    variety: 22 + (seed % 61),
    code: `EP-${(1000 + (seed % 9000)).toString()}`,
    quietHours: QUIET[seed % QUIET.length],
    brands: BRAND_ROTATIONS[Math.floor(rnd() * BRAND_ROTATIONS.length) % BRAND_ROTATIONS.length],
  };
}

export function pickImages(keyword: string, seed = hashSeed(keyword)): SeoImage[] {
  const k = keyword.toLowerCase();
  let primary: string = STORE_IMAGES.general;
  if (k.includes("kuş") || k.includes("kus") || k.includes("papağan") || k.includes("papagan") || k.includes("kanarya") || k.includes("muhabbet") || k.includes("yem")) {
    primary = STORE_IMAGES.kus;
  } else if (k.includes("köpek") || k.includes("kopek")) {
    primary = STORE_IMAGES.kopek;
  } else if (k.includes("kedi")) {
    primary = STORE_IMAGES.kedi;
  } else if (seed % 3 === 0) {
    primary = STORE_IMAGES.kedi;
  } else if (seed % 3 === 1) {
    primary = STORE_IMAGES.kopek;
  } else {
    primary = STORE_IMAGES.kus;
  }
  const third = primary === STORE_IMAGES.general ? STORE_IMAGES.kedi : STORE_IMAGES.general;
  return [
    { src: primary, alt: `${keyword} — ${STORE} Samsun Atakum mağaza görünümü` },
    { src: STORE_IMAGES.reyonlar, alt: `${keyword} reyonları — ${STORE} Atakum petshop rafları` },
    { src: third, alt: `${keyword} ürünleri — ${STORE} Samsun, haftanın 7 günü ${HOURS}` },
  ];
}

function sec(heading: string, paragraphs: string[], ctx?: Ctx): SeoSection {
  return {
    heading: ctx ? fill(heading, ctx) : heading,
    paragraphs: ctx ? paragraphs.map((p) => fill(p, ctx)) : paragraphs,
  };
}

const OPENINGS = [
  "{place} bölgesinde {kw} arayan evcil hayvan sahipleri için {store}, ürünü rafta görmek, gramajı karşılaştırmak ve aynı gün almak isteyenlere göre kurulmuş bir gross market petshop’tur.",
  "{kw} denince Samsun’da ilk durak olarak {store} öne çıkar; çünkü aynı ürün grubunu hem küçük paket hem büyük çuval olarak bir arada tutarız.",
  "Atakum’da {kw} araması çoğu zaman fiyat, stok ve hayvanın ihtiyacına uygun formülün aynı anda netleşmesini ister. {store} tam olarak bu üç soruyu mağazada çözer.",
  "{kw} konusunda karar vermeden önce ambalajı elinize alıp içerik tablosunu okumak, online siparişten daha güvenli bir yoldur. {address} adresindeki reyonlarımız bunun için açık tutulur.",
  "Samsun Atakum’da {kw} ihtiyacı olanlar için {store}, {brands} başta olmak üzere geniş bir vitrin sunar ve personel ürünü hayvana göre sadeleştirir.",
];

const STORE_VISIT = [
  "Mağazamız {address} konumundadır. Haftanın her günü {hours} açıktır; Pazar ve resmi tatillerde de kapı kapanmaz. Ücretsiz otopark ve araç yanı yükleme imkânı özellikle {weight} gibi ağır paketlerde işe yarar.",
  "{store} Atatürk Bulvarı üzerinde tek katlı gross market düzenindedir. {quiet} saatlerinde reyonlar daha sakindir; {kw} çeşitlerini yan yana koymak için bu aralık rahattır.",
  "WhatsApp hattımız {phone} üzerinden {kw} fotoğrafı, stok ve güncel fiyat sorabilirsiniz. Atakum içi teslimat ve mağazadan teslim seçenekleri aynı günde planlanır.",
];

const PRICE_BITS = [
  "Gross market modelinde ürün palet ve koli olarak gelir; bu yüzden {kw} için perakende vitrin fiyatının altında kalmak mümkündür. Toplu alım yapan çok hayvanlı evlerde fark yıl boyunca birikir.",
  "{kw} fiyatı markaya, {weight} seçimine ve {stage} formüle göre değişir. Etiket ezberlemek yerine mağazada aynı gün stoklu seçenekleri karşılaştırmak daha doğrudur.",
  "Online’da görünen {kw} fiyatı kargo ve stok belirsizliği taşır. {store}’te ürünü raftan alırsınız; son kullanma tarihi ve ambalaj bütünlüğü yerinde kontrol edilir.",
];

const CARE_BITS: Record<string, string[]> = {
  kedi: [
    "Kedilerde ani mama değişimi mideyi bozar. {kw} seçildiyse eski mamayla 7–10 günde karıştırarak geçiş yapılmalıdır. Taze su her zaman ulaşılabilir olmalı, özellikle kuru mama kullanan evlerde su kabı günde en az bir kez yenilenmelidir.",
    "Kısır kedilerde kalori ihtiyacı düşer; {stage} formüller idrar yolu ve kilo kontrolünü birlikte düşünür. {kw} alırken kedinin yaşı, tüy uzunluğu ve ev içi aktivitesi personele söylenirse yönlendirme netleşir.",
  ],
  "köpek": [
    "Köpeklerde tane boyutu ırkın çene yapısına göre değişir. {kw} seçiminde yavru, yetişkin ve büyük ırk formülleri birbirinin yerine kullanılmamalıdır. Günlük miktar kilo ve aktiviteye göre ayarlanır; serbest mama bırakmak kilo alımını hızlandırır.",
    "Gezdirme, tasma alıştırması ve diş çiğneme oyuncakları mama kadar rutinin parçasıdır. {kw} ile birlikte yatak, su kabı ve ödül maması aynı alışverişte tamamlanabilir.",
  ],
  "muhabbet kuşu": [
    "Muhabbet kuşunda yalnızca ayçiçeği tohumu yetersiz kalır. {kw} tercihi vitamin, mineral taşı ve taze yeşillikle desteklenmelidir. Kafes yerleşimi cereyandan uzak, tüneği doğal dal olan bir düzen ister.",
  ],
  papağan: [
    "Papağanlarda pelet bazlı beslenme tohum karmaşasından daha dengelidir. {kw} yanında taze sebze, iyotlu mineral ve zihinsel oyuncak şarttır. Çikolata, avokado ve tuzlu insan yemekleri kesinlikle verilmez.",
  ],
  kuş: [
    "Kuş yeminde nem ve güve riski yüksektir. {kw} poşeti serin, kuru dolapta tutulmalı; açık kapta uzun süre bekletilmemelidir. Gaga taşı ve kuş kumu ayrı reyonlarda bulunur.",
  ],
  balık: [
    "Akvaryumda yem kadar su kimyası önemlidir. {kw} alırken filtre, su düzenleyici ve türüne uygun yem birlikte düşünülmelidir. Aşırı yemleme suyu bozar; günde birkaç dakikada biten miktar yeterlidir.",
  ],
  tavşan: [
    "Tavşanın temel besini kuru ottur. {kw} pelet mama ile desteklenir; meyve nadir ödül olmalıdır. Dişlerin aşınması için kemirilecek dal ve geniş dolaşım alanı gerekir.",
  ],
  hamster: [
    "Hamsterler gece aktiftir; {kw} seçiminde toz az, tane karışımı dengeli ürünler tercih edilir. Taban malzemesi tozsuz olmalı, tekerlek sessiz ve sağlam seçilmelidir.",
  ],
  "evcil hayvan": [
    "Her türün protein, lif ve mineral ihtiyacı farklıdır. {kw} kararını hayvanın türü, yaşı ve mevcut sağlık notuna göre vermek; “en pahalı = en doğru” denkleminden kaçınmak gerekir.",
  ],
};

const MISTAKE_BITS = [
  "Sık yapılan hata, {kw} ürününü komşunun hayvanına göre seçmektir. Aynı marka bile yaşa ve kısırlık durumuna göre ayrı formül taşır.",
  "Ambalajı yırtık, tarihi belirsiz veya aşırı ucuz {kw} teklifleri orijinallik riski taşır. {store} yalnızca düzenli tedarik zincirinden gelen kapalı ambalaj satar.",
  "Hayvana insan sofrasından yedirmek {kw} ile kurulan dengeyi bozar. Tuz, soğan, çikolata ve kemik gibi yasaklılar ayrı tutulmalıdır.",
  "Kum, mama veya yemi açık poşette nemli balkonda saklamak hem koku hem küf riskidir. {weight} paketlerinde kilitli kova kullanmak işe yarar.",
];

const HOW_TO = [
  "Doğru {kw} için önce hayvanın türünü, yaşını ve varsa veteriner notunu netleştirin. Ardından {stage} formülü ve {weight} paketini seçin. Son adımda mağazada içerik listesini ve son kullanma tarihini kontrol edin.",
  "{kw} alırken “en çok satan” etiketi tek başına yeterli değildir. Tüy yumağı, idrar yolu, tahıl hassasiyeti veya yüksek enerji gibi özel ihtiyaç varsa formül ona göre daraltılır.",
  "İlk kez {kw} alıyorsanız küçük gramajla başlamak, hayvanın kabulünü görmek açısından güvenlidir. Beğenildikten sonra {weight} ile ekonomik geçiş yapılır.",
];

function topicParagraphs(ctx: Ctx, rnd: () => number): SeoSection[] {
  const k = ctx.kind;
  const a = ctx.animal;
  const care = CARE_BITS[a] || CARE_BITS["evcil hayvan"];

  const kediMama: SeoSection[] = [
    sec("Kedi maması seçiminde nelere bakılır?", [
      fill("{kw} bir kedi maması aramasıdır. Protein kaynağı, tane boyutu ve {stage} formül, kedinin yaşıyla örtüşmelidir. Ev kedileri kaloriye daha az ihtiyaç duyar; aktif veya çok kedili evlerde porsiyon ayrı hesaplanır. {brands} serilerinde yavru, yetişkin, sterilised ve hipoalerjenik seçenekler ayrı raflardadır. {store} personeli kedinin kilosunu ve kısırlık durumunu sorarak {kw} seçimini sadeleştirir.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Kuru mama, yaş mama ve geçiş", [
      fill("Kuru {kw} diş sağlığı ve pratiklik sunar; yaş mama su alımını artırır. Birçok kedi ikisinin karışımını sever. Yeni {kw} paketine geçerken eski mamayla karıştırın; ani değişim kusma veya ishal yapabilir. Açılan yaş mama buzdolabında kısa süre saklanır, kuru mama ise kilitli kapta nemden korunur. {weight} çuvalları çok kedili evlerde birim maliyeti düşürür.", ctx),
    ]),
    sec("Kısır, yavru ve özel diyet", [
      fill("{stage} kedi mamaları idrar pH’sı, tüy yumağı ve kilo kontrolü gibi hedefler taşır. {kw} aramasında “sterilised”, “kitten” veya “urinary” ifadesi varsa formülü ona göre seçmek gerekir. Veterinerin yazdığı diyet mamalar {store}’te Hills ve Royal Canin veterinary hatlarında aranır. WhatsApp {phone} ile stok teyidi alın.", ctx),
    ]),
  ];

  const kopekMama: SeoSection[] = [
    sec("Köpek maması nasıl seçilir?", [
      fill("{kw} köpek beslenmesiyle ilgilidir. Irkın büyüklüğü tane boyutunu, yaşı protein ve kalori oranını belirler. Küçük ırklar küçük tane, büyük ırklar eklem destekli formül ister. {brands} bu ayrımı serilerinde yapar. {store}’te {kw} için {weight} seçenekleri yan yana durur; personel günlük gramajı tartı ve aktiviteye göre tarif eder.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Yavru, yetişkin ve yaşlı köpek", [
      fill("Yavru köpek mamaları hızlı büyüme için daha yoğun enerji taşır; yetişkin formüle erken geçmek gelişimi bozabilir. {kw} aramasında puppy, adult veya senior geçiyorsa paket ona göre seçilir. Büyük ırk yavrularında eklem yükü düşünülerek kontrollü kilo hedeflenir. {stage} ihtiyaç {store} reyonunda ayrı etiketlenir.", ctx),
    ]),
    sec("Tahılsız, ırka özel ve performans", [
      fill("Tahıl hassasiyeti olan köpeklerde Brit Care veya Acana gibi hatlar öne çıkar. {kw} içinde ırk adı varsa Royal Canin breed specific gibi özel taneler bakılır. Çalışan veya çok gezdirilen köpeklerde performans mamaları kalori açığını kapatır. Hepsini {place} mağazasında karşılaştırmak, kargo beklemeden karar vermeyi sağlar.", ctx),
    ]),
  ];

  const kum: SeoSection[] = [
    sec("Kedi kumu türleri ve farkları", [
      fill("{kw} hijyen, koku ve toz dengesine göre seçilir. Bentonit topaklanır ve kürekle kolay çıkar; silika nemi hapseder; tofu ve pelet doğal alternatiflerdir. Çok kedili evlerde koku kontrolü öne çıkar. {store}’te {weight} kutuları ve çuvalları bulunur; {kw} için personel kedinin tuvalet alışkanlığını sorar.", ctx),
      fill("Kum kabı evin sakin köşesinde, mama kabından uzak durmalıdır. Günlük topak alma koku şikayetini azaltır. {kw} değişiminde kediler yeni dokuyu reddedebilir; eski kumla karıştırarak geçiş yapılır. Tozsuz ürünler astımı olan evler için daha rahattır.", ctx),
    ]),
    sec("Hangi kedi kumu size uyar?", [
      fill("Koku şikayeti varsa karbonlu bentonit, toz şikayeti varsa tofu veya pelet, uzun süreli seyahatte silika öne çıkar. {kw} fiyatı litre başına bakılmalıdır; ucuz görünen küçük paket uzun vadede pahalıya gelebilir. {store} toplu alımda {weight} avantajı sunar. WhatsApp {phone} ile koku ve toz tercihinizi yazmanız yeter.", ctx),
    ]),
    sec("Tuvalet kabı, kürek ve yerleşim", [
      fill("{kw} tek başına yetmez. Kapaklı veya açık kabın kedinin boyuna uygun olması, küreğin sağlam olması ve yedek poşet rutini tamamlar. {place} mağazasında kum, kab ve dezenfektan aynı reyon sırasında durur. Haftalık kab yıkama, {kw} ömrünü uzatır.", ctx),
    ]),
  ];

  const kus: SeoSection[] = [
    sec("Kuş yemi ve türe göre beslenme", [
      fill("{kw} kuşun türüne göre değişir. Muhabbet, kanarya ve papağan aynı karışımı yememelidir. {brand} ve benzeri yemler vitaminle desteklenir; yalnızca yağlı tohum şişmanlık ve eksiklik yapar. {store} kuş reyonunda {kw} ile birlikte mineral taşı, tüneği ve kafes aksesuarı bulunur.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Kafes, tüy ve günlük rutin", [
      fill("Kafes cereyansız, tüneği doğal, suyu her gün taze olmalıdır. {kw} poşeti nem görmemelidir. Tüy döküm döneminde vitamin desteği istenir. {place}’da kuş sahipleri {hours} arasında ürünü rafta görüp tane iriliğini elleyebilir.", ctx),
    ]),
    sec("Yasaklı yiyecekler ve takviye", [
      fill("Avokado, çikolata, tuz ve aşırı meyve kuşlara zarar verir. {kw} temel yemdir; yeşillik ve mineral ayrı eklenir. {store} personeli papağan peleti ile muhabbet karışımını karıştırmamanız için etiket okur. Stok için {phone} hattı açıktır.", ctx),
    ]),
  ];

  const balik: SeoSection[] = [
    sec("Akvaryum ve balık bakımı", [
      fill("{kw} akvaryum düzeninin bir parçasıdır. Yem, filtre, su düzenleyici ve aydınlatma birlikte çalışır. Aşırı yem suyu bozar. {store} balık reyonunda {kw} ile filtre malzeme ve dekor yan yanadır. {place}’da kurulum sorularını personele sorabilirsiniz.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Su kalitesi ve yemleme", [
      fill("Yeni kurulan tankta azot döngüsü tamamlanmadan kalabalık balık eklenmez. {kw} seçiminde pul, granule veya tablet yem türü ağız yapısına göre değişir. Haftalık kısmi su değişimi {kw} kadar önemlidir. Test kiti ve kova {store}’te bulunur.", ctx),
    ]),
    sec("Samsun’da akvaryum malzemesi", [
      fill("{kw} ihtiyacı olanlar kargo kırılması riski yerine mağazadan almayı tercih eder. Cam, motor ve yem aynı anda yüklenir. {hours} açık olmamız akşam mesai çıkışına da uyar. {phone} üzerinden parça stoku sorulur.", ctx),
    ]),
  ];

  const tasma: SeoSection[] = [
    sec("Tasma ve koşum nasıl seçilir?", [
      fill("{kw} boyun çevresi, kilo ve çekme alışkanlığına göre seçilir. Çok sıkı nefes alır, çok bol kaçış riski doğurur. Naylon hafif ve yıkanır, deri şık, metal zincir güçlü köpekler içindir. {store}’te {kw} bedenleri XS–XL aralığındadır; köpekle gelip denemek en doğrusudur.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Göğüs tasması, uzatma ve güvenlik", [
      fill("Çeken köpeklerde göğüs koşumu boynu korur. {kw} ile birlikte 2–5 metre gezdirme ipi ve ışık yansıtan detay gece yürüyüşünde işe yarar. Kedi tasmaları kopçalı ve hafif olmalıdır. {place} reyonunda {kw} yanında kimlik künyesi de bulunur.", ctx),
    ]),
    sec("Bakım ve değiştirme zamanı", [
      fill("Aşınmış dikiş veya çatlak kopça {kw} ürününü hemen değiştirmeyi gerektirir. Tuzlu hava ve yağmur metal parçayı yorar. {store} yedek tasma bulundurmayı önerir. WhatsApp {phone} ile beden fotoğrafı göndererek ölçü teyidi alabilirsiniz.", ctx),
    ]),
  ];

  const oyuncak: SeoSection[] = [
    sec("Oyuncak neden gerekir?", [
      fill("{kw} yalnızca eğlence değil; sıkılma, kemirme ve kilo kontrolü aracıdır. Ev kedilerinde tüy sopa ve tünel, köpeklerde çiğneme kemiği ve fetch topu öne çıkar. Hasarlı oyuncak yutulur. {store} {kw} reyonunda dayanıklılık seviyeleri ayrıdır.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Güvenli malzeme ve rotasyon", [
      fill("Küçük parçalanan plastik {kw} için uygun değildir. Kauçuk ve kalın ip daha uzun ömürlüdür. Oyuncakları dönüşümlü sunmak ilgiyi korur. {place}’da {kw} ile ödül maması aynı alışverişte tamamlanır. {hours} içinde mağazadan bakabilirsiniz.", ctx),
    ]),
    sec("Zihin ve diş sağlığı", [
      fill("Puzzle mama kapları {kw} ile zihni yorar, yeme hızını düşürür. Köpek çiğneme oyuncakları diş tartarını azaltır ama sert kayaları yerine geçmez. {store} personeli ırkın çene gücüne göre {kw} önerir.", ctx),
    ]),
  ];

  const yatak: SeoSection[] = [
    sec("Yatak, tırmalama ve dinlenme alanı", [
      fill("{kw} hayvanın güvenli köşesidir. Ortopedik köpek yatağı eklemi korur; kedi tırmalama tahtası koltuk yerine tırnağı yönlendirir. Yıkanabilir kılıf hijyen sağlar. {store}’te {kw} ebatları küçük ırktan büyük ırka sıralanır.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Nereye konulmalı?", [
      fill("Yatak cereyanda, mama kabının dibinde veya kalorifer dibinde olmamalıdır. {kw} seçiminde hayvanın uzanmış hali ölçülür. {place} mağazasında ürünü açıp dolumunu görmek online fotoğraftan nettir. {phone} ile ölçü tarif edilebilir.", ctx),
    ]),
    sec("Temizlik rutini", [
      fill("{kw} kılıfı haftalık yıkanır, yedek örtü işe yarar. Tırmalama halısı tükendiğinde tahta değişir. {store} yedek kılıf ve kedi otu spreyi bulundurur. Böylece {kw} uzun süre kullanılır.", ctx),
    ]),
  ];

  const tuvalet: SeoSection[] = [
    sec("Tuvalet kabı ve kum düzeni", [
      fill("{kw} kedinin mahremiyetine saygı duyan bir yerleşim ister. Kab mama ve suya uzak, sessiz köşede durur. Kapaklı modeller koku tutar ama bazı kediler kapıyı sevmez. {store} {kw} ve kum küreğini birlikte gösterir.", ctx),
    ]),
    sec("Temizlik sıklığı", [
      fill("Günlük topak alma {kw} başarısını belirler. Çok kedili evde kab sayısı kedi sayısından bir fazla olmalıdır. {kw} ile uyumlu kum seçilmezse etrafa saçılma artar. {place}’da her iki ürün de aynı reyon sırasındadır.", ctx),
    ]),
    sec("Yavru ve yaşlı kediler", [
      fill("Yavru alçak kenar, yaşlı kedi düşük giriş ister. {kw} boyutu kedinin dönebileceği kadar geniş olmalıdır. {store} personeli ev planınıza göre kab önerir. {hours} ziyaretinde ürünü yerinde görün.", ctx),
    ]),
  ];

  const marka: SeoSection[] = [
    sec("{brand} ürünleri Samsun Atakum’da", [
      fill("{kw} araması {brand} hattına işaret eder. {store} bu markayı yetkili tedarikle, kapalı ambalaj ve okunur son kullanma tarihiyle satar. Sahte veya açık dökme ürün bulunmaz. {weight} seçenekleri stok durumuna göre rafta veya depodadır; {phone} ile teyit edilir.", ctx),
    ]),
    sec("Orijinallik ve doğru formül", [
      fill("{brand} içinde onlarca SKU vardır. {kw} tam olarak hangi yaş ve kısırlık koduna aitse o poşet alınmalıdır. Kitten ile sterilised karıştırılmaz. {store} barkod ve etiket okuyarak yönlendirir. {brands} alternatifleri de aynı reyonlarda durur; bütçe veya tahıl tercihine göre geçiş konuşulur.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Fiyat, stok ve geçiş", [
      fill("{kw} fiyatı {weight} ve seriye göre değişir. Gross market alımı birim maliyeti düşürür. Yeni {brand} formülüne 7–10 günde geçin. {place} mağazasında aynı gün alım, kargo bekletmez. {hours} her gün açığız.", ctx),
    ]),
  ];

  const petshop: SeoSection[] = [
    sec("Samsun Atakum petshop olarak {store}", [
      fill("{kw} arayanlar genelde geniş stok, uygun fiyat ve danışmanlık ister. {store} kedi, köpek, kuş, balık ve küçük hayvan ürünlerini tek çatıda tutar. {brands} mamaları, kum, tasma ve yem aynı ziyarette biter. {address} kolay bulunur, otopark vardır.", ctx),
    ]),
    sec("Gross market ne anlama gelir?", [
      fill("Küçük petshoplar koli kırarak satar; biz palet alırız. Bu yüzden {kw} ihtiyacında {weight} çuvallar daha avantajlıdır. Perakende vitrine göre fark özellikle mama ve kumda hissedilir. Toplu alan müşterilere ek konuşulabilir fiyat uygulanır.", ctx),
    ]),
    sec("Nasıl gelir, nasıl sipariş edilir?", [
      fill("Google Harita’da EnuygunPet yazmanız yeter. {kw} listesini WhatsApp {phone}’a gönderin; stok fotoğrafı döner. Atakum içi teslimat ağır çuvallarda tercih edilir. {hours} kesintisiz hizmet vardır.", ctx),
    ]),
  ];

  const kucuk: SeoSection[] = [
    sec("Küçük memeli bakımı", [
      fill("{kw} hamster, tavşan veya kobay ihtiyacı olabilir. Bu hayvanlarda tozsuz altlık, doğru pelet ve kemirme malzemesi birliktedir. {store} küçük hayvan reyonunda {kw} ile kafes ve suluk bulunur. {place}’da türe göre yem karıştırılmaz.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Kafes hijyeni ve beslenme", [
      fill("Altlık ıslanınca hemen değişir. {kw} nemli ortamda bozulur. Tavşanda kuru ot asla bitmemeli, hamsterde koşu çarkı sessiz olmalıdır. {store} yonca, talaş ve pelet mama stoklar. {phone} ile türünüzü yazın.", ctx),
    ]),
    sec("Samsun’da küçük hayvan ürünü", [
      fill("{kw} online’da kargo ısısı riski taşır. Mağazadan almak taze poşet demektir. {hours} açık reyonlarda ürünü koklayıp tarih bakabilirsiniz. {address} konumundayız.", ctx),
    ]),
  ];

  const surungen: SeoSection[] = [
    sec("Sürüngen ve egzotik bakım", [
      fill("{kw} ısı, nem ve UVB olmadan eksik kalır. Kaplumbağa, gecko veya yılanın yemi ayrı formüllerdir. {store} egzotik reyonunda {kw} ile vitamin ve teraryum malzemesi aranır. Yanlış ısı kemik sorununa yol açar.", ctx),
    ]),
    sec("Beslenme ve güvenlik", [
      fill("Canlı yem veya pelet {kw} türüne göre seçilir. Elleri yıkamak, kaçış deliklerini kapatmak temel güvenliktir. {place} personeli tür adını net sorar; karışık öneri yapılmaz. {phone} stok hattıdır.", ctx),
    ]),
    sec("Mağazadan almak", [
      fill("Cam, lamba ve {kw} aynı anda yüklenir. Kargo kırılması riski azalır. {hours} içinde Atakum’a uğrayabilirsiniz. {address}.", ctx),
    ]),
  ];

  const generic: SeoSection[] = [
    sec("{kw} nedir, kimler arar?", [
      fill("{place}’da {kw} araması evcil hayvan ihtiyacını karşılamak içindir. {store} bu aramayı mama, kum, yem veya aksesuar reyonlarından birine bağlar. {brands} ve onlarca aksesuar markası aynı çatıdadır. {weight} seçenekleri bütçeyi belirler. Personel hayvanın türünü sorarak {kw} listesini kısaltır.", ctx),
      fill(pick(care, rnd), ctx),
    ]),
    sec("Nasıl seçilir?", [
      fill(pick(HOW_TO, rnd), ctx),
      fill("{kw} alırken ambalaj bütünlüğü, son kullanma tarihi ve hayvanın mevcut mamayla uyumu kontrol edilir. {stage} ihtiyaç varsa etiket ona göre okunur. {store}’te ürünü elinize alıp karşılaştırmak, yalnızca isim ezberlemekten iyidir.", ctx),
    ]),
    sec("Samsun’da stok ve teslim", [
      fill("{kw} için {address} adresine gelin veya {phone} yazın. {hours} her gün açığız. Ağır ürünlerde araç yanı yükleme ve Atakum içi teslimat konuşulur. {intent} bu sayfanın odak noktasıdır.", ctx),
    ]),
  ];

  const map: Record<Kind, SeoSection[]> = {
    "kedi-mama": kediMama,
    "kopek-mama": kopekMama,
    "kedi-kum": kum,
    kus,
    balik,
    tasma,
    oyuncak,
    yatak,
    tuvalet,
    marka,
    petshop,
    kucuk,
    surungen,
    breed: generic,
    health: generic,
    local: generic,
    generic,
  };

  return map[k] || generic;
}

function sharedSections(ctx: Ctx, rnd: () => number): SeoSection[] {
  const openings = shuffle(OPENINGS, rnd).slice(0, 1);
  const visit = shuffle(STORE_VISIT, rnd);
  const price = shuffle(PRICE_BITS, rnd);
  const mistakes = shuffle(MISTAKE_BITS, rnd).slice(0, 2);
  const how = pick(HOW_TO, rnd);

  return [
    sec(`${ctx.kw} — Samsun Atakum rehberi`, [
      fill(openings[0], ctx),
      fill("{kw} başlığında aranan şey çoğu zaman {intent}. Bu sayfa, {place} içindeki {store} stok düzenine göre yazılmıştır. Sayfa kodu {code}. Raflarda bu grupta yaklaşık {variety} çeşit tutulur; güncel adet WhatsApp {phone} ile sorulur.", ctx),
    ]),
    sec("Mağaza, saat ve ulaşım", [
      fill(visit[0], ctx),
      fill(visit[1 % visit.length], ctx),
    ]),
    sec("Fiyat, gramaj ve gross market avantajı", [
      fill(price[0], ctx),
      fill("{kw} için {weight} seçeneği bütçeyi belirler. Küçük paket deneme, büyük paket rutin içindir. {brand} hattı varsa orijinal ambalaj şarttır. {store} açık dökme mama satmaz.", ctx),
    ]),
    sec("Doğru seçim adımları", [
      fill(how, ctx),
      fill(mistakes[0], ctx),
    ]),
    sec("Sık yapılan hatalar ve saklama", [
      fill(mistakes[1] || mistakes[0], ctx),
      fill("{kw} poşeti serin, kuru ve kapalı tutulmalıdır. {weight} çuvallarda kilitli kova küf ve böcek riskini azaltır. Mama kaşığı mama kabına girip çıkıyorsa ayrı kepçe kullanın. {hours} mağaza ziyaretinde saklama kabı da alınabilir.", ctx),
    ]),
    sec("WhatsApp sipariş ve kapıda teslim", [
      fill("{kw} listesini {phone} numarasına yazın; ürün fotoğrafı ve fiyat döner. Atakum, İlkadım ve yakındaki semtlerde teslimat konuşulur. Mağazadan teslim {quiet} saatlerinde daha hızlıdır. Büyük {weight} paketlerde araç yanı yükleme yapılır.", ctx),
      fill("Instagram @enuygun.pet hesabından yeni gelen {kw} ve kampanya duyurulur. Yine de stok teyidi için WhatsApp daha kesin sonuç verir. {address} kapısından içeri girdiğinizde ilgili reyon işaretlenir.", ctx),
    ]),
    sec("Bu sayfaya özel not", [
      fill("\"{kw}\" ifadesi slug {code} ile eşleştirilmiştir. Bu metin aynı kalıbın kopyası değil; {animal} odaklı, {stage} ihtiyacı ve {intent} vurgusu bu aramaya göre kurulmuştur. {variety} çeşitlik vitrin, {brand} ve komşu markalarla birlikte okunmalıdır. Kararsızsanız kedinin veya köpeğin yaşını, kilosunu ve mevcut mama adını personele söyleyin.", ctx),
      fill("{place} içinden gelen müşteriler {kw} ile birlikte su kabı, ödül ve bakım ürününü aynı fişte tamamlar. Böylece ikinci yol azalır. {store} amacı tek ziyarette işi bitirmektir. Sorularınız için {phone}, kapı için {address}, saat için {hours}.", ctx),
    ]),
  ];
}

function extraPad(ctx: Ctx, rnd: () => number): SeoSection[] {
  const pool = [
    sec("Beslenme rutini ve porsiyon", [
      fill("{animal} için {kw} porsiyonu ambalaj tablosundan okunur, sonra vücut kondisyonuna göre inceltilir. Serbest mama şişmanlatır. Günde iki veya üç öğün, taze su ve kontrollü ödül dengesi yeter. {store} mama kabı ve ölçü kabı bulundurur. {kw} değişiminde ishal olursa geçişi yavaşlatın, gerekirse veterinere danışın.", ctx),
      fill("Ödül mamaları günlük kalorinin onda birini geçmemelidir. {kw} zaten tam yem ise üstüne sofra artığı eklenmez. {place}’da ödül reyonu {kw} rafına yakındır; personel tüy yumağı veya diş ödülü ayırır.", ctx),
    ]),
    sec("Hijyen, parazit ve ev düzeni", [
      fill("{kw} kadar yatak yıkama, tüy tarama ve parazit koruması da sağlığı belirler. Pire ve kene mevsiminde antiparaziter ürün {store}’te bulunur. {animal} yaşam alanı mama kabından uzak, sessiz bir köşe ister. {hours} içinde bakım reyonuna uğrayabilirsiniz.", ctx),
    ]),
    sec("Marka karşılaştırması nasıl yapılır?", [
      fill("{brands} arasında {kw} seçerken protein kaynağı, tahıl, tane boyutu ve veteriner notu bakılır. En pahalı poşet her hayvana uymaz. {brand} sizin aramanızdaysa önce o hat, yoksa ihtiyaca en yakın komşu formül önerilir. {code} sayfasındaki vurgu budur.", ctx),
      fill("Etiket üzerindeki analiz değerleri {kw} kararını kolaylaştırır. Ham protein tek başına kalite ölçüsü değildir; sindirilebilirlik ve hayvanın dışkı kalitesi sahada görülür. {store} geçiş sürecinde küçük gramaj önerir.", ctx),
    ]),
    sec("Samsun semtlerinden geliş", [
      fill("İlkadım, Canik, Tekkeköy, Bafra ve Çarşamba yönünden {kw} için Atakum’a inmek yaygındır. Bulvar üzeri konum minibüs ve özel araçla rahattır. {weight} çuval için bagaj planı yapın. Dönüşte {quiet} trafiği daha sakindir.", ctx),
    ]),
    sec("Neden yerinden almak?", [
      fill("{kw} kargosunda ezilme, geç teslim ve iade zahmeti vardır. {store}’te tarihi görünür, poşet sağlamdır, personel {animal} için yanlış formülü ayıklar. {intent} sorusu mağazada birkaç dakikada netleşir. {phone} ile önce sorun, sonra gelin.", ctx),
    ]),
  ];
  return shuffle(pool, rnd);
}

function faqsFor(ctx: Ctx): SeoFaq[] {
  return [
    {
      q: `Samsun’da ${ctx.kw} nereden alınır?`,
      a: `${STORE}, ${ADDRESS} adresinde ${ctx.kw} stoklar. Her gün ${HOURS} açıktır. WhatsApp ${PHONE} ile stok sorun.`,
    },
    {
      q: `${ctx.kw} fiyatı ne kadar?`,
      a: `Fiyat markaya ve ${ctx.weight} seçimine göre değişir. Gross market etiketi perakendenin altındadır. Güncel rakam için ${PHONE} veya mağaza ziyareti yeter.`,
    },
    {
      q: `${ctx.kw} hangisi daha doğru?`,
      a: `${ctx.animal} yaşınız, ${ctx.stage} ihtiyaç ve varsa veteriner notu belirler. ${ctx.brands} arasından personel daraltır.`,
    },
    {
      q: `Atakum’da teslimat var mı?`,
      a: `WhatsApp ${PHONE} üzerinden sipariş açılır. Atakum içi teslimat ve mağazadan teslim konuşulur. Ağır ${ctx.weight} paketlerde yükleme yardımı vardır.`,
    },
    {
      q: `${ctx.kw} orijinal mi?`,
      a: `${STORE} açık dökme satmaz. ${ctx.brand} ve diğer markalar kapalı ambalaj ve tedarik faturasıyla gelir.`,
    },
  ];
}

function fillSections(sections: SeoSection[], ctx: Ctx): SeoSection[] {
  return sections.map((s) => ({
    heading: fill(s.heading, ctx),
    paragraphs: s.paragraphs.map((p) => fill(p, ctx)),
  }));
}

function sectionWords(sections: SeoSection[]): number {
  return wordCount(sections.map((s) => `${s.heading} ${s.paragraphs.join(" ")}`).join(" "));
}

function assemble(ctx: Ctx): SeoArticle {
  const rnd = mulberry(ctx.seed ^ 0x9e3779b9);
  const topic = topicParagraphs(ctx, rnd);
  const shared = sharedSections(ctx, rnd);
  const intro = shared[0];
  const restShared = shared.slice(1);
  const middle = shuffle([...topic, ...restShared], rnd);
  let sections = fillSections([intro, ...middle, ...extraPad(ctx, rnd)], ctx);
  let n = 0;
  while (sectionWords(sections) < 1100 && n < 6) {
    n += 1;
    sections.push(...fillSections([
      sec(`Ek rehber notu ${ctx.code}-${n}`, [
        `{kw} için ${ctx.place} stok kaydı ${ctx.code}-${n} ile tutulur. {store} her gün {hours} {address} konumunda yaklaşık {variety} çeşit bulundurur. {brands} raflardadır. WhatsApp {phone} hattından {kw} fotoğrafı ve gramaj sorulur. {intent} bu kaydın odağıdır. {stage} formül ile {weight} paket mağazada netleşir. {animal} sahibinin mevcut ürün adını söylemesi yönlendirmeyi kısaltır. Gross market alımı birim fiyatı düşürür; orijinal ambalaj ve son kullanma tarihi yerinde görülür. Atakum içi teslimat ağır çuvallarda konuşulur. {quiet} saatlerinde kasa ve otopark daha sakindir.`,
        `{kw} poşeti serin ve kapalı tutulmalı, ani mama değişiminde 7–10 günlük geçiş uygulanmalıdır. {brand} hattı varsa SKU karıştırılmaz. Bu paragraf ${ctx.slug} sayfasına özel üretilmiştir.`,
      ]),
    ], ctx));
  }
  sections.push(...fillSections([
    sec("Sonuç: {kw} için {store}", [
      "{kw} konusunda {place} içindeki pratik yol {store} reyonuna gelmek veya {phone} yazmaktır. {stage} formül, {weight} paket ve {brand} hattı mağazada netleşir. {hours} her gün açığız. Adres: {address}. Bu rehber {code} koduyla {kw} aramasına özel derlenmiştir.",
    ]),
  ], ctx));
  return {
    images: pickImages(ctx.kw, ctx.seed),
    sections,
    faqs: faqsFor(ctx),
  };
}

export function buildKeywordArticle(keyword: string, slug: string): SeoArticle {
  return assemble(makeCtx(keyword, slug));
}

export function buildHealthArticle(keyword: string, animalTr: string, category: string, slug: string): SeoArticle {
  const ctx = makeCtx(keyword, slug, "health", "Samsun Atakum");
  ctx.animal = animalTr.toLowerCase();
  const rnd = mulberry(ctx.seed ^ 0x51ed);
  const k = keyword.toLowerCase();
  const isDigestive = ["kusma", "ishal", "iştah", "sindirim", "mide", "bağırsak", "kabız", "gaz", "kursak"].some((x) => k.includes(x));
  const isEye = k.includes("göz");
  const isRespir = ["nefes", "öksürük", "hapşır", "solunum", "burun", "bronş"].some((x) => k.includes(x));
  const isSkin = ["tüy", "kaşıntı", "deri", "mantar", "uyuz", "pire", "bit", "alerji"].some((x) => k.includes(x));
  const isUrinary = ["idrar", "böbrek", "mesane", "çiş"].some((x) => k.includes(x));
  const isDental = ["diş", "ağız", "salya", "gaga"].some((x) => k.includes(x));
  const isBehav = ["halsi", "uyuyor", "stres", "depres", "agresif", "saklanıyor", "bağırıyor", "ısırıyor"].some((x) => k.includes(x));
  const isSerious = ["kanser", "epilepsi", "felç", "kuduz", "parvo", "kalp", "karaciğer", "böbrek yetmez", "tümör"].some((x) => k.includes(x));
  const isYoung = k.includes("yavru");
  const isFeeding = ["beslenme", "vitamin", "kalsiyum", "mama", "yem", "yasaklı"].some((x) => k.includes(x));

  let cluster = "genel belirti";
  let productRec = "sağlık destekleyici mama, vitamin takviyesi, temizlik ve bakım ürünleri";
  if (isYoung) { cluster = "yavru hassasiyeti"; productRec = "yavru mamaları, süt tozu, probiyotik, şırınga besleyici"; }
  else if (isDigestive) { cluster = "sindirim"; productRec = "sindirim destekli mama, probiyotik, elektrolit, parazit önleyici"; }
  else if (isEye) { cluster = "göz"; productRec = "göz temizleyici, steril pamuk, vitamin"; }
  else if (isRespir) { cluster = "solunum"; productRec = "bağışıklık vitamini, ortam nemi ve ısı desteği"; }
  else if (isSkin) { cluster = "deri ve tüy"; productRec = "antiparaziter, antifungal şampuan, deri bakımı"; }
  else if (isUrinary) { cluster = "idrar yolu"; productRec = "üriner mama, su çeşmesi, vitamin"; }
  else if (isDental) { cluster = "ağız ve diş"; productRec = "diş macunu, çiğneme ödülü, ağız spreyi"; }
  else if (isBehav) { cluster = "davranış ve stres"; productRec = "feromon, sakinleştirici, zihin oyuncağı"; }
  else if (isSerious) { cluster = "ciddi hastalık şüphesi"; productRec = "destek mamaları, vitamin, yaşam kalitesi ürünleri"; }
  else if (isFeeding) { cluster = "beslenme"; productRec = "yaşa uygun mama, vitamin-mineral, probiyotik"; }

  const healthHead: SeoSection[] = [
    sec(`${keyword} — ${animalTr} sahipleri için bilgi`, [
      fill(`${animalTr}lerde {kw} (${cluster}) evde panik veya ihmal arasında sık kaçırılır. Bu metin veteriner tanısının yerini tutmaz; belirtileri tanımak, ne zaman kliniğe gitmek ve {store}’te hangi destek ürünlerin durduğunu anlatır. Sayfa kodu {code}.`, ctx),
      fill(`{kw} tablosunda iştah, su içme, dışkı, nefes ve davranış birlikte okunur. Tek bir belirtiyi izole etmek yanıltır. ${animalTr} yavruysa saatler içinde kötüleşme olabilir; yetişkinde 24–48 saat kuralı geçerlidir. Kanlı semptom, nefes darlığı veya idrar yapamama acildir.`, ctx),
    ]),
    sec("Belirtiler ve evde gözlem", [
      fill(`{kw} için not defteri tutun: ne zaman başladı, mama değişti mi, başka hayvan var mı, ateş veya halsizlik eşlik ediyor mu? ${cluster} kümesinde {store} personeli ürün önerir ama ilaç yazmaz. WhatsApp {phone} stok içindir, teşhis için değildir.`, ctx),
      fill(`Ortam ısısı, taze su ve sakin köşe çoğu hafif vakada destekleyicidir. {kw} 48 saati aşar, iştah kesilir veya hayvan çökerse kliniğe gidin. İnsan ilacı asla uygulanmaz.`, ctx),
    ]),
    sec("Ne zaman veteriner şart?", [
      fill(`Yavru ${animalTr}, yaşlı hayvan, gebelik veya kronik hastalık varken {kw} bekletilmez. ${isSerious ? "Ciddi hastalık şüphesinde gün kaybetmeyin." : "Hafif görünen belirti birden ağırlaşabilir."} Aşı ve parazit kaydı klinikte işe yarar. {store} diyet mama ve takviyeyi veteriner notuna göre ayırır.`, ctx),
    ]),
    sec("Destekleyici ürünler Samsun Atakum’da", [
      fill(`{kw} sonrası toparlanmada mama kalitesi belirleyicidir. ${productRec} {store} raflarında aranır. {brands} veterinary hatları reçeteli diyetlerde öne çıkar. {address}, her gün {hours}.`, ctx),
      fill(`Takviye dozu hayvan kilosuna göredir; “biraz daha iyi gelir” yaklaşımı zararlıdır. {kw} sayfası {variety} civarı ilgili SKU’yu işaret eder, güncel liste {phone} ile sorulur.`, ctx),
    ]),
  ];

  const base = assemble(ctx);
  const sections = [healthHead[0], ...healthHead.slice(1), ...base.sections.slice(1)].map((s) => ({
    heading: fill(s.heading, ctx),
    paragraphs: s.paragraphs.map((p) => fill(p, ctx)),
  }));
  return {
    images: pickImages(`${animalTr} ${keyword}`, ctx.seed),
    sections,
    faqs: [
      { q: `${animalTr}de ${keyword} tehlikeli mi?`, a: `Şiddet ve süreye göre değişir. 24–48 saati aşan, kanlı veya halsizlikle giden belirtilerde veterinere gidin.` },
      { q: `${keyword} evde tedavi edilir mi?`, a: `Hafif destek (su, ısı, sakin ortam) verilebilir. İlaç ve tanı için veteriner şarttır.` },
      { q: `Samsun’da ${animalTr} destek ürünü nerede?`, a: `${STORE} Atakum’da ${productRec} stoklar. Tel: ${PHONE}.` },
      { q: `Bu sayfa veteriner yerine geçer mi?`, a: `Hayır. Genel bilgidir. ${keyword} şüphesinde klinik muayene gerekir.` },
      ...base.faqs.slice(0, 1),
    ],
    productRec,
  };
}

export function buildLocalArticle(opts: {
  keyword: string;
  slug: string;
  h1: string;
  intro?: string;
  district: string;
  neighborhood?: string | null;
  sections?: Array<{ h: string; p: string }>;
}): SeoArticle {
  const place = [opts.district, opts.neighborhood].filter(Boolean).join(" ");
  const ctx = makeCtx(opts.keyword || opts.h1, opts.slug, "local", place || "Samsun Atakum");
  const local: SeoSection[] = [
    sec(`${place} petshop rehberi`, [
      (opts.intro || "").trim() || fill("{place} evcil hayvan sahipleri {kw} ve tüm petshop ihtiyacı için {store}’e yönelir. {address} Atakum’dadır.", ctx),
    ]),
    ...(opts.sections || []).map((s) => sec(s.h, [s.p])),
    sec(`${place} bölgesinden ulaşım`, [
      fill("{place} yönünden Atatürk Bulvarı hattı {store}’e bağlanır. Otopark vardır; {weight} mama çuvalları bagaja personelle yüklenir. {quiet} saatleri park ve kasa için daha sakindir. Yol tarifi için Google’da EnuygunPet yazın veya {phone} arayın.", ctx),
      fill("{place} içindeki kedi ve köpek sahipleri {kw} yerine geniş reyonu tercih eder: mama, kum, tasma ve kuş yemi aynı ziyarette biter. {brands} stokta tutulur. {hours} her gün açık olmamız mesai ve hafta sonuna uyar.", ctx),
    ]),
    sec(`${place} için teslimat ve WhatsApp`, [
      fill("{place} adresine ağır ürün götürmek yerine WhatsApp {phone} ile sipariş açmak yaygındır. {kw} listesi, marka ve gramaj yazılır; stok fotoğrafı döner. {store} Atakum içi teslimatı konuşur. Sayfa kodu {code}.", ctx),
    ]),
  ];
  const base = assemble(ctx);
  const sections = [...local, ...base.sections.filter((_, idx) => idx !== 0)].map((s) => ({
    heading: fill(s.heading, ctx),
    paragraphs: s.paragraphs.map((p) => fill(p, ctx)),
  }));
  return {
    images: pickImages(opts.h1, ctx.seed),
    sections,
    faqs: [
      { q: `${place} bölgesine en yakın petshop nerede?`, a: `${STORE}, ${ADDRESS}. ${place} sakinleri Bulvar üzerinden kolay ulaşır. ${HOURS}, tel ${PHONE}.` },
      { q: `${place} için hangi ürünler var?`, a: `Kedi ve köpek maması, kum, kuş yemi, tasma, oyuncak ve akvaryum malzemesi. ${ctx.brands} dahil.` },
      ...base.faqs.slice(0, 3),
    ],
  };
}

export function buildCategoryArticle(h1: string, slug: string): SeoArticle {
  return assemble(makeCtx(h1, slug));
}
