/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Key, UserCheck, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../state/auth/useAuth";

export default function CEOLogin() {
  const navigate = useNavigate();
  const { simulateLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Compliance email address is required.");
      return;
    }

    // Determine role and trigger simulated/Supabase authentications
    let role: "superadmin" | "ceo" | "manager" | "staff" = "staff";
    const norm = email.toLowerCase();
    if (norm.includes("admin")) role = "superadmin";
    else if (norm.includes("ceo") || norm.includes("executive")) role = "ceo";
    else if (norm.includes("manager")) role = "manager";

    simulateLogin(email, role, email.split("@")[0]);
    navigate("/dashboard");
  };

  const selectSimulation = (role: "superadmin" | "ceo" | "manager") => {
    const addresses = {
      superadmin: "admin@carss.gov",
      ceo: "ceo@carss.gov",
      manager: "manager@carss.gov",
    };
    const emailAddr = addresses[role];
    simulateLogin(emailAddr, role, role === "ceo" ? "Executive Leader" : role === "superadmin" ? "Systems Custodian" : "Operational Mgr");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-sans relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-505/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md w-full">
        {/* Back Link */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 hover:text-zinc-300 transition mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
          <span>RETURN TO COMPLIANCE GATEWAY</span>
        </button>

        <div className="bg-zinc-900/60 border border-zinc-850 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Accent decoration */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-500/20 via-indigo-500 to-indigo-500/20" />

          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-mono text-white uppercase tracking-tight">
              Executive Console Auth
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
              AUTHORIZED ACCESS CHANNELS ONLY
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 font-mono text-[11px] flex gap-2 items-start mb-6">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Direct Credential Input */}
          <form onSubmit={handleCustomSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
                Constitutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Name.family@carss.gov"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
                Identity Credentials (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              Request Credentials Verification
            </button>
          </form>

          {/* Simulation bypass shortcuts */}
          <div className="pt-6 border-t border-zinc-850">
            <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider text-center mb-4">
              DEVELOPMENT SIMULATION BYPASS
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => selectSimulation("superadmin")}
                className="py-2.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-mono rounded-lg transition uppercase tracking-wider text-zinc-300 hover:text-white"
              >
                Superadmin
              </button>
              <button
                onClick={() => selectSimulation("ceo")}
                className="py-2.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-mono rounded-lg transition uppercase tracking-wider text-zinc-300 hover:text-white"
              >
                CEO
              </button>
              <button
                onClick={() => selectSimulation("manager")}
                className="py-2.5 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-mono rounded-lg transition uppercase tracking-wider text-zinc-300 hover:text-white"
              >
                Manager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
