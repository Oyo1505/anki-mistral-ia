import { Mistral } from '@mistralai/mistralai';
const apiKey = process.env.API_KEY_MISTRAL;
export const mistral = new Mistral({apiKey});


