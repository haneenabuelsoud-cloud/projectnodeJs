import express from "express";
import morgan from "morgan";
import userRouter from "./Routers/userRouter.js";
import boardRouter from "./Routers/boardRouter.js";
import taskRouter from "./Routers/taskRouter.js";

const app= express()

app.use(morgan("dev"))
app.use(express.json())
app.use("/user", userRouter)
app.use("/board", boardRouter)
app.use("/task", taskRouter)

export default app;