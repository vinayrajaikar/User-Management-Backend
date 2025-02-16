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

export const logout = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .clearCookie("accessToken",{
        httpOnly: true,
        secure: true
    })
    .json(new ApiResponse(200,{},"User logged out successfully"))
})

export const  getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select("-password -role");

    if(!users){
        throw new ApiError(404,"No users found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "Users fetched successfully")
        )
})

export const getUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const user = await User.findById(id).select("-password -role");

    if(!user){
        throw new ApiError(404,"User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User fetched successfully")
        )
})

export const updateUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const {name,email,password,role} = req.body;

    const user = await User.findByIdAndUpdate(id,
        {
            name,
            email,
            role
        },
        {
            new: true
        }
    );

    if(!user){
        throw new ApiError(404,"User not found");
    }

    if(password){
        user.password = password
        await user.save({validateBeforeSave: false})
    }
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User updated successfully")
        )
})

export const deleteUser = asyncHandler(async(req,res)=>{

    if(req.user.role != "admin"){
        throw new ApiError(401,"Unauthorized request");
    }

    const {id} = req.params;

    const user = await User.findByIdAndDelete(id);

    if(!user){
        throw new ApiError(404,"User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200,{}, "User deleted successfully"))
})