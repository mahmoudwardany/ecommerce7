import couponModel from "../../models/coupon.Model.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";

/**--------------------------------
 * @desc Create Coupon
 * @router /api/v1/coupon/
 * @access private (Admin Only)
 * @method Post
 */
export const createCoupon = asyncHandler(async (req, res) => {
    let Coupon = new couponModel(req.body);
    await Coupon.save();
    res.status(200).json(Coupon);
});

/**--------------------------------
 * @desc Get Coupon
 * @router /api/v1/coupon/
 * @access public
 * @method Get
 */
export const getCoupons = asyncHandler(async (req, res) => {
    let Coupons = await couponModel.find({});
    res.status(200).json(Coupons);
});
/**--------------------------------
 * @desc Get one  Coupon
 * @router /api/v1/coupon/:id
 * @access public
 * @method Get
 */
export const getCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let Coupon = await couponModel.findById(id);
    !Coupon && next(new ApiError("Coupon not found", 400));
    Coupon && res.status(200).json(Coupon);
});

/**--------------------------------
 * @desc Update Coupon
 * @router /api/v1/coupon/:id
 * @access private (Admin Only)
 * @method Put
 */
export const updateCoupon = asyncHandler(async (req, res, next) => {
    let id = req.params.id;
    let Coupon = await couponModel.findByIdAndUpdate(id, req.body, { new: true });
    !Coupon && next(new ApiError("Coupon not found", 400));
    Coupon && res.status(200).json(Coupon);
});
/**--------------------------------
 * @desc Delete Coupon
 * @router /api/v1/coupon/:id
 * @access private (Admin Only)
 * @method Delete
 */
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const findCoupon = await couponModel.findOne({ code: req.body.code })
    if (!findCoupon) return next(new ApiError(`Coupon Not found`, 404))
    const coupon = await couponModel.findByIdAndDelete(id)
    res.status(200).json({
        status: "Coupon Deleted",
    })
})