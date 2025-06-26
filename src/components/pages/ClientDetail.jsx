import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StatusDot from '@/components/atoms/StatusDot';
import DataTable from '@/components/molecules/DataTable';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import clientService from '@/services/api/clientService';
import clientServiceService from '@/services/api/clientServiceService';
import serviceService from '@/services/api/serviceService';
import ticketService from '@/services/api/ticketService';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [client, setClient] = useState(null);
  const [clientServices, setClientServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClientData();
  }, [id]);

  const loadClientData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [clientData, clientServicesData, ticketsData, servicesData] = await Promise.all([
        clientService.getById(id),
        clientServiceService.getByClientId(id),
        ticketService.getByClientId(id),
        serviceService.getAll()
      ]);

      setClient(clientData);
      setTickets(ticketsData);

      // Enrich client services with service details
      const enrichedServices = clientServicesData.map(cs => {
        const service = servicesData.find(s => s.Id === cs.serviceId);
        return {
          ...cs,
          serviceName: service?.name || 'Servicio no encontrado',
          servicePrice: service?.price || 0,
          serviceCategory: service?.category || 'unknown'
        };
      });

      setClientServices(enrichedServices);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos del cliente');
      toast.error('Error al cargar los datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'info', label: t('information', 'Información'), icon: 'User' },
    { id: 'services', label: t('services', 'Servicios'), icon: 'Package' },
    { id: 'tickets', label: t('tickets', 'Tickets'), icon: 'MessageCircle' },
    { id: 'documents', label: t('documents', 'Documentos'), icon: 'FileText' }
  ];

  const serviceColumns = [
    { key: 'serviceName', label: 'Servicio', labelKey: 'serviceName', sortable: true },
    { key: 'startDate', label: 'Inicio', labelKey: 'startDate', type: 'date', sortable: true },
    { key: 'endDate', label: 'Vencimiento', labelKey: 'endDate', type: 'date', sortable: true },
    { key: 'status', label: 'Estado', labelKey: 'status', type: 'status', sortable: true },
    { key: 'servicePrice', label: 'Precio', labelKey: 'price', type: 'currency' }
  ];

  const ticketColumns = [
    { key: 'subject', label: 'Asunto', labelKey: 'subject', sortable: true },
    { key: 'status', label: 'Estado', labelKey: 'status', type: 'status', sortable: true },
    { key: 'priority', label: 'Prioridad', labelKey: 'priority', type: 'badge', sortable: true },
    { key: 'createdAt', label: 'Creado', labelKey: 'createdAt', type: 'date', sortable: true }
  ];

  const handleTicketClick = (ticket) => {
    navigate(`/tickets/${ticket.Id}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadClientData} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <ErrorState message="Cliente no encontrado" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate('/clients')}
          >
            {t('back', 'Volver')}
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-surface-900">
              {client.companyName}
            </h1>
            <p className="text-surface-600 mt-1">
              {t('clientDetails', 'Detalles del cliente')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Edit">
            {t('edit', 'Editar')}
          </Button>
          <Button variant="outline" icon="Mail">
            {t('sendEmail', 'Enviar Email')}
          </Button>
        </div>
      </div>

      {/* Client Status Card */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="Building" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-surface-900">
                {client.companyName}
              </h2>
              <p className="text-surface-600">{client.contactName}</p>
              <p className="text-surface-500 text-sm">{client.email}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <StatusDot status={client.status} />
              <Badge variant={client.status === 'active' ? 'success' : 'default'}>
                {t(client.status, client.status)}
              </Badge>
            </div>
            <p className="text-sm text-surface-500">
              {t('clientSince', 'Cliente desde')} {new Date(client.createdAt).toLocaleDateString('es-MX')}
            </p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-surface-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }
              `}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                {t('contactInformation', 'Información de Contacto')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-surface-500">
                    {t('companyName', 'Nombre de Empresa')}
                  </label>
                  <p className="text-surface-900">{client.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-500">
                    {t('contactName', 'Nombre de Contacto')}
                  </label>
                  <p className="text-surface-900">{client.contactName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-500">
                    {t('email', 'Email')}
                  </label>
                  <p className="text-surface-900">{client.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-500">
                    {t('phone', 'Teléfono')}
                  </label>
                  <p className="text-surface-900">{client.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-500">
                    {t('address', 'Dirección')}
                  </label>
                  <p className="text-surface-900">{client.address}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                {t('customFields', 'Campos Personalizados')}
              </h3>
              <div className="space-y-4">
                {client.customFields && Object.entries(client.customFields).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-surface-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <p className="text-surface-900">{value}</p>
                  </div>
                ))}
              </div>

              {client.notes && (
                <div className="mt-6 pt-6 border-t border-surface-200">
                  <label className="text-sm font-medium text-surface-500">
                    {t('notes', 'Notas')}
                  </label>
                  <p className="text-surface-900 mt-1">{client.notes}</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'services' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900">
                {t('assignedServices', 'Servicios Asignados')}
              </h3>
              <Button icon="Plus" size="sm">
                {t('assignService', 'Asignar Servicio')}
              </Button>
            </div>

            <DataTable
              data={clientServices}
              columns={serviceColumns}
            />
          </Card>
        )}

        {activeTab === 'tickets' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-surface-900">
                {t('supportTickets', 'Tickets de Soporte')}
              </h3>
              <Button icon="Plus" size="sm">
                {t('createTicket', 'Crear Ticket')}
              </Button>
            </div>

            <DataTable
              data={tickets}
              columns={ticketColumns}
              onRowClick={handleTicketClick}
            />
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <div className="text-center py-12">
              <ApperIcon name="FileText" size={48} className="mx-auto text-surface-300 mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">
                {t('noDocuments', 'Sin documentos')}
              </h3>
              <p className="text-surface-500 mb-6">
                {t('documentsWillAppear', 'Los documentos del cliente aparecerán aquí')}
              </p>
              <Button icon="Upload">
                {t('uploadDocument', 'Subir Documento')}
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ClientDetail;