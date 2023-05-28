const { comparePassword } = require("../../helper/hashPassword")
const { loginValidation, userModel } = require("../../models/userModel")
const JWT=require('jsonwebtoken')

const login=async(req,res)=>{
    const {email,password}=req.body
    const {error}=loginValidation({email,password})
    error&&res.status(400).json({message:error.details[0].message})
try {
    const user=await userModel.findOne({email})
    !user&&res.status(400).json({message:"Invalid email or password",success:false})
    const isValid=await comparePassword(password,user.password)
    if(!isValid){
        res.status(400).json({message:"Invalid email or password"})
    }
    const token= JWT.sign({_id:user._id,user:user.name,role:user.role},process.env.SECRETKEY,{
        expiresIn:"1d"
    })
   res.status(200).send({
    message:"Login Successful",
    token,
    user:{
        name:user.name,
        email:user.email,
        phone:user.phone,
        role:user.role,
        address:user.address
    }
   })
} catch (error) {
    
}
}
module.exports=login