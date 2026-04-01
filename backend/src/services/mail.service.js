import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// ─── OAuth2 Client ────────────────────────────────
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// ─── Fresh Transporter — Har call pe naya token ──
const createTransporter = async () => {
    const { token } = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: token, // ✅ Fresh token har baar
        },
    });
};

// ─── Verify on Startup ────────────────────────────
createTransporter()
    .then((t) => t.verify())
    .then(() => console.log("✅ Email is ready to send email"))
    .catch((err) => console.log("❌ Email verification failed:", err));

// ─── Send Email ───────────────────────────────────
export async function sendEmail({ to, subject, html, text }) {
    const transporter = await createTransporter(); // ✅ Ab defined hai

    const mailOption = {
        from: `"Perplexity AI" <${process.env.GOOGLE_USER}>`,
        to,
        subject,
        html,
        text,
    };

    const details = await transporter.sendMail(mailOption);
    console.log("📧 Email sent successfully:", details.messageId);
    return details;
}