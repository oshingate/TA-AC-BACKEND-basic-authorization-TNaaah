let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let itemSchema = new Schema({
  name: { type: String, require: true },
  quantity: { type: Number, require: true },
  price: { type: Number, require: true },
  image: { type: String },
  tags: String,
  category: [{ type: String }],
  likes: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

itemSchema.pre('save', function (next) {
  let newArr = this.tags.split(',');
  this.category = newArr.map((ele) => {
    return ele.trim();
  });
  next();
});

let Item = mongoose.model('Item', itemSchema);

module.exports = Item;
