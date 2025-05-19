const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  mainCategory: {
    type: String,
    required: true,
    trim: true
  },
  subCategories: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Category', categorySchema);
