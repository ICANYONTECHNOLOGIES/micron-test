const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  p_name: {
    type: String,
    required: true,
    trim: true
  },
  p_code: {
    type: String,
    required: true,
    unique: true
  },
  product_tag: {
    type: String,
    trim: true
  },
  p_category: {
    type: String,
    required: true
  },
  p_subcategory: {
    type: String,
    required: true
  },
  p_description: {
    type: String,
    trim: true
  },
  feature_title: {
    type: String,
    trim: true
  },
  feature_points: {
    type: [String], // ✅ Changed to array of strings
    default: []
  },
  product_image_url: {
    type: String // Store full URL or relative path to image
  },
  product_pdf_url: {
    type: String // Store full URL or relative path to PDF
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
