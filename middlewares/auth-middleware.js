const jwt = require("jsonwebtoken");
const TokenBlackList = require("../models/token-blacklist-model");
require("dotenv").config();

const JWT_ACCESS_TOKEN_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

const requireAuth = async (req, res, next) => {
  let headerToken = "Bearer " + req.cookies.accessToken;

  headerToken = headerToken.split(" ")[1];
  console.log("Header token: ", headerToken);

  // verifying token using jwt
  if (!headerToken || headerToken === "undefined")
    return res.status(401).json({ error: "You are not authenticated" });

  const isBlackListed = await TokenBlackList.exists({ token: headerToken });
  if (isBlackListed)
    return res.status(401).json({ error: "You are not authenticated" });

  jwt.verify(headerToken, JWT_ACCESS_TOKEN_SECRET_KEY, (err, decodedToken) => {
    if (err) return res.status(403).json({ error: "Token is not valid" });
    req.userId = decodedToken.id;
    next();
  });
};

module.exports = requireAuth;
