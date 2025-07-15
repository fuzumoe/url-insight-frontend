import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSort } from '../useSort';

describe('useSort', () => {
  it('initializes with default field and direction', () => {
    const { result } = renderHook(() => useSort<{ a: number }>('a', 'desc'));
    expect(result.current.sortField).toBe('a');
    expect(result.current.sortDirection).toBe('desc');
  });

  it('sorts by new field and toggles direction', () => {
    const { result } = renderHook(() => useSort<{ a: number; b: number }>('a'));
    act(() => result.current.sortBy('b'));
    expect(result.current.sortField).toBe('b');
    expect(result.current.sortDirection).toBe('asc');
    act(() => result.current.sortBy('b'));
    expect(result.current.sortDirection).toBe('desc');
  });
});
