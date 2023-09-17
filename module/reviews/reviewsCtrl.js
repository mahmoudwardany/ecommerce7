import reviewModel from "../../models/reviewModel.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/catchAsyncHandler.js";

/**
 * @desc Create Review
 * @route POST /api/v1/review/:id
 * @access private (User only)
 * @method POST
 */
export const createReview = asyncHandler(async (req, res, next) => {
    try {
        const isReview = await reviewModel.findOne({ user: req.user._id, product: req.params.id });
        if (isReview) {
            return next(new ApiError("You Can Add one Review Only", 403));
        }

        const newReview = await reviewModel.create({
            text: req.body.text,
            product: req.params.id,
            user: req.user._id,
            ratingAverage: req.body.ratingAverage,
        });

        res.status(201).json({
            success: true,
            newReview,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get All Reviews
 * @route GET /api/v1/review
 * @access public
 * @method GET
 */
export const getReviews = asyncHandler(async (req, res, next) => {
    try {
        const getReviews = await reviewModel.find({});
        res.status(200).json({
            success: true,
            getReviews,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Get Review by ID
 * @route GET /api/v1/review/:id
 * @access public
 * @method GET
 */
export const getReview = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const getReview = await reviewModel.findById(id);
        res.status(200).json({
            success: true,
            getReview,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Update Review
 * @route PUT /api/v1/review/:id
 * @access private (User or Admin)
 * @method PUT
 */
export const updateReview = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await reviewModel.findById(id);

        if (req.user._id.toString() === review.user.toString() || req.user.role === "Admin") {
            const updateReview = await reviewModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json({
                success: true,
                updateReview,
            });
        } else {
            return next(new ApiError("You Can Update Your Review Only", 403));
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Delete Review
 * @route DELETE /api/v1/review/:id
 * @access private (User or Admin)
 * @method DELETE
 */
export const deleteReview = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await reviewModel.findById(id);

        if (req.user._id.toString() === review.user.toString() || req.user.role === "Admin") {
            const deleteReview = await reviewModel.findByIdAndDelete(id);
            res.status(200).json({
                success: true,
                deleteReview,
            });
        } else {
            return next(new ApiError("You Can Delete Your Review Only", 403));
        }
    } catch (error) {
        next(error);
    }
});
