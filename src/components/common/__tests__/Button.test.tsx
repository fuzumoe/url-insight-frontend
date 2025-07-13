import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom'; // Add this line
import Button from '../Button';

describe('Button', () => {
  it('renders children when not loading', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading spinner and text when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    // Should not show original children
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    // Should show loading text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    // Spinner element should be present and spinning
    const spinnerEl = document.querySelector('.animate-spin');
    expect(spinnerEl).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    const { rerender } = render(<Button variant="primary">P</Button>);
    expect(screen.getByText('P')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">S</Button>);
    expect(screen.getByText('S')).toHaveClass('bg-gray-200');

    rerender(<Button variant="danger">D</Button>);
    expect(screen.getByText('D')).toHaveClass('bg-red-600');
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
