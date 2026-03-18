import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extend: true }))
app.use(cookieParser())
app.use("/api", chatRoutes);

app.get("/", (req, res) => {
    res.json({
        message: " Server is running"
    })
})

app.use("/api/auth", authRouter)

export default app