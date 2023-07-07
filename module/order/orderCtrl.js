import cartModel from "../../models/cartModel.js";
import orderModel from "../../models/order.model.js";
import productModel from "../../models/productModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_KEY);

/**--------------------------------
 * @desc Create Cash Order
 * @router /api/v1/order/:cartId
 * @access private (Login User)
 * @method Post
 */
export const createCashOrder = asyncHandler(async (req, res, next) => {
    //Get Cart depend on CartId
    const { id } = req.params
    const cart = await cartModel.findById(id)
    if (!cart) {
        next(new ApiError(`Cart Not found`, 404))
    }
    //2-get order price and check if there coupon or Not
    let cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice
    let totalOrderPrice = cartPrice
    req.body.price = cart.cartItems.price
    //3-create order
    const order = await orderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice
    })
    //4-decrement quantity on stock and increment product sold
    if (order) {
        const bulkOption = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: {
                        amount: -item.quantity,
                        stock: -item.quantity,
                        soldItems: +item.quantity
                    }
                }
            }
        }))
        await productModel.bulkWrite(bulkOption, {})
        await cartModel.findByIdAndDelete(id)
    }
    res.status(201).json({
        status: "success",
        data: order
    })
    //5-clear cart for user
})
/**--------------------------------
 * @desc Get  Order
 * @router /api/v1/order/
 * @access private (Admin Only)
 * @method GET
 */
export const getOrders = asyncHandler(async (req, res, next) => {
    const orders = await orderModel.find({}).populate({
        path: "user",
        select: "userName email"
    },
    )
    res.status(200).json({ orders })

})
/**--------------------------------
 * @desc Update Status   Order to paid
 * @router /api/v1/order/:id/pay
 * @access private (Admin Only)
 * @method put
 */
export const updatePaid = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const order = await orderModel.findById(id)
    if (!order) return next(new ApiError(`Order Not found at ${id}`, 404))
    order.isPaid = true;
    order.paidAt = Date.now()
    const updateOrder = await order.save()
    res.status(200).json({
        updateOrder
    })
})
/**--------------------------------
 * @desc Update Status   Order to paid
 * @router /api/v1/order/:id/
 * @access private (Admin Or User himself)
 * @method Get
 */
export const getspecificOrder = asyncHandler(async (req, res, next) => {
    let { id } = req.params
    const order = await orderModel.findById(id).populate({
        path: "user",
        select: "userName email"
    },
    )
    if (req.user._id.toString() === order.user.toString() || req.user.role === 'Admin') {
        res.status(200).json({ order })
    } else {
        return next(new ApiError("You aren't Authorized"), 403)
    }
})
/**--------------------------------
 * @desc Get Checkout Session
 * @router /api/v1/order/checkout/:cartId
 * @access private (Login User)
 * @method Get
 */
export const getCheckout = asyncHandler(async (req, res, next) => {
    //Get Cart depend on CartId
    const { cartId } = req.params
    const cart = await cartModel.findById(cartId)
    if (!cart) {
        next(new ApiError(`Cart Not found`, 404))
    }
    //2-get order price and check if there coupon or Not
    let cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice
    let totalOrderPrice = cartPrice
    req.body.price = cart.cartItems.price
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            currency: 'egp',
            name: req.user.name,
            amount: totalOrderPrice * 100,
            quantity: 1,
        }],
        mode: 'payment',
        customer_email:req.user.email,
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    })
res.status(200).json({status:'Success',session})
})