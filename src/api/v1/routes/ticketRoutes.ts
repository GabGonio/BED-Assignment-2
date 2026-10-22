
import express, { Router } from "express";
import * as ticketController from "../controllers/ticketController";

const router: Router = express.Router();

router.get("/", ticketController.getAllTickets);
router.get("/:id/urgency", ticketController.getTicketUrgency);
router.post("/", ticketController.createTicket);
router.put("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

export default router;
