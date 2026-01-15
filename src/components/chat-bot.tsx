"use client";
import { threadChatBot } from "@/actions/chat-bot.action";
import { useChatBotContext } from "@/context/chat-bot-context";
import { ChatMessage } from "@/interfaces/chat.interface";
import { logError } from "@/lib/logError";
import {
  LOADING_MESSAGE_DELAY,
  LOADING_MESSAGE_DELAY_2,
  LOADING_MESSAGE_DELAY_3,
} from "@/shared/constants/numbers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextArea from "./text-area";

// Hoisted static SVG element (rendering-hoist-jsx)
const arrowDownIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-10"
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
      clipRule="evenodd"
    />
  </svg>
);

// Lazy-loaded sanitizer for markdown (bundle-dynamic-imports)
const sanitizeMarkdown = async (content: string): Promise<string> => {
  const [DOMPurify, { marked }] = await Promise.all([
    import("dompurify"),
    import("marked"),
  ]);
  return DOMPurify.default.sanitize(
    marked.parseInline(typeof content === "string" ? content : "") as string,
    {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "code", "pre", "ul", "ol", "li"],
      ALLOWED_ATTR: ["class"],
    }
  );
};

// Message item component with lazy-loaded sanitization
const MessageItem = ({
  role,
  message,
}: {
  role: string;
  message: string | unknown;
}) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const content = typeof message === "string" ? message : "";
    sanitizeMarkdown(content).then((html) => {
      if (isMounted) {
        setSanitizedHtml(html);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [message]);

  return (
    <div
      className={`chat-message-item ${
        role === "user"
          ? "bg-slate-800 text-white self-end"
          : "bg-slate-200 text-slate-800 text-left"
      } p-2 h-auto rounded-md max-w-[80%]`}
    >
      <div className="text-base whitespace-pre-wrap">
        <div
          className="h-auto"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    </div>
  );
};

const ChatBot = () => {
  const { messages, formData, handleSetFormData, handleSetMessages } =
    useChatBotContext();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      message: "",
    },
  });

  // Memoized scroll function (rerender-functional-setstate)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fixed useEffect dependencies (rerender-dependencies)
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  // Memoized loading message handler with cleanup (rerender-functional-setstate)
  const handleLoadingMessage = useCallback((): void => {
    // Clear previous timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    timeoutRefs.current.push(
      setTimeout(
        () => setLoadingMessage("Connexion à l'IA..."),
        LOADING_MESSAGE_DELAY
      )
    );
    timeoutRefs.current.push(
      setTimeout(
        () => setLoadingMessage("Génération de la réponse..."),
        LOADING_MESSAGE_DELAY_2
      )
    );
    timeoutRefs.current.push(
      setTimeout(
        () => setLoadingMessage("Finalisation..."),
        LOADING_MESSAGE_DELAY_3
      )
    );
  }, []);

  // Memoized send message handler (rerender-functional-setstate)
  const handleSendMessage = useCallback(
    async (data: { message: string }) => {
      if (data.message !== "" && !isLoading) {
        try {
          setIsLoading(true);
          setLoadingMessage("Envoi du message...");

          const userMessage: ChatMessage = {
            role: "user",
            message: data.message,
            timestamp: new Date(),
          };
          const updatedMessages = [...messages, userMessage];
          handleSetMessages(updatedMessages);
          setValue("message", "");

          handleLoadingMessage();

          const response = await threadChatBot({
            message: data.message.trim(),
            conversationHistory: messages,
            typeExercice: formData.type,
            level: formData.level,
            name: formData.name,
          });

          if (response.role === "assistant") {
            handleSetMessages([...updatedMessages, response]);
          } else {
            const errorMessage: ChatMessage = {
              role: "assistant",
              message:
                "Une erreur est survenue lors de la récupération de la réponse.",
              timestamp: new Date(),
            };
            handleSetMessages([...updatedMessages, errorMessage]);
          }
        } catch (error) {
          logError(error, "handleSendMessage");
          const errorMessage: ChatMessage = {
            role: "assistant",
            message:
              "Une erreur inattendue s'est produite. Veuillez réessayer.",
            timestamp: new Date(),
          };
          handleSetMessages([...messages, errorMessage]);
        } finally {
          setIsLoading(false);
          setLoadingMessage("");
          // Clear loading timeouts
          timeoutRefs.current.forEach(clearTimeout);
          timeoutRefs.current = [];
        }
      }
    },
    [
      isLoading,
      messages,
      formData.type,
      formData.level,
      formData.name,
      handleSetMessages,
      handleLoadingMessage,
      setValue,
    ]
  );

  // Memoized key handler (rerender-functional-setstate)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.shiftKey && !isLoading) {
        e.preventDefault();
        setValue("message", e.currentTarget.value + "\n");
      }

      if (e.key === "Enter" && !e.shiftKey && !isLoading) {
        e.preventDefault();
        const userMessage = e.currentTarget.value;
        if (userMessage.trim()) {
          handleSendMessage({ message: userMessage });
          e.currentTarget.value = "";
        }
      }
    },
    [isLoading, setValue, handleSendMessage]
  );

  // Use explicit ternary instead of && (rendering-conditional-render)
  return formData.isSubmitted ? (
    <div className="w-full min-h-1/2 h-4/5 flex flex-col items-start justify-start gap-4">
      <div className="w-full flex items-center justify-between">
        <button
          aria-label="Retour au formulaire de configuration"
          className="cursor-pointer text-center font-semibold text-slate-800 bg-white p-2 rounded-md border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-300 ease-in-out"
          onClick={() =>
            handleSetFormData({ ...formData, isSubmitted: false })
          }
        >
          Précédent
        </button>
        <button
          aria-label="relancer la discussion"
          onClick={() =>
            handleSetMessages([
              {
                role: "assistant",
                message: "Bonjour, comment puis-je vous aider ?",
                timestamp: new Date(),
                id: "welcome",
              },
            ])
          }
          disabled={isLoading}
          className="cursor-pointer text-center font-semibold text-slate-800 bg-white p-2 rounded-md border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Relancer la discussion
        </button>
      </div>
      <div className="w-full h-full flex flex-col items-start justify-start relative">
        <button
          className="absolute bottom-50 right-3 text-black"
          onClick={scrollToBottom}
          aria-label="Défiler vers le bas"
        >
          {arrowDownIcon}
        </button>
        <div className="w-full h-full flex flex-col items-start justify-start gap-4 bg-slate-100 p-4 rounded-t-md overflow-y-auto">
          {messages.map(({ role, message }, index) => (
            <MessageItem key={index} role={role} message={message} />
          ))}

          {isLoading ? (
            <div className="bg-slate-200 text-slate-800 p-2 rounded-md max-w-[80%]">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                <span className="text-sm">{loadingMessage}</span>
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSubmit(handleSendMessage)}
          className="w-full h-auto rounded-b-md flex flex-col items-start justify-start gap-4 bg-slate-100 p-4"
        >
          <TextArea
            label=""
            errors={errors}
            id="message"
            {...register("message", { required: true })}
            className="w-full h-auto p-2 border-slate-800 outline-none focus:border-slate-500 resize-none"
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            disabled={isLoading || isSubmitting}
            type="submit"
            className="w-full p-2 rounded-md text-white font-bold bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-900 transition-colors"
          >
            {isLoading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

export default ChatBot;
