const path = require("path");
const crypto = require("crypto");
const multer = require("multer");


//  diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/image/upload");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, bytes) {
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({ storage: storage });

// Export upload variable

module.exports = upload;