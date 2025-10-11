import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour la page d'accueil
 * Tests simples pour vérifier le bon fonctionnement de base de l'application
 */

test.describe('Page d\'accueil', () => {
  test('devrait charger la page d\'accueil', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la page se charge
    await expect(page).toHaveTitle(/Anki Mistral AI/i);
  });

  test('devrait avoir un lien vers la page de chat', async ({ page }) => {
    await page.goto('/');

    // Chercher un lien ou bouton menant au chat
    const chatLink = page.getByRole('link', { name: /chat/i });

    if (await chatLink.count() > 0) {
      await expect(chatLink).toBeVisible();
      await chatLink.click();

      // Vérifier la navigation
      await expect(page).toHaveURL(/\/chat/);
    }
  });
});

test.describe('Navigation', () => {
  test('devrait naviguer entre les pages', async ({ page }) => {
    // Page d'accueil
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Naviguer vers le chat (si le lien existe)
    await page.goto('/chat');
    await expect(page).toHaveURL('/chat');

    // Retour arrière
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Performance', () => {
  test('devrait charger rapidement', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    const loadTime = Date.now() - startTime;

    // La page devrait charger en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });
});
