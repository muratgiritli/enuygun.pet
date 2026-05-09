import fs from "fs";
import path from "path";
import { randomUUID, createHash } from "crypto";

const DATA_FILE = path.join(process.cwd(), "analytics-data.json");
const BTN_FILE  = path.join(process.cwd(), "analytics-buttons.json");
const MAX_HITS  = 100000;
const MAX_BTNS  = 50000;

export interface Hit {
  id: string;
  ts: number;
  slug: string;
  keyword: string;
  city: string;
  region: string;
  country: string;
  device: string;
  os: string;
  browser: string;
  referrer: string;
  visitorId: string;
  ip: string;
  sessionId: string;
  duration: number;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

export interface ButtonClick {
  id: string;
  ts: number;
  type: string;
  slug: string;
  city: string;
  device: string;
  sessionId: string;
}

let hits: Hit[] = [];
let buttons: ButtonClick[] = [];
let hitDirty = false;
let btnDirty = false;

function loadFile<T>(file: string): T[] {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {}
  return [];
}

hits    = loadFile<Hit>(DATA_FILE);
buttons = loadFile<ButtonClick>(BTN_FILE);

setInterval(() => {
  if (hitDirty) { try { fs.writeFileSync(DATA_FILE, JSON.stringify(hits), "utf8"); hitDirty = false; } catch {} }
  if (btnDirty) { try { fs.writeFileSync(BTN_FILE,  JSON.stringify(buttons), "utf8"); btnDirty = false; } catch {} }
}, 30_000);

function detectDevice(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows ce|palm/i.test(ua)) return "Mobil";
  return "Masaüstü";
}

function detectOS(ua: string): string {
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  if (/Windows NT/i.test(ua)) return "Windows";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Diğer";
}

function detectBrowser(ua: string): string {
  if (/SamsungBrowser/i.test(ua)) return "Samsung";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/YaBrowser/i.test(ua)) return "Yandex";
  if (/Firefox\/\d/i.test(ua)) return "Firefox";
  if (/Chrome\/\d/i.test(ua)) return "Chrome";
  if (/Safari\/\d/i.test(ua)) return "Safari";
  if (/MSIE|Trident/i.test(ua)) return "IE";
  return "Diğer";
}

function detectReferrer(ref: string): string {
  if (!ref) return "Direkt";
  if (/google\./i.test(ref)) return "Google";
  if (/instagram\.com/i.test(ref)) return "Instagram";
  if (/facebook\.com|fb\.com/i.test(ref)) return "Facebook";
  if (/twitter\.com|t\.co|x\.com/i.test(ref)) return "Twitter/X";
  if (/youtube\.com/i.test(ref)) return "YouTube";
  if (/bing\.com/i.test(ref)) return "Bing";
  if (/yandex\./i.test(ref)) return "Yandex";
  if (/tiktok\.com/i.test(ref)) return "TikTok";
  return "Diğer";
}

function maskIp(ip: string): string {
  const clean = ip.split(",")[0].trim();
  const parts = clean.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.xxx.xxx`;
  return clean.slice(0, 8) + "...";
}

const geoCache = new Map<string, { city: string; region: string; country: string }>();

async function geoLookup(ip: string): Promise<{ city: string; region: string; country: string }> {
  const cleanIp = ip.split(",")[0].trim();
  if (!cleanIp || cleanIp === "127.0.0.1" || cleanIp === "::1" ||
      cleanIp.startsWith("192.168") || cleanIp.startsWith("10.") || cleanIp.startsWith("172.")) {
    return { city: "Yerel", region: "", country: "TR" };
  }
  if (geoCache.has(cleanIp)) return geoCache.get(cleanIp)!;
  try {
    const res = await fetch(
      `http://ip-api.com/json/${cleanIp}?fields=status,city,regionName,country,countryCode&lang=tr`,
      { signal: AbortSignal.timeout(3000) }
    );
    const d = await res.json() as any;
    if (d.status === "success") {
      const geo = { city: d.city || "Bilinmiyor", region: d.regionName || "", country: d.countryCode || "" };
      geoCache.set(cleanIp, geo);
      return geo;
    }
  } catch {}
  return { city: "Bilinmiyor", region: "", country: "" };
}

