import { Mistral } from "@mistralai/mistralai";

/**
 * Validates and returns the Mistral API key
 * Throws descriptive errors if validation fails
 */
function getValidatedApiKey(): string {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is required");
  }

  if (apiKey.length < 32) {
    throw new Error("MISTRAL_API_KEY seems too short (minimum 32 characters)");
  }

  const MISTRAL_KEY_PATTERNS = [
    /^lvXs[a-zA-Z0-9_-]+$/, // Production keys
    /^test_[a-zA-Z0-9_-]+$/, // Test keys
    /^[a-zA-Z0-9_-]{32,}$/, // Fallback: alphanumeric 32+ chars
  ];

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

  return apiKey;
}

/**
 * Lazy-initialized Mistral client
 * Created on first access to ensure environment variables are loaded
 */
let mistralInstance: Mistral | null = null;

export const getMistralClient = (): Mistral => {
  if (!mistralInstance) {
    const apiKey = getValidatedApiKey();
    mistralInstance = new Mistral({ apiKey });
  }
  return mistralInstance;
};

// Deprecated: Use getMistralClient() instead
// Kept for backward compatibility, but will be removed
export const mistral = new Proxy({} as Mistral, {
  get(_target, prop) {
    return getMistralClient()[prop as keyof Mistral];
  },
});
