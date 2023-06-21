import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import userModel from '../models/userModel.js';
import { asyncHandler } from '../utils/catchAsyncHandler.js';

export const roles = {
    Admin: "Admin",
    User: "User"
}

export const verifyToken = (accessRole=[]) => {
    return asyncHandler(async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARERTOKEN)) {
            next(new ApiError(`Invalid Bearer Key`, 400))
        } else {
            const token = authorization.split(process.env.BEARERTOKEN)[1]
            const decode = jwt.verify(token, process.env.confirmEmailJwt)
            if (!decode?._id) {
                next(new ApiError(`Invalid Token`, 400))
            } else {
                const user = await userModel.findById(decode._id).select('userName email role')
                if(accessRole.includes(user.role)){
                    req.user = user
                    next()  
                }else{
                next(new ApiError(`Not Authorized`, 403))
                }
            }
        }
    })
}