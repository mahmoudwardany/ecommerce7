import brandModel from "../../models/brandModel.js";
import productModel from "../../models/productModel.js";
import subCategoryModel from "../../models/subCategoryModel.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import cloudinary from "../../cloudinary/cloudinary.js";
import slugify from "slugify";
import ApiError from "../../utils/apiError.js";

/**
 * @desc Create Product
 * @route POST /api/v1/product/
 * @access private (Admin Only)
 * @method POST
 */
export const createProduct = asyncHandler(async (req, res, next) => {
    try {
        if (!req.files?.length) {
            return next(new ApiError(`Image is required`, 400));
        }

        const { title, amount, discount, price, subCategoryId, categoryId, brandId } = req.body;
        if (title) {
            req.body.slug = slugify(title);
        }
        req.body.stock = amount;
        // Calculate final price
        req.body.finalPrice = price - (price * ((discount || 0) / 100));

        // Find category and subCategory
        const category = await subCategoryModel.findOne({ _id: subCategoryId, categoryId });
        if (!category) {
            return next(new ApiError(`Invalid Category Id: Not Found`, 404));
        }

        // Find Brand
        const brand = await brandModel.findOne({ _id: brandId });
        if (!brand) {
            return next(new ApiError(`Invalid Brand Id: Not Found`, 404));
        }

        // Upload array of images to cloudinary
        const images = [];
        const imagePublicId = [];
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `ecommerce/products` });
            images.push(secure_url);
            imagePublicId.push(public_id);
        }
        req.body.images = images;
        req.body.imagePublicId = imagePublicId;
        req.body.createdBy = req.user._id;

        // Create product
        const product = await productModel.create(req.body);
        res.status(201).json({ message: "Product Created Successfully", product });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Update Product
 * @route PUT /api/v1/product/:id
 * @access private (Admin Only)
 * @method PUT
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return next(new ApiError(`Product Not found`, 404));
        }

        const { title, amount, discount, price, subCategoryId, categoryId, brandId } = req.body;
        if (title) {
            req.body.slug = slugify(title);
        }

        if (amount) {
            const calcStock = amount - product.soldItems;
            calcStock > 0 ? (req.body.stock = calcStock) : (req.body.stock = 0);
        }

        if (price && discount) {
            req.body.finalPrice = price - (price * ((discount || 0) / 100));
        } else if (price) {
            req.body.finalPrice = price - (price * ((product.discount || 0) / 100));
        } else if (discount) {
            req.body.finalPrice = product.price - (product.price * ((discount || 0) / 100));
        }

        // Find category and subCategory
        const category = await subCategoryModel.findOne({ _id: subCategoryId, categoryId });
        if (!category) {
            return next(new ApiError(`Invalid Category Id: Not Found`, 404));
        }

        // Find Brand
        const brand = await brandModel.findOne({ _id: brandId });
        if (!brand) {
            return next(new ApiError(`Invalid Brand Id: Not Found`, 404));
        }

        // Update Images
        const images = [];
        const imagePublicId = [];
        if (req.files?.length) {
            for (const file of req.files) {
                await cloudinary.uploader.destroy(product?.imagePublicId);
                let { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: "ecommerce/products",
                });
                images.push(secure_url);
                imagePublicId.push(public_id);
            }
        }
        req.body.images = images;
        req.body.imagePublicId = imagePublicId;
        req.body.createdBy = req.user._id;

        // Update product
        const updatedProduct = await productModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        res.status(200).json({
            message: "Product Updated Successfully",
            updatedProduct,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get All Products
 * @route GET /api/v1/product/
 * @access public
 * @method GET
 */
export const getProducts = asyncHandler(async (req, res) => {
    try {
        let products;
        let numPerPage = 3;
        const { pageNumber } = req.query;
        if (pageNumber) {
            products = await productModel
                .find()
                .skip((pageNumber - 1) * numPerPage)
                .limit(numPerPage)
                .sort({ createdAt: -1 });
        } else {
            products = await productModel.find().sort({ createdAt: -1 });
        }
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get Product by ID
 * @route GET /api/v1/product/:id
 * @access public
 * @method GET
 */
export const getProduct = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return next(new ApiError(`Product Not Found in ${id}`, 404));
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});
