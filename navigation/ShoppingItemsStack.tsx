import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ShoppingScreen from '../screens/ShoppingScreen';
import ShoppingItemDetailsScreen from '../screens/ShoppingItemDetailsScreen';
import CreateShoppingItemScreen from '../screens/CreateShoppingItemScreen';

export type ShoppingItemsStackParamList = {
  ShoppingItemsList: undefined;
  ShoppingItemDetails: undefined;
  CreateShoppingItem: undefined;
};

const Stack = createNativeStackNavigator<ShoppingItemsStackParamList>();

const ShoppingItemsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ShoppingItemsList"
        component={ShoppingScreen}
        options={{ title: 'Shoppinglist' }}
      />
      {/*Not yet implemented at all*/}
      <Stack.Screen
        name="ShoppingItemDetails"
        component={ShoppingItemDetailsScreen}
        options={{ title: 'Shopping Item Details' }}
      />
      <Stack.Screen
        name="CreateShoppingItem" 
        component={CreateShoppingItemScreen} 
        options={{ title: 'Create Shopping Item' }}
      />
    </Stack.Navigator>
  );
};

export default ShoppingItemsStack;