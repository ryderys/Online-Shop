const Joi = require("joi");
const httpError = require("http-errors");

const ReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().error(httpError.BadRequest("امتیاز دهی باید بین 1 تا 5 باشد")),
    comment: Joi.string().optional().error(httpError.BadRequest("متن وارد شده صحیح نیست")),
})

module.exports = {
    ReviewSchema
}

