import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const TRAFFIC_FILE = path.join(process.cwd(), "traffic-data.json");
const ACTIONS_FILE = path.join(process.cwd(), "traffic-actions.json");
const MAX_LOGS = 50000;
export const TRAFIK_PASS = "samsun3455";

export interface TrafficLog {
  id: string;
  ts: number;
  timeStr: string;
  ip: string;
  city: string;
  district: string;
  region: string;
  country: string;
  countryCode: string;
  lat?: number;
  lon?: number;
  isp: string;
  org: string;
  path: string;
  referrer: string;
  referrerSource: string;
  searchQuery: string;
  device: string;
  os: string;
  browser: string;
  ua: string;
  isBot: boolean;
  botName: string;
  actions?: string[]; // ["phone", "directions"]
}

export interface ActionLog {
  id: string;
  ts: number;
  timeStr: string;
  ip: string;
  city: string;
  district: string;
  action: "phone" | "directions";
  actionLabel: string;
  path: string;
  device: string;
}

let trafficLogs: TrafficLog[] = [];
let actionLogs: ActionLog[] = [];
let isDirty = false;

// Dosyadan yükle
try {
  if (fs.existsSync(TRAFFIC_FILE)) {
    trafficLogs = JSON.parse(fs.readFileSync(TRAFFIC_FILE, "utf-8"));
  }
} catch {
  trafficLogs = [];
}

try {
  if (fs.existsSync(ACTIONS_FILE)) {
    actionLogs = JSON.parse(fs.readFileSync(ACTIONS_FILE, "utf-8"));
  }
} catch {
  actionLogs = [];
}

// Periyodik kaydet
setInterval(() => {
  if (isDirty) {
    try {
      fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(trafficLogs.slice(0, MAX_LOGS)), "utf-8");
      fs.writeFileSync(ACTIONS_FILE, JSON.stringify(actionLogs.slice(0, 10000)), "utf-8");
      isDirty = false;
    } catch {}
  }
}, 10000);

// IP Geolocation Önbelleği
interface GeoResult {
  city: string;
  district: string;
  region: string;
  country: string;
  countryCode: string;
  lat?: number;
  lon?: number;
  isp: string;
  org: string;
}
const geoCache = new Map<string, GeoResult>();

