import keywordsData from "./keywords.json";
import healthData from "./health-keywords.json";
import kopekHealthData from "./kopek-health-keywords.json";
import papagaHealthData from "./papagan-health-keywords.json";
import muhabbet from "./muhabbet-health-keywords.json";
import blogPosts from "./blog-posts.json";
import categories from "./categories.json";
import localPages from "./local-seo.json";
import {
  buildKeywordDescription,
  buildKeywordArticle,
  buildHealthArticle,
  buildLocalArticle,
  keywordAsTitle,
  pickImages,
  type SeoArticle,
} from "../shared/seo-article";
import {
  PHONE_DISPLAY,
  PHONE_INTL,
  STORE_ADDRESS_SHORT,
  STORE_ADDRESS_LINE,
  SHOP_URL,
  GOOGLE_REVIEWS_URL,
} from "../shared/store-info";

interface PageMeta {
  title: string;
  h1: string;
  description: string;
  bodyHtml?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  notFound?: boolean;
}

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

const categoryMap = new Map<string, { title: string; h1: string; desc: string; intro?: string; sections?: Array<{ h: string; p: string }> }>();
for (const c of categories as { slug: string; title: string; h1: string; desc: string; intro?: string; sections?: Array<{ h: string; p: string }> }[]) {
  categoryMap.set(c.slug, { title: c.title, h1: c.h1, desc: c.desc, intro: c.intro, sections: c.sections || [] });
}

const localMap = new Map<string, { title?: string; h1: string; desc: string; intro?: string; sections?: Array<{ h: string; p: string }>; district?: string; neighborhood?: string | null }>();
for (const l of localPages as { slug: string; title?: string; h1: string; desc: string; intro?: string; sections?: Array<{ h: string; p: string }>; district?: string; neighborhood?: string | null }[]) {
  if (!localMap.has(l.slug)) {
    localMap.set(l.slug, { title: l.title, h1: l.h1, desc: l.desc, intro: l.intro, sections: l.sections || [], district: l.district, neighborhood: l.neighborhood });
  }
}

const CATEGORY_SLUGS = new Set(categoryMap.keys());

// ── Clean raw keyword text (remove leading/trailing periods/spaces) ───────────
function cleanKeyword(kw: string): string {
  return kw.replace(/^[\s.]+/, "").replace(/[\s.]+$/, "").replace(/\s+/g, " ").trim();
}

// ── Title-case helper (Turkish-safe) ──────────────────────────────────────────
function toTitleCase(str: string): string {
  const s = str.trim();
  if (!s) return s;
  return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1);
}

function clipTitle(title: string, max = 62): string {
  const t = title.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, "").trim();
}

function clipDesc(desc: string, min = 110, max = 155): string {
  let d = desc.replace(/\s+/g, " ").trim();
  if (d.length < min) {
    const extra = ` Samsun Atakum petshop. Tel: ${PHONE_DISPLAY}.`;
    if (d.length + extra.length <= max) d += extra;
  }
  if (d.length > max) {
    d = d.slice(0, max).replace(/\s+\S*$/, "").trim();
  }
  return d;
}

// ── Type-specific meta description generator ──────────────────────────────────
function buildKeywordDesc(kw: string): string {
  return buildKeywordDescription(kw);
}

function generateContent(keyword: string, slug: string): SeoArticle {
  return buildKeywordArticle(keyword, slug);
}

function imgTag(src: string, alt: string, eager = false): string {
  return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" title="${escapeHtml(alt)}" width="800" height="450" loading="${eager ? "eager" : "lazy"}"><figcaption>${escapeHtml(alt)}</figcaption></figure>`;
}

