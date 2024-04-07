const { Router } = require("express");
const { login, regenerateToken, register, logout } = require("../controllers/auth-controller");

const router = Router();

// route for registering user
router.post('/register', register );

// route for logging users in
router.post('/login', login);

// route for re-generating token
router.post('/regenerate-token', regenerateToken );

// route for logging users out
router.post('/logout', logout);

module.exports = router;