import {Router} from 'express'
import { reviewAccess } from './reviewAccess.js'
import { verifyToken } from '../../middlewares/authorization.js'
import { createReview, deleteReview, getReview, getReviews, updateReview } from './reviewsCtrl.js'
const router=Router()


router.post('/:id',verifyToken(reviewAccess.add),createReview)
router.get('/',getReviews)
router.get('/:id',getReview)
router.put('/:id',verifyToken(reviewAccess.update),updateReview)
router.delete('/:id',verifyToken(reviewAccess.delete),deleteReview)




export default router