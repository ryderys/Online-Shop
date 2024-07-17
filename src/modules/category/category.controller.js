const autoBind = require("auto-bind");
const httpError = require("http-errors")
const {StatusCodes} = require("http-status-codes");
const { CategoryModel } = require("./category.model");
const { isValidObjectId, model, Types, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

class CategoryController{
    constructor(){
        autoBind(this)
    }

    async createCategory(req, res, next){
        try {
            const {title, icon, slug: slugInput, parent} = req.body;
            let parents = []

            if(parent && isValidObjectId(parent)){
                const existCategory = await this.checkExistCategoryById(parent)
                parent = existCategory._id;
                parents = [
                    ... new Set(
                        ([existCategory._id.toString()].concat(
                            existCategory.parents.map(id => id.toString())
                        )).map(id => new Schema.Types.ObjectId(id))
                    )
                ]
            }

            let slug = slugInput ? slugify(slugInput) : slugify(title)
            await this.checkCategorySlugUniqueness(slug)
            
            const category = await CategoryModel.create({title, icon, slug, parent})
            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: "دسته بندی با موفقیت ایجاد شد",
                    category
                }
            })
        } catch (error) {
            console.error(error)
            next(error)
        }
    }

    async getAllCategory(req, res, next){
        try {
            const categories = await CategoryModel.find({parent: {$exists: false}})

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    categories
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async deleteCategoryById(req, res, next){
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                throw new httpError.BadRequest("شناسه دسته بندی نامعتبر است");
            }
            await this.checkExistCategoryById(id)
            await CategoryModel.deleteMany({parent: id})
            await CategoryModel.findByIdAndDelete(id)
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "دسته بندی حذف شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async checkExistCategoryById(id){
        const category = await CategoryModel.findById(id)
        if(!category) throw new httpError.NotFound("دسته بندی بافت نشد")
        return category
    }
    
    async checkCategorySlugUniqueness(slug) {
        const category = await CategoryModel.findOne({ slug });
        if (category) throw new httpError.Conflict("دسته بندی با این نام قبلاً ثبت شده است");
        return null;
    }
}

module.exports = new CategoryController()