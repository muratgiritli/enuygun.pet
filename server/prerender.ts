import keywordsData from "./keywords.json";
import healthData from "./health-keywords.json";
import kopekHealthData from "./kopek-health-keywords.json";
import papagaHealthData from "./papagan-health-keywords.json";
import muhabbet from "./muhabbet-health-keywords.json";
import blogPosts from "./blog-posts.json";
import categories from "./categories.json";
import localPages from "./local-seo.json";

interface PageMeta {
  title: string;
  h1: string;
  description: string;
  bodyHtml?: string;
}

const BRAND = "EnuygunPet Samsun Atakum";

const keywordMap = new Map<string, string>();
for (const k of keywordsData as { slug: string; keyword: string }[]) {
  keywordMap.set(k.slug, k.keyword);
}

const healthMap = new Map<string, { keyword: string; categoryName: string }>();
for (const h of [
  ...(healthData as any[]),
  ...(kopekHealthData as any[]),
  ...(papagaHealthData as any[]),
  ...(muhabbet as any[]),
]) {
  if (!healthMap.has(h.slug)) {
    healthMap.set(h.slug, { keyword: h.keyword, categoryName: h.categoryName });
  }
}

const blogMap = new Map<string, { title: string; desc: string; sections: Array<{ h: string; p: string }> }>();
for (const b of blogPosts as { slug: string; title: string; desc: string; sections?: Array<{ h: string; p: string }> }[]) {
  blogMap.set(b.slug, { title: b.title, desc: b.desc, sections: b.sections || [] });
}

const categoryMap = new Map<string, { h1: string; desc: string }>();
for (const c of categories as { slug: string; h1: string; desc: string }[]) {
  categoryMap.set(c.slug, { h1: c.h1, desc: c.desc });
}

const localMap = new Map<string, { h1: string; desc: string; intro?: string; sections?: Array<{ h: string; p: string }> }>();
for (const l of localPages as { slug: string; h1: string; desc: string; intro?: string; sections?: Array<{ h: string; p: string }> }[]) {
  if (!localMap.has(l.slug)) {
    localMap.set(l.slug, { h1: l.h1, desc: l.desc, intro: l.intro, sections: l.sections || [] });
  }
}

const CATEGORY_SLUGS = new Set([
  "kedi-mamasi",
  "kopek-mamasi",
  "kedi-kumu",
  "petshop-samsun",
  "atakum-petshop",
  "kapida-teslim-petshop",
]);

// ── Clean raw keyword text (remove leading/trailing periods/spaces) ───────────
function cleanKeyword(kw: string): string {
  return kw.replace(/^[\s.]+/, "").replace(/[\s.]+$/, "").replace(/\s+/g, " ").trim();
}

// ── Title-case helper (Turkish-safe) ──────────────────────────────────────────
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (w) =>
    w.charAt(0).toUpperCase() + w.slice(1)
  );
}

// ── Type-specific meta description generator ──────────────────────────────────
function buildKeywordDesc(kw: string): string {
  const k = kw.toLowerCase();
  if (k.includes("kedi") && k.includes("mama"))
    return `${kw} — Royal Canin, Hills, Pro Plan, Reflex gross market fiyatıyla Samsun Atakum'da. Yavru, kısır ve yetişkin kedi maması stokta.`;
  if ((k.includes("köpek") || k.includes("kopek")) && k.includes("mama"))
    return `${kw} — Royal Canin, Pro Plan, Brit Care köpek mamaları Samsun Atakum'da gross market fiyatıyla. Irka özel, yavru ve yetişkin seçenekleri.`;
  if (k.includes("kedi") && k.includes("kum"))
    return `${kw} — Topaklanan, silika ve doğal kedi kumu çeşitleri Samsun Atakum'da. Büyük gramaj ve toplu alım avantajıyla EnuygunPet'te.`;
  if (k.includes("kuş") || k.includes("kus") || k.includes("muhabbet") || k.includes("papağan"))
    return `${kw} — Muhabbet kuşu, papağan, kanarya yemi ve aksesuar Samsun Atakum'da. EnuygunPet Gross Market'te geniş kuş ürünleri yelpazesi.`;
  if (["royal canin","hills","pro plan","brit care","reflex","acana","orijen"].some(m => k.includes(m)))
    return `${kw} — Orijinal ve garantili ürünler Samsun Atakum'da. EnuygunPet Gross Market'te gross market fiyatıyla tüm gramaj seçenekleri.`;
  if (k.includes("petshop") || k.includes("pet shop") || k.includes("pet market"))
    return `${kw} — Samsun Atakum'un en büyük petshop gross marketi. Kedi, köpek, kuş ürünleri haftanın 7 günü 09:00-21:00. WhatsApp: +90 542 211 49 44`;
  if (k.includes("tasma") || k.includes("koşum") || k.includes("oyuncak"))
    return `${kw} — Geniş aksesuar ve oyuncak yelpazesi Samsun Atakum'da. EnuygunPet Gross Market'te uygun fiyatlarla tüm evcil hayvan aksesuarları.`;
  return `${kw} Samsun Atakum'da EnuygunPet Gross Market'te. Gross market fiyatı, geniş stok ve uzman danışmanlıkla hizmetinizde. Haftanın 7 günü açık.`;
}

