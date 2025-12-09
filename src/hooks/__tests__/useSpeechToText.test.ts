/**
 * Unit tests for useSpeechToText hook
 * Tests optimized speech recognition with debouncing and performance optimizations
 */

import { renderHook, waitFor, act } from "@testing-library/react";
import { UseFormSetValue } from "react-hook-form";
import { FormDataSchemaType } from "@/schema/form-schema";

// Mock react-speech-recognition
const mockStartListening = jest.fn();
const mockStopListening = jest.fn();
const mockResetTranscript = jest.fn();
let mockTranscript = "";
let mockListening = false;
let mockBrowserSupport = true;

jest.mock("react-speech-recognition", () => ({
  __esModule: true,
  default: {
    startListening: (...args: any[]) => mockStartListening(...args),
    stopListening: () => mockStopListening(),
  },
  useSpeechRecognition: () => ({
    transcript: mockTranscript,
    listening: mockListening,
    resetTranscript: mockResetTranscript,
    browserSupportsSpeechRecognition: mockBrowserSupport,
  }),
}));

import { useSpeechToText } from "../useSpeechToText";

describe("useSpeechToText", () => {
  const mockSetValue = jest.fn() as jest.MockedFunction<
    UseFormSetValue<FormDataSchemaType>
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockTranscript = "";
    mockListening = false;
    mockBrowserSupport = true;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Initialization", () => {
    it("should initialize correctly", () => {
      const { result } = renderHook(() => useSpeechToText(mockSetValue));

      expect(result.current.listening).toBe(false);
      expect(result.current.browserSupportsSpeechRecognition).toBe(true);
      expect(typeof result.current.startListening).toBe("function");
    });

    it("should not call setValue on initialization", () => {
      renderHook(() => useSpeechToText(mockSetValue));
      expect(mockSetValue).not.toHaveBeenCalled();
    });
  });

  describe("Browser Support", () => {
    it("should handle unsupported browsers", () => {
      mockBrowserSupport = false;
      const { result } = renderHook(() => useSpeechToText(mockSetValue));
      expect(result.current.browserSupportsSpeechRecognition).toBe(false);
    });
  });

  describe("startListening", () => {
    it("should call SpeechRecognition.startListening with correct config", () => {
      const { result } = renderHook(() => useSpeechToText(mockSetValue));

      act(() => {
        result.current.startListening();
      });

      expect(mockStartListening).toHaveBeenCalledWith({
        continuous: false,
        language: "fr-FR",
      });
    });
  });

  describe("stopListening", () => {
    it("should call SpeechRecognition.stopListening", () => {
      const { result } = renderHook(() => useSpeechToText(mockSetValue));

      act(() => {
        result.current.stopListening();
      });

      expect(mockStopListening).toHaveBeenCalled();
    });
  });

  describe("Debouncing Optimization", () => {
    it("should debounce transcript updates (150ms)", async () => {
      const { rerender } = renderHook(() => useSpeechToText(mockSetValue));

      mockTranscript = "Bonjour";
      mockListening = true;
      rerender();

      expect(mockSetValue).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(150);
      });

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledWith("text", "Bonjour", {
          shouldValidate: false,
        });
      });
    });

    it("should demonstrate performance optimization with rapid updates", async () => {
      const { rerender } = renderHook(() => useSpeechToText(mockSetValue));

      const words = ["B", "Bo", "Bon", "Bonjour"];

      words.forEach((word) => {
        mockTranscript = word;
        mockListening = true;
        rerender();

        act(() => {
          jest.advanceTimersByTime(50);
        });
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(mockSetValue).toHaveBeenCalledTimes(1);
        expect(mockSetValue).toHaveBeenCalledWith("text", "Bonjour", {
          shouldValidate: false,
        });
      });
    });
  });

  describe("useRef Optimization", () => {
    it("should not call setValue if transcript is empty", async () => {
      const { rerender } = renderHook(() => useSpeechToText(mockSetValue));

      mockTranscript = "";
      mockListening = true;
      rerender();

      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(mockSetValue).not.toHaveBeenCalled();
    });
  });

  describe("resetTranscript", () => {
    it("should reset and clear form field", () => {
      const { result } = renderHook(() => useSpeechToText(mockSetValue));

      act(() => {
        result.current.resetTranscript();
      });

      expect(mockResetTranscript).toHaveBeenCalled();
      expect(mockSetValue).toHaveBeenCalledWith("text", "", {
        shouldValidate: false,
      });
    });
  });

  describe("Cleanup", () => {
    it("should cleanup debounce timer on unmount", () => {
      const { rerender, unmount } = renderHook(() =>
        useSpeechToText(mockSetValue)
      );

      mockTranscript = "Test";
      mockListening = true;
      rerender();

      unmount();

      act(() => {
        jest.advanceTimersByTime(150);
      });

      expect(mockSetValue).not.toHaveBeenCalled();
    });
  });
});
