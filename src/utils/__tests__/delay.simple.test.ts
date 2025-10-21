/**
 * Tests simplifiés pour delay et retryWithBackoff
 * Focus sur la logique sans les complications des fake timers
 */

import delay, { retryWithBackoff } from "../time/delay";

describe("delay - Tests Simplifiés", () => {
  it("devrait retourner une Promise", () => {
    const result = delay(100);
    expect(result).toBeInstanceOf(Promise);
  });

  it("devrait se résoudre après le délai spécifié", async () => {
    const startTime = Date.now();
    await delay(100);
    const endTime = Date.now();

    // Vérifie que le délai est au moins 100ms (avec marge)
    expect(endTime - startTime).toBeGreaterThanOrEqual(90);
  }, 10000);
});

describe("retryWithBackoff - Tests Simplifiés", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("devrait retourner le résultat à la première tentative réussie", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");

    const result = await retryWithBackoff(mockFn, 3, 100);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("devrait réessayer sur une erreur 429", async () => {
    const error429 = { statusCode: 429, message: "Rate limit exceeded" };
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(error429)
      .mockResolvedValueOnce("success");

    const result = await retryWithBackoff(mockFn, 3, 100);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Rate limit atteint")
    );
  }, 10000);

  it("devrait lancer une erreur immédiatement pour les erreurs non-429", async () => {
    const error = new Error("Different error");
    const mockFn = jest.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(mockFn, 3, 100)).rejects.toThrow(
      "Different error"
    );
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("devrait lancer la dernière erreur après épuisement des tentatives", async () => {
    const error429 = { statusCode: 429, message: "Rate limit exceeded" };
    const mockFn = jest.fn().mockRejectedValue(error429);

    await expect(retryWithBackoff(mockFn, 2, 100)).rejects.toEqual(error429);

    // 1 tentative initiale + 2 retries = 3 appels
    expect(mockFn).toHaveBeenCalledTimes(3);
  }, 15000);

  it("devrait utiliser un backoff exponentiel", async () => {
    const error429 = { statusCode: 429 };
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(error429)
      .mockRejectedValueOnce(error429)
      .mockResolvedValueOnce("success");

    const startTime = Date.now();
    await retryWithBackoff(mockFn, 3, 100);
    const endTime = Date.now();

    // Premier retry: 100ms (2^0 * 100)
    // Deuxième retry: 200ms (2^1 * 100)
    // Total minimum: 300ms
    expect(endTime - startTime).toBeGreaterThanOrEqual(250);

    // Vérifier les logs de délai
    const logCalls = (console.log as jest.Mock).mock.calls;
    expect(logCalls.length).toBeGreaterThan(0);
  }, 15000);

  it("devrait fonctionner avec des paramètres par défaut", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");

    const result = await retryWithBackoff(mockFn);

    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
