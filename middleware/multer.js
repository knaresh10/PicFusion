const multer = require('multer');
const {v4 : uuidv4} = require('uuid');
const path = require('path')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
module.exports = {
  upload,
};