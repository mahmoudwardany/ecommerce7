const jwt=require('jsonwebtoken')

function verifyToken(req,res,next){
    try {
      const decoded= jwt.verify( req.headers.authorization,process.env.SECRETKEY)
    req.user=decoded
    next()  
    } catch (error) {
res.status(401).json({message:"Invalid token"})   
    }
}
function verifyTokenAndAuthorzation(req,res,next){
   verifyToken(req,res,()=>{
    if(req.user  || req.user.role){
        next()
    }else{
        return res.status(403).json({message:"you are not allowed"})
    }
   }) 
}
function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.role === 'admin'){
            next()
        }else{
            return res.status(403).json({message:"you are not allowed"})
        }})
}
module.exports={verifyTokenAndAuthorzation,verifyTokenAndAdmin}