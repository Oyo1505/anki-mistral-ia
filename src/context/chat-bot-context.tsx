"use client";
import { ChatMessage } from "@/interfaces/chat.interface";
import { safeStorage } from "@/utils/safe-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Limite maximale de messages en mémoire et localStorage
const MAX_MESSAGES_IN_MEMORY = 50;

/**
 * Limite le tableau de messages aux N derniers messages
 * @param messages - Tableau de messages à limiter
 * @param maxMessages - Nombre maximum de messages à conserver (défaut: 50)
 * @returns Tableau limité aux derniers messages
 */
const limitMessages = (
  messages: ChatMessage[],
  maxMessages: number = MAX_MESSAGES_IN_MEMORY
): ChatMessage[] => {
  if (messages.length <= maxMessages) {
    return messages;
  }
  return messages.slice(-maxMessages);
};

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
  setAllMessages: (messages: ChatMessage[]) => void;
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
  setAllMessages: () => {},
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
  const [allMessages, setAllMessages] = useState<ChatMessage[]>(() => {
    const saved = safeStorage.getItem<ChatMessage[]>(
      "chatBotMessagesAnki",
      defaultMessages
    );

    // Transform timestamp strings back to Date objects
    const messagesWithDates = saved.map((msg) => ({
      ...msg,
      timestamp:
        msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
    }));

    //Immediately limit to 50 messages on initial load
    return limitMessages(messagesWithDates);
  });

  // Messages limités exposés dans le contexte
  const messages = useMemo(() => limitMessages(allMessages), [allMessages]);

  const defaultFormData: FormDataChatBot = useMemo(
    () => ({
      name: "",
      type: "",
      level: "N1 Avancé",
      isSubmitted: false,
      idThreadChatBot: "",
    }),
    []
  );

  const [formData, setFormData] = useState<FormDataChatBot>(defaultFormData);

  useEffect(() => {
    const savedFormData = safeStorage.getItem<FormDataChatBot>(
      "formData",
      defaultFormData
    );
    setFormData(savedFormData);
  }, [defaultFormData]);

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
    const limitedMessages = limitMessages(messages);
    setAllMessages(limitedMessages);
    safeStorage.setItem("chatBotMessagesAnki", limitedMessages);
  };
  const contextValue = useMemo(
    () => ({
      formData,
      messages,
      setFormData,
      setAllMessages,
      handleSetFormData,
      handleSetMessages,
    }),
    [
      formData,
      messages,
      setFormData,
      setAllMessages,
      handleSetFormData,
      handleSetMessages,
    ]
  );
  return (
    <ChatBotContext.Provider value={contextValue}>
      {children}
    </ChatBotContext.Provider>
  );
};

export default ChatBotContextProvider;

export const useChatBotContext = (): ChatBotContextType =>
  useContext(ChatBotContext);
