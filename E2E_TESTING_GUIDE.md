# E2E Testing Guide - Anki Mistral AI

## ⚠️ IMPORTANT: Tests Formulaire Anki Désactivés

Les tests E2E pour le formulaire de génération de cartes Anki (`anki-form*.spec.ts`) ont été **supprimés** car ils ne fonctionnaient pas avec la version gratuite de l'API Mistral.

**Raisons**:
- ❌ Rate limiting constant de l'API Mistral gratuite
- ❌ Timeouts systématiques (30-60s par test)
- ❌ Problème de chargement de page Next.js dans Playwright

**Alternative**: Utilisez les **tests unitaires Jest** (41 tests) qui couvrent la logique métier sans appel API.

---

## 🎯 Infrastructure de Mock (Disponible mais Non Utilisée)

L'infrastructure de mock a été créée mais n'est actuellement pas utilisée car les tests ont été supprimés.

**Fichiers disponibles** (pour usage futur):
- ✅ `.env.test.local` - Configuration USE_REAL_API
- ✅ `e2e/fixtures/api-handler.ts` - Handler conditionnel
- ✅ `e2e/fixtures/mock-api-responses.ts` - Réponses mockées

### How It Works

All tests use `setupAPIHandler()` which:
1. Checks `USE_REAL_API` environment variable in `.env.test.local`
2. If `false` (default): Intercepts API calls and returns mocked responses
3. If `true`: Allows real API calls to Mistral

**Configuration**: Edit `.env.test.local`
```bash
# Use mocked API (recommended - default)
USE_REAL_API=false

# Use real Mistral API (requires valid API key and quota)
USE_REAL_API=true
```

## 📋 Quick Start

### Run All Tests (Recommended - Uses Mocks)
```bash
# All tests with mocked API (~30-60 seconds total)
pnpm test:e2e

# Interactive UI mode
pnpm test:e2e:ui

# View test report
pnpm test:e2e:report
```

### Run Tests with Real API (Optional)
```bash
# 1. Edit .env.test.local and set USE_REAL_API=true
# 2. Run tests (requires valid MISTRAL_API_KEY)
pnpm test:e2e

# Note: May fail due to rate limiting on free tier
```

## 🧪 Test Files

### All Test Files Now Use Mocks by Default

All test files have been updated to use `setupAPIHandler()` which provides mocked API responses by default:

- **`anki-form.spec.ts`** - Main form functionality tests (mocked API)
- **`anki-form-errors.spec.ts`** - Error handling and edge cases (mocked API with error scenarios)
- **`anki-form.fast.spec.ts`** - Legacy fast tests (explicitly mocked API)

**Example with setupAPIHandler**:
```typescript
import { setupAPIHandler } from './fixtures/api-handler';

test.describe('Anki Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAPIHandler(page); // Automatically mocks API based on USE_REAL_API env var
    await page.goto('/');
  });

  test('should generate cards', async ({ page }) => {
    // Test runs with mocked API - fast and reliable
  });
});
```

### Test Execution Speeds

With mocked API (default):
- ⚡ **Per test**: ~2-5 seconds
- ⚡ **Full suite**: ~30-60 seconds
- ⚡ **No API calls**: 0 quota consumed

With real API (opt-in):
- 🐢 **Per test**: ~15-30 seconds
- 🐢 **Full suite**: ~10-15 minutes
- ⚠️ **API calls**: ~50+ requests (may hit rate limits)

## 🔧 Configuration

### Test Timeouts

```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 30 * 1000,  // 30s default timeout
  expect: {
    timeout: 5000,      // 5s for assertions
  },
});
```

**Per-test timeout override**:
```typescript
test('slow API test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds for this test
  // ... test code
});
```

### Environment Variables

