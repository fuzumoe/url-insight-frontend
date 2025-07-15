import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToast } from '../useToast';
import React from 'react';
import { ToastContext } from '../../context/ToastContext';

const testMockAddToast = vi.fn();
const testMockRemoveToast = vi.fn();
const testMockClearToasts = vi.fn();

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    ToastContext.Provider,
    {
      value: {
        toasts: [],
        addToast: testMockAddToast,
        removeToast: testMockRemoveToast,
        clearToasts: testMockClearToasts,
      },
    },
    children
  );

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws error when used outside of ToastProvider', () => {
    // No wrapper provided, so this should throw
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used within a ToastProvider'
    );
  });

  it('returns toast context when used inside provider', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current.addToast).toBe(testMockAddToast);
    expect(result.current.removeToast).toBe(testMockRemoveToast);
    expect(result.current.clearToasts).toBe(testMockClearToasts);
    expect(result.current.toasts).toEqual([]);
  });

  it('calls addToast with correct parameters', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    const toast = {
      message: 'Test message',
      variant: 'success' as const,
      title: 'Test Title',
    };

    result.current.addToast(toast);

    expect(testMockAddToast).toHaveBeenCalledWith(toast);
  });
});
