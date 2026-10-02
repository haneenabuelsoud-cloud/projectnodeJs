import User from "../models/user.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

export const userLogin= async (req,res,next) => {
     try{
        const {email,password}= req.body
        const user= await User.findOne({email})
        if (!user) {
            next("wrong email or password")
        }

        const isMatched= await User.comparePassword(password)
        if (!isMatched) {
            next("wrong email or password")
        }

        const accessToken= await jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.JWT_EXPIRE_TIME
            },
        )

        return res.status(200).json({
            message: "login successfully",
            accessToken,
        })
    } catch(error) {
        next(error)
    }
}