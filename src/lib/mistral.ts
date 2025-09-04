import { Mistral } from '@mistralai/mistralai';
const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is required');
  }

  if (!apiKey.startsWith('lvXs') && process.env.NODE_ENV === 'production') {
    throw new Error('Invalid Mistral API key format');
  }

export const mistral = new Mistral({apiKey});


