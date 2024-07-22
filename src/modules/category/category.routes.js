const Authorization = require("../../common/guard/authorization.guard")
const categoryController = require("./category.controller")

const router = require("express").Router()

router.post("/", categoryController.createCategory)
router.get("/", Authorization, categoryController.getAllCategory)
router.delete("/:id", categoryController.deleteCategoryById)

module.exports = {
    AdminApiCategoryRouter: router
}