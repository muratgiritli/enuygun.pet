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

const blogMap = new Map<string, { title: string; desc: string }>();
for (const b of blogPosts as { slug: string; title: string; desc: string }[]) {
  blogMap.set(b.slug, { title: b.title, desc: b.desc });
}

const categoryMap = new Map<string, { h1: string; desc: string }>();
for (const c of categories as { slug: string; h1: string; desc: string }[]) {
  categoryMap.set(c.slug, { h1: c.h1, desc: c.desc });
}

const localMap = new Map<string, { h1: string; desc: string }>();
for (const l of localPages as { slug: string; h1: string; desc: string }[]) {
  if (!localMap.has(l.slug)) {
    localMap.set(l.slug, { h1: l.h1, desc: l.desc });
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

// ── Clean raw keyword text (remove trailing periods/spaces) ───────────────────
function cleanKeyword(kw: string): string {
  return kw.replace(/[\s.]+$/, "").replace(/\s+/g, " ").trim();
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

// ── Build hidden body HTML injected before React mounts ────────────────────────
function buildBodyHtml(h1: string, article: string, faqs: Array<{ q: string; a: string }>, address = true): string {
  const ST = `style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"`;
  const paragraphs = article.split("\n\n").map(p => `<p>${escapeHtml(p)}</p>`).join("");
  const faqHtml = faqs.map(f =>
    `<div><h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p></div>`
  ).join("");
  const addrHtml = address
    ? `<address>EnuygunPet Gross Market, Atatürk Bulvarı No:113, Atakum / Samsun — Tel: +90 542 211 49 44 — Çalışma saatleri: Haftanın her günü 09:00-21:00</address>`
    : "";
  return `<h1 ${ST}>${escapeHtml(h1)}</h1><article ${ST}>${paragraphs}<section><h2>Sık Sorulan Sorular</h2>${faqHtml}</section>${addrHtml}</article>`;
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
    };
  }

  if (path === "/blog") {
    return {
      title: "Evcil Hayvan Bakım Rehberi — Blog | EnuygunPet Samsun",
      h1: "Evcil Hayvan Bakım Rehberi",
      description:
        "Kedi, köpek, kuş ve balık bakımı hakkında uzman rehberleri. Mama seçimi, sağlık, beslenme ipuçları.",
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
      };
    }
  }

  const bare = path.replace(/^\//, "");

  if (CATEGORY_SLUGS.has(bare)) {
    const c = categoryMap.get(bare);
    if (c) {
      return {
        title: `${c.h1} | Gross Market`,
        h1: c.h1,
        description: c.desc,
      };
    }
  }

  const health = healthMap.get(bare);
  if (health) {
    const kw = cleanKeyword(health.keyword);
    const h1 = `${kw} — Samsun Atakum`;
    const desc = `${kw} hakkında bilgi ve ürünler. EnuygunPet Gross Market Samsun Atakum'da uzman tavsiyesi ve geniş ürün yelpazesi.`;
    const { article, faqs } = generateContent(kw);
    return {
      title: `${kw} — Samsun Atakum | ${BRAND}`,
      h1,
      description: desc,
      bodyHtml: buildBodyHtml(h1, article, faqs),
    };
  }

  const keyword = keywordMap.get(bare);
  if (keyword) {
    const kw = cleanKeyword(keyword);
    const h1 = `${kw} — Samsun Atakum`;
    const desc = `${kw} Samsun Atakum'da EnuygunPet Gross Market'te. Gross market fiyatıyla geniş ürün yelpazesi, uzman tavsiyesi.`;
    const { article, faqs } = generateContent(kw);
    return {
      title: `${kw} — Samsun Atakum | ${BRAND}`,
      h1,
      description: desc,
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

  const bodyContent = meta.bodyHtml
    ? meta.bodyHtml
    : `<h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${escapeHtml(meta.h1)}</h1>`;

  result = result.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyContent}</div>`,
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
