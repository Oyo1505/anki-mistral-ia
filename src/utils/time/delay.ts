import isErrorWithStatusCode from "../boolean/isErrorWithStatusCode";

export default function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (
        isErrorWithStatusCode(error) &&
        error.statusCode === 429 &&
        attempt < maxRetries
      ) {
        const delayMs = baseDelay * Math.pow(2, attempt); // Backoff exponentiel
        console.log(
          `Rate limit atteint, retry dans ${delayMs}ms (tentative ${
            attempt + 1
          }/${maxRetries + 1})`
        );
        await delay(delayMs);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}
