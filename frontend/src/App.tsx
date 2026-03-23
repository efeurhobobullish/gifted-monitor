import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { ScrollToTop } from "@/components/ui";

import { Home, NotFound } from "@/pages";
import {
  Login,
  Register,
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
  Monitors,
  Deploy,
  Developers,
  Templates,
  BotLogs,
  MonitorDetail,
} from "@/pages/main";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitors" element={<Monitors />} />
        <Route path="/dashboard/monitors" element={<Monitors />} />
        <Route path="/dashboard/bots" element={<Monitors />} />
        <Route path="/dashboard/templates" element={<Templates />} />
        <Route path="/dashboard/deploy" element={<Deploy />} />
        <Route path="/dashboard/coins" element={<Coins />} />
        <Route path="/dashboard/store" element={<Store />} />
        <Route path="/dashboard/referral" element={<Referral />} />
        <Route path="/dashboard/community" element={<Community />} />
        <Route path="/dashboard/developers" element={<Developers />} />
        <Route path="/monitors/:botId/logs" element={<BotLogs />} />
        <Route path="/dashboard/monitors/:botId/logs" element={<BotLogs />} />
        <Route path="/monitors/detail" element={<MonitorDetail />} />
        <Route path="/dashboard/monitors/detail" element={<MonitorDetail />} />
        <Route path="/dashboard/bots/:botId/logs" element={<BotLogs />} />
        <Route path="/dashboard/bots/detail" element={<MonitorDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/withdraw" element={<Withdraw />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
