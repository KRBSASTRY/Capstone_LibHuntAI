import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import * as authService from "../services/authService";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isVerified?: boolean;
  githubUsername?: string;
  githubAvatar?: string;
  isGithubAuth?: boolean;
} | null;

export type AuthContextType = {
  user: User;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
  setAuthData: (data: { user: User; token: string }) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  token: null,
  setToken: () => {},
  setAuthData: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("libhunt-user");
    const storedToken = localStorage.getItem("libhunt-token");

    if (storedToken) {
      setTokenState(storedToken);
      console.log("[AuthContext] Restored token:", storedToken);
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("[AuthContext] Restored user:", parsedUser);
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

  const setAuthData = ({ user, token }: { user: User; token: string }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("libhunt-user", JSON.stringify(user));
    localStorage.setItem("libhunt-token", token);
    console.log("[AuthContext] Auth data set");
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const user = await authService.login(email, password);
    setUser(user);
    localStorage.setItem("libhunt-user", JSON.stringify(user));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const user = await authService.register({ name, email, password });
    setUser(user);
    localStorage.setItem("libhunt-user", JSON.stringify(user));
    setIsLoading(false);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem("libhunt-user");
    localStorage.removeItem("libhunt-token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: (newUser) => {
          setUser(newUser);
          if (newUser) {
            localStorage.setItem("libhunt-user", JSON.stringify(newUser));
          } else {
            localStorage.removeItem("libhunt-user");
          }
        },
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        token,
        setToken,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
