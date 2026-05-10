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
import { StrictMode } from 'react'
import NotFound from "./pages/NotFound";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { DisplayTransactions }  from "./pages/Dashboard";
import Header from "@/components/layout/Header";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const {auth, loading} = useAuth();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StrictMode>
            <BrowserRouter>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Pricing />} />
                  <Route path="/dashboard" element={ 
                    <ProtectedRoute requireAuth redirectTo="/signin">
                      <Dashboard />
                    </ProtectedRoute> 
                  }>
                    <Route index element={<DisplayTransactions />} />
                    <Route path="success" element={ <DisplayTransactions />} />
                    <Route path="failed" element={ <DisplayTransactions />} />
                    <Route path="pending" element={ <DisplayTransactions />} />
                  </Route>
                  {auth.check_auth ? (
                    <>
                      <Route path="/checkout" element={ <Checkout /> } />
                      <Route path="/payment-success" element={<PaymentSuccess />} />
                      <Route path="/payment-failed" element={<PaymentFailed />} />
                    </>
                  ) : (
                    <>
                      <Route path="/signin" element={ !auth.check_auth ? <Signin /> : <Navigate to="/" replace /> } />
                      <Route path="/signup" element={ !auth.check_auth ? <Signup /> : <Navigate to="/" replace /> } />
                    </>
                  )}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </BrowserRouter>
          </StrictMode>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;