// ── Content generator (mirrors keyword-page.tsx generateContent) ──────────────
function generateContent(keyword: string): { article: string; faqs: Array<{ q: string; a: string }> } {
  const kw = keyword.toLowerCase();
  const isKediMama = kw.includes("kedi") && kw.includes("mama");
  const isKopekMama = (kw.includes("köpek") || kw.includes("kopek")) && kw.includes("mama");
  const isKediKumu = kw.includes("kedi") && kw.includes("kum");
  const isTasma = kw.includes("tasma") || kw.includes("taşma") || kw.includes("kolye") || kw.includes("boyunluk");
  const isKusYemi = kw.includes("kuş") || kw.includes("kus") || kw.includes("muhabbet") || kw.includes("papağan") || kw.includes("kanarya");
  const isMarka = ["royal canin", "hills", "pro plan", "proplan", "brit", "reflex", "enjoy", "acana", "orijen", "purina", "felix", "whiskas", "pedigree"].some(m => kw.includes(m));
  const isPetshop = kw.includes("petshop") || kw.includes("pet shop") || kw.includes("pet market");
  const isOyuncak = kw.includes("oyuncak");

  let article = "";
  let faqs: Array<{ q: string; a: string }> = [];

  if (isKediMama) {
    article = `Samsun Atakum'da ${keyword} arıyorsanız doğru adrestesiniz. EnuygunPet Gross Market olarak Türkiye'nin önde gelen markalarının kedi mamalarını en uygun fiyatlarla sunuyoruz. Mağazamızda yüzlerce farklı kedi maması seçeneği bulunmakta olup Atakum bölgesinin en geniş petshop ürün yelpazesinizi sunmaktayız.\n\n${keyword} için mağazamızı tercih eden müşterilerimize ücretsiz danışmanlık hizmeti de sunuyoruz. Kedinizin yaşına, ırkına ve sağlık durumuna göre en uygun mamayı bulmanıza yardımcı olan uzman ekibimiz her gün 09:00-21:00 saatleri arasında hizmetinizdedir.\n\nSamsun'da kedi maması satın almak için en güvenilir adres EnuygunPet'tir. ${keyword} dahil tüm premium ve ekonomik kedi maması markalarını stokta bulunduruyoruz. Toplu alımlarda özel fiyat avantajlarımızdan yararlanabilirsiniz. Royal Canin, Hills Science Plan, Pro Plan, Brit Care, Reflex, Acana gibi dünya markalarının tüm ürün gamlarını tek adreste bulabilirsiniz. Yavru (kitten), yetişkin (adult), kısır (sterilised) ve özel diyet mamalar dahil tüm kategoriler mevcuttur.\n\nMağazamızda uzman personelimiz kedinizin ihtiyacına göre size en uygun ürünü tavsiye eder. Sağlıklı bir kedi için doğru beslenme hayati önem taşır. Mağazamızı ziyaret edin, ürünleri inceleyin ve kediniz için en doğru seçimi yapın. 09:00-21:00 saatleri arasında haftanın her günü sizlere hizmet veriyoruz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nereden alınır?`, a: `Samsun Atakum'daki EnuygunPet Gross Market mağazamızda ${keyword} ürününü stokta bulabilirsiniz. Haftanın her günü 09:00-21:00 saatleri arasında hizmetinizdeyiz. WhatsApp üzerinden ürün sorgulaması da yapabilirsiniz.` },
      { q: `${keyword} fiyatı ne kadar?`, a: `${keyword} fiyatları markaya ve gramaja göre değişmektedir. En güncel fiyat bilgisi için mağazamızı arayabilir veya WhatsApp'tan bilgi alabilirsiniz. Gross market avantajımızla rakipsiz fiyatlar sunuyoruz.` },
      { q: `${keyword} için hangi marka daha iyi?`, a: `Kedinizin ihtiyacına göre Royal Canin, Hills Science Plan, Pro Plan, Brit Care ve Reflex başta olmak üzere pek çok kaliteli marka arasından seçim yapabilirsiniz. Uzman ekibimiz ücretsiz öneri sunar.` },
      { q: `Atakum'da kedi maması kapıda teslim var mı?`, a: `EnuygunPet olarak şu an online satış yapmamaktayız. Ancak mağazamızı ziyaret ederek veya WhatsApp üzerinden sipariş oluşturarak ürünlerinizi hazır bulabilirsiniz.` },
    ];
  } else if (isKopekMama) {
    article = `Samsun Atakum'da ${keyword} arayanlar için EnuygunPet Gross Market geniş stoku ve uygun fiyatlarıyla hizmet vermektedir. Köpeğinizin sağlıklı beslenmesi için en kaliteli markaların ürünlerini bir arada bulabileceğiniz tek adresiz.\n\n${keyword} için Samsun'un en büyük petshop gross marketi olan mağazamızı tercih eden müşterilerimize ücretsiz beslenme danışmanlığı sunuyoruz. Köpeğinizin ırkına, yaşına ve ağırlığına göre en doğru mamayı seçmenize yardımcı oluyoruz.\n\nAtakum'da haftanın her günü 09:00-21:00 saatleri arasında kapımız açık. ${keyword} ve daha pek çok köpek ürününü mağazamızda bulabilirsiniz. Royal Canin, Pedigree, Pro Plan, Brit, Reflex, Enjoy gibi dünya markalarının tüm köpek maması gamlarını stokta tutuyoruz. Yavru, yetişkin, yaşlı ve özel diyet mamaları her ırk için mevcuttur.\n\nKöpek maması seçiminde dikkat edilmesi gereken en önemli faktörler: köpeğin ırkı, yaşı ve kilosu. Büyük ırk, küçük ırk ve orta ırk formülleri birbirinden farklı besin değerleri içerir. Mağazamızdaki uzman ekibimiz köpeğiniz için en uygun ürünü seçmenize yardımcı olur. Toplu alımlarda özel fiyat avantajlarından yararlanabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `Samsun Atakum'daki EnuygunPet mağazamızda ${keyword} ürününü bulabilirsiniz. Geniş stokumuzu görmek için bizi arayabilir ya da mağazaya gelebilirsiniz.` },
      { q: `${keyword} hangi yaşa uygun?`, a: `Ürünün ambalajındaki öneriye göre değişmektedir. Yavru, yetişkin veya yaşlı köpek mamaları farklı beslenme ihtiyaçlarına göre formüle edilmiştir. Uzman ekibimiz size öneride bulunabilir.` },
      { q: `${keyword} yerine ne kullanılır?`, a: `Benzer kalite ve fiyat aralığında alternatifler mevcuttur. Mağazamızda Pro Plan, Royal Canin, Brit, Reflex, Enjoy gibi pek çok marka ürünü karşılaştırarak en uygununu seçebilirsiniz.` },
      { q: `Toplu köpek maması alımında indirim var mı?`, a: `EnuygunPet Gross Market olarak toplu alımlarda özel indirim sunuyoruz. Detaylar için WhatsApp veya telefon ile iletişime geçebilirsiniz.` },
    ];
  } else if (isKediKumu) {
    article = `Samsun Atakum'da ${keyword} arayanlar için EnuygunPet Gross Market en geniş kedi kumu seçeneklerini sunar. Bentonit, tofu, çam peleti, karbonlu ve silika jel gibi her türlü kedi kumu çeşidini mağazamızda bulabilirsiniz.\n\n${keyword} tercihinde hijyen, koku kontrolü ve fiyat/performans oranı en önemli kriterlerdir. Uzman ekibimiz kedinizin alışkanlıklarına göre en uygun kumu bulmanıza yardımcı olur.\n\nSamsun Atakum'da kedi kumu alışverişi için haftanın her günü 09:00-21:00 saatleri arasında açığız. Toplu alımlarda avantajlı fiyatlardan yararlanabilirsiniz. Kedi kumu seçiminde en önemli faktörler şunlardır: topaklama özelliği, koku kontrolü, toz miktarı ve fiyat/performans oranı. Bentonit kedi kumu en yaygın tercih olup güçlü topaklama özelliğiyle temizliği kolaylaştırır. Tofu kedi kumu ise doğal içeriği ve düşük toz oranıyla öne çıkar. Çam peleti kumlar doğal koku etkisizleştirme özelliğiyle bilinir. Mağazamızda tüm bu seçenekleri uygun fiyatlarla bulabilirsiniz.\n\nEnuygunPet Gross Market olarak 5 lt'den 30 lt'ye kadar geniş gramaj seçenekleriyle kedi kumu sunuyoruz. Çok kedi sahibi olan müşterilerimize toplu alım indirimleri uyguluyoruz. Stok bilgisi ve fiyat için WhatsApp hattımıza yazabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `EnuygunPet Gross Market'te ${keyword} dahil tüm kedi kumu çeşitlerini bulabilirsiniz. Samsun Atakum'da haftanın her günü hizmetinizdeyiz.` },
      { q: `${keyword} ne kadar süre kullanılır?`, a: `Kedi sayısına ve kullanım sıklığına bağlı olarak genellikle 2-4 hafta arasında kullanılabilir. Düzenli temizlik koku kontrolünü kolaylaştırır.` },
      { q: `Karbonlu mu bentonit kedi kumu mu daha iyi?`, a: `Her ikisinin de avantajları vardır. Bentonit topaklanma özelliğiyle temizliği kolaylaştırır. Karbonlu kumlar koku emiciliğiyle öne çıkar. Mağazamızda her ikisini de deneyebilirsiniz.` },
      { q: `${keyword} fiyatı nedir?`, a: `Fiyat bilgisi için mağazamızı arayabilir veya WhatsApp'tan sorabilirsiniz. Gross market avantajıyla en uygun fiyatları sunuyoruz.` },
    ];
  } else if (isTasma) {
    article = `Samsun Atakum'da ${keyword} arayanlar için EnuygunPet Gross Market en geniş aksesuar koleksiyonunu sunmaktadır. Kedi ve köpek tasmaları, kolyeler, göğüs tasmaları ve daha pek çok aksesuar ürününü mağazamızda bulabilirsiniz.\n\n${keyword} seçiminde hayvanınızın boyu, kilosu ve karakteri belirleyici rol oynar. Uzman ekibimiz doğru ürünü seçmenize yardımcı olmaktan memnuniyet duyar.\n\nAtakum'da haftanın her günü 09:00-21:00 saatleri arasında hizmet veriyoruz. Tasma seçiminde en önemli faktörler şunlardır: hayvanınızın boyutu, malzeme kalitesi ve güvenlik özellikleri. Deri tasma estetik ve dayanıklı bir seçenek olurken naylon tasma hafifliği ve su geçirmezliğiyle öne çıkar. Metal zincirli tasma ise büyük ve güçlü köpekler için idealdir. Mağazamızda XS'den XL'e kadar tüm beden seçenekleri mevcuttur.\n\nEnuygunPet Gross Market'te köpek tasması, kedi tasması, göğüs tasması, uzatma ipi ve daha pek çok aksesuar ürünü bulunmaktadır. Stok durumu için WhatsApp'tan bize ulaşabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `EnuygunPet Gross Market'te ${keyword} ve benzeri tüm aksesuar ürünlerini bulabilirsiniz. Samsun Atakum'da her gün açığız.` },
      { q: `${keyword} nasıl seçilir?`, a: `Hayvanınızın boyut ve ağırlığına uygun tasma seçimi önemlidir. Çok sıkı veya çok gevşek tasma rahatsızlık yaratabilir. Uzman ekibimiz ölçüm konusunda yardımcı olabilir.` },
      { q: `${keyword} hangi malzemeden olmalı?`, a: `Naylon, deri ve metal seçenekler mevcuttur. Deri daha estetik görünürken naylon tasma daha dayanıklıdır. Tercihinize göre mağazamızda geniş seçenek sunuyoruz.` },
      { q: `${keyword} fiyatı ne kadar?`, a: `Güncel fiyat için mağazamızı ziyaret edebilir veya WhatsApp'tan bilgi alabilirsiniz.` },
    ];
  } else if (isKusYemi) {
    article = `Samsun Atakum'da ${keyword} arayanlar EnuygunPet Gross Market'te geniş bir seçenek yelpazesi bulacak. Muhabbet kuşu, kanarya, papağan ve diğer tüm kuş türleri için yem, aksesuar ve kafes çeşitlerimiz mevcuttur.\n\n${keyword} seçiminde kuşunuzun türü belirleyici faktördür. Her kuş türünün besin ihtiyacı farklıdır ve doğru beslenme sağlıklı bir yaşam için kritik önem taşır.\n\nSamsun Atakum'da haftanın her günü 09:00-21:00 saatleri arasında açığız. Muhabbet kuşları için karışık tohum yemi, yulaf, darı ve ek mineral takviyeleri önerilir. Papağanlar için özel granül mamalar ve taze meyve-sebze takviyeleri gereklidir. Kanarya yemi ise ince daneli tohumlar ve özel vitamin takviyelerinden oluşur. Mağazamızda tüm kuş türleri için özel formüle edilmiş yemler mevcuttur.\n\nEnuygunPet Gross Market'te kuş yemi dışında kafes, tünek, oyuncak, ıslık, mineral taşı ve vitamin takviyeleri de bulabilirsiniz. Kuşunuzun sağlıklı ve mutlu bir yaşam sürmesi için ihtiyaç duyduğu her şey mağazamızda.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede bulunur?`, a: `EnuygunPet Gross Market'te ${keyword} dahil geniş kuş ürünleri yelpazesi bulunmaktadır. Her gün hizmetinizdeyiz.` },
      { q: `${keyword} ne kadar süre dayanır?`, a: `Saklama koşullarına göre değişmektedir. Kuru ve serin ortamda muhafaza edildiğinde ürünlerin raf ömrü uzar. Ambalajdaki tarihe dikkat ediniz.` },
      { q: `Kuşlar için hangi ek besinler gereklidir?`, a: `Temel yeme ek olarak mineral taşı, kuş kumu ve vitamin takviyeleri önerilir. Mağazamızda tüm bu ürünleri bulabilirsiniz.` },
      { q: `${keyword} fiyatı nedir?`, a: `Güncel fiyat için mağazamıza gelebilir veya WhatsApp'tan sorabilirsiniz.` },
    ];
  } else if (isPetshop) {
    article = `Samsun Atakum'da aradığınız petshop EnuygunPet Gross Market'tir. Türkiye'nin önde gelen petshop markalarından bağımsız olarak kendi bünyemizde en geniş ürün yelpazesini en uygun fiyatlarla sunuyoruz.\n\n${keyword} aramasıyla bizi bulan siz değerli müşterilerimize kedi, köpek, kuş, balık ve diğer tüm evcil hayvan ürünlerini tek çatı altında sunma gururunu yaşıyoruz. Samsun Atakum'daki gross market formatımız sayesinde perakende fiyatların çok altında alışveriş yapabilirsiniz.\n\nHaftanın her günü 09:00-21:00 saatleri arasında Atatürk Bulvarı Atakum adresimizde sizi bekliyoruz. EnuygunPet Gross Market olarak binlerce ürün çeşidiyle Samsun'un en kapsamlı evcil hayvan mağazasıyız. Kedi maması, köpek maması, kuş yemi, kedi kumu, tasma, oyuncak, yatak, kafes, akvaryum malzemeleri ve daha pek çok ürün kategorisinde geniş stok sunuyoruz. Gross market formatımız sayesinde perakende fiyatların çok altında kaliteli ürünlere ulaşabilirsiniz.\n\nMağazamızda uzman personelimiz evcil hayvanınızın her türlü ihtiyacı için size yardımcı olmaya hazırdır. WhatsApp hattımızdan 7/24 ürün sorgusu yapabilirsiniz. Google Harita üzerinden kolayca bize ulaşabilirsiniz.`;
    faqs = [
      { q: `Samsun Atakum'da en iyi petshop hangisi?`, a: `EnuygunPet Gross Market, Samsun Atakum'un en geniş ürün yelpazesine sahip petshopudur. Binlerce evcil hayvan ürünü tek adreste.` },
      { q: `Atakum petshop çalışma saatleri nedir?`, a: `EnuygunPet Gross Market haftanın her günü 09:00-21:00 saatleri arasında açıktır.` },
      { q: `Atakum'da ucuz petshop var mı?`, a: `EnuygunPet Gross Market olarak gross market avantajımızla tüm Samsun'un en uygun fiyatlarını sunuyoruz. Perakende fiyatların çok altında alışveriş yapabilirsiniz.` },
      { q: `Samsun petshop adresi nedir?`, a: `Atatürk Bulvarı, Atakum / Samsun adresindeyiz. Google Harita'dan kolayca yol tarifi alabilirsiniz.` },
    ];
  } else if (isMarka) {
    article = `Samsun Atakum'da ${keyword} ürününü EnuygunPet Gross Market'te bulabilirsiniz. Türkiye'nin önde gelen petshop markalarının orijinal ve garantili ürünlerini mağazamızda stokta tutuyoruz.\n\n${keyword} gibi premium marka ürünler, evcil hayvanınızın sağlıklı beslenmesi ve uzun ömürlü bir yaşam sürmesi için en doğru seçimdir. Mağazamızda geniş beden ve gramaj seçenekleriyle bu ürünleri bulabilirsiniz.\n\nSamsun Atakum'da haftanın her günü 09:00-21:00 açığız. WhatsApp üzerinden stok sorgusu yapabilirsiniz. Premium markalar veteriner hekimler tarafından önerilen özel formüllere sahiptir. Bu markalar yüksek kaliteli hammaddeler, bilimsel formülasyon ve uzun süreli araştırmalar sonucu ortaya çıkmıştır. Evcil hayvanınızın sağlığına yapılan en iyi yatırım kaliteli beslenmedir. Mağazamızda bu markaların tüm ürün gamlarını tek adreste bulabilirsiniz. Fiyat ve stok bilgisi için WhatsApp veya telefon ile bize ulaşabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `EnuygunPet Gross Market'te ${keyword} ürününü orijinal ve garantili olarak bulabilirsiniz. Samsun Atakum'da her gün hizmetinizdeyiz.` },
      { q: `${keyword} sahte mi orijinal mi anlaşılır?`, a: `EnuygunPet olarak sadece yetkili distribütörlerden temin edilen orijinal ürünler satıyoruz. Her üründe barkod ve orijinallik kodu mevcuttur.` },
      { q: `${keyword} fiyatları ne kadar?`, a: `Gross market avantajımızla en uygun fiyatları sunuyoruz. Güncel fiyat için mağazamızı arayabilir veya WhatsApp'tan sorabilirsiniz.` },
      { q: `${keyword} tüm seçenekleri var mı?`, a: `Mağazamızda geniş gramaj ve çeşit seçeneği bulunmaktadır. Stok bilgisi için WhatsApp veya telefon ile bize ulaşabilirsiniz.` },
    ];
  } else if (isOyuncak) {
    article = `Samsun Atakum'da ${keyword} arayanlar için EnuygunPet Gross Market geniş oyuncak koleksiyonu sunmaktadır. Kedi ve köpekler için interaktif, tüy oyuncaklar, top ve tünel gibi pek çok seçenek mevcuttur.\n\n${keyword} evcil hayvanınızın zihinsel ve fiziksel gelişimine katkı sağlar. Özellikle iç mekânda yaşayan hayvanlar için oyun aktiviteleri stres giderici ve sağlık koruyucudur.\n\nHaftanın her günü 09:00-21:00 saatleri arasında Atakum'da hizmetinizdeyiz. Kedi oyuncakları arasında tüylü sopalar, lazer ışıklar, tünel oyuncaklar ve zıplayan toplar en çok tercih edilenler arasındadır. Köpek oyuncakları ise diş sağlığını destekleyen kemik oyuncaklar, sesli oyuncaklar ve fetch topları olarak öne çıkar. Mağazamızda her bütçeye uygun geniş oyuncak yelpazesi mevcuttur. Evcil hayvanınızı mutlu etmek için doğru oyuncağı mağazamızda bulabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede satılır?`, a: `EnuygunPet Gross Market'te geniş evcil hayvan oyuncak yelpazesi bulunmaktadır. Samsun Atakum'da her gün açığız.` },
      { q: `${keyword} ne sıklıkla değiştirilmeli?`, a: `Oyuncaklar yıprandığında veya hasar gördüğünde değiştirilmelidir. Hasarlı oyuncaklar hayvan güvenliğini tehdit edebilir.` },
      { q: `Hangi oyuncak türü daha uzun ömürlüdür?`, a: `Kauçuk ve dayanıklı plastik malzemeden üretilen oyuncaklar daha uzun ömürlüdür. Mağazamızda farklı dayanıklılık seviyelerinde seçenekler sunuyoruz.` },
      { q: `${keyword} fiyatı nedir?`, a: `Ürün fiyatları için mağazamızı arayabilir veya WhatsApp'tan bilgi alabilirsiniz.` },
    ];
  } else {
    article = `Samsun Atakum'da ${keyword} arıyorsanız EnuygunPet Gross Market doğru adresinizdir. Samsun'un en büyük petshop gross marketi olarak binlerce evcil hayvan ürününü tek çatı altında sunuyoruz.\n\n${keyword} başta olmak üzere kedi, köpek, kuş, balık ve tüm evcil hayvan ihtiyaçlarınız için mağazamızı ziyaret edebilirsiniz. Gross market formatımız sayesinde perakende fiyatların çok altında kaliteli ürünlere ulaşabilirsiniz.\n\nHaftanın her günü 09:00-21:00 saatleri arasında Samsun Atakum adresimizde sizlere hizmet vermekten mutluluk duyuyoruz. Uzman ekibimiz evcil hayvanınızın ihtiyaçları konusunda ücretsiz danışmanlık sunar. Mağazamızda kedi maması, köpek maması, kuş yemi, kedi kumu, tasma, oyuncak, yatak, kafes, akvaryum malzemeleri ve daha pek çok ürün kategorisinde binlerce çeşit ürün bulunmaktadır. Gross market avantajımız sayesinde en büyük markaların ürünlerini en uygun fiyatlarla sunabiliyoruz. WhatsApp hattımızdan ürün sorgusu yapabilir, stok bilgisi alabilir ve sipariş oluşturabilirsiniz.`;
    faqs = [
      { q: `Samsun'da ${keyword} nerede bulunur?`, a: `EnuygunPet Gross Market'te ${keyword} ve benzeri ürünleri Samsun Atakum'da bulabilirsiniz. Haftanın her günü 09:00-21:00 açığız.` },
      { q: `${keyword} için hangi petshop güvenilir?`, a: `EnuygunPet Gross Market olarak müşteri memnuniyetini ön planda tutuyoruz. Orijinal ürün garantisi ve uygun fiyat avantajıyla Atakum'un en güvenilir petshopuyuz.` },
      { q: `${keyword} fiyatı ne kadar?`, a: `En güncel fiyat bilgisi için mağazamızı arayabilir veya WhatsApp'tan bilgi talep edebilirsiniz. Gross market fiyatlarıyla her zaman avantajlı alışveriş yapabilirsiniz.` },
      { q: `Atakum petshop çalışma saatleri nedir?`, a: `EnuygunPet Gross Market haftanın her günü 09:00-21:00 saatleri arasında açıktır. Resmi tatillerde de hizmet veriyoruz.` },
    ];
  }

  return { article, faqs };
}

