"use strict";
/**
 * @file src/index.ts
 * @description Main entry point of the application with Express server setup
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Import the cors middleware
const v1_1 = __importDefault(require("./api/v1"));
const app = (0, express_1.default)();
// --- CORS Configuration ---
// Define the origins that are allowed to make requests to this server.
const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or server-to-server requests)
        if (!origin)
            return callback(null, true);
        // If the origin of the request is in our list of allowed origins, allow it.
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            // Otherwise, block the request.
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // This allows cookies to be sent with requests.
    optionsSuccessStatus: 200, // For legacy browser support.
};
// --- Middleware Setup ---
// Enable CORS with the specified options. This should come before your API routes.
app.use((0, cors_1.default)(corsOptions));
// Standard middleware for parsing JSON and URL-encoded request bodies.
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// --- API Routes ---
app.use("/api/v1", v1_1.default);
// --- Health Check and Server Startup ---
app.get("/", (req, res) => {
    const message = process_1.env.NODE_ENV === "production"
        ? "NodeJS Backend running in production!"
        : "NodeJS Backend running!";
    res.json({ message, status: "healthy" });
});
if (process_1.env.NODE_ENV !== "production") {
    const port = process_1.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
else {
    // In a production environment (like on Render), the platform handles starting the server.
    console.log("NodeJS Backend running in production!");
}
exports.default = app; // Also export the app as default for consistency
