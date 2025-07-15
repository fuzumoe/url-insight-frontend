import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, ToastContext } from '../ToastContext';

vi.mock('../../components/common/Toast', () => ({
  default: ({
    message,
    variant,
    title,
    onDismiss,
  }: {
    message: string;
    variant: string;
    title?: string;
    onDismiss: () => void;
  }) => (
    <div
      data-testid="mock-toast"
      data-variant={variant}
      data-message={message}
      data-title={title || ''}
    >
      {title && <div data-testid="toast-title">{title}</div>}
      <div data-testid="toast-message">{message}</div>
      <button data-testid="toast-dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  ),
}));

const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;
let timeoutIds: NodeJS.Timeout[] = [];

const customSetTimeout = function (
  callback: (...args: unknown[]) => void,
  delay?: number
) {
  const id = originalSetTimeout(callback, delay) as unknown as NodeJS.Timeout;
  timeoutIds.push(id);
  return id;
};

Object.assign(customSetTimeout, originalSetTimeout);

global.setTimeout = customSetTimeout as typeof originalSetTimeout;

global.clearTimeout = function (id) {
  const index = timeoutIds.indexOf(id as NodeJS.Timeout);
  if (index > -1) {
    timeoutIds.splice(index, 1);
  }
  return originalClearTimeout(id);
};

describe('ToastContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    timeoutIds = [];
  });

  afterEach(() => {
    timeoutIds.forEach(id => originalClearTimeout(id));
    timeoutIds = [];
  });

  it('provides empty toasts array initially', () => {
    const TestConsumer = () => {
      const context = React.useContext(ToastContext);
      return (
        <div data-testid="toast-count">
          {context?.toasts.length || 0} toasts
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0 toasts');
  });

  it('adds a toast when addToast is called', () => {
    const TestConsumer = () => {
      const context = React.useContext(ToastContext);
      return (
        <div>
          <div data-testid="toast-count">
            {context?.toasts.length || 0} toasts
          </div>
          <button
            onClick={() =>
              context?.addToast({
                message: 'Test toast',
                variant: 'success',
                title: 'Test Title',
                duration: Infinity,
              })
            }
            data-testid="add-toast"
          >
            Add Toast
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0 toasts');

    fireEvent.click(screen.getByTestId('add-toast'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1 toasts');
    expect(screen.getByTestId('mock-toast')).toBeInTheDocument();
  });

  it('removes a toast when removeToast is called', () => {
    const TestConsumer = () => {
      const context = React.useContext(ToastContext);

      return (
        <div>
          <div data-testid="toast-count">
            {context?.toasts.length || 0} toasts
          </div>
          <button
            data-testid="add-test-toast"
            onClick={() => {
              if (context) {
                context.addToast({
                  message: 'Test toast',
                  variant: 'success',
                  duration: Infinity,
                });
              }
            }}
          >
            Add
          </button>
          <button
            data-testid="remove-first-toast"
            onClick={() => {
              if (context && context.toasts.length > 0) {
                context.removeToast(context.toasts[0].id);
              }
            }}
          >
            Remove First
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0 toasts');

    fireEvent.click(screen.getByTestId('add-test-toast'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1 toasts');

    fireEvent.click(screen.getByTestId('remove-first-toast'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0 toasts');
  });

  it('automatically removes toast after duration', () => {
    vi.useFakeTimers();

    const TestConsumer = () => {
      const context = React.useContext(ToastContext);

      const addAutoRemoveToast = () => {
        if (context) {
          context.addToast({
            message: 'Auto remove toast',
            variant: 'info',
            duration: 50,
          });
        }
      };

      return (
        <div>
          <div data-testid="toast-count">
            {context?.toasts.length || 0} toasts
          </div>
          <button data-testid="add-auto-toast" onClick={addAutoRemoveToast}>
            Add Auto-Remove Toast
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('add-auto-toast'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1 toasts');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0 toasts');

    vi.useRealTimers();
  });

  it('clears all toasts when clearToasts is called', () => {
    const TestConsumer = () => {
      const context = React.useContext(ToastContext);

      const addMultipleToasts = () => {
        if (context) {
          context.addToast({
            message: 'Toast 1',
            variant: 'success',
            duration: Infinity,
          });
          context.addToast({
            message: 'Toast 2',
            variant: 'error',
            duration: Infinity,
          });
        }
      };

      return (
        <div>
          <div data-testid="toast-count">
            {context?.toasts.length || 0} toasts
          </div>
          <button data-testid="add-multiple" onClick={addMultipleToasts}>
            Add Multiple
          </button>
          <button
            data-testid="clear-toasts"
            onClick={() => context?.clearToasts()}
          >
            Clear All
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('add-multiple'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('2 toasts');

    fireEvent.click(screen.getByTestId('clear-toasts'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0 toasts');
  });
  it('renders toast container with correct styling', () => {
    const TestConsumer = () => {
      const context = React.useContext(ToastContext);
      return (
        <>
          <button
            onClick={() =>
              context?.addToast({
                message: 'Test toast',
                variant: 'success',
                duration: Infinity,
              })
            }
            data-testid="add-toast"
          >
            Add Toast
          </button>
        </>
      );
    };

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    fireEvent.click(screen.getByTestId('add-toast'));

    const container = screen.getByTestId('mock-toast').parentElement;
    expect(container).toHaveClass('animate-slide-in');

    expect(container).toHaveStyle('max-width: 350px');
  });
});
