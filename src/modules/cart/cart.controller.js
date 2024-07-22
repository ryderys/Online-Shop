const autoBind = require("auto-bind");
const ObjectIdValidator = require("../../common/validations/public.validations");
const { ProductModel } = require("../product/product.model");
const httpError = require("http-errors");
const CartModel = require("./cart.model");
const { StatusCodes } = require("http-status-codes");

class CartController{
    constructor(){
        autoBind(this)
    }
    async addItemToCart(req, res, next){
        try {
            let cart;
            const {productId, quantity} = req.body;
            const userId = req.user._id;

            const product = await this.findProductById(productId)
            if(product.count < quantity){
                throw new httpError.BadRequest("insufficient stock")
            }

            cart = await CartModel.findOne({userId})
            if(!cart){
                cart = new CartModel({userId, items: []})
            }

            const existingItem = cart.items.find(item => item.productId.equals(productId))
            if(existingItem){
                existingItem.quantity += quantity
            }else {
                cart.items.push({productId, quantity})
            }

            await cart.save()
            await this.validateCart(cart)
            await this.expireCart(cart, Date.now() + 30 * 60 * 1000)

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    cart
                }
            })

        } catch (error) {
            next(error)
        }
    }

    async removeItemFromCart(req, res, next){
        try {
            const {productId} = req.params;
            const userId = req.user._id;

            const cart = await CartModel.findOne({userId})
            if(!cart){
                throw new httpError.NotFound("Cart not found")
            }

           const itemIndex = cart.items.findIndex(item => item.productId.equals(productId))
           if(itemIndex === -1){
            throw new httpError.NotFound("item not found in cart")
           }

            cart.items.splice(itemIndex, 1)
            await cart.save()
            
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    cart
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async updateItemQuantity(req, res, next){
        try {
            const {productId, quantity} = req.body
            const userId = req.user._id;
            
            const cart = await CartModel.findOne({userId});
            if(!cart){
                throw new httpError.NotFound("Cart not found")
            }

            const existingItem = cart.items.find(item => item.productId.equals(productId))
            if(existingItem){
                existingItem.quantity = quantity
                await cart.save()
                await this.validateCart(cart)
                await this.expireCart(cart, Date.now() + 30 * 60 * 1000)
    
            } else {
                throw new httpError.NotFound("product not found in cart")
            }

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    cart
                }
            })


        } catch (error) {
            next(error)
        }
    }

    async getCart(req, res, next){
       try {
        const userId = req.user._id;
        const cart = await CartModel.findOne({userId}).populate('items.productId')

        if(!cart){
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    items: []
                }
            })
        }
        await this.validateCart(cart)
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                cart
            }
        })
       } catch (error) {
            next(error)
       }
    }

    async clearCart(req, res, next){
        try {
            const userId = req.user._id;
            const cart = await CartModel.findOne({userId})
            if(!cart){
                throw new httpError.NotFound("Cart not found")
            }
            cart.items =  [];

            await cart.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "cart cleared successfully"
                }

            })
        } catch (error) {
            next(error)
        }
    }

    async findProductById(productId){
        const {id} = await ObjectIdValidator.validateAsync({id: productId})
        const product = await ProductModel.findById(id)
        if(!product) throw new httpError.NotFound("محصولی یافت نشد")
        return product
    }

    async validateCart(cart) {
        const invalidItems = [];
        for (const item of cart.items) {
          const product = await ProductModel.findById(item.productId);
          if (!product || product.count < item.quantity) {
            invalidItems.push(item);
          }
        }
        if (invalidItems.length > 0) {
          cart.items = cart.items.filter(item => !invalidItems.includes(item));
          await cart.save();
        }
        return cart;
      }

    async expireCart(cart, expiresAt) {
    cart.expiresAt = expiresAt;
    await cart.save();
    }
}

module.exports = new CartController()