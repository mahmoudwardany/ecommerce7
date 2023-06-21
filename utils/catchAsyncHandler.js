import ApiError from "./apiError.js"

export const asyncHandler=fn=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>{
            next(new ApiError(err.message,500))

        })
    }
}
