import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';
import serviceService from '@/services/api/serviceService';

const ServiceCatalog = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { t } = useLanguage();

  const categories = [
    { key: 'all', label: t('allCategories', 'Todas las Categorías'), icon: 'Grid3X3' },
    { key: 'webHosting', label: t('webHosting', 'Hosting Web'), icon: 'Server' },
    { key: 'domainManagement', label: t('domainManagement', 'Gestión de Dominios'), icon: 'Globe' },
    { key: 'wordPressManagement', label: t('wordPressManagement', 'Gestión WordPress'), icon: 'Code' },
    { key: 'emailHosting', label: t('emailHosting', 'Hosting de Email'), icon: 'Mail' },
    { key: 'seoMarketing', label: t('seoMarketing', 'SEO y Marketing'), icon: 'TrendingUp' }
  ];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchQuery, selectedCategory]);

  const loadServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await serviceService.getAll();
      setServices(result);
    } catch (err) {
      setError(err.message || 'Error al cargar los servicios');
      toast.error('Error al cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      );
    }

    setFilteredServices(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.key === category);
    return categoryData?.icon || 'Package';
  };

  const getBillingCycleLabel = (cycle) => {
    const labels = {
      monthly: t('monthly', 'Mensual'),
      quarterly: t('quarterly', 'Trimestral'),
      yearly: t('yearly', 'Anual')
    };
    return labels[cycle] || cycle;
  };

  const ServiceCard = ({ service }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name={getCategoryIcon(service.category)} size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900">{service.name}</h3>
              <Badge variant="default" size="sm">
                {t(service.category, service.category)}
              </Badge>
            </div>
          </div>
          <Badge variant={service.isActive ? 'success' : 'default'}>
            {service.isActive ? t('active', 'Activo') : t('inactive', 'Inactivo')}
          </Badge>
        </div>

        <p className="text-surface-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-surface-900">
              ${service.price.toLocaleString('es-MX')}
            </span>
            <span className="text-surface-500 text-sm ml-1">
              MXN / {getBillingCycleLabel(service.billingCycle)}
            </span>
          </div>
        </div>

        {/* Custom Fields Preview */}
        {service.customFields && Object.keys(service.customFields).length > 0 && (
          <div className="mb-4 p-3 bg-surface-50 rounded-lg">
            <p className="text-xs font-medium text-surface-500 mb-2">
              {t('features', 'Características')}
            </p>
            <div className="space-y-1">
              {Object.entries(service.customFields).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-surface-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <span className="text-surface-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            {t('assignToClient', 'Asignar a Cliente')}
          </Button>
          <Button variant="outline" size="sm" icon="Edit">
            {t('edit', 'Editar')}
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="h-8 bg-surface-200 rounded w-64 animate-pulse mb-4 md:mb-0" />
          <div className="h-10 bg-surface-200 rounded w-40 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-surface-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadServices} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">
            {t('servicesCatalog', 'Catálogo de Servicios')}
          </h1>
          <p className="text-surface-600 mt-1">
            {t('manageAllServices', 'Administra todos tus servicios y productos')}
          </p>
        </div>
        
        <Button icon="Plus">
          {t('createNewService', 'Crear Nuevo Servicio')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <SearchBar
            placeholder={t('searchServices', 'Buscar servicios...')}
            onSearch={handleSearch}
            className="w-full lg:w-auto"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${selectedCategory === category.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                  }
                `}
              >
                <ApperIcon name={category.icon} size={16} />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Services Grid */}
      {filteredServices.length === 0 && !loading ? (
        <EmptyState
          icon="Package"
          title={searchQuery || selectedCategory !== 'all' ? 
            t('noServicesFound', 'No se encontraron servicios') : 
            t('noServicesYet', 'Aún no tienes servicios')
          }
          description={searchQuery || selectedCategory !== 'all' ?
            t('tryDifferentFilters', 'Intenta con diferentes filtros de búsqueda') :
            t('createFirstService', 'Comienza creando tu primer servicio para ofrecer a tus clientes')
          }
          actionLabel={!searchQuery && selectedCategory === 'all' ? 
            t('createNewService', 'Crear Nuevo Servicio') : null
          }
          onAction={!searchQuery && selectedCategory === 'all' ? 
            () => console.log('Create service') : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {filteredServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-between text-sm text-surface-600"
        >
          <span>
            {t('showingServices', 'Mostrando')} {filteredServices.length} {t('of', 'de')} {services.length} {t('services', 'servicios')}
          </span>
          <span>
            {services.filter(s => s.isActive).length} {t('activeServices', 'servicios activos')}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default ServiceCatalog;