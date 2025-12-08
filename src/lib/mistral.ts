import { Mistral } from "@mistralai/mistralai";

const MISTRAL_KEY_PATTERNS = [
  /^lvXs[a-zA-Z0-9_-]+$/, // Production keys
  /^test_[a-zA-Z0-9_-]+$/, // Test keys
  /^[a-zA-Z0-9_-]{32,}$/, // Fallback: alphanumeric 32+ chars
];

/**
 * Validates the Mistral API key format and requirements
 * @throws {Error} If API key is missing, invalid, or inappropriate for the environment
 */
function validateApiKey(apiKey: string | undefined): asserts apiKey is string {
  if (!apiKey) {
    throw new Error(
      "MISTRAL_API_KEY is required. Please add it to your .env.local file."
    );
  }

  if (apiKey.length < 32) {
    throw new Error("MISTRAL_API_KEY seems too short (minimum 32 characters)");
  }

  const isValidFormat = MISTRAL_KEY_PATTERNS.some((pattern) =>
    pattern.test(apiKey)
  );

  if (!isValidFormat) {
    throw new Error(
      "Invalid MISTRAL_API_KEY format. Expected format starting with lvXs... or valid API token"
    );
  }

  if (process.env.NODE_ENV === "production" && apiKey.startsWith("test_")) {
    throw new Error("Cannot use test API key in production environment");
  }
}

/**
 * Lazy initialization of Mistral client
 * Validates API key only when the client is first accessed
 */
let mistralInstance: Mistral | null = null;

function getMistralInstance(): Mistral {
  if (!mistralInstance) {
    const apiKey = process.env.MISTRAL_API_KEY;
    validateApiKey(apiKey);
    mistralInstance = new Mistral({ apiKey });
  }
  return mistralInstance;
}

/**
 * Mistral AI client instance with lazy initialization
 * API key validation happens on first access, not at module load time
 */
export const mistral = new Proxy({} as Mistral, {
  get(_target, prop) {
    const instance = getMistralInstance();
    const value = instance[prop as keyof Mistral];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
