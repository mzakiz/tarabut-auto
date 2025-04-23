
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AffordabilityCheck from "./pages/AffordabilityCheck";
import NafathVerification from "./pages/NafathVerification";
import FinancingOffers from "./pages/FinancingOffers";
import BankConnection from "./pages/BankConnection";
import Confirmation from "./pages/Confirmation";
import LegacyJourney from "./pages/LegacyJourney";
import { LanguageProvider } from "./contexts/LanguageContext";
import WaitlistSignup from "./pages/WaitlistSignup";
import DealershipSignup from "./pages/DealershipSignup";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* A/B Test Routes - English */}
            <Route path="/en/speed/affordability_checks" element={<Index variant="speed" />} />
            <Route path="/en/personal/affordability_checks" element={<Index variant="personal" />} />
            <Route path="/en/budget/affordability_checks" element={<Index variant="budget" />} />
            
            {/* A/B Test Routes - Arabic */}
            <Route path="/ar/speed/affordability_checks" element={<Index variant="speed" lang="ar" />} />
            <Route path="/ar/personal/affordability_checks" element={<Index variant="personal" lang="ar" />} />
            <Route path="/ar/budget/affordability_checks" element={<Index variant="budget" lang="ar" />} />
            
            {/* Legacy Journey */}
            <Route path="/en/legacy-journey-x7k9p2" element={<LegacyJourney />} />
            
            {/* Other Routes */}
            <Route path="/waitlist-signup" element={<WaitlistSignup />} />
            <Route path="/dealership-signup" element={<DealershipSignup />} />
            <Route path="/" element={<Index variant="speed" />} />
            <Route path="/affordability-check" element={<AffordabilityCheck />} />
            <Route path="/nafath-verification" element={<NafathVerification />} />
            <Route path="/financing-offers" element={<FinancingOffers />} />
            <Route path="/bank-connection" element={<BankConnection />} />
            <Route path="/confirmation" element={<Confirmation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
