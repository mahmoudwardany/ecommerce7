import couponModel from "../../models/coupon.Model.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";


export const createCoupon = asyncHandler(async (req, res) => {
    let Coupon = new couponModel(req.body);
    await Coupon.save();
    res.status(200).json(Coupon);
});

// to get all Coupons
export const getCoupons = asyncHandler(async (req, res) => {
    let Coupons = await couponModel.find({});
    res.status(200).json(Coupons);
});

// to get specific Coupon
export const getCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let Coupon = await couponModel.findById(id);
    !Coupon && next(new ApiError("Coupon not found", 400));
    Coupon && res.status(200).json(Coupon);
});

// to update specific Coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
    let id = req.params.id;
    let Coupon = await couponModel.findByIdAndUpdate(id, req.body, { new: true });

    !Coupon && next(new ApiError("Coupon not found", 400));
    Coupon && res.status(200).json(Coupon);
});
export const deleteCoupon=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const findCoupon=await couponModel.findOne({code:req.body.code})
    if (!findCoupon) return  next(new ApiError(`Coupon Not found`,404))
    const coupon=await couponModel.findByIdAndDelete(id)
    res.status(200).json({
        status:"Coupon Deleted",
    })
})