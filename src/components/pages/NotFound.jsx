import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-8"
        >
          <ApperIcon name="CloudOff" size={80} className="text-surface-300 mx-auto" />
        </motion.div>

        <h1 className="text-6xl font-heading font-bold text-surface-900 mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-heading font-semibold text-surface-800 mb-4">
          {t('pageNotFound', 'Página no encontrada')}
        </h2>
        
        <p className="text-surface-600 mb-8 leading-relaxed">
          {t('pageNotFoundDescription', 'La página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio.')}
        </p>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')}
            icon="Home" 
            className="w-full sm:w-auto"
          >
            {t('backToHome', 'Volver al Inicio')}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            icon="ArrowLeft" 
            className="w-full sm:w-auto"
          >
            {t('goBack', 'Regresar')}
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-4 text-surface-400">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon name="Settings" size={24} />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ApperIcon name="Server" size={24} />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon name="Globe" size={24} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;