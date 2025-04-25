
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NafathVerification from "./pages/NafathVerification";
import FinancingOffers from "./pages/FinancingOffers";
import BankConnection from "./pages/BankConnection";
import Confirmation from "./pages/Confirmation";
import LegacyJourney from "./pages/LegacyJourney";
import { LanguageProvider } from "./contexts/LanguageContext";
import WaitlistSignup from "./pages/WaitlistSignup";
import DealershipSignup from "./pages/DealershipSignup";
import DealershipConfirmation from "./pages/DealershipConfirmation";
import WaitlistStatus from "./pages/WaitlistStatus";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Explicit root redirects with multiple variations to handle different scenarios */}
              <Route path="/" element={<Navigate to="/en/speed" replace />} />
              <Route path="" element={<Navigate to="/en/speed" replace />} />
              <Route path="/index.html" element={<Navigate to="/en/speed" replace />} />
              
              {/* English routes */}
              <Route path="/en/speed">
                <Route index element={<Index variant="speed" />} />
                <Route path="waitlist-signup" element={<WaitlistSignup />} />
                <Route path="waitlist-signup/confirmation" element={<Confirmation />} />
                <Route path="dealership" element={<DealershipSignup />} />
                <Route path="dealership/confirmation" element={<DealershipConfirmation />} />
              </Route>
              
              {/* Arabic routes with explicit handling */}
              <Route path="/ar/speed">
                <Route index element={<Index variant="speed" lang="ar" />} />
                <Route path="waitlist-signup" element={<WaitlistSignup />} />
                <Route path="waitlist-signup/confirmation" element={<Confirmation />} />
                <Route path="dealership" element={<DealershipSignup />} />
                <Route path="dealership/confirmation" element={<DealershipConfirmation />} />
              </Route>
              
              {/* Include routes for all variant/language combinations to ensure comprehensive coverage */}
              <Route path="/en/offer" element={<Index variant="personal" />} />
              <Route path="/en/budget" element={<Index variant="budget" />} />
              <Route path="/ar/offer" element={<Index variant="personal" lang="ar" />} />
              <Route path="/ar/budget" element={<Index variant="budget" lang="ar" />} />
              
              {/* Legacy and special routes */}
              <Route path="/en/legacy-journey-x7k9p2" element={<LegacyJourney />} />
              <Route path="/nafath-verification" element={<NafathVerification />} />
              <Route path="/financing-offers" element={<FinancingOffers />} />
              <Route path="/bank-connection" element={<BankConnection />} />
              <Route path="/waitlist-status/:statusId" element={<WaitlistStatus />} />
              <Route path="/confirmation" element={<Confirmation />} />
              
              {/* Catch-all 404 route - must be the last route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </BrowserRouter>
);

export default App;
