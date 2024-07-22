const { default: mongoose, Schema, Types } = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productID: {type: Schema.Types.ObjectId, ref: "Product"},
    count: {type: Number, default: 1}
})
const OTPSchema = new Schema({
    code: {type: String, required: false, default: undefined},
    expiresIn: {type: Number, required: false, default: 0},
})

const UserSchema = new mongoose.Schema({
    fullName: {type: String, trim: true},
    username: {type: String, lowercase: true, trim: true},
    email: {type: String, lowercase: true, trim: true},
    password: {type: String},
    mobile: {type: String, required: true, unique: true},
    verifiedMobile: {type: Boolean, default: false, required: true},
    accessToken: {type: String}, //should not be saved
    otp: {type: OTPSchema },
    cart: {type: Schema.Types.ObjectId, ref: "Cart" },
    savedItems: {type: Schema.Types.ObjectId, ref: "SavedItems" },
    products: {type: [ Schema.Types.ObjectId], ref: 'Product', default: []}
}, {
    toJSON: {
        virtuals: true
    },
    timestamps: {createdAt: true, updatedAt: true}
})

UserSchema.index({fullName: "text", username: "text", mobile: "text", email: "text"})

UserSchema.pre('save', function(next){
    this.updatedAt = Date.now();
    next()
})

module.exports = {
    UserModel: mongoose.model("User", UserSchema)
}