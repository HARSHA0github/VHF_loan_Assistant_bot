import React from 'react';

// Typing indicator component with animated dots
const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 message-enter px-4 md:px-0">
      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary-foreground">LA</span>
      </div>
      <div className="bg-card rounded-2xl rounded-tl-sm px-5 py-4 border border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
