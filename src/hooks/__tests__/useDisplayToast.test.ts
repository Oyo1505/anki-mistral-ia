/**
 * Unit tests for useDisplayToast hook
 * Tests toast notification display logic and form reset functionality
 */

import { renderHook } from "@testing-library/react";
import { toast } from "react-toastify";
import { useDisplayToast } from "../useDisplayToast";

// Mock react-toastify
jest.mock("react-toastify");

const mockToast = toast as jest.Mocked<typeof toast>;

describe("useDisplayToast", () => {
  const mockSetCsvData = jest.fn();
  const mockReset = jest.fn();
  const mockToastId = "toast-123";

  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
    mockToast.dismiss = jest.fn();
  });

  describe("Success scenario", () => {
    it("should display success toast and update csvData on successful generation", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      const mockCsvData = [
        ["Question 1", "Answer 1"],
        ["Question 2", "Answer 2"],
      ];

      result.current.displayToast({
        dataRes: mockCsvData,
        status: 200,
        error: null,
        id: mockToastId,
        typeCard: "basique",
      });

      expect(mockSetCsvData).toHaveBeenCalledWith(mockCsvData);
      expect(mockToast.success).toHaveBeenCalledWith("Génération terminée", {
        autoClose: 3000,
      });
      expect(mockReset).toHaveBeenCalledWith({ typeCard: "basique" });
    });

    it("should reset form with correct typeCard on success", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      result.current.displayToast({
        dataRes: [["Q", "A"]],
        status: 200,
        error: null,
        id: mockToastId,
        typeCard: "kanji",
      });

      expect(mockReset).toHaveBeenCalledWith({ typeCard: "kanji" });
    });

    it("should handle undefined typeCard", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      result.current.displayToast({
        dataRes: [["Q", "A"]],
        status: 200,
        error: null,
        id: mockToastId,
        typeCard: undefined,
      });

      expect(mockReset).toHaveBeenCalledWith({ typeCard: undefined });
    });
  });

  describe("Error scenario - status 500", () => {
    it("should display error toast and dismiss loading toast on 500 error", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      const errorMessage = "Server error occurred";

      result.current.displayToast({
        dataRes: null,
        status: 500,
        error: errorMessage,
        id: mockToastId,
        typeCard: undefined,
      });

      expect(mockToast.dismiss).toHaveBeenCalledWith(mockToastId);
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockSetCsvData).not.toHaveBeenCalled();
      expect(mockReset).not.toHaveBeenCalled();
    });

    it("should not update csvData on error", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      result.current.displayToast({
        dataRes: null,
        status: 500,
        error: "API rate limit exceeded",
        id: mockToastId,
        typeCard: undefined,
      });

      expect(mockSetCsvData).not.toHaveBeenCalled();
    });
  });

  describe("Unexpected error scenario", () => {
    it("should display generic error message for unexpected errors", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      result.current.displayToast({
        dataRes: null,
        status: 400,
        error: null,
        id: mockToastId,
        typeCard: undefined,
      });

      expect(mockToast.dismiss).toHaveBeenCalledWith(mockToastId);
      expect(mockToast.error).toHaveBeenCalledWith(
        "Une erreur inattendue s'est produite"
      );
      expect(mockSetCsvData).not.toHaveBeenCalled();
      expect(mockReset).not.toHaveBeenCalled();
    });

    it("should handle status 404", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      result.current.displayToast({
        dataRes: null,
        status: 404,
        error: null,
        id: mockToastId,
        typeCard: undefined,
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        "Une erreur inattendue s'est produite"
      );
    });

    it("should handle null dataRes with status 200", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      result.current.displayToast({
        dataRes: null,
        status: 200,
        error: null,
        id: mockToastId,
        typeCard: "basique",
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        "Une erreur inattendue s'est produite"
      );
      expect(mockSetCsvData).not.toHaveBeenCalled();
    });
  });

  describe("Hook return value", () => {
    it("should return displayToast function", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      expect(result.current).toHaveProperty("displayToast");
      expect(typeof result.current.displayToast).toBe("function");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty csvData array", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      result.current.displayToast({
        dataRes: [],
        status: 200,
        error: null,
        id: mockToastId,
        typeCard: "basique",
      });

      expect(mockSetCsvData).toHaveBeenCalledWith([]);
      expect(mockToast.success).toHaveBeenCalled();
    });

    it("should handle large csvData arrays", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      const largeCsvData = Array.from({ length: 100 }, (_, i) => [
        `Question ${i}`,
        `Answer ${i}`,
      ]);

      result.current.displayToast({
        dataRes: largeCsvData,
        status: 200,
        error: null,
        id: mockToastId,
        typeCard: "basique",
      });

      expect(mockSetCsvData).toHaveBeenCalledWith(largeCsvData);
      expect(mockToast.success).toHaveBeenCalled();
    });

    it("should handle error with empty message", () => {
      const { result } = renderHook(() =>
        useDisplayToast(mockSetCsvData, mockReset)
      );

      result.current.displayToast({
        dataRes: null,
        status: 500,
        error: "",
        id: mockToastId,
        typeCard: undefined,
      });

      // Empty string is falsy in JavaScript, so it falls through to the else case
      expect(mockToast.dismiss).toHaveBeenCalledWith(mockToastId);
      expect(mockToast.error).toHaveBeenCalledWith("Une erreur inattendue s'est produite");
    });
  });
});
