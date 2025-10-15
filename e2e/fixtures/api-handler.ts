import { Page } from '@playwright/test';
import { setupMockAPI } from './mock-api-responses';

/**
 * Conditional API handler for E2E tests
 *
 * Controls whether tests use real Mistral API or mocked responses based on USE_REAL_API env var.
 * By default (USE_REAL_API=false), all API calls are mocked for fast, reliable tests.
 *
 * Benefits of mocked API:
 * - Fast test execution (~2s instead of ~15s)
 * - No API quota consumption
 * - No rate limiting errors
 * - Reliable CI/CD execution
 * - Predictable test results
 *
 * @param page - Playwright page object
 * @param responseType - Type of mock response ('success' | 'kanji' | 'error' | 'rateLimit')
 *
 * @example
 * // In test file
 * test.beforeEach(async ({ page }) => {
 *   await setupAPIHandler(page); // Uses mocks by default
 *   await page.goto('/');
 * });
 *
 * // To test with real API, set in .env.test.local:
 * // USE_REAL_API=true
 */
export async function setupAPIHandler(
  page: Page,
  responseType: 'success' | 'kanji' | 'error' | 'rateLimit' = 'success'
): Promise<void> {
  const useRealAPI = process.env.USE_REAL_API === 'true';

  if (!useRealAPI) {
    // Use mocked API responses (default behavior)
    await setupMockAPI(page, responseType);
  }
  // If useRealAPI is true, do nothing and let real API calls pass through
}

/**
 * Check if tests are configured to use real API
 * Useful for conditional test logic
 */
export function isUsingRealAPI(): boolean {
  return process.env.USE_REAL_API === 'true';
}