const COMMON_SECTION = `<section>
<h2>EnuygunPet Gross Market Hakkında</h2>
<p>EnuygunPet, Samsun Atakum'da Atatürk Bulvarı No:113 adresinde faaliyet gösteren Samsun'un en büyük petshop gross marketidir. Mağazamızda kedi maması, köpek maması, kuş yemi, kedi kumu, tasma, oyuncak, yatak, kafes, akvaryum malzemeleri ve daha pek çok kategoriyi kapsayan on binlerce ürün çeşidi bulunmaktadır.</p>
<p>Gross market formatımız sayesinde müşterilerimize perakende mağazaların çok altında fiyatlar sunabiliyoruz. Özellikle büyük gramaj ve toplu alımlarda fiyat avantajımız belirgin biçimde hissedilmektedir. Royal Canin, Hills Science Plan, Pro Plan, Brit Care, Reflex, Enjoy, Acana, Orijen, Pedigree, Whiskas, Felix gibi dünyanın önde gelen markalarının tüm ürün gamlarını stokta bulunduruyoruz.</p>
<h2>Ürün Kategorileri</h2>
<p>Mağazamızda beş ana kategoride ürün sunmaktayız: Kedi ürünleri (mama, kum, oyuncak, tırmalama tahtası, taşıma çantası), Köpek ürünleri (mama, tasma, koşum, oyuncak, yatak, bakım ürünleri), Kuş ürünleri (yem, kafes, tünek, mineral taşı, vitamin), Balık ve akvaryum ürünleri (yem, filtre, ışık, süsleme), Küçük hayvan ürünleri (hamster, tavşan, guinea pig yemi ve kafesleri). Her kategoride geniş marka ve gramaj seçenekleri mevcuttur.</p>
<h2>Neden EnuygunPet?</h2>
<p>Samsun'da petshop arayışındaki evcil hayvan sahipleri EnuygunPet'i şu nedenlerle tercih etmektedir: Birincisi, gross market fiyat avantajı — perakende fiyatların yüzde otuz ila elli altında fiyatlar sunuyoruz. İkincisi, geniş stok — binlerce ürün çeşidi her zaman raflarımızda mevcuttur, stoksuz kalmak nadiren yaşanır. Üçüncüsü, uzman danışmanlık — mağazamızdaki personelimiz evcil hayvan beslenme ve bakımı konusunda deneyimlidir, size en doğru ürünü önerir. Dördüncüsü, kolay erişim — Atatürk Bulvarı üzerinde konumlanan mağazamıza ulaşmak oldukça kolaydır ve geniş otopark imkânı sunmaktadır.</p>
<h2>Online Sipariş ve Teslimat</h2>
<p>Mağazamıza gelmeden de sipariş verebilirsiniz. WhatsApp hattımız (+90 542 211 49 44) üzerinden ürün fotoğrafı ve fiyat listesi isteyebilir, sipariş oluşturabilirsiniz. Samsun içi teslimat seçeneğimizle ürünleri kapınıza kadar getiriyoruz. Büyük gramaj veya ağır ürünlerde özellikle bu hizmet tercih edilmektedir. Instagram sayfamız (@enuygun.pet) üzerinden ürün kataloğumuzu inceleyebilir, yeni gelen ürünleri takip edebilirsiniz.</p>
<h2>İletişim ve Konum</h2>
<p>Mağazamıza ulaşmak için Google Harita üzerinden "EnuygunPet" araması yapabilir veya doğrudan yol tarifi alabilirsiniz. Adresimiz: Atatürk Bulvarı No:113, Atakum / Samsun. WhatsApp hattımız (+90 542 211 49 44) üzerinden ürün stok sorgusu, fiyat bilgisi ve genel sorularınız için bize ulaşabilirsiniz. Haftanın her günü saat 09:00 ile 21:00 saatleri arasında sizlere hizmet veriyoruz; resmi tatillerde de mağazamız açıktır. Samsun Atakum'da güvenilir, uygun fiyatlı ve geniş stoklu bir evcil hayvan mağazası arıyorsanız EnuygunPet Gross Market'e bekliyoruz.</p>
</section>
<nav aria-label="Site içi bağlantılar">
<h2>Ürün Kategorileri</h2>
<ul>
<li><a href="/kedi-urunleri">Kedi Ürünleri — Mama, Kum, Oyuncak, Bakım</a></li>
<li><a href="/kopek-urunleri">Köpek Ürünleri — Mama, Tasma, Oyuncak, Yatak</a></li>
<li><a href="/kus-urunleri">Kuş Ürünleri — Yem, Kafes, Tünek, Vitamin</a></li>
<li><a href="/balik-urunleri">Balık ve Akvaryum Ürünleri — Yem, Filtre, Süsleme</a></li>
<li><a href="/kucuk-hayvan-urunleri">Küçük Hayvan Ürünleri — Hamster, Tavşan, Guinea Pig</a></li>
<li><a href="/surungen-urunleri">Sürüngen ve Egzotik Hayvan Ürünleri</a></li>
</ul>
<h2>Popüler Aramalar</h2>
<ul>
<li><a href="/kedi-mamasi-samsun">Kedi Maması Samsun — Gross Market Fiyatı</a></li>
<li><a href="/kopek-mamasi-samsun">Köpek Maması Samsun — Uygun Fiyat</a></li>
<li><a href="/kedi-kumu-samsun">Kedi Kumu Samsun — Toplu Alım İndirimi</a></li>
<li><a href="/kedi-mamasi-atakum">Kedi Maması Atakum — EnuygunPet</a></li>
<li><a href="/kopek-mamasi-atakum">Köpek Maması Atakum — EnuygunPet</a></li>
<li><a href="/royal-canin-samsun">Royal Canin Samsun — Orijinal Ürün Garantisi</a></li>
<li><a href="/hills-science-plan-samsun">Hills Science Plan Samsun — Veteriner Önerisi</a></li>
<li><a href="/pro-plan-samsun">Pro Plan Samsun — Geniş Stok</a></li>
<li><a href="/petshop-atakum">Petshop Atakum — Haftanın 7 Günü Açık</a></li>
<li><a href="/petshop-samsun">Petshop Samsun — Gross Market Fiyatları</a></li>
</ul>
<h2>İlçe ve Semte Göre Petshop</h2>
<ul>
<li><a href="/local/atakum-petshop">Atakum Petshop — EnuygunPet Gross Market</a></li>
<li><a href="/local/ilkadim-petshop">İlkadım Petshop — Samsun Merkez</a></li>
<li><a href="/local/canik-petshop">Canik Petshop — Uygun Fiyat</a></li>
<li><a href="/local/tekkeköy-petshop">Tekkeköy Petshop</a></li>
<li><a href="/local/bafra-petshop">Bafra Petshop</a></li>
<li><a href="/local/terme-petshop">Terme Petshop</a></li>
</ul>
<h2>Evcil Hayvan Sağlık ve Bakım Rehberi</h2>
<ul>
<li><a href="/blog">Tüm Blog Yazıları — Evcil Hayvan Bakım Rehberi</a></li>
<li><a href="/blog/kisir-kedi-mamasi-hangisi">Kısır Kedi Maması Hangisi Seçilmeli?</a></li>
<li><a href="/blog/yavru-kopek-mamasi-secimi">Yavru Köpek Maması Seçimi Rehberi</a></li>
<li><a href="/blog/kedi-kumu-turleri">Kedi Kumu Türleri — Topaklanan mı, Silika mı?</a></li>
<li><a href="/saglik/kedi">Kedi Sağlığı ve Beslenme Rehberi</a></li>
<li><a href="/saglik/kopek">Köpek Sağlığı ve Beslenme Rehberi</a></li>
<li><a href="/saglik/kus">Kuş Sağlığı ve Beslenme Rehberi</a></li>
<li><a href="/saglik/balik">Balık ve Akvaryum Bakım Rehberi</a></li>
</ul>
<h2>Ana Sayfa</h2>
<ul>
<li><a href="/">EnuygunPet Gross Market — Ana Sayfa</a></li>
</ul>
</nav>`;

