import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../state/Contexts';
export default function AuthBoundary() {
  const { user, roleLevel, isLoading } = useAuth(); const location = useLocation();
  if (isLoading) return <div className="text-center py-10 text-slate-400">Loading session...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (roleLevel === 100 && location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}
