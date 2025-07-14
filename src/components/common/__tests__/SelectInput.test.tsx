import { render, screen, fireEvent } from '@testing-library/react';
import SelectInput, { type SelectInputProps } from '../SelectInput';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

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
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    // Use test id instead of role for the icon.
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
    expect(screen.getByRole('alert')).toHaveTextContent('This is an error');
  });

  it('disables select input when disabled prop is true', () => {
    render(<SelectInput {...defaultProps} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
});
