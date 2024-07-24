const Authorization = require("../../common/guard/authorization.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const categoryController = require("./category.controller")

const router = require("express").Router()

router.post("/", Authorization, checkPermission('category', 'create'), categoryController.createCategory)
router.get("/", Authorization, checkPermission('category', 'read'),categoryController.getAllCategory)
router.delete("/:id", Authorization, checkPermission('category', 'delete'), categoryController.deleteCategoryById)

module.exports = {
    AdminApiCategoryRouter: router
}