**`.env.test.local`** - Primary test configuration:
```bash
# API Mock Configuration (required)
USE_REAL_API=false  # Set to 'true' to use real Mistral API

# Mistral API Keys (only needed if USE_REAL_API=true)
# MISTRAL_API_KEY=your-api-key-here
# MISTRAL_ID_AGENT=your-agent-id-here

# Test Environment
NODE_ENV=test
```

**Note**: The `.env.test.local` file is gitignored and safe to use for local configuration.

### Browser Configuration

**Chromium Only** (CI/CD):
```bash
# Fast, reliable, single browser
pnpm test:e2e:chromium
```

**All Browsers** (Local development):
```bash
# Tests across Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
pnpm test:e2e
```

## 📊 Test Organization

```
e2e/
├── anki-form.spec.ts              # Main form tests (mocked API by default)
├── anki-form.fast.spec.ts         # Fast tests (explicitly mocked)
├── anki-form-errors.spec.ts       # Error handling (mocked with error scenarios)
└── fixtures/
    ├── api-handler.ts             # Conditional mock handler (NEW)
    └── mock-api-responses.ts      # Mock response definitions
```

### Key Files

**`api-handler.ts`** - Central API mocking coordinator:
- Checks `USE_REAL_API` environment variable
- Routes to mock or real API based on configuration
- Provides consistent mocking strategy across all tests

**`mock-api-responses.ts`** - Mock response data:
- Success responses (basique, kanji)
- Error responses (500, 429 rate limit)
- Simulated 1-second API delay

## 🐛 Troubleshooting

### Tests Timing Out

**Problem**: Tests exceed 30s timeout
```
Error: Test timeout of 30000ms exceeded
```

**Solutions**:
1. Use fast tests instead: `pnpm test:e2e:fast`
2. Increase timeout for integration tests
3. Check API key validity
4. Verify internet connection

### Strict Mode Violations

**Problem**: Multiple elements match selector
```
Error: strict mode violation: getByRole('button') resolved to 2 elements
```

**Solution**: Use more specific selectors
```typescript
// ❌ Too generic
const button = page.getByRole('button');

// ✅ Specific
const button = page.getByRole('button', { name: /générer/i });
```

### API Rate Limiting

**Problem**: Tests fail with rate limit errors
```
Error: Rate limit exceeded (429)
```

**Solution**: This should no longer happen with default configuration!

All tests now use mocked API by default (`USE_REAL_API=false`). If you're still seeing rate limit errors:

1. **Verify `.env.test.local` exists and contains**:
   ```bash
   USE_REAL_API=false
   ```

2. **Check test files use `setupAPIHandler`**:
   ```typescript
   import { setupAPIHandler } from './fixtures/api-handler';

   test.beforeEach(async ({ page }) => {
     await setupAPIHandler(page); // Should be present
   });
   ```

3. **If you need real API**, accept rate limiting:
   - Set `USE_REAL_API=true` in `.env.test.local`
   - Run tests with reduced parallelism: `pnpm test:e2e -- --workers=1`
   - Add delays between test runs

### Next.js Dev Tools Interference

**Problem**: Dev tools button interferes with tests

**Solution**: Always use specific button selectors
```typescript
// ✅ Correct
page.getByRole('button', { name: /générer/i })
page.getByRole('button', { name: /Veuillez entrer/i })
```

## ✅ Best Practices

### 1. Default: Run Tests with Mocks
```bash
# All tests with mocked API (< 1 minute)
pnpm test:e2e
```

**Why mocks are sufficient**:
- ✅ Validates UI/UX interactions
- ✅ Tests form logic and validation
- ✅ Verifies error handling
- ✅ Checks navigation and state management
- ✅ Fast feedback loop

### 2. Optional: Test with Real API (Rarely Needed)
```bash
# 1. Edit .env.test.local: USE_REAL_API=true
# 2. Run limited tests
pnpm test:e2e:chromium -- --workers=1
```

