import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement de test
dotenv.config({ path: path.resolve(__dirname, '.env.test.local') });
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

/**
 * Configuration Playwright pour Next.js 15
 * Tests E2E pour l'application Anki Mistral AI
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Dossier contenant les tests E2E
  testDir: './e2e',

  // Timeout maximum pour chaque test
  timeout: 30 * 1000,

  // Attentes et assertions
  expect: {
    timeout: 5000,
  },

  // Configuration des tests
  fullyParallel: true, // Tests en parallèle pour plus de vitesse
  forbidOnly: !!process.env.CI, // Empêche test.only en CI
  retries: process.env.CI ? 2 : 0, // 2 retries en CI, 0 en local
  workers: process.env.CI ? 1 : undefined, // 1 worker en CI, auto en local

  // Reporter des résultats
  reporter: [
    ['html'], // Rapport HTML
    ['list'], // Liste dans le terminal
    ['json', { outputFile: 'playwright-report/results.json' }], // JSON pour CI
  ],

  // Configuration partagée pour tous les projets
  use: {
    // URL de base de l'application
    baseURL: 'http://localhost:3000',

    // Collecter les traces pour le débogage en cas d'échec
    trace: 'on-first-retry',

    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',

    // Vidéos en cas d'échec
    video: 'retain-on-failure',

    // Locale française
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
  },

  // Configuration des navigateurs à tester
  // En CI: Chromium uniquement pour la rapidité
  // En local: Tous les navigateurs pour la compatibilité complète
  projects: (() => {
    const chromiumProject = {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    };

    if (process.env.CI) {
      return [chromiumProject];
    }

    return [
      chromiumProject,
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
      // Tests sur mobile
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 5'] },
      },
      {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] },
      },
    ];
  })(),

  // Serveur de développement
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes pour démarrer Next.js
    env: {
      MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
      MISTRAL_ID_AGENT: process.env.MISTRAL_ID_AGENT || '',
      NODE_ENV: 'test',
    },
  },
});
