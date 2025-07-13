import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button', () => {
  it('renders children when not loading', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading spinner and text when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    const spinner = screen
      .getByText('Loading...')
      .parentElement?.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });

  it('applies the correct variant class', () => {
    const { rerender } = render(<Button variant="primary">P</Button>);
    expect(screen.getByText('P')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">S</Button>);
    expect(screen.getByText('S')).toHaveClass('bg-gray-200');

    rerender(<Button variant="danger">D</Button>);
    expect(screen.getByText('D')).toHaveClass('bg-red-600');
  });

  it('applies the correct size class', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('px-2.5');
    expect(screen.getByText('Small')).toHaveClass('text-xs');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium')).toHaveClass('px-4');
    expect(screen.getByText('Medium')).toHaveClass('text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('px-5');
    expect(screen.getByText('Large')).toHaveClass('text-base');

    rerender(<Button size="xl">XL</Button>);
    expect(screen.getByText('XL')).toHaveClass('px-6');
    expect(screen.getByText('XL')).toHaveClass('text-lg');
  });

  it('is disabled when loading or when disabled prop is set', () => {
    const { rerender } = render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('fires onClick when enabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
