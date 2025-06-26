import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  padding = 'md',
  ...props 
}) => {
  const baseClasses = "bg-white rounded-lg shadow-sm border border-surface-200 transition-all duration-200";
  
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const cardClasses = `
    ${baseClasses}
    ${paddings[padding]}
    ${hover ? 'hover:shadow-md hover:-translate-y-1' : ''}
    ${className}
  `;

  const CardComponent = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { scale: 1.02, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={cardClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;