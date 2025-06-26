import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DataTable from '@/components/molecules/DataTable';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import ticketService from '@/services/api/ticketService';
import clientService from '@/services/api/clientService';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const { t } = useLanguage();
  const navigate = useNavigate();

  const statusOptions = [
    { key: 'all', label: t('allStatuses', 'Todos los Estados'), color: 'default' },
    { key: 'open', label: t('open', 'Abierto'), color: 'info' },
    { key: 'inProgress', label: t('inProgress', 'En Progreso'), color: 'warning' },
    { key: 'resolved', label: t('resolved', 'Resuelto'), color: 'success' },
    { key: 'closed', label: t('closed', 'Cerrado'), color: 'default' }
  ];

  const priorityOptions = [
    { key: 'all', label: t('allPriorities', 'Todas las Prioridades') },
    { key: 'low', label: t('low', 'Baja'), color: 'default' },
    { key: 'medium', label: t('medium', 'Media'), color: 'info' },
    { key: 'high', label: t('high', 'Alta'), color: 'warning' },
    { key: 'urgent', label: t('urgent', 'Urgente'), color: 'danger' }
  ];

  useEffect(() => {
    loadTicketsData();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const loadTicketsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [ticketsData, clientsData] = await Promise.all([
        ticketService.getAll(),
        clientService.getAll()
      ]);

      setClients(clientsData);

      // Enrich tickets with client information
      const enrichedTickets = ticketsData.map(ticket => {
        const client = clientsData.find(c => c.Id === ticket.clientId);
        return {
          ...ticket,
          clientName: client?.companyName || 'Cliente desconocido',
          clientContact: client?.contactName || ''
        };
      });

      setTickets(enrichedTickets);
    } catch (err) {
      setError(err.message || 'Error al cargar los tickets');
      toast.error('Error al cargar los tickets');
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.clientName.toLowerCase().includes(query)
      );
    }

    // Sort by most recent first
    filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredTickets(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTicketClick = (ticket) => {
    navigate(`/tickets/${ticket.Id}`);
  };

  const columns = [
    { key: 'subject', label: 'Asunto', labelKey: 'subject', sortable: true },
    { key: 'clientName', label: 'Cliente', labelKey: 'client', sortable: true },
    { key: 'status', label: 'Estado', labelKey: 'status', type: 'status', sortable: true },
    { key: 'priority', label: 'Prioridad', labelKey: 'priority', type: 'badge', sortable: true },
    { key: 'createdAt', label: 'Creado', labelKey: 'createdAt', type: 'date', sortable: true },
    { key: 'updatedAt', label: 'Actualizado', labelKey: 'updatedAt', type: 'date', sortable: true }
  ];

  const getStatusCount = (status) => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

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
        <ErrorState message={error} onRetry={loadTicketsData} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">
            {t('supportTickets', 'Tickets de Soporte')}
          </h1>
          <p className="text-surface-600 mt-1">
            {t('manageCustomerSupport', 'Administra todas las solicitudes de soporte de tus clientes')}
          </p>
        </div>
        
        <Button icon="Plus">
          {t('createTicket', 'Crear Ticket')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statusOptions.slice(1).map((status) => (
          <motion.div
            key={status.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Badge variant={status.color}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-surface-900">
                {getStatusCount(status.key)}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <SearchBar
            placeholder={t('searchTickets', 'Buscar tickets...')}
            onSearch={handleSearch}
            className="w-full md:w-auto"
          />

          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <div className="flex items-center space-x-1">
              <ApperIcon name="Filter" size={16} className="text-surface-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {priorityOptions.map((priority) => (
                <option key={priority.key} value={priority.key}>
                  {priority.label}
                </option>
              ))}
            </select>

            <Button variant="outline" size="sm" icon="Download">
              {t('export', 'Exportar')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Tickets Table */}
      {filteredTickets.length === 0 && !loading ? (
        <EmptyState
          icon="Headphones"
          title={searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ? 
            t('noTicketsFound', 'No se encontraron tickets') : 
            t('noTicketsYet', 'Aún no tienes tickets')
          }
          description={searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ?
            t('tryDifferentFilters', 'Intenta con diferentes filtros de búsqueda') :
            t('ticketsWillAppear', 'Los tickets de soporte de tus clientes aparecerán aquí')
          }
          actionLabel={!searchQuery && statusFilter === 'all' && priorityFilter === 'all' ? 
            t('createTicket', 'Crear Ticket') : null
          }
          onAction={!searchQuery && statusFilter === 'all' && priorityFilter === 'all' ? 
            () => console.log('Create ticket') : null
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DataTable
            data={filteredTickets}
            columns={columns}
            onRowClick={handleTicketClick}
          />
        </motion.div>
      )}

      {/* Stats Footer */}
      {filteredTickets.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-between text-sm text-surface-600"
        >
          <span>
            {t('showingTickets', 'Mostrando')} {filteredTickets.length} {t('of', 'de')} {tickets.length} {t('tickets', 'tickets')}
          </span>
          <span>
            {tickets.filter(t => t.status === 'open' || t.status === 'inProgress').length} {t('activeTickets', 'tickets activos')}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default TicketList;