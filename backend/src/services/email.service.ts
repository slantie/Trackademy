/**
 * @file src/services/email.service.ts
 * @description Service for handling all email sending operations.
 */

import nodemailer from "nodemailer";
import config from "../config"; // Assuming you have an env config file

interface MailOptions {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Configure the email transporter using environment variables
        this.transporter = nodemailer.createTransport({
            host: config.emailHost,
            port: Number(config.emailPort),
            secure: Number(config.emailPort) === 465, // true for 465, false for other ports
            auth: {
                user: config.emailUser,
                pass: config.emailPass,
            },
        });
    }

    /**
     * Sends an email.
     * @param mailOptions - The options for the email (to, subject, html).
     */
    private async sendMail(mailOptions: MailOptions): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: `"${config.emailFromName}" <${config.emailFrom}>`,
                ...mailOptions,
            });
        } catch (error) {
            console.error("Error sending email:", error);
            // In a real application, you might add more robust error handling or logging here
        }
    }

    /**
     * Sends a welcome email to a new user with their credentials.
     * @param email - The recipient's email address.
     * @param fullName - The full name of the user.
     * @param password - The temporary password for the user.
     */
    public async sendWelcomeEmail(
        email: string,
        fullName: string,
        password: string
    ): Promise<void> {
        const subject = "Welcome to Trackademy!";
        const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Trackademy, ${fullName}!</h2>
        <p>Your account has been successfully created. You can now log in to the portal using the following credentials:</p>
        <ul>
          <li><strong>Username:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>We recommend that you change your password after your first login.</p>
        <p>Thank you!</p>
        <p><strong>The Trackademy Team</strong></p>
      </div>
    `;

        await this.sendMail({ to: email, subject, html });
    }
}

export const emailService = new EmailService();
