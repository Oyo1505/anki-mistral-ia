/**
 * Unit tests for FormButtonSubmit component
 * Tests button states and disabled logic
 */

import { render, screen } from "@testing-library/react";
import FormButtonSubmit from "../form_button_submit";

describe("FormButtonSubmit", () => {
  describe("Button states", () => {
    it("should render button with default state", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={false} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Générer");
      expect(button).not.toBeDisabled();
    });

    it("should show pending state when generating", () => {
      render(<FormButtonSubmit isPending={true} isSubmitDisabled={false} />);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Génération en cours...");
      expect(button).toBeDisabled();
    });

    it("should show disabled state with message when submit is disabled", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent(
        "Veuillez entrer du texte ou ajouter une image"
      );
      expect(button).toBeDisabled();
    });

    it("should be disabled when both isPending and isSubmitDisabled are true", () => {
      render(<FormButtonSubmit isPending={true} isSubmitDisabled={true} />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Button styling", () => {
    it("should have blue background when enabled", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={false} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-blue-500");
      expect(button).toHaveClass("cursor-pointer");
    });

    it("should have gray background when pending", () => {
      render(<FormButtonSubmit isPending={true} isSubmitDisabled={false} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-400");
      expect(button).toHaveClass("cursor-not-allowed");
    });

    it("should have gray background when submit is disabled", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-400");
      expect(button).toHaveClass("cursor-not-allowed");
    });

    it("should always have common styling classes", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={false} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
      expect(button).toHaveClass("p-2");
      expect(button).toHaveClass("rounded-md");
      expect(button).toHaveClass("text-white");
      expect(button).toHaveClass("font-bold");
    });
  });

  describe("Button attributes", () => {
    it("should have type='submit'", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={false} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should not be disabled when both flags are false", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={false} />);

      const button = screen.getByRole("button");
      expect(button).not.toHaveAttribute("disabled");
    });

    it("should be disabled with isPending=true", () => {
      render(<FormButtonSubmit isPending={true} isSubmitDisabled={false} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });

    it("should be disabled with isSubmitDisabled=true", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });
  });

  describe("Text content priority", () => {
    it("should prioritize isPending text over isSubmitDisabled text", () => {
      render(<FormButtonSubmit isPending={true} isSubmitDisabled={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Génération en cours...");
      expect(button).not.toHaveTextContent(
        "Veuillez entrer du texte ou ajouter une image"
      );
    });

    it("should show submit disabled text when isPending is false", () => {
      render(<FormButtonSubmit isPending={false} isSubmitDisabled={true} />);

      const button = screen.getByRole("button");
      expect(button).not.toHaveTextContent("Génération en cours...");
      expect(button).toHaveTextContent(
        "Veuillez entrer du texte ou ajouter une image"
      );
    });
  });

  describe("Component props", () => {
    it("should handle boolean props correctly", () => {
      const { rerender } = render(
        <FormButtonSubmit isPending={false} isSubmitDisabled={false} />
      );

      let button = screen.getByRole("button");
      expect(button).not.toBeDisabled();

      rerender(<FormButtonSubmit isPending={true} isSubmitDisabled={false} />);
      button = screen.getByRole("button");
      expect(button).toBeDisabled();

      rerender(<FormButtonSubmit isPending={false} isSubmitDisabled={true} />);
      button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });
});
