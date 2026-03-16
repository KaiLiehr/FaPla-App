import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TasksStack from './TasksStack';
import HouseholdScreen from '../screens/HouseholdScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ShoppingScreen from '../screens/ShoppingScreen';
import HeaderUser from '../components/HeaderUser';
import ShoppingItemsStack from './ShoppingItemsStack';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => <HeaderUser />,

        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Tasks':
              iconName = 'checklist';
              break;
            case 'Household':
              iconName = 'group';
              break;
            case 'Calendar':
              iconName = 'calendar-today';
              break;
            case 'Shopping':
              iconName = 'shopping-cart';
              break;
          }

          return (
            <MaterialIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Tasks" component={TasksStack} />
      <Tab.Screen name="Household" component={HouseholdScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Shopping" component={ShoppingItemsStack} />
    </Tab.Navigator>
  );
};

export default AppTabs;
