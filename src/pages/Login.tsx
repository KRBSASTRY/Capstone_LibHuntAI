import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, ArrowRight, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, setToken } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const resetToken = query.get("token");
  const githubToken = query.get("github_token");

  useEffect(() => {
    if (githubToken) {
      localStorage.setItem("libhunt-token", githubToken);
      setToken(githubToken);
      navigate("/");
    }
  }, [githubToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resetToken) {
      if (!newPassword || !confirmPassword) {
        toast({ title: "Missing Fields", description: "Please enter and confirm your new password.", variant: "destructive" });
        return;
      }

      if (newPassword !== confirmPassword) {
        toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
        return;
      }

      try {
        setIsLoading(true);
        await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/reset-password`, {
          token: resetToken,
          password: newPassword,
        });

        toast({ title: "Password Updated", description: "You can now log in with your new password." });
        navigate("/login");
      } catch (err: any) {
        toast({
          title: "Reset Failed",
          description: err.response?.data?.message || "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!email || !password) {
      toast({ title: "Missing Fields", description: "Please enter both email and password.", variant: "destructive" });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      await login(email.toLowerCase(), password);

      toast({ title: "Login successful", description: "Welcome back to LibHunt AI!" });
      navigate("/");
    } catch (err: any) {
      const status = err?.response?.status;
      toast({
        title: "Login failed",
        description:
          status === 404
            ? "Email not registered. Please sign up first."
            : status === 401
            ? "Incorrect password. Please try again."
            : "Unexpected error. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast({ title: "Email Required", description: "Please enter your email to receive a reset link.", variant: "destructive" });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/forgot-password`, {
        email: forgotEmail.toLowerCase(),
      });

      toast({ title: "Reset Link Sent", description: "Check your inbox. This link is valid for 30 minutes." });
      setForgotEmail("");
      setShowForgotForm(false);
    } catch (err: any) {
      const status = err?.response?.status;
      toast({
        title: "Reset Failed",
        description: status === 404 ? "This email is not registered. Please sign up or try again." : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 pointer-events-none"></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan-300 overflow-hidden">
              <span className="text-black font-bold text-xl">L</span>
            </div>
            <span className="font-display font-bold text-xl">LibHunt AI</span>
          </Link>
        </div>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Sign in to your account</CardTitle>
            <CardDescription>Enter your email and password or continue with GitHub</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 border-white/10 mb-6"
              onClick={() => {
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_BACKEND_URL}/api/auth/github/callback&scope=user:email`;
              }}
            >
              <Github size={18} />
              <span>Continue with GitHub</span>
            </Button>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* The rest remains the same */}
              </div>
            </form>

            {showForgotForm && (
              <div className="mt-6">
                <Label htmlFor="forgotEmail">Enter your email</Label>
                <div className="flex gap-2 mt-2">
                  <Input id="forgotEmail" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@example.com" />
                  <Button type="button" onClick={handleForgotPassword}>
                    Send Link
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-center w-full text-sm">
              Don't have an account? <Link to="/register" className="text-accent hover:underline">Sign up</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
