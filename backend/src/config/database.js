import mongoose from "mongoose"

const connectDb = async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${connect.connection.host}`)
}
export default connectDb