const Authorization = require("../../common/guard/authorization.guard")
const cartController = require("./cart.controller")

const router = require("express").Router()

router.post("/add", Authorization,cartController.addItemToCart),
router.get("/",Authorization, cartController.getCart),
router.put("/update",Authorization, cartController.updateItemQuantity)
router.post("/clear-cart",Authorization, cartController.clearCart)
router.delete("/remove/:productId",Authorization, cartController.removeItemFromCart)

module.exports = {
    CartRouter : router
}