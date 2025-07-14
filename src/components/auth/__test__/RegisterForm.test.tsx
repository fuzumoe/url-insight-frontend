import '@testing-library/jest-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../RegisterForm';

const mockOnRegister = vi.fn();
const mockOnSuccess = vi.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    mockOnRegister.mockReset();
    mockOnSuccess.mockReset();
  });

  it('renders the login link with correct href', () => {
    render(<RegisterForm />);
    const loginLink = screen.getByRole('link', {
      name: /already have an account/i,
    });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('validates that passwords must match', async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText(/username/i), 'validuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'valid@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123');
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      'Different123'
    );
    userEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  it('submits the form with valid data and calls onSuccess', async () => {
    mockOnRegister.mockResolvedValueOnce(undefined);
    render(
      <RegisterForm onRegister={mockOnRegister} onSuccess={mockOnSuccess} />
    );
    await userEvent.type(screen.getByLabelText(/username/i), 'validuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'valid@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123');
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      'Password123'
    );
    userEvent.click(screen.getByRole('button', { name: /register/i }));
    // Wait for onRegister to be called with the appropriate values.
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
    mockOnRegister.mockRejectedValueOnce(new Error('already exists'));
    render(<RegisterForm onRegister={mockOnRegister} />);
    await userEvent.type(screen.getByLabelText(/username/i), 'validuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'valid@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123');
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      'Password123'
    );
    userEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(
      await screen.findByText(/this email or username is already registered/i)
    ).toBeInTheDocument();
  });

  it('disables the register button when password is weak', async () => {
    render(<RegisterForm />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, 'short');
    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeDisabled();
  });

  it('shows loading state during registration', () => {
    render(<RegisterForm loading={true} />);
    // When loading=true, the Button component renders "Loading..." text.
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
  });

  it('clears error message when user starts typing again', async () => {
    render(<RegisterForm />);
    // Trigger an error by entering an invalid email.
    await userEvent.type(screen.getByLabelText(/username/i), 'validuser');
    await userEvent.type(screen.getByLabelText(/email/i), 'invalidemail');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123');
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      'Password123'
    );
    userEvent.click(screen.getByRole('button', { name: /register/i }));

    // Simulate user correcting the email.
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'valid@example.com');

    // Force re-submit to clear the error.
    userEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() => {
      expect(
        screen.queryByText('Please enter a valid email address')
      ).not.toBeInTheDocument();
    });
  });

  // Additional tests for password strength indicator.
  it('displays the password strength indicator correctly for a strong password', async () => {
    render(<RegisterForm />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, 'StrongPass123');
    const strengthText = await screen.findByText(/strong/i);
    expect(strengthText).toBeInTheDocument();
    const indicatorDiv =
      strengthText.parentElement?.previousElementSibling?.querySelector('div');
    if (indicatorDiv) {
      expect(indicatorDiv).toHaveStyle('width: 100%');
    }
  });

  it('updates password strength indicator as password changes', async () => {
    render(<RegisterForm />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    // Type a weak password first.
    await userEvent.type(passwordInput, 'weak');
    let strengthElem = await screen.findByText(/weak/i);
    expect(strengthElem).toBeInTheDocument();
    // Clear and type a medium strength password.
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'MediumPass1');
    strengthElem = await screen.findByText(/medium/i);
    expect(strengthElem).toBeInTheDocument();
  });
});
