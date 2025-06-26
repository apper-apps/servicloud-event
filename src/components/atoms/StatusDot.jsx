import { motion } from 'framer-motion';

const StatusDot = ({ status, size = 'sm', className = '' }) => {
  const statusColors = {
    active: 'bg-success',
    inactive: 'bg-surface-400',
    expired: 'bg-accent',
    pending: 'bg-warning',
    open: 'bg-info',
    inProgress: 'bg-warning',
    resolved: 'bg-success',
    closed: 'bg-surface-400'
  };

  const sizes = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      className={`
        rounded-full flex-shrink-0
        ${statusColors[status] || 'bg-surface-400'}
        ${sizes[size]}
        ${className}
      `}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    />
  );
};

export default StatusDot;