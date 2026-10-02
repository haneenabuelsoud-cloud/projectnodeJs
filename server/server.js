import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const MONGODB_URI= process.env.MONGODB_URI
const PORT_NUMBER= process.env.PORT_NUMBER
console.log("URI: ",MONGODB_URI)

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI).then(() => {
      console.log("Connect to mongodb")

      app.listen(PORT_NUMBER ,() => {
        console.log(`server running at http://localhost: ${PORT_NUMBER}`)
      })
    }).catch((error) => {
        console.log("Database connection failed", error)
    })
}