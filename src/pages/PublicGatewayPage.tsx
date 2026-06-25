/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Fingerprint, Lock, Cpu, Globe, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../state/auth/useAuth";

export default function PublicGatewayPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-950/40 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold font-mono tracking-wider text-zinc-100 uppercase">
              CARSS Constitutional Platform
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Governance &amp; Operations Desk
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 bg-zinc-920 border border-zinc-900 px-3 py-1.5 rounded-full">
          <Cpu className="w-3.5 h-3.5 text-emerald-500" />
          <span>RUNTIME ACTIVE [ v2.5 ]</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full inline-flex items-center gap-2 mb-6">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              GLOBAL COMPLIANCE RUNTIME CONSOLE
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-zinc-100 mb-6 font-mono uppercase">
            CONSTITUTIONAL SECURITY <br />
            <span className="text-indigo-400">&amp; CONTROL SYSTEM</span>
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto font-sans leading-relaxed">
            The Constitution requires robust data custody, authorization guards, and deterministic audit trails. State, control parameters, and records are isolated by security clearance.
          </p>
        </motion.div>

        {isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center shadow-lg"
          >
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold font-mono tracking-tight uppercase text-zinc-100 mb-1">
              Active Authorized Session
            </h3>
            <p className="text-xs font-mono text-zinc-500 mb-4 uppercase">
              {user?.email} as [ {user?.role.toUpperCase()} ]
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition shadow-lg shadow-indigo-600/10"
            >
              Access Active Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-4">
            {/* CEO / Admin Path */}
            <motion.button
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={() => navigate("/auth/ceo")}
              className="flex flex-col items-start p-6 bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-850 hover:border-indigo-500/30 rounded-2xl transition text-left relative overflow-hidden group shadow-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition" />
              <div className="w-10 h-10 bg-indigo-950/50 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-white group-hover:text-indigo-400 transition mb-2">
                Executive &amp; Admin
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans pr-6">
                Single sign-on entry for Chief Executive Officers, Directors, and Compliance Super Administrators.
              </p>
            </motion.button>

            {/* Staff / Operator Path */}
            <motion.button
              whileHover={{ y: -3, scale: 1.01 }}
              onClick={() => navigate("/auth/staff")}
              className="flex flex-col items-start p-6 bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-850 hover:border-emerald-500/30 rounded-2xl transition text-left relative overflow-hidden group shadow-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
              <div className="w-10 h-10 bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mb-6">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-white group-hover:text-emerald-400 transition mb-2">
                Operator Terminal
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans pr-6">
                Secure PIN clearance system for operational staff, controllers, and localized team accounts.
              </p>
            </motion.button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
        <span>© 2026 CARSS REPLICATED SYSTEM. ALL RIGHTS SECURED.</span>
        <div className="flex gap-6">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            SECURE OUTBOUND LINKS DIRECTED
          </span>
          <span>STATION ID: 0xFF14</span>
        </div>
      </footer>
    </div>
  );
}
