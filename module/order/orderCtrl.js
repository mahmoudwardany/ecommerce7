import cartModel from "../../models/cartModel.js";
import orderModel from "../../models/order.model.js";
import productModel from "../../models/productModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";

/**--------------------------------
 * @desc Create Cash Order
 * @router /api/v1/order/:id
 * @access private (Login User)
 * @method Post
 */
export const createCashOrder = asyncHandler(async (req, res,next) => {
//Get Cart depend on CartId
const {id}=req.params
const cart=await cartModel.findById(id)
if(!cart){
    next(new ApiError(`Cart Not found`, 404))
}
//2-get order price and check if there coupon or Not
let cartPrice=cart.totalPriceAfterDiscount?cart.totalPriceAfterDiscount:cart.totalPrice
let totalOrderPrice=cartPrice
//3-create order
const order=await orderModel.create({
    user:req.user._id,
    cartItems:cart.cartItems,
    shippingAddress:req.body.shippingAddress,
    totalOrderPrice
})
//4-decrement quantity on stock and increment product sold
if(order){
    const bulkOption=cart.cartItems.map(item=>({
    updateOne:{
        filter:{_id:item.product},
        update:{
            $inc:{
                amount:-item.quantity,
                stock:-item.quantity,
                soldItems:+item.quantity
            }
        }
    }
}))

await productModel.bulkWrite(bulkOption,{})
await cartModel.findByIdAndDelete(id)
}
res.status(201).json({
    status:"success",
    data:order
})
//5-clear cart for user
})