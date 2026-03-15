import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import AppTabs from './navigation/AppTabs';
import RootNavigator from './navigation/RootNavigator';


const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

