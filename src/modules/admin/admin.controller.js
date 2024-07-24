const autoBind = require("auto-bind");
const OrderModel = require("../orders/orders.model");
const roles = require("../RBAC/roles");
const { StatusCodes } = require("http-status-codes");
const permissions = require("../RBAC/permissions");
const { logger } = require("../../common/utils/logger");



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

    async addRole(req, res, next){
        const {role, parentRole} = req.body;
        roles[role] = [parentRole]
        logger.info(`Role added: ${role}, Parent role: ${parentRole}`);
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                message: "Role added successfully"
            }
        })
    }
    async addPermission(req, res, next){
        const {resource, role, action} = req.body;
        permissions[resource][action].push(role)
        logger.info(`Permission added: ${role} can ${action} ${resource}`)
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                message: "Permission added successfully"
            }
        })
    }
    async removePermission(req, res, next){
        const {resource, role, action} = req.body;
        permissions[resource][action] = permissions[resource][action].filter(r => r !== role)
        logger.info(`Permission removed: ${role} can no longer ${action} ${resource}`)
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                message: "Permission removed successfully"
            }
        })
    }
}

module.exports = new AdminOrderController()