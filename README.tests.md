# Jest Testing Setup for Anki Mistral AI

## Overview

Comprehensive Jest testing framework for Next.js 15.5.2 application with TypeScript, React Testing Library, and full coverage for components, actions, and utilities.

## Test Structure

```
src/
├── actions/__tests__/
│   └── chat-bot.action.test.ts       # Server action tests
├── components/__tests__/
│   └── form-chat-bot.test.tsx        # React component tests
├── context/__tests__/
│   └── chat-bot-context.test.tsx     # Context provider tests
├── schema/__tests__/
│   └── form-schema.test.ts           # Zod schema validation tests
└── utils/time/__tests__/
    └── delay.test.ts                 # Utility function tests
```

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# CI mode with coverage
pnpm test:ci
```

## Configuration Files

### jest.config.js

- Next.js 15 compatible configuration using `next/jest`
- TypeScript support via SWC (built into Next.js)
- jsdom test environment for React components
- Path aliases matching `tsconfig.json` (@/\*)
- Coverage collection configured

### jest.setup.js

- @testing-library/jest-dom matchers
- Next.js router mocks
- Mistral AI SDK mocks
- Browser API mocks (ResizeObserver, matchMedia)

## Test Coverage

Current test suites cover:

### 1. **Utility Functions** (`src/utils/time/`)

- ✅ `delay()` - Promise-based timeout
- ✅ `retryWithBackoff()` - Exponential backoff retry logic
- Tests use fake timers for precise timing control

### 2. **Zod Schemas** (`src/schema/`)

- ✅ FormDataSchema validation
  - File size limits (20KB - 5MB)
  - Text length constraints
  - Number of cards validation
- ✅ FormDataSchemaChatBot validation
  - Name requirements (1-20 chars)
  - Required fields (type, level)

### 3. **React Context** (`src/context/`)

- ✅ ChatBotContextProvider
  - State management
  - localStorage persistence
  - Message history handling
  - Form data updates

### 4. **React Components** (`src/components/`)

- ✅ FormChatBot
  - Form rendering
  - User input handling
  - Validation errors
  - Form submission
  - Dynamic component loading

### 5. **Server Actions** (`src/actions/`)

- ✅ threadChatBot
  - Mistral AI integration
  - Conversation history management
  - Error handling (429, generic)
  - System prompt generation

## Mocking Strategy

### External Dependencies

```typescript
// Mistral AI SDK
jest.mock("@mistralai/mistralai", () => ({
  Mistral: jest.fn().mockImplementation(() => ({
    chat: {
      stream: jest.fn(),
      complete: jest.fn(),
    },
  })),
}));
```

### Next.js Features

```typescript
// Router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    // ...
  }),
}));

// Dynamic imports
jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (fn: any) => (fn().then ? fn : () => fn),
}));
```

## Writing New Tests

### Component Test Template

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("YourComponent", () => {
  it("should render correctly", () => {
    render(<YourComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("should handle user interaction", async () => {
    const user = userEvent.setup();
    render(<YourComponent />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Result")).toBeInTheDocument();
    });
  });
});
```

### Server Action Test Template

```typescript
import { yourAction } from "../your-action";

jest.mock("@/lib/some-dependency");

describe("yourAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should perform action successfully", async () => {
    // Arrange
    const mockData = {
      /* test data */
    };

    // Act
    const result = await yourAction(mockData);

    // Assert
    expect(result).toEqual(expectedResult);
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock external dependencies and APIs
3. **Assertions**: Use clear, specific assertions
4. **Coverage**: Aim for >80% coverage on critical paths
5. **Performance**: Use fake timers for time-dependent code
6. **Async**: Always await async operations
7. **Cleanup**: Clear mocks between tests

## Troubleshooting

### Issue: "act() warning"

**Solution**: Wrap state updates in `act()` or use `waitFor()`

### Issue: "Module not found"

**Solution**: Check path aliases in `jest.config.js` match `tsconfig.json`

### Issue: "Timer issues"

**Solution**: Ensure `jest.useFakeTimers()` in beforeEach, `jest.useRealTimers()` in afterEach

### Issue: "Dynamic import errors"

**Solution**: Mock `next/dynamic` to return synchronous components

## CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: pnpm test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Dependencies

- **jest**: ^30.2.0
- **@testing-library/react**: ^16.3.0
- **@testing-library/jest-dom**: ^6.9.1
- **@testing-library/user-event**: ^14.6.1
- **jest-environment-jsdom**: ^30.2.0
- **@types/jest**: ^30.0.0

## Next Steps

1. Add tests for remaining components (csv-viewer, chat-bot, etc.)
2. Add tests for mistral.action.ts
3. Add integration tests for full user flows
4. Set up test coverage thresholds
5. Add E2E tests with Playwright

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)
