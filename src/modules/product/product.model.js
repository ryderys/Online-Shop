const {default: mongoose, Schema} = require("mongoose")

// const AnswerSchema = new mongoose.Schema({
//     user : {type : mongoose.Types.ObjectId, ref: "User", required: true},
//     comment: {type: String, required: true},
//     show: {type: Boolean, required: true, default: false},
//     openToComment: {type: Boolean, default: false}
// }, {
//     timestamps : {createdAt: true}
// })

// const CommentSchema = new mongoose.Schema({
//     user : {type : mongoose.Types.ObjectId, ref: "User",},
//     comment: {type: String},
//     show: {type: Boolean, default: false},
//     openToComment : {type: Boolean, default: true},
//     answers : {type: [AnswerSchema], default: []},
// }, {
//     timestamps : {createdAt: true}
// })

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    summary: {type: String, required: true},
    description: {type: String, required: true},
    tags: {type: [String], required: true},
    category: {type: String,},
    price: {type: Number, required: true, default: 0},
    count: {type: Number},
    images: {type: [String], required: true},
    // comments: {type: [CommentSchema], default: []},
    // likes: {type: [Schema.Types.ObjectId], ref: 'User', default: []},
    supplier: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    features: {type: Object, default: {
        length: "",
        height: "",
        width: "",
        colors: [],
        madeIn: "",
    }}
})
ProductSchema.index({title : "text", summary : "text", description : "text"})

module.exports = {
    ProductModel : mongoose.model("Product", ProductSchema)
}