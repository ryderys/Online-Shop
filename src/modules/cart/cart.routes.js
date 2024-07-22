const cartController = require("./cart.controller")

const router = require("express").Router()

router.post("/add", cartController.addItemToCart),
router.get("/", cartController.getCart),
router.put("/update", cartController.updateItemQuantity)
router.delete("/remove/:productId", cartController.removeItemFromCart)

module.exports = {
    CartRouter : router
}