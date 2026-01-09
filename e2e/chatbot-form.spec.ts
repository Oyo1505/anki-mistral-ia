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
    await expect(page.getByRole('button', { name: /envoyer/i })).toBeVisible();
  });

  test('devrait valider les champs requis', async ({ page }) => {
    // Cliquer sur submit sans remplir
    await page.getByRole('button', { name: /envoyer/i }).click();

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
    await page.getByRole('button', { name: /envoyer/i }).click();

    // Vérifier que le formulaire disparaît (isSubmitted = true)
    await expect(page.getByLabel('Nom*')).not.toBeVisible({ timeout: 5000 });
  });

  test('devrait rejeter un nom trop long', async ({ page }) => {
    const longName = 'a'.repeat(21); // Plus de 20 caractères

    await page.getByLabel('Nom*').fill(longName);
    await page.getByLabel("Type d'exercice*").fill('vocabulaire');
    await page.getByRole('button', { name: /envoyer/i }).click();

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
    await page.getByRole('button', { name: /envoyer/i }).click();

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
    await page.getByRole('button', { name: /envoyer/i }).click();

    // Vérifier la soumission
    await expect(page.getByLabel('Nom*')).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Tests d\'accessibilité', () => {
  test('devrait être navigable au clavier', async ({ page }, testInfo) => {
    // Skip test for mobile browsers (keyboard navigation not applicable)
    const isMobile = testInfo.project.name.includes('Mobile');
    test.skip(isMobile, 'Navigation clavier non applicable sur mobile');

    await page.goto('/chat');

    // Attendre le chargement du formulaire
    await page.waitForSelector('input[id="name"]');

    // Cliquer sur le premier champ pour commencer
    const nameField = page.getByLabel('Nom*');
    await nameField.click();
    await expect(nameField).toBeFocused();

    // Remplir avec le clavier
    await page.keyboard.type('TestUser');

    // Passer au champ suivant avec Tab
    await page.keyboard.press('Tab');
    const typeField = page.getByLabel("Type d'exercice*");
    await expect(typeField).toBeFocused();
    await page.keyboard.type('test-exercise');

    // Naviguer vers le select niveau avec Tab
    await page.keyboard.press('Tab');

    // Naviguer vers le bouton submit avec Tab
    await page.keyboard.press('Tab');
    const submitButton = page.getByRole('button', { name: /envoyer/i });
    await expect(submitButton).toBeFocused();

    // Soumettre avec Enter
    await page.keyboard.press('Enter');

    // Vérifier la soumission
    await expect(nameField).not.toBeVisible({ timeout: 5000 });
  });

  test('devrait avoir des labels ARIA appropriés', async ({ page }) => {
    await page.goto('/chat');

    // Vérifier que les champs ont des labels
    const nameInput = page.getByLabel('Nom*');
    const typeInput = page.getByLabel("Type d'exercice*");
    const levelSelect = page.getByRole('combobox');
    const submitButton = page.getByRole('button', { name: /envoyer/i });

    await expect(nameInput).toBeVisible();
    await expect(typeInput).toBeVisible();
    await expect(levelSelect).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Vérifier les attributs d'accessibilité
    await expect(nameInput).toHaveAttribute('id', 'name');
    await expect(typeInput).toHaveAttribute('id', 'type');
    await expect(levelSelect).toHaveAttribute('id', 'level');
  });
});
