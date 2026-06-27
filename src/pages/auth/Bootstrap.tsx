/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cpu, Terminal, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Bootstrap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-sans relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md w-full">
        {/* Back Link */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 hover:text-zinc-300 transition mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
          <span>RETURN TO COMPLIANCE GATEWAY</span>
        </button>

        <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-500/20 via-indigo-500 to-indigo-500/20" />

          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold font-mono text-white uppercase tracking-tight">
              Constitutional Bootstrap
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
              SYSTEM BOOTSTRAP TERMINAL LAYER
            </p>
          </div>

          {/* Diagnostic Status Box */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-xl font-mono text-[11px] text-zinc-400 space-y-3 leading-relaxed mb-6">
            <div className="flex gap-1.5 text-zinc-300 font-bold border-b border-zinc-850 pb-2 mb-2">
              <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span className="uppercase tracking-wider">BOOTSTRAP HEALTH MATRIX:</span>
            </div>
            <div className="flex justify-between items-center pl-2 border-l border-zinc-800">
              <span>DATABASE COURTROOM</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                <span>ONLINE</span>
              </span>
            </div>
            <div className="flex justify-between items-center pl-2 border-l border-zinc-800">
              <span>WAVE 5 SCHEMA COVERAGE</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                <span>100% SECURE</span>
              </span>
            </div>
            <div className="flex justify-between items-center pl-2 border-l border-zinc-800">
              <span>ROUTING BINDINGS</span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <CheckCircle className="w-3 h-3 text-indigo-400" />
                <span>INTEGRATING</span>
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="font-mono text-[10px] text-zinc-500 uppercase">
              CARSS REGISTRY CERTIFIED SYSTEM BOOTSTRAP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
