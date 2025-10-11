import { expect, test } from '@playwright/test';

/**
 * Tests E2E pour le formulaire du chatbot
 * Ce fichier teste le comportement réel du formulaire avec tous les imports dynamiques
 */

test.describe('Formulaire ChatBot', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguez vers la page du chat
    await page.goto('/chat');
  });

  test('devrait afficher le formulaire initial', async ({ page }) => {
    // Attendre que le formulaire soit chargé
    await expect(page.getByLabel('Nom*')).toBeVisible();
    await expect(page.getByLabel("Type d'exercice*")).toBeVisible();
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
  });

  test('devrait valider les champs requis', async ({ page }) => {
    // Cliquer sur submit sans remplir
    await page.getByRole('button', { name: /submit/i }).click();

    // Vérifier les messages d'erreur
    await expect(page.getByText('Le nom est requis')).toBeVisible();
  });

  test('devrait soumettre le formulaire avec des données valides', async ({ page }) => {
    // Remplir le formulaire
    await page.getByLabel('Nom*').fill('John');
    await page.getByLabel("Type d'exercice*").fill('grammaire');

    // Sélectionner le niveau
    await page.getByRole('combobox').selectOption('N2 Pré-avancé');

    // Soumettre
    await page.getByRole('button', { name: /submit/i }).click();

    // Vérifier que le formulaire disparaît (isSubmitted = true)
    await expect(page.getByLabel('Nom*')).not.toBeVisible({ timeout: 5000 });
  });

  test('devrait rejeter un nom trop long', async ({ page }) => {
    const longName = 'a'.repeat(21); // Plus de 20 caractères

    await page.getByLabel('Nom*').fill(longName);
    await page.getByLabel("Type d'exercice*").fill('vocabulaire');
    await page.getByRole('button', { name: /submit/i }).click();

    // Le formulaire ne devrait pas disparaître
    await expect(page.getByLabel('Nom*')).toBeVisible();
  });

  test('devrait permettre de changer le niveau', async ({ page }) => {
    const levelSelect = page.getByRole('combobox');

    // Vérifier la valeur par défaut
    await expect(levelSelect).toHaveValue('N1 Avancé');

    // Changer le niveau
    await levelSelect.selectOption('N3 Intermédiaire');
    await expect(levelSelect).toHaveValue('N3 Intermédiaire');
  });
});

test.describe('Tests de persistance', () => {
  test('devrait sauvegarder les données dans localStorage', async ({ page }) => {
    await page.goto('/chat');

    // Remplir et soumettre
    await page.getByLabel('Nom*').fill('Alice');
    await page.getByLabel("Type d'exercice*").fill('lecture');
    await page.getByRole('button', { name: /submit/i }).click();

    // Recharger la page
    await page.reload();

    // Vérifier que les données sont persistées
    const formData = await page.evaluate(() => {
      const data = localStorage.getItem('formData');
      return data ? JSON.parse(data) : null;
    });

    expect(formData).toEqual(
      expect.objectContaining({
        name: 'Alice',
        type: 'lecture',
        isSubmitted: true,
      })
    );
  });
});

test.describe('Tests responsive', () => {
  test('devrait être utilisable sur mobile', async ({ page }) => {
    // Simuler un écran mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/chat');

    // Le formulaire devrait être visible et utilisable
    await expect(page.getByLabel('Nom*')).toBeVisible();

    await page.getByLabel('Nom*').fill('Bob');
    await page.getByLabel("Type d'exercice*").fill('conversation');
    await page.getByRole('button', { name: /submit/i }).click();

    // Vérifier la soumission
    await expect(page.getByLabel('Nom*')).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Tests d\'accessibilité', () => {
  test('devrait être navigable au clavier', async ({ page }) => {
    await page.goto('/chat');

    // Naviguer avec Tab
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Nom*')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel("Type d'exercice*")).toBeFocused();

    // Remplir avec le clavier
    await page.keyboard.type('TestUser');
    await page.keyboard.press('Tab');
    await page.keyboard.type('test-exercise');

    // Soumettre avec Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Vérifier la soumission
    await expect(page.getByLabel('Nom*')).not.toBeVisible({ timeout: 5000 });
  });
});
