import { Schema, model } from 'mongoose'

const couponSchema = new Schema({
        code: {
            type: String,
            required: [true, "coupon code required"],
            trim: true,
            unique: [true, "coupon code unique"],
        },
        expires: {
            type: Date,
        },

        discount: {
            type: Number,
        },
    }, {
    timestamps: true
})

const couponModel = model('Coupon', couponSchema)
export default couponModel
