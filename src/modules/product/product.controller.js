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
            const images = listOfImagesFromRequest(req?.file || [], req.body.filleUploadPath)
            const {title, summary, description, price, tags, count, category } = req.body;
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
            deleteFileInPublic(req.body.image)  
            next(error)
        }
    }

}


module.exports = {
    ProductController: new ProductController()
}