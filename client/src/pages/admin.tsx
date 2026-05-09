import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

const TOKEN_KEY = "ep_admin_token";

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
  el.content = content;
}

function fmtDuration(sec: number): string {
  if (!sec) return "—";
  if (sec < 60) return `${sec}sn`;
  return `${Math.floor(sec / 60)}dk ${sec % 60}sn`;
}

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function typeInfo(t: string) {
  if (t === "whatsapp") return { label: "WhatsApp", color: "bg-green-100 text-green-700", icon: "💬" };
  if (t === "phone") return { label: "Telefon", color: "bg-blue-100 text-blue-700", icon: "📞" };
  return { label: "Yol Tarifi", color: "bg-amber-100 text-amber-700", icon: "📍" };
}

function deviceIcon(d: string) {
  if (d === "Mobil") return "📱";
  if (d === "Tablet") return "📲";
  return "💻";
}

function referrerIcon(r: string) {
  if (r === "Google") return "🔍";
  if (r === "Instagram") return "📸";
  if (r === "Facebook") return "👥";
  if (r === "Twitter/X") return "𝕏";
  if (r === "YouTube") return "▶";
  if (r === "Direkt") return "🔗";
  return "🌐";
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className={`rounded-2xl p-4 shadow-sm border ${color || "bg-white border-gray-100"}`}>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}

function BarChart({ data, color = "bg-green-500" }: { data: { name: string; count: number }[]; color?: string }) {
  if (!data || !data.length) return <p className="text-gray-400 text-sm py-4 text-center">Veri yok</p>;
  const max = Math.max(...data.map(d => d.count));
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.name} className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-28 truncate shrink-0">{d.name}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div className={`h-5 rounded-full ${color} transition-all`} style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
          <span className="text-xs font-semibold text-gray-700 w-8 text-right">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

