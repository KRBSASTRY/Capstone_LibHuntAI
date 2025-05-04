import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setToken, setUser } = useAuth();

  const query = new URLSearchParams(location.search);
  const email = query.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      toast({ title: "Missing Info", description: "Email or code missing.", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/verify-code`, {
        email,
        code,
      });

      const token = res.data.token;
      localStorage.setItem("libhunt-token", token);
      setToken(token);

      const userRes = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userRes.data;
      setUser({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "admin" : "user",
      });

      toast({ title: "Success", description: "Verification successful." });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-6 bg-white dark:bg-black/10 backdrop-blur border border-white/10 p-6 rounded-xl"
      >
        <h2 className="text-xl font-semibold text-center">Enter Verification Code</h2>
        <p className="text-sm text-center text-muted-foreground mb-4">
          A verification code has been sent to <strong>{email}</strong>
        </p>
        <div className="space-y-2">
          <Label htmlFor="code">8-digit Code</Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code"
            maxLength={8}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
      </form>
    </div>
  );
};

export default VerifyCode;
