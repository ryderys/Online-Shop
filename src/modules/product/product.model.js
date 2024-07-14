const {default: mongoose, Schema} = require("mongoose")
const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true, default: 0},
    count: {type: Number},
    images: {type: [String], required: true},
    supplier: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    features: {type: Object, default: {
        length: "",
        height: "",
        width: "",
        colors: [],
        madeIn: "",
    }}
})

module.exports = {
    ProductModel : mongoose.model("Product", ProductSchema)
}