import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TasksStackParamList } from '../types/navigation';

import TasksScreen from '../screens/TasksScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';


const Stack = createNativeStackNavigator<TasksStackParamList>();

const TasksStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TasksList"
        component={TasksScreen}
        options={{ title: 'Taskslist' }}
      />
      {/*Not yet implemented at all*/}
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetailsScreen}
        options={{ title: 'Task Details' }}
      />
      <Stack.Screen
        name="CreateTask" 
        component={CreateTaskScreen} 
        options={{ title: 'Create Task' }}
      />
    </Stack.Navigator>
  );
};

export default TasksStack;