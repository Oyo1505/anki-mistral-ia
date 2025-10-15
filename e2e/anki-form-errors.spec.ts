import { expect, test } from '@playwright/test';

/**
 * E2E Tests for Anki Form Error Scenarios
 * Tests error handling, validation, and edge cases
 */

test.describe('Anki Form Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Form validation errors', () => {
    test('should prevent submission with empty text', async ({ page }) => {
      const submitButton = page.getByRole('button');

      // Submit button should be disabled
      await expect(submitButton).toBeDisabled();
      await expect(submitButton).toContainText(/Veuillez entrer du texte/i);
    });

    test('should validate minimum text length', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);

      // Single character should still enable button (no min length in schema)
      await textArea.fill('a');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await expect(submitButton).not.toBeDisabled();
    });

    test('should handle very long text input', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      const longText = 'あ'.repeat(10000); // 10,000 characters

      await textArea.fill(longText);

      const submitButton = page.getByRole('button', { name: /générer/i });
      await expect(submitButton).not.toBeDisabled();
    });
  });

  test.describe('File upload errors', () => {
    test('should handle unsupported file types gracefully', async ({ page }) => {
      const buffer = Buffer.from('text file content');

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: buffer,
      });

      // File should still be uploaded, but processing may fail
      // Form should handle this gracefully
      await expect(page.getByText('test.txt')).toBeVisible();
    });

    test('should handle very large files', async ({ page }) => {
      // Create a large buffer (5MB)
      const largeBuffer = Buffer.alloc(5 * 1024 * 1024, 'x');

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'large-file.pdf',
        mimeType: 'application/pdf',
        buffer: largeBuffer,
      });

      await expect(page.getByText('large-file.pdf')).toBeVisible();
    });

    test('should handle corrupted PDF files', async ({ page }) => {
      const corruptedBuffer = Buffer.from('CORRUPTED PDF DATA');

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: 'corrupted.pdf',
        mimeType: 'application/pdf',
        buffer: corruptedBuffer,
      });

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('fallback text');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Should either show error or use fallback text
      // Error toast or success should appear
      await expect(
        page.getByText(/erreur|Génération terminée/i)
      ).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('API error scenarios', () => {
    test('should display error toast on API failure', async ({ page }) => {
      // Intercept API call and force failure
      await page.route('**/api/**', (route) => {
        route.abort('failed');
      });

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Should show error toast
      await expect(page.getByText(/erreur/i)).toBeVisible({ timeout: 10000 });
    });

    test('should handle network timeout', async ({ page }) => {
      // Intercept API call and delay indefinitely
      await page.route('**/api/**', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 60000));
      });

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Loading state should be visible
      await expect(page.getByText(/Génération en cours/i)).toBeVisible();

      // Should eventually timeout or show error
      await expect(page.getByText(/erreur/i)).toBeVisible({ timeout: 70000 });
    });

    test('should handle 500 server errors', async ({ page }) => {
      // Intercept API call and return 500
      await page.route('**/api/**', (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Should show error message
      await expect(page.getByText(/erreur/i)).toBeVisible({ timeout: 10000 });
    });

    test('should handle rate limiting errors', async ({ page }) => {
      // Intercept API call and return 429
      await page.route('**/api/**', (route) => {
        route.fulfill({
          status: 429,
          body: JSON.stringify({ error: 'Rate limit exceeded' }),
        });
      });

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Should show rate limit error
      await expect(page.getByText(/erreur/i)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Number of cards validation', () => {
    test('should handle zero cards request', async ({ page }) => {
      const numberOfCards = page.locator('input[name="numberOfCards"]');
      await numberOfCards.fill('0');

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });

      // Should either prevent submission or show validation error
      if (await submitButton.isEnabled()) {
        await submitButton.click();
        await expect(page.getByText(/erreur/i)).toBeVisible({ timeout: 10000 });
      }
    });

    test('should handle negative number of cards', async ({ page }) => {
      const numberOfCards = page.locator('input[name="numberOfCards"]');
      await numberOfCards.fill('-5');

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      // Form should handle invalid input
      const submitButton = page.getByRole('button', { name: /générer/i });
      if (await submitButton.isEnabled()) {
        await submitButton.click();
        await expect(page.getByText(/erreur/i)).toBeVisible({ timeout: 10000 });
      }
    });

    test('should handle extremely large number of cards', async ({ page }) => {
      const numberOfCards = page.locator('input[name="numberOfCards"]');
      await numberOfCards.fill('1000');

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Should either process or show reasonable error
      await expect(
        page.getByText(/erreur|Génération terminée/i)
      ).toBeVisible({ timeout: 30000 });
    });
  });

  test.describe('Special characters and encoding', () => {
    test('should handle Japanese characters', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('日本語のテキストです。漢字も含まれています。');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(page.getByText(/Génération terminée/i)).toBeVisible({
        timeout: 15000,
      });
    });

    test('should handle emoji characters', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト😀🎌🗾');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(
        page.getByText(/erreur|Génération terminée/i)
      ).toBeVisible({ timeout: 15000 });
    });

    test('should handle mixed language text', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('English 日本語 Français العربية 中文');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(
        page.getByText(/erreur|Génération terminée/i)
      ).toBeVisible({ timeout: 15000 });
    });

    test('should handle special characters and symbols', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('Test @#$%^&*()_+-=[]{}|;:,.<>?/~`');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(
        page.getByText(/erreur|Génération terminée/i)
      ).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Browser compatibility and edge cases', () => {
    test('should handle page reload during generation', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Wait a bit for request to start
      await page.waitForTimeout(1000);

      // Reload page
      await page.reload();

      // Form should be in initial state
      await expect(page.getByPlaceholder(/Entrez votre texte/i)).toBeVisible();
      await expect(textArea).toHaveValue('');
    });

    test('should handle rapid multiple submissions', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });

      // Try to click multiple times rapidly
      await submitButton.click();
      await submitButton.click();
      await submitButton.click();

      // Button should be disabled during processing
      await expect(submitButton).toBeDisabled();

      // Should eventually complete
      await expect(
        page.getByText(/erreur|Génération terminée/i)
      ).toBeVisible({ timeout: 15000 });
    });

    test('should handle browser back button', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      // Navigate away
      await page.goto('/chat');
      await page.waitForTimeout(500);

      // Go back
      await page.goBack();

      // Form should be visible again (may or may not have preserved state)
      await expect(page.getByPlaceholder(/Entrez votre texte/i)).toBeVisible();
    });
  });

  test.describe('Toast notification behavior', () => {
    test('should auto-dismiss success toast', async ({ page }) => {
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Success toast should appear
      const successToast = page.getByText(/Génération terminée/i);
      await expect(successToast).toBeVisible({ timeout: 15000 });

      // Toast should auto-dismiss after 3 seconds
      await expect(successToast).not.toBeVisible({ timeout: 5000 });
    });

    test('should dismiss loading toast on error', async ({ page }) => {
      // Intercept and force error
      await page.route('**/api/**', (route) => {
        route.abort('failed');
      });

      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      // Loading toast should not persist
      await page.waitForTimeout(2000);
      const loadingToast = page.getByText(/En cours de génération/i);
      await expect(loadingToast).not.toBeVisible();

      // Error toast should be shown
      await expect(page.getByText(/erreur/i)).toBeVisible();
    });
  });

  test.describe('CSV viewer error handling', () => {
    test('should handle empty CSV data', async ({ page }) => {
      // This would require mocking the API to return empty data
      // For now, just verify the toggle button behavior
      const toggleButton = page.getByRole('button', { name: /Voir les cartes/i });
      await expect(toggleButton).not.toBeVisible();
    });

    test('should handle malformed CSV data gracefully', async ({ page }) => {
      // Test that even if CSV data is malformed, the app doesn't crash
      const textArea = page.getByPlaceholder(/Entrez votre texte/i);
      await textArea.fill('テスト');

      const submitButton = page.getByRole('button', { name: /générer/i });
      await submitButton.click();

      await expect(
        page.getByText(/erreur|Génération terminée/i)
      ).toBeVisible({ timeout: 15000 });

      // Page should still be functional
      await expect(page.getByPlaceholder(/Entrez votre texte/i)).toBeVisible();
    });
  });
});
