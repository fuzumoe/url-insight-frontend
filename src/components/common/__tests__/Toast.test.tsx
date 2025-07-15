import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import Toast from '../Toast';

vi.mock('react-icons/fi', () => ({
  FiAlertCircle: ({ className }: { className?: string }) => (
    <div data-testid="icon-alert-circle" className={className} />
  ),
  FiCheckCircle: ({ className }: { className?: string }) => (
    <div data-testid="icon-check-circle" className={className} />
  ),
  FiInfo: ({ className }: { className?: string }) => (
    <div data-testid="icon-info" className={className} />
  ),
  FiX: ({ className }: { className?: string }) => (
    <div data-testid="icon-x" className={className} />
  ),
}));

vi.mock('../Typography', () => ({
  default: vi.fn(
    ({ children, variant, as: Component = 'span', className, ...props }) => (
      <Component
        data-testid={`typography-${variant}`}
        className={className || ''}
        {...props}
      >
        {children}
      </Component>
    )
  ),
}));

vi.mock('../Button', () => ({
  default: vi.fn(
    ({ children, onClick, variant, size, className, ...props }) => (
      <button
        data-testid={`button-${variant}-${size}`}
        onClick={onClick}
        className={className || ''}
        {...props}
      >
        {children}
      </button>
    )
  ),
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

    expect(screen.getByTestId('button-primary-sm')).toBeInTheDocument();
  });

  it('renders error variant correctly', () => {
    render(
      <Toast variant="error" message="An error occurred" onDismiss={() => {}} />
    );
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
    expect(screen.getByRole('alert')).toHaveClass('border-red-500');

    expect(screen.getByTestId('button-danger-sm')).toBeInTheDocument();
  });

  it('renders warning variant correctly', () => {
    render(
      <Toast variant="warning" message="Be careful" onDismiss={() => {}} />
    );
    expect(screen.getByText('Be careful')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50');
    expect(screen.getByRole('alert')).toHaveClass('border-yellow-500');

    expect(screen.getByTestId('button-secondary-sm')).toBeInTheDocument();
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

    expect(screen.getByTestId('button-secondary-sm')).toBeInTheDocument();
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

    const titleElement = screen.getByText('Success!');
    expect(
      titleElement.closest('[data-testid="typography-caption"]')
    ).toBeInTheDocument();
  });

  it('renders dismiss button with variant based on toast type', () => {
    const { unmount: unmountSuccess } = render(
      <Toast variant="success" message="Success message" onDismiss={() => {}} />
    );
    expect(screen.getByTestId('button-primary-sm')).toBeInTheDocument();
    unmountSuccess();

    const { unmount: unmountError } = render(
      <Toast variant="error" message="Error message" onDismiss={() => {}} />
    );
    expect(screen.getByTestId('button-danger-sm')).toBeInTheDocument();
    unmountError();

    const { unmount: unmountWarning } = render(
      <Toast variant="warning" message="Warning message" onDismiss={() => {}} />
    );
    expect(screen.getByTestId('button-secondary-sm')).toBeInTheDocument();
    unmountWarning();

    render(
      <Toast variant="info" message="Info message" onDismiss={() => {}} />
    );
    expect(screen.getByTestId('button-secondary-sm')).toBeInTheDocument();
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
    expect(screen.queryByTestId('button-secondary-sm')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const handleDismiss = vi.fn();
    render(
      <Toast
        variant="success"
        message="Success message"
        onDismiss={handleDismiss}
      />
    );

    const dismissButton = screen.getByTestId('button-primary-sm');
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

    unmount();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(handleDismiss).not.toHaveBeenCalled();
  });

  it('applies mobile-first responsive container padding', () => {
    render(
      <Toast variant="info" message="Test message" onDismiss={() => {}} />
    );
    const container = screen.getByRole('alert');
    expect(container).toHaveClass('p-3');
    expect(container).toHaveClass('sm:p-4');
  });

  it('applies mobile-first responsive margin', () => {
    render(
      <Toast variant="info" message="Test message" onDismiss={() => {}} />
    );
    const container = screen.getByRole('alert');
    expect(container).toHaveClass('mb-3');
    expect(container).toHaveClass('sm:mb-4');
  });

  it('applies mobile-first responsive width', () => {
    render(
      <Toast variant="info" message="Test message" onDismiss={() => {}} />
    );
    const container = screen.getByRole('alert');
    expect(container).toHaveClass('max-w-full');
    expect(container).toHaveClass('sm:max-w-md');
  });

  it('applies mobile-first responsive icon sizing', () => {
    render(
      <Toast variant="info" message="Test message" onDismiss={() => {}} />
    );

    const dismissIcon = screen.getByTestId('icon-x');

    expect(dismissIcon).toHaveClass('h-4');
    expect(dismissIcon).toHaveClass('w-4');
    expect(dismissIcon).toHaveClass('sm:h-5');
    expect(dismissIcon).toHaveClass('sm:w-5');
  });

  it('applies mobile-first responsive content spacing', () => {
    render(
      <Toast
        variant="info"
        title="Title"
        message="Test message"
        onDismiss={() => {}}
      />
    );
    const contentContainer = screen.getByText('Test message').parentElement;
    expect(contentContainer).toHaveClass('ml-2');
    expect(contentContainer).toHaveClass('sm:ml-3');

    const messageElement = screen
      .getByText('Test message')
      .closest('[data-testid="typography-caption"]');
    expect(messageElement).toHaveClass('mt-0.5');
    expect(messageElement).toHaveClass('sm:mt-1');
  });
});
