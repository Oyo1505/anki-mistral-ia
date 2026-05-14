/**
 * Unit tests for FooterForm component
 */

import { render, screen } from "@testing-library/react";
import FooterForm from "../form_footer";

describe("FooterForm", () => {
  describe("Component rendering", () => {
    it("should render both footer links", () => {
      render(<FooterForm />);

      const tutorialLink = screen.getByRole("link", {
        name: /tutoriel d'importation/i,
      });
      const downloadLink = screen.getByRole("link", {
        name: /télécharger anki/i,
      });

      expect(tutorialLink).toBeInTheDocument();
      expect(downloadLink).toBeInTheDocument();
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

    it("should use design-system ghost button class", () => {
      render(<FooterForm />);

      const tutorialLink = screen.getByRole("link", {
        name: /tutoriel/i,
      });

      expect(tutorialLink).toHaveClass("ds-btn");
      expect(tutorialLink).toHaveClass("ds-btn--ghost");
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

    it("should use design-system ghost button class", () => {
      render(<FooterForm />);

      const downloadLink = screen.getByRole("link", {
        name: /télécharger anki/i,
      });

      expect(downloadLink).toHaveClass("ds-btn");
      expect(downloadLink).toHaveClass("ds-btn--ghost");
    });
  });

  describe("Accessibility", () => {
    it("should have accessible link text", () => {
      render(<FooterForm />);

      const tutorialLink = screen.getByRole("link", {
        name: /tutoriel/i,
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
    it("should contain two anchor elements", () => {
      const { container } = render(<FooterForm />);

      const links = container.querySelectorAll("a");
      expect(links).toHaveLength(2);
    });
  });
});
