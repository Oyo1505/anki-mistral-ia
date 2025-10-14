import ChatBot from "@/components/chat-bot";
import FormChatBot from "@/components/form-chat-bot";
import ChatBotContextProvider from "@/context/chat-bot-context";

const Page = () => {
  return (
    <ChatBotContextProvider>
      <>
        <FormChatBot />
        <ChatBot />
      </>
    </ChatBotContextProvider>
  );
};

export default Page;