// ── Store image URLs ────────────────────────────────────────────────────────────
const STORE_IMAGES = {
  general: "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg",
  reyonlar: "https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg",
  kedi: "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
  kopek: "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
  kus: "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
};

function pickImage(keyword: string): { url: string; alt: string } {
  const k = keyword.toLowerCase();
  if (k.includes("kuş") || k.includes("kus") || k.includes("papağan") || k.includes("kanarya") || k.includes("muhabbet"))
    return { url: STORE_IMAGES.kus, alt: `${keyword} — EnuygunPet Gross Market Samsun Atakum kuş ürünleri` };
  if (k.includes("köpek") || k.includes("kopek"))
    return { url: STORE_IMAGES.kopek, alt: `${keyword} — EnuygunPet Gross Market Samsun Atakum köpek maması` };
  if (k.includes("kedi"))
    return { url: STORE_IMAGES.kedi, alt: `${keyword} — EnuygunPet Gross Market Samsun Atakum kedi maması` };
  return { url: STORE_IMAGES.general, alt: `${keyword} — EnuygunPet Gross Market Samsun Atakum petshop` };
}

// ── Build body HTML from raw sections (blog/local pages) ───────────────────────
function buildSectionsHtml(h1: string, intro: string, sections: Array<{ h: string; p: string }>): string {
  const introHtml = intro ? `<p>${escapeHtml(intro)}</p>` : "";
  const sectHtml = sections.map(s =>
    `<section><h2>${escapeHtml(s.h)}</h2><p>${escapeHtml(s.p)}</p></section>`
  ).join("");
  const img = pickImage(h1);
  const imgHtml = `<img src="${img.url}" alt="${escapeHtml(img.alt)}" title="${escapeHtml(img.alt)}" width="800" height="450" loading="eager">`;
  return `<h1>${escapeHtml(h1)}</h1><article>${imgHtml}${introHtml}${sectHtml}${COMMON_SECTION}<address>EnuygunPet Gross Market — Atatürk Bulvarı No:113, Atakum / Samsun — Tel: +90 542 211 49 44 — Haftanın her günü 09:00-21:00</address></article>`;
}

