import {Router} from 'express'
import { confirmEmail, logInCtrl, signupCtrl } from './authCtrl.js'
import { validationMiddleware } from '../../middlewares/validation.middleware.js'
import { signInValidation, signupValidation, tokenValidation } from './auth.validation.js'
const router=Router()

router.post('/register',validationMiddleware(signupValidation),signupCtrl)
router.get('/confirm-email/:token',validationMiddleware(tokenValidation),confirmEmail)
router.post('/login',validationMiddleware(signInValidation),logInCtrl)


export default router