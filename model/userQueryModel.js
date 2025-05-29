const mongoose = require('mongoose');

const userQuerySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const UserQuery = mongoose.model('UserQuery', userQuerySchema);

module.exports = UserQuery;
