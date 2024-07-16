const joi = require("joi")
const httpError = require("http-errors")

const getOtpSchema = joi.object({
    mobile: joi.string().length(11).pattern(/^09[0-9]{9}/).error(httpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد"))
})

const checkOtpSchema = joi.object({
    mobile: joi.string().length(11).pattern(/^09[0-9]{9}/).error(httpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
    code: joi.string().min(4).max(6).error(httpError.BadRequest("کد وارد شده صحیح نمیباشد"))
})

module.exports = {
    getOtpSchema,
    checkOtpSchema
}