function footerHtml(): string {
  return `<aside aria-label="Mağaza ve ürün kategorileri">
<h2>Petshop ürün kategorileri</h2>
<p>Kedi ve köpek mamaları, kedi kumu, tasma ve koşumlar, taşıma ürünleri, oyuncaklar, kuş yemleri, akvaryum ekipmanları ve küçük hayvan malzemeleri için ürün özelliklerini karşılaştırın.</p>
<nav aria-label="Ana ürün kategorileri"><ul>
<li><a href="/kedi-urunleri">Kedi ürünleri</a></li>
<li><a href="/kopek-urunleri">Köpek ürünleri</a></li>
<li><a href="/kus-urunleri">Kuş ürünleri</a></li>
<li><a href="/balik-urunleri">Akvaryum ürünleri</a></li>
<li><a href="/kucuk-hayvan-urunleri">Küçük hayvan ürünleri</a></li>
</ul></nav>
<h3>Mağaza bilgileri</h3>
<p>Ürünler kapalı ambalajında satılır; son kullanma tarihi ve etiket mağazada kontrol edilebilir. Mağazada canlı hayvan satışı yapılmaz.</p>
<p><a href="${SHOP_URL}" rel="noopener">Online mağaza: enuygunpetshop.com</a> · <a href="${GOOGLE_REVIEWS_URL}" rel="noopener nofollow">Google yorumlarını oku</a></p>
<address>EnuygunPet Gross Market — ${STORE_ADDRESS_SHORT} — Tel: ${PHONE_INTL} — Her gün 09:00–21:00</address>
</aside>`;
}

function interleaveImages(sectionHtml: string[], images: Array<{ src: string; alt: string }>): string {
  const n = sectionHtml.length;
  const slots = Array.from(new Set([0, Math.floor(n / 3), Math.floor((2 * n) / 3)]));
  return sectionHtml
    .map((html, i) => {
      const imgIdx = slots.indexOf(i);
      if (imgIdx < 0 || !images[imgIdx]) return html;
      const tag = imgTag(images[imgIdx].src, images[imgIdx].alt, imgIdx === 0);
      return imgIdx === 0 ? tag + html : html + tag;
    })
    .join("");
}

// ── Build body HTML from raw sections (blog/home pages) ───────────────────────
function buildSectionsHtml(h1: string, intro: string, sections: Array<{ h: string; p: string }>): string {
  const images = pickImages(h1);
  const parts: string[] = [];
  if (intro) parts.push(`<p>${escapeHtml(intro)}</p>`);
  for (const s of sections) {
    parts.push(`<section><h2>${escapeHtml(s.h)}</h2><p>${escapeHtml(s.p)}</p></section>`);
  }
  const inner = interleaveImages(parts, images);
  return `<h1>${escapeHtml(h1)}</h1><article>${inner}${footerHtml()}</article>`;
}

function faqHtml(faqs: Array<{ q: string; a: string }>): string {
  return faqs
    .map(
      (f) =>
        `<div itemscope itemtype="https://schema.org/Question"><h3 itemprop="name">${escapeHtml(f.q)}</h3><div itemscope itemtype="https://schema.org/Answer" itemprop="acceptedAnswer"><p itemprop="text">${escapeHtml(f.a)}</p></div></div>`,
    )
    .join("");
}

function buildSeoBodyHtml(h1: string, art: SeoArticle): string {
  const parts = art.sections.map(
    (s) =>
      `<section><h2>${escapeHtml(s.heading)}</h2>${s.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</section>`,
  );
  const inner = interleaveImages(parts, art.images);
  return `<h1>${escapeHtml(h1)}</h1><article>${inner}<section><h2>Sık Sorulan Sorular</h2>${faqHtml(art.faqs)}</section>${footerHtml()}</article>`;
}

function buildBodyHtml(h1: string, article: string, faqs: Array<{ q: string; a: string }>): string {
  return buildSeoBodyHtml(h1, {
    images: pickImages(h1),
    sections: [{ heading: h1, paragraphs: article.split("\n\n").filter(Boolean) }],
    faqs,
  });
}

function notFoundMeta(): PageMeta {
  return {
    title: "Sayfa Bulunamadı | EnuygunPet",
    h1: "Sayfa Bulunamadı",
    description: "Aradığınız sayfa bulunamadı. EnuygunPet Gross Market — Samsun Atakum petshop. Ana sayfadan devam edebilirsiniz.",
    noIndex: true,
    notFound: true,
    bodyHtml: `<h1>Sayfa Bulunamadı</h1><article><p>Aradığınız sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.</p><p><a href="/">Ana sayfaya dön</a> · <a href="/blog">Bakım Rehberleri</a> · <a href="/kedi-mamasi">Kedi Maması</a></p>${footerHtml()}</article>`,
  };
}

