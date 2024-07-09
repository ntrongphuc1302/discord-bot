const { Schema, model } = require("mongoose");

let reminderSchema = new Schema({
  User: String,
  Time: String,
  Remind: String,
});

module.exports = model("reminders", reminderSchema);
