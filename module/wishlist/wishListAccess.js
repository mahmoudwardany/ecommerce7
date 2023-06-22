import { roles } from "../../middlewares/authorization.js";



const wishListAccess = {
    add: [roles.Admin,roles.User],
    delete: [roles.Admin,roles.User]
}

export default wishListAccess