import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required'],
        minLength: [3, 'too short firstName'],
        maxLength: [20, 'too long firstName'],
    },
    lastName: {
        type: String,
        required: true,    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    age: {
        type: Number,
        required: true,
    },
    phone: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "User",
        emum: ["User", "Admin"]
    },
    image: {
        type: String
    },
    confirmEmail: {
        type: String,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false
    },
    wishList: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {
    timestamps: true
})



const userModel = model('User', userSchema)
export default userModel
