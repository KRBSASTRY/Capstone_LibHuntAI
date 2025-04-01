
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Menu, X, ChevronDown, LogOut,
  User, Settings, PanelLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },

    ...(isAuthenticated
      ? [
        { name: "Search", path: "/search" },
        { name: "Compare", path: "/compare" },
      ]
      : [])
    , { name: "About", path: "/about" },
  ];


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-10 transition-all duration-300 ${scrolled ? "glass shadow-md backdrop-blur-lg" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan-300 overflow-hidden">
            <span className="text-black font-bold text-xl">L</span>
          </div>
          <span className="font-display font-bold text-xl">LibHunt AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`transition-colors hover:text-accent relative ${location.pathname === item.path
                    ? "text-accent"
                    : "text-muted-foreground"
                    }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full animate-fade-in" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 relative">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.name}
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer flex items-center gap-2">
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full cursor-pointer flex items-center gap-2">
                      <PanelLeft size={16} />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer flex items-center gap-2">
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer flex items-center gap-2 text-destructive">
                  <LogOut size={16} />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center justify-center p-2 rounded-md"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 top-[73px] bg-background/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col px-6 py-8 h-full">
          <ul className="flex flex-col gap-y-6 text-lg">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block transition-colors hover:text-accent ${location.pathname === item.path
                    ? "text-accent font-medium"
                    : "text-foreground"
                    }`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-8 border-t border-white/10">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    {user?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-md transition-colors"
                      onClick={closeMenu}
                    >
                      <PanelLeft size={18} />
                      <span>Admin Panel</span>
                    </Link>
                  )}


                  <Link
                    to="/settings"
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </div>

                <Button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  variant="destructive"
                  className="w-full mt-4"
                >
                  <LogOut size={16} className="mr-2" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login" onClick={closeMenu}>
                    Log in
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/register" onClick={closeMenu}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
