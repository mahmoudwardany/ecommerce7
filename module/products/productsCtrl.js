import brandModel from "../../models/brandModel.js";
import productModel from "../../models/productModel.js";
import subCategoryModel from "../../models/subCategoryModel.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";
import cloudinary from "../../cloudinary/cloudinary.js";
import slugify from "slugify";
import ApiError from "../../utils/apiError.js";

/**--------------------------------
 * @desc Create Product
 * @router /api/v1/product/
 * @access private (Admin Only)
 * @method Post
 */
export const createProduct = asyncHandler(
    async (req, res, next) => {
        if (!req.files?.length) {
            next(new ApiError(`Image is required`, 400))
        } else {
            const { title, amount, discount, price, subCategoryId, categoryId, brandId } = req.body;
            if (title) {
                req.body.slug = slugify(title)
            }
            req.body.stock = amount
            //calc final price
            req.body.finalPrice = price - (price * ((discount || 0) / 100))
            //find category and subCategory
            const category = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
            if (!category) { return next(new ApiError(`Invalid Category Id: Not Found`, 404)) }
            //find Brand
            const brand = await brandModel.findOne({ _id: brandId })
            if (!brand) { return next(new ApiError(`Invalid Brand Id: Not Found`, 404)) }
            //upload array of image to cloud
            const images = []
            const imagePublicId = []
            for (const file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `ecommerce/products` })
                images.push(secure_url)
                imagePublicId.push(public_id)
            }
            req.body.images = images
            req.body.imagePublicId = imagePublicId
            req.body.createdBy = req.user._id
            //create product
            const product = await productModel.create(req.body)
            console.log(product)
            res.status(201).json({ message: "Product Created Successfully", product })
        }
    }
)
/**--------------------------------
 * @desc Update Product
 * @router /api/v1/product/:id
 * @access private (Admin Only)
 * @method Put
 */
export const updateProduct = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const product = await productModel.findById(id)
        if (!product) {
            next(new ApiError(`Product Not found`, 404))
        }
        const { title, amount, discount, price, subCategoryId, categoryId, brandId } = req.body;
        if (title) {
            req.body.slug = slugify(title)
        }
        if (amount) {
            const calcStock = amount - product.soldItems;
            calcStock > 0 ? req.body.stock = calcStock : req.body.stock = 0
        }
        if (price & discount) {
            req.body.finalPrice = price - (price * ((discount || 0) / 100))
        } else if (price) {
            req.body.finalPrice = price - (price * ((product.discount || 0) / 100))
        } else if (discount) {
            req.body.finalPrice = product.price - (product.price * ((discount || 0) / 100))
        }
        //find category and subCategory
        const category = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
        if (!category)  return next(new ApiError(`Invalid Category Id: Not Found`, 404)) 
        //find Brand
        const brand = await brandModel.findOne({ _id: brandId })
        if (!brand) { return next(new ApiError(`Invalid Brand Id: Not Found`, 404)) }
        //update Images
        const images = []
        const imagePublicId = []
        if (req.files?.length) {
            for (const file of req.files) {
                await cloudinary.uploader.destroy(product?.imagePublicId)
                let { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
                    {
                        folder: "ecommerce/products"
                    }
                )
                images.push(secure_url)
                imagePublicId.push(public_id)
            }
        }
        req.body.images = images
        req.body.imagePublicId = imagePublicId
        req.body.createdBy = req.user._id
        //update product
        const updateProduct = await productModel.findByIdAndUpdate({ _id: id }, (req.body), { new: true })
        res.status(200).json({
            message: "Product Updated Successfully",
            updateProduct
        })
    })
/**--------------------------------
* @desc Get All Products
* @router /api/v1/product/
* @access public 
* @method Get
*/
export const getProducts = asyncHandler(
    async (req, res) => {
        let products;
        let numPerPage = 3;
        const { pageNumber } = req.query
        if (pageNumber) {
            products = await productModel.find()
                .skip((pageNumber - 1) * numPerPage)
                .limit(numPerPage)
                .sort({ createdAt: -1 })
        } else {
            products = await productModel.find().sort({ createdAt: -1 })
        }
        res.status(200).json(products)
    })

/**--------------------------------
* @desc Get All Products
* @router /api/v1/product/:id
* @access public 
* @method Get
*/
export const getProduct = asyncHandler(
    async (req, res,next) => {
        const { id } = req.params
        const product = await productModel.findById(id)
        if(!product)   return next(new ApiError(`Product Not Found in ${id}`, 404))
        res.status(200).json(product)
    })
