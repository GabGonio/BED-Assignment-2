
import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketService from "../services/ticketService";
import type { Ticket } from "../models/ticketModel";

export const getAllTickets = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const tickets: Ticket[] = await ticketService.getAllTickets();

        res.status(HTTP_STATUS.OK).json({
            message: "Tickets retrieved",
            count: tickets.length,
            data: tickets
        });
    } catch (error) {
        next(error);
    }
};

export const getTicketUrgency = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const ticket = await ticketService.getTicketById(id);

        if (!ticket) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Ticket not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Ticket urgency calculated",
            data: {
                id: ticket.id,
                title: ticket.title,
                priority: ticket.priority,
                status: ticket.status,
                createdAt: ticket.createdAt,
                ticketAge: ticketService.getTicketAge(ticket),
                urgencyScore: ticketService.calculateUrgencyScore(ticket),
                urgencyLevel: ticketService.getUrgencyLevel(ticket)
            }
        });
    } catch (error) {
        next(error);
    }
};
