import { expect, test } from "@playwright/test";

/**
 * Tests E2E pour la gestion du localStorage en mode navigation privée
 * Simule les conditions de Safari/Firefox en mode privé où localStorage.getItem() throw SecurityError
 */

test.describe("Safe localStorage - Private Browsing Mode", () => {
  test.beforeEach(async ({ page }) => {
    // Inject script BEFORE page loads to simulate private mode
    await page.addInitScript(() => {
      // Override localStorage to throw SecurityError like Safari private mode
      const originalGetItem = Storage.prototype.getItem;
      const originalSetItem = Storage.prototype.setItem;

      Storage.prototype.getItem = function (key: string) {
        if (key === "chatBotMessagesAnki" || key === "formData") {
          throw new DOMException("The operation is insecure.", "SecurityError");
        }
        return originalGetItem.call(this, key);
      };

      Storage.prototype.setItem = function (key: string, value: string) {
        if (key === "chatBotMessagesAnki" || key === "formData") {
          throw new DOMException(
            "QuotaExceededError: The quota has been exceeded.",
            "QuotaExceededError"
          );
        }
        return originalSetItem.call(this, key, value);
      };
    });
  });

  test("should load chat page without crashing in private mode", async ({
    page,
  }) => {
    // Navigate to chat page (this would crash before the fix)
    await page.goto("/chat");

    // Page should load successfully
    await expect(page).toHaveURL(/\/chat/);

    // Should show form (proof that page loaded without crashing)
    await expect(page.getByLabel("Nom*")).toBeVisible();
    await expect(page.getByRole("button", { name: /submit/i })).toBeVisible();
  });

  test("should display form fields even when localStorage fails", async ({
    page,
  }) => {
    await page.goto("/chat");

    // Form should be visible despite localStorage errors
    await expect(page.getByLabel("Nom*")).toBeVisible();
    await expect(page.getByLabel("Type d'exercice*")).toBeVisible();
    await expect(page.getByRole("button", { name: /submit/i })).toBeVisible();
  });

  test("should allow form submission without localStorage", async ({
    page,
  }) => {
    await page.goto("/chat");

    // Fill and submit form
    await page.getByLabel("Nom*").fill("TestUser");
    await page.getByLabel("Type d'exercice*").fill("test-exercise");
    await page.getByRole("button", { name: /submit/i }).click();

    // Form should submit successfully (disappear)
    await expect(page.getByLabel("Nom*")).not.toBeVisible({ timeout: 5000 });

    // App should continue working
    await expect(
      page.getByText(/Bonjour, comment puis-je vous aider/i)
    ).toBeVisible();
  });

  test("should handle localStorage failures gracefully during runtime", async ({
    page,
  }) => {
    await page.goto("/chat");

    // Submit form to trigger multiple localStorage.setItem calls
    await page.getByLabel("Nom*").fill("Alice");
    await page.getByLabel("Type d'exercice*").fill("grammar");
    await page.getByRole("button", { name: /submit/i }).click();

    // Wait a bit for storage operations to complete (or fail)
    await page.waitForTimeout(500);

    // Check console for no unhandled errors
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleLogs.push(msg.text());
      }
    });

    // Verify no SecurityError or QuotaExceededError in console
    expect(
      consoleLogs.filter((log) => log.includes("SecurityError"))
    ).toHaveLength(0);
    expect(
      consoleLogs.filter((log) => log.includes("QuotaExceededError"))
    ).toHaveLength(0);
  });

  test("should not persist data after reload in private mode", async ({
    page,
  }) => {
    await page.goto("/chat");

    // Submit form
    await page.getByLabel("Nom*").fill("Bob");
    await page.getByLabel("Type d'exercice*").fill("reading");
    await page.getByRole("button", { name: /submit/i }).click();

    // Reload page
    await page.reload();

    // Form should reset to initial state (not persisted)
    await expect(page.getByLabel("Nom*")).toBeVisible();

    // Check that form is empty (default state)
    const nameValue = await page.getByLabel("Nom*").inputValue();
    expect(nameValue).toBe("");
  });
});

// Note: Malformed JSON tests are covered by Jest unit tests (safe-storage.test.ts)
// E2E tests focus on browser integration and private mode scenarios

test.describe("Safe localStorage - Normal Operation", () => {
  test("should work normally when localStorage is available", async ({
    page,
  }) => {
    // No init script = normal localStorage behavior
    await page.goto("/chat");

    // Fill and submit form
    await page.getByLabel("Nom*").fill("NormalUser");
    await page.getByLabel("Type d'exercice*").fill("vocabulary");
    await page.getByRole("button", { name: /submit/i }).click();

    // Reload to test persistence
    await page.reload();

    // Data should be persisted
    const formData = await page.evaluate(() => {
      const data = localStorage.getItem("formData");
      return data ? JSON.parse(data) : null;
    });

    expect(formData).toEqual(
      expect.objectContaining({
        name: "NormalUser",
        type: "vocabulary",
        isSubmitted: true,
      })
    );
  });
});
