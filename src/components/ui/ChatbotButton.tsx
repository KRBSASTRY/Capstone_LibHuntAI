
import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ChatbotDialog from "./ChatbotDialog";
import { motion, AnimatePresence } from "framer-motion";

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleChatbot = () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatbotDialog onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChatbot}
          className={`rounded-full w-14 h-14 shadow-lg ${
            isOpen ? "bg-card hover:bg-card/90" : "bg-accent hover:bg-accent/90"
          } p-0 flex items-center justify-center`}
          aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
          </motion.div>
        </Button>
      </motion.div>
    </>
  );
};

export default ChatbotButton;
