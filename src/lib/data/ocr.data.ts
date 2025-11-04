import { logError } from "../logError";
import { MistralData } from "./mistral.data";

export class OCRData {
  static processImageOCR = async (
    file: Blob | MediaSource
  ): Promise<string> => {
    try {
      const ocrResponse = await MistralData.process({ file });
      const cleanText = ocrResponse?.pages[0]?.markdown
        .replace(/\$\\rightarrow\$/g, "→")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join("\n");
      return cleanText;
    } catch (error) {
      logError(error, "processImageOCR");
      throw new Error("Error in image to text conversion.");
    }
  };

  static processPDFOCR = async (file: File): Promise<string> => {
    try {
      const test = true;
      const ocrResponse = await MistralData.process({ file, isPDF: test });
      const cleanText = ocrResponse?.pages
        ?.map((page) => page.markdown)
        .filter((text) => text && !text.startsWith("!["))
        .join("\n")
        .replace(/\$\\rightarrow\$/g, "→")
        .replace(/\$\\Rightarrow\$/g, "→")
        .replace(/\$\\square\$/g, "_____")
        .replace(/\$\\qquad\$/g, "_____")
        .replace(/<br>/g, "\n")
        .replace(/#+\s/g, "")
        .replace(/\(.*?\)/g, "")
        .split("\n")
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.length > 0 &&
            !line.startsWith("![") &&
            !line.match(/^[A-Za-z\s]+$/)
        )
        .join("\n");

      return cleanText;
    } catch (error) {
      logError(error, "processPDFOCR");
      throw new Error("Error in PDF to text conversion.");
    }
  };
}
