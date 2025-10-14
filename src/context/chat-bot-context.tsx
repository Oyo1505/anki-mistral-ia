"use client";
import { ChatMessage } from "@/interfaces/chat.interface";
import { safeStorage } from "@/utils/safe-storage";
import { createContext, useContext, useEffect, useState } from "react";

export type FormDataChatBot = {
  name: string;
  type: string;
  level: string;
  isSubmitted: boolean;
  idThreadChatBot?: string;
};

type ChatBotContextType = {
  // eslint-disable-next-line no-unused-vars
  messages: ChatMessage[];
  // eslint-disable-next-line no-unused-vars
  setMessages: (messages: ChatMessage[]) => void;
  // eslint-disable-next-line no-unused-vars
  formData: FormDataChatBot;
  // eslint-disable-next-line no-unused-vars
  setFormData: (formData: FormDataChatBot) => void;
  // eslint-disable-next-line no-unused-vars
  handleSetFormData: (formData: FormDataChatBot) => void;
  // eslint-disable-next-line no-unused-vars
  handleSetMessages: (messages: ChatMessage[]) => void;
  // eslint-disable-next-line no-unused-vars
};

const ChatBotContext = createContext<ChatBotContextType>({
  messages: [],
  setMessages: () => {},
  formData: {
    name: "",
    type: "",
    level: "",
    isSubmitted: false,
    idThreadChatBot: "",
  },
  setFormData: () => {},
  handleSetFormData: () => {},
  handleSetMessages: () => {},
});

const defaultMessages: ChatMessage[] = [
  {
    role: "assistant",
    message: "Bonjour, comment puis-je vous aider ?",
    timestamp: new Date(),
    id: "welcome",
  },
];

const ChatBotContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = safeStorage.getItem<ChatMessage[]>(
      "chatBotMessagesAnki",
      defaultMessages
    );

    // Transform timestamp strings back to Date objects
    return saved.map((msg) => ({
      ...msg,
      timestamp:
        msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
    }));
  });

  const defaultFormData: FormDataChatBot = {
    name: "",
    type: "",
    level: "N1 Avancé",
    isSubmitted: false,
    idThreadChatBot: "",
  };

  const [formData, setFormData] = useState<FormDataChatBot>(defaultFormData);

  useEffect(() => {
    const savedFormData = safeStorage.getItem<FormDataChatBot>(
      "formData",
      defaultFormData
    );
    setFormData(savedFormData);
  }, []);

  useEffect(() => {
    if (formData.isSubmitted) {
      safeStorage.setItem("formData", formData);
      safeStorage.setItem("chatBotMessagesAnki", messages);
    }
  }, [formData, messages]);

  const handleSetFormData = (formData: FormDataChatBot): void => {
    setFormData((prev) => ({ ...prev, ...formData }));
    safeStorage.setItem("formData", formData);
  };
  const handleSetMessages = (messages: ChatMessage[]): void => {
    setMessages(messages);
    safeStorage.setItem("chatBotMessagesAnki", messages);
  };
  return (
    <ChatBotContext.Provider
      value={{
        messages,
        setMessages,
        formData,
        setFormData,
        handleSetFormData,
        handleSetMessages,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};

export default ChatBotContextProvider;

export const useChatBotContext = (): ChatBotContextType =>
  useContext(ChatBotContext);
