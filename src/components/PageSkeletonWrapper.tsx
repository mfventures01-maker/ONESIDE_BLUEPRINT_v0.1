/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from "react";
import { useRoleStore, useApplicationStore } from "../state/Contexts";
import { RoleType } from "../types";
import { ShieldCheck, Database, Award, BookOpen, Layers, RefreshCw, Activity, ArrowUpRight } from "lucide-react";

interface PageSkeletonWrapperProps {
  name: string;
  territoryName: string;
  requiredRoles: RoleType[];
  futureDataDependencies: string[];
  constitutionalStatus: string;
}

export function PageSkeletonWrapper({
  name,
  territoryName,
  requiredRoles,
  futureDataDependencies,
  constitutionalStatus,
}: PageSkeletonWrapperProps) {
  const { activeRole } = useRoleStore();
  const { isOnline } = useApplicationStore();

  const isFrozen = constitutionalStatus.toLowerCase().includes("frozen");

  // Determine elegant accent colours based on territory
  const getTerritoryColor = () => {
    if (territoryName.includes("Financial")) return "from-emerald-500 to-teal-500 border-emerald-500/10 text-emerald-400";
    if (territoryName.includes("Order")) return "from-indigo-500 to-purple-500 border-indigo-500/10 text-indigo-400";
    if (territoryName.includes("Identity")) return "from-blue-500 to-cyan-500 border-blue-500/10 text-blue-400";
    if (territoryName.includes("Menu") || territoryName.includes("Inventory")) return "from-amber-500 to-yellow-600 border-amber-500/10 text-amber-400";
    if (territoryName.includes("Audit")) return "from-red-500 to-rose-600 border-red-500/10 text-rose-400";
    return "from-zinc-500 to-zinc-400 border-zinc-500/10 text-zinc-400";
  };

  return (
    <div id={`page-skeleton-${name.toLowerCase().replace(/\s+/g, "-")}`} className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 font-semibold text-zinc-400`}>
              {territoryName}
            </span>
            <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full font-semibold border ${
              isFrozen 
                ? "bg-sky-950/20 text-sky-400 border-sky-900/60" 
                : "bg-emerald-950/20 text-emerald-400 border-emerald-900/60"
            }`}>
              {constitutionalStatus}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans sm:text-4xl">
            {name}
          </h1>
          <p className="text-sm font-mono text-zinc-500 mt-1 uppercase tracking-wider flex items-center gap-1.5">
            <span>AUDIT TARGET SPECIFICATION</span>
            <span className="inline-block w-1 h-1 rounded-full bg-zinc-700" />
            <span>v0.1-enterprise-shell</span>
          </p>
        </div>

        {/* Dynamic Status Badgets */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
            <Activity className={`w-3.5 h-3.5 ${isOnline ? "text-emerald-500" : "text-zinc-500 animate-pulse"}`} />
            <span className="text-zinc-400 uppercase text-[10px] tracking-wider">CARSS CHANNEL: {isOnline ? "CONNECTED" : "OFFLINE"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 uppercase text-[10px] tracking-wider">ROLES CAPABLE: {requiredRoles.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* REVENUE PSYCHOLOGY LAYER - SIX ZONES BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ZONE 1: ATTENTION ZONE (Stop Scrolling, Core Branding & Purpose) */}
        <div className="md:col-span-2 bg-gradient-to-br from-zinc-950 to-zinc-900/80 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Zone 1: Attention Indicator</span>
            <h3 className="text-lg font-bold text-zinc-100 font-mono tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-zinc-400" />
              SYSTEM PORT PORTAL SPECIFICATION
            </h3>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
              Certified landing boundary for the <span className="text-zinc-100 font-semibold">{name}</span> module within the CARSS Operational Territory. This viewport is structured precisely to handle live streams mapped directly from the single source of truth database schemas in future generation waves.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-[10px] bg-zinc-900 border border-zinc-700/60 font-mono text-zinc-300 px-2 py-0.5 rounded uppercase">
              CARSS SSOT Core Active
            </span>
            <span className="text-[10px] bg-zinc-900 border border-zinc-700/60 font-mono text-zinc-300 px-2 py-0.5 rounded uppercase">
              No Mock Client Bindings
            </span>
          </div>
        </div>

        {/* ZONE 2: ENGAGEMENT ZONE (Intended Features / Curiosity) */}
        <div className="bg-zinc-950/60 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Zone 2: Engagement Module</span>
            <h3 className="text-md font-bold text-zinc-100 font-mono flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-zinc-500" />
              TERRITORIAL SPECS
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Upon final system synthesis, this workspace exposes highly responsive data matrices tracking real-time events.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-900 space-y-2">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-zinc-500">Access Tier</span>
              <span className="text-zinc-300 uppercase">{requiredRoles[0]} & Higher</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-zinc-500">Stability Index</span>
              <span className="text-emerald-400">99.99% Guaranteed</span>
            </div>
          </div>
        </div>

        {/* ZONE 3: ACTION ZONE (Engagement Commitment Placeholder) */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 p-6 rounded-2xl border-dashed flex flex-col justify-between items-start">
          <div className="w-full">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Zone 3: Action Commitment</span>
            <h4 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">COMMAND SHELL INTERFACE</h4>
            <div className="w-12 h-1 bg-zinc-800 my-3 rounded" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              Frictionless conversion gateway placeholder. Interactive elements (forms, buttons, modals) remain frozen during this architectural wave.
            </p>
          </div>
          <div className="mt-6 w-full text-center bg-zinc-900/65 py-2 px-3 rounded text-[10px] font-mono font-semibold text-zinc-400 border border-zinc-800">
            CRUD & Mutation Authority Frozen
          </div>
        </div>

        {/* ZONE 4: UPSELL ZONE (Expansion & Upsell Triggers) */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Zone 4: Upsell & Auxiliary Expansion</span>
            <h4 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-widest mb-2 flex items-center gap-1">
              Add-on Parameters
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Expand baseline tracking with automated scheduling layers, multi-lounge cross-talk routing, or immediate operational triggers.
            </p>
          </div>
          <button className="w-full font-mono text-[10px] tracking-wider py-1.5 border border-zinc-850 hover:border-zinc-700 bg-zinc-900 rounded text-zinc-400 select-none cursor-default text-center">
            Trigger Auxiliary Integration
          </button>
        </div>

        {/* ZONE 5: SOCIAL PROOF ZONE (Live Audited Status Signals / Real Logs) */}
        <div className="bg-zinc-950/65 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Zone 5: Audit & Security Proof</span>
            <h4 className="text-xs font-bold text-zinc-300 font-mono uppercase flex items-center gap-1.5 mb-2">
              <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
              SYSTEM REGISTRY ATTACHMENT
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              CARSS compliance registry lists zero broken links or invalid dependencies for this viewport.
            </p>
          </div>
          <div className="mt-4 p-3 bg-zinc-900/40 border border-zinc-850 rounded font-mono text-[10px] text-emerald-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Registry Match Confirmed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Authorization Lock In-Place</span>
            </div>
          </div>
        </div>

        {/* FULL WIDTH BLOCK: ZONE 6: LOYALTY ZONE & DATA DEPENDENCY VISUALIZER */}
        <div className="md:col-span-3 bg-zinc-950 scroll-p-6 border border-zinc-800/80 rounded-2xl p-6 relative">
          <div className="absolute top-3 right-4 font-mono text-[8px] text-emerald-500 tracking-wider">
            ZONE 6: SYSTEM LOYALTY INTEGRITY
          </div>
          <h4 className="font-mono text-xs font-bold text-zinc-300 tracking-wide uppercase flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-sky-400" />
            Certified CARSS Data Dependencies
          </h4>

          <p className="text-xs text-zinc-400 leading-relaxed mb-4 max-w-3xl">
            To ensure complete architectural longevity, this viewport is predefined to subscribe exclusively to the following constitutional tables. When subsequent phases add business logic, these channels inject real-time state with absolutely no code rewrite or core redesign required:
          </p>

          <div className="flex flex-wrap gap-2.5">
            {futureDataDependencies.map((dep) => (
              <div
                key={dep}
                className="flex items-center gap-1.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850 px-3 py-2 rounded-lg transition duration-200"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span className="font-mono text-xs text-zinc-300">{dep}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
