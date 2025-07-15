import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSearch } from '../useSearch';

describe('useSearch', () => {
  it('initializes with default query', () => {
    const { result } = renderHook(() => useSearch('foo'));
    expect(result.current.query).toBe('foo');
  });

  it('updates query on search', () => {
    const { result } = renderHook(() => useSearch());
    act(() => result.current.onSearch('bar'));
    expect(result.current.query).toBe('bar');
  });
});
