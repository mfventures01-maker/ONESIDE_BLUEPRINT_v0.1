import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/Contexts';

export default function AuthBoundary() {
  const { user, roleLevel, isLoading } = useAuth();

  if (isLoading) return <div className="text-center py-10 text-slate-400">Loading session...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Superadmin (Level 100) goes to Onboarding
  if (roleLevel === 100) {
    return <Navigate to="/onboarding" replace />;
  }

  // All other authenticated users proceed to their dashboard
  return <Outlet />;
}
