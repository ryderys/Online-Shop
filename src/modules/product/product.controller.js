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
        
            const images = req?.files?.map(image => image?.path?.slice(7));

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
            if(req?.files){
                req.files.forEach(file  => {
                    deleteFileInPublic(file.path.slice(7)) 
                })
            }
            console.error(error) 
            next(error)
        }
    }

    async editProductById(req, res, next){
        try {
            const {id} = req.params;
            const product = await this.findProductById(id)
            const updates = req.body;

            // If new images are uploaded, map their paths and delete old images
            if (req?.files?.length > 0) {
                const newImages = req.files.map(image => image.path.slice(7));
            
            // Delete old images
                if (product.images && product.images.length > 0) {
                    product.images.forEach(image => {
                        deleteFileInPublic(image);
                    });
                }
                updates.images = newImages;
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
                req.files.forEach(file  => {
                    deleteFileInPublic(file.path.slice(7)) 
                })
            }
            next(error)
        }


    }

    async getAllProducts(req, res, next){
        try {
            const search = req?.query?.search?.trim() || ""
            let matchStage = {}

            if(search){
                matchStage = {
                    $text: { $search: search}
                }
             } 

            const products = await ProductModel.aggregate([
                { $match: matchStage},
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {$unwind: "$category"},
                {
                    $addFields: {
                        likesCount: { $size: "$likes"},
                        commentsCount: { $size: "$comments"},
                    }
                },
                {
                    $project: {
                        _id: 0,
                    id: "$_id",
                    title: 1,
                    summary: 1,
                    description: 1,
                    price: 1,
                    count: 1,
                    images: 1,
                    tags: 1,
                    features: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    supplier: 1,
                    category: {
                        id: "$category._id",
                        title: "$category.title",
                        slug: "$category.slug",
                        icon: "$category.icon",
                        parent: "$category.parent",
                        children: "$category.children"
                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            },

            ])

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