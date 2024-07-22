const joi = require("joi")

const AddToCartSchema = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().integer().min(1).required()
})

const RemoveFromCartSchema = joi.object({
    productId: joi.string().required(),
})

module.exports = {
    AddToCartSchema,
    RemoveFromCartSchema
}