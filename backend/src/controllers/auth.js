import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js"

// ─── Helper — sirf email leta hai ─────────────────
async function sendVerificationEmailToUser(email) {
    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f0f0f; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f0f; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #333333; max-width: 600px; margin: 0 auto;">
                        <tr>
                            <td align="center" style="padding: 40px 20px; background: linear-gradient(135deg, #1f1035 0%, #1a1a1a 100%); border-bottom: 1px solid #333">
                                <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Perplexity AI</h1>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 40px 30px;">
                                <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #ffffff;">Verify Your Email</h2>
                                <p style="margin: 0 0 30px 0; font-size: 16px; color: #a3a3a3; line-height: 1.6;">
                                    Thanks for signing up! Please verify your email address to complete your registration and unlock all features.
                                </p>
                                <a href="http://localhost:3000/api/auth/verify-email?token=${token}" style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.39);">
                                    Verify Email &rarr;
                                </a>
                                <p style="margin: 30px 0 0 0; font-size: 14px; color: #555555;">
                                    This link expires in 24 hours.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px; background-color: #121212; border-top: 1px solid #333333;">
                                <p style="margin: 0; font-size: 12px; color: #555555;">
                                    &copy; ${new Date().getFullYear()} Perplexity AI Clone. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await sendEmail({
        to: email,
        subject: "Verify your email - Perplexity AI",
        html: emailHtml
    })
}

// ─── Check Email Verified (Polling ke liye) ───────
export async function checkVerified(req, res) {
    const { email } = req.query

    if (!email) {
        return res.status(400).json({ message: "Email required" })
    }

    const user = await userModel.findOne({ email })
    res.json({ verified: user?.verified || false })
}


// ─── Send Verification Email (Route Handler) ──────
export async function sendVerificationEmail(req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: "Email required" })
    }

    const existingUser = await userModel.findOne({ email })
    if (existingUser && existingUser.verified) {
        return res.status(400).json({
            message: "Email already registered",
            success: false
        })
    }

    await sendVerificationEmailToUser(email)

    res.json({ success: true, message: "Verification email sent" })
}

