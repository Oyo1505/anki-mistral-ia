import { ChatMessage } from "@/interfaces/chat.interface";
import { act, renderHook, waitFor } from "@testing-library/react";
import ChatBotContextProvider, {
  FormDataChatBot,
  useChatBotContext,
} from "../chat-bot-context";

describe("ChatBotContextProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should provide default context values", () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe("assistant");
    expect(result.current.messages[0].message).toBe(
      "Bonjour, comment puis-je vous aider ?"
    );
    expect(result.current.formData).toEqual({
      name: "",
      type: "",
      level: "N1 Avancé",
      isSubmitted: false,
      idThreadChatBot: "",
    });
  });

  it("should load messages from localStorage on initialization", () => {
    const savedMessages = [
      {
        role: "user",
        message: "Test message",
        timestamp: new Date().toISOString(),
        id: "test-1",
      },
    ];
    localStorage.setItem("chatBotMessagesAnki", JSON.stringify(savedMessages));

    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].message).toBe("Test message");
  });

  it("should load formData from localStorage on mount", async () => {
    const savedFormData: FormDataChatBot = {
      name: "John",
      type: "vocabulary",
      level: "N1",
      isSubmitted: true,
      idThreadChatBot: "thread-123",
    };
    localStorage.setItem("formData", JSON.stringify(savedFormData));

    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    await waitFor(() => {
      expect(result.current.formData).toEqual(savedFormData);
    });
  });

  it("should update messages state", () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    const newMessages: ChatMessage[] = [
      {
        role: "user",
        message: "New message",
        timestamp: new Date(),
        id: "msg-1",
      },
    ];

    act(() => {
      result.current.setAllMessages(newMessages);
    });

    expect(result.current.messages).toEqual(newMessages);
  });

  it("should update formData state", () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    const newFormData: FormDataChatBot = {
      name: "Jane",
      type: "grammar",
      level: "N2",
      isSubmitted: true,
      idThreadChatBot: "thread-456",
    };

    act(() => {
      result.current.setFormData(newFormData);
    });

    expect(result.current.formData).toEqual(newFormData);
  });

  it("should persist formData to localStorage when submitted", async () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    const newFormData: FormDataChatBot = {
      name: "John",
      type: "vocabulary",
      level: "N1",
      isSubmitted: true,
      idThreadChatBot: "thread-123",
    };

    act(() => {
      result.current.setFormData(newFormData);
    });

    await waitFor(() => {
      const saved = localStorage.getItem("formData");
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual(newFormData);
    });
  });

  it("should persist messages to localStorage when form is submitted", async () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    const newFormData: FormDataChatBot = {
      name: "John",
      type: "vocabulary",
      level: "N1",
      isSubmitted: true,
      idThreadChatBot: "thread-123",
    };

    const newMessages: ChatMessage[] = [
      {
        role: "user",
        message: "Test",
        timestamp: new Date(),
        id: "msg-1",
      },
    ];

    act(() => {
      result.current.setFormData(newFormData);
      result.current.setAllMessages(newMessages);
    });

    await waitFor(() => {
      const saved = localStorage.getItem("chatBotMessagesAnki");
      expect(saved).toBeTruthy();
    });
  });

  it("should handle handleSetFormData correctly", () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    const formData: FormDataChatBot = {
      name: "Alice",
      type: "reading",
      level: "N3",
      isSubmitted: true,
      idThreadChatBot: "thread-789",
    };

    act(() => {
      result.current.handleSetFormData(formData);
    });

    expect(result.current.formData).toEqual(formData);
    expect(localStorage.getItem("formData")).toBeTruthy();
  });

  it("should handle handleSetMessages correctly", () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    const messages: ChatMessage[] = [
      {
        role: "assistant",
        message: "Hello",
        timestamp: new Date(),
        id: "msg-2",
      },
    ];

    act(() => {
      result.current.handleSetMessages(messages);
    });

    expect(result.current.messages).toEqual(messages);
    expect(localStorage.getItem("chatBotMessagesAnki")).toBeTruthy();
  });

  it("should merge formData in handleSetFormData", () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    act(() => {
      result.current.setFormData({
        name: "John",
        type: "vocabulary",
        level: "N1",
        isSubmitted: false,
        idThreadChatBot: "",
      });
    });

    act(() => {
      result.current.handleSetFormData({
        name: "John",
        type: "grammar",
        level: "N1",
        isSubmitted: true,
        idThreadChatBot: "thread-123",
      });
    });

    expect(result.current.formData.type).toBe("grammar");
    expect(result.current.formData.isSubmitted).toBe(true);
  });

  it("should convert timestamp strings to Date objects when loading from localStorage", () => {
    const timestamp = new Date("2024-01-01");
    const savedMessages = [
      {
        role: "user",
        message: "Test",
        timestamp: timestamp.toISOString(),
        id: "test-1",
      },
    ];
    localStorage.setItem("chatBotMessagesAnki", JSON.stringify(savedMessages));

    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    expect(result.current.messages[0].timestamp).toBeInstanceOf(Date);
  });

  it("should limit messages to 50 in memory and localStorage", () => {
    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    // Créer 100 messages
    const manyMessages: ChatMessage[] = Array.from({ length: 100 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      message: `Message ${i + 1}`,
      timestamp: new Date(),
      id: `msg-${i + 1}`,
    }));

    act(() => {
      result.current.handleSetMessages(manyMessages);
    });

    // Vérifier que seuls les 50 derniers messages sont en mémoire
    expect(result.current.messages).toHaveLength(50);
    expect(result.current.messages[0].message).toBe("Message 51");
    expect(result.current.messages[49].message).toBe("Message 100");

    // Vérifier que seuls les 50 derniers messages sont dans localStorage
    const saved = localStorage.getItem("chatBotMessagesAnki");
    expect(saved).toBeTruthy();
    const parsedMessages = JSON.parse(saved!);
    expect(parsedMessages).toHaveLength(50);
  });

  it("should limit messages to 50 when loading from localStorage", () => {
    // Créer 100 messages dans localStorage
    const manyMessages = Array.from({ length: 100 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      message: `Message ${i + 1}`,
      timestamp: new Date().toISOString(),
      id: `msg-${i + 1}`,
    }));

    localStorage.setItem("chatBotMessagesAnki", JSON.stringify(manyMessages));

    const { result } = renderHook(() => useChatBotContext(), {
      wrapper: ChatBotContextProvider,
    });

    // Vérifier que seuls les 50 derniers messages sont chargés
    expect(result.current.messages).toHaveLength(50);
    expect(result.current.messages[0].message).toBe("Message 51");
    expect(result.current.messages[49].message).toBe("Message 100");
  });
});
