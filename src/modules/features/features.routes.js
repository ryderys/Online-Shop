const featuresController = require("./features.controller")

const router = require("express").Router()

router.post("/", featuresController.addFeature )
router.get("/", featuresController.findAllFeatures )
router.get("/by-category/:categoryId", featuresController.findFeatureByCategoryId )
router.get("/by-category-slug/:slug", featuresController.findByCategorySlug )
router.delete("/:id", featuresController.removeFeatureById )
router.put("/:id", featuresController.updateFeature)

module.exports = {
    AdminApiFeatureRouter : router
}