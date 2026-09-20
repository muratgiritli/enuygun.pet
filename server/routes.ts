import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { recordHit, updateDuration, recordButton, getAnalyticsData, createSession, validateSession } from "./analytics";
import keywordsData from "./keywords.json";
import healthKeywordsData from "./health-keywords.json";
import kopekHealthData from "./kopek-health-keywords.json";
import papaganHealthData from "./papagan-health-keywords.json";
import muhabbetHealthData from "./muhabbet-health-keywords.json";
import blogPostsData from "./blog-posts.json";
import localSeoData from "./local-seo.json";
import categoriesData from "./categories.json";
import { postToTwitter, postToFacebook, postToInstagram, postToAllPlatforms } from "./social";
import { PHONE_E164 } from "@shared/store-info";
import { resolveSeoRedirect } from "@shared/seo-redirects";
import { CATEGORY_IMAGE_URLS, categoryImageKeyFor } from "@shared/store-images";

type HealthKw = { keyword: string; slug: string; category: string; categoryName: string };
const keywords = keywordsData as Array<{ keyword: string; slug: string }>;
const keywordBySlug = new Map(keywords.map(k => [k.slug, k]));
const healthKeywords = healthKeywordsData as HealthKw[];
const healthBySlug = new Map(healthKeywords.map(k => [k.slug, k]));
const kopekKeywords = kopekHealthData as HealthKw[];
const papaganKeywords = papaganHealthData as HealthKw[];
const muhabbetKeywords = muhabbetHealthData as HealthKw[];

type BlogPost = { slug: string; title: string; cat: string; desc: string; products: string[]; sections: { h: string; p: string }[] };
const blogPosts = blogPostsData as BlogPost[];
const blogBySlug = new Map(blogPosts.map(b => [b.slug, b]));

type LocalPage = { slug: string; title: string; h1: string; district: string; neighborhood: string | null; desc: string; intro: string; sections: { h: string; p: string }[] };
const localPages = localSeoData as LocalPage[];
const localBySlug = new Map(localPages.map(p => [p.slug, p]));

type CategoryPage = { slug: string; title: string; h1: string; desc: string; intro: string; relatedBlogs: string[]; relatedKeywords: string[]; brands: string[]; sections: { h: string; p: string }[] };
const categoryPages = categoriesData as CategoryPage[];
const categoryBySlug = new Map(categoryPages.map(c => [c.slug, c]));

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const SITEMAP_IMGS = {
    magaza: { loc: "https://www.enuygun.pet/images/magaza/magaza-1200.webp", base: "EnuygunPet Samsun Atakum petshop gross market mağaza" },
    cat: { loc: CATEGORY_IMAGE_URLS.cat, base: "Kedi maması, kum ve kedi ürünleri" },
    dog: { loc: CATEGORY_IMAGE_URLS.dog, base: "Köpek maması, tasma ve köpek ürünleri" },
    bird: { loc: CATEGORY_IMAGE_URLS.bird, base: "Kuş yemi, kafes ve kuş ürünleri" },
    fish: { loc: CATEGORY_IMAGE_URLS.fish, base: "Akvaryum malzemeleri ve balık yemi" },
    hamster: { loc: CATEGORY_IMAGE_URLS.hamster, base: "Hamster, tavşan ve küçük hayvan ürünleri" },
    petshop: { loc: CATEGORY_IMAGE_URLS.petshop, base: "EnuygunPet Atakum petshop ürünleri" },
  };

  function xmlEscape(str: string): string {
    return str.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;");
  }

  function pickSitemapImg(kw: string) {
    const key = categoryImageKeyFor(kw);
    return SITEMAP_IMGS[key] || SITEMAP_IMGS.magaza;
  }

  function buildKeywordUrl(k: { keyword: string; slug: string }, today: string): string | null {
    if (resolveSeoRedirect(`/${k.slug}`) || categoryBySlug.has(k.slug)) return null;
    const img = pickSitemapImg(k.keyword);
    const altTitle = xmlEscape(`${k.keyword} - Samsun Atakum EnuygunPet Petshop`);
    const caption = xmlEscape(`${img.base} - ${k.keyword}`);
    return `  <url>\n    <loc>https://www.enuygun.pet/${k.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <image:image>\n      <image:loc>${img.loc}</image:loc>\n      <image:title>${altTitle}</image:title>\n      <image:caption>${caption}</image:caption>\n    </image:image>\n  </url>`;
  }

  const TOTAL_SITEMAPS = 50;
  const chunkSize = Math.ceil(keywords.length / TOTAL_SITEMAPS);

  app.get("/sitemap.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const sitemapEntries = Array.from({ length: TOTAL_SITEMAPS }, (_, i) => {
      const n = i + 1;
      return `  <sitemap>\n    <loc>https://www.enuygun.pet/sitemap-${n}.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`;
    }).join("\n");

    const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.enuygun.pet/sitemap-home.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.enuygun.pet/sitemap-health.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.enuygun.pet/sitemap-kopek.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.enuygun.pet/sitemap-papagan.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.enuygun.pet/sitemap-muhabbet.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.enuygun.pet/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.enuygun.pet/sitemap-kategoriler.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.enuygun.pet/sitemap-local.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
