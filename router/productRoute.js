const router = require('express').Router()
const { createProduct, getAllProduct, getOneProduct, deleteProduct, getPhoto, updateProduct, filterProducts, productCountController, productPerPage, searchProduct, relatedProduct, getProductsByCategory, addToCart, braintreeToken, braintreePayment } = require('../controller/product/productController.js');
const {  verifyTokenAndAdmin, verifyTokenAndAuthorzation } =require ("../middleware/protectRouter.js");
const formidable = require('express-formidable')

router.post('/create-product',formidable(),createProduct)
router.put('/update-product/:pid',formidable(),updateProduct)

router.get('/',getAllProduct)
router.get('/:slug',getOneProduct)
router.get('/get-photo/:pid',getPhoto)
router.get('/search/:keyword',searchProduct)
router.get('/related-product/:pid/:cid',relatedProduct)
router.get('/product-category/:slug',getProductsByCategory)
//payment
router.get('/braintree/token',braintreeToken)
router.post("/payment", verifyTokenAndAuthorzation,braintreePayment);

//product count
router.get("/product-count", productCountController);


//product per page
router.get("/product-list/:page", productPerPage);


router.post('/filter-product/',filterProducts)

// router.post('/:id/cart',addToCart)

router.delete('/:pid',deleteProduct)





module.exports=router