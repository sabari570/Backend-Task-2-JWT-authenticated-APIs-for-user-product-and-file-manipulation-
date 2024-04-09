const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const productRoutes = require("./routes/product-routes");
const fileRoutes = require("./routes/file-routes");
const path = require("path");
const { DBNAME } = require("./constants/constants");
require("dotenv").config();

// Initialising the express app
const app = express();

const PORT = process.env.PORT || 3000;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

// For accessing json requests
app.use(express.json());
// code to access the files uploaded to server
app.use('/uploaded-files', express.static(path.join(__dirname, 'uploaded-files')));

// Connecting to MongoDB and starting the server
const dbURI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@authcrudcluster.xskeskn.mongodb.net/${DBNAME}?retryWrites=true&w=majority&appName=AuthCRUDCluster`;
mongoose
  .connect(dbURI)
  .then((client) => {
    // Listening to PORT
    app.listen(PORT, () => console.log(`SERVER LISTENING TO PORT:${PORT}`));
  })
  .catch((err) => console.log("Mongoose connection errro: ", err));

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/file', fileRoutes);
