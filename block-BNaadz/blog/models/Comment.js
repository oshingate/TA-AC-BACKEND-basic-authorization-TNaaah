let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let slugger = require('slug');

let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    title: { type: String, require: true },

    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
