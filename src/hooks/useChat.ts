import { useState, useCallback } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
    return message.id;
  }, []);

  const updateMessage = useCallback((id: string, content: string) => {
    setMessages(prev => 
      prev.map(msg => msg.id === id ? { ...msg, content } : msg)
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    messages,
    isLoading,
    addMessage,
    updateMessage,
    clearMessages,
    setLoading,
  };
};