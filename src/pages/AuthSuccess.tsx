import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("libhunt-token", token);
      setToken(token); // Optional: if you manage global auth state
      navigate("/"); // redirect to home or dashboard
    } else {
      navigate("/login");
    }
  }, []);

  return <p className="text-center mt-10">Signing you in...</p>;
};

export default AuthSuccess;
