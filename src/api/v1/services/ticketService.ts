
import type { Ticket } from "../models/ticketModel";
import { tickets } from "../../../data/ticketData";


export const getAllTickets = async (): Promise<Ticket[]> => {
    return structuredClone(tickets);
};


export const getTicketById = async (id:number): Promise<Ticket | null> => {
    const ticket = tickets.find(t => t.id === id);
    return ticket ? structuredClone(ticket) : null;
}


export const getTicketAge = (ticket: Ticket): number => {
    const currentDate = Date.now();
    const createdDate = ticket.createdAt.getTime();

    const age = currentDate - createdDate;

    return Math.floor(age / (1000 * 60 * 60 * 24));
};
