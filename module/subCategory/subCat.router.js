import {Router} from 'express'
const router=Router({mergeParams:true})
import { verifyToken } from '../../middlewares/authorization.js'
import { subcategoryAccess } from './subcategoryAccess.js'
import {multerValidation, myMulter} from '../../cloudinary/multerCloud.js'
import { createSubCategory, getAllSubCategories, getSubCategory, updateSubCategory } from './subCatCtrl.js'

router.post('/',verifyToken(subcategoryAccess.add),myMulter(multerValidation.image).single('image'),createSubCategory)
router.put('/:id',verifyToken(subcategoryAccess.add),myMulter(multerValidation.image).single('image'),updateSubCategory)
router.get('/',getAllSubCategories)
router.get('/:id',getSubCategory)
export default router