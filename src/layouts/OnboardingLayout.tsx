import { Outlet } from 'react-router-dom';

export default function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-deep-slate text-white font-inter flex items-center justify-center">
      <Outlet />
    </div>
  );
}
