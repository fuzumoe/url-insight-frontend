import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  it('initializes with default page', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.currentPage).toBe(1);
  });

  it('goes to a specific page', () => {
    const { result } = renderHook(() => usePagination());
    act(() => result.current.goToPage(5));
    expect(result.current.currentPage).toBe(5);
  });

  it('increments and decrements page', () => {
    const { result } = renderHook(() => usePagination(2));
    act(() => result.current.nextPage());
    expect(result.current.currentPage).toBe(3);
    act(() => result.current.prevPage());
    expect(result.current.currentPage).toBe(2);
    act(() => result.current.prevPage());
    expect(result.current.currentPage).toBe(1);
  });
});
