import { Outlet } from 'react-router-dom';

export default function ErrorLayout() {
  return (
    <div className="min-h-screen bg-deep-slate text-white font-inter flex items-center justify-center">
      <div className="glass-panel p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
        <Outlet />
      </div>
    </div>
  );
}
