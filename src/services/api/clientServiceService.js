import clientServicesData from '@/services/mockData/clientServices.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ClientServiceService {
  constructor() {
    this.clientServices = [...clientServicesData];
  }

  async getAll() {
    await delay(250);
    return [...this.clientServices];
  }

  async getById(id) {
    await delay(200);
    const clientService = this.clientServices.find(cs => cs.Id === parseInt(id, 10));
    if (!clientService) {
      throw new Error('Servicio de cliente no encontrado');
    }
    return { ...clientService };
  }

  async getByClientId(clientId) {
    await delay(200);
    return this.clientServices.filter(cs => cs.clientId === parseInt(clientId, 10));
  }

  async create(clientServiceData) {
    await delay(400);
    const newClientService = {
      ...clientServiceData,
      Id: Math.max(...this.clientServices.map(cs => cs.Id)) + 1,
      status: 'active'
    };
    this.clientServices.push(newClientService);
    return { ...newClientService };
  }

  async update(id, clientServiceData) {
    await delay(350);
    const index = this.clientServices.findIndex(cs => cs.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Servicio de cliente no encontrado');
    }
    
    const updatedClientService = {
      ...this.clientServices[index],
      ...clientServiceData,
      Id: parseInt(id, 10) // Prevent Id modification
    };
    
    this.clientServices[index] = updatedClientService;
    return { ...updatedClientService };
  }

  async delete(id) {
    await delay(250);
    const index = this.clientServices.findIndex(cs => cs.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Servicio de cliente no encontrado');
    }
    
    const deletedClientService = this.clientServices.splice(index, 1)[0];
    return { ...deletedClientService };
  }

  async getExpiringServices(days = 30) {
    await delay(200);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.clientServices.filter(cs => {
      const endDate = new Date(cs.endDate);
      return endDate <= futureDate && cs.status === 'active';
    });
  }
}

export default new ClientServiceService();