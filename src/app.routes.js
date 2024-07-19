const { AuthRouter } = require("./modules/auth/auth.routes")
const { AdminApiCategoryRouter } = require("./modules/category/category.routes")
const { AdminApiFeatureRouter } = require("./modules/features/features.routes")
const { AdminApiProductRouter } = require("./modules/product/products.routes")

const mainRouter = require("express").Router()

mainRouter.use("/auth", AuthRouter)
mainRouter.use("/products", AdminApiProductRouter)
mainRouter.use("/category", AdminApiCategoryRouter)
mainRouter.use("/feature", AdminApiFeatureRouter)

module.exports = mainRouter