export async function recordHit(opts: {
  ip: string; ua: string; slug: string; keyword: string; referrer: string;
  sessionId?: string; duration?: number;
  utmSource?: string; utmMedium?: string; utmCampaign?: string;
}) {
  const geo = await geoLookup(opts.ip);
  const visitorId = createHash("sha256").update(opts.ip + opts.ua).digest("hex").slice(0, 16);
  const hit: Hit = {
    id: randomUUID(),
    ts: Date.now(),
    slug: opts.slug,
    keyword: opts.keyword || opts.slug,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    device: detectDevice(opts.ua),
    os: detectOS(opts.ua),
    browser: detectBrowser(opts.ua),
    referrer: detectReferrer(opts.referrer),
    visitorId,
    ip: maskIp(opts.ip),
    sessionId: opts.sessionId || "",
    duration: opts.duration || 0,
    utmSource: opts.utmSource || "",
    utmMedium: opts.utmMedium || "",
    utmCampaign: opts.utmCampaign || "",
  };
  hits.unshift(hit);
  if (hits.length > MAX_HITS) hits = hits.slice(0, MAX_HITS);
  hitDirty = true;
  return hit;
}

export async function updateDuration(sessionId: string, slug: string, duration: number) {
  const hit = hits.find(h => h.sessionId === sessionId && h.slug === slug);
  if (hit) { hit.duration = duration; hitDirty = true; }
}

export async function recordButton(opts: {
  ip: string; ua: string; type: string; slug: string; sessionId?: string;
}) {
  const geo = await geoLookup(opts.ip);
  const btn: ButtonClick = {
    id: randomUUID(),
    ts: Date.now(),
    type: opts.type,
    slug: opts.slug,
    city: geo.city,
    device: detectDevice(opts.ua),
    sessionId: opts.sessionId || "",
  };
  buttons.unshift(btn);
  if (buttons.length > MAX_BTNS) buttons = buttons.slice(0, MAX_BTNS);
  btnDirty = true;
  return btn;
}

function msFilter(period: string): number {
  if (period === "today") return 86400000;
  if (period === "week") return 604800000;
  if (period === "month") return 2592000000;
  return Infinity;
}

