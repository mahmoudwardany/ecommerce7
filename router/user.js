const getOrders = require('../controller/orders/userOrders')
const { verifyTokenAndAuthorzation, verifyTokenAndAdmin } = require('../middleware/protectRouter')

const router=require('express').Router()


router.get('/orders',verifyTokenAndAuthorzation,getOrders.getOrders)
router.get('/all-orders',verifyTokenAndAdmin,getOrders.getAllOrders)


module.exports=router
