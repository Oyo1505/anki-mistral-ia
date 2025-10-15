/**
 * Unit tests for useAnkiCardGeneration hook
 * Tests business logic for Anki card generation with file processing
 */

// Mock environment and dependencies BEFORE imports
process.env.MISTRAL_API_KEY = "test-api-key-32-characters-long-minimum-required";

jest.mock("react-toastify");
jest.mock("@/actions/mistral.action");
jest.mock("@/services/File-processor-service");
jest.mock("@/utils/time/delay", () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));
jest.mock("@/lib/mistral", () => ({
  mistral: {},
}));
// Create a mock for useDisplayToast that accepts parameters
const mockDisplayToast = jest.fn();
jest.mock("../useDisplayToast", () => ({
  useDisplayToast: jest.fn(() => ({
    displayToast: mockDisplayToast,
  })),
}));

import { renderHook, waitFor } from "@testing-library/react";
import { toast } from "react-toastify";
import { useAnkiCardGeneration } from "../useAnkiCardGeneration";
import { generateAnswer } from "@/actions/mistral.action";
import { fileProcessor } from "@/services/File-processor-service";
import { FormDataSchemaType } from "@/schema/form-schema";

const mockGenerateAnswer = generateAnswer as jest.MockedFunction<
  typeof generateAnswer
>;
const mockFileProcessor = fileProcessor as jest.Mocked<typeof fileProcessor>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe("useAnkiCardGeneration", () => {
  const mockSetValue = jest.fn();
  const mockReset = jest.fn();
  let mockToastId: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockToastId = "toast-123";
    mockToast.loading = jest.fn(() => mockToastId);
    mockToast.dismiss = jest.fn();
    mockToast.error = jest.fn();
  });

  const createMockFormData = (
    overrides?: Partial<FormDataSchemaType>
  ): FormDataSchemaType => ({
    typeCard: "basique",
    level: "N5 Débutant",
    romanji: false,
    kanji: false,
    numberOfCards: 5,
    files: [],
    textFromPdf: undefined,
    text: "test text",
    csv: false,
    japanese: false,
    ...overrides,
  });

  describe("Successful card generation", () => {
    it("should generate cards successfully without file upload", async () => {
      const mockResponse = {
        data: [
          ["Question 1", "Answer 1"],
          ["Question 2", "Answer 2"],
        ],
        status: 200,
        error: null,
        typeCard: "basique",
      };

      mockGenerateAnswer.mockResolvedValue(mockResponse);

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData();

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(mockToast.loading).toHaveBeenCalledWith(
          "En cours de génération",
          { autoClose: false }
        );
        expect(mockGenerateAnswer).toHaveBeenCalledWith(formData);
        expect(mockToast.dismiss).toHaveBeenCalledWith(mockToastId);
      });
    });

    it("should process file before generating cards", async () => {
      const mockFile = new File(["test content"], "test.pdf", {
        type: "application/pdf",
      });
      const processedText = "Extracted text from PDF";

      mockFileProcessor.processFile.mockResolvedValue(processedText);
      mockGenerateAnswer.mockResolvedValue({
        data: [["Q", "A"]],
        status: 200,
        error: null,
        typeCard: "basique",
      });

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData({ files: [mockFile] });

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(mockFileProcessor.processFile).toHaveBeenCalledWith(mockFile);
        expect(mockSetValue).toHaveBeenCalledWith(
          "textFromPdf",
          processedText,
          { shouldValidate: true }
        );
        expect(mockGenerateAnswer).toHaveBeenCalledWith(
          expect.objectContaining({
            textFromPdf: processedText,
          })
        );
      });
    });

    it("should update csvData state on successful generation", async () => {
      const mockCsvData = [
        ["Question 1", "Answer 1"],
        ["Question 2", "Answer 2"],
      ];

      mockGenerateAnswer.mockResolvedValue({
        data: mockCsvData,
        status: 200,
        error: null,
        typeCard: "basique",
      });

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData();

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(result.current.csvData).toEqual(mockCsvData);
      });
    });
  });

  describe("File processing", () => {
    it("should handle file processing when file is present", async () => {
      const mockFile = new File(["image data"], "test.jpg", {
        type: "image/jpeg",
      });
      const extractedText = "Text from image";

      mockFileProcessor.processFile.mockResolvedValue(extractedText);
      mockGenerateAnswer.mockResolvedValue({
        data: [["Q", "A"]],
        status: 200,
        error: null,
        typeCard: "basique",
      });

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData({ files: [mockFile] });

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(mockFileProcessor.processFile).toHaveBeenCalledWith(mockFile);
        expect(mockSetValue).toHaveBeenCalledWith(
          "textFromPdf",
          extractedText,
          { shouldValidate: true }
        );
      });
    });

    it("should skip file processing when no file is provided", async () => {
      mockGenerateAnswer.mockResolvedValue({
        data: [["Q", "A"]],
        status: 200,
        error: null,
        typeCard: "basique",
      });

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData({ files: [] });

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(mockFileProcessor.processFile).not.toHaveBeenCalled();
      });
    });

    it("should handle null result from file processing", async () => {
      const mockFile = new File(["invalid"], "test.txt", {
        type: "text/plain",
      });

      mockFileProcessor.processFile.mockResolvedValue(null);
      mockGenerateAnswer.mockResolvedValue({
        data: [["Q", "A"]],
        status: 200,
        error: null,
        typeCard: "basique",
      });

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData({ files: [mockFile] });

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(mockGenerateAnswer).toHaveBeenCalledWith(
          expect.not.objectContaining({
            textFromPdf: expect.anything(),
          })
        );
      });
    });
  });

  describe("Error handling", () => {
    it("should handle errors from generateAnswer", async () => {
      const errorMessage = "API error occurred";
      mockGenerateAnswer.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData();

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(mockToast.dismiss).toHaveBeenCalledWith(mockToastId);
        expect(mockToast.error).toHaveBeenCalledWith(
          "Erreur lors de la génération des cartes"
        );
      });
    });

    it("should handle file processing errors", async () => {
      const mockFile = new File(["test"], "test.pdf", {
        type: "application/pdf",
      });

      mockFileProcessor.processFile.mockRejectedValue(
        new Error("File processing failed")
      );

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData({ files: [mockFile] });

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(mockToast.dismiss).toHaveBeenCalled();
        expect(mockToast.error).toHaveBeenCalled();
      });
    });

    it("should always dismiss loading toast on error", async () => {
      mockGenerateAnswer.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      const formData = createMockFormData();

      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      await waitFor(() => {
        expect(mockToast.dismiss).toHaveBeenCalledWith(mockToastId);
      });
    });
  });

  describe("isPending state", () => {
    it("should manage isPending state correctly", async () => {
      mockGenerateAnswer.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: [["Q", "A"]],
                  status: 200,
                  error: null,
                  typeCard: "basique",
                }),
              100
            )
          )
      );

      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      expect(result.current.isPending).toBe(false);

      const formData = createMockFormData();
      await waitFor(async () => {
        await result.current.generateCards(formData);
      });

      // After completion, isPending should be false
      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });
    });
  });

  describe("Hook return values", () => {
    it("should return correct initial values", () => {
      const { result } = renderHook(() =>
        useAnkiCardGeneration(mockSetValue, mockReset)
      );

      expect(result.current.csvData).toEqual([]);
      expect(result.current.isPending).toBe(false);
      expect(typeof result.current.generateCards).toBe("function");
    });
  });
});
