/**
 * Unit tests for FooterForm component
 * Tests footer links and accessibility
 */

import { render, screen } from "@testing-library/react";
import FooterForm from "../form_footer";

describe("FooterForm", () => {
  describe("Component rendering", () => {
    it("should render both footer links", () => {
      render(<FooterForm />);

      const tutorialLink = screen.getByRole("link", {
        name: /tutoriel pour importer des cartes dans anki/i,
      });
      const downloadLink = screen.getByRole("link", {
        name: /télécharger anki/i,
      });

      expect(tutorialLink).toBeInTheDocument();
      expect(downloadLink).toBeInTheDocument();
    });

    it("should render within a flex container", () => {
      const { container } = render(<FooterForm />);

      const flexContainer = container.firstChild;
      expect(flexContainer).toHaveClass("flex");
      expect(flexContainer).toHaveClass("w-full");
      expect(flexContainer).toHaveClass("items-start");
      expect(flexContainer).toHaveClass("justify-between");
      expect(flexContainer).toHaveClass("gap-2");
    });
  });

  describe("Tutorial link", () => {
    it("should have correct href for tutorial", () => {
      render(<FooterForm />);

      const tutorialLink = screen.getByRole("link", {
        name: /tutoriel/i,
      });

      expect(tutorialLink).toHaveAttribute(
        "href",
        "https://relieved-circle-d57.notion.site/Tuto-cr-ation-carte-basique-Anki-avec-ChatGPT-19a6823eb75b80e7b564dbc8cf73762d"
      );
    });

    it("should open tutorial in new tab", () => {
      render(<FooterForm />);

      const tutorialLink = screen.getByRole("link", {
        name: /tutoriel/i,
      });

      expect(tutorialLink).toHaveAttribute("target", "_blank");
      expect(tutorialLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should have correct styling for tutorial link", () => {
      render(<FooterForm />);

      const tutorialLink = screen.getByRole("link", {
        name: /tutoriel/i,
      });

      expect(tutorialLink).toHaveClass("text-sm");
      expect(tutorialLink).toHaveClass("text-center");
      expect(tutorialLink).toHaveClass("border-2");
      expect(tutorialLink).toHaveClass("bg-blue-500");
      expect(tutorialLink).toHaveClass("text-white");
      expect(tutorialLink).toHaveClass("rounded-md");
      expect(tutorialLink).toHaveClass("p-2");
    });
  });

  describe("Download link", () => {
    it("should have correct href for Anki download", () => {
      render(<FooterForm />);

      const downloadLink = screen.getByRole("link", {
        name: /télécharger anki/i,
      });

      expect(downloadLink).toHaveAttribute("href", "https://apps.ankiweb.net/");
    });

    it("should open download in new tab", () => {
      render(<FooterForm />);

      const downloadLink = screen.getByRole("link", {
        name: /télécharger anki/i,
      });

      expect(downloadLink).toHaveAttribute("target", "_blank");
      expect(downloadLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should have correct styling for download link", () => {
      render(<FooterForm />);

      const downloadLink = screen.getByRole("link", {
        name: /télécharger anki/i,
      });

      expect(downloadLink).toHaveClass("text-sm");
      expect(downloadLink).toHaveClass("text-center");
      expect(downloadLink).toHaveClass("border-2");
      expect(downloadLink).toHaveClass("bg-blue-500");
      expect(downloadLink).toHaveClass("text-white");
      expect(downloadLink).toHaveClass("rounded-md");
      expect(downloadLink).toHaveClass("p-2");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible link text", () => {
      render(<FooterForm />);

      const tutorialLink = screen.getByRole("link", {
        name: /tutoriel pour importer des cartes dans anki/i,
      });
      const downloadLink = screen.getByRole("link", {
        name: /télécharger anki/i,
      });

      expect(tutorialLink).toHaveAccessibleName();
      expect(downloadLink).toHaveAccessibleName();
    });

    it("should have rel='noopener noreferrer' for security", () => {
      render(<FooterForm />);

      const links = screen.getAllByRole("link");

      links.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });

    it("should have target='_blank' for external links", () => {
      render(<FooterForm />);

      const links = screen.getAllByRole("link");

      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });
  });

  describe("Link count", () => {
    it("should render exactly two links", () => {
      render(<FooterForm />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
    });
  });

  describe("Component structure", () => {
    it("should maintain proper HTML structure", () => {
      const { container } = render(<FooterForm />);

      const div = container.querySelector("div");
      expect(div).toBeInTheDocument();

      const links = div?.querySelectorAll("a");
      expect(links).toHaveLength(2);
    });
  });
});
