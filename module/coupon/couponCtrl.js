import couponModel from "../../models/coupon.Model.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";

// Create Coupon
/**--------------------------------
 * @desc Create Coupon
 * @router /api/v1/coupon/
 * @access private (Admin Only)
 * @method Post
 */
export const createCoupon = asyncHandler(async (req, res, next) => {
    try {
        const coupon = new couponModel(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        next(error);
    }
});

// Get Coupons
/**--------------------------------
 * @desc Get Coupon
 * @route /api/v1/coupon/
 * @access public
 * @method Get
 */
export const getCoupons = asyncHandler(async (req, res, next) => {
    try {
        const coupons = await couponModel.find({});
        res.status(200).json(coupons);
    } catch (error) {
        next(error);
    }
});

// Get One Coupon
/**--------------------------------
 * @desc Get one  Coupon
 * @route /api/v1/coupon/:id
 * @access public
 * @method Get
 */
export const getCoupon = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const coupon = await couponModel.findById(id);

        if (!coupon) {
            return next(new ApiError("Coupon not found", 404));
        }

        res.status(200).json(coupon);
    } catch (error) {
        next(error);
    }
});

// Update Coupon
/**--------------------------------
 * @desc Update Coupon
 * @route /api/v1/coupon/:id
 * @access private (Admin Only)
 * @method Put
 */
export const updateCoupon = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedCoupon = await couponModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCoupon) {
            return next(new ApiError("Coupon not found", 404));
        }

        res.status(200).json(updatedCoupon);
    } catch (error) {
        next(error);
    }
});

// Delete Coupon
/**--------------------------------
 * @desc Delete Coupon
 * @route /api/v1/coupon/:id
 * @access private (Admin Only)
 * @method Delete
 */
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCoupon = await couponModel.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return next(new ApiError("Coupon not found", 404));
        }

        res.status(200).json({
            status: "Coupon Deleted",
        });
    } catch (error) {
        next(error);
    }
});
