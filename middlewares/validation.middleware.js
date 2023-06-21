const dataMethod=['body','params','headers','query']

export const validationMiddleware=(schema)=>{
    return (req,res,next)=>{
    let errorArr=[]
    dataMethod.forEach(key=>{
        if(schema[key]){
        
            const validationResult=schema[key].validate(req[key])
            if (validationResult?.error) {
            errorArr.push(validationResult)
        }
        }
    })  
    if(errorArr.length){
        res.status(400).json({
            message:"Validation Error",
            error:errorArr
        })
    } else{
            next()  
    }   
    }
}