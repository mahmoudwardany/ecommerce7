import categoryModel from "../../models/categoryModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import cloudinary from "../../cloudinary/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../models/subCategoryModel.js";

/**
 * @desc Create SubCategory
 * @route POST /api/v1/category/:categoryId/subcategory
 * @access private (Admin only)
 * @method POST
 */
export const createSubCategory = asyncHandler(async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ApiError(`Image is required`, 400));
        }

        const { categoryId } = req.params;
        const category = await categoryModel.findById(categoryId);

        if (!category) {
            return next(new ApiError(`Category Not Found`, 404));
        }

        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `ecommerce/categories/${categoryId}`
        });

        const subCategory = await subCategoryModel.create({
            name: req.body.name,
            image: secure_url,
            slug: slugify(req.body.name),
            imagePublicId: public_id,
            createdBy: req.user._id,
            categoryId
        });

        res.status(201).json({
            message: "SubCategory Created Successfully",
            subCategory
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Update SubCategory
 * @route PUT /api/v1/category/:categoryId/subcategory/:id
 * @access private (Admin only)
 * @method PUT
 */
export const updateSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const { categoryId, id } = req.params;
        const findCategory = await subCategoryModel.findById(id);

        if (req.file) {
            await cloudinary.uploader.destroy(findCategory?.imagePublicId);
            let { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: "ecommerce/categories"
            });
            req.body.image = secure_url;
            req.body.imagePublicId = public_id;
        }

        if (req.body.name) {
            req.body.slug = slugify(req.body.name);
        }

        const subCategory = await subCategoryModel.findByIdAndUpdate({ _id: id, categoryId }, req.body, { new: true });

        if (subCategory) {
            res.status(200).json({
                message: "SubCategory Updated Successfully",
                subCategory
            });
        } else {
            await cloudinary.uploader.destroy(req.body.imagePublicId);
            next(new ApiError(`Failed to update SubCategory`, 400));
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get All SubCategories
 * @route GET /api/v1/category/:categoryId/subcategory
 * @access public
 * @method GET
 */
export const getAllSubCategories = asyncHandler(async (req, res, next) => {
    try {
        const subCategories = await subCategoryModel.find({ categoryId: req.params.categoryId }).populate({
            path: "createdBy",
            select: "userName email"
        });

        res.status(200).json({
            count: subCategories.length,
            subCategories
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get One SubCategory
 * @route GET /api/v1/category/:categoryId/subcategory/:id
 * @access public
 * @method GET
 */
export const getSubCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const subCategory = await subCategoryModel.findById(id).populate({
            path: "createdBy",
            select: "userName email"
        });

        if (!subCategory) {
            return next(new ApiError(`SubCategory Not Found`, 404));
        }

        res.status(200).json({
            subCategory
        });
    } catch (error) {
        next(error);
    }
});
