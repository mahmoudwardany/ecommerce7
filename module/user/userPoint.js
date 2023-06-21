import { roles } from "../../middlewares/authorization.js";


export const endPoint={
    profile:[roles.Admin,roles.User]
}