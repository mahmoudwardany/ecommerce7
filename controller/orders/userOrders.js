const ordersModel = require("../../models/ordersModel")


const getOrders=async(req,res)=>{
    try {
        const orders = await ordersModel.find({buyer:req.user._id}).populate('products',"-photo").populate('buyer',"name ")
        res.send({
            orders,
            message:"orders fetched successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            error:error.message,
            status:"error",
            message:"Error to get your orders"
        })
    }
}

const getAllOrders=async(req,res)=>{
    try {
        const orders = await ordersModel.find().populate('products',"-photo").populate('buyer',"name ").sort({createAt: "-1"})
        res.send({
            orders,
            message:"orders fetched successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            error:error.message,
            status:"error",
            message:"Error to get your orders"
        })
    }
}
const updateStatus=async(req,res)=>{
    try {
        const{orderId}=req.params;
        const {status}=req.body;
        const updateOrderStatus=await ordersModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.send({
            updateOrderStatus,
            message:"order status updated successfully",
            status:"success"
        })
    } catch (error) {
        res.status(500).send(error)
    }
}
module.exports={getOrders,getAllOrders,updateStatus}