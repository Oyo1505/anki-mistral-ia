import { expect, test } from '@playwright/test';

/**
 * E2E Tests for Anki Card Generation Form
 * Tests complete user workflow including file upload, card generation, and CSV export
 */

test.describe('Anki Card Generation Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Form initial state', () => {
    test('should display all form fields', async ({ page }) => {
      // Check for main form fields
      await expect(page.getByLabel(/Type de carte/i)).toBeVisible();
      await expect(page.getByLabel(/Niveau/i)).toBeVisible();
      await expect(page.getByLabel(/Nombre de cartes/i)).toBeVisible();
      await expect(page.getByPlaceholder(/Entrez votre texte/i)).toBeVisible();
    });

    test('should have default values set', async ({ page }) => {
      // Check default card type
      const cardTypeSelect = page.locator('select[name="typeCard"]');
      await expect(cardTypeSelect).toHaveValue('basique');

      // Check default level
      const levelSelect = page.locator('select[name="level"]');
      await expect(levelSelect).toHaveValue('N5 Débutant');

      // Check default number of cards
      const numberOfCards = page.locator('input[name="numberOfCards"]');
      await expect(numberOfCards).toHaveValue('5');
    });

    test('should show submit button', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /générer/i });
      await expect(submitButton).toBeVisible();
    });

    test('should not show CSV viewer initially', async ({ page }) => {
      const csvViewer = page.getByText(/Voir les cartes/i);
      await expect(csvViewer).not.toBeVisible();
    });
  });

  test.describe('Form validation', () => {
    test('should disable submit when no text is entered', async ({ page }) => {
      const submitButton = page.getByRole('button');

      // Button should show disabled state message
      await expect(submitButton).toContainText(/Veuillez entrer du texte/i);
      await expect(submitButton).toBeDisabled();
    });

    test('should enable submit when text is entered', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('日本語のテキスト');

      const submitButton = page.getByRole('button');
      await expect(submitButton).toContainText(/générer/i);
      await expect(submitButton).not.toBeDisabled();
    });
  });

  test.describe('Card type selection', () => {
    test('should show romanji checkbox for basique type', async ({ page }) => {
      const cardTypeSelect = page.locator('select[name="typeCard"]');
      await cardTypeSelect.selectOption('basique');

      const romanjiCheckbox = page.getByLabel(/Afficher le Romanji/i);
      await expect(romanjiCheckbox).toBeVisible();
    });

    test('should show kanji checkbox for kanji type', async ({ page }) => {
      const cardTypeSelect = page.locator('select[name="typeCard"]');
      await cardTypeSelect.selectOption('kanji');

      const kanjiCheckbox = page.getByLabel(/Afficher le Kanji/i);
      await expect(kanjiCheckbox).toBeVisible();
    });

    test('should change available options based on card type', async ({ page }) => {
      const cardTypeSelect = page.locator('select[name="typeCard"]');

      // Select basique
      await cardTypeSelect.selectOption('basique');
      await expect(page.getByLabel(/Afficher le Romanji/i)).toBeVisible();

      // Select kanji
      await cardTypeSelect.selectOption('kanji');
      await expect(page.getByLabel(/Afficher le Kanji/i)).toBeVisible();
    });
  });

  test.describe('Level selection', () => {
    test('should allow selecting different levels', async ({ page }) => {
      const levelSelect = page.locator('select[name="level"]');

      await levelSelect.selectOption('N4 Pré-intermédiaire');
      await expect(levelSelect).toHaveValue('N4 Pré-intermédiaire');

      await levelSelect.selectOption('N1 Avancé');
      await expect(levelSelect).toHaveValue('N1 Avancé');
    });

    test('should display all JLPT levels', async ({ page }) => {
      const levelSelect = page.locator('select[name="level"]');
      const options = await levelSelect.locator('option').allTextContents();

      expect(options).toContain('N5 Débutant');
      expect(options).toContain('N4 Pré-intermédiaire');
      expect(options).toContain('N3 Intermédiaire');
      expect(options).toContain('N2 Pré-avancé');
      expect(options).toContain('N1 Avancé');
    });
  });

  test.describe('Number of cards', () => {
    test('should allow changing number of cards', async ({ page }) => {
      const numberOfCards = page.locator('input[name="numberOfCards"]');

      await numberOfCards.fill('10');
      await expect(numberOfCards).toHaveValue('10');

      await numberOfCards.fill('3');
      await expect(numberOfCards).toHaveValue('3');
    });

    test('should accept valid number input', async ({ page }) => {
      const numberOfCards = page.locator('input[name="numberOfCards"]');

      await numberOfCards.fill('15');
      await expect(numberOfCards).toHaveValue('15');
    });
  });

  test.describe('File upload', () => {
    test('should show file upload button', async ({ page }) => {
      const uploadButton = page.getByText(/Ajouter une image ou un PDF/i);
      await expect(uploadButton).toBeVisible();
    });

    test('should display file name after upload', async ({ page }) => {
      // Create a test file
      const buffer = Buffer.from('test file content');

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: buffer,
      });

      // File name should be displayed
      await expect(page.getByText('test.pdf')).toBeVisible();
    });

    test('should allow removing uploaded file', async ({ page }) => {
      const buffer = Buffer.from('test file content');

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'test-image.jpg',
        mimeType: 'image/jpeg',
        buffer: buffer,
      });

      await expect(page.getByText('test-image.jpg')).toBeVisible();

      // Click remove button
      const removeButton = page.getByRole('button', { name: /supprimer/i });
      await removeButton.click();

      await expect(page.getByText('test-image.jpg')).not.toBeVisible();
    });
  });

  test.describe('Form submission', () => {
    test('should show loading state during generation', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テストテキスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Should show loading state
      await expect(page.getByText(/Génération en cours/i)).toBeVisible();
    });

    test('should display toast notification on success', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('日本語');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Wait for success toast
      await expect(page.getByText(/Génération terminée/i)).toBeVisible({
        timeout: 15000,
      });
    });
  });

  test.describe('CSV display and export', () => {
    test('should show toggle button after successful generation', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('日本語のテキスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Wait for generation to complete
      await expect(page.getByText(/Génération terminée/i)).toBeVisible({
        timeout: 15000,
      });

      // Toggle button should appear
      await expect(page.getByRole('button', { name: /Voir les cartes/i })).toBeVisible();
    });

    test('should toggle CSV viewer visibility', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(page.getByText(/Génération terminée/i)).toBeVisible({
        timeout: 15000,
      });

      const toggleButton = page.getByRole('button', { name: /Voir les cartes/i });
      await toggleButton.click();

      // CSV viewer should be visible
      await expect(page.getByRole('table')).toBeVisible();

      // Button text should change
      await expect(page.getByRole('button', { name: /Masquer les cartes/i })).toBeVisible();

      // Click again to hide
      await toggleButton.click();
      await expect(page.getByRole('table')).not.toBeVisible();
    });

    test('should show CSV export link', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テキスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(page.getByText(/Génération terminée/i)).toBeVisible({
        timeout: 15000,
      });

      // CSV export link should be available
      const exportLink = page.getByText(/Télécharger le CSV/i);
      await expect(exportLink).toBeVisible();
    });
  });

  test.describe('Form footer', () => {
    test('should display tutorial link', async ({ page }) => {
      const tutorialLink = page.getByRole('link', {
        name: /Tutoriel pour importer des cartes dans Anki/i,
      });

      await expect(tutorialLink).toBeVisible();
      await expect(tutorialLink).toHaveAttribute('href', /notion\.site/);
      await expect(tutorialLink).toHaveAttribute('target', '_blank');
    });

    test('should display Anki download link', async ({ page }) => {
      const downloadLink = page.getByRole('link', {
        name: /Télécharger Anki/i,
      });

      await expect(downloadLink).toBeVisible();
      await expect(downloadLink).toHaveAttribute('href', 'https://apps.ankiweb.net/');
      await expect(downloadLink).toHaveAttribute('target', '_blank');
    });
  });

  test.describe('Form reset after success', () => {
    test('should reset text field after successful generation', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(page.getByText(/Génération terminée/i)).toBeVisible({
        timeout: 15000,
      });

      // Text area should be empty
      await expect(textArea).toHaveValue('');
    });

    test('should preserve card type after reset', async ({ page }) => {
      const cardTypeSelect = page.locator('select[name="typeCard"]');
      await cardTypeSelect.selectOption('kanji');

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('漢字');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(page.getByText(/Génération terminée/i)).toBeVisible({
        timeout: 15000,
      });

      // Card type should be preserved
      await expect(cardTypeSelect).toHaveValue('kanji');
    });
  });

  test.describe('Responsive design', () => {
    test('should be usable on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // All elements should still be visible and usable
      await expect(page.getByLabel(/Type de carte/i)).toBeVisible();
      await expect(page.getByPlaceholder(/Entrez votre texte/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /générer/i })).toBeVisible();
    });

    test('should be usable on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(page.getByLabel(/Type de carte/i)).toBeVisible();
      await expect(page.getByPlaceholder(/Entrez votre texte/i)).toBeVisible();
    });
  });
});
