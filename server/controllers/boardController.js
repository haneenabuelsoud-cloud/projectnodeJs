import Board from "../models/board.js";

export const getboards= async (req,res,next)=> {
    try{
        const boards= await Board.find()
        return res.status(200).json({data: boards})
    } catch(error) {
        next(error) }
}

export const getboardbyId= async (req,res,next) => {
    try{
        const {id}= req.params
        const board= await Board.findById(id)
        if (board) {
          return res.status(200).json({
            success: true ,
            data: board
          })
        } } catch(error) {
            next(error) }
}

export const createboard= async (req,res,next) => {
    try{
        const {title,owner,members,password}= req.body
        const board= await Board.create({
          title ,
          owner ,
          members ,
          password
        })
        return res.status(201).json(board)
    } catch(error) {
        next(error) }
}

export const updateboard= async (req,res,next) => {
    try{
        const {id}= req.params
        const {title,owner,members,password}= req.body

        const board= await Board.findById(id)
        board.title= title || board.title
        board.owner= owner || board.owner
        board.members= members || board.members
        board.password= password || board.password

        await board.save()
        return res.status(200).json(board)
    } catch(error) {
        next(error) }
}

export const deleteboard= async (req,res,next) => {
    try{
    const {id}= req.params
    const board= await Board.findById(id)
    await board.deleteOne()
    return res.status(204).send()
    } catch(error) {
        next(error) }
}