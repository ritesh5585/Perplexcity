import jwt from "jsonwebtoken"

export async function authUser(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Unauthorised access",
            success: false,
            err: "No token provided"
        })
    }
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded token:", decoded) 
            req.user = decoded

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorised access",
            success: false,
            err: "Invalid token"
        })
    }
}