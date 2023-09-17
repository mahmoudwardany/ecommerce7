import cartModel from "../../models/cartModel.js";
import orderModel from "../../models/order.model.js";
import productModel from "../../models/productModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_KEY);

/**
 * @desc Create Cash Order
 * @route POST /api/v1/order/:cartId
 * @access private (Login User)
 * @method POST
 */
export const createCashOrder = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const cart = await cartModel.findById(id);

        if (!cart) {
            return next(new ApiError(`Cart Not found`, 404));
        }

        let cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
        let totalOrderPrice = cartPrice;
        req.body.price = cart.cartItems.price;

        const order = await orderModel.create({
            user: req.user._id,
            cartItems: cart.cartItems,
            shippingAddress: req.body.shippingAddress,
            totalOrderPrice,
        });

        if (order) {
            const bulkOptions = cart.cartItems.map(item => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: {
                        $inc: {
                            amount: -item.quantity,
                            stock: -item.quantity,
                            soldItems: +item.quantity,
                        },
                    },
                },
            }));
            await productModel.bulkWrite(bulkOptions, {});
            await cartModel.findByIdAndDelete(id);
        }

        res.status(201).json({
            status: "success",
            data: order,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get Orders
 * @route GET /api/v1/order/
 * @access private (Admin Only)
 * @method GET
 */
export const getOrders = asyncHandler(async (req, res, next) => {
    try {
        const orders = await orderModel.find({}).populate({
            path: "user",
            select: "userName email",
        });

        res.status(200).json({ orders });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Update Status of Order to paid
 * @route PUT /api/v1/order/:id/pay
 * @access private (Admin Only)
 * @method PUT
 */
export const updatePaid = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await orderModel.findById(id);

        if (!order) {
            return next(new ApiError(`Order Not found at ${id}`, 404));
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder = await order.save();

        res.status(200).json({
            updatedOrder,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get Specific Order
 * @route GET /api/v1/order/:id/
 * @access private (Admin Or User Himself)
 * @method GET
 */
export const getSpecificOrder = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await orderModel.findById(id).populate({
            path: "user",
            select: "userName email",
        });

        if (req.user._id.toString() === order.user.toString() || req.user.role === 'Admin') {
            res.status(200).json({ order });
        } else {
            return next(new ApiError("You aren't Authorized"), 403);
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get Checkout Session
 * @route GET /api/v1/order/checkout/:cartId
 * @access private (Login User)
 * @method GET
 */
export const getCheckout = asyncHandler(async (req, res, next) => {
    try {
        const { cartId } = req.params;
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return next(new ApiError(`Cart Not found`, 404));
        }

        let cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
        let totalOrderPrice = cartPrice;
        req.body.price = cart.cartItems.price;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                currency: 'egp',
                name: req.user.name,
                amount: totalOrderPrice * 100,
                quantity: 1,
            }],
            mode: 'payment',
            customer_email: req.user.email,
            success_url: `${req.protocol}://${req.get('host')}/orders`,
            cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        });
        res.status(200).json({ status: 'Success', session });
    } catch (error) {
        next(error);
    }
});
