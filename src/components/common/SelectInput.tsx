import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Typography from './Typography';

export interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
  labelClassName?: string;
  error?: string;
  hideLabel?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  selectClassName = '',
  labelClassName = '',
  error,
  hideLabel = false,
}) => {
  return (
    <div className={`mb-3 sm:mb-4 ${className}`}>
      <label
        htmlFor={id}
        className={`block font-medium ${hideLabel ? 'sr-only' : ''} ${labelClassName}`}
      >
        <Typography variant="body2" color="default">
          {label}
        </Typography>
      </label>

      <div className="relative mt-1">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          className={`block w-full appearance-none rounded-md border ${
            error ? 'border-red-500' : 'border-gray-300'
          } bg-white py-1.5 sm:py-2 px-2 sm:px-3 pr-8 sm:pr-10 text-xs sm:text-sm leading-5 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${selectClassName}`}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
          <FiChevronDown
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
            data-testid="select-icon"
            aria-hidden="true"
          />
        </div>
      </div>

      {error && (
        <div role="alert">
          <Typography variant="caption" color="error" className="mt-1" as="p">
            {error}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default SelectInput;
