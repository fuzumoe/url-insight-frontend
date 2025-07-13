import React from 'react';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
  className?: string;
  indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  disabled = false,
  onChange,
  id,
  className = '',
  indeterminate = false,
}) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`flex items-center ${className}`}>
      <input
        ref={checkboxRef}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={`
          h-4 w-4 rounded 
          border-gray-300 
          text-blue-600 
          focus:ring-blue-500
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      />
      {label && (
        <label
          htmlFor={checkboxId}
          className={`ml-2 text-sm font-medium text-gray-700 ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
