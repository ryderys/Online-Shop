const autoBind = require("auto-bind");
const OrderModel = require("../orders/orders.model");

class AdminOrderController{
    constructor(){
        autoBind
    }
    async getAllOrders(req, res, next){
        try {
            const orders = await OrderModel.find().populate('items.productId')
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    orders
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async updateOrderStatus(req, res, next){
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            const order = await OrderModel.findById(orderId);
            if (!order) {
                throw new httpError.NotFound('Order not found.');
            }

            order.status = status;
            order.updatedAt = Date.now();
            await order.save();

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: { order }
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AdminOrderController()