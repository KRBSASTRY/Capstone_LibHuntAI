import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const origin = query.get("origin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      toast({
        title: "Missing Info",
        description: "Email or code missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/verify-code`, {
        email,
        code,
        origin,
      });

      if (origin === "forgot" && res.data.resetToken) {
        navigate(`/reset-password?token=${res.data.resetToken}`);
        return;
      }

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
    <div className="flex min-h-screen items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Enter Verification Code</CardTitle>
            <CardDescription>
              A code has been sent to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyCode;
