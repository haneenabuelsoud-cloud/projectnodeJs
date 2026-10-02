import User from "./models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const createToken= (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME })
}

export const signup= async (req,res,next) => {
    const user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    const token= createToken(user._id)
    res.status(201).json({data: user, token})
}

export const login= async (req,res,next) => {
    const user= await User.findOne({email: req.body.email})
    if (!user || !await bcrypt.compare(req.body.password , user.password)){
        return next("Incorrect Username or Password")
    }

    const token= createToken(user._id)
    res.status (200).json({data: user, token})
}