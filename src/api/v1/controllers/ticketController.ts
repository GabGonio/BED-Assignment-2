
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

export const getTicketById = async (
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
            message: "Ticket retrieved",
            data: ticket
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



export const createTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.body?.title) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: title"
            });
        } else if (!req.body?.description) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: description"
            });
        } else if (!["low", "medium", "high", "critical"].includes(req.body?.priority)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid priority. Must be one of: critical, high, medium, low"
            });
        } else {
            const { title, description, priority } = req.body;

            const ticketData = { title, description, priority };

            const newTicket: Ticket = await ticketService.createTicket(ticketData);

            res.status(HTTP_STATUS.CREATED).json({
                message: "Ticket created successfully",
                data: newTicket
            });
        }
    } catch (error) {
        next(error);
    }
};



export const updateTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid ticket ID"
            });
            return;
        }

        const { title, description, priority, status } = req.body ?? {};

        if (priority !== undefined &&
            !["low", "medium", "high", "critical"].includes(priority)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid priority. Must be one of: critical, high, medium, low"
            });
            return;
        }


        if (status !== undefined && !["open", "in-progress", "resolved"].includes(status)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid status. Must be one of: open, in-progress, resolved"
            });
            return;
        }

        const updatedTicket = await ticketService.updateTicket(id, {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(priority !== undefined && { priority }),
            ...(status !== undefined && { status })
        });


        if (!updatedTicket) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Ticket not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Ticket updated successfully",
            data: updatedTicket
        });
    } catch (error) {
        next(error);
    }
};



export const deleteTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid ticket ID"
            });
            return;
        }

        const deleted = await ticketService.deleteTicket(id);

        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Ticket not found"
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Ticket deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};


