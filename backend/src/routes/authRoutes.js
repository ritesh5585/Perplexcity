import { Router } from "express";
import { register, logIn, getMe, verifyEmail } from "../controllers/auth.js";
import { registerValidator, loginValidator } from "../validator/auth.validation.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

// /api/auth/register: register as a new user {user: username, email, password}
authRouter.post("/register", registerValidator, register)

// /api/auth/login: login user: email, password;
authRouter.post("/login", loginValidator, logIn)

authRouter.get("/get-me", authUser, getMe)

authRouter.get("/verify-email", verifyEmail)

export default authRouter