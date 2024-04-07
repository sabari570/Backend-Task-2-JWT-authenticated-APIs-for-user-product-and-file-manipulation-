const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
require("dotenv").config();

// Initialising the express app
const app = express();

const PORT = process.env.PORT || 3000;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const DBNAME = "authCRUDdB";

// For accessing json requests
app.use(express.json());

// Connecting to MongoDB and starting the server
const dbURI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@authcrudcluster.xskeskn.mongodb.net/${DBNAME}?retryWrites=true&w=majority&appName=AuthCRUDCluster`;
mongoose
  .connect(dbURI)
  .then((client) => {
    // Listening to PORT
    app.listen(PORT, () => console.log(`SERVER LISTENING TO PORT:${PORT}`));
  })
  .catch((err) => console.log("Mongoose connection errro: ", err));

app.use("/api", authRoutes);
