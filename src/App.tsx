
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
              {/* Explicit root redirects */}
              <Route path="/" element={<Navigate to="/en/speed" replace />} />
              <Route path="" element={<Navigate to="/en/speed" replace />} />
              <Route path="/index.html" element={<Navigate to="/en/speed" replace />} />
              
              {/* English routes - direct element assignment for consistent behavior */}
              <Route path="/en/speed" element={<Index variant="speed" lang="en" />} />
              <Route path="/en/offer" element={<Index variant="personal" lang="en" />} />
              <Route path="/en/budget" element={<Index variant="budget" lang="en" />} />
              
              {/* Waitlist and dealership routes for all variants in English */}
              <Route path="/en/:variant/waitlist-signup" element={<WaitlistSignup />} />
              <Route path="/en/:variant/waitlist-signup/confirmation" element={<Confirmation />} />
              <Route path="/en/:variant/dealership" element={<DealershipSignup />} />
              <Route path="/en/:variant/dealership/confirmation" element={<DealershipConfirmation />} />
              
              {/* Legacy English routes for backward compatibility */}
              <Route path="/en/speed/waitlist-signup" element={<WaitlistSignup />} />
              <Route path="/en/speed/waitlist-signup/confirmation" element={<Confirmation />} />
              <Route path="/en/speed/dealership" element={<DealershipSignup />} />
              <Route path="/en/speed/dealership/confirmation" element={<DealershipConfirmation />} />
              
              {/* Arabic routes */}
              <Route path="/ar/speed" element={<Index variant="speed" lang="ar" />} />
              <Route path="/ar/offer" element={<Index variant="personal" lang="ar" />} />
              <Route path="/ar/budget" element={<Index variant="budget" lang="ar" />} />
              
              {/* Waitlist and dealership routes for all variants in Arabic */}
              <Route path="/ar/:variant/waitlist-signup" element={<WaitlistSignup />} />
              <Route path="/ar/:variant/waitlist-signup/confirmation" element={<Confirmation />} />
              <Route path="/ar/:variant/dealership" element={<DealershipSignup />} />
              <Route path="/ar/:variant/dealership/confirmation" element={<DealershipConfirmation />} />
              
              {/* Legacy Arabic routes for backward compatibility */}
              <Route path="/ar/speed/waitlist-signup" element={<WaitlistSignup />} />
              <Route path="/ar/speed/waitlist-signup/confirmation" element={<Confirmation />} />
              <Route path="/ar/speed/dealership" element={<DealershipSignup />} />
              <Route path="/ar/speed/dealership/confirmation" element={<DealershipConfirmation />} />
              
              {/* Language root routes */}
              <Route path="/en" element={<Navigate to="/en/speed" replace />} />
              <Route path="/ar" element={<Navigate to="/ar/speed" replace />} />
              
              {/* Legacy and special routes */}
              <Route path="/en/legacy-journey-x7k9p2" element={<LegacyJourney />} />
              <Route path="/nafath-verification" element={<NafathVerification />} />
              <Route path="/financing-offers" element={<FinancingOffers />} />
              <Route path="/bank-connection" element={<BankConnection />} />
              <Route path="/waitlist-status/:statusId" element={<WaitlistStatus />} />
              <Route path="/confirmation" element={<Confirmation />} />
              
              {/* Catch-all 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </BrowserRouter>
);

export default App;
