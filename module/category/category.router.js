import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { categoryAccess } from './categoryAccess.js'
import { createCategory, getAllCategories, getCategory, updateCategory } from './categoryCtrl.js'
import {multerValidation, myMulter} from '../../cloudinary/multerCloud.js'
import  subCategoryRouter  from '../subCategory/subCat.router.js'

router.use('/:categoryId/subcategory',subCategoryRouter)
router.post('/',verifyToken(categoryAccess.add),myMulter(multerValidation.image).single('image'),createCategory)
router.put('/:id',verifyToken(categoryAccess.add),myMulter(multerValidation.image).single('image'),updateCategory)
router.get('/',getAllCategories)
router.get('/:id',getCategory)



export default router