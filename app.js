import express from 'express'
const app=express()
import dotenv from 'dotenv'
dotenv.config()
import * as indexRouter from './routes/index.js'
import connectDB from './config/DB.js'
import ApiError from './utils/apiError.js'
import { globalHandlerError } from './middlewares/error.middleware.js'
import morgan from 'morgan'
//DB
connectDB()
//MiddleWare
app.use(express.json())
app.use(morgan('dev'))
//baseUrl
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