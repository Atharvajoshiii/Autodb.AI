import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { useState, useEffect } from "react";
import ApiKeyModal from "@/components/ApiKeyModal";
import landingpage from "./landing_page/landingpage";
import LoginPage from "./auth/login";
import AutoDBDashboard from "./pages/dashboard";
import SchemaDashboard from "./pages/dashboard2";
import ProjectView from "./pages/projectview";

import AutoDBSignup from "./auth/signup";
function Router() {
  return (
    <Switch>
      <Route path="/" component={landingpage} />
      <Route path="/home" component={Home} />
      <Route path="/auth" component={LoginPage} />
      <Route path="/dashboard" component={SchemaDashboard} />
      <Route path="/project/:projectId" component={ProjectView} />
      <Route path="/signup" component={AutoDBSignup} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // API key is now handled server-side via environment variables
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
