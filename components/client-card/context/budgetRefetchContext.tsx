'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface IBudgetRefetchContext {
  refetch: () => void;
}

const BudgetRefetchContext = createContext<IBudgetRefetchContext | null>(null);

export const useBudgetRefetch = () => {
  const context = useContext(BudgetRefetchContext);
  if (!context) throw new Error('useBudgetRefetch must be used within BudgetRefetchProvider');
  return context;
};

interface IBudgetRefetchProviderProps {
  children: ReactNode;
  refetch: () => void;
}

export const BudgetRefetchProvider = ({ children, refetch }: IBudgetRefetchProviderProps) => (
  <BudgetRefetchContext.Provider value={{ refetch }}>
    {children}
  </BudgetRefetchContext.Provider>
);
