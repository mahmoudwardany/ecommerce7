import {Router} from 'express'
import { createCoupon, deleteCoupon, updateCoupon } from './couponCtrl.js'
import { verifyToken } from '../../middlewares/authorization.js'
import { couponAccess } from './couponAccess.js'

const router=Router()


router.post('/',verifyToken(couponAccess.add),createCoupon)
router.put('/:id',verifyToken(couponAccess.add),updateCoupon)
router.delete('/:id',verifyToken(couponAccess.add),deleteCoupon)



export default router