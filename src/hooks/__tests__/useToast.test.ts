import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect } from 'vitest';
import { useToast } from '../useToast';

const mockContext = { show: () => {}, hide: () => {} };

vi.mock('../../context/ToastContext', () => ({
  ToastContext: { Provider: ({ children }: any) => children, ...mockContext },
}));

describe('useToast', () => {
  it('throws if not in provider', () => {
    expect(() => renderHook(() => useToast())).toThrow();
  });
});
