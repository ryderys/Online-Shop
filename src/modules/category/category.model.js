const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  title: { type: String ,required: true ,unique: true },
  slug: {type: String, required: true, index: true},
  icon: {type: String},
  parent: {type: Schema.Types.ObjectId, ref: 'Category', required: false},
  parents: {type: [Schema.Types.ObjectId], required: false, default: []},
}, {
  versionKey: false, id: false, toJSON: {
    virtuals: true,
    versionKey: false
  }
});

CategorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent"
})

function autoPopulate(next){
  this.populate([{path: "children"}])
  next()
}

CategorySchema.pre("find", autoPopulate).pre("findOne", autoPopulate)

CategorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const CategoryModel = mongoose.model('Category', CategorySchema);
module.exports = {
  CategoryModel
}
