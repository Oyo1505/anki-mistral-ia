# Tests E2E avec Playwright

## 🚀 Démarrage Rapide

### 1. Lancer Tous les Tests

```bash
pnpm test:e2e
```

### 2. Mode UI Interactif (Recommandé)

```bash
pnpm test:e2e:ui
```

### 3. Générer des Tests Automatiquement

```bash
# Démarrez votre app
pnpm dev

# Dans un autre terminal
pnpm test:e2e:codegen
```

## 📁 Fichiers de Test

- **chatbot-form.spec.ts** - Tests complets du formulaire chatbot
  - Validation
  - Soumission
  - Persistance localStorage
  - Responsive
  - Accessibilité

- **homepage.spec.ts** - Tests de la page d'accueil
  - Chargement
  - Navigation
  - Performance

## 🎯 Exemples de Tests

### Test Simple

```typescript
test('devrait afficher le formulaire', async ({ page }) => {
  await page.goto('/chat');
  await expect(page.getByLabel('Nom*')).toBeVisible();
});
```

### Test Complet

```typescript
test('devrait soumettre le formulaire', async ({ page }) => {
  await page.goto('/chat');

  await page.getByLabel('Nom*').fill('John');
  await page.getByLabel("Type d'exercice*").fill('grammaire');
  await page.getByRole('button', { name: /submit/i }).click();

  await expect(page.getByLabel('Nom*')).not.toBeVisible();
});
```

## 🔧 Commandes Utiles

```bash
# Tests avec navigateur visible
pnpm test:e2e:headed

# Mode debug (pause à chaque étape)
pnpm test:e2e:debug

# Voir le rapport des derniers tests
pnpm test:e2e:report
```

## 📚 Documentation Complète

Voir [PLAYWRIGHT_GUIDE.md](../PLAYWRIGHT_GUIDE.md) pour :
- Guide complet des sélecteurs
- Exemples avancés
- Configuration CI/CD
- Bonnes pratiques
- Débogage

## 💡 Tips

1. **Mode UI** est parfait pour écrire et déboguer des tests
2. **Codegen** génère automatiquement des tests en enregistrant vos actions
3. Utilisez `getByLabel()`, `getByRole()` plutôt que des sélecteurs CSS
4. Ajoutez `data-testid` pour les éléments complexes

---

**Happy Testing!** 🎭
