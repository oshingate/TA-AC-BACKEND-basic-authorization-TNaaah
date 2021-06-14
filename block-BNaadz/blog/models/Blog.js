let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let slugger = require('slug');

let Schema = mongoose.Schema;

let blogSchema = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  this.slug = slugger(this.title);
  if (!this.likes) {
    this.likes = 0;
  }
  next();
});

let Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
