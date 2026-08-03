import { createContext, useContext } from 'react';

export interface AuthState {
  user: any;
  roleLevel: number | null;
  isLoading: boolean;
}

const ShellStateContext = createContext<AuthState>({
  user: null,
  roleLevel: null,
  isLoading: true
});

export const ShellStateProvider = ShellStateContext.Provider;

export const useAuth = () => {
  const context = useContext(ShellStateContext);
  if (!context) {
    throw new Error('useAuth must be used within a ShellStateProvider');
  }
  return context;
};

// Role store for role switching functionality
export const useRoleStore = () => {
  const { roleLevel } = useAuth();
  return {
    roleLevel,
    setRole: (level: number) => {
      // This would typically update a global state, but we'll just log for now
      console.log('Role switch requested to level', level);
    }
  };
};

// Export RoleType for convenience (matches the one in types/index.ts)
export type RoleType = 'superadmin' | 'ceo' | 'manager' | 'staff';