function top(map: Map<string, number>, limit = 10) {
  return [...map.entries()]
    .filter(([name]) => !!name && name !== "undefined")
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function getAnalyticsData(period = "week") {
  const now = Date.now();
  const ms = msFilter(period);
  const data = hits.filter(h => now - h.ts <= ms);
  const btnData = buttons.filter(b => now - b.ts <= ms);

  const keywordMap = new Map<string, number>();
  const cityMap = new Map<string, number>();
  const deviceMap = new Map<string, number>();
  const osMap = new Map<string, number>();
  const browserMap = new Map<string, number>();
  const referrerMap = new Map<string, number>();
  const utmSourceMap = new Map<string, number>();
  const utmCampaignMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();
  const visitorSet = new Set<string>();
  const sessionSet = new Set<string>();
  const firstVisit = new Map<string, number>();
  const lastVisit = new Map<string, number>();

  let totalDuration = 0;
  let durationCount = 0;

  for (const h of data) {
    keywordMap.set(h.keyword || h.slug, (keywordMap.get(h.keyword || h.slug) || 0) + 1);
    if (h.city) cityMap.set(h.city, (cityMap.get(h.city) || 0) + 1);
    if (h.device) deviceMap.set(h.device, (deviceMap.get(h.device) || 0) + 1);
    if (h.os) osMap.set(h.os, (osMap.get(h.os) || 0) + 1);
    if (h.browser) browserMap.set(h.browser, (browserMap.get(h.browser) || 0) + 1);
    if (h.referrer) referrerMap.set(h.referrer, (referrerMap.get(h.referrer) || 0) + 1);
    if (h.utmSource) utmSourceMap.set(h.utmSource, (utmSourceMap.get(h.utmSource) || 0) + 1);
    if (h.utmCampaign) utmCampaignMap.set(h.utmCampaign, (utmCampaignMap.get(h.utmCampaign) || 0) + 1);

    const day = new Date(h.ts).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
    dailyMap.set(day, (dailyMap.get(day) || 0) + 1);

    visitorSet.add(h.visitorId);
    if (h.sessionId) sessionSet.add(h.sessionId);

    if (h.visitorId) {
      const prev = firstVisit.get(h.visitorId);
      if (!prev || h.ts < prev) firstVisit.set(h.visitorId, h.ts);
      const last = lastVisit.get(h.visitorId);
      if (!last || h.ts > last) lastVisit.set(h.visitorId, h.ts);
    }

    if (h.duration > 0) { totalDuration += h.duration; durationCount++; }
  }

  const btnTypeMap = new Map<string, number>();
  const btnDailyMap = new Map<string, number>();
  for (const b of btnData) {
    const label = b.type === "whatsapp" ? "WhatsApp" : b.type === "phone" ? "Telefon" : "Yol Tarifi";
    btnTypeMap.set(label, (btnTypeMap.get(label) || 0) + 1);
    const day = new Date(b.ts).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
    btnDailyMap.set(day, (btnDailyMap.get(day) || 0) + 1);
  }

  const sessionPageMap = new Map<string, Set<string>>();
  for (const h of data) {
    if (!h.sessionId) continue;
    if (!sessionPageMap.has(h.sessionId)) sessionPageMap.set(h.sessionId, new Set());
    sessionPageMap.get(h.sessionId)!.add(h.slug);
  }
  const avgPagesPerSession = sessionPageMap.size > 0
    ? Math.round([...sessionPageMap.values()].reduce((a, s) => a + s.size, 0) / sessionPageMap.size * 10) / 10
    : 0;

  return {
    total: data.length,
    uniqueVisitors: visitorSet.size,
    uniqueSessions: sessionSet.size,
    avgDuration: durationCount > 0 ? Math.round(totalDuration / durationCount) : 0,
    avgPagesPerSession,
    topKeywords: top(keywordMap, 20),
    topCities: top(cityMap, 15),
    devices: top(deviceMap, 5),
    os: top(osMap, 8),
    browsers: top(browserMap, 8),
    referrers: top(referrerMap, 10),
    utmSources: top(utmSourceMap, 10),
    utmCampaigns: top(utmCampaignMap, 10),
    daily: [...dailyMap.entries()].slice(-14).map(([date, count]) => ({ date, count })),
    buttons: {
      total: btnData.length,
      breakdown: top(btnTypeMap, 5),
      recent: btnData.slice(0, 30).map(b => ({
        ts: b.ts, type: b.type, slug: b.slug, city: b.city, device: b.device,
      })),
    },
    recent: data.slice(0, 150).map(h => ({
      ts: h.ts,
      keyword: h.keyword,
      city: h.city,
      device: h.device,
      os: h.os,
      browser: h.browser,
      referrer: h.referrer,
      ip: h.ip,
      sessionId: h.sessionId,
      duration: h.duration,
      utmSource: h.utmSource,
      utmCampaign: h.utmCampaign,
    })),
  };
}

const sessions = new Map<string, number>();
export function createSession(): string {
  const token = randomUUID();
  sessions.set(token, Date.now() + 86400000 * 7);
  return token;
}
export function validateSession(token: string): boolean {
  const exp = sessions.get(token);
  if (!exp) return false;
  if (Date.now() > exp) { sessions.delete(token); return false; }
  return true;
}
