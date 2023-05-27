const {model,Schema}=require('mongoose')
const Joi=require('joi')

const categorySchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true
    }
})
function categoryModelValid(obj){
    const schema=Joi.object({
        name:Joi.string().required(),
    })
    return schema.validate(obj)
}
const categoryModel=model('category',categorySchema)

module.exports={categoryModel,categoryModelValid}