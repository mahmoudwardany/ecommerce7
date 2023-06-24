import { Schema, model } from 'mongoose'

const reviewSchema = new Schema({
    text: {
        type: String,
        required: [true, 'userName is required'],
        minLength: [10, 'too short userName'],
        maxLength: [2000, 'too long userName'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    ratingAverage: {
        type: Number,
        min: [1, 'Rating Average must be greater than 1'],
        max: [5, 'Rating Average must be less than 5'],
    },
}, {
    timestamps: true
})
const reviewModel = model('Review', reviewSchema)
export default reviewModel