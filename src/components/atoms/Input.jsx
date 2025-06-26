import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 text-sm border border-surface-300 rounded-lg
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
    disabled:bg-surface-50 disabled:cursor-not-allowed
    ${error ? 'border-accent focus:ring-accent focus:border-accent' : ''}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-surface-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-accent">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;