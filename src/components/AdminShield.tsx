/**
 * CARSS Constitutional AdminShield Component
 *
 * TESTING VERIFICATION STEPS:
 * 1. Click the Shield -> "Admin / CEO" -> Login with mfventures01@gmail.com (Superadmin).
 * 2. The page should reload and redirect to /onboarding.
 * 3. Click the Shield -> "Staff PIN" -> Enter a valid 4-6 digit PIN from staff_profiles.pin_code.
 * 4. The page should reload and redirect to /dashboard (or the staff's assigned workspace).
 */

import React, { useState } from 'react';
import { Shield, X, User, Key, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { rpcClient } from '../lib/rpc/rpcClient';

export function AdminShield() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'admin' | 'pin'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePopover = () => {
    setIsOpen((prev) => !prev);
    setError(null);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Authentication failed');
        setLoading(false);
        return;
      }

      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pin || pin.trim().length < 4) {
      setError('Please enter a valid 4 to 6 digit PIN');
      return;
    }

    setLoading(true);
    try {
      const { data, error: rpcError } = await rpcClient.call('authenticate_with_pin', { pin });

      if (rpcError) {
        setError(rpcError.message || 'Invalid or inactive PIN');
        setLoading(false);
        return;
      }

      if (data === false) {
        setError('Authentication rejected: Invalid PIN');
        setLoading(false);
        return;
      }

      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'PIN verification failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popover Gateway Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 glass-panel p-5 shadow-2xl animate-popover text-white border border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#C46210]/20 border border-[#C46210]/40">
                <Shield className="w-5 h-5 text-[#C46210]" />
              </div>
              <div>
                <h3 className="font-montserrat text-sm font-bold tracking-wider uppercase text-white">
                  Admin Gateway
                </h3>
                <p className="font-inter text-xs text-slate-400">
                  CARSS Constitutional Access
                </p>
              </div>
            </div>
            <button
              onClick={togglePopover}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
              aria-label="Close Admin Shield"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 mb-4 rounded-lg bg-slate-900/80 border border-white/5">
            <button
              type="button"
              onClick={() => {
                setMode('admin');
                setError(null);
              }}
              className={`py-1.5 text-xs font-montserrat uppercase tracking-wider rounded-md transition-all ${
                mode === 'admin'
                  ? 'bg-[#C46210] text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin / CEO
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('pin');
                setError(null);
              }}
              className={`py-1.5 text-xs font-montserrat uppercase tracking-wider rounded-md transition-all ${
                mode === 'pin'
                  ? 'bg-[#25D366] text-black font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Staff PIN
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-2.5 rounded-md bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-inter flex items-start space-x-2">
              <span className="font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email/Password Form for Superadmin & CEO */}
          {mode === 'admin' ? (
            <form onSubmit={handleAdminLogin} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="admin@oneside.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C46210] font-inter transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C46210] font-inter transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-[#C46210] hover:bg-[#A3510C] text-white font-montserrat uppercase tracking-wider text-xs font-bold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Authenticating...</span>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Authorize Access</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* PIN Form for Staff */
            <form onSubmit={handlePinLogin} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-montserrat uppercase tracking-wider text-slate-300 mb-1">
                  Enter 4-6 Digit Staff PIN
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white tracking-widest placeholder-slate-500 focus:outline-none focus:border-[#25D366] font-mono transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#1FA851] text-black font-montserrat uppercase tracking-wider text-xs font-bold rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Verifying PIN...</span>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Authenticate PIN</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating Shield Button */}
      <button
        onClick={togglePopover}
        className="animate-breathing group flex items-center justify-center w-12 h-12 rounded-full bg-[#C46210] hover:bg-[#A3510C] text-white shadow-2xl border border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C46210] focus:ring-offset-2 focus:ring-offset-[#0F172A]"
        aria-label="Open Admin Shield Gateway"
      >
        <Shield className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
      </button>
    </div>
  );
}

export default AdminShield;
