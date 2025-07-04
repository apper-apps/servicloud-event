import React from "react";
import ServiceCatalog from "@/components/pages/ServiceCatalog";
import TicketList from "@/components/pages/TicketList";
import Dashboard from "@/components/pages/Dashboard";
import TicketDetail from "@/components/pages/TicketDetail";
import ClientDetail from "@/components/pages/ClientDetail";
import ClientList from "@/components/pages/ClientList";
import ClientPortal from "@/components/pages/ClientPortal";
import ClientForm from "@/components/pages/ClientForm";

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    labelEs: 'Tablero',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  clients: {
    id: 'clients',
    label: 'Clients',
    labelEs: 'Clientes',
    path: '/clients',
    icon: 'Users',
    component: ClientList
  },
  clientDetail: {
    id: 'clientDetail',
    label: 'Client Detail',
    labelEs: 'Detalle Cliente',
    path: '/clients/:id',
    icon: 'User',
    component: ClientDetail,
    hidden: true
  },
  services: {
    id: 'services',
    label: 'Services',
    labelEs: 'Servicios',
    path: '/services',
    icon: 'Package',
    component: ServiceCatalog
  },
  tickets: {
    id: 'tickets',
    label: 'Support',
    labelEs: 'Soporte',
    path: '/tickets',
    icon: 'Headphones',
    component: TicketList
  },
  ticketDetail: {
    id: 'ticketDetail',
    label: 'Ticket Detail',
    labelEs: 'Detalle Ticket',
    path: '/tickets/:id',
    icon: 'MessageCircle',
    component: TicketDetail,
    hidden: true
  },
clientPortal: {
    id: 'clientPortal',
    label: 'Client Portal',
    labelEs: 'Portal Cliente',
    path: '/portal',
    icon: 'Globe',
    component: ClientPortal
  },
  clientNew: {
    id: 'clientNew',
    label: 'New Client',
    labelEs: 'Nuevo Cliente',
    path: '/clients/new',
    icon: 'UserPlus',
    component: ClientForm,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;