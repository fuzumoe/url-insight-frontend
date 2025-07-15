import React from 'react';
import Typography from './Typography';

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
    <div className={`flex items-start sm:items-center ${className}`}>
      <input
        ref={checkboxRef}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className={`
          h-5 w-5 sm:h-4 sm:w-4 rounded 
          border-gray-300 
          text-blue-600 
          focus:ring-blue-500
          mt-0.5 sm:mt-0
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
      />
      {label && (
        <div className="ml-3 sm:ml-2">
          <label htmlFor={checkboxId}>
            <Typography
              variant="body2"
              color={disabled ? 'secondary' : 'default'}
              className={disabled ? 'opacity-50' : ''}
            >
              {label}
            </Typography>
          </label>
        </div>
      )}
    </div>
  );
};

export default Checkbox;
