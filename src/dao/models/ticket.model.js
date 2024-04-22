import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  code: {type: String, required: true, index: true},
  purchase_datetime: {type: Date, default: Date.now},
  amount: {type: Number, required: true},
  purchaser: {type: String, required: true}
});

export const ticketModel = mongoose.model(ticketsCollection, ticketSchema);