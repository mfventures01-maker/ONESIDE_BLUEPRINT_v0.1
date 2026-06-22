/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { useApplicationStore } from "../state/Contexts";
import { AlertOctagon, HelpCircle } from "lucide-react";

export default function ErrorLayout({ children }: { children?: React.ReactNode }) {
  const { enterpriseName } = useApplicationStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Dynamic Notification Slot */}
      <div className="bg-red-950 text-red-300 px-6 py-2 border-b border-red-900 text-xs font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>SYSTEM DISPATCH: FATAL COLLAPSE ISOLATOR ENGAGED</span>
        </div>
      </div>

      {/* Header with Breadcrumbs */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-950 text-red-400 border border-red-900/40 flex items-center justify-center font-mono font-bold text-xs">✕</div>
          <div className="text-sm font-bold tracking-tight">System Guard Desk — {enterpriseName}</div>
        </div>

        <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span>System Isolation</span>
          <span>/</span>
          <span className="text-zinc-300">Failure Boundaries</span>
        </div>

        <Link to="/dashboard" className="px-3 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded font-mono text-[10px] text-red-400 cursor-pointer">
          Force Reset Workspace
        </Link>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Error State Sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-zinc-905 p-6 flex-col justify-between font-mono text-xs text-red-450 bg-zinc-955">
          <div className="space-y-4">
            <span className="block font-bold text-red-500 uppercase tracking-widest text-[9px]">Inter-Territorials</span>
            <ul className="space-y-2">
              <li className="font-semibold text-red-400 flex items-center gap-1.5">• Intercept Active</li>
              <li className="text-zinc-650">• DB Integrity Safe</li>
              <li className="text-zinc-650">• Cache Purged</li>
            </ul>
          </div>
          <p className="text-[10px] text-zinc-600 leading-snug">
            All database transactions are frozen in state to protect single-source-of-truth integrity.
          </p>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <div className="w-full">
            {children}
          </div>
        </main>

      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-950 py-4 px-6 text-center text-[10px] text-zinc-600 font-mono flex justify-between">
        <span>CARSS Isolation Shield v0.1</span>
        <span>ERROR RECONCILE READY</span>
      </footer>

    </div>
  );
}
