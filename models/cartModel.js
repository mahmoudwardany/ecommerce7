import { Schema, model } from 'mongoose'

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'UserId is required'],
        ref: "User",
        unique: true
    },
    products:[ {
        productId: {
            type: Schema.Types.ObjectId,
            required: [true, 'ProductId is required'],
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
}, {
    timestamps: true,
})



const cartModel = model('Cart', cartSchema)
export default cartModel
