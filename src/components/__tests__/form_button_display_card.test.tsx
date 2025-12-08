/**
 * Unit tests for ButtonDisplayCard component
 * Tests toggle button logic and visibility
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ButtonDisplayCard from "../form_button_display_card";

describe("ButtonDisplayCard", () => {
  const mockSetIsCsvVisible = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Visibility based on csvDataSuccess", () => {
    it("should render button when csvDataSuccess is true", () => {
      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should not render button when csvDataSuccess is false", () => {
      render(
        <ButtonDisplayCard
          csvDataSuccess={false}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.queryByRole("button");
      expect(button).not.toBeInTheDocument();
    });
  });

  describe("Button text based on isCsvVisible", () => {
    it("should show 'Voir les cartes' when cards are hidden", () => {
      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Voir les cartes");
    });

    it("should show 'Masquer les cartes' when cards are visible", () => {
      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={true}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Masquer les cartes");
    });
  });

  describe("Button click behavior", () => {
    it("should toggle visibility when clicked", async () => {
      const user = userEvent.setup();

      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockSetIsCsvVisible).toHaveBeenCalledTimes(1);
      expect(mockSetIsCsvVisible).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should call setIsCsvVisible with function that toggles based on current prop", async () => {
      const user = userEvent.setup();

      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");
      await user.click(button);

      // Get the function passed to setIsCsvVisible
      const toggleFunction = mockSetIsCsvVisible.mock.calls[0][0];

      // The function ignores its argument and uses the prop value
      // This is because the implementation is: () => !isCsvVisible
      // So it always returns the opposite of the current prop
      expect(toggleFunction(false)).toBe(true); // Returns !isCsvVisible (which is !false = true)
      expect(toggleFunction(true)).toBe(true); // Still returns !isCsvVisible (which is !false = true)
    });

    it("should handle multiple clicks", async () => {
      const user = userEvent.setup();

      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");

      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockSetIsCsvVisible).toHaveBeenCalledTimes(3);
    });
  });

  describe("Button styling", () => {
    it("should have correct CSS classes", () => {
      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
      expect(button).toHaveClass("p-2");
      expect(button).toHaveClass("rounded-md");
      expect(button).toHaveClass("border-2");
      expect(button).toHaveClass("border-gray-300");
      expect(button).toHaveClass("text-center");
      expect(button).toHaveClass("cursor-pointer");
      expect(button).toHaveClass("font-bold");
    });
  });

  describe("Props validation", () => {
    it("should work with all props as true", () => {
      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={true}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Masquer les cartes");
    });

    it("should work with all props as false except setter", () => {
      render(
        <ButtonDisplayCard
          csvDataSuccess={false}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.queryByRole("button");
      expect(button).not.toBeInTheDocument();
    });

    it("should re-render correctly when props change", () => {
      const { rerender } = render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      let button = screen.getByRole("button");
      expect(button).toHaveTextContent("Voir les cartes");

      rerender(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={true}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      button = screen.getByRole("button");
      expect(button).toHaveTextContent("Masquer les cartes");
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();

      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");

      // Focus and press Enter
      button.focus();
      await user.keyboard("{Enter}");

      expect(mockSetIsCsvVisible).toHaveBeenCalled();
    });

    it("should have accessible button role", () => {
      render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAccessibleName();
    });
  });

  describe("Component structure", () => {
    it("should not render any fragments when csvDataSuccess is false", () => {
      const { container } = render(
        <ButtonDisplayCard
          csvDataSuccess={false}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      // Should render empty (null)
      expect(container.firstChild).toBeNull();
    });

    it("should render button inside fragment when csvDataSuccess is true", () => {
      const { container } = render(
        <ButtonDisplayCard
          csvDataSuccess={true}
          isCsvVisible={false}
          setIsCsvVisible={mockSetIsCsvVisible}
        />
      );

      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });
});
