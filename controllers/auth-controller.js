const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const handleErrors = require("../utils/error-handler");
const TokenBlackList = require("../models/token-blacklist-model");
require("dotenv").config();

const ACCESS_TOKEN_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

// array that stores the valid refresh token
let refreshTokens = [];

// Function to create token
const createToken = (id) => {
  // creating access token that expires after every 15m
  const accessToken = jwt.sign({ id }, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "60m",
  });

  // creating refresh token that expires each day
  const refreshToken = jwt.sign({ id }, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
};

// controller for registering users
module.exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const { accessToken, refreshToken } = createToken(user._id);
    const formattedUserObject = {
      id: user._id,
      emai: user.email,
    };
    res.status(201).json({
      ...formattedUserObject,
      "access-token": accessToken,
      "refresh-token": refreshToken,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// controller for logging users in
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) throw new Error("email is empty");
    if (!password) throw new Error("password is empty");
    const user = await User.login(email, password);
    const { accessToken, refreshToken } = createToken(user._id);

    // placing the refresh token inside the array
    refreshTokens.push(refreshToken);

    const formattedUserObject = {
      id: user._id,
      emai: user.email,
    };
    res.status(200).json({
      ...formattedUserObject,
      "access-token": accessToken,
      "refresh-token": refreshToken,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// controller for re-generating the access token
module.exports.regenerateToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "You are not authenticated" });

  if (!refreshTokens.includes(refreshToken))
    return res.status(403).json({ message: "Refresh token is not valid" });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, (err, decodedToken) => {
    if (err)
      return res.status(403).json({ error: "Refresh token is not valid" });

    // remove the earlier refresh token placed in the array
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const tokens = createToken(decodedToken.id);
    const newAccessToken = tokens.accessToken;
    const newRefreshToken = tokens.refreshToken;
    refreshTokens.push(newRefreshToken);
    return res.status(200).json({
      "access-token": newAccessToken,
      "refresh-token": newRefreshToken,
    });
  });
};

// controller for logging users out and update the tokenBlackList in the database
module.exports.logout = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken)
    return res.status(401).json({ message: "You are not authenticated" });

  try {
    await TokenBlackList.create({ token: accessToken });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.log("Error while logging out: ", err.message, err.code);
    if (err.code == 11000) {
      return res.status(400).json({ error: "Access Token already exists" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};