import { TwitterApi } from "twitter-api-v2";
import { PHONE_INTL, WHATSAPP_NUMBER } from "@shared/store-info";

const SITE = "https://www.enuygun.pet";
const STORE_INFO = `📍 Samsun Atakum | ⏰ 09:00-21:00 | 📞 ${PHONE_INTL}`;

function buildTweetText(keyword: string, slug: string): string {
  const url = `${SITE}/${slug}`;
  const tags = "#samsunpetshop #atakumpetshop #evcilhayvan #petshop #samsun";
  return `🐾 ${keyword} arıyorsanız EnuygunPet'te!\n\n${STORE_INFO}\n\n🔗 ${url}\n\n${tags}`;
}

function buildFacebookText(keyword: string, slug: string): string {
  const url = `${SITE}/${slug}`;
  return `🐾 ${keyword} — En Uygun Fiyat Samsun Atakum'da!\n\nEnuygunPet Gross Market olarak ${keyword} ürünlerinde en geniş stok ve en uygun fiyat garantisiyle hizmetinizdeyiz.\n\n${STORE_INFO}\n📲 WhatsApp: wa.me/${WHATSAPP_NUMBER}\n🌐 ${url}`;
}

function buildInstagramCaption(keyword: string, slug: string): string {
  const url = `${SITE}/${slug}`;
  return `🐾 ${keyword}\n\n${STORE_INFO}\n\n🔗 Linke tıkla → ${url}\n\n#samsunpetshop #atakumpetshop #evcilhayvan #petshop #samsun #kedimaması #köpekmaması #enuygunpet`;
}

export interface PostResult {
  platform: string;
  success: boolean;
  id?: string;
  error?: string;
}

export async function postToTwitter(keyword: string, slug: string): Promise<PostResult> {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { platform: "twitter", success: false, error: "API anahtarları eksik" };
  }

  try {
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken,
      accessSecret,
    });
    const text = buildTweetText(keyword, slug);
    const tweet = await client.v2.tweet(text);
    return { platform: "twitter", success: true, id: tweet.data.id };
  } catch (err: any) {
    return { platform: "twitter", success: false, error: err.message };
  }
}

export async function postToFacebook(keyword: string, slug: string): Promise<PostResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    return { platform: "facebook", success: false, error: "API anahtarları eksik" };
  }

  try {
    const message = buildFacebookText(keyword, slug);
    const url = `${SITE}/${slug}`;
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, link: url, access_token: accessToken }),
      }
    );
    const data = await res.json() as any;
    if (data.id) return { platform: "facebook", success: true, id: data.id };
    return { platform: "facebook", success: false, error: data.error?.message || "Bilinmeyen hata" };
  } catch (err: any) {
    return { platform: "facebook", success: false, error: err.message };
  }
}

export async function postToInstagram(keyword: string, slug: string): Promise<PostResult> {
  const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!igUserId || !accessToken) {
    return { platform: "instagram", success: false, error: "API anahtarları eksik" };
  }

  const IMGS: Record<string, string> = {
    kus: "https://www.enuygun.pet/images/magaza/kus-1200.webp",
    kopek: "https://www.enuygun.pet/images/magaza/kopek-1200.webp",
    kedi: "https://www.enuygun.pet/images/magaza/kedi-1200.webp",
    genel: "https://www.enuygun.pet/images/magaza/magaza-1200.webp",
  };
  function pickImg(kw: string) {
    const k = kw.toLowerCase();
    if (k.includes("kuş") || k.includes("papağan") || k.includes("kanarya")) return IMGS.kus;
    if (k.includes("köpek")) return IMGS.kopek;
    if (k.includes("kedi")) return IMGS.kedi;
    return IMGS.genel;
  }

  try {
    const caption = buildInstagramCaption(keyword, slug);
    const imageUrl = pickImg(keyword);

    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl, caption, access_token: accessToken }),
      }
    );
    const container = await containerRes.json() as any;
    if (!container.id) {
      return { platform: "instagram", success: false, error: container.error?.message || "Container oluşturulamadı" };
    }

    await new Promise(r => setTimeout(r, 2000));

    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creation_id: container.id, access_token: accessToken }),
      }
    );
    const published = await publishRes.json() as any;
    if (published.id) return { platform: "instagram", success: true, id: published.id };
    return { platform: "instagram", success: false, error: published.error?.message || "Yayınlanamadı" };
  } catch (err: any) {
    return { platform: "instagram", success: false, error: err.message };
  }
}

export async function postToAllPlatforms(keyword: string, slug: string): Promise<PostResult[]> {
  const results = await Promise.allSettled([
    postToTwitter(keyword, slug),
    postToFacebook(keyword, slug),
    postToInstagram(keyword, slug),
  ]);
  return results.map(r => r.status === "fulfilled" ? r.value : { platform: "unknown", success: false, error: "İstek başarısız" });
}
