const savedItemsController = require("./savedItems.controller")


const router = require("express").Router()

router.post('/save', savedItemsController.saveItemForLater)

router.post('/move-to-cart', savedItemsController.moveSavedItemToCart)

router.get('/', savedItemsController.viewSavedItems)

router.post('/remove', savedItemsController.removeSavedItem)
router.post('/clear', savedItemsController.clearSavedItems)

router.post('/is-saved', savedItemsController.isItemSaved)


module.exports = {
    SavedItemsRouter : router
}