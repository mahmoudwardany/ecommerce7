import userModel from "../../models/userModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";

/**--------------------------------
* @desc Add Product to WishList
* @router /api/v1/product/:productId/wishlist/add
* @access private (LogIn User) 
* @method Patch
*/
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
/**--------------------------------
* @desc Delete WishList
* @router /api/v1/product/:productId/wishlist/remove
* @access private (LogIn User) 
* @method Delete
*/
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