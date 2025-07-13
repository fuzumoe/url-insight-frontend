import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Spinner from '../Spinner';
import type { JSX } from 'react/jsx-runtime';

// Mock react-icons/cg
vi.mock('react-icons/cg', () => ({
  CgSpinner: (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLDivElement> &
      React.HTMLAttributes<HTMLDivElement>
  ) => <div data-testid="mock-spinner" {...props} />,
}));

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('mock-spinner');

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('h-6 w-6');
    expect(spinner).toHaveClass('text-blue-600');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('applies the correct size classes', () => {
    const { rerender } = render(<Spinner size="sm" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('h-4 w-4');

    rerender(<Spinner size="md" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('h-6 w-6');

    rerender(<Spinner size="lg" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('h-8 w-8');

    rerender(<Spinner size="xl" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('h-12 w-12');
  });

  it('applies the correct color classes', () => {
    const { rerender } = render(<Spinner color="primary" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('text-blue-600');

    rerender(<Spinner color="white" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('text-white');

    rerender(<Spinner color="gray" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('text-gray-500');
  });

  it('shows text when showText is true', () => {
    render(<Spinner showText />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toHaveClass('text-blue-600');
  });

  it('uses custom text when provided', () => {
    render(<Spinner showText text="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const { container } = render(<Spinner className="my-custom-class" />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('applies color to text when shown', () => {
    const { rerender } = render(<Spinner showText color="primary" />);
    expect(screen.getByText('Loading...')).toHaveClass('text-blue-600');

    rerender(<Spinner showText color="white" />);
    expect(screen.getByText('Loading...')).toHaveClass('text-white');

    rerender(<Spinner showText color="gray" />);
    expect(screen.getByText('Loading...')).toHaveClass('text-gray-500');
  });

  it('sets aria-hidden on the spinner icon', () => {
    render(<Spinner />);
    expect(screen.getByTestId('mock-spinner')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
