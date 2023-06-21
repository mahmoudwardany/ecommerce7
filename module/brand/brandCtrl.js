import categoryModel from "../../models/categoryModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import cloudinary from "../../cloudinary/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../models/subCategoryModel.js";
import brandModel from "../../models/brandModel.js";


export const createBrand=asyncHandler(async(req,res,next)=>{
if(!req.file){
    next(new ApiError(`Image is required`,400))
}else{
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`ecommerce/brand`
    })
    const brand = await brandModel.create({
        name: req.body.name,
        image:secure_url,
        slug:slugify(req.body.name),
        imagePublicId:public_id,
        createdBy:req.user._id,
    })
    res.status(201).json({
        message:"subCategory Created Successfully",
        brand
    })
    }

})
export const updateBrand=asyncHandler(async(req,res,e)=>{
    const {id} =req.params
    const findBrand=await brandModel.findById(id)
    if(req.file){
        await cloudinary.uploader.destroy(findBrand?.imagePublicId)
        let {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,
            {
                folder:"ecommerce/brand"
            }
            )
        req.body.image=secure_url;
        req.body.imagePublicId=public_id
    }
    if(req.body.name){
        req.body.slug=slugify(req.body.name)
    }
    const brand = await brandModel.findByIdAndUpdate({_id:id},(req.body),{new:true})
    if (brand) {
    res.status(200).json({
        message:"Brand Updated Successfully",
        brand
    })
    } else {
        await cloudinary.uploader.destroy(req.body.imagePublicId)
            next(new ApiError(`Failde to update brand`,400))
    }
    })


    export const getAllBrand=asyncHandler(async(req,res)=>{
        const brand=await brandModel.find({}).populate([
            {
                path:"createdBy",
                select:"userName email "
            }
        ])
        res.status(200).json({
            count:brand.length,
            brand
        })
    })
    export const getBrand=asyncHandler(async(req,res)=>{
        const {id}=req.params;
        const brand=await brandModel.findById(id).populate([
            {
                path:"createdBy",
                select:"userName email "
            }
        ])
        res.status(200).json({
            brand
        })
    })
