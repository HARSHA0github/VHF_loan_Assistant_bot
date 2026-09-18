import React, { useRef, useState } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onFileUpload,
  disabled = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
      return;
    }
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    e.target.value = '';
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Glow effect when focused */}
      <div className={`absolute -inset-1 rounded-3xl bg-primary/20 blur-md transition-opacity duration-500 ${isFocused && !disabled ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className={`relative flex flex-col bg-card/80 backdrop-blur-2xl border ${isFocused ? 'border-primary/50' : 'border-white/10'} rounded-3xl p-3 shadow-2xl transition-colors duration-300`}>
        
        {/* Selected file preview */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div 
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="flex items-center gap-3 mb-3 mx-2 bg-black/40 border border-white/5 rounded-2xl px-4 py-3"
            >
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Paperclip className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground truncate flex-1">{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-3">
          {/* File upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all disabled:opacity-40 group"
            title="Upload Aadhaar XML"
          >
            <Paperclip className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml,text/xml,application/xml"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={selectedFile ? 'File ready — press send to verify' : placeholder}
              disabled={disabled}
              rows={1}
              className="w-full resize-none bg-transparent py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-40"
            />
          </div>

          {/* Send button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={disabled || (!message.trim() && !selectedFile)}
            className="flex-shrink-0 w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center transition-opacity disabled:opacity-30 disabled:hover:scale-100 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
          >
            <Send className="w-5 h-5 text-primary-foreground ml-1" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
