/**
 * @file src/server.ts
 * @description Server startup file for development. Production platforms will handle this separately.
 */

import app from "./app";
import config from "./config";

const PORT = config.port;

// Start the Express server and listen on the specified port.
const server = app.listen(PORT, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    console.log(`Access API at: http://localhost:${PORT}/api/v1`);
});

// Handle unhandled promise rejections globally.
process.on("unhandledRejection", (err: Error) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions globally.
process.on("uncaughtException", (err: Error) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(err.name, err.message);
    process.exit(1);
});
