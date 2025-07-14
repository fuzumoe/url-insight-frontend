import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import TextInput from '../common/TextInput';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const { login } = useAuth();

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateField = (field: 'email' | 'password') => {
    const errors = { ...fieldErrors };

    if (field === 'email') {
      if (!email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Please enter a valid email address';
      } else {
        delete errors.email;
      }
    }

    if (field === 'password') {
      if (!password) {
        errors.password = 'Password is required';
      } else {
        delete errors.password;
      }
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onBlur={() => validateField('email')}
        required
        placeholder="your.email@example.com"
        error={fieldErrors.email}
        autoComplete="email"
        icon={<FaEnvelope className="text-gray-400" />}
        iconPosition="left"
        helpText="Enter the email you used to register"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      />

      <TextInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onBlur={() => validateField('password')}
        required
        placeholder="Enter your password"
        error={fieldErrors.password}
        autoComplete="current-password"
        icon={<FaLock className="text-gray-400" />}
        iconPosition="left"
      />

      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a href="/register" className="text-blue-600 hover:text-blue-500">
            Don&apos;t have an account? Register
          </a>
        </div>
        <Button type="submit">
          <FaSignInAlt className="mr-2" /> Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
