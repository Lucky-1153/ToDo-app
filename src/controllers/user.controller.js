import { Mongoose } from "mongoose";
import {User} from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import jwt from 'jsonwebtoken'

const options ={
    httpOnly: true,
    secure: true
}

const getAccessAndRefreshToken = async function(userId){

    try {
        const user = await User.findById(userId)
        
        const accessToken = user.generateAccessToken()
        
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validationBefore: false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(501, "unable to generate accessToken or refreshToken",error)
    }

}

const registerUser = async (req,res) => {
    try {
        //take input from frontend
        //check if not empty
        //check if user exist in datbase already
        //create user instance in database
        //enter the data into database
        //reomve password and refreshToken from response
        //send response

        const {email, userName, password} = req.body;

        if( [email, userName, password].some((field) => field?.trim() === "") )
            throw new ApiError(301,"Fill all the fields")

        const existedUser = await User.findOne({
            $or: [{email, userName}]
        })

        if(existedUser)
            throw new ApiError(301,'user already existed')

        const user = await User.create({
            userName,
            email,
            password
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        return res.status(200).json(
            `user created successfuly`
        )

    } catch (error) {
        throw new ApiError(301,"unable to create user",error)
    }
}

const loginUser = async(req, res) => {
    try {

        //take input from frontend
        //check if not empty
        //check username in database
        //check password is correct
        //generate accessToken and refreshToken
        //refreshToken save in database
        //password and refreshToken deselect
        //return accessTOken
        const {userName, password} = req.body

        if([userName, password].some((field) => field?.trim() === ""))
            throw new ApiError(501, "enter username and password")

        const existedUser = await User.findOne({
            $or: [{userName}]
        })

        if(!existedUser)
            throw new ApiError(501, "enter username and password")

        const passwordCheck = await existedUser.isPasswordCorrect(password)
        
        if(!passwordCheck)
            throw new ApiError(501, "password incorrect")
        
        const {accessToken, refreshToken} = await getAccessAndRefreshToken(existedUser._id)
        

        const newUser = await User.findById(existedUser._id).select("-password -refreshToken")

        if(!newUser)
            throw new ApiError(401, "somethin went wrong while generating Token")

        return res
        .status(201)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json("login Successful")
 
    } catch (error) {
        throw new ApiError(501, "login UnSuccessful",error)
    }
}

const logout = async( req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken : undefined
                }
            },
            {
                new: true
            }
        ) 
    
        return res
        .status(202)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken",options)
        .json(
            "logout Successful"
        )
    } catch (error) {
        throw new ApiError(501, "unauthorized logout", error)
    }
    
}

const refreshAccessToken = async(req,res) => {
    
    try {
        const token = req.cookies.refreshToken
        if(!token )
            throw new ApiError(500, "unauthorized request")
    
        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
       
        if(!decodedToken)
            throw new ApiError(500, "already used token")
    
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if( token !== user?.refreshToken)
            throw new ApiError(401, "Refresh token is expired or used")
    
        const {accessToken, newRefreshToken} = getAccessAndRefreshToken(user._id)

        return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            "updated Refresh Token Successfully"
        )
    } catch (error) {
        throw new ApiError(501, "failed during updating refreshToken", error)
    }
    
}

export  {
    registerUser,
    loginUser,
    logout,
    refreshAccessToken
}