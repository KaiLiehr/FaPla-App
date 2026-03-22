import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Household = {
  id: number;
  name: string;
};

type HouseholdContextType = {
  households: Household[];
  setHouseholds: (households: Household[]) => void;
  getHouseholdName: (id: number | null) => string;
};

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export const HouseholdProvider = ({ children }: { children: ReactNode }) => {
  const [households, setHouseholds] = useState<Household[]>([]);

  const getHouseholdName = (id: number | null) => {
    if (!id) return 'Personal';
    const household = households.find(h => h.id === id);
    return household ? household.name : 'Unknown Household';
  };

  return (
    <HouseholdContext.Provider value={{ households, setHouseholds, getHouseholdName }}>
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHouseholds = (): HouseholdContextType => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHouseholds must be used within a HouseholdProvider');
  }
  return context;
};