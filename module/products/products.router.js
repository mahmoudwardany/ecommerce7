import { Router } from 'express'
const router = Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { multerValidation, myMulter } from '../../cloudinary/multerCloud.js'
import { createProduct, getProducts, updateProduct } from './productsCtrl.js'
import productAccess from './productAccess.js'


router.post('/', verifyToken(productAccess.add), myMulter(multerValidation.image).array('images', 5), createProduct)
router.put('/:id', verifyToken(productAccess.update), myMulter(multerValidation.image).array('images', 5), updateProduct)


router.get('/', getProducts)





export default router