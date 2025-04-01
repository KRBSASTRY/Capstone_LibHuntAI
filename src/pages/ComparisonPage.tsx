
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Star, Download, Clock, Package, Shield,
  Box, Code, GitBranch, RefreshCw, XCircle, Search,
  Bookmark, FileCheck, Thermometer, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Mock data
const librariesData = {
  "1": {
    id: "1",
    name: "React.js",
    description: "A JavaScript library for building user interfaces",
    category: "Frontend Framework",
    website: "https://reactjs.org",
    github: "https://github.com/facebook/react",
    npm: "https://www.npmjs.com/package/react",
    stars: 198000,
    version: "18.2.0",
    license: "MIT",
    lastUpdate: "2 months ago",
    firstRelease: "May 29, 2013",
    weeklyDownloads: 15700000,
    contributors: 1602,
    dependencies: ["loose-envify", "object-assign", "scheduler"],
    bundle: {
      size: "42.2 kB",
      gzipped: "13.8 kB"
    },
    performance: {
      loadTime: 82,
      renderTime: 76,
      memoryUsage: 68
    },
    securityIssues: 0,
    codeMaintainability: 94,
    typeSupport: "Excellent",
    documentation: 96,
    communitySupport: 98,
  },
  "2": {
    id: "2",
    name: "Vue.js",
    description: "Progressive JavaScript framework for building UIs",
    category: "Frontend Framework",
    website: "https://vuejs.org",
    github: "https://github.com/vuejs/vue",
    npm: "https://www.npmjs.com/package/vue",
    stars: 197000,
    version: "3.2.45",
    license: "MIT",
    lastUpdate: "1 month ago",
    firstRelease: "February 2014",
    weeklyDownloads: 4900000,
    contributors: 368,
    dependencies: [],
    bundle: {
      size: "33.1 kB",
      gzipped: "11.9 kB"
    },
    performance: {
      loadTime: 90,
      renderTime: 88,
      memoryUsage: 72
    },
    securityIssues: 0,
    codeMaintainability: 92,
    typeSupport: "Good",
    documentation: 98,
    communitySupport: 90,
  },
  "3": {
    id: "3",
    name: "Angular",
    description: "Platform for building mobile and desktop web applications",
    category: "Frontend Framework",
    website: "https://angular.io",
    github: "https://github.com/angular/angular",
    npm: "https://www.npmjs.com/package/@angular/core",
    stars: 85000,
    version: "15.0.4",
    license: "MIT",
    lastUpdate: "2 weeks ago",
    firstRelease: "September 2016",
    weeklyDownloads: 2300000,
    contributors: 1482,
    dependencies: ["rxjs", "tslib", "zone.js"],
    bundle: {
      size: "148 kB",
      gzipped: "38.4 kB"
    },
    performance: {
      loadTime: 65,
      renderTime: 70,
      memoryUsage: 85
    },
    securityIssues: 0,
    codeMaintainability: 85,
    typeSupport: "Excellent",
    documentation: 95,
    communitySupport: 85,
  },
  "4": {
    id: "4",
    name: "Svelte",
    description: "Cybernetically enhanced web apps",
    category: "Frontend Framework",
    website: "https://svelte.dev",
    github: "https://github.com/sveltejs/svelte",
    npm: "https://www.npmjs.com/package/svelte",
    stars: 62000,
    version: "3.55.0",
    license: "MIT",
    lastUpdate: "3 weeks ago",
    firstRelease: "November 2016",
    weeklyDownloads: 950000,
    contributors: 562,
    dependencies: [],
    bundle: {
      size: "0 kB (compiled away)",
      gzipped: "0 kB (compiled away)"
    },
    performance: {
      loadTime: 98,
      renderTime: 96,
      memoryUsage: 95
    },
    securityIssues: 0,
    codeMaintainability: 88,
    typeSupport: "Good",
    documentation: 85,
    communitySupport: 75,
  },
  "5": {
    id: "5",
    name: "Redux",
    description: "Predictable state container for JavaScript apps",
    category: "State Management",
    website: "https://redux.js.org",
    github: "https://github.com/reduxjs/redux",
    npm: "https://www.npmjs.com/package/redux",
    stars: 57000,
    version: "4.2.0",
    license: "MIT",
    lastUpdate: "5 months ago",
    firstRelease: "June 2015",
    weeklyDownloads: 7100000,
    contributors: 894,
    dependencies: [],
    bundle: {
      size: "2.6 kB",
      gzipped: "1.1 kB"
    },
    performance: {
      loadTime: 95,
      renderTime: 85,
      memoryUsage: 90
    },
    securityIssues: 0,
    codeMaintainability: 90,
    typeSupport: "Excellent",
    documentation: 92,
    communitySupport: 90,
  },
  "6": {
    id: "6",
    name: "Zustand",
    description: "Small, fast and scalable state-management solution",
    category: "State Management",
    website: "https://github.com/pmndrs/zustand",
    github: "https://github.com/pmndrs/zustand",
    npm: "https://www.npmjs.com/package/zustand",
    stars: 23000,
    version: "4.1.5",
    license: "MIT",
    lastUpdate: "1 week ago",
    firstRelease: "October 2019",
    weeklyDownloads: 1500000,
    contributors: 184,
    dependencies: ["use-sync-external-store"],
    bundle: {
      size: "1.1 kB",
      gzipped: "0.5 kB"
    },
    performance: {
      loadTime: 97,
      renderTime: 95,
      memoryUsage: 97
    },
    securityIssues: 0,
    codeMaintainability: 95,
    typeSupport: "Excellent",
    documentation: 85,
    communitySupport: 80,
  },
  "7": {
    id: "7",
    name: "TanStack Query",
    description: "Powerful asynchronous state management for TS/JS",
    category: "Data Fetching",
    website: "https://tanstack.com/query",
    github: "https://github.com/tanstack/query",
    npm: "https://www.npmjs.com/package/@tanstack/react-query",
    stars: 31000,
    version: "4.20.4",
    license: "MIT",
    lastUpdate: "5 days ago",
    firstRelease: "March 2019",
    weeklyDownloads: 2300000,
    contributors: 534,
    dependencies: ["@tanstack/query-core"],
    bundle: {
      size: "12.6 kB",
      gzipped: "4.2 kB"
    },
    performance: {
      loadTime: 92,
      renderTime: 88,
      memoryUsage: 82
    },
    securityIssues: 0,
    codeMaintainability: 94,
    typeSupport: "Excellent",
    documentation: 96,
    communitySupport: 92,
  },
  "8": {
    id: "8",
    name: "SWR",
    description: "React Hooks for Data Fetching",
    category: "Data Fetching",
    website: "https://swr.vercel.app",
    github: "https://github.com/vercel/swr",
    npm: "https://www.npmjs.com/package/swr",
    stars: 25000,
    version: "2.0.0",
    license: "MIT",
    lastUpdate: "2 weeks ago",
    firstRelease: "October 2019",
    weeklyDownloads: 1100000,
    contributors: 206,
    dependencies: ["use-sync-external-store"],
    bundle: {
      size: "6.4 kB",
      gzipped: "2.5 kB"
    },
    performance: {
      loadTime: 94,
      renderTime: 92,
      memoryUsage: 90
    },
    securityIssues: 0,
    codeMaintainability: 92,
    typeSupport: "Excellent",
    documentation: 90,
    communitySupport: 88,
  },
};

