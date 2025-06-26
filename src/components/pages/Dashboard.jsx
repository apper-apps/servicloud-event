import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import DataTable from '@/components/molecules/DataTable';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { useLanguage } from '@/contexts/LanguageContext';
import clientService from '@/services/api/clientService';
import serviceService from '@/services/api/serviceService';
import ticketService from '@/services/api/ticketService';
import clientServiceService from '@/services/api/clientServiceService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeClients: 0,
    expiringServices: 0,
    openTickets: 0,
    monthlyRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [clients, services, tickets, clientServices] = await Promise.all([
        clientService.getAll(),
        serviceService.getAll(),
        ticketService.getAll(),
        clientServiceService.getAll()
      ]);

      // Calculate stats
      const activeClients = clients.filter(c => c.status === 'active').length;
      const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'inProgress').length;
      const expiringServices = await clientServiceService.getExpiringServices(30);
      
      // Calculate monthly revenue (simplified)
      const monthlyRevenue = clientServices
        .filter(cs => cs.status === 'active')
        .reduce((total, cs) => {
          const service = services.find(s => s.Id === cs.serviceId);
          if (service && service.billingCycle === 'monthly') {
            return total + service.price;
          }
          return total;
        }, 0);

      setStats({
        activeClients,
        expiringServices: expiringServices.length,
        openTickets,
        monthlyRevenue
      });

      // Recent activity (last 5 tickets)
      const sortedTickets = tickets
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(ticket => {
          const client = clients.find(c => c.Id === ticket.clientId);
          return {
            ...ticket,
            clientName: client?.companyName || 'Cliente desconocido'
          };
        });

      setRecentActivity(sortedTickets);
    } catch (err) {
      setError(err.message || 'Error al cargar el dashboard');
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const activityColumns = [
    { key: 'subject', label: 'Asunto', labelKey: 'ticketSubject', sortable: true },
    { key: 'clientName', label: 'Cliente', labelKey: 'client', sortable: true },
    { key: 'status', label: 'Estado', labelKey: 'status', type: 'status', sortable: true },
    { key: 'priority', label: 'Prioridad', labelKey: 'priority', type: 'badge', sortable: true }
  ];

  const handleTicketClick = (ticket) => {
    navigate(`/tickets/${ticket.Id}`);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <SkeletonLoader count={3} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-surface-900">
            {t('overview', 'Resumen General')}
          </h1>
          <p className="text-surface-600 mt-1">
            {t('dashboardSubtitle', 'Monitorea tu negocio y actividad reciente')}
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            icon="RefreshCw"
            onClick={loadDashboardData}
          >
            {t('refresh', 'Actualizar')}
          </Button>
          <Button icon="FileBarChart">
            {t('viewReports', 'Ver Reportes')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title={t('activeClients', 'Clientes Activos')}
            value={stats.activeClients}
            icon="Users"
            color="primary"
            trend="up"
            trendValue="+12%"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title={t('expiringServices', 'Servicios por Vencer')}
            value={stats.expiringServices}
            icon="Clock"
            color="warning"
            trend="neutral"
            trendValue={t('next30Days', 'Próximos 30 días')}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title={t('openTickets', 'Tickets Abiertos')}
            value={stats.openTickets}
            icon="Headphones"
            color="info"
            trend="down"
            trendValue="-3%"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title={t('monthlyRevenue', 'Ingresos Mensuales')}
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon="DollarSign"
            color="success"
            trend="up"
            trendValue="+8%"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-surface-900">
                {t('recentActivity', 'Actividad Reciente')}
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/tickets')}
              >
                {t('viewAll', 'Ver Todo')}
              </Button>
            </div>

            <DataTable
              data={recentActivity}
              columns={activityColumns}
              onRowClick={handleTicketClick}
            />
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h2 className="text-xl font-heading font-semibold text-surface-900 mb-6">
              {t('quickActions', 'Acciones Rápidas')}
            </h2>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="UserPlus"
                onClick={() => navigate('/clients')}
              >
                {t('addClient', 'Agregar Cliente')}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Package"
                onClick={() => navigate('/services')}
              >
                {t('createService', 'Crear Servicio')}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="MessageCircle"
                onClick={() => navigate('/tickets')}
              >
                {t('viewTickets', 'Ver Tickets')}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Globe"
                onClick={() => navigate('/portal')}
              >
                {t('clientPortal', 'Portal Cliente')}
              </Button>
            </div>

            {/* System Status */}
            <div className="mt-8 pt-6 border-t border-surface-200">
              <h3 className="font-medium text-surface-900 mb-3">
                {t('systemStatus', 'Estado del Sistema')}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">
                    {t('allServices', 'Todos los servicios')}
                  </span>
                  <Badge variant="success">Operativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">
                    {t('backupSystem', 'Sistema de respaldo')}
                  </span>
                  <Badge variant="success">Activo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">
                    {t('monitoring', 'Monitoreo')}
                  </span>
                  <Badge variant="success">Normal</Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;