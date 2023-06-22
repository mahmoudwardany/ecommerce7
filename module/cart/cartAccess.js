import { roles } from "../../middlewares/authorization.js";


export const cartAccess={
addToCart:[roles.Admin,roles.User]
}