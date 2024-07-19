const joi = require("joi")
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const createFeatureSchema = joi.object({
    title: joi.string().required().messages({
        "string.empty": "Title is required",
    }),
    key: joi.string().required().messages({
        "string.empty": "Key is required",
    }),
    type: joi.string().valid('number', 'string', 'array', 'boolean').required().messages({
        "any.only": "Type must be one of 'number', 'string', 'array', 'boolean'",
        "any.required": "Type is required",
    }),
    enum: joi.when('type', {
        is: 'array',
        then: joi.array().items(joi.string()).required().messages({
            "array.base": "Enum must be an array of strings",
            "any.required": "Enum is required when type is 'array'",
        }),
        otherwise: joi.forbidden()
    }),
    guid: joi.string().optional().messages({
        "string.empty": "GUID must be a string",
    }),
    category: joi.string().pattern(MongoIDPattern).required().messages({
        "string.pattern.name": "Category ID is invalid",
        "any.required": "Category is required",
    }),
});

module.exports = {
    createFeatureSchema
}