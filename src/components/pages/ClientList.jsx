import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useLanguage } from "@/contexts/LanguageContext";
import clientService from "@/services/api/clientService";
import DataTable from "@/components/molecules/DataTable";
import SearchBar from "@/components/molecules/SearchBar";
import SkeletonLoader from "@/components/organisms/SkeletonLoader";
import EmptyState from "@/components/organisms/EmptyState";
import ErrorState from "@/components/organisms/ErrorState";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchQuery]);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await clientService.getAll();
      setClients(result);
    } catch (err) {
      setError(err.message || 'Error al cargar los clientes');
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = clients.filter(client =>
      client.companyName.toLowerCase().includes(query) ||
      client.contactName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query)
    );
    setFilteredClients(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClientClick = (client) => {
    navigate(`/clients/${client.Id}`);
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm(t('confirmDeleteClient', '¿Estás seguro de que deseas eliminar este cliente?'))) {
      return;
    }

    try {
      await clientService.delete(clientId);
      setClients(prev => prev.filter(c => c.Id !== clientId));
      toast.success(t('clientDeleted', 'Cliente eliminado exitosamente'));
    } catch (err) {
      toast.error(t('errorDeletingClient', 'Error al eliminar el cliente'));
    }
  };

  const columns = [
    { 
      key: 'companyName', 
      label: 'Empresa', 
      labelKey: 'companyName', 
      sortable: true 
    },
    { 
      key: 'contactName', 
      label: 'Contacto', 
      labelKey: 'contactName', 
      sortable: true 
    },
    { 
      key: 'email', 
      label: 'Email', 
      labelKey: 'email', 
      sortable: true 
    },
    { 
      key: 'phone', 
      label: 'Teléfono', 
      labelKey: 'phone' 
    },
    { 
      key: 'status', 
      label: 'Estado', 
      labelKey: 'status', 
      type: 'status', 
      sortable: true 
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="h-8 bg-surface-200 rounded w-64 animate-pulse mb-4 md:mb-0" />
          <div className="h-10 bg-surface-200 rounded w-40 animate-pulse" />
        </div>
        <SkeletonLoader type="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadClients} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">
            {t('clientManagement', 'Gestión de Clientes')}
          </h1>
          <p className="text-surface-600 mt-1">
            {t('manageAllClients', 'Administra toda tu base de clientes')}
          </p>
        </div>
        
        <Button 
          icon="UserPlus"
          onClick={() => navigate('/clients/new')}
        >
          {t('addNewClient', 'Agregar Nuevo Cliente')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <SearchBar
            placeholder={t('searchClients', 'Buscar clientes...')}
            onSearch={handleSearch}
            className="w-full md:w-auto"
          />
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="Filter">
              {t('filter', 'Filtrar')}
            </Button>
            <Button variant="outline" size="sm" icon="Download">
              {t('export', 'Exportar')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Client List */}
      {filteredClients.length === 0 && !loading ? (
        <EmptyState
          icon="Users"
          title={searchQuery ? 
            t('noClientsFound', 'No se encontraron clientes') : 
            t('noClientsYet', 'Aún no tienes clientes')
          }
          description={searchQuery ?
            t('tryDifferentSearch', 'Intenta con diferentes términos de búsqueda') :
            t('addFirstClient', 'Comienza agregando tu primer cliente para gestionar tus servicios')
          }
          actionLabel={!searchQuery ? t('addNewClient', 'Agregar Nuevo Cliente') : null}
          onAction={!searchQuery ? () => navigate('/clients/new') : null}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DataTable
            data={filteredClients}
            columns={columns}
            onRowClick={handleClientClick}
          />
        </motion.div>
      )}

      {/* Stats Footer */}
      {filteredClients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-between text-sm text-surface-600"
        >
          <span>
            {t('showingClients', 'Mostrando')} {filteredClients.length} {t('of', 'de')} {clients.length} {t('clients', 'clientes')}
          </span>
          <span>
            {clients.filter(c => c.status === 'active').length} {t('activeClients', 'clientes activos')}
</span>
        </motion.div>
      )}
    </div>
  );
};

export default ClientList;