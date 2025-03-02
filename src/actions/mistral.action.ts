'use server'
import { FormDataSchemaType } from "@/schema/form-schema";
//import extractTextWithOCR from "@/utils/extract-text-with-ocr";
import { CardSchema } from "@/schema/card.schema";
import { mistral } from "@/lib/mistral";

const generateCardsAnki = async ({file, text, level, romanji, kanji, numberOfCards = 5}: {file?: string, text: string, level: string, romanji: boolean, kanji: boolean, numberOfCards: number}) => {
  try {
    const textFromPdf = file ? null : null;
    const prompt = `
    ${textFromPdf ? `Voici le texte des fichier pdf à partir duquel tu dois générer les cartes anki : ${textFromPdf}.` : ''} Ceci est le texte que tu dois utiliser pour générer les cartes anki : ${text}. Pour un niveau de japonais de ${level}, tu dois générer ${numberOfCards} cartes anki basiques ${romanji ? 'avec les romanji' : ''} ${kanji ? 'avec les kanji si il y en a' : ''}.
    `
    const answer = await mistral.chat.parse({
      model: "ministral-8b-latest",
      temperature: 1,
      messages: [{ 
      role: "system",
      content: "Tu es fais pour faire des carte anki basique de japonais. Tu dois être precis dans tes reponses et repondre sans fautes de frappe. Tu dois repondre en japonais et en francais."
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
    const res = await generateCardsAnki({ text: data.text, level: data.level, numberOfCards: data.numberOfCards, romanji: data.romanji, kanji: data.kanji}); 
    // const answer = await mistral.chat.completions.create({
    //   model: "mistral-large-latest",
    //   messages: [{ role: "user", content: text }],
    // });
     return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { generateCardsAnki, generateAnswer };