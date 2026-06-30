/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { CarssResult } from "../types";
import { createCarssSuccess, createCarssError } from "../utils/carssResult";

export const AuthBoundary = {
  isOnline(): boolean {
    return isSupabaseConfigured();
  },

  async getSession(): Promise<CarssResult<any>> {
    try {
      if (this.isOnline()) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          return createCarssError([error.message], "Failed to get session from online provider");
        }
        return createCarssSuccess(session, "Session fetched successfully");
      }
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to retrieve session");
    }
    return createCarssSuccess(null, "Offline session (no auth provider)");
  },

  onAuthStateChange(callback: (event: string, session: any) => void): { unsubscribe: () => void } {
    if (this.isOnline()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
      return subscription;
    }
    return { unsubscribe: () => {} };
  },

  async signOut(): Promise<CarssResult<void>> {
    try {
      if (this.isOnline()) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          return createCarssError([error.message], "Sign out failed online");
        }
      }
      return createCarssSuccess(undefined, "Signed out successfully");
    } catch (err: any) {
      return createCarssError([err.message || String(err)], "Failed to sign out");
    }
  }
};
