import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getUserFromAPI } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, setUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("libhunt-token", token);
    setToken(token);

    getUserFromAPI(token)
      .then((user) => {
        setUser(user);
        navigate("/");
      })
      .catch(() => {
        toast({ title: "GitHub Login Failed", variant: "destructive" });
        navigate("/login");
      });
  }, []);

  return <p className="text-center mt-10">Signing you in...</p>;
};

export default AuthSuccess;
