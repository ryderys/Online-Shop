const autoBind = require("auto-bind");
const { StatusCodes } = require("http-status-codes");
const httpError = require("http-errors");
const { UserModel } = require("./user.model");
const CartModel = require("../cart/cart.model");
const OrderModel = require("../orders/orders.model");
const PendingOrderModel = require("../orders/pending-order.model");
const { logger } = require("../../common/utils/logger");

class UserController{
    constructor(){
        autoBind(this)
    }
    async getUserProfile(req, res, next){
        try {
            const user = req.user;
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    user
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
    async updateUserProfile(req, res, next){
        try {
            const userId = req.user._id;
            const data = {... req.body};
            delete data.role

            const {modifiedCount} = await UserModel.updateOne({_id: userId}, {$set: data})
            if(!modifiedCount) throw new httpError.InternalServerError("به روزرسانی انجام نشد")

            const pendingOrder = await PendingOrderModel.findOne({userId})
            if(pendingOrder){
                const cart = await CartModel.findOne({userId}).populate('items.productId')

                if(!cart || cart.items.length === 0){
                    throw new httpError.BadRequest('Your cart is empty')
                }
                const totalAmount = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0)
                const order = await PendingOrderModel.create({
                    userId: pendingOrder.userId,
                    items: cart.items.map(item => ({
                        productId: item.productId._id,
                        quantity: item.quantity, 
                        price: item.productId.price
                    })),
                    totalAmount,
                    status: "pending"
                })
                await order.save()
                cart.items = []
                await cart.save()
                await PendingOrderModel.deleteOne({userId})
                logger.info(`Order created for user ${userId} with order ID ${order._id}`)
                return res.status(StatusCodes.CREATED).json({
                    statusCode: StatusCodes.CREATED,
                    data: {
                        message: "profile updated and order created successfully",
                        order
                    }
                })
            }
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "profile updated  successfully",
                }
        })

        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
    async getAllUsers(req, res, next){
        try {
            const {search} = req.query
            const databaseQuery = {}
            if(search) databaseQuery['$text'] = {$search: search}
            const users = await UserModel.find(databaseQuery)
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    users
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
}

module.exports = new UserController()