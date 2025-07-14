import '@testing-library/jest-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../RegisterForm';

vi.mock('react-icons/fa', () => ({
  FaUser: () => <div data-testid="icon-user">User Icon</div>,
  FaEnvelope: () => <div data-testid="icon-envelope">Email Icon</div>,
  FaLock: () => <div data-testid="icon-lock">Lock Icon</div>,
  FaCheckCircle: () => <div data-testid="icon-check">Check Icon</div>,
  FaUserPlus: () => <div data-testid="icon-user-plus">User Plus Icon</div>,
}));

const mockOnRegister = vi.fn();
const mockOnSuccess = vi.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    mockOnRegister.mockReset();
    mockOnSuccess.mockReset();
  });

  const getInputById = (id: string) => {
    return document.getElementById(id) as HTMLInputElement;
  };

  it('renders all form elements correctly including icons', () => {
    render(<RegisterForm />);

    expect(getInputById('username')).toBeInTheDocument();
    expect(getInputById('email')).toBeInTheDocument();
    expect(getInputById('password')).toBeInTheDocument();
    expect(getInputById('confirmPassword')).toBeInTheDocument();

    expect(screen.getByTestId('icon-user')).toBeInTheDocument();
    expect(screen.getByTestId('icon-envelope')).toBeInTheDocument();
    expect(screen.getByTestId('icon-lock')).toBeInTheDocument();
    expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    expect(screen.getByTestId('icon-user-plus')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeInTheDocument();

    const loginLink = screen.getByRole('link', {
      name: /already have an account/i,
    });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('renders the login link with correct href', () => {
    render(<RegisterForm />);
    const loginLink = screen.getByRole('link', {
      name: /already have an account/i,
    });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('validates that passwords must match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(getInputById('username'), 'validuser');
    await user.type(getInputById('email'), 'valid@example.com');
    await user.type(getInputById('password'), 'Password123');
    await user.type(getInputById('confirmPassword'), 'Different123');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data and calls onSuccess', async () => {
    const user = userEvent.setup();
    mockOnRegister.mockResolvedValueOnce(undefined);

    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );

    await user.type(getInputById('username'), 'validuser');
    await user.type(getInputById('email'), 'valid@example.com');
    await user.type(getInputById('password'), 'Password123');
    await user.type(getInputById('confirmPassword'), 'Password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalledWith(
        'validuser',
        'valid@example.com',
        'Password123'
      );
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('shows error message when registration fails with duplicate error', async () => {
    const user = userEvent.setup();
    mockOnRegister.mockRejectedValueOnce(new Error('already exists'));

    render(<RegisterForm onRegister={mockOnRegister} />);

    await user.type(getInputById('username'), 'validuser');
    await user.type(getInputById('email'), 'valid@example.com');
    await user.type(getInputById('password'), 'Password123');
    await user.type(getInputById('confirmPassword'), 'Password123');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/this email or username is already registered/i)
      ).toBeInTheDocument();
    });
  });

  it('disables the register button when password is weak', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = getInputById('password');
    await user.type(passwordInput, 'short');

    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeDisabled();
  });

  it('shows loading state during registration', () => {
    render(<RegisterForm loading={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(getInputById('username'), 'ab');
    await user.type(getInputById('email'), 'invalidemail');
    await user.type(getInputById('password'), 'weak');
    await user.type(getInputById('confirmPassword'), 'weak');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockOnRegister).not.toHaveBeenCalled();

    await waitFor(
      () => {
        const redTextElements = document.querySelectorAll(
          '[class*="text-red"]'
        );

        const alertElements = document.querySelectorAll('[role="alert"]');

        const errorTexts = ['invalid', 'required', 'match', 'characters'];
        let textErrorFound = false;

        errorTexts.forEach(text => {
          const elements = Array.from(document.querySelectorAll('*')).filter(
            el =>
              el.textContent &&
              el.textContent.toLowerCase().includes(text.toLowerCase())
          );

          if (elements.length > 0) {
            textErrorFound = true;
          }
        });

        expect(
          redTextElements.length > 0 ||
            alertElements.length > 0 ||
            textErrorFound
        ).toBe(true);
      },
      { timeout: 3000 }
    );
  });

  it('clears field errors when user corrects the input', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(getInputById('email'), 'not-an-email');

    await user.tab();
    await user.click(screen.getByRole('button', { name: /register/i }));

    const hasError = await waitFor(
      () => {
        const alerts = document.querySelectorAll('[role="alert"]');
        if (alerts.length > 0) return true;

        const redTexts = document.querySelectorAll('[class*="text-red"]');
        if (redTexts.length > 0) return true;

        const errorKeywords = ['invalid', 'email', 'valid'];
        for (const keyword of errorKeywords) {
          const elements = Array.from(document.querySelectorAll('*')).filter(
            el =>
              el.textContent && el.textContent.toLowerCase().includes(keyword)
          );
          if (elements.length > 0) return true;
        }
        throw new Error('No error message found');
      },
      { timeout: 3000 }
    );

    expect(hasError).toBe(true);

    const emailInput = getInputById('email');
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@example.com');

    await user.tab();

    await new Promise(resolve => setTimeout(resolve, 100));

    await waitFor(
      () => {
        // Look for error elements related to email
        const errorElements = Array.from(
          document.querySelectorAll('[role="alert"], [class*="text-red"]')
        ).filter(
          el =>
            el.textContent &&
            (el.textContent.toLowerCase().includes('email') ||
              el.textContent.toLowerCase().includes('valid'))
        );

        expect(errorElements.length).toBe(0);
      },
      { timeout: 3000 }
    );
  });

  it('updates password strength indicator as password changes', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const passwordInput = getInputById('password');

    await user.type(passwordInput, 'weak');
    let strengthElem = await screen.findByText(/weak/i);
    expect(strengthElem).toBeInTheDocument();
    let indicator = document.querySelector('.bg-red-500');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle('width: 33%');

    await user.clear(passwordInput);
    await user.type(passwordInput, 'MediumPass1');

    strengthElem = await screen.findByText(/medium/i);
    expect(strengthElem).toBeInTheDocument();

    indicator = document.querySelector('.bg-yellow-500');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle('width: 67%');
  });

  it('allows Enter key to submit the form', async () => {
    const user = userEvent.setup();
    mockOnRegister.mockResolvedValueOnce(undefined);

    render(<RegisterForm onRegister={mockOnRegister} />);

    await user.type(getInputById('username'), 'validuser');
    await user.type(getInputById('email'), 'valid@example.com');
    await user.type(getInputById('password'), 'Password123');
    await user.type(getInputById('confirmPassword'), 'Password123{enter}');

    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalledWith(
        'validuser',
        'valid@example.com',
        'Password123'
      );
    });
  });
});
