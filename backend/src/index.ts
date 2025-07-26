/**
 * @file src/index.ts
 * @description Main entry point of the application with Express server setup
 */

import { env } from 'process';
import express from 'express';
import cors from 'cors'; // Import the cors middleware
import apiRoutes from './api';

const app = express();

// --- CORS Configuration ---
// Define the origins that are allowed to make requests to this server.
const allowedOrigins = [
    'http://localhost:3000'
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or server-to-server requests)
        if (!origin) return callback(null, true);

        // If the origin of the request is in our list of allowed origins, allow it.
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Otherwise, block the request.
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // This allows cookies to be sent with requests.
    optionsSuccessStatus: 200 // For legacy browser support.
};

// --- Middleware Setup ---
// Enable CORS with the specified options. This should come before your API routes.
app.use(cors(corsOptions));

// Standard middleware for parsing JSON and URL-encoded request bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---
app.use('/api', apiRoutes);


// --- Health Check and Server Startup ---
app.get('/', (req, res) => {
    const message = env.NODE_ENV === 'production'
        ? 'NodeJS Backend running in production!'
        : 'NodeJS Backend running!';
    res.json({ message, status: 'healthy' });
});

if (env.NODE_ENV !== 'production') {
    const port = env.PORT || 4000;

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
} else {
    // In a production environment (like on Render), the platform handles starting the server.
    console.log('NodeJS Backend running in production!');
}
