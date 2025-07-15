import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RegisterForm from '../RegisterForm';
import * as validators from '../../../utils';
import React from 'react';
import { useToast } from '../../../hooks';

vi.mock('../../../hooks', () => ({
  useToast: vi.fn(),
}));

vi.mock('../../../utils/validators', () => ({
  isValidEmail: vi.fn(),
  isValidUsername: vi.fn(),
  isValidPassword: vi.fn(),
  getPasswordStrength: vi.fn(),
}));

vi.mock('react-icons/fa', () => ({
  FaUser: () => <div data-testid="user-icon">User Icon</div>,
  FaEnvelope: () => <div data-testid="email-icon">Email Icon</div>,
  FaLock: () => <div data-testid="lock-icon">Lock Icon</div>,
  FaCheckCircle: () => <div data-testid="check-icon">Check Icon</div>,
  FaUserPlus: () => <div data-testid="register-icon">Register Icon</div>,
}));

vi.mock('../../common/TextInput', () => ({
  default: ({
    id,
    label,
    type,
    value,
    onChange,
    onBlur,
    error,
    icon,
    helpText,
  }: {
    id: string;
    label: string;
    type?: string;
    value: string | number | boolean | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    icon?: React.ReactNode;
    helpText?: string;
  }) => (
    <div data-testid={`text-input-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type || 'text'}
        value={typeof value === 'boolean' ? value.toString() : value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {icon && <div data-testid={`icon-${id}`}>{icon}</div>}
      {helpText && <div data-testid={`help-${id}`}>{helpText}</div>}
      {error && <div data-testid={`error-${id}`}>{error}</div>}
    </div>
  ),
}));

vi.mock('../../common/Button', () => ({
  default: ({
    children,
    onClick,
    type,
    disabled,
    isLoading,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    isLoading?: boolean;
  }) => (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      data-testid="button"
      data-loading={isLoading}
    >
      {children}
    </button>
  ),
}));

describe('RegisterForm', () => {
  const mockOnRegister = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockAddToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (validators.isValidEmail as Mock).mockImplementation(() => true);
    (validators.isValidUsername as Mock).mockImplementation(() => true);
    (validators.isValidPassword as Mock).mockImplementation(() => true);
    (validators.getPasswordStrength as Mock).mockImplementation(() => 'strong');

    (useToast as Mock).mockReturnValue({
      addToast: mockAddToast,
    });
  });

  it('renders all form elements correctly including icons', () => {
    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );

    expect(screen.getByTestId('text-input-username')).toBeInTheDocument();
    expect(screen.getByTestId('text-input-email')).toBeInTheDocument();
    expect(screen.getByTestId('text-input-password')).toBeInTheDocument();
    expect(
      screen.getByTestId('text-input-confirmPassword')
    ).toBeInTheDocument();

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByTestId('register-icon')).toBeInTheDocument();

    expect(screen.getByTestId('button')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toHaveTextContent(/register/i);
  });

  it('shows success toast on successful registration', async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123');

    await user.click(screen.getByTestId('button'));

    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalledWith(
        'testuser',
        'test@example.com',
        'Password123'
      );

      expect(mockAddToast).toHaveBeenCalledWith({
        title: 'Registration Successful',
        message: 'Your account has been created successfully!',
        variant: 'success',
        duration: 5000,
      });

      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows warning toast when account already exists', async () => {
    const user = userEvent.setup();

    mockOnRegister.mockRejectedValueOnce(new Error('Account already exists'));

    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );

    await user.type(screen.getByLabelText(/username/i), 'existinguser');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123');
    await user.click(screen.getByTestId('button'));

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        title: 'Registration Failed',
        message: 'This email or username is already registered',
        variant: 'warning',
        duration: 6000,
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
