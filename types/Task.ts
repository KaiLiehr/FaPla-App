export type TaskExecutor = {
  id: number;
  username: string;
  accepted_at: string;
};

export type Task = {
  id: number;
  name: string;
  description: string;
  finished: boolean;
  due_by: string | null;
  type: string;
  scope: number | null;
  created_at: string;
  created_by: number;
  executors: TaskExecutor[];
};


export type ShoppingItem = {
  id: number;
  name: string;
  description: string;
  bought: boolean;
  scope: number | null;
  created_at: string;
  created_by: number;
  amount: string;
  preferred_brand: string;
  store: string;
};