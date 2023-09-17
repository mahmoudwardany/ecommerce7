import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import cloudinary from "../../cloudinary/cloudinary.js";
import slugify from "slugify";
import categoryModel from "../../models/categoryModel.js";

// Create Category
/**--------------------------------
 * @desc Create Category
 * @route /api/v1/category/
 * @access private (Admin Only)
 * @method Post
 */
export const createCategory = asyncHandler(async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ApiError(`Image is required`, 400));
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `e-commerce/categories`,
        });
        const category = await categoryModel.create({
            name: req.body.name,
            image: secure_url,
            slug: slugify(req.body.name),
            imagePublicId: public_id,
            createdBy: req.user._id,
        });

        res.status(201).json({
            message: "Category Created Successfully",
            category,
        });
    } catch (error) {
        next(error);
    }
});

// Update Category
/**--------------------------------
 * @desc Update Category
 * @route /api/v1/category/:id
 * @access private (Admin Only)
 * @method Put
 */
export const updateCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const categoryId = await categoryModel.findById(id);
        if (req.file) {
            await cloudinary.uploader.destroy(categoryId?.imagePublicId);
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
                folder: "ecommerce/categories",
            });
            req.body.image = secure_url;
            req.body.imagePublicId = public_id;
        }
        if (req.body.name) {
            req.body.slug = slugify(req.body.name);
        }
        const category = await categoryModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        res.status(200).json({
            message: "Category Updated Successfully",
            category,
        });
    } catch (error) {
        next(error);
    }
});

// Get All Categories
/**--------------------------------
 * @desc Get All Category
 * @route /api/v1/category/
 * @access public 
 * @method Get
 */
export const getAllCategories = asyncHandler(async (req, res, next) => {
    try {
        const categories = await categoryModel.find({}).populate([
            {
                path: "createdBy",
                select: "userName email",
            },
            {
                path: "subCategory",
                select: "name image categoryId",
            },
        ]);
        res.status(200).json({
            count: categories.length,
            categories,
        });
    } catch (error) {
        next(error);
    }
});

// Get One Category
/**--------------------------------
 * @desc Get One Category
 * @route /api/v1/category/:id
 * @access public 
 * @method Get
 */
export const getCategory = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id).populate([
            {
                path: "createdBy",
                select: "userName email",
            },
        ]);

        res.status(200).json({
            category,
        });
    } catch (error) {
        next(error);
    }
});
