export interface FormData {
  email: string;
  password: string;
}

export interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  owner_id: string;
}

export interface Item {
  id: string;
  trip_id: string;
  type: "place" | "cost" | "todo";
  title: string;
  notes: string | null;
  amount: number | null;
  paid_by: string | null;
  split_between: string[] | null;
  is_done: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
