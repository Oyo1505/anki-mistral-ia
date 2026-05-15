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

const MessageItem = ({
  role,
  message,
}: {
  role: string;
  message: string | unknown;
}) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string>("");
  const isUser = role === "user";

  useEffect(() => {
    let isMounted = true;
    const content = typeof message === "string" ? message : "";
    sanitizeMarkdown(content).then((html) => {
      if (isMounted) setSanitizedHtml(html);
    });
    return () => { isMounted = false; };
  }, [message]);

  return (
    <div
      className="chat-message-item"
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "78%",
        background: isUser ? "var(--sumi-900)" : "var(--washi-200)",
        color: isUser ? "var(--washi-50)" : "var(--fg-1)",
        padding: "10px 14px",
        borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
        fontSize: "var(--fs-sm)",
        lineHeight: "var(--lh-base)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
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
  } = useForm({ defaultValues: { message: "" } });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    return () => { timeoutRefs.current.forEach(clearTimeout); };
  }, []);

  const handleLoadingMessage = useCallback((): void => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    timeoutRefs.current.push(
      setTimeout(() => setLoadingMessage("Connexion à l'IA…"), LOADING_MESSAGE_DELAY)
    );
    timeoutRefs.current.push(
      setTimeout(() => setLoadingMessage("Génération de la réponse…"), LOADING_MESSAGE_DELAY_2)
    );
    timeoutRefs.current.push(
      setTimeout(() => setLoadingMessage("Finalisation…"), LOADING_MESSAGE_DELAY_3)
    );
  }, []);

  const handleSendMessage = useCallback(
    async (data: { message: string }) => {
      if (data.message !== "" && !isLoading) {
        try {
          setIsLoading(true);
          setLoadingMessage("Envoi du message…");

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
            handleSetMessages([...updatedMessages, {
              role: "assistant",
              message: "Une erreur est survenue lors de la récupération de la réponse.",
              timestamp: new Date(),
            }]);
          }
        } catch (error) {
          logError(error, "handleSendMessage");
          handleSetMessages([...messages, {
            role: "assistant",
            message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
            timestamp: new Date(),
          }]);
        } finally {
          setIsLoading(false);
          setLoadingMessage("");
          timeoutRefs.current.forEach(clearTimeout);
          timeoutRefs.current = [];
        }
      }
    },
    [isLoading, messages, formData.type, formData.level, formData.name, handleSetMessages, handleLoadingMessage, setValue]
  );

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

  return formData.isSubmitted ? (
    <div className="w-full flex flex-col gap-3" style={{ minHeight: "60vh" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          aria-label="Retour au formulaire de configuration"
          className="ds-btn ds-btn--secondary"
          onClick={() => handleSetFormData({ ...formData, isSubmitted: false })}
        >
          <BackIcon />
          Précédent
        </button>
        <button
          aria-label="Relancer la discussion"
          className="ds-btn ds-btn--ghost"
          onClick={() =>
            handleSetMessages([{
              role: "assistant",
              message: "Bonjour, comment puis-je vous aider ?",
              timestamp: new Date(),
              id: "welcome",
            }])
          }
          disabled={isLoading}
        >
          <ResetIcon />
          Relancer
        </button>
      </div>

      <div
        className="ds-card"
        style={{
          padding: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 400,
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 20px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "var(--washi-50)",
            position: "relative",
          }}
        >
          <button
            style={{
              position: "sticky",
              top: 0,
              alignSelf: "flex-end",
              background: "var(--bg-card-elevated)",
              border: "1px solid var(--border-1)",
              borderRadius: "var(--r-pill)",
              padding: "4px 8px",
              cursor: "pointer",
              color: "var(--fg-2)",
              zIndex: 1,
            }}
            onClick={scrollToBottom}
            aria-label="Défiler vers le bas"
          >
            <ArrowDownIcon />
          </button>

          {messages.map(({ role, message }, index) => (
            <MessageItem key={index} role={role} message={message} />
          ))}

          {isLoading ? (
            <div
              style={{
                alignSelf: "flex-start",
                background: "var(--washi-200)",
                color: "var(--fg-2)",
                padding: "10px 14px",
                borderRadius: "12px 12px 12px 4px",
                fontSize: "var(--fs-xs)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                maxWidth: "75%",
              }}
            >
              <span className="ds-spinner ds-spinner--dark" aria-hidden="true" />
              {loadingMessage}
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit(handleSendMessage)}
          style={{
            padding: 14,
            borderTop: "1px solid var(--border-1)",
            background: "#fff",
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <TextArea
            label=""
            errors={errors}
            id="message"
            {...register("message", { required: true })}
            className="ds-textarea ds-input"
            style={{ resize: "none", height: 48, padding: 12, fontSize: "var(--fs-sm)" }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            disabled={isLoading || isSubmitting}
            type="submit"
            className="ds-btn ds-btn--primary"
          >
            {isLoading ? (
              <span className="ds-spinner" aria-hidden="true" />
            ) : (
              <SendIcon />
            )}
            Envoyer
          </button>
        </form>
      </div>
    </div>
  ) : null;
};

const BackIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ResetIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7"/>
    <polyline points="3 4 3 10 9 10"/>
  </svg>
);

const SendIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
       aria-hidden="true">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="9 12 12 15 15 12"/>
    <line x1="12" y1="8" x2="12" y2="15"/>
  </svg>
);

export default ChatBot;
