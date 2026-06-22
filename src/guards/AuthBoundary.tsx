/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AuthBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CARSS AuthBoundary intercepted UI render exception:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="auth-boundary-crash-panel" className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-zinc-100 font-sans">
          <div className="max-w-xl w-full bg-zinc-950 border border-zinc-800 rounded-xl p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h2 className="text-md font-mono font-bold tracking-tight uppercase">INTER-TERRITORIAL FAULT DETECTED</h2>
                <div className="text-[10px] font-mono text-zinc-500 mt-0.5">CARSS BOUNDARY ISOLATOR TRIGGERED</div>
              </div>
            </div>

            <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
              A layout crash occurred during rendering. This isolation prevents full-workspace collapse, maintaining runtime container stability.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg font-mono text-xs text-red-400 overflow-x-auto max-h-[160px] mb-6">
              <span className="text-zinc-500 font-bold block mb-1">System Trace:</span>
              {this.state.error?.toString() || "Unknown rendering breakdown"}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
              <span className="text-[10px] text-zinc-600 font-mono">CODE: SE_FAULT_UI_RENDER</span>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-xs font-mono font-semibold transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restore Workspace
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default AuthBoundary;
