import { Schema , model} from "mongoose";
import bcrypt from "bcryptjs";

const userSchema= new Schema({
    name: {
     type: String,
     minlength: [3,'Name must not be less than 3 characters'],
     maxlength: [30,'Name must not be more than 30 characters'],
     required: [true,'Name is required']
    },
    email: {
     type: String,
     unique: true,
     match: [
        /^[a-zA-Z0-9._]*@[a-zA-Z]{3,5}.[a-zA-Z]{3}$/,'email must be like name@example.com'
     ],
     required: [true,'email is required']
    },
    password: {
        type: String,
        required: [true,'password is required'],
        minlength: [8,'password should be at least 8 characters']
    }
})

    userSchema.pre('save', async function(){
        if (!this.isModified('password')) return 
        this.password= await bcrypt.hash(this.password,12);
    })

export default model('User' , userSchema)