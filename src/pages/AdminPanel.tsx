import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRequireAdmin } from "../hooks/useAuth";
import * as libraryService from "../services/libraryService";
import {
  PlusCircle, Search, Edit, Trash2, AlertCircle, Package,
  ChevronLeft, ChevronRight, Filter, Users, FileText, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useToast } from "@/hooks/use-toast";

const categories = [
  "Frontend Framework", "Backend Framework", "Database", "State Management",
  "UI Components", "CSS Framework", "Testing", "Framework", "Authentication", "Data Fetching"
];
const licenses = ["MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "ISC"];

type Library  = {
  name: string;
  description: string;
  longDescription: string;
  logo: string;
  category: string;
  version: string;
  license: string;
  cost: string;
  website: string;
  github: string;
  npm: string;
  firstRelease: string;
  lastUpdate: string;
  weeklyDownloads: number;
  contributors: number;
  usedBy: string[];
  dependencies: string[];
  supportedOS: string[];
  bundle: {
    size: string;
    gzipped: string;
  };
  performance: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
  };
  issues: {
    open: number;
    closed: number;
  };
  securityIssues: number;
  testCoverage: number;
  alternatives: string[];
  codeMaintainability: number;
  typeSupport: string;
  documentation: number;
  communitySupport: number;
  popularity: {
    stars: number;
    downloads: number;
  };
  usageExample: string;
  featured?: boolean;
};



