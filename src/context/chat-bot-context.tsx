'use client'
import { ChatMessage } from "@/interfaces/chat.interface";
import { createContext, useContext, useEffect, useState } from "react";

export type FormDataChatBot = {
  name: string;
  type: string;
  level: string;
  isSubmitted: boolean;
  idThreadChatBot?: string;
}

type ChatBotContextType = {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  formData: FormDataChatBot;
  setFormData: (formData: FormDataChatBot) => void;
  handleSetFormData: (formData: FormDataChatBot) => void;
  handleSetMessages: (messages: ChatMessage[]) => void;
}

 const ChatBotContext = createContext<ChatBotContextType>({
  messages: [],
  setMessages: () => {},
  formData: {
    name: '',
    type: '',
    level: '',
    isSubmitted: false,
    idThreadChatBot: '',
  },
  setFormData: () => {},
  handleSetFormData: () => {},
  handleSetMessages: () => {},
});

const ChatBotContextProvider = ({ children }: { children: React.ReactNode }) => {
 
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatBotMessagesAnki');
      if (saved) {
        return JSON.parse(saved).map((msg: ChatMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    }
    return [
      {
        role: 'assistant',
        message: 'Bonjour, comment puis-je vous aider ?',
        timestamp: new Date(),
        id: 'welcome',
      }
    ];
  });

  const [formData, setFormData] = useState<FormDataChatBot>({
    name: '',
    type: '',
    level: '',
    isSubmitted: false,
    idThreadChatBot: '',
  });

  useEffect(() => {
    const formDataFromLocalStorage = localStorage.getItem('formData');
    if (formDataFromLocalStorage) {
      setFormData(JSON.parse(formDataFromLocalStorage));
    }
  }, []);

  useEffect(() => {
    if (formData.isSubmitted) {
      localStorage.setItem('formData', JSON.stringify(formData));
      localStorage.setItem('chatBotMessagesAnki', JSON.stringify(messages));
    }
  }, [formData.isSubmitted]);

  const handleSetFormData = (formData: FormDataChatBot): void => {
    setFormData(prev => ({...prev, ...formData}));
    localStorage.setItem('formData', JSON.stringify(formData));
  }
  const handleSetMessages = (messages: ChatMessage[]): void => {
    setMessages(messages);
    localStorage.setItem('chatBotMessagesAnki', JSON.stringify(messages));
  }
  return (
    <ChatBotContext.Provider value={{ messages, setMessages, formData, setFormData, handleSetFormData, handleSetMessages }}>
      {children}
    </ChatBotContext.Provider>
  );
};

export default ChatBotContextProvider;

export const useChatBotContext = () : ChatBotContextType => useContext(ChatBotContext);