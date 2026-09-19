import {
  PHONE_DISPLAY,
  STORE_ADDRESS_LINE,
  STORE_ADDRESS_SHORT,
} from "./store-info";
import { STORE_IMAGE_PATHS } from "./store-images";

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
  general: STORE_IMAGE_PATHS.magaza,
  reyonlar: STORE_IMAGE_PATHS.reyonlar,
  kedi: STORE_IMAGE_PATHS.kedi,
  kopek: STORE_IMAGE_PATHS.kopek,
  kus: STORE_IMAGE_PATHS.kus,
} as const;

const STORE = "EnuygunPet Gross Market";
const HOURS = "09:00–21:00";

type ProductKind =
  | "petshop"
  | "kedi-mama"
  | "kopek-mama"
  | "kedi-kum"
  | "tuvalet"
  | "tasima"
  | "tasma"
  | "oyuncak"
  | "yasam"
  | "kus"
  | "akvaryum"
  | "kucuk-hayvan"
  | "bakim"
  | "marka"
  | "genel";

type Context = {
  keyword: string;
  lower: string;
  kind: ProductKind;
  animal: string;
  brand?: string;
  size?: string;
  stage?: string;
  priceIntent: boolean;
};

const BRANDS: Array<[string, string]> = [
  ["royal canin", "Royal Canin"],
  ["pro plan", "Pro Plan"],
  ["proplan", "Pro Plan"],
  ["hill's", "Hill's"],
  ["hills", "Hill's"],
  ["brit care", "Brit Care"],
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
  ["proscience", "ProScience"],
  ["virbac", "Virbac"],
  ["vancat", "Vancat"],
  ["proline", "Proline"],
  ["ever clean", "Ever Clean"],
];

