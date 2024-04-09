const mongoose = require("mongoose");
const FileDetailModel = require("../models/file-model");
const { BASE_URL } = require("../constants/constants");

// controller for uploading a file
module.exports.uploadFile = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);
  try {
    if (req.statusMessage)
      throw { statusCode: 415, message: req.statusMessage };

    if (!req.file) throw { statusCode: 400, message: "No file uploaded" };

    const fileId = new mongoose.Types.ObjectId();
    const fileName = req.file.originalname;
    const filePath = req.file.path;
    const fileObject = {
      _id: fileId,
      fileName,
      filePath,
    };

    let fileDetails = await FileDetailModel.findOne({ userId });

    if (fileDetails) {
      await FileDetailModel.updateOne(
        { userId },
        {
          $push: { files: fileObject },
        }
      );
    } else {
      await FileDetailModel.create({
        userId,
        files: [fileObject],
      });
    }
    return res.status(201).json({
      message: "File uploaded successfully",
      link: `${BASE_URL + filePath}`,
    });
  } catch (err) {
    console.log("Error while uploading a file: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// controller for downloading a file by the given file id
module.exports.downloadFile = async (req, res) => {
  const userId = req.userId;
  try {
    const { fileId } = req.params;

    const fileDetails = await FileDetailModel.findOne({ userId });
    if (!fileDetails) throw { statusCode: 404, message: "File not found" };

    const files = fileDetails.files.find(
      (file) => file._id.toString() === fileId
    );
    if (!files) throw { statusCode: 404, message: "File not found" };

    const filePath = files.filePath;
    return res.download(filePath, (err) => {
      if (err) {
        return res.status(404).json({ error: "File not found" });
      }
    });
  } catch (err) {
    console.log("Error while downloading a file: ", err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
