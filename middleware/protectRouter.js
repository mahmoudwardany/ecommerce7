const jwt=require('jsonwebtoken')

function verifyToken(req,res,next){
    try {
      const decoded= jwt.verify( req.headers.authorization,process.env.SECRETKEY)
    req.user=decoded
    next()  
    } catch (error) {
res.status(401).send({message:"Invalid token"})   
    }
}
function verifyTokenAndAuthorzation(req,res,next){
   verifyToken(req,res,()=>{
    if(req.user  || req.user.role){
        next()
    }else{
        return res.status(403).send({message:"you are not allowed"})
    }
   }) 
}
function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.role === 'admin'){
            next()
        }else{
            return res.status(403).send({message:"you are not allowed"})
        }})
}
module.exports={verifyTokenAndAuthorzation,verifyTokenAndAdmin}