${sitemapEntries}
</sitemapindex>`;

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(index);
  });

  app.get("/sitemap-home.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.enuygun.pet/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://www.enuygun.pet/images/magaza/magaza-1200.webp</image:loc>
      <image:title>EnuygunPet Samsun Atakum Petshop Gross Market</image:title>
      <image:caption>Samsun Atakum'un en büyük petshop gross marketi - mağaza ön görünüm</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.enuygun.pet/images/magaza/reyonlar-1200.webp</image:loc>
      <image:title>Atakum petshop ürün reyonları</image:title>
    </image:image>
    <image:image>
      <image:loc>https://www.enuygun.pet/images/magaza/kedi-1200.webp</image:loc>
      <image:title>Samsun pet shop kedi ürünleri</image:title>
    </image:image>
    <image:image>
      <image:loc>https://www.enuygun.pet/images/magaza/kopek-1200.webp</image:loc>
      <image:title>Köpek aksesuarları Atakum</image:title>
    </image:image>
    <image:image>
      <image:loc>https://www.enuygun.pet/images/magaza/kus-1200.webp</image:loc>
      <image:title>Kuş yemleri ve kafesleri</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://www.enuygun.pet/atakum-petshop</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/petshop-samsun</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/iletisim</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/royal-canin</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/proplan</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/saglik/kedi</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/saglik/kopek</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/saglik/kus</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.enuygun.pet/saglik/balik</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(sitemap);
  });

  function healthHubSitemap(loc: string): string {
    const today = new Date().toISOString().split("T")[0];
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
  }

  app.get("/sitemap-health.xml", (_req, res) => {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(healthHubSitemap("https://www.enuygun.pet/saglik/kedi"));
  });

  app.get("/sitemap-kopek.xml", (_req, res) => {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(healthHubSitemap("https://www.enuygun.pet/saglik/kopek"));
  });

  app.get("/sitemap-papagan.xml", (_req, res) => {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(healthHubSitemap("https://www.enuygun.pet/saglik/papagan"));
  });

  app.get("/sitemap-muhabbet.xml", (_req, res) => {
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(healthHubSitemap("https://www.enuygun.pet/saglik/muhabbet"));
  });

  // Sitemap for blog (must be BEFORE /sitemap-:n.xml catch-all)
  app.get("/sitemap-blog.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const blogIndexUrl = `  <url>\n    <loc>https://www.enuygun.pet/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    const postUrls = blogPosts.map(b =>
      `  <url>\n    <loc>https://www.enuygun.pet/blog/${b.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    ).join("\n");
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${blogIndexUrl}\n${postUrls}\n</urlset>`);
  });

  // Sitemap for categories (must be BEFORE /sitemap-:n.xml catch-all)
  app.get("/sitemap-kategoriler.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const urls = categoryPages.filter(c => c.slug !== "atakum-petshop" && c.slug !== "petshop-samsun").map(c =>
      `  <url>\n    <loc>https://www.enuygun.pet/${c.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
    ).join("\n");
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
  });

  // Sitemap for local SEO (must be BEFORE /sitemap-:n.xml catch-all)
  app.get("/sitemap-local.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const seenLocal = new Set<string>();
    const urls = localPages.filter((p) => {
      if (seenLocal.has(p.slug)) return false;
      seenLocal.add(p.slug);
      return !resolveSeoRedirect(`/local/${p.slug}`);
    }).map(p =>
      `  <url>\n    <loc>https://www.enuygun.pet/local/${p.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    ).join("\n");
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
  });

  app.get("/sitemap-:n.xml", (req, res) => {
    const n = parseInt(req.params.n);
    if (isNaN(n) || n < 1 || n > TOTAL_SITEMAPS) {
      return res.status(404).send("Sitemap bulunamadı");
    }
    const today = new Date().toISOString().split("T")[0];
    const start = (n - 1) * chunkSize;
    const chunk = keywords.slice(start, start + chunkSize);
    const urlEntries = chunk.map(k => buildKeywordUrl(k, today)).filter(Boolean).join("\n");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(sitemap);
  });

  app.get("/robots.txt", (_req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: https://www.enuygun.pet/sitemap.xml

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin

User-agent: Yandex
Allow: /
Disallow: /api/
Disallow: /admin
`;
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(robots);
  });

  app.get("/rss.xml", (_req, res) => {
    const IMGS: Record<string, string> = {
      kus: "https://www.enuygun.pet/images/magaza/kus-1200.webp",
      kopek: "https://www.enuygun.pet/images/magaza/kopek-1200.webp",
      kedi: "https://www.enuygun.pet/images/magaza/kedi-1200.webp",
      genel: "https://www.enuygun.pet/images/magaza/magaza-1200.webp",
    };
    function pickRssImg(kw: string) {
      const k = kw.toLowerCase();
      if (k.includes("kuş") || k.includes("papağan") || k.includes("kanarya") || k.includes("muhabbet")) return IMGS.kus;
      if (k.includes("köpek")) return IMGS.kopek;
      if (k.includes("kedi")) return IMGS.kedi;
      return IMGS.genel;
    }

    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const rotated = [...keywords].slice(dayIndex % keywords.length).concat([...keywords].slice(0, dayIndex % keywords.length));
    const items = rotated.filter(k => !resolveSeoRedirect(`/${k.slug}`) && !categoryBySlug.has(k.slug)).slice(0, 50);

    const pubDate = new Date().toUTCString();

    const rssItems = items.map(k => {
      const url = `https://www.enuygun.pet/${k.slug}`;
      const img = pickRssImg(k.keyword);
      const desc = `Samsun Atakum'da ${k.keyword} için EnuygunPet Gross Market. En uygun fiyat, geniş stok. Haftanın her günü 09:00-21:00 açık. WhatsApp: ${PHONE_E164}`;
      return `
    <item>
      <title><![CDATA[${k.keyword} — Samsun Atakum EnuygunPet]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${img}" type="image/jpeg" length="0"/>
      <media:content url="${img}" medium="image"/>
    </item>`;
    }).join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EnuygunPet Gross Market — Samsun Atakum</title>
    <link>https://www.enuygun.pet</link>
    <description>Samsun Atakum'un en büyük petshop gross marketi. Kedi, köpek, kuş ürünleri en uygun fiyatlarla.</description>
    <language>tr</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="https://www.enuygun.pet/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://www.enuygun.pet/images/magaza/magaza-1200.webp</url>
      <title>EnuygunPet Gross Market</title>
      <link>https://www.enuygun.pet</link>
    </image>${rssItems}
  </channel>
