/**
 * Safe localStorage wrapper with comprehensive error handling
 * Handles: Private browsing mode, malformed JSON, quota exceeded, SSR
 */

/**
 * Check if localStorage is available and functional
 * Returns false in private browsing mode, SSR, or when storage is disabled
 */
function checkStorageAvailability(): boolean {
  if (typeof window === "undefined") {
    return false; // SSR environment
  }

  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    // Catches SecurityError (private mode), QuotaExceededError, etc.
    return false;
  }
}

/**
 * Safe localStorage abstraction with graceful fallback
 */
export const safeStorage = {
  /**
   * Check if localStorage is available
   * Cached result from availability check
   */
  get isAvailable(): boolean {
    return checkStorageAvailability();
  },

  /**
   * Safely retrieve and parse item from localStorage
   * @param key - Storage key
   * @param defaultValue - Fallback value if retrieval fails
   * @returns Parsed value or defaultValue on error
   */
  getItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      const parsed = JSON.parse(item);
      return parsed as T;
    } catch (error) {
      // Catches:
      // - SyntaxError (malformed JSON)
      // - SecurityError (storage access denied)
      console.warn(`Failed to retrieve "${key}" from localStorage:`, error);
      return defaultValue;
    }
  },

  /**
   * Safely set item in localStorage with JSON serialization
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   * @returns true if successful, false otherwise
   */
  setItem(key: string, value: unknown): boolean {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      // Catches:
      // - QuotaExceededError (storage full)
      // - TypeError (circular references)
      // - SecurityError (storage access denied)
      console.warn(`Failed to set "${key}" in localStorage:`, error);
      return false;
    }
  },

  /**
   * Safely remove item from localStorage
   * @param key - Storage key to remove
   * @returns true if successful, false otherwise
   */
  removeItem(key: string): boolean {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove "${key}" from localStorage:`, error);
      return false;
    }
  },

  /**
   * Safely clear all localStorage
   * @returns true if successful, false otherwise
   */
  clear(): boolean {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
      return false;
    }
  },
};
