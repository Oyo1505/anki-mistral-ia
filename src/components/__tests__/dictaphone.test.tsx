/**
 * Unit tests for Dictaphone component
 */

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
import { FormDataSchemaInputType } from "@/schema/form-schema";

const mockUseSpeechToText = useSpeechToText as jest.MockedFunction<
  typeof useSpeechToText
>;

describe("Dictaphone Component", () => {
  const mockSetValue = jest.fn() as jest.MockedFunction<
    UseFormSetValue<FormDataSchemaInputType>
  >;

  beforeEach(() => {
    jest.clearAllMocks();
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
    it("should render control buttons when browser supports speech recognition", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByText("Reconnaissance vocale")).toBeInTheDocument();
      expect(screen.getByLabelText("Démarrer la reconnaissance vocale")).toBeInTheDocument();
      expect(screen.getByLabelText("Réinitialiser la transcription")).toBeInTheDocument();
    });

    it("should display 'Arrêté' status when not listening", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByText("Arrêté")).toBeInTheDocument();
    });

    it("should display 'En écoute…' status when listening", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByText("En écoute…")).toBeInTheDocument();
    });

    it("should not render emoji characters", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const body = document.body.textContent || "";
      expect(body).not.toContain("🎤");
      expect(body).not.toContain("▶️");
      expect(body).not.toContain("⏹️");
      expect(body).not.toContain("🔄");
    });
  });

  describe("Browser Support Detection", () => {
    it("should show warning message when browser does not support speech recognition", () => {
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
        screen.getByText("Votre navigateur ne supporte pas la reconnaissance vocale.")
      ).toBeInTheDocument();

      expect(screen.queryByLabelText("Démarrer la reconnaissance vocale")).not.toBeInTheDocument();
    });

    it("should have role=alert on warning", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "",
        listening: false,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: false,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should call startListening when Démarrer button is clicked", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      fireEvent.click(screen.getByLabelText("Démarrer la reconnaissance vocale"));

      expect(mockStartListening).toHaveBeenCalled();
    });

    it("should call resetTranscript when Réinitialiser button is clicked", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      fireEvent.click(screen.getByLabelText("Réinitialiser la transcription"));

      expect(mockResetTranscript).toHaveBeenCalled();
    });

    it("should call stopListening when Arrêter button is clicked while listening", () => {
      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });

      render(<Dictaphone setValue={mockSetValue} />);

      fireEvent.click(screen.getByLabelText("Arrêter la reconnaissance vocale"));

      expect(mockStopListening).toHaveBeenCalled();
    });
  });

  describe("Button States", () => {
    it("should show Démarrer when not listening and Arrêter when listening", () => {
      const { rerender } = render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByLabelText("Démarrer la reconnaissance vocale")).toBeInTheDocument();
      expect(screen.queryByLabelText("Arrêter la reconnaissance vocale")).not.toBeInTheDocument();

      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });
      rerender(<Dictaphone setValue={mockSetValue} />);

      expect(screen.queryByLabelText("Démarrer la reconnaissance vocale")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Arrêter la reconnaissance vocale")).toBeInTheDocument();
    });

    it("should always show Réinitialiser button", () => {
      const { rerender } = render(<Dictaphone setValue={mockSetValue} />);
      expect(screen.getByLabelText("Réinitialiser la transcription")).toBeInTheDocument();

      mockUseSpeechToText.mockReturnValue({
        transcript: "Test",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });
      rerender(<Dictaphone setValue={mockSetValue} />);
      expect(screen.getByLabelText("Réinitialiser la transcription")).toBeInTheDocument();
    });
  });

  describe("Button Type Attribute", () => {
    it("should have type='button' to prevent form submission", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => {
        expect(btn).toHaveAttribute("type", "button");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible aria-labels on all control buttons", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByLabelText("Démarrer la reconnaissance vocale")).toBeInTheDocument();
      expect(screen.getByLabelText("Réinitialiser la transcription")).toBeInTheDocument();
    });

    it("should use role=group on controls container", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      expect(screen.getByRole("group", { name: "Contrôles du microphone" })).toBeInTheDocument();
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

  describe("Real-world Interaction Flow", () => {
    it("should handle complete flow: Start → Stop → Reset", () => {
      const { rerender } = render(<Dictaphone setValue={mockSetValue} />);

      fireEvent.click(screen.getByLabelText("Démarrer la reconnaissance vocale"));
      expect(mockStartListening).toHaveBeenCalledTimes(1);

      mockUseSpeechToText.mockReturnValue({
        transcript: "Bonjour",
        listening: true,
        startListening: mockStartListening,
        stopListening: mockStopListening,
        resetTranscript: mockResetTranscript,
        browserSupportsSpeechRecognition: true,
      });
      rerender(<Dictaphone setValue={mockSetValue} />);

      fireEvent.click(screen.getByLabelText("Arrêter la reconnaissance vocale"));
      expect(mockStopListening).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByLabelText("Réinitialiser la transcription"));
      expect(mockResetTranscript).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid reset clicks gracefully", () => {
      render(<Dictaphone setValue={mockSetValue} />);

      const resetButton = screen.getByLabelText("Réinitialiser la transcription");
      for (let i = 0; i < 10; i++) {
        fireEvent.click(resetButton);
      }

      expect(mockResetTranscript).toHaveBeenCalledTimes(10);
    });

    it("should not throw with valid setValue prop", () => {
      expect(() => {
        render(<Dictaphone setValue={mockSetValue} />);
      }).not.toThrow();
    });
  });

  describe("Component Structure", () => {
    it("should be a React component", () => {
      expect(typeof Dictaphone).toBe("function");
    });
  });
});
