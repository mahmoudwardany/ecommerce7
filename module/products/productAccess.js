import { roles } from "../../middlewares/authorization.js";



const productAccess = {
    add: [roles.Admin],
    update: [roles.Admin]
}

export default productAccess