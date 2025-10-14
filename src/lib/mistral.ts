import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

// En environnement de test, utiliser une clé factice si aucune n'est fournie
const isTest = process.env.NODE_ENV === 'test';
const effectiveApiKey = apiKey || (isTest ? 'test-key-placeholder' : '');

if (!effectiveApiKey && !isTest) {
  throw new Error('MISTRAL_API_KEY is required');
}

if (effectiveApiKey && !effectiveApiKey.startsWith('lvXs') && !isTest && process.env.NODE_ENV === 'production') {
  throw new Error('Invalid Mistral API key format');
}

export const mistral = new Mistral({ apiKey: effectiveApiKey });


