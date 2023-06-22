import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { endPoint } from './userPoint.js'
import userModel from '../../models/userModel.js'



router.get('/',verifyToken(endPoint.profile),async(req,res)=>{
    const user=await userModel.findById(req.user._id).populate('wishList')
    res.send({data:user})
})



export default router