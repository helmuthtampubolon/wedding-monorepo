import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import InvitationPage from "./InvitationPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInvitationEdit from "./pages/admin/AdminInvitationEdit";
import AdminGuests from "./pages/admin/AdminGuests";
import AdminRsvps from "./pages/admin/AdminRsvps";
import AdminTemplates from "./pages/admin/AdminTemplates";
import RequireAuth from "./pages/admin/RequireAuth";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<InvitationPage />} />
        <Route path="/i/:slug" element={<InvitationPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminDashboard />} />
          <Route path="invitations/:id" element={<AdminInvitationEdit />} />
          <Route path="invitations/:id/guests" element={<AdminGuests />} />
          <Route path="invitations/:id/rsvps" element={<AdminRsvps />} />
          <Route path="templates" element={<AdminTemplates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
