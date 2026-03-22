import { Task } from '../types/Task';
// Household stack
export type HouseholdStackParamList = {
  Households: undefined;
  CreateHousehold: undefined;
  InviteMember: { householdId: number };
};

// Tasks stack
export type TasksStackParamList = {
  TasksList: undefined;
  TaskDetails: undefined;
  CreateTask: undefined;
  EditTask: { task: Task };
};

// Shopping stack
export type ShoppingItemsStackParamList = {
  ShoppingItemsList: undefined;
  ShoppingItemDetails: undefined;
  CreateShoppingItem: undefined;
};