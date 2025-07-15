import React from 'react';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  disabled?: boolean;
  maxLength?: number;
  helpText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  readOnly?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  name,
  type = 'text',
  required = false,
  placeholder = '',
  error,
  autoComplete,
  disabled = false,
  maxLength,
  helpText,
  icon,
  iconPosition = 'right',
  className = '',
  inputClassName = '',
  labelClassName = '',
  onBlur,
  onFocus,
  min,
  max,
  pattern,
  readOnly = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          min={min}
          max={max}
          pattern={pattern}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          className={`mt-1 block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            disabled ? 'bg-gray-100 text-gray-500' : ''
          } ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''} ${
            icon && iconPosition === 'left' ? 'pl-10' : ''
          } ${icon && iconPosition === 'right' ? 'pr-10' : ''} ${inputClassName}`}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default TextInput;
