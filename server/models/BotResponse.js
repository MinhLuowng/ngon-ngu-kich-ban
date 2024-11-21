const mongoose = require('mongoose');

const BotResponseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BotResponse', BotResponseSchema);
