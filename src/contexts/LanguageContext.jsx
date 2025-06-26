import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  es: {
    // Navigation
    'dashboard': 'Tablero',
    'clients': 'Clientes',
    'services': 'Servicios',
    'support': 'Soporte',
    'clientPortal': 'Portal Cliente',
    'menu': 'Menú',
    
    // Dashboard
    'overview': 'Resumen General',
    'activeClients': 'Clientes Activos',
    'expiringServices': 'Servicios por Vencer',
    'openTickets': 'Tickets Abiertos',
    'monthlyRevenue': 'Ingresos Mensuales',
    'recentActivity': 'Actividad Reciente',
    'quickActions': 'Acciones Rápidas',
    'addClient': 'Agregar Cliente',
    'createService': 'Crear Servicio',
    'viewReports': 'Ver Reportes',
    
    // Clients
    'clientManagement': 'Gestión de Clientes',
    'addNewClient': 'Agregar Nuevo Cliente',
    'searchClients': 'Buscar clientes...',
    'companyName': 'Nombre de Empresa',
    'contactName': 'Nombre de Contacto',
    'email': 'Correo Electrónico',
    'phone': 'Teléfono',
    'address': 'Dirección',
    'status': 'Estado',
    'actions': 'Acciones',
    'active': 'Activo',
    'inactive': 'Inactivo',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'view': 'Ver',
    
    // Services
    'servicesCatalog': 'Catálogo de Servicios',
    'createNewService': 'Crear Nuevo Servicio',
    'serviceName': 'Nombre del Servicio',
    'description': 'Descripción',
    'category': 'Categoría',
    'price': 'Precio',
    'billingCycle': 'Ciclo de Facturación',
    'monthly': 'Mensual',
    'quarterly': 'Trimestral',
    'yearly': 'Anual',
    'webHosting': 'Hosting Web',
    'domainManagement': 'Gestión de Dominios',
    'wordPressManagement': 'Gestión WordPress',
    'emailHosting': 'Hosting de Email',
    'seoMarketing': 'SEO y Marketing',
    
    // Tickets
    'supportTickets': 'Tickets de Soporte',
    'createTicket': 'Crear Ticket',
    'ticketSubject': 'Asunto del Ticket',
    'priority': 'Prioridad',
    'open': 'Abierto',
    'inProgress': 'En Progreso',
    'resolved': 'Resuelto',
    'closed': 'Cerrado',
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta',
    'urgent': 'Urgente',
    
    // Common
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'confirm': 'Confirmar',
    'loading': 'Cargando...',
    'noDataFound': 'No se encontraron datos',
    'error': 'Error',
    'success': 'Éxito',
    'warning': 'Advertencia',
    'info': 'Información',
    'createdAt': 'Creado en',
    'updatedAt': 'Actualizado en',
    'notes': 'Notas',
    'customFields': 'Campos Personalizados',
    'required': 'Requerido',
    'optional': 'Opcional',
    'search': 'Buscar',
    'filter': 'Filtrar',
    'sort': 'Ordenar',
    'export': 'Exportar',
    'import': 'Importar',
    'refresh': 'Actualizar',
    'close': 'Cerrar'
  },
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'clients': 'Clients',
    'services': 'Services',
    'support': 'Support',
    'clientPortal': 'Client Portal',
    'menu': 'Menu',
    
    // Dashboard
    'overview': 'Overview',
    'activeClients': 'Active Clients',
    'expiringServices': 'Expiring Services',
    'openTickets': 'Open Tickets',
    'monthlyRevenue': 'Monthly Revenue',
    'recentActivity': 'Recent Activity',
    'quickActions': 'Quick Actions',
    'addClient': 'Add Client',
    'createService': 'Create Service',
    'viewReports': 'View Reports',
    
    // Clients
    'clientManagement': 'Client Management',
'addNewClient': 'Add New Client',
    'searchClients': 'Search clients...',
    'companyName': 'Company Name',
    'contactName': 'Contact Name',
    'email': 'Email',
    'phone': 'Phone',
    'address': 'Address',
    'status': 'Status',
    'actions': 'Actions',
    'active': 'Active',
    'inactive': 'Inactive',
    'edit': 'Edit',
    'delete': 'Delete',
    'view': 'View',
    'createClient': 'Create Client',
    'updateClient': 'Update Client',
    'editClient': 'Edit Client',
    'clientCreated': 'Client created successfully',
    'clientUpdated': 'Client updated successfully',
    'errorSavingClient': 'Error saving client',
    'updateClientInfo': 'Update client information',
    'createNewClientAccount': 'Create a new client account',
    'addNotes': 'Add additional notes...',
    // Services
    'servicesCatalog': 'Services Catalog',
    'createNewService': 'Create New Service',
    'serviceName': 'Service Name',
    'description': 'Description',
    'category': 'Category',
    'price': 'Price',
    'billingCycle': 'Billing Cycle',
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'yearly': 'Yearly',
    'webHosting': 'Web Hosting',
    'domainManagement': 'Domain Management',
    'wordPressManagement': 'WordPress Management',
    'emailHosting': 'Email Hosting',
    'seoMarketing': 'SEO & Marketing',
    
    // Tickets
    'supportTickets': 'Support Tickets',
    'createTicket': 'Create Ticket',
    'ticketSubject': 'Ticket Subject',
    'priority': 'Priority',
    'open': 'Open',
    'inProgress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent',
    
    // Common
    'save': 'Save',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'loading': 'Loading...',
    'noDataFound': 'No data found',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Information',
    'createdAt': 'Created at',
    'updatedAt': 'Updated at',
    'notes': 'Notes',
    'customFields': 'Custom Fields',
    'required': 'Required',
    'optional': 'Optional',
    'search': 'Search',
    'filter': 'Filter',
    'sort': 'Sort',
    'export': 'Export',
    'import': 'Import',
    'refresh': 'Refresh',
    'close': 'Close'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (key, fallback = key) => {
    return translations[language]?.[key] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};