async function lookupGeo(ip: string): Promise<GeoResult> {
  const cleanIp = ip.split(",")[0].trim();
  if (!cleanIp || cleanIp === "127.0.0.1" || cleanIp === "::1" ||
      cleanIp.startsWith("192.168") || cleanIp.startsWith("10.") || cleanIp.startsWith("172.")) {
    return {
      city: "Samsun (Yerel Ağ)",
      district: "Atakum",
      region: "Karadeniz",
      country: "Türkiye",
      countryCode: "TR",
      lat: 41.3496,
      lon: 36.2418,
      isp: "Localhost",
      org: "Local Network"
    };
  }

  if (geoCache.has(cleanIp)) {
    return geoCache.get(cleanIp)!;
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${cleanIp}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,isp,org,as,query&lang=tr`,
      { signal: AbortSignal.timeout(3500) }
    );
    const data = await res.json() as any;
    if (data.status === "success") {
      const result: GeoResult = {
        city: data.city || "Bilinmiyor",
        district: data.district || data.zip || "",
        region: data.regionName || "",
        country: data.country || "Türkiye",
        countryCode: data.countryCode || "TR",
        lat: typeof data.lat === "number" ? data.lat : undefined,
        lon: typeof data.lon === "number" ? data.lon : undefined,
        isp: data.isp || "",
        org: data.org || ""
      };
      geoCache.set(cleanIp, result);
      return result;
    }
  } catch {}

  const fallback: GeoResult = {
    city: "Bilinmiyor",
    district: "",
    region: "",
    country: "Türkiye",
    countryCode: "TR",
    lat: 41.3496,
    lon: 36.2418,
    isp: "",
    org: ""
  };
  geoCache.set(cleanIp, fallback);
  return fallback;
}

function detectDevice(ua: string): string {
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) return "Mobil";
  return "Masaüstü";
}

function detectOS(ua: string): string {
  if (/iPhone/i.test(ua)) return "iOS (iPhone)";
  if (/iPad/i.test(ua)) return "iPadOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Windows NT 10.0/i.test(ua)) return "Windows 10/11";
  if (/Windows NT/i.test(ua)) return "Windows";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Diğer";
}

function detectBrowser(ua: string): string {
  if (/SamsungBrowser/i.test(ua)) return "Samsung Internet";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/YaBrowser/i.test(ua)) return "Yandex Browser";
  if (/Firefox\/\d/i.test(ua)) return "Firefox";
  if (/Chrome\/\d/i.test(ua)) return "Chrome";
  if (/Safari\/\d/i.test(ua)) return "Safari";
  return "Diğer";
}

function detectBot(ua: string, isp = "", org = ""): { isBot: boolean; name: string } {
  const bots: [RegExp, string][] = [
    [/googlebot/i, "Googlebot"],
    [/bingbot/i, "Bingbot"],
    [/yandex(bot|images|metrika)/i, "YandexBot"],
    [/duckduckbot/i, "DuckDuckGo"],
    [/baiduspider/i, "Baidu"],
    [/applebot/i, "Applebot"],
    [/facebookexternalhit/i, "FacebookBot"],
    [/twitterbot/i, "TwitterBot"],
    [/whatsapp/i, "WhatsApp Bot"],
    [/telegrambot/i, "TelegramBot"],
    [/ahrefsbot/i, "AhrefsBot"],
    [/semrushbot/i, "SemrushBot"],
    [/seranking/i, "SERankingBot"],
    [/dotbot/i, "DotBot"],
    [/mj12bot/i, "MJ12bot"],
    [/uptimerobot/i, "UptimeRobot"],
    [/petalbot/i, "PetalBot"],
    [/dataforseo/i, "DataForSeoBot"],
    [/bytespider/i, "ByteDance Spider"],
    [/python-requests|aiohttp|urllib/i, "Python Bot"],
    [/go-http-client/i, "Go Bot"],
    [/curl|wget/i, "CLI / Curl"],
    [/postman/i, "Postman"],
    [/headless/i, "Headless Browser"],
    [/crawler|spider|robot|crawling/i, "Bot / Tarayıcı"]
  ];

  for (const [regex, name] of bots) {
    if (regex.test(ua)) return { isBot: true, name };
  }

  // Veri merkezi kontrolü
  const dc = (isp + " " + org).toLowerCase();
  if (
    dc.includes("hetzner") ||
    dc.includes("digitalocean") ||
    dc.includes("amazon") ||
    dc.includes("aws") ||
    dc.includes("google llc") ||
    dc.includes("microsoft corporation") ||
    dc.includes("linode") ||
    dc.includes("ovh sas") ||
    dc.includes("contabo") ||
    dc.includes("vultr") ||
    dc.includes("leaseweb")
  ) {
    if (!/mobile|iphone|android/i.test(ua)) {
      return { isBot: true, name: "Veri Merkezi / Sunucu" };
    }
  }

  return { isBot: false, name: "" };
}

function parseReferrer(refUrl: string): { source: string; query: string } {
  if (!refUrl) return { source: "Doğrudan Giriş", query: "" };
  try {
    const u = new URL(refUrl);
    const host = u.hostname.toLowerCase();
    const searchParams = u.searchParams;

    let q = searchParams.get("q") || searchParams.get("query") || searchParams.get("p") || "";

    if (host.includes("google.")) {
      return { source: "Google Arama", query: q ? decodeURIComponent(q) : "Organik Arama" };
    }
    if (host.includes("instagram.com")) {
      return { source: "Instagram", query: "" };
    }
    if (host.includes("facebook.com") || host.includes("fb.com")) {
      return { source: "Facebook", query: "" };
    }
    if (host.includes("t.co") || host.includes("twitter.com") || host.includes("x.com")) {
      return { source: "Twitter / X", query: "" };
    }
    if (host.includes("yandex.")) {
      return { source: "Yandex Arama", query: q ? decodeURIComponent(q) : "" };
    }
    if (host.includes("bing.com")) {
      return { source: "Bing Arama", query: q ? decodeURIComponent(q) : "" };
    }
    if (host.includes("youtube.com")) {
      return { source: "YouTube", query: "" };
    }
    if (host.includes("tiktok.com")) {
      return { source: "TikTok", query: "" };
    }
    if (host.includes("enuygun.pet")) {
      return { source: "Site İçi Gezinme", query: "" };
    }
    return { source: host.replace(/^www\./, ""), query: "" };
  } catch {
    return { source: refUrl.slice(0, 30), query: "" };
  }
}

function formatTRTime(d: Date): string {
  // Türkiye saati GMT+3
  const trDate = new Date(d.getTime() + 3 * 3600 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = pad(trDate.getUTCDate());
  const month = pad(trDate.getUTCMonth() + 1);
  const year = trDate.getUTCFullYear();
  const hour = pad(trDate.getUTCHours());
  const min = pad(trDate.getUTCMinutes());
  const sec = pad(trDate.getUTCSeconds());
  return `${day}.${month}.${year} ${hour}:${min}:${sec}`;
}

// Ziyareti Kaydet
export async function trackVisit(req: Request) {
  try {
    const rawIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
    const cleanIp = rawIp.split(",")[0].trim();
    if (!cleanIp) return;

    const ua = req.headers["user-agent"] || "";
    const geo = await lookupGeo(cleanIp);
    const botInfo = detectBot(ua, geo.isp, geo.org);
    const ref = (req.headers["referer"] || req.headers["referrer"] || "") as string;
    const refParsed = parseReferrer(ref);

    const urlObj = new URL(req.originalUrl, "https://www.enuygun.pet");
    let searchQ = refParsed.query;
    if (!searchQ && urlObj.searchParams.has("q")) {
      searchQ = urlObj.searchParams.get("q") || "";
    }
    if (urlObj.searchParams.has("utm_source")) {
      const src = urlObj.searchParams.get("utm_source");
      if (src) refParsed.source = `UTM: ${src}`;
    }

    const now = new Date();
    const entry: TrafficLog = {
      id: randomUUID(),
      ts: now.getTime(),
      timeStr: formatTRTime(now),
      ip: cleanIp,
      city: geo.city,
      district: geo.district,
      region: geo.region,
      country: geo.country,
      countryCode: geo.countryCode,
      lat: geo.lat,
      lon: geo.lon,
      isp: geo.isp,
      org: geo.org,
      path: req.path,
      referrer: ref,
      referrerSource: refParsed.source,
      searchQuery: searchQ,
      device: detectDevice(ua),
      os: detectOS(ua),
      browser: detectBrowser(ua),
      ua: ua.slice(0, 300),
      isBot: botInfo.isBot,
      botName: botInfo.name,
      actions: []
    };

    trafficLogs.unshift(entry);
    if (trafficLogs.length > MAX_LOGS) {
      trafficLogs.pop();
    }
    isDirty = true;
  } catch {}
}

// Müşteri Aksiyonunu Kaydet (Telefon Arama veya Yol Tarifi)
export async function recordAction(req: Request, action: "phone" | "directions", label: string, pagePath = "") {
  try {
    const rawIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
    const cleanIp = rawIp.split(",")[0].trim();
    if (!cleanIp) return;

    const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
    const hit = trafficLogs.find(l => l.ip === cleanIp && l.ts >= thirtyMinAgo);
    if (hit) {
      if (!hit.actions) hit.actions = [];
      if (!hit.actions.includes(action)) {
        hit.actions.push(action);
      }
    }

    const now = new Date();
    actionLogs.unshift({
      id: randomUUID(),
      ts: now.getTime(),
      timeStr: formatTRTime(now),
      ip: cleanIp,
      city: hit ? hit.city : "Bilinmiyor",
      district: hit ? hit.district : "",
      action,
      actionLabel: label,
      path: pagePath || (hit ? hit.path : "/"),
      device: hit ? hit.device : "Mobil"
    });

    if (actionLogs.length > 10000) actionLogs.pop();
    isDirty = true;
  } catch {}
}

// Express Middleware: Sayfa ziyaretlerini otomatik izler
export function trafficMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.method === "GET") {
    const p = req.path;
    const isStatic = p.startsWith("/assets/") ||
      p.startsWith("/api/") ||
      p.startsWith("/trafik") ||
      /\.(js|css|png|jpg|jpeg|webp|ico|svg|woff2?|ttf|eot|xml|txt|json)$/i.test(p);

    if (!isStatic) {
      setImmediate(() => {
        trackVisit(req);
      });
    }
  }
  next();
}

// Oturum Yönetimi
const PERMANENT_TOKEN = "trk_samsun3455_master_session";
const activeSessions = new Set<string>([PERMANENT_TOKEN]);

export function createTrafikToken(): string {
  const token = "trk_" + randomUUID();
  activeSessions.add(token);
  return token;
}

export function verifyTrafikToken(token: string | undefined): boolean {
  if (!token) return false;
  return token === PERMANENT_TOKEN || activeSessions.has(token);
}

// Raporlama Verileri (Aksiyon ve Dönüşüm Takibi Dahil)
export function getTrafficStats(filterPeriod: "all" | "today" | "24h" | "7d" = "all") {
  const now = Date.now();
  let msLimit = Infinity;
  if (filterPeriod === "today" || filterPeriod === "24h") msLimit = 24 * 60 * 60 * 1000;
  if (filterPeriod === "7d") msLimit = 7 * 24 * 60 * 60 * 1000;

  const filtered = trafficLogs.filter(l => (now - l.ts) <= msLimit);
  const filteredActions = actionLogs.filter(a => (now - a.ts) <= msLimit);

  // Ayrılmış Gruplar
  const userLogs = filtered.filter(l => !l.isBot);
  const botLogs = filtered.filter(l => l.isBot);

  // Canlı Çevrimiçi Gerçek Kişiler (Son 5 dk)
  const fiveMinAgo = now - 5 * 60 * 1000;
  const onlineIps = new Set<string>();
  userLogs.forEach(l => {
    if (l.ts >= fiveMinAgo) {
      onlineIps.add(l.ip);
    }
  });

  // Bugün gelenler
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayUserLogs = userLogs.filter(l => l.ts >= todayStart.getTime());
  const todayBotLogs = botLogs.filter(l => l.ts >= todayStart.getTime());
  const todayActions = actionLogs.filter(a => a.ts >= todayStart.getTime());

  // Bugünün Telefon ve Yol Tarifi Sayıları
  const todayPhoneClicks = todayActions.filter(a => a.action === "phone").length;
  const todayDirectionClicks = todayActions.filter(a => a.action === "directions").length;
  const todayTotalActions = todayPhoneClicks + todayDirectionClicks;
  const todayRealUnique = new Set(todayUserLogs.map(l => l.ip)).size;

  // Dönüşüm Oranı (%)
  const conversionRate = todayRealUnique > 0
    ? ((todayTotalActions / todayRealUnique) * 100).toFixed(1)
    : "0.0";

  // Gerçek İnsan Dağılım Hesaplayıcılar
  const cityCount = new Map<string, number>();
  const refCount = new Map<string, number>();
  const pageCount = new Map<string, number>();
  const deviceCount = new Map<string, number>();
  const queryCount = new Map<string, number>();

  userLogs.forEach(l => {
    if (l.city && l.city !== "Bilinmiyor" && l.city !== "Yerel Ağ / Sunucu") {
      const key = l.district ? `${l.city} (${l.district})` : l.city;
      cityCount.set(key, (cityCount.get(key) || 0) + 1);
    }
    if (l.referrerSource) {
      refCount.set(l.referrerSource, (refCount.get(l.referrerSource) || 0) + 1);
    }
    if (l.path) {
      pageCount.set(l.path, (pageCount.get(l.path) || 0) + 1);
    }
    if (l.device) {
      deviceCount.set(l.device, (deviceCount.get(l.device) || 0) + 1);
    }
    if (l.searchQuery && l.searchQuery !== "Organik Arama") {
      queryCount.set(l.searchQuery, (queryCount.get(l.searchQuery) || 0) + 1);
    }
  });

  // Bot Dağılımı
  const botTypeCount = new Map<string, number>();
  botLogs.forEach(b => {
    const name = b.botName || "Bilinmeyen Bot";
    botTypeCount.set(name, (botTypeCount.get(name) || 0) + 1);
  });

  const sortMap = (m: Map<string, number>, limit = 8) =>
    Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));

    // Haritada parlayacak canlı ziyaretçi noktaları (Gerçek kullanıcılar, tekil IP bazlı)
    const markerMap = new Map<string, any>();
    // Son 1 saatteki veya bugün aktif olanları al (en yeniden eskiye sıralı)
    const mapCandidates = userLogs.filter(l => (now - l.ts) <= 60 * 60 * 1000);
    mapCandidates.forEach(l => {
      if (!markerMap.has(l.ip)) {
        let lat = l.lat;
        let lon = l.lon;
        // Koordinat yoksa veya yerelse şehir/ilçe bazlı koordinat ata
        if (!lat || !lon) {
          const c = (l.city || "").toLowerCase();
          const d = (l.district || "").toLowerCase();
          if (c.includes("samsun") || d.includes("atakum") || d.includes("ilkadım") || d.includes("canik")) {
            lat = 41.32 + (Math.random() - 0.5) * 0.05;
            lon = 36.30 + (Math.random() - 0.5) * 0.06;
          } else if (c.includes("istanbul")) {
            lat = 41.0082 + (Math.random() - 0.5) * 0.06;
            lon = 28.9784 + (Math.random() - 0.5) * 0.06;
          } else if (c.includes("ankara")) {
            lat = 39.9334 + (Math.random() - 0.5) * 0.05;
            lon = 32.8597 + (Math.random() - 0.5) * 0.05;
          } else if (c.includes("izmir")) {
            lat = 38.4237 + (Math.random() - 0.5) * 0.05;
            lon = 27.1428 + (Math.random() - 0.5) * 0.05;
          } else {
            // Samsun Atakum varsayılanı
            lat = 41.3496 + (Math.random() - 0.5) * 0.03;
            lon = 36.2418 + (Math.random() - 0.5) * 0.03;
          }
        }
        markerMap.set(l.ip, {
          ip: l.ip,
          lat,
          lon,
          city: l.city || "Samsun",
          district: l.district || "",
          timeStr: l.timeStr,
          isOnline: l.ts >= fiveMinAgo,
          device: l.device,
          page: l.path,
          actions: l.actions || []
        });
      }
    });
    const liveMarkers = Array.from(markerMap.values());

    // Saatlik Ziyaretçi ve Müşteri Aksiyonu Dağılımı (00:00 - 23:00 TSİ)
    const hourlyVisitors = new Array(24).fill(0);
    const hourlyActions = new Array(24).fill(0);

    userLogs.forEach(l => {
      const h = (new Date(l.ts + 3 * 3600 * 1000)).getUTCHours();
      if (h >= 0 && h < 24) {
        hourlyVisitors[h]++;
      }
    });

    filteredActions.forEach(a => {
      const h = (new Date(a.ts + 3 * 3600 * 1000)).getUTCHours();
      if (h >= 0 && h < 24) {
        hourlyActions[h]++;
      }
    });

    let peakHour = 0;
    let peakCount = 0;
    for (let i = 0; i < 24; i++) {
      if (hourlyVisitors[i] > peakCount) {
        peakCount = hourlyVisitors[i];
        peakHour = i;
      }
    }

    const currentTrHour = (new Date(now + 3 * 3600 * 1000)).getUTCHours();

    const hourlyStats = {
      hours: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
      visitors: hourlyVisitors,
      actions: hourlyActions,
      peakHour,
      peakCount,
      peakLabel: `${String(peakHour).padStart(2, "0")}:00 - ${String((peakHour + 1) % 24).padStart(2, "0")}:00`,
      currentHour: currentTrHour
    };

    return {
      onlineCount: onlineIps.size,
      liveMarkers,
      hourlyStats,

    // Gerçek İnsan İstatistikleri
    realHits: userLogs.length,
    realUnique: new Set(userLogs.map(l => l.ip)).size,
    todayRealHits: todayUserLogs.length,
    todayRealUnique,

    // Müşteri Aksiyon & Dönüşüm İstatistikleri
    todayPhoneClicks,
    todayDirectionClicks,
    todayTotalActions,
    conversionRate,
    totalPhoneClicks: actionLogs.filter(a => a.action === "phone").length,
    totalDirectionClicks: actionLogs.filter(a => a.action === "directions").length,

    // Bot İstatistikleri
    botHits: botLogs.length,
    botUnique: new Set(botLogs.map(l => l.ip)).size,
    todayBotHits: todayBotLogs.length,
    topBots: sortMap(botTypeCount, 8),

    // Toplamlar
    totalHits: filtered.length,
    totalUnique: new Set(filtered.map(l => l.ip)).size,

    topCities: sortMap(cityCount, 10),
    topReferrers: sortMap(refCount, 8),
    topPages: sortMap(pageCount, 10),
    topDevices: sortMap(deviceCount, 5),
    topSearches: sortMap(queryCount, 10),

    // Loglar
    userLogs: userLogs.slice(0, 200),
    botLogs: botLogs.slice(0, 200),
    actionLogs: filteredActions.slice(0, 50),
    allLogs: filtered.slice(0, 300)
  };
}

// EXCEL / CSV AKTARIMI (UTF-8 BOM ile Excel uyumlu Türkçe karakter desteği)
export function exportTrafficCsv(period: "all" | "today" | "24h" | "7d" = "all", filterType: "users" | "bots" | "all" = "users"): string {
  const now = Date.now();
  let msLimit = Infinity;
  if (period === "today" || period === "24h") msLimit = 24 * 60 * 60 * 1000;
  if (period === "7d") msLimit = 7 * 24 * 60 * 60 * 1000;

  let list = trafficLogs.filter(l => (now - l.ts) <= msLimit);
  if (filterType === "users") {
    list = list.filter(l => !l.isBot);
  } else if (filterType === "bots") {
    list = list.filter(l => l.isBot);
  }

  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const headers = [
    "Tarih & Saat",
    "Kullanıcı Türü",
    "Müşteri Aksiyonu",
    "IP Adresi",
    "Şehir",
    "İlçe / Mahalle",
    "Bölge",
    "Ülke",
    "Servis Sağlayıcı (ISP)",
    "Ziyaret Edilen Sayfa",
    "Geliş Kaynağı",
    "Arama Kelimesi",
    "Cihaz",
    "İşletim Sistemi",
    "Tarayıcı"
  ];

  const rows = [headers.join(";")];

  for (const l of list) {
    let actionStr = "Aksiyon Yok";
    if (l.actions && l.actions.length > 0) {
      const parts = [];
      if (l.actions.includes("phone")) parts.push("Telefon Etti");
      if (l.actions.includes("directions")) parts.push("Yol Tarifi Aldı");
      actionStr = parts.join(" + ");
    }

    const row = [
      escapeCsv(l.timeStr),
      escapeCsv(l.isBot ? `Bot (${l.botName || 'Bilinmiyor'})` : "Gerçek Ziyaretçi"),
      escapeCsv(actionStr),
      escapeCsv(l.ip),
      escapeCsv(l.city || "Bilinmiyor"),
      escapeCsv(l.district || ""),
      escapeCsv(l.region || ""),
      escapeCsv(l.country || "Türkiye"),
      escapeCsv(l.isp || ""),
      escapeCsv(l.path || "/"),
      escapeCsv(l.referrerSource || l.referrer || "Doğrudan"),
      escapeCsv(l.searchQuery || ""),
      escapeCsv(l.device || "Bilinmiyor"),
      escapeCsv(l.os || "Bilinmiyor"),
      escapeCsv(l.browser || "Bilinmiyor")
    ];
    rows.push(row.join(";"));
  }

  // UTF-8 BOM ekle ki Excel doğrudan Türkçe karakterlerle açsın
  return "\uFEFF" + rows.join("\r\n");
}
