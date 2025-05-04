import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, ArrowRight, Github, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { register as registerUser } from "@/services/authService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePassword = (password: string) => password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[REGISTER] Submit triggered");

    if (!name || !email || !password || !confirmPassword) {
      toast({ title: "Missing Fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    if (!acceptTerms) {
      toast({ title: "Terms Not Accepted", description: "You must accept the terms and conditions.", variant: "destructive" });
      return;
    }

    if (!validatePassword(password)) {
      toast({ title: "Weak Password", description: "Password must be at least 8 characters long.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      console.log("[REGISTER] Sending data to server...");
      await registerUser({ name, email: email.toLowerCase(), password });

      toast({ title: "Registration successful", description: "You can now log in to your account." });
      navigate("/login");
    } catch (err: any) {
      console.error("[REGISTER] Failed:", err?.response?.data || err.message);
      toast({
        title: "Registration failed",
        description: err.response?.status === 409 ? "This email already exists. Please use a different email address." : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubRedirect = () => {
    const redirectUri = `${import.meta.env.VITE_BACKEND_URL}/api/auth/github/callback`;
    const githubURL = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
    window.location.href = githubURL;
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
            <CardTitle className="text-2xl font-display">Create an account</CardTitle>
            <CardDescription>Enter your details to create your LibHunt AI account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-5">
              <Button variant="outline" className="w-full flex items-center gap-2 border-white/10" onClick={handleGithubRedirect}>
                <Github size={18} />
                <span>Continue with GitHub</span>
              </Button>
            </div>

            <div className="flex items-center my-5">
              <Separator className="flex-1" />
              <span className="px-3 text-xs text-muted-foreground">OR CONTINUE WITH EMAIL</span>
              <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <User size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="name@example.com" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} />
                  <Label htmlFor="terms" className="text-sm leading-none pt-1">
                    I agree to the <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isLoading || !acceptTerms}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spinner h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Create account
                      <ArrowRight size={16} className="ml-2" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center w-full text-sm">
              Already have an account? <Link to="/login" className="text-accent hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
