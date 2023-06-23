import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { endPoint } from './userPoint.js'
import userModel from '../../models/userModel.js'
import { getAllUser, getUser } from './userCtrl.js'



router.get('/',verifyToken(endPoint.profile),getAllUser)
router.get('/:id',verifyToken(endPoint.profile),getUser)
router.delete('/:id',verifyToken(endPoint.deleteUser),getUser)



export default router