import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { cartAccess } from './cartAccess.js'
import { addTocart, removeFromCart, updateQuantity } from './cartCtrl.js'



router.post('/',verifyToken(cartAccess.addToCart),addTocart)
router.delete('/:itemId',verifyToken(cartAccess.removeFromCart),removeFromCart)
router.put('/:id',verifyToken(cartAccess.updateQuantity),updateQuantity)


export default router