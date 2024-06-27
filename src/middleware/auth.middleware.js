import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/apiError.js'
import {User} from '../models/user.model.js'

export const jwtVerify = async (req, _,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        
        if(!token)
            throw new ApiError(500, "unauthorized request")
    
        
        const decodedToken = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET)
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user)
            throw new ApiError(500, "invalid access Token")
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(500, "not able to verify the user", error)
    }
}