
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Phone, MapPin, FileText, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
                About <span className="text-gradient">LibHunt AI</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                LibHunt AI is a cutting-edge platform designed to help developers discover, evaluate, and compare software libraries and frameworks with the power of artificial intelligence.
              </p>
              <p className="text-muted-foreground mb-8">
                Our mission is to simplify the process of finding the right tools for your projects, saving you time and effort while ensuring you make informed decisions about the technologies you adopt.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/register">
                    Get Started
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#contact">Contact Us</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-2xl glass p-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5"></div>
                </div>
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-6">
                    <span className="text-5xl font-bold text-accent">L</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">LibHunt AI</h3>
                  <p className="text-muted-foreground">AI-Powered Library Discovery</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're building the most intelligent library discovery platform for developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Simplify Discovery",
                description: "Finding the right libraries shouldn't be a time-consuming process. We use AI to match your requirements with the perfect libraries."
              },
              {
                title: "Empower Decisions",
                description: "Make informed decisions with comprehensive library comparisons, detailed metrics, and real user reviews."
              },
              {
                title: "Accelerate Development",
                description: "Get started quickly with example code, implementation guides, and best practices for each library."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="text-xl font-display font-medium mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Profile Section */}
      <section className="py-20 px-6" id="developer">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Meet the Developer</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The mind behind LibHunt AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:col-span-1 flex flex-col items-center"
            >
              <div className="w-48 h-48 rounded-full glass-card mb-6 overflow-hidden border-2 border-accent/20 p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <span className="text-4xl font-bold text-accent">RK</span>
                </div>
              </div>

              <h3 className="text-2xl font-display font-bold mb-1">Rama Bhadra Sastry Kolluri</h3>
              <p className="text-muted-foreground mb-4">Full Stack Developer</p>

              <div className="flex gap-3 mb-6">
                <a
                  href="https://github.com/KRBSASTRY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/rama-bhadra-sastry-kolluri-0150932ab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="mailto:rbsastryk@gmail.com"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
                <a
                  href="tel:+16674331296"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="Phone"
                >
                  <Phone size={18} />
                </a>
              </div>

              <Button variant="outline" className="gap-2">
                <Download size={16} />
                <a
                  href="/public/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Resume
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-medium mb-4">About Me</h3>
                  <p className="text-muted-foreground mb-4">
                    I'm a full-stack developer passionate about creating intuitive and efficient software solutions. With expertise in modern web technologies, I specialize in building applications that combine powerful functionality with exceptional user experiences.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    LibHunt AI represents my vision for simplifying the development process by helping developers find the perfect tools for their projects. By leveraging artificial intelligence and comprehensive library analysis, I aim to save developers time and improve their project outcomes.
                  </p>

                  <h3 className="text-xl font-display font-medium mb-4">Skills & Expertise</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {[
                      "React", "Node.js", "MongoDB",
                      "TypeScript", "Next.js", "Express",
                      "Tailwind CSS", "GraphQL", "AWS"
                    ].map((skill) => (
                      <div key={skill} className="px-3 py-2 bg-white/5 rounded-lg text-sm text-center">
                        {skill}
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-display font-medium mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-muted-foreground" />
                      <span>+1-667-433-1296</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-muted-foreground" />
                      <span>rbsastryk@gmail.com</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-muted-foreground mt-0.5" />
                      <span>28 Stonecroft Rd, Baltimore, MD 21229</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Resume</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional background and qualifications
            </p>
          </div>

          <div className="glass-card p-8 rounded-xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-display font-bold">Rama Bhadra Sastry Kolluri</h3>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText size={16} />
                <a href="/public/resume.pdf" target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>

              </Button>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-medium mb-3 flex items-center">
                  <span className="mr-2">Education</span>
                  <Separator className="flex-1" />
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <h5 className="font-medium">Master of Science in Software Engineering</h5>
                      <span className="text-muted-foreground text-sm">2021 - 2023</span>
                    </div>
                    <p className="text-muted-foreground">University of Maryland, Baltimore County</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <h5 className="font-medium">Bachelors of Mechanical Engineering</h5>
                      <span className="text-muted-foreground text-sm">2017 - 2021</span>
                    </div>
                    <p className="text-muted-foreground">Gayatri Vidya Parishad College of Engineering</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3 flex items-center">
                  <span className="mr-2">Experience</span>
                  <Separator className="flex-1" />
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <h5 className="font-medium">Full Stack Developer</h5>
                      <span className="text-muted-foreground text-sm">2023 - Present</span>
                    </div>
                    <p className="text-accent">Cognizant Technology Solutions</p>
                    <p className="text-muted-foreground mt-2">
                      Developed and maintained full-stack web applications using React, Node.js, and MongoDB. Implemented responsive designs and integrated third-party APIs.
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <h5 className="font-medium">Software Engineering Intern</h5>
                      <span className="text-muted-foreground text-sm">2022 - 2023</span>
                    </div>
                    <p className="text-accent">Cognizant Technology Solutions</p>
                    <p className="text-muted-foreground mt-2">
                      Assisted in developing data visualization tools and dashboards. Worked with a team to implement new features and fix bugs in existing applications.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3 flex items-center">
                  <span className="mr-2">Projects</span>
                  <Separator className="flex-1" />
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-1">LibHunt AI</h5>
                    <p className="text-muted-foreground">
                      AI-powered library discovery platform that helps developers find and compare software libraries.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">MERN Stack Web Application – Verizon</h5>
                    <p className="text-muted-foreground">
                      Constructed a high-availability application using MongoDB, Express.js, React.js, and
                      Node.js, supporting 1,000+ concurrent users.
                      Devised RESTful APIs, reducing data retrieval time by 30% and enhancing backend
                      performance.
                      Redesigned a responsive UI, increasing user engagement by 15%.
                      Executed automated and manual testing, reducing system bugs by 25% before
                      deployment.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Remote Area Medical App – MEAN Stack</h5>
                    <p className="text-muted-foreground">
                      Architected a healthcare platform using AngularJS, Express.js, and MongoDB,
                      serving 10,000+ users.
                      Optimized response times, cutting latency by 30%, ensuring faster application
                      performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6" id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions or suggestions? I'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl"
            >
              <h3 className="text-xl font-display font-medium mb-6">Contact Information</h3>

              <div className="space-y-6">
                <a href="mailto:rbsastryk@gmail.com" className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>rbsastryk@gmail.com</p>
                  </div>
                </a>

                <a href="tel:+16674331296" className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>+1-667-433-1296</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>28 Stonecroft Rd, Baltimore, MD 21229</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm text-muted-foreground mb-3">Connect on social media</h4>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com/KRBSASTRY"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={18} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/rama-bhadra-sastry-kolluri-0150932ab"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3087.375703053649!2d-76.70242699999999!3d39.286916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c81c82f19f86c1%3A0x3fe8c9e7d7dcb01c!2s28%20Stonecroft%20Rd%2C%20Baltimore%2C%20MD%2021229!5e0!3m2!1sen!2sus!4v1649373859281!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ minHeight: "400px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}
                allowFullScreen
                loading="lazy"
                title="Location map"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
