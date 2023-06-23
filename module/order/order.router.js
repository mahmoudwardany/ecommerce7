import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { orederAccess } from './orderAccess.js'
import { createCashOrder } from './orderCtrl.js'


router.post('/:id',verifyToken(orederAccess.createOrder),createCashOrder)




export default router