export default interface AccessLog {
  id: string;
  user_name: string;
  action: string;
  module: string;
  message: string;
  created_at: string;
  updated_at: string;
}
