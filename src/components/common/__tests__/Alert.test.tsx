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

describe('Alert', () => {
  it('renders success variant correctly', () => {
    render(<Alert variant="success" message="Operation successful" />);
    expect(screen.getByText('Operation successful')).toBeInTheDocument();
    expect(screen.getByTestId('icon-check-circle')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
    expect(screen.getByRole('alert')).toHaveClass('border-green-500');
  });

  it('renders error variant correctly', () => {
    render(<Alert variant="error" message="An error occurred" />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
    expect(screen.getByRole('alert')).toHaveClass('border-red-500');
  });

  it('renders warning variant correctly', () => {
    render(<Alert variant="warning" message="Be careful" />);
    expect(screen.getByText('Be careful')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50');
    expect(screen.getByRole('alert')).toHaveClass('border-yellow-500');
  });

  it('renders info variant correctly', () => {
    render(<Alert variant="info" message="For your information" />);
    expect(screen.getByText('For your information')).toBeInTheDocument();
    expect(screen.getByTestId('icon-info')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
    expect(screen.getByRole('alert')).toHaveClass('border-blue-500');
  });

  it('renders title when provided', () => {
    render(
      <Alert
        variant="success"
        title="Success!"
        message="Your operation was successful"
      />
    );
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(
      screen.getByText('Your operation was successful')
    ).toBeInTheDocument();
  });

  it('does not render dismiss button when not dismissible', () => {
    render(<Alert variant="info" message="Info message" />);
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('renders dismiss button when dismissible', () => {
    render(<Alert variant="info" message="Info message" dismissible />);
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
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

    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
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

  it('hides the alert when state is changed', () => {
    const { rerender } = render(
      <Alert variant="info" message="Info message" dismissible />
    );

    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);

    rerender(<Alert variant="info" message="Updated message" dismissible />);
    expect(screen.queryByText('Updated message')).not.toBeInTheDocument();
  });
});
