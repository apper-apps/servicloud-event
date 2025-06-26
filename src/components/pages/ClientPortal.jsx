import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StatusDot from '@/components/atoms/StatusDot';
import Input from '@/components/atoms/Input';
import DataTable from '@/components/molecules/DataTable';
import StatCard from '@/components/molecules/StatCard';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';

const ClientPortal = () => {
  const [selectedClient, setSelectedClient] = useState('1'); // Demo client
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  
  const { t } = useLanguage();

  // Mock data for demo purposes
  const clientData = {
    companyName: "Restaurante El Sazón Mexicano",
    contactName: "María González López",
    email: "maria@elsazonmexicano.com"
  };

  const clientServices = [
    {
      Id: 1,
      serviceName: "Hosting Web Básico",
      startDate: "2024-01-15",
      endDate: "2024-12-15",
      status: "active",
      price: 299,
      daysUntilExpiry: 45
    },
    {
      Id: 2,
      serviceName: "Mantenimiento WordPress Premium",
      startDate: "2024-01-20",
      endDate: "2024-12-20",
      status: "active",
      price: 899,
      daysUntilExpiry: 50
    }
  ];

  const clientTickets = [
    {
      Id: 1,
      subject: "Sitio web lento durante horas pico",
      status: "open",
      priority: "high",
      createdAt: "2024-03-15T19:30:00Z",
      lastResponse: "Hace 2 horas"
    },
    {
      Id: 2,
      subject: "Solicitud de respaldo de base de datos",
      status: "closed",
      priority: "medium",
      createdAt: "2024-03-10T13:00:00Z",
      lastResponse: "Resuelto"
    }
  ];

  const serviceColumns = [
    { key: 'serviceName', label: 'Servicio', labelKey: 'serviceName', sortable: true },
    { key: 'endDate', label: 'Vence', labelKey: 'expiresOn', type: 'date', sortable: true },
    { key: 'status', label: 'Estado', labelKey: 'status', type: 'status', sortable: true },
    { key: 'price', label: 'Precio Mensual', labelKey: 'monthlyPrice', type: 'currency' }
  ];

  const ticketColumns = [
    { key: 'subject', label: 'Asunto', labelKey: 'subject', sortable: true },
    { key: 'status', label: 'Estado', labelKey: 'status', type: 'status', sortable: true },
    { key: 'priority', label: 'Prioridad', labelKey: 'priority', type: 'badge', sortable: true },
    { key: 'lastResponse', label: 'Última Respuesta', labelKey: 'lastResponse' }
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    // In a real app, this would create a ticket via API
    console.log('Creating ticket:', { 
      subject: newTicketSubject, 
      description: newTicketDescription 
    });
    setNewTicketSubject('');
    setNewTicketDescription('');
    setShowTicketForm(false);
  };

  const getExpiryBadgeVariant = (days) => {
    if (days <= 7) return 'danger';
    if (days <= 30) return 'warning';
    return 'success';
  };

  const getExpiryText = (days) => {
    if (days <= 0) return t('expired', 'Vencido');
    if (days === 1) return t('expiresIn1Day', 'Vence en 1 día');
    return t('expiresInDays', `Vence en ${days} días`);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Client Portal Header */}
      <header className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Cloud" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-surface-900">
                  {t('clientPortal', 'Portal Cliente')}
                </h1>
                <p className="text-sm text-surface-600">
                  {clientData.companyName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-surface-900">
                  {clientData.contactName}
                </p>
                <p className="text-xs text-surface-500">
                  {clientData.email}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading font-bold text-surface-900 mb-2">
            {t('welcome', 'Bienvenido')}, {clientData.contactName}
          </h1>
          <p className="text-surface-600">
            {t('portalDescription', 'Administra tus servicios y solicita soporte desde este portal')}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCard
              title={t('activeServices', 'Servicios Activos')}
              value={clientServices.filter(s => s.status === 'active').length}
              icon="Package"
              color="success"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCard
              title={t('openTickets', 'Tickets Abiertos')}
              value={clientTickets.filter(t => t.status === 'open').length}
              icon="MessageCircle"
              color="info"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCard
              title={t('expiringServices', 'Servicios por Vencer')}
              value={clientServices.filter(s => s.daysUntilExpiry <= 30).length}
              icon="Clock"
              color="warning"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold text-surface-900">
                    {t('yourServices', 'Tus Servicios')}
                  </h2>
                  <Button variant="outline" size="sm" icon="Download">
                    {t('downloadInvoices', 'Descargar Facturas')}
                  </Button>
                </div>

                <DataTable
                  data={clientServices}
                  columns={serviceColumns}
                />

                {/* Service Expiry Alerts */}
                <div className="mt-6 space-y-3">
                  {clientServices
                    .filter(service => service.daysUntilExpiry <= 30)
                    .map(service => (
                      <motion.div
                        key={service.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
                          <div>
                            <p className="font-medium text-surface-900">
                              {service.serviceName}
                            </p>
                            <p className="text-sm text-surface-600">
                              {getExpiryText(service.daysUntilExpiry)}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          {t('renewService', 'Renovar')}
                        </Button>
                      </motion.div>
                    ))}
                </div>
              </Card>
            </motion.div>

            {/* Support Tickets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold text-surface-900">
                    {t('supportTickets', 'Tickets de Soporte')}
                  </h2>
                  <Button 
                    icon="Plus" 
                    size="sm"
                    onClick={() => setShowTicketForm(!showTicketForm)}
                  >
                    {t('newTicket', 'Nuevo Ticket')}
                  </Button>
                </div>

                {/* New Ticket Form */}
                {showTicketForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-surface-50 rounded-lg border border-surface-200"
                  >
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <Input
                        label={t('subject', 'Asunto')}
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                        placeholder={t('ticketSubjectPlaceholder', 'Describe brevemente tu problema')}
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">
                          {t('description', 'Descripción')}
                        </label>
                        <textarea
                          value={newTicketDescription}
                          onChange={(e) => setNewTicketDescription(e.target.value)}
                          placeholder={t('ticketDescriptionPlaceholder', 'Describe tu problema en detalle')}
                          rows={4}
                          required
                          className="w-full px-4 py-3 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button type="submit" size="sm">
                          {t('submitTicket', 'Enviar Ticket')}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowTicketForm(false)}
                        >
                          {t('cancel', 'Cancelar')}
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}

                <DataTable
                  data={clientTickets}
                  columns={ticketColumns}
                />
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <h3 className="font-heading font-semibold text-surface-900 mb-4">
                  {t('quickActions', 'Acciones Rápidas')}
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" icon="CreditCard">
                    {t('payInvoices', 'Pagar Facturas')}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" icon="FileText">
                    {t('viewContracts', 'Ver Contratos')}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" icon="Settings">
                    {t('serviceSettings', 'Configuración de Servicios')}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" icon="Download">
                    {t('downloadReports', 'Descargar Reportes')}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <h3 className="font-heading font-semibold text-surface-900 mb-4">
                  {t('systemStatus', 'Estado del Sistema')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StatusDot status="active" size="sm" />
                      <span className="text-sm text-surface-700">
                        {t('webHosting', 'Hosting Web')}
                      </span>
                    </div>
                    <Badge variant="success" size="sm">
                      {t('operational', 'Operativo')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StatusDot status="active" size="sm" />
                      <span className="text-sm text-surface-700">
                        {t('emailServices', 'Servicios de Email')}
                      </span>
                    </div>
                    <Badge variant="success" size="sm">
                      {t('operational', 'Operativo')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <StatusDot status="active" size="sm" />
                      <span className="text-sm text-surface-700">
                        {t('domainServices', 'Servicios de Dominio')}
                      </span>
                    </div>
                    <Badge variant="success" size="sm">
                      {t('operational', 'Operativo')}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <h3 className="font-heading font-semibold text-surface-900 mb-4">
                  {t('needHelp', '¿Necesitas Ayuda?')}
                </h3>
                <p className="text-sm text-surface-600 mb-4">
                  {t('contactSupportDescription', 'Nuestro equipo está disponible para ayudarte')}
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Phone" size={16} className="text-primary" />
                    <span>+52 55 1234-5678</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" size={16} className="text-primary" />
                    <span>soporte@servicloudmx.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Clock" size={16} className="text-primary" />
                    <span>{t('businessHours', 'Lun-Vie 9:00-18:00')}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  icon="MessageCircle"
                >
                  {t('liveChat', 'Chat en Vivo')}
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;