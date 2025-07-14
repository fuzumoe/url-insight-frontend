import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

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
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full appearance-none rounded-md border ${
            error ? 'border-red-500' : 'border-gray-300'
          } bg-white py-2 px-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${selectClassName}`}
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <FiChevronDown
            className="h-5 w-5 text-gray-400"
            data-testid="select-icon"
            role="img"
          />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectInput;
