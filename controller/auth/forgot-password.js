const { hashPassword } = require("../../helper/hashPassword")
const { validforgotPassword, userModel } = require("../../models/userModel")


const forgotPassword=async(req,res)=>{
    const {email,answer,newPassword}=req.body
    const {error}=validforgotPassword({email,answer,newPassword})
    error&&res.status(400).json({message:error.details[0].message})

    try {
        const user = await userModel.findOne({email})
        !user && res.status(400).send({
            success:false,
            message:"Wrong Email or Answer"
        })
        const hashNewPassword=await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashNewPassword})
        res.status(200).send({
            success:true,
            message:"Password Changed Successfully"
        })

    } catch (error) {
        res.status(400).send({
            success:false,
            message:"Something Went Wrong"
        })
    }
}
module.exports=forgotPassword