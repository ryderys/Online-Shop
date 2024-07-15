const { AdminApiProductRouter } = require("./modules/product/products.routes")

const router = require("express").Router()

router.use("/products", AdminApiProductRouter)

module.exports = {
    AdminRoutes: router
}