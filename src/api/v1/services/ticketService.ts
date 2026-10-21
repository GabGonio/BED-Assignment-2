
import type { Ticket } from "../models/ticketModel";
import { tickets } from "../../../data/ticketData";


export const getAllTickets = async (): Promise<Ticket[]> => {
    return structuredClone(tickets);
};


export const getTicketById = async (id:number): Promise<Ticket | null> => {
    const ticket = tickets.find(t => t.id === id);
    return ticket ? structuredClone(ticket) : null;
};


export const getTicketAge = (ticket: Ticket): number => {
    const currentDate = Date.now();
    const createdDate = ticket.createdAt.getTime();

    const age = currentDate - createdDate;

    return Math.floor(age / (1000 * 60 * 60 * 24));
};


export const calculateUrgencyScore = (ticket: Ticket): number => {
    if (ticket.status === "resolved") {
        return 0;
    }

    let baseScore = 0;

    switch (ticket.priority) {
        case "low":
            baseScore = 10;
            break;
        case "medium":
            baseScore = 20;
            break;
        case "high":
            baseScore = 30;
            break;
        case "critical":
            baseScore = 50;
            break;
    }

    return baseScore + (getTicketAge(ticket) * 5);
};


export const getUrgencyLevel = (ticket: Ticket): string => {
    if (ticket.status === "resolved") {
        return "Minimal. Ticket resolved.";
    }

    const score = calculateUrgencyScore(ticket);

    if (score <= 25) {
        return "Low urgency. Address when capacity allows.";
    } else if (score <= 50) {
        return "Moderate. Schedule for attention.";
    } else if (score <= 75) {
        return "High urgency. Prioritize resolution.";
    } else {
        return "Critical. Immediate attention required.";
    }
};
