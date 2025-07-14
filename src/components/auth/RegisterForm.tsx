import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  getPasswordStrength,
} from '../../utils/validators';

interface RegisterFormProps {
  onSuccess?: () => void;
  onRegister?: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onRegister = async () => {},
  loading = false,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<
    'weak' | 'medium' | 'strong'
  >('weak');

  useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength('weak');
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidUsername(username)) {
      setError(
        'Username must be 3-20 characters and can only contain letters, numbers, underscores, or hyphens'
      );
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isValidPassword(password, 7)) {
      setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, and numbers'
      );
      return;
    }

    try {
      await onRegister(username, email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message.includes('already exists') ||
          err.message.includes('already in use')
        ) {
          setError('This email or username is already registered');
        } else {
          setError(err.message);
        }
      } else {
        setError('Registration failed. Please try again later.');
      }
    }
  };

  // Get color for password strength indicator
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="3-20 characters (letters, numbers, _ or -)"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Min 8 chars with uppercase, lowercase & numbers"
        />
        {password && (
          <div className="mt-1">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${getStrengthColor()}`}
                  style={{
                    width: password
                      ? passwordStrength === 'weak'
                        ? '33%'
                        : passwordStrength === 'medium'
                          ? '67%'
                          : '100%'
                      : '0%',
                  }}
                ></div>
              </div>
              <span className="ml-2 text-xs text-gray-500 capitalize">
                {passwordStrength}
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Re-enter your password"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a href="/login" className="text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </a>
        </div>
        <Button
          type="submit"
          isLoading={loading}
          disabled={passwordStrength === 'weak'}
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
