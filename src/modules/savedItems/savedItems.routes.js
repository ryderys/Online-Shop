const Authorization = require("../../common/guard/authorization.guard")
const savedItemsController = require("./savedItems.controller")


const router = require("express").Router()
// save an item for later
router.post('/save',Authorization,savedItemsController.saveItemForLater)

//move a saved item to cart
router.post('/move-to-cart', Authorization, savedItemsController.moveSavedItemToCart)

//view all saved item
router.get('/', Authorization, savedItemsController.viewSavedItems)

//remove an item from saved items
router.post('/remove', Authorization, savedItemsController.removeSavedItem)

//clear all saved items
router.delete('/clear', Authorization, savedItemsController.clearSavedItems)

//check if an item is saved
router.post('/is-saved', Authorization, savedItemsController.isItemSaved)


module.exports = {
    SavedItemsRouter : router
}