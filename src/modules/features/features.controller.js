const autoBind = require("auto-bind");
const { checkExistCategoryById } = require("../category/category.controller");
const { default: slugify } = require("slugify");
const httpError = require("http-errors")
const FeaturesModel = require("./features.model");
const { StatusCodes } = require("http-status-codes");
const { createFeatureSchema } = require("../../common/validations/features.validation");

class featuresController{
    constructor() {
        autoBind(this)
    }
    async addFeature(req, res, next){
        try {
            const featureBody = await createFeatureSchema.validateAsync(req.body)
            let {title, key, type,  list, guid, category} = featureBody;

            category = await checkExistCategoryById(category)
            category = category._id;

            key = slugify(key, {trim: true, replacement: "_", lower: true})

            await this.alreadyExistByCategoryAndKey(key, category)
            
            if(list && typeof list === "string"){
                list = list.split(",")
            }else if (!Array.isArray(list)) list = [];
            
            const feature = await FeaturesModel.create({title, key , type, list , guid, category})
            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: "feature created successfully"
                }
            })
        } catch (error) {
            console.error(error)
            next(error)
        }
    }

    async findAllFeatures(req, res, next){
       try {
        let features = await FeaturesModel.find({}, {__v: 0}, {sort: {_id: -1}}).populate({path: "category", select: "name slug"}).lean()
        features = features.map(features => {
            if (features.category){
                delete features.category.children
            }
            return features
        })
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                features
            }
        })
       } catch (error) {
            next(error)
       }

    }

    async findFeatureByCategoryId(req, res, next){
        const {categoryId} = req.params
        const feature = await FeaturesModel.find({category: categoryId},{__v: 0}).populate({path: "category", select: "name slug"})
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                feature
            }
        })
    }

    async findByCategorySlug(slug){
        
    }
    
    async removeFeatureById(req, res, next){
        try {
            const {id} = req.params;
            await this.checkExistById(id)
            await FeaturesModel.deleteOne({_id: id})
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "feature deleted successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }



    async checkExistById(id){
        const features = await FeaturesModel.findById(id)
        if(!features) throw new httpError.NotFound("option not found")
        return features
    }

    async alreadyExistByCategoryAndKey(key, category, exceptionId = null){
        try {
            const isExist = await FeaturesModel.findOne({category, key, _id: {$ne: exceptionId}})
            if(isExist) throw new httpError.Conflict("feature already exist")
        } catch (error) {
            throw error
        }
    }
}
module.exports = new featuresController()