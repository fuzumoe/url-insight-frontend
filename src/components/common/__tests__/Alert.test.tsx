import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Alert from '../Alert';

// Mock react-icons/fi
vi.mock('react-icons/fi', () => ({
  FiAlertCircle: () => <div data-testid="icon-alert-circle" />,
  FiCheckCircle: () => <div data-testid="icon-check-circle" />,
  FiInfo: () => <div data-testid="icon-info" />,
  FiX: () => <div data-testid="icon-x" />,
}));

// Mock Typography component
vi.mock('../Typography', () => ({
  default: ({
    children,
    variant,
    color,
    weight,
    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    color?: string;
    weight?: string;
    className?: string;
  }) => (
    <div
      data-testid="mock-typography"
      data-variant={variant}
      data-color={color}
      data-weight={weight}
      className={className}
    >
      {children}
    </div>
  ),
}));

// Mock Button component
vi.mock('../Button', () => ({
  default: ({
    children,
    variant,
    size,
    className,
    onClick,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode;
    variant?: string;
    size?: string;
    className?: string;
    onClick?: () => void;
    'aria-label'?: string;
  }) => (
    <button
      data-testid="mock-button"
      data-variant={variant}
      data-size={size}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

describe('Alert', () => {
  it('renders success variant correctly', () => {
    render(<Alert variant="success" message="Operation successful" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('bg-green-50');
    expect(alertElement).toHaveClass('border-green-500');

    expect(screen.getByTestId('icon-check-circle')).toBeInTheDocument();

    const messageTypography = screen.getAllByTestId('mock-typography')[0];
    expect(messageTypography).toHaveTextContent('Operation successful');
    expect(messageTypography).toHaveAttribute('data-color', 'secondary');
    expect(messageTypography).toHaveAttribute('data-variant', 'body2');
  });

  it('renders error variant correctly', () => {
    render(<Alert variant="error" message="An error occurred" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('bg-red-50');
    expect(alertElement).toHaveClass('border-red-500');

    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();

    const messageTypography = screen.getAllByTestId('mock-typography')[0];
    expect(messageTypography).toHaveTextContent('An error occurred');
  });

  it('renders warning variant correctly', () => {
    render(<Alert variant="warning" message="Be careful" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('bg-yellow-50');
    expect(alertElement).toHaveClass('border-yellow-500');

    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();

    const messageTypography = screen.getAllByTestId('mock-typography')[0];
    expect(messageTypography).toHaveTextContent('Be careful');
  });

  it('renders info variant correctly', () => {
    render(<Alert variant="info" message="For your information" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('bg-blue-50');
    expect(alertElement).toHaveClass('border-blue-500');

    expect(screen.getByTestId('icon-info')).toBeInTheDocument();

    const messageTypography = screen.getAllByTestId('mock-typography')[0];
    expect(messageTypography).toHaveTextContent('For your information');
  });

  it('renders title when provided', () => {
    render(
      <Alert
        variant="success"
        title="Success!"
        message="Your operation was successful"
      />
    );

    const typographyElements = screen.getAllByTestId('mock-typography');
    expect(typographyElements[0]).toHaveTextContent('Success!');
    expect(typographyElements[0]).toHaveAttribute('data-variant', 'subtitle2');
    expect(typographyElements[0]).toHaveAttribute('data-weight', 'medium');
    expect(typographyElements[0]).toHaveAttribute('data-color', 'success');

    expect(typographyElements[1]).toHaveTextContent(
      'Your operation was successful'
    );
    expect(typographyElements[1]).toHaveAttribute('data-variant', 'body2');
    expect(typographyElements[1]).toHaveAttribute('data-color', 'secondary');
    expect(typographyElements[1]).toHaveClass('mt-1');
  });

  it('does not render dismiss button when not dismissible', () => {
    render(<Alert variant="info" message="Info message" />);
    expect(screen.queryByTestId('mock-button')).not.toBeInTheDocument();
  });

  it('renders dismiss button when dismissible', () => {
    render(<Alert variant="info" message="Info message" dismissible />);
    const button = screen.getByRole('button', { name: /dismiss/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Dismiss');
    expect(button).toHaveAttribute('data-size', 'sm');
    expect(button).toHaveClass('hover:bg-blue-100');
  });

  it('calls onDismiss and hides the alert when dismiss button is clicked', () => {
    const handleDismiss = vi.fn();
    render(
      <Alert
        variant="info"
        message="Info message"
        dismissible
        onDismiss={handleDismiss}
      />
    );

    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissButton);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('mock-typography')).not.toBeInTheDocument();
  });
  it('applies custom className', () => {
    render(
      <Alert
        variant="success"
        message="Success message"
        className="custom-class"
      />
    );
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('uses correct button variant based on alert variant', () => {
    const { rerender } = render(
      <Alert variant="success" message="Success message" dismissible />
    );
    expect(
      screen.getByRole('button', { name: /dismiss/i })
    ).toBeInTheDocument();

    rerender(<Alert variant="error" message="Error message" dismissible />);
    expect(
      screen.getByRole('button', { name: /dismiss/i })
    ).toBeInTheDocument();

    rerender(<Alert variant="warning" message="Warning message" dismissible />);
    expect(
      screen.getByRole('button', { name: /dismiss/i })
    ).toBeInTheDocument();

    rerender(<Alert variant="info" message="Info message" dismissible />);
    expect(
      screen.getByRole('button', { name: /dismiss/i })
    ).toBeInTheDocument();
  });

  it('applies mobile-first responsive padding', () => {
    render(<Alert variant="success" message="Success message" />);
    expect(screen.getByRole('alert')).toHaveClass('p-3');
    expect(screen.getByRole('alert')).toHaveClass('sm:p-4');
  });
});
