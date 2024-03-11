const multer = require('multer');
const {v4 : uuidv4} = require('uuid');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb) {
      const unique = uuidv4();
      cb(null, unique + path.extname(file.originalname));
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload;

// const multer = require('multer');
// const path = require('path');

// // Set up Multer storage
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     // Specify the destination folder where uploaded images will be saved
//     cb(null, 'public/images'); // The 'public' folder should already exist
//   },
//   filename: function(req, file, cb) {
//     // Generate a unique name for the uploaded file
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Initialize Multer upload with the configured storage
// const upload = multer({ storage: storage });

// module.exports = upload;
