const autoBind = require("auto-bind");
const {StatusCodes} = require("http-status-codes")
const { listOfImagesFromRequest, setFeatures, deleteFileInPublic } = require("../../common/utils/functions");
const { ProductModel } = require("./product.model");
const httpError = require("http-errors")
const { createProductSchema } = require("../../common/validations/product.validation");
const ObjectIdValidator = require("../../common/validations/public.validations");
const FeaturesModel = require("../features/features.model");
const { CategoryModel } = require("../category/category.model");

class ProductController {
    constructor(){
        autoBind(this)
    }
    async addProduct(req, res, next){
        try {
            const images = listOfImagesFromRequest(req?.files || [], req.body.fileUploadPath)
            const productBody = await createProductSchema.validateAsync(req.body)
            let {title, summary, description, price, tags, count, category, features } = productBody;
            const supplier = req.user._id;

            
            const categoryFeatures = await this.getCategoryFeatures(category)
            const categoryFeaturesObject = this.convertFeaturesToObject(categoryFeatures);

            const validatedFeatures = this.validateFeatures(features, categoryFeaturesObject);

            const product = await ProductModel.create({
                title,
                summary,
                description,
                price,
                tags,
                count,
                supplier,
                images,
                features: validatedFeatures,
                category
            })
            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: "ثبت محصول با موفقیت انجام شد"
                }
            })

        } catch (error) {
            deleteFileInPublic(req?.body?.image) 
            console.error(error) 
            next(error)
        }
    }

    async editProductById(req, res, next){
        try {
            const {id} = req.params;
            const product = await this.findProductById(id)
            const updates = req.body;

            const images = listOfImagesFromRequest(req?.file || [], updates.fileUploadPath)
            if(images.length > 0){
                updates.images = images
            }
            if(updates.features){
                const categoryFeatures = await this.getCategoryFeatures(product.category)
                const categoryFeaturesObject = this.convertFeaturesToObject(categoryFeatures)
                updates.features = this.validateFeatures(updates.features, categoryFeaturesObject)
            }

            Object.assign(product, updates)
            await product.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "محصول با موفقیت ویرایش شد",
                    product
                }
            })
        } catch (error) {
            if (req?.files){
                deleteFileInPublic(req.files.map(file => file.path))
            }
            next(error)
        }


    }

    async getAllProducts(req, res, next){
        try {
            const search = req?.query?.search || ""
            let products;
            if(search){
                products = await ProductModel.find({
                    $text: {
                        $search: new RegExp(search, "ig")
                    }, 
                }, {__v: 0}).populate("category")
            } else {
                products = await ProductModel.find({}, {__v: 0}).populate([{path: "category"}])
            }
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    products
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getOneProductById(req, res, next){
        try {
            const {id} = req.params;
            const product = await this.findProductById(id)
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    product
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async removeProductById(req, res, next){
        try {
            const {id} = req.params;
            const product = await this.findProductById(id)
            const {deletedCount} = await ProductModel.deleteOne({_id: product._id})
            if(deletedCount == 0) throw new httpError.InternalServerError()
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "حذف محصول با موفقیت انجام شد"
                }
        })

        } catch (error) {
            next(error)
        }
    }


    async findProductById(productId){
        const {id} = await ObjectIdValidator.validateAsync({id: productId})
        const product = await ProductModel.findById(id)
        if(!product) throw new httpError.NotFound("محصولی یافت نشد")
        return product
    }

    async getCategoryFeatures(categoryId){
        const features = await FeaturesModel.find({category: categoryId})
        return features
    }
    convertFeaturesToObject(features) {
        return features.reduce((obj, feature) => {
            obj[feature.key] = feature;
            return obj;
        }, {});
    }
    validateFeatures(providedFeatures, categoryFeatures) {
        const validatedFeatures = {};
        for (const key in providedFeatures) {
            if (categoryFeatures[key]) {
                validatedFeatures[key] = providedFeatures[key];
            } else {
                throw new httpError.BadRequest(`Feature '${key}' is not valid for the selected category`);
            }
        }
        return validatedFeatures;
    }

}


module.exports = {
    ProductController: new ProductController()
}