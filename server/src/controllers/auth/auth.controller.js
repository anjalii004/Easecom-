const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!(username || email || password)) {
      return res
        .json({
          success: false,
          message: "Please enter all fields",
        })
        .status(500);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.findOne({ email });
    if (user) {
      res
        .json({
          success: false,
          message: "User with this email already exists",
        })
        .status(400);
    }
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const createdUser = await User.findOne(newUser._id).select("-password");
    if (!createdUser)
      return res
        .status(500)
        .json({ success: false, message: "Failed to create user" });

    return res
      .json({
        success: true,
        message: "User registration successfully done",
      })
      .status(200);
  } catch (err) {
    console.log("Error Occured while creating a new USER !! ", err);
    res
      .json({
        success: false,
        message: "Couldn't create user",
      })
      .status(500);
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field.trim() === ""))
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      res.json({
        success: false,
        message: "User doesn't exists with this email !! Sign-up to conitnue",
      });

    // const isValidUser = await bcrypt.compare(password, user.password);
    // if (!isValidUser)
    //   res.json({ success: false, message: "Invalid Credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      "Siddharth@123",
      { expiresIn: "1d" }
    );
    res.cookie("token", token, { httpOnly: true, secure: false });
    res
      .json({
        success: true,
        message: "User signed-in successfully",
        user: {
          email: user.email,
          role: user.role,
          id: user._id,
          username: user.username,
        },
      })
      .status(200);
  } catch (err) {
    console.log("Error signing in the user, Please try again later");
    res
      .json({
        success: false,
        message: "Couldn't signed-in ",
        err,
      })
      .status(400);
    throw new Error("Couldn't signed-in ", err);
  }
};

// logout
const logout = (req, res) => {
  res.clearCookie("token").json({
    success: "true",
    message: "User logged out successfully",
  });
};

// middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
  try {
    const decodedToken = jwt.verify(token, "Siddharth@123");
    req.user = decodedToken;
    next();
  } catch (err) {
    console.log("Middleware error", err);
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = { register, login, logout, authMiddleware };
