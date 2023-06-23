import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { endPoint } from './userPoint.js'
import userModel from '../../models/userModel.js'
import { deleteUser, getAllUser, getUser } from './userCtrl.js'



router.get('/',verifyToken(endPoint.profile),getAllUser)
router.get('/:id',verifyToken(endPoint.profile),getUser)
router.delete('/:id',verifyToken(endPoint.deleteUser),deleteUser)



export default router