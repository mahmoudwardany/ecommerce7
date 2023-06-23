import mongoose from "mongoose";
import userModel from "../../models/userModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";

export const getAllUser = asyncHandler(async (req, res,) => {
    const users = await userModel.find({})
    res.status(200).json({
        status: "success",
        data: users
    })
})
export const getUser = asyncHandler(async (req, res, next) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(`Invalid Id ${id}`, 400))
    }
    const user = await userModel.findById(id)
    if (!user) {
        return next(new ApiError(`User Not found`, 404))
    } else {
        res.status(200).json({
            data: user,
            message: `User Found`
        })
    }
})

export const deleteUser=asyncHandler(async (req, res, next) => {
    const {id}=req.params;
    const user=await userModel.findByIdAndDelete(id)
    if(!user)return next(new ApiError(`User Not found`, 404))
    res.status(200).json({
        success:true,
        message:"User Deleted Success"
    })
})