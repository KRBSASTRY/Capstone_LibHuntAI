
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Send, ArrowDown, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for AI responses
const mockLibraries = [
  { 
    id: "1", 
    name: "React.js", 
    description: "A JavaScript library for building user interfaces", 
    stars: 198000,
    category: "Frontend Framework"
  },
  { 
    id: "2", 
    name: "Vue.js", 
    description: "Progressive JavaScript framework for building UIs", 
    stars: 197000,
    category: "Frontend Framework"
  },
  { 
    id: "3", 
    name: "Angular", 
    description: "Platform for building mobile and desktop web applications", 
    stars: 85000,
    category: "Frontend Framework"
  },
  { 
    id: "4", 
    name: "Express.js", 
    description: "Fast, unopinionated, minimalist web framework for Node.js", 
    stars: 58000,
    category: "Backend Framework"
  },
  { 
    id: "5", 
    name: "Django", 
    description: "High-level Python Web framework that encourages rapid development", 
    stars: 66000,
    category: "Backend Framework"
  }
];

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  libraries?: typeof mockLibraries;
  isLoading?: boolean;
};

const ChatbotDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant. Ask me about software libraries and frameworks you need for your project.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev, 
      {
        id: loadingMessageId,
        content: "",
        sender: "bot",
        timestamp: new Date(),
        isLoading: true
      }
    ]);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Remove loading message and add real response
      setMessages(prev => 
        prev.filter(msg => msg.id !== loadingMessageId).concat({
          id: (Date.now() + 2).toString(),
          content: getAIResponse(input),
          sender: "bot",
          timestamp: new Date(),
          libraries: mockLibraries.slice(0, 3) // just first 3 for demo
        })
      );
    }, 1500);
  };

  const getAIResponse = (userInput: string) => {
    const lowercaseInput = userInput.toLowerCase();
    
    if (lowercaseInput.includes("frontend") || lowercaseInput.includes("ui")) {
      return "Based on your requirements, here are some frontend libraries that might be helpful:";
    }
    
    if (lowercaseInput.includes("backend") || lowercaseInput.includes("server")) {
      return "Here are some backend frameworks that would be suitable for your project:";
    }
    
    if (lowercaseInput.includes("database") || lowercaseInput.includes("storage")) {
      return "For your database needs, consider these options:";
    }
    
    return "Here are some libraries that might help with your project:";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 w-[95%] sm:w-[450px] h-[600px] bg-card rounded-2xl shadow-xl overflow-hidden flex flex-col z-50 border border-white/10"
      initial={{ y: 20, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <MessageSquare size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="font-medium">LibHunt Assistant</h3>
            <p className="text-xs text-muted-foreground">AI-powered library recommendations</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-8 w-8 rounded-full hover:bg-white/10"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === "user"
                    ? "bg-accent text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center justify-center h-8">
                    <LoaderCircle className="animate-spinner h-5 w-5" />
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Library recommendations */}
                    {message.libraries && message.libraries.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.libraries.map((lib) => (
                          <div
                            key={lib.id}
                            className="bg-black/20 rounded-lg p-3 hover:bg-black/30 transition-colors cursor-pointer"
                            onClick={() => window.location.href = `/library/${lib.id}`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-white">{lib.name}</h4>
                              <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
                                {lib.category}
                              </span>
                            </div>
                            <p className="text-sm text-white/70 mt-1">{lib.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center text-xs text-white/50">
                                <span>⭐ {lib.stars.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 text-xs bg-white/5 border-white/10 hover:bg-white/10"
                          onClick={() => window.location.href = "/search?q=" + encodeURIComponent(input)}
                        >
                          View all recommendations
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about libraries for your project..."
            className="pr-12 resize-none min-h-[60px] max-h-[120px]"
            ref={inputRef}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 bottom-2 h-8 w-8 p-0"
            size="icon"
          >
            <Send size={16} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          LibHunt AI suggests libraries based on your requirements
        </p>
      </div>
    </motion.div>
  );
};

export default ChatbotDialog;
