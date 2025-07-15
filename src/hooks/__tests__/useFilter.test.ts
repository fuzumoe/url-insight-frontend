import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFilter } from '../useFilter';
import type { URLStatus, URLTableFilters } from '../../types';

describe('useFilter', () => {
  it('initializes with empty filters when no initial filters provided', () => {
    const { result } = renderHook(() => useFilter());
    expect(result.current.filters).toEqual({});
  });

  it('initializes with provided initial filters', () => {
    const initialFilters: URLTableFilters = {
      status: 'pending' as URLStatus,
      hasBrokenLinks: false,
      hasLoginForm: true,
      latestOnly: true,
    };
    const { result } = renderHook(() => useFilter(initialFilters));
    expect(result.current.filters).toEqual(initialFilters);
  });

  it('sets a filter correctly', () => {
    const { result } = renderHook(() => useFilter());
    act(() => result.current.setFilter('status', 'done'));
    expect(result.current.filters.status).toBe('done');
  });

  it('sets multiple filters correctly', () => {
    const { result } = renderHook(() => useFilter());

    act(() => result.current.setFilter('status', 'done'));
    act(() => result.current.setFilter('hasBrokenLinks', true));

    expect(result.current.filters).toEqual({
      status: 'done',
      hasBrokenLinks: true,
    });
  });

  it('overwrites existing filter with same key', () => {
    const { result } = renderHook(() => useFilter());

    act(() => result.current.setFilter('status', 'queued'));
    act(() => result.current.setFilter('status', 'done'));

    expect(result.current.filters.status).toBe('done');
  });

  it('resets all filters', () => {
    const initialFilters: URLTableFilters = {
      status: 'queued',
      hasLoginForm: false,
    };
    const { result } = renderHook(() => useFilter(initialFilters));

    act(() => result.current.setFilter('status', 'queued'));
    expect(result.current.filters).toEqual({
      ...initialFilters,
    });

    act(() => result.current.resetFilters());
    expect(result.current.filters).toEqual({});
  });
});
