import { useEffect } from "react";

function getSessionId(): string {
  let id = sessionStorage.getItem("ep_session");
  if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("ep_session", id); }
  return id;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href") || "";
      let type: string | null = null;
      if (href.includes("wa.me") || href.toLowerCase().includes("whatsapp")) type = "whatsapp";
      else if (href.startsWith("tel:")) type = "phone";
      else if (href.includes("maps.google") || href.includes("google.com/maps")) type = "maps";
      if (!type) return;
      const sessionId = getSessionId();
      const slug = window.location.pathname.replace(/^\//, "") || "anasayfa";
      fetch("/api/analytics/button", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug, sessionId }),
        keepalive: true,
      }).catch(() => {});
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return <>{children}</>;
}
