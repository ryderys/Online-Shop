const autoBind = require("auto-bind");
const {StatusCodes} = require("http-status-codes")
const { listOfImagesFromRequest, setFeatures, deleteFileInPublic } = require("../../common/utils/functions");
const { ProductModel } = require("./product.model");

class ProductController {
    constructor(){
        autoBind(this)
    }
    async addProduct(req, res, next){
        try {
            console.log(req.body);
            const images = listOfImagesFromRequest(req?.file || [], req.body.fileUploadPath)
            const {title, summary, description, price, tags, count, category } = req.body;
            const supplier = "507f191e810c19729de860ea";
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