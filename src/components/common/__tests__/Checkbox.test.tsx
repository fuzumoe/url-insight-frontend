import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Checkbox from '../Checkbox';

vi.mock('../Typography', () => ({
  default: ({
    children,
    variant,
    color,
    className,
    as,
    htmlFor,
  }: {
    children: React.ReactNode;
    variant?: string;
    color?: string;
    className?: string;
    as?: React.ElementType;
    htmlFor?: string;
  }) => {
    const Component = as || 'span';
    return (
      <Component
        data-testid="mock-typography"
        data-variant={variant}
        data-color={color}
        data-htmlfor={htmlFor}
        className={className}
      >
        {children}
      </Component>
    );
  },
}));

describe('Checkbox', () => {
  it('renders with label when provided', () => {
    render(<Checkbox label="Accept terms" />);
    const typography = screen.getByTestId('mock-typography');
    expect(typography).toHaveTextContent('Accept terms');
    expect(typography).toHaveAttribute('data-variant', 'body2');
  });

  it('renders without label when not provided', () => {
    const { container } = render(<Checkbox />);
    expect(screen.queryByTestId('mock-typography')).not.toBeInTheDocument();
    expect(
      container.querySelector('input[type="checkbox"]')
    ).toBeInTheDocument();
  });

  it('can be checked and unchecked', () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Accept" onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('can be initially checked', () => {
    render(<Checkbox checked={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('can be disabled', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('cursor-not-allowed');
    expect(checkbox).toHaveClass('opacity-50');
  });

  it('applies disabled styling to label', () => {
    render(<Checkbox disabled label="Disabled option" />);
    const typography = screen.getByTestId('mock-typography');
    expect(typography).toHaveAttribute('data-color', 'secondary');
    expect(typography).toHaveClass('opacity-50');
  });

  it('calls onChange with correct value', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('supports indeterminate state', () => {
    render(<Checkbox indeterminate />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('uses provided ID when given', () => {
    render(<Checkbox id="custom-id" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'custom-id');
  });

  it('generates an ID when not provided', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox').id).toMatch(/checkbox-/);
  });

  it('applies custom className', () => {
    const { container } = render(<Checkbox className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
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
    const labelContainer = screen.getByTestId('mock-typography').closest('div');
    expect(labelContainer).toHaveClass('ml-3');
    expect(labelContainer).toHaveClass('sm:ml-2');
  });

  it('applies mobile-first container alignment', () => {
    const { container } = render(<Checkbox />);
    expect(container.firstChild).toHaveClass('items-start');
    expect(container.firstChild).toHaveClass('sm:items-center');
  });

  it('associates label with checkbox using id', () => {
    render(<Checkbox label="Test label" id="test-id" />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'test-id');

    const label = screen.getByText('Test label').closest('label');

    expect(label).toHaveAttribute('for', 'test-id');

    const typography = screen.getByTestId('mock-typography');
    expect(typography).toHaveAttribute('data-variant', 'body2');
  });
});
