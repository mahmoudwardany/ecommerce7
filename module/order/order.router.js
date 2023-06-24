import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { orederAccess } from './orderAccess.js'
import { createCashOrder, getOrders, getspecificOrder, updatePaid } from './orderCtrl.js'


router.post('/:id',verifyToken(orederAccess.createOrder),createCashOrder)
router.put('/:id/pay',verifyToken(orederAccess.update),updatePaid)
router.get('/',verifyToken(orederAccess.get),getOrders)
router.get('/:id',verifyToken(orederAccess.specific),getspecificOrder)




export default router