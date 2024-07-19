const featuresController = require("./features.controller")

const router = require("express").Router()

router.post("/", featuresController.addFeature )
router.get("/", featuresController.findAllFeatures )

module.exports = {
    AdminApiFeatureRouter : router
}