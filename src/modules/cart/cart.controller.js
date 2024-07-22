const autoBind = require("auto-bind");
const ObjectIdValidator = require("../../common/validations/public.validations");
const { ProductModel } = require("../product/product.model");
const httpError = require("http-errors");
const CartModel = require("./cart.model");
const { StatusCodes } = require("http-status-codes");
const { savedItemsModel } = require("./savedItem.model");

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

    async saveItemForLater(req, res, next){
        try {
            const {productId} = req.body;
            const userId = req.user._id;

            const cart = await CartModel.findOne({userId});
            if(!cart){
                throw new httpError.NotFound("cart not found")
            }
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId))
            if(itemIndex === -1){
                throw new httpError.NotFound("item not found in your cart")
            }

            const item = cart.items[itemIndex]
            cart.items.splice(itemIndex, 1)

            let savedItems = await savedItemsModel.findOne({userId})
            if(!savedItems){
                savedItems = new savedItemsModel({userId, items: []})
            }
            savedItems.items.push({productId: item.productId})

            await cart.save()
            await savedItems.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    cart,
                    savedItems
                }
            })
        } catch (error) {
            next(error)
        }
    }


    async moveSavedItemToCart(req, res, next){
        try {
            const {productId} = req.body;
            const userId = req.user._id;

            const product = await ProductModel.findById(productId)
            if(!product){
                throw new httpError.NotFound("product not found")
            }

            let savedItems = await savedItemsModel.findOne({userId})
            if(!savedItems){
                throw new httpError.NotFound("no saved items found")
            }

            const itemIndex = savedItems.items.findIndex(item => item.productId.equals(productId))
            if (itemIndex === -1){
                throw new httpError.NotFound('items not found in saved items')
            }

            let cart = await CartModel.findOne({userId})
            if(!cart){
                cart = new CartModel({userId, items: []})
            }

            const existingItem = cart.items.find(cartItem => cartItem.productId.equals(productId));
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ productId: item.productId, quantity: 1 });
            } 
            await savedItems.save()
            await cart.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data : {
                    cart,
                    savedItems
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

    async findProductById(productId){
        const {id} = await ObjectIdValidator.validateAsync({id: productId})
        const product = await ProductModel.findById(id)
        if(!product) throw new httpError.NotFound("محصولی یافت نشد")
        return product
    }
}