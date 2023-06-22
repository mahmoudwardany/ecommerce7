import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { orederAccess } from './orderAccess.js'
import { createOrder } from './orderCtrl.js'


router.post('/',verifyToken(orederAccess.createOrder),createOrder)




export default router