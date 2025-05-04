import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

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
        const userEmail = res.data?.email;
        if (!userEmail) {
          throw new Error("No email in user response");
        }

        navigate(`/verify-code?email=${encodeURIComponent(userEmail)}`);
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
