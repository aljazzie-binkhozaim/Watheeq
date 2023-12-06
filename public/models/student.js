import { Schema as _Schema, model } from "mongoose";
import JWT from 'jsonwebtoken'

const Schema = _Schema;

const studentSchema= new Schema({
      email:{
        type: String,
        required: true,
        unique: true
    },

    name:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true,
    },
    tokens : [{
        token : String,
    }],
})


studentSchema.methods.AuthUser = async function(){
    const token = JWT.sign({_id : this._id} , 'mysuperSecret' , {expiresIn: "7h"})
    this.tokens = this.tokens.concat({token : token})
    await this.save()
    return token;
}

const Student = model('Student', studentSchema , 'student');

export default Student;