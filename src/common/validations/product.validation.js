const joi = require("joi");
const httpError = require("http-errors")
 const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
const createProductSchema = joi.object({
    title: joi.string().min(3).max(30).error(httpError.BadRequest("عنوان ارسال شده صحیح نمیباشد")),
    description: joi.string().error(httpError.BadRequest("متن ارسال شده صحیح نمیباشد")),
    summary: joi.string().error(httpError.BadRequest("متن ارسال شده صحیح نمیباشد")),
    tags: joi.array().min(0).max(10).error(httpError.BadRequest("برچسب ها نمیتواند بیشتر از 10 آیتم باشد")),
    colors: joi.array().error(httpError.BadRequest("رنگ انتخابی صحیح نمیباشد")),
    category: joi.string().error(httpError.BadRequest("دسته بندی صحیح نمیباشد")),
    price: joi.number().error(httpError.BadRequest("قیمت وارد شده صحیح نمیباشد")),
    count: joi.number().error(httpError.BadRequest("تعداد وارد شده صحیح نمیباشد")),
    length: joi.number().allow(null, 0).error(httpError.BadRequest("طول وارد شده صحیح نمیباشد")),
    height: joi.number().allow(null, 0).error(httpError.BadRequest("ارتفاع وارد شده صحیح نمیباشد")),
    width: joi.number().allow(null, 0).error(httpError.BadRequest("عرض وارد شده صحیح نمیباشد")),
    images: joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg)$/).error(httpError.BadRequest("فرمت تصویر ارسال شده صحیح نمیباشد")),
    fileUploadPath: joi.allow()
})

module.exports = {
    createProductSchema
}