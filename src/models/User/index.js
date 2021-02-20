const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('users', UserSchema);

UserSchema.virtual('tokens', {
  ref: 'tokens',
  localField: '_id',
  foreignField: 'owner'
});

module.exports = User;