function findHealthByPath(prefix: string, slug: string): { keyword: string; categoryName: string } | undefined {
  const table: Record<string, Array<{ slug: string; keyword: string; categoryName: string }>> = {
    "kedi-hastaliklari": healthData as Array<{ slug: string; keyword: string; categoryName: string }>,
    "kopek-hastaliklari": kopekHealthData as Array<{ slug: string; keyword: string; categoryName: string }>,
    "papagan-hastaliklari": papagaHealthData as Array<{ slug: string; keyword: string; categoryName: string }>,
    "muhabbet-kusu-hastaliklari": muhabbet as Array<{ slug: string; keyword: string; categoryName: string }>,
  };
  return table[prefix]?.find((h) => h.slug === slug);
}

// ── Public API ─────────────────────────────────────────────────────────────────
export function getPageMeta(urlPath: string): PageMeta {
  const path = urlPath.replace(/\?.*$/, "").replace(/\/+$/, "") || "/";

  if (path === "/" || path === "") {
    return {
      title: "EnuygunPet | Samsun Atakum Petshop Gross Market",
      h1: "EnuygunPet Gross Market — Samsun Atakum Petshop",
      description:
        "Atakum petshop ve Samsun pet shop: EnuygunPet, 3078. Sokak No:10. Kedi-köpek maması, kum. Tel 0542 462 29 59. Her gün 09:00-21:00.",
      bodyHtml: buildSectionsHtml("EnuygunPet Gross Market — Samsun Atakum Petshop",
        "Samsun Atakum petshop arayanlar için EnuygunPet Gross Market, Yeni Mahalle 3078. Sokak No:10 adresinde kedi, köpek, kuş ve akvaryum ürünlerini gross market fiyatıyla tek çatı altında sunar.",
        [
          { h: "Samsun Atakum'un En Büyük Petshop Gross Marketi", p: `EnuygunPet, Samsun'un Atakum ilçesinde ${STORE_ADDRESS_SHORT} adresinde hizmet veren petshop gross marketidir. Gross market formatıyla faaliyet gösteren mağazamız, perakende petshopların çok altında fiyatlarla kedi maması, köpek maması, kuş yemi ve tüm evcil hayvan ürünlerini müşterilerimize sunmaktadır. Büyük gramajlı ürünleri toplu temin ettiğimiz için birim maliyetlerimiz düşük tutulabilmektedir; bu avantajı doğrudan müşterilerimize yansıtıyoruz. Haftanın her günü 09:00-21:00 arası kesintisiz açığız, Pazar ve resmi tatillerde de kapılarımızı kapatmıyoruz.` },
          { h: "Kedi Sahiplerine Özel Geniş Ürün Seçeneği", p: "Kedi maması seçimi; yaş, kısırlaştırma durumu ve sağlık geçmişine göre farklılık göstermektedir. Mağazamızda Royal Canin, Hills Science Plan, Pro Plan, Brit Care, Reflex, Acana, Orijen, Felicia ve N&D başta olmak üzere 20'yi aşkın markanın kedi mamasını bulabilirsiniz. Yavru kedi, yetişkin kedi, kısırlaştırılmış kedi ve özel diyet mamaları ayrı ayrı stoklanmaktadır. Kedi kumu konusunda ise topaklanan bentonit kum, silika kristal kum, doğal odun talaşı ve tozsuz pelet seçenekleri mevcuttur. Bunların yanı sıra kedi tırmalama tahtaları, yataklar, taşıma çantaları ve oyuncaklar da raflarımızda hazır bulunmaktadır." },
          { h: "Köpek Sahipleri İçin Her Şey Tek Çatı Altında", p: "Köpek maması seçiminde ırkın büyüklüğü, yaşı ve aktivite düzeyi belirleyici rol oynar. Mağazamızda Royal Canin Breed Specific serisi, Pro Plan Performance, Hills Science Plan, Brit Care Grain Free, Acana ve Orijen gibi premium markaların yanı sıra uygun bütçeli seçenekler de yer almaktadır. Küçük ırk, orta ırk ve büyük ırk mamaları ayrı olarak stoklanmaktadır. Tasma, koşum, gezdirme ipi, oyuncak, yatak, şampuan ve diş bakım ürünleri gibi köpek aksesuarlarına da tek adresten ulaşabilirsiniz. Özellikle büyük gramajlı köpek mamalarında gross market fiyat avantajımız belirgin biçimde hissedilmektedir." },
          { h: "Kuş, Akvaryum ve Küçük Hayvan Ürünleri", p: "Muhabbet kuşu, kanarya, sultan papağanı ve Afrika gri papağanı gibi farklı kuş türleri için özel formüle edilmiş yemler, kafesler, tünekler, mineral taşları ve vitamin takviyeleri sunmaktayız. Akvaryum tutkunları için tatlı su ve tuzlu su balıkları yemleri, filtre sistemleri, hava motorları ve dekor ürünleri geniş seçeneklerle mevcuttur. Hamster, tavşan, guinea pig ve diğer küçük hayvanlar için mama, altlık malzemeleri ve kafesler de mağazamızda bulunmaktadır." },
          { h: "Gross Market Fiyat Avantajı Nasıl İşliyor?", p: "Gross market modeli, ürünleri büyük miktarda temin ederek birim maliyetleri düşüren bir ticaret biçimidir. Perakende petshoplar küçük miktarlarda stok tutarken biz aynı ürünü palet ve koli olarak satın alırız; bu da birim fiyatı önemli ölçüde aşağı çeker. Mağazamızda perakende fiyatlara kıyasla yüzde otuz ila elli arasında tasarruf etmek mümkündür. Özellikle büyük gramaj tercihi yapan çok kedili ya da köpekli haneler, yılda yüzlerce lira tasarruf sağlamaktadır. Toplu alım yapan müşterilerimize ek indirim uygulaması da mevcuttur." },
          { h: "Uzman Danışmanlık ve Kişisel Hizmet", p: "Hangi mamayı seçeceğinizi bilmiyorsanız, kedi kumunun farkları konusunda kafanız karışıksa ya da köpeğiniz için ideal gramaj ve beden arıyorsanız mağazamızdaki deneyimli personelimiz size ücretsiz danışmanlık sunar. Veteriner tavsiyeleriyle örtüşen, kanıtlanmış ürün önerileri yapıyoruz. WhatsApp hattımız aracılığıyla yazılı danışma da yapabilirsiniz; ürün fotoğrafı göndererek stok ve fiyat sorabilirsiniz." },
          { h: "Samsun'un Her Noktasından Bize Ulaşın", p: "Mağazamız Samsun Atakum'da 3078. Sokak üzerinde konumlanan tek katlı bir gross market yapısındadır. Önünde ücretsiz otopark imkânı bulunmaktadır. Minibüs ve dolmuş güzergahlarıyla ulaşımı kolaydır. İlkadım, Canik, Tekkeköy ve Samsun merkezden 15-30 dakika içinde ulaşılabilecek mesafededir. Google Harita üzerinden EnuygunPet aratarak doğrudan yol tarifi alabilirsiniz. Samsun içi WhatsApp üzerinden sipariş verip kapınıza teslim seçeneğimizden de yararlanabilirsiniz." },
        ]
      ),
    };
  }

  if (path === "/blog") {
    return {
      title: "Evcil Hayvan Bakım Rehberi | EnuygunPet Blog",
      h1: "Evcil Hayvan Bakım Rehberi",
      description: clipDesc(
        "Kedi, köpek, kuş ve balık bakımı hakkında uzman rehberleri. Mama seçimi, sağlık, beslenme ipuçları.",
      ),
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

  if (path === "/iletisim") {
    return {
      title: "İletişim | EnuygunPet – Samsun Atakum Petshop Gross Market",
      h1: "İletişim — EnuygunPet Gross Market",
      description: `EnuygunPet iletişim: ${STORE_ADDRESS_LINE}. Tel ${PHONE_DISPLAY}. Atakum petshop, her gün 09:00-21:00.`,
      bodyHtml: buildSectionsHtml("İletişim — EnuygunPet Gross Market",
        "Samsun Atakum'daki EnuygunPet Gross Market mağazamıza ulaşın. Adres, telefon, WhatsApp ve çalışma saatleri.",
        [
          { h: "Adres", p: `${STORE_ADDRESS_LINE}. Ücretsiz otopark imkânı bulunmaktadır.` },
          { h: "Telefon ve WhatsApp", p: `${PHONE_DISPLAY} numaralı hattımızdan arayabilir veya WhatsApp üzerinden stok ve fiyat sorabilirsiniz.` },
          { h: "Çalışma Saatleri", p: "Haftanın her günü 09:00–21:00 saatleri arasında açığız. Resmi tatillerde de hizmet veriyoruz." },
        ]
      ),
    };
  }

  if (path === "/royal-canin") {
    return {
      title: "Royal Canin Samsun | Atakum İçi 1 Saatte Teslim",
      h1: "Royal Canin Samsun — EnuygunPet Gross Market",
      description: clipDesc("Royal Canin kedi ve köpek mamaları Samsun Atakum'da. Kitten, Sterilised ve ırka özel formüller uygun fiyatla EnuygunPet'te."),
      bodyHtml: buildSectionsHtml("Royal Canin Samsun — EnuygunPet Gross Market",
        "Royal Canin kedi ve köpek mamaları Samsun Atakum'da EnuygunPet Gross Market'te. Kitten, Sterilised ve ırka özel formüller uygun fiyatla.",
        [
          { h: "Kedi Mamaları", p: "Royal Canin Kitten, Sterilised, Indoor, Hair & Skin ve ırka özel kedi mamaları mağazamızda stokta. Yavru, kısır ve yetişkin seçenekleri uzman danışmanlıkla sunulur." },
          { h: "Köpek Mamaları", p: "Mini Puppy, Mini Adult, Medium Adult ve Maxi Adult serileri Samsun Atakum'da. Irkın büyüklüğüne göre doğru taneli formülleri EnuygunPet'te bulun." },
          { h: "Veterinary Diets", p: "Gastrointestinal ve Hypoallergenic gibi veteriner diyetleri için mağazamızı ziyaret edin veya WhatsApp'tan stok sorun." },
        ]
      ),
    };
  }

  if (path === "/proplan") {
    return {
      title: "Pro Plan Samsun | Atakum İçi 1 Saatte Teslim",
      h1: "Pro Plan Samsun — EnuygunPet Gross Market",
      description: clipDesc("Purina Pro Plan kedi ve köpek mamaları Samsun Atakum'da. Kitten, Sterilised, Adult ve Veterinary Diets uygun fiyatla EnuygunPet'te."),
      bodyHtml: buildSectionsHtml("Pro Plan Samsun — EnuygunPet Gross Market",
        "Purina Pro Plan kedi ve köpek mamaları Samsun Atakum'da EnuygunPet Gross Market'te. Kitten, Sterilised, Adult ve Veterinary Diets stokta.",
        [
          { h: "Kedi Mamaları", p: "Pro Plan Kitten, Sterilised ve Adult kedi mamaları Atakum'da uygun fiyatla. Kedinizin yaşına ve ihtiyacına göre uzman ekibimiz yönlendirir." },
          { h: "Köpek Mamaları", p: "Puppy, Small & Mini, Medium Adult ve Large Adult serileri Samsun Atakum'da. Irka ve aktiviteye uygun Pro Plan formülleri EnuygunPet'te." },
          { h: "Veterinary Diets", p: "Pro Plan Veterinary Diets ürünleri için mağazamızı arayın veya WhatsApp hattımızdan stok ve fiyat sorun." },
        ]
      ),
    };
  }

  if (path === "/admin") {
    return {
      title: "Admin | EnuygunPet Analytics",
      h1: "Admin",
      description: "EnuygunPet yönetim paneli.",
      noIndex: true,
      bodyHtml: "<h1>Admin</h1>",
    };
  }

  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const b = blogMap.get(slug);
    if (b) {
      return {
        title: clipTitle(`${b.title} | EnuygunPet`),
        h1: b.title,
        description: clipDesc(b.desc),
        bodyHtml: buildSectionsHtml(b.title, b.desc, b.sections),
      };
    }
    return notFoundMeta();
  }

  const localMatch = path.match(/^\/local\/(.+)$/);
  if (localMatch) {
    const slug = localMatch[1];
    const l = localMap.get(slug);
    if (l) {
      const h1 = keywordAsTitle(l.h1);
      return {
        title: h1,
        h1,
        description: clipDesc(buildKeywordDesc(l.h1)),
        bodyHtml: buildSeoBodyHtml(
          h1,
          buildLocalArticle({
            keyword: l.h1,
            slug,
            h1: l.h1,
            intro: l.intro || l.desc,
            district: l.district || "Samsun",
            neighborhood: l.neighborhood,
            sections: l.sections || [],
          }),
        ),
      };
    }
    return notFoundMeta();
  }

  const bare = path.replace(/^\//, "");

  if (CATEGORY_SLUGS.has(bare)) {
    const c = categoryMap.get(bare);
    if (c) {
      const art = generateContent(c.h1, bare);
      return {
        title: keywordAsTitle(c.h1),
        h1: c.h1,
        description: clipDesc(buildKeywordDesc(c.h1)),
        bodyHtml: buildSeoBodyHtml(c.h1, art),
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
    const art = generateContent(ec.h1, bare);
    return {
      title: clipTitle(ec.title),
      h1: ec.h1,
      description: clipDesc(ec.description),
      bodyHtml: buildSeoBodyHtml(ec.h1, art),
    };
  }

  // ── Explicit meta for health category pages (/saglik/kedi etc.) ─────────────
  const healthCategoryMeta: Record<string, { title: string; h1: string; description: string }> = {
    "saglik/kedi": {
      title: "Kedi Sağlığı ve Beslenme Rehberi | EnuygunPet",
      h1: "Kedi Sağlığı ve Beslenme Rehberi",
      description: "Kedi beslenmesi, kısırlaştırma sonrası diyet, tüy bakımı ve sağlık önerileri. Samsun Atakum'da uzman danışmanlık için EnuygunPet Gross Market'i ziyaret edin.",
    },
    "saglik/kopek": {
      title: "Köpek Sağlığı ve Beslenme Rehberi | EnuygunPet",
      h1: "Köpek Sağlığı ve Beslenme Rehberi",
      description: "Köpek beslenmesi, irka özel diyet, yavru köpek büyütme ve egzersiz önerileri. Samsun Atakum'da uzman danışmanlık için EnuygunPet Gross Market'i ziyaret edin.",
    },
    "saglik/kus": {
      title: "Kuş Sağlığı ve Beslenme Rehberi | EnuygunPet",
      h1: "Kuş Sağlığı ve Beslenme Rehberi",
      description: "Muhabbet kuşu, papağan ve kanarya bakımı, beslenme ve sağlık önerileri. Samsun Atakum'da geniş kuş ürünleri yelpazesi için EnuygunPet Gross Market.",
    },
    "saglik/balik": {
      title: "Balık ve Akvaryum Bakım Rehberi | EnuygunPet",
      h1: "Balık ve Akvaryum Bakım Rehberi",
      description: "Akvaryum kurulumu, su kalitesi, balık beslenmesi ve sağlık önerileri. Samsun Atakum'da tüm akvaryum ürünleri için EnuygunPet Gross Market.",
    },
  };

  if (healthCategoryMeta[bare]) {
    const hc = healthCategoryMeta[bare];
    const animalByHub: Record<string, string> = {
      "saglik/kedi": "Kedi",
      "saglik/kopek": "Köpek",
      "saglik/kus": "Kuş",
      "saglik/balik": "Balık",
    };
    const animal = animalByHub[bare] || "Evcil hayvan";
    const art = buildHealthArticle(hc.h1, animal, "Bakım ve beslenme", bare);
    return {
      title: keywordAsTitle(hc.h1),
      h1: hc.h1,
      description: clipDesc(buildKeywordDesc(`${animal} bakım ürünleri`)),
      bodyHtml: buildSeoBodyHtml(hc.h1, art),
    };
  }

  const healthPathMatch = path.match(/^\/(kedi-hastaliklari|kopek-hastaliklari|papagan-hastaliklari|muhabbet-kusu-hastaliklari)\/([^/]+)$/);
  if (healthPathMatch) {
    const health = findHealthByPath(healthPathMatch[1], healthPathMatch[2]);
    if (health) {
      const kw = cleanKeyword(health.keyword);
      const kwTitle = keywordAsTitle(kw);
      const h1 = kwTitle;
      const animalByPrefix: Record<string, string> = {
        "kedi-hastaliklari": "Kedi",
        "kopek-hastaliklari": "Köpek",
        "papagan-hastaliklari": "Papağan",
        "muhabbet-kusu-hastaliklari": "Muhabbet kuşu",
      };
      const art = buildHealthArticle(kw, animalByPrefix[healthPathMatch[1]] || "Evcil hayvan", health.categoryName, healthPathMatch[2]);
      return {
        title: kwTitle,
        h1,
        description: clipDesc(`${kw} hakkında bilgi: belirtiler, nedenler ve ne yapmalısınız? Samsun Atakum EnuygunPet'te ${health.categoryName.toLowerCase()} ürünleri.`),
        bodyHtml: buildSeoBodyHtml(h1, art),
      };
    }
    return notFoundMeta();
  }

  const health = healthMap.get(bare);
  if (health) {
    const kw = cleanKeyword(health.keyword);
    const kwTitle = keywordAsTitle(kw);
    const h1 = kwTitle;
    const art = buildHealthArticle(kw, health.categoryName, health.categoryName, bare);
    return {
      title: kwTitle,
      h1,
      description: clipDesc(buildKeywordDesc(kw)),
      bodyHtml: buildSeoBodyHtml(h1, art),
    };
  }

  const keyword = keywordMap.get(bare);
  if (keyword) {
    const kw = cleanKeyword(keyword);
    const kwTitle = keywordAsTitle(kw);
    const h1 = kwTitle;
    const art = generateContent(kw, bare);
    return {
      title: kwTitle,
      h1,
      description: clipDesc(buildKeywordDesc(kw)),
      bodyHtml: buildSeoBodyHtml(h1, art),
    };
  }

  return notFoundMeta();
}

export function injectMeta(html: string, meta: PageMeta, urlPath = "/"): string {
  let result = html;
  const rawPath = (meta.canonicalPath || urlPath).replace(/\?.*$/, "").replace(/\/+$/, "") || "/";
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const canonicalUrl = path === "/" ? "https://www.enuygun.pet/" : `https://www.enuygun.pet${path}`;

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

  result = result.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
  );
  result = result.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
  );
  result = result.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
  );
  result = result.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
  );
  result = result.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
  );
  result = result.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  );

  if (meta.noIndex) {
    result = result.replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/,
      `<meta name="robots" content="noindex, nofollow">`,
    );
    result = result.replace(
      /<meta name="googlebot" content="[^"]*"\s*\/?>/,
      `<meta name="googlebot" content="noindex, nofollow">`,
    );
  }

  if (path !== "/") {
    result = result.replace(
      /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/,
      "",
    );
  }

  const crumbs: Array<{ name: string; url: string }> = [
    { name: "EnuygunPet", url: "https://www.enuygun.pet/" },
  ];
  if (path !== "/") {
    const parts = path.split("/").filter(Boolean);
    let acc = "";
    for (let i = 0; i < parts.length; i++) {
      acc += `/${parts[i]}`;
      const label = i === parts.length - 1 ? meta.h1 || parts[i] : parts[i].replace(/-/g, " ");
      crumbs.push({ name: label, url: `https://www.enuygun.pet${acc}` });
    }
  }
  const webpageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.title,
    description: meta.description,
    url: canonicalUrl,
    isPartOf: { "@id": "https://www.enuygun.pet/#website" },
    about: { "@id": "https://www.enuygun.pet/#petstore" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    },
  };
  result = result.replace(
    "</head>",
    `<script type="application/ld+json">${JSON.stringify(webpageLd)}</script>\n</head>`,
  );

  // Inject SEO content before #root — React does NOT touch elements outside its root,
  // so this persists in DOM. A tiny inline script hides it once JS runs.
  const fallbackImgs = pickImages(meta.h1);
  const fallbackImgHtml = fallbackImgs
    .map((img, i) => imgTag(img.src, img.alt, i === 0))
    .join("");
  const seoContent = meta.bodyHtml
    ? meta.bodyHtml
    : `<h1>${escapeHtml(meta.h1)}</h1><article>${fallbackImgHtml}<p>${escapeHtml(meta.description)}</p>${footerHtml()}</article>`;

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
