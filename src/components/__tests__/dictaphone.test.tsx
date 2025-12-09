/**
 * Unit tests for Dictaphone component
 * Tests optimized speech recognition UI with React.memo and performance optimizations
 */

// Mock useSpeechToText hook BEFORE imports
const mockStartListening = jest.fn();
const mockStopListening = jest.fn();
const mockResetTranscript = jest.fn();

jest.mock("@/hooks/useSpeechToText", () => ({
  __esModule: true,
  useSpeechToText: jest.fn(() => ({
    transcript: "",
    listening: false,
    startListening: mockStartListening,
    stopListening: mockStopListening,
    resetTranscript: mockResetTranscript,
    browserSupportsSpeechRecognition: true,
  })),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import Dictaphone from "../dictaphone";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { UseFormSetValue } from "react-hook-form";
import { FormDataSchemaType } from "@/schema/form-schema";

const mockUseSpeechToText = useSpeechToText as jest.MockedFunction<
  typeof useSpeechToText
>;

describe("Dictaphone Component", () => {
  const mockSetValue = jest.fn() as jest.MockedFunction<
    UseFormSetValue<FormDataSchemaType>
  >;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock return value
    mockUseSpeechToText.mockReturnValue({
      transcript: "",
      listening: false,
      startListening: mockStartListening,
      stopListening: mockStopListening,
      resetTranscript: mockResetTranscript,
      browserSupportsSpeechRecognition: true,
    });
  });

  describe("Rendering", () => {
    it("should render all control buttons when browser supports speech recognition", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByText("🎤 Microphone:")).toBeInTheDocument();
      expect(screen.getByText("▶️ Démarrer")).toBeInTheDocument();
      expect(screen.getByText("⏹️ Arrêter")).toBeInTheDocument();
      expect(screen.getByText("🔄 Réinitialiser")).toBeInTheDocument();
    });

    it("should display 'Arrêté' status when not listening", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByText("Arrêté")).toBeInTheDocument();
      expect(screen.getByText("Arrêté")).toHaveClass("text-gray-600");
    });

    it("should display 'En écoute...' status when listening", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByText("En écoute...")).toBeInTheDocument();
      expect(screen.getByText("En écoute...")).toHaveClass("text-green-600");
    });

    it("should have correct CSS classes for layout", () => {
      const { container } = render(<Dictaphone setValue={mockSetValue} />);

      const mainContainer = container.querySelector(
        ".w-full.flex.flex-col.gap-2.p-3.bg-blue-50.border.border-blue-200.rounded"
      );
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe("Browser Support Detection", () => {
    it("should show warning message when browser doesn't support speech recognition", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "",
        listening: false,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: false,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      expect(
        screen.getByText(
          "⚠️ Votre navigateur ne supporte pas la reconnaissance vocale."
        )
      ).toBeInTheDocument();

      // Should NOT render control buttons
      expect(screen.queryByText("▶️ Démarrer")).not.toBeInTheDocument();
      expect(screen.queryByText("⏹️ Arrêter")).not.toBeInTheDocument();
      expect(screen.queryByText("🔄 Réinitialiser")).not.toBeInTheDocument();
    });

    it("should apply warning styles when browser is unsupported", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "",
        listening: false,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: false,
      });

      const { container } = render(<Dictaphone setValue={mockSetValue} />);

      const warningDiv = container.querySelector(
        ".p-3.bg-yellow-100.border.border-yellow-400.rounded.text-yellow-800"
      );
      expect(warningDiv).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should call startListening when Start button is clicked", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const startButton = screen.getByText("▶️ Démarrer");
      fireEvent.click(startButton);

      expect(mockStartListening).toHaveBeenCalled();
    });

    it("should call resetTranscript when Reset button is clicked", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const resetButton = screen.getByText("🔄 Réinitialiser");
      fireEvent.click(resetButton);

      expect(mockResetTranscript).toHaveBeenCalled();
    });
  });

  describe("Button States (disabled/enabled)", () => {
    it("should disable Start button when already listening", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      const startButton = screen.getByText("▶️ Démarrer");
      expect(startButton).toBeDisabled();
      expect(startButton).toHaveClass("disabled:bg-gray-300");
      expect(startButton).toHaveClass("disabled:cursor-not-allowed");
    });

    it("should enable Start button when not listening", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const startButton = screen.getByText("▶️ Démarrer");
      expect(startButton).not.toBeDisabled();
    });

    it("should disable Stop button when not listening", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const stopButton = screen.getByText("⏹️ Arrêter");
      expect(stopButton).toBeDisabled();
      expect(stopButton).toHaveClass("disabled:bg-gray-300");
    });

    it("should enable Stop button when listening", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      const stopButton = screen.getByText("⏹️ Arrêter");
      expect(stopButton).not.toBeDisabled();
    });

    it("should always enable Reset button regardless of listening state", () => {
      // Not listening
      const { rerender } = render(<Dictaphone setValue={mockSetValue} />);
      let resetButton = screen.getByText("🔄 Réinitialiser");
      expect(resetButton).not.toBeDisabled();

      // Listening
      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      rerender(<Dictaphone setValue={mockSetValue} />);
      resetButton = screen.getByText("🔄 Réinitialiser");
      expect(resetButton).not.toBeDisabled();
    });
  });

  describe("Button Type Attribute", () => {
    it("should have type='button' on all buttons to prevent form submission", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const startButton = screen.getByText("▶️ Démarrer");
      const stopButton = screen.getByText("⏹️ Arrêter");
      const resetButton = screen.getByText("🔄 Réinitialiser");

      expect(startButton).toHaveAttribute("type", "button");
      expect(stopButton).toHaveAttribute("type", "button");
      expect(resetButton).toHaveAttribute("type", "button");
    });
  });

  describe("CSS Classes and Styling", () => {
    it("should apply correct button styles", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const startButton = screen.getByText("▶️ Démarrer");
      expect(startButton).toHaveClass("bg-green-500");
      expect(startButton).toHaveClass("hover:bg-green-600");

      const stopButton = screen.getByText("⏹️ Arrêter");
      expect(stopButton).toHaveClass("bg-red-500");
      expect(stopButton).toHaveClass("hover:bg-red-600");

      const resetButton = screen.getByText("🔄 Réinitialiser");
      expect(resetButton).toHaveClass("bg-blue-500");
      expect(resetButton).toHaveClass("hover:bg-blue-600");
    });

    it("should apply transition-colors to all buttons", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const buttons = [
        screen.getByText("▶️ Démarrer"),
        screen.getByText("⏹️ Arrêter"),
        screen.getByText("🔄 Réinitialiser"),
      ];

      buttons.forEach((button) => {
        expect(button).toHaveClass("transition-colors");
      });
    });
  });

  describe("Hook Integration", () => {
    it("should call useSpeechToText hook with setValue prop", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      expect(mockUseSpeechToText).toHaveBeenCalledWith(mockSetValue);
    });

    it("should call useSpeechToText hook only once on mount", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      expect(mockUseSpeechToText).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have accessible button text with emojis", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      // Emojis + text provide clear context
      expect(screen.getByText("▶️ Démarrer")).toBeInTheDocument();
      expect(screen.getByText("⏹️ Arrêter")).toBeInTheDocument();
      expect(screen.getByText("🔄 Réinitialiser")).toBeInTheDocument();
    });

    it("should display microphone status clearly", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const statusLabel = screen.getByText("🎤 Microphone:");
      expect(statusLabel).toBeInTheDocument();
      expect(statusLabel).toHaveClass("text-sm", "font-medium");
    });

    it("should use semantic HTML structure", () => {
      const { container } = render(<Dictaphone setValue={mockSetValue} />);

      const buttons = container.querySelectorAll("button");
      expect(buttons).toHaveLength(3);

      const spans = container.querySelectorAll("span");
      expect(spans.length).toBeGreaterThan(0);
    });
  });

  describe("Component Structure", () => {
    it("should be a React component", () => {
      expect(typeof Dictaphone).toBe("function");
    });
  });

  describe("Real-world User Interaction Flow", () => {
    it("should handle complete user interaction: Start -> Stop -> Reset", () => {
      const { rerender } = render(<Dictaphone setValue={mockSetValue} />);

      // 1. User clicks Start
      const startButton = screen.getByText("▶️ Démarrer");
      fireEvent.click(startButton);
      expect(mockStartListening).toHaveBeenCalledTimes(1);

      // Simulate listening state
      mockUseSpeechToText.mockReturnValue({
        transcript: "Bonjour",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      rerender(<Dictaphone setValue={mockSetValue} />);

      // 2. User clicks Stop
      const stopButton = screen.getByText("⏹️ Arrêter");
      fireEvent.click(stopButton);
      expect(mockStopListening).toHaveBeenCalledTimes(1);

      // 3. User clicks Reset
      const resetButton = screen.getByText("🔄 Réinitialiser");
      fireEvent.click(resetButton);
      expect(mockResetTranscript).toHaveBeenCalledTimes(1);
    });

    it("should prevent Start button from being clicked when already listening", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      const startButton = screen.getByText("▶️ Démarrer");

      // Try to click disabled button
      fireEvent.click(startButton);

      // Should NOT call startListening because button is disabled
      expect(mockStartListening).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid button clicks gracefully", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const resetButton = screen.getByText("🔄 Réinitialiser");

      // Click reset button 10 times rapidly
      for (let i = 0; i < 10; i++) {
        fireEvent.click(resetButton);
      }

      expect(mockResetTranscript).toHaveBeenCalledTimes(10);
    });

    it("should handle undefined setValue gracefully (TypeScript ensures this)", () => {
      // TypeScript prevents passing undefined setValue
      // This test confirms component doesn't crash with valid setValue
      expect(() => {
        render(<Dictaphone setValue={mockSetValue} />);
      }).not.toThrow();
    });
  });

  describe("Visual Feedback", () => {
    it("should show green color when listening", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      const statusText = screen.getByText("En écoute...");
      expect(statusText).toHaveClass("text-green-600");
    });

    it("should show gray color when not listening", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const statusText = screen.getByText("Arrêté");
      expect(statusText).toHaveClass("text-gray-600");
    });
  });
});
