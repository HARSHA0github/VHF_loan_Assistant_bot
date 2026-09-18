import React from 'react';
import { ChatMessage as ChatMessageType } from '@/lib/loanEngine';
import { FileText, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: ChatMessageType;
}

// Render markdown-like bold text
function renderContent(content: string) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-primary drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]">{part.slice(2, -2)}</strong>;
    }
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((cp, j) => {
      if (cp.startsWith('`') && cp.endsWith('`')) {
        return <code key={`${i}-${j}`} className="bg-black/30 border border-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-primary/90">{cp.slice(1, -1)}</code>;
      }
      return <span key={`${i}-${j}`}>{cp}</span>;
    });
  });
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`flex items-end gap-3 px-4 md:px-0 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
          isUser ? 'bg-secondary border border-white/5' : 'gradient-primary border border-primary/30 glow-sm'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-primary-foreground" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-xl ${
          isUser
            ? 'bg-chat-user rounded-br-sm border border-white/5'
            : 'bg-card rounded-bl-sm border border-primary/20 before:absolute before:inset-0 before:bg-primary/5 before:rounded-2xl before:pointer-events-none overflow-hidden'
        }`}
      >
        {/* Subtle background glow for AI messages */}
        {!isUser && (
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 opacity-30 pointer-events-none" />
        )}

        {/* File attachment indicator */}
        {message.type === 'file' && message.fileName && (
          <div className="flex items-center gap-3 mb-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-medium text-foreground truncate">{message.fileName}</span>
               <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Aadhaar XML Document</span>
            </div>
          </div>
        )}

        {/* Message content */}
        <div className={`text-[15px] leading-relaxed whitespace-pre-wrap relative z-10 ${isUser ? 'text-foreground/90' : 'text-foreground font-light'}`}>
          {message.content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {renderContent(line)}
            </React.Fragment>
          ))}
        </div>

        {/* Timestamp */}
        <div className={`text-[10px] mt-3 font-mono tracking-wider ${isUser ? 'text-right text-muted-foreground/40' : 'text-primary/40'} relative z-10`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessageComponent;
