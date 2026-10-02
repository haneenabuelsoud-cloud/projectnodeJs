import jwt from "jsonwebtoken"
import User from "../models/user.js"

export default async (req,res,next) => {
    try{
        const authHeader= req.headers.authorization
        console.log(authHeader)
        if (!authHeader) {
            return next(new Error("Unauthorized user"))
        }

        const accessToken= authHeader.split(' ')[1]
        if (!accessToken) {
            return next(new Error("Unauthorized user"))
        }

        let payload
        try{
            payload= jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
        } catch(error) {
            return next(new Error("Invalid access token"))
        }

        const user= await User.findById(payload.id)
        if (!user) {
            return next(new Error("user not found"))
        }
        req.user= user
        next()

    } catch(error) {
        next(error) }
}