const categories = ["Frontend Framework", "State Management", "Data Fetching", "UI Components", "CSS Framework"];

const ComparisonPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [libraries, setLibraries] = useState<string[]>([]);
  const [selectedLibrary1, setSelectedLibrary1] = useState<string | null>(null);
  const [selectedLibrary2, setSelectedLibrary2] = useState<string | null>(null);
  const [librariesByCategory, setLibrariesByCategory] = useState<{[key: string]: any[]}>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isComparing, setIsComparing] = useState(false);
  const { toast } = useToast();

  // Parse URL parameters
  useEffect(() => {
    const lib1 = searchParams.get("lib1");
    const lib2 = searchParams.get("lib2");
    const lib = searchParams.get("lib");
    
    // Organize libraries by category
    const byCategory: {[key: string]: any[]} = {
      "All": []
    };
    
    Object.values(librariesData).forEach(library => {
      if (!byCategory[library.category]) {
        byCategory[library.category] = [];
      }
      byCategory[library.category].push(library);
      byCategory["All"].push(library);
    });
    
    setLibrariesByCategory(byCategory);
    setLibraries(Object.keys(librariesData));
    
    // Set initial selections based on URL params
    if (lib1) setSelectedLibrary1(lib1);
    if (lib2) setSelectedLibrary2(lib2);
    if (lib && !lib1 && !lib2) setSelectedLibrary1(lib);
    
    // If both libraries are selected, show comparison
    if ((lib1 && lib2) || (lib1 && selectedLibrary2) || (lib2 && selectedLibrary1)) {
      setIsComparing(true);
    }
  }, [searchParams]);

  const handleCompare = () => {
    if (selectedLibrary1 && selectedLibrary2) {
      // Update URL with selected libraries
      setSearchParams({ lib1: selectedLibrary1, lib2: selectedLibrary2 });
      setIsComparing(true);
    } else {
      toast({
        title: "Selection Required",
        description: "Please select two libraries to compare.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setSelectedLibrary1(null);
    setSelectedLibrary2(null);
    setIsComparing(false);
    setSearchParams({});
  };

  const getLibraryById = (id: string | null) => {
    if (!id) return null;
    return librariesData[id as keyof typeof librariesData] || null;
  };

  const lib1 = getLibraryById(selectedLibrary1);
  const lib2 = getLibraryById(selectedLibrary2);

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            asChild 
            className="gap-2 hover:bg-white/5"
          >
            <Link to="/dashboard">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        {/* Page header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
            Library Comparison
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Compare libraries side by side to find the best fit for your project
          </p>
        </motion.section>
        
        {/* Selection section */}
        {!isComparing && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <Card className="glass-card p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Library 1 selection */}
                <div>
                  <h2 className="text-xl font-display font-medium mb-4">First Library</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <Select 
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="All">All Categories</SelectItem>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select Library
                      </label>
                      <Select 
                        value={selectedLibrary1 || ""}
                        onValueChange={(value) => {
                          setSelectedLibrary1(value);
                          // If the same library is selected for both, clear lib2
                          if (value === selectedLibrary2) {
                            setSelectedLibrary2(null);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a library" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {librariesByCategory[selectedCategory]?.map(lib => (
                              <SelectItem key={lib.id} value={lib.id}>
                                {lib.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedLibrary1 && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{lib1?.name}</h3>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-white/10">
                            {lib1?.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {lib1?.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={16} className="fill-amber-400" />
                            <span>{lib1?.stars.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} className="text-muted-foreground" />
                            <span>{lib1?.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Library 2 selection */}
                <div>
                  <h2 className="text-xl font-display font-medium mb-4">Second Library</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <Select 
                        value={selectedCategory}
                        onValueChange={(value) => setSelectedCategory(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="All">All Categories</SelectItem>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select Library
                      </label>
                      <Select 
                        value={selectedLibrary2 || ""}
                        onValueChange={(value) => {
                          setSelectedLibrary2(value);
                          // If the same library is selected for both, clear lib1
                          if (value === selectedLibrary1) {
                            setSelectedLibrary1(null);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a library" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {librariesByCategory[selectedCategory]?.map(lib => (
                              <SelectItem key={lib.id} value={lib.id}>
                                {lib.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedLibrary2 && (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{lib2?.name}</h3>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-white/10">
                            {lib2?.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {lib2?.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={16} className="fill-amber-400" />
                            <span>{lib2?.stars.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} className="text-muted-foreground" />
                            <span>{lib2?.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8 gap-4">
                <Button 
                  onClick={handleCompare}
                  disabled={!selectedLibrary1 || !selectedLibrary2}
                  className="gap-2"
                >
                  <Scale size={16} />
                  Compare Libraries
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="gap-2"
                >
                  <XCircle size={16} />
                  Clear Selection
                </Button>
              </div>
            </Card>
          </motion.section>
        )}
        
        {/* Comparison section */}
        {isComparing && lib1 && lib2 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-10"
          >
            {/* Action buttons */}
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={handleClear}
                className="gap-2"
              >
                <XCircle size={16} />
                Clear Comparison
              </Button>
              
              <Button 
                onClick={() => {
                  // Take a screenshot or generate a report in a real app
                  toast({
                    title: "Report Generated",
                    description: "Comparison report has been downloaded.",
                  });
                }}
                className="gap-2"
              >
                <Download size={16} />
                Export Comparison
              </Button>
            </div>
            
            {/* Header cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 pointer-events-none"></div>
                <CardContent className="p-6 relative z-10">
                  <h2 className="text-2xl font-display font-bold mb-2">{lib1.name}</h2>
                  <p className="text-muted-foreground mb-4">{lib1.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={18} className="fill-amber-400" />
                      <span>{lib1.stars.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package size={18} className="text-muted-foreground" />
                      <span>v{lib1.version}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={18} className="text-muted-foreground" />
                      <span>{(lib1.weeklyDownloads / 1000000).toFixed(1)}M weekly</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <Link to={`/library/${lib1.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5 pointer-events-none"></div>
                <CardContent className="p-6 relative z-10">
                  <h2 className="text-2xl font-display font-bold mb-2">{lib2.name}</h2>
                  <p className="text-muted-foreground mb-4">{lib2.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={18} className="fill-amber-400" />
                      <span>{lib2.stars.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package size={18} className="text-muted-foreground" />
                      <span>v{lib2.version}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={18} className="text-muted-foreground" />
                      <span>{(lib2.weeklyDownloads / 1000000).toFixed(1)}M weekly</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <Link to={`/library/${lib2.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Performance Comparison */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-medium mb-6">Performance Comparison</h2>
                
                <div className="space-y-8">
                  {/* Load Time */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Load Time</h3>
                      <div className="flex items-center gap-4">
                        <span className={`text-${getPerformanceColor(lib1.performance.loadTime)}`}>
                          {lib1.name}: {lib1.performance.loadTime}/100
                        </span>
                        <span className={`text-${getPerformanceColor(lib2.performance.loadTime)}`}>
                          {lib2.name}: {lib2.performance.loadTime}/100
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-8 bg-white/5 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-blue-500/70 absolute left-0 top-0 transition-all duration-1000 ease-out"
                        style={{ width: `${lib1.performance.loadTime}%` }}
                      ></div>
                      <div 
                        className="h-full bg-emerald-500/70 absolute left-0 top-0 transition-all duration-1000 ease-out"
                        style={{ width: `${lib2.performance.loadTime}%`, transform: 'translateY(100%)' }}
                      ></div>
                      
                      {/* Winner indicator */}
                      {lib1.performance.loadTime !== lib2.performance.loadTime && (
                        <div 
                          className={`absolute ${lib1.performance.loadTime > lib2.performance.loadTime ? 'left-1' : 'right-1'} top-1 bg-white/10 rounded-full p-1`}
                        >
                          <CheckCircle2 size={14} className="text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Render Time */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Render Time</h3>
                      <div className="flex items-center gap-4">
                        <span className={`text-${getPerformanceColor(lib1.performance.renderTime)}`}>
                          {lib1.name}: {lib1.performance.renderTime}/100
                        </span>
                        <span className={`text-${getPerformanceColor(lib2.performance.renderTime)}`}>
                          {lib2.name}: {lib2.performance.renderTime}/100
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-8 bg-white/5 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-blue-500/70 absolute left-0 top-0 transition-all duration-1000 ease-out"
                        style={{ width: `${lib1.performance.renderTime}%` }}
                      ></div>
                      <div 
                        className="h-full bg-emerald-500/70 absolute left-0 top-0 transition-all duration-1000 ease-out"
                        style={{ width: `${lib2.performance.renderTime}%`, transform: 'translateY(100%)' }}
                      ></div>
                      
                      {/* Winner indicator */}
                      {lib1.performance.renderTime !== lib2.performance.renderTime && (
                        <div 
                          className={`absolute ${lib1.performance.renderTime > lib2.performance.renderTime ? 'left-1' : 'right-1'} top-1 bg-white/10 rounded-full p-1`}
                        >
                          <CheckCircle2 size={14} className="text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Memory Usage */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Memory Usage</h3>
                      <div className="flex items-center gap-4">
                        <span className={`text-${getPerformanceColor(lib1.performance.memoryUsage)}`}>
                          {lib1.name}: {lib1.performance.memoryUsage}/100
                        </span>
                        <span className={`text-${getPerformanceColor(lib2.performance.memoryUsage)}`}>
                          {lib2.name}: {lib2.performance.memoryUsage}/100
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-8 bg-white/5 rounded-lg overflow-hidden relative">
                      <div 
                        className="h-full bg-blue-500/70 absolute left-0 top-0 transition-all duration-1000 ease-out"
                        style={{ width: `${lib1.performance.memoryUsage}%` }}
                      ></div>
                      <div 
                        className="h-full bg-emerald-500/70 absolute left-0 top-0 transition-all duration-1000 ease-out"
                        style={{ width: `${lib2.performance.memoryUsage}%`, transform: 'translateY(100%)' }}
                      ></div>
                      
                      {/* Winner indicator */}
                      {lib1.performance.memoryUsage !== lib2.performance.memoryUsage && (
                        <div 
                          className={`absolute ${lib1.performance.memoryUsage > lib2.performance.memoryUsage ? 'left-1' : 'right-1'} top-1 bg-white/10 rounded-full p-1`}
                        >
                          <CheckCircle2 size={14} className="text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-blue-500/70"></div>
                    <span>{lib1.name}</span>
                    
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70 ml-4"></div>
                    <span>{lib2.name}</span>
                    
                    <div className="ml-auto text-muted-foreground">Higher is better</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Size Comparison */}
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Box size={20} className="text-blue-400" />
                        </div>
                        <h3 className="font-medium">{lib1.name} Bundle Size</h3>
                      </div>
                      
                      <div className="text-center my-8">
                        <div className="text-4xl font-display font-bold text-blue-400">
                          {lib1.bundle.gzipped}
                        </div>
                        <p className="text-muted-foreground mt-2">Gzipped</p>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>Minified: {lib1.bundle.size}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 relative border-t md:border-t-0 md:border-l border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Box size={20} className="text-emerald-400" />
                        </div>
                        <h3 className="font-medium">{lib2.name} Bundle Size</h3>
                      </div>
                      
                      <div className="text-center my-8">
                        <div className="text-4xl font-display font-bold text-emerald-400">
                          {lib2.bundle.gzipped}
                        </div>
                        <p className="text-muted-foreground mt-2">Gzipped</p>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>Minified: {lib2.bundle.size}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-white/10">
                  <h3 className="font-medium mb-4">Size Comparison</h3>
                  
                  <div className="relative h-10 bg-white/5 rounded-lg overflow-hidden">
                    {/* Size visualization - make it proportional */}
                    <div 
                      className="h-full bg-blue-500/70 absolute left-0 top-0"
                      style={{ 
                        width: `${getSizePercentage(lib1.bundle.gzipped)}%`
                      }}
                    ></div>
                    <div 
                      className="h-full bg-emerald-500/70 absolute left-0 top-0"
                      style={{ 
                        width: `${getSizePercentage(lib2.bundle.gzipped)}%`,
                        transform: 'translateY(50%)',
                        height: '50%'
                      }}
                    ></div>
                    
                    {/* Labels */}
                    <div 
                      className="absolute left-0 top-0 px-2 flex items-center h-full text-xs font-medium"
                      style={{
                        left: `${Math.min(
                          Math.max(getSizePercentage(lib1.bundle.gzipped) - 15, 0),
                          85
                        )}%`
                      }}
                    >
                      {lib1.name}
                    </div>
                    <div 
                      className="absolute left-0 bottom-0 px-2 flex items-center h-1/2 text-xs font-medium"
                      style={{
                        left: `${Math.min(
                          Math.max(getSizePercentage(lib2.bundle.gzipped) - 15, 0),
                          85
                        )}%`
                      }}
                    >
                      {lib2.name}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>0 kB</span>
                    <span>10 kB</span>
                    <span>20 kB</span>
                    <span>30 kB</span>
                    <span>40+ kB</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    {getComparativeSize(lib1.bundle.gzipped, lib2.bundle.gzipped)}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature Comparison */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-medium mb-6">Feature Comparison</h2>
                
                <ScrollArea className="h-[400px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left pb-4 font-medium">Feature</th>
                        <th className="text-center pb-4 font-medium text-blue-400">{lib1.name}</th>
                        <th className="text-center pb-4 font-medium text-emerald-400">{lib2.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-4">License</td>
                        <td className="py-4 text-center">{lib1.license}</td>
                        <td className="py-4 text-center">{lib2.license}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">GitHub Stars</td>
                        <td className="py-4 text-center">{lib1.stars.toLocaleString()}</td>
                        <td className="py-4 text-center">{lib2.stars.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">Weekly Downloads</td>
                        <td className="py-4 text-center">{(lib1.weeklyDownloads / 1000000).toFixed(1)}M</td>
                        <td className="py-4 text-center">{(lib2.weeklyDownloads / 1000000).toFixed(1)}M</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">First Released</td>
                        <td className="py-4 text-center">{lib1.firstRelease}</td>
                        <td className="py-4 text-center">{lib2.firstRelease}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">Current Version</td>
                        <td className="py-4 text-center">v{lib1.version}</td>
                        <td className="py-4 text-center">v{lib2.version}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">Last Updated</td>
                        <td className="py-4 text-center">{lib1.lastUpdate}</td>
                        <td className="py-4 text-center">{lib2.lastUpdate}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">Contributors</td>
                        <td className="py-4 text-center">{lib1.contributors}</td>
                        <td className="py-4 text-center">{lib2.contributors}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">Dependencies</td>
                        <td className="py-4 text-center">{lib1.dependencies.length}</td>
                        <td className="py-4 text-center">{lib2.dependencies.length}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">TypeScript Support</td>
                        <td className="py-4 text-center">{lib1.typeSupport}</td>
                        <td className="py-4 text-center">{lib2.typeSupport}</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">Code Maintainability</td>
                        <td className="py-4 text-center">{lib1.codeMaintainability}/100</td>
                        <td className="py-4 text-center">{lib2.codeMaintainability}/100</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">Documentation Quality</td>
                        <td className="py-4 text-center">{lib1.documentation}/100</td>
                        <td className="py-4 text-center">{lib2.documentation}/100</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">Community Support</td>
                        <td className="py-4 text-center">{lib1.communitySupport}/100</td>
                        <td className="py-4 text-center">{lib2.communitySupport}/100</td>
                      </tr>
                      <tr>
                        <td className="py-4">Security Issues</td>
                        <td className="py-4 text-center">
                          {lib1.securityIssues === 0 ? (
                            <span className="inline-flex items-center text-green-400">
                              <Shield size={16} className="mr-1" /> None
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-400">
                              <AlertCircle size={16} className="mr-1" /> {lib1.securityIssues}
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-center">
                          {lib2.securityIssues === 0 ? (
                            <span className="inline-flex items-center text-green-400">
                              <Shield size={16} className="mr-1" /> None
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-400">
                              <AlertCircle size={16} className="mr-1" /> {lib2.securityIssues}
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Summary */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-medium mb-6">Comparison Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4 text-blue-400">{lib1.name} Strengths</h3>
                    <ul className="space-y-2">
                      {getLibraryStrengths(lib1, lib2).map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 size={18} className="text-blue-400 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4 text-emerald-400">{lib2.name} Strengths</h3>
                    <ul className="space-y-2">
                      {getLibraryStrengths(lib2, lib1).map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 size={18} className="text-emerald-400 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Separator className="my-6 bg-white/10" />
                
                <div>
                  <h3 className="font-medium mb-4">Recommendation</h3>
                  <p className="text-muted-foreground">
                    {getRecommendation(lib1, lib2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}
        
        {/* Select libraries */}
        {(!selectedLibrary1 || !selectedLibrary2) && !isComparing && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center max-w-xl mx-auto">
              <div className="mb-6 flex justify-center">
                <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center">
                  <Scale size={40} className="text-accent" />
                </div>
              </div>
              
              <h2 className="text-2xl font-display font-bold mb-3">Compare Libraries</h2>
              <p className="text-muted-foreground mb-6">
                Select two libraries to compare their features, performance, bundle size, and more to help you choose the best tool for your project.
              </p>
              
              <Button 
                asChild
                className="gap-2"
              >
                <Link to="/search">
                  <Search size={16} />
                  Browse Libraries
                </Link>
              </Button>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getPerformanceColor = (score: number) => {
  if (score >= 90) return "green-400";
  if (score >= 70) return "amber-400";
  return "red-400";
};

const getSizePercentage = (size: string) => {
  // Extract number from string like "13.8 kB"
  const sizeNumber = parseFloat(size.replace(" kB", ""));
  // 40 kB is 100% for visualization purposes
  return Math.min((sizeNumber / 40) * 100, 100);
};

const getComparativeSize = (size1: string, size2: string) => {
  const size1Number = parseFloat(size1.replace(" kB", ""));
  const size2Number = parseFloat(size2.replace(" kB", ""));
  
  if (size1Number < size2Number) {
    const difference = ((size2Number - size1Number) / size2Number * 100).toFixed(0);
    return `${size1} is ${difference}% smaller than ${size2}`;
  } else if (size2Number < size1Number) {
    const difference = ((size1Number - size2Number) / size1Number * 100).toFixed(0);
    return `${size2} is ${difference}% smaller than ${size1}`;
  }
  
  return "Both libraries have similar bundle sizes";
};

const getLibraryStrengths = (lib: any, otherLib: any) => {
  const strengths = [];
  
  // Compare numeric metrics
  if (lib.stars > otherLib.stars) {
    strengths.push(`Higher community popularity with ${(lib.stars / 1000).toFixed(0)}k GitHub stars`);
  }
  
  if (lib.weeklyDownloads > otherLib.weeklyDownloads) {
    strengths.push(`More widely used with ${(lib.weeklyDownloads / 1000000).toFixed(1)}M weekly downloads`);
  }
  
  if (lib.performance.loadTime > otherLib.performance.loadTime) {
    strengths.push(`Better load time performance`);
  }
  
  if (lib.performance.renderTime > otherLib.performance.renderTime) {
    strengths.push(`Faster rendering performance`);
  }
  
  if (lib.performance.memoryUsage > otherLib.performance.memoryUsage) {
    strengths.push(`More efficient memory usage`);
  }
  
  // Bundle size (smaller is better)
  const libSize = parseFloat(lib.bundle.gzipped.replace(" kB", ""));
  const otherLibSize = parseFloat(otherLib.bundle.gzipped.replace(" kB", ""));
  if (libSize < otherLibSize) {
    strengths.push(`Smaller bundle size (${lib.bundle.gzipped} vs ${otherLib.bundle.gzipped})`);
  }
  
  // Add more qualitative strengths based on the specific library
  if (lib.name === "React.js") {
    strengths.push("Backed by Facebook with widespread enterprise adoption");
    strengths.push("Massive ecosystem of compatible libraries and tools");
  } else if (lib.name === "Vue.js") {
    strengths.push("Gentle learning curve and excellent documentation");
    strengths.push("More intuitive component syntax with single-file components");
  } else if (lib.name === "Svelte") {
    strengths.push("No virtual DOM overhead with compile-time optimizations");
    strengths.push("Less boilerplate code for common UI patterns");
  }
  
  if (lib.dependencies.length < otherLib.dependencies.length) {
    strengths.push(`Fewer dependencies (${lib.dependencies.length} vs ${otherLib.dependencies.length})`);
  }
  
  if (lib.documentation > otherLib.documentation) {
    strengths.push("Better documentation quality");
  }
  
  if (lib.communitySupport > otherLib.communitySupport) {
    strengths.push("Stronger community support");
  }
  
  // If we don't have enough strengths, add some generic ones
  if (strengths.length < 3) {
    if (!strengths.some(s => s.includes("documentation"))) {
      strengths.push("Well-maintained documentation");
    }
    if (!strengths.some(s => s.includes("API"))) {
      strengths.push("Clean, intuitive API design");
    }
  }
  
  return strengths;
};

const getRecommendation = (lib1: any, lib2: any) => {
  const lib1Strengths = getLibraryStrengths(lib1, lib2);
  const lib2Strengths = getLibraryStrengths(lib2, lib1);
  
  // Compare overall scores
  const lib1Score = 
    lib1.performance.loadTime + 
    lib1.performance.renderTime + 
    lib1.performance.memoryUsage +
    lib1.documentation +
    lib1.communitySupport;
  
  const lib2Score = 
    lib2.performance.loadTime + 
    lib2.performance.renderTime + 
    lib2.performance.memoryUsage +
    lib2.documentation +
    lib2.communitySupport;
  
  if (Math.abs(lib1Score - lib2Score) < 20) {
    // Scores are close, give a balanced recommendation
    return `Both ${lib1.name} and ${lib2.name} are excellent choices with different strengths. ${lib1.name} shines in ${lib1Strengths[0].toLowerCase()}, while ${lib2.name} excels at ${lib2Strengths[0].toLowerCase()}. Your choice should depend on your specific project requirements and team familiarity with either library.`;
  } else if (lib1Score > lib2Score) {
    return `Based on overall metrics, ${lib1.name} appears to be the better choice for most projects due to ${lib1Strengths[0].toLowerCase()} and ${lib1Strengths[1].toLowerCase()}. However, ${lib2.name} might still be preferable if ${lib2Strengths[0].toLowerCase()} is a critical requirement for your specific use case.`;
  } else {
    return `Based on overall metrics, ${lib2.name} appears to be the better choice for most projects due to ${lib2Strengths[0].toLowerCase()} and ${lib2Strengths[1].toLowerCase()}. However, ${lib1.name} might still be preferable if ${lib1Strengths[0].toLowerCase()} is a critical requirement for your specific use case.`;
  }
};

// Scale component
const Scale = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);

export default ComparisonPage;
