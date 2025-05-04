import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

const SettingsPage = () => {
  const { toast } = useToast();
  const { user, setUser, token } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isVerified, setIsVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);
  const [weeklyEmails, setWeeklyEmails] = useState(() => JSON.parse(localStorage.getItem("weeklyEmails")) ?? true);
  const [announcements, setAnnouncements] = useState(() => JSON.parse(localStorage.getItem("announcements")) ?? true);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsVerified(user?.isVerified || false);
  }, [user]);

  useEffect(() => localStorage.setItem("darkMode", JSON.stringify(darkMode)), [darkMode]);
  useEffect(() => localStorage.setItem("weeklyEmails", JSON.stringify(weeklyEmails)), [weeklyEmails]);
  useEffect(() => localStorage.setItem("announcements", JSON.stringify(announcements)), [announcements]);

  const handleUpdateProfile = async () => {
    if (!token) {
      toast({ title: "Missing Token", description: "Please log in again.", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      console.log("[Update] Token:", token);

      const res = await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/update-profile`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      localStorage.setItem("libhunt-user", JSON.stringify(res.data));
      toast({ title: "Updated", description: "Profile updated successfully." });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action is irreversible.")) return;
    try {
      console.log("[Delete] Token:", token);
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Deleted", description: "Your account has been deleted." });

      setUser(null);
      localStorage.removeItem("libhunt-token");
      localStorage.removeItem("libhunt-user");
      window.location.href = "/login";
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete account.",
        variant: "destructive",
      });
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/resend-verification`,
        { email }
      );
      toast({ title: "Sent", description: "Verification email resent." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend verification.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      console.log("[Download] Token:", token);
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "text/plain" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "libhunt-user-summary.txt");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast({
        title: "Error",
        description: "Download failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Info</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email (cannot be changed)</Label>
              <Input value={email} disabled />
            </div>
            <Button onClick={handleUpdateProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* Email Verification */}
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              Status: {isVerified ? (
                <span className="text-green-600">Verified</span>
              ) : (
                <span className="text-red-600">Not Verified</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isVerified && (
              <Button onClick={handleResendVerification}>
                Resend Verification Email
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage notification and UI settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Dark Mode</Label>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Weekly Product Emails</Label>
              <Switch checked={weeklyEmails} onCheckedChange={setWeeklyEmails} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Product Announcements</Label>
              <Switch checked={announcements} onCheckedChange={setAnnouncements} />
            </div>
          </CardContent>
        </Card>

        {/* Download Data */}
        <Card>
          <CardHeader>
            <CardTitle>Download My Data</CardTitle>
            <CardDescription>Export your profile and activity history</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleDownload}>Download JSON</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>This action cannot be undone</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
