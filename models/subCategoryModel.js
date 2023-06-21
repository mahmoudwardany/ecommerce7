import {Schema,model} from'mongoose'

const subcategorySchema=new Schema({
name:{
    type:String,
    required:[true,'name is required'],
    minLength:[3,'too short name'],
    maxLength:[20,'too long userName'],
    unique:true
},
slug:String,
image:{
    type:String,
},
imagePublicId:String,
createdBy:{
    type:Schema.Types.ObjectId,
    required:[true,'createdBy is required'],
    ref:"User"
},
categoryId:{
    type:Schema.Types.ObjectId,
    ref:"Category"
}
},{
    timestamps:true
})



const subCategoryModel=model('Subcategory',subcategorySchema)
export default subCategoryModel
