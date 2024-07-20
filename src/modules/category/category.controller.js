const autoBind = require("auto-bind");
const httpError = require("http-errors")
const {StatusCodes} = require("http-status-codes");
const { CategoryModel } = require("./category.model");
const { isValidObjectId, Types ,Schema, Mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const { createCategorySchema } = require("../../common/validations/category.validation");
const FeaturesModel = require("../features/features.model");

class CategoryController{
    constructor(){
        autoBind(this)
    }

    async createCategory(req, res, next){
        try {
            const validatedCategory = await createCategorySchema.validateAsync(req.body)
            let {title, icon, slug, parent} = validatedCategory;
            let parents

            if(parent && isValidObjectId(parent)){
                const existCategory = await this.checkExistCategoryById(parent)
                parent = existCategory._id;
                parents = [
                    ...new Set(
                        ([existCategory._id.toString()].concat(
                            existCategory.parents.map(id => id.toString())
                        )).map(id => new Types.ObjectId(id))
                    )
                ]
            }
            if(validatedCategory?.slug){
                slug = slugify(slug)
                await this.checkCategorySlugUniqueness(slug)
            }else {
                slug = slugify(title)
            }
            const category = await CategoryModel.create({title, icon, slug, parent, parents})
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
            await this.deleteCategoryAndChildren(id)
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

    async deleteCategoryAndChildren(categoryId){
        const category = await this.checkExistCategoryById(categoryId)
        if(category){
            const subCategories = await CategoryModel.find({parent: categoryId})
            for (const subCategory of subCategories) {
                await this.deleteCategoryAndChildren(subCategory._id)
            }
            await FeaturesModel.deleteMany({category: categoryId})
            await CategoryModel.deleteOne({_id: categoryId})
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