import User from "./User";

export interface AuthData {
  logout: () => void;
  isAuthenticated: boolean;
  userData: User | undefined;
  refreshUserData: () => void;
}
