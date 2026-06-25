/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AuthBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AuthBoundary caught an error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 font-sans">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-950/30 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase tracking-tight mb-2">
              Authentication Error Boundary
            </h2>
            <p className="text-xs text-zinc-400 font-mono mb-6 leading-relaxed">
              AN OPERATIONAL EXCEPTION WAS CAUGHT DURING RUNTIME VERIFICATION.
            </p>
            <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-lg text-left mb-6 overflow-x-auto">
              <pre className="font-mono text-[11px] text-red-400 leading-normal">
                {this.state.error?.message || "Unknown anomaly detected"}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs uppercase tracking-wider rounded-lg transition"
            >
              Reset Session State
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
