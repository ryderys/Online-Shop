const autoBind = require("auto-bind");
const { StatusCodes } = require("http-status-codes");
const httpError = require("http-errors");
const CartModel = require("../cart/cart.model");
const { savedItemsModel } = require("./savedItem.model");
const { ProductModel } = require("../product/product.model");

class SavedItemsController{
    constructor(){
        autoBind(this)
    }

    async saveItemForLater(req, res, next){
        try {
            const {productId} = req.body;
            const userId = req.user._id;

             // Find the user's cart
            const cart = await CartModel.findOne({userId});
            if(!cart){
                throw new httpError.NotFound("cart not found")
            }

             // Find the item in the cart
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId))
            if(itemIndex === -1){
                throw new httpError.NotFound("item not found in your cart")
            }

            const item = cart.items[itemIndex] // Get the item from the cart
            cart.items.splice(itemIndex, 1) // Remove the item from the cart

            // Find or create the saved items list for the user
            let savedItems = await savedItemsModel.findOne({userId})
            if(!savedItems){
                savedItems = new savedItemsModel({userId, items: []})
            }

            // Add the item to the saved items list
            savedItems.items.push({productId: item.productId})

            await cart.save() // Save the updated cart
            await savedItems.save() // Save the updated saved items list

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

    async removeSavedItem(req, res, next){
        try {
            const {productId} = req.body;
            const userId = req.user._id;

            const savedItems = await savedItemsModel.findOne({userId})
            if(!savedItems){
                throw new httpError.NotFound("no saved items found")
            }

            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId))
            if(itemIndex === -1){
                throw new httpError.NotFound("item not found in your cart")
            }

            savedItems.items.splice(itemIndex, 1)
            await savedItems.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "item removed",
                    savedItems
                }
            })


        } catch (error) {
            next(error)
        }
    }

    async clearSavedItems(req, res, next) {
        try {
            const userId = req.user._id;
    
            let savedItems = await savedItemsModel.findOne({ userId });
            if (!savedItems) {
                throw new httpError.NotFound('No saved items found');
            }
    
            savedItems.items = [];
            await savedItems.save();
    
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: 'All saved items have been removed'
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async isItemSaved(req, res, next) {
        try {
            const { productId } = req.body;
            const userId = req.user._id;
    
            const savedItems = await savedItemsModel.findOne({ userId });
            if (!savedItems) {
                return res.status(StatusCodes.OK).json({
                    statusCode: StatusCodes.OK,
                    data: {
                        isSaved: false
                    }
                });
            }
    
            const itemIndex = savedItems.items.findIndex(item => item.productId.equals(productId));
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    isSaved: itemIndex !== -1
                }
            });
        } catch (error) {
            next(error);
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
                cart.items.push({ productId, quantity: 1 });
            } 

            savedItems.items.splice(itemIndex, 1)
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
            console.error(error)
            next(error)
        }
    }
    async viewSavedItems(req, res, next){
        try {
            const userId = req.user._id
            const savedItems = await savedItemsModel.findOne({userId}).populate('items.productId')
            if(!savedItems){
                throw new httpError.NotFound('no saved items found')
            }
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    savedItems
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new SavedItemsController()