const joi = require("joi")
const httpError = require("http-errors")
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
const createCategorySchema = joi.object({
    title: joi.string().min(3).max(30).error(httpError.BadRequest("نام دسته بندی صحیح نمیباشد")),
    slug: joi.string().error(httpError.BadRequest("نام اسلاگ صحیح نمیباشد")),
    icon: joi.string().error(httpError.BadRequest("تصویر دسته بندی صحیح نمیباشد")),
    title: joi.string().min(3).max(30).error(httpError.BadRequest("نام دسته بندی صحیح نمیباشد")),
    parent: joi.string().optional().pattern(MongoIDPattern).error(httpError.BadRequest("شناسه ارسال شده صحیح نمیباشد")),
    parents: joi.string().pattern(MongoIDPattern).error(httpError.BadRequest("شناسه ارسال شده صحیح نمیباشد"))

})

module.exports = {
    createCategorySchema
}
