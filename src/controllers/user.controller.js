import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password:{
        type: String,
        required: [true,'Password is required'],
        trim: true,
    },

    role: { 
        type: String, 
        enum: ["user", "admin"], default: "user" 
    },

    refreshToken:{
        type: String
    }

},{timestamps: true})


userSchema.methods.isPasswordCorrect =async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return  jwt.sign(
            {
                _id: this._id,
                email: this.email,
                name: this.name,
                role: this.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
}

userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);