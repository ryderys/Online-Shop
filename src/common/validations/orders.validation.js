const joi = require("joi")

const OrderSchema = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().integer().min(1).required()
})



module.exports = {
}