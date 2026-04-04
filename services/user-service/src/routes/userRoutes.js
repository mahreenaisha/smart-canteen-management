const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");

router.get("/me", authMiddleware, getProfile);

const { updateUser } = require("../controllers/userController");

router.put("/me", authMiddleware, updateUser);

module.exports = router;