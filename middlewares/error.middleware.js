export const globalHandlerError=(err,req,res,next)=>{
    err.status=err.status || "error"
    err.statusCode=err.statusCode || 500
    if(process.env.NODE_ENV==='DEV'){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
            stack:err.stack
        })
    }else{
        res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    })  
    }
}