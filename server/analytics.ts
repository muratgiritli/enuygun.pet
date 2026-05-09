import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const DATA_FILE = path.join(process.cwd(), "analytics-data.json");
const MAX_HITS = 50000;

export interface Hit {
  id: string;
  ts: number;
  slug: string;
  keyword: string;
  city: string;
  region: string;
  country: string;
  device: string;
  referrer: string;
}

let hits: Hit[] = [];
let dirty = false;

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      hits = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }
  } catch {
    hits = [];
  }
}

function save() {
  if (!dirty) return;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(hits), "utf8");
    dirty = false;
  } catch {}
}

load();
setInterval(save, 30_000);

function detectDevice(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows ce|palm/i.test(ua)) return "Mobil";
  return "Masaüstü";
}

function detectReferrer(ref: string): string {
  if (!ref) return "Direkt";
  if (/google\.com/i.test(ref)) return "Google";
  if (/instagram\.com/i.test(ref)) return "Instagram";
  if (/facebook\.com/i.test(ref)) return "Facebook";
  if (/twitter\.com|t\.co|x\.com/i.test(ref)) return "Twitter/X";
  if (/youtube\.com/i.test(ref)) return "YouTube";
  if (/bing\.com/i.test(ref)) return "Bing";
  if (/yandex\./i.test(ref)) return "Yandex";
  return "Diğer";
}

const geoCache = new Map<string, { city: string; region: string; country: string }>();

async function geoLookup(ip: string): Promise<{ city: string; region: string; country: string }> {
  const cleanIp = ip.split(",")[0].trim();
  if (cleanIp === "127.0.0.1" || cleanIp === "::1" || cleanIp.startsWith("192.168") || cleanIp.startsWith("10.")) {
    return { city: "Yerel", region: "", country: "TR" };
  }
  if (geoCache.has(cleanIp)) return geoCache.get(cleanIp)!;
  try {
    const res = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,city,regionName,country,countryCode&lang=tr`, {
      signal: AbortSignal.timeout(3000),
    });
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
  ip: string;
  ua: string;
  slug: string;
  keyword: string;
  referrer: string;
}) {
  const geo = await geoLookup(opts.ip);
  const hit: Hit = {
    id: randomUUID(),
    ts: Date.now(),
    slug: opts.slug,
    keyword: opts.keyword || opts.slug,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    device: detectDevice(opts.ua),
    referrer: detectReferrer(opts.referrer),
  };
  hits.unshift(hit);
  if (hits.length > MAX_HITS) hits = hits.slice(0, MAX_HITS);
  dirty = true;
  return hit;
}

function filterByPeriod(period: string): Hit[] {
  const now = Date.now();
  const ms = period === "today" ? 86400000
    : period === "week" ? 604800000
    : period === "month" ? 2592000000
    : Infinity;
  return hits.filter(h => now - h.ts <= ms);
}

export function getAnalyticsData(period = "week") {
  const data = filterByPeriod(period);

  const keywordCount = new Map<string, number>();
  const cityCount = new Map<string, number>();
  const deviceCount = new Map<string, number>();
  const referrerCount = new Map<string, number>();
  const dailyCount = new Map<string, number>();

  for (const h of data) {
    keywordCount.set(h.keyword, (keywordCount.get(h.keyword) || 0) + 1);
    cityCount.set(h.city, (cityCount.get(h.city) || 0) + 1);
    deviceCount.set(h.device, (deviceCount.get(h.device) || 0) + 1);
    referrerCount.set(h.referrer, (referrerCount.get(h.referrer) || 0) + 1);
    const day = new Date(h.ts).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
    dailyCount.set(day, (dailyCount.get(day) || 0) + 1);
  }

  const top = (map: Map<string, number>, limit = 10) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([name, count]) => ({ name, count }));

  return {
    total: data.length,
    topKeywords: top(keywordCount, 20),
    topCities: top(cityCount, 15),
    devices: top(deviceCount, 5),
    referrers: top(referrerCount, 10),
    daily: [...dailyCount.entries()].slice(-14).map(([date, count]) => ({ date, count })),
    recent: data.slice(0, 100).map(h => ({
      ts: h.ts,
      keyword: h.keyword,
      city: h.city,
      device: h.device,
      referrer: h.referrer,
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
