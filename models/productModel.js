import { Schema, model, Types } from "mongoose";


const productSchema = new Schema({

    title: {
        type: String,
        required: [true, 'title is required'],
        unique: [true, 'product title must be unique'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        trim: true
    },
    slug: String,
    description: String,
    images: [String],
    imagePublicId: [String],
    stock: {
        type: Number,
        default: 0
    },
    soldItems: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        default: 0
    },
    colors: {
        type: [String],
    },
    size: {
        type: [String],
        enum: ['s', 'm', 'l', 'xl']
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'product owner is required']
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "Category"
    },

    subCategoryId: {
        type: Types.ObjectId,
        ref: "Subcategory"
    },
    brandId: {
        type: Types.ObjectId,
        ref: "Brand"
    },
},  {
    timestamps: true,
})




const productModel = model('Product', productSchema)
export default productModel