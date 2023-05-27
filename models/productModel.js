const Joi = require('joi')
const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,

    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:"category",
        required:true
    },
    photo:{
        data: Buffer,
        contentType:String,
    },
    quantity:{
        type:Number,
        required:true,
        default:0
    },
    shipping:{
        type:Boolean
    }
},{
    timestamps:true
})
function ProductModelValid(obj){
    const schema=Joi.object({
        name:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required(),
        category:Joi.string().required(),
        quantity:Joi.number().required(),
        shipping:Joi.boolean().required()
    })
    return schema.validate(obj)
}
const productModel=mongoose.model('product',productSchema)

module.exports={productModel,ProductModelValid}