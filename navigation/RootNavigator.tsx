import React from 'react';
import { useAuth } from '../context/AuthContext';

import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // later we add splash screen
  }

  return isAuthenticated ? <AppTabs /> : <AuthStack />;
};

export default RootNavigator;