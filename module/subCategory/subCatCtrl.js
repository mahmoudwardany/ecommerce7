import categoryModel from "../../models/categoryModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import cloudinary from "../../cloudinary/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../models/subCategoryModel.js";


export const createSubCategory=asyncHandler(async(req,res,next)=>{
if(!req.file){
    next(new ApiError(`Image is required`,400))
}else{
    const {categoryId} =req.params;
    const category=await categoryModel.findById(categoryId)
    console.log(categoryId)
    if(!category){
        next(new ApiError(`Category Not Found`,404))
    }else{
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`ecommerce/categories/${categoryId}`
    })
    const subCategory = await subCategoryModel.create({
        name: req.body.name,
        image:secure_url,
        slug:slugify(req.body.name),
        imagePublicId:public_id,
        createdBy:req.user._id,
        categoryId
    })
    res.status(201).json({
        message:"subCategory Created Successfully",
        subCategory
    })
    }
}
})
export const updateSubCategory=asyncHandler(async(req,res,e)=>{
    const {categoryId,id} =req.params
    const findCategory=await subCategoryModel.findById(id)
    if(req.file){
        await cloudinary.uploader.destroy(findCategory?.imagePublicId)
        let {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,
            {
                folder:"ecommerce/categories"
            }
            )
        req.body.image=secure_url;
        req.body.imagePublicId=public_id
    }
    if(req.body.name){
        req.body.slug=slugify(req.body.name)
    }
    const subCategory = await subCategoryModel.findByIdAndUpdate({_id:id,categoryId},(req.body),{new:true})
    if (subCategory) {
    res.status(200).json({
        message:"subCategory Updated Successfully",
        subCategory
    })
    } else {
        await cloudinary.uploader.destroy(req.body.imagePublicId)
            next(new ApiError(`Failde to update SubCategory`,400))
    }
    })

    export const getAllSubCategories=asyncHandler(async(req,res)=>{
        const subCategory=await subCategoryModel.find({}).populate([
            {
                path:"createdBy",
                select:"userName email "
            }
        ])
        res.status(200).json({
            count:subCategory.length,
            subCategory
        })
    })
    export const getSubCategory=asyncHandler(async(req,res)=>{
        const {id}=req.params;
        const subCategory=await subCategoryModel.findById(id).populate([
            {
                path:"createdBy",
                select:"userName email "
            }
        ])
        res.status(200).json({
            subCategory
        })
    })
