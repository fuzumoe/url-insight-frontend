import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import RegisterForm from '../RegisterForm';
import * as validators from '../../../utils';
import { useToast } from '../../../hooks';

vi.mock('../../../hooks', () => ({
  useToast: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={to} className={className} data-testid="router-link">
      {children}
    </a>
  ),
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

  it('renders all form elements correctly including icons and without displaying password strength when empty', () => {
    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );

    expect(document.getElementById('username')).toBeInTheDocument();
    expect(document.getElementById('email')).toBeInTheDocument();
    expect(document.getElementById('password')).toBeInTheDocument();
    expect(document.getElementById('confirmPassword')).toBeInTheDocument();

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByTestId('register-icon')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeInTheDocument();

    expect(screen.getByTestId('router-link')).toBeInTheDocument();
    expect(
      screen.getByText(/already have an account\? sign in/i)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('typography-secondary-caption')
    ).toBeInTheDocument();
  });

  it('shows success toast on successful registration', async () => {
    const user = userEvent.setup();

    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );

    await user.type(document.getElementById('username')!, 'testuser');
    await user.type(document.getElementById('email')!, 'test@example.com');
    await user.type(document.getElementById('password')!, 'Password123');
    await user.type(document.getElementById('confirmPassword')!, 'Password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

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

    await user.type(document.getElementById('username')!, 'existinguser');
    await user.type(document.getElementById('email')!, 'existing@example.com');
    await user.type(document.getElementById('password')!, 'Password123');
    await user.type(document.getElementById('confirmPassword')!, 'Password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

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

  it('displays password strength indicator when password is entered', async () => {
    (validators.getPasswordStrength as Mock).mockImplementation(() => 'medium');
    const user = userEvent.setup();

    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );

    await user.type(document.getElementById('password')!, 'SomePassword');

    await waitFor(() => {
      const strengthIndicator = screen.getByText(/medium/i);
      expect(strengthIndicator).toBeInTheDocument();
    });
  });

  it('tests mobile-first responsive layout', () => {
    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );

    const formActionsContainer = screen
      .getByTestId('router-link')
      .closest('p')?.parentElement;

    expect(formActionsContainer).toHaveClass('flex-col');
    expect(formActionsContainer).toHaveClass('sm:flex-row');
    expect(formActionsContainer).toHaveClass('sm:items-center');
    expect(formActionsContainer).toHaveClass('sm:justify-between');

    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('sm:w-auto');
  });
});
