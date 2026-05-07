import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { DisplayTransactions }  from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  const auth = useAuth();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Pricing />} />
              <Route path="/dashboard" element={auth.auth.check_auth ? <Dashboard /> : <Navigate to="/signin" replace />}>
                <Route index element={<DisplayTransactions />} />
                <Route path="success" element={ <DisplayTransactions />} />
                <Route path="failed" element={ <DisplayTransactions />} />
                <Route path="pending" element={ <DisplayTransactions />} />
              </Route>
              {/* <Route path="/dashboard" element={ auth.auth.check_auth ? <Dashboard /> : <Navigate to="/signin" replace /> } /> */}
              {auth.auth.check_auth ? (
                <>
                  <Route path="/checkout" element={ <Checkout /> } />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failed" element={<PaymentFailed />} />
                </>
              ) : (
                <>
                  <Route path="/signin" element={ !auth.auth.check_auth ? <Signin /> : <Navigate to="/" replace /> } />
                  <Route path="/signup" element={ !auth.auth.check_auth ? <Signup /> : <Navigate to="/" replace /> } />
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;