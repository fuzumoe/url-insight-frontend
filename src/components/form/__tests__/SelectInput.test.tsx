import { render, screen, fireEvent } from '@testing-library/react';
import SelectInput, { type SelectInputProps } from '../../form/SelectInput';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

// Mock Typography component
vi.mock('../Typography', () => ({
  default: vi.fn(
    ({ children, color, className, as: Component = 'span', ...props }) => (
      <Component
        data-testid={`typography-${color || 'default'}`}
        className={className}
        {...props}
      >
        {children}
      </Component>
    )
  ),
}));

describe('SelectInput', () => {
  const defaultProps: SelectInputProps = {
    id: 'test-select',
    label: 'Test Label',
    value: '',
    options: [
      { value: 'option1', label: 'Option One' },
      { value: 'option2', label: 'Option Two' },
    ],
    onChange: vi.fn(),
    placeholder: 'Select an option',
    disabled: false,
    className: '',
    selectClassName: '',
    labelClassName: '',
    error: '',
  };

  it('renders correctly with label, placeholder and icon', () => {
    render(<SelectInput {...defaultProps} />);

    // Check for label (now wrapped in Typography)
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.closest('label')).toHaveAttribute('for', 'test-select');

    expect(screen.getByText('Select an option')).toBeInTheDocument();

    // Check for icon
    const icon = screen.getByTestId('select-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders options correctly', () => {
    render(<SelectInput {...defaultProps} value="option1" />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Option One' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Option Two' })
    ).toBeInTheDocument();
  });

  it('calls onChange handler when selection changes', () => {
    const onChangeMock = vi.fn();
    render(
      <SelectInput {...defaultProps} onChange={onChangeMock} value="option1" />
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  it('renders error message when error prop is provided', () => {
    render(<SelectInput {...defaultProps} error="This is an error" />);

    // Check for error message wrapped in Typography
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();

    const errorText = screen.getByText('This is an error');
    expect(errorText).toBeInTheDocument();
    expect(
      errorText.closest('[data-testid="typography-error"]')
    ).toBeInTheDocument();
  });

  it('disables select input when disabled prop is true', () => {
    render(<SelectInput {...defaultProps} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  // New tests for mobile-first design
  it('applies mobile-first responsive margin', () => {
    render(<SelectInput {...defaultProps} />);
    const container = screen.getByText('Test Label').closest('div');
    expect(container).toHaveClass('mb-3');
    expect(container).toHaveClass('sm:mb-4');
  });

  it('applies mobile-first responsive padding to select', () => {
    render(<SelectInput {...defaultProps} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('py-1.5');
    expect(select).toHaveClass('sm:py-2');
    expect(select).toHaveClass('px-2');
    expect(select).toHaveClass('sm:px-3');
    expect(select).toHaveClass('pr-8');
    expect(select).toHaveClass('sm:pr-10');
  });

  it('applies mobile-first responsive text sizing', () => {
    render(<SelectInput {...defaultProps} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('text-xs');
    expect(select).toHaveClass('sm:text-sm');
  });

  it('applies mobile-first responsive icon sizing', () => {
    render(<SelectInput {...defaultProps} />);
    const icon = screen.getByTestId('select-icon');
    expect(icon).toHaveClass('h-4');
    expect(icon).toHaveClass('w-4');
    expect(icon).toHaveClass('sm:h-5');
    expect(icon).toHaveClass('sm:w-5');
  });

  it('applies mobile-first responsive icon container padding', () => {
    render(<SelectInput {...defaultProps} />);
    const iconContainer = screen.getByTestId('select-icon').closest('div');
    expect(iconContainer).toHaveClass('pr-2');
    expect(iconContainer).toHaveClass('sm:pr-3');
  });

  it('hides label when hideLabel is true', () => {
    render(<SelectInput {...defaultProps} hideLabel />);
    const label = screen.getByText('Test Label').closest('label');
    expect(label).toHaveClass('sr-only');
  });
});
