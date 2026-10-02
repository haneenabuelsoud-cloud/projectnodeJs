import { Schema , model} from "mongoose";

const taskSchema= new Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        unique: true
    } ,
    status: {
        type: String,
        enum: ["Done","In Progress","To Do"]
    },
    dueDate: {
       type: Date
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    board: {
       type: Schema.Types.ObjectId,
       ref: "Board"
    }
})

export default model("Task", taskSchema)