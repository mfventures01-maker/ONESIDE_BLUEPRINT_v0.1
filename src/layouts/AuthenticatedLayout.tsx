import { Outlet } from 'react-router-dom';
import { useAuth } from '../state/Contexts';

export default function AuthenticatedLayout() {
  const { user, roleLevel } = useAuth();
  return (
    <div className="min-h-screen bg-deep-slate text-white font-inter">
      <header className="border-b border-white/5 p-4">
        <span className="text-sm text-slate-400">Authenticated as {roleLevel === 100 ? 'Superadmin' : 'User'}</span>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
