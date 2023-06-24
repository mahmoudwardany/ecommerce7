import { roles } from "../../middlewares/authorization.js";


export const categoryAccess={
add:[roles.Admin],
update:[roles.Admin],
}