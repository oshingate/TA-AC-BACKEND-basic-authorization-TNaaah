let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  city: String,
  fullName: String,
});

userSchema.pre('save', function (next) {
  this.fullName = this.firstName + ' ' + this.lastName;
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);

      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
});

userSchema.methods.matchPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

let User = mongoose.model('User', userSchema);

module.exports = User;