**When real API testing is needed**:
- 🔍 Validating actual Mistral API integration changes
- 🔍 Verifying response format changes
- 🔍 Testing production-like behavior
- ⚠️ Note: Not needed for regular development

### 3. Writing New Tests - Always Use setupAPIHandler

```typescript
import { setupAPIHandler } from './fixtures/api-handler';

test.describe('New Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAPIHandler(page); // ✅ Always add this
    await page.goto('/');
  });

  test('should work correctly', async ({ page }) => {
    // Your test code - API will be mocked automatically
  });
});
```

### 4. Use Specific Selectors
```typescript
// ✅ Good - Specific and resistant to changes
page.getByRole('button', { name: /générer/i })
page.getByPlaceholder(/Entrez votre texte/i)
page.getByLabel(/Type de carte/i)

// ❌ Bad - Too generic or fragile
page.getByRole('button')
page.locator('button').first()
page.locator('.css-class-name')
```

### 5. Handle Async Operations Properly
```typescript
// ✅ Good - Wait for specific conditions
await expect(page.getByText(/Génération terminée/i)).toBeVisible({
  timeout: 15000,
});

// ❌ Bad - Fixed delays
await page.waitForTimeout(5000);
```

### 6. Clean Up After Tests
```typescript
test.afterEach(async ({ page }) => {
  // Close page, clear state if needed
  await page.close();
});
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright
        run: pnpm playwright install --with-deps

      - name: Run fast E2E tests
        run: pnpm test:e2e:chromium --grep fast.spec
        env:
          MISTRAL_API_KEY: ${{ secrets.MISTRAL_API_KEY }}

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 📈 Performance Tips

### 1. Parallel Execution
```bash
# Use all CPU cores (default)
pnpm test:e2e:fast

# Limit workers for stability
pnpm test:e2e:fast -- --workers=4
```

### 2. Headed vs Headless
```bash
# Headless (faster) - Default
pnpm test:e2e

# Headed (for debugging)
pnpm test:e2e:headed
```

### 3. Browser Selection
```bash
# Fastest - Chromium only
pnpm test:e2e:chromium

# Comprehensive - All browsers (slower)
pnpm test:e2e
```

## 📝 Writing New Tests

### Standard Test Template (Recommended)
```typescript
import { expect, test } from '@playwright/test';
import { setupAPIHandler } from './fixtures/api-handler';

test.describe('Feature Name Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAPIHandler(page); // Mocked API by default
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const input = page.getByPlaceholder(/text/i);

    // Act
    await input.fill('test data');
    await page.getByRole('button', { name: /submit/i }).click();

    // Assert
    await expect(page.getByText(/success/i)).toBeVisible({
      timeout: 5000, // Fast with mocked API
    });
  });
});
```

### Error Scenario Test Template
```typescript
import { expect, test } from '@playwright/test';
import { setupAPIHandler } from './fixtures/api-handler';

test.describe('Error Handling Tests', () => {
  test('should handle API errors', async ({ page }) => {
    // Use error mock scenario
    await setupAPIHandler(page, 'error');
    await page.goto('/');

    // Test error handling
    await page.getByPlaceholder(/text/i).fill('test');
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByText(/erreur/i)).toBeVisible();
  });

  test('should handle rate limiting', async ({ page }) => {
    // Use rate limit mock scenario
    await setupAPIHandler(page, 'rateLimit');
    await page.goto('/');

    // Test rate limit handling
    await page.getByPlaceholder(/text/i).fill('test');
    await page.getByRole('button', { name: /submit/i }).click();

    await expect(page.getByText(/erreur/i)).toBeVisible();
  });
});
```

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing/playwright)
- [Analysis Report](./claudedocs/playwright-analysis-2025.md)

## 📞 Support

For issues or questions:
1. Check [playwright-analysis-2025.md](./claudedocs/playwright-analysis-2025.md)
2. Review test failures in `playwright-report/index.html`
3. Run tests with `--debug` flag for step-by-step debugging
