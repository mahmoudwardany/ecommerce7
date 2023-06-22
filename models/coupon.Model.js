import {Schema,model} from'mongoose'

const couponSchema=new Schema({
name:{
    type:String,
    required:[true,'name is required'],
    minLength:[2,'too short name'],
    maxLength:[50,'too long userName'],
    unique:true,
    trim:true
},
createdBy:{
    type:Schema.Types.ObjectId,
    required:[true,'createdBy is required'],
    ref:"User"
},
usedBy:[{
    type:Schema.Types.ObjectId,
    ref:"User"
}],
expireDate:String,
amount:{
    type:Number,
    default:1,
    max:[100,'max is 100%'],
    min:[1,'min is 100%'],
}
},{
    timestamps:true
})

const couponModel=model('Coupon',couponSchema)
export default couponModel
