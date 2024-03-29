import express from 'express'
const app=express()
import dotenv from 'dotenv'
dotenv.config()
import * as indexRouter from './routes/index.js'
import connectDB from './DB/DB.js'
import ApiError from './utils/apiError.js'
import { globalHandlerError } from './middlewares/error.middleware.js'
import morgan from 'morgan'
import hpp from 'hpp'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import xxs from 'xss-clean'
import compression from 'compression'
//DB
connectDB()
//MiddleWare
app.use(express.json({limit:"30kb"}))
app.use(morgan('dev'))
app.use(compression());

//Security
app.use(cors())
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 200,
})
// Apply the rate limiting middleware to all requests
app.use(limiter)
app.use(xxs())
app.use(hpp())
//BaseUrl
const baseUrl=process.env.BASR_URL
const port=process.env.PORT || 7000
//router
app.use(`/${baseUrl}/auth`,indexRouter.authRouter)
app.use(`/${baseUrl}/user`,indexRouter.userRouter)
app.use(`/${baseUrl}/products`,indexRouter.productsRouter)
app.use(`/${baseUrl}/category`,indexRouter.categoryRouter)
app.use(`/${baseUrl}/brand`,indexRouter.brandRouter)
app.use(`/${baseUrl}/cart`,indexRouter.cartRouter)
app.use(`/${baseUrl}/coupon`,indexRouter.couponRouter)
app.use(`/${baseUrl}/review`,indexRouter.reviewsRouter)
app.use(`/${baseUrl}/order`,indexRouter.orderRouter)

app.use('*',(req,res,next)=>{
next(new ApiError(`Cant find ${req.originalUrl} on this server`,404))
})
app.use(globalHandlerError)
app.listen(port,()=>{
    console.log(`server is running... on port ${port}`)
})