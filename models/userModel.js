const {model,Schema, default: mongoose}=require('mongoose')
const Joi=require('joi')
const userSchema=new Schema({
name:{
    type:String,
    required:true,
    minLength:3,
    maxLength:15,
    trim:true
},
email:{
    type:String,
    required:true,
   unique:true,
    trim:true
},
password:{
    type:String,
    required:true,
    minLength:6,
    maxLength:100,
    trim:true
},
phone:{
    type:String,
    required:true
},
answer:{
    type:String,
    required:true
},
role:{
    type:String,
    default:"user"
},
address:{
    type:String,
    default:""
},
cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    }]
},{
    timestamps:true
})
function validRegister(obj){
    const schema=Joi.object({
        name:Joi.string().required().min(3).max(20),
        email:Joi.string().email(),
        password:Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        rePassword:Joi.ref('password'),
        phone:Joi.string(),
        answer:Joi.string().required().min(3).max(20),
        address:Joi.string().required().min(3).max(50),

    })
    return schema.validate(obj)
    
    }
    function loginValidation(obj){
        const schema=Joi.object({
            email:Joi.string().email(),
            password:Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        })
        return schema.validate(obj)
        }
        function validforgotPassword(obj){
            const schema=Joi.object({
                email:Joi.string().required(),
                answer:Joi.string().required(),
                newPassword:Joi.string().required()
            })
            return schema.validate(obj)
        }
const userModel=model('user',userSchema)

module.exports={userModel,validRegister,loginValidation,validforgotPassword}