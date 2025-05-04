import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setToken(token); // Save token first

    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data;
        setUser({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.isAdmin ? "admin" : "user",
        });

        // ✅ Redirect to home page instead of dashboard
        navigate("/");
      })
      .catch((err) => {
        console.error("❌ AuthSuccess email fetch error:", err.message);
        toast({ title: "GitHub Login Failed", variant: "destructive" });
        navigate("/login");
      });
  }, []);

  return <p className="text-center mt-10">Verifying GitHub login...</p>;
};

export default AuthSuccess;
