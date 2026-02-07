import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import SearchPage from "@/pages/SearchPage";
import RoomsPage from "@/pages/RoomsPage";
import FoodPage from "@/pages/FoodPage";
import BeachPage from "@/pages/BeachPage";
import InfrastructurePage from "@/pages/InfrastructurePage";
import ContactsPage from "@/pages/ContactsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/rooms" component={RoomsPage} />
      <Route path="/food" component={FoodPage} />
      <Route path="/beach" component={BeachPage} />
      <Route path="/infrastructure" component={InfrastructurePage} />
      <Route path="/contacts" component={ContactsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Layout>
          <Router />
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
