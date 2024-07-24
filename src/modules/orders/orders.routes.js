const Authorization = require("../../common/guard/authorization.guard")
const {checkPermission} = require("../../common/middleware/checkPermission")
const ordersController = require("./orders.controller")

const router = require("express").Router()

router.post('/', Authorization, checkPermission('order', 'create'), ordersController.createOrder)

router.get('/',  Authorization,  checkPermission('order', 'read'),ordersController.getUserOrders)

router.get('/history', Authorization, checkPermission('order', 'read'), ordersController.getUserOrderHistory)

router.get('/:orderId/track',  Authorization, checkPermission('order', 'read'),ordersController.trackOrder)

router.put('/:orderId/cancel',  Authorization, checkPermission('order', 'updateOwn'), ordersController.cancelOrder)

router.get('/:orderId',  Authorization, checkPermission('order', 'read'), ordersController.getOrderById)

// router.put('/:orderId/status', ordersController.updateOrderStatus)

module.exports = {
    OrderRouter: router
}