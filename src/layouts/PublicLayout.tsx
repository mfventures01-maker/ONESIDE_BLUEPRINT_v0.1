/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApplicationStore } from "../state/Contexts";
import { Link } from "react-router-dom";
import { ShieldCheck, HelpCircle, ArrowLeftRight } from "lucide-react";

export default function PublicLayout({ children }: { children?: React.ReactNode }) {
  const { enterpriseName, notificationSlot, setNotificationSlot } = useApplicationStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Dynamic Notification Banner */}
      {notificationSlot && (
        <div className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 px-6 py-2 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{notificationSlot}</span>
          </div>
          <button onClick={() => setNotificationSlot(null)} className="text-zinc-500 hover:text-white">✕</button>
        </div>
      )}

      {/* Embedded Public Header */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-xs">P</div>
          <div className="text-sm font-bold tracking-tight">{enterpriseName} <span className="font-mono text-[9px] text-zinc-500 font-normal">PUBLIC BOUNDS</span></div>
        </div>

        {/* Header Breadcrumbs Placeholder */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span>Gateway</span>
          <span>/</span>
          <span className="text-zinc-300">Public Entrypoint</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="px-3 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded font-mono text-[10px] font-bold tracking-tight text-zinc-300 cursor-pointer">
            Go to Console (CEO)
          </Link>
        </div>
      </header>

      {/* Main Structural Framework supporting Sidebar, Content area, and Footer */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar Space (Architectural Placeholder for Public bounds) */}
        <aside className="hidden lg:flex w-56 border-r border-zinc-900 p-6 flex-col justify-between font-mono text-[10px] text-zinc-600 bg-zinc-950">
          <div>
            <span className="block font-bold text-zinc-500 mb-3 uppercase tracking-wider">Public Navigation</span>
            <ul className="space-y-2">
              <li className="text-zinc-400 font-semibold">• Public Gateway</li>
              <li className="text-zinc-650">• Authorization Portal</li>
              <li className="text-zinc-650">• Terminal Handshake</li>
            </ul>
          </div>
          <p className="leading-snug">
            Sidebar suspended inside Public Bounds. Sign-in to assume dashboard control.
          </p>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="my-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer Placeholder */}
      <footer className="border-t border-zinc-900 py-4 px-6 text-center text-[10px] text-zinc-600 font-mono flex items-center justify-between">
        <span>CARSS Experience Constitution — Public Framework</span>
        <span>GATEWAY PORT: CLOSED</span>
      </footer>

    </div>
  );
}
