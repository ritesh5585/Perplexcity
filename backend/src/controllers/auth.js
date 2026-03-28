import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js"

//register a new user
export async function register(req, res) {
    const { username, email, password } = req.body

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { email }, { username }
        ]
    })

    if (!verfiedEmails.has(email)) {
        return res.status(400).json({
            message: "Email not verified"
        })
    }

    if (isUserAlreadyExist) {
        return res.status(400).json({
            message: "user with this email or username is already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false
        })
    }

    const emailVerificationToken = jwt.sign(
        {
            email: user.email,
        },
        process.env.JWT_SECRET
    )

    await sendEmail({
        to: email,
        subject: "Welcome to our perplexity!",
        html: `<p>Hi ${username}</p>
        <p>Thank you for registering at <strong>Perplexity</strong>. We are excited to have on board!</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        <p>If you did not have Account, please ignore this email.</p>
        <p>Best regards, <br> Perplexity Team</b4> </p>`
    })

    res.status(201).json({
        message: "user register successully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }

    })
}

export async function sendVerificationEmail(req, res) {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({
            message: "Email required"
        })
    }

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    )

    await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
        <h2>Verify Email</h2>
        <a href="http://localhost:3000/api/auth/verify-email?token=${token}">
            Click to verify
        </a>
        `
    })

    res.json({
        success: true,
        message: "Verification email sent"
    })
}

// user can verify there emails by using this function
export async function verifyEmail(req, res) {
    const { token } = req.query

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({
            email: decoded.email
        })

        // verifiedEmails.add(decoded.email)

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verfied = true;

        await user.save()

        const html =
            `
            <h1>Email Verified Successfully</h1>
            <p>Your email has been verified , Tou can now login to your account. </p>
    
            `

        return res.send(html)
    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message
        })
    }
}

// login existing user
export async function logIn(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({
        email
    })

    if (!user.verfied) {
        return res.status(400).json({
            message: "Please verify your email first",
            success: false
        })
    }

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: true,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Ivalid email or password",
            success: false,
            err: "incorrect Password"
        })
    }

    if (!user.verfied) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "email is not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    res.cookie("token", token)

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

export async function getMe(req, res) {
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "user details fetched successfully",
        success: true,
        user
    })
}