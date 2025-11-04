import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error(
    "MISTRAL_API_KEY is required. Please add it to your .env.local file."
  );
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

export const mistral = new Mistral({
  apiKey,
});
