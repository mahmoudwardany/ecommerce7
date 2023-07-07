import { roles } from "../../middlewares/authorization.js";


export const orederAccess={
createOrder:[roles.User],
get:[roles.Admin],
specific:[roles.Admin],
update:[roles.Admin],
checkout:[roles.User],

}