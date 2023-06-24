import { roles } from "../../middlewares/authorization.js";


export const reviewAccess={
    add:[roles.User],
    update:[roles.User],
    delete:[roles.Admin,roles.User]
    }