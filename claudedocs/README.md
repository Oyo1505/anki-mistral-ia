# GitHub Actions Workflows

Ce dossier contient les workflows d'intégration continue (CI) pour le projet Anki Mistral AI.

## Playwright Tests Workflow

### 📋 Description

Le workflow `playwright.yml` exécute automatiquement les tests E2E Playwright sur chaque push et pull request.

### 🚀 Déclenchement

- **Push** sur les branches : `main`, `master`, `develop`
- **Pull Request** vers : `main`, `master`

### ⚙️ Configuration

#### Navigateurs testés
- **En CI (GitHub Actions)** : Chromium uniquement (optimisation vitesse/coût)
- **En local** : Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

#### Optimisations
- ✅ Cache pnpm pour installation rapide des dépendances
- ✅ Cache des navigateurs Playwright
- ✅ Timeout de 15 minutes (suffisant avec cache)
- ✅ Artifacts conservés 14 jours (rapports) et 7 jours (résultats)
- ✅ Compression niveau 9 pour réduire la taille des artifacts

### 🔐 Secrets GitHub requis

Pour que les tests fonctionnent correctement, configurez ces secrets dans GitHub :

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez le secret suivant :

| Secret | Description | Requis |
|--------|-------------|--------|
| `MISTRAL_API_KEY` | Clé API Mistral AI pour les tests | ✅ Oui |

### 📊 Rapports de tests

Les rapports Playwright sont automatiquement uploadés comme artifacts après chaque exécution :

- **playwright-report-{run_number}** : Rapport HTML complet (14 jours)
- **test-results-{run_number}** : Résultats détaillés des tests (7 jours)

Pour voir les rapports :
1. Allez dans l'onglet **Actions** de GitHub
2. Cliquez sur un workflow terminé
3. Téléchargez l'artifact `playwright-report-{run_number}`
4. Ouvrez `index.html` dans un navigateur

### 🔧 Commandes locales

```bash
# Tests Playwright (tous les navigateurs)
pnpm test:e2e

# Tests Playwright en mode UI
pnpm test:e2e:ui

# Tests Playwright avec navigateur visible
pnpm test:e2e:headed

# Tests Playwright en mode debug
pnpm test:e2e:debug

# Voir le dernier rapport
pnpm test:e2e:report

# Simuler l'environnement CI (Chromium uniquement)
CI=true pnpm test:e2e
```

### 📈 Métriques de performance

Temps d'exécution attendu :

| Étape | Temps (avec cache) | Temps (sans cache) |
|-------|-------------------|-------------------|
| Installation dépendances | ~30s | ~2min |
| Installation navigateurs | ~10s | ~1min |
| Exécution tests | ~2-3min | ~2-3min |
| **Total** | **~3-4min** | **~5-6min** |

### 🐛 Troubleshooting

#### Les tests échouent en CI mais passent en local

1. Vérifiez que `MISTRAL_API_KEY` est configuré dans les secrets GitHub
2. Vérifiez les logs du workflow pour identifier l'erreur spécifique
3. Exécutez `CI=true pnpm test:e2e` localement pour reproduire l'environnement CI

#### Timeout des tests

Si les tests dépassent le timeout :
1. Vérifiez si l'API Mistral répond lentement
2. Augmentez le timeout dans `playwright.config.ts` si nécessaire
3. Optimisez les tests pour réduire le temps d'exécution

#### Cache invalide

Si le cache cause des problèmes :
1. Allez dans **Actions** → **Caches**
2. Supprimez les caches problématiques
3. Le workflow reconstruira le cache au prochain run

### 🔄 Mise à jour du workflow

Pour modifier le workflow :

1. Éditez `.github/workflows/playwright.yml`
2. Committez et pushez les changements
3. Le nouveau workflow s'appliquera automatiquement

### 📚 Ressources

- [Documentation Playwright](https://playwright.dev/docs/intro)
- [GitHub Actions Cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [PNPM Action](https://github.com/pnpm/action-setup)
