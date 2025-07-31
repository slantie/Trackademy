/**
 * @file src/app.ts
 * @description Configures and exports the Express application
 */

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiRoutesv1 from "./routes/api/v1";
import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();

// Apply security middlewares.
app.use(helmet());

// Configure Cross-Origin Resource Sharing (CORS).
app.use(
    cors({
        origin:
            process.env.NODE_ENV === "production"
                ? process.env.FRONTEND_PROD_URL
                : process.env.FRONTEND_DEV_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

// Configure body parsers for JSON and URL-encoded data.
app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));

// Enable request logging in development environment.
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Configure CORS options.
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (origin.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

// --- Middleware Setup ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use("/api/v1", apiRoutesv1);
// app.use('/api/v1/service', serviceRouter);

// --- Root Route ---
app.get("/", (req, res) => {
    const message =
        process.env.NODE_ENV === "production"
            ? "NodeJS Backend running in production!"
            : "NodeJS Backend running!";
    res.json({ message, status: "running" });
});

// Define a health check endpoint.
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Backend API's running at /api/v1" });
});

export default app;
