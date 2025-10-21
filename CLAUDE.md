# Claude Code Configuration

## Project Overview

Anki Mistral AI - Application Next.js qui intègre l'IA Mistral avec la fonctionnalité de cartes flash Anki, incluant le support OCR pour le traitement de texte français et japonais.

## Stack Technique

- **Framework**: Next.js 15.5.2 avec TypeScript
- **Styling**: Tailwind CSS 4.1.12
- **AI**: Mistral AI (@mistralai/mistralai)
- **Forms**: React Hook Form + Zod validation
- **Export**: React CSV
- **Testing**: Jest (unitaires) + Playwright (E2E)
- **Package Manager**: pnpm 9.14.3

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
├── actions/           # Server actions
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
│   └── ui/           # Composants UI
├── context/          # React Context
│   └── chat-bot-context.tsx
└── interfaces/       # Types TypeScript
    └── chat.interface.ts
```

## Variables d'Environnement

Configurées dans `.env.local` (voir `.env` pour template)

## Branches

- **Actuelle**: `header-container`
- **Principale**: main (à confirmer)

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
