const Authorization = require("../../common/guard/authorization.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const { stringToArray } = require("../../common/utils/functions")
const { uploadFile } = require("../../common/utils/multer")
const { ProductController } = require("./product.controller")

const router = require("express").Router()

router.post("/add", Authorization,  uploadFile.array("images", 10) ,stringToArray("tags"), ProductController.addProduct)
router.get("/all", Authorization,  ProductController.getAllProducts)
router.get("/:id",Authorization,  ProductController.getOneProductById)
router.delete("/remove/:id",Authorization,  ProductController.removeProductById)
router.patch("/edit/:id",Authorization,  uploadFile.array("images", 10), stringToArray("tags"), ProductController.editProductById)

module.exports = {
    AdminApiProductRouter : router
}