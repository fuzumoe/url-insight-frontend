import React, { useState, useEffect } from 'react';
import { Button, TextInput, Typography } from '../common';
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  getPasswordStrength,
} from '../../utils';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaUserPlus,
} from 'react-icons/fa';
import { useToast } from '../../hooks';
import { Link } from 'react-router-dom';

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
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [passwordStrength, setPasswordStrength] = useState<
    'weak' | 'medium' | 'strong'
  >('weak');
  const { addToast } = useToast();

  useEffect(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength('weak');
    }
  }, [password]);

  const validateField = (
    field: 'username' | 'email' | 'password' | 'confirmPassword'
  ) => {
    const errors = { ...fieldErrors };

    if (field === 'username' && !isValidUsername(username)) {
      errors.username =
        'Username must be 3-20 characters and can only contain letters, numbers, underscores, or hyphens';
    } else if (field === 'username') {
      delete errors.username;
    }

    if (field === 'email' && !isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    } else if (field === 'email') {
      delete errors.email;
    }

    if (field === 'password' && !isValidPassword(password, 7)) {
      errors.password =
        'Password must be at least 8 characters long and include uppercase, lowercase, and numbers';
    } else if (field === 'password') {
      delete errors.password;
    }

    if (field === 'confirmPassword' && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    } else if (field === 'confirmPassword') {
      delete errors.confirmPassword;
    }

    setFieldErrors(errors);
  };

  const validateForm = () => {
    const errors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!isValidUsername(username)) {
      errors.username =
        'Username must be 3-20 characters and can only contain letters, numbers, underscores, or hyphens';
    }

    if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!isValidPassword(password, 7)) {
      errors.password =
        'Password must be at least 8 characters long and include uppercase, lowercase, and numbers';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await onRegister(username, email, password);

      addToast({
        title: 'Registration Successful',
        message: 'Your account has been created successfully!',
        variant: 'success',
        duration: 5000,
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message.includes('already exists') ||
          err.message.includes('already in use')
        ) {
          setError('This email or username is already registered');

          addToast({
            title: 'Registration Failed',
            message: 'This email or username is already registered',
            variant: 'warning',
            duration: 6000,
          });
        } else {
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
          } else {
            addToast({
              title: 'Registration Error',
              message: err.message,
              variant: 'error',
              duration: 6000,
            });
          }
        }
      } else {
        setError('Registration failed. Please try again later.');

        addToast({
          title: 'Error',
          message: 'Registration failed. Please try again later.',
          variant: 'error',
          duration: 6000,
        });
      }
    }
  };

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
      <TextInput
        id="username"
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        onBlur={() => validateField('username')}
        required
        placeholder="3-20 characters (letters, numbers, _ or -)"
        error={fieldErrors.username}
        autoComplete="username"
        icon={<FaUser className="text-gray-400" />}
        iconPosition="left"
        pattern="^[a-zA-Z0-9_-]{3,20}$"
      />

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
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      />

      <div>
        <TextInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onBlur={() => validateField('password')}
          required
          placeholder="Min 8 chars with uppercase, lowercase & numbers"
          error={fieldErrors.password}
          autoComplete="new-password"
          icon={<FaLock className="text-gray-400" />}
          iconPosition="left"
          helpText="Create a strong password for better security"
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
              <Typography
                variant="caption"
                color="secondary"
                className="ml-2 capitalize"
              >
                {passwordStrength}
              </Typography>
            </div>
          </div>
        )}
      </div>

      <TextInput
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        onBlur={() => validateField('confirmPassword')}
        required
        placeholder="Re-enter your password"
        error={fieldErrors.confirmPassword}
        autoComplete="new-password"
        icon={<FaCheckCircle className="text-gray-400" />}
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="body2">
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </Typography>
        <Button
          type="submit"
          isLoading={loading}
          disabled={passwordStrength === 'weak'}
          className="w-full sm:w-auto"
        >
          <FaUserPlus className="mr-2" /> Register
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
