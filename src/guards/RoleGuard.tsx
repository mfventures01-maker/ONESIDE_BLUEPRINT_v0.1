/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from "react";
import { useRoleStore } from "../state/Contexts";
import { RoleType } from "../types";
import { ShieldAlert, KeyRound, ArrowLeftRight } from "lucide-react";

interface RoleGuardProps {
  allowedRoles: RoleType[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { activeRole, clearances } = useRoleStore();

  const isAuthorized = allowedRoles.includes(activeRole);

  if (!isAuthorized) {
    return (
      <div id="role-guard-lockscreen" className="flex flex-col items-center justify-center p-8 bg-zinc-950/40 border border-red-950/50 rounded-xl max-w-2xl mx-auto my-12 text-zinc-100 backdrop-blur-md">
        <div className="p-4 bg-red-950/30 rounded-full border border-red-500/25 mb-4 text-red-400 animate-pulse">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h3 className="font-mono text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <span>CONSTITUTIONAL BOUNDARY EXCEEDED</span>
        </h3>
        <p className="text-xs text-zinc-400 font-mono mt-1 text-center">
          CARSS ACCESS SECURITY POLICIES SHIELD ACTIVE
        </p>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-6" />

        <div className="grid grid-cols-2 gap-6 w-full text-left bg-zinc-900/40 p-4 rounded-lg border border-zinc-800">
          <div>
            <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Active Operator Authority</span>
            <span className="font-mono text-sm font-semibold text-red-400 capitalize flex items-center gap-1.5 mt-1">
              <KeyRound className="w-3.5 h-3.5" />
              {activeRole}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-wider">Required Certification</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {allowedRoles.map((role) => (
                <span
                  key={role}
                  className="font-mono text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/60 font-semibold uppercase"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-zinc-400 text-xs font-mono text-center max-w-md">
          <p className="mb-2">
            This workspace utilizes strict single-source-of-truth authorization. Toggle your active authority role in the sidebar control desk to audit page content.
          </p>
          <span className="text-[10px] bg-red-950/20 text-red-400 border border-red-900 px-2 py-1 rounded select-none inline-block">
            ERR_AUTHORITY_INSUFFICIENT (SSOT_FENCE_DISPATCH_CODE)
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
