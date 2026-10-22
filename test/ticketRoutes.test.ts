import request from "supertest";
import app from "../src/app";

describe("Ticket Routes", () => {
    describe("GET /api/v1/tickets", () => {
        it("should retrieve all tickets", async () => {
            const response = await request(app).get("/api/v1/tickets");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Tickets retrieved");
            expect(response.body.count).toBe(7);
        });
    });

    describe("POST /api/v1/tickets", () => {
        it("should reject a ticket with a missing title", async () => {
            const response = await request(app)
                .post("/api/v1/tickets")
                .send({
                    description: "Printer is not working",
                    priority: "medium"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Missing required field: title");
        });

        it("should create a new ticket", async () => {
            const response = await request(app)
                .post("/api/v1/tickets")
                .send({
                    title: "Printer not working",
                    description: "Office printer is not responding",
                    priority: "medium"
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Ticket created successfully");
            expect(response.body.data.title).toBe("Printer not working");
            expect(response.body.data.status).toBe("open");

            await request(app).delete(`/api/v1/tickets/${response.body.data.id}`);
        });
    });

    describe("GET /api/v1/tickets/:id", () => {
        it("should retrieve a ticket by ID", async () => {
            const response = await request(app).get("/api/v1/tickets/1");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Ticket retrieved");
            expect(response.body.data.id).toBe(1);
            expect(response.body.data.title).toBe("Update footer copyright year");
        });
    });
    
    describe("GET /api/v1/tickets/:id/urgency", () => {
        it("should return minimal urgency for a resolved ticket", async () => {
            const response = await request(app).get("/api/v1/tickets/7/urgency");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Ticket urgency calculated");
            expect(response.body.data.urgencyScore).toBe(0);
            expect(response.body.data.urgencyLevel).toBe("Minimal. Ticket resolved.");
        });
    });
    
    describe("PUT /api/v1/tickets/:id", () => {
        it("should update a ticket's status", async () => {
            const response = await request(app)
                .put("/api/v1/tickets/1")
                .send({
                    status: "in-progress"
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Ticket updated successfully");
            expect(response.body.data.status).toBe("in-progress");
            expect(response.body.data.title).toBe("Update footer copyright year");

            await request(app)
                .put("/api/v1/tickets/1")
                .send({
                    status: "open"
                });
        });
     
        it("should reject an invalid ticket status", async () => {
            const response = await request(app)
                .put("/api/v1/tickets/1")
                .send({
                    status: "pending"
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid status. Must be one of: open, in-progress, resolved");
        });

    });
    
    describe("DELETE /api/v1/tickets/:id", () => {
        it("should delete an existing ticket", async () => {
            const created = await request(app)
                .post("/api/v1/tickets")
                .send({
                    title: "Temporary ticket",
                    description: "Ticket for deletion test",
                    priority: "low"
                });

            const ticketId = created.body.data.id;

            const response = await request(app)
                .delete(`/api/v1/tickets/${ticketId}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Ticket deleted successfully");

            const check = await request(app)
                .get(`/api/v1/tickets/${ticketId}`);

            expect(check.status).toBe(404);
            expect(check.body.message).toBe("Ticket not found");
        });
    });
});
