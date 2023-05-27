const bcrypt=require('bcryptjs')


const hashPassword=async(password)=>{
    try {
        const round=8
        const hashedPassword=await bcrypt.hash(password,round)
        return hashedPassword
    } catch (error) {
        res.status(400).json({error})
    }
}

const comparePassword=async(password,hashedPassword)=>{
return bcrypt.compare(password,hashedPassword)
}


module.exports={hashPassword,comparePassword}