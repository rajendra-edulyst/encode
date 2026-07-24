import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimeFilterProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const TimeFilter: React.FC<TimeFilterProps> = ({
  value = '',
  onChange,
  placeholder = 'Select Time Frame',
  className = '',
  size = 'md',
  disabled = false
}) => {
  const handleValueChange = (newValue: string) => {
    if (onChange && !disabled) {
      onChange(newValue);
    }
  };

  const sizeClasses = {
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64'
  };

  const timeOptions = [
    { value: 'yearly', label: 'Yearly', description: 'View yearly data' },
    { value: 'halfyear', label: 'Half Year', description: 'View half-year data' },
    { value: 'quarterly', label: 'Quarterly', description: 'View quarterly data' },
    { value: 'monthly', label: 'Monthly', description: 'View monthly data' },
    { value: 'weekly', label: 'Weekly', description: 'View weekly data' },
];

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={`${sizeClasses[size]} ${className}`}>
        <SelectValue>
          {value ? (
            timeOptions.find(opt => opt.value === value)?.label
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            title={option.description}
          >
            <div className="flex items-center justify-between w-full">
              <span>{option.label}</span>
              {value === option.value && (
                <span className="text-xs text-gray-400 ml-2">✓</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeFilter;