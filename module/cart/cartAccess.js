import { roles } from "../../middlewares/authorization.js";


export const cartAccess={
addToCart:[roles.Admin,roles.User],
removeFromCart:[roles.Admin,roles.User],
updateQuantity:[roles.Admin,roles.User],
}