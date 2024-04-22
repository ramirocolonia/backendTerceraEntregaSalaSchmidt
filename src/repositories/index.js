import CartMongo from "../dao/mongo/cart.mongo.js";
import ChatMongo from "../dao/mongo/chat.mongo.js";
import ProductMongo from "../dao/mongo/product.mongo.js";
import TicketMongo from "../dao/mongo/ticket.mongo.js";
import UserMongo from "../dao/mongo/user.mongo.js";
import CartRepository from "./cart.repository.js";
import ChatRepository from "./chat.repository.js";
import ProductRepository from "./product.repository.js";
import TicketRepository from "./ticket.repository.js";
import UserRepository from "./user.repository.js";

export const userService = new UserRepository(new UserMongo());
export const productService = new ProductRepository(new ProductMongo());
export const chatService = new ChatRepository(new ChatMongo());
export const cartService = new CartRepository(new CartMongo());
export const ticketService = new TicketRepository(new TicketMongo());