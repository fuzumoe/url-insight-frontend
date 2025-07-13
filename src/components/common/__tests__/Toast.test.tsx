import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import Toast from '../Toast';

// Mock react-icons/fi
vi.mock('react-icons/fi', () => ({
  FiAlertCircle: () => <div data-testid="icon-alert-circle" />,
  FiCheckCircle: () => <div data-testid="icon-check-circle" />,
  FiInfo: () => <div data-testid="icon-info" />,
  FiX: () => <div data-testid="icon-x" />,
}));

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders success variant correctly', () => {
    render(
      <Toast
        variant="success"
        message="Operation successful"
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    expect(screen.getByTestId('icon-check-circle')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
    expect(screen.getByRole('alert')).toHaveClass('border-green-500');
  });

  it('renders error variant correctly', () => {
    render(
      <Toast variant="error" message="An error occurred" onDismiss={() => {}} />
    );
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
    expect(screen.getByRole('alert')).toHaveClass('border-red-500');
  });

  it('renders warning variant correctly', () => {
    render(
      <Toast variant="warning" message="Be careful" onDismiss={() => {}} />
    );
    expect(screen.getByText('Be careful')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50');
    expect(screen.getByRole('alert')).toHaveClass('border-yellow-500');
  });

  it('renders info variant correctly', () => {
    render(
      <Toast
        variant="info"
        message="For your information"
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('For your information')).toBeInTheDocument();
    expect(screen.getByTestId('icon-info')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
    expect(screen.getByRole('alert')).toHaveClass('border-blue-500');
  });

  it('renders title when provided', () => {
    render(
      <Toast
        variant="success"
        title="Success!"
        message="Your operation was successful"
        onDismiss={() => {}}
      />
    );
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(
      screen.getByText('Your operation was successful')
    ).toBeInTheDocument();
  });

  it('renders dismiss button by default', () => {
    render(
      <Toast variant="info" message="Info message" onDismiss={() => {}} />
    );
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
  });

  it('does not render dismiss button when dismissible is false', () => {
    render(
      <Toast
        variant="info"
        message="Info message"
        dismissible={false}
        onDismiss={() => {}}
      />
    );
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const handleDismiss = vi.fn();
    render(
      <Toast variant="info" message="Info message" onDismiss={handleDismiss} />
    );

    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('automatically dismisses after duration', () => {
    const handleDismiss = vi.fn();
    render(
      <Toast
        variant="info"
        message="Auto dismiss message"
        duration={3000}
        onDismiss={handleDismiss}
      />
    );

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(handleDismiss).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not auto-dismiss when duration is 0', () => {
    const handleDismiss = vi.fn();
    render(
      <Toast
        variant="info"
        message="No auto dismiss"
        duration={0}
        onDismiss={handleDismiss}
      />
    );

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(handleDismiss).not.toHaveBeenCalled();
  });

  it('clears timeout when unmounted', () => {
    const handleDismiss = vi.fn();
    const { unmount } = render(
      <Toast
        variant="info"
        message="Unmount test"
        duration={5000}
        onDismiss={handleDismiss}
      />
    );

    // Unmount before timeout completes
    unmount();

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(handleDismiss).not.toHaveBeenCalled();
  });
});