// ─── Verify Email ─────────────────────────────────
export async function verifyEmail(req, res) {
    const { token } = req.query

    if (!token) {
        return res.status(400).json({ message: "Token is required" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // DB mein verified: true mark karo (user exist kare ya na kare)
        const result = await userModel.findOneAndUpdate(
            { email: decoded.email },
            { verified: true },
            { new: true, upsert: true } // upset: true karke naya user create karna zaroori hai
        )

        console.log("Verified user:", result) // ← terminal mein dekho

        const successHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Success</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #0f0f0f;
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    color: white;
                }
                .container {
                    text-align: center;
                    background-color: #1a1a1a;
                    padding: 50px 40px;
                    border-radius: 16px;
                    border: 1px solid #333;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    max-width: 400px;
                    width: 90%;
                    position: relative;
                    overflow: hidden;
                }
                .container::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #7c3aed, #ec4899);
                }
                .checkmark {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 2;
                    stroke: #fff;
                    stroke-miterlimit: 10;
                    box-shadow: inset 0px 0px 0px #10b981;
                    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
                    background-color: #10b981;
                    margin: 0 auto 24px;
                }
                .checkmark__circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 2;
                    stroke-miterlimit: 10;
                    stroke: #10b981;
                    fill: none;
                    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                }
                .checkmark__check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
                }
                @keyframes stroke {
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes scale {
                    0%, 100% { transform: none; }
                    50% { transform: scale3d(1.1, 1.1, 1); }
                }
                @keyframes fill {
                    100% { box-shadow: inset 0px 0px 0px 50px #10b981; }
                }
                h1 {
                    margin: 0 0 12px 0;
                    font-size: 28px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
                p {
                    color: #a3a3a3;
                    margin: 0 0 32px 0;
                    font-size: 16px;
                    line-height: 1.5;
                }
                .btn {
                    display: inline-block;
                    background-color: #7c3aed;
                    color: white;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.2s ease;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
                }
                .btn:hover {
                    background-color: #6d28d9;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <h1>Email Verified!</h1>
                <p>Your email has been successfully verified. You can now complete your registration.</p>
                <a href="http://localhost:5173/register" class="btn">&rarr; Go to Register</a>
            </div>
            
            <script>
                // Celebrate with simple confetti logic
                document.addEventListener('DOMContentLoaded', () => {
                    const colors = ['#7c3aed', '#ec4899', '#10b981', '#3b82f6', '#fbbf24'];
                    for(let i=0; i<50; i++) {
                        setTimeout(() => {
                            const confetti = document.createElement('div');
                            confetti.style.position = 'fixed';
                            confetti.style.top = '-10px';
                            confetti.style.left = Math.random() * 100 + 'vw';
                            confetti.style.width = Math.random() * 8 + 4 + 'px';
                            confetti.style.height = Math.random() * 8 + 4 + 'px';
                            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                            confetti.style.opacity = Math.random() + 0.5;
                            confetti.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
                            confetti.style.pointerEvents = 'none';
                            confetti.style.transition = 'all 3s cubic-bezier(0.25, 1, 0.5, 1)';
                            document.body.appendChild(confetti);
                            
                            setTimeout(() => {
                                confetti.style.top = '100vh';
                                confetti.style.transform = 'rotate(' + (Math.random() * 360 + 360) + 'deg) translateX(' + (Math.random() * 100 - 50) + 'px)';
                            }, 50);
                            
                            setTimeout(() => confetti.remove(), 3000);
                        }, i * 50);
                    }
                });
            </script>
        </body>
        </html>
        `;

        return res.send(successHtml);
    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message
        })
    }
}

// ─── Register ─────────────────────────────────────
// POST /register → same body dobara → success 
export async function register(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false
        })
    }

    const existingUser = await userModel.findOne({ email })

    // Case 1: User exist karta hai aur verified bhi hai → already registered
    if (existingUser && existingUser.verified && existingUser.username) {
        return res.status(400).json({
            message: "User already registered with this email",
            success: false
        })
    }

    // Case 2: User exist karta hai, verified hai, username nahi → complete karo
    if (existingUser && existingUser.verified) {
        try {
            existingUser.username = username
            existingUser.password = password
            await existingUser.save()
            
            return res.status(201).json({
                message: "User registered successfully ✅",
                success: true,
                user: {
                    id: existingUser._id,
                    username: existingUser.username,
                    email: existingUser.email
                }
            })
        } catch (error) {
            if (error.code === 11000 && error.keyPattern?.username) {
                return res.status(400).json({
                    message: "Username already taken, please choose another",
                    success: false
                })
            }
            throw error
        }
    }

    // Case 3: User exist karta hai but verified nahi → email dobara bhejo
    if (existingUser && !existingUser.verified) {
        await sendVerificationEmailToUser(email)
        return res.status(400).json({
            message: "Email not verified. Verification email sent again — check your inbox!",
            success: false,
            emailSent: true
        })
    }

    // Case 4: Bilkul naya user → DB mein save karo aur email bhejo
    try {
        await userModel.create({
            username,
            email,
            password,
            verified: false
        })
    } catch (error) {
        if (error.code === 11000 && error.keyPattern?.username) {
            return res.status(400).json({
                message: "Username already taken, please choose another",
                success: false
            })
        }
        throw error
    }

    await sendVerificationEmailToUser(email)

    return res.status(201).json({
        message: "Verification email sent — please verify then call /register again!",
        success: false,
        emailSent: true
    })
}

// ─── Login ────────────────────────────────────────
export async function logIn(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email first",
            success: false
        })
    }

    if (!user.password) {
        return res.status(400).json({
            message: "User not fully registered. Please complete registration.",
            success: false
        })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    res.cookie("token", token, { httpOnly: true })

    res.status(200).json({
        message: "Login Successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

// ─── Get Me ───────────────────────────────────────
export async function getMe(req, res) {
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}