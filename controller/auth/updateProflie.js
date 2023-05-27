const { userModel } = require("../../models/userModel")
const  {hashPassword} = require("../../helper/hashPassword")

const updateProfile=async(req,res)=>{
    try {
        const { email , name , password , phone,address}=req.body
        const user = await userModel.findById(req.user._id)
        if(!password &&password.length < 6 ){
  res.status(400).send({message:"Password Must be More than 6 char"})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser=await userModel.findByIdAndUpdate(req.user._id,{
  name:name || user.name,
  password:hashedPassword || user.password,
  phone:phone || user.phone,
  address:address || user.address
  },{
    new:true
  })
  res.status(200).send({
    success:true,
    updatedUser,
    message:"Profile Updated Successfully"
  })
        
    } catch (error) {
        res.status(500).send({
            message:error.message,
            success:false
        })
    }
  }
  
  module.exports=updateProfile