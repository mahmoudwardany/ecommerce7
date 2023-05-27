const { createCategory, updateCategroy, getAllCategory, getCategory, deleteCategory } = require('../controller/category/createCategory.conteroller')
const { verifyTokenAndAdmin } = require('../middleware/protectRouter')

const router =  require('express').Router()



router.post('/create-category',createCategory)
router.put("/update-category/:id",updateCategroy)
router.get("/",getAllCategory)
router.get("/:slug",getCategory)
router.delete("/:id",deleteCategory)





module.exports=router