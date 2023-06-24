import mongoose from "mongoose";
import userModel from "../../models/userModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";

/**--------------------------------
* @desc Get All User
* @router /api/v1/user/
* @access private (Admin or LogIn User) 
* @method Get
*/
export const getAllUser = asyncHandler(async (req, res,) => {
    const users = await userModel.find({})
    res.status(200).json({
        status: "success",
        data: users
    })
})
/**--------------------------------
* @desc Get One
* @router /api/v1/user/:id
* @access private (Admin or LogIn User) 
* @method Get
*/
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
/**--------------------------------
* @desc Delete User
* @router /api/v1/user/:id
* @access private (Admin Only) 
* @method Delete
*/
export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id)
    if (!user) return next(new ApiError(`User Not found`, 404))
    res.status(200).json({
        success: true,
        message: "User Deleted Success"
    })
})