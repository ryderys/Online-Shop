const joi = require("joi")
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
const httpError = require("http-errors")

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
    list: joi.alternatives().try(joi.array(), joi.string()).error(httpError.BadRequest("list must be array or comma-separated string")),
    guid: joi.string().optional().messages({
        "string.empty": "GUID must be a string",
    }),
    category: joi.string().pattern(MongoIDPattern).required().messages({
        "string.pattern.name": "Category ID is invalid",
        "any.required": "Category is required",
    }),
});

const updateFeatureSchema = joi.object({
    title: joi.string().optional().messages({
        "string.empty": "Title is required",
    }),
    key: joi.string().optional().messages({
        "string.empty": "Key is required",
    }),
    type: joi.string().valid('number', 'string', 'array', 'boolean').optional().messages({
        "any.only": "Type must be one of 'number', 'string', 'array', 'boolean'",
        "any.required": "Type is required",
    }),
    list: joi.alternatives().try(joi.array(), joi.string()).optional().error(httpError.BadRequest("list must be array or comma-separated string")),
    guid: joi.string().optional().messages({
        "string.empty": "GUID must be a string",
    }),
    category: joi.string().optional().messages({
        "string.pattern.name": "Category ID is invalid",
        "any.required": "Category is required",
    }),
})

module.exports = {
    createFeatureSchema,
    updateFeatureSchema
}