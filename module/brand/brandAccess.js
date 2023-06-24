import { roles } from "../../middlewares/authorization.js";


export const brandAccess={
add:[roles.Admin],
update:[roles.Admin],
}