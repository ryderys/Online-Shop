const adminAuthMiddleware = require("../../common/guard/auth.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const adminRateLimiter = require("../../common/middleware/rate-limit")
const categoryController = require("./category.controller")

const router = require("express").Router()

router.post("/",  adminAuthMiddleware, checkPermission('category', 'create'), adminRateLimiter, categoryController.createCategory)
router.get("/", adminAuthMiddleware, checkPermission('category', 'read'), adminRateLimiter,categoryController.getAllCategory)
router.delete("/:id", adminAuthMiddleware, checkPermission('category', 'delete'),adminRateLimiter ,categoryController.deleteCategoryById)

module.exports = {
    AdminApiCategoryRouter: router
}