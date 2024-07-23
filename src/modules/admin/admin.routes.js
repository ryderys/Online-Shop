const adminController = require("./admin.controller")

const router = require("express").Router()

router.get('/', adminController.getAllOrders)
router.put('/:orderId/status', adminController.updateOrderStatus)

module.exports = {
    AdminOrderRouter: router
}