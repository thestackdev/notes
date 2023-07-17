export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  label: string;
  created_at: string;
  updated_at: string;
}
