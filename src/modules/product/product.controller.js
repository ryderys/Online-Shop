const autoBind = require("auto-bind");
const {StatusCodes} = require("http-status-codes")
const { listOfImagesFromRequest, setFeatures, deleteFileInPublic } = require("../../common/utils/functions");
const { ProductModel } = require("./product.model");
const httpError = require("http-errors")
const { createProductSchema } = require("../../common/validations/product.validation");
const ObjectIdValidator = require("../../common/validations/public.validations");

class ProductController {
    constructor(){
        autoBind(this)
    }
    async addProduct(req, res, next){
        try {
            const images = listOfImagesFromRequest(req?.file || [], req.body.fileUploadPath)
            const productBody = await createProductSchema.validateAsync(req.body)
            const {title, summary, description, price, tags, count, category } = productBody;
            const supplier = req.user._id;
            let features = setFeatures(req.body);
            const product = await ProductModel.create({
                title,
                summary,
                description,
                price,
                tags,
                count,
                supplier,
                images,
                features,
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
                updates.features = setFeatures(updates.features)
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
                products = await ProductModel.find({}, {__v: 0}).populate([{path: "category", select: {name: 1, slug: 1}}])
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

}


module.exports = {
    ProductController: new ProductController()
}