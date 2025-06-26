import ticketMessagesData from '@/services/mockData/ticketMessages.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TicketMessageService {
  constructor() {
    this.ticketMessages = [...ticketMessagesData];
  }

  async getAll() {
    await delay(250);
    return [...this.ticketMessages];
  }

  async getById(id) {
    await delay(200);
    const message = this.ticketMessages.find(tm => tm.Id === parseInt(id, 10));
    if (!message) {
      throw new Error('Mensaje no encontrado');
    }
    return { ...message };
  }

  async getByTicketId(ticketId) {
    await delay(200);
    return this.ticketMessages
      .filter(tm => tm.ticketId === parseInt(ticketId, 10))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async create(messageData) {
    await delay(300);
    const newMessage = {
      ...messageData,
      Id: Math.max(...this.ticketMessages.map(tm => tm.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.ticketMessages.push(newMessage);
    return { ...newMessage };
  }

  async delete(id) {
    await delay(200);
    const index = this.ticketMessages.findIndex(tm => tm.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Mensaje no encontrado');
    }
    
    const deletedMessage = this.ticketMessages.splice(index, 1)[0];
    return { ...deletedMessage };
  }
}

export default new TicketMessageService();