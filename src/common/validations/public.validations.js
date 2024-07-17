const joi = require("joi")
const httpError = require("http-errors")
const {MongoIDPattern} = require("../constants/constants")
const ObjectIdValidator = joi.object({
    id: joi.string().pattern(MongoIDPattern).error(httpError.BadRequest("شناسه وارد شده صحیح نمیباشد"))
})
module.exports = ObjectIdValidator