import { Schema, model } from 'mongoose'

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    cartItems: [{
        product: {
            type: Schema.Types.ObjectId,
            required: [true, 'ProductId is required'],
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1,
        },
        totalPrice: {
            type: Number
        },
        totalPrice: {
            type: Number,
            default: 0
        },
    }],
    totalOrderPrice: {
        type: Number,
        default: 0
    },
    shippingAddress:{
        details:String,
        phone:Number,
        city:String
    } ,
    paidAt: Date,
    status: {
        type: String,
        enum: ['pending', "placed", "onWay", "recived", "rejected"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        default: "Cash",
        enum: ["Cash", "Visa"]
    },
    isPaid: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})



const orderModel = model('Order', orderSchema)
export default orderModel
