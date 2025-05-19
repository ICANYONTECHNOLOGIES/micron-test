const multer = require('multer');
const path = require('path');

// Save to a temporary folder first
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/product'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const uploadProduct = multer({ storage: tempStorage });

module.exports = uploadProduct;
