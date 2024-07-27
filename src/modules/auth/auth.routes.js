const {Router} = require("express");
const {UserAuthController} = require("./auth.controller");
const router = Router();

router.post("/get-otp", UserAuthController.getOTP)
router.post("/check-otp", UserAuthController.checkOTP)
router.post("/refresh-token", UserAuthController.refreshAccessToken)
router.post("/logout", UserAuthController.logout)

module.exports = {
    AuthRouter: router
}