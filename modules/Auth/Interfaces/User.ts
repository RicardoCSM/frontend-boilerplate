export default interface User {
  id: string;
  name: string;
  login: string;
  email: string;
  roles: string[];
  permissions: string[];
  active: boolean;
  avatar: string | null;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}
