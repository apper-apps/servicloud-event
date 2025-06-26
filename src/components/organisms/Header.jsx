import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const Header = ({ title, subtitle, onMenuClick, showMenuButton = true }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="bg-white border-b border-surface-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
          )}
          
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-surface-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-surface-100 transition-all duration-200"
          >
            <span className="text-2xl">{language === 'es' ? '🇲🇽' : '🇺🇸'}</span>
            <span className="font-medium text-surface-700">
              {language === 'es' ? 'ES' : 'EN'}
            </span>
          </motion.button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors">
            <ApperIcon name="Bell" size={20} className="text-surface-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <span className="font-medium text-surface-700">Admin</span>
              <ApperIcon name="ChevronDown" size={16} className="text-surface-500" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-surface-200 z-50"
                >
                  <div className="py-1">
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                      <ApperIcon name="User" size={16} className="mr-3" />
                      {t('profile', 'Perfil')}
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                      <ApperIcon name="Settings" size={16} className="mr-3" />
                      {t('settings', 'Configuración')}
                    </a>
                    <hr className="my-1" />
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                      <ApperIcon name="LogOut" size={16} className="mr-3" />
                      {t('logout', 'Cerrar Sesión')}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;