
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronRight, Github, Sparkles, AreaChart, Zap, Code, Database, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 pointer-events-none"></div>
      
      {/* Accent circles */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-accent">
            <Sparkles size={16} className="mr-2" />
            <span>Find the perfect libraries with AI</span>
          </div>
        </motion.div>
        
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Discover the <span className="text-gradient">perfect libraries</span>
          <br />for your next project
        </motion.h1>
        
        <motion.p
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          LibHunt AI helps developers find and compare the best libraries and frameworks using advanced AI to match your specific requirements.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="I need a React state management library..."
              className="pl-10 h-12 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchRef}
            />
          </div>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              if (searchQuery.trim()) {
                window.location.href = "/search?q=" + encodeURIComponent(searchQuery);
              } else {
                searchRef.current?.focus();
              }
            }}
          >
            Search Libraries
          </Button>
        </motion.div>
      </div>
      
      {/* Featured libraries */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {["React", "Vue", "Angular", "Express", "Django"].map((lib, index) => (
          <div
            key={lib}
            className="flex items-center justify-center px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            {lib}
          </div>
        ))}
      </motion.div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How LibHunt AI Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our intelligent platform analyzes thousands of libraries to find the perfect match for your project requirements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="text-accent" size={24} />,
              title: "AI-Powered Search",
              description: "Our advanced AI understands your specific requirements and recommends the best libraries for your project."
            },
            {
              icon: <AreaChart className="text-accent" size={24} />,
              title: "Detailed Comparisons",
              description: "Compare libraries side by side with detailed metrics on performance, popularity, maintenance, and compatibility."
            },
            {
              icon: <Zap className="text-accent" size={24} />,
              title: "Quick Implementation",
              description: "Get example code snippets and implementation guides to start using your chosen library immediately."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-medium mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategoriesSection = () => {
  const categories = [
    { icon: <Code size={20} />, name: "Frontend Frameworks" },
    { icon: <Database size={20} />, name: "Database Solutions" },
    { icon: <Server size={20} />, name: "Backend Frameworks" },
    { icon: <BarChart size={20} />, name: "Data Visualization" },
    { icon: <TestingBeaker size={20} />, name: "Testing Tools" },
    { icon: <Lock size={20} />, name: "Authentication" },
    { icon: <Cloud size={20} />, name: "Cloud Services" },
    { icon: <Smartphone size={20} />, name: "Mobile Development" }
  ];
  
  return (
    <section className="py-20 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Explore By Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive collection of libraries organized by technology categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-card border border-white/5 rounded-xl p-6 hover:border-accent/30 hover:bg-card/80 transition-colors cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  {category.icon}
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "LibHunt AI saved me hours of research time by instantly suggesting the perfect state management library for my React project.",
      author: "Sarah Johnson",
      role: "Frontend Developer at TechCorp"
    },
    {
      quote: "The comparison feature helped our team make an informed decision when choosing between different UI libraries. Highly recommended!",
      author: "Michael Chen",
      role: "CTO at StartupX"
    },
    {
      quote: "As someone new to web development, LibHunt AI has been an invaluable resource for discovering the right tools for each project.",
      author: "Emma Rodriguez",
      role: "Freelance Developer"
    }
  ];
  
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Developers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who use LibHunt AI to find the perfect libraries
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-accent">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="mr-1">★</span>
                ))}
              </div>
              <p className="mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto glass-card rounded-2xl p-10 overflow-hidden relative">
        {/* Background gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to find your perfect libraries?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of developers who use LibHunt AI to discover the best tools for their projects.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">
                Get Started Free
                <ChevronRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Utility icons for categories section
const Server = (props: any) => (
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
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
    <line x1="6" x2="6" y1="6" y2="6" />
    <line x1="6" x2="6" y1="18" y2="18" />
  </svg>
);

const BarChart = (props: any) => (
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
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
);

const TestingBeaker = (props: any) => (
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
    <path d="M8 3v2" />
    <path d="M12 3v2" />
    <path d="M16 3v2" />
    <path d="M20 7H4" />
    <path d="M7 7v14h10V7" />
  </svg>
);

const Lock = (props: any) => (
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
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Cloud = (props: any) => (
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
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

const Smartphone = (props: any) => (
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
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

const Index = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Index;
