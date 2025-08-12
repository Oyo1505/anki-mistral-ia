# Anki Mistral AI - Générateur de Cartes Anki

Un générateur intelligent de cartes Anki pour l'apprentissage du japonais, alimenté par l'API Mistral AI.

## Démo
[Try it!](https://anki-mistral-ia.vercel.app/)

## Getting Started


## 🎯 Description

Anki Mistral AI est une application web moderne qui génère automatiquement des cartes Anki pour l'apprentissage du japonais. L'application utilise l'API Mistral AI pour créer des cartes personnalisées basées sur du texte saisi ou extrait d'images et de PDF.

## ✨ Fonctionnalités

### 🃏 Génération de Cartes
- **Cartes basiques** : Vocabulaire, grammaire, expressions japonaises
- **Cartes Kanji** : Apprentissage des caractères chinois
- **Niveaux adaptatifs** : Du N5 (débutant) au N1 (avancé)
- **Personnalisation** : Inclusion optionnelle de romanji et kanji

### 📄 Traitement de Documents
- **OCR d'images** : Extraction de texte depuis JPG, PNG
- **Lecture de PDF** : Conversion automatique en texte
- **Support multi-fichiers** : Jusqu'à 3 fichiers simultanément

### 🎨 Interface Utilisateur
- **Design moderne** : Interface responsive avec Tailwind CSS
- **Validation en temps réel** : Feedback immédiat sur les erreurs
- **Notifications** : Système de toast pour les retours utilisateur
- **Prévisualisation** : Visualisation des cartes avant export

### 📊 Export et Intégration
- **Export CSV** : Compatible avec Anki Desktop
- **Tutoriels intégrés** : Liens vers guides d'importation
- **Limites intelligentes** : Maximum 15 cartes par génération

## 🛠️ Technologies Utilisées

- **Framework** : Next.js 15.2.0 avec App Router
- **Langage** : TypeScript 5.8.2
- **IA** : Mistral AI API (mistral-large-latest, mistral-ocr-latest)
- **Styling** : Tailwind CSS 4.0.14
- **Formulaires** : React Hook Form + Zod validation
- **Notifications** : React Toastify
- **Export** : React CSV
- **Package Manager** : pnpm

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- pnpm (recommandé) ou npm
- Clé API Mistral AI

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd anki-mistral-ai
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Configuration de l'environnement**
   Créez un fichier `.env.local` à la racine du projet :
   ```env
   MISTRAL_API_KEY=votre_clé_api_mistral
   ```

4. **Lancer le serveur de développement**
   ```bash
   pnpm dev
   ```

5. **Ouvrir l'application**
   Naviguez vers [http://localhost:3000](http://localhost:3000)

## 📖 Utilisation

### Génération de Cartes Basiques

1. **Saisir du texte** ou **uploader des fichiers** (image/PDF)
2. **Sélectionner le niveau** japonais (N5 à N1)
3. **Choisir le nombre de cartes** (1-15)
4. **Configurer les options** :
   - ✅ Inclure les romanji
   - ✅ Inclure les kanji
   - ✅ Tout en japonais
5. **Cliquer sur "Générer"**
6. **Prévisualiser** et **télécharger** le fichier CSV

### Génération de Cartes Kanji

1. **Sélectionner "Kanji"** comme type de carte
2. **Saisir du texte** contenant des kanji
3. **Définir le nombre de cartes**
4. **Générer** les cartes d'apprentissage

### Import dans Anki

1. **Télécharger** le fichier CSV généré
2. **Ouvrir Anki Desktop**
3. **Importer** le fichier CSV
4. **Configurer** les colonnes (question, réponse)
5. **Ajouter** les cartes à votre deck

## 🔧 Configuration Avancée

### Variables d'Environnement

```env
# Obligatoire
MISTRAL_API_KEY=votre_clé_api_mistral

# Optionnel (pour la production)
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

### Scripts Disponibles

```bash
# Développement
pnpm dev          # Lance le serveur de développement avec Turbopack

# Production
pnpm build        # Build de production
pnpm start        # Lance le serveur de production

# Qualité de code
pnpm lint         # Vérification ESLint
```

## 📁 Structure du Projet

```
src/
├── actions/          # Actions serveur (Mistral AI)
├── app/             # Pages Next.js App Router
├── components/      # Composants React réutilisables
├── lib/            # Configuration et utilitaires
├── schema/         # Schémas de validation Zod
└── utils/          # Utilitaires et helpers
```

## 🔒 Sécurité

- **Validation côté client et serveur** avec Zod
- **Limitation de taille** des fichiers (5MB max)
- **Rate limiting** intégré (1 seconde entre requêtes)
- **Validation des types** TypeScript stricte

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation Anki** : [apps.ankiweb.net](https://apps.ankiweb.net/)
- **Tutoriel d'importation** : Lien intégré dans l'application
- **Issues** : Utilisez les issues GitHub pour signaler des bugs

## 🎓 Cas d'Usage

- **Étudiants en japonais** : Génération rapide de cartes de vocabulaire
- **Professeurs** : Création de matériel pédagogique personnalisé
- **Autodidactes** : Apprentissage adaptatif selon le niveau
- **Préparation JLPT** : Cartes ciblées par niveau d'examen

---

**Développé avec ❤️ pour l'apprentissage du japonais**
