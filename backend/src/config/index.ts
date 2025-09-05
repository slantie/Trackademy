/**
 * @file src/config/index.ts
 * @description Centralized configuration file for environment variables.
 */

import dotenv from "dotenv";
import path from "path";

// Loads environment variables from the .env file.
dotenv.config({ path: path.resolve(__dirname, "../../../.env"), quiet: true });

// Defines the AppConfig interface for type safety.
interface AppConfig {
  port: number;
  nodeEnv: "development" | "production" | "test";
  databaseUrl?: string;
  jwtSecret: string;
  jwtExpiresIn: string | number;
  emailHost?: string;
  emailPort?: number;
  emailUser?: string;
  emailFrom?: string;
  emailPass?: string;
  emailFromName?: string;
  serviceUrl?: string;
  serviceApiKey?: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

// Defines the application configuration object.
const config: AppConfig = {
  port: parseInt(process.env.PORT || "8000", 10),
  nodeEnv: (process.env.NODE_ENV as AppConfig["nodeEnv"]) || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT
    ? parseInt(process.env.EMAIL_PORT, 10)
    : undefined,
  emailUser: process.env.EMAIL_USER,
  emailFrom: process.env.EMAIL_FROM,
  emailPass: process.env.EMAIL_PASS,
  emailFromName: process.env.EMAIL_FROM_NAME,
  serviceUrl: process.env.SERVICE_URL,
  serviceApiKey: (process.env.SERVICE_API_KEY as string) || undefined,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
};

// Performs basic validation for critical environment variables.
if (!config.databaseUrl) {
  console.error("FATAL ERROR: DATABASE_URL is not defined in .env");
  process.exit(1);
}
if (!config.jwtSecret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env");
  process.exit(1);
}

export default config;
