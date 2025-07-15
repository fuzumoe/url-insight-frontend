import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Button from '../Button';

vi.mock('../Spinner', () => ({
  default: ({
    size,
    color,
    showText,
    text,
  }: {
    size: string;
    color: string;
    showText: boolean;
    text: string;
  }) => (
    <div
      data-testid="mock-spinner"
      data-size={size}
      data-color={color}
      data-showtext={showText.toString()}
    >
      {showText && text}
      <span className="animate-spin">spinner</span>
    </div>
  ),
}));

describe('Button', () => {
  it('renders children when not loading', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();

    const spinner = screen.getByTestId('mock-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('data-showtext', 'true');
    expect(spinner).toHaveTextContent('Loading...');
  });

  it('applies the correct variant class', () => {
    const { rerender } = render(<Button variant="primary">P</Button>);
    expect(screen.getByText('P').closest('button')).toHaveClass('bg-blue-600');

    rerender(<Button variant="secondary">S</Button>);
    expect(screen.getByText('S').closest('button')).toHaveClass('bg-gray-200');

    rerender(<Button variant="danger">D</Button>);
    expect(screen.getByText('D').closest('button')).toHaveClass('bg-red-600');
  });

  it('applies the correct mobile-first size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    const smallButton = screen.getByText('Small').closest('button');
    expect(smallButton).toHaveClass('px-2');
    expect(smallButton).toHaveClass('py-1');
    expect(smallButton).toHaveClass('sm:px-2.5');
    expect(smallButton).toHaveClass('sm:py-1.5');

    rerender(<Button size="md">Medium</Button>);
    const mediumButton = screen.getByText('Medium').closest('button');
    expect(mediumButton).toHaveClass('px-3');
    expect(mediumButton).toHaveClass('py-1.5');
    expect(mediumButton).toHaveClass('sm:px-4');
    expect(mediumButton).toHaveClass('sm:py-2');

    rerender(<Button size="lg">Large</Button>);
    const largeButton = screen.getByText('Large').closest('button');
    expect(largeButton).toHaveClass('px-4');
    expect(largeButton).toHaveClass('py-2');
    expect(largeButton).toHaveClass('sm:px-5');
    expect(largeButton).toHaveClass('sm:py-2.5');

    rerender(<Button size="xl">XL</Button>);
    const xlButton = screen.getByText('XL').closest('button');
    expect(xlButton).toHaveClass('px-5');
    expect(xlButton).toHaveClass('py-2.5');
    expect(xlButton).toHaveClass('sm:px-6');
    expect(xlButton).toHaveClass('sm:py-3');
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

  it('applies fullWidth class when specified', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('maps spinner size correctly based on button size', () => {
    const { rerender } = render(
      <Button isLoading size="sm">
        Small
      </Button>
    );
    expect(screen.getByTestId('mock-spinner')).toHaveAttribute(
      'data-size',
      'sm'
    );

    rerender(
      <Button isLoading size="md">
        Medium
      </Button>
    );
    expect(screen.getByTestId('mock-spinner')).toHaveAttribute(
      'data-size',
      'sm'
    );

    rerender(
      <Button isLoading size="lg">
        Large
      </Button>
    );
    expect(screen.getByTestId('mock-spinner')).toHaveAttribute(
      'data-size',
      'md'
    );

    rerender(
      <Button isLoading size="xl">
        XL
      </Button>
    );
    expect(screen.getByTestId('mock-spinner')).toHaveAttribute(
      'data-size',
      'md'
    );
  });
});
