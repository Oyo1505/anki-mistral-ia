'use server'
import { FormDataSchemaType } from "@/schema/form-schema";
import { mistral } from "@/lib/mistral";
import { revalidatePath } from "next/cache";
import prompt from "@/utils/string/prompt";
import { retryWithBackoff } from "@/utils/time/delay";
import { BASE_DELAY, MAX_RETRIES } from "@/shared/constants/numbers";
import { CardSchemaBase, CardSchemaKanji } from "@/schema/card.schema";

const generateCardsAnki = async ({ text, level, romanji, kanji, numberOfCards = 5, textFromPdf, japanese, typeCard}: {text?: string, level: string, romanji: boolean, kanji: boolean, numberOfCards: number, textFromPdf?: string, japanese: boolean, typeCard: string}): Promise<string[][] | {error: string, status: number} | Error> => {
  try {

    try {
      const response = await retryWithBackoff(
        async () => {  
          return await mistral.chat.parse({
          model: "mistral-large-latest",
          temperature: 0.2,
          messages: [{ 
          role: "system",
          content: typeCard === 'basique' ? 
          `-> Tu es fais pour faire des carte anki basique de japonais.
          -> Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes ou ne traduit pas les mots en KATAKANA quand cela est possible.
          -> Tu dois repondre en japonais et en francais. Pour un niveau de japonais de ${level}.
          -> Tu dois générer ${numberOfCards} cartes anki ${romanji ? 'avec les romanji' : 'ne pas utiliser les romanji'}
          -> ${kanji ? 'tu peux intégrer les kanji si il y en a' : 'ne pas utiliser les kanji'}.
          -> Tu peux faire des cartes avec des phrases a trou, des QCM, des exercices de grammaire, des mots a deviner, des phrases, des expressions, des mots complexes tout en respectant le niveau donner qui est: ${level}.N\'invente pas des mots en KATAKANA
          -> ${japanese && 'Tu dois écrire les énoncés, questions, réponses en japonais. PAS DE FRANCAIS.'}
          -> Tu dois intergrer IMPERATIVEMENT les mots en KATAKANA et en HIRAGANA si tu en detectes ou ne traduit pas les mots en KATAKANA quand cela est possible.
          -> Pour un niveau de japonais de ${level}.
          ` : `Tu es fais pour faire des cartes anki pour apprendre les kanjis japonais avec des mots en KANJI, HIRAGANA, les mots en KATAKANA sont INTERDIT. Tu dois générer ${numberOfCards} cartes anki.`
        },
        { 
          role: "user", 
          content: prompt({typeCard, textFromPdf, text, romanji, kanji, japanese, numberOfCards, level}) 
        }],
        responseFormat: typeCard === 'basique' ? CardSchemaBase : CardSchemaKanji,
        maxTokens: 10000,
      });
    },
    MAX_RETRIES,
    BASE_DELAY
  );
  
  const parsedResult = response?.choices?.[0]?.message?.content;

  if (!parsedResult) {

    throw new Error("La réponse du modèle est vide ou n'a pas pu être parsée correctement.");
  }
  return parsedResult as any;
}
  catch(err){
    console.error(err);
    throw new Error("Une erreur est survenue dans la génération des cartes. Veuillez réessayer.");
  }
  } catch (error) {
    console.error(error);
    throw new Error("Trop de requêtes. Veuillez attendre une minute avant de réessayer.");
    }
};

const getTextFromImage = async (file: Blob | MediaSource): Promise<string> => {
  try {
    const buffer = await (file as Blob).arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = (file as Blob).type;
    const base64Url = `data:${mimeType};base64,${base64}`;

    const ocrResponse = await mistral.ocr.process({
      model: "mistral-ocr-latest",
      document: {
        type: "image_url",
        imageUrl: base64Url
      }
    });
    
    const cleanText = ocrResponse?.pages[0]?.markdown
    .replace(/\$\\rightarrow\$/g, '→')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
    return cleanText;
  } catch (error) {
    console.error(error);
    throw new Error("Erreur dans la conversion de l'image en texte.");
  }
}

const getTextFromPDF = async (file: File): Promise<string> => {
 try {
  const fileBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(fileBuffer).toString('base64');
  const base64Url = `data:application/pdf;base64,${base64}`;
  const ocrResponse = await mistral.ocr.process({
    model: "mistral-ocr-latest",
    document: {
        type: "document_url",
        documentUrl: base64Url
    },
    includeImageBase64: true
});

const cleanText = ocrResponse?.pages
    ?.map(page => page.markdown)
    .filter(text => text && !text.startsWith('![')) 
    .join('\n')
    .replace(/\$\\rightarrow\$/g, '→')
    .replace(/\$\\Rightarrow\$/g, '→')
    .replace(/\$\\square\$/g, '_____')
    .replace(/\$\\qquad\$/g, '_____')
    .replace(/<br>/g, '\n') 
    .replace(/#+\s/g, '') 
    .replace(/\(.*?\)/g, '') 
    .split('\n')
    .map(line => line.trim())
    .filter(line => 
      line.length > 0 && 
      !line.startsWith('![') && 
      !line.match(/^[A-Za-z\s]+$/) 
    )
    .join('\n');

 return cleanText;
 } catch (error) {
  console.error(error);
  throw new Error("Erreur dans la conversion du pdf en texte.");
 }
}

const generateAnswer = async (data: FormDataSchemaType): Promise<{data: string[][] | null, status: number, error?: string} > => {

  try { 
    const {text, level, numberOfCards, romanji, kanji, textFromPdf, japanese, typeCard} = data;
    const res = await generateCardsAnki({text, level, numberOfCards, romanji, kanji, textFromPdf, japanese, typeCard});
    revalidatePath('/');
    
    if (typeof res === 'object' && 'status' in res && res.status === 500) {
      console.error(res.status);
      return {data: null, status: 500, error: 'Une erreur est survenue dans la génération de la reponse. Veuillez réessayer.'};
    } else {
      return {data: res as string[][], status: 200};
    }
  } catch (error) { 
    console.error(error);
    return {data: null, status: 500, error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'};
  }
};

export { generateCardsAnki, generateAnswer, getTextFromImage, getTextFromPDF };