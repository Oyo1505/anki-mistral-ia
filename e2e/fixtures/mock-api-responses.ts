/**
 * Mock API responses for E2E tests
 * Provides realistic responses without calling real Mistral API
 */

export const mockSuccessResponse = {
  data: [
    ['日本語', 'Japanese'],
    ['テスト', 'Test'],
    ['こんにちは', 'Hello'],
    ['ありがとう', 'Thank you'],
    ['さようなら', 'Goodbye'],
  ],
  status: 200,
  error: null,
  typeCard: 'basique',
};

export const mockKanjiResponse = {
  data: [
    ['日', 'Sun/Day', 'にち、ひ'],
    ['本', 'Book/Origin', 'ホン、もと'],
    ['語', 'Language', 'ご'],
  ],
  status: 200,
  error: null,
  typeCard: 'kanji',
};

export const mockErrorResponse = {
  data: null,
  status: 500,
  error: 'Internal Server Error',
  typeCard: undefined,
};

export const mockRateLimitResponse = {
  data: null,
  status: 429,
  error: 'Rate limit exceeded',
  typeCard: undefined,
};

/**
 * Setup API mocking for fast E2E tests
 * @param page Playwright page object
 * @param responseType Type of response to mock ('success' | 'error' | 'rateLimit')
 */
export async function setupMockAPI(
  page: any,
  responseType: 'success' | 'kanji' | 'error' | 'rateLimit' = 'success'
) {
  await page.route('**/api/**', async (route: any) => {
    let response;
    let delay = 1000; // 1 second simulated delay

    switch (responseType) {
      case 'kanji':
        response = mockKanjiResponse;
        break;
      case 'error':
        response = mockErrorResponse;
        break;
      case 'rateLimit':
        response = mockRateLimitResponse;
        break;
      case 'success':
      default:
        response = mockSuccessResponse;
        break;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}
