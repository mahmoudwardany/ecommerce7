import {Router} from 'express'
const router=Router()
import { verifyToken } from '../../middlewares/authorization.js'
import { endPoint } from './userPoint.js'



router.get('/',verifyToken(endPoint.profile),(req,res)=>{
    res.send({message:req.user})
})



export default router