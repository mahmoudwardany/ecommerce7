import multer  from 'multer'

//fs


export const multerValidation={
image:["image/png","image/jpeg","image/jif"]
}
// export const HME=(error,req,res,next)=>{
//     if(error){
//         res.json({message:"multer error",error})
//     }else{
//         next()
//     }
// }
export const myMulter=(validationCustom=multerValidation)=>{
    const storage= multer.diskStorage({})
function fileFilter(req,file,cb){
if(validationCustom.includes(file.mimetype)){
    cb(null,true)
}else{
    cb('invalid format',false)
}
}
const upload=multer({dest:`upload`,fileFilter,storage})
return upload
}
