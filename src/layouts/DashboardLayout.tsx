/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApplicationStore, useUserStore, useRoleStore, useLayoutStore } from "../state/Contexts";
import { SidebarRegistry, RoleRegistry } from "../navigation/registries";
import { LucideIcon } from "../components/LucideIcon";
import { RoleType } from "../types";
import { Menu, X, ShieldAlert, KeyRound, Radio, LogOut, ChevronRight, HelpCircle } from "lucide-react";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const { enterpriseName, isOnline, notificationSlot, setNotificationSlot } = useApplicationStore();
  const { user, isAuthenticated, logout, loginAs } = useUserStore();
  const { activeRole, clearances } = useRoleStore();
  const { sidebarOpen, setSidebarOpen } = useLayoutStore();
  const location = useLocation();

  const handleRoleSwap = (role: RoleType) => {
    loginAs(role);
  };

  // Convert current pathname into pretty breadcrumbs
  const getBreadcrumbs = () => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return ["Root", "Gateway"];
    return ["Root", ...segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1))];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      
      {/* 1. SIDEBAR */}
      <aside
        id="enterprise-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-mono font-black text-sm text-white select-none shadow">
                C
              </div>
              <div>
                <span className="font-bold tracking-tight text-zinc-100 text-sm block leading-none">
                  {enterpriseName}
                </span>
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-1 block">
                  v0.1 Enterprise Shell
                </span>
              </div>
            </div>
            
            <button
              id="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Navigation Derived from Registry */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {SidebarRegistry.map((group) => {
              // Filter out items that the current simulated role should not see
              const filteredItems = group.items.filter((item) =>
                item.roles.includes(activeRole)
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={group.groupName} className="space-y-1.5">
                  <h4 className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-wider px-3">
                    {group.groupName}
                  </h4>
                  <ul className="space-y-0.5">
                    {filteredItems.map((item) => {
                      const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium tracking-tight transition duration-200 ${
                              isActive
                                ? "bg-zinc-800 text-white font-semibold shadow border-l-2 border-indigo-500"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                            }`}
                          >
                            <LucideIcon name={item.icon} className="w-4 h-4 text-zinc-400" />
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        {/* 2. ROLE SWAP CONTROLLER (Audit Portal) */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40">
          <div className="mb-3">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">
              SWAP AUTHORITY ROLE
            </span>
            <div className="text-[10px] text-zinc-400 bg-zinc-900 p-2 rounded border border-zinc-800 font-mono mb-2">
              Current: <strong className="text-indigo-400 capitalize">{activeRole}</strong>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              {RoleRegistry.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoleSwap(r.id)}
                  className={`py-1 px-1.5 font-mono text-[9px] rounded border transition duration-150 uppercase font-semibold text-center truncate ${
                    activeRole === r.id
                      ? "bg-indigo-600/20 text-indigo-400 border-indigo-500"
                      : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-850 hover:text-zinc-300"
                  }`}
                  title={r.description}
                  id={`role-swap-btn-${r.id}`}
                >
                  {r.id === "superadmin" ? "Admin" : r.id}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-1.5 text-zinc-500 hover:text-red-400 font-mono text-[10px] tracking-wider py-1.5 border border-zinc-850 bg-zinc-900/50 rounded transition duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            DISCARD SESSION
          </button>
        </div>

      </aside>

      {/* 2. BODY CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-x-hidden">
        
        {/* Dynamic System Notification Banner */}
        {notificationSlot && (
          <div className="bg-indigo-950 text-indigo-300 px-6 py-2 border-b border-indigo-900 text-xs font-mono flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              <span>{notificationSlot}</span>
            </div>
            <button
              onClick={() => setNotificationSlot(null)}
              className="text-indigo-400 hover:text-white transition font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dynamic General Header */}
        <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-950/70 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              id="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs Slot */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-zinc-700" />}
                  <span
                    className={
                      idx === breadcrumbs.length - 1
                        ? "text-zinc-300 font-semibold"
                        : "text-zinc-500 hover:text-zinc-400 transition"
                    }
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Placeholder */}
            <div className="relative hidden lg:block">
              <span className="absolute inset-y-0 left-3 flex items-center text-zinc-600 font-mono text-[10px]">
                🔍
              </span>
              <input
                type="text"
                placeholder="Audit routes or attributes..."
                disabled
                className="bg-zinc-900/40 border border-zinc-800 rounded-lg pl-8 pr-4 py-1.5 text-xs text-zinc-400 focus:outline-none w-64 select-none"
              />
            </div>

            {/* Cloud Channel State Indicator */}
            <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800/80 px-2.5 py-1 rounded-full text-[10px] font-mono select-none">
              <Radio className={`w-3 h-3 ${isOnline ? "text-emerald-500" : "text-zinc-650"}`} />
              <span className="text-zinc-400 uppercase tracking-widest">
                {isOnline ? "LIVE CHANNEL" : "OFF-LINE"}
              </span>
            </div>

            {/* User credentials */}
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-mono text-xs font-bold leading-none select-none">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left text-xs">
                  <span className="block font-semibold text-zinc-300 leading-none">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block leading-none">
                    {activeRole.toUpperCase()} USER
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Global Page Content Grid */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative">
          {children}
        </main>

        {/* Global Footer Placeholder */}
        <footer className="border-t border-zinc-900 bg-zinc-950/40 py-6 px-8 text-center text-xs text-zinc-600 font-mono flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1">
            <p className="flex items-center gap-1">
              <span>SINGLE SOURCE OF TRUTH (SSOT):</span>
              <span className="text-emerald-500 font-bold">ACTIVE</span>
            </p>
            <p className="text-[10px] text-zinc-700 text-left">
              CARSS Experience Constitution v1 - Authority Active.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[10px]">
            <span className="hover:text-zinc-400 transition cursor-default">Security Standards v0.1</span>
            <span>•</span>
            <span className="hover:text-zinc-400 transition cursor-default">Enterprise Protection Shield</span>
            <span>•</span>
            <span className="hover:text-zinc-400 transition cursor-default">Blueprints Frozen</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
