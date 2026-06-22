import { useEffect, useRef } from "react";
import { randomUUID } from "crypto";

function getSessionId(): string {
  let id = sessionStorage.getItem("ep_session");
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("ep_session", id); }
  return id;
}

function getUtm() {
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: p.get("utm_source") || "",
    utmMedium: p.get("utm_medium") || "",
    utmCampaign: p.get("utm_campaign") || "",
  };
}

export function useTrack(slug: string, keyword: string) {
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!slug) return;
    startRef.current = Date.now();
    const sessionId = getSessionId();
    const referrer = document.referrer || "";
    const utm = getUtm();

    fetch("/api/analytics/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, keyword, referrer, sessionId, ...utm }),
      keepalive: true,
    }).catch(() => {});

    const sendDuration = () => {
      const duration = Math.round((Date.now() - startRef.current) / 1000);
      if (duration < 2) return;
      const blob = new Blob(
        [JSON.stringify({ sessionId, slug, duration })],
        { type: "application/json" }
      );
      navigator.sendBeacon("/api/analytics/duration", blob);
    };

    const onVisibility = () => { if (document.visibilityState === "hidden") sendDuration(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", sendDuration);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", sendDuration);
    };
  }, [slug]);
}
