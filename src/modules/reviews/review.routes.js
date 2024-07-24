const Authorization = require("../../common/guard/authorization.guard")
const reviewController = require("./review.controller")

const router = require("express").Router()

router.post("/product/:productId", Authorization ,reviewController.createReview)
router.get("/product/:productId", reviewController.getProductReviews)
router.put("/:reviewId", Authorization, reviewController.updateReview)
router.delete("/:reviewId", Authorization, reviewController.deleteReview)
router.get("/product/:productId/average-rating", reviewController.getAverageRating)

module.exports = {
    ReviewsRouter: router
}

