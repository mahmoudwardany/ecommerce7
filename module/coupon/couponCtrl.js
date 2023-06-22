import couponModel from "../../models/coupon.Model.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";


export const createCoupon=asyncHandler(async(req,res,next)=>{
    const findCoupon=await couponModel.findOne({name:req.body.name})
    if (findCoupon) return  next(new ApiError(`Coupon Name Already Exist`,409))
    req.body.createdBy=req.user._id
    const coupon=await couponModel.create(req.body)
    res.status(201).json({
        status:"success",
        coupon
    })
})
export const updateCoupon=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const findCoupon=await couponModel.findOne({name:req.body.name})
    if (!findCoupon) return  next(new ApiError(`Coupon Not found`,404))
    const coupon=await couponModel.findByIdAndUpdate(id,req.body,{new:true})
    res.status(200).json({
        status:"Coupon Updated",
        coupon
    })
})
export const deleteCoupon=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const findCoupon=await couponModel.findOne({name:req.body.name})
    if (!findCoupon) return  next(new ApiError(`Coupon Not found`,404))
    const coupon=await couponModel.findByIdAndDelete(id)
    res.status(200).json({
        status:"Coupon Deleted",
    })
})