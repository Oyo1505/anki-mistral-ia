'use server'
import { FormDataSchemaType } from "@/schema/form-schema";
import { CardSchema } from "@/schema/card.schema";
import { mistral } from "@/lib/mistral";
import { pdfToPng } from 'pdf-to-png-converter';
import Tesseract from 'tesseract.js';
import fs from 'fs-extra';

const generateCardsAnki = async ({ text, level, romanji, kanji, numberOfCards = 5, textFromPdf}: {text?: string, level: string, romanji: boolean, kanji: boolean, numberOfCards: number, textFromPdf?: string }) => {
  try {

    const prompt = `
    ${textFromPdf && textFromPdf.length > 0 && `Voici le texte des fichier pdf à partir duquel tu dois générer les cartes anki : ${textFromPdf}.`}.
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
    const res = await generateCardsAnki({text, level, numberOfCards, romanji, kanji, textFromPdf}); 
   return res;
  } catch (error) { 
    console.error(error);
    return null;
  }
};

const extractTextWithOCR = async (fileInput: File | string) => {
  try {
    // Créer un dossier temporaire dans /tmp pour Next.js
    const tempDir = `/tmp/pdf_ocr_${Date.now()}`;
    await fs.ensureDir(tempDir);
    
    let pngPages;
    
    // Gérer le cas où fileInput est un objet File
    if (typeof fileInput !== 'string' && fileInput instanceof File) {
      // Convertir le File en Buffer
      const arrayBuffer = await fileInput.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Sauvegarder temporairement le buffer dans un fichier
      const tempFilePath = `${tempDir}/temp_pdf_file.pdf`;
      await fs.writeFile(tempFilePath, buffer);
      
      pngPages = await pdfToPng(tempFilePath, {
        viewportScale: 2.0,
        outputFolder: tempDir,
        outputFileMaskFunc: (page) => `page_${page}.png`,
      });
      
      // Supprimer le fichier PDF temporaire
      await fs.unlink(tempFilePath);
    } else {
      // Cas où fileInput est déjà un chemin de fichier (string)
      pngPages = await pdfToPng(fileInput, {
        viewportScale: 2.0,
        outputFolder: tempDir,
        outputFileMaskFunc: (page) => `page_${page}.png`,
      });
    }
    
    if (!pngPages.length) {
      throw new Error("Aucune page extraite du PDF");
    }
    
    const textResults = await Promise.all(
      pngPages.map(async (page) => {
        console.log(`📝 OCR en cours sur ${page.path}...`);
        const { data: { text } } = await Tesseract.recognize(page.path, "jpn+fra");
        await fs.unlink(page.path);
        return text.trim();
      })
    );

    // Nettoyer le dossier temporaire
    await fs.remove(tempDir);

    const fullText = textResults.join("\n");
    return fullText;
  } catch (error) {
    console.error("Erreur lors de l'OCR :", error);
    return null;
  }
};
export { generateCardsAnki, generateAnswer, extractTextWithOCR };