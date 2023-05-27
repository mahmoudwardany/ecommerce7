const { categoryModel, categoryModelValid } = require("../../models/categoryModel")
const slugify=require('slugify')



const createCategory=async(req,res)=>{
    const {name}=req.body
    const {error}=categoryModelValid({name})
    error&&res.status(400).json({message:error.details[0].message})
    try {
        const exsitingName= await categoryModel.findOne({name})
        exsitingName&&res.status(400).send({message:"Category Already Exsiting"})
        const category=await new categoryModel({name,slug:slugify(name)}).save()
        res.status(201).json({success:true,message:"Category Created Sucessfully",category})
    } catch (error) {
        res.status(500).send({success:false,error})
    }

    
}
const updateCategroy=async(req,res)=>{
try {
    const {name}=req.body;
    const {id}=req.params;
    const category=await categoryModel.findByIdAndUpdate(
        id,
        {name,slug:slugify(name)},
        {new: true}
        );
        res.status(200).send({
            success: true,
            messsage: "Category Updated Successfully",
            category,
          });
        } catch (error) {
    res.status(500).send({
        success:false,
        error,
        message:"Error while updating category"
    })
}
}

const getAllCategory=async(req,res)=>{
try {
    const categories= await categoryModel.find({})
    res.status(200).send({
        success:true,
        categories
    })
} catch (error) {
    res.status(500).send({
        success:false,
        error,
        message:"Error while getting all categories "
    })
}
}
const getCategory=async(req,res)=>{
    try {
        const category= await categoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success:true,
            category
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting  category "
        })
    }
    }
const deleteCategory=async(req,res)=>{
try {
    const {id}=req.params
    const category= await categoryModel.findOne({_id:id})
    if(!category){
        return res.status(404).send({
            success:false,
            message:"Category not found"
        })
    }
    const deletedCategory=await categoryModel.deleteOne({_id:id})
    res.status(200).send({
        success:true,
        message:"Category deleted successfully",
        deletedCategory
    })


} catch (error) {
    res.status(500).send({
        success:false,
        error,
        message:"Error while deleting category"
    })
}
}

module.exports={createCategory,updateCategroy,getAllCategory,getCategory,deleteCategory}

