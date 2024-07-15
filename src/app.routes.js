const { AdminApiProductRouter } = require("./modules/product/products.routes")

const mainRouter = require("express").Router()

mainRouter.use("/products", AdminApiProductRouter)

module.exports = mainRouter