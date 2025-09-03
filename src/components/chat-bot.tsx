'use client'
import { threadChatBot } from "@/actions/chat-bot.action";
import { useChatBotContext } from "@/context/chat-bot-context";
import { ChatMessage } from "@/interfaces/chat.interface";
import { LOADING_MESSAGE_DELAY, LOADING_MESSAGE_DELAY_2, LOADING_MESSAGE_DELAY_3 } from "@/shared/constants/numbers";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextArea from "./text-area";

const RobotIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} 
 fill={"currentColor"}  viewBox="0 0 24 24" {...props} >
 {/* Boxicons v3.0 https://boxicons.com | License  https://docs.boxicons.com/free */}
 <path d="M8.5 10A1.5 2 0 1 0 8.5 14 1.5 2 0 1 0 8.5 10z"></path><path d="M15.5 10A1.5 2 0 1 0 15.5 14 1.5 2 0 1 0 15.5 10z"></path><path d="M8 16H16V18H8z"></path><path d="m21,11v-3c0-1.1-.9-2-2-2h-6v-1.39c.3-.27.5-.67.5-1.11,0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5,1.5c0,.44.2.84.5,1.11v1.39h-6c-1.1,0-2,.9-2,2v3c-.55,0-1,.45-1,1v4c0,.55.45,1,1,1v3c0,1.1.9,2,2,2h14c1.1,0,2-.9,2-2v-3c.55,0,1-.45,1-1v-4c0-.55-.45-1-1-1ZM5,20v-12h14v4s0,0,0,0v4s0,0,0,0v4s-14,0-14,0Z"></path>
 </svg>
 );
 
const ArrowDownIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
    </svg>
  )
}
const ChatBot = () => {
  const { messages, formData, handleSetFormData, handleSetMessages } = useChatBotContext();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, formState: {isSubmitting, errors} } = useForm({
    defaultValues: {
      message: '',
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey && !isLoading) {
      e.preventDefault();
      setValue('message', e.currentTarget.value + '\n');
    }
      
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      const userMessage = e.currentTarget.value;
      if (userMessage.trim()) {
        handleSendMessage({ message: userMessage });
        e.currentTarget.value = '';
      }
    }
  }

  const handleLoadingMessage = (): void => {
    setTimeout(() => setLoadingMessage('Connexion à l\'IA...'), LOADING_MESSAGE_DELAY);
    setTimeout(() => setLoadingMessage('Génération de la réponse...'), LOADING_MESSAGE_DELAY_2);
    setTimeout(() => setLoadingMessage('Finalisation...'), LOADING_MESSAGE_DELAY_3);
  }
  
  const handleSendMessage = async (data: { message: string }) => {
    if (data.message !== '' && !isLoading) {
      try {
        setIsLoading(true);
        setLoadingMessage('Envoi du message...');
        
        const userMessage: ChatMessage = { role: 'user', message: data.message, timestamp: new Date() };
        const updatedMessages = [...messages, userMessage];
        handleSetMessages(updatedMessages);
        setValue('message', '');

        handleLoadingMessage();
    
        const response = await threadChatBot({
          message: data.message.trim(), 
          conversationHistory: messages, 
          typeExercice: formData.type, 
          level: formData.level, 
          name: formData.name
        });

        if(response.role === 'assistant') {
          handleSetMessages([...updatedMessages, response]);
        } else {
          const errorMessage: ChatMessage = { 
            role: 'assistant', 
            message: "Une erreur est survenue lors de la récupération de la réponse.", 
            timestamp: new Date() 
          };
          handleSetMessages([...updatedMessages, errorMessage]);
        }
        
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        const errorMessage: ChatMessage = { 
          role: 'assistant', 
          message: "Une erreur inattendue s'est produite. Veuillez réessayer.", 
          timestamp: new Date() 
        };
        handleSetMessages([...messages, errorMessage]);
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    }
  }

  return (
    formData.isSubmitted && (
      <div className="w-full min-h-1/2 h-4/5 flex flex-col items-start justify-start gap-4">
        <div className="w-full flex items-center justify-between">
          <div 
            role="button" 
            aria-label="Précédent" 
            className="cursor-pointer text-center font-semibold text-slate-800 bg-white p-2 rounded-md border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-300 ease-in-out" 
            onClick={() => handleSetFormData({...formData, isSubmitted: false})}
          >
            Précédent
          </div>
          <button 
            aria-label="relancer la discussion" 
            onClick={() => handleSetMessages([ {
              role: 'assistant',
              message: 'Bonjour, comment puis-je vous aider ?',
              timestamp: new Date(),
              id: 'welcome',
            }])} 
            disabled={isLoading}
            className="cursor-pointer text-center font-semibold text-slate-800 bg-white p-2 rounded-md border-2 border-slate-800 hover:bg-slate-800 hover:text-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Relancer la discussion
          </button>
        </div>
        <div className="w-full h-full flex flex-col items-start justify-start relative">   
          <button className="absolute bottom-50 right-3 text-black" onClick={() => scrollToBottom()}> <ArrowDownIcon /></button>
          <div className="w-full h-full flex flex-col items-start justify-start gap-4 bg-slate-100 p-4 rounded-t-md overflow-y-auto">
            {messages.map(({role, message}, index) => (
              <div key={index} className={`${role === 'user' ? 'bg-slate-800 text-white self-end' : 'bg-slate-200 text-slate-800 text-left'} p-2 rounded-md max-w-[80%] `}>
                <span>{role === 'user' ? '' : <RobotIcon />}</span>
                <div className="text-base whitespace-pre-wrap">{ <div dangerouslySetInnerHTML={{ __html: marked.parse(message) }} />}</div>
              </div>
            ))}
            
          
            {isLoading && (
              <div className="bg-slate-200 text-slate-800 p-2 rounded-md max-w-[80%]">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                  <span className="text-sm">{loadingMessage}</span>
                </div>
              </div>
            )}
              
            <div ref={messagesEndRef} />

          </div>
          <form onSubmit={handleSubmit(handleSendMessage)} className="w-full h-auto rounded-b-md flex flex-col items-start justify-start gap-4 bg-slate-100 p-4">
            <TextArea 
              label="" 
              errors={errors}
              id="message"
              {...register('message', {required: true})} 
              className="w-full h-auto p-2 border-slate-800 outline-none focus:border-slate-500 resize-none" 
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button 
              disabled={isLoading || isSubmitting} 
              type="submit" 
              className="w-full p-2 rounded-md text-white font-bold bg-blue-500 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
        </div>
      </div>
    ) 
  )
}

export default ChatBot;