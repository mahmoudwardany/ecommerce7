import {Router} from 'express'
import { verifyToken } from '../../middlewares/authorization.js'
import { addToWishList, removeFromWishList } from './wishlistCtrl.js'
import wishListAccess from './wishListAccess.js'

const router=Router({mergeParams:true})


router.patch('/add',verifyToken(wishListAccess.add),addToWishList)
router.delete('/remove',verifyToken(wishListAccess.delete),removeFromWishList)




export default router