import { Schema, model } from 'mongoose'

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'UserId is required'],
        ref: "User",
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
        },
        priceUnit:{
            type:Number
        }, 
        totalPrice:{
            type:Number,
            default:0
        },
    }],
    totalPrice:{
type:Number,
default:0
    },
    address:String,
    phone:String,
    couponId:{
        type:Schema.Types.ObjectId,
        ref:"Coupon"
    },
    status:{
        type:String,
        enum:['pending',"placed","onWay","recived","rejected"],
        default:"pending"
    },
    paymentMethod:{
        type:String,
        default:"Cash",
        enum:["Cash","Visa"]
    }
}, {
    timestamps: true,
})



const orederModel = model('Order', orderSchema)
export default orederModel
