import React from 'react';
import Typography from './Typography';

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
    <div className={`mb-3 sm:mb-4 ${className}`}>
      <label htmlFor={id} className={`block font-medium ${labelClassName}`}>
        <Typography as="span" variant="body2">
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </Typography>
      </label>

      <div className="relative mt-1">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
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
          className={`block w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            disabled ? 'bg-gray-100 text-gray-500' : ''
          } ${readOnly ? 'bg-gray-50 cursor-not-allowed' : ''} ${
            icon && iconPosition === 'left' ? 'pl-8 sm:pl-10' : ''
          } ${icon && iconPosition === 'right' ? 'pr-8 sm:pr-10' : ''} ${inputClassName}`}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <div id={`${id}-error`} role="alert">
          <Typography variant="caption" color="error" as="p" className="mt-1">
            {error}
          </Typography>
        </div>
      )}

      {helpText && !error && (
        <div id={`${id}-help`}>
          <Typography
            variant="caption"
            color="secondary"
            as="p"
            className="mt-1"
          >
            {helpText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default TextInput;
