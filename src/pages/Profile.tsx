/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../state/auth/useAuth";
import { useRoleStore } from "../state/Contexts";
import { Shield, Fingerprint, Award, FileSpreadsheet } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { activeRole, clearances } = useRoleStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 relative overflow-hidden backdrop-blur">
          <div className="absolute top-0 right-0 w-80 h-40 bg-zinc-500/5 rounded-full blur-[90px] -z-10" />
          <h3 className="text-xl font-bold font-mono tracking-tight text-white mb-2 uppercase">
            Authority Profile
          </h3>
          <p className="text-xs text-zinc-400 font-sans max-w-xl leading-relaxed">
            Manage your personal profile, credentials, and view active security scopes registered to your account session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Info Card */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-6 relative overflow-hidden">
            <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-200 border-b border-zinc-850 pb-3 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-400" />
              <span>Identity Assertions</span>
            </h4>

            <div className="space-y-4">
              <div>
                <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">
                  Full Identification Name
                </span>
                <span className="block text-sm font-semibold text-white uppercase font-mono">
                  {user?.name || "Anonymous Operator"}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">
                  Compliance Email
                </span>
                <span className="block text-xs font-mono text-zinc-300">
                  {user?.email || "anonymous@carss.gov"}
                </span>
              </div>

              <div>
                <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">
                  Associated Identifier ID
                </span>
                <span className="block text-xs font-mono text-zinc-300">
                  {user?.id || "unregistered"}
                </span>
              </div>
            </div>
          </div>

          {/* Scope Isotopic / Integrity Isolation Rules Card */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6 space-y-6 md:col-span-2 relative overflow-hidden">
            <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-200 border-b border-zinc-850 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Authorization Scopes in Force</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">
                    Isolation Level
                  </span>
                  <span className="inline-block px-2.5 py-1 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 font-mono text-xs rounded uppercase font-semibold">
                    {activeRole.toUpperCase()} LEVEL APPROVED
                  </span>
                </div>

                <div>
                  <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-1">
                    Compliance Clearances
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {clearances.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 text-zinc-400 text-[10px] font-mono rounded"
                      >
                        {c.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-3">
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 uppercase font-black tracking-wide">
                  <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                  <span>Verified Qualifications:</span>
                </div>
                <div className="space-y-1.5 font-mono text-[9px] text-zinc-500">
                  <div className="flex justify-between border-b border-zinc-925 pb-1">
                    <span>TRUST ANCHOR (CARSS)</span>
                    <span className="text-emerald-500">PASS</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-925 pb-1">
                    <span>FSM CERTIFICATE v3</span>
                    <span className="text-emerald-500">ACTIVE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AUDIT RECORD STORAGE</span>
                    <span className="text-emerald-500">BOUNDED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
