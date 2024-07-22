const autoBind = require("auto-bind");
const ObjectIdValidator = require("../../common/validations/public.validations");
const { ProductModel } = require("../product/product.model");
const httpError = require("http-errors");
const CartModel = require("./cart.model");
const { StatusCodes } = require("http-status-codes");
const { AddToCartSchema, RemoveFromCartSchema } = require("../../common/validations/cart.validation");

class CartController{
    constructor(){
        autoBind(this)
    }
    async addItemToCart(req, res, next){
        try {
            await AddToCartSchema.validateAsync(req.body)
            let cart;
            const {productId, quantity} = req.body;
            const userId = req.user._id;

            const product = await this.findProductById(productId)
            if(product.count < quantity){
                throw new httpError.BadRequest("insufficient stock")
            }

            cart = await CartModel.findOne({userId})

            if(!cart){
                cart = await CartModel.create({userId, items: [{productId, quantity}]})
            }else{
                const existingItem = cart.items.find(item => item.productId.equals(productId))
    
                if(existingItem){
                    existingItem.quantity = +existingItem.quantity + +quantity; 
                }else {
                    cart.items.push({productId, quantity})
                }
                await cart.save()
            }

            await this.validateCart(cart)
            await this.expireCart(cart, Date.now() + 30 * 60 * 1000)

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "item added to cart successfully",
                    cart: {
                        id: cart._id,
                        userId: cart.userId,
                        items: cart.items.map(item => ({
                            id: item._id,
                            productId: item.productId,
                            quantity: item.quantity
                        })),
                        expiresAt: cart.expiresAt 
                    }
                }
            })

        } catch (error) {
            next(error)
        }
    }

    async removeItemFromCart(req, res, next){
        try {
            await RemoveFromCartSchema.validateAsync(req.body)
            const {productId} = req.params;
            const userId = req.user._id;

            let cart = await CartModel.findOne({userId})
            if(!cart){
                throw new httpError.NotFound("Cart not found")
            }

            const initialItemCount = cart.items.length;
            cart.items = cart.items.filter(item => item.productId.toString() !== productId) 
            if(cart.items.length === initialItemCount){
                throw new httpError.BadRequest("item not found in cart")
            }
            await cart.save()
            
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "item removed from cart",
                    cart: {
                        _id: cart._id,
                        userId: cart.userId,
                        items: cart.items.map(item => ({
                            id: item._id,
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                        expiresAt: cart.expiresAt,
                        __v: cart.__v
                    }
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

            if(quantity <= 0){
                throw new httpError.BadRequest("invalid quantity")
            }

            const cart = await CartModel.findOne({userId});
            if(!cart){
                throw new httpError.NotFound("Cart not found")
            }

            const product = await this.findProductById(productId)
            if(!product){
                throw new httpError.NotFound("Product not found")
            }

            const existingItem = cart.items.find(item => item.productId.equals(productId))
            if(existingItem){
                existingItem.quantity = +quantity
            } else {
                throw new httpError.NotFound("product not found in cart")
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

    async getCart(req, res, next){
       try {
        const userId = req.user._id;
        const cart = await CartModel.findOne({userId}).populate('items.productId')

        if(!cart){
           throw new httpError.NotFound("cart not found")
        }
        await this.validateCart(cart)

        const cartResponse = {
            _id: cart._id,
            userId: cart.userId,
            items: cart.items.map((item) => ({
              id: item._id,
              productId: item.productId,
              quantity: item.quantity,
              productName: item.productId.name,
              productPrice: item.productId.price,
            })),
            expiresAt: cart.expiresAt,
          };

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                cart: cartResponse
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