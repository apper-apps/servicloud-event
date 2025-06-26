import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StatusDot from '@/components/atoms/StatusDot';
import Input from '@/components/atoms/Input';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { useLanguage } from '@/hooks/useLanguage';
import ticketService from '@/services/api/ticketService';
import ticketMessageService from '@/services/api/ticketMessageService';
import clientService from '@/services/api/clientService';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [ticket, setTicket] = useState(null);
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [ticketData, messagesData] = await Promise.all([
        ticketService.getById(id),
        ticketMessageService.getByTicketId(id)
      ]);

      setTicket(ticketData);
      setMessages(messagesData);

      // Load client data
      const clientData = await clientService.getById(ticketData.clientId);
      setClient(clientData);
    } catch (err) {
      setError(err.message || 'Error al cargar el ticket');
      toast.error('Error al cargar el ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTicket = await ticketService.update(id, { status: newStatus });
      setTicket(updatedTicket);
      toast.success(t('statusUpdated', 'Estado actualizado exitosamente'));
    } catch (err) {
      toast.error(t('errorUpdatingStatus', 'Error al actualizar el estado'));
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const updatedTicket = await ticketService.update(id, { priority: newPriority });
      setTicket(updatedTicket);
      toast.success(t('priorityUpdated', 'Prioridad actualizada exitosamente'));
    } catch (err) {
      toast.error(t('errorUpdatingPriority', 'Error al actualizar la prioridad'));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const messageData = {
        ticketId: parseInt(id, 10),
        message: newMessage,
        isInternal: false,
        authorType: 'support'
      };

      const newMessageObj = await ticketMessageService.create(messageData);
      setMessages(prev => [...prev, newMessageObj]);
      setNewMessage('');
      toast.success(t('messageSent', 'Mensaje enviado exitosamente'));
    } catch (err) {
      toast.error(t('errorSendingMessage', 'Error al enviar el mensaje'));
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusOptions = () => [
    { value: 'open', label: t('open', 'Abierto'), color: 'info' },
    { value: 'inProgress', label: t('inProgress', 'En Progreso'), color: 'warning' },
    { value: 'resolved', label: t('resolved', 'Resuelto'), color: 'success' },
    { value: 'closed', label: t('closed', 'Cerrado'), color: 'default' }
  ];

  const getPriorityOptions = () => [
    { value: 'low', label: t('low', 'Baja'), color: 'default' },
    { value: 'medium', label: t('medium', 'Media'), color: 'info' },
    { value: 'high', label: t('high', 'Alta'), color: 'warning' },
    { value: 'urgent', label: t('urgent', 'Urgente'), color: 'danger' }
  ];

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
        <ErrorState message={error} onRetry={loadTicketData} />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <ErrorState message="Ticket no encontrado" />
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
            onClick={() => navigate('/tickets')}
          >
            {t('back', 'Volver')}
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-surface-900">
              Ticket #{ticket.Id}
            </h1>
            <p className="text-surface-600 mt-1">{ticket.subject}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Mail">
            {t('notifyClient', 'Notificar Cliente')}
          </Button>
          <Button variant="outline" icon="Printer">
            {t('print', 'Imprimir')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-surface-900 mb-2">
                  {ticket.subject}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-surface-600">
                  <span>
                    {t('createdOn', 'Creado el')} {new Date(ticket.createdAt).toLocaleDateString('es-MX')}
                  </span>
                  <span>
                    {t('lastUpdate', 'Última actualización')} {new Date(ticket.updatedAt).toLocaleDateString('es-MX')}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <StatusDot status={ticket.status} />
                <Badge variant={getStatusOptions().find(s => s.value === ticket.status)?.color || 'default'}>
                  {t(ticket.status, ticket.status)}
                </Badge>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-surface-700">{ticket.description}</p>
            </div>
          </Card>

          {/* Messages Thread */}
          <Card>
            <h3 className="text-lg font-semibold text-surface-900 mb-4">
              {t('conversation', 'Conversación')}
            </h3>

            <div className="space-y-4 mb-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.authorType === 'support' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-xs lg:max-w-md px-4 py-3 rounded-lg
                    ${message.authorType === 'support' 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-100 text-surface-900'
                    }
                    ${message.isInternal ? 'border-l-4 border-warning' : ''}
                  `}>
                    <p className="text-sm">{message.message}</p>
                    <div className={`
                      flex items-center justify-between mt-2 text-xs
                      ${message.authorType === 'support' ? 'text-white/80' : 'text-surface-500'}
                    `}>
                      <span>
                        {message.authorType === 'support' ? t('support', 'Soporte') : client?.contactName}
                      </span>
                      <span>
                        {new Date(message.createdAt).toLocaleTimeString('es-MX', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {message.isInternal && (
                      <div className="mt-2 text-xs font-medium">
                        <ApperIcon name="Lock" size={12} className="inline mr-1" />
                        {t('internalNote', 'Nota interna')}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendMessage} className="border-t border-surface-200 pt-4">
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Input
                    placeholder={t('typeMessage', 'Escribir mensaje...')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sendingMessage}
                  />
                </div>
                <Button
                  type="submit"
                  loading={sendingMessage}
                  disabled={!newMessage.trim()}
                  icon="Send"
                >
                  {t('send', 'Enviar')}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          {client && (
            <Card>
              <h3 className="font-semibold text-surface-900 mb-4">
                {t('clientInformation', 'Información del Cliente')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <ApperIcon name="Building" size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900">{client.companyName}</p>
                    <p className="text-sm text-surface-600">{client.contactName}</p>
                  </div>
                </div>
                <div className="text-sm text-surface-600">
                  <p>{client.email}</p>
                  <p>{client.phone}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate(`/clients/${client.Id}`)}
                >
                  {t('viewClient', 'Ver Cliente')}
                </Button>
              </div>
            </Card>
          )}

          {/* Ticket Properties */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4">
              {t('ticketProperties', 'Propiedades del Ticket')}
            </h3>
            
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  {t('status', 'Estado')}
                </label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {getStatusOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  {t('priority', 'Prioridad')}
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {getPriorityOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-surface-200">
                <div className="text-sm text-surface-600 space-y-2">
                  <div className="flex justify-between">
                    <span>{t('ticketId', 'ID del Ticket')}:</span>
                    <span className="font-medium">#{ticket.Id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('created', 'Creado')}:</span>
                    <span className="font-medium">
                      {new Date(ticket.createdAt).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('lastUpdate', 'Última actualización')}:</span>
                    <span className="font-medium">
                      {new Date(ticket.updatedAt).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4">
              {t('quickActions', 'Acciones Rápidas')}
            </h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" icon="Clock">
                {t('addTimeEntry', 'Agregar Tiempo')}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" icon="Paperclip">
                {t('attachFile', 'Adjuntar Archivo')}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" icon="Users">
                {t('assignToTeam', 'Asignar a Equipo')}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" icon="Copy">
                {t('duplicateTicket', 'Duplicar Ticket')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;