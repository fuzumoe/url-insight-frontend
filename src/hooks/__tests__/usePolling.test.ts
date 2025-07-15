import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, vi } from 'vitest';
import { usePolling } from '../usePolling';

describe('usePolling', () => {
  it('calls callback at interval when active', () => {
    vi.useFakeTimers();
    const cb = vi.fn();
    renderHook(() => usePolling(cb, 100, true));
    vi.advanceTimersByTime(350);
    expect(cb).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });

  it('does not call callback when not active', () => {
    vi.useFakeTimers();
    const cb = vi.fn();
    renderHook(() => usePolling(cb, 100, false));
    vi.advanceTimersByTime(300);
    expect(cb).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
