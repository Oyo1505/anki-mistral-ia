import { OCRData } from "@/lib/data/ocr.data";
import { logError } from "@/lib/logError";
import { BASE_DELAY, MAX_RETRIES } from "@/shared/constants/numbers";
import { retryWithBackoff } from "@/utils/time/delay";

export class FileProcessorService {
  async processFile(file: File): Promise<string | null> {
    try {
      if (file.type === "application/pdf") {
        return await retryWithBackoff(
          async () => {
            return await OCRData.processPDFOCR(file);
          },
          MAX_RETRIES,
          BASE_DELAY
        );
      }

      if (["image/jpeg", "image/png"].includes(file.type)) {
        return await retryWithBackoff(
          async () => {
            return await await OCRData.processImageOCR(file);
          },
          MAX_RETRIES,
          BASE_DELAY
        );
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
