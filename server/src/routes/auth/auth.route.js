const express = require("express");
const {
  register,
  login,
  logout,
  authMiddleware,
} = require("../../controllers/auth/auth.controller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  if(!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
  res.status(200).json({
    success: true,
    message: "Authenticated User",
    user,
  });
});

module.exports = router;
