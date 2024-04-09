const multer = require("multer");

// multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploaded-files");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now().toString() + "-" + file.originalname;
    cb(null, fileName);
  },
});

// defining the type of file and file size acceptable
const upload = multer({
  storage: storage,
  limits: {
    // limiting file size to 5MB
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["application/pdf"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.statusMessage = "Invalid file type. Only PDF files are acceptable";
      cb(null, false);
    }
  },
});

module.exports = upload;