// ── Build visible SEO body HTML (injected outside #root so React never replaces it) ──
function buildBodyHtml(h1: string, article: string, faqs: Array<{ q: string; a: string }>): string {
  const paragraphs = article.split("\n\n").map(p => `<p>${escapeHtml(p)}</p>`).join("");
  const faqHtml = faqs.map(f =>
    `<div itemscope itemtype="https://schema.org/Question"><h3 itemprop="name">${escapeHtml(f.q)}</h3><div itemscope itemtype="https://schema.org/Answer" itemprop="acceptedAnswer"><p itemprop="text">${escapeHtml(f.a)}</p></div></div>`
  ).join("");
  const img = pickImage(h1);
  const imgHtml = `<img src="${img.url}" alt="${escapeHtml(img.alt)}" title="${escapeHtml(img.alt)}" width="800" height="450" loading="eager">`;
  return `<h1>${escapeHtml(h1)}</h1><article>${imgHtml}${paragraphs}<section><h2>Sık Sorulan Sorular</h2>${faqHtml}</section>${COMMON_SECTION}<address>EnuygunPet Gross Market — Atatürk Bulvarı No:113, Atakum / Samsun — Tel: +90 542 211 49 44 — Haftanın her günü 09:00-21:00</address></article>`;
}

// ── Public API ─────────────────────────────────────────────────────────────────
export function getPageMeta(urlPath: string): PageMeta {
  const path = urlPath.replace(/\?.*$/, "").replace(/\/+$/, "") || "/";

  if (path === "/" || path === "") {
    return {
      title: "EnuygunPet - Samsun Atakum Petshop Gross Market | Kedi Köpek Maması",
      h1: "EnuygunPet Gross Market — Samsun Atakum Petshop",
      description:
        "Samsun Atakum'da kedi, köpek, kuş ve tüm evcil hayvan ürünleri. Royal Canin, Hills, Pro Plan en uygun fiyatla. WhatsApp: +90 542 211 49 44",
      bodyHtml: buildSectionsHtml("EnuygunPet Gross Market — Samsun Atakum Petshop",
        "Samsun Atakum'ın en büyük petshop gross marketi EnuygunPet'e hoş geldiniz. Kedi, köpek, kuş, balık ve tüm evcil hayvanlarınız için on binlerce ürün çeşidi gross market fiyatıyla tek çatı altında.",
        [
          { h: "Samsun Atakum'un En Büyük Petshop Gross Marketi", p: "EnuygunPet, Samsun'un Atakum ilçesinde Atatürk Bulvarı No:113 adresinde hizmet veren petshop gross marketidir. Gross market formatıyla faaliyet gösteren mağazamız, perakende petshopların çok altında fiyatlarla kedi maması, köpek maması, kuş yemi ve tüm evcil hayvan ürünlerini müşterilerimize sunmaktadır. Büyük gramajlı ürünleri toplu temin ettiğimiz için birim maliyetlerimiz düşük tutulabilmektedir; bu avantajı doğrudan müşterilerimize yansıtıyoruz. Haftanın her günü 09:00-21:00 arası kesintisiz açığız, Pazar ve resmi tatillerde de kapılarımızı kapatmıyoruz." },
          { h: "Kedi Sahiplerine Özel Geniş Ürün Seçeneği", p: "Kedi maması seçimi; yaş, kısırlaştırma durumu ve sağlık geçmişine göre farklılık göstermektedir. Mağazamızda Royal Canin, Hills Science Plan, Pro Plan, Brit Care, Reflex, Acana, Orijen, Felicia ve N&D başta olmak üzere 20'yi aşkın markanın kedi mamasını bulabilirsiniz. Yavru kedi, yetişkin kedi, kısırlaştırılmış kedi ve özel diyet mamaları ayrı ayrı stoklanmaktadır. Kedi kumu konusunda ise topaklanan bentonit kum, silika kristal kum, doğal odun talaşı ve tozsuz pelet seçenekleri mevcuttur. Bunların yanı sıra kedi tırmalama tahtaları, yataklar, taşıma çantaları ve oyuncaklar da raflarımızda hazır bulunmaktadır." },
          { h: "Köpek Sahipleri İçin Her Şey Tek Çatı Altında", p: "Köpek maması seçiminde ırkın büyüklüğü, yaşı ve aktivite düzeyi belirleyici rol oynar. Mağazamızda Royal Canin Breed Specific serisi, Pro Plan Performance, Hills Science Plan, Brit Care Grain Free, Acana ve Orijen gibi premium markaların yanı sıra uygun bütçeli seçenekler de yer almaktadır. Küçük ırk, orta ırk ve büyük ırk mamaları ayrı olarak stoklanmaktadır. Tasma, koşum, gezdirme ipi, oyuncak, yatak, şampuan ve diş bakım ürünleri gibi köpek aksesuarlarına da tek adresten ulaşabilirsiniz. Özellikle büyük gramajlı köpek mamalarında gross market fiyat avantajımız belirgin biçimde hissedilmektedir." },
          { h: "Kuş, Akvaryum ve Küçük Hayvan Ürünleri", p: "Muhabbet kuşu, kanarya, sultan papağanı ve Afrika gri papağanı gibi farklı kuş türleri için özel formüle edilmiş yemler, kafesler, tünekler, mineral taşları ve vitamin takviyeleri sunmaktayız. Akvaryum tutkunları için tatlı su ve tuzlu su balıkları yemleri, filtre sistemleri, hava motorları ve dekor ürünleri geniş seçeneklerle mevcuttur. Hamster, tavşan, guinea pig ve diğer küçük hayvanlar için mama, altlık malzemeleri ve kafesler de mağazamızda bulunmaktadır." },
          { h: "Gross Market Fiyat Avantajı Nasıl İşliyor?", p: "Gross market modeli, ürünleri büyük miktarda temin ederek birim maliyetleri düşüren bir ticaret biçimidir. Perakende petshoplar küçük miktarlarda stok tutarken biz aynı ürünü palet ve koli olarak satın alırız; bu da birim fiyatı önemli ölçüde aşağı çeker. Mağazamızda perakende fiyatlara kıyasla yüzde otuz ila elli arasında tasarruf etmek mümkündür. Özellikle büyük gramaj tercihi yapan çok kedili ya da köpekli haneler, yılda yüzlerce lira tasarruf sağlamaktadır. Toplu alım yapan müşterilerimize ek indirim uygulaması da mevcuttur." },
          { h: "Uzman Danışmanlık ve Kişisel Hizmet", p: "Hangi mamayı seçeceğinizi bilmiyorsanız, kedi kumunun farkları konusunda kafanız karışıksa ya da köpeğiniz için ideal gramaj ve beden arıyorsanız mağazamızdaki deneyimli personelimiz size ücretsiz danışmanlık sunar. Veteriner tavsiyeleriyle örtüşen, kanıtlanmış ürün önerileri yapıyoruz. WhatsApp hattımız aracılığıyla yazılı danışma da yapabilirsiniz; ürün fotoğrafı göndererek stok ve fiyat sorabilirsiniz." },
          { h: "Samsun'un Her Noktasından Bize Ulaşın", p: "Mağazamız Samsun Atakum'da Atatürk Bulvarı üzerinde konumlanan tek katlı bir gross market yapısındadır. Önünde ücretsiz otopark imkânı bulunmaktadır. Minibüs ve dolmuş güzergahlarıyla ulaşımı kolaydır. İlkadım, Canik, Tekkeköy ve Samsun merkezden 15-30 dakika içinde ulaşılabilecek mesafededir. Google Harita üzerinden EnuygunPet aratarak doğrudan yol tarifi alabilirsiniz. Samsun içi WhatsApp üzerinden sipariş verip kapınıza teslim seçeneğimizden de yararlanabilirsiniz." },
        ]
      ),
    };
  }

  if (path === "/blog") {
    return {
      title: "Evcil Hayvan Bakım Rehberi — Blog | EnuygunPet Samsun",
      h1: "Evcil Hayvan Bakım Rehberi",
      description:
        "Kedi, köpek, kuş ve balık bakımı hakkında uzman rehberleri. Mama seçimi, sağlık, beslenme ipuçları.",
      bodyHtml: buildSectionsHtml("Evcil Hayvan Bakım Rehberi",
        "Kedi, köpek, kuş ve balık bakımı hakkında uzman rehberleri. Mama seçimi, sağlık, beslenme ve bakım ipuçları EnuygunPet bloğunda.",
        [
          { h: "Kedi Bakımı Rehberleri", p: "Kısırlaştırılmış kedi maması seçimi, kedi tüy bakımı, kedi diş sağlığı ve daha fazlası. Kediler için en doğru mama tercihini nasıl yaparsınız? Hangi marka ve gramaj ideal? Royal Canin Sterilised ile diğer markaları karşılaştıran rehberlerimiz de dahil tüm yanıtlar blog yazılarımızda." },
          { h: "Köpek Beslenme ve Sağlığı", p: "Irka özel mama seçimi, yavru köpek beslenmesi, yaşlı köpek diyeti, obez köpek beslenme planı ve köpek egzersiz önerileri. Pro Plan, Royal Canin ve Brit Care köpek mamalarını karşılaştıran kapsamlı rehberlerimizle doğru kararı kolayca verin." },
          { h: "Kuş ve Balık Bakımı", p: "Muhabbet kuşu bakımı, papağan beslenmesi, Afrika gri papağanı için en iyi yem seçenekleri, akvaryum kurulumu ve balık sağlığı hakkında pratik bilgiler. EnuygunPet'in kuş ve balık kategorisindeki geniş ürün yelpazesiyle tüm hayvancılık ihtiyaçlarınıza destek oluyoruz." },
        ]
      ),
    };
  }

  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const b = blogMap.get(slug);
    if (b) {
      return {
        title: `${b.title} | ${BRAND}`,
        h1: b.title,
        description: b.desc,
        bodyHtml: buildSectionsHtml(b.title, b.desc, b.sections),
      };
    }
  }

  const localMatch = path.match(/^\/local\/(.+)$/);
  if (localMatch) {
    const slug = localMatch[1];
    const l = localMap.get(slug);
    if (l) {
      return {
        title: `${l.h1} | Petshop Samsun`,
        h1: l.h1,
        description: l.desc,
        bodyHtml: buildSectionsHtml(l.h1, l.intro || l.desc, l.sections || []),
      };
    }
  }

  const bare = path.replace(/^\//, "");

  if (CATEGORY_SLUGS.has(bare)) {
    const c = categoryMap.get(bare);
    if (c) {
      const { article, faqs } = generateContent(c.h1);
      return {
        title: `${c.h1} | EnuygunPet Gross Market`,
        h1: c.h1,
        description: c.desc,
        bodyHtml: buildBodyHtml(c.h1, article, faqs),
      };
    }
  }

  // ── Explicit meta for category pages not in CATEGORY_SLUGS ─────────────────
  const extraCategoryMeta: Record<string, { title: string; h1: string; description: string }> = {
    "balik-urunleri": {
      title: "Balık ve Akvaryum Ürünleri Samsun | EnuygunPet Gross Market",
      h1: "Balık ve Akvaryum Ürünleri — Samsun Atakum",
      description: "Balık yemi, akvaryum filtresi, aydınlatma ve süsleme ürünleri Samsun Atakum'da. EnuygunPet Gross Market'te gross market fiyatıyla geniş balık ürünleri.",
    },
    "kucuk-hayvan-urunleri": {
      title: "Küçük Hayvan Ürünleri Samsun | Hamster Tavşan | EnuygunPet",
      h1: "Küçük Hayvan Ürünleri — Samsun Atakum",
      description: "Hamster, tavşan ve guinea pig yemi, kafes ve aksesuarları Samsun Atakum'da. EnuygunPet Gross Market'te uygun fiyatlı küçük hayvan ürünleri.",
    },
    "surungen-urunleri": {
      title: "Sürüngen ve Egzotik Hayvan Ürünleri Samsun | EnuygunPet",
      h1: "Sürüngen ve Egzotik Hayvan Ürünleri — Samsun Atakum",
      description: "Kaplumbağa, kertenkele ve egzotik hayvan yemi, teraryum ve aksesuar Samsun Atakum'da. EnuygunPet Gross Market'te uzman danışmanlık ve geniş stok.",
    },
    "kedi-urunleri": {
      title: "Kedi Ürünleri Samsun Atakum | Mama, Kum, Oyuncak | EnuygunPet",
      h1: "Kedi Ürünleri — Samsun Atakum",
      description: "Kedi maması, kedi kumu, oyuncak ve tırmalama tahtası Samsun Atakum'da gross market fiyatıyla. Royal Canin, Hills, Pro Plan ve daha fazlası EnuygunPet'te.",
    },
    "kopek-urunleri": {
      title: "Köpek Ürünleri Samsun Atakum | Mama, Tasma, Oyuncak | EnuygunPet",
      h1: "Köpek Ürünleri — Samsun Atakum",
      description: "Köpek maması, tasma, koşum, oyuncak ve yatak Samsun Atakum'da gross market fiyatıyla. Royal Canin, Pro Plan, Brit Care ve daha fazlası EnuygunPet'te.",
    },
    "kus-urunleri": {
      title: "Kuş Ürünleri Samsun Atakum | Yem, Kafes, Vitamin | EnuygunPet",
      h1: "Kuş Ürünleri — Samsun Atakum",
      description: "Muhabbet kuşu, papağan, kanarya yemi, kafes ve vitamin takviyeleri Samsun Atakum'da. EnuygunPet Gross Market'te geniş kuş ürünleri yelpazesi.",
    },
    "kedi-mamasi-atakum": {
      title: "Kedi Maması Atakum | Royal Canin, Hills, Pro Plan | EnuygunPet",
      h1: "Kedi Maması Atakum — EnuygunPet Gross Market",
      description: "Atakum'da kedi maması için EnuygunPet Gross Market. Royal Canin, Hills, Pro Plan, Reflex gross market fiyatıyla. Yavru, kısır ve yetişkin kedi maması stokta.",
    },
    "kopek-mamasi-atakum": {
      title: "Köpek Maması Atakum | Royal Canin, Pro Plan | EnuygunPet",
      h1: "Köpek Maması Atakum — EnuygunPet Gross Market",
      description: "Atakum'da köpek maması için EnuygunPet Gross Market. Royal Canin, Pro Plan, Brit Care gross market fiyatıyla. Irka özel, yavru ve yetişkin köpek maması stokta.",
    },
    "hills-science-plan-samsun": {
      title: "Hills Science Plan Samsun | Veteriner Önerisi | EnuygunPet",
      h1: "Hills Science Plan Samsun — EnuygunPet Gross Market",
      description: "Samsun Atakum'da Hills Science Plan kedi ve köpek mamaları gross market fiyatıyla. Veteriner önerileri, tıbbi diyetler dahil tüm Hills ürünleri EnuygunPet'te.",
    },
  };

  if (extraCategoryMeta[bare]) {
    const ec = extraCategoryMeta[bare];
    const { article, faqs } = generateContent(ec.h1);
    return {
      ...ec,
      bodyHtml: buildBodyHtml(ec.h1, article, faqs),
    };
  }

  // ── Explicit meta for health category pages (/saglik/kedi etc.) ─────────────
  const healthCategoryMeta: Record<string, { title: string; h1: string; description: string }> = {
    "saglik/kedi": {
      title: "Kedi Sağlığı ve Beslenme Rehberi | EnuygunPet Samsun Atakum",
      h1: "Kedi Sağlığı ve Beslenme Rehberi",
      description: "Kedi beslenmesi, kısırlaştırma sonrası diyet, tüy bakımı ve sağlık önerileri. Samsun Atakum'da uzman danışmanlık için EnuygunPet Gross Market'i ziyaret edin.",
    },
    "saglik/kopek": {
      title: "Köpek Sağlığı ve Beslenme Rehberi | EnuygunPet Samsun Atakum",
      h1: "Köpek Sağlığı ve Beslenme Rehberi",
      description: "Köpek beslenmesi, irka özel diyet, yavru köpek büyütme ve egzersiz önerileri. Samsun Atakum'da uzman danışmanlık için EnuygunPet Gross Market'i ziyaret edin.",
    },
    "saglik/kus": {
      title: "Kuş Sağlığı ve Beslenme Rehberi | EnuygunPet Samsun Atakum",
      h1: "Kuş Sağlığı ve Beslenme Rehberi",
      description: "Muhabbet kuşu, papağan ve kanarya bakımı, beslenme ve sağlık önerileri. Samsun Atakum'da geniş kuş ürünleri yelpazesi için EnuygunPet Gross Market.",
    },
    "saglik/balik": {
      title: "Balık ve Akvaryum Bakım Rehberi | EnuygunPet Samsun Atakum",
      h1: "Balık ve Akvaryum Bakım Rehberi",
      description: "Akvaryum kurulumu, su kalitesi, balık beslenmesi ve sağlık önerileri. Samsun Atakum'da tüm akvaryum ürünleri için EnuygunPet Gross Market.",
    },
  };

  if (healthCategoryMeta[bare]) {
    const hc = healthCategoryMeta[bare];
    const { article, faqs } = generateContent(hc.h1);
    return {
      ...hc,
      bodyHtml: buildBodyHtml(hc.h1, article, faqs),
    };
  }

  const health = healthMap.get(bare);
  if (health) {
    const kw = cleanKeyword(health.keyword);
    const kwTitle = toTitleCase(kw);
    const h1 = `${kwTitle} — Samsun Atakum`;
    const { article, faqs } = generateContent(kw);
    return {
      title: `${kwTitle} — Samsun Atakum | ${BRAND}`,
      h1,
      description: buildKeywordDesc(kw),
      bodyHtml: buildBodyHtml(h1, article, faqs),
    };
  }

  const keyword = keywordMap.get(bare);
  if (keyword) {
    const kw = cleanKeyword(keyword);
    const kwTitle = toTitleCase(kw);
    const h1 = `${kwTitle} — Samsun Atakum`;
    const { article, faqs } = generateContent(kw);
    return {
      title: `${kwTitle} — Samsun Atakum | EnuygunPet`,
      h1,
      description: buildKeywordDesc(kw),
      bodyHtml: buildBodyHtml(h1, article, faqs),
    };
  }

  return {
    title: "EnuygunPet - Samsun Atakum Petshop Gross Market | Kedi Köpek Maması",
    h1: "EnuygunPet Gross Market — Samsun Atakum Petshop",
    description:
      "Samsun Atakum'da kedi, köpek, kuş ve tüm evcil hayvan ürünleri. Royal Canin, Hills, Pro Plan en uygun fiyatla.",
  };
}

