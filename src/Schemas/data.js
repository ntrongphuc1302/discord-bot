const { Schema, model } = require("mongoose");

let dataSchema = new Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  birthday: { type: Date },
});

module.exports = model("Data", dataSchema);
