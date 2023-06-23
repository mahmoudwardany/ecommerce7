import { roles } from "../../middlewares/authorization.js";


export const couponAccess={
add:[roles.Admin],
updateCoupon:[roles.Admin],
deleteCoupon:[roles.Admin]
}