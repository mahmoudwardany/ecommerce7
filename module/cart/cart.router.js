import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { cartAccess } from './cartAccess.js'
import { addToCart, applyCoupon, getUserCart, removeFromCart, updateQuantity } from './cartCtrl.js'



router.post('/',verifyToken(cartAccess.addToCart),addToCart)
router.get('/',verifyToken(cartAccess.addToCart),getUserCart)
router.delete('/:itemId',verifyToken(cartAccess.removeFromCart),removeFromCart)
router.put('/:id',verifyToken(cartAccess.updateQuantity),updateQuantity)
router.post('/applyCoupon',verifyToken(cartAccess.addToCart),applyCoupon)


export default router