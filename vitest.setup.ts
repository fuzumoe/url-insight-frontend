import { TextEncoder, TextDecoder } from 'util';

// vitest.setup.ts
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder as any;

// Import necessary matchers from Vitest
import { vi } from 'vitest';
globalThis.jest = {
  fn: vi.fn,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  useFakeTimers: vi.useFakeTimers,
};
