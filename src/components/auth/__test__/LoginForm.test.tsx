/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';
import { useAuth } from '../../../hooks/useAuth';

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-icons/fa', () => ({
  FaEnvelope: () => <div data-testid="email-icon">Email Icon</div>,
  FaLock: () => <div data-testid="lock-icon">Lock Icon</div>,
  FaSignInAlt: () => <div data-testid="signin-icon">Sign In Icon</div>,
}));

describe('LoginForm', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      login: mockLogin,
    });
  });

  const getInputById = (id: string) => {
    return document.getElementById(id) as HTMLInputElement;
  };

  it('renders all form elements correctly', () => {
    render(<LoginForm />);

    expect(getInputById('email')).toBeInTheDocument();
    expect(getInputById('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByText(/don't have an account\? register/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId('email-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('signin-icon')).toBeInTheDocument();

    expect(
      screen.getByText(/enter the email you used to register/i)
    ).toBeInTheDocument();
  });

  it('allows input in email and password fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('handles form submission with Enter key', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123{enter}');

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('tests register link href attribute', () => {
    render(<LoginForm />);

    const registerLink = screen.getByText(
      /don't have an account\? register/i
    ) as HTMLAnchorElement;
    expect(registerLink.href).toContain('/register');
  });

  it('verifies input field attributes', () => {
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');

    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
    expect(emailInput.type).toBe('email');
    expect(passwordInput.type).toBe('password');
    expect(emailInput.placeholder).toBe('your.email@example.com');
    expect(passwordInput.placeholder).toBe('Enter your password');

    expect(emailInput.getAttribute('pattern')).toBe(
      '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
    );
    expect(emailInput.getAttribute('autocomplete')).toBe('email');
    expect(passwordInput.getAttribute('autocomplete')).toBe('current-password');
  });

  it('validates email field on blur', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');

    await user.type(emailInput, 'invalid-email');
    await user.tab();

    await waitFor(() => {
      const errorElement = screen.queryByText(
        /please enter a valid email address/i
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('validates password field on blur', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = getInputById('password');

    await user.click(passwordInput);
    await user.tab();

    await waitFor(() => {
      const errorElement = screen.queryByText(/password is required/i);
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('tests error element styles when error occurs', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Test error'));
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrong');
    await user.click(submitButton);

    await waitFor(() => {
      const errorText = screen.getByText('Test error');
      expect(errorText).toBeInTheDocument();

      const errorContainer = errorText.closest('div');
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer?.classList.contains('text-red-600')).toBe(true);
      expect(errorContainer?.classList.contains('bg-red-50')).toBe(true);
      expect(errorContainer?.classList.contains('border-red-200')).toBe(true);
      expect(errorContainer?.classList.contains('rounded')).toBe(true);
    });
  });

  it('tests error clearing on form resubmission', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrong');
    await user.click(submitButton);

    // Verify error is shown
    await waitFor(() => {
      const errorElement = screen.queryByText('Invalid credentials');
      expect(errorElement).toBeInTheDocument();
    });

    // Now submit with success
    mockLogin.mockResolvedValueOnce(undefined);
    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, 'correct@example.com');
    await user.type(passwordInput, 'correct');
    await user.click(submitButton);

    // Verify error is gone
    await waitFor(() => {
      const errorAfterResubmit = screen.queryByText('Invalid credentials');
      expect(errorAfterResubmit).toBeNull();
    });
  });

  it('handles non-trimmed email input correctly', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Add spaces before and after email
    await user.type(emailInput, '  test@example.com  ');
    await user.type(passwordInput, 'password123');

    // Trim may happen on input or on submission
    await user.click(submitButton);

    // Login should be called with the trimmed email
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('calls login function on form submission', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('displays error message when login fails with Error instance', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrong');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('displays generic error message when login fails with non-Error', async () => {
    mockLogin.mockRejectedValueOnce('Some other error');
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Login failed. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('clears previous error on new submission', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrong');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    mockLogin.mockResolvedValueOnce(undefined);

    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, 'correct@example.com');
    await user.type(passwordInput, 'correct');
    await user.click(submitButton);

    await waitFor(() => {
      const errorAfterResubmit = screen.queryByText('Invalid credentials');
      expect(errorAfterResubmit).toBeNull();
    });
  });

  it('handles consecutive failed login attempts correctly', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    mockLogin.mockRejectedValueOnce(new Error('Account locked'));

    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    // First attempt
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrong');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Second attempt
    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'stillwrong');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account locked')).toBeInTheDocument();
    });
  });

  it('applies correct styling to the register link', () => {
    render(<LoginForm />);

    const registerLink = screen.getByText(
      /don't have an account\? register/i
    ) as HTMLElement;

    expect(registerLink.classList.contains('text-blue-600')).toBe(true);
    expect(registerLink.classList.contains('hover:text-blue-500')).toBe(true);
  });

  it('verifies the button text is correct', () => {
    render(<LoginForm />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton.textContent).toContain('Login');
  });
});
