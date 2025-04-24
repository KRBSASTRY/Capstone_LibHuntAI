
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, Download, ExternalLink, Calendar, Package, Bookmark,
  Box, Share2, Code, Server, Cpu, GitBranch, Clock, Heart, FileCheck, Scale,
  Thermometer, GitFork, RefreshCw, Users, Shield, Check, BookOpen, BarChart, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { fetchLibraryById } from "@/services/libraryService";


const LibraryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [library, setLibrary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        console.log("📦 Fetching library with ID:", id);
        const data = await fetchLibraryById(id!);
        console.log("✅ Received library:", data);
        setLibrary(data);
      } catch (error) {
        console.error("❌ Error loading library:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadLibrary();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spinner h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!library) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Library Not Found</h1>
          <p className="text-muted-foreground mb-6">The library you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="ghost"
            asChild
            className="gap-2 hover:bg-white/5"
          >
            <Link to="/search">
              <ArrowLeft size={16} />
              Back to Search
            </Link>
          </Button>

        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    setFavorited(!favorited);

    toast({
      title: favorited ? "Removed from favorites" : "Added to favorites",
      description: favorited
        ? `${library.name} has been removed from your favorites`
        : `${library.name} has been added to your favorites`,
    });
  };

  const handleCompare = () => {
    // Navigate to compare page with this library pre-selected
    window.location.href = `/compare?lib=${library._id}`;
  };

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
  <Link to="/search">
    <ArrowLeft size={16} />
    Back to Search
  </Link>
</Button>


        </div>

        {/* Library header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-xl p-6 mb-8 relative overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
            {/* Logo */}
            <div className="w-24 h-24 rounded-xl glass flex items-center justify-center p-2 overflow-hidden shrink-0">
              {library.logo ? (
                <img src={library.logo} alt={library.name} className="w-full h-full object-contain" />
              ) : (
                <Package size={40} className="text-accent" />
              )}
            </div>

            {/* Basic info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl font-display font-bold">{library.name}</h1>
                <Badge variant="outline" className="bg-white/10 md:ml-2 self-center md:self-auto">
                  {library.category}
                </Badge>
              </div>

              <p className="text-xl text-muted-foreground mb-4 max-w-3xl">
                {library.description}
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star size={18} className="fill-amber-400" />
                  <span>{library.stars ? library.stars.toLocaleString() : "0"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Package size={18} className="text-muted-foreground" />
                  <span>v{library.version}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar size={18} className="text-muted-foreground" />
                  <span>Updated {library.lastUpdate}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Download size={18} className="text-muted-foreground" />
                  <span>{(library.weeklyDownloads / 1000000).toFixed(1)}M weekly downloads</span>
                </div>

                <div className="flex items-center gap-1">
                  <FileCheck size={18} className="text-muted-foreground" />
                  <span>{library.license}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button asChild>
                  <a href={library.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink size={16} />
                    Website
                  </a>
                </Button>

                <Button asChild variant="outline">
                  <a href={library.github} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <GitBranch size={16} />
                    GitHub
                  </a>
                </Button>

                <Button asChild variant="outline">
                  <a href={library.npm} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Package size={16} />
                    NPM
                  </a>
                </Button>

                <Button
                  variant={favorited ? "default" : "outline"}
                  onClick={toggleFavorite}
                  className="gap-2"
                >
                  <Heart size={16} className={favorited ? "fill-current" : ""} />
                  {favorited ? "Favorited" : "Add to Favorites"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCompare}
                  className="gap-2"
                >
                  <Scale size={16} />
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Library details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Overview tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-display font-medium mb-4">About {library.name}</h2>
                      <p className="text-muted-foreground">{library.longDescription}</p>
                    </CardContent>
                  </Card>

                  {/* Used by */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-display font-medium mb-4">Used By</h2>
                      <div className="flex flex-wrap gap-3">
                        {library.usedBy.map((company: string) => (
                          <div
                            key={company}
                            className="px-4 py-2 bg-white/5 rounded-lg border border-white/10"
                          >
                            {company}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-display font-medium mb-4">Performance</h2>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Load Time</span>
                            <span className="text-accent">{library.performance.loadTime}/100</span>
                          </div>
                          <Progress value={library.performance.loadTime} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Render Time</span>
                            <span className="text-accent">{library.performance.renderTime}/100</span>
                          </div>
                          <Progress value={library.performance.renderTime} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Memory Usage</span>
                            <span className="text-accent">{library.performance.memoryUsage}/100</span>
                          </div>
                          <Progress value={library.performance.memoryUsage} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-8">
                  {/* Key facts */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-display font-medium mb-4">Key Information</h2>

                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">First Release</span>
                          <span>{library.firstRelease}</span>
                        </li>
                        <Separator className="bg-white/10" />

                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Bundle Size</span>
                          <span>{library.bundle.size} (gzipped: {library.bundle.gzipped})</span>
                        </li>
                        <Separator className="bg-white/10" />

                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Test Coverage</span>
                          <span>{library.testCoverage}%</span>
                        </li>
                        <Separator className="bg-white/10" />

                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Contributors</span>
                          <span>{library.contributors}</span>
                        </li>
                        <Separator className="bg-white/10" />

                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Open Issues</span>
                          <span>{library.issues.open}</span>
                        </li>
                        <Separator className="bg-white/10" />

                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Security Issues</span>
                          <span>{library.securityIssues === 0 ? (
                            <span className="flex items-center text-green-400">
                              <Shield size={16} className="mr-1" /> None
                            </span>
                          ) : library.securityIssues}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Dependencies */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-display font-medium mb-4">Dependencies</h2>

                      {library.dependencies.length === 0 ? (
                        <p className="text-muted-foreground">No dependencies</p>
                      ) : (
                        <ul className="space-y-2">
                          {library.dependencies.map((dep: string) => (
                            <li key={dep} className="flex items-center gap-2">
                              <Package size={16} className="text-muted-foreground" />
                              <span>{dep}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>

                  {/* OS Support */}
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-display font-medium mb-4">OS Compatibility</h2>

                      <div className="flex flex-wrap gap-2">
                        {library.supportedOS.map((os: string) => (
                          <Badge key={os} variant="outline" className="bg-white/5">
                            {os}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Stats tab */}
            <TabsContent value="stats" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* GitHub stats */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                        <GitBranch size={20} />
                      </div>
                      <h3 className="font-medium">GitHub Stats</h3>
                    </div>

                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Stars</span>
                        <span className="flex items-center">
                          <Star size={16} className="mr-1 text-amber-400" />
                          {library.stars.toLocaleString()}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Open Issues</span>
                        <span>{library.issues.open}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Closed Issues</span>
                        <span>{library.issues.closed}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Contributors</span>
                        <span className="flex items-center">
                          <Users size={16} className="mr-1" />
                          {library.contributors}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* NPM stats */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Package size={20} />
                      </div>
                      <h3 className="font-medium">NPM Stats</h3>
                    </div>

                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Weekly Downloads</span>
                        <span className="flex items-center">
                          <Download size={16} className="mr-1" />
                          {(library.weeklyDownloads / 1000000).toFixed(1)}M
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Current Version</span>
                        <span>v{library.version}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">First Release</span>
                        <span>{library.firstRelease}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Last Update</span>
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {library.lastUpdate}
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Performance */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Thermometer size={20} />
                      </div>
                      <h3 className="font-medium">Performance</h3>
                    </div>

                    <ul className="space-y-3">
                      <li>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Load Time</span>
                          <span>{library.performance.loadTime}/100</span>
                        </div>
                        <Progress value={library.performance.loadTime} className="h-2" />
                      </li>
                      <li>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Render Time</span>
                          <span>{library.performance.renderTime}/100</span>
                        </div>
                        <Progress value={library.performance.renderTime} className="h-2" />
                      </li>
                      <li>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Memory Usage</span>
                          <span>{library.performance.memoryUsage}/100</span>
                        </div>
                        <Progress value={library.performance.memoryUsage} className="h-2" />
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Size */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Box size={20} />
                      </div>
                      <h3 className="font-medium">Bundle Size</h3>
                    </div>

                    <div className="relative pt-12 pb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-5xl font-display font-bold text-accent">
                          {library.bundle.gzipped}
                        </div>
                      </div>
                      <div className="text-center mt-20">
                        <p className="text-sm text-muted-foreground">Minified: {library.bundle.size}</p>
                        <p className="text-sm text-muted-foreground">Gzipped: {library.bundle.gzipped}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Health Score */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Health Score</h3>

                    <div className="relative pt-20 pb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl font-display font-bold text-gradient">
                          92
                        </div>
                      </div>
                      <div className="text-center mt-24">
                        <p className="text-sm text-muted-foreground">Excellent health score</p>
                        <p className="text-xs text-muted-foreground mt-1">Based on updates, issues, and community</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Maintenance */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Maintenance</h3>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Commit Frequency</span>
                          <span className="text-green-400">Very High</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Issue Response</span>
                          <span className="text-green-400">High</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Release Cadence</span>
                          <span className="text-amber-400">Medium</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Documentation</span>
                          <span className="text-green-400">Excellent</span>
                        </div>
                        <Progress value={98} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Community */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-4">Community & Support</h3>

                    <ul className="space-y-3">
                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users size={16} className="text-muted-foreground" />
                          <span>Stack Overflow</span>
                        </span>
                        <span>24.5K+ questions</span>
                      </li>

                      <Separator className="bg-white/10" />

                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <BookOpen size={16} className="text-muted-foreground" />
                          <span>Documentation</span>
                        </span>
                        <span className="flex items-center text-green-400">
                          <Check size={16} className="mr-1" />
                          Comprehensive
                        </span>
                      </li>

                      <Separator className="bg-white/10" />

                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <RefreshCw size={16} className="text-muted-foreground" />
                          <span>Update Frequency</span>
                        </span>
                        <span>Every 2-3 months</span>
                      </li>

                      <Separator className="bg-white/10" />

                      <li className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Shield size={16} className="text-muted-foreground" />
                          <span>Security Updates</span>
                        </span>
                        <span className="flex items-center text-green-400">
                          <Check size={16} className="mr-1" />
                          Timely
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Code Examples tab */}
            <TabsContent value="code" className="space-y-8">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-display font-medium mb-4">Installation</h2>

                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                      <div className="flex justify-between">
                        <div>npm install {library.name.toLowerCase()}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            navigator.clipboard.writeText(`npm install ${library.name.toLowerCase()}`);
                            toast({
                              title: "Copied to clipboard",
                              description: "The command has been copied to your clipboard.",
                            });
                          }}
                        >
                          <Code size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                      <div className="flex justify-between">
                        <div>yarn add {library.name.toLowerCase()}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            navigator.clipboard.writeText(`yarn add ${library.name.toLowerCase()}`);
                            toast({
                              title: "Copied to clipboard",
                              description: "The command has been copied to your clipboard.",
                            });
                          }}
                        >
                          <Code size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <h2 className="text-xl font-display font-medium mb-4">Basic Example</h2>

                  <ScrollArea className="max-h-[400px]">
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm whitespace-pre overflow-x-auto">
                      {library.code}
                    </div>
                  </ScrollArea>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(library.code);
                      toast({
                        title: "Copied to clipboard",
                        description: "The code example has been copied to your clipboard.",
                      });
                    }}
                  >
                    <Code size={14} />
                    Copy Code
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button asChild className="gap-2">
                  <a href={`${library.website}/docs`} target="_blank" rel="noopener noreferrer">
                    <BookOpen size={16} />
                    View Full Documentation
                  </a>
                </Button>
              </div>
            </TabsContent>

            {/* Alternatives tab */}
            <TabsContent value="alternatives" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {library.alternatives.map((alt: string, index: number) => (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <h3 className="text-lg font-medium mb-2">{alt}</h3>

                        <p className="text-sm text-muted-foreground mb-4">
                          {getAlternativeDescription(alt)}
                        </p>

                        {/* Comparison chart */}
                        <div className="space-y-3 mb-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Performance</span>
                              <span>{getScore(alt, "performance")}/100</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={getScore(alt, "performance")} className="h-1.5 flex-1" />
                              <Progress
                                value={library.performance.loadTime}
                                className="h-1.5 w-1.5 bg-white/20"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Popularity</span>
                              <span>{getScore(alt, "popularity")}/100</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={getScore(alt, "popularity")} className="h-1.5 flex-1" />
                              <Progress
                                value={90}
                                className="h-1.5 w-1.5 bg-white/20"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Ease of Use</span>
                              <span>{getScore(alt, "ease")}/100</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={getScore(alt, "ease")} className="h-1.5 flex-1" />
                              <Progress
                                value={85}
                                className="h-1.5 w-1.5 bg-white/20"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/10 p-4 flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-xs"
                        >
                          <Link to={`/library/${getAlternativeId(alt)}`}>
                            View Details
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => {
                            window.location.href = `/compare?lib1=${library.id}&lib2=${getAlternativeId(alt)}`;
                          }}
                        >
                          <Scale size={12} />
                          Compare
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button asChild variant="outline" className="gap-2">
                  <Link to={`/search?category=${library.category.toLowerCase()}`}>
                    View More Alternatives
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            {/* Reviews tab */}
            <TabsContent value="reviews" className="space-y-8">
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="text-6xl font-display font-bold text-gradient">4.8</div>
                  </div>

                  <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className={`h-6 w-6 ${i < 5 ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6">Based on 1,248 reviews</p>

                  <div className="flex justify-center">
                    <Button className="gap-2">
                      <BarChart size={16} />
                      Write a Review
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* Some mock reviews */}
                {[
                  {
                    name: "Sarah Johnson",
                    date: "2 months ago",
                    rating: 5,
                    comment: "This library has been a game-changer for our team. The documentation is excellent and it's incredibly performant even with large applications.",
                  },
                  {
                    name: "Michael Chen",
                    date: "4 months ago",
                    rating: 4,
                    comment: "Really solid library that handles most of our use cases perfectly. The only reason for 4 stars instead of 5 is that some edge cases require workarounds.",
                  },
                  {
                    name: "Emma Rodriguez",
                    date: "6 months ago",
                    rating: 5,
                    comment: "I've tried several alternatives and this is by far the best option for our project. The community support is fantastic and issues get resolved quickly.",
                  }
                ].map((review, index) => (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="font-medium">{review.name}</div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>

                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                          ))}
                        </div>
                      </div>

                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}

                <div className="text-center">
                  <Button variant="outline">
                    Load More Reviews
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.section>
      </div>
    </div>
  );
};

// Helper functions for alternative libraries
const getAlternativeDescription = (name: string) => {
  const descriptions: { [key: string]: string } = {
    "Vue.js": "Progressive JavaScript framework focused on building UIs with an incrementally adoptable architecture.",
    "Angular": "Platform and framework for building single-page client applications using HTML and TypeScript.",
    "Svelte": "Radical new approach to building user interfaces that shifts work from runtime to compile time.",
    "Preact": "Fast 3kB alternative to React with the same modern API, offering the thinnest possible Virtual DOM abstraction.",
    "Redux Toolkit": "Official, opinionated, batteries-included toolset for efficient Redux development.",
    "MobX": "Simple, scalable state management through transparent functional reactive programming.",
    "Recoil": "Experimental state management library for React apps focusing on data-flow graph.",
    "jQuery": "Fast, small, and feature-rich JavaScript library for HTML document traversal and manipulation.",
  };

  return descriptions[name] || "An alternative framework or library with similar functionality.";
};

const getAlternativeId = (name: string): string => {
  if (name === "Vue.js") return "2";
  return (Math.floor(Math.random() * 10) + 3).toString();
};

const getScore = (name: string, category: string): number => {
  // Mock scores for alternative comparison
  const scores: { [key: string]: { [key: string]: number } } = {
    "Vue.js": {
      performance: 90,
      popularity: 85,
      ease: 92
    },
    "Angular": {
      performance: 78,
      popularity: 82,
      ease: 70
    },
    "Svelte": {
      performance: 95,
      popularity: 70,
      ease: 88
    },
    "Preact": {
      performance: 98,
      popularity: 65,
      ease: 80
    }
  };

  return scores[name]?.[category] || Math.floor(Math.random() * 20) + 75;
};

export default LibraryDetail;
