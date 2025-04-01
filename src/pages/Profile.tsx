import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Library,
  Gauge,
  Zap,
  ArrowRight,
  PlusCircle,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Link } from "react-router-dom";

// 🔒 Defensive loading spinner
const Spinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spinner h-8 w-8 border-4 border-accent border-t-transparent rounded-full" />
  </div>
);

// Custom icons
const WindowIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8h20" />
    <path d="M6 12h12" />
    <path d="M12 16h6" />
  </svg>
);

const ServerIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
    <line x1="6" x2="6" y1="6" y2="6" />
    <line x1="6" x2="6" y1="18" y2="18" />
  </svg>
);

const DatabaseIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const TestTubeIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
    <path d="M8.5 2h7" />
    <path d="M14.5 16h-5" />
  </svg>
);

const RocketIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const SmartphoneIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

const LayoutIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="3" x2="21" y1="9" y2="9" />
    <line x1="9" x2="9" y1="21" y2="9" />
  </svg>
);

const LuggageIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0" />
    <path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" />
    <path d="M10 20h4" />
    <circle cx="16" cy="20" r="2" />
    <circle cx="8" cy="20" r="2" />
  </svg>
);

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Frontend", icon: <WindowIcon className="h-4 w-4" /> },
    { name: "Backend", icon: <ServerIcon className="h-4 w-4" /> },
    { name: "Database", icon: <DatabaseIcon className="h-4 w-4" /> },
    { name: "Testing", icon: <TestTubeIcon className="h-4 w-4" /> },
    { name: "DevOps", icon: <RocketIcon className="h-4 w-4" /> },
    { name: "Mobile", icon: <SmartphoneIcon className="h-4 w-4" /> },
    { name: "UI", icon: <LayoutIcon className="h-4 w-4" /> },
    { name: "State", icon: <LuggageIcon className="h-4 w-4" /> },
  ];

  if (isLoading || !user) return <Spinner />;

  return (
    <div className="min-h-screen">
      <div className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <section className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h1 className="text-3xl font-display font-bold tracking-tight">
                  Welcome back, {user?.name.split(' ')[0]}
                </h1>
                <p className="text-muted-foreground">
                  Discover and compare the perfect libraries for your next project
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search libraries..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => {
                    if (searchQuery.trim()) {
                      window.location.href = "/search?q=" + encodeURIComponent(searchQuery);
                    }
                  }}
                >
                  Search
                </Button>
              </div>
            </motion.div>
          </section>
          
          {/* Categories Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {categories.map((category, index) => (
                <Link
                  to={`/search?category=${category.name.toLowerCase()}`}
                  key={category.name}
                  className="glass-card p-3 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center mb-2 text-accent">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              ))}
            </div>
          </motion.section>
          
          {/* Dashboard Content */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Quick Actions */}
                <div>
                  <h2 className="text-xl font-display font-medium mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { 
                        title: "AI Library Finder", 
                        description: "Use AI to find the perfect libraries", 
                        icon: <Zap className="h-5 w-5 text-pink-400" />, 
                        link: "#",
                        color: "from-pink-500/20 to-purple-500/20" 
                      },
                      { 
                        title: "Browse Categories", 
                        description: "Explore libraries by category", 
                        icon: <Library className="h-5 w-5 text-cyan-400" />, 
                        link: "/search",
                        color: "from-cyan-500/20 to-blue-500/20" 
                      },
                      { 
                        title: "Compare Tools", 
                        description: "Side-by-side library comparison", 
                        icon: <Gauge className="h-5 w-5 text-green-400" />, 
                        link: "/compare",
                        color: "from-green-500/20 to-emerald-500/20" 
                      },
                      { 
                        title: "Add to Favorites", 
                        description: "Save libraries for later", 
                        icon: <PlusCircle className="h-5 w-5 text-amber-400" />, 
                        link: "#",
                        color: "from-amber-500/20 to-orange-500/20" 
                      }
                    ].map((action, i) => (
                      <Link
                        to={action.link}
                        key={i}
                        className="group glass-card p-6 rounded-xl hover:bg-white/5 transition-all cursor-pointer overflow-hidden relative"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-50`}></div>
                        <div className="relative z-10">
                          <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-black/20 backdrop-blur-sm">
                            {action.icon}
                          </div>
                          <h3 className="font-medium mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                          <div className="mt-4 flex items-center text-xs text-accent">
                            <span className="group-hover:underline">Get started</span>
                            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
