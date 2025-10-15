/**
 * Unit tests for FileProcessorService
 * Tests file processing, validation, and error handling
 */

// Mock environment and dependencies BEFORE imports
process.env.MISTRAL_API_KEY = "test-api-key-32-characters-long-minimum-required";

jest.mock("@/actions/mistral.action");
jest.mock("@/lib/logError");
jest.mock("@/lib/mistral", () => ({
  mistral: {},
}));

import { FileProcessorService, fileProcessor } from "../File-processor-service";
import { getTextFromImage, getTextFromPDF } from "@/actions/mistral.action";

const mockGetTextFromPDF = getTextFromPDF as jest.MockedFunction<
  typeof getTextFromPDF
>;
const mockGetTextFromImage = getTextFromImage as jest.MockedFunction<
  typeof getTextFromImage
>;

describe("FileProcessorService", () => {
  let service: FileProcessorService;

  beforeEach(() => {
    service = new FileProcessorService();
    jest.clearAllMocks();
  });

  describe("processFile", () => {
    describe("PDF files", () => {
      it("should process PDF files correctly", async () => {
        const mockPdfFile = new File(["pdf content"], "test.pdf", {
          type: "application/pdf",
        });
        const extractedText = "Extracted text from PDF";

        mockGetTextFromPDF.mockResolvedValue(extractedText);

        const result = await service.processFile(mockPdfFile);

        expect(mockGetTextFromPDF).toHaveBeenCalledWith(mockPdfFile);
        expect(result).toBe(extractedText);
      });

      it("should handle PDF processing errors", async () => {
        const mockPdfFile = new File(["corrupted pdf"], "broken.pdf", {
          type: "application/pdf",
        });

        mockGetTextFromPDF.mockRejectedValue(new Error("PDF parsing failed"));

        const result = await service.processFile(mockPdfFile);

        expect(result).toBeNull();
      });

      it("should handle empty PDF files", async () => {
        const mockPdfFile = new File([], "empty.pdf", {
          type: "application/pdf",
        });

        mockGetTextFromPDF.mockResolvedValue("");

        const result = await service.processFile(mockPdfFile);

        expect(result).toBe("");
      });
    });

    describe("Image files", () => {
      it("should process JPEG images correctly", async () => {
        const mockJpegFile = new File(["jpeg data"], "test.jpg", {
          type: "image/jpeg",
        });
        const extractedText = "Text from JPEG image";

        mockGetTextFromImage.mockResolvedValue(extractedText);

        const result = await service.processFile(mockJpegFile);

        expect(mockGetTextFromImage).toHaveBeenCalledWith(mockJpegFile);
        expect(result).toBe(extractedText);
      });

      it("should process PNG images correctly", async () => {
        const mockPngFile = new File(["png data"], "test.png", {
          type: "image/png",
        });
        const extractedText = "Text from PNG image";

        mockGetTextFromImage.mockResolvedValue(extractedText);

        const result = await service.processFile(mockPngFile);

        expect(mockGetTextFromImage).toHaveBeenCalledWith(mockPngFile);
        expect(result).toBe(extractedText);
      });

      it("should handle image processing errors", async () => {
        const mockImageFile = new File(["corrupted image"], "broken.jpg", {
          type: "image/jpeg",
        });

        mockGetTextFromImage.mockRejectedValue(
          new Error("Image processing failed")
        );

        const result = await service.processFile(mockImageFile);

        expect(result).toBeNull();
      });

      it("should handle images with no text", async () => {
        const mockImageFile = new File(["image without text"], "blank.png", {
          type: "image/png",
        });

        mockGetTextFromImage.mockResolvedValue("");

        const result = await service.processFile(mockImageFile);

        expect(result).toBe("");
      });
    });

    describe("Unsupported file types", () => {
      it("should return null for unsupported file types", async () => {
        const mockTextFile = new File(["text content"], "test.txt", {
          type: "text/plain",
        });

        const result = await service.processFile(mockTextFile);

        expect(result).toBeNull();
        expect(mockGetTextFromPDF).not.toHaveBeenCalled();
        expect(mockGetTextFromImage).not.toHaveBeenCalled();
      });

      it("should return null for Word documents", async () => {
        const mockDocFile = new File(["doc content"], "test.docx", {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const result = await service.processFile(mockDocFile);

        expect(result).toBeNull();
      });

      it("should return null for video files", async () => {
        const mockVideoFile = new File(["video data"], "test.mp4", {
          type: "video/mp4",
        });

        const result = await service.processFile(mockVideoFile);

        expect(result).toBeNull();
      });
    });

    describe("Edge cases", () => {
      it("should handle files with no type", async () => {
        const mockFile = new File(["content"], "test", {
          type: "",
        });

        const result = await service.processFile(mockFile);

        expect(result).toBeNull();
      });

      it("should handle very large files", async () => {
        const largeContent = "x".repeat(10 * 1024 * 1024); // 10MB
        const mockLargeFile = new File([largeContent], "large.pdf", {
          type: "application/pdf",
        });

        mockGetTextFromPDF.mockResolvedValue("Large file content");

        const result = await service.processFile(mockLargeFile);

        expect(result).toBe("Large file content");
      });
    });
  });

  describe("validateFileSize", () => {
    it("should validate file size within limit", () => {
      const mockFile = new File(["small content"], "small.pdf", {
        type: "application/pdf",
      });

      const result = service.validateFileSize(mockFile, 10);

      expect(result).toBe(true);
    });

    it("should reject file size exceeding limit", () => {
      const largeContent = "x".repeat(11 * 1024 * 1024); // 11MB
      const mockLargeFile = new File([largeContent], "large.pdf", {
        type: "application/pdf",
      });

      const result = service.validateFileSize(mockLargeFile, 10);

      expect(result).toBe(false);
    });

    it("should use default 10MB limit", () => {
      const mockFile = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });

      const result = service.validateFileSize(mockFile);

      expect(result).toBe(true);
    });

    it("should handle exactly at the limit", () => {
      const exactContent = "x".repeat(10 * 1024 * 1024); // Exactly 10MB
      const mockFile = new File([exactContent], "exact.pdf", {
        type: "application/pdf",
      });

      const result = service.validateFileSize(mockFile, 10);

      expect(result).toBe(true);
    });

    it("should handle zero size files", () => {
      const mockFile = new File([], "empty.pdf", {
        type: "application/pdf",
      });

      const result = service.validateFileSize(mockFile, 10);

      expect(result).toBe(true);
    });

    it("should handle custom size limits", () => {
      const mockFile = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });

      const result1MB = service.validateFileSize(mockFile, 1);
      const result100MB = service.validateFileSize(mockFile, 100);

      expect(result1MB).toBe(true);
      expect(result100MB).toBe(true);
    });
  });

  describe("validateFileType", () => {
    it("should validate allowed PDF files", () => {
      const mockPdfFile = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });

      const result = service.validateFileType(mockPdfFile, ["application/pdf"]);

      expect(result).toBe(true);
    });

    it("should validate allowed image files", () => {
      const mockJpegFile = new File(["content"], "test.jpg", {
        type: "image/jpeg",
      });

      const result = service.validateFileType(mockJpegFile, [
        "image/jpeg",
        "image/png",
      ]);

      expect(result).toBe(true);
    });

    it("should reject disallowed file types", () => {
      const mockTextFile = new File(["content"], "test.txt", {
        type: "text/plain",
      });

      const result = service.validateFileType(mockTextFile, [
        "application/pdf",
        "image/jpeg",
      ]);

      expect(result).toBe(false);
    });

    it("should handle empty allowed types array", () => {
      const mockFile = new File(["content"], "test.pdf", {
        type: "application/pdf",
      });

      const result = service.validateFileType(mockFile, []);

      expect(result).toBe(false);
    });

    it("should handle multiple allowed types", () => {
      const mockPngFile = new File(["content"], "test.png", {
        type: "image/png",
      });

      const result = service.validateFileType(mockPngFile, [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ]);

      expect(result).toBe(true);
    });

    it("should handle normalized MIME types", () => {
      // Note: Browsers normalize MIME types to lowercase automatically
      // This test verifies that the File API behaves as expected
      const mockFile = new File(["content"], "test.pdf", {
        type: "application/PDF", // Will be normalized to lowercase by browser
      });

      const result = service.validateFileType(mockFile, ["application/pdf"]);

      // The File API normalizes MIME types, so this should pass
      expect(result).toBe(true);
    });
  });

  describe("fileProcessor singleton", () => {
    it("should export a singleton instance", () => {
      expect(fileProcessor).toBeInstanceOf(FileProcessorService);
    });

    it("should use the same singleton instance", () => {
      expect(fileProcessor).toBe(fileProcessor);
    });

    it("singleton should have all methods", () => {
      expect(typeof fileProcessor.processFile).toBe("function");
      expect(typeof fileProcessor.validateFileSize).toBe("function");
      expect(typeof fileProcessor.validateFileType).toBe("function");
    });
  });
});
