import userModel from '../../models/userModel.js';
import { asyncHandler } from '../../utils/catchAsyncHandler.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from '../../utils/sendEmail.js';
import ApiError from '../../utils/apiError.js';

/**--------------------------------
 * @desc Register New User
 * @router /api/v1/auth/register
 * @access public
 * @method POST
 */
export const signupCtrl = asyncHandler(async (req, res, next) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;
        const findUser = await userModel.findOne({ email });

        if (findUser) {
            return next(new ApiError(`Email Already Exists`, 409));
        }

        const hashPassword = bcrypt.hashSync(password, ++process.env.SALT);
        const newUser = new userModel({ firstName, lastName, age, email, password: hashPassword });

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.confirmEmailJwt, {
            expiresIn: "1d"
        });

        // const link = `${req.protocol}://${req.headers.host}/${process.env.BASE_URL}/auth/confirm-email/${token}`;
        // const message = `
        //     <a href="${link}">Please Click Me to Confirm Email</a>
        //     <br>
        //     <br>
        //     <h3>Thank You.</h3>
        // `;

        // const info = await sendMail(email, "Confirm Email", message);
        // if (info?.accepted?.length) {
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "Registration Successful. Please Check Your Email",
            userId: savedUser.id,
            token
        });
        // } else {
        //     return next(new ApiError(`Email Rejected`, 400));
        // }
    } catch (error) {
        next(error);
    }
});

/**--------------------------------
 * @desc Confirm User Email
 * @router /api/v1/auth/confirm-email/:token
 * @access public
 * @method GET
 */
export const confirmEmail = asyncHandler(async (req, res, next) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.confirmEmailJwt);

        if (!decoded.id) {
            return next(new ApiError(`Invalid ID`, 400));
        }

        const confirmUser = await userModel.findByIdAndUpdate(
            { _id: decoded.id, confirmEmail: false },
            { confirmEmail: true },
            { new: true }
        );

        res.status(200).json({ message: "Email Confirmed. Please Login" });
    } catch (error) {
        next(error);
    }
});

/**--------------------------------
 * @desc Login User
 * @router /api/v1/auth/login
 * @access public
 * @method POST
 */
export const logInCtrl = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return next(new ApiError(`Invalid Email or Password`, 409));
        }

        const hashPassword = await bcrypt.compare(password, user.password);

        if (!hashPassword) {
            return next(new ApiError(`Invalid Email or Password`, 409));
        }

        const token = jwt.sign({ _id: user.id, email: user.email }, process.env.confirmEmailJwt, {
            expiresIn: "1d"
        });

        // if (!user?.confirmEmail) {
        //     return next(new ApiError(`Email Not Confirmed. Please Confirm First`, 400));
        // }

        if (user?.blocked) {
            return next(new ApiError(`Your Email is blocked`, 400));
        }

        res.status(200).json({
            token,
            message: "Login Successful"
        });
    } catch (error) {
        next(error);
    }
});
