import React, { createContext, useContext, useCallback, useState } from 'react';
import type { LayoutMode } from '../types';

interface LayoutContextValue {
  layoutMode: LayoutMode;
  containerMaxWidth: number;
  toggleLayout: () => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('app');
  const containerMaxWidth = layoutMode === 'web' ? 860 : 460;
  const toggleLayout = useCallback(() => setLayoutMode(prev => prev === 'app' ? 'web' : 'app'), []);
  return (
    <LayoutContext.Provider value={{ layoutMode, containerMaxWidth, toggleLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider');
  return ctx;
}
