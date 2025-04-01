
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export const useRequireAuth = (redirectTo = "/login") => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  if (!isLoading && !isAuthenticated) {
    navigate(redirectTo);
  }
  
  return { isLoading, isAuthenticated };
};

export const useRequireAdmin = (redirectTo = "/dashboard") => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  if (!isLoading && (!user || user.role !== "admin")) {
    navigate(redirectTo);
  }
  
  return { isLoading, isAdmin: user?.role === "admin" };
};
