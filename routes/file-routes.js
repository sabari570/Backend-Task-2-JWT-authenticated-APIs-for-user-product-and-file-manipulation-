const { Router } = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const { uploadFile, downloadFile } = require("../controllers/file-controller");
const upload = require("../utils/file-storage-config");

const router = Router();

// route for uploading a file
router.post("/upload-file", authMiddleware, upload.single("file"), uploadFile);

// route for generating the download link
router.get('/download-file/:fileId', authMiddleware, downloadFile);

module.exports = router;
