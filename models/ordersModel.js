const mongoose=require('mongoose')
const Joi=require('joi')

const ordersSchema=new mongoose.Schema({
  products:[
    {
        type: mongoose.ObjectId,
        ref: "product"
    },
  ],
  payment:{},
  buyer:{
    type:mongoose.ObjectId,
    ref: "user"
  },
  status:{
    type:String,
    default:"Not proccess",
    enum:["Not proccess","Processing","Shipped","deliverd","cancel"]
  }

},{
    timestamps:true
})

const ordersModel=mongoose.model('order',ordersSchema)

module.exports=ordersModel