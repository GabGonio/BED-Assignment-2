import { calculateUrgencyScore, getUrgencyLevel } from "../src/api/v1/services/ticketService";
import type { Ticket } from "../src/api/v1/models/ticketModel";

describe("Ticket Urgency Calculation", () => {
    it("should calculate the urgency score for a low-priority ticket", () => {
        const ticket: Ticket = {
            id: 1,
            title: "Update footer copyright year",
            description: "Footer still shows 2024",
            priority: "low",
            status: "open",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        };

        const score = calculateUrgencyScore(ticket);

        expect(score).toBe(25);
    });
    
    it("should calculate moderate urgency for a medium-priority ticket", () => {
        const ticket: Ticket = {
            id: 3,
            title: "Dashboard loading slowly",
            description: "Dashboard takes 10+ seconds to load",
            priority: "medium",
            status: "open",
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        };

        const score = calculateUrgencyScore(ticket);
        const level = getUrgencyLevel(ticket);

        expect(score).toBe(50);
        expect(level).toBe("Moderate. Schedule for attention."); 
    });
    
    it("should calculate critical urgency for a critical-priority ticket", () => {
        const ticket: Ticket = {
            id: 6,
            title: "Login page not loading",
            description: "Users report blank screen on login",
            priority: "critical",
            status: "open",
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        };

        const score = calculateUrgencyScore(ticket);
        const level = getUrgencyLevel(ticket);

        expect(score).toBe(80);
        expect(level).toBe("Critical. Immediate attention required.");
    });
    
    it("should return minimal urgency for a resolved ticket", () => {
        const ticket: Ticket = {
            id: 7,
            title: "Dark mode toggle broken",
            description: "Dark mode doesn't persist after refresh",
            priority: "medium",
            status: "resolved",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        };

        const score = calculateUrgencyScore(ticket);
        const level = getUrgencyLevel(ticket);

        expect(score).toBe(0);
        expect(level).toBe("Minimal. Ticket resolved.");
    });


});