export function cleanSeoKeyword(value: string): string {
  return value
    .replace(/^[\s.]+|[\s.]+$/g, "")
    .replace(/\s+[—|]\s*Enuygun\s*Pet(?:\s+Gross Market)?(?:\s+Samsun(?:\s+Atakum)?)?$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function keywordAsTitle(value: string): string {
  const keyword = cleanSeoKeyword(value);
  if (!keyword) return keyword;
  return keyword.charAt(0).toLocaleUpperCase("tr-TR") + keyword.slice(1);
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function articlePlainText(article: SeoArticle): string {
  return [
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
    ]),
    ...article.faqs.flatMap((faq) => [faq.q, faq.a]),
  ].join(" ");
}

function classify(lower: string): ProductKind {
  if (lower.includes("petshop") || lower.includes("pet shop") || lower.includes("pet market") || lower.includes("pet store") || lower.includes("pet avm")) return "petshop";
  if (lower.includes("kedi") && (lower.includes("mama") || lower.includes("food") || lower.includes("kitten"))) return "kedi-mama";
  if ((lower.includes("köpek") || lower.includes("kopek") || lower.includes("dog")) && (lower.includes("mama") || lower.includes("food"))) return "kopek-mama";
  if (lower.includes("kedi") && (lower.includes("kum") || lower.includes("pelet"))) return "kedi-kum";
  if (lower.includes("tuvalet") || lower.includes("kum kab")) return "tuvalet";
  if (lower.includes("taşıma") || lower.includes("tasima") || lower.includes("taşıyıcı") || lower.includes("çanta") || lower.includes("box")) return "tasima";
  if (lower.includes("tasma") || lower.includes("taşma") || lower.includes("koşum") || lower.includes("boyunluk") || lower.includes("gezdirme")) return "tasma";
  if (lower.includes("oyuncak") || lower.includes("ödül") || lower.includes("odul") || lower.includes("snack") || lower.includes("çiğneme")) return "oyuncak";
  if (lower.includes("yatak") || lower.includes("kulübe") || lower.includes("kulube") || lower.includes("tırmalama") || lower.includes("tirmalama") || lower.includes("kedi evi")) return "yasam";
  if (lower.includes("akvaryum") || lower.includes("balık") || lower.includes("balik") || lower.includes("filtre") || lower.includes("hava motor")) return "akvaryum";
  if (lower.includes("muhabbet") || lower.includes("papağan") || lower.includes("papagan") || lower.includes("kanarya") || lower.includes("kuş") || lower.includes("kus") || lower.includes("kuş yemi")) return "kus";
  if (lower.includes("hamster") || lower.includes("tavşan") || lower.includes("tavsan") || lower.includes("kobay") || lower.includes("guinea pig") || lower.includes("kemirgen") || lower.includes("altlık") || lower.includes("talaş")) return "kucuk-hayvan";
  if (lower.includes("şampuan") || lower.includes("sampuan") || lower.includes("tarak") || lower.includes("fırça") || lower.includes("tırnak") || lower.includes("vitamin") || lower.includes("bakım") || lower.includes("temizleyici")) return "bakim";
  if (BRANDS.some(([needle]) => lower.includes(needle))) return "marka";
  return "genel";
}

function contextFor(value: string): Context {
  const keyword = cleanSeoKeyword(value);
  const lower = keyword.toLocaleLowerCase("tr-TR");
  const brand = BRANDS.find(([needle]) => lower.includes(needle))?.[1];
  const sizeMatch = keyword.match(/\b(\d+(?:[.,]\d+)?)\s*(kg|kilo|g|gr|gram|lt|litre|l)\b/i);
  let stage: string | undefined;
  if (/(yavru|kitten|puppy|junior)/i.test(lower)) stage = "yavru";
  else if (/(kısır|kisir|sterilised|sterilized)/i.test(lower)) stage = "kısırlaştırılmış";
  else if (/(senior|yaşlı|yasli|mature)/i.test(lower)) stage = "ileri yaş";
  else if (/(adult|yetişkin|yetiskin)/i.test(lower)) stage = "yetişkin";

  let animal = "evcil hayvan";
  if (lower.includes("kedi")) animal = "kedi";
  else if (lower.includes("köpek") || lower.includes("kopek")) animal = "köpek";
  else if (lower.includes("muhabbet")) animal = "muhabbet kuşu";
  else if (lower.includes("papağan") || lower.includes("papagan")) animal = "papağan";
  else if (lower.includes("kuş") || lower.includes("kus") || lower.includes("kanarya")) animal = "kuş";
  else if (lower.includes("balık") || lower.includes("balik") || lower.includes("akvaryum")) animal = "akvaryum canlısı";
  else if (lower.includes("tavşan") || lower.includes("tavsan")) animal = "tavşan";
  else if (lower.includes("hamster")) animal = "hamster";

  return {
    keyword,
    lower,
    kind: classify(lower),
    animal,
    brand,
    size: sizeMatch ? `${sizeMatch[1]} ${sizeMatch[2].toLocaleLowerCase("tr-TR")}` : undefined,
    stage,
    priceIntent: /(fiyat|kaç tl|kac tl|ne kadar|ucuz|uygun|indirim)/i.test(lower),
  };
}

function section(heading: string, ...paragraphs: string[]): SeoSection {
  return { heading, paragraphs };
}

function mamaSections(ctx: Context, animal: "kedi" | "köpek"): SeoSection[] {
  const isCat = animal === "kedi";
  const species = isCat ? "kedinin" : "köpeğin";
  const stage = ctx.stage ? `${ctx.stage} ${animal}` : `${animal} yaşam dönemi`;
  const size = ctx.size || (isCat ? "küçük ve büyük paket" : "küçük paket ve büyük çuval");
  return [
    section(
      `${keywordAsTitle(ctx.keyword)} nedir?`,
      `${ctx.keyword}, ${stage} için mama arayanların kullandığı bir ürün sorgusudur. Doğru mama yalnızca marka adına göre değil; hayvanın yaşı, kilosu, hareket düzeyi, kısırlaştırma durumu ve veteriner tarafından belirlenmiş özel ihtiyaçları birlikte değerlendirilerek seçilir.`,
      `${ctx.brand ? `${ctx.brand} ürün ailesinde` : "Mama rafında"} aynı isim altında farklı yaşam evreleri ve içerikler bulunabilir. Ambalajın ön yüzündeki ifade kadar içerik listesi, analitik bileşenler, günlük porsiyon tablosu ve son kullanma tarihi de kontrol edilmelidir.`,
    ),
    section(
      `${stage.charAt(0).toLocaleUpperCase("tr-TR") + stage.slice(1)} için mama seçimi`,
      isCat
        ? "Yavru kediler büyüme için yoğun enerji ve dengeli minerale, yetişkin kediler koruyucu beslenmeye, kısırlaştırılmış kediler ise kontrollü kalori ve üriner sistem desteğine ihtiyaç duyar. Veteriner diyeti ibaresi bulunan mamalar tanı koymak için değil, veteriner planını uygulamak için kullanılmalıdır."
        : "Yavru köpeklerde büyüme hızı ve ırk büyüklüğü, yetişkinlerde aktivite düzeyi, ileri yaşta ise kilo ve eklem yükü önem kazanır. Küçük, orta ve büyük ırk mamalarının tane boyutu ile enerji yoğunluğu farklıdır; yalnızca paketin kilogramına bakarak karar verilmemelidir.",
    ),
    section(
      `İçerik ve etiket nasıl okunur?`,
      `Protein kaynağının açık biçimde yazılması, yağ ve lif oranının ${species} durumuyla uyumlu olması önemlidir. “Tahılsız”, “yüksek proteinli” veya “premium” gibi ifadeler tek başına uygunluk garantisi değildir. Hassasiyet şüphesinde rastgele mama değişikliği yerine veteriner değerlendirmesi gerekir.`,
      `Besleme tablosu başlangıç noktasıdır. Porsiyon; güncel kilo, vücut kondisyonu, ödül maması miktarı ve aktiviteye göre ayarlanır. Kilo artışı ya da kaybı görülürse miktar kademeli değiştirilir.`,
    ),
    section(
      `${size} alırken dikkat edilmesi gerekenler`,
      `${ctx.size ? `${ctx.size} paket` : "Büyük paket"} birim maliyeti düşürebilir; ancak açıldıktan sonra ürünün tazeliğini koruyabileceğiniz miktarda olmalıdır. Ambalaj yırtık, şişmiş, nemli veya etiketi okunamaz durumdaysa satın alınmamalıdır.`,
      `Kuru mama serin, kuru ve güneş görmeyen yerde; mümkünse kendi ambalajı kapalı biçimde bir saklama kabının içinde tutulur. Yeni mamaya geçiş çoğu hayvanda 7–10 güne yayılarak eski mamayla karıştırılmalıdır.`,
    ),
    section(
      `Kuru mama, yaş mama ve ödül dengesi`,
      isCat
        ? "Yaş mama su alımını destekleyebilir; kuru mama ise ölçülü porsiyonlamayı kolaylaştırır. İki ürün birlikte veriliyorsa toplam günlük enerji yeniden hesaplanmalıdır. Temiz içme suyu her zaman ulaşılabilir olmalıdır."
        : "Kuru ve yaş mama birlikte kullanılabilir; ancak iki ürünün porsiyonu ayrı ayrı tam verilmemelidir. Eğitim ödülleri günlük enerjinin küçük bir bölümünü oluşturmalı, ana öğünün yerini almamalıdır.",
      `İshal, kusma, yoğun kaşıntı veya iştahsızlık gelişirse ürünü sürekli değiştirerek deneme yapmak yerine veteriner görüşü alınmalıdır.`,
    ),
  ];
}

function productSections(ctx: Context): SeoSection[] {
  switch (ctx.kind) {
    case "kedi-mama":
      return mamaSections(ctx, "kedi");
    case "kopek-mama":
      return mamaSections(ctx, "köpek");
    case "kedi-kum":
      return [
        section(`${keywordAsTitle(ctx.keyword)} seçenekleri`, `${ctx.keyword} seçiminde topaklanma, toz miktarı, koku kontrolü, tane yapısı ve kedinin pati hassasiyeti birlikte düşünülür. Bentonit güçlü topaklanma sunar; silika sıvıyı kristallerde tutar; bitkisel ve pelet ürünler daha hafif veya biyolojik olarak çözünebilen alternatifler sağlayabilir.`),
        section("Bentonit, silika, tofu ve pelet farkı", "Bentonit kum düzenli kürekle temizlendiğinde pratiktir. Silika kumun kullanım süresi ürün ve kedi sayısına göre değişir. Tofu ile bitkisel kumlar düşük toz isteyen evlerde değerlendirilebilir. Pelet ürünlerde uyumlu elekli tuvalet kabı temizlik işini kolaylaştırabilir."),
        section("Toz ve koku kontrolü", "Parfüm kokusu insan için hoş olsa da bazı kediler yoğun kokulu kumu reddedebilir. Solunum hassasiyeti olan evlerde düşük tozlu ürün seçilmeli ve kum dökülürken ortam havalandırılmalıdır. Koku kontrolünün temeli parfüm değil, topakların her gün uzaklaştırılmasıdır."),
        section(`${ctx.size || "Paket boyu"} ve kullanım hesabı`, `${ctx.size ? `${ctx.size} ürünün` : "Paketin"} yalnızca fiyatına değil litre veya kilogram başına maliyetine ve kullanım süresine bakın. Çok kedili evlerde tuvalet sayısı, kabın büyüklüğü ve temizleme sıklığı tüketimi belirler.`),
        section("Kuma geçiş ve saklama", "Yeni kumu bir anda tamamen değiştirmek yerine eski kumla birkaç gün karıştırmak reddetme riskini azaltır. Açık paket nemden korunmalı; kabın tamamı üreticinin önerdiği aralıkta boşaltılıp uygun bir temizleyiciyle yıkanmalıdır."),
      ];
    case "tuvalet":
      return [
        section(`${keywordAsTitle(ctx.keyword)} seçerken ölçü`, `${ctx.keyword} kedinin rahatça dönüp kazabileceği genişlikte olmalıdır. Büyük veya uzun kediler için dış ölçü kadar iç kullanım alanı ve giriş yüksekliği kontrol edilir. Yavru ve eklem sorunu olan kediler alçak girişe daha kolay ulaşır.`),
        section("Açık, kapalı ve otomatik modeller", "Açık kaplar erişimi ve temizliği kolaylaştırır. Kapalı modeller kum saçılmasını azaltabilir; ancak içeride koku birikmemesi için sık temizlenmelidir. Otomatik tuvaletlerde minimum kilo sınırı, sensör güvenliği, atık haznesi, uyumlu kum türü ve yedek parça bulunabilirliği incelenmelidir."),
        section("Evde doğru yerleşim", "Tuvalet mama ve su kabından uzakta, kaçış yolu bulunan sessiz bir noktaya konur. Çok kedili evlerde genel öneri, kedi sayısından bir fazla tuvalet bulundurmaktır. Kapıyı kapatan veya başka hayvanın geçişi engellediği noktalar tuvalet reddine yol açabilir."),
        section("Temizlik ve sarf malzemeleri", "Kürek, paspas ve koku tutucu poşet günlük rutini kolaylaştırır. Topaklar her gün alınmalı, kap belirli aralıklarla tamamen boşaltılmalıdır. Keskin kokulu kimyasallar iyice durulanmadan kullanılmamalıdır."),
      ];
    case "tasima":
      return [
        section(`${keywordAsTitle(ctx.keyword)} nasıl seçilir?`, `${ctx.keyword} hayvanın ayakta durabildiği, dönebildiği ve rahatça yatabildiği ölçüde olmalıdır. Ürünün taşıma kapasitesi, taban sağlamlığı, kilit sistemi ve havalandırma açıklıkları hayvanın kilosuyla birlikte kontrol edilir.`),
        section("Sert kutu, kumaş çanta ve sırt çantası", "Sert taşıma kutuları veteriner yolculuğu ve araç kullanımı için sağlam bir seçenektir. Kumaş çantalar hafiftir ancak tabanı çökmemelidir. Şeffaf pencereli sırt çantalarında hava kanalı ve güneş altında ısınma riski özellikle değerlendirilmelidir."),
        section("Yolculuk güvenliği", "Taşıma ürünü araç içinde sabitlenmeli, hayvan araçta serbest bırakılmamalıdır. Uçak yolculuğunda firmanın güncel ölçü ve malzeme kuralları satın almadan önce doğrulanmalıdır. Uzun yol için emici ped ve su molası planlanır."),
        section("Ürüne alıştırma", "Çanta veya kutu yalnızca veteriner günü ortaya çıkarılmamalıdır. Evde kapağı açık bırakmak, içine tanıdık bir örtü ve ödül koymak ürünü güvenli alan hâline getirir. Her kullanımdan sonra yüzey hayvana uygun ürünle temizlenir."),
      ];
    case "tasma":
      return [
        section(`${keywordAsTitle(ctx.keyword)} için doğru ölçü`, `${ctx.keyword} seçiminde boyun veya göğüs çevresi yumuşak mezurayla ölçülür ve üreticinin beden tablosu kullanılır. İki parmak kuralı başlangıç kontrolüdür; ürün hayvanın başından sıyrılmamalı ve nefesi kısıtlamamalıdır.`),
        section("Boyun tasması ve göğüs koşumu farkı", "Boyun tasması kimlik künyesi ve sakin yürüyüş için uygundur. Çeken, solunum hassasiyeti olan veya boynu narin köpeklerde doğru oturan göğüs koşumu yükü gövdeye dağıtır. Kedilerde kaçışa dayanıklı, hafif ve güvenlik tokalı modeller tercih edilir."),
        section("Kayış, toka ve görünürlük", "Dikişler, metal bağlantı, karabina ve tokalar düzenli kontrol edilmelidir. Gece yürüyüşünde reflektif şerit veya ışık görünürlüğü artırır. Otomatik uzayan kayış kalabalık ve yol kenarında kısa kilitte kullanılmalıdır."),
        section("Alıştırma ve bakım", "Yeni ürün evde kısa sürelerle ve ödülle tanıtılır. Islanan tasma üretici talimatına göre temizlenip tamamen kurutulur. Aşınan dikiş, çatlayan toka veya eğilen karabina fark edildiğinde ürün değiştirilir."),
      ];
    case "oyuncak":
      return [
        section(`${keywordAsTitle(ctx.keyword)} ne işe yarar?`, `${ctx.keyword} hareket, avlanma, çiğneme veya problem çözme davranışlarına güvenli bir çıkış sunmalıdır. Oyuncak seçimi hayvanın yaşı, ağız büyüklüğü, çene gücü ve oyun biçimine göre yapılır.`),
        section("Malzeme ve boyut güvenliği", "Yutulabilecek kadar küçük parçalar, kolay kopan ipler ve keskin kenarlar kullanılmamalıdır. Çiğneme oyuncakları diş kıracak kadar sert olmamalı; parçalanmaya başladığında değiştirilmelidir. İlk oyunlar gözetim altında yapılır."),
        section("Zihin oyunu ve hareket", "Mama bulmacaları yeme hızını düşürür, olta ve top oyunları kontrollü hareket sağlar. Aynı oyuncağı sürekli açıkta bırakmak ilgiyi azaltabilir; birkaç ürünü dönüşümlü kullanmak daha verimlidir."),
        section("Temizlik ve oyun rutini", "Kumaş, kauçuk ve ip oyuncakların temizleme yöntemi farklıdır. Üretici talimatı izlenmeli ve ürün tamamen kurutulmalıdır. Lazer oyununda avlanma döngüsü fiziksel bir oyuncağı yakalama veya küçük bir ödülle tamamlanmalıdır."),
      ];
    case "yasam":
      return [
        section(`${keywordAsTitle(ctx.keyword)} seçim rehberi`, `${ctx.keyword} hayvanın boyuna, kilosuna, uyku biçimine ve kullanılacağı alana göre seçilir. İç ölçü, dış ölçüden daha önemlidir; hayvan rahatça uzanabilmeli ve dönebilmelidir.`),
        section("Malzeme ve kullanım alanı", "İç mekânda yıkanabilir kumaş ve çıkarılabilir kılıf temizliği kolaylaştırır. Dış mekân kulübelerinde zeminden yükseklik, yağmurdan korunma, hava dolaşımı ve gölge önemlidir. Tırmalama ürünlerinde taban dengesi ve yüzey yüksekliği devrilme riskini azaltır."),
        section("Konfor ve güvenlik", "Dolgu aşırı yumuşak veya çökmüş olmamalıdır. Yaşlı ve eklem hassasiyeti olan hayvanlarda destekleyici yatak değerlendirilebilir. Zımba, gevşek ip, kıymık ve kolay kopan parçalar düzenli kontrol edilir."),
        section("Temizlik ve yerleşim", "Ürün cereyansız, sakin ve kuru bir noktaya konur. Kılıf ve minder bakım etiketine göre yıkanır; tamamen kurumadan kullanılmaz. Dış mekân ürünlerinde taban ve çatı mevsim geçişlerinde kontrol edilir."),
      ];
    case "kus":
      return [
        section(`${keywordAsTitle(ctx.keyword)} hangi kuş için uygundur?`, `${ctx.keyword} seçilirken kuşun türü, gaga büyüklüğü, yaşı ve mevcut beslenme düzeni dikkate alınır. Muhabbet kuşu, kanarya ve papağanların enerji ile tane boyutu ihtiyacı aynı değildir.`),
        section("Yem, pelet ve takviye dengesi", "Tek tip yağlı tohum uzun vadede dengeli beslenme sağlamaz. Türüne uygun temel yem veya pelet, güvenli taze gıdalar ve temiz suyla tamamlanır. Vitamin ve mineral ürünleri gelişigüzel değil, etiket dozu veya veteriner önerisiyle kullanılır."),
        section("Kafes ve aksesuar seçimi", "Kafes kuşun kanat açmasına izin vermeli, tel aralığı başın sıkışmayacağı ölçüde olmalıdır. Farklı kalınlıklarda doğal tünekler ayak sağlığını destekler. Ayna ve ipli oyuncaklar yıpranma açısından kontrol edilir."),
        section("Saklama ve hijyen", "Yem serin ve kuru yerde kapalı tutulmalı; nem, güve ve küf kontrolü yapılmalıdır. Su kabı her gün, yemlik ve kafes tabanı düzenli temizlenir. Ani yem değişimi yerine yeni ürün kademeli karıştırılır."),
      ];
    case "akvaryum":
      return [
        section(`${keywordAsTitle(ctx.keyword)} için temel bilgiler`, `${ctx.keyword} akvaryum hacmi, canlı türü ve mevcut ekipmanla uyumlu seçilmelidir. Etikette yazan litre kapasitesi ideal koşullara dayanabilir; balık yükü, boru yüksekliği ve filtre malzemesi gerçek performansı etkiler.`),
        section("Filtrasyon ve su döngüsü", "Mekanik sünger parçacıkları tutar, biyolojik medya yararlı bakterilere yüzey sağlar. Yeni akvaryumda azot döngüsü oturmadan canlı eklemek amonyak riskini artırır. Filtre malzemesinin tamamı aynı anda musluk suyunda yıkanmamalıdır."),
        section("Yem ve su bakımı", "Balıkların birkaç dakikada tüketebileceği miktarda yem verilmelidir. Aşırı yem su değerlerini bozar. Düzenli kısmi su değişimi, uygun su düzenleyici ve sıcaklık takibi ekipman seçiminden ayrı düşünülmez."),
        section("Ölçü ve güvenlik kontrolü", "Akvaryum düz ve taşıyıcı bir zemine yerleştirilir. Isıtıcı, motor ve aydınlatmada kablo, fiş ve suya dayanıklılık kontrol edilir. Canlı türlerinin erişkin boyu ve birbirleriyle uyumu satın almadan önce araştırılır."),
      ];
    case "kucuk-hayvan":
      return [
        section(`${keywordAsTitle(ctx.keyword)} seçiminde tür farkı`, `${ctx.keyword} hamster, tavşan veya kobay için aranıyor olabilir; bu türlerin kafes, yem ve altlık ihtiyaçları birbirinin aynı değildir. Ürün etiketi hayvan türü ve yaşam dönemiyle eşleşmelidir.`),
        section("Beslenmenin temeli", "Tavşan ve kobaylarda kaliteli kuru ot temel besindir; pelet destekleyici miktarda verilir. Hamster karışımlarında seçerek yeme davranışı izlenmelidir. Taze su her gün yenilenir ve suluk akışı kontrol edilir."),
        section("Altlık ve yaşam alanı", "Tozsuz, emici ve kokusuz altlık solunum konforu sağlar. Tel taban ayak yaralanmasına neden olabilir. Alan; saklanma evi, uygun çapta egzersiz tekeri ve güvenli kemirme materyaliyle düzenlenir."),
        section("Temizlik ve ürün güvenliği", "Islanan bölümler günlük alınır; tüm yaşam alanı hayvanı strese sokmayacak sıklıkta temizlenir. Plastik parçalar, sivri teller ve sıkışma aralıkları düzenli kontrol edilir."),
      ];
    case "bakim":
      return [
        section(`${keywordAsTitle(ctx.keyword)} ne için kullanılır?`, `${ctx.keyword}, bakım rutininin belirli bir adımını kolaylaştıran üründür. Etiket üzerinde hedef hayvan türü, yaş veya kilo sınırı, kullanım sıklığı ve uyarılar okunmadan uygulanmamalıdır.`),
        section("Doğru ürün ve uygulama", "Kedi ve köpek ürünleri her zaman birbirinin yerine kullanılamaz. Özellikle aktif maddeli ürünlerde yanlış tür veya doz ciddi risk yaratabilir. İlaç niteliğindeki parazit ürünleri için veteriner yönlendirmesi gerekir; petshop ürünü teşhis veya tedavinin yerine geçmez."),
        section("Hassasiyet ve güvenlik", "İlk kullanımda küçük bir alanda tolerans kontrolü yapılabilir. Göz, ağız ve yaralı deriye temas ettirilmemeli; tahriş, yoğun kaşıntı veya solunum sorunu gelişirse kullanım bırakılıp veteriner görüşü alınmalıdır."),
        section("Saklama ve hijyen", "Bakım ürünü kendi ambalajında, çocuklardan ve hayvanlardan uzakta saklanır. Tarak, makas ve tırnak ürünleri her kullanımdan sonra temizlenir. Son kullanma tarihi geçen veya ambalajı bozulan ürün kullanılmaz."),
      ];
    case "petshop":
      return [
        section(`${keywordAsTitle(ctx.keyword)} aramasında ürün grupları`, "Bir petshop; kedi ve köpek mamaları, kedi kumu, taşıma ürünleri, tasma ve koşumlar, oyuncaklar, kuş yemleri, akvaryum ekipmanları ile küçük hayvan malzemelerini bir arada sunar. İyi bir alışveriş için önce hayvanın türü, yaşı, kilosu ve mevcut kullandığı ürün not edilmelidir."),
        section("Mama ve beslenme ürünleri", "Mama seçiminde yaşam dönemi, kısırlaştırma durumu, ırk büyüklüğü ve varsa veteriner planı önemlidir. Ambalaj bütünlüğü, içerik etiketi, porsiyon tablosu ve son kullanma tarihi kontrol edilmelidir. Açık veya kaynağı belirsiz ürünlerden kaçınılmalıdır."),
        section("Hijyen, bakım ve taşıma", "Kedi kumu ve tuvalet kabı birlikte değerlendirilir; tasma ve taşıma çantasında ölçü alınır. Şampuan, tarak, tırnak makası ve diş bakım ürünleri hayvan türüne uygun olmalıdır. İlaç niteliğindeki ürünler için veteriner önerisi gerekir."),
        section("Oyuncak ve yaşam alanı", "Oyuncaklar boyut ve çene gücüne uygun, kopmaya karşı güvenli olmalıdır. Yatak, tırmalama ürünü, kafes veya akvaryum seçerken iç ölçü, malzeme, temizlik ve yedek parça dikkate alınır."),
        section("Mağazaya gitmeden önce", `Aradığınız marka, ürün adı, gramaj ve hayvan bilgilerini not etmek karşılaştırmayı kolaylaştırır. ${STORE}, ${STORE_ADDRESS_SHORT} adresinde her gün ${HOURS} açıktır. Stok ve ürün ölçüsü için ${PHONE_DISPLAY} numarasından bilgi alınabilir.`),
      ];
    case "marka":
      return [
        section(`${keywordAsTitle(ctx.keyword)} ürününü doğru tanımlama`, `${ctx.keyword} aramasında marka kadar tam ürün adı, hayvan türü, yaşam dönemi ve gramaj önemlidir. ${ctx.brand || "Aynı marka"} altında benzer ambalajlı fakat farklı amaçlara yönelik ürünler bulunabilir.`),
        section("Etiket ve ambalaj kontrolü", "Ürün adı, varyant, parti bilgisi, son kullanma tarihi ve ambalaj bütünlüğü kontrol edilmelidir. Mama ürünlerinde içerik listesi ve besleme tablosu; bakım ürünlerinde hedef tür, kullanım dozu ve uyarılar okunur."),
        section("Benzer ürünler nasıl karşılaştırılır?", "Karşılaştırma paket fiyatıyla sınırlı tutulmamalıdır. Mama için günlük porsiyon maliyeti ve hayvanın ihtiyacı; kum için litre başına maliyet ve kullanım süresi; aksesuarda ölçü, malzeme ve yedek parça dikkate alınır."),
        section("Ürün değişimi ve saklama", "Mama değişimi kademeli yapılır. Sarf ürünleri kuru, serin ve kapalı ortamda saklanır. Ürünün rengi, kokusu veya yapısı olağandışıysa kullanılmadan önce satıcı ya da üreticiyle görüşülür."),
      ];
    default:
      return [
        section(`${keywordAsTitle(ctx.keyword)} hakkında`, `${ctx.keyword}, evcil hayvan ürünü veya bakımıyla ilgili bir aramadır. Ürünün hayvan türüne, yaşına, kilosuna ve kullanım amacına uygunluğu; yalnızca fiyatından veya ambalaj görünümünden daha önemlidir.`),
        section("Ürün etiketini okuyun", "Hedef tür, ölçü veya gramaj, içerik ve malzeme, kullanım talimatı, güvenlik uyarıları ve son kullanma tarihi kontrol edilir. Aynı isimle satılan ürünlerin formülü veya ölçüsü farklı olabilir."),
        section("Kalite ve güvenlik kontrolü", "Ambalajı açık, etiketi okunmayan veya kaynağı belirsiz ürünlerden kaçınılmalıdır. Aksesuarların bağlantıları, keskin kenarları ve kopabilecek parçaları incelenir. Bakım ve beslenme ürünleri üretici talimatına göre kullanılmalıdır."),
        section("Satın almadan önce ihtiyaç listesi", "Hayvanın güncel kilosu, yaşı, kullandığı ürün ve varsa veteriner notu alışveriş sırasında yanınızda olsun. Ölçü gerektiren tasma, yatak, kafes ve taşıma ürünlerinde tahmin yerine mezura kullanılmalıdır."),
      ];
  }
}

function priceSection(ctx: Context): SeoSection {
  return section(
    "Fiyat ve paket karşılaştırması",
    `${ctx.keyword} fiyatı marka, ürün serisi, içerik veya malzeme, ${ctx.size ? `${ctx.size} gramaj` : "paket boyu"} ve satış dönemine göre değişebilir. Güncelliğini hızla yitiren sabit bir rakam vermek yerine aynı ölçü ve varyantı karşılaştırmak daha sağlıklıdır.`,
    "Kampanya karşılaştırırken kargo, birim kilogram veya litre maliyeti, ürünün tüketim süresi ve iade koşulları hesaba katılmalıdır. Aşırı düşük fiyatlı, kaynağı belirsiz veya ambalajı bozulmuş ürün tasarruf değil risk oluşturur.",
  );
}

function finalSection(ctx: Context): SeoSection {
  return section(
    `${keywordAsTitle(ctx.keyword)} satın almadan önce kontrol listesi`,
    `Hayvan türünü, yaşını, kilosunu ve kullanım amacını netleştirin. Tam ürün adını, ${ctx.size || "ölçü veya gramajı"}, ambalaj durumunu ve kullanım talimatını kontrol edin. Beslenme ya da sağlıkla ilgili özel bir durum varsa veteriner planını esas alın.`,
    `${STORE}, ${STORE_ADDRESS_LINE} adresinde her gün ${HOURS} hizmet verir. ${ctx.keyword} için mağazaya gelmeden önce ${PHONE_DISPLAY} numarasından ürün, ölçü ve güncel stok bilgisi sorabilirsiniz.`,
  );
}

function faqsFor(ctx: Context): SeoFaq[] {
  return [
    {
      q: `${keywordAsTitle(ctx.keyword)} seçerken en önemli nokta nedir?`,
      a: `Ürünün ${ctx.animal} türüne, yaşına, kilosuna ve kullanım amacına uygun olmasıdır. Etiket, ölçü, içerik veya malzeme bilgileri birlikte kontrol edilmelidir.`,
    },
    {
      q: `${keywordAsTitle(ctx.keyword)} için büyük paket avantajlı mı?`,
      a: "Birim fiyat düşebilir; ancak ürünün kullanım süresi, saklama koşulu ve son kullanma tarihi hesaba katılmalıdır. Tüketilemeyecek kadar büyük paket avantaj sağlamaz.",
    },
    {
      q: `${keywordAsTitle(ctx.keyword)} stok bilgisi nasıl alınır?`,
      a: `${STORE} için ${PHONE_DISPLAY} numarasından tam ürün adı, marka ve ölçüyü yazarak güncel stok bilgisi isteyebilirsiniz.`,
    },
    {
      q: "Mağaza nerede ve hangi saatlerde açık?",
      a: `${STORE_ADDRESS_LINE} adresindedir. Haftanın her günü ${HOURS} saatleri arasında açıktır.`,
    },
  ];
}

export function pickImages(keyword: string): SeoImage[] {
  const ctx = contextFor(keyword);
  let primary: string = STORE_IMAGES.general;
  if (ctx.kind === "kedi-mama" || ctx.kind === "kedi-kum" || ctx.kind === "tuvalet" || ctx.animal === "kedi") primary = STORE_IMAGES.kedi;
  else if (ctx.kind === "kopek-mama" || ctx.kind === "tasma" || ctx.animal === "köpek") primary = STORE_IMAGES.kopek;
  else if (ctx.kind === "kus") primary = STORE_IMAGES.kus;
  return [
    { src: primary, alt: `${ctx.keyword} ürünleri hakkında bilgi` },
    { src: STORE_IMAGES.reyonlar, alt: `${ctx.keyword} seçimi ve ürün karşılaştırması` },
    { src: STORE_IMAGES.general, alt: `${ctx.keyword} için EnuygunPet mağazası` },
  ];
}

export function buildKeywordDescription(keyword: string): string {
  const ctx = contextFor(keyword);
  const title = keywordAsTitle(ctx.keyword);
  const descriptions: Record<ProductKind, string> = {
    "kedi-mama": `${title}: yaş, içerik, gramaj ve mama geçişi hakkında seçim rehberi. Kedi maması ürünlerini doğru karşılaştırmak için önemli bilgiler.`,
    "kopek-mama": `${title}: ırk büyüklüğü, yaş, içerik ve porsiyon hakkında seçim rehberi. Köpek maması ürünlerini doğru karşılaştırın.`,
    "kedi-kum": `${title}: bentonit, silika, tofu ve pelet seçenekleri; toz, koku, paket boyu ve doğru kullanım hakkında ürün rehberi.`,
    tuvalet: `${title}: ölçü, açık-kapalı ve otomatik model farkları, yerleşim, güvenlik ve temizlik hakkında seçim rehberi.`,
    tasima: `${title}: doğru ölçü, havalandırma, taşıma kapasitesi ve yolculuk güvenliği hakkında ürün seçim rehberi.`,
    tasma: `${title}: doğru beden, boyun tasması ve göğüs koşumu farkları, malzeme ve güvenlik hakkında seçim rehberi.`,
    oyuncak: `${title}: yaşa ve oyun biçimine uygun oyuncak, güvenli malzeme, boyut, kullanım ve temizlik hakkında bilgiler.`,
    yasam: `${title}: doğru ölçü, malzeme, konfor, güvenlik, yerleşim ve temizlik hakkında pet ürünü seçim rehberi.`,
    kus: `${title}: kuş türüne uygun yem, kafes veya aksesuar seçimi; beslenme, güvenlik ve hijyen hakkında bilgiler.`,
    akvaryum: `${title}: akvaryum hacmi, filtrasyon, yemleme, su bakımı, ekipman uyumu ve güvenlik hakkında ürün rehberi.`,
    "kucuk-hayvan": `${title}: hamster, tavşan ve küçük hayvanlar için doğru yem, kafes, altlık ve aksesuar seçimi hakkında bilgiler.`,
    bakim: `${title}: evcil hayvan türüne uygun bakım ürünü seçimi, güvenli kullanım, hijyen ve saklama hakkında rehber.`,
    petshop: `${title}: mama, kum, tasma, taşıma, oyuncak ve bakım ürünlerini seçerken dikkat edilmesi gerekenler. EnuygunPet ürün rehberi.`,
    marka: `${title}: doğru varyant, gramaj, etiket, ambalaj ve benzer ürün karşılaştırması hakkında satın alma rehberi.`,
    genel: `${title} hakkında ürün özellikleri, ölçü, kullanım, güvenlik ve satın alma öncesi kontrol bilgileri. EnuygunPet ürün rehberi.`,
  };
  return descriptions[ctx.kind];
}

export function buildKeywordArticle(keyword: string, _slug: string): SeoArticle {
  const ctx = contextFor(keyword);
  const sections = productSections(ctx);
  if (ctx.priceIntent) sections.push(priceSection(ctx));
  sections.push(finalSection(ctx));
  return {
    images: pickImages(ctx.keyword),
    sections,
    faqs: faqsFor(ctx),
  };
}

export function buildCategoryArticle(h1: string, slug: string): SeoArticle {
  return buildKeywordArticle(h1, slug);
}

export function buildHealthArticle(
  keyword: string,
  animalTr: string,
  _category: string,
  slug: string,
): SeoArticle {
  const clean = cleanSeoKeyword(keyword);
  const productRec = `${animalTr.toLocaleLowerCase("tr-TR")} için veterinerin önerdiği beslenme, hijyen ve bakım ürünleri`;
  const base = buildKeywordArticle(`${animalTr} bakım ürünleri`, slug);
  return {
    ...base,
    productRec,
    sections: [
      section(
        `${keywordAsTitle(clean)} konusunda ürün kullanımı`,
        `${clean} bir sağlık veya bakım sorusuna işaret ediyorsa petshop ürünü tanı ve tedavinin yerine geçmez. Önce belirtilerin süresi ve şiddeti değerlendirilmelidir. Nefes darlığı, kanama, idrar yapamama, nöbet, zehirlenme şüphesi veya belirgin halsizlik acil veteriner muayenesi gerektirir.`,
        `Veteriner bir bakım veya beslenme planı verdiyse ürün; hayvanın türüne, yaşına, kilosuna ve önerilen kullanım amacına göre seçilmelidir. İnsan ilacı, başka hayvana ait ürün veya etikette belirtilmeyen doz kullanılmamalıdır.`,
      ),
      section(
        "Destek ürünleri nasıl değerlendirilir?",
        `${productRec} yalnızca uygun durumda destekleyici olabilir. Diyet mama, takviye, şampuan veya hijyen ürününün etiketinde hedef tür ve kullanım talimatı açıkça yazmalıdır. İlaç veya aktif maddeli parazit ürünleri veteriner yönlendirmesi olmadan uygulanmamalıdır.`,
      ),
      section(
        "Evde gözlem ve ürün güvenliği",
        "İştah, su tüketimi, dışkı, idrar, hareket ve davranış değişiklikleri not edilmelidir. Yeni ürün sonrası kusma, ishal, şişme, yoğun kaşıntı veya solunum sorunu görülürse kullanım bırakılıp veterinerle görüşülmelidir.",
      ),
      ...base.sections.slice(1, 3),
      finalSection(contextFor(`${animalTr} bakım ürünleri`)),
    ],
    faqs: [
      { q: `${keywordAsTitle(clean)} evde ürünle tedavi edilir mi?`, a: "Hayır. Petshop ürünleri tanı ve tedavi yerine geçmez. Belirti sürüyorsa veya şiddetliyse veteriner muayenesi gerekir." },
      { q: "Destek ürünü seçerken neye bakılmalı?", a: "Hayvan türü, yaş, kilo, içerik, kullanım amacı ve veteriner önerisi birlikte değerlendirilmelidir." },
      ...base.faqs.slice(2),
    ],
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
  const place = [opts.neighborhood, opts.district].filter(Boolean).join(", ");
  const base = buildKeywordArticle(opts.keyword || opts.h1, opts.slug);
  return {
    ...base,
    sections: [
      section(
        `${keywordAsTitle(opts.h1)} ürün rehberi`,
        `${place || "Samsun"} bölgesinden petshop alışverişi yaparken ürünün tam adı, hayvanın yaşı ve kilosu, istenen gramaj veya ölçü önceden belirlenmelidir. Böylece benzer ambalajlı mama, yanlış beden tasma veya küçük taşıma çantası alma riski azalır.`,
        "Mama ve kumda ambalaj ile son kullanma tarihi; tasma, yatak, kafes ve taşıma ürünlerinde iç ölçü ile malzeme; bakım ürünlerinde hedef hayvan türü ve kullanım talimatı kontrol edilmelidir.",
      ),
      ...base.sections,
    ],
  };
}
