import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:brightness-110 focus:ring-primary/50 shadow-sm",
    secondary: "bg-secondary text-white hover:brightness-110 focus:ring-secondary/50 shadow-sm",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-surface-700 hover:bg-surface-100 focus:ring-surface-500/50",
    danger: "bg-accent text-white hover:brightness-110 focus:ring-accent/50 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const renderIcon = () => {
    if (loading) {
      return <ApperIcon name="Loader2" size={16} className="animate-spin" />;
    }
    if (icon) {
      return <ApperIcon name={icon} size={16} />;
    }
    return null;
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={children ? "mr-2" : ""}>
          {renderIcon()}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={children ? "ml-2" : ""}>
          {renderIcon()}
        </span>
      )}
    </motion.button>
  );
};

export default Button;