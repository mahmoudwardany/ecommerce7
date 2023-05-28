const fs = require("fs")
const { productModel } = require('../../models/productModel')
const slugify = require('slugify');
const { categoryModel } = require("../../models/categoryModel");
const { userModel } = require("../../models/userModel");
var braintree = require("braintree");
const ordersModel = require("../../models/ordersModel");
require('dotenv').config()


//payment
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

const createProduct = async (req, res) => {
    try {
        const { name, slug,description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }
        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Creating product",
        });
    }
}
const getAllProduct = async (req, res) => {
    try {
        const products = await productModel.find({}).select("-photo").limit(10).sort({createdAt:-1}).populate("category")
        res.status(200).send({
            success: true,
            countTotal:products.length,
            message: "All Products",
            products
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting All product",
        });
    }
}

const getOneProduct = async (req, res) => {
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select('-photo').populate("category")
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Product Details",
            product
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error to get one Product",
        });
    }
}
//get photo 
const getPhoto=async(req,res)=>{
    try {
        const product= await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            res.send(
                product.photo.data
            )
        }
        
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error to getting Photo Product",
        });
    }
}
const deleteProduct=async(req,res)=>{
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid)
        if (!product){
            return res.status(404).send({
                success: false,
                message: "Product not found"
            })
        }
        res.status(200).send({
            success:true,
            message:"Product Deleted Successfully"
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error to delete one Product",
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { name, slug,description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }
        const products =await productModel.findByIdAndUpdate(req.params.pid,{ ...req.fields, slug: slugify(name) },{
            new: true,
        }).select("-photo").populate("category");
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Creating product",
        });
    }
}
const filterProducts=async(req,res)=>{
    try {
       const {checked,radio}=req.body
    const args={}
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products=await productModel.find(args)
    res.status(200).send({
        success:true,
        products,
    }) 
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in Filtering Products"
        })
    }
    
    
}
// product count
 const productCountController = async (req, res) => {
    try {
      const total = await productModel.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
  };
  const productPerPage=async(req,res)=>{
    try {
        const perPage=6
        const pageNum=req.params.page?req.params.page:1
        const products=await productModel.find({})
        .select('-photo')
        .skip((pageNum-1)*perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
        res.status(200).send({
            success:true,
            products,
            total:products.length,
            page:pageNum,
            totalPages:Math.ceil(products.length/perPage)
        })
    } catch (error) {
        
    }

  }

const searchProduct=async(req,res)=>{
    try {
        const {keyword}=req.params
        const result=await productModel.find({
            $or:[
                {name:{ $regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}},

            ]
        })
        res.json(result)
        
    } catch (error) {
        res.status(400).send({
            message:"Error in search product",
            error,
            success:false
        })
    }
}
const relatedProduct=async(req,res)=>{
    const {pid,cid}=req.params;
    try {
        const product=await productModel.find({
            _id:{$ne:pid},
            category:cid
        }).select('-photo')
        .limit(3).populate('category')
        res.status(200).send({
            success:true,
            product
        })
    } catch (error) {
       res.status(400).send({
        success:false,
        message:"Error in finding related product"
       }) 
    }
}
const getProductsByCategory=async(req,res)=>{
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        const product = await productModel.find({category}).populate('category')
        res.status(200).send({
            success:true,
            product,
            category
        })
    } catch (error) {
        res.status(400).send({
            message:"Error in finding product by category",
            error,
            success:false
        })
    }
}


//payment token
const braintreeToken=async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })
        
    } catch (error) {
        console.log(error)
    }
}
const braintreePayment = async (req, res) => {
    try {
      const { nonce, cart } = req.body;
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            const order = new ordersModel({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            res.json({ ok: true });
          } else {
            res.status(500).send(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };



  module.exports = { braintreePayment,braintreeToken,relatedProduct,createProduct, getAllProduct, getAllProduct,deleteProduct,filterProducts ,getOneProduct,getPhoto,updateProduct,productPerPage,productCountController,searchProduct,getProductsByCategory}