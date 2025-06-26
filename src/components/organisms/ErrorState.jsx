import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = 'Ha ocurrido un error',
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mb-6">
        <ApperIcon name="AlertCircle" size={64} className="text-accent mx-auto" />
      </div>
      
      <h3 className="text-lg font-medium text-surface-900 mb-2">
        Error al cargar los datos
      </h3>
      <p className="text-surface-500 mb-6">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" icon="RefreshCw">
          Intentar de nuevo
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;