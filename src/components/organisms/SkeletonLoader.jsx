import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  count = 3, 
  type = 'card',
  className = ''
}) => {
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    }
  };

  const CardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 space-y-4">
      <motion.div
        className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded"
        variants={shimmerVariants}
        animate="animate"
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '200% 100%' }}
      />
      <motion.div
        className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-3/4"
        variants={shimmerVariants}
        animate="animate"
        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.2 }}
        style={{ backgroundSize: '200% 100%' }}
      />
      <motion.div
        className="h-4 bg-gradient-to-r from-surface-200 via-surface-300 to-surface-200 rounded w-1/2"
        variants={shimmerVariants}
        animate="animate"
        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.4 }}
        style={{ backgroundSize: '200% 100%' }}
      />
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
      <div className="h-12 bg-surface-50 border-b border-surface-200"></div>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="h-16 bg-gradient-to-r from-white via-surface-50 to-white border-b border-surface-100 last:border-b-0"
          variants={shimmerVariants}
          animate="animate"
          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
          style={{ backgroundSize: '200% 100%' }}
        />
      ))}
    </div>
  );

  if (type === 'table') {
    return <TableSkeleton />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <CardSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;