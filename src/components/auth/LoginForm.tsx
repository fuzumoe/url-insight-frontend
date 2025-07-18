import React, { useState } from 'react';
import { useAuth, useToast } from '../../hooks';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button, TextInput, Typography } from '..';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const { login } = useAuth();
  const { addToast } = useToast();

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

      addToast({
        title: 'Login Successful',
        message: 'Welcome back!',
        variant: 'success',
        duration: 4000,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);

        if (
          err.message.includes('network') ||
          err.message.includes('server') ||
          err.message.includes('timeout')
        ) {
          addToast({
            title: 'Connection Problem',
            message: 'Please check your internet connection and try again',
            variant: 'error',
            duration: 8000,
          });
        }
      } else {
        setError('Login failed. Please try again.');

        addToast({
          title: 'Error',
          message: 'An unexpected error occurred',
          variant: 'error',
        });
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
        <Typography
          variant="body2"
          color="error"
          className="p-2 bg-red-50 border border-red-200 rounded"
        >
          {error}
        </Typography>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <Typography variant="body2">
          <Link to="/register" className="text-blue-600 hover:text-blue-500">
            Don&apos;t have an account? Register
          </Link>
        </Typography>

        <Button type="submit" className="w-full sm:w-auto">
          <FaSignInAlt className="mr-2" /> Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
