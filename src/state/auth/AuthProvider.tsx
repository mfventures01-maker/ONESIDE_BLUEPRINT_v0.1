/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext, UserSession } from "./AuthContext";
import { RoleType } from "../../types";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";

export function determineRoleFromEmail(email: string): RoleType {
  const norm = email.toLowerCase();
  if (norm.includes("admin") || norm.includes("superadmin")) return "superadmin";
  if (norm.includes("ceo") || norm.includes("executive")) return "ceo";
  if (norm.includes("manager")) return "manager";
  return "staff";
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync session on mount
  useEffect(() => {
    const isConfigured = isSupabaseConfigured();

    if (!isConfigured) {
      // Local fallback mode
      const stored = localStorage.getItem("carss_user_session");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem("carss_user_session");
        }
      }
      setIsLoading(false);
      return;
    }

    // Supabase mode
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const email = session.user.email || "";
          setUser({
            id: session.user.id,
            email,
            role: determineRoleFromEmail(email),
            name: session.user.user_metadata?.full_name || email.split("@")[0],
          });
        }
      } catch (e) {
        console.error("Error retrieving Supabase session:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session && session.user) {
          const email = session.user.email || "";
          setUser({
            id: session.user.id,
            email,
            role: determineRoleFromEmail(email),
            name: session.user.user_metadata?.full_name || email.split("@")[0],
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error("Supabase signOut error:", e);
    } finally {
      setUser(null);
      localStorage.removeItem("carss_user_session");
      setIsLoading(false);
    }
  };

  const simulateLogin = (email: string, role: RoleType, name?: string) => {
    setIsLoading(true);
    const mockUser: UserSession = {
      id: `sim-${Date.now()}`,
      email,
      role,
      name: name || email.split("@")[0],
    };
    setUser(mockUser);
    localStorage.setItem("carss_user_session", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        logout,
        simulateLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
