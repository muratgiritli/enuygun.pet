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
}

const SITE = "https://www.enuygun.pet";
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
    return {
      title: `${health.keyword} — Samsun Atakum | ${BRAND}`,
      h1: `${health.keyword} — Samsun Atakum`,
      description: `${health.keyword} hakkında bilgi ve ürünler. EnuygunPet Gross Market Samsun Atakum'da uzman tavsiyesi ve geniş ürün yelpazesi.`,
    };
  }

  const keyword = keywordMap.get(bare);
  if (keyword) {
    return {
      title: `${keyword} — Samsun Atakum | ${BRAND}`,
      h1: `${keyword} — Samsun Atakum`,
      description: `${keyword} Samsun Atakum'da EnuygunPet Gross Market'te. Gross market fiyatıyla geniş ürün yelpazesi, uzman tavsiyesi.`,
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

  result = result.replace(
    '<div id="root">',
    `<div id="root"><h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${escapeHtml(meta.h1)}</h1>`,
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
