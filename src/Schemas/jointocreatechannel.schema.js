const { Schema, model } = require("mongoose");

let jointocreatechannel = new Schema({
  Guild: String,
  User: String,
  Channel: String,
});

module.exports = model("jointocreatechannel", jointocreatechannel);
