const { ProductController } = require("./product.controller")

const router = require("express").Router()

router.post("/add", ProductController.addProduct)


module.exports = {
    AdminApiProductRouter : router
}