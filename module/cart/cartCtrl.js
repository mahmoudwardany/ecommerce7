import cartModel from "../../models/cartModel.js";
import productModel from "../../models/productModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import couponModel from '../../models/coupon.Model.js'
function calcPrice(cart){
    let sumTotal=0
    cart.cartItems.forEach(el => {
        sumTotal+=el.price*el.quantity
    });
    cart.totalPrice=sumTotal
    if(cart.totalPriceAfterDiscount){
        cart.totalPriceAfterDiscount= cart.totalPrice-((cart.totalPrice *cart.discount )/100).toFixed(2)
    }
}

export const addTocart = asyncHandler(async (req, res, next) => {
    const {price} = await productModel.findById(req.body.product)
    req.body.price = price
    let cart = await cartModel.findOne({ user: req.user._id })
    if (!cart) {
        let newCart = new cartModel({
            cartItems: [req.body],
            user: req.user._id
        })
        calcPrice(newCart)
        await newCart.save()
        res.status(200).json({ message: "cart created successfully.", newCart })
    } else {
        let findedProduct = cart.cartItems.find((elm) => elm.product == req.body.product)
        if (findedProduct) {
            findedProduct.quantity += 1
        } else {
            cart.cartItems.push(req.body)
        }
        calcPrice(cart)
        await cart.save()
        res.status(200).json({ cart })
    }
})

export const removeFromCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id }, {
        $pull: { cartItems: { _id: req.params.itemId } }
    }, { new: true })
    calcPrice(cart)
    await cart.save()
    !cart && next(new ApiError(`Item Not Found`, 404))
    cart && res.status(200).json({ cart })
})

export const updateQuantity = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id })
    let findProduct = cart.cartItems.find(el => el?.product == req.params.id)
    if (findProduct) {
        findProduct.quantity = req.body.quantity
    }
    calcPrice(cart)
    await cart.save()
    res.status(200).json({
        success: true,
        data: cart
    })
})


export const applyCoupon = asyncHandler(async (req, res, next) => {
    let { code, discount } = await couponModel.findOne({ code: req.body.code, expires: { $gt: Date.now() } })
    console.log(code)
    if (!code) return next(new ApiError('coupon not found or expired'))
    let cart = await cartModel.findOne({ user: req.user._id })
    cart.totalPriceAfterDiscount = (cart.totalPrice - (cart.totalPrice * discount) / 100).toFixed(2)
    cart.discount = discount
    await cart.save()
    res.status(200).json({ cart })
})