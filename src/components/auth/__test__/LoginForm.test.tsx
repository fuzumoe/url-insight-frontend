import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';
import { useAuth, useToast } from '../../../hooks';

vi.mock('../../../hooks', () => ({
  useAuth: vi.fn(),
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

vi.mock('..', () => ({
  TextInput: ({
    id,
    type,
    value,
    onChange,
    onBlur,
    required,
    placeholder,
    error,
    autoComplete,
    icon,
    helpText,
    pattern,
  }: TextInputProps) => (
    <div data-testid={`text-input-${id}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        pattern={pattern}
      />
      {icon && <div data-testid={`icon-${id}`}>{icon}</div>}
      {helpText && <div data-testid={`help-${id}`}>{helpText}</div>}
      {error && (
        <div role="alert" data-testid={`error-${id}`}>
          {error}
        </div>
      )}
    </div>
  ),

  Button: ({
    children,
    type,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      type={type as 'button' | 'submit' | 'reset' | undefined}
      onClick={onClick}
      data-testid="button"
      className={className}
    >
      {children}
    </button>
  ),

  Typography: ({
    children,
    variant,
    color,
    className,
  }: {
    children: React.ReactNode;
    variant?: string;
    color?: string;
    className?: string;
  }) => (
    <div
      data-testid={`typography-${variant || 'default'}`}
      data-color={color}
      className={className}
    >
      {children}
    </div>
  ),
}));
interface TextInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  helpText?: string;
  pattern?: string;
  iconPosition?: string;
}

vi.mock('../../common/TextInput', () => ({
  default: ({
    id,
    label,
    type,
    value,
    onChange,
    onBlur,
    required,
    placeholder,
    error,
    autoComplete,
    icon,
    helpText,
    pattern,
  }: TextInputProps) => (
    <div data-testid={`text-input-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        pattern={pattern}
      />
      {icon && <div data-testid={`icon-${id}`}>{icon}</div>}
      {helpText && <div data-testid={`help-${id}`}>{helpText}</div>}
      {error && (
        <div role="alert" data-testid={`error-${id}`}>
          {error}
        </div>
      )}
    </div>
  ),
}));

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

vi.mock('../../common/Button', () => ({
  default: ({ children, type, onClick, className }: ButtonProps) => (
    <button
      type={type}
      onClick={onClick}
      data-testid="button"
      className={className}
    >
      {children}
    </button>
  ),
}));

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  const mockAddToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      login: mockLogin,
    });
    (useToast as Mock).mockReturnValue({
      addToast: mockAddToast,
    });
  });

  const getInputById = (id: string) => {
    return document.getElementById(id) as HTMLInputElement;
  };

  it('renders all form elements correctly', () => {
    render(<LoginForm />);

    expect(screen.getByTestId('text-input-email')).toBeInTheDocument();
    expect(screen.getByTestId('text-input-password')).toBeInTheDocument();

    expect(getInputById('email')).toBeInTheDocument();
    expect(getInputById('password')).toBeInTheDocument();

    expect(screen.getByTestId('icon-email')).toBeInTheDocument();
    expect(screen.getByTestId('icon-password')).toBeInTheDocument();

    expect(screen.getByTestId('button')).toBeInTheDocument();

    expect(screen.getByTestId('typography-body2')).toBeInTheDocument();
    expect(screen.getByTestId('router-link')).toBeInTheDocument();
    expect(
      screen.getByText(/don't have an account\? register/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId('help-email')).toBeInTheDocument();
    expect(
      screen.getByText(/enter the email you used to register/i)
    ).toBeInTheDocument();
  });

  it('tests mobile-first responsive layout', () => {
    render(<LoginForm />);

    const registerLink = screen.getByTestId('router-link');
    const loginButton = screen.getByTestId('button');

    const formActionsContainer = registerLink.closest('div')?.parentElement;

    expect(formActionsContainer).toHaveClass('flex-col');
    expect(formActionsContainer).toHaveClass('sm:flex-row');
    expect(formActionsContainer).toHaveClass('sm:items-center');
    expect(formActionsContainer).toHaveClass('sm:justify-between');
    expect(formActionsContainer).toHaveClass('gap-4');
    expect(formActionsContainer).toHaveClass('sm:gap-0');

    expect(loginButton).toHaveClass('w-full');
    expect(loginButton).toHaveClass('sm:w-auto');
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

    const registerLink = screen.getByTestId('router-link');
    expect(registerLink).toHaveAttribute('href', '/register');
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
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it('validates password field on blur', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = getInputById('password');

    await user.click(passwordInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('displays error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByTestId('button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrong');
    await user.click(submitButton);

    await waitFor(() => {
      const errorElement = screen.getByText('Invalid credentials');
      expect(errorElement).toBeInTheDocument();

      const typographyContainer = errorElement.closest('[data-color="error"]');
      expect(typographyContainer).toBeInTheDocument();
      expect(typographyContainer).toHaveClass('bg-red-50');
    });
  });

  it('clears error on resubmission', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByTestId('button');

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
      expect(errorAfterResubmit).not.toBeInTheDocument();
    });
  });

  it('calls login function with trimmed email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByTestId('button');

    await user.type(emailInput, '  test@example.com  ');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('shows success toast on successful login', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByTestId('button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        title: 'Login Successful',
        message: 'Welcome back!',
        variant: 'success',
        duration: 4000,
      });
    });
  });

  it('shows connection error toast for network errors', async () => {
    const networkError = new Error('A network error occurred');
    mockLogin.mockRejectedValueOnce(networkError);

    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByTestId('button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        title: 'Connection Problem',
        message: 'Please check your internet connection and try again',
        variant: 'error',
        duration: 8000,
      });
    });
  });

  it('shows generic error toast for unknown errors', async () => {
    mockLogin.mockRejectedValueOnce('Unknown error' as unknown);

    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = getInputById('email');
    const passwordInput = getInputById('password');
    const submitButton = screen.getByTestId('button');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith({
        title: 'Error',
        message: 'An unexpected error occurred',
        variant: 'error',
      });
    });
  });
});
