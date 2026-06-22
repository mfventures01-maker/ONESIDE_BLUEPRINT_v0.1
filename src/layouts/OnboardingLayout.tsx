/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApplicationStore } from "../state/Contexts";
import { Link } from "react-router-dom";
import { Layers, HelpCircle } from "lucide-react";

export default function OnboardingLayout({ children }: { children?: React.ReactNode }) {
  const { enterpriseName, notificationSlot } = useApplicationStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* 1. NOTIFICATION SLOT */}
      {notificationSlot && (
        <div className="bg-sky-950 text-sky-300 px-6 py-2 border-b border-sky-900 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            <span>ONBOARDING MODE: {notificationSlot}</span>
          </div>
        </div>
      )}

      {/* 2. HEADER */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-mono font-bold text-xs">O</div>
          <div className="text-sm font-bold tracking-tight">Onboarding Desk — {enterpriseName}</div>
        </div>

        {/* Header Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span>Enterprise Setup</span>
          <span>/</span>
          <span className="text-zinc-300">Credentials Bootstrap</span>
        </div>

        <Link to="/dashboard" className="px-3 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded font-mono text-[10px] text-zinc-400 cursor-pointer">
          Abort to Console
        </Link>
      </header>

      {/* 3. STRUCTURAL CONTENT AREA */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Onboarding Compact Status Sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-zinc-900 p-6 flex-col justify-between font-mono text-xs text-zinc-650 bg-zinc-955">
          <div className="space-y-4">
            <span className="block font-bold text-zinc-500 uppercase tracking-widest text-[9px]">Bootstrap Steps</span>
            <ul className="space-y-3">
              <li className="text-sky-400 font-semibold flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-sky-950/40 text-sky-400 flex items-center justify-center border border-sky-500 text-[10px]">1</span>
                <span>Select Target Authority</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zinc-900 text-zinc-650 flex items-center justify-center border border-zinc-800 text-[10px]">2</span>
                <span>Initialize Core Tables</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-zinc-900 text-zinc-650 flex items-center justify-center border border-zinc-800 text-[10px]">3</span>
                <span>Confirm Lock State</span>
              </li>
            </ul>
          </div>
          <div className="text-[10px] border-t border-zinc-900 pt-4 text-zinc-600 leading-snug">
            All tables are secured and compliant with CARSS SSOT.
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <div className="w-full">
            {children}
          </div>
        </main>

      </div>

      {/* 4. FOOTER */}
      <footer className="border-t border-zinc-950 py-4 px-6 text-center text-[10px] text-zinc-600 font-mono flex justify-between select-none">
        <span>CARSS Onboarding Protocol v1</span>
        <span>BOOTSTRAP COMPLETE</span>
      </footer>

    </div>
  );
}
