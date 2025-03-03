
import { pdfToPng } from 'pdf-to-png-converter';
import Tesseract from 'tesseract.js';
import fs from 'fs-extra';

const extractTextWithOCR = async (filePath: string) => {
  try {
    const pngPages = await pdfToPng(filePath, {
      viewportScale: 2.0, 
      outputFolder: "./temp_images",
      outputFileMaskFunc: (page) => `page_${page}.png`, 
    });
    if (!pngPages.length) {
      throw new Error("Aucune page extraite du PDF");
    }
    const textResults = await Promise.all(
      pngPages.map(async (page) => {
        console.log(`📝 OCR en cours sur ${page.path}...`);
        const { data: { text } } = await Tesseract.recognize(page.path, "eng+fra");
        await fs.unlink(page.path);
        return text.trim();
      })
    );

    const fullText = textResults.join("\n");
    return fullText;
  } catch (error) {
    console.error("Erreur lors de l'OCR :", error);
    return null;
  }
};

export default extractTextWithOCR;
