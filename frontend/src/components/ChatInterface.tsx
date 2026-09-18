import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage, createMessageId } from '@/lib/loanEngine';
import { Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const username = localStorage.getItem('username') || 'Guest User';

  useEffect(() => {
    // Load history when component mounts
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          const historyMessages: ChatMessage[] = data.map((msg: any) => ({
            id: createMessageId(),
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            type: msg.messageType,
            fileName: msg.fileName
          }));
          setMessages(historyMessages);
        } else {
          // Default welcome message for new users
          setMessages([{
            id: 'welcome',
            role: 'bot',
            content: `👋 Welcome ${username}!\n\nI'm your intelligent loan advisor. I can calculate your loan eligibility in real-time or answer any banking policy questions.\n\nTo start a secure eligibility check:\n1. Download your Offline eKYC ZIP from the UIDAI portal.\n2. Note your 4-digit Share Code.\n3. Extract the ZIP file.\n4. Upload the **.xml** document below.`,
            timestamp: new Date(),
            type: 'text',
          }]);
        }
      } catch (e) {
        console.error("Failed to load history:", e);
      } finally {
        setIsInitializing(false);
      }
    };
    
    loadHistory();
  }, [username]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch(`/api/ask?question=${encodeURIComponent(text)}&username=${encodeURIComponent(username)}`);
      const data = await res.text();

      setMessages(prev => [
        ...prev,
        { id: createMessageId(), role: 'bot', content: data, timestamp: new Date(), type: 'text' },
      ]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        { id: createMessageId(), role: 'bot', content: "Connection to VHF secure servers failed.", timestamp: new Date(), type: 'text' },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [username]);

  const handleFileUpload = useCallback(async (file: File) => {
    setMessages(prev => [
      ...prev,
      {
        id: createMessageId(),
        role: 'user',
        content: `Uploading secure document: ${file.name}`,
        timestamp: new Date(),
        type: 'file',
        fileName: file.name,
      },
    ]);

    setIsTyping(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('password', 'dummy_password');

    try {
      const res = await fetch(`/api/verifyKyc?username=${encodeURIComponent(username)}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.text();

      setMessages(prev => [
        ...prev,
        { id: createMessageId(), role: 'bot', content: data, timestamp: new Date(), type: 'text' },
      ]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        { id: createMessageId(), role: 'bot', content: "KYC Verification failed due to a network error.", timestamp: new Date(), type: 'text' },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [username]);

  if (isInitializing) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 md:px-10 py-6 border-b border-white/5 bg-background/40 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center glow-sm">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-['Outfit'] text-foreground tracking-tight">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Secure connection established</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success uppercase tracking-wider">System Online</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-0 py-8 relative">
        <div className="max-w-4xl mx-auto flex flex-col justify-end min-h-full">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <ChatMessageComponent key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6"
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input area */}
      <div className="w-full bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4 md:px-8 z-10 relative mt-auto">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            disabled={isTyping}
            placeholder="Ask a question or upload Aadhaar XML to begin..."
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
