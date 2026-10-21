
import type { Ticket } from "../models/ticketModel";
import { tickets } from "../../../data/ticketData";

export const getAllTickets = async (): Promise<Ticket[]> => {
    return structuredClone(tickets);
};
