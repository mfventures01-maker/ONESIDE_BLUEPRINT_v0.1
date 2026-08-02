import { Link } from 'react-router-dom';
import { useAuth } from '../state/Contexts';

export default function Sidebar() {
  const { roleLevel } = useAuth();
  const isSuperadmin = roleLevel === 100;

  return (
    <aside className="w-64 bg-deep-slate/80 border-r border-white/5 p-4 h-screen sticky top-0">
      <div className="mb-8">
        <h2 className="text-sm uppercase tracking-wider text-slate-400 font-montserrat font-bold">Navigation</h2>
      </div>
      <nav className="space-y-1">
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/orders" label="Orders" />
        <NavItem to="/inventory" label="Inventory" />
        <NavItem to="/products" label="Products" />
        <NavItem to="/media" label="Media" />
        <div className="my-4 border-t border-white/5" />
        <NavItem to="/customers" label="Customers" />
        <NavItem to="/staff" label="Staff" />
        <NavItem to="/roles" label="Roles" />
        <NavItem to="/shifts" label="Shifts" />
        <div className="my-4 border-t border-white/5" />
        <NavItem to="/tables" label="Tables" />
        <NavItem to="/reservations" label="Reservations" />
        <NavItem to="/bookings" label="Bookings" />
        <NavItem to="/properties" label="Properties" />
        <div className="my-4 border-t border-white/5" />
        <NavItem to="/reports" label="Reports" />
        <NavItem to="/analytics" label="Analytics" />
        <NavItem to="/settings" label="Settings" />
        <NavItem to="/profile" label="Profile" />
        <NavItem to="/notifications" label="Notifications" />
        {isSuperadmin && (
          <>
            <div className="my-4 border-t border-white/5" />
            <NavItem to="/onboarding" label="Onboarding (Genesis)" className="text-burnt-ochre" />
          </>
        )}
      </nav>
    </aside>
  );
}

function NavItem({ to, label, className = '' }) {
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/5 hover:text-white text-slate-400 ${className}`}
    >
      {label}
    </Link>
  );
}
