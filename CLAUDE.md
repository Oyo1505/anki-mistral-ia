# Claude Code Configuration

## Project Overview
Anki Mistral AI - Application Next.js qui intègre l'IA Mistral avec la fonctionnalité de cartes flash Anki, incluant le support OCR pour le traitement de texte français et japonais.

## Stack Technique
- **Framework**: Next.js 15.5.2 avec TypeScript
- **Styling**: Tailwind CSS 4.1.12
- **AI**: Mistral AI (@mistralai/mistralai)
- **OCR**: Tesseract.js (langues: français, japonais)
- **Forms**: React Hook Form + Zod validation
- **Export**: React CSV
- **Package Manager**: pnpm 9.14.3

## Scripts de Développement
```bash
npm run dev        # Serveur de développement avec Turbopack
npm run build      # Build de production
npm run start      # Serveur de production
npm run lint       # Linter ESLint
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

## Fichiers OCR
- `fra.traineddata` - Modèle Tesseract pour le français
- `jpn.traineddata` - Modèle Tesseract pour le japonais

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