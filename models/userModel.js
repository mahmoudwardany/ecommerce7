import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'userName is required'],
        minLength: [3, 'too short userName'],
        maxLength: [20, 'too long userName'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'email must be unique']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
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
    DDB: String,
    wishList: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {
    timestamps: true
})



const userModel = model('User', userSchema)
export default userModel
