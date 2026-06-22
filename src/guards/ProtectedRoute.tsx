/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ComponentType } from "react";
import { useUserStore } from "../state/Contexts";
import { RoleType } from "../types";
import { RoleGuard } from "./RoleGuard";
import { Lock, LogIn } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles: RoleType[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, loginAs } = useUserStore();

  if (!isAuthenticated) {
    return (
      <div id="auth-guard-sign-in" className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-zinc-100 font-sans">
        <div className="max-w-md w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-700/60 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 font-mono">AUTHENTICATING BOUNDARY</h2>
          <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
            Enterprise Shell Core Gateway
          </p>

          <p className="text-zinc-400 text-sm mt-4 mb-8">
            This module resides inside the secure authenticated layer. Use the quick-auth controls beneath to claim an operator credential.
          </p>

          <div className="space-y-2">
            <button
              onClick={() => loginAs("ceo")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-semibold text-zinc-100 transition duration-200 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Assume CEO Control
            </button>
            <button
              onClick={() => loginAs("staff")}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-semibold text-zinc-300 transition duration-200 cursor-pointer"
            >
              Sign In as Standard Staff
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-900 text-[10px] text-zinc-600 font-mono flex justify-between items-center">
            <span>SSOT ACTIVE</span>
            <span>v0.1-ENTERPRISE-SHELL</span>
          </div>
        </div>
      </div>
    );
  }

  return <RoleGuard allowedRoles={allowedRoles}>{children}</RoleGuard>;
}
