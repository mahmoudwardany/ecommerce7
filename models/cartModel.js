import { Schema, model } from 'mongoose'

const cartSchema = new Schema({
    cartItems: [{
        product: {
            type:Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        price: Number
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number,
}, { timestamps: true });



const cartModel = model('Cart', cartSchema)
export default cartModel
