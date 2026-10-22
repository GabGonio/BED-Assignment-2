import express, { Express } from "express";
import morgan from "morgan";
import ticketRoutes from "./api/v1/routes/ticketRoutes";

const app: Express = express();

app.use(morgan("combined"));

app.use(express.json());
app.use("/api/v1/tickets", ticketRoutes);

// Interface for health check response
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});

export default app;