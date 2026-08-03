import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import OnboardingLayout from '../layouts/OnboardingLayout';
import ErrorLayout from '../layouts/ErrorLayout';

// Lazy-loaded pages
const CustomerHomepage = lazy(() => import('../pages/CustomerHomepage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Orders = lazy(() => import('../pages/Orders'));
const Inventory = lazy(() => import('../pages/Inventory'));
const Products = lazy(() => import('../pages/Products'));
const Media = lazy(() => import('../pages/Media'));
const Customers = lazy(() => import('../pages/Customers'));
const Staff = lazy(() => import('../pages/Staff'));
const Roles = lazy(() => import('../pages/Roles'));
const Shifts = lazy(() => import('../pages/Shifts'));
const Tables = lazy(() => import('../pages/Tables'));
const Reservations = lazy(() => import('../pages/Reservations'));
const Bookings = lazy(() => import('../pages/Bookings'));
const Properties = lazy(() => import('../pages/Properties'));
const Reports = lazy(() => import('../pages/Reports'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
const Profile = lazy(() => import('../pages/Profile'));
const Notifications = lazy(() => import('../pages/Notifications'));
const Onboarding = lazy(() => import('../pages/Onboarding'));

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ FIXED: Public routes (Loads the actual Storefront) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<CustomerHomepage />} />
      </Route>

      {/* Authenticated routes */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Dashboard routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/list" element={<div>Order List</div>} />
        <Route path="/orders/detail" element={<div>Order Detail</div>} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/items" element={<div>Inventory Items</div>} />
        <Route path="/inventory/movements" element={<div>Inventory Movements</div>} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/catalog" element={<div>Product Catalog</div>} />
        <Route path="/products/categories" element={<div>Product Categories</div>} />
        <Route path="/media" element={<Media />} />
        <Route path="/media/bank" element={<div>Media Bank</div>} />
        <Route path="/media/uploads" element={<div>Media Uploads</div>} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/shifts" element={<Shifts />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Onboarding route (Superadmin only) */}
      <Route element={<OnboardingLayout />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* Error route */}
      <Route element={<ErrorLayout />}>
        <Route path="*" element={<div>404 – Page Not Found</div>} />
      </Route>
    </Routes>
  );
}
