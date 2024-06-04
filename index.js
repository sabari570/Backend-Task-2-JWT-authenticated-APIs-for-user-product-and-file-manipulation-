const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const taskRoutes = require("./routes/task-routes.js");
const fileRoutes = require("./routes/file-routes");
const path = require("path");
const { notFound } = require("./utils/error-handler.js");
const { DBNAME } = require("./constants/constants");
require("dotenv").config();

// Initialising the express app
const app = express();

const PORT = process.env.PORT || 3000;

// For accessing json requests
app.use(express.json());
app.use(bodyParser.json());
// middleware for using cookies
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Check if the request origin is allowed
      if (!origin || origin === "http://localhost:5173") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(express.urlencoded({ extended: true }));
// code to access the files uploaded to server
app.use(
  "/uploaded-files",
  express.static(path.join(__dirname, "uploaded-files"))
);

// Connecting to MongoDB and starting the server
const dbURI = `mongodb://localhost:27017/${DBNAME}`;
mongoose
  .connect(dbURI)
  .then((client) => {
    // Listening to PORT
    app.listen(PORT, () => console.log(`SERVER LISTENING TO PORT:${PORT}`));
  })
  .catch((err) => console.log("Mongoose connection errro: ", err));

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/file", fileRoutes);

app.use(notFound);
