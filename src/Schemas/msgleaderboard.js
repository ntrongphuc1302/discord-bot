const { Schema, model } = require("mongoose");

let msgSchma = new Schema({
  Guild: String,
  User: String,
  Messages: Number,
});

module.exports = model("msgleaderboard", msgSchma);
