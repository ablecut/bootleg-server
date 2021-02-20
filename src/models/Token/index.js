const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Token = mongoose.model('tokens', TokenSchema);

module.exports = Token;
