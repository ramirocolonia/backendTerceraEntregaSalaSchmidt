import { ticketModel } from "../models/ticket.model.js";

class TicketMongo {

  async createTicket(ticket) {
    const result = await ticketModel.create(ticket)
    return result;
  }

}

export default TicketMongo;