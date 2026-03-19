import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import keywordsData from "./keywords.json";

const keywords = keywordsData as Array<{ keyword: string; slug: string }>;
const keywordBySlug = new Map(keywords.map(k => [k.slug, k]));

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/sitemap.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];

    const IMGS = [
      { loc: "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg", base: "EnuygunPet Samsun Atakum petshop gross market mağaza" },
      { loc: "https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg", base: "Atakum petshop ürün reyonları kedi köpek mama" },
      { loc: "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg", base: "Samsun pet shop kedi ürünleri mama kumu aksesuar" },
      { loc: "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg", base: "Samsun Atakum köpek mama aksesuar petshop" },
      { loc: "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg", base: "Samsun petshop kuş yemi kafes malzemeleri" },
    ];

    function pickImg(kw: string) {
      const k = kw.toLowerCase();
      if (k.includes("kuş") || k.includes("kus") || k.includes("papağan") || k.includes("kanarya")) return IMGS[4];
      if (k.includes("köpek") || k.includes("kopek")) return IMGS[3];
      if (k.includes("kedi") && (k.includes("kum") || k.includes("ödül") || k.includes("odul"))) return IMGS[2];
      if (k.includes("kedi")) return IMGS[2];
      return IMGS[0];
    }

    const keywordUrls = keywords
      .map(k => {
        const img = pickImg(k.keyword);
        const altTitle = `${k.keyword} - Samsun Atakum EnuygunPet Petshop`;
        return `  <url>\n    <loc>https://www.enuygun.pet/${k.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <image:image>\n      <image:loc>${img.loc}</image:loc>\n      <image:title>${altTitle}</image:title>\n      <image:caption>${img.base} - ${k.keyword}</image:caption>\n    </image:image>\n  </url>`;
      })
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.enuygun.pet/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg</image:loc>
      <image:title>EnuygunPet Samsun Atakum Petshop Gross Market</image:title>
      <image:caption>Samsun Atakum'un en büyük petshop gross marketi - mağaza ön görünüm</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_f5ae600f104c4dfcae521fe694ba017b~mv2.jpeg</image:loc>
      <image:title>Atakum petshop ürün reyonları</image:title>
    </image:image>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg</image:loc>
      <image:title>Samsun pet shop kedi ürünleri</image:title>
    </image:image>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg</image:loc>
      <image:title>Köpek aksesuarları Atakum</image:title>
    </image:image>
    <image:image>
      <image:loc>https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg</image:loc>
      <image:title>Kuş yemleri ve kafesleri</image:title>
    </image:image>
  </url>
${keywordUrls}
</urlset>`;
    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(sitemap);
  });

  app.get("/robots.txt", (_req, res) => {
    const robots = `User-agent: *
Allow: /

Sitemap: https://www.enuygun.pet/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Yandex
Allow: /
`;
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(robots);
  });

  app.get("/rss.xml", (_req, res) => {
    const IMGS: Record<string, string> = {
      kus: "https://static.wixstatic.com/media/63853e_346d0d0b96154639b0a27296b18d70f5~mv2.jpeg",
      kopek: "https://static.wixstatic.com/media/63853e_ba5ea5e88a5a41409f4742caf8dced1c~mv2.jpeg",
      kedi: "https://static.wixstatic.com/media/63853e_4c33bdb1dc274eab8358c2d598f7cfee~mv2.jpeg",
      genel: "https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg",
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
    const items = rotated.slice(0, 50);

    const pubDate = new Date().toUTCString();

    const rssItems = items.map(k => {
      const url = `https://www.enuygun.pet/${k.slug}`;
      const img = pickRssImg(k.keyword);
      const desc = `Samsun Atakum'da ${k.keyword} için EnuygunPet Gross Market. En uygun fiyat, geniş stok. Haftanın her günü 09:00-21:00 açık. WhatsApp: +905422114944`;
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
      <url>https://static.wixstatic.com/media/63853e_77a3ee3fa9d942a7af5b6f25a0520653~mv2.jpeg</url>
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
    res.json(keywords);
  });

  app.get("/api/keyword/:slug", (req, res) => {
    const { slug } = req.params;
    const kw = keywordBySlug.get(slug);
    if (!kw) return res.status(404).json({ message: "Not found" });

    const related = getRelated(kw.keyword, kw.slug, keywords);
    res.set("Cache-Control", "public, max-age=3600");
    res.json({ ...kw, related });
  });

  app.get("/api/image-proxy", async (req, res) => {
    const imageUrl = req.query.url as string;
    const width = parseInt(req.query.w as string) || 0;
    const quality = parseInt(req.query.q as string) || 80;

    if (!imageUrl) {
      return res.status(400).json({ message: "Missing url parameter" });
    }

    const allowedDomains = ["static.wixstatic.com"];
    try {
      const parsedUrl = new URL(imageUrl);
      if (!allowedDomains.some(d => parsedUrl.hostname.includes(d))) {
        return res.status(403).json({ message: "Domain not allowed" });
      }
    } catch {
      return res.status(400).json({ message: "Invalid URL" });
    }

    try {
      let fetchUrl = imageUrl;
      if (width > 0) {
        fetchUrl = `${imageUrl}/v1/fill/w_${width},q_${quality}/image.jpg`;
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        const fallbackResponse = await fetch(imageUrl);
        if (!fallbackResponse.ok) {
          return res.status(502).json({ message: "Failed to fetch image" });
        }
        res.set({
          "Content-Type": fallbackResponse.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Vary": "Accept",
        });
        const buffer = Buffer.from(await fallbackResponse.arrayBuffer());
        return res.send(buffer);
      }

      res.set({
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Vary": "Accept",
      });

      const buffer = Buffer.from(await response.arrayBuffer());
      return res.send(buffer);
    } catch (err) {
      return res.status(500).json({ message: "Image proxy error" });
    }
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
