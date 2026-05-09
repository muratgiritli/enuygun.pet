import { useEffect } from "react";

export function useTrack(slug: string, keyword: string) {
  useEffect(() => {
    if (!slug) return;
    const referrer = document.referrer || "";
    fetch("/api/analytics/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, keyword, referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);
}
