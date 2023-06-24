import {Router} from 'express'
const router=Router({mergeParams:true})
import { verifyToken } from '../../middlewares/authorization.js'
import { brandAccess } from './brandAccess.js'
import {multerValidation, myMulter} from '../../cloudinary/multerCloud.js'
import { createBrand, getAllBrand, getBrand, updateBrand } from './brandCtrl.js'

router.post('/',verifyToken(brandAccess.add),myMulter(multerValidation.image).single('image'),createBrand)
router.put('/:id',verifyToken(brandAccess.update),myMulter(multerValidation.image).single('image'),updateBrand)
router.get('/',getAllBrand)
router.get('/:id',getBrand)
export default router