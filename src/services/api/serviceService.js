import servicesData from '@/services/mockData/services.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ServiceService {
  constructor() {
    this.services = [...servicesData];
  }

  async getAll() {
    await delay(250);
    return [...this.services];
  }

  async getById(id) {
    await delay(200);
    const service = this.services.find(s => s.Id === parseInt(id, 10));
    if (!service) {
      throw new Error('Servicio no encontrado');
    }
    return { ...service };
  }

  async create(serviceData) {
    await delay(400);
    const newService = {
      ...serviceData,
      Id: Math.max(...this.services.map(s => s.Id)) + 1,
      isActive: true
    };
    this.services.push(newService);
    return { ...newService };
  }

  async update(id, serviceData) {
    await delay(350);
    const index = this.services.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Servicio no encontrado');
    }
    
    const updatedService = {
      ...this.services[index],
      ...serviceData,
      Id: parseInt(id, 10) // Prevent Id modification
    };
    
    this.services[index] = updatedService;
    return { ...updatedService };
  }

  async delete(id) {
    await delay(250);
    const index = this.services.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Servicio no encontrado');
    }
    
    const deletedService = this.services.splice(index, 1)[0];
    return { ...deletedService };
  }

  async getByCategory(category) {
    await delay(200);
    return this.services.filter(service => 
      service.category === category && service.isActive
    );
  }
}

export default new ServiceService();