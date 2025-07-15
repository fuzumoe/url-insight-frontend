import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from '../TextInput';
import '@testing-library/jest-dom';

vi.mock('../Typography', () => ({
  default: vi.fn(
    ({
      children,
      color,
      variant,
      as: Component = 'span',
      className,
      ...props
    }) => (
      <Component
        data-testid={`typography-${color || 'default'}-${variant}`}
        className={className || ''}
        {...props}
      >
        {children}
      </Component>
    )
  ),
}));

describe('TextInput', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    value: '',
    onChange: vi.fn(),
  };

  it('renders with label and input', () => {
    render(<TextInput {...defaultProps} />);

    const label = screen.getByText('Test Label');
    const input = screen.getByLabelText('Test Label');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input.id).toBe('test-input');
  });

  it('shows required indicator when required prop is true', () => {
    render(<TextInput {...defaultProps} required={true} />);

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
    expect(requiredIndicator).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not show required indicator when required prop is false', () => {
    render(<TextInput {...defaultProps} required={false} />);

    const requiredIndicator = screen.queryByText('*');
    expect(requiredIndicator).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<TextInput {...defaultProps} error="This field is required" />);

    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(
      errorMessage.closest('[data-testid="typography-error-caption"]')
    ).toBeInTheDocument();
    expect(errorMessage.closest('[role="alert"]')).toBeInTheDocument();
  });

  it('does not display error message when error prop is not provided', () => {
    render(<TextInput {...defaultProps} />);

    const errorMessage = screen.queryByText('This field is required');
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('applies red border when error is present', () => {
    render(<TextInput {...defaultProps} error="Error message" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-red-300');
    expect(input).not.toHaveClass('border-gray-300');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
  });

  it('applies gray border when no error is present', () => {
    render(<TextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-gray-300');
    expect(input).not.toHaveClass('border-red-300');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('applies disabled styles when disabled prop is true', () => {
    render(<TextInput {...defaultProps} disabled={true} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-gray-100');
    expect(input).toHaveClass('text-gray-500');
  });

  it('does not apply disabled styles when disabled prop is false', () => {
    render(<TextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).not.toBeDisabled();
    expect(input).not.toHaveClass('bg-gray-100');
    expect(input).not.toHaveClass('text-gray-500');
  });

  it('calls onChange handler when typing in the input', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<TextInput {...defaultProps} onChange={handleChange} />);

    const input = screen.getByLabelText('Test Label');
    await user.type(input, 'hello');

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with the correct input type', () => {
    render(<TextInput {...defaultProps} type="password" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('uses text as the default input type', () => {
    render(<TextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('displays the placeholder text', () => {
    render(<TextInput {...defaultProps} placeholder="Enter value" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('placeholder', 'Enter value');
  });

  it('sets maxLength attribute when provided', () => {
    render(<TextInput {...defaultProps} maxLength={50} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('sets autocomplete attribute when provided', () => {
    render(<TextInput {...defaultProps} autoComplete="username" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('autoComplete', 'username');
  });

  it('displays the current value', () => {
    render(<TextInput {...defaultProps} value="Current Value" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveValue('Current Value');
  });

  it('has the required attribute when required prop is true', () => {
    render(<TextInput {...defaultProps} required={true} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('has proper focus styles', () => {
    render(<TextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('focus:outline-none');
    expect(input).toHaveClass('focus:ring-blue-500');
    expect(input).toHaveClass('focus:border-blue-500');
  });

  it('displays help text when provided and no error exists', () => {
    render(<TextInput {...defaultProps} helpText="This is help text" />);

    const helpText = screen.getByText('This is help text');
    expect(helpText).toBeInTheDocument();
    expect(
      helpText.closest('[data-testid="typography-secondary-caption"]')
    ).toBeInTheDocument();
    expect(helpText.closest('div')).toHaveAttribute('id', 'test-input-help');
  });

  it('does not display help text when error exists', () => {
    render(
      <TextInput
        {...defaultProps}
        helpText="This is help text"
        error="This is an error"
      />
    );

    const helpText = screen.queryByText('This is help text');
    expect(helpText).not.toBeInTheDocument();

    const errorText = screen.getByText('This is an error');
    expect(errorText).toBeInTheDocument();
  });

  it('applies readonly styles when readOnly prop is true', () => {
    render(<TextInput {...defaultProps} readOnly={true} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('readOnly');
    expect(input).toHaveClass('bg-gray-50');
    expect(input).toHaveClass('cursor-not-allowed');
  });

  it('applies custom classes when provided', () => {
    render(
      <TextInput
        {...defaultProps}
        className="container-class"
        inputClassName="input-class"
        labelClassName="label-class"
      />
    );

    const container = screen
      .getByLabelText('Test Label')
      .closest('div')?.parentElement;
    const label = screen.getByText('Test Label').closest('label');
    const input = screen.getByLabelText('Test Label');

    expect(container).toHaveClass('container-class');
    expect(label).toHaveClass('label-class');
    expect(input).toHaveClass('input-class');
  });

  it('sets min and max attributes when provided', () => {
    render(<TextInput {...defaultProps} type="number" min={1} max={10} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '10');
  });

  it('sets pattern attribute when provided', () => {
    render(<TextInput {...defaultProps} pattern="[A-Za-z]+" />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('pattern', '[A-Za-z]+');
  });

  it('calls onBlur handler when leaving the input', async () => {
    const handleBlur = vi.fn();
    const user = userEvent.setup();

    render(<TextInput {...defaultProps} onBlur={handleBlur} />);

    const input = screen.getByLabelText('Test Label');
    await user.click(input);
    await user.tab();

    expect(handleBlur).toHaveBeenCalled();
  });

  it('calls onFocus handler when focusing the input', async () => {
    const handleFocus = vi.fn();
    const user = userEvent.setup();

    render(<TextInput {...defaultProps} onFocus={handleFocus} />);

    const input = screen.getByLabelText('Test Label');
    await user.click(input);

    expect(handleFocus).toHaveBeenCalled();
  });

  it('renders with left icon when provided', () => {
    const MockIcon = () => <div data-testid="mock-icon">Icon</div>;

    render(
      <TextInput {...defaultProps} icon={<MockIcon />} iconPosition="left" />
    );

    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('pl-8');
    expect(input).toHaveClass('sm:pl-10');
    expect(input).not.toHaveClass('pr-8');
    expect(input).not.toHaveClass('sm:pr-10');
  });

  it('renders with right icon when provided', () => {
    const MockIcon = () => <div data-testid="mock-icon">Icon</div>;

    render(
      <TextInput {...defaultProps} icon={<MockIcon />} iconPosition="right" />
    );

    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('pr-8');
    expect(input).toHaveClass('sm:pr-10');
    expect(input).not.toHaveClass('pl-8');
    expect(input).not.toHaveClass('sm:pl-10');
  });

  it('applies mobile-first responsive margin', () => {
    render(<TextInput {...defaultProps} />);

    const container = screen
      .getByLabelText('Test Label')
      .closest('div')?.parentElement;
    expect(container).toHaveClass('mb-3');
    expect(container).toHaveClass('sm:mb-4');
  });

  it('applies mobile-first responsive padding to input', () => {
    render(<TextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('px-2');
    expect(input).toHaveClass('py-1.5');
    expect(input).toHaveClass('sm:px-3');
    expect(input).toHaveClass('sm:py-2');
  });

  it('applies mobile-first responsive text sizing', () => {
    render(<TextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('text-xs');
    expect(input).toHaveClass('sm:text-sm');
  });

  it('applies mobile-first responsive icon container padding', () => {
    const MockIcon = () => <div data-testid="mock-icon">Icon</div>;

    render(
      <TextInput {...defaultProps} icon={<MockIcon />} iconPosition="left" />
    );

    const iconContainer = screen.getByTestId('mock-icon').parentElement;

    expect(iconContainer).toBeDefined();

    expect(iconContainer).toHaveClass('pl-2');
    expect(iconContainer).toHaveClass('sm:pl-3');
  });
});
