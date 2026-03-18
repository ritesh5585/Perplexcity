import "dotenv/config"
import app from "./src/app.js";
import { initAI } from "./src/ai/ai.service.js";
import connectDb from "./src/config/database.js";

(async () => {
    await initAI();
    console.log("AI Ready 🚀");
})();

const PORT = process.env.PORT

connectDb()
    .catch((err) => {
        console.error("MongoDB connection failed:", err)
        process.exit(1)
    })


app.listen(PORT, () => {
    console.log("Server is running on Port:", PORT)
})

