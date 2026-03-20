import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HouseholdStackParamList } from '../types/navigation';

import HouseholdScreen from '../screens/HouseholdScreen';
import CreateHouseholdScreen from '../screens/CreateHouseholdScreen';
import InviteMemberScreen from '../screens/InviteMemberScreen';



const Stack = createNativeStackNavigator<HouseholdStackParamList>();

const HouseholdStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Households"
        component={HouseholdScreen}
        options={{ title: 'Households' }}
      />
      <Stack.Screen
        name="CreateHousehold" 
        component={CreateHouseholdScreen} 
        options={{ title: 'Create Household' }}
      />
      <Stack.Screen
        name="InviteMember"
        component={InviteMemberScreen}
        options={{ title: 'Invite Member' }}
      />
    </Stack.Navigator>
  );
};

export default HouseholdStack;