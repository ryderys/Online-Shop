const Authorization = require("../../common/guard/authorization.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const savedItemsController = require("./savedItems.controller")


const router = require("express").Router()
// save an item for later
router.post('/save',Authorization, checkPermission('savedItems', 'updateOwn'), savedItemsController.saveItemForLater)

//move a saved item to cart
router.post('/move-to-cart', Authorization, checkPermission('savedItems', 'updateOwn'), savedItemsController.moveSavedItemToCart)

//view all saved item
router.get('/', Authorization, checkPermission('savedItems', 'readOwn'), savedItemsController.viewSavedItems)

//remove an item from saved items
router.post('/remove', Authorization,checkPermission('savedItems', 'updateOwn'),  savedItemsController.removeSavedItem)

//clear all saved items
router.delete('/clear', Authorization, checkPermission('savedItems', 'updateOwn'),savedItemsController.clearSavedItems)

//check if an item is saved
router.post('/is-saved', Authorization, checkPermission('savedItems', 'readOwn'),savedItemsController.isItemSaved)


module.exports = {
    SavedItemsRouter : router
}