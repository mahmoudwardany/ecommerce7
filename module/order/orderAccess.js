import { roles } from "../../middlewares/authorization.js";


export const orederAccess={
createOrder:[roles.Admin,roles.User]
}