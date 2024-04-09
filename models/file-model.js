const mongoose = require("mongoose");

const fileDetailSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please provide the user id"],
    ref: "user",
  },
  files: [
    {
      _id: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
      },
      fileName: {
        type: String,
        required: [true, "Please enter the file name"],
      },
      filePath: {
        type: String,
      },
    },
  ],
});

const FileDetailModel = mongoose.model("fileDetail", fileDetailSchema);

module.exports = FileDetailModel;
