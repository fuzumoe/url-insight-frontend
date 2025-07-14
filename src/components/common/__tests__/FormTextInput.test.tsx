import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormTextInput from '../FormTextInput';

describe('FormTextInput', () => {
  const defaultProps = {
    id: 'test-input',
    label: 'Test Label',
    value: '',
    onChange: vi.fn(),
  };

  it('renders with label and input', () => {
    render(<FormTextInput {...defaultProps} />);

    const label = screen.getByText('Test Label');
    const input = screen.getByLabelText('Test Label');

    expect(label).toBeDefined();
    expect(input).toBeDefined();
    expect(input.id).toBe('test-input');
  });

  it('shows required indicator when required prop is true', () => {
    render(<FormTextInput {...defaultProps} required={true} />);

    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeDefined();
    expect(requiredIndicator.className).toContain('text-red-500');
    expect(requiredIndicator.getAttribute('aria-hidden')).toBe('true');
  });

  it('does not show required indicator when required prop is false', () => {
    render(<FormTextInput {...defaultProps} required={false} />);

    const requiredIndicator = screen.queryByText('*');
    expect(requiredIndicator).toBeNull();
  });

  it('displays error message when error prop is provided', () => {
    render(<FormTextInput {...defaultProps} error="This field is required" />);

    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeDefined();
    expect(errorMessage.className).toContain('text-red-600');
    expect(errorMessage.getAttribute('role')).toBe('alert');
    expect(errorMessage.id).toBe('test-input-error');
  });

  it('does not display error message when error prop is not provided', () => {
    render(<FormTextInput {...defaultProps} />);

    const errorMessage = screen.queryByText('This field is required');
    expect(errorMessage).toBeNull();
  });

  it('applies red border when error is present', () => {
    render(<FormTextInput {...defaultProps} error="Error message" />);

    const input = screen.getByLabelText('Test Label');
    expect(input.className).toContain('border-red-300');
    expect(input.className).not.toContain('border-gray-300');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('test-input-error');
  });

  it('applies gray border when no error is present', () => {
    render(<FormTextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label');
    expect(input.className).toContain('border-gray-300');
    expect(input.className).not.toContain('border-red-300');
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('applies disabled styles when disabled prop is true', () => {
    render(<FormTextInput {...defaultProps} disabled={true} />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.className).toContain('bg-gray-100');
    expect(input.className).toContain('text-gray-500');
  });

  it('does not apply disabled styles when disabled prop is false', () => {
    render(<FormTextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.disabled).toBe(false);
    expect(input.className).not.toContain('bg-gray-100');
    expect(input.className).not.toContain('text-gray-500');
  });

  it('calls onChange handler when typing in the input', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<FormTextInput {...defaultProps} onChange={handleChange} />);

    const input = screen.getByLabelText('Test Label');
    await user.type(input, 'hello');

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with the correct input type', () => {
    render(<FormTextInput {...defaultProps} type="password" />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('uses text as the default input type', () => {
    render(<FormTextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('displays the placeholder text', () => {
    render(<FormTextInput {...defaultProps} placeholder="Enter value" />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.placeholder).toBe('Enter value');
  });

  it('sets maxLength attribute when provided', () => {
    render(<FormTextInput {...defaultProps} maxLength={50} />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.maxLength).toBe(50);
  });

  it('sets autocomplete attribute when provided', () => {
    render(<FormTextInput {...defaultProps} autoComplete="username" />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.autocomplete).toBe('username');
  });

  it('displays the current value', () => {
    render(<FormTextInput {...defaultProps} value="Current Value" />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.value).toBe('Current Value');
  });

  it('has the required attribute when required prop is true', () => {
    render(<FormTextInput {...defaultProps} required={true} />);

    // Use getByRole instead of getByLabelText
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.required).toBe(true);
  });

  it('has proper focus styles', () => {
    render(<FormTextInput {...defaultProps} />);

    const input = screen.getByLabelText('Test Label');
    expect(input.className).toContain('focus:outline-none');
    expect(input.className).toContain('focus:ring-blue-500');
    expect(input.className).toContain('focus:border-blue-500');
  });

  // New tests for added functionality

  it('displays help text when provided and no error exists', () => {
    render(<FormTextInput {...defaultProps} helpText="This is help text" />);

    const helpText = screen.getByText('This is help text');
    expect(helpText).toBeDefined();
    expect(helpText.className).toContain('text-gray-500');
    expect(helpText.id).toBe('test-input-help');
  });

  it('does not display help text when error exists', () => {
    render(
      <FormTextInput
        {...defaultProps}
        helpText="This is help text"
        error="This is an error"
      />
    );

    const helpText = screen.queryByText('This is help text');
    expect(helpText).toBeNull();

    const errorText = screen.getByText('This is an error');
    expect(errorText).toBeDefined();
  });

  it('applies readonly styles when readOnly prop is true', () => {
    render(<FormTextInput {...defaultProps} readOnly={true} />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.className).toContain('bg-gray-50');
    expect(input.className).toContain('cursor-not-allowed');
  });

  it('applies custom classes when provided', () => {
    render(
      <FormTextInput
        {...defaultProps}
        className="container-class"
        inputClassName="input-class"
        labelClassName="label-class"
      />
    );

    const container = screen
      .getByLabelText('Test Label')
      .closest('div')?.parentElement;
    const label = screen.getByText('Test Label');
    const input = screen.getByLabelText('Test Label');

    expect(container?.className).toContain('container-class');
    expect(label.className).toContain('label-class');
    expect(input.className).toContain('input-class');
  });

  it('sets min and max attributes when provided', () => {
    render(<FormTextInput {...defaultProps} type="number" min={1} max={10} />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.min).toBe('1');
    expect(input.max).toBe('10');
  });

  it('sets pattern attribute when provided', () => {
    render(<FormTextInput {...defaultProps} pattern="[A-Za-z]+" />);

    const input = screen.getByLabelText('Test Label') as HTMLInputElement;
    expect(input.pattern).toBe('[A-Za-z]+');
  });

  it('calls onBlur handler when leaving the input', async () => {
    const handleBlur = vi.fn();
    const user = userEvent.setup();

    render(<FormTextInput {...defaultProps} onBlur={handleBlur} />);

    const input = screen.getByLabelText('Test Label');
    await user.click(input);
    await user.tab(); // Move focus away from the input

    expect(handleBlur).toHaveBeenCalled();
  });

  it('calls onFocus handler when focusing the input', async () => {
    const handleFocus = vi.fn();
    const user = userEvent.setup();

    render(<FormTextInput {...defaultProps} onFocus={handleFocus} />);

    const input = screen.getByLabelText('Test Label');
    await user.click(input);

    expect(handleFocus).toHaveBeenCalled();
  });

  // Icon tests would need a mock icon component, which I'll implement here:

  it('renders with left icon when provided', () => {
    const MockIcon = () => <div data-testid="mock-icon">Icon</div>;

    render(
      <FormTextInput
        {...defaultProps}
        icon={<MockIcon />}
        iconPosition="left"
      />
    );

    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeDefined();

    const input = screen.getByLabelText('Test Label');
    expect(input.className).toContain('pl-10');
    expect(input.className).not.toContain('pr-10');
  });

  it('renders with right icon when provided', () => {
    const MockIcon = () => <div data-testid="mock-icon">Icon</div>;

    render(
      <FormTextInput
        {...defaultProps}
        icon={<MockIcon />}
        iconPosition="right"
      />
    );

    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeDefined();

    const input = screen.getByLabelText('Test Label');
    expect(input.className).toContain('pr-10');
    expect(input.className).not.toContain('pl-10');
  });
});
