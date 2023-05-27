const { hashPassword } = require("../../helper/hashPassword")
const { validRegister, userModel } = require("../../models/userModel")
const registerController = async (req, res) => {
  const { name, email, password, phone,address,answer } = req.body

  const { error } = validRegister({ name, email, password, phone ,address,answer})
  error && res.status(400).json({ message: error.details[0].message })
  try {
    const emailExsit = await userModel.findOne({ email })
    if (emailExsit) {
      return res.status(400).send({ message: "email already exsit", success: false })
    }
    const phoneExsit = await userModel.findOne({ phone })
    if (phoneExsit) {
      return res.status(400).json({ message: "phone already exsit", success: false  })
    }
    const hashedPassword = await hashPassword(password)
    const newUser = new userModel({ name, email, password: hashedPassword, phone ,address,answer}).save()
    res.status(201).json({ message: "Register successfully", success: true })
  } catch (error) {
    res.status(400).json({ message: "failed to register", success: false,error  })

  }
}




module.exports = registerController