import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import * as authService from "../services/authService";

// --------------------
// Types
// --------------------
export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
} | null;

export type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
};

// --------------------
// Context Creation
// --------------------
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  token: null,
  setToken: () => {},
});

// --------------------
// Provider Component
// --------------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(localStorage.getItem("libhunt-token"));

  useEffect(() => {
    const storedUser = localStorage.getItem("libhunt-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("libhunt-token", token);
    } else {
      localStorage.removeItem("libhunt-token");
    }
    setTokenState(token);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token, user } = await authService.login(email, password);
      setToken(token);
      localStorage.setItem("libhunt-user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.register({ name, email, password });
      localStorage.setItem("libhunt-user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------
// Hook for Components
// --------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
