# Claude Code Configuration

## Project Overview

Anki Mistral AI - Application Next.js qui intègre l'IA Mistral avec la fonctionnalité de cartes flash Anki, incluant le support OCR pour le traitement de texte français et japonais.

### While implementing

- Have to respect Clean code pratice.

- Have to respect RGAA, WCAG 2.2 web accessibility level minimun AA.

- All Tests have to passed green

- You should update the plan as you work.

- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

### Directory Structure

The project follows a **layered architecture** pattern with service layer and server actions:

**Note**: L'architecture actuelle utilise des singletons et méthodes statiques. Une vraie Dependency Injection pourrait être implémentée pour améliorer la testabilité (voir analyse de code).

## Stack Technique

- **Framework**: Next.js 16 avec TypeScript
- **Styling**: Tailwind CSS 4.1.12
- **AI**: Mistral AI (@mistralai/mistralai)
- **Forms**: React Hook Form + Zod validation
- **Export**: React CSV
- **Testing**: Jest (unitaires) + Playwright (E2E)
- **Package Manager**: pnpm 10.20.0

## Scripts de Développement

```bash
# Développement
pnpm dev             # Serveur de développement avec Turbopack
pnpm build           # Build de production
pnpm start           # Serveur de production
pnpm lint            # Linter ESLint

# Tests Unitaires (Jest)
pnpm test            # Lancer tous les tests Jest
pnpm test:watch      # Mode watch pour Jest
pnpm test:coverage   # Rapport de couverture Jest
pnpm test:ci         # Tests Jest pour CI/CD

# Tests E2E (Playwright)
pnpm test:e2e        # Lancer tous les tests E2E
pnpm test:e2e:ui     # Mode UI interactif (recommandé)
pnpm test:e2e:headed # Tests avec navigateur visible
pnpm test:e2e:debug  # Mode debug avec pause
pnpm test:e2e:report # Voir le rapport HTML
pnpm test:e2e:codegen # Générer des tests automatiquement
```

## Structure du Projet

```
src/
├── actions/           # Server actions Next.js
│   ├── chat-bot.action.ts
│   └── mistral.action.ts
├── app/              # App Router pages
│   ├── chat/         # Page de chat
│   ├── layout.tsx    # Layout principal
│   └── page.tsx      # Page d'accueil
├── components/       # Composants React
│   ├── answer-mistral.tsx
│   ├── chat-bot.tsx
│   ├── form-chat-bot.tsx
│   ├── csv-viewer.tsx
│   └── ui/           # Composants UI réutilisables
├── context/          # React Context pour state management
│   └── chat-bot-context.tsx
├── hooks/            # Custom React hooks
│   └── useAnkiCardGeneration.ts
├── interfaces/       # Types et interfaces TypeScript
│   └── chat.interface.ts
├── lib/              # Librairies et clients externes
│   ├── data/         # Couche d'accès aux données
│   ├── mistral.ts    # Client Mistral AI
│   └── logError.ts   # Gestion centralisée des erreurs
├── schema/           # Schémas Zod de validation
│   └── form-schema.ts
├── services/         # Services métier
│   └── File-processor-service.ts
└── utils/            # Fonctions utilitaires
    ├── boolean/      # Type guards et validations
    ├── string/       # Manipulation de texte
    ├── time/         # Délais et retry logic
    └── safe-storage.ts # Wrapper localStorage sécurisé
```

## Variables d'Environnement

Configurées dans `.env.local` (voir `.env` pour template)

## Branches

- **Actuelle**: `main`
- **Principale**: `main`

## Notes de Développement

- Utilise les Server Actions Next.js pour l'intégration Mistral
- Interface de chat avec contexte React
- Export CSV des conversations/données
- Validation de formulaires avec Zod
- Support multilingue avec OCR

## Testing

- **Jest** : 41 tests unitaires (100% réussite)

  - Validation Zod
  - Contexte React
  - Logique métier
  - Voir [README.tests.md](README.tests.md) et [TESTS_FINAL.md](TESTS_FINAL.md)

- **Playwright** : 14 tests E2E
  - Tests formulaire chatbot
  - Tests navigation
  - Tests responsive
  - Tests accessibilité
  - Voir [PLAYWRIGHT_GUIDE.md](PLAYWRIGHT_GUIDE.md) et [PLAYWRIGHT_SETUP_COMPLETE.md](PLAYWRIGHT_SETUP_COMPLETE.md)

## Commandes Utiles

```bash
# Installation des dépendances
pnpm install

# Développement avec hot reload
pnpm dev

# Vérification du code
pnpm lint

# Build optimisé
pnpm build
```

## Qualité de Code et Architecture

### Points Forts ✅

- **Tests exhaustifs**: 41 tests unitaires + 14 tests E2E (100% de réussite)
- **Gestion d'erreurs robuste**: Logging centralisé avec `logError`
- **Validation runtime**: Zod schemas pour type safety
- **Code splitting**: Imports dynamiques et optimisations
- **Utilities bien structurées**: Fonctions `retryWithBackoff`, `isErrorWithStatusCode`, `safe-storage`
- **React 19**: Utilisation du nouveau compilateur React
- **Accessibilité**: Conformité WCAG 2.2 niveau AA (RGAA)

### Améliorations Recommandées 🔧

**Architecture**:
- L'architecture actuelle utilise des singletons (`mistral`, `fileProcessor`)
- Pour une vraie Dependency Injection, considérer la refactorisation vers des interfaces et injection par constructeur
- Pattern Repository pourrait être ajouté pour la couche data

**Sécurité**:
- Ajouter rate limiting sur les server actions
- Implémenter Content Security Policy (CSP)
- Validation API key pourrait être assouplie en développement

**Performance**:
- Optimiser ChatBotContext avec `useCallback` pour éviter re-renders
- Ajouter React.memo sur composants lourds
- Implémenter virtualization pour grandes listes CSV

**Accessibilité**:
- Ajouter `aria-describedby` sur les inputs avec erreurs
- Créer régions `aria-live` pour contenus dynamiques
- Compléter les labels ARIA sur boutons

**TypeScript**:
- Éliminer les usages de `any` restants
- Activer `noUncheckedIndexedAccess: true`
- Créer type guards typés pour validations

**Résilience**:
- Ajouter Error Boundary React pour éviter crashes complets
- Implémenter Suspense boundaries avec skeletons
- Standardiser le pattern Result<T, E> pour gestion d'erreurs uniforme

Voir l'analyse complète de code pour détails et priorisation des améliorations.
