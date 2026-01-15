import { safeStorage, _resetCache } from "../safe-storage";

describe("safeStorage", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    jest.clearAllMocks();
    // Reset the cached availability for testing (js-cache-storage)
    _resetCache();
  });

  describe("isAvailable", () => {
    it("should return true when localStorage is available", () => {
      expect(safeStorage.isAvailable).toBe(true);
    });

    it("should return false when localStorage throws SecurityError", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("SecurityError", "SecurityError");
      });

      expect(safeStorage.isAvailable).toBe(false);
    });

    it("should return false when localStorage throws QuotaExceededError", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError", "QuotaExceededError");
      });

      expect(safeStorage.isAvailable).toBe(false);
    });
  });

  describe("getItem", () => {
    it("should return stored value when it exists", () => {
      const testData = { name: "test", value: 123 };
      localStorage.setItem("testKey", JSON.stringify(testData));

      const result = safeStorage.getItem("testKey", { name: "", value: 0 });

      expect(result).toEqual(testData);
    });

    it("should return default value when key does not exist", () => {
      const defaultValue = { name: "default", value: 0 };

      const result = safeStorage.getItem("nonExistent", defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it("should return default value when localStorage throws SecurityError", () => {
      const defaultValue = { name: "default", value: 0 };
      jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new DOMException("SecurityError", "SecurityError");
      });

      const result = safeStorage.getItem("testKey", defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it("should return default value when JSON.parse fails", () => {
      const defaultValue = { name: "default", value: 0 };
      localStorage.setItem("testKey", "{invalid json");

      const result = safeStorage.getItem("testKey", defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it("should handle null values from localStorage", () => {
      const defaultValue = { name: "default", value: 0 };
      jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

      const result = safeStorage.getItem("testKey", defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it("should preserve arrays correctly", () => {
      const testArray = [1, 2, 3, 4, 5];
      localStorage.setItem("arrayKey", JSON.stringify(testArray));

      const result = safeStorage.getItem("arrayKey", []);

      expect(result).toEqual(testArray);
    });

    it("should preserve nested objects correctly", () => {
      const testData = {
        user: { name: "John", age: 30 },
        items: [{ id: 1 }, { id: 2 }],
      };
      localStorage.setItem("nestedKey", JSON.stringify(testData));

      const result = safeStorage.getItem("nestedKey", {});

      expect(result).toEqual(testData);
    });
  });

  describe("setItem", () => {
    it("should store value successfully", () => {
      const testData = { name: "test", value: 123 };

      const result = safeStorage.setItem("testKey", testData);

      expect(result).toBe(true);
      expect(localStorage.getItem("testKey")).toBe(JSON.stringify(testData));
    });

    it("should return false when localStorage throws QuotaExceededError", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("QuotaExceededError", "QuotaExceededError");
      });

      const result = safeStorage.setItem("testKey", { name: "test" });

      expect(result).toBe(false);
    });

    it("should return false when localStorage throws SecurityError", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("SecurityError", "SecurityError");
      });

      const result = safeStorage.setItem("testKey", { name: "test" });

      expect(result).toBe(false);
    });

    it("should handle circular references gracefully", () => {
      const circularObj: any = { name: "test" };
      circularObj.self = circularObj;

      const result = safeStorage.setItem("circularKey", circularObj);

      expect(result).toBe(false);
    });

    it("should store arrays correctly", () => {
      const testArray = [1, 2, 3];

      const result = safeStorage.setItem("arrayKey", testArray);

      expect(result).toBe(true);
      expect(localStorage.getItem("arrayKey")).toBe(JSON.stringify(testArray));
    });

    it("should store nested objects correctly", () => {
      const testData = {
        user: { name: "John" },
        items: [{ id: 1 }],
      };

      const result = safeStorage.setItem("nestedKey", testData);

      expect(result).toBe(true);
      expect(localStorage.getItem("nestedKey")).toBe(
        JSON.stringify(testData)
      );
    });
  });

  describe("removeItem", () => {
    it("should remove item successfully", () => {
      localStorage.setItem("testKey", "test value");

      const result = safeStorage.removeItem("testKey");

      expect(result).toBe(true);
      expect(localStorage.getItem("testKey")).toBeNull();
    });

    it("should return false when localStorage throws SecurityError", () => {
      jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new DOMException("SecurityError", "SecurityError");
      });

      const result = safeStorage.removeItem("testKey");

      expect(result).toBe(false);
    });

    it("should handle removing non-existent key gracefully", () => {
      const result = safeStorage.removeItem("nonExistent");

      expect(result).toBe(true);
    });
  });

  describe("clear", () => {
    it("should clear all items successfully", () => {
      localStorage.setItem("key1", "value1");
      localStorage.setItem("key2", "value2");

      const result = safeStorage.clear();

      expect(result).toBe(true);
      expect(localStorage.length).toBe(0);
    });

    it("should return false when localStorage throws SecurityError", () => {
      jest.spyOn(Storage.prototype, "clear").mockImplementation(() => {
        throw new DOMException("SecurityError", "SecurityError");
      });

      const result = safeStorage.clear();

      expect(result).toBe(false);
    });
  });

  describe("Private mode simulation", () => {
    it("should handle complete private browsing mode scenario", () => {
      // Simulate private mode where all operations throw
      jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new DOMException("SecurityError", "SecurityError");
      });
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("SecurityError", "SecurityError");
      });
      jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new DOMException("SecurityError", "SecurityError");
      });

      const defaultValue = { name: "default" };

      // All operations should fail gracefully
      expect(safeStorage.isAvailable).toBe(false);
      expect(safeStorage.getItem("key", defaultValue)).toEqual(defaultValue);
      expect(safeStorage.setItem("key", { name: "test" })).toBe(false);
      expect(safeStorage.removeItem("key")).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty string as key", () => {
      const result = safeStorage.setItem("", { value: "test" });
      expect(result).toBe(true);

      const retrieved = safeStorage.getItem("", { value: "default" });
      expect(retrieved).toEqual({ value: "test" });
    });

    it("should handle undefined as default value", () => {
      const result = safeStorage.getItem("nonExistent", undefined);
      expect(result).toBeUndefined();
    });

    it("should handle null as stored value", () => {
      safeStorage.setItem("nullKey", null);
      const result = safeStorage.getItem("nullKey", "default");
      expect(result).toBeNull();
    });

    it("should handle boolean values", () => {
      safeStorage.setItem("boolKey", true);
      const result = safeStorage.getItem("boolKey", false);
      expect(result).toBe(true);
    });

    it("should handle number values", () => {
      safeStorage.setItem("numKey", 42);
      const result = safeStorage.getItem("numKey", 0);
      expect(result).toBe(42);
    });
  });
});
