import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, MapPin, Smartphone, Globe, Clock, LogOut, RefreshCw } from "lucide-react";

const TOKEN_KEY = "ep_admin_token";

interface AnalyticsData {
  total: number;
  topKeywords: { name: string; count: number }[];
  topCities: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  referrers: { name: string; count: number }[];
  daily: { date: string; count: number }[];
  recent: { ts: number; keyword: string; city: string; device: string; referrer: string }[];
}

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analytics/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem(TOKEN_KEY, token);
        onLogin(token);
      } else {
        setError("Kullanıcı adı veya şifre hatalı.");
      }
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6 border border-border">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">e</span>
          </div>
          <div>
            <p className="text-sm font-bold text-primary">EnuygunPet</p>
            <p className="text-[10px] text-muted-foreground">Admin Paneli</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              data-testid="input-username"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              data-testid="input-password"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading} data-testid="button-login">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <Card className="p-4 border border-border">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-primary">{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </Card>
  );
}

function TopList({ items, color = "bg-primary" }: { items: { name: string; count: number }[]; color?: string }) {
  if (!items.length) return <p className="text-xs text-muted-foreground">Veri yok</p>;
  const max = items[0].count;
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-foreground font-medium truncate max-w-[70%]">{item.name}</span>
            <span className="text-muted-foreground font-semibold">{item.count}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/data?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { onLogout(); return; }
      setData(await res.json());
      setLastUpdated(new Date());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [period]);

  const deviceTotal = data?.devices.reduce((a, b) => a + b.count, 0) || 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">e</span>
            </div>
            <div>
              <p className="text-sm font-bold text-primary">EnuygunPet</p>
              <p className="text-[10px] text-muted-foreground leading-none">Trafik Analitik</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                {lastUpdated.toLocaleTimeString("tr-TR")}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="h-8 gap-1 text-xs">
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout} className="h-8 gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="w-3 h-3" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "today", label: "Bugün" },
            { key: "week", label: "Bu Hafta" },
            { key: "month", label: "Bu Ay" },
            { key: "all", label: "Tümü" },
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                period === p.key
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
              data-testid={`button-period-${p.key}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading && !data && (
          <div className="text-center text-sm text-muted-foreground py-12">Yükleniyor...</div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={<Users className="w-4 h-4" />} label="Toplam Ziyaret" value={data.total.toLocaleString("tr-TR")} />
              <StatCard icon={<Smartphone className="w-4 h-4" />} label="Mobil Oran"
                value={`%${Math.round(((data.devices.find(d => d.name === "Mobil")?.count || 0) / deviceTotal) * 100)}`}
                sub="ziyaretçi oranı"
              />
              <StatCard icon={<MapPin className="w-4 h-4" />} label="1. Şehir"
                value={data.topCities[0]?.name || "—"}
                sub={`${data.topCities[0]?.count || 0} ziyaret`}
              />
              <StatCard icon={<Globe className="w-4 h-4" />} label="1. Kaynak"
                value={data.referrers[0]?.name || "—"}
                sub={`${data.referrers[0]?.count || 0} ziyaret`}
              />
            </div>

            {data.daily.length > 0 && (
              <Card className="p-4 border border-border">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary" />
                  Günlük Ziyaret
                </h3>
                <div className="flex items-end gap-1 h-24">
                  {data.daily.map((d, i) => {
                    const maxVal = Math.max(...data.daily.map(x => x.count));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-primary/80 rounded-t"
                          style={{ height: `${Math.max(4, (d.count / maxVal) * 88)}px` }}
                          title={`${d.date}: ${d.count} ziyaret`}
                        />
                        <span className="text-[8px] text-muted-foreground" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                          {d.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 border border-border">
                <h3 className="text-sm font-bold text-foreground mb-3">En Çok Ziyaret Edilen Kelimeler</h3>
                <TopList items={data.topKeywords} color="bg-primary" />
              </Card>
              <Card className="p-4 border border-border">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Şehirler
                </h3>
                <TopList items={data.topCities} color="bg-amber-500" />
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 border border-border">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-primary" /> Cihaz Türü
                </h3>
                <div className="space-y-2">
                  {data.devices.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {d.name === "Mobil" ? "📱" : d.name === "Tablet" ? "📲" : "💻"}
                        </span>
                        <span className="text-sm font-medium text-foreground">{d.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-foreground">{d.count}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          (%{Math.round((d.count / deviceTotal) * 100)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-4 border border-border">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-primary" /> Trafik Kaynakları
                </h3>
                <TopList items={data.referrers} color="bg-blue-500" />
              </Card>
            </div>

            <Card className="p-4 border border-border">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-primary" /> Son Ziyaretler
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 text-muted-foreground font-semibold">Saat</th>
                      <th className="text-left py-2 pr-3 text-muted-foreground font-semibold">Anahtar Kelime</th>
                      <th className="text-left py-2 pr-3 text-muted-foreground font-semibold">Şehir</th>
                      <th className="text-left py-2 pr-3 text-muted-foreground font-semibold">Cihaz</th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">Kaynak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.map((h, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-1.5 pr-3 text-muted-foreground whitespace-nowrap">
                          {new Date(h.ts).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                          <br />
                          <span className="text-[10px]">{new Date(h.ts).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" })}</span>
                        </td>
                        <td className="py-1.5 pr-3 text-foreground max-w-[180px] truncate font-medium">{h.keyword}</td>
                        <td className="py-1.5 pr-3 text-muted-foreground">{h.city}</td>
                        <td className="py-1.5 pr-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
                            {h.device === "Mobil" ? "📱" : h.device === "Tablet" ? "📲" : "💻"} {h.device}
                          </span>
                        </td>
                        <td className="py-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            h.referrer === "Google" ? "bg-blue-100 text-blue-700" :
                            h.referrer === "Instagram" ? "bg-pink-100 text-pink-700" :
                            h.referrer === "Direkt" ? "bg-green-100 text-green-700" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {h.referrer}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const handleLogin = (t: string) => setToken(t);
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
