import cartModel from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import couponModel from '../../models/coupon.Model.js'

function calcPrice(cart) {
    cart.cartItems.reduce((acc, product) => {
        acc += product.price * product.quantity;
        cart.totalPrice = acc;
    }, 0);

    if (cart.totalPriceAfterDiscount) {
        cart.totalPriceAfterDiscount = (cart.totalPrice - (cart.totalPrice * cart.discount) / 100).toFixed(2);
    }
}

/**
 * @desc Add Product to Cart
 * @route POST /api/v1/cart
 * @access private (Login User)
 * @method POST
 */
export const addToCart = asyncHandler(async (req, res, next) => {
    const { price } = await productModel.findById(req.body.product);
    req.body.price = price;

    let cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        let newCart = new cartModel({
            cartItems: [req.body],
            user: req.user._id
        });

        calcPrice(newCart);
        await newCart.save();

        res.status(200).json({ message: "Cart created successfully.", newCart });
    } else {
        let foundProduct = cart.cartItems.find((item) => item.product == req.body.product);

        if (foundProduct) {
            foundProduct.quantity += 1;
        } else {
            cart.cartItems.push(req.body);
        }

        calcPrice(cart);
        await cart.save();

        res.status(200).json({ cart });
    }
});

/**
 * @desc Delete Product from Cart
 * @route DELETE /api/v1/cart/:itemId
 * @access private (Login User)
 * @method DELETE
 */
export const removeFromCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id }, {
        $pull: { cartItems: { _id: req.params.itemId } }
    }, { new: true });

    calcPrice(cart);
    await cart.save();

    if (!cart) {
        return next(new ApiError(`Item Not Found`, 404));
    }

    res.status(200).json({ cart });
});

/**
 * @desc Update Product In Cart
 * @route PUT /api/v1/cart/:id
 * @access private (Login User)
 * @method PUT
 */
export const updateQuantity = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id });

    let foundProduct = cart.cartItems.find((item) => item.product == req.params.id);

    if (foundProduct) {
        foundProduct.quantity = req.body.quantity;
    }

    calcPrice(cart);
    await cart.save();

    res.status(200).json({
        success: true,
        data: cart
    });
});

/**
 * @desc Apply coupon to get Discount
 * @route POST /api/v1/cart/applyCoupon
 * @access private (Login User)
 * @method POST
 */
export const applyCoupon = asyncHandler(async (req, res, next) => {
    let coupon = await couponModel.findOne({ code: req.body.code, expires: { $gt: Date.now() } });

    if (!coupon) {
        return next(new ApiError('Coupon not found or expired'));
    }

    let cart = await cartModel.findOne({ user: req.user._id });

    cart.totalPriceAfterDiscount = (cart.totalPrice - (cart.totalPrice * coupon.discount) / 100).toFixed(2);
    cart.discount = coupon.discount;

    await cart.save();

    res.status(200).json({ cart });
});

/**
 * @desc Get User Cart
 * @route GET /api/v1/cart
 * @access private (Login User)
 * @method GET
 */
export const getUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id });

    res.status(200).json({
        count: cart?.cartItems?.length,
        cart: cart?.cartItems,
        totalPrice: cart?.totalPrice,
        discount: cart?.discount,
        totalPriceAfterDiscount: cart?.totalPriceAfterDiscount
    });
});
