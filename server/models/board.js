import { Schema , model} from "mongoose";

const boardSchema= new Schema({
    title: {
        type: String , 
        required: [true,"title is required"]
    },
    owner: {
        type: Schema.Types.ObjectId ,
        required: true ,
        ref: "User"
    },
    members: [{
        type: Schema.Types.ObjectId ,
        required: true ,
        ref: "User"
    }],
    password: {
        type: String,
        required: [true,'password is required'],
        minlength: [8,'password should be at least 8 characters']
    }        
})

export default model('Board', boardSchema)