const AdminPanel = () => {
  const { isLoading } = useRequireAdmin();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLibrary, setCurrentLibrary] = useState<Partial<Library> | null>(null);

  const itemsPerPage = 8;

  const handleJSONUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        toast({
          title: "Invalid Format",
          description: "JSON must be an array of library objects.",
          variant: "destructive",
        });
        return;
      }

      const token = localStorage.getItem("libhunt-token");

      const response = await fetch("http://localhost:5002/api/libraries/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(json),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unknown error");
      }

      toast({
        title: "Upload Successful",
        description: data.message,

      });

    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Could not process the file.",
        variant: "destructive",
      });
    }
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await libraryService.fetchAllLibraries();
        setLibraries(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load libraries.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...libraries];
    if (searchQuery) {
      result = result.filter(lib =>
        lib.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lib.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter !== "All") {
      result = result.filter(lib => lib.category === categoryFilter);
    }
    setFilteredLibraries(result);
    setCurrentPage(1);
  }, [libraries, searchQuery, categoryFilter]);

  const paginatedLibraries = filteredLibraries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentLibrary({
      name: "",
      description: "",
      longDescription: "",
      logo: "",
      category: "",
      version: "",
      license: "MIT",
      cost: "Free",
      website: "",
      github: "",
      npm: "",
      firstRelease: "",
      lastUpdate: "",
      weeklyDownloads: 0,
      contributors: 0,
      usedBy: [],
      dependencies: [],
      supportedOS: [],
      bundle: { size: "", gzipped: "" },
      performance: { loadTime: 0, renderTime: 0, memoryUsage: 0 },
      issues: { open: 0, closed: 0 },
      securityIssues: 0,
      testCoverage: 0,
      alternatives: [],
      codeMaintainability: 0,
      typeSupport: "",
      documentation: 0,
      communitySupport: 0,
      popularity: { stars: 0, downloads: 0 },
      usageExample: "",
      featured: false,
    });    
    setDialogOpen(true);
  };

  const handleEdit = (library: Library) => {
    setIsEditing(true);
    setCurrentLibrary(library);
    setDialogOpen(true);
  };

  const handleDelete = (library: Library) => {
    setCurrentLibrary(library);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentLibrary?._id) return;
    try {
      await libraryService.deleteLibrary(currentLibrary._id);
      setLibraries(prev => prev.filter(lib => lib._id !== currentLibrary._id));
      toast({ title: "Deleted", description: "Library deleted successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to delete library.", variant: "destructive" });
    }
    setDeleteDialogOpen(false);
  };

  const saveLibrary = async () => {
    if (!currentLibrary?.name || !currentLibrary?.category || !currentLibrary?.description) {
      toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    try {
      if (isEditing && currentLibrary._id) {
        const updated = await libraryService.updateLibrary(currentLibrary._id, currentLibrary);
        setLibraries(prev => prev.map(lib => lib._id === updated._id ? updated : lib));
        toast({ title: "Updated", description: "Library updated successfully." });
      } else {
        const created = await libraryService.createLibrary(currentLibrary);
        setLibraries(prev => [...prev, created]);
        toast({ title: "Created", description: "Library created successfully." });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to save library.", variant: "destructive" });
    }
  };

  const stats = {
    total: libraries.length,
    frontend: libraries.filter(lib => lib.category === "Frontend Framework").length,
    backend: libraries.filter(lib => lib.category === "Backend Framework").length,
    recentlyUpdated: libraries.filter(lib => lib.lastUpdate?.includes("month")).length,
  };

  if (isLoading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage libraries, users, and settings</p>
      </motion.div>

      <Tabs defaultValue="libraries">
        <TabsList className="mb-6">
          <TabsTrigger value="libraries"><Package size={16} /> Libraries</TabsTrigger>
          <TabsTrigger value="users"><Users size={16} /> Users</TabsTrigger>
          <TabsTrigger value="logs"><FileText size={16} /> Logs</TabsTrigger>
          <TabsTrigger value="settings"><Settings size={16} /> Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="libraries">
          {/* Dashboard stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card><CardHeader><CardDescription>Total</CardDescription><CardTitle>{stats.total}</CardTitle></CardHeader></Card>
            <Card><CardHeader><CardDescription>Frontend</CardDescription><CardTitle>{stats.frontend}</CardTitle></CardHeader></Card>
            <Card><CardHeader><CardDescription>Backend</CardDescription><CardTitle>{stats.backend}</CardTitle></CardHeader></Card>
            <Card><CardHeader><CardDescription>Recently Updated</CardDescription><CardTitle>{stats.recentlyUpdated}</CardTitle></CardHeader></Card>
          </div>

          <Card>
            <CardHeader className="flex justify-between items-center gap-4">
              <div>
                <CardTitle>Library Management</CardTitle>
                <CardDescription>Manage libraries stored in MongoDB</CardDescription>
              </div>
              <Button onClick={handleAddNew}><PlusCircle size={16} /> Add</Button>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger><SelectValue placeholder="Filter by Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLibraries.map(lib => (
                    <TableRow key={lib._id}>
                      <TableCell>{lib.name}</TableCell>
                      <TableCell>{lib.category}</TableCell>
                      <TableCell>{lib.version}</TableCell>
                      <TableCell>{lib.license}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(lib)}><Edit size={16} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lib)}><Trash2 size={16} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredLibraries.length)} of {filteredLibraries.length}
                </span>
                <div className="flex gap-2">
                  <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft /></Button>
                  <Button disabled={currentPage === Math.ceil(filteredLibraries.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
    <DialogTitle>{isEditing ? "Edit Library" : "Add Library"}</DialogTitle>
    <DialogDescription>Fill in all the required details</DialogDescription>
  </DialogHeader>

          <div className="space-y-4">
            {/* Basic Fields */}
            <Input placeholder="Library Name" value={currentLibrary?.name || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, name: e.target.value }))} />
            <Textarea placeholder="Short Description" value={currentLibrary?.description || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, description: e.target.value }))} />
            <Textarea placeholder="Long Description" value={currentLibrary?.longDescription || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, longDescription: e.target.value }))} />
            <Input placeholder="Logo URL" value={currentLibrary?.logo || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, logo: e.target.value }))} />
            <Input placeholder="Category" value={currentLibrary?.category || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, category: e.target.value }))} />
            <Input placeholder="Version" value={currentLibrary?.version || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, version: e.target.value }))} />

            {/* Licensing & Links */}
            <Select value={currentLibrary?.license || "MIT"} onValueChange={(value) => setCurrentLibrary(prev => ({ ...prev!, license: value }))}>
              <SelectTrigger><SelectValue placeholder="Select license" /></SelectTrigger>
              <SelectContent>{licenses.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Cost (e.g. Free, Paid)" value={currentLibrary?.cost || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, cost: e.target.value }))} />
            <Input placeholder="Website URL" value={currentLibrary?.website || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, website: e.target.value }))} />
            <Input placeholder="GitHub URL" value={currentLibrary?.github || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, github: e.target.value }))} />
            <Input placeholder="NPM URL" value={currentLibrary?.npm || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, npm: e.target.value }))} />

            {/* Arrays */}
            <Input placeholder="Supported OS (comma-separated)" value={(currentLibrary?.supportedOS || []).join(", ")} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, supportedOS: e.target.value.split(",").map(s => s.trim()) }))} />
            <Input placeholder="Dependencies (comma-separated)" value={(currentLibrary?.dependencies || []).join(", ")} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, dependencies: e.target.value.split(",").map(s => s.trim()) }))} />
            <Input placeholder="Used By (comma-separated)" value={(currentLibrary?.usedBy || []).join(", ")} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, usedBy: e.target.value.split(",").map(s => s.trim()) }))} />
            <Input placeholder="Alternatives (comma-separated)" value={(currentLibrary?.alternatives || []).join(", ")} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, alternatives: e.target.value.split(",").map(s => s.trim()) }))} />

            {/* Popularity */}
            <div className="grid grid-cols-2 gap-4">
              <Input type="number" placeholder="GitHub Stars" value={currentLibrary?.stars || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, stars: parseInt(e.target.value) || 0 }))} />
              <Input type="number" placeholder="Downloads" value={currentLibrary?.weeklyDownloads || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, weeklyDownloads: parseInt(e.target.value) || 0 }))} />
            </div>

            {/* Contributors & Dates */}
            <Input type="number" placeholder="Contributors" value={currentLibrary?.contributors || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, contributors: parseInt(e.target.value) || 0 }))} />
            <Input placeholder="First Release (e.g. 2022-01-01)" value={currentLibrary?.firstRelease || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, firstRelease: e.target.value }))} />
            <Input placeholder="Last Update (e.g. 2 weeks ago)" value={currentLibrary?.lastUpdate || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, lastUpdate: e.target.value }))} />

            {/* Bundle */}
            <Input placeholder="Bundle Size (e.g. 120KB)" value={currentLibrary?.bundle?.size || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, bundle: { ...(prev?.bundle || {}), size: e.target.value } }))} />
            <Input placeholder="Bundle Gzipped (e.g. 40KB)" value={currentLibrary?.bundle?.gzipped || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, bundle: { ...(prev?.bundle || {}), gzipped: e.target.value } }))} />

            {/* Performance */}
            <div className="grid grid-cols-3 gap-4">
              <Input type="number" placeholder="Load Time (ms)" value={currentLibrary?.performance?.loadTime || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, performance: { ...(prev?.performance || {}), loadTime: parseInt(e.target.value) || 0 } }))} />
              <Input type="number" placeholder="Render Time (ms)" value={currentLibrary?.performance?.renderTime || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, performance: { ...(prev?.performance || {}), renderTime: parseInt(e.target.value) || 0 } }))} />
              <Input type="number" placeholder="Memory Usage (MB)" value={currentLibrary?.performance?.memoryUsage || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, performance: { ...(prev?.performance || {}), memoryUsage: parseInt(e.target.value) || 0 } }))} />
            </div>

            {/* Issues & Security */}
            <div className="grid grid-cols-3 gap-4">
              <Input type="number" placeholder="Open Issues" value={currentLibrary?.issues?.open || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, issues: { ...(prev?.issues || {}), open: parseInt(e.target.value) || 0 } }))} />
              <Input type="number" placeholder="Closed Issues" value={currentLibrary?.issues?.closed || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, issues: { ...(prev?.issues || {}), closed: parseInt(e.target.value) || 0 } }))} />
              <Input type="number" placeholder="Security Issues" value={currentLibrary?.securityIssues || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, securityIssues: parseInt(e.target.value) || 0 }))} />
            </div>

            {/* Code Quality */}
            <Input type="number" placeholder="Test Coverage (%)" value={currentLibrary?.testCoverage || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, testCoverage: parseInt(e.target.value) || 0 }))} />
            <Input type="number" placeholder="Code Maintainability" value={currentLibrary?.codeMaintainability || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, codeMaintainability: parseInt(e.target.value) || 0 }))} />
            <Input placeholder="Type Support (e.g. Full, Partial, Unknown)" value={currentLibrary?.typeSupport || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, typeSupport: e.target.value }))} />
            <Input type="number" placeholder="Documentation Score" value={currentLibrary?.documentation || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, documentation: parseInt(e.target.value) || 0 }))} />
            <Input type="number" placeholder="Community Support Score" value={currentLibrary?.communitySupport || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, communitySupport: parseInt(e.target.value) || 0 }))} />

            {/* Usage Example */}
            <Textarea placeholder="Usage Example" value={currentLibrary?.usageExample || ""} onChange={(e) => setCurrentLibrary(prev => ({ ...prev!, usageExample: e.target.value }))} />

            {/* Featured Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="featured" checked={!!currentLibrary?.featured} onCheckedChange={(checked) => setCurrentLibrary(prev => ({ ...prev!, featured: !!checked }))} />
              <Label htmlFor="featured">Feature on Homepage</Label>
            </div>
          </div>


          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveLibrary}>{isEditing ? "Update" : "Add Library"}</Button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              className="hidden"
              onChange={handleJSONUpload}
            />

            <Button
              variant="outline"
              className="ml-2"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload JSON
            </Button>


          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Delete Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="text-sm">Are you sure you want to delete <b>{currentLibrary?.name}</b>?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
