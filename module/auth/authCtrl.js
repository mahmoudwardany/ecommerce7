import userModel from '../../models/userModel.js'
import  {asyncHandler} from '../../utils/catchAsyncHandler.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { sendMail } from '../../utils/sendEmail.js';
import ApiError from '../../utils/apiError.js';

/**--------------------------------
 * @desc Register New User
 * @router /api/v1/auth/register
 * @access public
 * @method POST
 */

export const signupCtrl = asyncHandler(async (req, res,next) => {
        const { userName, email, password } = req.body;
        const findUser = await userModel.findOne({ email }).select("email")
        if (findUser) {
            next(new ApiError(`Email Already Exist`,409))
        }else{
            const hashPassword=bcrypt.hashSync(password,++process.env.SALT);
            const newUser=new userModel({userName,email,password:hashPassword})
            const token=jwt.sign({id:newUser._id},process.env.confirmEmailJwt,{
                expiresIn:"1d"
            })
            const link=`${req.protocol}://${req.headers.host}/${process.env.BASR_URL}/auth/confirm-email/${token}`
            const message=`
            <a href="${link}">Please Click Me to Confirm Email <a/>
            <br>
            <br>
            <h3>Thank You . <h3/>
            `
            const info=await sendMail(email,"Confirm Email",message)
            console.log(info?.accepted)
            if(info?.accepted?.length){
                const savedUser=await newUser.save()
                res.status(201).json({
                    message:"Register Success Please Check Your Email",
                    userId:savedUser.id
                })
            }else{
                next(new ApiError(`Email Rejected`,400))
            }
        } 
})
/**--------------------------------
 * @desc Confirm user Email
 * @router /api/v1/auth/confirm-email/:token
 * @access public
 * @method Get
 */
export const confirmEmail =asyncHandler( async (req, res,next) => {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.confirmEmailJwt)
        if(!decoded.id){
            console.log(decoded)
            next(new ApiError(`Invalid Id`,400))
        }else{
            const confirmUser = await userModel.findByIdAndUpdate({ _id: decoded.id, confirmEmail: false }, {
            confirmEmail: true
        }, { new: true })
        res.status(200).json({ message: "Email Confirmed Please Login" })    
        }
})
/**--------------------------------
 * @desc Login  User
 * @router /api/v1/auth/login
 * @access public
 * @method POST
 */

export const logInCtrl =asyncHandler (async (req, res,next) => {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        !user &&next(new ApiError(`Invalid Email or Password`,409))

        const hashPassword = await bcrypt.compare(password, user.password);
        if(!hashPassword){
            next(new ApiError(`Invalid Email or Password`,409))

        }
        const token = jwt.sign({ _id: user.id }, process.env.confirmEmailJwt, {
            expiresIn: "1d"
        })
        if(!user?.confirmEmail) {
            next(new ApiError(`Email Not Confirmed Please Confirmed First`,400))
        } 
        if(user?.blocked){
            next(new ApiError(`Your Email are blocked!!`,400))
    }
        res.status(200).json({
            token,
            message: "Login Successfully"
        })
})