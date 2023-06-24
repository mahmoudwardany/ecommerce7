import reviewModel from "../../models/reviewModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";


/**--------------------------------
* @desc Create Review
* @router /api/v1/review
* @access private (User only) 
* @method Post
*/
export const createReview = asyncHandler(async (req, res, next) => {
    const isReview = await reviewModel.findOne({ user: req.user._id, product: req.params.id })
    const productId = await reviewModel.findOne({ product: req.params.id })
    if (isReview) return next(new ApiError("You Can Add one Review Only"), 403)
    let newReview = await reviewModel.create({
        text: req.body.text,
        product: req.params.id,
        user: req.user._id,
        ratingAverage: req.body.ratingAverage
    })
    res.status(201).json({
        success: true,
        newReview
    })
})
/**--------------------------------
* @desc Get All Review
* @router /api/v1/review
* @access public 
* @method Get
*/
export const getReviews = asyncHandler(async (req, res, next) => {
    let getReviews = await reviewModel.find({})
    res.status(201).json({
        success: true,
        getReviews
    })
})
/**--------------------------------
* @desc Get Review
* @router /api/v1/review/:id
* @access public 
* @method Get
*/
export const getReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    let getReview = await reviewModel.findById(id)
    res.status(201).json({
        success: true,
        getReview
    })
})
export const updateReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const review = await reviewModel.findById(id)
    if (req.user._id.toString() === review.user.toString()) {
        let updateReview = await reviewModel.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json({
            success: true,
            updateReview
        })
    } else {
        return next(new ApiError("You Can Update Your Review Only"), 403)
    }
})
export const deleteReview = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const review = await reviewModel.findById(id)
    console.log(req.user)
    if (req.user._id.toString() === review.user.toString()|| req.user.role==='Admin') {
        let deleteReview = await reviewModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            deleteReview
        })
    } else {
        return next(new ApiError("You Can Update Your Review Only"), 403)
    }
})