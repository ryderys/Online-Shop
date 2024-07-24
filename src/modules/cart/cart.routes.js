const Authorization = require("../../common/guard/authorization.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const cartController = require("./cart.controller")

const router = require("express").Router()

router.post("/add", Authorization, checkPermission('cart', 'updateOwn'), cartController.addItemToCart),
router.get("/",Authorization, checkPermission('cart', 'readOwn'), cartController.getCart),
router.put("/update",Authorization,  checkPermission('cart', 'updateOwn'), cartController.updateItemQuantity)
router.post("/clear-cart",Authorization, checkPermission('cart', 'updateOwn'), cartController.clearCart)
router.delete("/remove/:productId",Authorization, checkPermission('cart', 'updateOwn'), cartController.removeItemFromCart)

module.exports = {
    CartRouter : router
}