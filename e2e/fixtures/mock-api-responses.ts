/**
 * Mock API responses for E2E tests
 * Provides realistic responses without calling real Mistral API
 */

export const mockSuccessResponse = {
  data: [
    { recto: '日本語とは何ですか？', verso: 'Qu\'est-ce que le japonais ?' },
    { recto: 'テスト (てすと)', verso: 'Test / Examen' },
    { recto: 'こんにちは', verso: 'Bonjour (en journée)' },
    { recto: 'ありがとう', verso: 'Merci' },
    { recto: 'さようなら', verso: 'Au revoir' },
  ],
  status: 200,
  error: null,
  typeCard: 'basique',
};

export const mockKanjiResponse = {
  data: [
    {
      kanji: '日',
      traduction: 'Soleil / Jour',
      kunyomi: 'ひ、か',
      onyomi: 'ニチ、ジツ',
      radical: '日 (にち) = soleil',
      keyKanji: 'Le soleil se lève chaque jour',
      exemples: '日本 (にほん) - Japon, 毎日 (まいにち) - chaque jour',
    },
    {
      kanji: '本',
      traduction: 'Livre / Origine',
      kunyomi: 'もと',
      onyomi: 'ホン',
      radical: '木 (き) = arbre',
      keyKanji: 'Un arbre avec ses racines = l\'origine',
      exemples: '日本 (にほん) - Japon, 本当 (ほんとう) - vraiment',
    },
    {
      kanji: '語',
      traduction: 'Langue / Parole',
      kunyomi: 'かた・る、かた・らう',
      onyomi: 'ゴ',
      radical: '言 (ごんべん) = parole',
      keyKanji: 'Bouche qui parle = langage',
      exemples: '日本語 (にほんご) - japonais, 英語 (えいご) - anglais',
    },
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
