const { AuthRouter } = require("./modules/auth/auth.routes")
const { AdminApiProductRouter } = require("./modules/product/products.routes")

const mainRouter = require("express").Router()

mainRouter.use("/auth", AuthRouter)
mainRouter.use("/products", AdminApiProductRouter)

module.exports = mainRouter