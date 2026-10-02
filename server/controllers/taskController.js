import Task from "../models/task.js"

export const gettasks= async (req,res,next) => {
    try{
        const tasks= await Task.find()
        return res.status(200).json({data: tasks})
    } catch(error) {
        next(error) }
}

export const gettaskbyId= async (req,res,next) => {
    try{
    const {id}= req.params
    const task= await Task.findById(id)
    if (task) {
        return res.status(200).json({
            success: true,
            data: task
        })
    } } catch(error) {
        next(error) }
}

export const createtask= async (req,res,next) => {
    try{
        const {title,status,dueDate,assignedTo,board}= req.body
        const task= await Task.create({
            title,
            status,
            dueDate,
            assignedTo,
            board
        })
        return res.status(201).json(task)
    } catch(error) {
        next(error) }
}

export const updatetask= async (req,res,next) => {
    try{
        const {id}= req.params
        const {title,status,dueDate,assignedTo,board}= req.body

        const task= await Task.findById(id)
        task.title= title || task.title
        task.status= status || task.status
        task.dueDate= dueDate || dueDate
        task.assignedTo= assignedTo || assignedTo
        task.board= board || board

        await task.save()
        return res.status(200).json(task)
    } catch(error) {
        next(error) }
}

export const deletetask= async (req,res,next) => {
    try{
    const {id}= req.params
    const task= await Task.findById(id)
    await task.deleteOne()
    return res.status(204).send()
    } catch(error) {
        next(error)
    }
}

export const gettasksbyStatus= async (req,res,next) => {
    try{
        const {status}= req.query
        const tasks= await Task.find({status})

        return res.status(200).json({
            status: "success",
            results: tasks.length,
            data: tasks
        })
    } catch(error){
        next(error)
    }
}