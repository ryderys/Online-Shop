const { upload } = require("../../common/utils/multer")
const { ProductController } = require("./product.controller")

const router = require("express").Router()

router.post("/add", upload.array("images", 10), ProductController.addProduct)
router.get("/all", ProductController.getAllProducts)

module.exports = {
    AdminApiProductRouter : router
}