</rss>`;

    res.set("Content-Type", "application/rss+xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(rss);
  });

  app.get("/api/keywords", (_req, res) => {
    res.set("Cache-Control", "public, max-age=3600");
    res.json(keywords.filter((k) => !resolveSeoRedirect(`/${k.slug}`)));
  });

  app.get("/api/keyword/:slug", (req, res) => {
    const { slug } = req.params;
    const dest = resolveSeoRedirect(`/${slug}`);
    if (dest) return res.status(404).json({ message: "Not found", redirect: dest });
    const kw = keywordBySlug.get(slug);
    if (!kw) return res.status(404).json({ message: "Not found" });

    const related = getRelated(kw.keyword, kw.slug, keywords);
    res.set("Cache-Control", "public, max-age=3600");
    res.json({ ...kw, related });
  });

  const healthDataMap: Record<string, { list: HealthKw[]; urlPrefix: string; animalTr: string }> = {
    kedi:     { list: healthKeywords,   urlPrefix: "kedi-hastaliklari",          animalTr: "Kedi" },
    kopek:    { list: kopekKeywords,    urlPrefix: "kopek-hastaliklari",         animalTr: "Köpek" },
    papagan:  { list: papaganKeywords,  urlPrefix: "papagan-hastaliklari",       animalTr: "Papağan" },
    muhabbet: { list: muhabbetKeywords, urlPrefix: "muhabbet-kusu-hastaliklari", animalTr: "Muhabbet Kuşu" },
  };

  app.get("/api/health/:animal/:slug", (req, res) => {
    const { animal, slug } = req.params;
    const group = healthDataMap[animal];
    if (!group) return res.status(404).json({ message: "Not found" });
    const kw = group.list.find(k => k.slug === slug);
    if (!kw) return res.status(404).json({ message: "Not found" });
    const related = group.list
      .filter(k => k.category === kw.category && k.slug !== kw.slug)
      .slice(0, 8);
    res.set("Cache-Control", "public, max-age=3600");
    res.json({ ...kw, animalTr: group.animalTr, urlPrefix: group.urlPrefix, related });
  });

  app.post("/api/social/post-all", async (req, res) => {
    const { keyword, slug, secret } = req.body;
    if (secret !== process.env.SOCIAL_POST_SECRET) {
      return res.status(401).json({ error: "Yetkisiz istek" });
    }
    if (!keyword || !slug) {
      return res.status(400).json({ error: "keyword ve slug gerekli" });
    }
    const results = await postToAllPlatforms(keyword, slug);
    res.json({ results });
  });

  app.post("/api/social/twitter", async (req, res) => {
    const { keyword, slug, secret } = req.body;
    if (secret !== process.env.SOCIAL_POST_SECRET) return res.status(401).json({ error: "Yetkisiz" });
    const result = await postToTwitter(keyword, slug);
    res.json(result);
  });

  app.post("/api/social/facebook", async (req, res) => {
    const { keyword, slug, secret } = req.body;
    if (secret !== process.env.SOCIAL_POST_SECRET) return res.status(401).json({ error: "Yetkisiz" });
    const result = await postToFacebook(keyword, slug);
    res.json(result);
  });

  app.post("/api/social/instagram", async (req, res) => {
    const { keyword, slug, secret } = req.body;
    if (secret !== process.env.SOCIAL_POST_SECRET) return res.status(401).json({ error: "Yetkisiz" });
    const result = await postToInstagram(keyword, slug);
    res.json(result);
  });

  // Blog API
  app.get("/api/blog", (_req, res) => {
    res.json(blogPosts.map(b => ({ slug: b.slug, title: b.title, cat: b.cat, desc: b.desc })));
  });

  app.get("/api/blog/:slug", (req, res) => {
    const post = blogBySlug.get(req.params.slug);
    if (!post) return res.status(404).json({ error: "Blog yazısı bulunamadı" });
    const related = blogPosts.filter(b => b.slug !== post.slug && b.cat === post.cat).slice(0, 4).map(b => ({ slug: b.slug, title: b.title }));
    const productLinks = post.products.map(p => {
      const kw = keywords.find(k => k.slug === p || k.slug.includes(p.split('-')[0]));
      return { slug: p, keyword: kw?.keyword || p.replace(/-/g, ' ') };
    });
    res.json({ ...post, related, productLinks });
  });

  // Category API
  app.get("/api/category", (_req, res) => {
    res.json(categoryPages.map(c => ({ slug: c.slug, title: c.title, desc: c.desc })));
  });

  app.get("/api/category/:slug", (req, res) => {
    const cat = categoryBySlug.get(req.params.slug);
    if (!cat) return res.status(404).json({ error: "Kategori bulunamadı" });
    const relatedBlogData = cat.relatedBlogs.map(s => {
      const b = blogBySlug.get(s);
      return b ? { slug: b.slug, title: b.title } : null;
    }).filter(Boolean);
    res.json({ ...cat, relatedBlogData });
  });

  // Local SEO API
  app.get("/api/local", (_req, res) => {
    res.json(localPages.map(p => ({ slug: p.slug, title: p.title, district: p.district, neighborhood: p.neighborhood })));
  });

  app.get("/api/local/:slug", (req, res) => {
    const page = localBySlug.get(req.params.slug);
    if (!page) return res.status(404).json({ error: "Sayfa bulunamadı" });
    res.json(page);
  });

  const ADMIN_USER = process.env.ADMIN_USER || "enuygun";
  const ADMIN_PASS = process.env.ADMIN_PASS || process.env.ADMIN_PASSWORD || "samsun3455";

  app.post("/api/analytics/hit", async (req, res) => {
    try {
      const { slug, keyword, referrer, sessionId, utmSource, utmMedium, utmCampaign } = req.body;
      if (!slug) return res.status(400).json({ ok: false });
      const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
      const ua = req.headers["user-agent"] || "";
      await recordHit({ ip, ua, slug, keyword: keyword || slug, referrer: referrer || "", sessionId, utmSource, utmMedium, utmCampaign });
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ ok: false });
    }
  });

  app.post("/api/analytics/duration", async (req, res) => {
    try {
      let body = req.body;
      if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
      const { sessionId, slug, duration } = body || {};
      if (sessionId && slug && duration > 0) await updateDuration(sessionId, slug, duration);
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ ok: false });
    }
  });

  app.post("/api/analytics/button", async (req, res) => {
    try {
      const { type, slug, sessionId } = req.body;
      if (!type) return res.status(400).json({ ok: false });
      const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
      const ua = req.headers["user-agent"] || "";
      await recordButton({ ip, ua, type, slug: slug || "", sessionId });
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ ok: false });
    }
  });

  app.post("/api/analytics/login", (req, res) => {
    const { username, password } = req.body;
    if (ADMIN_USER && ADMIN_PASS && username === ADMIN_USER && password === ADMIN_PASS) {
      const token = createSession();
      return res.json({ token });
    }
    return res.status(401).json({ error: "Hatalı giriş" });
  });

  app.get("/api/analytics/data", (req, res) => {
    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "");
    if (!validateSession(token)) return res.status(401).json({ error: "Yetkisiz" });
    const period = (req.query.period as string) || "week";
    return res.json(getAnalyticsData(period));
  });

  return httpServer;
}

function getRelated(keyword: string, slug: string, all: Array<{ keyword: string; slug: string }>) {
  const words = keyword.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const scored = all
    .filter(k => k.slug !== slug)
    .map(k => {
      const kWords = k.keyword.toLowerCase().split(/\s+/);
      const score = words.reduce((acc, w) => acc + (kWords.some(kw => kw.includes(w) || w.includes(kw)) ? 1 : 0), 0);
      return { ...k, score };
    })
    .filter(k => k.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  return scored.map(k => ({ keyword: k.keyword, slug: k.slug }));
}
