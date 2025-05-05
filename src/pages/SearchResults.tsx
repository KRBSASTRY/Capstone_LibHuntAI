
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Star, Filter, X, ChevronDown, Package, Clock,
  ArrowUpDown, SortAsc, SortDesc, Check, Grid, List, Bookmark,
  SlidersHorizontal, CalendarClock, Download, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllLibraries } from "@/services/libraryService";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { fetchLibraries } from "@/services/libraryService";
import Fuse from "fuse.js";



// // Mock data
// const mockLibraries = [
//   { 
//     id: "1", 
//     name: "React", 
//     description: "A JavaScript library for building user interfaces",
//     category: "Frontend Framework",
//     stars: 198000,
//     version: "18.2.0",
//     license: "MIT",
//     lastUpdate: "2 months ago",
//     weeklyDownloads: 15700000,
//     dependencies: 2,
//     typescript: true,
//     performance: {
//       performance: 85,
//       loadTime: 92,
//       maintenance: 95
//     },
//     tags: ["ui", "frontend", "component-based", "virtual-dom"],
//     bundleSize: "42.2 kB"
//   },
//   { 
//     id: "2", 
//     name: "Vue.js", 
//     description: "Progressive JavaScript framework for building UIs",
//     category: "Frontend Framework",
//     stars: 197000,
//     version: "3.2.45",
//     license: "MIT",
//     lastUpdate: "1 month ago",
//     weeklyDownloads: 4900000,
//     dependencies: 0,
//     typescript: true,
//     performance: {
//       performance: 90,
//       loadTime: 95,
//       maintenance: 88
//     },
//     tags: ["ui", "frontend", "progressive", "component-based"],
//     bundleSize: "33.1 kB"
//   },
//   { 
//     id: "3", 
//     name: "Angular", 
//     description: "Platform for building mobile and desktop web applications",
//     category: "Frontend Framework",
//     stars: 85000,
//     version: "15.0.4",
//     license: "MIT",
//     lastUpdate: "2 weeks ago",
//     weeklyDownloads: 2300000,
//     dependencies: 3,
//     typescript: true,
//     performance: {
//       performance: 75,
//       loadTime: 88,
//       maintenance: 90
//     },
//     tags: ["ui", "frontend", "platform", "google"],
//     bundleSize: "148 kB"
//   },
//   { 
//     id: "4", 
//     name: "Express", 
//     description: "Fast, unopinionated, minimalist web framework for Node.js",
//     category: "Backend Framework",
//     stars: 58000,
//     version: "4.18.2",
//     license: "MIT",
//     lastUpdate: "3 months ago",
//     weeklyDownloads: 18500000,
//     dependencies: 30,
//     typescript: false,
//     performance: {
//       performance: 94,
//       loadTime: 87,
//       maintenance: 80
//     },
//     tags: ["server", "node", "api", "backend"],
//     bundleSize: "208 kB"
//   },
//   { 
//     id: "5", 
//     name: "Django", 
//     description: "High-level Python Web framework that encourages rapid development",
//     category: "Backend Framework",
//     stars: 66000,
//     version: "4.1.4",
//     license: "BSD-3-Clause",
//     lastUpdate: "2 months ago",
//     weeklyDownloads: 1200000,
//     dependencies: 0,
//     typescript: false,
//     performance: {
//       performance: 88,
//       loadTime: 92,
//       maintenance: 85
//     },
//     tags: ["python", "backend", "orm", "fullstack"],
//     bundleSize: null
//   },
//   { 
//     id: "6", 
//     name: "Tailwind CSS", 
//     description: "A utility-first CSS framework for rapid UI development",
//     category: "CSS Framework",
//     stars: 62000,
//     version: "3.2.4",
//     license: "MIT",
//     lastUpdate: "1 month ago",
//     weeklyDownloads: 3900000,
//     dependencies: 5,
//     typescript: false,
//     performance: {
//       performance: 92,
//       loadTime: 95,
//       maintenance: 98
//     },
//     tags: ["css", "design", "utility", "responsive"],
//     bundleSize: "3.9 kB"
//   },
//   { 
//     id: "7", 
//     name: "Redux", 
//     description: "Predictable state container for JavaScript apps",
//     category: "State Management",
//     stars: 57000,
//     version: "4.2.0",
//     license: "MIT",
//     lastUpdate: "5 months ago",
//     weeklyDownloads: 7100000,
//     dependencies: 1,
//     typescript: true,
//     performance: {
//       performance: 90,
//       loadTime: 88,
//       maintenance: 82
//     },
//     tags: ["state", "flux", "react", "frontend"],
//     bundleSize: "2.6 kB"
//   },
//   { 
//     id: "8", 
//     name: "Mongoose", 
//     description: "MongoDB object modeling designed to work in an asynchronous environment",
//     category: "Database",
//     stars: 25000,
//     version: "6.8.3",
//     license: "MIT",
//     lastUpdate: "2 weeks ago",
//     weeklyDownloads: 3500000,
//     dependencies: 10,
//     typescript: true,
//     performance: {
//       performance: 85,
//       loadTime: 90,
//       maintenance: 95
//     },
//     tags: ["mongodb", "database", "orm", "node"],
//     bundleSize: "47.8 kB"
//   },
//   { 
//     id: "9", 
//     name: "Jest", 
//     description: "Delightful JavaScript Testing Framework with a focus on simplicity",
//     category: "Testing",
//     stars: 41000,
//     version: "29.3.1",
//     license: "MIT",
//     lastUpdate: "1 month ago",
//     weeklyDownloads: 12800000,
//     dependencies: 15,
//     typescript: true,
//     performance: {
//       performance: 88,
//       loadTime: 94,
//       maintenance: 92
//     },
//     tags: ["testing", "unit-testing", "javascript", "framework"],
//     bundleSize: "104.5 kB"
//   },
//   { 
//     id: "10", 
//     name: "Next.js", 
//     description: "The React Framework for Production",
//     category: "Framework",
//     stars: 97000,
//     version: "13.1.1",
//     license: "MIT",
//     lastUpdate: "1 week ago",
//     weeklyDownloads: 4200000,
//     dependencies: 7,
//     typescript: true,
//     performance: {
//       performance: 95,
//       loadTime: 98,
//       maintenance: 96
//     },
//     tags: ["react", "ssr", "static", "framework"],
//     bundleSize: "76.3 kB"
//   },
//   { 
//     id: "11", 
//     name: "Chakra UI", 
//     description: "Simple, modular and accessible component library for React",
//     category: "UI Components",
//     stars: 32000,
//     version: "2.4.9",
//     license: "MIT",
//     lastUpdate: "2 weeks ago",
//     weeklyDownloads: 1100000,
//     dependencies: 12,
//     typescript: true,
//     performance: {
//       performance: 92,
//       loadTime: 95,
//       maintenance: 90
//     },
//     tags: ["ui", "components", "design-system", "react"],
//     bundleSize: "128.5 kB"
//   },
//   { 
//     id: "12", 
//     name: "Framer Motion", 
//     description: "A production-ready motion library for React",
//     category: "Animation",
//     stars: 18500,
//     version: "8.5.2",
//     license: "MIT",
//     lastUpdate: "3 days ago",
//     weeklyDownloads: 1500000,
//     dependencies: 3,
//     typescript: true,
//     performance: {
//       performance: 90,
//       loadTime: 95,
//       maintenance: 94
//     },
//     tags: ["animation", "react", "motion", "transitions"],
//     bundleSize: "32.7 kB"
//   },
//   { 
//     id: "13", 
//     name: "TanStack Query", 
//     description: "Powerful asynchronous state management for TS/JS, React, Solid, Vue and Svelte",
//     category: "Data Fetching",
//     stars: 33000,
//     version: "4.22.0",
//     license: "MIT",
//     lastUpdate: "5 days ago",
//     weeklyDownloads: 2700000,
//     dependencies: 2,
//     typescript: true,
//     performance: {
//       performance: 95,
//       loadTime: 97,
//       maintenance: 96
//     },
//     tags: ["data-fetching", "cache", "async", "state"],
//     bundleSize: "12.6 kB"
//   },
//   { 
//     id: "14", 
//     name: "Zustand", 
//     description: "A small, fast and scalable state-management solution",
//     category: "State Management",
//     stars: 24500,
//     version: "4.3.2",
//     license: "MIT",
//     lastUpdate: "1 week ago",
//     weeklyDownloads: 1900000,
//     dependencies: 1,
//     typescript: true,
//     performance: {
//       performance: 98,
//       loadTime: 95,
//       maintenance: 94
//     },
//     tags: ["state", "react", "hooks", "redux-alternative"],
//     bundleSize: "1.1 kB"
//   },
//   { 
//     id: "15", 
//     name: "TypeORM", 
//     description: "ORM for TypeScript and JavaScript",
//     category: "Database",
//     stars: 30000,
//     version: "0.3.11",
//     license: "MIT",
//     lastUpdate: "2 weeks ago",
//     weeklyDownloads: 850000,
//     dependencies: 8,
//     typescript: true,
//     performance: {
//       performance: 87,
//       loadTime: 92,
//       maintenance: 85
//     },
//     tags: ["orm", "typescript", "database", "sql"],
//     bundleSize: "320.5 kB"
//   },
// ];