function DailyChart({ data }: { data: { date: string; count: number }[] }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-28 pt-2">
      {data.map(d => (
        <div key={d.date} className="flex flex-col items-center flex-1 gap-1">
          <div
            className="w-full bg-green-500 rounded-t"
            style={{ height: `${Math.max((d.count / max) * 80, 2)}px` }}
            title={`${d.date}: ${d.count} ziyaret`}
          />
          <span className="text-[9px] text-gray-400 whitespace-nowrap">{d.date}</span>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <h2 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_KEY) || "");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [period, setPeriod] = useState("week");
  const [activeTab, setActiveTab] = useState<"overview" | "traffic" | "buttons" | "visitors">("overview");

  useEffect(() => {
    document.title = "Admin | EnuygunPet Analytics";
    setMeta("robots", "noindex, nofollow");
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const r = await fetch("/api/analytics/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loginUser, password: loginPass }),
    });
    if (r.ok) {
      const { token: t } = await r.json();
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
    } else {
      setLoginError("Kullanıcı adı veya şifre hatalı.");
    }
  }

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/analytics/data", period],
    queryFn: () =>
      fetch(`/api/analytics/data?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(r => {
        if (r.status === 401) { localStorage.removeItem(TOKEN_KEY); setToken(""); }
        return r.json();
      }),
    enabled: !!token,
    refetchInterval: 30000,
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🐾</div>
            <h1 className="text-xl font-bold text-green-700">EnuygunPet Admin</h1>
            <p className="text-sm text-gray-500">Analitik Paneli</p>
          </div>
          <input
            data-testid="input-username"
            type="text"
            placeholder="Kullanıcı adı"
            value={loginUser}
            onChange={e => setLoginUser(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            data-testid="input-password"
            type="password"
            placeholder="Şifre"
            value={loginPass}
            onChange={e => setLoginPass(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {loginError && <p className="text-red-500 text-sm mb-3 text-center">{loginError}</p>}
          <button
            data-testid="button-login"
            type="submit"
            className="w-full bg-green-600 text-white rounded-xl py-3 font-semibold hover:bg-green-700 transition"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-4 sticky top-0 z-50 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-sm">EnuygunPet Analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              data-testid="select-period"
              value={period}
              onChange={e => {
                setPeriod(e.target.value);
                queryClient.invalidateQueries({ queryKey: ["/api/analytics/data"] });
              }}
              className="bg-green-600 text-white text-xs rounded-lg px-2 py-1 border border-green-500"
            >
              <option value="today">Bugün</option>
              <option value="week">Son 7 gün</option>
              <option value="month">Son 30 gün</option>
              <option value="all">Tümü</option>
            </select>
            <button
              data-testid="button-refresh"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/analytics/data"] })}
              className="text-xs bg-green-800 px-3 py-1 rounded-lg hover:bg-green-900"
            >
              🔄
            </button>
            <button
              data-testid="button-logout"
              onClick={() => { localStorage.removeItem(TOKEN_KEY); setToken(""); }}
              className="text-xs bg-green-800 px-3 py-1 rounded-lg hover:bg-green-900"
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[60px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex overflow-x-auto">
          {(["overview", "traffic", "buttons", "visitors"] as const).map(tab => (
            <button
              key={tab}
              data-testid={`tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === tab ? "border-green-600 text-green-700" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "overview" && "📊 Genel Bakış"}
              {tab === "traffic" && "🔍 Trafik & Kaynak"}
              {tab === "buttons" && "👆 Buton Tıklamaları"}
              {tab === "visitors" && "👤 Ziyaretçiler"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-4 space-y-4">
        {isLoading && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl animate-pulse mb-2">📊</div>
            <p>Veriler yükleniyor...</p>
          </div>
        )}

        {/* ── GENEL BAKIŞ ── */}
        {data && activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Toplam Ziyaret" value={(data.total || 0).toLocaleString("tr-TR")} color="bg-green-50 border-green-200" />
              <StatCard label="Tekil Ziyaretçi" value={(data.uniqueVisitors || 0).toLocaleString("tr-TR")} color="bg-blue-50 border-blue-200" />
              <StatCard label="Ort. Sayfa Süresi" value={fmtDuration(data.avgDuration || 0)} color="bg-amber-50 border-amber-200" />
              <StatCard label="Buton Tıklama" value={(data.buttons?.total || 0).toLocaleString("tr-TR")} color="bg-purple-50 border-purple-200" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard label="Oturum Sayısı" value={(data.uniqueSessions || 0).toLocaleString("tr-TR")} />
              <StatCard label="Ort. Sayfa/Oturum" value={data.avgPagesPerSession || 0} />
              <StatCard label="WhatsApp Tıklama" value={data.buttons?.breakdown?.find((b: any) => b.name === "WhatsApp")?.count || 0} />
            </div>

            <Section title="📈 Günlük Ziyaretçi">
              <DailyChart data={data.daily || []} />
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="📱 Cihaz Tipi">
                <BarChart data={data.devices || []} color="bg-green-500" />
              </Section>
              <Section title="🖥 İşletim Sistemi (Android / iPhone / Windows)">
                <BarChart data={data.os || []} color="bg-blue-500" />
              </Section>
            </div>

            <Section title="🌐 Tarayıcı (Chrome / Safari / Firefox)">
              <BarChart data={data.browsers || []} color="bg-amber-500" />
            </Section>

            <Section title="📄 En Çok Ziyaret Edilen Sayfalar">
              <BarChart data={(data.topKeywords || []).slice(0, 15)} color="bg-green-600" />
            </Section>
          </>
        )}

        {/* ── TRAFİK & KAYNAK ── */}
        {data && activeTab === "traffic" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="🔍 Trafik Kaynağı (Google / Instagram / Facebook / Direkt)">
                <BarChart data={data.referrers || []} color="bg-blue-500" />
              </Section>
              <Section title="🏙 Şehir Dağılımı">
                <BarChart data={data.topCities || []} color="bg-green-500" />
              </Section>
            </div>

            {data.utmSources?.length > 0 && (
              <Section title="📌 UTM Kaynak (Kampanya Linkleri)">
                <BarChart data={data.utmSources} color="bg-purple-500" />
              </Section>
            )}
            {data.utmCampaigns?.length > 0 && (
              <Section title="🎯 UTM Kampanya">
                <BarChart data={data.utmCampaigns} color="bg-amber-500" />
              </Section>
            )}

            {(!data.utmSources?.length && !data.utmCampaigns?.length) && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-sm text-amber-700">
                <p className="font-semibold mb-1">Henüz UTM verisi yok</p>
                <p className="text-xs">Instagram/Facebook linklerinize <code className="bg-amber-100 px-1 rounded">?utm_source=instagram&utm_campaign=kampanya_adi</code> ekleyin.</p>
              </div>
            )}
          </>
        )}

        {/* ── BUTON TIKLAMA ── */}
        {data && activeTab === "buttons" && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "WhatsApp", icon: "💬", color: "bg-green-50 border-green-200" },
                { name: "Telefon", icon: "📞", color: "bg-blue-50 border-blue-200" },
                { name: "Yol Tarifi", icon: "📍", color: "bg-amber-50 border-amber-200" },
              ].map(b => {
                const found = data.buttons?.breakdown?.find((x: any) => x.name === b.name);
                return (
                  <div key={b.name} className={`rounded-2xl p-4 shadow-sm border text-center ${b.color}`}>
                    <div className="text-3xl mb-1">{b.icon}</div>
                    <div className="text-2xl font-bold text-gray-800">{found?.count || 0}</div>
                    <div className="text-xs text-gray-500">{b.name}</div>
                  </div>
                );
              })}
            </div>

            <Section title="📋 Son Buton Tıklamaları">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="text-left py-2 pr-3">Zaman</th>
                      <th className="text-left py-2 pr-3">Tip</th>
                      <th className="text-left py-2 pr-3">Sayfa</th>
                      <th className="text-left py-2 pr-3">Şehir</th>
                      <th className="text-left py-2">Cihaz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.buttons?.recent || []).map((b: any, i: number) => {
                      const ti = typeInfo(b.type);
                      return (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-2 pr-3 text-gray-400 whitespace-nowrap">{fmtTime(b.ts)}</td>
                          <td className="py-2 pr-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ti.color}`}>
                              {ti.icon} {ti.label}
                            </span>
                          </td>
                          <td className="py-2 pr-3 text-gray-600 max-w-[120px] truncate">{b.slug || "—"}</td>
                          <td className="py-2 pr-3 text-gray-600">{b.city || "—"}</td>
                          <td className="py-2 text-gray-500">{deviceIcon(b.device)} {b.device}</td>
                        </tr>
                      );
                    })}
                    {(!data.buttons?.recent?.length) && (
                      <tr><td colSpan={5} className="py-6 text-center text-gray-400">Henüz tıklama kaydı yok</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>
          </>
        )}

        {/* ── ZİYARETÇİLER ── */}
        {data && activeTab === "visitors" && (
          <Section title="👤 Son Ziyaretçiler (IP · OS · Tarayıcı · Süre · Kaynak)">
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-xs min-w-[750px]">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="text-left py-2 pr-3 font-medium">Zaman</th>
                    <th className="text-left py-2 pr-3 font-medium">Sayfa</th>
                    <th className="text-left py-2 pr-3 font-medium">Kaynak</th>
                    <th className="text-left py-2 pr-3 font-medium">Şehir</th>
                    <th className="text-left py-2 pr-3 font-medium">OS / Tarayıcı</th>
                    <th className="text-left py-2 pr-3 font-medium">Süre</th>
                    <th className="text-left py-2 pr-3 font-medium">IP</th>
                    <th className="text-left py-2 font-medium">UTM</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.recent || []).map((h: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 pr-3 text-gray-400 whitespace-nowrap">{fmtTime(h.ts)}</td>
                      <td className="py-2 pr-3 text-gray-700 max-w-[140px] truncate" title={h.keyword}>{h.keyword}</td>
                      <td className="py-2 pr-3 font-medium text-gray-700 whitespace-nowrap">
                        {referrerIcon(h.referrer)} {h.referrer}
                      </td>
                      <td className="py-2 pr-3 text-gray-600 whitespace-nowrap">{h.city || "—"}</td>
                      <td className="py-2 pr-3 text-gray-600">
                        <div className="font-medium">{h.os}</div>
                        <div className="text-gray-400">{h.browser}</div>
                      </td>
                      <td className="py-2 pr-3 text-gray-600 whitespace-nowrap">{fmtDuration(h.duration)}</td>
                      <td className="py-2 pr-3 text-gray-400 font-mono">{h.ip || "—"}</td>
                      <td className="py-2 text-gray-400">
                        {h.utmSource ? (
                          <div className="flex flex-wrap gap-1">
                            <span className="bg-purple-50 text-purple-600 px-1 py-0.5 rounded text-[10px]">{h.utmSource}</span>
                            {h.utmCampaign && <span className="bg-amber-50 text-amber-600 px-1 py-0.5 rounded text-[10px]">{h.utmCampaign}</span>}
                          </div>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                  {!data.recent?.length && (
                    <tr><td colSpan={8} className="py-8 text-center text-gray-400">Henüz ziyaret verisi yok</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
