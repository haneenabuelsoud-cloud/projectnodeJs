import Board from "../models/board.js";

export default async (req,res,next) => {
    try{
    const user= req.user
    const {id}= req.params
    const {password}= req.body

    const board= await Board.findById(id)
    if (!board) {
        return next(new Error("board not found"))
    }

   console.log(req.user._id.toString())
   console.log(board.owner.toString())

    if (board.owner.toString() === req.user._id.toString()) {
        req.board= board
        return next()
    }
    if (req.method === "PATCH" && password === board.password) {
        req.board= board
        return next()
    }
    return next(new Error("Insufficient permission")) } 
    catch(error) {
        next(error) }
}