export function injectMeta(html: string, meta: PageMeta): string {
  let result = html;

  result = result.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`,
  );

  if (result.includes('<meta name="description"')) {
    result = result.replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escapeHtml(meta.description)}">`,
    );
  } else {
    result = result.replace(
      "</head>",
      `<meta name="description" content="${escapeHtml(meta.description)}">\n</head>`,
    );
  }

  // Inject SEO content before #root — React does NOT touch elements outside its root,
  // so this persists in DOM. A tiny inline script hides it once JS runs.
  const fallbackImg = pickImage(meta.h1);
  const fallbackImgHtml = `<img src="${fallbackImg.url}" alt="${escapeHtml(fallbackImg.alt)}" title="${escapeHtml(fallbackImg.alt)}" width="800" height="450" loading="eager">`;
  const seoContent = meta.bodyHtml
    ? meta.bodyHtml
    : `<h1>${escapeHtml(meta.h1)}</h1><article>${fallbackImgHtml}<p>${escapeHtml(meta.description)}</p>${COMMON_SECTION}<address>EnuygunPet Gross Market — Atatürk Bulvarı No:113, Atakum / Samsun — Tel: +90 542 211 49 44 — Haftanın her günü 09:00-21:00</address></article>`;

  result = result.replace(
    '<div id="root"></div>',
    `<div id="seo-pre">${seoContent}</div><script>document.getElementById('seo-pre').style.display='none'</script><div id="root"></div>`,
  );

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
