import { Switch, Route, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import KeywordPage from "@/pages/keyword-page";
import CategoryPage from "@/pages/category-page";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { resolveSeoRedirect } from "@shared/seo-redirects";

// Daha seyrek ziyaret edilen sayfalar ilk yüklemeyi büyütmemek için ayrı paketlenir.
const HealthPage = lazy(() => import("@/pages/health-page"));
const BlogListPage = lazy(() => import("@/pages/blog-list-page"));
const BlogPage = lazy(() => import("@/pages/blog-page"));
const LocalPage = lazy(() => import("@/pages/local-page"));
const RoyalCaninPage = lazy(() => import("@/pages/royal-canin"));
const ProPlanPage = lazy(() => import("@/pages/proplan"));
const IletisimPage = lazy(() => import("@/pages/iletisim"));
const AdminPage = lazy(() => import("@/pages/admin"));
const HealthHubPage = lazy(() => import("@/pages/health-hub-page"));

function Router() {
  const [location, setLocation] = useLocation();
  const dest = resolveSeoRedirect(location);

  useEffect(() => {
    if (dest) setLocation(dest);
  }, [dest, setLocation]);

  if (dest) return null;

  return (
    <Suspense fallback={null}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/iletisim" component={IletisimPage} />
      <Route path="/blog" component={BlogListPage} />
      <Route path="/blog/:slug" component={BlogPage} />
      <Route path="/kedi-hastaliklari/:slug" component={HealthPage} />
      <Route path="/kopek-hastaliklari/:slug" component={HealthPage} />
      <Route path="/papagan-hastaliklari/:slug" component={HealthPage} />
      <Route path="/muhabbet-kusu-hastaliklari/:slug" component={HealthPage} />
      <Route path="/kedi-mamasi" component={CategoryPage} />
      <Route path="/kopek-mamasi" component={CategoryPage} />
      <Route path="/kedi-kumu" component={CategoryPage} />
      <Route path="/petshop-samsun" component={CategoryPage} />
      <Route path="/atakum-petshop" component={CategoryPage} />
      <Route path="/kapida-teslim-petshop" component={CategoryPage} />
      <Route path="/kedi-urunleri" component={CategoryPage} />
      <Route path="/kopek-urunleri" component={CategoryPage} />
      <Route path="/kus-urunleri" component={CategoryPage} />
      <Route path="/balik-urunleri" component={CategoryPage} />
      <Route path="/kucuk-hayvan-urunleri" component={CategoryPage} />
      <Route path="/surungen-urunleri" component={CategoryPage} />
      <Route path="/kedi-mamasi-atakum" component={CategoryPage} />
      <Route path="/kopek-mamasi-atakum" component={CategoryPage} />
      <Route path="/hills-science-plan-samsun" component={CategoryPage} />
      <Route path="/saglik/:animal" component={HealthHubPage} />
      <Route path="/royal-canin" component={RoyalCaninPage} />
      <Route path="/proplan" component={ProPlanPage} />
      <Route path="/local/:slug" component={LocalPage} />
      <Route path="/:slug" component={KeywordPage} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnalyticsProvider>
          <Toaster />
          <Router />
        </AnalyticsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
