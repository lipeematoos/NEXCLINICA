// NEXCLÍNICA — Application Context & Services
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { demoRepositories, resetDemoData } from '../infrastructure/demo/DemoRepository';
import { DEMO_IDS } from '../infrastructure/demo/seed';
import type { Repositories } from '../domain/repositories';
import type { SystemUser, UUID } from '../domain/models';

interface AppState {
  repos: Repositories;
  currentUser: SystemUser | null;
  isLoggedIn: boolean;
  sidebarOpen: boolean;
}

interface AppContextType extends AppState {
  login: (email: string) => boolean;
  logout: () => void;
  toggleSidebar: () => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [repos] = useState<Repositories>(demoRepositories);

  const login = useCallback((email: string): boolean => {
    const user = repos.users.findByEmail(email);
    if (user && user.active) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, [repos]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const resetData = useCallback(() => {
    resetDemoData();
  }, []);

  return (
    <AppContext.Provider value={{
      repos,
      currentUser,
      isLoggedIn,
      sidebarOpen,
      login,
      logout,
      toggleSidebar,
      resetData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Helper: get current professional ID from logged user
export function useCurrentProfessionalId(): UUID | undefined {
  const { currentUser } = useApp();
  return currentUser?.professionalId;
}

// Demo helper: current user defaults
export function getDemoProfessionalId(): UUID {
  return DEMO_IDS.PROFESSIONAL_1;
}

export function getDemoTenantId(): UUID {
  return DEMO_IDS.TENANT;
}

export function getDemoUnitId(): UUID {
  return DEMO_IDS.UNIT;
}
