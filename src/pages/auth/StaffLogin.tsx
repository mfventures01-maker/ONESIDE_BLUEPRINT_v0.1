/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Key, Fingerprint, ShieldAlert, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../state/auth/useAuth";
import { verifyPin } from "../../services/pinService";

export default function StaffLogin() {
  const navigate = useNavigate();
  const { simulateLogin } = useAuth();
  const [operatorId, setOperatorId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!operatorId) {
      setError("Operator Identification Code is required.");
      return;
    }
    if (!pin) {
      setError("Verification PIN is required.");
      return;
    }

    const verifiedProfile = verifyPin(operatorId.toUpperCase().trim(), pin);
    if (!verifiedProfile) {
      setError("OPERATOR VERIFICATION EXCEPTION: Pin fingerprint or identification mismatches.");
      return;
    }

    // Successfully verified, trigger session login
    simulateLogin(
      `${verifiedProfile.id.toLowerCase()}@carss.gov`,
      verifiedProfile.role,
      verifiedProfile.name
    );
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-sans relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

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
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20" />

          {/* Logo & Headline */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold font-mono text-white uppercase tracking-tight">
              Operator Terminal Pin
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
              CONSTITUTIONAL DESK SECURE PIN SYSTEM
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 font-mono text-[11px] flex gap-2 items-start mb-6">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
                Operator ID / Classification
              </label>
              <input
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                placeholder="STAFF-01 or STAFF-99 or MGR-01"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-700 uppercase focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5">
                Passcode PIN Fingerprint
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="•••• (4-digit code)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-xs text-white tracking-widest placeholder-zinc-700 text-center focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer"
            >
              Sign-In Operational Scope
            </button>
          </form>

          {/* Quick reference block */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-xl font-mono text-[10px] text-zinc-500 space-y-2 leading-relaxed">
            <div className="flex gap-1.5 text-zinc-400">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="uppercase tracking-wider font-bold">STAFF DIRECTORY DECAL:</span>
            </div>
            <div className="flex justify-between pl-5 border-l border-zinc-850">
              <span>Jane Doe (Staff)</span>
              <span>STAFF-01 / PIN: 1234</span>
            </div>
            <div className="flex justify-between pl-5 border-l border-zinc-850">
              <span>Active Operator (Staff)</span>
              <span>STAFF-99 / PIN: 9999</span>
            </div>
            <div className="flex justify-between pl-5 border-l border-zinc-850">
              <span>Bob Manager (Manager)</span>
              <span>MGR-01 / PIN: 5555</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
