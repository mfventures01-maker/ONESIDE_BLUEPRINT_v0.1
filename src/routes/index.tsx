/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthBoundary } from "../guards/AuthBoundary";
import { ProtectedRoute } from "../guards/ProtectedRoute";

// Lazy loading pages
const CustomerHomepage = lazy(() => import("../pages/CustomerHomepage"));
const PublicGatewayPage = lazy(() => import("../pages/PublicGatewayPage"));
const CEOLogin = lazy(() => import("../pages/auth/CEOLogin"));
const StaffLogin = lazy(() => import("../pages/auth/StaffLogin"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Notifications = lazy(() => import("../pages/Notifications"));
const AuditRoom = lazy(() => import("../pages/AuditRoom"));
const Reports = lazy(() => import("../pages/Reports"));

// Base fallback preloader
function RoutePreloader() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 animate-pulse" />
      <span>LOADING CONTEXT BOUNDS...</span>
    </div>
  );
}

export function AppRoutes() {
  return (
    <AuthBoundary>
      <Suspense fallback={<RoutePreloader />}>
        <Routes>
          {/* Public Storefront */}
          <Route path="/" element={<CustomerHomepage />} />
          <Route path="/admin/gateway" element={<PublicGatewayPage />} />

          {/* Auth Channels */}
          <Route path="/auth/ceo" element={<CEOLogin />} />
          <Route path="/auth/staff" element={<StaffLogin />} />

          {/* Protected Area */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <AuditRoom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthBoundary>
  );
}
