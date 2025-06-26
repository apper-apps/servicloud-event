import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';
import { useLanguage } from '@/hooks/useLanguage';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Cloud" size={18} className="text-white" />
              </div>
              <h1 className="font-heading font-bold text-xl text-surface-900">
                ServiCloud MX
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-surface-100 transition-all duration-200"
            >
              <span className="text-2xl">{language === 'es' ? '🇲🇽' : '🇺🇸'}</span>
              <span className="font-medium text-surface-700">
                {language === 'es' ? 'ES' : 'EN'}
              </span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-surface-50">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <span className="font-medium text-surface-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-surface-50 border-r border-surface-200">
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-surface-700 hover:bg-white hover:shadow-sm'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} />
                  <span>{language === 'es' ? route.labelEs : route.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                transition={{ type: "tween", duration: 0.3 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-surface-50 z-50 flex flex-col"
              >
                <div className="h-16 flex items-center justify-between px-4 border-b border-surface-200">
                  <h2 className="font-heading font-bold text-lg text-surface-900">
                    {t('menu', 'Menú')}
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {visibleRoutes.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-white shadow-md'
                              : 'text-surface-700 hover:bg-white hover:shadow-sm'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} />
                        <span>{language === 'es' ? route.labelEs : route.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;