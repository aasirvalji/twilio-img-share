const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["jpeg", "jpg", "png"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", UrlSchema);
