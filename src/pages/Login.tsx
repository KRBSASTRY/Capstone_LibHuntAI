import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Separator } from "@radix-ui/react-dropdown-menu";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotForm, setShowForgotForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Use login from context — it sets user and token
      await login(email.toLowerCase(), password);

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate("/"); // ✅ Navigate to homepage on success
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
      toast({
        title: "Email Required",
        description: "Please enter your email to receive a verification code.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/forgot-password`, {
        email: forgotEmail.toLowerCase(),
      });

      toast({
        title: "Verification Code Sent",
        description: "Check your inbox for the 8-digit code. It is valid for 30 minutes.",
      });

      navigate(`/verify-code?email=${forgotEmail.toLowerCase()}&origin=forgot`);
    } catch (err: any) {
      const status = err?.response?.status;
      toast({
        title: "Request Failed",
        description:
          status === 404
            ? "This email is not registered. Please sign up or try again."
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGithubLogin = () => {
    const githubRedirectUrl = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github/callback`;
    const githubURL = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${githubRedirectUrl}&scope=user:email`;
    window.location.href = githubURL;
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >

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
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 border-white/10 mb-6"
              onClick={handleGithubLogin}
            >
              <Github size={18} />
              <span>Continue with GitHub</span>
            </Button>
            <div className="flex items-center my-5">
              <Separator className="flex-1" />
              <span className="px-3 text-xs text-muted-foreground">OR CONTINUE WITH EMAIL</span>
              <Separator className="flex-1" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-sm text-accent hover:underline"
                      onClick={() => setShowForgotForm((prev) => !prev)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spinner h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign in
                      <ArrowRight size={16} className="ml-2" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {showForgotForm && (
              <div className="mt-6">
                <Label htmlFor="forgotEmail">Enter your email</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                  <Button type="button" onClick={handleForgotPassword}>
                    Send Code
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-center w-full text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-accent hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
