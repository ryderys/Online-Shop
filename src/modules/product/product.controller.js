const autoBind = require("auto-bind");
const {StatusCodes} = require("http-status-codes")
const { listOfImagesFromRequest, setFeatures, deleteFileInPublic } = require("../../common/utils/functions");
const { ProductModel } = require("./product.model");
const { createProductSchema } = require("../../common/validations/product.validation");

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
        
    }

    async getAllProducts(req, res, next){
        try {
            const search = req?.query?.search || ""
            let products;
            if(search){
                products = await ProductModel.find({
                    $text: {
                        $search: new RegExp(search, "ig")
                    }
                })
            } else {
                products = await ProductModel.find({})
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

}


module.exports = {
    ProductController: new ProductController()
}