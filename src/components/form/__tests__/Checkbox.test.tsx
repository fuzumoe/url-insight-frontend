import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Checkbox from '../Checkbox';

vi.mock('../..', () => {
  return {
    Flex: ({
      children,
      align,
      className,
    }: {
      children: React.ReactNode;
      align?: string;
      className?: string;
    }) => (
      <div data-testid="mock-flex" data-align={align} className={className}>
        {children}
      </div>
    ),
    Typography: ({
      children,
      variant,
      color,
      className,
      as: Component = 'span',
      ...props
    }: {
      children: React.ReactNode;
      variant?: string;
      color?: string;
      className?: string;
      as?: React.ElementType;
    }) => (
      <Component
        data-testid="mock-typography"
        data-variant={variant}
        data-color={color}
        className={className}
        {...props}
      >
        {children}
      </Component>
    ),
  };
});

describe('Checkbox', () => {
  it('applies custom className', () => {
    render(<Checkbox className="custom-class" />);
    const flexContainer = screen.getByTestId('mock-flex');
    expect(flexContainer).toHaveClass('custom-class');
  });

  it('applies mobile-first checkbox sizing', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('h-5');
    expect(checkbox).toHaveClass('w-5');
    expect(checkbox).toHaveClass('sm:h-4');
    expect(checkbox).toHaveClass('sm:w-4');
  });

  it('applies mobile-first label margin', () => {
    render(<Checkbox label="Test" />);
    const typography = screen.getByTestId('mock-typography');
    const labelContainer = typography.closest('div');
    expect(labelContainer).toHaveClass('ml-3');
    expect(labelContainer).toHaveClass('sm:ml-2');
  });

  it('uses Flex with align="center"', () => {
    render(<Checkbox />);
    const flexContainer = screen.getByTestId('mock-flex');
    expect(flexContainer).toHaveAttribute('data-align', 'center');
  });
  it('associates label with checkbox using id', () => {
    render(<Checkbox label="Test label" id="test-id" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'test-id');

    const typography = screen.getByTestId('mock-typography');

    expect(typography).toHaveAttribute('data-variant', 'body2');

    const label = screen.getByText('Test label');
    expect(label.closest('label')).toHaveAttribute('for', 'test-id');
  });
});
