"use server";
import { ChatMessage } from "@/interfaces/chat.interface";
import { mistral } from "@/lib/mistral";
import { MILLISECONDS_DELAY, MAX_RETRIES, BASE_DELAY } from "@/shared/constants/numbers";
import delay, { retryWithBackoff } from "@/utils/time/delay";
import { revalidatePath } from "next/cache";

export const threadChatBot = async ({message, conversationHistory, typeExercice, level, name}: {message: string, conversationHistory: ChatMessage[], typeExercice: string, level: string, name: string}): Promise<any> => {
  const conversationContext = conversationHistory
      ? conversationHistory
          .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
          .slice(-4)
          .map((msg) => ({
            role: msg.role,
            content: msg.message,
          }))
      : [];

  try {
    const response = await retryWithBackoff(
      async () => {
        return await mistral.chat.complete({
          model: 'mistral-large-latest',
          temperature: 0.3,
          maxTokens: 500,
          messages: [
            {
              role: 'system',
              content: `tu es un assistant qui a pour rôle d'etre un professeur de japonais tu dois être pédagogue et patient. Réponds de manière naturelle et conversationnelle.
              -> tu dois repondre en japonais ou en francais. 
              -> tu dois faire des exercices de ${typeExercice}, les exercices doivent etre plutot court et clair en presentation. 
              -> Son niveau de japonais est ${level}. 
              -> Son nom est ${name}.`,
            },
            ...conversationContext,
            { role: 'user', content: message },
          ],
        });
      },
      MAX_RETRIES,
      BASE_DELAY
    );

    revalidatePath('/chat');
    return {
      role: 'assistant',
      message: response.choices[0].message.content,
      timestamp: new Date(),
    };
  } catch (error: any) {
    console.error('Erreur lors de la communication avec Mistral:', error);

    if (error.statusCode === 429) {
      return {
        role: 'assistant',
        message: 'Désolé, le service est temporairement surchargé. Veuillez réessayer dans quelques instants.',
        timestamp: new Date(),
      };
    }
    
    return {
      role: 'assistant',
      message: 'Une erreur est survenue lors de la récupération de la réponse. Veuillez réessayer.',
      timestamp: new Date(),
    };
  }
}