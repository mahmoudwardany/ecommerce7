const forgotPassword = require('../controller/auth/forgot-password');
const login = require('../controller/auth/loginController')
const  registerController  = require('../controller/auth/registerController');
const updateProfile = require('../controller/auth/updateProflie');
const getOrders = require('../controller/orders/userOrders');
const router = require('express').Router()
const {  verifyTokenAndAdmin, verifyTokenAndAuthorzation } =require ("../middleware/protectRouter.js");


router.post('/register', registerController)
router.post('/login',login)
router.post('/forgot-password',forgotPassword)

//protect Admin route
router.get('/admin',verifyTokenAndAdmin,(req,res)=>{
    res.status(200).send({ok:true,message:"success"})
})
//protect user route
router.get('/user',verifyTokenAndAuthorzation,(req,res)=>{
    res.status(200).send({ok:true,message:"success"})
})

router.put('/update-profile',verifyTokenAndAuthorzation,updateProfile)
module.exports = router