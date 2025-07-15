import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Spinner from '../Spinner';
import type { JSX } from 'react/jsx-runtime';

vi.mock('react-icons/cg', () => ({
  CgSpinner: (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLDivElement> &
      React.HTMLAttributes<HTMLDivElement>
  ) => <div data-testid="mock-spinner" {...props} />,
}));

vi.mock('../Typography', () => ({
  default: ({
    children,
    variant,
    color,
    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    color?: string;
    className?: string;
  }) => (
    <div
      data-testid="mock-typography"
      data-variant={variant}
      data-color={color}
      className={className}
    >
      {children}
    </div>
  ),
}));

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('mock-spinner');

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
    // Check for mobile-first size class
    expect(spinner).toHaveClass('h-5 w-5');
    expect(spinner).toHaveClass('sm:h-6 sm:w-6');
    expect(spinner).toHaveClass('text-blue-600');
    expect(screen.queryByTestId('mock-typography')).not.toBeInTheDocument();
  });

  it('applies the correct mobile-first size classes', () => {
    const { rerender } = render(<Spinner size="sm" />);
    const spinner = screen.getByTestId('mock-spinner');
    expect(spinner).toHaveClass('h-3 w-3');
    expect(spinner).toHaveClass('sm:h-4 sm:w-4');

    rerender(<Spinner size="md" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('h-5 w-5');
    expect(screen.getByTestId('mock-spinner')).toHaveClass('sm:h-6 sm:w-6');

    rerender(<Spinner size="lg" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('h-6 w-6');
    expect(screen.getByTestId('mock-spinner')).toHaveClass('sm:h-8 sm:w-8');

    rerender(<Spinner size="xl" />);
    expect(screen.getByTestId('mock-spinner')).toHaveClass('h-8 w-8');
    expect(screen.getByTestId('mock-spinner')).toHaveClass('sm:h-10 sm:w-10');
    expect(screen.getByTestId('mock-spinner')).toHaveClass('md:h-12 md:w-12');
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
    const typography = screen.getByTestId('mock-typography');
    expect(typography).toBeInTheDocument();
    expect(typography).toHaveTextContent('Loading...');
    expect(typography).toHaveAttribute('data-variant', 'body2');
    expect(typography).toHaveAttribute('data-color', 'primary');
  });

  it('uses custom text when provided', () => {
    render(<Spinner showText text="Please wait..." />);
    const typography = screen.getByTestId('mock-typography');
    expect(typography).toHaveTextContent('Please wait...');
  });

  it('applies custom className to container', () => {
    const { container } = render(<Spinner className="my-custom-class" />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('maps spinner color to Typography color correctly', () => {
    const { rerender } = render(<Spinner showText color="primary" />);
    expect(screen.getByTestId('mock-typography')).toHaveAttribute(
      'data-color',
      'primary'
    );

    rerender(<Spinner showText color="white" />);
    expect(screen.getByTestId('mock-typography')).toHaveAttribute(
      'data-color',
      'default'
    );

    rerender(<Spinner showText color="gray" />);
    expect(screen.getByTestId('mock-typography')).toHaveAttribute(
      'data-color',
      'secondary'
    );
  });

  it('applies responsive margin classes to Typography', () => {
    render(<Spinner showText />);
    const typography = screen.getByTestId('mock-typography');
    expect(typography).toHaveClass('ml-1.5');
    expect(typography).toHaveClass('sm:ml-2');
    expect(typography).toHaveClass('md:ml-3');
  });

  it('sets aria-hidden on the spinner icon', () => {
    render(<Spinner />);
    expect(screen.getByTestId('mock-spinner')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
