/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  User,
  Bell,
  Cpu,
  FileSpreadsheet,
  Terminal,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserCog,
  BarChart3
} from "lucide-react";
import { useRoleStore } from "../state/Contexts";
import { RoleType } from "../types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activeRole,
    sidebarOpen,
    setSidebarOpen,
    loginAs,
    logout,
    addSystemLog,
  } = useRoleStore();

  const menuItems = [
    {
      label: "Operations Desk",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: ["superadmin", "ceo", "manager", "staff"],
    },
    {
      label: "Trust Onboarding",
      icon: FileSpreadsheet,
      path: "/onboarding",
      roles: ["superadmin", "ceo", "manager"],
    },
    {
      label: "Authority Profile",
      icon: User,
      path: "/profile",
      roles: ["superadmin", "ceo", "manager", "staff"],
    },
    {
      label: "Alert Dispatch",
      icon: Bell,
      path: "/notifications",
      roles: ["superadmin", "ceo", "manager", "staff"],
    },
    {
      label: "Constitutional Audit",
      icon: Terminal,
      path: "/audit",
      roles: ["superadmin", "ceo", "manager", "staff"],
    },
    {
      label: "Intelligence Reports",
      icon: BarChart3,
      path: "/reports",
      roles: ["superadmin", "ceo", "manager", "staff"],
    },
  ];

  const handleRoleToggle = (role: RoleType) => {
    loginAs(role);
    addSystemLog(`Dynamic role switch requested via local deck to: ${role.toUpperCase()}`);
    // Redirect on role downgrade if on a protected page
    if (location.pathname === "/onboarding" && !["superadmin", "ceo", "manager"].includes(role)) {
      navigate("/dashboard");
    }
  };

  const currentItem = menuItems.find((item) => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside
        className={`bg-zinc-900 border-r border-zinc-850 flex flex-col justify-between shrink-0 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div>
          {/* Brand Row */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-850 h-16 shrink-0 overflow-hidden">
            <div className={`flex items-center gap-2.5 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 w-0"}`}>
              <Shield className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-white">
                CARSS SHIELD
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition shrink-0 cursor-pointer"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {menuItems
              .filter((item) => item.roles.includes(activeRole))
              .map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left border transition group cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-400 font-semibold"
                        : "bg-transparent border-transparent text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 transition ${isActive ? "text-indigo-400" : "text-zinc-400 group-hover:text-zinc-200"}`} />
                    {sidebarOpen && <span className="text-xs uppercase tracking-wide font-mono">{item.label}</span>}
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Sidebar Footer / Role Swapper */}
        <div className="p-3 border-t border-zinc-850 space-y-2 shrink-0">
          {sidebarOpen && (
            <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[9px] uppercase tracking-wider mb-2">
                <UserCog className="w-3 h-3 text-indigo-400" />
                <span>Simulate Role Security</span>
              </div>
              <select
                value={activeRole}
                onChange={(e) => handleRoleToggle(e.target.value as RoleType)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] font-mono uppercase text-zinc-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="superadmin">Superadmin</option>
                <option value="ceo">CEO</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff Member</option>
              </select>
            </div>
          )}

          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 bg-zinc-950 hover:bg-red-950/20 border border-zinc-850 hover:border-red-500/15 rounded-xl text-left text-zinc-400 hover:text-red-400 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-zinc-500 shrink-0" />
            {sidebarOpen && <span className="text-xs font-mono uppercase tracking-wide">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Header Ribbon */}
        <header className="h-16 border-b border-zinc-850 bg-zinc-900/40 backdrop-blur px-6 flex items-center justify-between shrink-0">
          <h2 className="font-mono text-sm uppercase tracking-wider font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>{currentItem?.label || "COMPLIANCE TERMINAL"}</span>
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>CLEARANCE: [ {activeRole.toUpperCase()} ]</span>
            </div>
          </div>
        </header>

        {/* Content canvas */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
