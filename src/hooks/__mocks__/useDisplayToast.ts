/**
 * Manual mock for useDisplayToast hook
 * This avoids hoisting issues with jest.mock()
 */

export const mockDisplayToast = jest.fn();

export const useDisplayToast = jest.fn(() => ({
  displayToast: mockDisplayToast,
}));
