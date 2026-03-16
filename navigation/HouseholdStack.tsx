import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Householdscreen from '../screens/HouseholdScreen';
import CreateHouseholdScreen from '../screens/CreateHouseholdScreen';

export type HouseholdStackParamList = {
  Households: undefined;
  CreateHousehold: undefined;
};

const Stack = createNativeStackNavigator<HouseholdStackParamList>();

const HouseholdStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Households"
        component={Householdscreen}
        options={{ title: 'Households' }}
      />
      <Stack.Screen
        name="CreateHousehold" 
        component={CreateHouseholdScreen} 
        options={{ title: 'Create Household' }}
      />
    </Stack.Navigator>
  );
};

export default HouseholdStack;