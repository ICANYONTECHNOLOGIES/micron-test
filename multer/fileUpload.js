const fs = require('fs');
const path = require('path');
const multer = require('multer');

// 🔧 Dynamic storage with folder creation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.body.mainCategory?.toLowerCase().replace(/\s+/g, '-');
    const uploadPath = path.join(__dirname, '../public/uploads', category);

    // Create the folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports= upload;