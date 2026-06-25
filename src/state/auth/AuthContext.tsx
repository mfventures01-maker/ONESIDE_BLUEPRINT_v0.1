/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext } from "react";
import { RoleType } from "../../types";

export interface UserSession {
  id: string;
  email: string;
  role: RoleType;
  name?: string;
}

export interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  simulateLogin: (email: string, role: RoleType, name?: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
