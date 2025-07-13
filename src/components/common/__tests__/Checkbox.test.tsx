import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  it('renders with label when provided', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    const { container } = render(<Checkbox />);
    expect(screen.queryByText(/./i)).not.toBeInTheDocument();
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

    // Need to directly check the DOM property
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
});
