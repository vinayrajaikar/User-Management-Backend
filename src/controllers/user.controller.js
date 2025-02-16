import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User} from "../model/user.model.js"

export const signup = asyncHandler(async(req,res)=>{
    const {name,email,password,role}=req.body;

    if(!name||!email||!password){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser = await User.findOne({
        email
    })

    if(existedUser){
        throw new ApiError(409,"User with this email already existed");
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    if(!user){
        throw new ApiError(500,"Something went wrong while creating user");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User created successfully")
        )

})

export const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    if(!email||!password){
        throw new ApiError(400,"All fields are required");
    }

    const user = await User.findOne({
        email
    })

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401,"Password is incorrect");
    }

    const accessToken = user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password")

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true
        })
        .json(
            new ApiResponse(200, loggedInUser, "User logged in successfully")
        )
})