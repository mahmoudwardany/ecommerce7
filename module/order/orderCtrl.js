import cartModel from "../../models/cartModel.js";
import couponModel from "../../models/coupon.Model.js";
import orederModel from "../../models/order.model.js";
import productModel from "../../models/productModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";


export const createOrder = asyncHandler(async (req, res,next) => {
    const { products,totalPrice,couponId } = req.body
    const {_id}=req.user
    req.body.userId=_id
    let sumTotal = 0
    let productsList = []
    for (let i = 0; i < products.length; i++) {
        const checkItems = await productModel.findOne({
            _id: products[i].productId, stock: { $gte: products[i].quantity }
        })
        if (!checkItems) {
            next(new ApiError(`Invalid to place this order`, 409))
        }
        products[i].totalPrice = (checkItems.finalPrice * products[i].quantity)
        sumTotal += products[i].totalPrice
        products[i].priceUnit=checkItems.finalPrice
        productsList.push(products[i])
    }
        req.body.totalPrice=sumTotal
        if(couponId){
            const coupon=await couponModel.findOne({
                _id:couponId,
                usedBy:{$nin:_id}
            })
            if(!coupon){
            next(new ApiError(`Invalid coupon`, 409))    
            }
            req.body.totalPrice=sumTotal-(coupon.amount * coupon.amount / 100)
        }
//create order
const order=await orederModel.create(req.body)
//add coupon id to user if order success
if (order) {
    await couponModel.findByIdAndUpdate(couponId,{
        $addToSet:{usedBy:_id}
    })
    return res.status(200).json({
        message:"Order created successfully",
        order
    })
} else {
    next(new ApiError(`Failed to order `, 400))    
    
}


})