const Authorization = require("../../common/guard/authorization.guard")
const ordersController = require("./orders.controller")

const router = require("express").Router()

router.post('/', Authorization, ordersController.createOrder)

router.get('/',  Authorization, ordersController.getUserOrders)

router.get('/history', Authorization,  ordersController.getUserOrderHistory)

router.get('/:orderId/track',  Authorization, ordersController.trackOrder)

router.put('/:orderId/cancel',  Authorization, ordersController.cancelOrder)

router.get('/:orderId',  Authorization, ordersController.getOrderById)

// router.put('/:orderId/status', ordersController.updateOrderStatus)

module.exports = {
    OrderRouter: router
}