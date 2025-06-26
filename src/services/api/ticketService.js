import ticketsData from '@/services/mockData/tickets.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TicketService {
  constructor() {
    this.tickets = [...ticketsData];
  }

  async getAll() {
    await delay(300);
    return [...this.tickets];
  }

  async getById(id) {
    await delay(200);
    const ticket = this.tickets.find(t => t.Id === parseInt(id, 10));
    if (!ticket) {
      throw new Error('Ticket no encontrado');
    }
    return { ...ticket };
  }

  async getByClientId(clientId) {
    await delay(200);
    return this.tickets.filter(t => t.clientId === parseInt(clientId, 10));
  }

  async create(ticketData) {
    await delay(400);
    const newTicket = {
      ...ticketData,
      Id: Math.max(...this.tickets.map(t => t.Id)) + 1,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tickets.push(newTicket);
    return { ...newTicket };
  }

  async update(id, ticketData) {
    await delay(350);
    const index = this.tickets.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Ticket no encontrado');
    }
    
    const updatedTicket = {
      ...this.tickets[index],
      ...ticketData,
      Id: parseInt(id, 10), // Prevent Id modification
      updatedAt: new Date().toISOString()
    };
    
    this.tickets[index] = updatedTicket;
    return { ...updatedTicket };
  }

  async delete(id) {
    await delay(250);
    const index = this.tickets.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Ticket no encontrado');
    }
    
    const deletedTicket = this.tickets.splice(index, 1)[0];
    return { ...deletedTicket };
  }

  async getByStatus(status) {
    await delay(200);
    return this.tickets.filter(ticket => ticket.status === status);
  }

  async getOpenTickets() {
    await delay(200);
    return this.tickets.filter(ticket => 
      ticket.status === 'open' || ticket.status === 'inProgress'
    );
  }
}

export default new TicketService();