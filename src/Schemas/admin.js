const { Schema, model } = require("mongoose");

let admin = new Schema({
  Guild: String,
  User: String,
});

module.exports = model("admin", admin);
