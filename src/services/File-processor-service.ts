import { getTextFromImage, getTextFromPDF } from "@/actions/mistral.action";
import { logError } from "@/lib/logError";

export class FileProcessorService {
  async processFile(file: File): Promise<string | null> {
    try {
      if (file.type === "application/pdf") {
        return await getTextFromPDF(file);
      }

      if (["image/jpeg", "image/png"].includes(file.type)) {
        return await getTextFromImage(file);
      }

      return null;
    } catch (error) {
      logError(error, "Error processing file:");
      return null;
    }
  }

  validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    return file.size <= maxSizeMB * 1024 * 1024;
  }

  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }
}

export const fileProcessor = new FileProcessorService();
