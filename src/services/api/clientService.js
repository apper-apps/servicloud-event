import clientsData from '@/services/mockData/clients.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ClientService {
  constructor() {
    this.clients = [...clientsData];
  }

  async getAll() {
    await delay(300);
    return [...this.clients];
  }

  async getById(id) {
    await delay(200);
    const client = this.clients.find(c => c.Id === parseInt(id, 10));
    if (!client) {
      throw new Error('Cliente no encontrado');
    }
    return { ...client };
  }

async create(clientData) {
    await delay(400);
    
    // Validate required fields
    if (!clientData.companyName || !clientData.email) {
      throw new Error('Nombre de empresa y email son requeridos');
    }
    
    // Check for duplicate email
    const existingClient = this.clients.find(c => c.email.toLowerCase() === clientData.email.toLowerCase());
    if (existingClient) {
      throw new Error('Ya existe un cliente con este email');
    }
    
    const newClient = {
      ...clientData,
      Id: this.clients.length > 0 ? Math.max(...this.clients.map(c => c.Id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: clientData.status || 'active',
      customFields: clientData.customFields || {},
      notes: clientData.notes || ''
    };
    
    this.clients.push(newClient);
    return { ...newClient };
  }

  async update(id, clientData) {
    await delay(350);
    const index = this.clients.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    
    const updatedClient = {
      ...this.clients[index],
      ...clientData,
      Id: parseInt(id, 10), // Prevent Id modification
      updatedAt: new Date().toISOString()
    };
    
    this.clients[index] = updatedClient;
    return { ...updatedClient };
  }

  async delete(id) {
    await delay(250);
    const index = this.clients.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    
    const deletedClient = this.clients.splice(index, 1)[0];
    return { ...deletedClient };
  }

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return this.clients.filter(client =>
      client.companyName.toLowerCase().includes(lowercaseQuery) ||
      client.contactName.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export default new ClientService();