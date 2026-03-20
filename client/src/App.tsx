import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import KeywordPage from "@/pages/keyword-page";
import HealthPage from "@/pages/health-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/kedi-hastaliklari/:slug" component={HealthPage} />
      <Route path="/kopek-hastaliklari/:slug" component={HealthPage} />
      <Route path="/papagan-hastaliklari/:slug" component={HealthPage} />
      <Route path="/muhabbet-kusu-hastaliklari/:slug" component={HealthPage} />
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
