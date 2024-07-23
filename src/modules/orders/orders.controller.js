const autoBind = require("auto-bind");
const CartModel = require("../cart/cart.model");
const httpError = require("http-errors");
const OrderModel = require("./orders.model");
const { StatusCodes } = require("http-status-codes");

class OrderController{
    constructor() {
        autoBind(this)
    }

    async createOrder(req, res, next){
        try {
            const userId = req.user._id;
            // const userEmail = req.user.email;

            const cart = await CartModel.findOne({userId}).populate('items.productId')
            if(!cart || cart.items.length === 0){
                throw new httpError.BadRequest('your cart is empty')
            }
            //calculating the total amount
            const totalAmount = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0)

            const order = new OrderModel({
                userId,
                items: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity, 
                    price: item.productId.price
                })),
                totalAmount,
                status: 'Pending'
            })

            await order.save()

            //clearing the cart
            cart.items = []
            await cart.save()

            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    order
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getOrderById(req, res, next){
        try {
            const {orderId} = req.params;
            const order = await OrderModel.findById(orderId).populate('items.productId')
            if(!order){
                throw new httpError.NotFound('Order not found')
            }

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    order
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getUserOrders(req, res, next){
        try {
            const userId = req.user._id;
            const order = await OrderModel.find({userId}).populate('items.productId')
            
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    order
                }
            })
        } catch (error) {
            next(error)
        }
    }

    // async updateOrderStatus(req, res, next){
    //     try {
    //         const {orderId} = req.params
    //         const {status} = req.body;
    //         const order = await OrderModel.findById({orderId})
    //         if(!order) {
    //             throw new httpError.NotFound("order not found")
    //         }
    //         order.status = status
    //         order.updatedAt = Date.now()
    //         await order.save()

    //         return res.status(StatusCodes.OK).json({
    //             statusCode: StatusCodes.OK,
    //             data: {
    //                 message: 'order status updated successfully',
    //                 order
    //             }
    //         })
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    async getUserOrderHistory(req, res, next){
        try {
            const userId = req.user._id;
            const orders = await OrderModel.find({userId}).populate('items.productId')
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

    async trackOrder(req, res, next){
        try {
            const {orderId} = req.params
            const order = await OrderModel.findById(orderId).populate('items.productId')
            if(!order) {
                throw new httpError.NotFound('Order not found')
            }
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    status: order.status
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async cancelOrder(req, res, next){
        try {
            const {orderId} = req.params
            const userId = req.user._id;

            const order = await OrderModel.findOne({_id: orderId, userId})
            if(!order || order.status !== 'Pending'){
                throw new httpError.BadRequest('order can not be canceled')
            }

            order.status = 'cancelled'
            await order.save()
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "order canceled successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new OrderController()