const categories = [
  "Frontend Framework",
  "Backend Framework",
  "Database",
  "State Management",
  "UI Components",
  "CSS Framework",
  "Testing",
  "Framework",
  "Animation",
  "Data Fetching"
];

type Library = {
  _id: string,
  name: string,
  description: string,
  longDescription: string,
  logo: string,
  category: string,
  website: string,
  github: string,
  npm: string,
  stars: number,
  version: string,
  license: string,
  lastUpdate: string,
  firstRelease: string,
  weeklyDownloads: number,
  contributors: number,
  usedBy: [string],
  dependencies: [string],
  supportedOs: [string],
  bundle: {
    size: string,
    gzipped: string,
  },
  performance: {
    loadTime: number,
    renderTime: number,
    memoryUsage: number,
  },
  issues: {
    open: number,
    closed: number,
  },
  securityIssues: number,
  testCoverage: number,
  alternatives: [string],
  useageExample: string,
  codeMaintainability: number,
  typeSupport: string,
  documentation: number,
  communitySupport: number,
  tags: string[],
  typescript: boolean,
}

const SearchResults = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [favoriteLibraries, setFavoriteLibraries] = useState<string[]>([]);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [minStars, setMinStars] = useState<number>(0);
  const [hasTypescript, setHasTypescript] = useState<boolean | null>(null);
  const [updatedWithin, setUpdatedWithin] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          const response = await fetchLibraries(1, 20); // Fetch page 1
          console.log("Fetched libraries:", response);
  
          if (response && response.libraries) {
            setLibraries(response.libraries);
            setTotalPages(response.totalPages || 1);
            setCurrentPage(1);
          } else {
            setLibraries([]); // fallback to empty array
            setTotalPages(1);
          }
        } catch (error) {
          console.error("Failed to fetch libraries:", error);
          toast({
            title: "Error",
            description: "Could not fetch libraries from server.",
            variant: "destructive",
          });
        } finally {
          setLoadingResults(false);
        }
      };
  
      fetchData();
    }, 800);
  
    return () => clearTimeout(timer);
  }, []);
  


  // Filter libraries based on search query and filters
  useEffect(() => {
    if (libraries.length === 0) return;

    let filtered = [...libraries];

    // Apply search query filter
    if (searchQuery) {
      const fuse = new Fuse(libraries, {
        keys: ["name", "description", "tags"],
        threshold: 0.3,
      });
  
      const result = fuse.search(searchQuery);
      filtered = result.map(r => r.item);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(lib =>
        selectedCategories.includes(lib.category)
      );
    }

    // Apply stars filter
    if (minStars > 0) {
      filtered = filtered.filter(lib => lib.stars >= minStars);
    }

    // Apply TypeScript filter
    if (hasTypescript !== null) {
      filtered = filtered.filter(lib => lib.typescript === hasTypescript);
    }

    // Apply last updated filter
    if (updatedWithin) {
      filtered = filtered.filter(lib => {
        if (updatedWithin === "week" && lib.lastUpdate.includes("day") || lib.lastUpdate.includes("week") && lib.lastUpdate.includes("1 week")) {
          return true;
        }
        if (updatedWithin === "month" && (lib.lastUpdate.includes("day") || lib.lastUpdate.includes("week") || lib.lastUpdate.includes("month") && lib.lastUpdate.includes("1 month"))) {
          return true;
        }
        if (updatedWithin === "year" && !lib.lastUpdate.includes("year")) {
          return true;
        }
        return false;
      });
    }

    // Apply sorting
    if (sortBy === "stars") {
      filtered.sort((a, b) => b.stars - a.stars);
    } else if (sortBy === "downloads") {
      filtered.sort((a, b) => b.weeklyDownloads - a.weeklyDownloads);
    } else if (sortBy === "recent") {
      filtered.sort((a, b) => {
        if (a.lastUpdate.includes("day") && !b.lastUpdate.includes("day")) return -1;
        if (!a.lastUpdate.includes("day") && b.lastUpdate.includes("day")) return 1;
        if (a.lastUpdate.includes("week") && !b.lastUpdate.includes("week") && !b.lastUpdate.includes("day")) return -1;
        if (!a.lastUpdate.includes("week") && !a.lastUpdate.includes("day") && b.lastUpdate.includes("week")) return 1;
        return b.stars - a.stars; // fallback sort
      });
    } else if (sortBy === "performance") {
      filtered.sort((a, b) => getAverageperformance(b) - getAverageperformance(a));
    } else if (sortBy === "overall") {
      filtered.sort((a, b) => {
        const scoreA = (a.documentation + a.codeMaintainability + a.communitySupport) / 3;
        const scoreB = (b.documentation + b.codeMaintainability + b.communitySupport) / 3;
        return scoreB - scoreA;
      });
    } else if (sortBy === "size") {
      filtered.sort((a, b) => {
        if (!a.bundle?.size) return 1;
        if (!b.bundle?.size) return -1;
        const sizeA = parseFloat(a.bundle.size.replace(" kB", ""));
        const sizeB = parseFloat(b.bundle.size.replace(" kB", ""));
        return sizeA - sizeB;
      });
    }


    setFilteredLibraries(filtered);
  }, [libraries, searchQuery, selectedCategories, minStars, hasTypescript, updatedWithin, sortBy]);

  const handleSearch = () => {
    // Update URL with search query
    setSearchParams({ q: searchQuery });

    // Reset scroll position
    window.scrollTo(0, 0);
  };

  const handleLoadMore = async () => {
    try {
      const { libraries: newLibraries } = await fetchLibraries(currentPage + 1, 20);
      setLibraries(prev => [...prev, ...newLibraries]);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error("Failed to load more libraries:", error);
      toast({
        title: "Error",
        description: "Could not load more libraries.",
        variant: "destructive",
      });
    }
  };


  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinStars(0);
    setHasTypescript(null);
    setUpdatedWithin(null);
    setSortBy("relevance");
  };

  const toggleFavorite = (libraryId: string) => {
    setFavoriteLibraries(prev => {
      const newFavorites = prev.includes(libraryId)
        ? prev.filter(id => id !== libraryId)
        : [...prev, libraryId];

      toast({
        title: prev.includes(libraryId) ? "Removed from favorites" : "Added to favorites",
        description: `Library has been ${prev.includes(libraryId) ? "removed from" : "added to"} your favorites.`,
      });

      return newFavorites;
    });
  };

  // Calculate average performance
  const getAverageperformance = (lib: Library): number => {
    if (
      !lib.performance ||
      lib.performance.loadTime === undefined ||
      lib.performance.renderTime === undefined ||
      lib.performance.memoryUsage === undefined
    ) {
      return 0;
    }

    return Math.round(
      (lib.performance.loadTime + lib.performance.renderTime + lib.performance.memoryUsage) / 3
    );
  };


  const getAverageScore = (lib: Library) => {
    return Math.round(
      (lib.documentation + lib.codeMaintainability + lib.communitySupport) / 3
    );
  };


  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Search header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for libraries, frameworks, tools..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="whitespace-nowrap">
              Search Libraries
            </Button>
          </div>

          {/* Filter pills */}
          {(selectedCategories.length > 0 || minStars > 0 || hasTypescript !== null || updatedWithin || sortBy !== "relevance") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategories.map(category => (
                <Badge
                  key={category}
                  variant="outline"
                  className="bg-accent/10 hover:bg-accent/20 transition-colors"
                >
                  {category}
                  <button
                    className="ml-1 hover:text-foreground"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}

              {minStars > 0 && (
                <Badge
                  variant="outline"
                  className="bg-accent/10 hover:bg-accent/20 transition-colors"
                >
                  {minStars}+ stars
                  <button
                    className="ml-1 hover:text-foreground"
                    onClick={() => setMinStars(0)}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {hasTypescript !== null && (
                <Badge
                  variant="outline"
                  className="bg-accent/10 hover:bg-accent/20 transition-colors"
                >
                  {hasTypescript ? "TypeScript" : "No TypeScript"}
                  <button
                    className="ml-1 hover:text-foreground"
                    onClick={() => setHasTypescript(null)}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {updatedWithin && (
                <Badge
                  variant="outline"
                  className="bg-accent/10 hover:bg-accent/20 transition-colors"
                >
                  Updated within {updatedWithin}
                  <button
                    className="ml-1 hover:text-foreground"
                    onClick={() => setUpdatedWithin(null)}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              {sortBy !== "relevance" && (
                <Badge
                  variant="outline"
                  className="bg-accent/10 hover:bg-accent/20 transition-colors"
                >
                  Sorted by: {sortBy}
                  <button
                    className="ml-1 hover:text-foreground"
                    onClick={() => setSortBy("relevance")}
                  >
                    <X size={14} />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters sidebar (desktop) */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:block"
          >
            <div className="sticky top-20">
              <Card className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </Button>
                </div>

                <CardContent className="p-4">
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <div className="space-y-6 pr-4">
                      {/* Category filter */}
                      <div>
                        <h3 className="font-medium mb-3">Category</h3>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category} className="flex items-center">
                              <Checkbox
                                id={`category-${category}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => handleCategoryToggle(category)}
                              />
                              <Label
                                htmlFor={`category-${category}`}
                                className="ml-2 text-sm cursor-pointer"
                              >
                                {category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      {/* Popularity filter */}
                      <div>
                        <h3 className="font-medium mb-3">Popularity</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2 text-sm">
                              <span>Minimum Stars</span>
                              <span>{minStars > 0 ? formatNumber(minStars) : "Any"}</span>
                            </div>
                            <Slider
                              defaultValue={[0]}
                              max={100000}
                              step={5000}
                              value={[minStars]}
                              onValueChange={(values) => setMinStars(values[0])}
                              className="py-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0</span>
                              <span>50K</span>
                              <span>100K+</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      {/* Last Updated filter */}
                      <div>
                        <h3 className="font-medium mb-3">Last Updated</h3>
                        <RadioGroup
                          value={updatedWithin || ""}
                          onValueChange={(value) => setUpdatedWithin(value || null)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <RadioGroupItem value="" id="updated-any" />
                              <Label htmlFor="updated-any" className="ml-2 text-sm">Any time</Label>
                            </div>
                            <div className="flex items-center">
                              <RadioGroupItem value="week" id="updated-week" />
                              <Label htmlFor="updated-week" className="ml-2 text-sm">Last week</Label>
                            </div>
                            <div className="flex items-center">
                              <RadioGroupItem value="month" id="updated-month" />
                              <Label htmlFor="updated-month" className="ml-2 text-sm">Last month</Label>
                            </div>
                            <div className="flex items-center">
                              <RadioGroupItem value="year" id="updated-year" />
                              <Label htmlFor="updated-year" className="ml-2 text-sm">Last year</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator className="bg-white/10" />

                      {/* TypeScript Support filter */}
                      <div>
                        <h3 className="font-medium mb-3">TypeScript Support</h3>
                        <RadioGroup
                          value={hasTypescript === null ? "" : hasTypescript ? "yes" : "no"}
                          onValueChange={(value) => {
                            if (value === "") {
                              setHasTypescript(null);
                            } else {
                              setHasTypescript(value === "yes");
                            }
                          }}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <RadioGroupItem value="" id="ts-any" />
                              <Label htmlFor="ts-any" className="ml-2 text-sm">Any</Label>
                            </div>
                            <div className="flex items-center">
                              <RadioGroupItem value="yes" id="ts-yes" />
                              <Label htmlFor="ts-yes" className="ml-2 text-sm">Yes</Label>
                            </div>
                            <div className="flex items-center">
                              <RadioGroupItem value="no" id="ts-no" />
                              <Label htmlFor="ts-no" className="ml-2 text-sm">No</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </motion.aside>

          {/* Results container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* Mobile filter buttons */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="gap-2"
              >
                <Filter size={16} />
                Filters
              </Button>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <ArrowUpDown size={16} />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuCheckboxItem
                      checked={sortBy === "relevance"}
                      onCheckedChange={() => setSortBy("relevance")}
                    >
                      Relevance
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                      checked={sortBy === "stars"}
                      onCheckedChange={() => setSortBy("stars")}
                    >
                      Stars
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                      checked={sortBy === "downloads"}
                      onCheckedChange={() => setSortBy("downloads")}
                    >
                      Downloads
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                      checked={sortBy === "recent"}
                      onCheckedChange={() => setSortBy("recent")}
                    >
                      Recently Updated
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                      checked={sortBy === "performance"}
                      onCheckedChange={() => setSortBy("performance")}
                    >
                      Performance
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                      checked={sortBy === "overall"}
                      onCheckedChange={() => setSortBy("overall")}
                    >
                      Overall performance
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                      checked={sortBy === "size"}
                      onCheckedChange={() => setSortBy("size")}
                    >
                      Bundle Size
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center rounded-md border border-white/10 p-1">
                  <Button
                    variant={view === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView("grid")}
                  >
                    <Grid size={16} />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={view === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView("list")}
                  >
                    <List size={16} />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile filters modal */}
            {filtersOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 lg:hidden">
                <Card className="max-w-lg mx-auto glass-card overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Filters</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFiltersOpen(false)}
                    >
                      <X size={20} />
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      <div className="space-y-6 pr-4">
                        {/* Category filter */}
                        <div>
                          <h3 className="font-medium mb-3">Category</h3>
                          <div className="space-y-2">
                            {categories.map(category => (
                              <div key={category} className="flex items-center">
                                <Checkbox
                                  id={`mobile-category-${category}`}
                                  checked={selectedCategories.includes(category)}
                                  onCheckedChange={() => handleCategoryToggle(category)}
                                />
                                <Label
                                  htmlFor={`mobile-category-${category}`}
                                  className="ml-2 text-sm cursor-pointer"
                                >
                                  {category}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Popularity filter */}
                        <div>
                          <h3 className="font-medium mb-3">Popularity</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-2 text-sm">
                                <span>Minimum Stars</span>
                                <span>{minStars > 0 ? formatNumber(minStars) : "Any"}</span>
                              </div>
                              <Slider
                                defaultValue={[0]}
                                max={100000}
                                step={5000}
                                value={[minStars]}
                                onValueChange={(values) => setMinStars(values[0])}
                                className="py-2"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0</span>
                                <span>50K</span>
                                <span>100K+</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Last Updated filter */}
                        <div>
                          <h3 className="font-medium mb-3">Last Updated</h3>
                          <RadioGroup
                            value={updatedWithin || ""}
                            onValueChange={(value) => setUpdatedWithin(value || null)}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <RadioGroupItem value="" id="mobile-updated-any" />
                                <Label htmlFor="mobile-updated-any" className="ml-2 text-sm">Any time</Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem value="week" id="mobile-updated-week" />
                                <Label htmlFor="mobile-updated-week" className="ml-2 text-sm">Last week</Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem value="month" id="mobile-updated-month" />
                                <Label htmlFor="mobile-updated-month" className="ml-2 text-sm">Last month</Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem value="year" id="mobile-updated-year" />
                                <Label htmlFor="mobile-updated-year" className="ml-2 text-sm">Last year</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* TypeScript Support filter */}
                        <div>
                          <h3 className="font-medium mb-3">TypeScript Support</h3>
                          <RadioGroup
                            value={hasTypescript === null ? "" : hasTypescript ? "yes" : "no"}
                            onValueChange={(value) => {
                              if (value === "") {
                                setHasTypescript(null);
                              } else {
                                setHasTypescript(value === "yes");
                              }
                            }}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <RadioGroupItem value="" id="mobile-ts-any" />
                                <Label htmlFor="mobile-ts-any" className="ml-2 text-sm">Any</Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem value="yes" id="mobile-ts-yes" />
                                <Label htmlFor="mobile-ts-yes" className="ml-2 text-sm">Yes</Label>
                              </div>
                              <div className="flex items-center">
                                <RadioGroupItem value="no" id="mobile-ts-no" />
                                <Label htmlFor="mobile-ts-no" className="ml-2 text-sm">No</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </ScrollArea>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                      >
                        Reset Filters
                      </Button>

                      <Button
                        onClick={() => setFiltersOpen(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Results header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium">
                  {loadingResults ? (
                    <span className="inline-block animate-pulse">Loading results...</span>
                  ) : (
                    <span>{filteredLibraries.length} libraries found</span>
                  )}
                </h2>
                {searchQuery && (
                  <p className="text-muted-foreground text-sm">
                    for "{searchQuery}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort dropdown (desktop) */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown size={16} />
                          <span>Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                        </div>
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuCheckboxItem
                        checked={sortBy === "relevance"}
                        onCheckedChange={() => setSortBy("relevance")}
                      >
                        Relevance
                      </DropdownMenuCheckboxItem>

                      <DropdownMenuCheckboxItem
                        checked={sortBy === "stars"}
                        onCheckedChange={() => setSortBy("stars")}
                      >
                        Stars
                      </DropdownMenuCheckboxItem>

                      <DropdownMenuCheckboxItem
                        checked={sortBy === "downloads"}
                        onCheckedChange={() => setSortBy("downloads")}
                      >
                        Downloads
                      </DropdownMenuCheckboxItem>

                      <DropdownMenuCheckboxItem
                        checked={sortBy === "recent"}
                        onCheckedChange={() => setSortBy("recent")}
                      >
                        Recently Updated
                      </DropdownMenuCheckboxItem>

                      <DropdownMenuCheckboxItem
                        checked={sortBy === "performance"}
                        onCheckedChange={() => setSortBy("performance")}
                      >
                        Performance
                      </DropdownMenuCheckboxItem>

                      <DropdownMenuCheckboxItem
                        checked={sortBy === "overall"}
                        onCheckedChange={() => setSortBy("overall")}
                      >
                        Overall performance
                      </DropdownMenuCheckboxItem>

                      <DropdownMenuCheckboxItem
                        checked={sortBy === "size"}
                        onCheckedChange={() => setSortBy("size")}
                      >
                        Bundle Size
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* View toggle (desktop) */}
                <div className="hidden md:flex items-center rounded-md border border-white/10 p-1">
                  <Button
                    variant={view === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView("grid")}
                  >
                    <Grid size={16} />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={view === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView("list")}
                  >
                    <List size={16} />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loadingResults && (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="glass-card animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 w-1/3 bg-white/10 rounded mb-4"></div>
                      <div className="h-4 w-3/4 bg-white/10 rounded mb-3"></div>
                      <div className="h-4 w-1/2 bg-white/10 rounded mb-5"></div>
                      <div className="flex gap-2">
                        <div className="h-5 w-16 bg-white/10 rounded"></div>
                        <div className="h-5 w-16 bg-white/10 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loadingResults && filteredLibraries.length === 0 && (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Search size={48} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No libraries found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any libraries matching your search query and filters. Try adjusting your search or clearing some filters.
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </CardContent>
              </Card>
            )}

            {/* Grid view */}
            {!loadingResults && filteredLibraries.length > 0 && view === "grid" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredLibraries.map((library) => (
                    <Link key={library._id} to={`/library/${library._id}`} className="block">
                      <Card className="glass-card hover:border-accent/30 hover:bg-card/80 transition-colors overflow-hidden h-full">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-medium">{library.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(library._id);
                              }}
                            >
                              <Bookmark
                                size={16}
                                className={favoriteLibraries.includes(library._id) ? "fill-accent text-accent" : ""}
                              />
                            </Button>
                          </div>

                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {library.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge variant="outline" className="bg-white/5">
                              {library.category}
                            </Badge>

                            {library.typescript && (
                              <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                                TypeScript
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center text-amber-400 text-sm">
                                <Star size={16} className="mr-1 fill-amber-400" />
                                {formatNumber(library.stars)}
                              </div>

                              <div className="flex items-center text-muted-foreground text-sm">
                                <Package size={16} className="mr-1" />
                                v{library.version}
                              </div>
                            </div>

                            <div className="text-xs px-2 py-1 bg-white/10 rounded-full">
                              performance: {getAverageperformance(library)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {currentPage < totalPages && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      className="px-8 py-4"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )} 

            {/* List view */}
            {!loadingResults && filteredLibraries.length > 0 && view === "list" && (
              <>
                <div className="space-y-4">
                  {filteredLibraries.map((library) => (
                    <motion.div
                      key={library._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link to={`/library/${library._id}`} className="block">
                        <Card className="glass-card hover:border-accent/30 hover:bg-card/80 transition-colors overflow-hidden">
                          <CardContent className="p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className="text-lg font-medium">{library.name}</h3>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground md:hidden"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleFavorite(library._id);
                                    }}
                                  >
                                    <Bookmark
                                      size={16}
                                      className={favoriteLibraries.includes(library._id) ? "fill-accent text-accent" : ""}
                                    />
                                  </Button>
                                </div>

                                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                  {library.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="outline" className="bg-white/5">
                                    {library.category}
                                  </Badge>

                                  {library.typescript && (
                                    <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                                      TypeScript
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-row md:flex-col gap-4 md:gap-2 md:items-end md:shrink-0 md:w-48">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center text-amber-400 text-sm">
                                    <Star size={16} className="mr-1 fill-amber-400" />
                                    {formatNumber(library.stars)}
                                  </div>

                                  <div className="flex items-center text-muted-foreground text-sm">
                                    <Package size={16} className="mr-1" />
                                    v{library.version}
                                  </div>

                                  <div className="hidden md:flex items-center text-muted-foreground text-sm">
                                    <Clock size={16} className="mr-1" />
                                    {library.lastUpdate}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 md:justify-end">
                                  <div className="items-center text-xs px-2 py-1 bg-white/10 rounded-full">
                                    performance: {getAverageperformance(library)}
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hidden md:flex"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleFavorite(library._id);
                                    }}
                                  >
                                    <Bookmark
                                      size={16}
                                      className={favoriteLibraries.includes(library._id) ? "fill-accent text-accent" : ""}
                                    />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {currentPage < totalPages && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      className="px-8 py-4"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )} 

          </motion.div> 

        </div> 

      </div> 

      </div>


  );
};

export default SearchResults;