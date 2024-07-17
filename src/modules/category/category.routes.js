const categoryController = require("./category.controller")

const router = require("express").Router()

router.post("/", categoryController.createCategory)
router.get("/", categoryController.getAllCategory)
router.delete("/:id", categoryController.deleteCategoryById)

module.exports = {
    AdminApiCategoryRouter: router
}