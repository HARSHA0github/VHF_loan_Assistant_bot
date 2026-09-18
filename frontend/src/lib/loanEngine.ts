// Core types for the loan assistant chat interface.

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'file' | 'result';
  fileName?: string;
}

// Create a unique message ID
export function createMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
