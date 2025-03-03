'use server'
import { FormDataSchemaType } from "@/schema/form-schema";
import { CardSchema } from "@/schema/card.schema";
import { mistral } from "@/lib/mistral";

const generateCardsAnki = async ({ text, level, romanji, kanji, numberOfCards = 5, textFromPdf}: {text?: string, level: string, romanji: boolean, kanji: boolean, numberOfCards: number, textFromPdf?: string }) => {
  try {
 
    const prompt = `
    ${textFromPdf && textFromPdf.length > 0 && `Voici le texte des fichier pdf ou d'une image à partir duquel tu dois générer les cartes anki : ${textFromPdf}.`}.
    ${text && text.length > 0 && `Voici le texte venant du textearea du formulaire à partir duquel tu dois générer les cartes anki ou des instructions : ${text}.`}.
    ${romanji ? 'avec les romanji' : 'ne pas utiliser les romanji si il y en a supprimer les romanji'} ${kanji ? 'et les kanji si il y en a' : 'ne pas utiliser les kanji si il y en a les mettre en hiragana'}
    `
    const answer = await mistral.chat.parse({
      model: "mistral-large-latest",
      temperature: 1,
      messages: [{ 
      role: "system",
      content: `Tu es fais pour faire des carte anki basique de japonais.
      Tu dois repondre en japonais et en francais. Pour un niveau de japonais de ${level}, tu dois générer ${numberOfCards} cartes anki basiques ${romanji ? 'avec les romanji' : 'ne pas utiliser les romanji'} ${kanji ? 'et les kanji si il y en a' : 'ne pas utiliser les kanji'}.
      Tu peux faire des cartes avec des phrases a trou, des exercices de grammaire, des mots a deviner, des phrases, des expressions, des mots complexes tout en respectant le niveau donner qui est: ${level}.
      `
    },
    { 
      role: "user", 
      content: prompt 
    }],
    responseFormat: CardSchema,
  });
 
  return answer?.choices?.[0]?.message?.parsed;
  } catch (error) {
    console.error(error);
    return null;
  }
};


const generateAnswer = async (data: FormDataSchemaType) => {

  try { 
    const {text, level, numberOfCards, romanji, kanji, textFromPdf} = data;
    console.log('textFromPdf', textFromPdf);
    const res = await generateCardsAnki({text, level, numberOfCards, romanji, kanji, textFromPdf}); 
   return res;
  } catch (error) { 
    console.error(error);
    return null;
  }
};

export { generateCardsAnki, generateAnswer };