import React, { useState } from 'react';
import { Shield, X, User, Key, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { rpcClient } from '../lib/rpc/rpcClient';

export default function AdminShield() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'email' | 'pin'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleShield = () => {
    setIsOpen(!isOpen);
    setError('');
    setLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await rpcClient.call('authenticate_with_pin', { pin });
      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError('Invalid PIN or staff profile not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-inter">
      <button
        onClick={toggleShield}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full glass-panel bg-deep-slate/80 border border-white/10 shadow-2xl transition-all hover:scale-105 hover:border-burnt-ochre"
      >
        <Shield className="h-6 w-6 text-slate-400 group-hover:text-burnt-ochre transition-colors" />
        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-whatsapp-green text-[8px] text-white font-bold">1</div>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 rounded-xl glass-panel border border-white/10 shadow-2xl p-5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <h3 className="font-montserrat text-sm font-bold uppercase tracking-wider text-white">
              <Key className="inline h-4 w-4 mr-2 text-burnt-ochre" /> Admin Gate
            </h3>
            <button onClick={toggleShield} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-4 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setMode('email')}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
                mode === 'email' ? 'bg-burnt-ochre text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin / CEO
            </button>
            <button
              onClick={() => setMode('pin')}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${
                mode === 'pin' ? 'bg-whatsapp-green text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Staff PIN
            </button>
          </div>

          {error && (
            <div className="mb-3 rounded border border-red-500/20 bg-red-500/10 p-2 text-center text-xs text-red-400">
              {error}
            </div>
          )}

          {mode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-burnt-ochre focus:outline-none"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-burnt-ochre focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-burnt-ochre py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Access Portal'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePinLogin} className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter Staff PIN (4-6 digits)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-lg bg-white/5 border border-white/10 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-whatsapp-green focus:outline-none tracking-[0.5em]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || pin.length < 4}
                className="w-full rounded-lg bg-whatsapp-green py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Verifying PIN...' : 'Unlock Workspace'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
