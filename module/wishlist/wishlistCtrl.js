import userModel from "../../models/userModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";


export const addToWishList = asyncHandler(async (req, res, next) => {

    const { productId } = req.params;
    const addProduct = await userModel.findByIdAndUpdate(req.user._id,
        { $addToSet: { wishList: productId } },
        { new: true },
    )
    res.status(200).json({
        success: true,
        data: { addProduct }
    })
})
export const removeFromWishList = asyncHandler(async (req, res, next) => {

    const { productId } = req.params;
    const removeProduct = await userModel.findByIdAndUpdate(req.user._id,
        {
            $pull: { wishList: productId }
        },
        { new: true }
    )
    res.status(200).json({
        success: true,
        data: { removeProduct }
    })
})