import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import morgan from "morgan"
import cors from "cors"

const app = express()

app.use(express.json())
// FIX: Changed 'extend' to 'extended' — correct option name for express.urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use("/api/chats", chatRoutes);
app.use("/api/auth", authRouter)

export default app