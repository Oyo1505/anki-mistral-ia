/**
 * Jest setup file - runs after test environment is initialized
 * Configures testing libraries and global test utilities
 */

import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill TextEncoder/TextDecoder for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Web APIs for testing (Node 20 has native fetch but tests need mocks)
if (!global.Request) {
  global.Request = class Request {
    constructor(input, init) {
      this.url = input
      this.method = init?.method || 'GET'
      this.headers = new Headers(init?.headers)
    }
  }
}

if (!global.Response) {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body
      this.status = init?.status || 200
      this.headers = new Headers(init?.headers)
    }
  }
}

if (!global.Headers) {
  global.Headers = class Headers {
    constructor(init) {
      this.map = new Map(Object.entries(init || {}))
    }
    get(name) {
      return this.map.get(name)
    }
    set(name, value) {
      this.map.set(name, value)
    }
  }
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Mistral AI
jest.mock('@mistralai/mistralai', () => ({
  Mistral: jest.fn().mockImplementation(() => ({
    chat: {
      stream: jest.fn(),
      complete: jest.fn(),
    },
  })),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
