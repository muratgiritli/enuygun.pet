import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import KeywordPage from "@/pages/keyword-page";
import HealthPage from "@/pages/health-page";
import BlogListPage from "@/pages/blog-list-page";
import BlogPage from "@/pages/blog-page";
import CategoryPage from "@/pages/category-page";
import LocalPage from "@/pages/local-page";
import IletisimPage from "@/pages/iletisim";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <Route path="/local/:slug" component={LocalPage} />
      <Route path="/:slug" component={KeywordPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
