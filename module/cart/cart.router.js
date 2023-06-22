import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { cartAccess } from './cartAccess.js'
import { addTocart } from './cartCtrl.js'



router.post('/',verifyToken(cartAccess.addToCart),addTocart)


export default router