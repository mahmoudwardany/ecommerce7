import {Router} from 'express'
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from './couponCtrl.js'
import { verifyToken } from '../../middlewares/authorization.js'
import { couponAccess } from './couponAccess.js'

const router=Router()

router.post("/",verifyToken(couponAccess.add),createCoupon)
router.get('/',getCoupons)
router.put('/:id',verifyToken(couponAccess.updateCoupon),updateCoupon)
router.delete('/:id',verifyToken(couponAccess.deleteCoupon),deleteCoupon)



export default router