import React from 'react';
import { Box, Flex, Typography } from '..';

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
  // Base input classes: responsive padding, text sizing, focus styles
  let baseInputClasses =
    'px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500';
  // Border based on error state
  const borderClass = error ? 'border-red-300' : 'border-gray-300';
  // Disabled state
  const disabledClasses = disabled ? ' bg-gray-100 text-gray-500' : '';
  // Readonly state
  const readonlyClasses = readOnly ? ' bg-gray-50 cursor-not-allowed' : '';
  // Adjust padding if icon is provided
  if (icon) {
    if (iconPosition === 'left') {
      baseInputClasses += ' pl-8 sm:pl-10';
    } else if (iconPosition === 'right') {
      baseInputClasses += ' pr-8 sm:pr-10';
    }
  }
  const finalInputClasses =
    `${inputClassName} ${baseInputClasses} ${borderClass}${disabledClasses}${readonlyClasses}`.trim();

  return (
    // Force Box to render as a 'div' so that custom and responsive classes are applied
    <Box as="div" className={`mb-3 sm:mb-4 ${className}`}>
      <div>
        {label && (
          <label htmlFor={id} className={labelClassName}>
            {label}
            {required && (
              <span className="text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {icon ? (
          <Flex align="center" className="relative">
            {iconPosition === 'left' && (
              <div
                className="absolute left-0 pl-2 sm:pl-3"
                data-testid="icon-container"
              >
                {icon}
              </div>
            )}
            <input
              id={id}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              maxLength={maxLength}
              min={min}
              max={max}
              pattern={pattern}
              readOnly={readOnly}
              required={required}
              className={finalInputClasses}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${id}-error` : helpText ? `${id}-help` : undefined
              }
              onBlur={onBlur}
              onFocus={onFocus}
            />
            {iconPosition === 'right' && (
              <div
                className="absolute right-0 pr-2 sm:pr-3"
                data-testid="icon-container"
              >
                {icon}
              </div>
            )}
          </Flex>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            maxLength={maxLength}
            min={min}
            max={max}
            pattern={pattern}
            readOnly={readOnly}
            required={required}
            className={finalInputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${id}-error` : helpText ? `${id}-help` : undefined
            }
            onBlur={onBlur}
            onFocus={onFocus}
          />
        )}

        {error && (
          <div id={`${id}-error`} role="alert">
            <Typography
              variant="caption"
              color="error"
              data-testid="typography-error-caption"
            >
              {error}
            </Typography>
          </div>
        )}

        {helpText && !error && (
          <div id={`${id}-help`}>
            <Typography
              variant="caption"
              color="secondary"
              data-testid="typography-secondary-caption"
            >
              {helpText}
            </Typography>
          </div>
        )}
      </div>
    </Box>
  );
};

export default TextInput;
