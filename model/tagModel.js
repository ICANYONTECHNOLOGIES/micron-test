const mongoose = require("mongoose");

// Define the Tag schema
const tagSchema = new mongoose.Schema({
  productTag: {
    type: String,
    required: true,
    trim: true, // Remove any extra spaces from the tag name
    maxlength: 50, // Optional, adjust max length as needed
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the date when the tag is created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the date when the tag is updated
  },
});

// Create and export the Tag model
const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
