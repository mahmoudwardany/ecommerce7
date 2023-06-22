import cartModel from "../../models/cartModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";


export const addTocart = asyncHandler(async (req, res) => {
    const { products } = req.body;
    const { _id } = req.user;

    const cart = await cartModel.findOne( { userId: _id })
    if (!cart) {
        const newCart = await cartModel.create({
            userId: _id,
            products
        })
        return res.status(201).json({
            status: "success",
            newCart
        })
    }
    //update cart if user have cart
    //loop on new products that user added
    for (const product of products) {
        let matched = false;
        //loop on products on database
        for (let i = 0; i < cart.products.length; i++) {
            //compare product in req.body == product in cart in database
            if (product.productId == cart.products[i].productId.toString()) {
                cart.products[i] = product
                matched = true
                break;
            }
        }
    if (!matched) {
        cart.products.push(product)
    }
    }
    await cartModel.findOneAndUpdate({ userId: _id },
            { products: cart.products }, { new: true }
    )
    return res.status(200).json({ message: "Done", cart })
})