import { MistralData } from "../mistral.data";
import { mistral } from "@/lib/mistral";
import { retryWithBackoff } from "@/utils/time/delay";
import { logError } from "@/lib/logError";
import { CardSchemaBase, CardSchemaKanji } from "@/schema/card.schema";

// Mock dependencies
jest.mock("@/lib/mistral");
jest.mock("@/utils/time/delay");
jest.mock("@/lib/logError");

describe("MistralData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parse", () => {
    const mockParams = {
      typeCard: "basique",
      text: "Bonjour",
      level: "N5",
      romanji: true,
      furigana: false,
      kanji: false,
      japanese: true,
      numberOfCards: 5,
    };

    it("devrait parser avec succès des cartes basiques", async () => {
      const mockParsedResult = [
        ["Bonjour", "こんにちは", "konnichiwa"],
        ["Au revoir", "さようなら", "sayonara"],
      ];

      const mockResponse = {
        choices: [
          {
            message: {
              parsed: mockParsedResult,
            },
          },
        ],
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockResponse);

      const result = await MistralData.parse(mockParams);

      expect(retryWithBackoff).toHaveBeenCalled();
      expect(result).toEqual(mockParsedResult);
      expect(logError).not.toHaveBeenCalled();
    });

    it("devrait utiliser CardSchemaBase pour type basique", async () => {
      const mockResponse = {
        choices: [{ message: { parsed: [["test", "テスト"]] } }],
      };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockChatParse = jest.fn().mockResolvedValue(mockResponse);
      (mistral.chat as any) = { parse: mockChatParse };

      await MistralData.parse({ ...mockParams, typeCard: "basique" });

      const chatParseCall = mockChatParse.mock.calls[0][0];
      expect(chatParseCall.responseFormat).toBe(CardSchemaBase);
    });

    it("devrait utiliser CardSchemaKanji pour type kanji", async () => {
      const mockResponse = {
        choices: [{ message: { parsed: [["test", "テスト", "kanji"]] } }],
      };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockChatParse = jest.fn().mockResolvedValue(mockResponse);
      (mistral.chat as any) = { parse: mockChatParse };

      await MistralData.parse({ ...mockParams, typeCard: "kanji" });

      const chatParseCall = mockChatParse.mock.calls[0][0];
      expect(chatParseCall.responseFormat).toBe(CardSchemaKanji);
    });

    it("devrait configurer correctement les paramètres du modèle", async () => {
      const mockResponse = {
        choices: [{ message: { parsed: [["data"]] } }],
      };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockChatParse = jest.fn().mockResolvedValue(mockResponse);
      (mistral.chat as any) = { parse: mockChatParse };

      await MistralData.parse(mockParams);

      expect(mockChatParse).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "mistral-large-latest",
          temperature: 0.2,
          maxTokens: 10000,
        })
      );
    });

    it("devrait inclure les messages system et user", async () => {
      const mockResponse = {
        choices: [{ message: { parsed: [["data"]] } }],
      };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockChatParse = jest.fn().mockResolvedValue(mockResponse);
      (mistral.chat as any) = { parse: mockChatParse };

      await MistralData.parse(mockParams);

      const chatParseCall = mockChatParse.mock.calls[0][0];
      expect(chatParseCall.messages).toHaveLength(2);
      expect(chatParseCall.messages[0].role).toBe("system");
      expect(chatParseCall.messages[1].role).toBe("user");
    });

    it("devrait gérer textFromPdf", async () => {
      const paramsWithPdf = {
        ...mockParams,
        textFromPdf: "Extracted PDF text",
      };

      const mockResponse = {
        choices: [{ message: { parsed: [["pdf", "data"]] } }],
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockResponse);

      const result = await MistralData.parse(paramsWithPdf);

      expect(result).toEqual([["pdf", "data"]]);
    });

    it("devrait retourner une erreur si parsedResult est vide", async () => {
      const mockResponse = {
        choices: [{ message: { parsed: null } }],
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockResponse);

      const result = await MistralData.parse(mockParams);

      expect(logError).toHaveBeenCalled();
      expect(result).toEqual({
        error:
          "La réponse du modèle est vide ou n'a pas pu être parsée correctement.",
        status: 500,
      });
    });

    it("devrait retourner une erreur si choices est vide", async () => {
      const mockResponse = {
        choices: [],
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockResponse);

      const result = await MistralData.parse(mockParams);

      expect(result).toEqual({
        error:
          "La réponse du modèle est vide ou n'a pas pu être parsée correctement.",
        status: 500,
      });
    });

    it("devrait gérer les erreurs de retry", async () => {
      const error = new Error("Retry failed");
      (retryWithBackoff as jest.Mock).mockRejectedValue(error);

      const result = await MistralData.parse(mockParams);

      expect(logError).toHaveBeenCalledWith(error, "generateCardsAnki");
      expect(result).toEqual({
        error: "Retry failed",
        status: 500,
      });
    });

    it("devrait gérer les erreurs non-Error", async () => {
      (retryWithBackoff as jest.Mock).mockRejectedValue("String error");

      const result = await MistralData.parse(mockParams);

      expect(result).toEqual({
        error: "Une erreur inconnue est survenue",
        status: 500,
      });
    });

    it("devrait utiliser retryWithBackoff avec les bons paramètres", async () => {
      const mockResponse = {
        choices: [{ message: { parsed: [["data"]] } }],
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockResponse);

      await MistralData.parse(mockParams);

      expect(retryWithBackoff).toHaveBeenCalledWith(
        expect.any(Function),
        3, // MAX_RETRIES
        2000 // BASE_DELAY (valeur réelle dans constants/numbers.ts)
      );
    });

    it("devrait gérer toutes les options de paramètres", async () => {
      const fullParams = {
        typeCard: "kanji",
        text: "Full text",
        textFromPdf: "PDF text",
        level: "N1",
        romanji: false,
        furigana: true,
        kanji: true,
        japanese: false,
        numberOfCards: 10,
      };

      const mockResponse = {
        choices: [{ message: { parsed: [["full", "フル", "kanji"]] } }],
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockResponse);

      const result = await MistralData.parse(fullParams);

      expect(Array.isArray(result)).toBe(true);
    });

    it("devrait gérer un grand nombre de cartes", async () => {
      const largeNumber = {
        ...mockParams,
        numberOfCards: 50,
      };

      const mockLargeResult = Array.from({ length: 50 }, (_, i) => [
        `word${i}`,
        `漢字${i}`,
      ]);

      const mockResponse = {
        choices: [{ message: { parsed: mockLargeResult } }],
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockResponse);

      const result = await MistralData.parse(largeNumber);

      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toHaveLength(50);
      }
    });
  });

  describe("process", () => {
    let mockFile: File;
    let mockBlob: Blob;

    beforeEach(() => {
      global.Buffer = Buffer;

      // Créer des mocks avec arrayBuffer pré-défini
      const mockArrayBuffer = async () => new ArrayBuffer(10);

      mockFile = Object.assign(
        new File(["test content"], "test.pdf", {
          type: "application/pdf",
        }),
        { arrayBuffer: mockArrayBuffer }
      );

      mockBlob = Object.assign(
        new Blob(["test image"], { type: "image/png" }),
        { arrayBuffer: mockArrayBuffer }
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("devrait traiter un fichier PDF avec succès", async () => {
      const mockOCRResponse = {
        text: "Extracted text from PDF",
        pages: [{ text: "Page 1" }],
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockOCRResponse);

      const result = await MistralData.process({
        file: mockFile,
        isPDF: true,
      });

      expect(result).toEqual(mockOCRResponse);
      expect(retryWithBackoff).toHaveBeenCalled();
    });

    it("devrait traiter une image avec succès", async () => {
      const mockOCRResponse = {
        text: "Extracted text from image",
        confidence: 0.95,
      };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockOCRResponse);

      const result = await MistralData.process({
        file: mockBlob,
        isPDF: false,
      });

      expect(result).toEqual(mockOCRResponse);
    });

    it("devrait créer un document_url pour PDF", async () => {
      const mockOCRResponse = { text: "PDF text" };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockOCRProcess = jest.fn().mockResolvedValue(mockOCRResponse);
      (mistral.ocr as any) = { process: mockOCRProcess };

      await MistralData.process({ file: mockFile, isPDF: true });

      const ocrCall = mockOCRProcess.mock.calls[0][0];
      expect(ocrCall.document.type).toBe("document_url");
      expect(ocrCall.document.documentUrl).toMatch(/^data:application\/pdf/);
    });

    it("devrait créer un image_url pour image", async () => {
      const mockOCRResponse = { text: "Image text" };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockOCRProcess = jest.fn().mockResolvedValue(mockOCRResponse);
      (mistral.ocr as any) = { process: mockOCRProcess };

      await MistralData.process({ file: mockBlob, isPDF: false });

      const ocrCall = mockOCRProcess.mock.calls[0][0];
      expect(ocrCall.document.type).toBe("image_url");
      expect(ocrCall.document.imageUrl).toMatch(/^data:image\/png/);
    });

    it("devrait inclure includeImageBase64 pour les images", async () => {
      const mockOCRResponse = { text: "Image text" };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockOCRProcess = jest.fn().mockResolvedValue(mockOCRResponse);
      (mistral.ocr as any) = { process: mockOCRProcess };

      await MistralData.process({ file: mockBlob, isPDF: false });

      const ocrCall = mockOCRProcess.mock.calls[0][0];
      expect(ocrCall.includeImageBase64).toBe(true);
    });

    it("ne devrait pas inclure includeImageBase64 pour les PDF", async () => {
      const mockOCRResponse = { text: "PDF text" };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockOCRProcess = jest.fn().mockResolvedValue(mockOCRResponse);
      (mistral.ocr as any) = { process: mockOCRProcess };

      await MistralData.process({ file: mockFile, isPDF: true });

      const ocrCall = mockOCRProcess.mock.calls[0][0];
      expect(ocrCall.includeImageBase64).toBeUndefined();
    });

    it("devrait utiliser le bon modèle OCR", async () => {
      const mockOCRResponse = { text: "text" };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockOCRProcess = jest.fn().mockResolvedValue(mockOCRResponse);
      (mistral.ocr as any) = { process: mockOCRProcess };

      await MistralData.process({ file: mockFile, isPDF: true });

      const ocrCall = mockOCRProcess.mock.calls[0][0];
      expect(ocrCall.model).toBe("mistral-ocr-latest");
    });

    it("devrait gérer les erreurs lors du traitement", async () => {
      const error = new Error("OCR processing failed");
      (retryWithBackoff as jest.Mock).mockRejectedValue(error);

      await expect(
        MistralData.process({ file: mockFile, isPDF: true })
      ).rejects.toThrow("Error in PDF to text conversion.");

      expect(logError).toHaveBeenCalledWith(error, "MistralData.process");
    });

    it("devrait utiliser retryWithBackoff pour OCR", async () => {
      const mockOCRResponse = { text: "text" };

      (retryWithBackoff as jest.Mock).mockResolvedValue(mockOCRResponse);

      await MistralData.process({ file: mockFile, isPDF: true });

      expect(retryWithBackoff).toHaveBeenCalledWith(
        expect.any(Function),
        3, // MAX_RETRIES
        2000 // BASE_DELAY (valeur réelle dans constants/numbers.ts)
      );
    });

    it("devrait convertir correctement le fichier en base64", async () => {
      const mockOCRResponse = { text: "text" };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockOCRProcess = jest.fn().mockResolvedValue(mockOCRResponse);
      (mistral.ocr as any) = { process: mockOCRProcess };

      await MistralData.process({ file: mockFile, isPDF: true });

      const ocrCall = mockOCRProcess.mock.calls[0][0];
      expect(ocrCall.document.documentUrl).toMatch(/^data:application\/pdf;base64,/);
    });

    it("devrait gérer différents types MIME d'images", async () => {
      const jpegBlob = Object.assign(
        new Blob(["jpeg content"], { type: "image/jpeg" }),
        { arrayBuffer: async () => new ArrayBuffer(10) }
      );
      const mockOCRResponse = { text: "text" };

      (retryWithBackoff as jest.Mock).mockImplementation(
        async (fn) => await fn()
      );

      const mockOCRProcess = jest.fn().mockResolvedValue(mockOCRResponse);
      (mistral.ocr as any) = { process: mockOCRProcess };

      await MistralData.process({ file: jpegBlob, isPDF: false });

      const ocrCall = mockOCRProcess.mock.calls[0][0];
      expect(ocrCall.document.imageUrl).toMatch(/^data:image\/jpeg/);
    });
  });
});
