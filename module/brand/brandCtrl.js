import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import cloudinary from "../../cloudinary/cloudinary.js";
import slugify from "slugify";
import brandModel from "../../models/brandModel.js";

/**
 * @desc Create Brand
 * @route POST /api/v1/brand/
 * @access private (Admin Only)
 */
export const createBrand = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ApiError(`Image is required`, 400));
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `ecommerce/brand`
    });

    const brand = await brandModel.create({
        name: req.body.name,
        image: secure_url,
        slug: slugify(req.body.name),
        imagePublicId: public_id,
        createdBy: req.user._id,
    });

    res.status(201).json({
        message: "Brand Created Successfully",
        brand
    });
});

/**
 * @desc Update Brand
 * @route PUT /api/v1/brand/:id
 * @access private (Admin Only)
 */
export const updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const findBrand = await brandModel.findById(id);

    if (req.file) {
        await cloudinary.uploader.destroy(findBrand?.imagePublicId);
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: "ecommerce/brand"
        });
        req.body.image = secure_url;
        req.body.imagePublicId = public_id;
    }

    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    }

    const brand = await brandModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });

    if (brand) {
        res.status(200).json({
            message: "Brand Updated Successfully",
            brand
        });
    } else {
        await cloudinary.uploader.destroy(req.body.imagePublicId);
        next(new ApiError(`Failed to update brand`, 400));
    }
});

/**
 * @desc Get All Brands
 * @route GET /api/v1/brand/
 * @access public
 */
export const getAllBrand = asyncHandler(async (req, res) => {
    const brands = await brandModel.find({}).populate([
        {
            path: "createdBy",
            select: "userName email"
        }
    ]);

    res.status(200).json({
        count: brands.length,
        brands
    });
});

/**
 * @desc Get One Brand
 * @route GET /api/v1/brand/:id
 * @access Public
 */
export const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const brand = await brandModel.findById(id).populate([
        {
            path: "createdBy",
            select: "userName email"
        }
    ]);

    res.status(200).json({
        brand
    });
});
