/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/auth/useAuth";
import { useRoleStore } from "../state/Contexts";
import { RoleType } from "../types";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { activeRole } = useRoleStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-mono text-xs text-zinc-400 gap-2">
        <span className="w-1.5 h-1.5 rounded bg-indigo-505 animate-pulse" />
        <span>EVALUATING PERMISSION SCOPE...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 font-sans">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-amber-950/30 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-tight mb-2">
            Clearance Insufficient
          </h2>
          <p className="text-xs text-zinc-400 font-mono mb-6 leading-relaxed">
            YOUR CURRENT SECURITY LEVEL [ {activeRole.toUpperCase()} ] DOES NOT PERMIT ACCESS TO THIS SEGMENT.
          </p>
          <div className="flex justify-center gap-4">
            <Navigate to="/dashboard" replace />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
