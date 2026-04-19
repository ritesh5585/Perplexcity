import { Router } from "express";
import { register, logIn, getMe, verifyEmail, sendVerificationEmail, checkVerified } from "../controllers/auth.js";
import { registerValidator, loginValidator } from "../validator/auth.validation.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register", registerValidator, register)
authRouter.post("/login", loginValidator, logIn)
authRouter.post("/send-verification", sendVerificationEmail)  

authRouter.get("/verify-email", verifyEmail)
authRouter.get("/check-verified", checkVerified)              
authRouter.get("/get-me", authUser, getMe)

export default authRouter