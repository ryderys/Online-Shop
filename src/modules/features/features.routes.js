const featuresController = require("./features.controller")

const router = require("express").Router()

router.post("/", featuresController.addFeature )
router.get("/", featuresController.findAllFeatures )
router.get("/by-category/:categoryId", featuresController.findFeatureByCategoryId )
router.delete("/:id", featuresController.removeFeatureById )

module.exports = {
    AdminApiFeatureRouter : router
}