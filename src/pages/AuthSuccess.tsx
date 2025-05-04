import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setAuthData } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        if (!user?.email) throw new Error("Invalid user response");

        // ✅ Save token + user in auth context
        localStorage.setItem("libhunt-token", token);
        localStorage.setItem("libhunt-user", JSON.stringify(user));
        setAuthData({ token, user });

        // ✅ Redirect to dashboard or homepage
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("❌ GitHub auth fetch error:", err.message);
        toast({
          title: "GitHub Login Failed",
          description: "Something went wrong while logging in.",
          variant: "destructive",
        });
        navigate("/login");
      });
  }, []);

  return <p className="text-center mt-10">Logging you in with GitHub...</p>;
};

export default AuthSuccess;
