import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/ui";

import { Home, NotFound } from "@/pages";
import {
  Login,
  Verify,
  ForgotPassword,
  ResetPassword,
} from "@/pages/auth";

import {
  Dashboard,
  Profile,
  Referral,
  Store,
  Community,
  Coins,
  Withdraw,
  Bots,
  Deploy,
  Developers,
  Templates,
  BotLogs,
} from "@/pages/main";
import { ApiSettings } from "@/pages/admin";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors />

      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ========== PROTECTED ROUTES ========== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/settings/api"
          element={
            <ProtectedRoute>
              <ApiSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/bots"
          element={
            <ProtectedRoute>
              <Bots />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/templates"
          element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/deploy"
          element={
            <ProtectedRoute>
              <Deploy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/coins"
          element={
            <ProtectedRoute>
              <Coins />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/store"
          element={
            <ProtectedRoute>
              <Store />
            </ProtectedRoute>
          }
        />

       
         
        <Route
          path="/dashboard/bots/:botId/logs"
          element={
            <ProtectedRoute>
              <BotLogs/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/referral"
          element={
            <ProtectedRoute>
              <Referral />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/developers"
          element={
            <ProtectedRoute>
              <Developers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Withdraw />
            </ProtectedRoute>
          }
        />

        {/* ========== FALLBACK ========== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}