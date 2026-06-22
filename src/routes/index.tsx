/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from "react";
import { CreateRouter } from "react-router-dom"; // Node Router v6/v7 standards
import { useRoutes, Route, Routes, Navigate, Link } from "react-router-dom";

// Layout Imports
import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";
import OnboardingLayout from "../layouts/OnboardingLayout";
import ErrorLayout from "../layouts/ErrorLayout";

// Guard Imports
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { AuthBoundary } from "../guards/AuthBoundary";

// Page Skeletons Lazy Imports for fast boot performance
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const Inventory = lazy(() => import("../pages/Inventory"));
const Products = lazy(() => import("../pages/Products"));
const Media = lazy(() => import("../pages/Media"));
const Customers = lazy(() => import("../pages/Customers"));
const Staff = lazy(() => import("../pages/Staff"));
const Roles = lazy(() => import("../pages/Roles"));
const Shifts = lazy(() => import("../pages/Shifts"));
const Tables = lazy(() => import("../pages/Tables"));
const Reservations = lazy(() => import("../pages/Reservations"));
const Bookings = lazy(() => import("../pages/Bookings"));
const Properties = lazy(() => import("../pages/Properties"));
const Reports = lazy(() => import("../pages/Reports"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Settings = lazy(() => import("../pages/Settings"));
const Profile = lazy(() => import("../pages/Profile"));
const Notifications = lazy(() => import("../pages/Notifications"));
const Onboarding = lazy(() => import("../pages/Onboarding"));

// Simple elegant loading spinner for lazy loaded routes
function RoutePreloader() {
  return (
    <div className="flex items-center justify-center p-12 min-h-[40vh] text-zinc-400 font-mono text-xs gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-505 animate-ping" />
      <span>PROBING TERRAIN...</span>
    </div>
  );
}

// gateway page for root route /
function PublicGatewayPage() {
  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 mx-auto flex items-center justify-center text-white mb-6 font-mono font-bold animate-pulse text-lg">
          Ω
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white font-sans sm:text-5xl">
          CARSS ENTERPRISE HUB
        </h1>
        <p className="text-sm font-mono text-zinc-500 tracking-widest uppercase mt-2">
          v0.1 Constitutional Entry Gateway
        </p>

        <p className="text-zinc-400 font-sans text-sm mt-6 leading-relaxed max-w-lg mx-auto">
          Welcome to the audited Enterprise Shell gateway, fully aligned with the CARSS Experience Constitution. From this portal, qualified operators can sign in and assume authorized roles across all five core business territories.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-slate-300 hover:text-zinc-950 text-white font-mono text-xs font-bold uppercase rounded-lg tracking-wider transition duration-205 cursor-pointer"
          >
            Authenticate Console (CEO)
          </Link>
          <Link
            to="/onboarding"
            className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-xs font-medium uppercase rounded-lg tracking-wider transition duration-200 cursor-pointer"
          >
            Enter Bootstrap System (Admin)
          </Link>
        </div>

        <div className="mt-16 text-[9px] font-mono text-zinc-650 flex flex-col items-center gap-1.5">
          <span>SECURE GATEWAY ENCRYPTION INTERACTIVE LOCK</span>
          <span className="bg-zinc-90 w-fit px-1.5 py-0.5 rounded border border-zinc-900 text-[8px]">
            SSOT_FENCE_ID: 34dbd583-cc98-42ee-9531-c294f3ab2aaa
          </span>
        </div>
      </div>
    </PublicLayout>
  );
}

// Router map matching RouteRegistry and role specifications exactly
export function AppRoutes() {
  return (
    <AuthBoundary>
      <Suspense fallback={<RoutePreloader />}>
        <Routes>
          {/* Public Landing Area */}
          <Route path="/" element={<PublicGatewayPage />} />

          {/* Onboarding Workspace Bounds */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo"]}>
                <OnboardingLayout>
                  <Onboarding />
                </OnboardingLayout>
              </ProtectedRoute>
            }
          />

          {/* Primary Operations Workspace (Dashboard Layout bound) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Certified Orders Routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/list"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/detail"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Certified Inventory Routes */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Inventory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/items"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Inventory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/movements"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Inventory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Certified Menu/Products Routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Products />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/catalog"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Products />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/categories"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Products />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Certified Media/Promotion Routes */}
          <Route
            path="/media"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Media />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/media/bank"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Media />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/media/uploads"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Media />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* People/Identity Territory */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Customers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Staff />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo"]}>
                <DashboardLayout>
                  <Roles />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Hospitality Territory */}
          <Route
            path="/tables"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Tables />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Reservations />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Bookings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo"]}>
                <DashboardLayout>
                  <Properties />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Management Territory */}
          <Route
            path="/shifts"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Shifts />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo"]}>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Administration Territory */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager"]}>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["superadmin", "ceo", "manager", "staff"]}>
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Default Intercepting Routing Fallback */}
          <Route
            path="*"
            element={
              <ErrorLayout>
                <div className="max-w-md mx-auto text-center p-6 text-zinc-100 font-mono">
                  <div className="text-4xl text-yellow-600 font-bold mb-4">404</div>
                  <h3 className="text-md font-semibold mb-2">ROUTE NOT REGISTERED</h3>
                  <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                    This browser is pointing to a path that does not reside in the frozen CARSS Master Page Registry.
                  </p>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-zinc-90 w-fit rounded border border-zinc-80 px-4 py-2 hover:bg-zinc-900 transition text-xs font-semibold cursor-pointer text-zinc-300"
                  >
                    Return to Safe Desk
                  </Link>
                </div>
              </ErrorLayout>
            }
          />
        </Routes>
      </Suspense>
    </AuthBoundary>
  );
}
