import "dotenv/config"
import app from "./src/app.js";
import http from "http"
import { initAI } from "./src/ai/ai.service.js";
import connectDb from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

(async () => {
    await initAI();
    console.log("AI Ready 🚀");
})();

const PORT = process.env.PORT

const httpServer = http.createServer(app)
initSocket(httpServer)

connectDb()
    .catch((err) => {
        console.error("MongoDB connection failed:", err)
        process.exit(1)
    })


httpServer.listen(PORT, () => {
    console.log("Server is running on Port:", PORT)
})

